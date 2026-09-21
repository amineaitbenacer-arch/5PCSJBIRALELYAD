'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import BottomSheet from './components/BottomSheet';
import ExitPopup from './components/ExitPopup';

const PRODUCT_IMAGES = [
  { id: 1, src: '/images/product-action.jpg', alt: 'جبيرة الأصابع أثناء الاستخدام' },
  { id: 2, src: '/images/premium-packaging.jpg', alt: 'تغليف احترافي وطبي' },
  { id: 3, src: '/images/material-closeup.jpg', alt: 'تفاصيل المواد عالية الجودة' },
  { id: 4, src: '/images/happy-customer.jpg', alt: 'عميلة سعيدة بالنتائج' },
];

const TRUST_BADGES = [
  { icon: '✅', title: 'جودة طبية معتمدة', subtitle: 'مواد آمنة ومريحة', color: '#10B981' },
  { icon: '🏆', title: 'الأكثر مبيعاً', subtitle: 'آلاف الطلبات في المغرب', color: '#F59E0B' },
  { icon: '🛡️', title: 'ضمان الرضا 100%', subtitle: 'أو استرجاع أموالك', color: '#3B82F6' },
  { icon: '💎', title: 'متينة ومرنة', subtitle: 'ألومنيوم طبي + فوم مريح', color: '#8B5CF6' },
];

export default function Home() {
  const [mainImage, setMainImage] = useState(PRODUCT_IMAGES[0]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const openBottomSheet = () => setIsBottomSheetOpen(true);

  return (
    <div className="main-content">
      {/* ===== SECTION 1: HEADER ===== */}
      {/* Marquee Banner */}
      <div className="marquee-container">
        <div className="marquee-text">
          🚚 توصيل مجاني لجميع المدن المغربية &nbsp;&nbsp;|&nbsp;&nbsp; 💳 الدفع عند الاستلام &nbsp;&nbsp;|&nbsp;&nbsp; ⭐ أكثر من 5000 عميل راضي &nbsp;&nbsp;|&nbsp;&nbsp; 🚚 توصيل مجاني لجميع المدن المغربية &nbsp;&nbsp;|&nbsp;&nbsp; 💳 الدفع عند الاستلام &nbsp;&nbsp;|&nbsp;&nbsp; ⭐ أكثر من 5000 عميل راضي
        </div>
      </div>

      {/* Navbar */}
      <nav style={{
        background: 'white',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        {/* Offer Badge */}
        <motion.div
          className="pulse-badge"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: 'white',
            padding: '6px 14px',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          🔥 عرض محدود
        </motion.div>

        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>🩹</span>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', letterSpacing: '-0.5px' }}>
            Finger<span style={{ color: '#10B981' }}>Care</span>
          </h1>
        </div>
      </nav>

      {/* ===== SECTION 2: HERO ===== */}
      <section style={{ padding: '0' }}>
        {/* Warning Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px 16px 12px' }}>
          <motion.div
            className="pulse-danger"
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              padding: '8px 20px',
              borderRadius: 30,
              fontSize: 14,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
          >
            🚨 واش صوابعك كيوجعوك وما كتقدرش تحركهم؟
          </motion.div>
        </div>

        {/* Main Image */}
        <motion.div
          key={mainImage.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '1/1',
            overflow: 'hidden',
            background: '#F8FAFC',
          }}
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

        {/* 4 Thumbnails */}
        <div className="thumbnail-grid" style={{ marginTop: 12 }}>
          {PRODUCT_IMAGES.map((img) => (
            <div
              key={img.id}
              className={`thumbnail ${mainImage.id === img.id ? 'active' : ''}`}
              onClick={() => setMainImage(img)}
              role="button"
              tabIndex={0}
              aria-label={img.alt}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={120}
                height={120}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            </div>
          ))}
        </div>

        {/* Title & Pricing */}
        <div style={{ padding: '20px 16px 0' }}>
          <h2 style={{
            fontSize: 26,
            fontWeight: 900,
            color: '#0F172A',
            lineHeight: 1.3,
            marginBottom: 8,
          }}>
            جبيرة الأصابع الطبية — الحل البراتيك والمريح
          </h2>

          <p style={{
            fontSize: 15,
            color: '#64748B',
            lineHeight: 1.7,
            marginBottom: 16,
          }}>
            🩹 جبائر طبية من ألومنيوم مع فوم مريح. كتثبت الصوابع وكتخفف الألم بسرعة. ساهلين فالاستعمال اليومي ومناسبين لكل الأحجام.
          </p>

          {/* Pricing */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7, #FFFBEB)',
              padding: '12px 20px',
              borderRadius: 16,
              border: '2px solid #F59E0B',
            }}>
              <p style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>Pack 5 قطع</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#D97706' }}>179 <span style={{ fontSize: 16 }}>درهم</span></p>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
              padding: '12px 20px',
              borderRadius: 16,
              border: '2px solid #10B981',
            }}>
              <p style={{ fontSize: 12, color: '#065F46', fontWeight: 600 }}>Pack 10 قطع ⭐</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#059669' }}>279 <span style={{ fontSize: 16 }}>درهم</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: PROBLEM / AGITATION ===== */}
      <section style={{ padding: '32px 16px 0' }}>
        <div style={{
          background: '#FEF2F2',
          borderRadius: 20,
          padding: '24px 20px',
          border: '1px solid #FECACA',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#DC2626', marginBottom: 12 }}>
            ⚠️ شنو هو مشكل الأصابع المتيبسة؟
          </h3>
          <p style={{ fontSize: 15, color: '#7F1D1D', lineHeight: 1.8 }}>
            بزاف ديال الناس كيعانيو من مشاكل فالأصابع — <strong>تيبيس، ألم، التواء</strong> — بسبب العمل اليومي أو الإصابات. إذا ما تعالجتش بسرعة، المشكل كيتفاقم و كيأثر على حياتك اليومية.
          </p>
          <p style={{ fontSize: 15, color: '#7F1D1D', lineHeight: 1.8, marginTop: 8 }}>
            🛑 <strong>بلا جبيرة مناسبة</strong>، الصوابع ما كيتحسنوش وكيولي الألم أقوى. الحل ساهل وموجود.
          </p>
        </div>
      </section>

      {/* ===== SECTION 4: SOLUTION ===== */}
      <section style={{ padding: '24px 16px 0' }}>
        <div style={{
          background: '#F0FDF4',
          borderRadius: 20,
          padding: '24px 20px',
          border: '1px solid #BBF7D0',
        }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: '#059669', marginBottom: 12 }}>
            ✅ الحل راه ساهل: جبيرة &ldquo;Attelle&rdquo; طبية
          </h3>
          <p style={{ fontSize: 15, color: '#065F46', lineHeight: 1.8 }}>
            جبيرة FingerCare كتجبر الصبع باش يلسرح بشوية بشوية. <strong>ألومنيوم خفيف + فوم مريح</strong> = دعم قوي بلا إزعاج. 
          </p>
          <ul style={{ fontSize: 15, color: '#065F46', lineHeight: 2, marginTop: 12, listStyle: 'none', paddingRight: 0 }}>
            <li>✅ ساهلين للتنقيط والاستعمال اليومي</li>
            <li>✅ دعم قوي وآمن للأصابع</li>
            <li>✅ راحة خيالية طول اليوم</li>
            <li>✅ ساهلين فالتنظيف ومتينين</li>
          </ul>
        </div>
      </section>

      {/* ===== SECTION 5: TRUST BADGES ===== */}
      <section style={{ padding: '32px 16px 0' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', marginBottom: 20, color: '#0F172A' }}>
          🛡️ علاش تختار FingerCare؟
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
        }}>
          {TRUST_BADGES.map((badge, i) => (
            <motion.div
              key={i}
              className="trust-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>{badge.icon}</div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>{badge.title}</h4>
              <p style={{ fontSize: 12, color: '#64748B' }}>{badge.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION 6: REAL REVIEWS (Based on real product reviews) ===== */}
      <section style={{ padding: '32px 16px 0' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', marginBottom: 20, color: '#0F172A' }}>
          ⭐ شنو كيقولو الناس اللي جربوها
        </h3>

        {[
          {
            name: 'أم أحمد - الدار البيضاء',
            text: 'كنت كنعاني من ألم فصوابعي مللي كنطيب وكنخدم. من مللي بديت نستعمل هاد الجبائر، الألم نقص بزاف والحمد لله. المنتج ممتاز وخفيف بزاف.',
            stars: 5,
          },
          {
            name: 'يوسف - مراكش',
            text: 'أنا حرفي وصوابعي دايما كيتعرضو للإصابات. هاد الجبائر ساعدوني بزاف فالتعافي. الجودة عالية والتوصيل كان سريع.',
            stars: 5,
          },
          {
            name: 'فاطمة - فاس',
            text: 'جربت بزاف ديال المنتجات قبل، هادي هي الأحسن. المادة مريحة بزاف وما كتضايقش. الثمن معقول مقارنة بالصيدليات.',
            stars: 4,
          },
        ].map((review, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#F8FAFC',
              borderRadius: 16,
              padding: '20px',
              marginBottom: 12,
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 16,
                }}>
                  {review.name.charAt(0)}
                </div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{review.name}</span>
              </div>
              <div style={{ color: '#F59E0B', fontSize: 14 }}>
                {'⭐'.repeat(review.stars)}
              </div>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{review.text}</p>
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>✅ مشتري موثق</p>
          </motion.div>
        ))}
      </section>

      {/* ===== SECTION 7: FAQ ===== */}
      <section style={{ padding: '32px 16px 24px' }}>
        <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', marginBottom: 20, color: '#0F172A' }}>
          ❓ أسئلة شائعة
        </h3>

        {[
          { q: 'واش التوصيل مجاني؟', a: 'نعم! التوصيل مجاني لجميع المدن المغربية 🇲🇦' },
          { q: 'كيفاش نخلص؟', a: 'الدفع عند الاستلام. ما كتخلصش حتى توصلك السلعة ليدك 💳' },
          { q: 'واش مناسبة لكل الأصابع؟', a: 'نعم! الجبائر قابلة للتعديل ومناسبة لجميع أحجام الأصابع ✅' },
          { q: 'شحال ديال الوقت كياخد التوصيل؟', a: 'عادة بين 24 و 72 ساعة حسب المدينة 🚚' },
        ].map((faq, i) => (
          <div
            key={i}
            style={{
              background: '#F8FAFC',
              borderRadius: 16,
              padding: '16px 20px',
              marginBottom: 10,
              border: '1px solid #E2E8F0',
            }}
          >
            <p style={{ fontWeight: 700, fontSize: 15, color: '#0F172A', marginBottom: 6 }}>{faq.q}</p>
            <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.6 }}>{faq.a}</p>
          </div>
        ))}
      </section>

      {/* ===== STICKY BUY BAR ===== */}
      <div className="sticky-bar">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 500, margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>ابتداءً من</p>
            <p style={{ fontSize: 22, fontWeight: 900, color: '#059669' }}>179 <span style={{ fontSize: 14 }}>درهم</span></p>
          </div>
          <button
            id="sticky-buy-btn"
            onClick={openBottomSheet}
            className="pulse-cta"
            style={{
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: 16,
              padding: '14px 32px',
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
              cursor: 'pointer',
              minHeight: 52,
              minWidth: 48,
            }}
          >
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
