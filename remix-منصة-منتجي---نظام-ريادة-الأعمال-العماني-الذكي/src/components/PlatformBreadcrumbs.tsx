/**
 * PlatformBreadcrumbs.tsx
 * Clear, ergonomic navigation breadcrumbs for mobile, tablet, and desktop.
 * Ensures the user always knows where they are and can jump back in 1 tap.
 */

import React from 'react';
import {
  ChevronLeft,
  Home,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Database,
  ShoppingCart,
  Heart,
  PackageCheck,
  BookOpen,
  Award,
  SlidersHorizontal,
  UserCheck,
} from 'lucide-react';

interface PlatformBreadcrumbsProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const VIEW_METADATA: Record<
  string,
  { title: string; category: string; icon: React.ComponentType<{ className?: string }> }
> = {
  'marketplace': { title: 'سوق المنتجات العمانية', category: 'التجارة والتسوق', icon: ShoppingBag },
  'ai-platform': { title: 'المستشار الذكي "عوني"', category: 'ريادة الأعمال', icon: Sparkles },
  'ai-business-idea': { title: 'دراسات الجدوى الاستثمارية', category: 'ريادة الأعمال', icon: TrendingUp },
  'training-courses': { title: 'الدورات والورش التدريبية', category: 'التمكين والتدريب', icon: BookOpen },
  'success-stories': { title: 'قصص النجاح العمانية', category: 'التمكين والتدريب', icon: Award },
  'wishlist': { title: 'قائمة المفضلة', category: 'التسوق الوطني', icon: Heart },
  'cart': { title: 'سلة المشتريات', category: 'التسوق الوطني', icon: ShoppingCart },
  'checkout': { title: 'إنهاء الطلب والدفع', category: 'التسوق الوطني', icon: ShoppingCart },
  'orders': { title: 'متابعة الطلبات والشحنات', category: 'التسوق الوطني', icon: PackageCheck },
  'order-confirmation': { title: 'تأكيد استلام الطلب', category: 'التسوق الوطني', icon: PackageCheck },
  'register': { title: 'تسجيل رائد أعمال / منتج', category: 'ريادة الأعمال', icon: UserCheck },
  'login': { title: 'تسجيل الدخول', category: 'الحساب', icon: UserCheck },
  'database': { title: 'قاعدة بيانات مُنتجي السحابية', category: 'الإدارة والبيانات', icon: Database },
  'admin': { title: 'لوحة تحكم المشرف (Admin)', category: 'الإدارة', icon: SlidersHorizontal },
  'terms': { title: 'الشروط والأحكام', category: 'اللوائح والسياسات', icon: Home },
  'privacy': { title: 'سياسة الخصوصية', category: 'اللوائح والسياسات', icon: Home },
};

export const PlatformBreadcrumbs: React.FC<PlatformBreadcrumbsProps> = ({
  currentView,
  onNavigate,
}) => {
  const normalized = currentView.toLowerCase().replace('.html', '').replace(/^#/, '').trim();

  // Don't show on home page
  if (normalized === 'home' || normalized === '') return null;

  // Find matching metadata
  const key = Object.keys(VIEW_METADATA).find((k) => normalized.includes(k));
  const meta = key ? VIEW_METADATA[key] : null;

  if (!meta) return null;

  const CurrentIcon = meta.icon;

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-2.5 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
        {/* Breadcrumb Path */}
        <div className="flex items-center gap-1.5 text-slate-500 overflow-x-auto truncate">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-[#153e4d] font-semibold transition-colors shrink-0 cursor-pointer"
            title="العودة للرئيسية"
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <span>الرئيسية</span>
          </button>

          <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0" />

          <span className="text-slate-400 shrink-0 hidden sm:inline">{meta.category}</span>

          <ChevronLeft className="w-3.5 h-3.5 text-slate-300 shrink-0 hidden sm:inline" />

          <div className="flex items-center gap-1 text-[#153e4d] font-bold truncate">
            <CurrentIcon className="w-3.5 h-3.5 text-[#c59b5f] shrink-0" />
            <span className="truncate">{meta.title}</span>
          </div>
        </div>

        {/* Quick Back or Action Switcher */}
        <div className="flex items-center gap-2 shrink-0 pr-2">
          {normalized.includes('marketplace') && (
            <button
              onClick={() => onNavigate('cart.html')}
              className="px-2.5 py-1 bg-[#153e4d]/10 hover:bg-[#153e4d]/20 text-[#153e4d] rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <ShoppingCart className="w-3 h-3 text-[#c59b5f]" />
              <span className="hidden sm:inline">السلة</span>
            </button>
          )}

          {normalized.includes('ai-platform') && (
            <button
              onClick={() => onNavigate('ai-business-idea.html')}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3 text-amber-700" />
              <span className="hidden sm:inline">دراسة جدوى</span>
            </button>
          )}

          {normalized.includes('ai-business-idea') && (
            <button
              onClick={() => onNavigate('ai-platform.html')}
              className="px-2.5 py-1 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] rounded-lg font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#c59b5f]" />
              <span className="hidden sm:inline">محادثة عوني</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('home')}
            className="text-slate-400 hover:text-slate-700 text-[11px] font-bold transition-colors cursor-pointer hidden md:inline"
          >
            ← الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};
