"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CheckCircle, Check, ShieldCheck, ChevronDown, Rocket, PhoneCall, Truck, HandCoins, Receipt, PackageOpen, ChevronRight, ChevronLeft } from "lucide-react";

export default function ThankYouPage() {
  const [orderData, setOrderData] = useState({
    id: "----",
    name: "----",
    offer: "----",
    price: "----",
    phone: "00 00 00 00 00"
  });
  const [isVerified, setIsVerified] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Reviews Pagination State
  const [currentReviewPage, setCurrentReviewPage] = useState(1);
  const totalReviewPages = 3;

  useEffect(() => {
    // Confetti Animation on Load
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#FFD700', '#10B981', '#3B82F6'] });
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#FFD700', '#10B981', '#3B82F6'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Fetch Data from Local Storage
    try {
      const orderDataStr = localStorage.getItem('ac_last_order');
      if (orderDataStr) {
        const data = JSON.parse(orderDataStr);
        let userPhone = data.phone || "---";
        if (userPhone.length === 10) {
          userPhone = userPhone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
        }
        setOrderData({
          id: data.orderId ? `#${data.orderId}` : `#${Math.floor(1000 + Math.random() * 9000)}`,
          name: data.name || "زبوننا الكريم",
          offer: data.offerName || "العرض المختار",
          price: data.price || "---",
          phone: userPhone
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleVerify = () => {
    setIsVerified(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.8 } });
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const nextReviewPage = () => setCurrentReviewPage(p => p === totalReviewPages ? 1 : p + 1);
  const prevReviewPage = () => setCurrentReviewPage(p => p === 1 ? totalReviewPages : p - 1);

  const faqs = [
    { q: "واش نقدر نركبها لراسي ولا خاصني معلم؟", a: "التركيب ساهل بزاف ومصمم باش تديرو لراسك فداركم بكل سهولة. مع التليفون كيجيو مناديل باش تنظف الشاشة، وكتحطها كتلصق بوحدها بتقنية النانو بلا ما تخلي دوك الفقاعات ديال البرد المزعجة." },
    { q: "إمتى غادي يوصلني الكوموند ديالي؟", a: "بمجرد ما نأكدو معاك فالتليفون، كنسيفطوها ليك ديك الساعة. غالباً كتوصلك بين 24 حتى 48 ساعة لباب الدار ديالك، على حساب المدينة فاش كاين." },
    { q: "واش نخلص دابا ولا حتى يوصلني؟", a: "الخلاص حتى تشد السلعة فيديك وتقلبها وتتأكد منها عاد تخلص الليفروغ. حنا كنتيقو فالمنتج ديالنا وهدفنا هو راحتك 100%." },
    { q: "واش هاد الحماية كتأثر على الطاكتيل ديال الشاشة؟", a: "نهائياً! الحماية رقيقة بزاف ومصنوعة من مواد بريميوم باش تخلي الطاكتيل خدام مزيان وسريع كيفما كان، والصورة كتبقى واضحة وساطعة بحال ما داير والو للشاشة." },
    { q: "إلى لقيت فيها شي مشكل واش نقدر نردها؟", a: "أكيد! عندنا ضمان الرضا الشامل. إلى وصلاتك مهرسة أو فيها شي ديفو من الشركة، كنعوضوك وحدة خرى فابور أو كنرجعو ليك فلوسك بدون أي تعقيدات. راحتك هي الأهم." }
  ];

  return (
    <div dir="rtl" className="min-h-screen text-slate-50 font-cairo overflow-x-hidden" style={{ 
      backgroundColor: '#0a0f16',
      backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(16, 185, 129, 0.05), transparent 25%), radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.05), transparent 25%)'
    }}>
      
      {/* Dynamic Scoped CSS for Reviews exact styling */}
      <style dangerouslySetInnerHTML={{__html: `
        .ac-reviews-section { margin-bottom: 2.5rem; }
        .ac-section-heading { text-align: center; font-size: 1.8rem; font-weight: 900; margin-bottom: 0.5rem; color: #FFF; line-height: 1.4; }
        .ac-section-subheading { text-align: center; color: #FFD700; font-size: 1.1rem; margin-bottom: 2rem; }
        
        .ac-review-page { display: none; flex-direction: column; gap: 1rem; }
        .ac-review-page.active { display: flex; animation: acFadeIn 0.5s ease; }
        
        .ac-review-card {
          background: rgba(20, 26, 35, 0.7); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.2rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        .ac-review-head { display: flex; align-items: center; gap: 0.85rem; margin-bottom: 0.75rem; }
        .ac-reviewer-avatar { font-size: 1.8rem; background: rgba(0,0,0,0.3); width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .ac-reviewer-name { font-weight: 800; font-size: 0.95rem; color: #FFF; margin-bottom: 0.2rem; }
        .ac-review-stars { font-size: 0.85rem; color: #F59E0B; display: flex; align-items: center; gap: 0.5rem; }
        .ac-verified-tag { background: rgba(16, 185, 129, 0.18); color: #10B981; font-size: 0.72rem; padding: 0.15rem 0.5rem; border-radius: 50px; font-weight: 800; }
        .ac-review-text { font-size: 0.9rem; color: #F8FAFC; line-height: 1.7; font-style: italic; }

        .ac-reviews-nav-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 1.5rem; }
        .ac-rev-nav-btn {
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #FFF; font-weight: 800;
          padding: 0.5rem 1rem; border-radius: 50px; font-size: 0.85rem; cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; gap: 6px;
        }
        .ac-rev-nav-btn:hover { border-color: #FFD700; color: #FFD700; }
        .ac-rev-page-indicators { display: flex; gap: 0.5rem; }
        .ac-rev-dot {
          width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.3); color: #94A3B8;
          display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.85rem; cursor: pointer; transition: all 0.3s;
        }
        .ac-rev-dot.active, .ac-rev-dot:hover { background: #FFD700; color: #0B0F17; box-shadow: 0 0 12px rgba(255, 215, 0, 0.5); }
        
        @keyframes acFadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
      `}} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-center py-5 border-b border-white/5 bg-[#0a0f16]/80 backdrop-blur-md">
        <div className="flex items-center gap-3 text-2xl font-black bg-gradient-to-r from-yellow-400 to-white bg-clip-text text-transparent">
          <ShieldCheck className="text-yellow-400 w-8 h-8" />
          AntiChoc Protect®
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 pb-20">
        
        {/* HERO */}
        <div className="text-center py-12 animate-fade-in-down">
          <CheckCircle className="w-24 h-24 text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
            طلبيتك دازت بنجاح! 🎉
          </h1>
          <p className="text-xl text-slate-300 font-semibold leading-relaxed">
            أنت الآن على بعد خطوة واحدة من حماية عائلتك بشكل احترافي.<br />
            فريقنا غادي يتصل بيك فأقرب وقت باش نأكدو معاك الإرسال.
          </p>
        </div>

        {/* STEPS */}
        <div className="relative flex justify-between mb-12 px-4 animate-fade-in">
          <div className="absolute top-[25px] left-[10%] right-[10%] h-[2px] bg-white/10 -z-10"></div>
          
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-14 h-14 rounded-full bg-emerald-500 border-2 border-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.6)] scale-110 transition-transform">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block font-black text-white text-[1rem]">اتصال للتأكيد</span>
              <span className="block font-semibold text-slate-400 text-sm mt-1">(في غضون دقائق)</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-14 h-14 rounded-full bg-[#141A23] border-2 border-white/10 flex items-center justify-center text-slate-500">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block font-black text-slate-500 text-[1rem]">شحن سريع</span>
              <span className="block font-semibold text-slate-600 text-sm mt-1">(سريع ومجاني)</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-3 w-1/3">
            <div className="w-14 h-14 rounded-full bg-[#141A23] border-2 border-white/10 flex items-center justify-center text-slate-500">
              <HandCoins className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="block font-black text-slate-500 text-[1rem]">الدفع</span>
              <span className="block font-semibold text-slate-600 text-sm mt-1">(عند الاستلام)</span>
            </div>
          </div>
        </div>

        {/* ORDER RECEIPT */}
        <div className="relative overflow-hidden rounded-[20px] p-8 mb-12 shadow-[0_15px_35px_rgba(0,0,0,0.4)] border border-white/10 animate-fade-in-down"
             style={{ background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))' }}>
          <div className="absolute top-0 left-0 right-0 h-[5px] bg-gradient-to-r from-yellow-400 to-white"></div>
          
          <div className="flex items-center justify-center gap-3 text-2xl font-black text-white mb-6 pb-4 border-b border-white/10 border-dashed">
            <Receipt className="w-6 h-6 text-yellow-400" />
            ملخص الطلب
          </div>
          
          <div className="space-y-4 text-lg">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">رقم الطلب:</span>
              <span className="text-white font-black">{orderData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">الاسم:</span>
              <span className="text-white font-black">{orderData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-semibold">العرض المختار:</span>
              <span className="text-yellow-400 font-black drop-shadow-[0_0_10px_rgba(255,215,0,0.3)]">{orderData.offer}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 mt-2 pt-4">
              <span className="text-slate-400 font-semibold">المبلغ الإجمالي:</span>
              <span className="text-emerald-400 font-black text-xl">{orderData.price} درهم</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 py-3 rounded-full font-black text-lg w-full">
            <PackageOpen className="w-5 h-5" /> التوصيل مجاني بالكامل
          </div>
        </div>

        {/* PHONE VERIFICATION */}
        <div className="relative overflow-hidden rounded-[24px] p-10 mb-12 text-center shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-emerald-500/30"
             style={{ background: 'linear-gradient(145deg, rgba(16, 25, 40, 0.9), rgba(15, 30, 45, 0.95))' }}>
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
          
          <div className="bg-white/5 border-r-4 border-blue-500 rounded-2xl p-6 mb-8 text-right">
            <p className="text-white text-xl leading-[1.8] font-bold text-shadow-sm">
              نحن نعلم أن الأخطاء المطبعية تحدث أحياناً! لتجنب أي تأخير ولنتمكن من الاتصال بك <span className="text-emerald-400 font-black">لشحن طلبيتك فوراً</span>، المرجو التأكد من رقمك أسفله:
            </p>
          </div>
          
          <div className={`text-5xl font-black tracking-[4px] text-white mb-10 inline-block px-10 py-4 rounded-2xl border border-white/20 bg-black/40 shadow-[0_0_25px_rgba(255,255,255,0.1)] transition-transform duration-300 ${isVerified ? 'scale-105 text-emerald-400 border-emerald-500' : ''}`} dir="ltr">
            {orderData.phone}
          </div>
          
          <button 
            onClick={handleVerify}
            disabled={isVerified}
            className={`w-full flex items-center justify-center gap-4 py-5 px-8 rounded-full text-2xl font-black transition-all duration-300 ${
              isVerified 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_15px_30px_rgba(37,99,235,0.4)]' 
                : 'bg-gradient-to-br from-emerald-500 to-emerald-700 hover:-translate-y-1 shadow-[0_15px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_20px_40px_rgba(16,185,129,0.5)]'
            }`}
          >
            {isVerified ? (
              <>
                <CheckCircle className="w-7 h-7" /> تمت العملية بنجاح!
              </>
            ) : (
              <>
                <Check className="w-7 h-7" /> نعم، لقد تأكدت ورقمي صحيح 100%
              </>
            )}
          </button>
          
          {isVerified && (
            <div className="mt-6 text-blue-400 font-black text-lg flex items-center justify-center gap-2 animate-fade-in">
              <Rocket className="w-5 h-5" /> ناضي! خلي تليفونك حداك، راه غادي نتاصلو بيك دابا.
            </div>
          )}
        </div>

        {/* 15 REVIEWS BLOCK (PAGINATED LIKE PRODUCT PAGE) */}
        <section className="ac-reviews-section">
          <h2 className="ac-section-heading">⭐ آراء وتجارب 15 زبون مغربي (تقييمات حقيقية 100% 🇲🇦)</h2>
          <p className="ac-section-subheading">تصفح مراجعات حقيقية لأسر وعائلات مغربية جربت عازل AntiChoc Protect®</p>

          <div className="ac-reviews-carousel-wrapper">
            
            {/* PAGE 1 */}
            <div className={`ac-review-page ${currentReviewPage === 1 ? 'active' : ''}`}>
              {[
                { av: "👨‍💼", name: "السي عبد القادر - مكناس 📍", txt: "عندي شوفو قديم 80 لتر وكان ديما كيدير ليا النغزة ف يديا ملي كنقيس الروبيني. ملي ركبت هاد القطعتين غبر داك التنميل نهائياً. منتج يستاهل كل درهم." },
                { av: "👩‍👧", name: "فاطمة الزهراء - طنجة 📍", txt: "ركبتهم بوحدي بلا سباك، السنون ديال النحاس راكبين مزيان بلا تسريب ديال الماء. دابا ولادي كيدوشو وأنا مرتاحة ومتهنية." },
                { av: "👨‍👩‍👦", name: "عمر المراكشي - مراكش 📍", txt: "وصلني الطلب فـ 24 ساعة. تفحصت القطع قبل ما نخلص الموزع، البلاستيك ديالو غليظ وصحيح والنحاس ممتازة الجودة ديالو." },
                { av: "🛠️", name: "كريم الفاسي (تقني) - فاس 📍", txt: "أنا كهربائي منازل وكنصح كاع الزبناء ديالي يركبو هاد العازل تحسباً لأي تآكل ف المقاومة (الريزيستانس) ديال الشوفو." },
                { av: "👩‍💼", name: "خديجة العلمي - الدار البيضاء 📍", txt: "شريت الباك ديال 4 قطع، زوج لداري وزوج لدار الوالدة ف القنيطرة. راحة بال كبيرة بصراحة." }
              ].map((r, i) => (
                <div key={i} className="ac-review-card">
                  <div className="ac-review-head">
                    <div className="ac-reviewer-avatar">{r.av}</div>
                    <div>
                      <div className="ac-reviewer-name">{r.name}</div>
                      <div className="ac-review-stars">⭐⭐⭐⭐⭐ <span className="ac-verified-tag">شراء مؤكد ✅</span></div>
                    </div>
                  </div>
                  <p className="ac-review-text">"{r.txt}"</p>
                </div>
              ))}
            </div>

            {/* PAGE 2 */}
            <div className={`ac-review-page ${currentReviewPage === 2 ? 'active' : ''}`}>
              {[
                { av: "👨‍💻", name: "عبد العالي السوسي - أكادير 📍", txt: "الضغط د الماء بقى هو هو ما نقصش نهائياً، وهذا هو المخاوف اللي كانت عندي. منتج ناجح 100%." },
                { av: "👴", name: "رشيد التازي - تازة 📍", txt: "ممتنون لكم بزاف، التعامل راقي والتوصيل مجاني وسريع جداً لمدينة تازة." },
                { av: "👩‍🏫", name: "مريم البقالي - تطوان 📍", txt: "كنت ديما كنقطع بريز الشوفو قبل الدوش، دابا الحمد لله تهنيت من هاد المعاناة والوسواس اليومي." },
                { av: "👦", name: "سفيان الناصري - سلا 📍", txt: "تركيب فـ 3 دقائق فقط باستعمال مفتاح عادي. النحاس ممتازة وركبو بدون أي تسرب نقطة ماء." },
                { av: "👩‍⚕️", name: "أمينة السلاوي - الرباط 📍", txt: "عازل ممتاز، كيقطع الدارة الكهربائية ف الماء ويحمي الأطفال فالحمام. كنصح بيه كل أخت." }
              ].map((r, i) => (
                <div key={i} className="ac-review-card">
                  <div className="ac-review-head">
                    <div className="ac-reviewer-avatar">{r.av}</div>
                    <div>
                      <div className="ac-reviewer-name">{r.name}</div>
                      <div className="ac-review-stars">⭐⭐⭐⭐⭐ <span className="ac-verified-tag">شراء مؤكد ✅</span></div>
                    </div>
                  </div>
                  <p className="ac-review-text">"{r.txt}"</p>
                </div>
              ))}
            </div>

            {/* PAGE 3 */}
            <div className={`ac-review-page ${currentReviewPage === 3 ? 'active' : ''}`}>
              {[
                { av: "🧔", name: "ياسين المرابط - المحمدية 📍", txt: "السلعة ممتازة ومطابقة للصور تماماً. المعاينة قبل الدفع كتعطي ثقة كبيرة ف المنتج." },
                { av: "👩‍🍳", name: "إلهام الدكالي - الجديدة 📍", txt: "شريت هاد العازل بعدما شفت حادثة تكهرب عند الجيران. الوقاية خير من العلاج وتكلفة بسيطة لحماية حياتنا." },
                { av: "👨‍🌾", name: "محمد البكاري - بني ملال 📍", txt: "منتج عالي الجودة وسنون النحاس صلبة 100%. التوصيل كان سريع جداً فـ 24 ساعة." },
                { av: "🧕", name: "نجاة برادة - وجدة 📍", txt: "شكراً بزاف على المصداقية والسرعة ف التوصيل. راحة البال ف الحمام لا تقدر بثمن." },
                { av: "👨‍✈️", name: "حسن الخمليشي - الحسيمة 📍", txt: "باك 4 قطع ممتاز جداً ووفرت فيه المبلغ. منتج ضروري فكل منزل مغربي بدون استثناء." }
              ].map((r, i) => (
                <div key={i} className="ac-review-card">
                  <div className="ac-review-head">
                    <div className="ac-reviewer-avatar">{r.av}</div>
                    <div>
                      <div className="ac-reviewer-name">{r.name}</div>
                      <div className="ac-review-stars">⭐⭐⭐⭐⭐ <span className="ac-verified-tag">شراء مؤكد ✅</span></div>
                    </div>
                  </div>
                  <p className="ac-review-text">"{r.txt}"</p>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="ac-reviews-nav-bar">
              <button className="ac-rev-nav-btn" onClick={prevReviewPage}>
                <ChevronRight className="w-4 h-4" /> السابقة
              </button>
              
              <div className="ac-rev-page-indicators">
                {[1, 2, 3].map(page => (
                  <span 
                    key={page}
                    className={`ac-rev-dot ${currentReviewPage === page ? 'active' : ''}`} 
                    onClick={() => setCurrentReviewPage(page)}
                  >
                    {page}
                  </span>
                ))}
              </div>

              <button className="ac-rev-nav-btn" onClick={nextReviewPage}>
                التالية <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <div>
          <h2 className="text-center text-3xl font-black mb-8 text-white">أسئلة شائعة تقدر تفيدك 💡</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl border border-white/10 overflow-hidden bg-black/20">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-right hover:bg-white/5 transition-colors"
                >
                  <span className="text-xl font-bold">{faq.q}</span>
                  <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-yellow-400' : 'text-slate-400'}`} />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-300 bg-black/40"
                  style={{ maxHeight: activeFaq === idx ? '300px' : '0px' }}
                >
                  <div className="p-6 pt-0 text-slate-300 leading-loose text-lg font-medium border-t border-white/5">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
