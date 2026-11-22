import React from 'react';
import {
  Home,
  ShoppingBag,
  BookOpen,
  Store,
  Sparkles,
  LayoutGrid,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

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
  const { isSeller, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { t } = useLanguage();

  const canAccessSellerTools = isSeller || isAdmin;
  const normalized = currentView.toLowerCase();

  const navItems = canAccessSellerTools
    ? [
        {
          id: 'home',
          label: t('الرئيسية', 'Home'),
          icon: Home,
          active: normalized === 'home' || normalized === '',
        },
        {
          id: 'dashboard.html',
          label: t('متجري', 'My Store'),
          icon: Store,
          active: normalized.includes('dashboard') || normalized.includes('admin'),
        },
        {
          id: 'marketplace.html',
          label: t('السوق', 'Market'),
          icon: ShoppingBag,
          active: normalized.includes('marketplace'),
        },
        {
          id: 'ai-platform.html',
          label: t('عوني', 'Awni'),
          icon: Sparkles,
          active: normalized.includes('ai-platform'),
        },
      ]
    : [
        {
          id: 'home',
          label: t('الرئيسية', 'Home'),
          icon: Home,
          active: normalized === 'home' || normalized === '',
        },
        {
          id: 'marketplace.html',
          label: t('سوق المنتجات', 'Market'),
          icon: ShoppingBag,
          active: normalized.includes('marketplace'),
        },
        {
          id: 'training-courses.html',
          label: t('الدورات', 'Courses'),
          icon: BookOpen,
          active: normalized.includes('training') || normalized.includes('courses'),
        },
        {
          id: 'cart.html',
          label: t('السلة', 'Cart'),
          icon: ShoppingCart,
          active: normalized.includes('cart'),
          badge: cartCount,
        },
      ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0d232d]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-2 py-1.5 print:hidden">
      <div className="grid grid-cols-5 items-center gap-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer ${
                item.active
                  ? 'bg-[#153e4d] text-[#e9cca0] font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 ${
                    item.active ? 'text-[#c59b5f]' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -end-2 bg-[#c59b5f] text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-1 truncate max-w-full leading-none">
                {item.label}
              </span>
            </button>
          );
        })}

        {/* زر القائمة الشاملة */}
        <button
          type="button"
          onClick={onOpenHub}
          className="flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5 text-[#1f5b70] dark:text-[#dfba83]" />
          <span className="text-[10px] mt-1 truncate max-w-full leading-none">
            {t('المزيد', 'More')}
          </span>
        </button>
      </div>
    </nav>
  );
};