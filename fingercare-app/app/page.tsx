'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './components/BottomSheet';
import ExitPopup from './components/ExitPopup';

const PRODUCT_IMAGES = [
  { id: 1, src: '/images/product-action.jpg', alt: 'جبيرة الأصابع أثناء الاستخدام' },
  { id: 2, src: '/images/premium-packaging.jpg', alt: 'تغليف احترافي وطبي' },
  { id: 3, src: '/images/material-closeup.jpg', alt: 'تفاصيل المواد عالية الجودة' },
  { id: 4, src: '/images/happy-customer.jpg', alt: 'عميلة سعيدة بالنتائج' },
];

const OFFERS = [
  { id: 1, name: 'Pack 5 قطع', pieces: 5, price: 179, desc: 'جبائر لليد الواحدة 🩹', popular: false },
  { id: 2, name: 'Pack 10 قطع', pieces: 10, price: 279, desc: 'حماية كاملة لليدين ⭐', popular: true },
  { id: 3, name: 'Pack 15 قطع', pieces: 15, price: 349, desc: 'باك العائلة الكامل 🔥', popular: false },
];

const REVIEWS_PAGE_1 = [
  { name: 'أم أحمد - الدار البيضاء 📍', avatar: '👩‍👧', text: '"كنت كنعاني من ألم فصوابعي مللي كنطيب وكنخدم. من مللي بديت نستعمل هاد الجبائر، الألم نقص بزاف والحمد لله. المنتج ممتاز وخفيف بزاف."' },
  { name: 'يوسف المراكشي - مراكش 📍', avatar: '👨‍💼', text: '"أنا حرفي وصوابعي دايما كيتعرضو للإصابات. هاد الجبائر ساعدوني بزاف فالتعافي. الجودة عالية والتوصيل كان سريع فـ 24 ساعة."' },
  { name: 'فاطمة الزهراء - فاس 📍', avatar: '👩‍⚕️', text: '"جربت بزاف ديال المنتجات قبل، هادي هي الأحسن. المادة مريحة بزاف وما كتضايقش. الثمن معقول مقارنة بالصيدليات."' },
  { name: 'كريم التازي (معالج فيزيائي) - الرباط 📍', avatar: '🛠️', text: '"كمعالج فيزيائي كنصح بهاد الجبائر لكل واحد عندو مشكل فالأصابع. الألومنيوم خفيف والفوم مريح بزاف. منتج يستاهل."' },
  { name: 'خديجة العلمي - القنيطرة 📍', avatar: '👩‍💼', text: '"شريت الباك ديال 10 قطع، 5 ليا و5 للوالدة. راحة بال كبيرة بصراحة والتوصيل كان مجاني."' },
];

const REVIEWS_PAGE_2 = [
  { name: 'عبد العالي - أكادير 📍', avatar: '👨‍💻', text: '"الجبيرة ما كتأثرش على الحركة ديال الصبع، غير كتثبتو وكتخفف الألم. منتج ناجح 100%."' },
  { name: 'رشيد التطواني - تطوان 📍', avatar: '👴', text: '"ممتنون لكم بزاف، التعامل راقي والتوصيل مجاني وسريع جداً. الجودة ممتازة."' },
  { name: 'مريم البقالي - طنجة 📍', avatar: '👩‍🏫', text: '"كنت ديما كنشري من الصيدلية بثمن غالي. هاد الجبائر أحسن وأرخص. الألومنيوم متين والفوم مريح."' },
  { name: 'سفيان الناصري - سلا 📍', avatar: '👦', text: '"5 قطع بهاد الثمن فرصة ما كتتعاودش. الجودة عالية وكتحس بفرق كبير من أول استعمال."' },
  { name: 'أمينة السلاوي - المحمدية 📍', avatar: '👩‍⚕️', text: '"جبائر ممتازة، ساعدو الوالد ديالي بزاف فالتعافي من الإصابة. كنصح بيهم لكل عائلة."' },
];

const REVIEWS_PAGE_3 = [
  { name: 'ياسين المرابط - مكناس 📍', avatar: '🧔', text: '"السلعة ممتازة ومطابقة للصور تماماً. المعاينة قبل الدفع كتعطي ثقة كبيرة ف المنتج."' },
  { name: 'إلهام الدكالي - الجديدة 📍', avatar: '👩‍🍳', text: '"شريت هاد الجبائر بعدما نصحتني صاحبتي. فعلاً مريحة بزاف وكتخفف الألم من أول يوم."' },
  { name: 'محمد البكاري - بني ملال 📍', avatar: '👨‍🌾', text: '"منتج عالي الجودة والألومنيوم صلب 100%. التوصيل كان سريع جداً فـ 24 ساعة."' },
  { name: 'نجاة برادة - وجدة 📍', avatar: '🧕', text: '"شكراً بزاف على المصداقية والسرعة ف التوصيل. راحة البال وتخفيف الألم لا يقدران بثمن."' },
  { name: 'حسن الخمليشي - الحسيمة 📍', avatar: '👨‍✈️', text: '"باك 10 قطع ممتاز جداً ووفرت فيه المبلغ. منتج ضروري عند كل واحد عندو مشكل فصوابعو."' },
];

const ALL_REVIEWS = [REVIEWS_PAGE_1, REVIEWS_PAGE_2, REVIEWS_PAGE_3];

const FAQS = [
  { q: 'واش التوصيل مجاني فعلاً؟ 🚚', a: 'نعم 100%! التوصيل مجاني لجميع المدن المغربية بدون استثناء. ما كتخلص حتى درهم زايد. التوصيل بين 24 و 72 ساعة.' },
  { q: 'كيفاش نخلص؟ واش خاصني نخلص مقدماً؟ 💳', a: 'لا أبداً! الدفع عند الاستلام. ما كتخلصش حتى توصلك السلعة ليدك. حل الطرد وتفحص الجودة عاد خلص الموزع!' },
  { q: 'واش مناسبة لكل الأصابع والأحجام؟ ✋', a: 'نعم! الجبائر قابلة للتعديل والتشكيل ومناسبة لجميع أحجام الأصابع. الألومنيوم مرن وكتقدر تعدلو حسب الصبع ديالك.' },
  { q: 'واش هاد الجبائر كتخدم فعلاً ولا غير بلاسيبو؟ 🩹', a: 'أكيد كتخدم! جبائر الأصابع من ألومنيوم طبي مع فوم مريح كتثبت الصبع فالوضعية الصحيحة وكتساعد فالتعافي. مستعملة من طرف المعالجين الفيزيائيين.' },
  { q: 'شحال ديال الوقت خاصني نلبسها فاليوم؟ ⏰', a: 'عادة كتلبسها بين 2 و 8 ساعات فاليوم حسب الحالة. ممكن تلبسها فالنهار وقت الخدمة ولا فالليل وقت النعاس. ساهلة ومريحة.' },
  { q: 'واش كاين شي ضمان على المنتج؟ 🏆', a: 'بكل تأكيد! نحن نثق في جودة منتجنا 100%. تقدر تتفحص المنتج قبل ما تخلص. إذا ما عجبكش، ترجعو بدون ما تخلص شي حاجة.' },
];

export default function Home() {
  const [mainImage, setMainImage] = useState(PRODUCT_IMAGES[0]);
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[0]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const openBottomSheet = useCallback(() => setIsBottomSheetOpen(true), []);

  const toggleFaq = useCallback((index: number) => {
    setOpenFaq(prev => prev === index ? null : index);
  }, []);

  return (
    <div className="main-content">
      {/* ===== MARQUEE BANNER ===== */}
      <div className="marquee-container">
        <div className="marquee-text">
          🚚 توصيل مجاني لجميع المدن المغربية &nbsp;&nbsp;|&nbsp;&nbsp; 💳 الدفع عند الاستلام &nbsp;&nbsp;|&nbsp;&nbsp; 🤝 المعاينة قبل الدفع &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 توصيل مجاني لجميع المدن المغربية &nbsp;&nbsp;|&nbsp;&nbsp; 💳 الدفع عند الاستلام &nbsp;&nbsp;|&nbsp;&nbsp; 🤝 المعاينة قبل الدفع
        </div>
      </div>

      {/* ===== NAVBAR ===== */}
      <nav className="luxury-navbar">
        <div className="nav-brand">
          <span style={{ fontSize: 22 }}>🩹</span>
          <h1 className="nav-title">Finger<span className="nav-title-accent">Care</span></h1>
        </div>
        <div className="nav-offer-badge pulse-badge">
          🔥 5 قطع بـ 179 درهم
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section>
        {/* Warning Pill */}
        <div className="warning-pill-wrap">
          <div className="warning-pill pulse-danger">
            🚨 واش صوابعك كيوجعوك وما كتقدرش تحركهم؟
          </div>
        </div>

        {/* Main Image */}
        <div className="hero-image-wrap">
          <div className="hero-badge-corner">وصل حديثاً</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
            >
              <Image
                src={mainImage.src}
                alt={mainImage.alt}
                fill
                priority
                sizes="100vw"
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Thumbnails */}
        <div className="thumbnail-grid">
          {PRODUCT_IMAGES.map((img) => (
            <div
              key={img.id}
              className={`thumbnail ${mainImage.id === img.id ? 'active' : ''}`}
              onClick={() => setMainImage(img)}
              role="button"
              tabIndex={0}
            >
              <Image src={img.src} alt={img.alt} width={120} height={120} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>

        {/* Dark Bar */}
        <div className="hero-dark-bar">
          صحتك تستاهل الاهتمام — خلي صوابعك يرتاحو ويتعافو 🩹🛡️
        </div>

        {/* Product Title */}
        <div className="hero-title-area">
          <span className="hero-title-badge">💚 الحل الطبي الأول</span>
          <h2 className="prod-name">جبيرة الأصابع الطبية <br/> الحل البراتيك والمريح</h2>
        </div>

        {/* Price Block */}
        <div className="price-block">
          <div className="price-row">
            <span className="price-new">179 <small>درهم</small></span>
          </div>
          <div className="price-save-badge">
            🎁 توصيل مجاني + الدفع عند الاستلام!
          </div>
        </div>

        {/* ===== INLINE OFFER SELECTOR ===== */}
        <div className="offers-wrapper">
          <div className="offers-header">
            <span className="offers-label">📦 اختر الباقة المناسبة ليك:</span>
            <span className="offers-stock-badge">⚡ مخزون محدود</span>
          </div>
          <div className="offers-grid">
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className={`offer-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''}`}
                onClick={() => setSelectedOffer(offer)}
                role="button"
                tabIndex={0}
              >
                {offer.popular && <div className="offer-badge-top">⭐ الأكثر طلباً</div>}
                {offer.id === 3 && <div className="offer-badge-top offer-badge-green">🔥 عرض قوي جداً</div>}
                <div className="offer-radio">{selectedOffer.id === offer.id && <div className="offer-radio-inner" />}</div>
                <div className="offer-info">
                  <div className="offer-title">{offer.name} {offer.id === 1 ? '🩹' : offer.id === 2 ? '⚡️' : '🛡️'}</div>
                  <div className="offer-sub">{offer.desc}</div>
                </div>
                <div className="offer-price">
                  <span className={`offer-price-new ${offer.popular ? 'highlight' : ''}`}>{offer.price} DH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="cta-block">
          <button className="main-cta pulse-cta" onClick={openBottomSheet} id="hero-buy-btn">
            🛒 اشتري الآن - {selectedOffer.price} DH
          </button>
          <div className="cta-reassurance">
            <span>🛡️ ضمان الجودة 100%</span>
            <span className="dot">•</span>
            <span>🚚 توصيل مجاني</span>
            <span className="dot">•</span>
            <span>🤝 المعاينة قبل الدفع</span>
          </div>
        </div>

        {/* Trust Cadre */}
        <div className="trust-cadre">
          <div className="trust-cadre-header">🛡️ الضمان الذهبي للشراء من FingerCare</div>
          <div className="trust-cadre-grid">
            <div className="trust-cadre-card">
              <div className="trust-cadre-icon">🚚</div>
              <div>
                <h4>توصيل مجاني 🚚</h4>
                <p>توصيل سريع ومجاني 100% حتى ل باب الدار فجميع مدن المغرب 🇲🇦</p>
              </div>
            </div>
            <div className="trust-cadre-card">
              <div className="trust-cadre-icon">🤝</div>
              <div>
                <h4>المعاينة قبل الدفع 🤝</h4>
                <p>حل الطرد، تفحص الجودة قدام الموزع عاد خلص! 📦✨</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== EMOTIONAL PAIN SECTION (DARK THEME) ===== */}
      <section className="dark-section">
        <div className="dark-section-inner">
          <div className="section-icon-wrap pulse-danger">⚠️</div>
          <h2>واش كتعاني من هاد المشاكل فصوابعك؟ 😰</h2>
          <p className="section-sub">بلا علاج مناسب، المشكل كيتفاقم وكيأثر على حياتك اليومية كلها!</p>
          
          <div className="pain-grid">
            <div className="pain-item">
              <span className="pain-icon">⚡️</span>
              <div>
                <h4>ألم وتيبيس فالأصابع عند الحركة</h4>
                <p>ما كتقدرش تقبض حوايجك ولا تخدم بشكل عادي بسبب الألم المستمر فالصوابع.</p>
              </div>
            </div>
            <div className="pain-item">
              <span className="pain-icon">🤕</span>
              <div>
                <h4>التواء أو إصابة ما كتبراش</h4>
                <p>إذا ما ثبتيش الصبع المصاب، التعافي كياخد وقت طويل بزاف وكيزيد المشكل.</p>
              </div>
            </div>
            <div className="pain-item">
              <span className="pain-icon">💊</span>
              <div>
                <h4>مصاريف الطبيب والصيدلية غالية</h4>
                <p>الزيارات المتكررة للطبيب وشراء الأدوية كيكلفو بزاف. الحل الذكي هو الوقاية!</p>
              </div>
            </div>
          </div>

          <div className="conclusion-box">
            <h3>💡 فكر فيها للحظة... 🧠</h3>
            <p>بثمن بسيط جداً، تشتري <strong>راحة البال والتعافي السريع</strong> لصوابعك. درهم وقاية خير من قنطار علاج! 🩹</p>
          </div>
        </div>
      </section>

      {/* ===== SOLUTION SECTION ===== */}
      <section className="solution-section">
        <span className="section-badge success">✅ الحل الطبي</span>
        <h2>جبيرة FingerCare — الحل البراتيك اللي كتحتاج 🩹✨</h2>
        <p className="section-sub-text">ألومنيوم طبي خفيف + فوم مريح = دعم قوي بلا إزعاج</p>

        <div className="features-grid">
          <div className="feat-card green-accent">
            <div className="feat-icon green">🛡️</div>
            <div>
              <h4>تثبيت وحماية فورية للصبع 🩹</h4>
              <p>كتثبت الصبع فالوضعية الصحيحة باش يتعافا بسرعة وبدون ألم.</p>
            </div>
          </div>
          <div className="feat-card gold-accent">
            <div className="feat-icon gold">😌</div>
            <div>
              <h4>راحة خيالية طول اليوم 🧘‍♂️</h4>
              <p>الفوم المريح كيخليك تلبسها ساعات طويلة بدون أي إزعاج ولا ضغط.</p>
            </div>
          </div>
          <div className="feat-card terra-accent">
            <div className="feat-icon terra">✋</div>
            <div>
              <h4>مناسبة لجميع الأصابع والأحجام 🚿</h4>
              <p>الألومنيوم مرن وقابل للتشكيل. كتناسب كل صبع وكل حجم بسهولة.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST & BENEFITS (DARK SECTION) ===== */}
      <section className="dark-section">
        <div className="dark-section-inner">
          <h2>علاش FingerCare هي الخيار الأول فالمغرب؟ 🇲🇦✨</h2>
          <p className="section-sub">انضم لآلاف الزبناء المغاربة اللي اختارو الجودة والراحة 👨‍👩‍👧‍👦</p>

          <div className="trust-features-grid">
            <div className="trust-feature-card">
              <div className="tf-icon success-icon">🛡️</div>
              <h3>جودة طبية معتمدة 100%</h3>
              <p>ألومنيوم طبي خفيف مع فوم مريح. مواد آمنة ومجربة من طرف المعالجين الفيزيائيين.</p>
            </div>
            <div className="trust-feature-card">
              <div className="tf-icon gold-icon">🏆</div>
              <h3>الأكثر مبيعاً فالمغرب</h3>
              <p>آلاف الطلبات وزبناء راضيين فجميع المدن المغربية. منتج مجرب ومضمون.</p>
            </div>
            <div className="trust-feature-card">
              <div className="tf-icon terra-icon">💧</div>
              <h3>متينة وقابلة للتعديل</h3>
              <p>الألومنيوم مرن وكتقدر تعدلو حسب الصبع ديالك. كتدوم معاك شهور طويلة.</p>
            </div>
            <div className="trust-feature-card">
              <div className="tf-icon green-icon">🤝</div>
              <h3>المعاينة قبل الدفع</h3>
              <p>حل الطرد، تفحص الجودة قدام الموزع عاد خلص! ما كتخاطر بوالو.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 15 REVIEWS CAROUSEL ===== */}
      <section className="reviews-section">
        <h2 className="section-heading">⭐ آراء وتجارب 15 زبون مغربي (تقييمات حقيقية 100% 🇲🇦)</h2>
        <p className="section-subheading">تصفح مراجعات حقيقية لزبناء مغاربة جربو جبائر FingerCare</p>

        <div className="reviews-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={reviewPage}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="reviews-page"
            >
              {ALL_REVIEWS[reviewPage].map((review, i) => (
                <div key={i} className="review-card">
                  <div className="review-head">
                    <div className="reviewer-avatar">{review.avatar}</div>
                    <div>
                      <div className="reviewer-name">{review.name}</div>
                      <div className="review-stars">⭐⭐⭐⭐⭐ <span className="verified-tag">شراء مؤكد ✅</span></div>
                    </div>
                  </div>
                  <p className="review-text">{review.text}</p>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <div className="reviews-nav">
            <button className="rev-nav-btn" onClick={() => setReviewPage(p => Math.max(0, p - 1))} disabled={reviewPage === 0}>
              السابقة ←
            </button>
            <div className="rev-dots">
              {[0, 1, 2].map(i => (
                <span key={i} className={`rev-dot ${reviewPage === i ? 'active' : ''}`} onClick={() => setReviewPage(i)}>{i + 1}</span>
              ))}
            </div>
            <button className="rev-nav-btn" onClick={() => setReviewPage(p => Math.min(2, p + 1))} disabled={reviewPage === 2}>
              → التالية
            </button>
          </div>
        </div>
      </section>

      {/* ===== GOLD GUARANTEE (ANIMATED BORDER) ===== */}
      <section className="guarantee-section">
        <div className="gold-animated-frame">
          <div className="guarantee-inner">
            <div className="guarantee-badge">🏆 الضمان الذهبي 100%</div>
            <div className="guarantee-icon">🏅</div>
            <h3>أنت لا تخاطر بأي شيء على الإطلاق! 🤝</h3>
            <p>نحن نثق في جودة وفعالية <strong>FingerCare</strong>. عندما يصلك الموزع، <strong>قم بفتح العلبة وتفحص جودة الألومنيوم والفوم بنفسك قبل دفع أي درهم!</strong> إذا لم يعجبك المنتج، يحق لك رفض الاستلام مجاناً.</p>
            <div className="guarantee-footer">🤝 نتحمل نحن كافة المخاطرة، لترتاح أنت! ❤️</div>
          </div>
        </div>
      </section>

      {/* ===== BONUSES ===== */}
      <section className="bonuses-section">
        <div className="gold-animated-frame">
          <h2 className="section-heading-gold">🎁 اطلب اليوم واستفد من هذه الهدايا الحصرية ⚡️</h2>
          <div className="bonuses-list">
            <div className="bonus-card">
              <div className="bonus-icon">🚚</div>
              <div>
                <h4>توصيل VIP مجاني لجميع مدن المغرب (بقيمة 45 درهم)</h4>
                <p>لن تدفع أي مصاريف شحن إضافية. التوصيل مجاني 100% حتى باب منزلكم.</p>
              </div>
            </div>
            <div className="bonus-card">
              <div className="bonus-icon">⚡️</div>
              <div>
                <h4>أولوية الشحن والتجهيز السريع خلال 24h-48h</h4>
                <p>نعطي طلبك أولوية قصوى للتجهيز والتسليم فأقرب وقت ممكن.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA REPEAT ===== */}
      <section className="final-cta-section">
        <div className="final-cta-inner">
          <h2>🎁 اختر العرض المناسب لك واستفد:</h2>
          
          <div className="price-block">
            <div className="price-row">
              <span className="price-new">179 <small>درهم</small></span>
            </div>
            <div className="price-save-badge">🎁 توصيل مجاني + الدفع عند الاستلام!</div>
          </div>

          <div className="offers-grid" style={{ marginBottom: 20 }}>
            {OFFERS.map((offer) => (
              <div
                key={offer.id}
                className={`offer-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''}`}
                onClick={() => setSelectedOffer(offer)}
                role="button"
                tabIndex={0}
              >
                {offer.popular && <div className="offer-badge-top">⭐ الأكثر طلباً</div>}
                {offer.id === 3 && <div className="offer-badge-top offer-badge-green">🔥 عرض قوي جداً</div>}
                <div className="offer-radio">{selectedOffer.id === offer.id && <div className="offer-radio-inner" />}</div>
                <div className="offer-info">
                  <div className="offer-title">{offer.name}</div>
                  <div className="offer-sub">{offer.desc}</div>
                </div>
                <div className="offer-price">
                  <span className={`offer-price-new ${offer.popular ? 'highlight' : ''}`}>{offer.price} DH</span>
                </div>
              </div>
            ))}
          </div>

          <button className="main-cta pulse-cta" onClick={openBottomSheet}>
            🛒 اشتري الآن - {selectedOffer.price} DH
          </button>
          <div className="cta-reassurance" style={{ marginTop: 12 }}>
            <span>🛡️ ضمان 100%</span>
            <span className="dot">•</span>
            <span>🚚 توصيل مجاني</span>
            <span className="dot">•</span>
            <span>🤝 المعاينة قبل الدفع</span>
          </div>
        </div>
      </section>

      {/* ===== FAQ ACCORDION ===== */}
      <section className="faq-section">
        <h2 className="section-heading">❓ الأسئلة الشائعة حول جبائر FingerCare</h2>
        <div className="faq-accordion">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                <span>{faq.q}</span>
                <span className="faq-chevron">{openFaq === i ? '▲' : '▼'}</span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="faq-answer"
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST BADGES STRIP ===== */}
      <section className="trust-badges-strip">
        <div className="trust-badges-grid">
          <div className="trust-badge-card"><span className="tb-icon green">✅</span><div><strong>🛡️ مجرب ومضمون 100%</strong><span>أمانك في أيدٍ أمينة</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon blue">👨‍⚕️</span><div><strong>موصى به من المختصين</strong><span>معتمد من المعالجين الفيزيائيين</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon gold">🏆</span><div><strong>الأكثر طلباً بالمغرب 🇲🇦</strong><span>آلاف الزبناء يثقون بنا</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon purple">💎</span><div><strong>✨ جودة متينة تدوم</strong><span>ألومنيوم طبي + فوم مريح</span></div></div>
        </div>
      </section>

      {/* ===== STICKY BUY BAR ===== */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          <div>
            <p className="sticky-from">ابتداءً من</p>
            <p className="sticky-price">{selectedOffer.price} <span>درهم</span></p>
          </div>
          <button id="sticky-buy-btn" onClick={openBottomSheet} className="sticky-cta pulse-cta">
            🛒 اشتري الآن
          </button>
        </div>
      </div>

      {/* ===== BOTTOM SHEET ===== */}
      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />

      {/* ===== EXIT POPUP ===== */}
      <ExitPopup />
    </div>
  );
}
