import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Phone,
  MessageCircle,
  Search,
  Store,
  Sun,
  Moon,
  Heart,
  Crown,
  Sparkles,
  TrendingUp,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { MontajiLogo } from './MontajiLogo';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth, onOpenHub }) => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, isSeller, hasStore, signInWithGoogle, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // الروابط الرئيسية لشاشات الكمبيوتر (بدون رابط الهولوجرام ومختبر العلوم)
  const navLinks = [
    { id: 'home', label: 'الرئيسية' },
    { id: 'marketplace.html', label: 'السوق العُماني' },
    { id: 'ai-platform.html', label: 'المستشار عوني', highlight: true },
    { id: 'ai-business-idea.html', label: 'دراسات الجدوى' },
    { id: 'training-courses.html', label: 'الدورات والورش' },
    ...(hasStore ? [{ id: 'dashboard.html', label: isAdmin ? 'لوحة الإدارة' : 'متجري' }] : []),
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    sessionStorage.setItem('montaji_search_query', searchQuery.trim());
    window.dispatchEvent(new CustomEvent('montaji-search', { detail: { query: searchQuery.trim() } }));
    onNavigate('marketplace.html');
    setMobileSearchOpen(false);
  };

  // تسجيل دخول مباشر بحساب Google بدون أخطاء إغلاق النافذة
  const handleGoogleAuth = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle('customer');
    } catch (err: any) {
      if (err?.code !== 'auth/popup-closed-by-user') {
        onOpenAuth('login');
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <>
      {/* 1. الشريط العلوي الوطني */}
      <div className="bg-[#153e4d] text-white text-[11px] py-1.5 px-4 font-medium border-b border-[#1f5b70]/60">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-[#c59b5f]/20 text-[#e9cca0] border border-[#c59b5f]/40 px-2 py-0.5 rounded text-[10px] font-bold">
              رؤية عُمان 2040
            </span>
            <span className="hidden sm:inline text-slate-300">المنظومة الوطنية لدعم وتمكين رواد الأعمال العمانيين</span>
          </div>

          <div className="flex items-center gap-3">
            <a href="https://wa.me/96894842840" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[#dfba83] hover:text-white">
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>واتساب الدعم</span>
            </a>
            <a href="tel:+96894842840" className="hidden sm:flex items-center gap-1 font-mono text-slate-200" dir="ltr">
              <Phone className="w-3 h-3 text-[#c59b5f]" />
              <span>+968 9484 2840</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. الهيدر المتناسق على الشاشات */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d232d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* الشعار */}
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-right cursor-pointer shrink-0">
              <div className="p-1 rounded-xl bg-[#f4f8fa] dark:bg-slate-800 border border-[#1f5b70]/20">
                <MontajiLogo size={36} />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black text-[#153e4d] dark:text-white tracking-tight">مُنتجي</span>
                <span className="text-[10px] font-bold text-[#c59b5f] block">عُمان 🇴🇲</span>
              </div>
            </button>

            {/* شريط البحث */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xs xl:max-w-md mx-2">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن منتج، دراسة جدوى، مشروع..."
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-[#1f5b70] text-slate-800 dark:text-slate-100 font-medium"
                />
                <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </form>

            {/* روابط شاشات الكمبيوتر الكبيرة */}
            <nav className="hidden lg:flex items-center gap-1 text-xs xl:text-sm font-semibold text-slate-700 dark:text-slate-200">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`px-3 py-2 rounded-xl transition-colors cursor-pointer ${
                    currentView === link.id
                      ? 'bg-[#1f5b70]/10 text-[#153e4d] dark:text-[#dfba83] font-black'
                      : link.highlight
                      ? 'text-[#c59b5f] font-bold hover:bg-slate-100 dark:hover:bg-slate-800'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* عناصر التحكم العلوية */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              
              {/* أيقونة بحث للهاتف */}
              <button
                type="button"
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                aria-label="البحث"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* زر تبديل الوضع الليلي / النهاري */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-[#dfba83] hover:scale-105 transition-all cursor-pointer"
                title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
              >
                {isDark ? <Sun className="w-4 h-4 text-[#dfba83]" /> : <Moon className="w-4 h-4 text-[#153e4d]" />}
              </button>

              {/* سلة المشتريات */}
              <button
                onClick={() => onNavigate('cart.html')}
                className="relative p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                title="سلة التسوق"
              >
                <ShoppingBag className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-[#c59b5f] text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* حالة تسجيل الدخول */}
              {user ? (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 px-2 py-1">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#153e4d] text-white text-xs flex items-center justify-center font-bold">
                        {user.displayName ? user.displayName[0] : 'ع'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-white max-w-[80px] sm:max-w-[110px] truncate">
                      {user.displayName || 'حسابي'}
                    </span>
                  </div>
                  <button onClick={logout} className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer" title="خروج">
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={isSigningIn}
                  onClick={handleGoogleAuth}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:border-[#1f5b70] text-slate-800 dark:text-slate-100 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  title="الدخول بحساب Google"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.665-5.17 3.665-9.09z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.28 21.43 7.35 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.28 2.57 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
                  </svg>
                  <span className="hidden sm:inline">{isSigningIn ? 'جارٍ الدخول...' : 'دخول بـ Google'}</span>
                </button>
              )}

              {/* زر الدليل الشامل للهاتف */}
              <button
                onClick={() => (onOpenHub ? onOpenHub() : onOpenAuth('login'))}
                className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white cursor-pointer"
                aria-label="القائمة"
              >
                <Menu className="w-5 h-5 text-[#153e4d] dark:text-[#dfba83]" />
              </button>
            </div>

          </div>
        </div>

        {/* حقل البحث المنسدل للهاتف */}
        {mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3 pt-1 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0d232d]">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في منصة منتجي..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </form>
          </div>
        )}
      </header>
    </>
  );
};
