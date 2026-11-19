import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Instagram,
  MessageCircle,
  ShieldCheck,
  CreditCard,
  Building2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MontajiLogo } from './MontajiLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0d232d] text-slate-300 border-t border-[#1f5b70]/40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* الأقسام الأربعة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1. هوية منصة منتجي */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#153e4d] border border-[#c59b5f]/40">
                <MontajiLogo size={36} />
              </div>
              <div>
                <div className="text-lg font-black text-white">
                  {t('منصة مُنتجي', 'Montaji Platform')}
                </div>
                <div className="text-[11px] font-bold text-[#dfba83]">
                  {t('رؤية عُمان 2040', 'Oman Vision 2040')}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {t(
                'منصة عمانية متكاملة تهدف إلى تسريع نمو الشركات الناشئة ورواد الأعمال العمانيين، وربط المنتجات الوطنية المبتكرة بالأسواق المحلية والخليجية دعماً لرؤية عُمان 2040.',
                'An integrated Omani platform dedicated to empowering startups and connecting authentic Omani products to local and GCC markets under Oman Vision 2040.'
              )}
            </p>
          </div>

          {/* 2. أقسام المنصة */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white border-b border-[#1f5b70]/50 pb-2">
              {t('أقسام المنصة', 'Platform Sections')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('الرئيسية', 'Home')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('marketplace.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('سوق المنتجات العُمانية', 'Omani Products Marketplace')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('training-courses.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('الدورات التدريبية', 'Training Courses')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('success-stories.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('قصص نجاح رواد الأعمال', 'Success Stories')}
                </button>
              </li>
            </ul>
          </div>

          {/* 3. خدمات الرواد والعملاء (بدون لوحة تحكم المشرف وقاعدة البيانات وتسجيل رائد أعمال) */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white border-b border-[#1f5b70]/50 pb-2">
              {t('خدمات الرواد والعملاء', 'User & Seller Services')}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cart.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('سلة المشتريات', 'Shopping Cart')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('wishlist.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('قائمة المفضلة', 'My Wishlist')}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('orders.html')}
                  className="hover:text-[#dfba83] transition cursor-pointer"
                >
                  {t('متابعة طلباتي', 'Track My Orders')}
                </button>
              </li>
            </ul>
          </div>

          {/* 4. بيانات التواصل المباشر + ايميل منتجي + بوابات وطنية شريكة */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white border-b border-[#1f5b70]/50 pb-2">
              {t('بيانات التواصل المباشر', 'Direct Contact')}
            </h3>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-[#c59b5f] shrink-0" />
                <span>{t('سلطنة عمان - مسقط', 'Sultanate of Oman - Muscat')}</span>
              </li>

              <li>
                <a
                  href="mailto:montjimon@gmail.com"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#dfba83] transition"
                >
                  <Mail className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span>
                    {t('ايميل منتجي:', 'Montaji Email:')}{' '}
                    <span dir="ltr" className="font-mono font-bold text-[#e9cca0]">
                      montjimon@gmail.com
                    </span>
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="tel:+96894842840"
                  className="flex items-center gap-2 text-slate-300 hover:text-[#dfba83] transition"
                >
                  <Phone className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span dir="ltr" className="font-mono">
                    +968 9484 2840
                  </span>
                </a>
              </li>

              <li>
                <a
                  href="https://wa.me/96894842840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{t('واتساب الدعم المباشر', 'WhatsApp Direct Support')}</span>
                </a>
              </li>

              <li>
                <a
                  href="https://www.instagram.com/montji_/?hl=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition"
                >
                  <Instagram className="w-4 h-4 shrink-0" />
                  <span dir="ltr">@montji_</span>
                </a>
              </li>
            </ul>

            {/* بوابات وطنية شريكة داخل قسم التواصل المباشر */}
            <div className="pt-2.5 border-t border-[#1f5b70]/40 space-y-1">
              <div className="text-[11px] font-bold text-[#dfba83] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>{t('بوابات وطنية شريكة:', 'National Partner Portals:')}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t(
                  'هيئة ريادة • منصة عُمان للأعمال • بنك التنمية العماني',
                  'Riyada • Oman Business Platform • Oman Development Bank'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* شريط وسيلة الدفع المعتمدة: بوابة ثواني فقط */}
        <div className="bg-[#122e3a] border border-[#1f5b70]/50 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <CreditCard className="w-4 h-4 text-[#c59b5f]" />
            <span>{t('وسائل الدفع الرقمية المعتمدة:', 'Approved Digital Payment Method:')}</span>
          </div>

          <div className="bg-[#4f46e5] text-white px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm border border-indigo-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-[#dfba83]" />
            <span>{t('بوابة ثواني | Thawani Pay', 'Thawani Pay Gateway')}</span>
          </div>
        </div>

        {/* الشريط السفلي الأخير */}
        <div className="pt-6 border-t border-[#1f5b70]/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {t('منصة مُنتجي — جميع الحقوق محفوظة.', 'Montaji Platform — All Rights Reserved.')}{' '}
            <span className="text-[#dfba83] font-semibold">
              {t('صُنع بفخر في سلطنة عمان 🇴🇲', 'Proudly Made in Oman 🇴🇲')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('terms.html')}
              className="hover:text-[#dfba83] transition cursor-pointer"
            >
              {t('شروط الاستخدام', 'Terms of Use')}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('privacy.html')}
              className="hover:text-[#dfba83] transition cursor-pointer"
            >
              {t('سياسة الخصوصية', 'Privacy Policy')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
