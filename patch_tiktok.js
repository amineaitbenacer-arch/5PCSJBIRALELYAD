const fs = require('fs');

const tiktokIndexCode = `
  <!-- Dynamic TikTok Pixel -->
  <script>
    async function initTikTokPixel() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!data.success || !data.settings) return;

        if (data.settings.tiktok_pixel_id) {
          const ttPixelId = data.settings.tiktok_pixel_id;
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
            ttq.load(ttPixelId);
            ttq.page();
          }(window, document, 'ttq');
          console.log("✅ TikTok Pixel initialized dynamically with ID:", ttPixelId);
        }
      } catch (err) {}
    }
    initTikTokPixel();
  </script>
`;

const tiktokThankyouCode = `
  <!-- Dynamic TikTok Pixel CompletePayment -->
  <script>
    async function initTikTokPurchase() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!data.success || !data.settings || !data.settings.tiktok_pixel_id) return;

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

        const ttPixelId = data.settings.tiktok_pixel_id;
        !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
            ttq.load(ttPixelId);
            ttq.page();
        }(window, document, 'ttq');

        const ttEventParams = {
            value: Number(price),
            currency: 'MAD',
            content_type: 'product',
            content_name: 'AntiChoc Protection',
            content_id: 'antichoc_protect'
        };
        const ttOptions = orderId ? { event_id: 'order_' + orderId } : {};
        ttq.track('CompletePayment', ttEventParams, ttOptions);
        console.log("✅ TikTok Pixel CompletePayment fired dynamically. ID:", ttPixelId, "Order ID:", orderId);
      } catch (err) {}
    }
    initTikTokPurchase();
  </script>
`;

const indexFiles = ['index.html', 'public/index.html'];
const thankyouFiles = ['thankyou.html', 'public/thankyou.html'];

for (const file of indexFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('<!-- Dynamic TikTok Pixel -->')) {
        content = content.replace('<!-- End Facebook Pixel Code -->', '<!-- End Facebook Pixel Code -->\n' + tiktokIndexCode);
        fs.writeFileSync(file, content);
    }
}

for (const file of thankyouFiles) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('<!-- Dynamic TikTok Pixel CompletePayment -->')) {
        content = content.replace('<!-- End Facebook Pixel Code -->', '<!-- End Facebook Pixel Code -->\n' + tiktokThankyouCode);
        fs.writeFileSync(file, content);
    }
}

console.log("TikTok pixel logic restored!");
