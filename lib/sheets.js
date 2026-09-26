function sheetUrl() {
    return process.env.GOOGLE_SHEETS_WEBHOOK || '';
}

function orderDateStamp() {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Riyadh',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    }).formatToParts(new Date());
    const pick = (type) => parts.find((part) => part.type === type).value;
    return `${pick('month')} ${pick('day')}, ${pick('year')} at ${pick('hour')}:${pick('minute')}`;
}

function quantityFromOffer(order) {
    const qty = Number(order.quantity);
    if (qty === 1 || qty === 2 || qty === 3) return qty;
    const name = String(order.offerName || '');
    if (name.includes('3')) return 3;
    if (name.includes('عبوتان')) return 2;
    return 1;
}

async function postToSheet(payload) {
    const url = sheetUrl();
    if (!url) {
        console.warn('GOOGLE_SHEETS_WEBHOOK is not set. Order was not sent to Google Sheets.');
        return { ok: false, skipped: true, text: '', status: 0 };
    }

    let res = await fetch(url, {
        method: 'POST',
        redirect: 'manual',
        signal: AbortSignal.timeout(25000),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
    });

    if (res.status === 301 || res.status === 302) {
        const loc = res.headers.get('location') || '';
        if (/accounts\.google\.com|ServiceLogin/i.test(loc)) {
            console.error('Google Sheet webhook redirected to a Google login. Deploy the script as Anyone.');
            return { ok: false, skipped: false, text: '', status: res.status };
        }
        if (loc) {
            res = await fetch(loc, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(25000) });
        }
    }

    const text = await res.text().catch(() => '');
    return { ok: res.ok, skipped: false, text, status: res.status };
}

async function appendOrderToSheet(order) {
    const result = await postToSheet({
        orderDate: orderDateStamp(),
        orderId: order.orderId || '',
        country: 'ksa',
        name: order.name || '',
        phone: order.phone || '',
        address: order.address || order.city || '',
        url: order.url || 'https://lanthome.vercel.app/',
        sku: 'MP-PSC1OMN0ANSM',
        product: 'كريم لانثوم ريتينول',
        quantity: quantityFromOffer(order),
        price: order.price || '',
        currency: 'sar',
        notes: order.notes || '',
        offerName: order.offerName || '',
        utm_source: order.utm_source || '',
        utm_medium: order.utm_medium || '',
        utm_campaign: order.utm_campaign || '',
        utm_term: order.utm_term || '',
        utm_content: order.utm_content || ''
    });
    if (result.skipped) return { ok: false, skipped: true };
    const ok = result.ok && /"ok"\s*:\s*true/.test(result.text);
    if (!ok) {
        console.error('Google Sheet webhook failed:', result.status, result.text.slice(0, 180));
    }
    return { ok };
}

async function updateOrderPhoneInSheet(orderId, phone) {
    const result = await postToSheet({
        action: 'updatePhone',
        orderId: String(orderId),
        phone: String(phone || '').replace(/\D/g, '')
    });
    if (result.skipped) return { ok: false, skipped: true };
    const updated = /"updated"\s*:\s*true/.test(result.text);
    if (!updated) {
        console.error('Google Sheet phone update failed:', result.status, result.text.slice(0, 180));
    }
    return { ok: updated };
}

module.exports = { appendOrderToSheet, updateOrderPhoneInSheet };
