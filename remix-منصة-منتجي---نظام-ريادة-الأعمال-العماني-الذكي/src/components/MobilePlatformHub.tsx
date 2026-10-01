/**
 * MobilePlatformHub.tsx
 * Comprehensive mobile & tablet directory drawer (دليل المنصة الشامل).
 * Ensures that no section or feature is lost on phones or tablets.
 */

import React from 'react';
import {
  X,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  FolderOpen,
  BookOpen,
  Award,
  ShoppingCart,
  Heart,
  PackageCheck,
  UserCheck,
  Phone,
  Instagram,
  MessageCircle,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ExternalLink,
  LogOut,
  Building,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { MontajiLogo } from './MontajiLogo';

interface MobilePlatformHubProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

interface HubItem {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

interface HubSection {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  items: HubItem[];
}

export const MobilePlatformHub: React.FC<MobilePlatformHubProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { user, signInWithGoogle, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  const handleLinkClick = (view: string) => {
    onNavigate(view);
    onClose();
  };

  const sections: HubSection[] = [
    {
      title: 'سوق المنتجات والتسوق الوطني',
      icon: ShoppingBag,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      items: [
        {
          id: 'marketplace.html',
          label: 'سوق المنتجات العمانية',
          desc: 'لبان، عسل جبلي، حلوى، خناجر وفضيات',
          icon: ShoppingBag,
          badge: 'توصيل عماني 🇴🇲',
        },
        {
          id: 'cart.html',
          label: 'سلة المشتريات',
          desc: 'مراجعة المنتجات وإنهاء الطلب',
          icon: ShoppingCart,
          badge: cartCount > 0 ? `${cartCount} منتجات` : undefined,
        },
        {
          id: 'wishlist.html',
          label: 'قائمة المفضلة',
          desc: 'منتجاتك المحفوظة للرجوع إليها',
          icon: Heart,
          badge: wishlistCount > 0 ? `${wishlistCount}` : undefined,
        },
        {
          id: 'orders.html',
          label: 'متابعة طلباتي السابقة',
          desc: 'سجل الشحنات وتتبع حالة التوصيل',
          icon: PackageCheck,
        },
      ],
    },
    {
      title: 'ريادة الأعمال والمشاريع الاستثمارية',
      icon: TrendingUp,
      color: 'text-amber-700',
      bgColor: 'bg-amber-50',
      items: [
        {
          id: 'ai-platform.html',
          label: 'المستشار الذكي "عوني"',
          desc: 'استشارات ريادية، تمويل ميسر وتراخيص',
          icon: Sparkles,
          highlight: true,
        },
        {
          id: 'ai-business-idea.html',
          label: 'دراسات الجدوى الاقتصادية',
          desc: 'حساب رأس المال ونقطة التعادل وهوامش الربح',
          icon: TrendingUp,
        },
        {
          id: 'dashboard.html',
          label: 'لوحة تحكم رائد الأعمال ومؤشرات الربحية',
          desc: 'رسوم بيانية تفاعلية لنمو المبيعات وهوامش الأرباح Recharts',
          icon: BarChart3,
          badge: 'جديد 📊',
        },
        {
          id: 'register.html',
          label: 'تسجيل رائد أعمال / منتج',
          desc: 'انضم كبائع عماني معتمد واعرض منتجاتك',
          icon: UserCheck,
        },
      ],
    },
    {
      title: 'التدريب والتمكين وقصص النجاح',
      icon: BookOpen,
      color: 'text-teal-700',
      bgColor: 'bg-teal-50',
      items: [
        {
          id: 'training-courses.html',
          label: 'الدورات والورش التدريبية',
          desc: 'تأهيل رواد الأعمال والحرفيين والأسر',
          icon: BookOpen,
        },
        {
          id: 'success-stories.html',
          label: 'قصص النجاح العمانية الملهمة',
          desc: 'نماذج وتجارب رواد الأعمال في السلطنة',
          icon: Award,
        },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] text-white p-4 flex items-center justify-between shrink-0 border-b border-[#c59b5f]/30">
          <div className="flex items-center gap-2.5">
            <MontajiLogo className="w-8 h-8 text-[#e9cca0]" />
            <div>
              <h3 className="font-black text-sm text-white">دليل منصة مُنتجي الشامل</h3>
              <p className="text-[11px] text-[#dfba83]">كل أقسام وخدمات المنصة في متناول يدك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="إغلاق الدليل"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Account Bar */}
        <div className="bg-slate-50 p-3.5 border-b border-slate-200 shrink-0">
          {user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-[#153e4d] text-[#e9cca0] flex items-center justify-center text-xs font-bold">
                    {user.displayName ? user.displayName.slice(0, 1) : 'م'}
                  </div>
                )}
                <div>
                  <div className="text-xs font-black text-slate-900 line-clamp-1">
                    {user.displayName || 'رائد أعمال عماني'}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">{user.email}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-600 font-medium">سجّل دخولك لحفظ دراساتك وطلباتك</span>
              <button
                onClick={() => {
                  signInWithGoogle();
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>دخول بحساب Google</span>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Categories List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {sections.map((sec, idx) => {
            const SectionIcon = sec.icon;
            return (
              <div key={idx} className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-slate-800 pb-1 border-b border-slate-100">
                  <div className={`w-5 h-5 rounded-md ${sec.bgColor} ${sec.color} flex items-center justify-center`}>
                    <SectionIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>{sec.title}</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {sec.items.map((item) => {
                    const ItemIcon = item.icon;
                    const isActive = currentView.includes(item.id.replace('.html', ''));
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleLinkClick(item.id)}
                        className={`w-full p-2.5 rounded-2xl border text-right transition-all flex items-center justify-between gap-3 cursor-pointer group ${
                          isActive
                            ? 'bg-[#153e4d]/5 border-[#153e4d]/40 text-[#153e4d]'
                            : 'bg-white hover:bg-slate-50 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              item.highlight
                                ? 'bg-gradient-to-tr from-[#153e4d] to-[#1f5b70] text-[#e9cca0]'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-[#153e4d]/10 group-hover:text-[#153e4d]'
                            }`}
                          >
                            <ItemIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 group-hover:text-[#153e4d] truncate">
                              {item.label}
                            </div>
                            <div className="text-[10px] text-slate-400 truncate mt-0.5">{item.desc}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className="text-[9px] bg-[#c59b5f]/20 text-[#825b23] border border-[#c59b5f]/30 px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                          <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-[#153e4d] transition-colors" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Quick Contact & Legal Footer */}
          <div className="pt-3 border-t border-slate-200 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">الدعم والتواصل المباشر:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://wa.me/96894842840"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>واتساب الدعم</span>
              </a>

              <a
                href="tel:+96894842840"
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#153e4d]" />
                <span>اتصال مباشر</span>
              </a>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2">
              <button
                onClick={() => handleLinkClick('terms.html')}
                className="hover:text-slate-600 underline cursor-pointer"
              >
                الشروط والأحكام
              </button>
              <span>•</span>
              <button
                onClick={() => handleLinkClick('privacy.html')}
                className="hover:text-slate-600 underline cursor-pointer"
              >
                سياسة الخصوصية
              </button>
              <span>•</span>
              <span className="text-[#c59b5f] font-bold">رؤية عمان 2040 🇴🇲</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
