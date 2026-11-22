/**
 * Paymob Payment Gateway Integration (Egypt)
 * Supports Card, Mobile Wallets (Vodafone Cash, Orange, Etisalat, WE), and InstaPay
 */

const axios = require('axios');
const crypto = require('crypto');

const PAYMOB_API_BASE = 'https://accept.paymob.com/api';

/**
 * Check if Paymob is configured
 */
function isConfigured() {
    return Boolean(
        process.env.PAYMOB_API_KEY &&
        process.env.PAYMOB_API_KEY !== 'YOUR_PAYMOB_API_KEY'
    );
}

/**
 * 1. Authenticate with Paymob to obtain authentication token
 */
async function authenticate() {
    const apiKey = process.env.PAYMOB_API_KEY;
    if (!apiKey) throw new Error('PAYMOB_API_KEY is not defined in .env');

    const response = await axios.post(`${PAYMOB_API_BASE}/auth/tokens`, {
        api_key: apiKey
    });

    return response.data.token;
}

/**
 * 2. Register eCommerce order in Paymob
 */
async function registerOrder(authToken, order) {
    const amountCents = Math.round(Number(order.grand_total) * 100);

    const formattedItems = (order.items || []).map((item) => ({
        name: item.title || item.name || 'منتج',
        amount_cents: Math.round(Number(item.price || 0) * 100),
        description: item.size || 'عنصر',
        quantity: Number(item.quantity || 1)
    }));

    const response = await axios.post(`${PAYMOB_API_BASE}/ecommerce/orders`, {
        auth_token: authToken,
        delivery_needed: 'false',
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: order.order_number,
        items: formattedItems.length > 0 ? formattedItems : [{
            name: `طلب #${order.order_number}`,
            amount_cents: amountCents,
            description: 'Market.com Order',
            quantity: 1
        }]
    });

    return response.data;
}

/**
 * 3. Generate Payment Key for iFrame or Mobile Wallet
 */
async function generatePaymentKey(authToken, paymobOrderId, order, paymentMethod = 'card') {
    const amountCents = Math.round(Number(order.grand_total) * 100);

    // Select Integration ID based on method
    let integrationId = process.env.PAYMOB_INTEGRATION_ID_CARD;
    if (paymentMethod === 'wallet' && process.env.PAYMOB_INTEGRATION_ID_WALLET) {
        integrationId = process.env.PAYMOB_INTEGRATION_ID_WALLET;
    }

    const nameParts = (order.customer_name || 'عميل المتجر').trim().split(' ');
    const firstName = nameParts[0] || 'عميل';
    const lastName = nameParts.slice(1).join(' ') || 'المتجر';
    const phone = (order.customer_phone || '01000000000').replace(/[^0-9]/g, '');

    const billingData = {
        apartment: 'NA',
        email: order.customer_email || `customer_${Date.now()}@market.com`,
        floor: 'NA',
        first_name: firstName,
        street: order.customer_address || 'القاهرة',
        building: 'NA',
        phone_number: phone.startsWith('0') ? `+2${phone}` : `+20${phone}`,
        shipping_method: 'PKG',
        postal_code: '11511',
        city: order.city || 'Cairo',
        country: 'EG',
        last_name: lastName,
        state: order.city || 'Cairo'
    };

    const response = await axios.post(`${PAYMOB_API_BASE}/acceptance/payment_keys`, {
        auth_token: authToken,
        amount_cents: amountCents,
        expiration: 3600,
        order_id: paymobOrderId,
        billing_data: billingData,
        currency: 'EGP',
        integration_id: Number(integrationId) || 0,
        lock_order_when_paid: 'true'
    });

    return response.data.token;
}

/**
 * Create a full Paymob checkout session
 * @param {object} order - Order details
 * @param {string} paymentMethod - 'card' or 'wallet'
 */
async function createCheckoutSession(order, paymentMethod = 'card') {
    if (!isConfigured()) {
        console.warn('⚠️ [Paymob] Keys not configured. Returning simulated checkout session.');
        return {
            success: true,
            isSimulation: true,
            paymentToken: `sim_token_${Date.now()}`,
            redirectUrl: `/order-success.html?order_id=${order.order_number}&gateway=paymob&simulated=true`
        };
    }

    const authToken = await authenticate();
    const paymobOrder = await registerOrder(authToken, order);
    const paymentKeyToken = await generatePaymentKey(authToken, paymobOrder.id, order, paymentMethod);

    const iframeId = process.env.PAYMOB_IFRAME_ID || '825916';
    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKeyToken}`;

    return {
        success: true,
        paymobOrderId: paymobOrder.id,
        paymentToken: paymentKeyToken,
        iframeUrl,
        redirectUrl: iframeUrl
    };
}

/**
 * Verify Paymob HMAC Signature from Webhook callback
 * Concatenates ordered transaction fields and hashes with HMAC SHA512
 */
function verifyHmac(data, receivedHmac) {
    const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
    if (!hmacSecret) {
        console.error('❌ [Paymob] PAYMOB_HMAC_SECRET not set in environment. Rejecting webhook signature verification.');
        return false;
    }

    const obj = data.obj || data;
    const concatenatedString = [
        obj.amount_cents,
        obj.created_at,
        obj.currency,
        obj.error_occured,
        obj.has_parent_transaction,
        obj.id,
        obj.integration_id,
        obj.is_3d_secure,
        obj.is_auth,
        obj.is_capture,
        obj.is_refunded,
        obj.is_standalone_payment,
        obj.is_voided,
        obj.order ? (typeof obj.order === 'object' ? obj.order.id : obj.order) : '',
        obj.owner,
        obj.pending,
        obj.source_data ? obj.source_data.pan : '',
        obj.source_data ? obj.source_data.sub_type : '',
        obj.source_data ? obj.source_data.type : '',
        obj.success
    ].join('');

    const calculatedHmac = crypto
        .createHmac('sha512', hmacSecret)
        .update(concatenatedString)
        .digest('hex');

    return calculatedHmac.toLowerCase() === (receivedHmac || '').toLowerCase();
}

module.exports = {
    isConfigured,
    createCheckoutSession,
    verifyHmac
};
