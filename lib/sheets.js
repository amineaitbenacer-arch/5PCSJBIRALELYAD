function sheetUrl() {
    return process.env.GOOGLE_SHEETS_WEBHOOK || '';
}

function riyadhStamp() {
    return new Date().toLocaleString('en-GB', {
        timeZone: 'Asia/Riyadh',
        hour12: false
    });
}

async function appendOrderToSheet(order) {
    const url = sheetUrl();
    if (!url) {
        console.warn('GOOGLE_SHEETS_WEBHOOK is not set. Order was not sent to Google Sheets.');
        return { ok: false, skipped: true };
    }

    const payload = {
        date: riyadhStamp(),
        orderId: order.orderId || '',
        name: order.name || '',
        phone: order.phone || '',
        city: order.city || '',
        address: order.address || '',
        offerName: order.offerName || '',
        price: order.price || '',
        currency: 'SAR',
        product: 'LANTHOME Retinol Cream',
        payment: 'الدفع عند الاستلام',
        status: 'جديد'
    };

    const res = await fetch(url, {
        method: 'POST',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    });

    const ok = res.status === 200 || res.status === 302 || res.status === 301;
    if (!ok) {
        console.error('Google Sheet webhook status:', res.status);
    }
    return { ok };
}

module.exports = { appendOrderToSheet };
