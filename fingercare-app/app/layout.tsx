import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FingerCare | جبيرة الأصابع الطبية - الحل الطبي والبراتيك",
  description: "جبيرة أصابع طبية عالية الجودة. Pack 5 قطع ب 179 درهم. توصيل مجاني لجميع المدن المغربية. الدفع عند الاستلام.",
  openGraph: {
    title: "FingerCare | جبيرة الأصابع الطبية",
    description: "الحل الطبي والبراتيك لألم الأصابع. توصيل مجاني + الدفع عند الاستلام.",
    images: ["/images/product-action.jpg"],
    type: "website",
    locale: "ar_MA",
  },
  twitter: {
    card: "summary_large_image",
    title: "FingerCare | جبيرة الأصابع الطبية",
    description: "الحل الطبي والبراتيك لألم الأصابع. توصيل مجاني + الدفع عند الاستلام.",
    images: ["/images/product-action.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        {/* Facebook Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2217447118746918');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* TikTok Pixel */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];
                ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];
                ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};
                for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);
                ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};
                ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;
                ttq._o=ttq._o||{};ttq._o[e]=n||{};
                var a=document.createElement("script");a.type="text/javascript";a.async=!0;a.src=r+"?sdkid="+e+"&lib="+t;
                var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(a,s)};
                ttq.load('DAKIFUJC77U98E0UON4G');
                ttq.page();
              }(window, document, 'ttq');
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
