import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  TrendingUp,
  Award,
  ShieldCheck,
  Truck,
  Store,
  Compass,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { BoothStoreCreator } from '../components/BoothStoreCreator';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { products, addToCart } = useCart();

  // جلب المنتجات المميزة المتاحة
  const featuredProducts = (products || [])
    .filter((p) => p.featured || (p.stock !== undefined && p.stock > 0))
    .slice(0, 8);

  return (
    <div className="w-full space-y-12 sm:space-y-16 pb-16" dir="rtl">
      {/* 1. قسم البانر الرئيسي الترحيبي (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1b4d5e] via-[#246277] to-[#1b4d5e] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#d4ab71]/30">
        <div className="absolute inset-0 bg-[radial-gradient(#d4ab71_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#d4ab71]/20 border border-[#d4ab71]/50 px-4 py-1.5 rounded-full text-[#ebd0a3] text-xs sm:text-sm font-bold shadow-xs">
            <Sparkles className="w-4 h-4" />
            <span>المنظومة الوطنية المعتمدة لرواد الأعمال والمشاريع العُمانية 🇴🇲</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl leading-tight">
            مَنصّة <span className="text-[#ebd0a3]">مُنتجي</span>.. بوابتك لدعم وتنمية المنتجات الوطنية
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
            سوق رقمي وطني، واستشارات اقتصادية ذكية مع المستشار "عوني"، ودراسات جدوى ميسرة متوافقة مع متطلبات بنك التنمية العماني وهيئة ريادة[cite: 5].
          </p>

          {/* الأزرار الرئيسية في الهيدر */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => onNavigate('marketplace')}
              className="px-7 py-4 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer text-sm"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>تسوق من السوق العُماني</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ai-platform')}
              className="px-7 py-4 bg-[#2a768e] hover:bg-[#1b4d5e] border border-white/20 text-white font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer text-sm"
            >
              <Compass className="w-5 h-5 text-[#ebd0a3]" />
              <span>استشر المستشار "عوني"</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. بانر تفاعل البوث لزوار المعرض والابتكار الفوري */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BoothStoreCreator onSuccessNavigate={onNavigate} />
      </section>

      {/* 3. شريط الإحصائيات والقيمة المضافة الوطنية */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-center space-y-1">
            <div className="w-10 h-10 bg-[#2a768e]/10 text-[#2a768e] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">100%</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">منتجات وطنية أصيلة</p>
          </div>

          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-center space-y-1">
            <div className="w-10 h-10 bg-[#d4ab71]/20 text-[#a3793e] rounded-2xl flex items-center justify-center mx-auto mb-2">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">معتمد</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">بإشراف بطاقة ريادة[cite: 5]</p>
          </div>

          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-center space-y-1">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">11 محافظة</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">توصيل آمن وسريع[cite: 5]</p>
          </div>

          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-xs text-center space-y-1">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">0% فوائد</span>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">تسهيلات بنك التنمية[cite: 5]</p>
          </div>
        </div>
      </section>

      {/* 4. المنتجات الوطنية المميزة في السوق */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2a768e] dark:text-[#ebd0a3] mb-1">
              <Store className="w-4 h-4" />
              <span>السوق الرقمي الوطني</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              أحدث المنتجات والمشاريع المسجلة
            </h2>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2a768e] hover:text-[#1b4d5e] dark:text-[#ebd0a3] transition cursor-pointer"
          >
            <span>استعراض كل منتجات السوق</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* شبكة بطاقات المنتجات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            const sellerTitle =
              product.seller?.name ||
              (product as any).sellerName ||
              'متجر عماني معتمد';

            return (
              <div
                key={product.id}
                className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-48 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-[#1b4d5e]/90 text-[#ebd0a3] text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs">
                    {product.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {sellerTitle}
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 group-hover:text-[#2a768e] transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">السعر</span>
                      <span className="font-black text-base text-[#1b4d5e] dark:text-[#ebd0a3]">
                        {Number(product.price || 0).toFixed(3)} ر.ع.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      className="p-2.5 bg-[#2a768e] hover:bg-[#1b4d5e] text-white rounded-xl transition shadow-xs cursor-pointer"
                      title="أضف إلى السلة"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. دعوة التسجيل لرواد الأعمال (Call to Action) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#163e4f] to-[#1b4d5e] text-white p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-white/10">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-2xl sm:text-3xl font-black">
              هل أنت صاحب مشروع أو رائد أعمال عُماني؟
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              انضم مجاناً إلى منصة مُنتجي واعرض منتجاتك لآلاف المشترين في السلطنة، واستفد من الترويج وتسهيلات المشتريات الحكومية بنسبة 10%[cite: 5].
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="shrink-0 px-8 py-4 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
          >
            سجل مشروعك كبائع معتمد ✍️
          </button>
        </div>
      </section>
    </div>
  );
};
