const fs = require('fs');

const purchaseCode = `
  <script>
    // Firing Purchase Event
    document.addEventListener("DOMContentLoaded", function() {
        let price = 249;
        let orderId = null;
        try {
          const orderDataStr = localStorage.getItem('ac_last_order');
          if (orderDataStr) {
            const orderData = JSON.parse(orderDataStr);
            if (orderData.price) price = orderData.price;
            if (orderData.orderId) orderId = orderData.orderId;
          }
        } catch (e) {}

        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('price')) price = urlParams.get('price');
        if (urlParams.get('orderId')) orderId = urlParams.get('orderId');

        if (typeof fbq === 'function') {
            if (orderId) {
                fbq('track', 'Purchase', { currency: 'MAD', value: Number(price) }, { eventID: 'order_' + orderId });
            } else {
                fbq('track', 'Purchase', { currency: 'MAD', value: Number(price) });
            }
            console.log("✅ Facebook Pixel Purchase fired statically. Order ID:", orderId, "Price:", price);
        }
    });
  </script>
`;

const files = [
    'thankyou.html',
    'public/thankyou.html'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject the purchase code after the closing </noscript> of the FB pixel
    if (content.includes('<!-- End Facebook Pixel Code -->')) {
        // Prevent double injection
        if (!content.includes('// Firing Purchase Event')) {
            content = content.replace('<!-- End Facebook Pixel Code -->', '<!-- End Facebook Pixel Code -->\n' + purchaseCode);
            fs.writeFileSync(file, content);
        }
    }
}
console.log("Patched purchase event in thankyou pages");
