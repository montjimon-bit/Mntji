import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Award,
  BookOpen,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Building2,
  Users,
  Compass,
  Zap,
  Instagram,
  Phone,
  MessageCircle,
  CreditCard,
  Heart,
  Database,
  FolderOpen,
  PackageCheck,
  ShoppingCart,
  UserCheck,
  Server,
  Layers,
  FileSpreadsheet,
  Star,
  Mic,
} from 'lucide-react';
import { PRODUCTS_DATA, TRAINING_COURSES_DATA, SUCCESS_STORIES_DATA } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { MontajiLogo } from '../components/MontajiLogo';
import { ProjectRatingBadge } from '../components/ProjectRatingBadge';
import { ProjectRatingsService } from '../services/project-ratings-service';
import { ProjectRatingStats } from '../data/mockProjectRatings';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onOpenAuth }) => {
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickAiPrompt, setQuickAiPrompt] = useState('');
  const [isListeningHome, setIsListeningHome] = useState(false);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [spotlightStats, setSpotlightStats] = useState<ProjectRatingStats | null>(null);

  const spotlightStory = SUCCESS_STORIES_DATA[0];

  useEffect(() => {
    const loadSpotlight = async () => {
      try {
        const stats = await ProjectRatingsService.getProjectStats(spotlightStory.id);
        setSpotlightStats(stats);
      } catch (e) {
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

  const handleHomeMic = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-OM';
      recognition.continuous = false;
      try {
        recognition.start();
        setIsListeningHome(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuickAiPrompt(transcript);
          setIsListeningHome(false);
        };
        recognition.onerror = () => setIsListeningHome(false);
        recognition.onend = () => setIsListeningHome(false);
      } catch (err) {
        setIsListeningHome(false);
      }
    } else {
      setAddedToast('ميزة التعرف الصوتي غير مدعومة في متصفحك.');
      setTimeout(() => setAddedToast(null), 2500);
    }
  };

  const handleQuickAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickAiPrompt.trim()) {
      sessionStorage.setItem('initial_ai_query', quickAiPrompt.trim());
      onNavigate('ai-platform.html');
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Toast notification */}
      {addedToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c59b5f]" />
          <span>تمت إضافة "{addedToast}" إلى السلة بنجاح!</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#122e3a] via-[#153e4d] to-[#0f242e] text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1f5b70]/40">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#1f5b70]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left/Main Column */}
            <div className="lg:col-span-7 space-y-6 text-right">
              {/* National Vision Pill */}
              <div className="inline-flex items-center gap-2 bg-[#c59b5f]/15 border border-[#c59b5f]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#dfba83]">
                <ShieldCheck className="w-4 h-4 text-[#c59b5f]" />
                <span>المظلة الوطنية لتمكين الابتكار العماني - رؤية عُمان 2040</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.22] sm:leading-[1.18]">
                انطلق بمشروعك في{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfba83] via-[#e9cca0] to-white">
                  سلطنة عُمان
                </span>{' '}
                بذكاء متكامل
              </h1>

              <p className="text-sm sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                منصة "مُنتجي" المنظومة الوطنية المعتمدة لرواد الأعمال والمشاريع العُمانية: دراسات الجدوى الاستثمارية التخصصية مع المستشار "عوني"، وسوق رقمي وطني، ودعم مباشر لحاملي بطاقة ريادة.
              </p>

              {/* Main CTAs */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('ai-platform.html')}
                  className="w-full sm:w-auto justify-center px-6 py-3.5 bg-gradient-to-r from-[#c59b5f] to-[#dfba83] hover:from-[#b58b4f] hover:to-[#cfab73] text-slate-950 font-black rounded-xl shadow-lg shadow-[#c59b5f]/25 hover:scale-[1.02] transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>استشر المستشار "عوني" مجاناً</span>
                </button>

                <button
                  onClick={() => onNavigate('marketplace.html')}
                  className="w-full sm:w-auto justify-center px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <ShoppingBag className="w-4 h-4 text-[#dfba83]" />
                  <span>تصفح سوق المنتجات العمانية</span>
                </button>

                <button
                  onClick={() => onNavigate('ai-business-idea.html')}
                  className="w-full sm:w-auto justify-center px-5 py-3.5 bg-[#1f5b70]/60 hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/30 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm"
                >
                  <TrendingUp className="w-4 h-4 text-[#dfba83]" />
                  <span>إعداد دراسة جدوى استثمارية</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-700/60 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span>معتمد لحاملي بطاقة ريادة</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span>تكامل مع منصة عُمان للأعمال</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#c59b5f] shrink-0" />
                  <span>ذكاء اصطناعي حقيقي متطور</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Teaser Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#122e3a]/90 border border-[#1f5b70]/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1f5b70] border border-[#c59b5f]/40 flex items-center justify-center text-white shadow-md">
                      <Sparkles className="w-5 h-5 text-[#dfba83]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-base">المستشار الاقتصادي "عوني"</h3>
                      <p className="text-xs text-[#dfba83]">المستشار الاستراتيجي المعتمد لمشاريع السلطنة</p>
                    </div>
                  </div>
                  <span className="text-[11px] bg-[#c59b5f]/20 text-[#dfba83] border border-[#c59b5f]/40 px-2.5 py-0.5 rounded-full font-bold">
                    استشارة حية
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="bg-[#153e4d]/70 rounded-2xl p-3.5 text-xs text-slate-200 leading-relaxed border border-[#1f5b70]/60">
                    <span className="font-bold text-[#dfba83] block mb-1">
                      يا هلا والله! أنا عوني رفيقك الاستشاري 🇴🇲✨
                    </span>
                    أنا مستشارك الريادي والاستراتيجي المباشر، أرافقك خطوة بخطوة في دراسات الجدوى، واستخراج بطاقة ريادة، وتمويل بنك التنمية، والتسوق الوطني.
                  </div>

                  {/* Preset prompt pills */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] text-slate-400 block font-medium">جرّب تسأل عوني:</span>
                    <button
                      onClick={() => {
                        sessionStorage.setItem('initial_ai_query', 'موه أفضل المنتجات العمانية الفاخرة المناسبة للإهداء في المناسبات؟');
                        onNavigate('ai-platform.html');
                      }}
                      className="w-full text-right text-xs bg-[#153e4d]/50 hover:bg-[#1f5b70]/60 text-slate-200 p-2.5 rounded-xl border border-[#1f5b70]/50 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <span>اقترح لي هدية عمانية فاخرة تبيّض الوجه</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#c59b5f] group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                      onClick={() => {
                        sessionStorage.setItem('initial_ai_query', 'ما هي شروط وإجراءات الحصول على بطاقة ريادة للأعمال؟');
                        onNavigate('ai-platform.html');
                      }}
                      className="w-full text-right text-xs bg-[#153e4d]/50 hover:bg-[#1f5b70]/60 text-slate-200 p-2.5 rounded-xl border border-[#1f5b70]/50 transition-colors flex items-center justify-between cursor-pointer group"
                    >
                      <span>كيف أحصل على بطاقة ريادة والإعفاءات الضريبية؟</span>
                      <ArrowLeft className="w-3.5 h-3.5 text-[#c59b5f] group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Direct input box with voice support */}
                  <form onSubmit={handleQuickAiSubmit} className="mt-3 pt-1">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={quickAiPrompt}
                        onChange={(e) => setQuickAiPrompt(e.target.value)}
                        placeholder={isListeningHome ? 'عوني يستمع لصوتك الآن...' : 'اكتب لعوني سؤالك بلهجتك الطبيعية...'}
                        className="w-full bg-[#153e4d] text-sm text-white placeholder-slate-400 px-4 py-3 rounded-xl border border-[#1f5b70] focus:outline-hidden focus:border-[#c59b5f] pr-4 pl-22"
                      />
                      <div className="absolute left-2 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleHomeMic}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            isListeningHome
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-[#1f5b70] text-[#dfba83] hover:bg-[#153e4d]'
                          }`}
                          title="تحدث صوتياً مع عوني"
                        >
                          <Mic className="w-4 h-4" />
                        </button>
                        <button
                          type="submit"
                          className="p-2 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 rounded-lg transition-colors cursor-pointer"
                          title="إرسال السؤال لعوني"
                        >
                          <ArrowLeft className="w-4 h-4 font-bold" />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official Contact & Direct Communication Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[#153e4d] text-white">
              <MontajiLogo size={36} />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 dark:text-white">
                قنوات التواصل المباشرة لمنصة "مُنتجي"
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                فريق الدعم الفني وخدمة رواد الأعمال متاح للرد على استفساراتكم
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/montji_/?hl=ar"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <Instagram className="w-4 h-4" />
              <span dir="ltr">@montji_</span>
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/96894842840"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساب الدعم</span>
            </a>

            {/* Direct Phone */}
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
          <div className="space-y-1 border-l border-slate-100 dark:border-slate-800 last:border-l-0">
            <div className="text-3xl sm:text-4xl font-black text-[#153e4d] dark:text-[#dfba83]">+1,850</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">رائد عمل مسجل</div>
          </div>

          <div className="space-y-1 border-l border-slate-100 dark:border-slate-800 last:border-l-0">
            <div className="text-3xl sm:text-4xl font-black text-[#c59b5f]">+420</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">منتج عماني معتمد</div>
          </div>

          <div className="space-y-1 border-l border-slate-100 dark:border-slate-800 last:border-l-0">
            <div className="text-3xl sm:text-4xl font-black text-[#1f5b70] dark:text-[#2d7994]">3.8 مليون ر.ع.</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">حجم مبيعات وتمويلات ميسرة</div>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">98.5%</div>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">نسبة الرضا والنجاح</div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE ALL-DEVICES PLATFORM DIRECTORY (الهاتف، الآيباد، واللابتوب) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-md space-y-6 transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c59b5f] bg-[#c59b5f]/10 px-3 py-1 rounded-full mb-1.5">
                <Layers className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>دليل الوصول السريع والمنظم</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                خريطة أقسام المنصة المنظمة
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                تنظيم متكامل يضمن وصولك الفوري لكافة خدمات وأقسام المنصة بكل سهولة ووضوح سواء كنت تستخدم الهاتف أو الآيباد أو اللابتوب.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>جميع الأقسام متاحة ومتوافقة 100%</span>
              </span>
            </div>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4`}>
            {/* 1. السوق والتسوق الوطني */}
            <div className="p-4 rounded-2xl bg-[#f8fafb] dark:bg-[#153e4d]/30 hover:bg-white dark:hover:bg-[#153e4d]/50 border border-slate-200/80 dark:border-slate-800 hover:border-[#1f5b70]/40 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold mb-3 shadow-2xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">سوق المنتجات والتسوق</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  تصفح المنتجات العمانية الأصيلة، الحلوى، العسل، اللبان، والخناجر مع توصيل لكل المحافظات.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('marketplace.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>سوق المنتجات العمانية</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('cart.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>سلة المشتريات والإنهاء</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('wishlist.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>قائمة المفضلة</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('orders.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>متابعة الشحنات والطلبات</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 2. ريادة الأعمال والاستشارات */}
            <div className="p-4 rounded-2xl bg-[#f8fafb] dark:bg-[#153e4d]/30 hover:bg-white dark:hover:bg-[#153e4d]/50 border border-slate-200/80 dark:border-slate-800 hover:border-[#c59b5f]/50 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center font-bold mb-3 shadow-2xs">
                  <Sparkles className="w-5 h-5 text-[#c59b5f]" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">استشارات وابتكار المشاريع</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  ذكاء اصطناعي تفاعلي مع المستشار "عوني"، إعداد دراسات جدوى مالية متكاملة بريادة عمانية.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('ai-platform.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] text-xs font-bold transition-colors flex items-center justify-between cursor-pointer shadow-xs border border-[#c59b5f]/30"
                >
                  <span>المستشار الذكي "عوني"</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-[#c59b5f]" />
                </button>
                <button
                  onClick={() => onNavigate('ai-business-idea.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>دراسات الجدوى الاقتصادية</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('register.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>تسجيل رائد أعمال / منتج</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* 3. التدريب والتمكين وقصص النجاح */}
            <div className="p-4 rounded-2xl bg-[#f8fafb] dark:bg-[#153e4d]/30 hover:bg-white dark:hover:bg-[#153e4d]/50 border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/40 hover:shadow-lg transition-all space-y-3 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold mb-3 shadow-2xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-black text-slate-900 dark:text-white text-sm">التدريب وبناء القدرات</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  تطوير مهارات ريادة الأعمال، ورش تدريبية، وتجارب ملهمة لشركات عمانية ناشئة حققت نمواً استثنائياً.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate('training-courses.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>الدورات والورش التدريبية</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-white dark:bg-[#07131a] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-slate-200/70 dark:border-slate-700"
                >
                  <span>قصص النجاح والمشاريع المسجلة</span>
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => onNavigate('success-stories.html')}
                  className="w-full py-1.5 px-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer border border-amber-200 dark:border-amber-700"
                >
                  <span className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>تقييم المشاريع للمستثمرين ⭐</span>
                  </span>
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </button>
              </div>
            </div>

            {/* 4. قاعدة بيانات مُنتجي السحابية المخصصة (يظهر للمشرف فقط) */}
            {isAdmin && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#122e3a] to-[#153e4d] text-white border border-[#c59b5f]/50 shadow-lg space-y-3 flex flex-col justify-between animate-in fade-in">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#c59b5f] text-slate-950 flex items-center justify-center font-black mb-3 shadow-md">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-[#e9cca0] text-sm">قاعدة بيانات مُنتجي</h3>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded-full font-bold">
                      مشرف 🟢
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    قاعدة البيانات السحابية الحية المخصصة لحفظ المنتجات، الطلبات، ودراسات الجدوى مع النسخ الاحتياطي الفوري.
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-700/80">
                  <button
                    onClick={() => onNavigate('database.html')}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#c59b5f] to-[#e9cca0] hover:from-[#dfba83] hover:to-[#f5e3c7] text-[#122e3a] text-xs font-black transition-all flex items-center justify-between cursor-pointer shadow-md"
                  >
                    <span>فتح قاعدة البيانات السحابية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DEDICATED MONTAJI DATABASE PROMINENT BANNER (يظهر للمشرف فقط) */}
      {isAdmin && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in">
          <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-6 sm:p-10 text-white border-2 border-[#c59b5f]/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl text-right">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 text-[#e9cca0] border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-black">
                    <Database className="w-3.5 h-3.5 text-[#c59b5f]" />
                    <span>داتا بيس خاصة بـ "مُنتجي" • Cloud Firestore (لوحة المشرف)</span>
                  </span>
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>متصلة بنجاح وبأعلى درجات الأمان</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight text-white">
                  منظومة البيانات السحابية المركزية المخصصة لـ{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#dfba83] via-[#e9cca0] to-white">
                    "مُنتجي"
                  </span>
                </h2>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                  تم تهيئة قاعدة بيانات Firestore سحابية متقدمة مربوطة خصيصاً بمشروع منتجي لإدارة وحفظ بيانات المنتجات العمانية، وسجلات الطلبات والمبيعات، وملفات المستخدمين، وأرشيف دراسات الجدوى الاقتصادية لمستشارك "عوني"، مع إمكانية التصدير والنسخ الاحتياطي في أي لحظة.
                </p>

                {/* Live Collections Quick Counter Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#122e3a]/90 border border-slate-700/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-400 font-bold">المنتجات (products)</div>
                    <div className="text-lg font-black text-[#e9cca0] mt-0.5">{PRODUCTS_DATA.length}+ منتج</div>
                  </div>

                  <div className="bg-[#122e3a]/90 border border-slate-700/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-400 font-bold">الطلبات (orders)</div>
                    <div className="text-lg font-black text-white mt-0.5">مزامنة فورية</div>
                  </div>

                  <div className="bg-[#122e3a]/90 border border-slate-700/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-400 font-bold">دراسات الجدوى</div>
                    <div className="text-lg font-black text-white mt-0.5">أرشيف عوني</div>
                  </div>

                  <div className="bg-[#122e3a]/90 border border-slate-700/80 p-3 rounded-2xl">
                    <div className="text-[10px] text-slate-400 font-bold">النسخ الاحتياطي</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">JSON 💾</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => onNavigate('database.html')}
                  className="px-6 py-3.5 bg-gradient-to-r from-[#c59b5f] to-[#e9cca0] hover:from-[#dfba83] hover:to-[#f5e3c7] text-[#122e3a] font-black rounded-2xl text-sm transition-all shadow-xl hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Database className="w-5 h-5" />
                  <span>دخول مركز قاعدة البيانات</span>
                </button>

                <button
                  onClick={() => onNavigate('admin')}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Server className="w-4 h-4 text-[#c59b5f]" />
                  <span>لوحة التحكم الإدارية</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Omani Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#c59b5f] uppercase tracking-wider mb-1">
              سوق ريادة الأعمال
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              منتجات وابتكارات عمانية أصيلة
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              منتجات متميزة مسجلة برعاية رواد الأعمال وحاملي بطاقة ريادة من كافة المحافظات.
            </p>
          </div>

          <button
            onClick={() => onNavigate('marketplace.html')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1f5b70] dark:text-[#dfba83] hover:text-[#153e4d] dark:hover:text-white transition-colors cursor-pointer group"
          >
            <span>استعراض كافة المنتجات ({PRODUCTS_DATA.length})</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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

                {/* Wishlist Heart Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer z-10 ${
                    isInWishlist(product.id)
                      ? 'bg-rose-500 text-white scale-110 shadow-rose-200'
                      : 'bg-white/80 hover:bg-white text-slate-600 hover:text-rose-500'
                  }`}
                  title={isInWishlist(product.id) ? 'إزالة من قائمة أمنياتي' : 'إضافة إلى قائمة أمنياتي'}
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isInWishlist(product.id) ? 'fill-white text-white' : ''
                    }`}
                  />
                </button>

                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 px-2.5 py-1 rounded-lg shadow-xs">
                  {product.governorate}
                </span>
                {product.seller.isRiyadaCertified && (
                  <span className="absolute bottom-3 right-3 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-[#c59b5f]" />
                    بطاقة ريادة
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="text-[11px] font-semibold text-[#1f5b70] dark:text-[#dfba83] mb-1">
                    {product.category}
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-2 group-hover:text-[#1f5b70] transition-colors leading-snug">
                    {product.title}
                  </h3>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900 dark:text-white">
                      {product.price.toFixed(3)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold mr-1">ر.ع.</span>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(product, e)}
                    className="p-2.5 bg-[#1f5b70]/10 dark:bg-slate-800 text-[#1f5b70] dark:text-[#dfba83] hover:bg-[#1f5b70] hover:text-white rounded-xl transition-colors cursor-pointer"
                    title="إضافة إلى السلة"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Official Payment Methods Strip (Apple Pay, Google Pay, Samsung Pay) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-[#153e4d] to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-wrap items-center justify-between gap-6 border border-[#1f5b70]/50 shadow-xl">
          <div className="space-y-1 max-w-md">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#dfba83]">
              <CreditCard className="w-4 h-4 text-[#c59b5f]" />
              <span>دفع رقمي آمن 100% في سلطنة عمان</span>
            </div>
            <h3 className="text-xl font-black">
              ادفع بسهولة عبر Apple Pay و Google Pay و Samsung Pay
            </h3>
            <p className="text-xs text-slate-300">
              ندعم كافة المحافظ الرقمية وبطاقات الخصم المباشر (عُمان نت وبنك مسقط) ومحفظة ثواني لتجربة تسوق آمنة وسريعة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Apple Pay */}
            <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-xl text-xs font-bold text-white border border-slate-700 shadow-md">
              <svg className="w-4 h-4" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-5.35.21-10.27-1.93-14.75-6.42-3.5-3.52-7.51-8.59-12.03-15.22-6.52-9.59-11.75-20.47-15.68-32.64-3.93-12.17-5.9-23.75-5.9-34.73 0-14.54 3.73-26.65 11.19-36.33 7.46-9.68 16.92-14.61 28.37-14.78 4.8 0 10.36 1.34 16.69 4.02 6.33 2.68 10.3 4.08 11.91 4.2 1.95-.31 5.92-1.78 11.91-4.41 5.99-2.63 11.23-3.82 15.72-3.58 11.74.63 21.05 4.88 27.93 12.75-10.47 6.34-15.6 15.02-15.4 26.04.19 8.86 3.58 16.29 10.17 22.28 6.59 5.99 14.5 9.4 23.73 10.23-2.34 7.07-5.13 14.18-8.37 21.32zm-29.61-107.03c0 7.44-2.73 14.3-8.2 20.58-6.5 7.42-14.38 11.75-23.63 11.75-.24-1.02-.36-1.95-.36-2.79 0-7.32 3.01-14.6 9.03-21.84 6.02-7.24 13.73-11.49 23.16-12.74z" />
              </svg>
              <span>Apple Pay</span>
            </div>

            {/* Google Pay */}
            <div className="flex items-center gap-2 bg-white text-slate-800 px-4 py-2 rounded-xl text-xs font-bold shadow-md">
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
            <div className="flex items-center gap-2 bg-[#1428a0] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
              <span>Samsung Pay</span>
            </div>

            {/* Thawani */}
            <div className="flex items-center gap-2 bg-[#4f46e5] text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md">
              <span>ثواني Thawani</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive AI Tools Showcase Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#122e3a] text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl border border-[#1f5b70]/60">
          <div className="absolute top-0 left-0 w-80 h-80 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-[#c59b5f]/20 border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-bold text-[#dfba83]">
              <TrendingUp className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>مركز دراسات الجدوى والاستشارات الاستثمارية</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black">
              هل لديك فكرة مشروع وتبحث عن الجدوى الاقتصادية؟
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              قم بإعداد دراسة جدوى استثمارية تخصصية متكاملة. يتيح لك النظام حساب رأس المال التأسيسي، وتكاليف التشغيل، ونقطة التعادل بالريال العماني بدقة، مع استعراض التراخيص المطلوبة وفرص التمويل الميسر من بنك التنمية العماني.
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <button
                onClick={() => onNavigate('ai-business-idea.html')}
                className="px-6 py-3.5 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 font-black rounded-xl transition-all shadow-lg shadow-[#c59b5f]/25 flex items-center gap-2 cursor-pointer text-sm"
              >
                <span>بدء دراسة الجدوى الآن</span>
                <ArrowLeft className="w-4 h-4 font-bold" />
              </button>

              <button
                onClick={() => onNavigate('ai-platform.html')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-colors border border-white/20 text-sm cursor-pointer"
              >
                <span>محادثة المستشار "عوني"</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Training Courses Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold text-[#c59b5f] uppercase tracking-wider mb-1">
              بناء القدرات
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              ورش وبرامج تدريبية متخصصة
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              دورات معتمدة لرواد الأعمال بالتعاون مع هيئة ريادة والخبراء الماليين في عمان.
            </p>
          </div>

          <button
            onClick={() => onNavigate('training-courses.html')}
            className="flex items-center gap-1.5 text-sm font-bold text-[#1f5b70] dark:text-[#dfba83] hover:text-[#153e4d] dark:hover:text-white transition-colors cursor-pointer group"
          >
            <span>عرض كل الدورات والورش</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
                <span className="absolute top-3 right-3 bg-[#153e4d]/90 backdrop-blur-xs text-[#e9cca0] text-[11px] font-bold px-2.5 py-1 rounded-md">
                  {course.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#1f5b70] dark:group-hover:text-[#dfba83] transition-colors line-clamp-2 text-base leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    المحاضر: {course.instructor}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1f5b70] dark:text-[#dfba83] bg-[#1f5b70]/10 dark:bg-slate-800 px-2 py-1 rounded-md">
                    {typeof course.price === 'number' ? `${course.price.toFixed(3)} ر.ع.` : course.price}
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

            <div className="lg:col-span-7 space-y-4 text-right">
              <div className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 text-[#845d25] dark:text-[#dfba83] text-xs font-bold px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>قصة نجاح ملهمة من {spotlightStory.governorate}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {spotlightStory.companyName}
              </h3>

              <div className="text-sm font-semibold text-[#1f5b70] dark:text-[#dfba83]">
                المؤسس: {spotlightStory.founder} • تأسست عام {spotlightStory.yearEstablished}
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
                  <span>قراءة قصص النجاح الأخرى</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Box for Entrepreneurs Registration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#153e4d] rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-xl relative overflow-hidden border border-[#1f5b70]/60">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              هل أنت صاحب مشروع أو حرفي عماني؟
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              سجل مشروعك اليوم في منصة "مُنتجي"، واحصل على الدعم التسويقي المتكامل، والاستشارات التخصصية مع المستشار عوني، واستفد من نسبة المشتريات الحكومية وتسهيلات بطاقة ريادة.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap justify-center gap-3">
              <button
                onClick={() => onNavigate('register.html')}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 font-black rounded-xl shadow-lg transition-all text-sm cursor-pointer"
              >
                تسجيل رائد أعمال جديد (مجاناً)
              </button>
              <button
                onClick={() => onNavigate('training-courses.html')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors text-sm cursor-pointer border border-white/20"
              >
                استعراض الدورات المتاحة
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
