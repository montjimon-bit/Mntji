import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Instagram,
  X,
  Headphones,
  Bot,
  Send,
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
  const { t } = useLanguage();
  const canAccessSellerTools = isSeller || isAdmin;

  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    return hash || path || 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [platformHubOpen, setPlatformHubOpen] = useState(false);

  // نافذة الشات بوت العام العائمة في أقصى اليمين بالأسفل (متاحة للجميع)
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);
  const [widgetInput, setWidgetInput] = useState('');
  const [widgetMessages, setWidgetMessages] = useState<Array<{ id: string; from: 'bot' | 'user'; text: string }>>([
    {
      id: 'w1',
      from: 'bot',
      text: 'مرحباً بك في منصة مُنتَجي 🇴🇲! أنا المساعد العام للمنصة، كيف يمكنني مساعدتك اليوم؟',
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

    // صفحة المستشار عوني الكاملة + دراسة الجدوى + لوحة التاجر محصورة للبائع/التاجر فقط
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

  const handleWidgetSend = (e: React.FormEvent) => {
    e.preventDefault();
    const q = widgetInput.trim();
    if (!q) return;

    let reply = t(
      'يمكنك تصفح سوق المنتجات العُمانية أو التسجيل في الدورات التدريبية من القائمة العلوية، وللتواصل المباشر اضغط على زر السماعة في اليسار.',
      'You can browse the Omani Marketplace or enroll in Training Courses from the top menu, or click Support on the left.'
    );
    if (q.includes('سوق') || q.includes('منتج') || q.toLowerCase().includes('market')) {
      reply = t(
        'سوق المنتجات يضم منتجات عُمانية أصلية من 11 محافظة، اضغط على اسم أي تاجر تحت المنتج لعرض كل منتجاته وتقييمه.',
        'The Marketplace features authentic Omani goods across 11 governorates. Click any seller name under a product to view their full store.'
      );
    } else if (q.includes('دور') || q.includes('تدريب') || q.toLowerCase().includes('course')) {
      reply = t(
        'الدورات التدريبية متاحة في قسم "الدورات التدريبية" وتشمل التسويق الرقمي والإدارة المالية والتراخيص.',
        'Training courses are available in the Training Courses section covering digital marketing, finance, and licensing.'
      );
    } else if (q.includes('تاجر') || q.includes('بائع') || q.includes('عوني') || q.toLowerCase().includes('seller')) {
      reply = t(
        'عند تسجيل الدخول كـ "بائع"، ستظهر لك في الشريط العلوي صفحة "متجري الخاص" وصفحة "المستشار عوني" ودراسات الجدوى.',
        'When signing in as a Seller, "My Store", "Advisor Awni", and Feasibility Studies will appear in the top navigation bar.'
      );
    }

    setWidgetMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, from: 'user', text: q },
      { id: `b-${Date.now() + 1}`, from: 'bot', text: reply },
    ]);
    setWidgetInput('');
  };

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

    // صفحات البائع / التاجر (تظهر عند تسجيل الدخول كبائع)
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

      {/* 1. زر السماعة في أقصى اليسار بالأسفل (متاح للجميع) */}
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

      {/* 2. زر الشات بوت العام في أقصى اليمين بالأسفل بمحاذاة السماعة (يظهر لكل حد) */}
      <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 flex flex-col items-end gap-2 print:hidden">
        {chatWidgetOpen && (
          <div className="bg-[#122e3a] border border-[#1f5b70] text-white p-3.5 rounded-2xl shadow-2xl space-y-2.5 text-xs w-72 sm:w-80 animate-in slide-in-from-bottom-3">
            <div className="text-xs text-[#dfba83] border-b border-slate-700 pb-2 font-bold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-[#c59b5f]" />
                <span>{t('الشات بوت العام - مُنتَجي', 'Montaji General Chatbot')}</span>
              </span>
              <button
                onClick={() => setChatWidgetOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pe-1">
              {widgetMessages.map((m) => (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl leading-relaxed ${
                    m.from === 'user'
                      ? 'bg-[#c59b5f] text-slate-950 font-bold ms-6'
                      : 'bg-[#153e4d] text-slate-100 me-6'
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleWidgetSend} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={widgetInput}
                onChange={(e) => setWidgetInput(e.target.value)}
                placeholder={t('اكتب سؤالك هنا...', 'Type your question...')}
                className="flex-1 bg-[#153e4d] text-white placeholder-slate-400 px-3 py-2 rounded-xl border border-[#1f5b70] focus:outline-hidden text-xs"
              />
              <button
                type="submit"
                className="p-2 bg-[#c59b5f] text-slate-950 rounded-xl font-bold cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setChatWidgetOpen(!chatWidgetOpen)}
          className="bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
          title={t('الشات بوت العام', 'General Chatbot')}
        >
          <Bot className="w-5 h-5 text-[#c59b5f]" />
          <span className="text-xs font-bold hidden sm:inline">
            {t('الشات بوت', 'Chatbot')}
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
