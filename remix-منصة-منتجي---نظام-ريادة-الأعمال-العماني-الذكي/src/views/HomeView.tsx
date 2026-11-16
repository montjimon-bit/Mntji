import React, { useState, useEffect } from 'react';
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
  Database,
  Server,
  Layers,
  Star,
} from 'lucide-react';
import { PRODUCTS_DATA, TRAINING_COURSES_DATA, SUCCESS_STORIES_DATA } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { MontajiLogo } from '../components/MontajiLogo';
import { ProjectRatingBadge } from '../components/ProjectRatingBadge';
import { ProjectRatingsService } from '../services/project-ratings-service';
import { ProjectRatingStats } from '../data/mockProjectRatings';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { lang, t } = useLanguage();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [spotlightStats, setSpotlightStats] = useState<ProjectRatingStats | null>(null);

  const spotlightStory = SUCCESS_STORIES_DATA[0];

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        const stats = await ProjectRatingsService.getProjectStats(spotlightStory.id);
        setSpotlightStats(stats);
      } catch {
        // Fallback
      }
    };
    loadSpotlight();
  }, [spotlightStory.id]);

  const featuredProducts = PRODUCTS_DATA.slice(0, 4);
  const featuredCourses = TRAINING_COURSES_DATA.slice(0, 3);

  const handleQuickAdd = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Toast notification */}
      {addedToast && (
        <div className="fixed bottom-24 end-6 z-50 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c59b5f]" />
          <span>{t(`تمت إضافة "${addedToast}" إلى السلة بنجاح!`, `Added "${addedToast}" to cart!`)}</span>
        </div>
      )}

      {/* Hero Section (متناسق ومتوسط على كامل الشاشة بدون فراغ جانبي) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#122e3a] via-[#153e4d] to-[#0f242e] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-[#1f5b70]/40">
        <div className="absolute top-0 start-1/4 w-96 h-96 bg-[#1f5b70]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 end-1/4 w-96 h-96 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-7">
          <div className="inline-flex items-center justify-center gap-2 bg-[#c59b5f]/15 border border-[#c59b5f]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#dfba83]">
            <ShieldCheck className="w-4 h-4 text-[#c59b5f]" />
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

          {/* الأزرار الرئيسية متوسطة ومتوازنة */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('marketplace.html')}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-gradient-to-r from-[#c59b5f] to-[#dfba83] hover:from-[#b58b4f] hover:to-[#cfab73] text-slate-950 font-black rounded-xl shadow-lg shadow-[#c59b5f]/25 hover:scale-[1.02] transition-all flex items-center gap-2.5 cursor-pointer text-sm sm:text-base"
            >
              <ShoppingBag className="w-5 h-5 text-slate-950" />
              <span>{t('سوق المنتجات', 'Products Marketplace')}</span>
            </button>

            <button
              onClick={() => onNavigate('training-courses.html')}
              className="w-full sm:w-auto justify-center px-8 py-4 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold rounded-xl transition-all flex items-center gap-2.5 cursor-pointer text-sm sm:text-base"
            >
              <BookOpen className="w-5 h-5 text-[#dfba83]" />
              <span>{t('الدورات التدريبية', 'Training Courses')}</span>
            </button>
          </div>

          {/* Trust Indicators متناسقة في الوسط */}
          <div className="pt-8 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-700/60 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#c59b5f] shrink-0" />
              <span>{t('معتمد لحاملي بطاقة ريادة', 'Certified for Riyada Card Holders')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-4 h-4 text-[#c59b5f] shrink-0" />
              <span>{t('تكامل مع منصة عُمان للأعمال', 'Integrated with Oman Business Platform')}</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-[#c59b5f] shrink-0" />
              <span>{t('توصيل لجميع محافظات السلطنة', 'Delivery Across All Governorates')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Official Contact & Direct Communication Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 transition-colors">
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Instagram className="w-4 h-4" />
              <span dir="ltr">@montji_</span>
            </a>

            <a
              href="https://wa.me/96894842840"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('واتساب الدعم', 'WhatsApp Support')}</span>
            </a>

            <a
              href="tel:+96894842840"
              className="inline-flex items-center gap-2 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/40 px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>+968 9484 2840</span>
            </a>
          </div>
        </div>
      </section>

      {/* Live Impact Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center transition-colors">
          <div className="space-y-1 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#153e4d] dark:text-[#dfba83]">+1,850</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('رائد عمل مسجل', 'Registered Entrepreneurs')}
            </div>
          </div>

          <div className="space-y-1 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#c59b5f]">+420</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('منتج عماني معتمد', 'Verified Omani Products')}
            </div>
          </div>

          <div className="space-y-1 border-e border-slate-100 dark:border-slate-800">
            <div className="text-3xl sm:text-4xl font-black text-[#1f5b70] dark:text-[#2d7994]">
              {t('3.8 مليون ر.ع.', '3.8M OMR')}
            </div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('حجم مبيعات وتمويلات ميسرة', 'Sales & Financing Volume')}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">98.5%</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
              {t('نسبة الرضا والنجاح', 'Customer Satisfaction')}
            </div>
          </div>
        </div>
      </section>

      {/* خريطة أقسام المنصة المنظمة (سوق المنتجات + الدورات التدريبية) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-6 transition-colors">
          <div className="text-center max-w-2xl mx-auto border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c59b5f] bg-[#c59b5f]/10 px-3 py-1 rounded-full mb-1.5">
              <Layers className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>{t('دليل الوصول السريع والمنظم', 'Organized Platform Directory')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('خريطة أقسام المنصة المنظمة', 'Organized Platform Sections Map')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t(
                'تنظيم متكامل يضمن وصولك الفوري إلى سوق المنتجات العمانية والدورات التدريبية بكل سهولة ووضوح.',
                'Structured navigation giving you instant access to the Omani Marketplace and Training Courses.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. سوق المنتجات والتسوق */}
            <div className="p-6 rounded-2xl bg-[#f8fafb] dark:bg-[#153e4d]/30 hover:bg-white dark:hover:bg-[#153e4d]/50 border border-slate-200/80 dark:border-slate-800 hover:border-[#1f5b70]/40 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center font-bold mb-3 shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {t('سوق المنتجات والتسوق', 'Products Marketplace & Shopping')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t(
                    'تصفح المنتجات العمانية الأصيلة، العسل، اللبان، والحرف اليدوية مع استعراض متجر كل تاجر وتقييمه وتوصيل لكل المحافظات.',
                    'Browse authentic Omani products, honey, frankincense, and handicrafts, view each seller store and rating, with delivery across Oman.'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('marketplace.html')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{t('سوق المنتجات العمانية', 'Omani Products Marketplace')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#c59b5f]" />
                </button>
                <button
                  onClick={() => onNavigate('cart.html')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>{t('سلة المشتريات والإنهاء', 'Shopping Cart & Checkout')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('wishlist.html')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>{t('قائمة المفضلة', 'My Wishlist')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('orders.html')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>{t('متابعة الشحنات والطلبات', 'Track Orders & Shipments')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 2. الدورات التدريبية وبناء القدرات */}
            <div className="p-6 rounded-2xl bg-[#f8fafb] dark:bg-[#153e4d]/30 hover:bg-white dark:hover:bg-[#153e4d]/50 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
              <div>
                <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 flex items-center justify-center font-bold mb-3 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  {t('الدورات التدريبية وبناء القدرات', 'Training Courses & Capacity Building')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t(
                    'تطوير مهارات ريادة الأعمال، ورش تدريبية معتمدة، وتجارب ملهمة لشركات عمانية ناشئة حققت نمواً استثنائياً.',
                    'Develop entrepreneurship skills through certified workshops and explore inspiring success stories of Omani startups.'
                  )}
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('training-courses.html')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] text-xs font-bold transition-colors flex items-center justify-between cursor-pointer"
                >
                  <span>{t('الدورات والورش التدريبية', 'Training Courses & Workshops')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#c59b5f]" />
                </button>
                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="w-full py-2 px-3.5 rounded-xl bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>{t('قصص النجاح والمشاريع المسجلة', 'Success Stories & Registered Projects')}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="w-full py-2 px-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-950 dark:text-amber-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-amber-200 dark:border-amber-700"
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{t('تقييم المشاريع ⭐', 'Project Ratings ⭐')}</span>
                  </span>
                  <ArrowIcon className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Database Banner (Admin only) */}
      {isAdmin && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-6 sm:p-10 text-white border-2 border-[#c59b5f]/40 shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 text-[#e9cca0] border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-black">
                <Database className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>{t('لوحة المشرف العام • Cloud Firestore', 'Platform Admin Panel • Cloud Firestore')}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black">
                {t('منظومة البيانات السحابية المركزية لـ "مُنتجي"', 'Montaji Central Cloud Database')}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('dashboard.html')}
              className="px-6 py-3.5 bg-[#c59b5f] hover:bg-[#dfba83] text-[#122e3a] font-black rounded-2xl text-sm flex items-center gap-2 cursor-pointer"
            >
              <Server className="w-4 h-4" />
              <span>{t('لوحة التحكم الإدارية', 'Admin Dashboard')}</span>
            </button>
          </div>
        </section>
      )}

      {/* Featured Omani Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#c59b5f] uppercase tracking-wider mb-1">
              {t('سوق ريادة الأعمال', 'Entrepreneurship Marketplace')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('منتجات وابتكارات عمانية أصيلة', 'Authentic Omani Products & Innovations')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t(
                'منتجات متميزة مسجلة برعاية رواد الأعمال وحاملي بطاقة ريادة من كافة المحافظات.',
                'Featured products from Riyada-certified entrepreneurs across all governorates.'
              )}
            </p>
          </div>

          <button
            onClick={() => onNavigate('marketplace.html')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1f5b70] dark:text-[#dfba83] hover:text-[#153e4d] transition-colors cursor-pointer group"
          >
            <span>{t(`استعراض كافة المنتجات (${PRODUCTS_DATA.length})`, `View All Products (${PRODUCTS_DATA.length})`)}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => onNavigate('marketplace.html')}
              className="bg-white dark:bg-[#0d232d] rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer"
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

      {/* Official Payment Methods Strip */}
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
            <p className="text-xs text-slate-300">
              {t(
                'ندعم كافة المحافظ الرقمية وبطاقات الخصم المباشر (عُمان نت وبنك مسقط) ومحفظة ثواني.',
                'Supporting all digital wallets, OmanNet & Bank Muscat debit cards, and Thawani.'
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-black px-4 py-2 rounded-xl text-xs font-bold text-white border border-slate-700">
              Apple Pay
            </div>
            <div className="bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold">
              Google Pay
            </div>
            <div className="bg-[#1428a0] text-white px-4 py-2 rounded-xl text-xs font-bold">
              Samsung Pay
            </div>
            <div className="bg-[#4f46e5] text-white px-3.5 py-2 rounded-xl text-xs font-bold">
              {t('ثواني Thawani', 'Thawani')}
            </div>
          </div>
        </div>
      </section>

      {/* Training Courses Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#c59b5f] uppercase tracking-wider mb-1">
              {t('بناء القدرات', 'Capacity Building')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {t('ورش وبرامج تدريبية متخصصة', 'Specialized Training Workshops & Programs')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t(
                'دورات معتمدة لرواد الأعمال بالتعاون مع هيئة ريادة والخبراء الماليين في عمان.',
                'Certified courses for entrepreneurs in collaboration with Riyada and Omani financial experts.'
              )}
            </p>
          </div>

          <button
            onClick={() => onNavigate('training-courses.html')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1f5b70] dark:text-[#dfba83] hover:text-[#153e4d] transition-colors cursor-pointer group"
          >
            <span>{t('عرض كل الدورات والورش', 'View All Courses & Workshops')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => onNavigate('training-courses.html')}
              className="bg-white dark:bg-[#0d232d] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
            >
              <div className="aspect-16/9 relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 start-3 bg-[#153e4d]/90 backdrop-blur-xs text-[#e9cca0] text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {course.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 text-base leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {t('المحاضر:', 'Instructor:')} {course.instructor}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1f5b70] dark:text-[#dfba83] bg-[#1f5b70]/10 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {typeof course.price === 'number'
                      ? `${course.price.toFixed(3)} ${t('ر.ع.', 'OMR')}`
                      : course.price}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{course.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Success Story Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#1f5b70]/10 via-[#c59b5f]/10 to-white dark:to-[#0d232d] rounded-3xl p-8 sm:p-10 border border-[#1f5b70]/20 dark:border-slate-800 shadow-md transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 aspect-4/3 rounded-2xl overflow-hidden shadow-md">
              <img
                src={spotlightStory.image}
                alt={spotlightStory.founder}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="lg:col-span-7 space-y-4 text-start">
              <div className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 text-[#845d25] dark:text-[#dfba83] text-xs font-bold px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>
                  {t(`قصة نجاح ملهمة من ${spotlightStory.governorate}`, `Success Story from ${spotlightStory.governorate}`)}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {spotlightStory.companyName}
              </h3>

              <div className="text-sm font-semibold text-[#1f5b70] dark:text-[#dfba83]">
                {t(
                  `المؤسس: ${spotlightStory.founder} • تأسست عام ${spotlightStory.yearEstablished}`,
                  `Founder: ${spotlightStory.founder} • Est. ${spotlightStory.yearEstablished}`
                )}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {spotlightStory.story}
              </p>

              {spotlightStats && (
                <div className="pt-1">
                  <ProjectRatingBadge
                    stats={spotlightStats}
                    onOpenRateModal={() => onNavigate('success-stories.html')}
                  />
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <span className="text-sm font-black text-[#153e4d] bg-white border border-[#c59b5f]/40 px-3 py-1.5 rounded-lg shadow-2xs">
                  {spotlightStory.growthRate}
                </span>

                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="text-xs font-bold text-slate-700 hover:text-[#1f5b70] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('قراءة قصص النجاح الأخرى', 'Read More Success Stories')}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
