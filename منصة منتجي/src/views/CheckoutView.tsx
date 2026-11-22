import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  MapPin,
  User,
  Phone,
  Mail,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  ShoppingBag,
  Sparkles,
  Banknote,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { OMAN_GOVERNORATES } from '../data/mockData';
import { PLATFORM_CONFIG } from '../config/platformConfig';

interface CheckoutViewProps {
  onNavigate: (view: string) => void;
}

interface FieldErrors {
  customerName?: string;
  phone?: string;
  email?: string;
  wilayat?: string;
  address?: string;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    couponCode,
    placeOrder,
  } = useCart();
  const { user, userProfile } = useAuth();
  const { lang, t } = useLanguage();

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
  const currencyLabel = lang === 'ar' ? PLATFORM_CONFIG.currencyAr : PLATFORM_CONFIG.currencyEn;
  const vatPercent = Math.round(PLATFORM_CONFIG.vatRate * 100);

  // خيارات الدفع المعتمدة: بوابة ثواني أو الدفع عند الاستلام
  const [paymentMethod, setPaymentMethod] = useState<'thawani' | 'cod'>('thawani');

  const [customerName, setCustomerName] = useState(userProfile?.displayName || user?.displayName || '');
  const [email, setEmail] = useState(userProfile?.email || user?.email || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [governorate, setGovernorate] = useState(userProfile?.governorate || OMAN_GOVERNORATES[0]);
  const [wilayat, setWilayat] = useState('');
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const normalizeOmaniPhone = (raw: string): string => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('00968')) digits = digits.slice(5);
    else if (digits.startsWith('968')) digits = digits.slice(3);
    return digits;
  };

  const handlePhoneChange = (val: string) => {
    const cleaned = normalizeOmaniPhone(val).slice(0, 8);
    setPhone(cleaned);
    if (fieldErrors.phone) {
      setFieldErrors((prev) => ({ ...prev, phone: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    const cleanName = customerName.trim();
    if (!cleanName) {
      errors.customerName = t('يرجى إدخال الاسم الكامل.', 'Please enter your full name.');
    } else if (cleanName.length < 4 || cleanName.split(/\s+/).length < 2) {
      errors.customerName = t(
        'يرجى إدخال الاسم الثنائي على الأقل (الاسم والقبيلة).',
        'Please enter at least first and last name.'
      );
    }

    const cleanPhone = normalizeOmaniPhone(phone);
    if (!cleanPhone) {
      errors.phone = t('يرجى إدخال رقم الهاتف العُماني.', 'Please enter your Omani phone number.');
    } else if (!/^[79]\d{7}$/.test(cleanPhone)) {
      errors.phone = t(
        'يجب أن يتكون رقم الهاتف العُماني من 8 أرقام ويبدأ بـ 9 أو 7 (مثال: 94842840).',
        'Omani phone number must be 8 digits starting with 9 or 7 (e.g. 94842840).'
      );
    }

    const cleanEmail = email.trim();
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail)) {
      errors.email = t(
        'صيغة البريد الإلكتروني غير صحيحة (مثال: name@gmail.com).',
        'Invalid email format (e.g. name@gmail.com).'
      );
    }

    if (!wilayat.trim() || wilayat.trim().length < 2) {
      errors.wilayat = t('يرجى كتابة اسم الولاية بشكل صحيح.', 'Please enter a valid wilayat name.');
    }

    if (!address.trim() || address.trim().length < 5) {
      errors.address = t(
        'يرجى كتابة المنطقة أو الشارع أو أقرب معلم لتسهيل التوصيل.',
        'Please enter area, street, or nearest landmark (min 5 characters).'
      );
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validateForm()) {
      setGeneralError(
        t(
          'يرجى تصحيح الحقول المحددة باللون الأحمر قبل إتمام الطلب.',
          'Please fix the highlighted fields before completing your order.'
        )
      );
      return;
    }

    setIsProcessing(true);

    try {
      await placeOrder({
        customerName: customerName.trim(),
        email: email.trim() || 'customer@montaji.om',
        phone: normalizeOmaniPhone(phone),
        governorate,
        wilayat: wilayat.trim(),
        address: address.trim(),
        paymentMethod,
      });

      setIsProcessing(false);
      onNavigate('order-confirmation.html');
    } catch {
      setIsProcessing(false);
      setGeneralError(
        t(
          'حدث خطأ غير متوقع أثناء إتمام الطلب، يرجى المحاولة مرة أخرى.',
          'An unexpected error occurred while placing your order. Please try again.'
        )
      );
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

      <form onSubmit={handleConfirmOrder} noValidate className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* العمود الأيمن: بيانات التوصيل + اختيار وسيلة الدفع */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. بيانات التوصيل */}
          <div className="bg-white dark:bg-[#0d232d] rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#c59b5f]" />
              <span>{t('بيانات المستلم وعنوان التوصيل', 'Recipient & Delivery Details')}</span>
            </h2>

            {generalError && (
              <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* الاسم الكامل */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('الاسم الكامل (الثنائي) *', 'Full Name *')}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (fieldErrors.customerName) {
                        setFieldErrors((prev) => ({ ...prev, customerName: undefined }));
                      }
                    }}
                    placeholder={t('مثال: حذيفة موسى الشيلي', 'e.g., Huthifa Moosa')}
                    className={`w-full ps-10 pe-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden ${
                      fieldErrors.customerName
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#1f5b70]'
                    }`}
                  />
                </div>
                {fieldErrors.customerName && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{fieldErrors.customerName}</p>
                )}
              </div>

              {/* رقم الهاتف العُماني */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('رقم الهاتف العُماني (8 أرقام) *', 'Omani Phone (8 digits) *')}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={8}
                    dir="ltr"
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="9XXXXXXX"
                    className={`w-full ps-10 pe-14 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/70 text-sm text-start font-mono focus:outline-hidden ${
                      fieldErrors.phone
                        ? 'border-rose-500 focus:border-rose-500'
                        : 'border-slate-200 dark:border-slate-700 focus:border-[#1f5b70]'
                    }`}
                  />
                  <span className="absolute top-2.5 end-3 text-[11px] font-mono font-bold text-slate-400">
                    +968
                  </span>
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {/* البريد الإلكتروني */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('البريد الإلكتروني (لإرسال الفاتورة)', 'Email Address (for Receipt)')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute top-3 start-3.5" />
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                  }}
                  placeholder="name@example.com"
                  className={`w-full ps-10 pe-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/70 text-sm text-start focus:outline-hidden ${
                    fieldErrors.email
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-[#1f5b70]'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* المحافظة */}
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

              {/* الولاية */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('الولاية *', 'Wilayat *')}
                </label>
                <input
                  type="text"
                  value={wilayat}
                  onChange={(e) => {
                    setWilayat(e.target.value);
                    if (fieldErrors.wilayat) {
                      setFieldErrors((prev) => ({ ...prev, wilayat: undefined }));
                    }
                  }}
                  placeholder={t('مثال: السيب، صحار، صلالة، نزوى', 'e.g., Seeb, Sohar, Salalah')}
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden ${
                    fieldErrors.wilayat
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700 focus:border-[#1f5b70]'
                  }`}
                />
                {fieldErrors.wilayat && (
                  <p className="text-[11px] text-rose-600 font-bold mt-1">{fieldErrors.wilayat}</p>
                )}
              </div>
            </div>

            {/* العنوان التفصيلي */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                {t('المنطقة / الشارع / رقم المنزل *', 'Area / Street / House No. *')}
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (fieldErrors.address) {
                    setFieldErrors((prev) => ({ ...prev, address: undefined }));
                  }
                }}
                placeholder={t('مثال: المعبيلة الجنوبية - شارع النور - منزل 42', 'e.g., Al Maabilah South, House 42')}
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/70 text-sm focus:outline-hidden ${
                  fieldErrors.address
                    ? 'border-rose-500 focus:border-rose-500'
                    : 'border-slate-200 dark:border-slate-700 focus:border-[#1f5b70]'
                }`}
              />
              {fieldErrors.address && (
                <p className="text-[11px] text-rose-600 font-bold mt-1">{fieldErrors.address}</p>
              )}
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
              {items.map((item) => (
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
                        {t('الكمية:', 'Qty:')} {item.quantity} × {item.product.price.toFixed(3)} {currencyLabel}
                      </div>
                    </div>
                  </div>
                  <div className="font-black text-slate-900 dark:text-white shrink-0">
                    {(item.product.price * item.quantity).toFixed(3)} {currencyLabel}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                <span className="font-bold">
                  {subtotal.toFixed(3)} {currencyLabel}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t(`الخصم (${couponCode})`, `Discount (${couponCode})`)}</span>
                  <span className="font-bold">
                    -{discount.toFixed(3)} {currencyLabel}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t('رسوم التوصيل', 'Delivery Fee')}</span>
                <span className="font-bold text-emerald-600">
                  {shippingFee === 0
                    ? t(
                        `مجاني (للطلبات فوق ${PLATFORM_CONFIG.freeShippingThreshold} ${PLATFORM_CONFIG.currencyAr})`,
                        `Free (Orders over ${PLATFORM_CONFIG.freeShippingThreshold} ${PLATFORM_CONFIG.currencyEn})`
                      )
                    : `${shippingFee.toFixed(3)} ${currencyLabel}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>{t(`ضريبة القيمة المضافة (${vatPercent}%)`, `VAT (${vatPercent}%)`)}</span>
                <span className="font-bold">
                  {tax.toFixed(3)} {currencyLabel}
                </span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 dark:text-white pt-3 border-t border-slate-200 dark:border-slate-700">
                <span>{t('الإجمالي المستحق', 'Total Amount Due')}</span>
                <span className="text-[#153e4d] dark:text-[#dfba83] text-xl">
                  {total.toFixed(3)} {currencyLabel}
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