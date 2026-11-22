import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { PLATFORM_CONFIG } from '../config/platformConfig';

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
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { lang, t } = useLanguage();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const currencyLabel = lang === 'ar' ? PLATFORM_CONFIG.currencyAr : PLATFORM_CONFIG.currencyEn;
  const vatPercent = Math.round(PLATFORM_CONFIG.vatRate * 100);

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const result = applyCoupon(couponInput);
    setCouponFeedback(result);
    if (result.success) {
      setCouponInput('');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#153e4d]/10 text-[#153e4d] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[#c59b5f]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('سلة المشتريات فارغة حالياً', 'Your Shopping Cart is Empty')}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          {t(
            'تصفح المنتجات العُمانية الأصيلة من رواد الأعمال وأضف ما يعجبك إلى السلة.',
            'Browse authentic Omani products from local entrepreneurs and add items to your cart.'
          )}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('marketplace.html')}
          className="px-6 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#e9cca0] rounded-2xl font-bold text-sm transition cursor-pointer"
        >
          {t('تصفح سوق المنتجات العُمانية', 'Explore Omani Marketplace')}
        </button>
      </div>
    );
  }

  const remainingForFreeShipping = Math.max(
    0,
    PLATFORM_CONFIG.freeShippingThreshold - Math.max(0, subtotal - discount)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* رأس الصفحة */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('سلة المشتريات', 'Shopping Cart')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              `لديك ${items.reduce((s, i) => s + i.quantity, 0)} قطع في سلة التسوق`,
              `You have ${items.reduce((s, i) => s + i.quantity, 0)} items in your cart`
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{t('إفراغ السلة', 'Clear Cart')}</span>
        </button>
      </div>

      {/* شريط الشحن المجاني */}
      <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">
        <Truck className="w-5 h-5 text-emerald-600 shrink-0" />
        {remainingForFreeShipping === 0 ? (
          <span className="font-bold">
            {t(
              'مبروك! طلبك مؤهل للحصول على توصيل مجاني بالكامل لجميع المحافظات 🎉',
              'Congratulations! Your order qualifies for 100% FREE delivery 🎉'
            )}
          </span>
        ) : (
          <span>
            {t(
              `أضف منتجات بقيمة ${remainingForFreeShipping.toFixed(3)} ${currencyLabel} إضافية للحصول على توصيل مجاني!`,
              `Add ${remainingForFreeShipping.toFixed(3)} ${currencyLabel} more to unlock FREE delivery!`
            )}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* قائمة المنتجات في السلة */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => {
            const maxStock = Number(item.product.stock) || 0;
            const atMaxStock = item.quantity >= maxStock;

            return (
              <div
                key={item.product.id}
                className="bg-white dark:bg-[#0d232d] rounded-3xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-slate-100"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#1f5b70] bg-[#153e4d]/10 px-2 py-0.5 rounded-full">
                      {item.product.category}
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white truncate">
                      {item.product.title}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {t('سعر الوحدة:', 'Unit Price:')}{' '}
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {item.product.price.toFixed(3)} {currencyLabel}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold text-emerald-700">
                      {t(`المخزون المتوفر: ${maxStock} قطعة`, `Available Stock: ${maxStock}`)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  {/* أزرار التحكم بالكمية مع قفل المخزون */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-white flex items-center justify-center shadow-2xs cursor-pointer"
                        title={t('تقليل الكمية', 'Decrease quantity')}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-7 text-center font-mono font-black text-xs text-slate-900 dark:text-white">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        disabled={atMaxStock}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 dark:text-white flex items-center justify-center shadow-2xs cursor-pointer"
                        title={
                          atMaxStock
                            ? t('وصلت للحد الأقصى المتوفر في المخزون', 'Max available stock reached')
                            : t('زيادة الكمية', 'Increase quantity')
                        }
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {atMaxStock && (
                      <span className="text-[10px] text-amber-600 font-bold">
                        {t('الحد الأقصى', 'Max stock')}
                      </span>
                    )}
                  </div>

                  {/* المجموع الفرعي للمنتج */}
                  <div className="text-end min-w-[85px]">
                    <div className="font-mono font-black text-sm text-[#153e4d] dark:text-[#dfba83]">
                      {(item.product.price * item.quantity).toFixed(3)} {currencyLabel}
                    </div>
                  </div>

                  {/* زر الحذف */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition cursor-pointer"
                    title={t('حذف من السلة', 'Remove item')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ملخص الفاتورة والقسيمة */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-5 sticky top-24">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {t('ملخص السلة والفاتورة', 'Cart & Invoice Summary')}
            </h2>

            {/* قسيمة الخصم */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>{t('هل لديك رمز قسيمة خصم؟', 'Have a promo code?')}</span>
              </label>

              {couponCode ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{couponCode}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      removeCoupon();
                      setCouponFeedback(null);
                    }}
                    className="text-rose-600 font-bold hover:underline cursor-pointer"
                  >
                    {t('إزالة', 'Remove')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="OMAN2040 / MONTAJI15"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-xs font-mono uppercase focus:outline-hidden focus:border-[#1f5b70]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#153e4d] text-[#dfba83] rounded-xl text-xs font-black hover:bg-[#1f5b70] transition cursor-pointer"
                  >
                    {t('تطبيق', 'Apply')}
                  </button>
                </form>
              )}

              {couponFeedback && (
                <p
                  className={`text-[11px] font-bold flex items-center gap-1 ${
                    couponFeedback.success ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{couponFeedback.message}</span>
                </p>
              )}
            </div>

            {/* تفاصيل المبالغ */}
            <div className="space-y-2.5 text-sm pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                <span className="font-mono font-bold">
                  {subtotal.toFixed(3)} {currencyLabel}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t('الخصم المطبق', 'Discount')}</span>
                  <span className="font-mono font-bold">
                    -{discount.toFixed(3)} {currencyLabel}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('رسوم التوصيل', 'Delivery Fee')}</span>
                <span className="font-mono font-bold text-emerald-600">
                  {shippingFee === 0
                    ? t('مجاني', 'Free')
                    : `${shippingFee.toFixed(3)} ${currencyLabel}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t(`ضريبة القيمة المضافة (${vatPercent}%)`, `VAT (${vatPercent}%)`)}</span>
                <span className="font-mono font-bold">
                  {tax.toFixed(3)} {currencyLabel}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>{t('الإجمالي الكلي', 'Total')}</span>
                <span className="font-mono text-xl text-[#153e4d] dark:text-[#dfba83]">
                  {total.toFixed(3)} {currencyLabel}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('checkout.html')}
              className="w-full py-4 px-6 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-2xl text-sm shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <span>{t('المتابعة لإتمام الطلب والدفع', 'Proceed to Checkout')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{t('دفع آمن عبر بوابة ثواني أو عند الاستلام', 'Secure payment via Thawani or COD')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};