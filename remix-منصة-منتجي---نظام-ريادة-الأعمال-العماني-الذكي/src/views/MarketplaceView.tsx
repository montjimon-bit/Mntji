import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ShoppingBag,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  MapPin,
  ChevronDown,
  Info,
  Heart,
  MessageSquarePlus,
  ChevronLeft,
  Store,
  Award,
} from 'lucide-react';
import { PRODUCTS_DATA, Product, OMAN_GOVERNORATES } from '../data/mockData';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductReviewsSection } from '../components/ProductReviewsSection';

interface MarketplaceViewProps {
  onNavigate: (view: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onNavigate }) => {
  const { products, addToCart, cartCount, orders } = useCart();
  const { isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const [searchQuery, setSearchQuery] = useState(() => {
    return sessionStorage.getItem('montaji_search_query') || '';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('الكل');
  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('الكل');
  const [onlyRiyada, setOnlyRiyada] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState<string | null>(null);
  const [ratingsMap, setRatingsMap] = useState<Record<string, { avg: number; count: number }>>({});
  const [reviewInitialRating, setReviewInitialRating] = useState<number>(5);
  const [autoOpenReviewForm, setAutoOpenReviewForm] = useState<boolean>(false);

  const openProductReview = (product: Product, initialRating = 5, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setReviewInitialRating(initialRating);
    setAutoOpenReviewForm(true);
    setSelectedProduct(product);
    setDetailQuantity(1);
  };

  const subCategoriesByCategory: Record<string, string[]> = {
    'الكل': [
      'منتجات عضوية وزيوت طبيعية',
      'أعمال حرفية معاصرة',
      'معدات تقنية وأنظمة ذكية',
      'اللبان الظفاري والبخور الملكي',
      'عسل عماني مفحوص',
      'الحلوى العمانية والتمور',
    ],
    'منتجات عطرية وتراثية': [
      'اللبان الظفاري والبخور الملكي',
    ],
    'أغذية ومنتجات طبيعية': [
      'منتجات عضوية وزيوت طبيعية',
      'عسل عماني مفحوص',
      'الحلوى العمانية والتمور',
    ],
    'حرف وفنون يدوية': [
      'أعمال حرفية معاصرة',
    ],
    'تقنية وابتكار': [
      'معدات تقنية وأنظمة ذكية',
    ],
  };

  const handleRatingUpdated = (productId: string, avg: number, count: number) => {
    setRatingsMap((prev) => ({
      ...prev,
      [productId]: { avg, count },
    }));
  };

  // Sync with persistent search bar from Navbar
  useEffect(() => {
    // Check initial sessionStorage query
    const initialQuery = sessionStorage.getItem('montaji_search_query');
    if (initialQuery) {
      setSearchQuery(initialQuery);
      sessionStorage.removeItem('montaji_search_query');
    }

    const handleCustomSearch = (e: any) => {
      if (e.detail?.query !== undefined) {
        setSearchQuery(e.detail.query);
      }
      if (e.detail?.productId) {
        const found = products.find((p) => p.id === e.detail.productId);
        if (found) {
          setSelectedProduct(found);
          setDetailQuantity(1);
        }
      }
    };

    window.addEventListener('montaji-search', handleCustomSearch);
    return () => window.removeEventListener('montaji-search', handleCustomSearch);
  }, [products]);

  const categories = [
    'الكل',
    'منتجات عطرية وتراثية',
    'أغذية ومنتجات طبيعية',
    'حرف وفنون يدوية',
    'تقنية وابتكار',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.seller.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'الكل' || product.category === selectedCategory;

      const matchSubCategory =
        selectedSubCategory === 'الكل' || product.subCategory === selectedSubCategory;

      const matchGovernorate =
        selectedGovernorate === 'الكل' || product.governorate === selectedGovernorate;

      const matchRiyada = !onlyRiyada || product.seller.isRiyadaCertified;

      return matchSearch && matchCategory && matchSubCategory && matchGovernorate && matchRiyada;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.seller.rating - a.seller.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [searchQuery, selectedCategory, selectedSubCategory, selectedGovernorate, onlyRiyada, sortBy]);

  const handleAddToCart = (product: Product, quantity = 1, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(product, quantity);
    setAddedToast(product.title);
    setTimeout(() => setAddedToast(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {addedToast && (
        <div className="fixed bottom-24 right-6 z-50 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-sm font-semibold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#c59b5f]" />
          <span>تمت إضافة "{addedToast}" إلى السلة بنجاح!</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#0f242e] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-[#1f5b70]/40">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#c59b5f]/20 border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-bold text-[#dfba83]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>السوق الوطني الموحد للمنتجات العمانية</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black">
            تسوق إبداعات رواد الأعمال العمانيين
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            منتجات عمانية أصيلة وابتكارات تقنية حديثة من مشاريع معتمدة ومسجلة في ريادة من كافة محافظات السلطنة، مع توصيل سريع وموثوق ودعم لكافة المحافظ الرقمية.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن منتج وطني، صانع، أو نوع الحرفة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] pr-10 text-right"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Governorate Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedGovernorate}
              onChange={(e) => setSelectedGovernorate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] cursor-pointer text-right"
            >
              <option value="الكل">كل المحافظات (عُمان)</option>
              {OMAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSubCategory}
              onChange={(e) => setSelectedSubCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] cursor-pointer text-right"
            >
              <option value="الكل">كل التصنيفات الفرعية</option>
              {(subCategoriesByCategory[selectedCategory] || subCategoriesByCategory['الكل']).map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#1f5b70] cursor-pointer text-right"
            >
              <option value="featured">الترتيب: المميز</option>
              <option value="price-asc">السعر: تصاعدي</option>
              <option value="price-desc">السعر: تنازلي</option>
              <option value="rating">الأعلى تقييماً</option>
            </select>
          </div>
        </div>

        {/* Categories Bar and Riyada Checkbox */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSelectedSubCategory('الكل');
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyRiyada}
              onChange={(e) => setOnlyRiyada(e.target.checked)}
              className="w-4 h-4 rounded text-[#1f5b70] focus:ring-[#1f5b70] border-slate-300"
            />
            <span className="flex items-center gap-1 text-[#153e4d]">
              <ShieldCheck className="w-4 h-4 text-[#c59b5f]" />
              حاملو بطاقة ريادة فقط
            </span>
          </label>
        </div>
      </div>

      {/* Results Count & Cart quick trigger */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          تم العثور على <span className="font-bold text-slate-900">{filteredProducts.length}</span> منتج
        </div>
        {cartCount > 0 && (
          <button
            onClick={() => onNavigate('cart.html')}
            className="flex items-center gap-1.5 text-[#1f5b70] font-bold hover:underline cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
            <span>عرض السلة ({cartCount} عناصر)</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg">لم يتم العثور على منتجات مطابقة</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            جرب تغيير معايير البحث أو تصفية المحافظات لاستعراض منتجات أخرى من رواد الأعمال العمانيين.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('الكل');
              setSelectedSubCategory('الكل');
              setSelectedGovernorate('الكل');
              setOnlyRiyada(false);
            }}
            className="px-4 py-2 bg-[#1f5b70]/10 text-[#1f5b70] font-bold rounded-xl text-xs hover:bg-[#1f5b70]/20 transition-colors"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const hasPurchased = orders.some((o) => o.items && o.items.some((it) => it.id === product.id));
            const ratingAvg = ratingsMap[product.id]?.avg ?? product.seller.rating;
            const ratingCount =
              ratingsMap[product.id]?.count ??
              (product.id === 'prod-1' ? 3 : product.id === 'prod-2' || product.id === 'prod-3' ? 2 : 1);

            return (
              <div
                key={product.id}
                onClick={() => {
                  setSelectedProduct(product);
                  setDetailQuantity(1);
                  setAutoOpenReviewForm(false);
                }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Wishlist Toggle Button */}
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
                        className={`w-4 h-4 transition-transform ${
                          isInWishlist(product.id) ? 'fill-white text-white' : ''
                        }`}
                      />
                    </button>

                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 px-2 py-0.5 rounded-lg shadow-xs">
                      {product.governorate}
                    </span>
                    {product.seller.isRiyadaCertified && (
                      <span className="absolute bottom-3 right-3 bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/40 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#c59b5f]" />
                        ريادة
                      </span>
                    )}
                    {hasPurchased && (
                      <span className="absolute bottom-3 left-3 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                        مشتري مؤكد
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[#1f5b70]">{product.category}</span>
                      {product.subCategory && (
                        <>
                          <span className="text-slate-300 text-[10px]">•</span>
                          <span className="text-[10px] bg-amber-50 text-[#c59b5f] border border-[#c59b5f]/30 px-1.5 py-0.5 rounded-md font-bold">
                            {product.subCategory}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-[#1f5b70] transition-colors leading-snug">
                      {product.title}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery(product.seller.name);
                        }}
                        className="flex items-center gap-1 text-[11px] text-[#1f5b70] hover:text-[#153e4d] font-bold truncate max-w-[140px] cursor-pointer hover:underline"
                        title={`عرض المنتجات ذات الصلة: ${product.seller.name}`}
                      >
                        <Award className="w-3 h-3 text-[#c59b5f] shrink-0" />
                        <span className="truncate">{product.seller.name}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => openProductReview(product, 5, e)}
                        className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200/60 transition cursor-pointer"
                        title="عرض تقييمات العملاء"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{ratingAvg}</span>
                        <span className="text-[10px] text-slate-400">({ratingCount})</span>
                      </button>
                    </div>

                    {/* In-Card Interactive Star Rating System & Review Prompt */}
                    <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/70 space-y-1.5 mt-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-600 font-bold flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span>تقييم النجوم:</span>
                        </span>
                        {hasPurchased ? (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>مشتري مؤكد</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => openProductReview(product, 5, e)}
                            className="text-[#1f5b70] hover:text-[#153e4d] font-bold hover:underline flex items-center gap-0.5 cursor-pointer text-[11px]"
                          >
                            <span>{ratingCount} مراجعات</span>
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                        )}
                      </div>

                      {/* 5 Interactive Star Buttons directly on product card */}
                      <div className="flex items-center justify-between gap-1 pt-0.5">
                        <div className="flex items-center gap-1" title="انقر لتحديد تقييمك بالنجوم وكتابة مراجعة سريعة">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={(e) => openProductReview(product, star, e)}
                              className="p-0.5 rounded hover:scale-125 transition-transform cursor-pointer"
                              title={`تقييم ${star} نجوم للمنتج`}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= Math.round(ratingAvg)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-300 hover:text-amber-400'
                                }`}
                              />
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => openProductReview(product, 5, e)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[#1f5b70] hover:bg-[#1f5b70] hover:text-white text-[11px] font-bold shadow-2xs transition cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3 h-3 text-[#c59b5f]" />
                          <span>{hasPurchased ? 'قيّم طلبك' : 'اكتب مراجعة'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-slate-900">
                      {product.price.toFixed(3)}
                    </span>
                    <span className="text-xs text-slate-500 font-bold mr-1">ر.ع.</span>
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(product, 1, e)}
                    className="px-3.5 py-2 bg-[#1f5b70]/10 text-[#1f5b70] hover:bg-[#1f5b70] hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>أضف للسلة</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Product Details Modal with Rating & Reviews */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 my-8 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="sticky top-0 float-left text-slate-400 hover:text-slate-700 p-2 rounded-full hover:bg-slate-100 cursor-pointer z-20 bg-white/90 backdrop-blur-xs shadow-xs"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              <div className="sm:col-span-5 aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="sm:col-span-7 space-y-4 text-right">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs bg-[#1f5b70]/10 text-[#1f5b70] font-bold px-2.5 py-1 rounded-md">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {selectedProduct.governorate}
                  </span>
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{ratingsMap[selectedProduct.id]?.avg ?? selectedProduct.seller.rating}</span>
                    <span className="text-[11px] text-amber-600 font-normal">
                      ({ratingsMap[selectedProduct.id]?.count ?? 3} تقييم مشتري)
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {selectedProduct.title}
                </h2>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedProduct.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="font-semibold">المؤسسة / البائع:</span>
                    <span className="font-bold text-slate-800">{selectedProduct.seller.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">الاعتماد:</span>
                    <span className="text-[#1f5b70] font-bold">
                      {selectedProduct.seller.isRiyadaCertified
                        ? 'حامل بطاقة ريادة معتمد 🇴🇲'
                        : 'مشروع عماني قيد التسجيل'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">المخزون المتوفر:</span>
                    <span className="text-slate-800">{selectedProduct.stock} قطعة</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs text-slate-400">السعر الإجمالي</div>
                    <div className="text-2xl font-black text-slate-900">
                      {(selectedProduct.price * detailQuantity).toFixed(3)}{' '}
                      <span className="text-xs font-bold text-slate-500">ر.ع.</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleWishlist(selectedProduct)}
                      className={`p-3 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-bold ${
                        isInWishlist(selectedProduct.id)
                          ? 'bg-rose-50 border-rose-300 text-rose-600'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-rose-600'
                      }`}
                      title={isInWishlist(selectedProduct.id) ? 'إزالة من قائمة أمنياتي' : 'حفظ في قائمة أمنياتي'}
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isInWishlist(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span className="hidden sm:inline">
                        {isInWishlist(selectedProduct.id) ? 'في المفضلة' : 'حفظ بالمفضلة'}
                      </span>
                    </button>

                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                      <button
                        onClick={() => setDetailQuantity(Math.max(1, detailQuantity - 1))}
                        className="px-2 text-slate-600 font-bold hover:text-slate-900"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-sm text-slate-800">
                        {detailQuantity}
                      </span>
                      <button
                        onClick={() =>
                          setDetailQuantity(Math.min(selectedProduct.stock, detailQuantity + 1))
                        }
                        className="px-2 text-slate-600 font-bold hover:text-slate-900"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct, detailQuantity);
                        setSelectedProduct(null);
                      }}
                      className="px-5 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] border border-[#c59b5f]/40 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
                      <span>إضافة للسلة</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Embedded Product Reviews & Ratings Section */}
            <ProductReviewsSection
              product={selectedProduct}
              initialRating={reviewInitialRating}
              autoOpenForm={autoOpenReviewForm}
              onRatingUpdated={(avg, count) => handleRatingUpdated(selectedProduct.id, avg, count)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
