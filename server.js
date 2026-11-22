/**
 * Market.com - Backend Server
 * Express Server with Supabase, Paymob, Stripe, Webhooks, Admin Auth, and Telegram Notifications
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Security configuration must be set before the server starts.
function requireEnvironment(name) {
    const value = process.env[name];
    if (!value || !value.trim()) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}

const ADMIN_USERNAME = requireEnvironment('ADMIN_USERNAME');
const ADMIN_PASSWORD = requireEnvironment('ADMIN_PASSWORD');
const JWT_SECRET = requireEnvironment('ADMIN_JWT_SECRET');
if (ADMIN_PASSWORD.length < 16) {
    throw new Error('ADMIN_PASSWORD must contain at least 16 characters');
}
if (JWT_SECRET.length < 32) {
    throw new Error('ADMIN_JWT_SECRET must contain at least 32 characters');
}

const supabaseService = require('./services/supabase');
const paymobService = require('./services/paymob');
const stripeService = require('./services/stripe');
const telegramService = require('./services/telegram');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Enable CORS for all origins
app.use(cors());

// 2. Stripe Webhook needs RAW body for HMAC signature verification
app.post(
    '/api/webhooks/stripe',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            event = stripeService.constructWebhookEvent(req.body, sig);
        } catch (err) {
            console.error('❌ [Stripe Webhook] Signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        console.log(`📩 [Stripe Webhook] Received event: ${event.type}`);

        try {
            if (
                event.type === 'checkout.session.completed' ||
                event.type === 'payment_intent.succeeded'
            ) {
                const session = event.data.object;
                const orderNumber = session.metadata?.order_number;
                const paymentId = session.payment_intent || session.id;

                if (orderNumber) {
                    console.log(`✅ [Stripe Webhook] Order #${orderNumber} marked as PAID`);
                    const result = await supabaseService.updateOrderStatus(orderNumber, 'paid', {
                        payment_id: paymentId,
                        payment_gateway: 'stripe',
                        payment_data: session
                    });

                    if (result.order) {
                        await telegramService.notifyOrderPaid(result.order);
                    }
                }
            }
            res.json({ received: true });
        } catch (err) {
            console.error('❌ [Stripe Webhook] Processing error:', err);
            res.status(500).json({ error: err.message });
        }
    }
);

// 3. Regular body parsers for all other endpoints
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Serve static frontend assets
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR, { dotfiles: 'deny' }));

// Admin route alias
app.get('/admin', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'admin', 'index.html'));
});

// ====================================================================
// Authentication Middleware for Admin
// ====================================================================
function requireAdmin(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, message: 'غير مصرح لك بالدخول، يرجى تسجيل الدخول أولاً' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول' });
    }
}

// ====================================================================
// Public APIs: Config & Products
// ====================================================================
app.get('/api/config', (req, res) => {
    res.json({
        stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
        paymobConfigured: paymobService.isConfigured(),
        stripeConfigured: stripeService.isConfigured(),
        supabaseConfigured: supabaseService.isConfigured,
        currency: 'EGP'
    });
});

// ====================================================================
// Orders API: Create & Track
// ====================================================================
app.post('/api/orders', async (req, res) => {
    try {
        const orderData = req.body;
        if (!orderData || !orderData.items || orderData.items.length === 0) {
            return res.status(400).json({ success: false, message: 'بيانات الطلب غير مكتملة أو السلة فارغة' });
        }

        // Generate unique order number: ORD-YYYYMMDD-XXXX
        const datePrefix = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        orderData.order_number = orderData.order_number || `ORD-${datePrefix}-${randomSuffix}`;

        const result = await supabaseService.createOrder(orderData);

        // If Cash on Delivery (COD), notify admin immediately
        if (orderData.payment_method === 'cod') {
            await telegramService.notifyOrderPaid(result.order);
        }

        res.json({
            success: true,
            order: result.order,
            message: 'تم تسجيل الطلب بنجاح'
        });
    } catch (err) {
        console.error('❌ [API /orders] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/orders/:orderNumber', async (req, res) => {
    try {
        const order = await supabaseService.getOrderByNumber(req.params.orderNumber);
        if (!order) {
            return res.status(404).json({ success: false, message: 'الطلب غير موجود' });
        }
        res.json({ success: true, order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ====================================================================
// Checkout APIs: Paymob & Stripe Initiators
// ====================================================================
app.post('/api/checkout/paymob', async (req, res) => {
    try {
        const { order, paymentSubtype } = req.body;
        if (!order) {
            return res.status(400).json({ success: false, message: 'بيانات الطلب مطلوبة' });
        }

        // Save initial order in Supabase
        const dbResult = await supabaseService.createOrder({
            ...order,
            payment_gateway: 'paymob',
            payment_method: paymentSubtype || 'paymob_card',
            payment_status: 'pending'
        });

        const session = await paymobService.createCheckoutSession(dbResult.order, paymentSubtype);
        res.json({
            success: true,
            orderNumber: dbResult.order.order_number,
            ...session
        });
    } catch (err) {
        console.error('❌ [API /checkout/paymob] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/checkout/stripe', async (req, res) => {
    try {
        const { order } = req.body;
        if (!order) {
            return res.status(400).json({ success: false, message: 'بيانات الطلب مطلوبة' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Save initial order in Supabase
        const dbResult = await supabaseService.createOrder({
            ...order,
            payment_gateway: 'stripe',
            payment_method: 'stripe',
            payment_status: 'pending'
        });

        const session = await stripeService.createCheckoutSession(dbResult.order, baseUrl);
        res.json({
            success: true,
            orderNumber: dbResult.order.order_number,
            ...session
        });
    } catch (err) {
        console.error('❌ [API /checkout/stripe] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// ====================================================================
// Paymob Webhook: Transaction Processed Callback
// ====================================================================
app.post('/api/webhooks/paymob', async (req, res) => {
    try {
        const queryHmac = req.query.hmac || req.headers['hmac'];
        const callbackData = req.body;

        console.log('📩 [Paymob Webhook] Received callback data');

        const isValid = paymobService.verifyHmac(callbackData, queryHmac);
        if (!isValid) {
            console.error('❌ [Paymob Webhook] Invalid HMAC signature');
            return res.status(400).send('Invalid signature');
        }

        const obj = callbackData.obj || callbackData;
        const isSuccess = obj.success === true || obj.success === 'true';
        const orderNumber = obj.order?.merchant_order_id || obj.merchant_order_id;
        const transactionId = obj.id;

        if (isSuccess && orderNumber) {
            console.log(`✅ [Paymob Webhook] Transaction #${transactionId} succeeded for order #${orderNumber}`);
            const result = await supabaseService.updateOrderStatus(orderNumber, 'paid', {
                payment_id: String(transactionId),
                payment_gateway: 'paymob',
                payment_data: obj
            });

            if (result.order) {
                await telegramService.notifyOrderPaid(result.order);
            }
        } else if (orderNumber) {
            console.log(`⚠️ [Paymob Webhook] Transaction failed for order #${orderNumber}`);
            await supabaseService.updateOrderStatus(orderNumber, 'failed', {
                payment_id: String(transactionId),
                payment_gateway: 'paymob',
                payment_data: obj
            });
        }

        res.status(200).json({ status: 'success' });
    } catch (err) {
        console.error('❌ [Paymob Webhook] Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ====================================================================
// Admin APIs: Login, Orders, Stats
// ====================================================================
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const defaultUser = ADMIN_USERNAME;
        const defaultPass = ADMIN_PASSWORD;

        // Check credentials against env or Supabase admin_users
        let authenticated = false;
        let adminData = { username: defaultUser, role: 'admin' };

        if (username === defaultUser && password === defaultPass) {
            authenticated = true;
        } else if (supabaseService.supabase) {
            const { data, error } = await supabaseService.supabase
                .from('admin_users')
                .select('*')
                .eq('username', username)
                .single();

            if (!error && data) {
                const match = await bcrypt.compare(password, data.password_hash);
                if (match) {
                    authenticated = true;
                    adminData = { username: data.username, role: data.role || 'admin', fullName: data.full_name };
                }
            }
        }

        if (!authenticated) {
            return res.status(401).json({ success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
        }

        const token = jwt.sign(adminData, JWT_SECRET, { expiresIn: '7d' });
        res.json({
            success: true,
            token,
            admin: adminData,
            message: 'تم تسجيل الدخول بنجاح'
        });
    } catch (err) {
        console.error('❌ [API /admin/login] Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/admin/orders', requireAdmin, async (req, res) => {
    try {
        const { status, search, limit } = req.query;
        const result = await supabaseService.getAdminOrders({
            status,
            search,
            limit: limit ? parseInt(limit, 10) : 100
        });

        res.json({
            success: true,
            orders: result.orders,
            total: result.count
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
        const stats = await supabaseService.getAdminStats();
        res.json({ success: true, stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.patch('/api/admin/orders/:orderNumber', requireAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const { orderNumber } = req.params;

        const result = await supabaseService.updateOrderStatus(orderNumber, status);
        res.json({ success: true, order: result.order });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Fallback for SPA routing to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// ====================================================================
// Start Server
// ====================================================================
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Market.com Server running on: http://localhost:${PORT}`);
    console.log(`👑 Admin Dashboard: http://localhost:${PORT}/admin`);
    console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
    console.log(`🔔 Telegram Bot: ${process.env.TELEGRAM_BOT_TOKEN ? 'Enabled' : 'Disabled (Set in .env)'}`);
    console.log(`💳 Paymob Gateway: ${paymobService.isConfigured() ? 'Connected' : 'Simulation Mode'}`);
    console.log(`💳 Stripe Gateway: ${stripeService.isConfigured() ? 'Connected' : 'Simulation Mode'}`);
    console.log(`🗄️ Supabase DB: ${supabaseService.isConfigured ? 'Connected' : 'In-Memory Fallback'}`);
    console.log(`====================================================`);
});
