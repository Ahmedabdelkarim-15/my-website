/**
 * Telegram Notification Service for Market.com
 * Sends instant real-time alerts on new paid orders and checkout events.
 */

const https = require('https');

/**
 * Format currency in Egyptian Pounds
 */
function formatEGP(amount) {
    return Number(amount || 0).toLocaleString('ar-EG', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }) + ' ج.م';
}

/**
 * Send a notification message via Telegram Bot API
 * @param {string} text - Message text formatted in Markdown or HTML
 * @param {object} options - Optional config { parse_mode: 'HTML' }
 */
async function sendTelegramNotification(text, options = {}) {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId || botToken === 'YOUR_TELEGRAM_BOT_TOKEN') {
        console.warn('⚠️ [Telegram] Token or Chat ID not configured in .env. Skipping notification.');
        return { success: false, reason: 'not_configured' };
    }

    const payload = JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: options.parse_mode || 'HTML',
        disable_web_page_preview: true
    });

    return new Promise((resolve) => {
        const req = https.request(
            {
                hostname: 'api.telegram.org',
                path: `/bot${botToken}/sendMessage`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                },
                timeout: 10000
            },
            (res) => {
                let body = '';
                res.on('data', (chunk) => (body += chunk));
                res.on('end', () => {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        console.log('✅ [Telegram] Notification sent successfully');
                        resolve({ success: true, body });
                    } else {
                        console.error(`❌ [Telegram] Failed (${res.statusCode}): ${body}`);
                        resolve({ success: false, status: res.statusCode, error: body });
                    }
                });
            }
        );

        req.on('error', (err) => {
            console.error('❌ [Telegram] Network Error:', err.message);
            resolve({ success: false, error: err.message });
        });

        req.on('timeout', () => {
            req.destroy();
            console.error('❌ [Telegram] Request timed out');
            resolve({ success: false, error: 'timeout' });
        });

        req.write(payload);
        req.end();
    });
}

/**
 * Send formatted order notification for paid / confirmed orders
 * @param {object} order - Order object from database
 */
async function notifyOrderPaid(order) {
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsListHtml = items
        .map((item, index) => {
            const variant = [item.size ? `مقاس: ${item.size}` : '', item.color ? `لون: ${item.color}` : '']
                .filter(Boolean)
                .join(' | ');
            const variantStr = variant ? ` <i>(${variant})</i>` : '';
            return `  ${index + 1}. <b>${item.title || item.name}</b> × ${item.quantity || 1}${variantStr} - <b>${formatEGP((item.price || 0) * (item.quantity || 1))}</b>`;
        })
        .join('\n');

    const gatewayMap = {
        paymob: '💳 Paymob (بطاقة بنكية / محفظة)',
        stripe: '💳 Stripe (بطاقة دولية)',
        cod: '💵 الدفع عند الاستلام (COD)'
    };

    const statusBadge = order.payment_status === 'paid' ? '✅ مدفوع بالكامل' : '⏳ قيد الانتظار';
    const gatewayName = gatewayMap[order.payment_gateway] || order.payment_gateway || 'إلكتروني';
    const nowEgypt = new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' });

    const messageHtml = `
🔔 <b>طلب جديد في المتجر!</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>رقم الطلب:</b> <code>#${order.order_number}</code>
👤 <b>العميل:</b> ${order.customer_name}
📞 <b>الهاتف:</b> <a href="tel:${order.customer_phone}">${order.customer_phone}</a> (<a href="https://wa.me/20${order.customer_phone.replace(/^0+/, '')}">واتساب</a>)
📍 <b>العنوان:</b> ${order.city} - ${order.customer_address}
${order.notes ? `📝 <b>ملاحظات:</b> ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
🛒 <b>المنتجات (${items.length}):</b>
${itemsListHtml || '  (لا توجد منتجات مسجلة)'}
━━━━━━━━━━━━━━━━━━━━
💵 <b>المجموع الفرعي:</b> ${formatEGP(order.subtotal)}
${order.discount > 0 ? `🎟️ <b>الخصم (${order.promo_code || 'كوبون'}):</b> -${formatEGP(order.discount)}\n` : ''}🚚 <b>الشحن:</b> ${order.shipping > 0 ? formatEGP(order.shipping) : 'مجاني'}
💰 <b>الإجمالي النهائي:</b> <b>${formatEGP(order.grand_total)}</b>
━━━━━━━━━━━━━━━━━━━━
💳 <b>طريقة الدفع:</b> ${gatewayName}
📊 <b>حالة الدفع:</b> <b>${statusBadge}</b>
${order.payment_id ? `🔖 <b>مرجع المعاملة:</b> <code>${order.payment_id}</code>\n` : ''}🕒 <b>التاريخ:</b> ${nowEgypt}
━━━━━━━━━━━━━━━━━━━━
🚀 <i>Market.com - نظام الطلبات الآلي</i>
`.trim();

    return sendTelegramNotification(messageHtml, { parse_mode: 'HTML' });
}

module.exports = {
    sendTelegramNotification,
    notifyOrderPaid
};
