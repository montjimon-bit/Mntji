import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Instagram,
  Phone,
  MessageCircle,
  CreditCard,
  Heart,
  Star,
} from 'lucide-react';
import {
  PRODUCTS_DATA,
  OMAN_GOVERNORATES,
} from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { MontajiLogo } from '../components/MontajiLogo';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

// مكوّن العداد الرقمي المتحرك
const AnimatedStatCounter: React.FC<{
  target: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}> = ({ target, prefix = '', suffix = '', decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    const duration = 1400;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(target * easeOut);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [started, target]);

  const formatted =
    decimals > 0
      ? count.toFixed(decimals)
      : Math.floor(count).toLocaleString('en-US');

  return (
    <div ref={ref} dir="ltr" className="inline-block">
      {prefix}
      {formatted}
      {suffix}
    </div>
  );
};

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang, t } = useLanguage();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [addedToast, setAddedToast] = useState<string | null>(null);

  const featuredProducts = PRODUCTS_DATA.slice(0, 4);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="space-y-16 pb-16 overflow-x-hidden">
      {/* تنبيه الإضافة للسلة */}
      {addedToast && (
        <div className="fixed bottom-24 end-6 z-50 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c59b5f]" />
          <span>{t(`تمت إضافة "${addedToast}" إلى السلة بنجاح!`, `Added "${addedToast}" to cart!`)}</span>
        </div>
      )}

      {/* 1. قسم الهيرو */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#122e3a] via-[#153e4d] to-[#0f242e] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#1f5b70]/40">
        <div className="absolute -top-20 start-1/4 w-96 h-96 bg-[#1f5b70]/40 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-20 end-1/4 w-96 h-96 bg-[#c59b5f]/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-7">
          <div className="inline-flex items-center justify-center gap-2 bg-[#c59b5f]/15 border border-[#c59b5f]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#dfba83] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {t(
                'المظلة الوطنية لتمكين الابتكار العماني - رؤية عُمان 2040',
                'National Umbrella for Omani Innovation - Oman Vision 2040'
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.22] sm:leading-[1.18] max-w-4xl mx-auto">
            {t('انطلق بمشروعك في ', 'Launch Your Venture in ')}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfba83] via-[#e9cca0] to-white">
              {t('سلطنة عُمان', 'Sultanate of Oman')}
            </span>{' '}
            {t('بذكاء متكامل', 'with Integrated Intelligence')}
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto font-normal">
            {t(
              'منصة "مُنتجي" المنظومة الوطنية المعتمدة لرواد الأعمال والمشاريع العُمانية: سوق رقمي وطني للمنتجات العُمانية الأصيلة، وبرامج ودورات تدريبية متخصصة.',
              'Montaji Platform is the certified national ecosystem for Omani entrepreneurs: a national digital marketplace for authentic Omani products and specialized training courses.'
            )}
          </p>

          {/* الأزرار الرئيسية */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('marketplace.html')}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-gradient-to-r from-[#c59b5f] to-[#dfba83] hover:from-[#b58b4f] hover:to-[#cfab73] text-slate-950 font-black rounded-2xl shadow-lg shadow-[#c59b5f]/25 hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer text-sm sm:text-base"
            >
              <ShoppingBag className="w-5 h-5 text-slate-950" />
              <span>{t('سوق المنتجات', 'Products Marketplace')}</span>
            </button>

            <button
              onClick={() => onNavigate('training-courses.html')}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold rounded-2xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer text-sm sm:text-base backdrop-blur-xs"
            >
              <BookOpen className="w-5 h-5 text-[#dfba83]" />
              <span>{t('الدورات التدريبية', 'Training Courses')}</span>
            </button>
          </div>

          {/* شريط المحافظات العُمانية */}
          <div className="pt-6">
            <div className="text-[11px] text-slate-400 mb-2.5 font-semibold">
              {t('نصل إلى رواد الأعمال والمشترين في كافة محافظات السلطنة:', 'Connecting entrepreneurs & buyers across Oman:')}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
              {OMAN_GOVERNORATES.slice(0, 8).map((gov) => (
                <button
                  key={gov}
                  type="button"
                  onClick={() => onNavigate('marketplace.html')}
                  className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#c59b5f]/20 border border-white/10 hover:border-[#c59b5f]/40 text-[11px] text-slate-200 hover:text-[#e9cca0] transition-all cursor-pointer"
                >
                  {gov}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. شريط التواصل المباشر */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 transition-all hover:shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#153e4d] text-white">
              <MontajiLogo size={36} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                {t('قنوات التواصل المباشرة لمنصة "مُنتجي"', 'Montaji Direct Support Channels')}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(
                  'فريق الدعم الفني وخدمة رواد الأعمال متاح للرد على استفساراتكم',
                  'Technical support and entrepreneur assistance team is ready to help'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://www.instagram.com/montji_/?hl=ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-105 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Instagram className="w-4 h-4" />
              <span dir="ltr">@montji_</span>
            </a>

            <a
              href="https://wa.me/96894842840"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:scale-105 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('واتساب الدعم', 'WhatsApp Support')}</span>
            </a>

            <a
              href="tel:+96894842840"
              className="inline-flex items-center gap-2 bg-[#153e4d] hover:scale-105 text-[#e9cca0] border border-[#c59b5f]/40 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>+968 9484 2840</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. العدادات الرقمية المتحركة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-10 shadow-md border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1.5 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#153e4d] dark:text-[#dfba83]">
              <AnimatedStatCounter target={1850} prefix="+" />
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('رائد عمل مسجل', 'Registered Entrepreneurs')}
            </div>
          </div>

          <div className="space-y-1.5 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#c59b5f]">
              <AnimatedStatCounter target={420} prefix="+" />
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('منتج عماني معتمد', 'Verified Omani Products')}
            </div>
          </div>

          <div className="space-y-1.5 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#1f5b70] dark:text-[#2d7994]">
              <AnimatedStatCounter target={3.8} decimals={1} suffix={lang === 'ar' ? ' مليون ر.ع' : 'M OMR'} />
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('حجم مبيعات وتمويلات ميسرة', 'Sales & Financing Volume')}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              <AnimatedStatCounter target={98.5} decimals={1} suffix="%" />
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('نسبة الرضا والنجاح', 'Customer Satisfaction')}
            </div>
          </div>
        </div>
      </section>

      {/* 4. المنتجات العُمانية المميزة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#c59b5f] uppercase tracking-wider mb-1">
              {t('سوق ريادة الأعمال', 'Entrepreneurship Marketplace')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('منتجات وابتكارات عمانية أصيلة', 'Authentic Omani Products & Innovations')}
            </h2>
          </div>

          <button
            onClick={() => onNavigate('marketplace.html')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1f5b70] dark:text-[#dfba83] hover:text-[#153e4d] transition-colors cursor-pointer group"
          >
            <span>{t(`استعراض كافة المنتجات (${PRODUCTS_DATA.length})`, `View All Products (${PRODUCTS_DATA.length})`)}</span>
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('marketplace.html')}
              className="bg-white dark:bg-[#0d232d] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-3 end-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer z-10 ${
                    isInWishlist(product.id)
                      ? 'bg-rose-500 text-white scale-110'
                      : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isInWishlist(product.id) ? 'fill-white text-white' : ''}`} />
                </button>

                <span className="absolute top-3 start-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 px-2.5 py-1 rounded-lg shadow-xs">
                  {product.governorate}
                </span>
                {product.seller.isRiyadaCertified && (
                  <span className="absolute bottom-3 start-3 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#c59b5f]" />
                    {t('بطاقة ريادة', 'Riyada')}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-semibold text-[#1f5b70] dark:text-[#dfba83] mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                    {product.title}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-[#153e4d] dark:text-[#dfba83] truncate">
                      {product.seller.name}
                    </span>
                    <span className="flex items-center gap-0.5 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      {product.seller.rating}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {product.price.toFixed(3)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold ms-1">
                      {t('ر.ع.', 'OMR')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="p-2.5 bg-[#1f5b70]/10 dark:bg-slate-800 text-[#1f5b70] dark:text-[#dfba83] hover:bg-[#1f5b70] hover:text-white rounded-xl transition-colors cursor-pointer"
                    title={t('إضافة إلى السلة', 'Add to Cart')}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. شريط وسيلة الدفع المعتمدة: بوابة ثواني فقط */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#153e4d] to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-wrap items-center justify-between gap-6 border border-[#1f5b70]/50 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#dfba83]">
              <CreditCard className="w-4 h-4 text-[#c59b5f]" />
              <span>{t('بوابة الدفع الرسمية المعتمدة في منصة مُنتَجي', 'Official Payment Gateway on Montaji')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              {t(
                'ادفع بأمان وسرعة عبر بوابة ثواني (Thawani Pay)',
                'Pay Safely & Instantly via Thawani Pay'
              )}
            </h3>
            <p className="text-xs text-slate-300">
              {t(
                'معاملات إلكترونية مشفرة ومعتمدة في سلطنة عُمان لحماية حقوق المشتري والتاجر.',
                'Encrypted digital transactions licensed in Oman protecting both buyers and sellers.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#4f46e5] text-white px-6 py-3.5 rounded-2xl text-sm font-black shadow-lg border border-indigo-400/40 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#dfba83]" />
              <span>{t('بوابة ثواني | Thawani Pay', 'Thawani Pay Gateway')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
