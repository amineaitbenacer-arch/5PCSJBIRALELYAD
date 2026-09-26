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

    let res = await fetch(url, {
        method: 'POST',
        redirect: 'manual',
        signal: AbortSignal.timeout(8000),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    });

    if (res.status === 301 || res.status === 302) {
        const loc = res.headers.get('location') || '';
        if (/accounts\.google\.com|ServiceLogin/i.test(loc)) {
            console.error('Google Sheet webhook redirected to a Google login. Deploy the script as Anyone.');
            return { ok: false };
        }
        if (loc) {
            res = await fetch(loc, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(8000) });
        }
    }

    const text = await res.text().catch(() => '');
    const ok = res.ok && /"ok"\s*:\s*true/.test(text);
    if (!ok) {
        console.error('Google Sheet webhook failed:', res.status, text.slice(0, 180));
    }
    return { ok };
}

module.exports = { appendOrderToSheet };
