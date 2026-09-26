const crypto = require('crypto');
const { getPool, initDb, PRODUCT, SETTINGS_PREFIX } = require('./db');
const { appendOrderToSheet, updateOrderPhoneInSheet } = require('./sheets');

const DEFAULT_OFFER = 'عبوة واحدة';
const DEFAULT_PRICE = 159;
const DEFAULT_CONTENT = 'LANTHOME Retinol Cream';

const TOKEN_KEYS = [
    'fb_access_token', 'fb_token_1', 'fb_token_2',
    'tiktok_access_token', 'tiktok_token',
    'snapchat_token'
];

function hashValue(val) {
    if (!val) return undefined;
    return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone) {
    if (!phone) return undefined;
    let clean = String(phone).replace(/\D/g, '');
    if (clean.startsWith('966')) {
        // already international
    } else if (clean.startsWith('0')) {
        clean = '966' + clean.slice(1);
    } else if (clean.startsWith('5') && clean.length === 9) {
        clean = '966' + clean;
    }
    return hashValue(clean);
}

function sendJson(res, status, payload) {
    if (typeof res.status === 'function' && typeof res.json === 'function') {
        return res.status(status).json(payload);
    }
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

function getBody(req) {
    return req.body && typeof req.body === 'object' ? req.body : {};
}

async function loadSettingsMap() {
    const db = getPool();
    const result = await db.query('SELECT key, value FROM settings;');
    const raw = {};
    result.rows.forEach((row) => { raw[row.key] = row.value; });

    const settings = {};
    Object.keys(raw).forEach((key) => {
        if (key.startsWith(SETTINGS_PREFIX)) {
            settings[key.slice(SETTINGS_PREFIX.length)] = raw[key];
        }
    });
    return settings;
}

async function sendServerTracking(req, { name, phone, city, offerName, price, eventId }) {
    try {
        const s = await loadSettingsMap();
        const fb1_pixel = s.fb_pixel_1 || s.fb_pixel_id;
        const fb1_token = s.fb_token_1 || s.fb_access_token;
        const fb2_pixel = s.fb_pixel_2;
        const fb2_token = s.fb_token_2;
        const tt_pixel = s.tiktok_pixel || s.tiktok_pixel_id || process.env.TIKTOK_PIXEL_ID;
        const tt_token = s.tiktok_token || s.tiktok_access_token || process.env.TIKTOK_ACCESS_TOKEN;
        const snap_pixel = s.snapchat_pixel;
        const snap_token = s.snapchat_token;

        const clientIpAddress = req.headers['x-forwarded-for'] || (req.socket ? req.socket.remoteAddress : undefined);
        const clientUserAgent = req.headers['user-agent'];
        const value = Number(price) || DEFAULT_PRICE;
        const contentName = offerName || DEFAULT_CONTENT;

        const sendFBCapi = async (pixel, token) => {
            if (!pixel || !token) return;
            const capiPayload = {
                data: [{
                    event_name: 'Purchase',
                    event_time: Math.floor(Date.now() / 1000),
                    event_id: eventId,
                    action_source: 'website',
                    user_data: {
                        client_ip_address: clientIpAddress,
                        client_user_agent: clientUserAgent,
                        fn: hashValue(name) ? [hashValue(name)] : undefined,
                        ph: normalizePhone(phone) ? [normalizePhone(phone)] : undefined,
                        ct: hashValue(city) ? [hashValue(city)] : undefined
                    },
                    custom_data: {
                        currency: 'MAD',
                        value,
                        content_name: contentName
                    }
                }]
            };
            try {
                const r = await fetch(`https://graph.facebook.com/v19.0/${pixel}/events?access_token=${token}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(capiPayload)
                });
                console.log(`✅ FB CAPI (${pixel}):`, await r.json());
            } catch (e) {
                console.error(`❌ FB CAPI (${pixel}) error:`, e.message);
            }
        };

        await sendFBCapi(fb1_pixel, fb1_token);
        await sendFBCapi(fb2_pixel, fb2_token);

        if (tt_pixel && tt_token) {
            try {
                const r = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                    method: 'POST',
                    headers: { 'Access-Token': tt_token, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        event_source: 'web',
                        event_source_id: tt_pixel,
                        data: [{
                            event: 'CompletePayment',
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: eventId,
                            user: {
                                phone: normalizePhone(phone),
                                ip: clientIpAddress,
                                user_agent: clientUserAgent
                            },
                            properties: {
                                currency: 'SAR',
                                value,
                                content_type: 'product',
                                content_id: 'MP-PSC1OMN0ANSM',
                                contents: [{
                                    content_id: 'MP-PSC1OMN0ANSM',
                                    content_type: 'product',
                                    content_name: contentName,
                                    price: value,
                                    quantity: 1
                                }]
                            }
                        }]
                    })
                });
                console.log('✅ TikTok Events API:', await r.json());
            } catch (e) {
                console.error('❌ TikTok error:', e.message);
            }
        }

        if (snap_pixel && snap_token) {
            try {
                const r = await fetch('https://tr.snapchat.com/v2/conversion', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${snap_token}`, 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: [{
                            pixel_id: snap_pixel,
                            event_type: 'PURCHASE',
                            event_conversion_type: 'WEB',
                            timestamp: Math.floor(Date.now() / 1000),
                            client_dedup_id: eventId,
                            user_data: {
                                client_ip_address: clientIpAddress,
                                client_user_agent: clientUserAgent,
                                hashed_phone_number: normalizePhone(phone)
                            },
                            custom_data: { currency: 'MAD', value }
                        }]
                    })
                });
                console.log('✅ Snapchat CAPI:', await r.json());
            } catch (e) {
                console.error('❌ Snapchat error:', e.message);
            }
        }
    } catch (err) {
        console.error('❌ Server tracking processing failed:', err.message);
    }
}

async function handleListOrders(req, res) {
    try {
        await initDb();
        const result = await getPool().query(
            `SELECT * FROM orders
             WHERE product = $1
             ORDER BY created_at DESC
             LIMIT 500;`,
            [PRODUCT]
        );
        return sendJson(res, 200, { success: true, count: result.rowCount, orders: result.rows });
    } catch (err) {
        console.error('❌ Error fetching orders:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to retrieve orders.' });
    }
}

async function handleCreateOrder(req, res) {
    const body = getBody(req);
    const { name, phone, city, address, offerName, price, quantity, url, notes, utm_source, utm_medium, utm_campaign, utm_term, utm_content, orderId: clientOrderId } = body;

    if (!name || !phone || !city || !address) {
        return sendJson(res, 400, { success: false, message: 'Please provide all required customer information.' });
    }

    try {
        await initDb();
        const result = await getPool().query(
            `INSERT INTO orders (name, phone, city, address, offer_name, price, product)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, created_at;`,
            [
                String(name).trim(),
                String(phone).trim(),
                String(city).trim(),
                String(address).trim(),
                offerName || DEFAULT_OFFER,
                price || DEFAULT_PRICE,
                PRODUCT
            ]
        );
        const orderId = result.rows[0].id;
        console.log(`🛒 FingerCare order #${orderId} for ${name} (${city})`);

        try {
            await appendOrderToSheet({
                orderId,
                name,
                phone,
                city,
                address,
                offerName: offerName || DEFAULT_OFFER,
                price: price || DEFAULT_PRICE,
                quantity,
                url,
                notes,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_term,
                utm_content
            });
        } catch (sheetErr) {
            console.error('❌ Google Sheet:', sheetErr.message);
        }

        sendServerTracking(req, {
            name,
            phone,
            city,
            offerName,
            price,
            eventId: `order_${clientOrderId || orderId}`
        }).catch(() => {});

        return sendJson(res, 201, {
            success: true,
            orderId,
            createdAt: result.rows[0].created_at
        });
    } catch (err) {
        console.error('❌ Failed to insert order:', err);
        const orderId = clientOrderId || Math.floor(1000 + Math.random() * 9000);
        try {
            await appendOrderToSheet({
                orderId,
                name,
                phone,
                city,
                address,
                offerName: offerName || DEFAULT_OFFER,
                price: price || DEFAULT_PRICE,
                quantity,
                url,
                notes,
                utm_source,
                utm_medium,
                utm_campaign,
                utm_term,
                utm_content
            });
        } catch (sheetErr) {
            console.error('❌ Google Sheet:', sheetErr.message);
        }
        return sendJson(res, 201, {
            success: true,
            orderId,
            message: 'Order accepted (DB fallback)'
        });
    }
}

async function handleUpdateOrderPhone(req, res) {
    const body = getBody(req);
    const orderId = body.orderId || body.id;
    const digits = String(body.phone || '').replace(/\D/g, '');
    const saudiOk = /^05\d{8}$/.test(digits) || /^9665\d{8}$/.test(digits);

    if (!orderId || !saudiOk) {
        return sendJson(res, 400, { success: false, message: 'Valid order id and Saudi phone are required.' });
    }

    let dbUpdated = false;
    try {
        await initDb();
        const result = await getPool().query(
            `UPDATE orders SET phone = $1 WHERE id = $2 AND product = $3`,
            [digits, orderId, PRODUCT]
        );
        dbUpdated = result.rowCount > 0;
    } catch (err) {
        console.error('❌ Phone DB update:', err.message);
    }

    let sheetUpdated = false;
    try {
        const sheet = await updateOrderPhoneInSheet(orderId, digits);
        sheetUpdated = !!sheet.ok;
    } catch (err) {
        console.error('❌ Phone sheet update:', err.message);
    }

    if (!sheetUpdated) {
        return sendJson(res, 502, {
            success: false,
            dbUpdated,
            sheetUpdated: false,
            message: 'Phone was not updated in the sheet.'
        });
    }

    return sendJson(res, 200, { success: true, dbUpdated, sheetUpdated: true });
}

async function handleUpdateOrder(req, res) {
    const body = getBody(req);
    const orderId = body.id || (req.params && req.params.id);
    const { status, note } = body;

    if (!orderId) {
        return sendJson(res, 400, { success: false, message: 'Order id is required.' });
    }
    if (status == null && note == null) {
        return sendJson(res, 400, { success: false, message: 'Status or note is required.' });
    }

    try {
        await initDb();
        const db = getPool();
        if (status != null) {
            await db.query(
                `UPDATE orders SET status = $1 WHERE id = $2 AND product = $3`,
                [status, orderId, PRODUCT]
            );
        }
        if (note != null) {
            await db.query(
                `UPDATE orders SET note = $1 WHERE id = $2 AND product = $3`,
                [note, orderId, PRODUCT]
            );
        }
        return sendJson(res, 200, { success: true, message: 'Order updated.' });
    } catch (err) {
        console.error('❌ Error updating order:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to update order.' });
    }
}

async function handleDeleteOrder(req, res) {
    const body = getBody(req);
    const orderId = body.id || (req.params && req.params.id);
    if (!orderId) {
        return sendJson(res, 400, { success: false, message: 'Order id is required.' });
    }

    try {
        await initDb();
        await getPool().query(
            `DELETE FROM orders WHERE id = $1 AND product = $2`,
            [orderId, PRODUCT]
        );
        return sendJson(res, 200, { success: true, message: 'Order deleted.' });
    } catch (err) {
        console.error('❌ Error deleting order:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to delete order.' });
    }
}

async function handleGetSettings(req, res) {
    try {
        await initDb();
        const settings = await loadSettingsMap();
        const isAdmin = (req.query && (req.query.admin === 'true' || req.query.admin === true));
        if (!isAdmin) {
            TOKEN_KEYS.forEach((key) => { delete settings[key]; });
        }
        return sendJson(res, 200, { success: true, settings });
    } catch (err) {
        console.error('❌ Error fetching settings:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to retrieve settings.' });
    }
}

async function handleSaveSettings(req, res) {
    const body = getBody(req);
    const settings = body.settings;
    if (!settings || typeof settings !== 'object') {
        return sendJson(res, 400, { success: false, message: 'Invalid settings data.' });
    }

    try {
        await initDb();
        const db = getPool();
        for (const [key, value] of Object.entries(settings)) {
            const safeKey = String(key).replace(/[^a-zA-Z0-9_]/g, '');
            if (!safeKey) continue;
            await db.query(
                `INSERT INTO settings (key, value) VALUES ($1, $2)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`,
                [SETTINGS_PREFIX + safeKey, value == null ? '' : String(value)]
            );
        }
        return sendJson(res, 200, { success: true, message: 'Settings saved.' });
    } catch (err) {
        console.error('❌ Error saving settings:', err);
        return sendJson(res, 500, { success: false, message: 'Failed to save settings.' });
    }
}

async function handleRecordVisit(req, res) {
    const body = getBody(req);
    const { visitorId, page, loadTime } = body || {};
    const safeVisitorId = visitorId ? String(visitorId).substring(0, 100) : 'v_' + Math.random().toString(36).substring(2, 9);
    const safePage = page ? String(page).substring(0, 50) : 'index';
    const safeLoadTime = Number(loadTime) > 0 && Number(loadTime) < 30000 ? Math.round(Number(loadTime)) : 750;

    try {
        await initDb();
        await getPool().query(
            `INSERT INTO analytics_visits (visitor_id, page, load_time_ms, product) VALUES ($1, $2, $3, $4);`,
            [safeVisitorId, safePage, safeLoadTime, PRODUCT]
        );
        return sendJson(res, 201, { success: true });
    } catch (err) {
        return sendJson(res, 200, { success: true, fallback: true });
    }
}

async function handleGetAnalytics(req, res) {
    try {
        await initDb();
        const statsRes = await getPool().query(`
            SELECT
                COUNT(DISTINCT visitor_id) AS unique_visitors,
                COUNT(*) AS total_pageviews,
                ROUND(AVG(load_time_ms)) AS avg_load_time_ms,
                COUNT(DISTINCT CASE WHEN created_at >= CURRENT_DATE THEN visitor_id END) AS visitors_today
            FROM analytics_visits
            WHERE product = $1;
        `, [PRODUCT]);

        const row = statsRes.rows[0] || {};
        return sendJson(res, 200, {
            success: true,
            stats: {
                uniqueVisitors: Number(row.unique_visitors) || 0,
                totalPageviews: Number(row.total_pageviews) || 0,
                avgLoadTimeMs: Number(row.avg_load_time_ms) || 720,
                visitorsToday: Number(row.visitors_today) || 0
            }
        });
    } catch (err) {
        return sendJson(res, 200, {
            success: true,
            stats: {
                uniqueVisitors: 0,
                totalPageviews: 0,
                avgLoadTimeMs: 720,
                visitorsToday: 0
            }
        });
    }
}

async function handleOrders(req, res) {
    if (req.method === 'GET') return handleListOrders(req, res);
    if (req.method === 'POST') return handleCreateOrder(req, res);
    if (req.method === 'PUT') return handleUpdateOrder(req, res);
    if (req.method === 'DELETE') return handleDeleteOrder(req, res);
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
}

async function handleSettings(req, res) {
    if (req.method === 'GET') return handleGetSettings(req, res);
    if (req.method === 'POST') return handleSaveSettings(req, res);
    return sendJson(res, 405, { success: false, message: 'Method not allowed' });
}

async function handleAnalytics(req, res) {
    const url = String(req.url || '');
    if (req.method === 'POST' || url.includes('visit')) return handleRecordVisit(req, res);
    return handleGetAnalytics(req, res);
}

module.exports = {
    handleOrders,
    handleSettings,
    handleAnalytics,
    handleListOrders,
    handleCreateOrder,
    handleUpdateOrder,
    handleUpdateOrderPhone,
    handleDeleteOrder,
    handleGetSettings,
    handleSaveSettings,
    handleRecordVisit,
    handleGetAnalytics
};
