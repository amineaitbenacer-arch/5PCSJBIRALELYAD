'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './components/BottomSheet';

const PRODUCT_IMAGES = [
  { id: 1, src: '/images/product-action.jpg', alt: 'جبيرة الأصابع الطبية أثناء الاستخدام اليومي' },
  { id: 2, src: '/images/premium-packaging.jpg', alt: 'تغليف احترافي وطبي يحافظ على جودة المنتج' },
  { id: 3, src: '/images/material-closeup.jpg', alt: 'تفاصيل الألومنيوم الطبي والفوم المريح' },
  { id: 4, src: '/images/happy-customer.jpg', alt: 'عميلة تستمتع بحياتها بدون ألم بفضل الجبيرة' },
];

const OFFERS = [
  { id: 1, name: 'طقم العناية الفردية', pieces: 5, price: 179, desc: '5 قطع 🩹 لليد الواحدة', popular: false },
  { id: 2, name: 'طقم الحماية الكاملة', pieces: 10, price: 279, desc: '10 قطع ⭐ لليدين + توفير 79 درهم', popular: true },
  { id: 3, name: 'طقم العائلة الطبي', pieces: 15, price: 349, desc: '15 قطعة 🔥 لك ولعائلتك (أقوى عرض)', popular: false },
];

const REVIEWS_PAGE_1 = [
  { name: 'فاطمة الزهراء - الدار البيضاء 📍', avatar: '👩‍👧', text: '"مع الشغل ديال الدار والطياب، صوابعي ولاو كيتشنجو عليا فالليل ومكنقدرش نعس من الحريق. جربت بومادات غاليين بلا فايدة. هاد الجبيرة هي اللي فكاتني، كنلبسها وفالصباح كنلقى صبعي مسرح وبلا ألم نهائياً!"' },
  { name: 'رشيد - مراكش 📍', avatar: '👨‍🔧', text: '"أنا نجار وخدمتي كلها بيديا. هادي سيمانة وتلوا ليا صبعي وبقيت حابس الخدمة. فاش درت هاد الجبيرة، ثبتات ليا الصبع مزيان وخففات عليا الحريق لدرجة رجعت للورشة ديالي فنهار الثالث. جودة عالية!"' },
  { name: 'أميمة - طنجة 📍', avatar: '👩‍💻', text: '"بصفتي خدامة فمركز النداء (Call Center)، كنكتب بزاف فالكلافيي حتى جاني مرض (إصبع الزناد). هاد الجبائر عتقوني، مريحين بزاف ومكيأثروش على الخدمة ديالي. كنصح بيهم بشدة!"' },
  { name: 'د. سمير (أخصائي عظام) - الرباط 📍', avatar: '👨‍⚕️', text: '"كمتخصص، أؤكد أن العلاج الفيزيائي بتثبيت المفصل هو الحل الأنجع لالتهاب الأوتار. هذه الجبائر مصممة بطريقة طبية ممتازة (ألومنيوم مرن + فوم يسمح بالتهوية). أنصح بها مرضاي دائماً."' },
  { name: 'الحاجة خديجة - فاس 📍', avatar: '🧕', text: '"ولدي جابهم ليا حيت عندي الروماتيزم وصوابعي كيعواجّو. الصراحة ارتاحيت عليهم بزاف، خفاف وما كيضيقوش، وليت كنقدر نشد الكاس ونصلي بيهم عادي. الله يرضي عليكم."' },
];

const REVIEWS_PAGE_2 = [
  { name: 'عادل السوسي - أكادير 📍', avatar: '👨‍💼', text: '"الجبيرة ما كتأثرش على الدورة الدموية ديال الصبع، غير كتثبتو وكتخفف الألم. شريت باك 10 قطع ليا وللوالدة، منتج ناجح 100% والتوصيل كان فالموعد."' },
  { name: 'سناء - تطوان 📍', avatar: '👩‍🏫', text: '"ممتنون لكم بزاف، التعامل راقي والتوصيل مجاني وسريع جداً. جربتها وأنا ناعسة، الفوم رطب بزاف وما كيخليش العرق."' },
  { name: 'مريم البقالي - القنيطرة 📍', avatar: '👩‍⚕️', text: '"كنت ديما كنشري من الفرماسيان بثمن غالي وكيخسرو دغيا. هاد الجبائر أحسن وأرخص. الألومنيوم متين والفوم كيتغسل وكيرجع نقي."' },
  { name: 'سفيان - سلا 📍', avatar: '👦', text: '"طحت فالماتش ديال الكورة وتنفخ ليا صبعي. درت الجبيرة 3 أيام ورجع صبعي عادي. الثمن مناسب جداً مقارنة بالجودة الخيالية."' },
  { name: 'أمينة - المحمدية 📍', avatar: '👩‍🍳', text: '"كمصممة حلويات، يدي هي راس مالي. هاد المنتج خلاني نكمل طلبات الكليان بلا ما نزيد نهلك صوابعي. شكرا لكم!"' },
];

const REVIEWS_PAGE_3 = [
  { name: 'ياسين المرابط - مكناس 📍', avatar: '🧔', text: '"السلعة ممتازة ومطابقة للصور تماماً. المعاينة قبل الدفع كتعطي ثقة كبيرة ف المنتج. الموزع كان قمة فالأخلاق."' },
  { name: 'إلهام الدكالي - الجديدة 📍', avatar: '👩‍🔬', text: '"شريت هاد الجبائر بعدما نصحتني صاحبتي. فعلاً مريحة بزاف، كنديرها حتى وأنا كانسوق الطوموبيل بلا مشكل."' },
  { name: 'محمد البكاري - بني ملال 📍', avatar: '👨‍🌾', text: '"الفلاحة كتهلك اليدين، وهاد الجبيرة ريحاتني بزاف خصوصا فالبرد فاش كيزيد الحريق. الألومنيوم صلب 100%."' },
  { name: 'نجاة برادة - وجدة 📍', avatar: '🧕', text: '"شكراً بزاف على المصداقية. راحة البال وتخفيف الألم لا يقدران بثمن. الله يجازيكم بخير."' },
  { name: 'حسن - الحسيمة 📍', avatar: '👨‍✈️', text: '"باك 10 قطع ممتاز جداً ووفرت فيه المبلغ. منتج ضروري خاصو يكون فصيدلية أي دار كإسعافات أولية."' },
];

const ALL_REVIEWS = [REVIEWS_PAGE_1, REVIEWS_PAGE_2, REVIEWS_PAGE_3];

const FAQS = [
  { q: 'واش التوصيل مجاني فعلاً؟ 🚚', a: 'نعم 100%! التوصيل مجاني لجميع المدن المغربية بدون استثناء. ما كتخلص حتى درهم زايد. التوصيل سريع بين 24 و 72 ساعة حسب مدينتك.' },
  { q: 'كيفاش نخلص؟ واش خاصني نخلص مقدماً؟ 💳', a: 'لا أبداً! الدفع عند الاستلام. ما كتخلصش حتى توصلك السلعة ليدك. من حقك تحل الطرد وتفحص الجودة ديال الجبيرة عاد خلص الموزع وأنت مرتاح!' },
  { q: 'واش هاد الجبيرة كتناسب ݣاع الأصابع؟ (حتى الإبهام؟) ✋', a: 'نعم بالتأكيد! الجبائر مصممة بشريط فيلكرو (Scratch) قابل للتعديل بالكامل. كتقدر تزيرها أو ترخفيها حسب حجم صبعك، وكتناسب جميع الأصابع بما فيها الإبهام (Le pouce).' },
  { q: 'واش هاد الجبائر كتخدم فعلاً ولا غير هضرة؟ 🩹', a: 'هذا ليس مجرد منتج، بل هو "جهاز طبي مصغر". الألومنيوم الطبي يمنع حركة الوتر الملتهب ليعطيه فرصة للشفاء الذاتي، بينما الفوم يوفر الراحة. الأطباء يصفون التثبيت كأول علاج قبل الجراحة!' },
  { q: 'واش نقدر نغسل يدي وأنا لابسها؟ 💧', a: 'نعم، الفوم مقاوم للماء ويمكن غسله برفق بصابون خفيف وتركه ليجف. لكن يُنصح بنزعها عند الاستحمام للحفاظ على الشريط اللاصق لأطول مدة ممكنة.' },
  { q: 'واش نقدر ننعس بيها فالليل؟ 🛌', a: 'طبعاً! الليل هو أفضل وقت لاستعمالها. معظم الناس يعانون من تصلب الأصابع في الصباح (تشنج الأصابع). لبسها ليلاً يمنع انحناء الإصبع أثناء النوم ويخلصك من ألم الصباح المزعج.' },
  { q: 'ماذا لو لم يعجبني المنتج؟ هل هناك ضمان؟ 🏆', a: 'بكل تأكيد! نحن نثق في جودة منتجنا 100%. نقدم لك "الضمان الذهبي": تفحص المنتج قبل الدفع. إذا لم يعجبك أو لم يكن مطابقاً للصور، أرجعه للموزع مجاناً دون دفع أي درهم.' },
];

export default function Home() {
  const [mainImage, setMainImage] = useState(PRODUCT_IMAGES[0]);
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[1]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [reviewPage, setReviewPage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewers, setViewers] = useState(43);

  // Simulated live viewers counter
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(prev => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        return Math.max(25, Math.min(85, prev + change));
      });
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const openBottomSheet = useCallback(() => setIsBottomSheetOpen(true), []);
  const toggleFaq = useCallback((index: number) => setOpenFaq(prev => prev === index ? null : index), []);

  return (
    <div className="main-content">
      {/* ===== 1. TOP BANNER (AntiChoc Style) ===== */}
      <div className="top-banner-antichoc">
        توصيل آمن 100% لكافة المدن المغربية | 🎁 الدفع عند الاستلام
      </div>

      {/* ===== 2. HEADER (AntiChoc Style) ===== */}
      <header className="header-antichoc">
        <div className="offer-tags-antichoc">
          <span>5 قطع بـ 179 درهم</span>
          <span>10 قطع بـ 279 درهم</span>
        </div>
        <div className="logo-antichoc">
          FingerCare 🩹
        </div>
      </header>

      {/* ===== 3. HERO SECTION (THE HOOK) ===== */}
      <section>
        {/* Urgent Warning Pill */}
        <div className="warning-pill-wrap">
          <div className="warning-pill pulse-danger">
            <span style={{fontSize: 18}}>🚨</span> ألم الأصابع لا يختفي لوحده! عالجه الآن قبل فوات الأوان ⚠️
          </div>
        </div>

        {/* Live Viewers (Scarcity Injector) */}
        <div style={{ textAlign: 'center', marginBottom: 8, fontSize: 13, color: '#DC2626', fontWeight: 800 }}>
          <span className="live-dot" /> 👁️ {viewers} شخص يشاهد هذا العرض الآن... المخزون ينفد بسرعة!
        </div>

        {/* Main Image */}
        <div className="hero-image-wrap">
          <div className="hero-badge-corner">⚡️ الجيل الجديد</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={mainImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
            >
              <Image src={mainImage.src} alt={mainImage.alt} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
            </motion.div>
          </AnimatePresence>
          <div className="hero-badge-bottom">🏆 الاختيار #1 للأطباء</div>
        </div>

        {/* Thumbnails */}
        <div className="thumbnail-grid">
          {PRODUCT_IMAGES.map((img) => (
            <div key={img.id} className={`thumbnail ${mainImage.id === img.id ? 'active' : ''}`} onClick={() => setMainImage(img)}>
              <Image src={img.src} alt={img.alt} width={120} height={120} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
            </div>
          ))}
        </div>

        {/* Deep Emotional Headline */}
        <div className="hero-title-area">
          <span className="hero-title-badge">💚 البديل الآمن للجراحة</span>
          <h2 className="prod-name" style={{fontSize: 26}}>الجبيرة الطبية المزدوجة<br/><span style={{color: '#64748B', fontSize: 18}}>تثبيت فوري، راحة تامة، وتخفيف سحري للألم!</span></h2>
        </div>

        {/* The Value Anchor (Price) */}
        <div className="price-block">
          <div className="price-header-row">
            <div className="price-new-large">179 <small>درهم</small></div>
            <div className="price-old-sub">399 درهم</div>
            <div className="price-save-mini">توفير 220 DH</div>
          </div>
          <div className="price-save-badge">🎁 وفرت 220 درهم اليوم + توصيل مجاني!</div>
        </div>

        {/* Inline Offer Selector (The Upsell Engine) */}
        <div className="offers-wrapper">
          <div className="offers-header">
            <span className="offers-label">📦 اختر باقة العلاج المناسبة:</span>
            <span className="offers-stock-badge">🔥 تبقت 12 قطعة فقط</span>
          </div>
          <div className="offers-grid">
            {OFFERS.map((offer) => (
              <div key={offer.id} className={`offer-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''} flip-effect`} onClick={() => setSelectedOffer(offer)}>
                {offer.popular && <div className="offer-badge-top">⭐ الأكثر مبيعاً (ينصح به)</div>}
                {offer.id === 3 && <div className="offer-badge-top offer-badge-green">🔥 عرض قوي جداً</div>}
                <div className="offer-radio">{selectedOffer.id === offer.id && <div className="offer-radio-inner" />}</div>
                <div className="offer-info">
                  <div className="offer-title">{offer.name}</div>
                  <div className="offer-sub">{offer.desc}</div>
                </div>
                <div className="offer-price">
                  <span className="old-p-small">{offer.price + 150} DH</span>
                  <span className={`offer-price-new ${offer.popular ? 'highlight' : ''}`}>{offer.price} DH</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main CTA */}
        <div className="cta-block-wrap">
          <button className="offer-cta-main pulse-cta" onClick={openBottomSheet}>
            🛒 تأكيد الطلب الآن - {selectedOffer.price} درهم
          </button>
          <div className="cta-reassurance">
            <span>🛡️ ضمان 100%</span><span className="dot">•</span><span>🚚 توصيل مجاني</span><span className="dot">•</span><span>🤝 الدفع عند الاستلام</span>
          </div>
        </div>
      </section>

      {/* ===== 4. THE STORY & EMPATHY SECTION (NEW) ===== */}
      <section className="dark-section" style={{ marginTop: 20 }}>
        <div className="dark-section-inner">
          <div className="eb-header-badge"><i className="fa-solid fa-shield-heart"></i> 🛡️ صحتك لا تقدر بثمن!</div>
          <h3 className="eb-main-title" style={{ fontSize: 22, fontWeight: 900, color: '#FFD700', marginBottom: 16 }}>
            "كنت كنبات سهران بالوجع، وما خليت ما جربت..." 😔
          </h3>
          <div className="eb-intro-card" style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, borderLeft: '4px solid #EF4444' }}>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: '#E2E8F0' }}>
              بزاف ديال المغاربة كيعانيو فصمت من "إصبع الزناد" (Trigger Finger)، التهاب المفاصل، أو التواء الأصابع بسبب الخدمة اليومية. 
              كتفيق فالصباح كتلقى صبعك مبلوكي وما كيبغيش يتسرح؟ كتحس بحريق مجهد بحال الضو كيضربك؟ هاد المعاناة كتخليك ما قادرش دير حتى أبسط الحوايج بحال تسد صدفة ديال حوايجك أو تهز كاس د أتاي!
            </p>
          </div>
        </div>
      </section>

      {/* ===== 5. THE ENEMY: WHY PILLS & CREAMS FAIL (NEW) ===== */}
      <section className="emotional-pain-section" style={{ background: 'rgba(230, 57, 70, 0.15)', padding: '32px 16px', borderTop: '2px solid #FECACA', borderBottom: '2px solid #FECACA' }}>
        <div className="pain-icon-wrapper" style={{ textAlign: 'center', fontSize: 40, marginBottom: 12 }}>💊❌</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#991B1B', textAlign: 'center', marginBottom: 16 }}>
          لماذا تفشل المراهم والأدوية المسكنة؟
        </h2>
        <p style={{ fontSize: 16, color: '#7F1D1D', textAlign: 'center', marginBottom: 24, lineHeight: 1.6 }}>
          الكريمات والأقراص المسكنة <strong>تخدر الألم لساعتين فقط</strong>، لكنها لا تعالج المشكل الميكانيكي! كلما حركت إصبعك المصاب، زاد التهاب الوتر وتفاقمت الحالة، وقد ينتهي بك المطاف فوق طاولة العمليات الجراحية! 🚨
        </p>

        <div className="pain-conclusion-box" style={{ background: 'var(--surface)', border: '2px solid var(--danger)', padding: 20, borderRadius: 16, boxShadow: '0 10px 25px rgba(220,38,38,0.1)' }}>
          <h3 style={{ fontSize: 18, color: '#DC2626', fontWeight: 900, marginBottom: 8, textAlign: 'center' }}>
            الحل الطبي الحقيقي: التثبيت الفيزيائي 🛠️
          </h3>
          <p style={{ fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 1.7 }}>
            الطريقة الوحيدة لشفاء الوتر الملتهب هي <strong>إيقاف حركته تماماً</strong>. جبيرة FingerCare® تقوم بهذا الدور بدقة طبية، حيث تمنع الإصبع من الانحناء وتعطيه الفرصة للشفاء الذاتي الطبيعي بسرعة مذهلة.
          </p>
        </div>
      </section>

      {/* ===== 6. DEEP SCIENTIFIC BREAKDOWN (DARK PREMIUM THEME) ===== */}
      <section className="faq-section" style={{ padding: '32px 16px', background: 'var(--dark-bg)' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'white', textAlign: 'center', marginBottom: 8, lineHeight: 1.4 }}>
          🔬 التفسير العلمي: <br/> كيف تشفي الجبيرة إصبعك؟
        </h2>
        <p style={{ color: '#FFD700', textAlign: 'center', fontWeight: 800, fontSize: 16, marginBottom: 24 }}>
          تقنية التثبيت الفيزيائي المتقدمة
        </p>
        
        <div className="tech-grid" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          <div className="tech-card" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0, marginTop: 4 }}>1</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', marginBottom: 8 }}>دعامة ألومنيوم صلبة 100% ✈️</h3>
              <p style={{ fontSize: 13, color: '#A0A4B8', lineHeight: 1.7 }}>لوح صلب من الألومنيوم يمنع ثني الوتر الملتهب تماماً، مما يوفر راحة فورية ويقلل الضغط على المفصل.</p>
            </div>
          </div>

          <div className="tech-card" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0, marginTop: 4 }}>2</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', marginBottom: 8 }}>فوم طبي بمسامات تهوية ☁️</h3>
              <p style={{ fontSize: 13, color: '#A0A4B8', lineHeight: 1.7 }}>مصنوع من مادة عالية الجودة تمتص الصدمات وتسمح بمرور الهواء، تمنع التعرق وتتحمل الاستعمال المتواصل.</p>
            </div>
          </div>

          <div className="tech-card" style={{ background: 'rgba(255,255,255,0.03)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ background: 'rgba(255,215,0,0.1)', color: '#FFD700', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0, marginTop: 4 }}>3</div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 900, color: '#FFD700', marginBottom: 8 }}>أشرطة Velcro لاصقة قوية 🎯</h3>
              <p style={{ fontSize: 13, color: '#A0A4B8', lineHeight: 1.7 }}>وصلات محكمة ضد الارتخاء، تضمن ثبات الجبيرة في مكانها لضمان الشفاء التام وعمر افتراضي طويل.</p>
            </div>
          </div>

        </div>
      </section>

      {/* ===== 7. BEFORE / AFTER COMPARISON TABLE (NEW) ===== */}
      <section className="comparison-section" style={{ padding: '32px 16px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 900, textAlign: 'center', marginBottom: 20 }}>⚡️ مقارنة: بدون الجبيرة مقابل FingerCare®</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {/* Danger Col */}
          <div style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#DC2626', marginBottom: 12 }}>❌ بدون الجبيرة</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 14, color: '#7F1D1D' }}>⚠️ ألم شديد عند ثني الإصبع</li>
              <li style={{ fontSize: 14, color: '#7F1D1D' }}>⚠️ تيبس وتصلب الأصابع في الصباح</li>
              <li style={{ fontSize: 14, color: '#7F1D1D' }}>⚠️ خطر تفاقم الالتهاب واللجوء للجراحة</li>
              <li style={{ fontSize: 14, color: '#7F1D1D' }}>⚠️ استهلاك مستمر للمسكنات المضرة بالمعدة</li>
            </ul>
          </div>

          {/* Success Col */}
          <div style={{ background: 'var(--surface-highlight)', padding: 20, borderRadius: 16, border: '1px solid var(--gold)', boxShadow: '0 10px 25px rgba(255,193,7,0.1)', transform: 'scale(1.02)' }}>
            <div style={{ background: '#10B981', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800, width: 'max-content', marginBottom: 12 }}>✨ الحل الطبي المضمون</div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#059669', marginBottom: 12 }}>✅ مع FingerCare®</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <li style={{ fontSize: 14, color: '#065F46', fontWeight: 600 }}>✔️ تثبيت فوري يوقف الألم في الحين</li>
              <li style={{ fontSize: 14, color: '#065F46', fontWeight: 600 }}>✔️ نوم هادئ بدون استيقاظ بسبب الوجع</li>
              <li style={{ fontSize: 14, color: '#065F46', fontWeight: 600 }}>✔️ شفاء طبيعي للوتر بدون أدوية أو جراحة</li>
              <li style={{ fontSize: 14, color: '#065F46', fontWeight: 600 }}>✔️ جودة متينة تدوم لأشهر من الاستعمال</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ===== 8. WHO IS THIS FOR? (TARGET AUDIENCE GRID) ===== */}
      <section style={{ padding: '32px 16px', background: '#1E293B', color: 'white' }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, textAlign: 'center', marginBottom: 8, color: '#FFD700' }}>لمن صمم هذا المنتج؟ 🎯</h2>
        <p style={{ textAlign: 'center', fontSize: 14, color: '#94A3B8', marginBottom: 24 }}>إذا كنت واحداً من هؤلاء، فهذا المنتج سيغير حياتك:</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>👵</div>
            <h4 style={{ fontSize: 14, fontWeight: 800 }}>كبار السن</h4>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>لمرضى الروماتيزم والتهاب المفاصل</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🧑‍🍳</div>
            <h4 style={{ fontSize: 14, fontWeight: 800 }}>ربات البيوت</h4>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>لآلام الأعمال المنزلية المستمرة</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🛠️</div>
            <h4 style={{ fontSize: 14, fontWeight: 800 }}>الحرفيون والعمال</h4>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>للإصابات الناتجة عن المجهود اليدوي</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 12, textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>💻</div>
            <h4 style={{ fontSize: 14, fontWeight: 800 }}>موظفو المكاتب</h4>
            <p style={{ fontSize: 12, color: '#94A3B8' }}>لمرض إصبع الزناد بسبب الكيبورد</p>
          </div>
        </div>
      </section>

      {/* ===== 9. THE COST OF INACTION (PRICE ANCHOR) ===== */}
      <section style={{ padding: '40px 16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'var(--surface-highlight)', color: '#B91C1C', padding: '8px 16px', borderRadius: 20, fontSize: 14, fontWeight: 800, marginBottom: 16 }}>💰 الحسبة ساهلة...</div>
        <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0F172A', marginBottom: 16 }}>العملية الجراحية تكلف 15,000 درهم!</h2>
        <p style={{ fontSize: 16, color: '#475569', lineHeight: 1.8, marginBottom: 24 }}>
          إذا أهملت علاج إصبعك الآن، قد يتصلب الوتر تماماً ويصبح التدخل الجراحي هو الحل الوحيد، ناهيك عن حصص الترويض الطبي الباهظة الثمن. 
          <br/><br/>
          <strong>لماذا تخاطر بصحتك ومالك؟</strong><br/>
          احصل على العلاج الوقائي المضمون ابتداءً من <span style={{ color: '#059669', fontWeight: 900, fontSize: 20 }}>179 درهم فقط!</span>
        </p>
        <button className="main-cta pulse-cta" onClick={openBottomSheet} style={{ width: '100%', maxWidth: 400 }}>
          🛒 احمِ صحتك الآن - اطلب الجبيرة
        </button>
      </section>

      {/* ===== 10. 15 REVIEWS CAROUSEL (MASSIVE SOCIAL PROOF) ===== */}
      <section className="reviews-section" style={{ background: 'var(--dark-bg)', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
        <h2 className="section-heading" style={{ fontSize: 24 }}>⭐ آراء 15 زبون مغربي (تقييمات حقيقية 🇲🇦)</h2>
        <p className="section-subheading">انضم لأكثر من 5,000 عائلة مغربية تخلصت من ألم الأصابع.</p>

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
                <div key={i} className="review-card" style={{ background: 'var(--surface)', border: '1px solid var(--border-light)' }}>
                  <div className="review-head">
                    <div className="reviewer-avatar">{review.avatar}</div>
                    <div>
                      <div className="reviewer-name">{review.name}</div>
                      <div className="review-stars">⭐⭐⭐⭐⭐ <span className="verified-tag" style={{ marginLeft: 6 }}>شراء مؤكد ✅</span></div>
                    </div>
                  </div>
                  <p className="review-text" style={{ fontSize: 14, fontWeight: 600 }}>{review.text}</p>
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

      {/* ===== 11. GOLD GUARANTEE (ANIMATED BORDER) ===== */}
      <section className="guarantee-section">
        <div className="gold-animated-frame">
          <div className="guarantee-inner">
            <div className="guarantee-badge">🏆 الضمان الذهبي 100%</div>
            <div className="guarantee-icon">🤝</div>
            <h3 style={{ fontSize: 22 }}>أنت لا تخاطر بأي شيء على الإطلاق!</h3>
            <p style={{ fontSize: 15 }}>نحن نثق في جودة وفعالية <strong>FingerCare®</strong>. عندما يصلك الموزع حتى باب دارك، <strong>قم بفتح العلبة وتفحص جودة الألومنيوم والفوم بنفسك قبل دفع أي درهم!</strong> إذا لم يعجبك المنتج أو لم يكن كما وصفناه، يحق لك رفض الاستلام مجاناً وسنتحمل نحن مصاريف الشحن.</p>
            <div className="guarantee-footer">🛡️ نتحمل نحن كافة المخاطرة، لترتاح أنت! ❤️</div>
          </div>
        </div>
      </section>

      {/* ===== 12. EXCLUSIVE BONUSES ===== */}
      <section className="bonuses-section">
        <div className="gold-animated-frame" style={{ background: '#1E293B' }}>
          <h2 className="section-heading-gold">🎁 اطلب اليوم واستفد من هذه الهدايا الحصرية ⚡️</h2>
          <div className="bonuses-list">
            <div className="bonus-card">
              <div className="bonus-icon">🚚</div>
              <div>
                <h4>توصيل VIP مجاني لجميع مدن المغرب (بقيمة 45 درهم)</h4>
                <p>لن تدفع أي مصاريف شحن إضافية. التوصيل مجاني 100% حتى باب منزلكم أينما كنتم فالمغرب.</p>
              </div>
            </div>
            <div className="bonus-card">
              <div className="bonus-icon">⚡️</div>
              <div>
                <h4>أولوية الشحن والتجهيز السريع خلال 24h-48h</h4>
                <p>نظراً لأهمية هذا المنتج لصحتك، نعطي طلبك أولوية قصوى للتجهيز والتسليم فأقرب وقت ممكن.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 13. FINAL CTA REPEAT (THE CLOSER) ===== */}
      <section className="final-cta-section">
        <div className="final-cta-inner" style={{ border: '3px solid #F59E0B', boxShadow: '0 15px 35px rgba(245,158,11,0.15)' }}>
          <div style={{ background: 'rgba(230, 57, 70, 0.15)', color: '#DC2626', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 800, width: 'max-content', margin: '0 auto 12px' }}>🔥 العرض ينتهي قريباً</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>أكد طلبك الآن واستفد من التخفيض:</h2>
          
          <div className="offers-grid" style={{ marginBottom: 20 }}>
            {OFFERS.map((offer) => (
              <div key={offer.id} className={`offer-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''} flip-effect`} onClick={() => setSelectedOffer(offer)}>
                {offer.popular && <div className="offer-badge-top">⭐ الأكثر مبيعاً</div>}
                <div className="offer-radio">{selectedOffer.id === offer.id && <div className="offer-radio-inner" />}</div>
                <div className="offer-info">
                  <div className="offer-title" style={{ fontSize: 15 }}>{offer.name}</div>
                  <div className="offer-sub" style={{ fontSize: 13, fontWeight: 600 }}>{offer.pieces} قطع بسعر {offer.price} DH</div>
                </div>
              </div>
            ))}
          </div>

          <button className="main-cta pulse-cta" onClick={openBottomSheet} style={{ fontSize: 20, height: 64 }}>
            🛒 إضغط هنا للطلب والدفع عند الاستلام
          </button>
          
          <div style={{ marginTop: 16, padding: '12px', background: 'rgba(6, 214, 160, 0.1)', borderRadius: 12, border: '1px dashed #10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🚚</span> <span style={{ fontWeight: 800, color: '#059669', fontSize: 14 }}>التوصيل مجاني لجميع المدن + الدفع عند الاستلام</span>
          </div>
        </div>
      </section>

      {/* ===== 14. EXTENDED FAQ ACCORDION ===== */}
      <section className="faq-section">
        <h2 className="section-heading" style={{ fontSize: 22, marginBottom: 24 }}>❓ الأسئلة الشائعة (FAQ)</h2>
        <div className="faq-accordion">
          {FAQS.map((faq, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(i)}>
                <span style={{ paddingLeft: 16 }}>{faq.q}</span>
                <span className="faq-chevron" style={{ background: openFaq === i ? 'var(--gold)' : 'var(--surface-highlight)', color: openFaq === i ? 'black' : 'var(--text-muted)', width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="faq-answer">
                    <p style={{ fontSize: 15, fontWeight: 600 }}>{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ===== 15. TRUST BADGES STRIP ===== */}
      <section className="trust-badges-strip" style={{ marginBottom: 40 }}>
        <div className="trust-badges-grid">
          <div className="trust-badge-card"><span className="tb-icon green">✅</span><div><strong>🛡️ مضمون 100%</strong><span>أمانك في أيدٍ أمينة</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon blue">👨‍⚕️</span><div><strong>طبي معتمد</strong><span>من المعالجين الفيزيائيين</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon gold">🏆</span><div><strong>الأكثر مبيعاً 🇲🇦</strong><span>آلاف الزبناء يثقون بنا</span></div></div>
          <div className="trust-badge-card"><span className="tb-icon purple">💎</span><div><strong>✨ جودة ممتازة</strong><span>ألومنيوم + فوم مريح</span></div></div>
        </div>
      </section>

      {/* ===== STICKY BUY BAR ===== */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          <div>
            <p className="sticky-from">المجموع للأداء</p>
            <p className="sticky-price">{selectedOffer.price} <span>درهم</span></p>
          </div>
          <button id="sticky-buy-btn" onClick={openBottomSheet} className="sticky-cta pulse-cta">
            🛒 اطلب الآن
          </button>
        </div>
      </div>

      {/* ===== BOTTOM SHEET ===== */}
      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
    </div>
  );
}
