import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  BookOpen,
  Award,
  ShieldCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Instagram,
  MessageCircle,
  Database,
} from 'lucide-react';
import { MontajiLogo } from './MontajiLogo';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAuth }) => {
  return (
    <footer className="bg-[#122e3a] text-slate-300 pt-16 pb-12 border-t border-[#1f5b70]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-700/60">
          {/* Col 1: Platform Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-2xl shadow-xs">
                <MontajiLogo size={46} />
              </div>
              <div>
                <span className="text-xl font-black text-white">منصة مُنتجي</span>
                <span className="text-[11px] block text-[#dfba83] font-bold">
                  المنظومة الوطنية لريادة الأعمال والابتكار
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              منصة عمانية متكاملة تهدف إلى تسريع نمو الشركات الناشئة ورواد الأعمال العمانيين،
              توفير دراسات الجدوى الاستثمارية التخصصية والاستشارات مع المستشار عوني، وربط المنتجات الوطنية
              المبتكرة بالأسواق المحلية والخليجية دعماً لرؤية عُمان 2040.
            </p>

            {/* Direct Contact Links: Instagram & Phone */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/montji_/?hl=ar"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800 hover:to-pink-800 text-white border border-pink-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span dir="ltr">@montji_</span>
              </a>

              <a
                href="https://wa.me/96894842840"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/50 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>واتساب الدعم</span>
              </a>

              <a
                href="tel:+96894842840"
                className="inline-flex items-center gap-1.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/40 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all"
                dir="ltr"
              >
                <Phone className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>+968 9484 2840</span>
              </a>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40 px-2.5 py-1 rounded-md text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#c59b5f]" />
                متوافقة مع معايير ريادة ووزارة التجارة العمانية
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">أقسام المنصة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('marketplace.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-slate-500" />
                  <span>سوق المنتجات العمانية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-platform.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right text-[#c59b5f] font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>المستشار الوطني "عوني"</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ai-business-idea.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>دراسات الجدوى الاستثمارية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('training-courses.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                  <span>الأكاديمية والورش التدريبية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  <span>قصص نجاح رواد الأعمال</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">خدمات الرواد والعملاء</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right text-[#c59b5f] font-semibold"
                >
                  <span>تسجيل رائد أعمال (بطاقة ريادة)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <span>بوابة تسجيل الدخول</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('orders.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <span>متابعة الشحنات والطلبات</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('cart.html')}
                  className="hover:text-[#dfba83] transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <span>سلة التسوق والدفع</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('database.html')}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer text-right font-bold"
                >
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>قاعدة بيانات مُنتجي السحابية</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#e9cca0] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer text-right font-bold"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c59b5f]" />
                  <span>لوحة تحكم المشرف العام (Admin)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms.html')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>الشروط والأحكام العامة</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy.html')}
                  className="hover:text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer text-right"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>سياسة الخصوصية وحماية البيانات</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Official Contact & National Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">بيانات التواصل المباشر</h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#c59b5f] shrink-0" />
                <a href="tel:+96894842840" className="hover:text-white font-mono" dir="ltr">
                  +968 9484 2840
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#c59b5f] shrink-0" />
                <a
                  href="https://www.instagram.com/montji_/?hl=ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-mono"
                  dir="ltr"
                >
                  instagram.com/montji_
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#c59b5f] shrink-0" />
                <span>support@montaji.om</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c59b5f] shrink-0" />
                <span>مسقط، سلطنة عُمان - واحة المعرفة</span>
              </li>
            </ul>

            {/* Official Portals list */}
            <div className="pt-3 border-t border-slate-700/60 space-y-1.5 text-[11px] text-slate-400">
              <div className="font-bold text-slate-300">بوابات وطنية شريكة:</div>
              <div className="flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-[#c59b5f]" />
                <span>هيئة ريادة • منصة عُمان للأعمال • بنك التنمية العماني</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods Supported Badges (Apple Pay, Google Pay, Samsung Pay, Bank Muscat, Thawani) */}
        <div className="py-6 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <span>وسائل الدفع الرقمية المعتمدة:</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Apple Pay */}
            <div className="flex items-center gap-1.5 bg-black/60 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.21-10.27-1.93-14.75-6.42-3.5-3.52-7.51-8.59-12.03-15.22-6.52-9.59-11.75-20.47-15.68-32.64-3.93-12.17-5.9-23.75-5.9-34.73 0-14.54 3.73-26.65 11.19-36.33 7.46-9.68 16.92-14.61 28.37-14.78 4.8 0 10.36 1.34 16.69 4.02 6.33 2.68 10.3 4.08 11.91 4.2 1.95-.31 5.92-1.78 11.91-4.41 5.99-2.63 11.23-3.82 15.72-3.58 11.74.63 21.05 4.88 27.93 12.75-10.47 6.34-15.6 15.02-15.4 26.04.19 8.86 3.58 16.29 10.17 22.28 6.59 5.99 14.5 9.4 23.73 10.23-2.34 7.07-5.13 14.18-8.37 21.32zm-29.61-107.03c0 7.44-2.73 14.3-8.2 20.58-6.5 7.42-14.38 11.75-23.63 11.75-.24-1.02-.36-1.95-.36-2.79 0-7.32 3.01-14.6 9.03-21.84 6.02-7.24 13.73-11.49 23.16-12.74z" />
              </svg>
              <span>Apple Pay</span>
            </div>

            {/* Google Pay */}
            <div className="flex items-center gap-1.5 bg-white text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Google Pay</span>
            </div>

            {/* Samsung Pay */}
            <div className="flex items-center gap-1.5 bg-[#1428a0] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
              <span className="font-sans font-black tracking-tight">Samsung Pay</span>
            </div>

            {/* Thawani */}
            <div className="flex items-center gap-1.5 bg-[#4f46e5] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
              <span>محفظة ثواني</span>
            </div>

            {/* Bank Muscat / OmanNet */}
            <div className="flex items-center gap-1.5 bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/50 px-3 py-1.5 rounded-lg text-xs font-bold shadow-2xs">
              <span>عُمان نت / بنك مسقط</span>
            </div>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة مُنتجي - منظومة ريادة الأعمال العمانية المعتمدة.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('terms.html')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              شروط الاستخدام
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('privacy-policy.html')}
              className="hover:text-slate-200 transition-colors cursor-pointer"
            >
              سياسة الخصوصية
            </button>
            <span>•</span>
            <span className="text-[#dfba83] font-bold">صُنع بفخر في سلطنة عمان 🇴🇲</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
