import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartViewProps {
  onNavigate: (view: string) => void;
}

export const CartView: React.FC<CartViewProps> = ({ onNavigate }) => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponToast, setCouponToast] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponToast(res);
    setTimeout(() => setCouponToast(null), 3500);
    if (res.success) setInputCoupon('');
  };

  const freeShippingThreshold = 30;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - (subtotal - discount));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-[#008450]" />
            <span>سلة المشتريات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            جميع المنتجات تدعم رواد الأعمال العمانيين بصورة مباشرة
          </p>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>إفراغ السلة</span>
          </button>
        )}
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-[#008450] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-slate-900">سلة التسوق فارغة حالياً</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            لم تقم بإضافة أي من منتجات رواد الأعمال العمانيين بعد. تصفح السوق واكتشف تشكيلة مميزة من المنتجات العمانية الفاخرة.
          </p>
          <div className="pt-2">
            <button
              onClick={() => onNavigate('marketplace.html')}
              className="px-6 py-3 bg-[#008450] hover:bg-[#00683f] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>تصفح سوق المنتجات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Cart Items and Summary Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <Truck className="w-5 h-5 text-[#008450] shrink-0" />
              <div className="text-xs text-emerald-900 flex-1">
                {remainingForFreeShipping > 0 ? (
                  <span>
                    أضف منتجات بقيمة{' '}
                    <strong className="font-bold">{remainingForFreeShipping.toFixed(3)} ر.ع.</strong>{' '}
                    إضافية للحصول على <strong className="text-[#008450]">شحن مجاني</strong> لكافة محافظات السلطنة!
                  </span>
                ) : (
                  <span className="font-bold text-[#008450]">
                    تهانينا! طلبيتك مؤهلة للشحن المجاني داخل سلطنة عمان 🇴🇲
                  </span>
                )}
              </div>
            </div>

            {/* Items List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-100 shrink-0"
                    />
                    <div className="space-y-1">
                      <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                        {product.title}
                      </h3>
                      <div className="text-xs text-slate-500">
                        البائع: {product.seller.name}
                      </div>
                      <div className="text-sm font-black text-slate-900 pt-0.5">
                        {product.price.toFixed(3)} <span className="text-xs text-slate-500">ر.ع.</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 px-2 py-1">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="px-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                        aria-label="تقليل الكمية"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-xs text-slate-800">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="px-2 text-slate-600 font-bold hover:text-slate-900 cursor-pointer"
                        aria-label="زيادة الكمية"
                      >
                        +
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="text-left font-black text-slate-900 text-sm min-w-[70px]">
                      {(product.price * quantity).toFixed(3)}{' '}
                      <span className="text-[10px] text-slate-500">ر.ع.</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Back to marketplace */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onNavigate('marketplace.html')}
                className="text-xs font-bold text-slate-600 hover:text-[#008450] flex items-center gap-1 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>متابعة التسوق وإضافة منتجات أخرى</span>
              </button>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
            <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">
              ملخص الطلب والدفع
            </h2>

            {/* Coupon Box */}
            <div>
              <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    placeholder="كود الخصم (OMAN2040)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                    dir="ltr"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  تطبيق
                </button>
              </form>

              {couponToast && (
                <div
                  className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-1.5 ${
                    couponToast.success
                      ? 'bg-emerald-50 text-emerald-800'
                      : 'bg-rose-50 text-rose-800'
                  }`}
                >
                  {couponToast.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span>{couponToast.message}</span>
                </div>
              )}

              {couponCode && (
                <div className="mt-2 flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900">
                  <span>
                    القسيمة النشطة: <strong>{couponCode}</strong> ({couponDiscountPercent}% خصم)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-rose-600 hover:underline text-[11px] font-bold cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              )}
            </div>

            {/* Financial Details */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-900">{subtotal.toFixed(3)} ر.ع.</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>قيمة الخصم ({couponDiscountPercent}%):</span>
                  <span>- {discount.toFixed(3)} ر.ع.</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>رسوم التوصيل المحلي:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#008450] font-bold">مجاني</span>
                  ) : (
                    `${shippingFee.toFixed(3)} ر.ع.`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (VAT 5%):</span>
                <span>{tax.toFixed(3)} ر.ع.</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm">
                <span className="font-black text-slate-900 text-base">المجموع الكلي:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#008450]">{total.toFixed(3)}</span>{' '}
                  <span className="text-xs font-bold text-slate-600">ريال عماني</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="pt-2">
              <button
                onClick={() => onNavigate('checkout.html')}
                className="w-full py-3.5 bg-gradient-to-r from-[#008450] to-[#059669] hover:from-[#00683f] hover:to-[#047857] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>الانتقال لإتمام الطلب والدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>دفع إلكتروني آمن ومشفر بنسبة 100%</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
