import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Instagram,
  Sparkles,
  X,
  Headphones,
  Send,
  Mic,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobilePlatformHub } from './components/MobilePlatformHub';
import { PlatformBreadcrumbs } from './components/PlatformBreadcrumbs';

import { HomeView } from './views/HomeView';
import { MarketplaceView } from './views/MarketplaceView';
import { WishlistView } from './views/WishlistView';
import { AiPlatformView } from './views/AiPlatformView';
import { AiBusinessIdeaView } from './views/AiBusinessIdeaView';
import { TrainingCoursesView } from './views/TrainingCoursesView';
import { SuccessStoriesView } from './views/SuccessStoriesView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { OrdersView } from './views/OrdersView';
import { RegisterEntrepreneurView } from './views/RegisterEntrepreneurView';
import { LegalView } from './views/LegalView';
import { EntrepreneurDashboardView } from './views/EntrepreneurDashboardView';

function MainAppContent() {
  const { isSeller, isAdmin } = useAuth();
  const { lang, t } = useLanguage();
  const canAccessSellerTools = isSeller || isAdmin;
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    return hash || path || 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [platformHubOpen, setPlatformHubOpen] = useState(false);

  // نافذة المستشار عوني العائمة في أقصى اليمين بالأسفل (متاحة للجميع وبنفس مميزات عوني الأولى)
  const [awniOpen, setAwniOpen] = useState(false);
  const [awniInput, setAwniInput] = useState('');
  const [isListeningAwni, setIsListeningAwni] = useState(false);
  const [awniMessages, setAwniMessages] = useState<Array<{ id: string; from: 'awni' | 'user'; text: string }>>([
    {
      id: 'awni-welcome',
      from: 'awni',
      text: 'يا هلا والله! أنا عوني رفيقك الاستشاري 🇴🇲✨ أرافقك خطوة بخطوة في اختيار المنتجات العُمانية، بطاقة ريادة، تسعير المنتجات بالريال العماني، والدورات التدريبية.',
    },
  ]);

  const navigateTo = (view: string) => {
    let clean = view.replace(/^#/, '').replace(/^\//, '');
    if (!clean || clean === '#') clean = 'home';

    const lower = clean.toLowerCase();

    // إزالة الكشك التفاعلي بالكامل
    if (
      lower.includes('kiosk') ||
      lower.includes('open-store') ||
      lower.includes('create-store') ||
      lower.includes('scan-model')
    ) {
      clean = 'home';
    }

    // صفحات البائع / التاجر محصورة للبائع والمشرف
    if (
      !canAccessSellerTools &&
      (lower.includes('ai-platform') ||
        lower.includes('ai-business-idea') ||
        lower.includes('business-idea') ||
        lower.includes('dashboard') ||
        lower.includes('admin'))
    ) {
      clean = 'home';
    }

    setCurrentView(clean);
    window.location.hash = clean === 'home' ? '' : clean;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      navigateTo(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [canAccessSellerTools]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.getAttribute('href')) {
        const href = target.getAttribute('href')!;
        if (
          href.endsWith('.html') ||
          href.startsWith('#') ||
          ['marketplace', 'ai-platform', 'cart', 'checkout', 'orders', 'kiosk-store'].some((r) => href.includes(r))
        ) {
          e.preventDefault();
          navigateTo(href);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [canAccessSellerTools]);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // ميزة التحدث الصوتي لعوني
  const handleAwniMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ar' ? 'ar-OM' : 'en-US';
    recognition.continuous = false;
    try {
      recognition.start();
      setIsListeningAwni(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAwniInput(transcript);
        setIsListeningAwni(false);
      };
      recognition.onerror = () => setIsListeningAwni(false);
      recognition.onend = () => setIsListeningAwni(false);
    } catch {
      setIsListeningAwni(false);
    }
  };

  // محرك ردود عوني الاستشارية باللهجة العمانية والإنجليزية
  const getAwniSmartReply = (question: string): string => {
    const q = question.toLowerCase();

    if (q.includes('هدي') || q.includes('لبان') || q.includes('عسل') || q.includes('سوق') || q.includes('منتج') || q.includes('gift') || q.includes('market')) {
      return t(
        'أبشر طال عمرك! في سوق مُنتَجي بتحصل أفخم الهدايا العُمانية: اللبان الحوجري الظفاري الأخضر، عسل السدر الجبلي المفحوص، والحلوى العُمانية الأصيلة. تقدر تضغط على اسم أي تاجر تحت المنتج وتشوف كل منتجاته وتقييمه.',
        'In Montaji Marketplace you will find luxury Omani gifts: Royal Green Hojari Frankincense, lab-tested Jabal Akhdar Sidr honey, and Omani Halwa. Click any seller name under a product to view their full store.'
      );
    }

    if (q.includes('ريادة') || q.includes('بطاق') || q.includes('ضريب') || q.includes('riyada')) {
      return t(
        'بطاقة ريادة من هيئة تنمية المؤسسات الصغيرة والمتوسطة تعطيك: 1) أولوية 10% في المناقصات والمشتريات الحكومية. 2) تمويل ميسر من بنك التنمية العُماني بدون فوائد. 3) شارة "موثق · ريادة" على متجرك في مُنتَجي لزيادة ثقة المشترين.',
        'The Riyada Card grants: 1) 10% priority allocation in government tenders. 2) Interest-free concessional loans from Oman Development Bank. 3) The Riyada Verified badge on your Montaji store.'
      );
    }

    if (q.includes('تسعير') || q.includes('سعر') || q.includes('ربح') || q.includes('جدوى') || q.includes('price') || q.includes('feasibility')) {
      return t(
        'قاعدة عوني الذهبية للتسعير بالريال العُماني: احسب تكلفة المواد الخام + التغليف + 5% هالك، افصل رسوم التوصيل حسب المحافظة (من 1.500 إلى 3.500 ر.ع)، وأضف هامش ربح صافي بين 35% و 45% مع رقم عشري نظيف مثل 14.500 ر.ع.',
        'Awni OMR pricing formula: sum raw materials + packaging + 5% wastage, keep governorate delivery separate (1.500 to 3.500 OMR), and add a 35%–45% sustainable margin.'
      );
    }

    if (q.includes('دور') || q.includes('تدريب') || q.includes('course')) {
      return t(
        'أكاديمية مُنتَجي توفر دورات مجانية ومعتمدة في التراخيص التجارية، المحاسبة المالية، والتسويق الرقمي للمشاريع العُمانية. ادخل قسم "الدورات التدريبية" وسجّل مقعدك الحين.',
        'Montaji Academy provides certified workshops in business licensing, financial accounting, and digital marketing. Head to Training Courses to reserve your seat.'
      );
    }

    return t(
      'حاضرين طال عمرك! اسألني عن: اقتراح هدايا ومنتجات عُمانية، شروط بطاقة ريادة، طريقة تسعير المنتجات بالريال العُماني، أو الدورات التدريبية المتاحة في المنصة.',
      'At your service! Ask me about Omani gift recommendations, Riyada card requirements, OMR product pricing, or available training courses.'
    );
  };

  const handleAwniSend = (customPrompt?: string) => {
    const q = (customPrompt ?? awniInput).trim();
    if (!q) return;

    const reply = getAwniSmartReply(q);
    setAwniMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, from: 'user', text: q },
      { id: `a-${Date.now() + 1}`, from: 'awni', text: reply },
    ]);
    if (!customPrompt) setAwniInput('');
  };

  const awniQuickPrompts =
    lang === 'ar'
      ? [
          'اقترح لي هدية عمانية فاخرة تبيّض الوجه',
          'كيف أحصل على بطاقة ريادة؟',
          'كيف أسعّر منتجاتي بالريال العماني؟',
        ]
      : [
          'Suggest a luxury Omani gift',
          'How do I get the Riyada card?',
          'How to price products in OMR?',
        ];

  const renderCurrentView = () => {
    const normalized = currentView.toLowerCase().trim();

    if (normalized === 'home' || normalized === '') {
      return <HomeView onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />;
    }

    if (normalized.includes('marketplace')) {
      return <MarketplaceView onNavigate={navigateTo} />;
    }

    if (normalized.includes('training') || normalized.includes('courses')) {
      return <TrainingCoursesView />;
    }

    // صفحات البائع / التاجر (تظهر عند تسجيل الدخول كبائع في الشريط العلوي)
    if (canAccessSellerTools) {
      if (normalized.includes('ai-platform')) return <AiPlatformView onNavigate={navigateTo} />;
      if (normalized.includes('ai-business-idea') || normalized.includes('business-idea')) {
        return <AiBusinessIdeaView onNavigate={navigateTo} />;
      }
      if (normalized.includes('dashboard') || normalized.includes('admin') || normalized.includes('analytics')) {
        return <EntrepreneurDashboardView onNavigate={navigateTo} />;
      }
    }

    if (normalized.includes('success-stories') || normalized.includes('stories')) {
      return <SuccessStoriesView onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />;
    }
    if (normalized.includes('wishlist') || normalized.includes('favorites') || normalized.includes('favorite')) {
      return <WishlistView onNavigate={navigateTo} />;
    }
    if (normalized.includes('cart')) return <CartView onNavigate={navigateTo} />;
    if (normalized.includes('checkout')) return <CheckoutView onNavigate={navigateTo} />;
    if (normalized.includes('order-confirmation') || normalized.includes('confirmation')) {
      return <OrderConfirmationView onNavigate={navigateTo} />;
    }
    if (normalized.includes('order')) return <OrdersView onNavigate={navigateTo} />;
    if (normalized.includes('register')) return <RegisterEntrepreneurView onNavigate={navigateTo} initialMode="register" />;
    if (normalized.includes('login')) return <RegisterEntrepreneurView onNavigate={navigateTo} initialMode="login" />;
    if (normalized.includes('terms')) return <LegalView initialTab="terms" onNavigate={navigateTo} />;
    if (normalized.includes('privacy')) return <LegalView initialTab="privacy" onNavigate={navigateTo} />;

    return <HomeView onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafb] text-slate-800 antialiased selection:bg-[#1f5b70] selection:text-white font-sans relative">
      <Navbar
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenAuth={handleOpenAuth}
        onOpenHub={() => setPlatformHubOpen(true)}
      />

      <PlatformBreadcrumbs currentView={currentView} onNavigate={navigateTo} />

      <main className="flex-1 pb-28 sm:pb-24 lg:pb-8">
        {renderCurrentView()}
      </main>

      {/* 1. زر السماعة في أقصى اليسار بالأسفل */}
      <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-30 flex flex-col items-start gap-2 print:hidden">
        {contactMenuOpen && (
          <div className="bg-[#122e3a] border border-[#1f5b70] text-white p-3 rounded-2xl shadow-2xl space-y-2 text-xs font-semibold animate-in slide-in-from-bottom-3 w-56">
            <div className="text-[11px] text-[#dfba83] border-b border-slate-700 pb-1.5 font-bold flex items-center justify-between">
              <span>{t('تواصل مباشر مع المنصة', 'Direct Platform Support')}</span>
              <button
                onClick={() => setContactMenuOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <a
              href="https://www.instagram.com/montji_/?hl=ar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-pink-400"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-white" dir="ltr">@montji_</span>
            </a>

            <a
              href="https://wa.me/96894842840"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-emerald-400"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-white">{t('واتساب الدعم المباشر', 'WhatsApp Support')}</span>
            </a>

            <a
              href="tel:+96894842840"
              className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-[#c59b5f]"
            >
              <Phone className="w-4 h-4" />
              <span className="text-white font-mono" dir="ltr">+968 9484 2840</span>
            </a>
          </div>
        )}

        <button
          onClick={() => setContactMenuOpen(!contactMenuOpen)}
          className="bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
          title={t('تواصل مباشر ودعم فني', 'Direct Support')}
        >
          <Headphones className="w-5 h-5 text-[#c59b5f]" />
          <span className="text-xs font-bold hidden sm:inline">{t('تواصل معنا', 'Contact Us')}</span>
        </button>
      </div>

      {/* 2. المستشار عوني العائم في أقصى اليمين بالأسفل بمحاذاة السماعة (للجميع وبنفس مميزات عوني الأولى) */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 flex flex-col items-end gap-2 print:hidden">
        {awniOpen && (
          <div className="bg-[#122e3a] border border-[#1f5b70] text-white p-4 rounded-3xl shadow-2xl space-y-3 text-xs w-80 sm:w-96 animate-in slide-in-from-bottom-3">
            {/* رأس نافذة عوني */}
            <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#1f5b70] border border-[#c59b5f]/40 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#dfba83]" />
                </div>
                <div>
                  <div className="font-black text-sm text-white">
                    {t('المستشار الاقتصادي "عوني"', 'Advisor "Awni"')}
                  </div>
                  <div className="text-[10px] text-[#dfba83]">
                    {t('مستشارك الذكي في منصة مُنتَجي 🇴🇲', 'Your Smart Omani Advisor 🇴🇲')}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setAwniOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* سجل المحادثة */}
            <div className="space-y-2 max-h-52 overflow-y-auto pe-1">
              {awniMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-[#c59b5f] text-slate-950 font-bold ms-6'
                      : 'bg-[#153e4d] text-slate-100 border border-[#1f5b70]/70 me-4'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            {/* أسئلة عوني السريعة */}
            <div className="space-y-1.5 pt-1 border-t border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">
                {t('جرّب تسأل عوني:', 'Ask Awni:')}
              </span>
              {awniQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleAwniSend(prompt)}
                  className="w-full text-start text-[11px] bg-[#153e4d]/70 hover:bg-[#1f5b70] text-[#e9cca0] px-2.5 py-1.5 rounded-xl border border-[#1f5b70]/60 transition flex items-center justify-between cursor-pointer"
                >
                  <span className="truncate">{prompt}</span>
                  <ArrowIcon className="w-3 h-3 text-[#c59b5f] shrink-0" />
                </button>
              ))}
            </div>

            {/* حقل الكتابة + الميكروفون الصوتي */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAwniSend();
              }}
              className="flex items-center gap-1.5 pt-1"
            >
              <button
                type="button"
                onClick={handleAwniMic}
                className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                  isListeningAwni
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-[#1f5b70] text-[#dfba83] hover:bg-[#153e4d]'
                }`}
                title={t('تحدث صوتياً مع عوني', 'Speak to Awni')}
              >
                <Mic className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={awniInput}
                onChange={(e) => setAwniInput(e.target.value)}
                placeholder={
                  isListeningAwni
                    ? t('عوني يستمع لصوتك...', 'Awni is listening...')
                    : t('اكتب لعوني سؤالك بلهجتك...', 'Ask Awni...')
                }
                className="flex-1 bg-[#153e4d] text-white placeholder-slate-400 px-3 py-2 rounded-xl border border-[#1f5b70] focus:outline-hidden focus:border-[#c59b5f] text-xs"
              />

              <button
                type="submit"
                className="p-2 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 rounded-xl font-bold cursor-pointer shrink-0"
                title={t('إرسال', 'Send')}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* رابط فتح صفحة عوني الكاملة عند تسجيل الدخول كبائع */}
            {canAccessSellerTools && (
              <button
                type="button"
                onClick={() => {
                  setAwniOpen(false);
                  navigateTo('ai-platform.html');
                }}
                className="w-full py-2 rounded-xl bg-[#c59b5f]/20 hover:bg-[#c59b5f]/30 text-[#dfba83] border border-[#c59b5f]/40 text-[11px] font-bold transition cursor-pointer"
              >
                {t('فتح صفحة المستشار عوني الكاملة ↗', 'Open Full Awni Advisor Page ↗')}
              </button>
            )}
          </div>
        )}

        <button
          onClick={() => setAwniOpen(!awniOpen)}
          className="bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
          title={t('المستشار عوني', 'Advisor Awni')}
        >
          <Sparkles className="w-5 h-5 text-[#c59b5f]" />
          <span className="text-xs font-bold hidden sm:inline">
            {t('المستشار عوني', 'Advisor Awni')}
          </span>
        </button>
      </div>

      <MobileBottomNav
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenHub={() => setPlatformHubOpen(true)}
      />

      <MobilePlatformHub
        isOpen={platformHubOpen}
        onClose={() => setPlatformHubOpen(false)}
        currentView={currentView}
        onNavigate={navigateTo}
        onOpenAuth={handleOpenAuth}
      />

      <Footer onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={(u) => {
          if (u?.role === 'seller' || u?.role === 'admin' || u?.role === 'entrepreneur') {
            navigateTo('dashboard.html');
          } else {
            navigateTo('home');
          }
        }}
        onNavigateToFullPage={navigateTo}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <MainAppContent />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
