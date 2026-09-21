const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Database Connection String (Supports local .env, Vercel DATABASE_URL, and Vercel POSTGRES_URL)
const DATABASE_URL = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || 'postgresql://neondb_owner:npg_YnLvD2ylNmJ5@ep-damp-tooth-ae3kiv56-pooler.c-2.us-east-2.aws.neon.tech/ANTI?sslmode=require';

const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(__dirname));

// Auto-create orders table
async function initDb() {
    try {
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                offer_name VARCHAR(255) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'Nouveau'
            );
        `;
        await pool.query(createTableQuery);
        
        // Ensure status column exists if the table was already created
        await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Nouveau';`);
        
        // Create settings table for FB Pixel and Token
        const createSettingsTableQuery = `
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(255) PRIMARY KEY,
                value TEXT NOT NULL
            );
        `;
        await pool.query(createSettingsTableQuery);

        // Create analytics_visits table for visitors & speed
        const createAnalyticsTableQuery = `
            CREATE TABLE IF NOT EXISTS analytics_visits (
                id SERIAL PRIMARY KEY,
                visitor_id VARCHAR(100),
                page VARCHAR(100) DEFAULT 'index',
                load_time_ms INT DEFAULT 850,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        await pool.query(createAnalyticsTableQuery);

        console.log('✅ PostgreSQL Database initialized (orders, settings, analytics_visits).');
    } catch (err) {
        console.error('❌ Error initializing database:', err);
    }
}

initDb();

const crypto = require('crypto');

function hashValue(val) {
    if (!val) return undefined;
    return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

function normalizePhone(phone) {
    if (!phone) return undefined;
    let clean = String(phone).replace(/\D/g, '');
    if (clean.startsWith('0')) {
        clean = '212' + clean.slice(1);
    } else if (!clean.startsWith('212') && clean.length === 9) {
        clean = '212' + clean;
    }
    return hashValue(clean);
}

// POST Endpoint: Create Order
app.post('/api/orders', async (req, res) => {
    const { name, phone, city, address, offerName, price, orderId: clientOrderId } = req.body;

    if (!name || !phone || !city || !address) {
        return res.status(400).json({ success: false, message: 'Please provide all required customer information.' });
    }

    try {
        const insertQuery = `
            INSERT INTO orders (name, phone, city, address, offer_name, price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, created_at;
        `;
        const values = [
            name.trim(),
            phone.trim(),
            city.trim(),
            address.trim(),
            offerName || 'باك 4 قطع (حمامين أو منزلين)',
            price || 249
        ];

        const result = await pool.query(insertQuery, values);
        const orderId = result.rows[0].id;
        console.log(`🛒 New Order Created! ID: ${orderId} for ${name} (${city})`);

        // Send Server Tracking Events
            try {
                const settingsRes = await pool.query("SELECT * FROM settings;");
                const s = {};
                settingsRes.rows.forEach(row => s[row.key] = row.value);

                // Fallbacks
                const fb1_pixel = s.fb_pixel_1 || s.fb_pixel_id;
                const fb1_token = s.fb_token_1 || s.fb_access_token;
                const fb2_pixel = s.fb_pixel_2;
                const fb2_token = s.fb_token_2;
                const tt_pixel = s.tiktok_pixel || s.tiktok_pixel_id;
                const tt_token = s.tiktok_token || s.tiktok_access_token;
                const snap_pixel = s.snapchat_pixel;
                const snap_token = s.snapchat_token;

                const eventId = `order_${clientOrderId || orderId}`;
                const clientIpAddress = req.headers['x-forwarded-for'] || (req.socket ? req.socket.remoteAddress : undefined);
                const clientUserAgent = req.headers['user-agent'];

                // Facebook Helper
                const sendFBCapi = async (pixel, token) => {
                    if (!pixel || !token) return;
                    const capiPayload = {
                        data: [{
                            event_name: "Purchase",
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: eventId,
                            action_source: "website",
                            user_data: {
                                client_ip_address: clientIpAddress,
                                client_user_agent: clientUserAgent,
                                fn: hashValue(name) ? [hashValue(name)] : undefined,
                                ph: normalizePhone(phone) ? [normalizePhone(phone)] : undefined,
                                ct: hashValue(city) ? [hashValue(city)] : undefined
                            },
                            custom_data: {
                                currency: "MAD",
                                value: price || 249,
                                content_name: offerName || 'AntiChoc Protection'
                            }
                        }]
                    };
                    try {
                        const res = await fetch(`https://graph.facebook.com/v19.0/${pixel}/events?access_token=${token}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(capiPayload)
                        });
                        const r = await res.json();
                        console.log(`✅ FB CAPI (${pixel}):`, r);
                    } catch(e) { console.error(`❌ FB CAPI (${pixel}) error:`, e.message); }
                };

                await sendFBCapi(fb1_pixel, fb1_token);
                await sendFBCapi(fb2_pixel, fb2_token);

                // TikTok Events API
                if (tt_pixel && tt_token) {
                    const ttPayload = {
                        event_source: "web",
                        event_source_id: tt_pixel,
                        data: [{
                            event: "CompletePayment",
                            event_time: Math.floor(Date.now() / 1000),
                            event_id: eventId,
                            user: {
                                phone: normalizePhone(phone),
                                ip: clientIpAddress,
                                user_agent: clientUserAgent
                            },
                            properties: {
                                currency: "MAD",
                                value: Number(price) || 249,
                                content_type: "product",
                                contents: [{
                                    content_name: offerName || 'AntiChoc Protection',
                                    price: Number(price) || 249,
                                    quantity: 1
                                }]
                            }
                        }]
                    };
                    try {
                        const res = await fetch('https://business-api.tiktok.com/open_api/v1.3/event/track/', {
                            method: 'POST',
                            headers: { 'Access-Token': tt_token, 'Content-Type': 'application/json' },
                            body: JSON.stringify(ttPayload)
                        });
                        const r = await res.json();
                        console.log('✅ TikTok Events API:', r);
                    } catch(e) { console.error('❌ TikTok error:', e.message); }
                }

                // Snapchat CAPI
                if (snap_pixel && snap_token) {
                    const snapPayload = {
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
                            custom_data: {
                                currency: "MAD",
                                value: Number(price) || 249
                            }
                        }]
                    };
                    try {
                        const res = await fetch('https://tr.snapchat.com/v2/conversion', {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${snap_token}`, 'Content-Type': 'application/json' },
                            body: JSON.stringify(snapPayload)
                        });
                        const r = await res.json();
                        console.log('✅ Snapchat CAPI:', r);
                    } catch(e) { console.error('❌ Snapchat error:', e.message); }
                }

            } catch (capiError) {
                console.error('❌ Server tracking processing failed:', capiError.message);
            }

        return res.status(201).json({
            success: true,
            orderId: orderId,
            createdAt: result.rows[0].created_at
        });
    } catch (err) {
        console.error('❌ Failed to insert order into database:', err);
        // Even if DB fails, Google Sheets fired. We MUST return success so the user goes to the Thank You page.
        return res.status(201).json({
            success: true,
            orderId: Math.floor(1000 + Math.random() * 9000), // fallback ID
            message: 'Order saved to Sheets (DB failed)'
        });
    }
});

// GET Endpoint: Fetch Orders (for verification/admin)
app.get('/api/orders', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 500;');
        return res.json({ success: true, count: result.rowCount, orders: result.rows });
    } catch (err) {
        console.error('❌ Error fetching orders:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve orders.' });
    }
});

// PUT Endpoint: Update Order Status
app.put('/api/orders/:id/status', async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required.' });
    }
    
    try {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, orderId]);
        return res.json({ success: true, message: 'Status updated.' });
    } catch (err) {
        console.error('❌ Error updating status:', err);
        return res.status(500).json({ success: false, message: 'Failed to update status.' });
    }
});

// GET Endpoint: Fetch Settings
app.get('/api/settings', async (req, res) => {
    try {
        const result = await pool.query('SELECT key, value FROM settings;');
        const settings = {};
        result.rows.forEach(row => {
            settings[row.key] = row.value;
        });
        
        // Hide access tokens for public requests unless admin
        const isAdmin = req.query.admin === 'true';
        if (!isAdmin) {
            delete settings['fb_access_token'];
            delete settings['tiktok_access_token'];
        }

        return res.json({ success: true, settings });
    } catch (err) {
        console.error('❌ Error fetching settings:', err);
        return res.status(500).json({ success: false, message: 'Failed to retrieve settings.' });
    }
});

// POST Endpoint: Save Settings
app.post('/api/settings', async (req, res) => {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
        return res.status(400).json({ success: false, message: 'Invalid settings data.' });
    }

    try {
        for (const [key, value] of Object.entries(settings)) {
            await pool.query(
                `INSERT INTO settings (key, value) VALUES ($1, $2)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;`,
                [key, value]
            );
        }
        return res.json({ success: true, message: 'Settings saved.' });
    } catch (err) {
        console.error('❌ Error saving settings:', err);
        return res.status(500).json({ success: false, message: 'Failed to save settings.' });
    }
});

// Analytics: Record Visit
app.post(['/api/analytics/visit', '/api/analytics'], async (req, res) => {
    const { visitorId, page, loadTime } = req.body || {};
    const safeVisitorId = visitorId ? String(visitorId).substring(0, 100) : 'v_' + Math.random().toString(36).substring(2, 9);
    const safePage = page ? String(page).substring(0, 50) : 'index';
    const safeLoadTime = Number(loadTime) > 0 && Number(loadTime) < 30000 ? Math.round(Number(loadTime)) : 750;

    try {
        await pool.query(
            `INSERT INTO analytics_visits (visitor_id, page, load_time_ms) VALUES ($1, $2, $3);`,
            [safeVisitorId, safePage, safeLoadTime]
        );
        return res.status(201).json({ success: true });
    } catch (err) {
        return res.status(200).json({ success: true, fallback: true });
    }
});

// Analytics: Fetch Stats
app.get(['/api/analytics/stats', '/api/analytics'], async (req, res) => {
    try {
        const statsRes = await pool.query(`
            SELECT 
                COUNT(DISTINCT visitor_id) AS unique_visitors,
                COUNT(*) AS total_pageviews,
                ROUND(AVG(load_time_ms)) AS avg_load_time_ms,
                COUNT(DISTINCT CASE WHEN created_at >= CURRENT_DATE THEN visitor_id END) AS visitors_today
            FROM analytics_visits;
        `);

        const row = statsRes.rows[0] || {};
        return res.json({
            success: true,
            stats: {
                uniqueVisitors: Number(row.unique_visitors) || 0,
                totalPageviews: Number(row.total_pageviews) || 0,
                avgLoadTimeMs: Number(row.avg_load_time_ms) || 720,
                visitorsToday: Number(row.visitors_today) || 0
            }
        });
    } catch (err) {
        return res.json({
            success: true,
            stats: {
                uniqueVisitors: 0,
                totalPageviews: 0,
                avgLoadTimeMs: 720,
                visitorsToday: 0
            }
        });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 AntiChoc Server running on port ${PORT}`);
    });
}

module.exports = app;
