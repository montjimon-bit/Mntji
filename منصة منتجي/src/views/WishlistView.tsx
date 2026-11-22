import React, { useState } from 'react';
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  X,
  CreditCard,
  Truck,
} from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { Product } from '../data/mockData';

interface WishlistViewProps {
  onNavigate: (view: string) => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ onNavigate }) => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addAllSuccess, setAddAllSuccess] = useState(false);

  const totalValue = wishlist.reduce((acc, curr) => acc + curr.price, 0);

  const handleAddAllToCart = () => {
    wishlist.forEach((prod) => addToCart(prod, 1));
    setAddAllSuccess(true);
    setTimeout(() => setAddAllSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-[#c59b5f]/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#c59b5f]/25 border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-bold text-[#dfba83]">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>حسابي • قائمة الأمنيات والمفضلة</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            قائمة أمنياتي والمنتجات المحفوظة
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            احفظ منتجاتك المفضلة من سوق الحرفيين والمزارعين والأسر المنتجة في سلطنة عُمان، وقارن بينها وأضفها لسلة مشترياتك وقتما تشاء بنقرة واحدة.
          </p>
        </div>
      </div>

      {/* Action and Summary Bar */}
      {wishlist.length > 0 && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-sm font-bold text-slate-800">
                لديك <strong className="text-rose-600 font-black">{wishlist.length}</strong> منتجات في قائمة الأمنيات
              </span>
            </div>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <div className="text-xs text-slate-600">
              القيمة التقديرية: <strong className="text-[#153e4d] font-black">{totalValue.toFixed(1)} ر.ع.</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleAddAllToCart}
              className="px-4 py-2 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
              <span>إضافة الكل إلى السلة</span>
            </button>

            <button
              onClick={clearWishlist}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>إفراغ القائمة</span>
            </button>
          </div>
        </div>
      )}

      {/* Added all success alert */}
      {addAllSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>تمت إضافة جميع منتجات قائمة أمنياتك إلى سلة التسوق بنجاح!</span>
          </div>
          <button
            onClick={() => onNavigate('cart.html')}
            className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer text-xs"
          >
            الانتقال للسلة ↗
          </button>
        </div>
      )}

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-slate-200/90 shadow-sm space-y-4 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-500 border border-rose-200 flex items-center justify-center mx-auto shadow-inner">
            <Heart className="w-10 h-10" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            قائمة أمنياتك فارغة حالياً
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            استكشف سوق المنتجات العمانية الفاخرة والأسر المنتجة، واضغط على أيقونة القلب ❤️ لحفظ منتجاتك المفضلة هنا والرجوع إليها أو شرائها لاحقاً.
          </p>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('marketplace.html')}
              className="px-6 py-3 bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] font-bold text-xs sm:text-sm rounded-2xl shadow-lg transition-all transform hover:scale-105 cursor-pointer inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
              <span>تصفح سوق المنتجات العمانية الآن</span>
            </button>
          </div>
        </div>
      ) : (
        /* Wishlist Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Remove from wishlist button */}
                  <button
                    type="button"
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 left-3 p-2 rounded-xl bg-white/90 hover:bg-rose-50 text-rose-600 backdrop-blur-xs transition-colors shadow-md cursor-pointer"
                    title="إزالة من قائمة الأمنيات"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                  </button>

                  {/* Governorate Badge */}
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{product.governorate}</span>
                  </span>
                </div>

                {/* Product Content */}
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="text-[11px] bg-slate-100 px-2 py-0.5 rounded font-medium">
                      {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.seller.rating}</span>
                    </div>
                  </div>

                  <h3
                    onClick={() => setSelectedProduct(product)}
                    className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-[#153e4d] cursor-pointer transition-colors"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-600 font-medium">
                      {product.seller.isRiyadaCertified && (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200">
                          ريادة ✓
                        </span>
                      )}
                      <span className="truncate max-w-[120px]">{product.seller.name}</span>
                    </div>

                    <span className="text-[11px] text-emerald-600 font-bold">
                      متوفر ({product.stock})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Add to Cart Action */}
              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">السعر</span>
                  <div className="text-base font-black text-[#153e4d]">
                    {product.price.toFixed(1)} <span className="text-xs font-bold">ر.ع.</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => addToCart(product, 1)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#c59b5f]" />
                  <span>أضف للسلة</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Product Quick Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 my-8">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-right">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs bg-[#1f5b70]/10 text-[#1f5b70] font-bold px-2.5 py-1 rounded-md">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-xl font-black text-slate-900 mt-2">
                    {selectedProduct.title}
                  </h2>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#c59b5f]" />
                    {selectedProduct.governorate}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {selectedProduct.seller.rating}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">التاجر / الأسرة المنتجة:</span>
                    <span className="font-bold text-slate-900">{selectedProduct.seller.name}</span>
                  </div>
                  {selectedProduct.seller.isRiyadaCertified && (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold pt-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>حامل بطاقة ريادة ومعتمد رسمياً</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">السعر شامل الضريبة</span>
                    <span className="text-2xl font-black text-[#153e4d]">
                      {selectedProduct.price.toFixed(1)} <span className="text-sm">ر.ع.</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="px-5 py-2.5 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
                    <span>أضف إلى السلة</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
