'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface OrderData {
  name: string;
  phone: string;
  city: string;
  offer: string;
  pieces: number;
  price: number;
  timestamp: string;
}

const TIMELINE_STEPS = [
  { icon: '✅', text: 'تم استلام الطلب', detail: 'طلبك مسجل بنجاح في النظام', bg: '#F0FDF4', color: '#059669' },
  { icon: '⏳', text: 'جاري الاتصال بك للتأكيد', detail: 'سيتصل بك فريقنا خلال ساعات قليلة', bg: '#FEF3C7', color: '#D97706' },
  { icon: '🚚', text: 'شحن طلبك لعنوانك', detail: 'التوصيل خلال 24 إلى 72 ساعة', bg: '#EFF6FF', color: '#2563EB' },
];

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    // Load order from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    // Fire Purchase pixel
    try {
      const orderData = savedOrder ? JSON.parse(savedOrder) : null;
      const value = orderData?.price || 179;

      // @ts-expect-error fbq is loaded via script
      if (window.fbq) window.fbq('track', 'Purchase', { value, currency: 'MAD', content_type: 'product' });
      // @ts-expect-error ttq is loaded via script
      if (window.ttq) window.ttq.track('CompletePayment', { value, currency: 'MAD' });
    } catch { /* pixel not loaded */ }

    // Fire confetti!
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#F59E0B', '#3B82F6'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 30%)', padding: '0 16px' }}>
      {/* Success Hero */}
      <div style={{ textAlign: 'center', paddingTop: 60 }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200 }}
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          }}
        >
          <span style={{ fontSize: 48, color: 'white' }}>✓</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ fontSize: 26, fontWeight: 900, color: '#0F172A', marginBottom: 8 }}
        >
          تهانينا! تم تسجيل طلبك بنجاح 🎉
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{ fontSize: 15, color: '#64748B', lineHeight: 1.7 }}
        >
          شكراً لثقتك فينا. غادي نتواصلو معاك قريباً للتأكيد.
        </motion.p>
      </div>

      {/* Order Summary */}
      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            background: 'white',
            borderRadius: 20,
            padding: 24,
            margin: '32px auto',
            maxWidth: 500,
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          }}
        >
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: '#0F172A' }}>
            📋 ملخص الطلب
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontSize: 14 }}>الاسم:</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{order.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontSize: 14 }}>الهاتف:</span>
              <span style={{ fontWeight: 700, fontSize: 14, direction: 'ltr' }}>{order.phone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontSize: 14 }}>المدينة:</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{order.city}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
              <span style={{ color: '#64748B', fontSize: 14 }}>العرض:</span>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{order.offer}</span>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              background: '#F0FDF4',
              borderRadius: 12,
              padding: '12px 16px',
              marginTop: 4,
            }}>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#059669' }}>المجموع للأداء:</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: '#059669' }}>{order.price} درهم</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          maxWidth: 500,
          margin: '0 auto 32px',
          background: 'white',
          borderRadius: 20,
          padding: 24,
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}
      >
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20, color: '#0F172A' }}>
          📦 حالة طلبك
        </h3>

        {TIMELINE_STEPS.map((step, i) => (
          <div key={i} className="timeline-step">
            <div className="timeline-icon" style={{ background: step.bg, color: step.color }}>
              {step.icon}
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#0F172A' }}>{step.text}</p>
              <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{step.detail}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* WhatsApp Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        style={{ maxWidth: 500, margin: '0 auto 40px' }}
      >
        <a
          href="https://wa.me/212600000000?text=مرحبا، أريد الاستفسار عن طلبي"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          لديك سؤال؟ تواصل معنا عبر الواتساب
        </a>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 16 }}>
          🔒 معلوماتك الشخصية محمية ولن يتم مشاركتها
        </p>
      </motion.div>
    </div>
  );
}
