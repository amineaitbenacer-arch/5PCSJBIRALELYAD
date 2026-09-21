'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface OrderDetails {
  name: string;
  phone: string;
  city: string;
  packId: number;
  price: number;
}

export default function ThankYouPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Fire confetti on load
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#F59E0B', '#FCD34D']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#F59E0B', '#FCD34D']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    // Load order details
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '40px 16px', direction: 'rtl', fontFamily: '"Almarai", sans-serif' }}>
      
      {/* Luxury Navbar */}
      <nav style={{ background: 'white', padding: '12px 16px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 30 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24, filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.3))' }}>🩹</span>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0 }}>Finger<span style={{ color: '#10B981' }}>Care</span></h1>
        </div>
      </nav>

      <div style={{ maxWidth: 500, margin: '60px auto 0', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Success Card (Premium Dark Style) */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{ background: '#111827', borderRadius: 20, padding: 32, textAlign: 'center', color: 'white', border: '1px solid #374151', position: 'relative', overflow: 'hidden' }}
        >
          {/* Gold Glow Effect */}
          <div style={{ position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)', width: 150, height: 150, background: 'rgba(245,158,11,0.2)', filter: 'blur(40px)', borderRadius: '50%' }} />

          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, margin: '0 auto 20px', border: '4px solid rgba(16,185,129,0.2)', position: 'relative', zIndex: 2 }}>
            ✅
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8, color: '#FFD700', position: 'relative', zIndex: 2 }}>
            تهانينا! لقد تم تأكيد طلبك بنجاح 🎉
          </h1>
          <p style={{ fontSize: 16, color: '#E2E8F0', margin: 0, lineHeight: 1.6, position: 'relative', zIndex: 2 }}>
            {order ? `شكراً لك يا ${order.name} على ثقتك في FingerCare.` : 'شكراً لك على ثقتك في FingerCare.'}
            <br />
            تم حجز طلبيتك وسنتصل بك قريباً لتأكيد عنوان الشحن.
          </p>
        </motion.div>

        {/* Next Steps Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: 'white', borderRadius: 20, padding: 24, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', marginBottom: 20, borderBottom: '2px solid #F1F5F9', paddingBottom: 12 }}>
            📦 ماذا سيحدث الآن؟
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="timeline-step">
              <div className="timeline-icon" style={{ background: '#EFF6FF', color: '#3B82F6' }}>📞</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>اتصال هاتفي قريب</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>سيتصل بك فريق الدعم الخاص بنا في أقرب وقت لتأكيد عنوان التسليم بدقة.</p>
              </div>
            </div>
            
            <div className="timeline-step">
              <div className="timeline-icon" style={{ background: '#FFFBEB', color: '#F59E0B' }}>🚚</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>شحن سريع ومجاني</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>سيتم تجهيز طلبيتك بعناية وشحنها فوراً مع أولوية التوصيل (VIP).</p>
              </div>
            </div>

            <div className="timeline-step">
              <div className="timeline-icon" style={{ background: '#F0FDF4', color: '#10B981' }}>🤝</div>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>الاستلام والدفع</h3>
                <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>ستصلك الطلبية حتى باب منزلك. لا تدفع أي شيء حتى تستلمها وتتفحصها!</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Summary */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: '#FFFBEB', borderRadius: 20, padding: 24, border: '2px dashed #FCD34D' }}
          >
            <h2 style={{ fontSize: 16, fontWeight: 800, color: '#D97706', marginBottom: 16, textAlign: 'center' }}>
              🧾 تفاصيل الطلب
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#64748B' }}>المنتج:</span>
              <strong style={{ color: '#0F172A' }}>{order.packId === 1 ? '5 قطع' : order.packId === 2 ? '10 قطع' : '15 قطعة'} (جبيرة الأصابع)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14 }}>
              <span style={{ color: '#64748B' }}>المدينة:</span>
              <strong style={{ color: '#0F172A' }}>{order.city}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '1px solid #FDE68A', fontSize: 16 }}>
              <span style={{ color: '#92400E', fontWeight: 700 }}>المجموع للأداء:</span>
              <strong style={{ color: '#B45309', fontWeight: 900 }}>{order.price} درهم</strong>
            </div>
          </motion.div>
        )}

        {/* WhatsApp Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ textAlign: 'center' }}
        >
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 12 }}>
            إذا كان لديك أي سؤال مستعجل أو تود تعديل الطلب:
          </p>
          <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" className="whatsapp-btn">
            <span style={{ fontSize: 24 }}>💬</span> راسلنا عبر الواتساب
          </a>
        </motion.div>

      </div>
    </div>
  );
}
