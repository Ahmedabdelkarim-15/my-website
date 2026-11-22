/**
 * Stripe Payment Gateway Integration
 * Handles International Credit / Debit Cards, Apple Pay, Google Pay
 */

const stripe = require('stripe');

let stripeClient = null;

function getClient() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === 'YOUR_STRIPE_SECRET_KEY') {
        return null;
    }
    if (!stripeClient) {
        stripeClient = stripe(secretKey);
    }
    return stripeClient;
}

function isConfigured() {
    return Boolean(getClient());
}

/**
 * Create Stripe Checkout Session
 * @param {object} order - Order model
 * @param {string} baseUrl - Domain URL for callbacks
 */
async function createCheckoutSession(order, baseUrl = 'http://localhost:8080') {
    const client = getClient();

    if (!client) {
        console.warn('⚠️ [Stripe] Keys not configured in .env. Returning simulated checkout.');
        return {
            success: true,
            isSimulation: true,
            sessionId: `sim_cs_${Date.now()}`,
            redirectUrl: `${baseUrl}/order-success.html?order_id=${order.order_number}&gateway=stripe&simulated=true`
        };
    }

    const lineItems = (order.items || []).map((item) => ({
        price_data: {
            currency: 'egp',
            product_data: {
                name: item.title || item.name || 'منتج',
                description: item.size ? `مقاس: ${item.size}` : undefined,
                images: item.image && item.image.startsWith('http') ? [item.image] : undefined
            },
            unit_amount: Math.round(Number(item.price || 0) * 100)
        },
        quantity: Number(item.quantity || 1)
    }));

    // If shipping is present, add it
    if (Number(order.shipping) > 0) {
        lineItems.push({
            price_data: {
                currency: 'egp',
                product_data: {
                    name: 'تكلفة الشحن والتوصيل'
                },
                unit_amount: Math.round(Number(order.shipping) * 100)
            },
            quantity: 1
        });
    }

    const session = await client.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems.length > 0 ? lineItems : [
            {
                price_data: {
                    currency: 'egp',
                    product_data: {
                        name: `طلب #${order.order_number}`
                    },
                    unit_amount: Math.round(Number(order.grand_total) * 100)
                },
                quantity: 1
            }
        ],
        mode: 'payment',
        metadata: {
            order_number: order.order_number,
            customer_phone: order.customer_phone,
            customer_name: order.customer_name
        },
        customer_email: order.customer_email || undefined,
        success_url: `${baseUrl}/order-success.html?session_id={CHECKOUT_SESSION_ID}&order_id=${order.order_number}&gateway=stripe`,
        cancel_url: `${baseUrl}/#checkout`
    });

    return {
        success: true,
        sessionId: session.id,
        redirectUrl: session.url
    };
}

/**
 * Verify Stripe Webhook Signature
 * @param {Buffer|string} rawBody
 * @param {string} signatureHeader
 */
function constructWebhookEvent(rawBody, signatureHeader) {
    const client = getClient();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!client || !webhookSecret || webhookSecret === 'YOUR_STRIPE_WEBHOOK_SECRET') {
        throw new Error('STRIPE_WEBHOOK_SECRET is not configured. Webhook signature cannot be verified.');
    }

    return client.webhooks.constructEvent(rawBody, signatureHeader, webhookSecret);
}

module.exports = {
    isConfigured,
    createCheckoutSession,
    constructWebhookEvent
};
