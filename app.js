/* ==========================================================================
   FingerCare 🩹 - Mobile E-Commerce JavaScript Application
   ========================================================================== */

// Selected Bundle: 1 = 5 PCS (179 DH), 2 = 10 PCS (279 DH)
let currentBundle = {
    id: 1,
    name: 'باقة 5 قطع (يد واحدة)',
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
    selectModalPack(1);
});

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
    let id = parseInt(packId, 10) || 1;
    if (id !== 2) id = 1;

    let price = 179;
    let oldPrice = 399;
    let saveAmount = 220;
    let name = 'باقة 5 قطع (يد واحدة)';
    let subtext = '5 قطع للاستبدال عند الحاجة • توصيل مجاني';
    let tag = 'العرض الأساسي';
    const fixedImg = 'images/premium-packaging.jpg';

    if (id === 2) {
        price = 279;
        oldPrice = 599;
        saveAmount = 320;
        name = 'باقة 10 قطع (لليدين)';
        subtext = '10 قطع لليدين • توفير 320 درهماً';
        tag = 'توفير أكبر';
    }

    currentBundle = { id: id, price: price, name: name };

    document.querySelectorAll('.hero-offer-card, .offer-card').forEach((card) => {
        const pack = parseInt(card.getAttribute('data-pack'), 10);
        card.classList.toggle('selected', pack === id);
    });

    document.querySelectorAll('.sod-card').forEach((card) => {
        const pack = parseInt(card.getAttribute('data-pack'), 10);
        card.classList.toggle('selected', pack === id);
    });

    document.querySelectorAll('.price-new-large').forEach(el => {
        el.innerHTML = `${price} <small>درهم</small>`;
    });
    document.querySelectorAll('.price-old-sub').forEach(el => {
        el.textContent = `${oldPrice} درهم`;
    });
    document.querySelectorAll('.price-save-mini').forEach(el => {
        el.textContent = `توفير ${saveAmount} درهم`;
    });
    document.querySelectorAll('.price-save-badge').forEach(el => {
        el.textContent = `توفير ${saveAmount} درهماً + توصيل مجاني`;
    });

    document.querySelectorAll('.offer-cta-main').forEach(btn => {
        btn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> اطلب الآن - ${price} درهم`;
    });
    const buyBtn = document.querySelector('.buy-bar .buy-btn');
    if (buyBtn) buyBtn.innerHTML = `اطلب الآن — ${price} درهم`;

    const sheetBundleName = document.getElementById('sheet-bundle-name');
    if (sheetBundleName) sheetBundleName.textContent = name;

    const sheetBundleSub = document.getElementById('sheet-bundle-sub');
    if (sheetBundleSub) sheetBundleSub.textContent = subtext;

    const sheetActiveBadge = document.getElementById('sheet-active-badge');
    if (sheetActiveBadge) sheetActiveBadge.textContent = tag;

    const sheetPreviewPrice = document.getElementById('sheet-preview-price');
    if (sheetPreviewPrice) sheetPreviewPrice.textContent = price + ' درهم';

    const sheetPreviewOld = document.getElementById('sheet-preview-old-price');
        if (sheetPreviewOld) sheetPreviewOld.textContent = oldPrice + ' درهم';

    const sheetPreviewImg = document.getElementById('sheet-preview-img');
    if (sheetPreviewImg) sheetPreviewImg.src = fixedImg;

    const sheetTotal = document.getElementById('sheet-total-price');
    if (sheetTotal) sheetTotal.textContent = price + ' درهم';

    const stickyNewPrice = document.querySelector('.buy-bar .bar-new');
    if (stickyNewPrice) stickyNewPrice.innerHTML = price + ' <small>درهم</small>';

    const stickyOldPrice = document.querySelector('.buy-bar .bar-old');
    if (stickyOldPrice) stickyOldPrice.textContent = oldPrice + ' درهم';

    const aovCongrats = document.getElementById('sheet-aov-congrats');
    const aovMsg = document.getElementById('sheet-aov-msg');
    if (aovCongrats && aovMsg) {
        if (id === 2) {
            aovCongrats.style.display = 'flex';
            aovMsg.textContent = 'تم اختيار باقة 10 قطع. التوفير: 320 درهماً.';
        } else {
            aovCongrats.style.display = 'none';
        }
    }

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
        alert("يرجى إكمال جميع المعلومات (الاسم، الهاتف، والمدينة).");
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

    // Save order details to localStorage for the Thank You page
    const orderData = {
        orderId: orderId,
        name: name,
        phone: phone,
        city: city,
        offerName: currentBundle.name,
        price: currentBundle.price
    };
    localStorage.setItem('fc_last_order', JSON.stringify(orderData));
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
    const heroOffers = document.querySelector('.hero-offers-wrapper') || document.querySelector('.price-block');
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
   6. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function toggleFaq(btn) {
    const item = btn.parentElement;
    item.classList.toggle('active');
}

/* --------------------------------------------------------------------------
   7. Interactive reviews slider pagination
   -------------------------------------------------------------------------- */
let currentReviewPage = 1;
const totalReviewPages = 4;

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


