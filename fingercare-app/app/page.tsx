'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from './components/BottomSheet';

const PRODUCT_IMAGES = [
  { id: 1, src: '/images/product-action.jpg', alt: 'صورة للجبيرة راكبة فالصبع بوضوح' },
  { id: 2, src: '/images/premium-packaging.jpg', alt: 'الباك ديال 5 بياسات' },
  { id: 3, src: '/images/material-closeup.jpg', alt: 'صورة مقربة كتبين البونج والألمنيوم' },
  { id: 4, src: '/images/happy-customer.jpg', alt: 'شخص مرتاح ومبقاش كيحس بالألم' },
];

const OFFERS = [
  { id: 1, name: 'باك 5 بياسات (ليد وحدة)', pieces: 5, price: 179, desc: '5 قطع 🩹 باش تبدل على راحتك', popular: false },
  { id: 2, name: 'باك 10 بياسات (لليدين بجوج)', pieces: 10, price: 279, desc: '10 قطع ⭐ وفر 79 درهم', popular: true },
];

const ALL_REVIEWS = [
  [
    { name: 'فاطمة - كازا 📍', avatar: '👩‍👧', text: '"صبعي كان كيبات يضرني، ملي درت هاد الجبيرة وليت كنعس مرتاحة. الثمن مناسب والبياسات فيهم الجودة!"' },
    { name: 'حميد - مراكش 📍', avatar: '👨‍🔧', text: '"خدمتي كلها بيديا، هاد الجبيرة عتقاتني. ساهلة فاللبسة ومكتعرقش الصبع. شكرا ليكم."' },
    { name: 'ليلى - طنجة 📍', avatar: '👩‍💻', text: '"كنخدم فالبيسي بزاف وصوابعي عياو، جربتها ولقيت راحتي. التوصيل كان سريع."' }
  ]
];

const FAQS = [
  { q: 'واش التوصيل فابور؟ 🚚', a: 'آيه، التوصيل فابور تال باب دارك فكاع المدن المغربية.' },
  { q: 'كيفاش نخلص؟ 💳', a: 'ما تخلص والو دابا! حتى يجيب ليك الليفرور السلعة وقلبها مزيان عاد خلصو.' },
  { q: 'واش هاد الجبيرة كتجي على قد أي صبع؟ ✋', a: 'آيه، فيها سكراتش كيتزير وكترخف على حساب العبار ديال صبعك، وكتجي حتى للإبهام.' },
  { q: 'واش نقدر نغسلها؟ 💧', a: 'طبعا، تقدر تغسلها بشوية ديال الصابون والما وتخليها تنشف حيت البونج ديالها مكيخسرش.' },
];

export default function Home() {
  const [mainImage, setMainImage] = useState(PRODUCT_IMAGES[0]);
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[1]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const openBottomSheet = useCallback(() => setIsBottomSheetOpen(true), []);
  const PlaceholderImg = ({ text }: { text: string }) => (
    <div style={{
      width: '100%', height: '220px', background: '#F1F5F9', border: '3px dashed #94A3B8',
      display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px',
      margin: '24px 0', padding: '20px', textAlign: 'center', color: '#475569', fontWeight: 900,
      fontSize: '18px', boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.05)'
    }}>
      🖼️ بلاصة د التصويرة:<br/>{text}
    </div>
  );

  return (
    <div className="main-content">
      {/* TOP BANNER */}
      <div className="top-banner-antichoc">
        التوصيل فابور لجميع المدن 🇲🇦 | 🎁 الخلاص حتى توصلك السلعة ليدك
      </div>

      <header className="header-antichoc">
        <div className="offer-tags-antichoc">
          <span>أفضل جودة بأحسن ثمن</span>
        </div>
        <div className="logo-antichoc">
          راحة صبعك 🩹
        </div>
      </header>

      {/* HERO SECTION */}
      <section>
        <div className="warning-pill-wrap">
          <div className="warning-pill pulse-danger">
            <span style={{fontSize: 18}}>🚨</span> واش صبعك كيعطيك الحريق ومكتقدرش تحركو؟
          </div>
        </div>

        {/* HERO MAIN IMAGE */}
        <div className="hero-image-wrap" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#E2E8F0', border: '2px dashed #94A3B8' }}>
          <div className="hero-badge-corner">⚡️ الحل النهائي</div>
          <p style={{ color: '#475569', fontWeight: 900, fontSize: 18, textAlign: 'center', padding: 20 }}>
            🖼️ بلاصة د التصويرة: <br/> صورة كبيرة وواضحة للجبيرة وهي راكبة فالصبع وكتعطي إحساس بالراحة التامة.
          </p>
          <div className="hero-badge-bottom">🏆 الاختيار الأول فالصيدليات</div>
        </div>

        <div className="hero-title-area">
          <span className="hero-title-badge">💚 تهنى من الوجع فمرة</span>
          <h2 className="prod-name" style={{fontSize: 26, lineHeight: 1.5}}>
            جبيرة الأصابع السحرية (5 قطع)<br/>
            <span style={{color: '#64748B', fontSize: 18}}>حزم صبعك، وارتاح من الحريق ديك الساعة!</span>
          </h2>
        </div>

        <div className="price-block">
          <div className="price-header-row">
            <div className="price-new-large">179 <small>درهم</small></div>
            <div className="price-old-sub">399 درهم</div>
          </div>
          <div className="price-save-badge" style={{ background: '#FEF3C7', color: '#D97706', border: '2px dashed #F59E0B' }}>
            🎁 شري الباك د 5 بياسات ووفر 220 درهم + التوصيل فابور!
          </div>
        </div>

        <div className="cta-block-wrap">
          <button className="offer-cta-main pulse-cta" onClick={openBottomSheet} style={{ fontSize: 22, height: '65px' }}>
            🛒 اطلب الآن قبل ميسالي الستوك!
          </button>
        </div>
      </section>

      {/* PARAGRAPH 1: THE PAIN */}
      <section className="dark-section" style={{ background: '#ffffff', color: '#0F172A', padding: '32px 20px', borderTop: '8px solid #F1F5F9' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#DC2626', marginBottom: 16 }}>
          عياتك الحريق؟ صبعك مبلوكي؟ 😔
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, fontWeight: 600, color: '#334155' }}>
          كتفيق فالصباح وكتلقى صبعك معوج وكيعطيك الحريق بحال الضو؟ مكتعسش مزيان بسباب الوجع؟ الخدمة ديال الدار ولا ديال الزنقة ولات كتجيك صعيبة؟ هاد المعاناة خاصها تحبس دابا!
        </p>
        
        <PlaceholderImg text="صورة ديال شخص شاد صبعو وكيتألم بزاااف ومخنزر (باش نبينو المشكل)." />
      </section>

      {/* PARAGRAPH 2: WHY OTHER SOLUTIONS FAIL */}
      <section style={{ background: '#FEF2F2', padding: '32px 20px', borderTop: '8px solid #FEE2E2' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#991B1B', marginBottom: 16 }}>
          البومادات والكينات مبقاوش كينفعو؟ ❌💊
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, fontWeight: 600, color: '#7F1D1D' }}>
          جربتي تدهن بومادا، ولكن الحريق كيبرد غير ساعتين وكيرجع مجهد؟ المشكل ماشي فالجلد، المشكل فالعصب والوتر ديال صبعك! ملي كتبقى تحركو ديما، عمره غادي يبرى. خاصو يرتاح ويتشد مزيان باش يداوى بوحدو.
        </p>
        
        <PlaceholderImg text="صورة ديال بومادا ولا كينات مضروب عليهم بعلامة (❌) حمراء كبيرة." />
      </section>

      {/* PARAGRAPH 3: THE SOLUTION */}
      <section style={{ background: '#F0FDF4', padding: '32px 20px', borderTop: '8px solid #DCFCE7' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#166534', marginBottom: 16 }}>
          الجبيرة ديالنا هي الحل النهائي المضمون! ✅
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, fontWeight: 600, color: '#14532D' }}>
          الجبيرة الطبية ديالنا كتلبسها بكل سهولة، كتوقف ليك الصبع وكتمنعو من الحركة. هادشي كيخلي العصب يرتاح تماما وكيبدأ يبرى بوحدو ديك الساعة! غادي تلاحظ الفرق من الليلة اللولة وغادي تنعس مرتاح بلا وجع.
        </p>
        
        <PlaceholderImg text="صورة زوينة كتبين الجبيرة شادة الصبع مقاد والعصب الداخل مرتاح (صورة توضيحية/3D)." />
      </section>

      {/* PARAGRAPH 4: PRODUCT DETAILS (5 PCS) */}
      <section style={{ background: '#FFFBEB', padding: '32px 20px', borderTop: '8px solid #FEF3C7' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#B45309', marginBottom: 16 }}>
          علاش هاد الباك هو الأحسن فالسوق؟ ⭐
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, fontWeight: 600, color: '#92400E' }}>
          جبنا ليك باك فيه <strong>5 دالبياسات</strong>! باش تبدل فيهم على راحتك (دير وحدة للخدمة ووحدة للدار). 
          مصنوعين من ألمنيوم قاصح لداخل باش يشد صبعك مزيان، ومغلفين ببونج رطب ومثقب باش ميخليش صبعك يعرق و يعطيك الراحة القصوى.
        </p>
        
        <PlaceholderImg text="صورة ديال 5 دالبياسات مستفين مزيان، وفيها إشارة للألمنيوم لداخل والبونج الرطب برا." />
      </section>

      {/* PARAGRAPH 5: HOW TO USE */}
      <section style={{ background: '#F8FAFC', padding: '32px 20px', borderTop: '8px solid #E2E8F0' }}>
        <h3 style={{ fontSize: 24, fontWeight: 900, color: '#1E293B', marginBottom: 16 }}>
          طريقة الاستعمال ساهلة ماهلة! 🛠️
        </h3>
        <p style={{ fontSize: 18, lineHeight: 1.8, fontWeight: 600, color: '#334155', marginBottom: 20 }}>
          مكتحتاجش طبيب باش تركبها، تبع غير هاد 3 دالخطوات الساهلين:
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, background: '#F59E0B', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>1</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>دخل صبعك فالجبيرة.</span>
          </div>
          <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, background: '#F59E0B', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>2</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>زير السكراتش (Scratch) على قياسك.</span>
          </div>
          <div style={{ background: 'white', padding: 16, borderRadius: 12, border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, background: '#F59E0B', color: 'white', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>3</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>تهنى من الوجع ونعس مرتاح!</span>
          </div>
        </div>

        <PlaceholderImg text="صورة فيها 3 داللقطات كتشرح هاد الخطوات الثلاثة (تركاب، تزيار السكراتش، والنتيجة)." />
      </section>

      {/* OFFERS / PRICING */}
      <section style={{ padding: '40px 20px', background: 'white' }}>
        <h2 style={{ fontSize: 24, fontWeight: 900, textAlign: 'center', marginBottom: 20 }}>🔥 ختار الباك لي مسلكك:</h2>
        
        <div className="offers-grid" style={{ marginBottom: 24 }}>
          {OFFERS.map((offer) => (
            <div key={offer.id} className={`offer-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''} flip-effect`} onClick={() => setSelectedOffer(offer)}>
              {offer.popular && <div className="offer-badge-top">⭐ الأكثر مبيعاً (ينصح به)</div>}
              <div className="offer-radio">{selectedOffer.id === offer.id && <div className="offer-radio-inner" />}</div>
              <div className="offer-info">
                <div className="offer-title" style={{ fontSize: 18 }}>{offer.name}</div>
                <div className="offer-sub" style={{ fontSize: 15 }}>{offer.desc}</div>
              </div>
              <div className="offer-price">
                <span className="old-p-small" style={{ fontSize: 14 }}>{offer.price + 220} DH</span>
                <span className={`offer-price-new ${offer.popular ? 'highlight' : ''}`} style={{ fontSize: 22 }}>{offer.price} DH</span>
              </div>
            </div>
          ))}
        </div>

        <button className="main-cta pulse-cta" onClick={openBottomSheet} style={{ fontSize: 22, height: '65px', width: '100%' }}>
          🛒 تأكيد الطلب - الدفع عند الاستلام
        </button>
      </section>

      {/* GUARANTEE */}
      <section className="guarantee-section" style={{ padding: '0 20px 40px' }}>
        <div className="gold-animated-frame">
          <div className="guarantee-inner">
            <div className="guarantee-badge" style={{ fontSize: 18 }}>🏆 الضمان ديالنا 100%</div>
            <div className="guarantee-icon">🤝</div>
            <h3 style={{ fontSize: 22, marginBottom: 12 }}>ماتخلص والو حتى تشوف السلعة!</h3>
            <p style={{ fontSize: 16, fontWeight: 600 }}>
              ملي يجيب ليك الليفرور الكوموند ديالك، حل الباك وقلب الجبيرة وشوف الجودة ديالها وعاد خلصو! يلا معجباتكش، مرجوعة وما تخلص حتى ريال!
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="reviews-section" style={{ background: '#F8FAFC' }}>
        <h2 className="section-heading" style={{ fontSize: 24 }}>⭐ شنو قالو الناس لي جربوها:</h2>
        
        <div className="reviews-page">
          {ALL_REVIEWS[0].map((review, i) => (
            <div key={i} className="review-card" style={{ background: 'white', border: '1px solid #CBD5E1' }}>
              <div className="review-head">
                <div className="reviewer-avatar">{review.avatar}</div>
                <div>
                  <div className="reviewer-name" style={{ fontSize: 16 }}>{review.name}</div>
                  <div className="review-stars">⭐⭐⭐⭐⭐ <span className="verified-tag">شراء مؤكد ✅</span></div>
                </div>
              </div>
              <p className="review-text" style={{ fontSize: 16, fontWeight: 700, color: '#334155' }}>{review.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STICKY BUY BAR */}
      <div className="sticky-bar">
        <div className="sticky-bar-inner">
          <div>
            <p className="sticky-from">المجموع للأداء</p>
            <p className="sticky-price" style={{ fontSize: 24 }}>{selectedOffer.price} <span>درهم</span></p>
          </div>
          <button onClick={openBottomSheet} className="sticky-cta pulse-cta" style={{ fontSize: 18, background: '#F59E0B', color: 'white', border: '2px solid white' }}>
            🛒 اطلب دابا
          </button>
        </div>
      </div>

      <BottomSheet isOpen={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
    </div>
  );
}
