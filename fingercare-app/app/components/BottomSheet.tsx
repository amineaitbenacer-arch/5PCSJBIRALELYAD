'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOROCCAN_CITIES = [
  'الدار البيضاء', 'الرباط', 'مراكش', 'فاس', 'طنجة', 'أكادير', 'مكناس',
  'وجدة', 'القنيطرة', 'تطوان', 'آسفي', 'الجديدة', 'خريبكة', 'بني ملال',
  'تازة', 'الناظور', 'سطات', 'خنيفرة', 'العيون', 'قلعة السراغنة',
  'الحسيمة', 'تاوريرت', 'برشيد', 'سلا', 'المحمدية', 'ورزازات',
  'ميدلت', 'أزرو', 'إفران', 'تارودانت', 'تيزنيت', 'الصويرة',
  'زاكورة', 'الراشيدية', 'كلميم', 'طانطان', 'سيدي قاسم',
  'سيدي سليمان', 'وزان', 'شفشاون', 'العرائش', 'أصيلة'
];

const OFFERS = [
  { id: 1, name: 'Pack 5 قطع', pieces: 5, price: 179, popular: false },
  { id: 2, name: 'Pack 10 قطع', pieces: 10, price: 279, popular: true },
];

export default function BottomSheet({ isOpen, onClose }: BottomSheetProps) {
  const [selectedOffer, setSelectedOffer] = useState(OFFERS[1]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fire InitiateCheckout pixel when opened
  useEffect(() => {
    if (isOpen) {
      try {
        if (typeof window !== 'undefined') {
          // @ts-expect-error fbq is loaded via script
          if (window.fbq) window.fbq('track', 'InitiateCheckout', { value: selectedOffer.price, currency: 'MAD' });
          // @ts-expect-error ttq is loaded via script
          if (window.ttq) window.ttq.track('InitiateCheckout', { value: selectedOffer.price, currency: 'MAD' });
        }
      } catch { /* pixel not loaded */ }
    }
  }, [isOpen, selectedOffer.price]);

  const handlePhoneChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 10) {
      setPhone(cleaned);
    }
    if (cleaned.length > 0 && cleaned.length < 10) {
      setPhoneError('⚠️ تأكد من رقم الهاتف (10 أرقام)');
    } else {
      setPhoneError('');
    }
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || phone.length !== 10 || !city) {
      if (phone.length !== 10) setPhoneError('⚠️ تأكد من رقم الهاتف (10 أرقام)');
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      name: name.trim(),
      phone,
      city,
      offer: selectedOffer.name,
      pieces: selectedOffer.pieces,
      price: selectedOffer.price,
      timestamp: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem('lastOrder', JSON.stringify(orderData));

    // Save to API
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
    } catch { /* offline fallback */ }

    // Redirect to thank you page
    window.location.href = '/thankyou';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 51,
              background: 'white',
              borderTopLeftRadius: '24px',
              borderTopRightRadius: '24px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
            }}
          >
            {/* Handle bar */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 48, height: 5, borderRadius: 3, background: '#E2E8F0' }} />
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: '#F1F5F9',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#64748B',
              }}
              aria-label="إغلاق"
            >
              ✕
            </button>

            <div style={{ padding: '16px 20px 32px' }}>
              {/* Title */}
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20, textAlign: 'center', color: '#0F172A' }}>
                🛒 اختر العرض المناسب ليك
              </h2>

              {/* Offer Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {OFFERS.map((offer) => (
                  <div
                    key={offer.id}
                    className={`option-card ${selectedOffer.id === offer.id ? 'selected' : ''} ${offer.popular ? 'popular' : ''}`}
                    onClick={() => setSelectedOffer(offer)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${offer.name} - ${offer.price} درهم`}
                  >
                    {offer.popular && (
                      <div style={{
                        position: 'absolute',
                        top: -10,
                        right: 16,
                        background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                        color: 'white',
                        padding: '4px 14px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 700,
                      }}>
                        ⭐ الأكثر طلباً
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          border: `3px solid ${selectedOffer.id === offer.id ? '#F59E0B' : '#CBD5E1'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {selectedOffer.id === offer.id && (
                            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#F59E0B' }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 16, color: '#0F172A' }}>{offer.name}</div>
                          <div style={{ fontSize: 13, color: '#64748B' }}>{offer.pieces} جبائر للأصابع</div>
                        </div>
                      </div>
                      <div style={{
                        fontWeight: 900,
                        fontSize: 22,
                        color: offer.popular ? '#D97706' : '#10B981',
                      }}>
                        {offer.price} <span style={{ fontSize: 14, fontWeight: 600 }}>درهم</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Express Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="الاسم الكامل"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="checkout-name"
                />

                <div>
                  <input
                    className={`form-input ${phoneError ? 'error' : ''}`}
                    type="tel"
                    inputMode="numeric"
                    placeholder="رقم الهاتف (06XXXXXXXX)"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    id="checkout-phone"
                  />
                  {phoneError && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: '#EF4444', fontSize: 13, marginTop: 6, fontWeight: 600 }}
                    >
                      {phoneError}
                    </motion.p>
                  )}
                </div>

                <select
                  className="form-input"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  id="checkout-city"
                >
                  <option value="">اختر المدينة</option>
                  {MOROCCAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Total Price */}
              <div style={{
                textAlign: 'center',
                margin: '20px 0',
                padding: '16px',
                background: '#F0FDF4',
                borderRadius: 16,
                border: '2px dashed #10B981',
              }}>
                <p style={{ fontSize: 14, color: '#64748B', marginBottom: 4 }}>المجموع عند الاستلام:</p>
                <p style={{ fontSize: 32, fontWeight: 900, color: '#059669' }}>
                  {selectedOffer.price} <span style={{ fontSize: 18 }}>درهم</span>
                </p>
                <p style={{ fontSize: 13, color: '#10B981', marginTop: 4 }}>🚚 التوصيل مجاني</p>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="pulse-cta"
                style={{
                  width: '100%',
                  padding: '18px',
                  background: isSubmitting ? '#94A3B8' : 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 20,
                  fontWeight: 800,
                  fontFamily: 'Cairo, sans-serif',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'transform 0.2s',
                  minHeight: 60,
                }}
                id="submit-order-btn"
              >
                {isSubmitting ? '⏳ جاري إرسال الطلب...' : '🛒 اطلب الآن'}
              </button>

              {/* Trust line */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16, fontSize: 12, color: '#64748B' }}>
                <span>🔒 معلوماتك محمية</span>
                <span>🚚 توصيل مجاني</span>
                <span>💳 الدفع عند الاستلام</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
