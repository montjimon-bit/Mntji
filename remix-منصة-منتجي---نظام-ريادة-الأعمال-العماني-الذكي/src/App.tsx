import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Phone,
  Instagram,
  Sparkles,
  X,
  Headphones,
} from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { AwniChatWidget } from './components/AwniChatWidget';
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

export default function App() {
  const [currentView, setCurrentView] = useState<string>(() => {
    // Check initial hash or path
    const hash = window.location.hash.replace('#', '').replace(/^\//, '');
    const path = window.location.pathname.replace(/^\//, '');
    return hash || path || 'home';
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<{ name: string; role: 'admin' | 'entrepreneur' } | null>(null);
  const [contactMenuOpen, setContactMenuOpen] = useState(false);
  const [platformHubOpen, setPlatformHubOpen] = useState(false);

  // Sync route on hash change or navigation
  const navigateTo = (view: string) => {
    // Normalize view
    let clean = view.replace(/^#/, '').replace(/^\//, '');
    if (!clean || clean === '#') clean = 'home';
    setCurrentView(clean);
    window.location.hash = clean === 'home' ? '' : clean;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').replace(/^\//, '');
      if (hash) {
        setCurrentView(hash);
      } else {
        setCurrentView('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Dynamic SEO and Google metadata update per view
  useEffect(() => {
    const normalized = currentView.toLowerCase().trim();
    let pageTitle = 'منصة منتجي - المنظومة الوطنية لرواد الأعمال والمشاريع العُمانية';
    let pageDesc = 'المنصة الوطنية المتكاملة لتمكين رواد الأعمال وأصحاب المشاريع العمانية: دراسات جدوى استثمارية بالريال العماني مع المستشار عوني، وسوق رقمي وطني لحاملي بطاقة ريادة.';

    if (normalized.includes('marketplace')) {
      pageTitle = 'السوق الرقمي العماني - منتجات وسلع وطنية معتمدة | منصة منتجي';
      pageDesc = 'تسوق أجود المنتجات العمانية الأصيلة: اللبان الظفاري، عسل السدر الجبلي، الحلوى العمانية، الحرف الفضية، والخزف التراثي بدعم مباشر لرواد الأعمال.';
    } else if (normalized.includes('ai-platform')) {
      pageTitle = 'المستشار الاقتصادي عوني - دراسات جدوى وتمويل ريادة | منصة منتجي';
      pageDesc = 'استشر المستشار الاقتصادي الذكي عوني لإعداد دراسات الجدوى بالريال العماني، قروض بنك التنمية بدون فوائد، وشروط بطاقة ريادة 2026.';
    } else if (normalized.includes('ai-business-idea')) {
      pageTitle = 'مولد أفكار المشاريع العمانية الذكي | منصة منتجي';
      pageDesc = 'اكتشف فرص وأفكار مشاريع عمانية واعدة متوافقة مع رؤية عمان 2040 وخيارات التمويل الميسر من بنك التنمية وهيئة ريادة.';
    } else if (normalized.includes('success-stories')) {
      pageTitle = 'قصص نجاح المشاريع العمانية وتقييمات المستثمرين | منصة منتجي';
      pageDesc = 'استكشف مسيرة رواد الأعمال العمانيين، تقييمات المستثمرين للمشاريع المسجلة، ونماذج ملهمة حققت نمواً تصديرياً في السلطنة والخليج.';
    } else if (normalized.includes('training')) {
      pageTitle = 'الدورات والورش التدريبية لرواد الأعمال | منصة منتجي';
      pageDesc = 'برامج تدريبية متخصصة في تأسيس المشاريع، التسويق الرقمي، المحاسبة المالية، وإدارة المؤسسات الصغيرة والمتوسطة بسلطنة عمان.';
    } else if (normalized.includes('register')) {
      pageTitle = 'تسجيل رائد أعمال عماني جديد - ريادة | منصة منتجي';
      pageDesc = 'انضم إلى مجتمع رواد الأعمال في سلطنة عمان وسجل مشروعك للاستفادة من الدعم التسويقي والمشتريات الحكومية وتسهيلات بطاقة ريادة.';
    } else if (normalized.includes('cart')) {
      pageTitle = 'سلة المشتريات | منصة منتجي';
    } else if (normalized.includes('checkout')) {
      pageTitle = 'إتمام الطلب والدفع الآمن بالريال العماني | منصة منتجي';
    } else if (normalized.includes('orders')) {
      pageTitle = 'متابعة الطلبات والشحنات | منصة منتجي';
    } else if (normalized.includes('wishlist')) {
      pageTitle = 'قائمة المنتجات المفضلة | منصة منتجي';
    } else if (normalized.includes('legal') || normalized.includes('terms') || normalized.includes('privacy')) {
      pageTitle = 'الشروط والأحكام وسياسة الخصوصية | منصة منتجي';
    }

    document.title = pageTitle;

    // Update meta tags for Google indexing
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', pageTitle);

    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', pageDesc);
  }, [currentView]);

  // Global link interceptor for any legacy .html links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (target && target.getAttribute('href')) {
        const href = target.getAttribute('href')!;
        if (
          href.endsWith('.html') ||
          href.startsWith('#') ||
          ['marketplace', 'ai-platform', 'cart', 'checkout', 'orders'].some((r) => href.includes(r))
        ) {
          e.preventDefault();
          navigateTo(href);
        }
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

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

    if (normalized.includes('ai-platform')) {
      return <AiPlatformView onNavigate={navigateTo} />;
    }

    if (normalized.includes('ai-business-idea') || normalized.includes('business-idea')) {
      return <AiBusinessIdeaView onNavigate={navigateTo} />;
    }

    if (normalized.includes('training') || normalized.includes('courses')) {
      return <TrainingCoursesView />;
    }

    if (normalized.includes('success-stories') || normalized.includes('stories')) {
      return <SuccessStoriesView onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />;
    }

    if (normalized.includes('wishlist') || normalized.includes('favorites') || normalized.includes('favorite')) {
      return <WishlistView onNavigate={navigateTo} />;
    }

    if (normalized.includes('cart')) {
      return <CartView onNavigate={navigateTo} />;
    }

    if (normalized.includes('checkout')) {
      return <CheckoutView onNavigate={navigateTo} />;
    }

    if (normalized.includes('order-confirmation') || normalized.includes('confirmation')) {
      return <OrderConfirmationView onNavigate={navigateTo} />;
    }

    if (normalized.includes('order')) {
      return <OrdersView onNavigate={navigateTo} />;
    }

    if (normalized.includes('register')) {
      return <RegisterEntrepreneurView onNavigate={navigateTo} initialMode="register" />;
    }

    if (normalized.includes('login')) {
      return <RegisterEntrepreneurView onNavigate={navigateTo} initialMode="login" />;
    }

    if (normalized.includes('terms')) {
      return <LegalView initialTab="terms" onNavigate={navigateTo} />;
    }

    if (normalized.includes('privacy')) {
      return <LegalView initialTab="privacy" onNavigate={navigateTo} />;
    }

    if (normalized.includes('dashboard') || normalized.includes('admin') || normalized.includes('analytics')) {
      return <EntrepreneurDashboardView onNavigate={navigateTo} />;
    }

    // Default fallback to HomeView
    return <HomeView onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />;
  };

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <div className="min-h-screen flex flex-col bg-[#f8fafb] text-slate-800 antialiased selection:bg-[#1f5b70] selection:text-white font-sans relative">
            {/* Navigation Header */}
            <Navbar
              currentView={currentView}
              onNavigate={navigateTo}
              onOpenAuth={handleOpenAuth}
              onOpenHub={() => setPlatformHubOpen(true)}
            />

            {/* Clear Navigational Breadcrumbs for Orientation */}
            <PlatformBreadcrumbs
              currentView={currentView}
              onNavigate={navigateTo}
            />

            {/* Dynamic Main Body Content with safe bottom padding for mobile navigation */}
            <main className="flex-1 pb-28 sm:pb-24 lg:pb-8">
              {renderCurrentView()}
            </main>

            {/* Floating Quick Support Widget (Instagram, WhatsApp, Phone, AI) */}
            <div className="fixed bottom-20 left-4 lg:bottom-6 lg:left-6 z-30 flex flex-col items-start gap-2">
              {contactMenuOpen && (
                <div className="bg-[#122e3a] border border-[#1f5b70] text-white p-3 rounded-2xl shadow-2xl space-y-2 text-xs font-semibold animate-in slide-in-from-bottom-3 w-56">
                  <div className="text-[11px] text-[#dfba83] border-b border-slate-700 pb-1.5 font-bold flex items-center justify-between">
                    <span>تواصل مباشر مع المنصة</span>
                    <button
                      onClick={() => setContactMenuOpen(false)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Instagram Direct */}
                  <a
                    href="https://www.instagram.com/montji_/?hl=ar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-pink-400"
                  >
                    <Instagram className="w-4 h-4" />
                    <span className="text-white" dir="ltr">@montji_ إنستغرام</span>
                  </a>

                  {/* WhatsApp Support */}
                  <a
                    href="https://wa.me/96894842840"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-emerald-400"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-white">واتساب الدعم المباشر</span>
                  </a>

                  {/* Direct Phone */}
                  <a
                    href="tel:+96894842840"
                    className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-xl transition-colors text-[#c59b5f]"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="text-white font-mono" dir="ltr">+968 9484 2840</span>
                  </a>

                  {/* Fast AI advisor */}
                  <button
                    onClick={() => {
                      setContactMenuOpen(false);
                      navigateTo('ai-platform.html');
                    }}
                    className="w-full flex items-center gap-2 p-2 hover:bg-[#1f5b70]/40 rounded-xl transition-colors text-[#dfba83] text-right cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>المساعد الذكي "عوني"</span>
                  </button>
                </div>
              )}

              <button
                onClick={() => setContactMenuOpen(!contactMenuOpen)}
                className="bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 p-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer hover:scale-105 transition-all"
                title="تواصل مباشر ودعم فني"
              >
                <Headphones className="w-5 h-5 text-[#c59b5f]" />
                <span className="text-xs font-bold hidden sm:inline">تواصل معنا</span>
              </button>
            </div>

            {/* Floating AI Chatbot Widget (عوني) on bottom-right */}
            <AwniChatWidget onNavigate={navigateTo} />

            {/* Ergonomic Mobile Bottom Navigation Bar (Phone & Tablet) */}
            <MobileBottomNav
              currentView={currentView}
              onNavigate={navigateTo}
              onOpenHub={() => setPlatformHubOpen(true)}
            />

            {/* Comprehensive Platform Hub & Directory Drawer */}
            <MobilePlatformHub
              isOpen={platformHubOpen}
              onClose={() => setPlatformHubOpen(false)}
              currentView={currentView}
              onNavigate={navigateTo}
              onOpenAuth={handleOpenAuth}
            />

            {/* Global Footer */}
            <Footer onNavigate={navigateTo} onOpenAuth={handleOpenAuth} />

            {/* Auth Modal */}
            <AuthModal
              isOpen={authModalOpen}
              initialMode={authModalMode}
              onClose={() => setAuthModalOpen(false)}
              onSuccess={(u) => setCurrentUser(u)}
              onNavigateToFullPage={navigateTo}
            />
          </div>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
