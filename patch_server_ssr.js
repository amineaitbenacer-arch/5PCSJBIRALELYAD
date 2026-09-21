const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');

const ssrCode = `
// SSR for index and thankyou
const renderPage = require('./api/render_page');
app.get('/', (req, res) => renderPage(req, res));
app.get('/index.html', (req, res) => renderPage(req, res));
app.get('/thankyou', (req, res) => renderPage(req, res));
app.get('/thankyou.html', (req, res) => renderPage(req, res));
`;

if (!content.includes('const renderPage = require')) {
    content = content.replace(/app\.use\(express\.static\('public'\)\);/, ssrCode + '\napp.use(express.static(\'public\'));');
    fs.writeFileSync('server.js', content);
    console.log('Patched server.js for SSR');
}
