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
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MontajiLogo } from './MontajiLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { lang, t } = useLanguage();

  const LinkArrow = lang === 'ar' ? ChevronLeft : ChevronRight;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const partnerPortals = [
    {
      name: t('هيئة ريادة', 'Riyada'),
      url: 'https://riyada.om',
    },
    {
      name: t('منصة عُمان للأعمال', 'Oman Business Platform'),
      url: 'https://business.gov.om',
    },
    {
      name: t('بنك التنمية العماني', 'Oman Development Bank'),
      url: 'https://odb.om',
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#0f2934] to-[#0a1c24] text-slate-300 border-t border-[#1f5b70]/50 print:hidden">
      {/* إضاءة ديكورية خفيفة */}
      <div className="absolute -top-24 start-1/3 w-96 h-96 bg-[#1f5b70]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 end-1/4 w-80 h-80 bg-[#c59b5f]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 relative z-10">
        {/* الأقسام الأربعة الرئيسية */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 1. هوية منصة منتجي */}
          <div className="space-y-4">
            <div
              onClick={scrollToTop}
              className="flex items-center gap-3 group cursor-pointer w-fit"
              title={t('العودة للأعلى', 'Back to top')}
            >
              <div className="p-2 rounded-2xl bg-[#153e4d] border border-[#c59b5f]/40 group-hover:scale-105 group-hover:border-[#c59b5f] transition-all shadow-md">
                <MontajiLogo size={36} />
              </div>
              <div>
                <div className="text-lg font-black text-white group-hover:text-[#dfba83] transition-colors">
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
              {[
                { label: t('الرئيسية', 'Home'), route: 'home' },
                { label: t('سوق المنتجات العُمانية', 'Omani Products Marketplace'), route: 'marketplace.html' },
                { label: t('الدورات التدريبية', 'Training Courses'), route: 'training-courses.html' },
                { label: t('قصص نجاح رواد الأعمال', 'Success Stories'), route: 'success-stories.html' },
              ].map((item) => (
                <li key={item.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-[#dfba83] hover:translate-x-1 rtl:hover:-translate-x-1 transition-all cursor-pointer"
                  >
                    <LinkArrow className="w-3.5 h-3.5 text-[#c59b5f] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. خدمات الرواد والعملاء */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-white border-b border-[#1f5b70]/50 pb-2">
              {t('خدمات الرواد والعملاء', 'User & Seller Services')}
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: t('سلة المشتريات', 'Shopping Cart'), route: 'cart.html' },
                { label: t('قائمة المفضلة', 'My Wishlist'), route: 'wishlist.html' },
                { label: t('متابعة طلباتي', 'Track My Orders'), route: 'orders.html' },
              ].map((item) => (
                <li key={item.route}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.route)}
                    className="group flex items-center gap-1.5 text-slate-300 hover:text-[#dfba83] hover:translate-x-1 rtl:hover:-translate-x-1 transition-all cursor-pointer"
                  >
                    <LinkArrow className="w-3.5 h-3.5 text-[#c59b5f] opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
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
                  className="flex items-center gap-2 text-slate-200 hover:text-[#dfba83] transition bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c59b5f] shrink-0" />
                  <span className="truncate">
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
                  className="flex items-center gap-2 text-slate-200 hover:text-[#dfba83] transition bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c59b5f] shrink-0" />
                  <span dir="ltr" className="font-mono">
                    +968 9484 2840
                  </span>
                </a>
              </li>

              {/* أزرار سريعة لواتساب وانستجرام */}
              <li className="flex items-center gap-2 pt-0.5">
                <a
                  href="https://wa.me/96894842840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 py-2 px-2.5 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('واتساب', 'WhatsApp')}</span>
                </a>

                <a
                  href="https://www.instagram.com/montji_/?hl=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-pink-600/20 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-pink-300 hover:text-white border border-pink-500/30 py-2 px-2.5 rounded-xl font-bold transition-all hover:-translate-y-0.5"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span dir="ltr">@montji_</span>
                </a>
              </li>
            </ul>

            {/* بوابات وطنية شريكة تفاعلية داخل قسم التواصل المباشر */}
            <div className="pt-3 border-t border-[#1f5b70]/40 space-y-2">
              <div className="text-[11px] font-bold text-[#dfba83] flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>{t('بوابات وطنية شريكة:', 'National Partner Portals:')}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {partnerPortals.map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#153e4d]/80 hover:bg-[#1f5b70] text-slate-200 hover:text-[#e9cca0] border border-[#1f5b70] px-2 py-1 rounded-lg transition-all hover:-translate-y-0.5"
                  >
                    <span>{portal.name}</span>
                    <ExternalLink className="w-2.5 h-2.5 text-[#c59b5f]" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* شريط وسيلة الدفع المعتمدة: بوابة ثواني فقط */}
        <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#122e3a] border border-[#1f5b70]/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-200">
            <CreditCard className="w-4 h-4 text-[#c59b5f]" />
            <span>{t('وسائل الدفع الرقمية المعتمدة:', 'Approved Digital Payment Method:')}</span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('cart.html')}
            className="bg-[#4f46e5] hover:bg-[#4338ca] hover:scale-105 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 shadow-md border border-indigo-400/40 transition-all cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#dfba83]" />
            <span>{t('بوابة ثواني | Thawani Pay', 'Thawani Pay Gateway')}</span>
          </button>
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
            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/40 px-3 py-1.5 rounded-xl font-bold transition-all hover:-translate-y-0.5 cursor-pointer"
              title={t('العودة إلى أعلى الصفحة', 'Scroll to Top')}
            >
              <span>{t('للأعلى', 'Top')}</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#c59b5f]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
