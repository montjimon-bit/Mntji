/**
 * MobileBottomNav.tsx
 * Ergonomic, persistent bottom navigation bar for mobile and tablet users.
 * Guarantees zero lost navigation or inaccessible pages on mobile phones.
 */

import React from 'react';
import {
  Home,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  ShoppingCart,
  Menu,
  Store,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenHub: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenHub,
}) => {
  const { cartCount } = useCart();
  const { hasStore } = useAuth();

  const normalized = currentView.toLowerCase().trim();

  const isHome = normalized === 'home' || normalized === '';
  const isMarket = normalized.includes('marketplace');
  const isDashboard = normalized.includes('dashboard') || normalized.includes('admin');
  const isAwni = normalized.includes('ai-platform');
  const isFeasibility = normalized.includes('ai-business-idea') || normalized.includes('business-idea');
  const isCart = normalized.includes('cart') || normalized.includes('checkout');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0d232d]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-2xl lg:hidden font-sans select-none pb-[env(safe-area-inset-bottom)] transition-colors"
      dir="rtl"
      aria-label="التنقل السفلي للهاتف"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
            isHome ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="الصفحة الرئيسية"
        >
          {isHome && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <Home className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 text-[#153e4d] dark:text-[#dfba83]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight truncate">الرئيسية</span>
        </button>

        {/* 2. Marketplace */}
        <button
          onClick={() => onNavigate('marketplace.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
            isMarket ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="سوق المنتجات العمانية"
        >
          {isMarket && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <ShoppingBag className={`w-5 h-5 transition-transform ${isMarket ? 'scale-110 text-[#153e4d] dark:text-[#dfba83]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight truncate">السوق</span>
        </button>

        {/* 3. Has Store (Seller/Admin) -> My Store, Else -> Awni AI */}
        {hasStore ? (
          <button
            onClick={() => onNavigate('dashboard.html')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
              isDashboard ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="متجري الخاص ولوحة التحكم"
          >
            {isDashboard && (
              <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
            )}
            <Store className={`w-5 h-5 transition-transform ${isDashboard ? 'scale-110 text-[#c59b5f]' : 'text-[#c59b5f]'}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate font-bold text-[#9e763b] dark:text-[#dfba83]">متجري</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('ai-platform.html')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
              isAwni ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="المستشار عوني"
          >
            {isAwni && (
              <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
            )}
            <div className="relative">
              <Sparkles className={`w-5 h-5 text-[#c59b5f] transition-transform ${isAwni ? 'scale-115' : ''}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate">عوني</span>
          </button>
        )}

        {/* 4. If has store -> Awni AI, Else -> Feasibility */}
        {hasStore ? (
          <button
            onClick={() => onNavigate('ai-platform.html')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
              isAwni ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="المستشار عوني"
          >
            {isAwni && (
              <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
            )}
            <div className="relative">
              <Sparkles className={`w-5 h-5 text-[#c59b5f] transition-transform ${isAwni ? 'scale-115' : ''}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate">عوني</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('ai-business-idea.html')}
            className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
              isFeasibility ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            }`}
            title="دراسات الجدوى الذكية"
          >
            {isFeasibility && (
              <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
            )}
            <TrendingUp className={`w-5 h-5 transition-transform ${isFeasibility ? 'scale-110 text-[#153e4d] dark:text-[#dfba83]' : ''}`} />
            <span className="text-[10px] mt-1 tracking-tight truncate">الجدوى</span>
          </button>
        )}

        {/* 5. Cart */}
        <button
          onClick={() => onNavigate('cart.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative min-w-0 ${
            isCart ? 'text-[#153e4d] dark:text-[#dfba83] font-black' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
          title="سلة المشتريات"
        >
          {isCart && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${isCart ? 'scale-110 text-[#153e4d] dark:text-[#dfba83]' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight truncate">السلة</span>
        </button>

        {/* 6. Full Platform Hub / Menu Drawer */}
        <button
          onClick={onOpenHub}
          className="flex flex-col items-center justify-center h-full py-1 transition-all text-[#153e4d] dark:text-[#dfba83] hover:text-[#122e3a] dark:hover:text-white cursor-pointer min-w-0"
          title="دليل المنصة الشامل"
        >
          <div className="w-7 h-7 rounded-xl bg-[#153e4d]/10 dark:bg-white/10 flex items-center justify-center">
            <Menu className="w-4 h-4 text-[#153e4d] dark:text-[#dfba83]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold truncate">الدليل</span>
        </button>
      </div>
    </nav>
  );
};
