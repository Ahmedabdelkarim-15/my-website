/**
 * Supabase Client & Database Services for Market.com
 * Handles orders storage, status updates, admin auth, and real-time synchronization.
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

let supabase = null;
const isConfigured = Boolean(
    supabaseUrl &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseServiceKey &&
    supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY'
);

if (isConfigured) {
    try {
        supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false
            }
        });
        console.log('✅ [Supabase] Connected successfully to:', supabaseUrl);
    } catch (e) {
        console.error('❌ [Supabase] Initialization error:', e.message);
    }
} else {
    console.warn('⚠️ [Supabase] Credentials not provided or using placeholders in .env.');
}

// In-Memory fallback store for seamless local testing if DB keys are not yet configured
const inMemoryOrders = new Map();

/**
 * Create a new order in Supabase
 * @param {object} orderData
 */
async function createOrder(orderData) {
    const formattedOrder = {
        order_number: orderData.order_number || `ORD-${Date.now().toString().slice(-6)}`,
        customer_name: orderData.customer_name || 'عميل المتجر',
        customer_phone: orderData.customer_phone || '',
        customer_address: orderData.customer_address || '',
        city: orderData.city || 'القاهرة',
        items: orderData.items || [],
        subtotal: Number(orderData.subtotal || 0),
        discount: Number(orderData.discount || 0),
        shipping: Number(orderData.shipping || 0),
        grand_total: Number(orderData.grand_total || 0),
        currency: orderData.currency || 'EGP',
        payment_method: orderData.payment_method || 'cod',
        payment_status: orderData.payment_status || 'pending',
        payment_gateway: orderData.payment_gateway || 'cod',
        payment_id: orderData.payment_id || null,
        payment_data: orderData.payment_data || {},
        promo_code: orderData.promo_code || null,
        notes: orderData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([formattedOrder])
                .select()
                .single();

            if (error) {
                console.error('❌ [Supabase] Error inserting order:', error);
                throw error;
            }
            return { success: true, order: data };
        } catch (err) {
            console.error('⚠️ [Supabase] Insert failed, falling back to local memory:', err.message);
        }
    }

    // Fallback store
    inMemoryOrders.set(formattedOrder.order_number, formattedOrder);
    return { success: true, order: formattedOrder, isMock: true };
}

/**
 * Update payment status of an order
 * @param {string} orderNumber
 * @param {string} status ('paid' | 'pending' | 'failed' | 'refunded')
 * @param {object} paymentDetails
 */
async function updateOrderStatus(orderNumber, status, paymentDetails = {}) {
    const updatePayload = {
        payment_status: status,
        updated_at: new Date().toISOString()
    };

    if (paymentDetails.payment_id) updatePayload.payment_id = paymentDetails.payment_id;
    if (paymentDetails.payment_gateway) updatePayload.payment_gateway = paymentDetails.payment_gateway;
    if (paymentDetails.payment_data) updatePayload.payment_data = paymentDetails.payment_data;

    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update(updatePayload)
                .eq('order_number', orderNumber)
                .select()
                .single();

            if (error) {
                console.error('❌ [Supabase] Error updating order:', error);
                throw error;
            }
            return { success: true, order: data };
        } catch (err) {
            console.error('⚠️ [Supabase] Update failed, trying memory store:', err.message);
        }
    }

    // Fallback store
    if (inMemoryOrders.has(orderNumber)) {
        const order = inMemoryOrders.get(orderNumber);
        Object.assign(order, updatePayload);
        inMemoryOrders.set(orderNumber, order);
        return { success: true, order, isMock: true };
    }

    return { success: false, error: 'Order not found' };
}

/**
 * Get an order by its unique order number
 * @param {string} orderNumber
 */
async function getOrderByNumber(orderNumber) {
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('order_number', orderNumber)
                .single();

            if (!error && data) return data;
        } catch (err) {
            console.error('⚠️ [Supabase] Query error:', err.message);
        }
    }

    return inMemoryOrders.get(orderNumber) || null;
}

/**
 * Fetch all orders for the admin dashboard
 * @param {object} filters { status, limit, offset, search }
 */
async function getAdminOrders(filters = {}) {
    const { status, limit = 100, search } = filters;

    if (supabase) {
        try {
            let query = supabase
                .from('orders')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false })
                .limit(limit);

            if (status && status !== 'all') {
                query = query.eq('payment_status', status);
            }

            if (search) {
                // Sanitize search query to prevent PostgREST syntax injection
                const cleanSearch = String(search).replace(/[^a-zA-Z0-9\u0600-\u06FF\s-_]/g, '').trim();
                if (cleanSearch) {
                    query = query.or(`order_number.ilike.%${cleanSearch}%,customer_name.ilike.%${cleanSearch}%,customer_phone.ilike.%${cleanSearch}%`);
                }
            }

            const { data, count, error } = await query;
            if (!error && data) {
                return { orders: data, count };
            }
        } catch (err) {
            console.error('⚠️ [Supabase] Query admin orders error:', err.message);
        }
    }

    // Fallback in-memory list
    let orders = Array.from(inMemoryOrders.values()).sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    if (status && status !== 'all') {
        orders = orders.filter((o) => o.payment_status === status);
    }
    if (search) {
        const s = search.toLowerCase();
        orders = orders.filter(
            (o) =>
                o.order_number.toLowerCase().includes(s) ||
                o.customer_name.toLowerCase().includes(s) ||
                o.customer_phone.includes(s)
        );
    }

    return { orders: orders.slice(0, limit), count: orders.length, isMock: true };
}

/**
 * Compute aggregate statistics for admin dashboard
 */
async function getAdminStats() {
    const { orders } = await getAdminOrders({ limit: 1000 });

    let totalRevenue = 0;
    let paidOrdersCount = 0;
    let pendingOrdersCount = 0;
    let totalItemsSold = 0;

    orders.forEach((o) => {
        if (o.payment_status === 'paid') {
            totalRevenue += Number(o.grand_total || 0);
            paidOrdersCount += 1;
            if (Array.isArray(o.items)) {
                o.items.forEach((item) => {
                    totalItemsSold += Number(item.quantity || 1);
                });
            }
        } else if (o.payment_status === 'pending') {
            pendingOrdersCount += 1;
        }
    });

    return {
        totalRevenue,
        paidOrdersCount,
        pendingOrdersCount,
        totalOrders: orders.length,
        avgOrderValue: paidOrdersCount > 0 ? Math.round(totalRevenue / paidOrdersCount) : 0,
        totalItemsSold
    };
}

module.exports = {
    supabase,
    isConfigured,
    createOrder,
    updateOrderStatus,
    getOrderByNumber,
    getAdminOrders,
    getAdminStats
};
