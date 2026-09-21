/* ==========================================================================
   AntiChoc Protect® - Interactive Marketing & COD Logic JavaScript
   ========================================================================== */

// Global State
let selectedPack = {
    id: 2,
    name: "طقم 4 قطع (2 للبارد + 2 للسخون) - الأكثر طلباً ⭐",
    price: 249
};

// Moroccan Cities & Real Purchase Notification Data
const moroccanCities = ["الدار البيضاء", "الرباط", "فاس", "مراكش", "طنجة", "أكادير", "مكناس", "وجدة", "القنيطرة", "تطوان", "تمارة", "آسفي", "الجديدة", "بني ملال"];
const buyerNames = ["محمد العبدلاوي", "فاطمة الزهراء", "ياسين المرابط", "خديجة الفاسي", "عبد العالي السوسي", "سناء البقالي", "أمين العلوي", "رشيد التازي", "مريم الناصري", "عمر الخطابي"];

document.addEventListener('DOMContentLoaded', () => {
    initCountdownTimer();
    initStockDecrement();
    schedulePurchaseToasts();
});

/* --------------------------------------------------------------------------
   1. Image Gallery Switcher
   -------------------------------------------------------------------------- */
function switchMainImage(src) {
    const mainImg = document.getElementById('main-hero-img');
    if (mainImg) {
        mainImg.src = src;
    }
    document.querySelectorAll('.thumb').forEach(thumb => {
        if (thumb.src === src) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

/* --------------------------------------------------------------------------
   2. Offer Selector System
   -------------------------------------------------------------------------- */
function selectOffer(offerId, price, packName) {
    selectedPack = { id: offerId, name: packName, price: price };
    
    // Update offer cards visual state
    for (let i = 1; i <= 3; i++) {
        const card = document.getElementById(`offer-card-${i}`);
        const btn = card.querySelector('.offer-select-btn');
        if (i === offerId) {
            card.classList.add('active');
            if (btn) {
                btn.textContent = "العرض المختار حالياً ✓";
                btn.className = "btn btn-accent offer-select-btn";
            }
        } else {
            card.classList.remove('active');
            if (btn) {
                btn.textContent = "اختر هذا العرض";
                btn.className = "btn btn-outline offer-select-btn";
            }
        }
    }

    // Update Form Order Summary Box
    const packNameEl = document.getElementById('summary-pack-name');
    const priceDisplayEl = document.getElementById('summary-price-display');
    const packInputEl = document.getElementById('selected-pack-input');
    const priceInputEl = document.getElementById('selected-price-input');
    const mobileStickyPriceEl = document.getElementById('mobile-sticky-price');

    if (packNameEl) packNameEl.textContent = packName;
    if (priceDisplayEl) priceDisplayEl.textContent = `${price} درهم`;
    if (packInputEl) packInputEl.value = packName;
    if (priceInputEl) priceInputEl.value = price;
    if (mobileStickyPriceEl) mobileStickyPriceEl.textContent = `${price} درهم`;
}

/* --------------------------------------------------------------------------
   3. Urgency Countdown Timer
   -------------------------------------------------------------------------- */
function initCountdownTimer() {
    let totalSeconds = (14 * 60) + 59;
    const timerDisplay = document.getElementById('countdown-timer');
    
    const interval = setInterval(() => {
        if (totalSeconds <= 0) {
            totalSeconds = (15 * 60); // Reset loop for urgency
        }
        
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        const minStr = String(minutes).padStart(2, '0');
        const secStr = String(seconds).padStart(2, '0');
        
        if (timerDisplay) {
            timerDisplay.textContent = `00:${minStr}:${secStr}`;
        }
        totalSeconds--;
    }, 1000);
}

/* --------------------------------------------------------------------------
   4. Live Stock Decrement Counter
   -------------------------------------------------------------------------- */
function initStockDecrement() {
    let stock = 11;
    const stockEl = document.getElementById('stock-count');
    
    setInterval(() => {
        if (stock > 3) {
            stock--;
            if (stockEl) {
                stockEl.textContent = stock;
                stockEl.style.transform = 'scale(1.3)';
                stockEl.style.color = '#FF3366';
                setTimeout(() => {
                    stockEl.style.transform = 'scale(1)';
                }, 300);
            }
        }
    }, 18000);
}

/* --------------------------------------------------------------------------
   5. Live Purchase Toast Notifications (Social Proof)
   -------------------------------------------------------------------------- */
function schedulePurchaseToasts() {
    setTimeout(showRandomToast, 4000);
    setInterval(showRandomToast, 12000);
}

function showRandomToast() {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const randomName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
    const randomCity = moroccanCities[Math.floor(Math.random() * moroccanCities.length)];
    const packText = selectedPack.id === 2 ? "طقم 4 قطع" : "طقم 2 قطع";

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fa-solid fa-bag-shopping"></i>
        </div>
        <div class="toast-content">
            <h5>طلب جديد للتو! 🎉</h5>
            <p>قام <strong>${randomName}</strong> من <strong>${randomCity}</strong> بطلب ${packText}</p>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}

/* --------------------------------------------------------------------------
   6. COD Express Order Submission Handler
   -------------------------------------------------------------------------- */
function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById('full-name').value.trim();
    const phone = document.getElementById('phone-number').value.trim();
    const city = document.getElementById('city').value;
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !city || !address) {
        alert("يرجى ملء جميع الحقول المطلوبة بشكل صحيح.");
        return;
    }

    // Save order data to localStorage
    const orderData = {
        name: name,
        phone: phone,
        city: city,
        address: address,
        pack: selectedPack.name,
        price: selectedPack.price
    };
    localStorage.setItem('antichoc_order', JSON.stringify(orderData));

    // Redirect to Thank You Page
    window.location.href = 'thankyou.html';
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('active');
    }
    // Reset form
    document.getElementById('cod-form').reset();
}

/* --------------------------------------------------------------------------
   7. WhatsApp Direct Order Generator
   -------------------------------------------------------------------------- */
function orderViaWhatsApp() {
    const name = document.getElementById('full-name').value.trim() || 'زبون';
    const phone = document.getElementById('phone-number').value.trim() || 'غير محدد';
    const city = document.getElementById('city').value || 'غير محددة';
    const address = document.getElementById('address').value.trim() || 'غير محدد';

    const message = `سلام عليكم، بغيت نطلب عازل تسرب الكهرباء للشوفو:%0A%0A` +
        `📦 *العرض:* ${encodeURIComponent(selectedPack.name)}%0A` +
        `💰 *الثمن:* ${selectedPack.price} درهم%0A` +
        `👤 *الاسم:* ${encodeURIComponent(name)}%0A` +
        `📞 *الهاتف:* ${encodeURIComponent(phone)}%0A` +
        `📍 *المدينة:* ${encodeURIComponent(city)}%0A` +
        `🏠 *العنوان:* ${encodeURIComponent(address)}%0A%0A` +
        `عافاك أكدو ليا الطلب فـأقرب وقت!`;

    const whatsappUrl = `https://wa.me/212600000000?text=${message}`;
    window.open(whatsappUrl, '_blank');
}

/* --------------------------------------------------------------------------
   8. FAQ Accordion Toggle
   -------------------------------------------------------------------------- */
function toggleFaq(button) {
    const item = button.parentElement;
    item.classList.toggle('active');
}

/* Utility Security Helper */
function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}
