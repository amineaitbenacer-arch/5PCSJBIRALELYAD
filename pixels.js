/* FingerCare pixels: fire instantly from cache, then refresh IDs from admin. */
(function () {
    var injectedFb = {};
    var injectedTt = {};
    var injectedSnap = {};

    function injectFacebook(pixelId, isSecondary) {
        if (!pixelId || injectedFb[pixelId]) return;
        injectedFb[pixelId] = true;
        if (!window.fbq) {
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
        }
        window.fbq('init', pixelId);
        if (!isSecondary) window.fbq('track', 'PageView');
    }

    function injectTikTok(pixelId) {
        if (!pixelId || injectedTt[pixelId]) return;
        injectedTt[pixelId] = true;
        !function (w, d, t) {
            w.TiktokAnalyticsObject = t;
            var ttq = w[t] = w[t] || [];
            ttq.methods = ["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];
            ttq.setAndDefer = function (obj, method) {
                obj[method] = function () { obj.push([method].concat(Array.prototype.slice.call(arguments, 0))); };
            };
            for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
            ttq.instance = function (id) {
                var inst = ttq._i[id] || [];
                for (var n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(inst, ttq.methods[n]);
                return inst;
            };
            ttq.load = function (id, opts) {
                var url = "https://analytics.tiktok.com/i18n/pixel/events.js";
                ttq._i = ttq._i || {};
                ttq._i[id] = [];
                ttq._i[id]._u = url;
                ttq._t = ttq._t || {};
                ttq._t[id] = +new Date;
                ttq._o = ttq._o || {};
                ttq._o[id] = opts || {};
                var script = d.createElement("script");
                script.type = "text/javascript";
                script.async = true;
                script.src = url + "?sdkid=" + id + "&lib=" + t;
                var first = d.getElementsByTagName("script")[0];
                first.parentNode.insertBefore(script, first);
            };
        }(window, document, 'ttq');
        window.ttq.load(pixelId, { auto_advanced_matching: true });
        window.ttq.page();
    }

    function injectSnap(pixelId) {
        if (!pixelId || injectedSnap[pixelId] || window.snaptr) return;
        injectedSnap[pixelId] = true;
        (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function(){
            a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';var r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];u.parentNode.insertBefore(r,u);
        })(window, document, 'https://sc-static.net/scevent.min.js');
        window.snaptr('init', pixelId);
        window.snaptr('track', 'PAGE_VIEW');
    }

    function applyPixels(s) {
        if (!s) return;
        var fb1 = (s.fb_pixel_1 || s.fb_pixel_id || '').trim();
        var fb2 = (s.fb_pixel_2 || '').trim();
        var tt = (s.tiktok_pixel || s.tiktok_pixel_id || '').trim();
        var snap = (s.snapchat_pixel || '').trim();
        if (fb1) injectFacebook(fb1, false);
        if (fb2 && fb2 !== fb1) injectFacebook(fb2, true);
        if (tt) injectTikTok(tt);
        if (snap) injectSnap(snap);
    }

    var TIKTOK_PIXEL_ID = 'DARTHQRC77U5PB60B1R0';
    injectTikTok(TIKTOK_PIXEL_ID);

    try {
        var cached = localStorage.getItem('fc_pixel_settings');
        if (cached) applyPixels(JSON.parse(cached));
    } catch (e) {}

    window.FC_PIXELS_READY = fetch('/api/settings')
        .then(function (res) { return res.json(); })
        .then(function (data) {
            var s = (data && data.settings) || {};
            try { localStorage.setItem('fc_pixel_settings', JSON.stringify(s)); } catch (e) {}
            applyPixels(s);
            return s;
        })
        .catch(function () { return {}; });
})();
