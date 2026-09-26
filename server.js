const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb } = require('./lib/db');
const {
    handleListOrders,
    handleCreateOrder,
    handleUpdateOrder,
    handleUpdateOrderPhone,
    handleDeleteOrder,
    handleGetSettings,
    handleSaveSettings,
    handleRecordVisit,
    handleGetAnalytics
} = require('./lib/handlers');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname, {
    setHeaders: function (res, filePath) {
        if (/\.html?$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'no-cache');
            return;
        }
        if (/\.(jpe?g|png|webp|gif|svg|woff2|css|js)$/i.test(filePath)) {
            res.setHeader('Cache-Control', 'public, max-age=604800');
        }
    }
}));
app.get(['/admin', '/admin/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});
app.get(['/thankyou', '/thankyou/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'thankyou.html'));
});

initDb().then(() => {
    console.log('✅ PostgreSQL initialized for FingerCare (orders, settings, analytics).');
}).catch((err) => {
    console.error('❌ Error initializing database:', err);
});

app.post('/api/orders', handleCreateOrder);
app.post('/api/orders/phone', handleUpdateOrderPhone);
app.get('/api/orders', handleListOrders);
app.put('/api/orders', handleUpdateOrder);
app.put('/api/orders/:id/status', handleUpdateOrder);
app.delete('/api/orders', handleDeleteOrder);

app.get('/api/settings', handleGetSettings);
app.post('/api/settings', handleSaveSettings);

app.post(['/api/analytics/visit', '/api/analytics'], handleRecordVisit);
app.get(['/api/analytics/stats', '/api/analytics'], handleGetAnalytics);

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 FingerCare server running on port ${PORT}`);
        console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
    });
}

module.exports = app;
