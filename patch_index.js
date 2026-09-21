const fs = require('fs');

const indexTrackingCode = `
  <!-- Global Dynamic Pixels (Facebook, TikTok, Snapchat) -->
  <script>
    async function initAllTrackingPixels() {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!data.success || !data.settings) return;

        const s = data.settings;
        const fb1 = s.fb_pixel_1 || s.fb_pixel_id;
        const fb2 = s.fb_pixel_2;
        const tt = s.tiktok_pixel || s.tiktok_pixel_id;
        const snap = s.snapchat_pixel;

        // Facebook Base Code
        if (fb1 || fb2) {
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          
          if (fb1) { fbq('init', fb1); console.log("✅ FB Pixel 1 Initialized"); }
          if (fb2) { fbq('init', fb2); console.log("✅ FB Pixel 2 Initialized"); }
          fbq('track', 'PageView');
        }

        // TikTok Base Code
        if (tt) {
          !function (w, d, t) {
            w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=r+"?sdkid="+e+"&lib="+t;var c=document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a,c)};
            ttq.load(tt);
            ttq.page();
          }(window, document, 'ttq');
          console.log("✅ TikTok Pixel Initialized");
        }

        // Snapchat Base Code
        if (snap) {
          (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
          {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
          a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
          r.src=n;var u=t.getElementsByTagName(s)[0];
          u.parentNode.insertBefore(r,u);})(window,document,
          'https://sc-static.net/scevent.min.js');
          
          snaptr('init', snap);
          snaptr('track', 'PAGE_VIEW');
          console.log("✅ Snapchat Pixel Initialized");
        }

      } catch (err) {
        console.error("Failed to load global pixels:", err);
      }
    }
    initAllTrackingPixels();
  </script>
`;

function patchIndexFiles() {
    const files = ['index.html', 'public/index.html'];
    files.forEach(file => {
        if (!fs.existsSync(file)) return;
        let content = fs.readFileSync(file, 'utf8');
        
        // Remove the static fb code and dynamic tiktok code
        content = content.replace(/<!-- Facebook Pixel Code -->[\s\S]*?<!-- End Facebook Pixel Code -->/ms, '');
        content = content.replace(/<!-- Dynamic TikTok Pixel -->[\s\S]*?initTikTokPixel\(\);\s*<\/script>/ms, '');
        
        // Add the new global code right before </head>
        content = content.replace('</head>', indexTrackingCode + '\n</head>');
        
        fs.writeFileSync(file, content);
        console.log("Patched", file);
    });
}
patchIndexFiles();
