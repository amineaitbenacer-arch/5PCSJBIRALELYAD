const { Pool } = require('pg');

const DATABASE_URL = process.env.DATABASE_URL
    || process.env.POSTGRES_URL
    || process.env.POSTGRES_PRISMA_URL
    || 'postgresql://neondb_owner:npg_Q9EKG1HLByna@ep-withered-rain-b5trg62d-pooler.c-7.us-east-2.aws.neon.tech/neondb?sslmode=require';

let pool = null;
let initPromise = null;

function getPool() {
    if (!pool) {
        if (!DATABASE_URL) {
            throw new Error('DATABASE_URL is not configured');
        }
        pool = new Pool({
            connectionString: DATABASE_URL,
            ssl: { rejectUnauthorized: false }
        });
    }
    return pool;
}

async function initDb() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        const db = getPool();
        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                phone VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                offer_name VARCHAR(255) NOT NULL,
                price NUMERIC(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'Nouveau',
                note TEXT,
                product VARCHAR(50)
            );
        `);
        await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Nouveau';`);
        await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS note TEXT;`);
        await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS product VARCHAR(50);`);

        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(255) PRIMARY KEY,
                value TEXT NOT NULL
            );
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS analytics_visits (
                id SERIAL PRIMARY KEY,
                visitor_id VARCHAR(100),
                page VARCHAR(100) DEFAULT 'index',
                load_time_ms INT DEFAULT 850,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                product VARCHAR(50)
            );
        `);
        await db.query(`ALTER TABLE analytics_visits ADD COLUMN IF NOT EXISTS product VARCHAR(50);`);
    })().catch((err) => {
        initPromise = null;
        throw err;
    });
    return initPromise;
}

module.exports = { getPool, initDb, PRODUCT: 'fingercare', SETTINGS_PREFIX: 'fc_' };
