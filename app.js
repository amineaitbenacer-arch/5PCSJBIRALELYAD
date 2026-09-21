/* ==========================================================================
   AntiChoc Protect® - Mobile E-Commerce JavaScript Application
   ========================================================================== */

// Selected Bundle State: 1 = 2 PCS (179 DH), 2 = 4 PCS (249 DH)
let currentBundle = {
    id: 1,
    name: 'طقم الحماية الأساسي (2 قطع) 🛡️',
    price: 179
};

// Global Image Fallback Handler (Works if images are in /images/ or in root /)
window.addEventListener('error', function(e) {
    if (e.target && e.target.tagName === 'IMG') {
        const img = e.target;
        if (!img.dataset.retried) {
            img.dataset.retried = 'true';
            if (img.src.includes('/images/')) {
                img.src = img.src.replace('/images/', '/');
            } else {
                const parts = img.src.split('/');
                const filename = parts.pop();
                img.src = parts.join('/') + '/images/' + filename;
            }
        }
    }
}, true);

document.addEventListener('DOMContentLoaded', () => {
    // Initialize default bundle state
    selectModalPack(1);
    startHeaderCountdown();
});

/* --------------------------------------------------------------------------
   Countdown Scarcity Timer for Header Announcement (CVR Booster)
   -------------------------------------------------------------------------- */
function startHeaderCountdown() {
    let totalSeconds = 14 * 60 + 59; // 14 mins 59 secs default
    const timerEl = document.getElementById('header-timer');
    if (!timerEl) return;

    setInterval(() => {
        if (totalSeconds <= 0) {
            totalSeconds = 14 * 60 + 59; // Reset to keep urgency active
        }
        totalSeconds--;
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        timerEl.textContent = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }, 1000);
}

/* --------------------------------------------------------------------------
   1. Image Gallery Thumb Switcher
   -------------------------------------------------------------------------- */
function changeImage(thumbEl) {
    const mainImg = document.getElementById('hero-main-img');
    if (mainImg) {
        mainImg.src = thumbEl.src;
    }
    document.querySelectorAll('.thumb-gallery .thumb-img').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
}

/* --------------------------------------------------------------------------
   2. Bottom Sheet Checkout Open / Close & Offer Drawer
   -------------------------------------------------------------------------- */
function openSheet() {
    const sheet = document.getElementById('sheetBg');
    if (sheet) sheet.classList.add('open');
    selectModalPack(currentBundle.id);
}

function closeSheet(e) {
    if (e && e.target && e.target.id !== 'sheetBg' && !e.target.classList.contains('close-btn')) return;
    const sheet = document.getElementById('sheetBg');
    if (sheet) sheet.classList.remove('open');
    const drawer = document.getElementById('sheet-offers-drawer');
    const trigger = document.getElementById('sheet-offer-trigger');
    if (drawer) drawer.classList.remove('open');
    if (trigger) trigger.classList.remove('active');
}

function toggleSheetOfferDrawer() {
    const drawer = document.getElementById('sheet-offers-drawer');
    const trigger = document.getElementById('sheet-offer-trigger');
    if (drawer) {
        drawer.classList.toggle('open');
    }
    if (trigger) {
        trigger.classList.toggle('active');
    }
}

function openOrderModal(offerId) {
    if (offerId) {
        selectModalPack(offerId);
    }
    openSheet();
}

function closeOrderModal() {
    closeSheet();
}

/* --------------------------------------------------------------------------
   3. Bundle Selector (Synchronizes Hero, Final Section & Checkout Drawer)
   -------------------------------------------------------------------------- */
function selectModalPack(packId, fromUserClick) {
    const id = parseInt(packId) || 1;
    let price = 179;
    let oldPrice = 399;
    let saveAmount = 220;
    let name = 'طقم 2 قطع (شوفو واحد) 🛡️';
    let subtext = 'عازل مزدوج (بارد + سخون) • توصيل مجاني 🚚';
    let tag = 'العرض الأساسي';
    const fixedImg = 'images/hero_father_daughter.jpg';

    if (id === 2) {
        price = 249;
        oldPrice = 599;
        saveAmount = 350;
        name = 'باك 4 قطع (2 حمامات) ⚡️';
        subtext = 'حماية لشوفويين • وفرت 350 DH اليوم 🎁';
        tag = '⭐ الأكثر طلباً بالمغرب';
    } else if (id === 3) {
        price = 299;
        oldPrice = 899;
        saveAmount = 600;
        name = 'باك 6 قطع (3 حمامات) 🛡️';
        subtext = 'حماية شاملة لكل الدار • وفرت 600 DH كاش 🔥';
        tag = '🔥 أعلى توفير وأفضل قيمة';
    }
    
    currentBundle = { id: id, price: price, name: name };

    // 1. Update Offer Cards Across Page (Hero & Final Sections)
    const allOfferCards = document.querySelectorAll('.hero-offer-card, .offer-card');
    allOfferCards.forEach((card) => {
        const pack = parseInt(card.getAttribute('data-pack'));
        if (pack === id) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // 2. Update Checkout Drawer Cards (AOV Selector)
    const sodCards = document.querySelectorAll('.sod-card');
    sodCards.forEach((card) => {
        const pack = parseInt(card.getAttribute('data-pack'));
        if (pack === id) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });

    // 3. Update All Price Blocks Dynamically (Hero & Final Section)
    document.querySelectorAll('.price-new-large').forEach(el => {
        el.innerHTML = `${price} <small>درهم</small>`;
    });
    document.querySelectorAll('.price-old-sub').forEach(el => {
        el.textContent = `${oldPrice} درهم`;
    });
    document.querySelectorAll('.price-save-mini').forEach(el => {
        el.textContent = `توفير ${saveAmount} DH`;
    });
    document.querySelectorAll('.price-save-badge').forEach(el => {
        el.textContent = `🎁 وفرت ${saveAmount} درهم اليوم + توصيل مجاني!`;
    });

    // 4. Update All Main CTA Buttons Text & Price
    document.querySelectorAll('.offer-cta-main').forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> ⚡️ اشتري الآن - ${price} DH`;
    });

    // 5. Update Checkout Sheet Selected Offer Display
    const sheetBundleName = document.getElementById('sheet-bundle-name');
    if (sheetBundleName) sheetBundleName.textContent = name;

    const sheetBundleSub = document.getElementById('sheet-bundle-sub');
    if (sheetBundleSub) sheetBundleSub.textContent = subtext;

    const sheetActiveBadge = document.getElementById('sheet-active-badge');
    if (sheetActiveBadge) sheetActiveBadge.textContent = tag;

    const sheetPreviewPrice = document.getElementById('sheet-preview-price');
    if (sheetPreviewPrice) sheetPreviewPrice.textContent = price + ' درهم';

    const sheetPreviewOld = document.getElementById('sheet-preview-old-price');
    if (sheetPreviewOld) sheetPreviewOld.textContent = oldPrice + ' DH';

    const sheetPreviewImg = document.getElementById('sheet-preview-img');
    if (sheetPreviewImg) sheetPreviewImg.src = fixedImg;

    // 6. Update Checkout Total Box & Sticky Bar
    const sheetTotal = document.getElementById('sheet-total-price');
    if (sheetTotal) sheetTotal.textContent = price + ' درهم';

    const stickyNewPrice = document.querySelector('.buy-bar .bar-new');
    if (stickyNewPrice) stickyNewPrice.innerHTML = price + ' <small>درهم</small>';

    const stickyOldPrice = document.querySelector('.buy-bar .bar-old');
    if (stickyOldPrice) stickyOldPrice.textContent = oldPrice + ' درهم';

    // 7. Update AOV Congratulation Banner in Checkout
    const aovCongrats = document.getElementById('sheet-aov-congrats');
    const aovMsg = document.getElementById('sheet-aov-msg');
    if (aovCongrats && aovMsg) {
        if (id === 2) {
            aovCongrats.style.display = 'flex';
            aovMsg.textContent = '⭐ اختيار ذكي! وفرت 350 درهم وحصلت على حماية كاملة لحمامين.';
        } else if (id === 3) {
            aovCongrats.style.display = 'flex';
            aovMsg.textContent = '🔥 أقوى توفير! وفرت 600 درهم وحصلت على حماية قصوى لكافة حمامات المنزل.';
        } else {
            aovCongrats.style.display = 'none';
        }
    }

    // 8. Auto-collapse drawer on customer selection after short smooth feedback
    if (fromUserClick) {
        setTimeout(() => {
            const drawer = document.getElementById('sheet-offers-drawer');
            const trigger = document.getElementById('sheet-offer-trigger');
            if (drawer) drawer.classList.remove('open');
            if (trigger) trigger.classList.remove('active');
        }, 280);
    }
}

function selectPageOffer(offerId) {
    selectModalPack(offerId);
}

/* --------------------------------------------------------------------------
   4. Order Form Submission (COD Confirmation Modal & Backend Fallback)
   -------------------------------------------------------------------------- */
async function handleOrderSubmit(event) {
    event.preventDefault();

    const submitBtn = event.target ? event.target.querySelector('button[type="submit"]') : null;
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';

    const name = document.getElementById('inp-name') ? document.getElementById('inp-name').value.trim() : '';
    const phone = document.getElementById('inp-phone') ? document.getElementById('inp-phone').value.trim() : '';
    const cityInp = document.getElementById('inp-city');
    const city = cityInp ? cityInp.value.trim() : '';
    const addressInp = document.getElementById('inp-address');
    const address = addressInp ? addressInp.value.trim() : city;

    if (!name || !phone || !city) {
        alert("عافاك كمل جميع المعلومات (الاسم، الهاتف والمدينة).");
        return;
    }

    // Phone validation
    const phoneInput = document.getElementById('inp-phone');
    const phoneError = document.getElementById('phone-error');
    // Remove spaces/dashes to count digits accurately
    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 10) {
        if (phoneInput) {
            phoneInput.style.border = '2px solid #ef4444';
            phoneInput.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
        }
        if (phoneError) phoneError.style.display = 'block';
        return;
    } else {
        if (phoneInput) {
            phoneInput.style.border = '';
            phoneInput.style.backgroundColor = '';
        }
        if (phoneError) phoneError.style.display = 'none';
    }

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'جاري تسجيل الطلب... ⏳';
    }

    const fullLocation = address && address !== city ? `${city} - ${address}` : city;
    let orderId = Math.floor(1000 + Math.random() * 9000);

    // 🚀 Send to Vercel API (Background)
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            orderId: orderId,
            name: name,
            phone: phone,
            city: city,
            address: fullLocation,
            offerName: currentBundle.name,
            price: currentBundle.price
        })
    }).catch(err => console.log('Running in local/offline mode:', err));

    // 🚀 Send data to Google Sheets (Background)
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbx-mpVnPpNLIdBDluqbLoAuNoflC26-6HtnUWpYWsPGf0zJmw90p_FG9mgnKdbW4nboiw/exec';
    fetch(GOOGLE_SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
            orderId: orderId,
            name: name,
            phone: phone,
            city: city,
            address: fullLocation,
            offerName: currentBundle.name,
            price: currentBundle.price
        })
    }).catch(err => console.error('Google Sheets Error:', err));

    // Save order details to localStorage for the Thank You page
    const orderData = {
        orderId: orderId,
        name: name,
        phone: phone,
        city: city,
        offerName: currentBundle.name,
        price: currentBundle.price
    };
    localStorage.setItem('ac_last_order', JSON.stringify(orderData));

    // Redirect to Thank You Page instantly but let network requests fire
    setTimeout(() => {
        window.location.href = 'thankyou.html';
    }, 200);
}

function closeSuccessModal() {
    const successModal = document.getElementById('success-modal');
    if (successModal) {
        successModal.classList.remove('active');
    }
    const form = document.getElementById('express-order-form');
    if (form) form.reset();
}

/* --------------------------------------------------------------------------
   5. Floating Scroll to Top & Offers Selector Handler
   -------------------------------------------------------------------------- */
function scrollToTop() {
    const heroOffers = document.querySelector('.hero-offers-wrapper') || document.querySelector('.hero-offers-grid');
    if (heroOffers) {
        heroOffers.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function scrollToOffers() {
    scrollToTop();
}

window.addEventListener('scroll', () => {
    const floatBtn = document.getElementById('floating-top-btn') || document.getElementById('floating-offers-btn');
    if (!floatBtn) return;
    
    // Only show button after scrolling past ~45% of the total page height or 700px
    const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    const scrollThreshold = Math.max(700, docHeight * 0.45);

    if (window.scrollY > scrollThreshold) {
        floatBtn.classList.add('visible');
    } else {
        floatBtn.classList.remove('visible');
    }
});

/* --------------------------------------------------------------------------
   5. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle('active');
}

/* --------------------------------------------------------------------------
   6. Interactive 15-Reviews Slider Pagination
   -------------------------------------------------------------------------- */
let currentReviewPage = 1;
const totalReviewPages = 3;

function setReviewPage(pageIndex) {
    currentReviewPage = pageIndex;
    
    // Hide all pages
    document.querySelectorAll('.review-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.rev-dot').forEach(d => d.classList.remove('active'));

    const activePage = document.getElementById(`review-page-${pageIndex}`);
    const activeDot = document.getElementById(`dot-page-${pageIndex}`);

    if (activePage) activePage.classList.add('active');
    if (activeDot) activeDot.classList.add('active');
}

function nextReviewPage() {
    let next = currentReviewPage + 1;
    if (next > totalReviewPages) next = 1;
    setReviewPage(next);
}

function prevReviewPage() {
    let prev = currentReviewPage - 1;
    if (prev < 1) prev = totalReviewPages;
    setReviewPage(prev);
}

/* Security Helper */
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}
