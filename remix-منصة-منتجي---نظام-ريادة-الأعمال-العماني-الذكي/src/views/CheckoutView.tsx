import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  User,
  Phone,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Sparkles,
  Banknote,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { OMAN_GOVERNORATES } from '../data/mockData';

interface CheckoutViewProps {
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { userProfile } = useAuth();
  const { lang, t } = useLanguage();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // خيارات الدفع المعتمدة: بوابة ثواني أو الدفع عند الاستلام
  const [paymentMethod, setPaymentMethod] = useState<'thawani' | 'cod'>('thawani');

  const [customerName, setCustomerName] = useState(userProfile?.displayName || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [governorate, setGovernorate] = useState(userProfile?.governorate || OMAN_GOVERNORATES[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const deliveryFee = cartTotal >= 25 || cartTotal === 0 ? 0 : 2.0;
  const finalTotal = cartTotal + deliveryFee;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg(
        t(
          'يرجى إدخال الاسم الكامل ورقم الهاتف العُماني وعنوان التوصيل قبل المتابعة.',
          'Please enter your full name, Omani phone number, and delivery address.'
        )
      );
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const orderId = `MNT-${Math.floor(100000 + Math.random() * 900000)}`;
      const isThawani = paymentMethod === 'thawani';

      const newOrder = {
        id: orderId,
        date: new Date().toISOString(),
        customerName: customerName.trim(),
        phone: phone.trim(),
        governorate,
        address: address.trim(),
        notes: notes.trim(),
        paymentMethod: isThawani ? 'Thawani Pay (بوابة ثواني)' : 'الدفع عند الاستلام (COD)',
        paymentStatus: isThawani ? 'مدفوع إلكترونياً عبر ثواني' : 'يُدفع نقداً عند الاستلام',
        status: 'قيد التجهيز',
        items: cartItems,
        subtotal: cartTotal,
        deliveryFee,
        total: finalTotal,
      };

      try {
        const existingOrders = JSON.parse(localStorage.getItem('montaji_orders_v1') || '[]');
        localStorage.setItem('montaji_orders_v1', JSON.stringify([newOrder, ...existingOrders]));
        localStorage.setItem('montaji_last_order', JSON.stringify(newOrder));
      } catch {
        // تجاهل أخطاء التخزين إن وجدت
      }

      clearCart();
      setIsProcessing(false);
      onNavigate('order-confirmation.html');
    }, 1100);
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-5">
        <div className="w-20 h-20 rounded-3xl bg-[#153e4d]/10 text-[#153e4d] mx-auto flex items-center justify-center">
          <ShoppingBag className="w-10 h-10 text-[#c59b5f]" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">
          {t('سلة المشتريات فارغة حالياً', 'Your Shopping Cart is Empty')}
        </h2>
        <p className="text-sm text-slate-500">
          {t(
            'أضف منتجات عُمانية إلى سلتك أولاً لإتمام الطلب.',
            'Add Omani products to your cart first to complete your order.'
          )}
        </p>
        <button
          type="button"
          onClick={() => onNavigate('marketplace.html')}
          className="px-6 py-3 bg-[#153e4d] text-[#e9cca0] rounded-2xl font-bold text-sm hover:bg-[#1f5b70] transition cursor-pointer"
        >
          {t('العودة إلى سوق المنتجات', 'Back to Marketplace')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* رأس الصفحة */}
      <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#c59b5f]/30 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#dfba83] bg-[#c59b5f]/15 px-3 py-1 rounded-full border border-[#c59b5f]/30">
            <ShieldCheck className="w-4 h-4 text-[#c59b5f]" />
            <span>{t('إتمام الطلب والدفع الآمن', 'Secure Checkout & Payment')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            {t('إتمام الطلب والدفع الوطني المعتمد', 'Checkout & Certified National Payment')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t(
              'اختر الدفع الإلكتروني عبر بوابة ثواني أو الدفع نقداً عند استلام طلبك.',
              'Choose online payment via Thawani Pay or Cash on Delivery.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#4f46e5] px-4 py-2.5 rounded-2xl border border-indigo-300/40 shadow-lg flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#dfba83]" />
            <span className="font-black text-xs sm:text-sm">Thawani Pay</span>
          </div>
          <div className="bg-emerald-600/90 px-4 py-2.5 rounded-2xl border border-emerald-400/40 shadow-lg flex items-center gap-2">
            <Banknote className="w-4 h-4 text-white" />
            <span className="font-bold text-xs sm:text-sm">{t('عند الاستلام', 'COD')}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleConfirmOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* العمود الأيمن: بيانات التوصيل + اختيار وسيلة الدفع */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. بيانات التوصيل */}
          <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#c59b5f]" />
              <span>{t('بيانات المستلم وعنوان التوصيل', 'Recipient & Delivery Details')}</span>
            </h2>

            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('الاسم الكامل *', 'Full Name *')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('أدخل اسمك الكامل', 'Enter full name')}
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden focus:border-[#1f5b70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('رقم الهاتف العُماني *', 'Omani Phone Number *')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9XXXXXXX"
                    className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm text-start focus:outline-hidden focus:border-[#1f5b70]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('المحافظة *', 'Governorate *')}
                </label>
                <select
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden focus:border-[#1f5b70]"
                >
                  {OMAN_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('الولاية / المنطقة / رقم المنزل *', 'Wilayat / Area / House No. *')}
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t('مثال: السيب - المعبيلة الجنوبية', 'e.g., Seeb - Al Maabilah')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden focus:border-[#1f5b70]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('ملاحظات إضافية للتوصيل (اختياري)', 'Delivery Notes (Optional)')}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={t('أي تعليمات لمندوب التوصيل...', 'Any instructions for courier...')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden focus:border-[#1f5b70]"
              />
            </div>
          </div>

          {/* 2. اختيار وسيلة الدفع: بوابة ثواني أو الدفع عند الاستلام */}
          <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#4f46e5]" />
              <span>{t('اختر وسيلة الدفع', 'Select Payment Method')}</span>
            </h2>

            <div className="space-y-3">
              {/* الخيار الأول: بوابة ثواني */}
              <button
                type="button"
                onClick={() => setPaymentMethod('thawani')}
                className={`w-full p-4 rounded-2xl border-2 text-start transition-all flex items-center justify-between gap-4 cursor-pointer ${
                  paymentMethod === 'thawani'
                    ? 'border-[#4f46e5] bg-[#4f46e5]/5 dark:bg-[#4f46e5]/15'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#4f46e5] text-white font-black flex flex-col items-center justify-center shadow-sm shrink-0">
                    <span className="text-[11px] leading-none">Thawani</span>
                    <span className="text-[10px] text-indigo-200 mt-0.5">ثواني</span>
                  </div>
                  <div>
                    <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{t('الدفع الإلكتروني عبر بوابة ثواني (Thawani Pay)', 'Pay Online via Thawani Pay')}</span>
                      {paymentMethod === 'thawani' && (
                        <CheckCircle2 className="w-4 h-4 text-[#4f46e5] shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t(
                        'دفع آمن ومباشر بالبطاقات البنكية العُمانية والدولية عبر بوابة ثواني.',
                        'Secure card payment via CBO-licensed Thawani gateway.'
                      )}
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'thawani'}
                  onChange={() => setPaymentMethod('thawani')}
                  className="w-5 h-5 accent-[#4f46e5] shrink-0"
                />
              </button>

              {/* الخيار الثاني: الدفع عند الاستلام */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`w-full p-4 rounded-2xl border-2 text-start transition-all flex items-center justify-between gap-4 cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-500/5 dark:bg-emerald-500/15'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center shadow-sm shrink-0">
                    <Banknote className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{t('الدفع نقداً عند الاستلام (Cash on Delivery)', 'Cash on Delivery (COD)')}</span>
                      {paymentMethod === 'cod' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {t(
                        'ادفع قيمة الطلب نقداً بالريال العُماني لمندوب التوصيل عند استلام طلبك.',
                        'Pay in cash (OMR) to the delivery courier upon receiving your order.'
                      )}
                    </p>
                  </div>
                </div>

                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="w-5 h-5 accent-emerald-600 shrink-0"
                />
              </button>
            </div>
          </div>
        </div>

        {/* العمود الأيسر: ملخص الطلب */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-5 sticky top-24">
            <h2 className="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              {t('ملخص الطلب', 'Order Summary')}
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pe-1">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 dark:border-slate-800/70 pb-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-11 h-11 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">
                        {item.product.title}
                      </div>
                      <div className="text-slate-500">
                        {t('الكمية:', 'Qty:')} {item.quantity} × {item.product.price.toFixed(3)} {t('ر.ع.', 'OMR')}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-900 dark:text-white shrink-0">
                    {(item.product.price * item.quantity).toFixed(3)} {t('ر.ع.', 'OMR')}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                <span className="font-bold">
                  {cartTotal.toFixed(3)} {t('ر.ع.', 'OMR')}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('رسوم التوصيل', 'Delivery Fee')}</span>
                <span className="font-bold text-emerald-600">
                  {deliveryFee === 0
                    ? t('مجاني (للطلبات فوق 25 ر.ع.)', 'Free (Orders over 25 OMR)')
                    : `${deliveryFee.toFixed(3)} ${t('ر.ع.', 'OMR')}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>{t('الإجمالي المستحق', 'Total Amount Due')}</span>
                <span className="text-[#153e4d] dark:text-[#dfba83] text-xl">
                  {finalTotal.toFixed(3)} {t('ر.ع.', 'OMR')}
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-2xl disabled:opacity-60 text-white font-black text-sm sm:text-base shadow-lg flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                paymentMethod === 'thawani'
                  ? 'bg-[#4f46e5] hover:bg-[#4338ca] shadow-indigo-500/25'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/25'
              }`}
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>
                    {paymentMethod === 'thawani'
                      ? t('جاري التحويل إلى بوابة ثواني...', 'Redirecting to Thawani Pay...')
                      : t('جاري تأكيد الطلب...', 'Confirming Order...')}
                  </span>
                </>
              ) : (
                <>
                  {paymentMethod === 'thawani' ? (
                    <Lock className="w-4 h-4 text-[#dfba83]" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  )}
                  <span>
                    {paymentMethod === 'thawani'
                      ? t('المتابعة للدفع عبر بوابة ثواني', 'Proceed to Pay with Thawani')
                      : t('تأكيد الطلب (الدفع عند الاستلام)', 'Confirm Order (Cash on Delivery)')}
                  </span>
                  <ArrowIcon className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-center text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {paymentMethod === 'thawani'
                  ? t('معاملة محمية ومشفرة بالكامل عبر ثواني', '100% Protected & Encrypted via Thawani')
                  : t('توصيل مضمون لجميع محافظات سلطنة عُمان', 'Guaranteed delivery across all Oman Governorates')}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
