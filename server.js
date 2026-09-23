const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { initDb } = require('./lib/db');
const {
    handleListOrders,
    handleCreateOrder,
    handleUpdateOrder,
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
app.use(express.static(__dirname));
app.get(['/fingercare-admin', '/fingercare-admin/'], (req, res) => {
    res.sendFile(path.join(__dirname, 'fingercare-admin.html'));
});
app.get(['/admin', '/admin/', '/admin.html'], (req, res) => {
    res.redirect(302, '/');
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
        console.log(`🔐 Admin: http://localhost:${PORT}/fingercare-admin`);
    });
}

module.exports = app;
