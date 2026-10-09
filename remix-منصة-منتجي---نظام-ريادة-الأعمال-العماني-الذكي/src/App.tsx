import React, { useState, useEffect } from 'react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'market'>('home');

  // إخفاء شاشة البدء التلقائية بعد التحميل
  useEffect(() => {
    const splash = document.getElementById('instant-splash');
    if (splash) {
      splash.style.opacity = '0';
      setTimeout(() => splash.remove(), 400);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#071319] text-slate-100 flex flex-col font-sans antialiased selection:bg-[#22d3ee] selection:text-black">
      
      {/* الشريط العلوي */}
      <header className="sticky top-0 z-40 bg-[#0d232d]/90 backdrop-blur-md border-b border-[#1f5b70]/40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#c59b5f] to-[#1f5b70] p-[2px] shadow-lg shadow-[#1f5b70]/20">
            <div className="w-full h-full bg-[#071319] rounded-[10px] flex items-center justify-center font-black text-lg text-[#dfba83]">
              مُ
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-[#22d3ee] bg-clip-text text-transparent">
              مَنصّة مُنتَجي
            </h1>
            <p className="text-xs text-[#dfba83] font-medium">نظام ريادة الأعمال العماني الذكي</p>
          </div>
        </div>

        {/* أزرار التبويبات */}
        <nav className="flex items-center gap-2">
          <button 
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'home' 
                ? 'bg-[#1f5b70] text-white shadow-md shadow-[#1f5b70]/40' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            الرئيسية
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'services' 
                ? 'bg-[#1f5b70] text-white shadow-md shadow-[#1f5b70]/40' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            الخدمات والمزايا
          </button>
          <button 
            onClick={() => setActiveTab('market')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'market' 
                ? 'bg-[#1f5b70] text-white shadow-md shadow-[#1f5b70]/40' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            سوق المنتجات
          </button>
        </nav>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-10 flex flex-col gap-8">
        
        {/* الواجهة الرئيسية */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-10">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0d232d] via-[#123644] to-[#0d232d] border border-[#1f5b70]/50 p-8 md:p-12 shadow-2xl">
              <div className="absolute top-0 left-0 w-96 h-96 bg-[#22d3ee]/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10 max-w-2xl flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#dfba83]/10 text-[#dfba83] border border-[#dfba83]/20 w-fit">
                  المنصة الوطنية لتمكين المشاريع العمانية
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  انطلق بمشروعك التجاري نحو آفاق جديدة مع <span className="text-[#22d3ee]">مُنتجي</span>
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                  بيئة رقمية شاملة تجمع رواد الأعمال والموردين والمستهلكين، لدعم الصناعات والمشاريع العمانية الناشئة وتسهيل تسويقها ونموها في الأسواق.
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mt-2">
                  <button 
                    onClick={() => setActiveTab('market')}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#c59b5f] to-[#dfba83] text-[#071319] font-black text-sm shadow-lg shadow-[#c59b5f]/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    استكشف سوق المنتجات
                  </button>
                  <button 
                    onClick={() => setActiveTab('services')}
                    className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm transition-all"
                  >
                    تعرف على حلول المنصة
                  </button>
                </div>
              </div>
            </div>

            {/* بطاقات المزايا */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#0d232d]/60 border border-[#1f5b70]/30 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#22d3ee]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#1f5b70]/30 flex items-center justify-center text-[#22d3ee]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">تحليل ودراسات الجدوى</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  أدوات لدراسة التكاليف والأسعار التنافسية وقياس حجم الطلب على المنتجات في السوق المحلي.
                </p>
              </div>

              <div className="bg-[#0d232d]/60 border border-[#1f5b70]/30 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#22d3ee]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#1f5b70]/30 flex items-center justify-center text-[#dfba83]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">تسويق المنتجات وتوسيع المبيعات</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  قنوات ترويجية لربط منتجاتك بالعملاء المناسبين والمستعدين للشراء بأقل تكاليف تشغيلية.
                </p>
              </div>

              <div className="bg-[#0d232d]/60 border border-[#1f5b70]/30 rounded-2xl p-6 flex flex-col gap-3 hover:border-[#22d3ee]/40 transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#1f5b70]/30 flex items-center justify-center text-[#22d3ee]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white">سوق تجاري عماني</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  واجهة عرض للمنتجات الحرفية والغذائية والخدمات المتنوعة التي يقدمها رواد الأعمال.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* تبويب الخدمات */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white">خدمات منصة مُنتجي</h3>
              <p className="text-sm text-slate-400">حلول مصممة لتسريع نمو أعمالك ومشاريعك الناشئة</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#0d232d]/80 border border-[#1f5b70]/40 rounded-2xl p-6 flex gap-4 items-start">
                <div className="p-3 bg-[#1f5b70]/20 rounded-xl text-[#22d3ee]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">الربط مع الموردين المعتمدين</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    توفير قنوات اتصال موثوقة مع موردي المواد الأولية وخدمات التغليف والخدمات اللوجستية.
                  </p>
                </div>
              </div>

              <div className="bg-[#0d232d]/80 border border-[#1f5b70]/40 rounded-2xl p-6 flex gap-4 items-start">
                <div className="p-3 bg-[#dfba83]/20 rounded-xl text-[#dfba83]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1">حلول الدفع والتحصيل</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    خيارات متعددة لاستلام المدفوعات وتسهيل إدارة مبيعات المتجر بكل شفافية وسرعة.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* تبويب سوق المنتجات */}
        {activeTab === 'market' && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">سوق منتجي</h3>
                <p className="text-xs text-slate-400">المنتجات والمشاريع المسجلة في المنصة</p>
              </div>
              <button className="px-4 py-2 bg-[#dfba83]/10 border border-[#dfba83]/30 text-[#dfba83] rounded-xl text-xs font-bold hover:bg-[#dfba83]/20 transition-all">
                + سجّل متجرك ومنتجاتك
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { title: 'لبان عماني فاخر ومشتقاته', category: 'صناعات حرفية', price: '12 ر.ع' },
                { title: 'عسل سدر جبلي طبيعي', category: 'أغذية ومنتجات محلية', price: '25 ر.ع' },
                { title: 'حلول تغليف صديقة للبيئة', category: 'خدمات تجارية', price: 'حسب الكمية' },
              ].map((item, idx) => (
                <div key={idx} className="bg-[#0d232d]/60 border border-[#1f5b70]/30 rounded-2xl p-5 flex flex-col justify-between gap-4 hover:border-[#22d3ee]/40 transition-all">
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-[#dfba83] bg-[#dfba83]/10 w-fit px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-sm font-extrabold text-[#22d3ee]">{item.price}</span>
                    <button className="text-xs text-slate-300 hover:text-white font-medium">عرض التفاصيل ←</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* الفوتر */}
      <footer className="border-t border-[#1f5b70]/30 bg-[#0d232d]/50 py-6 px-6 text-center text-xs text-slate-500">
        <p>جميع الحقوق محفوظة © منصة مُنتجي - منظومة ريادة الأعمال العمانية</p>
      </footer>
    </div>
  );
}
