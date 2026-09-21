const fs = require('fs');

const thankyouTrackingCode = `
  <!-- Global Dynamic Pixels Purchase (Facebook, TikTok, Snapchat) -->
  <script>
    async function initAllPurchasePixels() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!data.success || !data.settings) return;

        const s = data.settings;
        const fb1 = s.fb_pixel_1 || s.fb_pixel_id;
        const fb2 = s.fb_pixel_2;
        const tt = s.tiktok_pixel || s.tiktok_pixel_id;
        const snap = s.snapchat_pixel;

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

        // Facebook Purchase
        if (fb1 || fb2) {
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          if (fb1) { 
            fbq('init', fb1); 
            fbq('trackSingle', fb1, 'Purchase', { currency: 'MAD', value: Number(price) }, orderId ? { eventID: 'order_' + orderId } : {});
            console.log("✅ FB Pixel 1 Purchase", fb1); 
          }
          if (fb2) { 
            fbq('init', fb2); 
            fbq('trackSingle', fb2, 'Purchase', { currency: 'MAD', value: Number(price) }, orderId ? { eventID: 'order_' + orderId } : {});
            console.log("✅ FB Pixel 2 Purchase", fb2); 
          }
        }

        // TikTok CompletePayment
        if (tt) {
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
            ttq.load(tt);
            ttq.page();
          }(window, document, 'ttq');

          const ttEventParams = { value: Number(price), currency: 'MAD', content_type: 'product', content_name: 'AntiChoc Protection' };
          const ttOptions = orderId ? { event_id: 'order_' + orderId } : {};
          ttq.track('CompletePayment', ttEventParams, ttOptions);
          console.log("✅ TikTok Purchase", tt);
        }

        // Snapchat PURCHASE
        if (snap) {
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
          {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
          r.src=n;var u=t.getElementsByTagName(s)[0];
          u.parentNode.insertBefore(r,u);})(window,document,
          'https://sc-static.net/scevent.min.js');
          
          snaptr('init', snap);
          snaptr('track', 'PURCHASE', { currency: 'MAD', price: Number(price), transaction_id: orderId ? 'order_' + orderId : undefined });
          console.log("✅ Snapchat Purchase", snap);
        }

      } catch (err) {
        console.error("Failed to load global pixels:", err);
      }
    }
    initAllPurchasePixels();
  </script>
`;

function patchThankyouFiles() {
    const files = ['thankyou.html', 'public/thankyou.html'];
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove the static fb code and dynamic tiktok code
        content = content.replace(/<!-- Facebook Pixel Code -->[\s\S]*?<!-- End Facebook Pixel Code -->/ms, '');
        content = content.replace(/<!-- Dynamic TikTok Pixel CompletePayment -->[\s\S]*?initTikTokPurchase\(\);\s*<\/script>/ms, '');
        // Also remove the previous static purchase patch I added
        content = content.replace(/<!-- End Facebook Pixel Code -->\s*<script>\s*\/\/\s*Firing Purchase Event[\s\S]*?<\/script>/ms, '');
        
        // Add the new global code right before </head>
        content = content.replace('</head>', thankyouTrackingCode + '\n</head>');
        
        fs.writeFileSync(file, content);
        console.log("Patched", file);
    });
}
patchThankyouFiles();
