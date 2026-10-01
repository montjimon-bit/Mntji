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
  Heart,
  Layers,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

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
  const { wishlistCount } = useWishlist();

  const normalized = currentView.toLowerCase().trim();

  const isHome = normalized === 'home' || normalized === '';
  const isMarket = normalized.includes('marketplace');
  const isAwni = normalized.includes('ai-platform');
  const isFeasibility = normalized.includes('ai-business-idea') || normalized.includes('business-idea');
  const isCart = normalized.includes('cart') || normalized.includes('checkout');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-2xl lg:hidden font-sans select-none pb-[env(safe-area-inset-bottom)]"
      dir="rtl"
      aria-label="التنقل السفلي للهاتف"
    >
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {/* 1. Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative ${
            isHome ? 'text-[#153e4d] font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="الصفحة الرئيسية"
        >
          {isHome && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <Home className={`w-5 h-5 transition-transform ${isHome ? 'scale-110 text-[#153e4d]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">الرئيسية</span>
        </button>

        {/* 2. Marketplace */}
        <button
          onClick={() => onNavigate('marketplace.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative ${
            isMarket ? 'text-[#153e4d] font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="سوق المنتجات العمانية"
        >
          {isMarket && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <ShoppingBag className={`w-5 h-5 transition-transform ${isMarket ? 'scale-110 text-[#153e4d]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">السوق</span>
        </button>

        {/* 3. Awni AI */}
        <button
          onClick={() => onNavigate('ai-platform.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative ${
            isAwni ? 'text-[#153e4d] font-black' : 'text-slate-500 hover:text-slate-800'
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
          <span className="text-[10px] mt-1 tracking-tight">عوني</span>
        </button>

        {/* 4. Feasibility Studies */}
        <button
          onClick={() => onNavigate('ai-business-idea.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative ${
            isFeasibility ? 'text-[#153e4d] font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="دراسات الجدوى"
        >
          {isFeasibility && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <TrendingUp className={`w-5 h-5 transition-transform ${isFeasibility ? 'scale-110 text-[#153e4d]' : ''}`} />
          <span className="text-[10px] mt-1 tracking-tight">الجدوى</span>
        </button>

        {/* 5. Cart */}
        <button
          onClick={() => onNavigate('cart.html')}
          className={`flex flex-col items-center justify-center h-full py-1 transition-all cursor-pointer relative ${
            isCart ? 'text-[#153e4d] font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
          title="سلة المشتريات"
        >
          {isCart && (
            <span className="absolute top-0 w-8 h-1 bg-[#c59b5f] rounded-b-full" />
          )}
          <div className="relative">
            <ShoppingCart className={`w-5 h-5 transition-transform ${isCart ? 'scale-110 text-[#153e4d]' : ''}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">السلة</span>
        </button>

        {/* 6. Full Platform Hub / Menu Drawer */}
        <button
          onClick={onOpenHub}
          className="flex flex-col items-center justify-center h-full py-1 transition-all text-[#153e4d] hover:text-[#122e3a] cursor-pointer"
          title="دليل المنصة الشامل"
        >
          <div className="w-7 h-7 rounded-xl bg-[#153e4d]/10 flex items-center justify-center">
            <Menu className="w-4 h-4 text-[#153e4d]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-bold">الدليل</span>
        </button>
      </div>
    </nav>
  );
};
