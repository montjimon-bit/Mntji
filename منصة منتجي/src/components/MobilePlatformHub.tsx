import React from 'react';
import {
  X,
  Home,
  ShoppingBag,
  BookOpen,
  Award,
  Heart,
  Package,
  ShoppingCart,
  Store,
  Sparkles,
  TrendingUp,
  Globe,
  LogIn,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MontajiLogo } from './MontajiLogo';

interface MobilePlatformHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const MobilePlatformHub: React.FC<MobilePlatformHubProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, isSeller, isAdmin, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const canAccessSellerTools = isSeller || isAdmin;

  const handleGo = (view: string) => {
    onClose();
    onNavigate(view);
  };

  // روابط العميل والزائر
  const publicSections = [
    { id: 'home', label: t('الواجهة الرئيسية', 'Home'), icon: Home },
    { id: 'marketplace.html', label: t('سوق المنتجات العُمانية', 'Omani Marketplace'), icon: ShoppingBag },
    { id: 'training-courses.html', label: t('الدورات التدريبية', 'Training Courses'), icon: BookOpen },
    { id: 'success-stories.html', label: t('قصص نجاح رواد الأعمال', 'Success Stories'), icon: Award },
    { id: 'cart.html', label: t('سلة التسوق', 'Shopping Cart'), icon: ShoppingCart },
    { id: 'wishlist.html', label: t('قائمة المفضلة', 'My Wishlist'), icon: Heart },
    { id: 'orders.html', label: t('متابعة طلباتي', 'My Orders'), icon: Package },
  ];

  // روابط البائع / التاجر فقط
  const sellerSections = [
    {
      id: 'dashboard.html',
      label: isAdmin ? t('لوحة تحكم الإدارة', 'Admin Dashboard') : t('متجري الخاص', 'My Private Store'),
      icon: Store,
    },
    { id: 'ai-platform.html', label: t('المستشار الاقتصادي عوني', 'Advisor Awni'), icon: Sparkles },
    { id: 'ai-business-idea.html', label: t('إعداد دراسة جدوى', 'Feasibility Study'), icon: TrendingUp },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      {/* خلفية للإغلاق */}
      <div className="flex-1" onClick={onClose} />

      {/* جسم القائمة المنبثقة */}
      <div className="bg-white dark:bg-[#0d232d] rounded-t-3xl border-t border-slate-200 dark:border-slate-800 max-h-[85vh] overflow-y-auto p-5 space-y-5 shadow-2xl">
        {/* رأس القائمة */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <MontajiLogo size={34} />
            <div>
              <h3 className="font-black text-base text-[#153e4d] dark:text-white">
                {t('منصة مُنتَجي', 'Montaji Platform')}
              </h3>
              <span className="text-[11px] text-[#c59b5f] font-bold">
                {t('القائمة الشاملة للجوال', 'Mobile Navigation')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* زر تبديل اللغة */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#153e4d]/10 dark:bg-slate-800 text-[#153e4d] dark:text-[#dfba83] text-xs font-bold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* بطاقة الحساب */}
        {user ? (
          <div className="bg-[#153e4d] text-white rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-sm font-black truncate">{user.displayName || t('عضو المنصة', 'Member')}</div>
              <div className="text-xs text-[#dfba83] flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {isAdmin
                    ? t('مشرف المنصة', 'Platform Admin')
                    : isSeller
                    ? t('حساب بائع / تاجر', 'Seller Account')
                    : t('حساب عميل', 'Customer Account')}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                logout();
              }}
              className="px-3 py-2 rounded-xl bg-rose-600/90 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('خروج', 'Logout')}</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth('login');
              }}
              className="py-3 px-4 rounded-xl bg-[#153e4d] text-[#e9cca0] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4 text-[#c59b5f]" />
              <span>{t('تسجيل الدخول', 'Sign In')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAuth('register');
              }}
              className="py-3 px-4 rounded-xl bg-[#c59b5f] text-slate-950 text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('إنشاء حساب', 'Register')}</span>
            </button>
          </div>
        )}

        {/* قسم أدوات البائع والتاجر (يظهر فقط عند تسجيل الدخول كبائع) */}
        {canAccessSellerTools && (
          <div className="space-y-2">
            <div className="text-xs font-black text-[#c59b5f] px-1">
              {t('أدوات البائع والمستشار الذكي', 'Seller & Advisor Tools')}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {sellerSections.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleGo(item.id)}
                    className="w-full p-3 rounded-xl bg-[#153e4d]/10 dark:bg-slate-800/90 border border-[#c59b5f]/30 flex items-center gap-3 text-start cursor-pointer"
                  >
                    <div className="p-2 rounded-lg bg-[#153e4d] text-[#dfba83]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* الأقسام العامة (متاحة للعميل والبائع) */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-400 px-1">
            {t('أقسام المنصة', 'Platform Sections')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {publicSections.map((item) => {
              const Icon = item.icon;
              const isActive = currentView.toLowerCase().includes(item.id.replace('.html', ''));
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleGo(item.id)}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 text-start transition cursor-pointer ${
                    isActive
                      ? 'bg-[#153e4d] text-[#e9cca0] border-[#153e4d]'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border-slate-200/70 dark:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#c59b5f]' : 'text-[#1f5b70] dark:text-[#dfba83]'}`} />
                  <span className="text-xs font-bold truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};