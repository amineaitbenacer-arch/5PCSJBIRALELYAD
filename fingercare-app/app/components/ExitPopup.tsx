'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ExitPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = useCallback(() => {
    setShow(false);
    setDismissed(true);
  }, []);

  useEffect(() => {
    if (dismissed) return;

    // Desktop: mouse leave detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
      }
    };

    // Mobile: quick scroll up detection
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const currentScrollY = window.scrollY;
        const scrollDiff = lastScrollY - currentScrollY;

        // If user scrolled up more than 200px quickly (trying to leave)
        if (scrollDiff > 200 && currentScrollY < 100 && !dismissed) {
          setShow(true);
        }
        lastScrollY = currentScrollY;
      }, 100);
    };

    // Only activate after 10 seconds on page
    const activateTimeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 10000);

    return () => {
      clearTimeout(activateTimeout);
      clearTimeout(scrollTimeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [dismissed]);

  const scrollToBuy = () => {
    handleDismiss();
    // Trigger the buy button
    const buyBtn = document.getElementById('sticky-buy-btn');
    if (buyBtn) buyBtn.click();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="exit-popup-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="exit-popup"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 48,
                height: 48,
                borderRadius: '50%',
                border: 'none',
                background: '#F1F5F9',
                cursor: 'pointer',
                fontSize: 18,
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="إغلاق"
            >
              ✕
            </button>

            {/* Icon */}
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛑</div>

            {/* Title */}
            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 12, lineHeight: 1.4 }}>
              انتظر!
            </h3>

            {/* Message */}
            <p style={{ fontSize: 16, color: '#64748B', marginBottom: 24, lineHeight: 1.7 }}>
              لقد تم حجز نسختك لمدة <strong style={{ color: '#EF4444' }}>5 دقائق فقط</strong>. 
              هل أنت متأكد أنك تريد تفويت العرض؟
            </p>

            {/* CTA */}
            <button
              onClick={scrollToBuy}
              className="pulse-cta"
              style={{
                width: '100%',
                padding: 16,
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: 16,
                fontSize: 18,
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
                minHeight: 56,
              }}
            >
              🛒 نعم، أريد الطلب الآن
            </button>

            <button
              onClick={handleDismiss}
              style={{
                width: '100%',
                padding: 12,
                background: 'transparent',
                color: '#94A3B8',
                border: 'none',
                fontSize: 14,
                fontFamily: 'Cairo, sans-serif',
                cursor: 'pointer',
                marginTop: 8,
              }}
            >
              لا شكراً
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
