import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingBag,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Zap,
  Instagram,
  Phone,
  MessageCircle,
  CreditCard,
  Heart,
  Layers,
  Star,
  ChevronDown,
  Sparkles,
  Store,
  TrendingUp,
} from 'lucide-react';
import {
  PRODUCTS_DATA,
  TRAINING_COURSES_DATA,
  SUCCESS_STORIES_DATA,
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

// مكوّن العداد الرقمي المتحرك مثل موقع ثواني
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
  const [activeFeatureTab, setActiveFeatureTab] = useState<'market' | 'courses' | 'sellers'>('market');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const featuredProducts = PRODUCTS_DATA.slice(0, 4);
  const featuredCourses = TRAINING_COURSES_DATA.slice(0, 3);
  const spotlightStory = SUCCESS_STORIES_DATA[0];

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  // بيانات التبويبات التفاعلية (على نمط ثواني)
  const interactiveTabs = {
    market: {
      badge: t('سوق المنتجات العُمانية', 'Omani Products Marketplace'),
      title: t('تسوّق من أجود المشاريع العُمانية المعتمدة في مكان واحد', 'Shop Certified Omani Ventures in One Place'),
      desc: t(
        'من اللبان الحوجري الظفاري وعسل الجبل الأخضر إلى الحلوى العُمانية والمشغولات الفضية، مع إمكانية تصفح متجر كل تاجر وتقييمه مباشرة.',
        'From Dhofari Hojari frankincense and Jabal Akhdar honey to Omani Halwa and silverware, with direct store browsing and ratings.'
      ),
      bullets: [
        t('شحن وتوصيل لجميع محافظات السلطنة الـ 11', 'Delivery across all 11 Governorates of Oman'),
        t('شارة توثيق لحاملي بطاقة ريادة', 'Verified badge for Riyada card holders'),
        t('دفع مرن عبر المحافظ الرقمية أو عند الاستلام', 'Flexible digital wallet or Cash on Delivery'),
      ],
      ctaText: t('استكشف سوق المنتجات الآن', 'Explore Marketplace Now'),
      ctaRoute: 'marketplace.html',
      previewProduct: featuredProducts[0],
    },
    courses: {
      badge: t('أكاديمية مُنتَجي للتدريب', 'Montaji Training Academy'),
      title: t('طوّر مهاراتك في التجارة الإلكترونية وإدارة المشاريع', 'Master E-Commerce & Business Management'),
      desc: t(
        'برامج تدريبية وورش عملية يقدمها نخبة من المختصين في عُمان لتأهيل رواد الأعمال وأصحاب المشاريع المنزلية والصغيرة.',
        'Practical workshops led by Omani specialists to empower entrepreneurs and home-based businesses.'
      ),
      bullets: [
        t('دورات مجانية ومعتمدة برعاية ريادة', 'Free certified courses sponsored by Riyada'),
        t('تدريب عملي على التسويق والتسعير والتراخيص', 'Hands-on training in marketing, pricing & licensing'),
        t('شهادات إتمام فورية للمشاركين', 'Instant completion certificates for participants'),
      ],
      ctaText: t('تصفح الدورات التدريبية', 'Browse Training Courses'),
      ctaRoute: 'training-courses.html',
      previewProduct: featuredProducts[1],
    },
    sellers: {
      badge: t('بوابة التاجر ورائد الأعمال', 'Merchant & Entrepreneur Portal'),
      title: t('افتح متجرك الرقمي وأدر منتجاتك ومبيعاتك بذكاء', 'Launch Your Digital Store & Manage Sales'),
      desc: t(
        'سجّل كبائع في منصة مُنتَجي واحصل على لوحة تحكم متكاملة لإضافة منتجاتك، متابعة طلباتك، والاستفادة من دراسة الجدوى الذكية.',
        'Register as a seller on Montaji to manage products, track orders, and access smart feasibility studies.'
      ),
      bullets: [
        t('صفحة متجر خاصة باسم مشروعك وتقييمك', 'Dedicated store page with your brand & ratings'),
        t('أدوات دراسة الجدوى وحساب نقطة التعادل بالريال العُماني', 'OMR feasibility study & break-even calculators'),
        t('وصول مباشر لآلاف المشترين في السلطنة', 'Direct reach to thousands of buyers across Oman'),
      ],
      ctaText: t('ابدأ البيع في مُنتَجي', 'Start Selling on Montaji'),
      ctaRoute: 'register.html',
      previewProduct: featuredProducts[2],
    },
  };

  const currentTab = interactiveTabs[activeFeatureTab];

  const faqs = [
    {
      q: t('كيف يمكنني الشراء من سوق منصة مُنتَجي؟', 'How can I shop on Montaji Marketplace?'),
      a: t(
        'اختر المنتج الذي يعجبك من السوق، اضغط على "أضف للسلة"، ثم انتقل للسلة لإتمام الطلب واختيار وسيلة الدفع المناسبة لك سواء بالبطاقة أو عند الاستلام.',
        'Select any product from the marketplace, click Add to Cart, and proceed to checkout with card or Cash on Delivery.'
      ),
    },
    {
      q: t('كيف أعرض منتجاتي كبائع في المنصة؟', 'How do I list my products as a seller?'),
      a: t(
        'اضغط على "دخول / تسجيل" في الأعلى، اختر نوع الحساب "بائع"، وسيُفتح لك فوراً قسم "متجري الخاص" لإضافة منتجاتك وصورها وأسعارها بالريال العُماني.',
        'Click Sign In / Register at the top, select Seller account, and your private store dashboard will unlock immediately.'
      ),
    },
    {
      q: t('هل الدورات التدريبية متاحة للجميع؟', 'Are training courses open to everyone?'),
      a: t(
        'نعم، جميع الزوار والعملاء ورواد الأعمال يمكنهم تصفح الدورات التدريبية وحجز مقاعدهم مباشرة من قسم الدورات التدريبية.',
        'Yes, all visitors, customers, and entrepreneurs can browse and enroll in training courses directly.'
      ),
    },
    {
      q: t('ما هي وسائل الدفع والتوصيل المتوفرة في عُمان؟', 'What payment and delivery options are available in Oman?'),
      a: t(
        'نوفر التوصيل لكافة محافظات سلطنة عُمان الـ 11، مع دعم الدفع عند الاستلام، Apple Pay، Google Pay، Samsung Pay، ومحفظة ثواني.',
        'We deliver to all 11 Governorates of Oman with Cash on Delivery, Apple Pay, Google Pay, Samsung Pay, and Thawani.'
      ),
    },
  ];

  return (
    <div className="space-y-16 pb-16 overflow-x-hidden">
      {/* تنبيه الإضافة للسلة */}
      {addedToast && (
        <div className="fixed bottom-24 end-6 z-50 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c59b5f]" />
          <span>{t(`تمت إضافة "${addedToast}" إلى السلة بنجاح!`, `Added "${addedToast}" to cart!`)}</span>
        </div>
      )}

      {/* 1. قسم الهيرو التفاعلي المتوازن */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#122e3a] via-[#153e4d] to-[#0f242e] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#1f5b70]/40">
        {/* إضاءات خلفية متحركة بنعومة */}
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

          {/* الأزرار الرئيسية التفاعلية */}
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

          {/* شريط المحافظات العُمانية التفاعلي */}
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

      {/* 3. العدادات الرقمية المتحركة (Animated Counters على نمط ثواني) */}
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

      {/* 4. قسم التبويبات التفاعلية الذكية (Interactive Feature Tabs مثل ثواني) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c59b5f] bg-[#c59b5f]/10 px-3.5 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('اكتشف تجربة مُنتَجي التفاعلية', 'Explore Interactive Montaji')}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {t('منظومة متكاملة تلبي احتياجاتك', 'An Ecosystem Built Around Your Needs')}
            </h2>

            {/* أزرار التبديل التفاعلية */}
            <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 mt-3">
              <button
                type="button"
                onClick={() => setActiveFeatureTab('market')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFeatureTab === 'market'
                    ? 'bg-[#153e4d] text-[#e9cca0] shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
                <span>{t('سوق المنتجات', 'Marketplace')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFeatureTab('courses')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFeatureTab === 'courses'
                    ? 'bg-[#153e4d] text-[#e9cca0] shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-[#c59b5f]" />
                <span>{t('الدورات التدريبية', 'Training Courses')}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveFeatureTab('sellers')}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  activeFeatureTab === 'sellers'
                    ? 'bg-[#153e4d] text-[#e9cca0] shadow-md scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                <Store className="w-4 h-4 text-[#c59b5f]" />
                <span>{t('بوابة التاجر', 'Seller Portal')}</span>
              </button>
            </div>
          </div>

          {/* محتوى التبويب المختار مع حركة ناعمة */}
          <div
            key={activeFeatureTab}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8fafb] dark:bg-[#153e4d]/25 rounded-3xl p-6 sm:p-8 border border-slate-200/70 dark:border-slate-800 animate-in fade-in duration-300"
          >
            <div className="lg:col-span-7 space-y-4 text-start">
              <span className="inline-block text-xs font-bold text-[#1f5b70] dark:text-[#dfba83] bg-[#1f5b70]/10 px-3 py-1 rounded-lg">
                {currentTab.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-snug">
                {currentTab.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentTab.desc}
              </p>

              <ul className="space-y-2.5 pt-1">
                {currentTab.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => onNavigate(currentTab.ctaRoute)}
                  className="px-6 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] rounded-xl text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>{currentTab.ctaText}</span>
                  <ArrowIcon className="w-4 h-4 text-[#c59b5f]" />
                </button>
              </div>
            </div>

            {/* بطاقة معاينة حية تفاعلية */}
            <div className="lg:col-span-5">
              <div
                onClick={() => onNavigate(currentTab.ctaRoute)}
                className="bg-white dark:bg-[#0d232d] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group"
              >
                <div className="aspect-16/10 overflow-hidden bg-slate-100 relative">
                  <img
                    src={currentTab.previewProduct.image}
                    alt={currentTab.previewProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 start-3 bg-[#153e4d]/90 text-[#e9cca0] text-[11px] font-bold px-3 py-1 rounded-lg">
                    {currentTab.previewProduct.governorate}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {currentTab.previewProduct.title}
                    </div>
                    <div className="text-[11px] text-[#c59b5f] font-semibold mt-0.5">
                      {currentTab.previewProduct.seller.name}
                    </div>
                  </div>
                  <div className="text-sm font-black text-[#153e4d] dark:text-[#dfba83] shrink-0">
                    {currentTab.previewProduct.price.toFixed(3)} {t('ر.ع.', 'OMR')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. المنتجات العُمانية المميزة */}
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

      {/* 6. قسم الأسئلة الشائعة التفاعلي (Interactive FAQ Accordion مثل ثواني) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#c59b5f]">
              {t('إجابات سريعة وواضحة', 'Quick & Clear Answers')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('الأسئلة الشائعة', 'Frequently Asked Questions')}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all ${
                    isOpen
                      ? 'bg-[#f4f8fa] dark:bg-[#153e4d]/40 border-[#1f5b70]/40'
                      : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-start cursor-pointer"
                  >
                    <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#1f5b70] dark:text-[#dfba83] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-700/50 pt-3 animate-in fade-in duration-200">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. شريط وسائل الدفع المعتمدة */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#153e4d] to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-wrap items-center justify-between gap-6 border border-[#1f5b70]/50 shadow-xl">
          <div className="space-y-1 max-w-md">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#dfba83]">
              <CreditCard className="w-4 h-4 text-[#c59b5f]" />
              <span>{t('دفع رقمي آمن 100% في سلطنة عمان', '100% Secure Digital Payments in Oman')}</span>
            </div>
            <h3 className="text-xl font-black">
              {t(
                'ادفع بسهولة عبر Apple Pay و Google Pay و Samsung Pay',
                'Pay Easily via Apple Pay, Google Pay & Samsung Pay'
              )}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black px-4 py-2 rounded-xl text-xs font-bold text-white border border-slate-700 hover:scale-105 transition">
              Apple Pay
            </div>
            <div className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition">
              Google Pay
            </div>
            <div className="bg-[#1428a0] text-white px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition">
              Samsung Pay
            </div>
            <div className="bg-[#4f46e5] text-white px-3.5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition">
              {t('ثواني Thawani', 'Thawani')}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
