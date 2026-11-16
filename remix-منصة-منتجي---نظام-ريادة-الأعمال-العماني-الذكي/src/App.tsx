import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Instagram,
  Sparkles,
  X,
  Headphones,
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

  // الواجهة الافتراضية للمنصة هي الرئيسية (home)
  const [currentView, setCurrentView] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    return hash || path || 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [platformHubOpen, setPlatformHubOpen] = useState(false);

  const navigateTo = (view: string) => {
    let clean = view.replace(/^#/, '').replace(/^\//, '');
    if (!clean || clean === '#') clean = 'home';

    const lower = clean.toLowerCase();

    // حذف الكشك التفاعلي: إعادة توجيه أي رابط قديم للكشك إلى الواجهة الرئيسية
    if (
      lower.includes('kiosk') ||
      lower.includes('open-store') ||
      lower.includes('create-store') ||
      lower.includes('scan-model')
    ) {
      clean = 'home';
    }

    // منع العميل من دخول صفحات التاجر أو دراسة الجدوى أو المستشار عوني
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
    const normalized = currentView.toLowerCase().trim();
    let pageTitle = t(
      'منصة منتجي - المنظومة الوطنية لرواد الأعمال والمشاريع العُمانية',
      'Montaji Platform - Omani Entrepreneurship & Marketplace'
    );

    if (normalized.includes('marketplace')) {
      pageTitle = t('السوق الرقمي العماني | منصة منتجي', 'Omani Digital Marketplace | Montaji');
    } else if (normalized.includes('training') || normalized.includes('courses')) {
      pageTitle = t('الدورات التدريبية لرواد الأعمال | منصة منتجي', 'Training Courses | Montaji');
    } else if (normalized.includes('ai-platform')) {
      pageTitle = t('المستشار الاقتصادي عوني | منصة منتجي', 'Awni Economic Advisor | Montaji');
    } else if (normalized.includes('ai-business-idea') || normalized.includes('business-idea')) {
      pageTitle = t('دراسة الجدوى الذكية | منصة منتجي', 'Smart Feasibility Study | Montaji');
    } else if (normalized.includes('dashboard')) {
      pageTitle = t('متجري الخاص ولوحة التحكم | منصة منتجي', 'My Store & Dashboard | Montaji');
    }

    document.title = pageTitle;
  }, [currentView, t]);

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

      {/* 1. زر السماعة في اليسار بالأسفل */}
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

      {/* 2. زر المستشار عوني في اليمين بالأسفل بنفس مستوى السماعة تماماً (يظهر للبائع والمشرف فقط) */}
      {canAccessSellerTools && (
        <div className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 print:hidden">
          <button
            onClick={() => navigateTo('ai-platform.html')}
            className="bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
            title={t('المستشار الاقتصادي عوني', 'Awni Economic Advisor')}
          >
            <Sparkles className="w-5 h-5 text-[#c59b5f]" />
            <span className="text-xs font-bold hidden sm:inline">
              {t('المستشار عوني', 'Advisor Awni')}
            </span>
          </button>
        </div>
      )}

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
