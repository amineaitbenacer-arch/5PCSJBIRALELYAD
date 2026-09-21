const fs = require('fs');

const pixelId = '920421574121847';

const fbPixelCode = `
  <!-- Facebook Pixel Code -->
  <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
  </script>
  <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/></noscript>
  <!-- End Facebook Pixel Code -->
`;

const files = [
    'index.html',
    'thankyou.html',
    'public/index.html',
    'public/thankyou.html'
];

for (const file of files) {
    if (!fs.existsSync(file)) continue;
    let content = fs.readFileSync(file, 'utf8');
    
    // Simple regex to replace the dynamic script block for index
    content = content.replace(/<!-- Dynamic Tracking Pixels.*?initTrackingPixels\(\);\s*<\/script>/ms, fbPixelCode);
    
    // For thankyou page, we also need to replace the dynamic block
    content = content.replace(/<!-- Dynamic Tracking Pixels.*?loadOrderDetails\(\);\s*\}\)\(\);\s*<\/script>/ms, fbPixelCode + `\n  <script>\n    // Static Load Order Details\n    loadOrderDetails();\n  </script>`);
    
    fs.writeFileSync(file, content);
}
console.log("Patched files");
