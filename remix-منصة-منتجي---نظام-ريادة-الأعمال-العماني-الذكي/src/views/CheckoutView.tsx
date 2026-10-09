import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ArrowRight,
  Lock,
  Building,
  AlertCircle,
  ShoppingBag,
  QrCode,
  Printer,
  Smartphone,
  Check,
} from 'lucide-react';
import { useCart, CreateOrderInput } from '../context/CartContext';
import { OMAN_SHIPPING_RATES, validateOmaniPhone, GovernorateShippingRate } from '../utils/validation';
import { WaybillModal } from '../components/WaybillModal';

interface CheckoutViewProps {
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { items, subtotal, discount, tax, placeOrder } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState<GovernorateShippingRate>(OMAN_SHIPPING_RATES[0]);
  const [wilayat, setWilayat] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'apple_pay' | 'google_pay' | 'samsung_pay' | 'bank_muscat' | 'thawani' | 'omannet_qr' | 'card' | 'cod'
  >('apple_pay');
  const [thawaniPhone, setThawaniPhone] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showWaybillModal, setShowWaybillModal] = useState(false);

  // Dynamic shipping fee based on governorate
  const shippingFee = items.length === 0 ? 0 : subtotal - discount >= 35 ? 0 : selectedGovernorate.rate;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const calculatedTax = Number((discountedSubtotal * 0.05).toFixed(3));
  const finalTotal = Number((discountedSubtotal + shippingFee + calculatedTax).toFixed(3));

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white">سلتك فارغة</h2>
        <p className="text-xs text-slate-500">
          لا توجد منتجات لإتمام عملية الشراء. يرجى إضافة منتجات من السوق أولاً.
        </p>
        <button
          onClick={() => onNavigate('marketplace.html')}
          className="px-6 py-2.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          العودة لسوق المنتجات
        </button>
      </div>
    );
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !phone.trim() || !wilayat.trim() || !address.trim()) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية وعنوان التوصيل.');
      return;
    }

    // Phone validation
    const phoneVal = validateOmaniPhone(phone);
    if (!phoneVal.isValid) {
      setErrorMsg(phoneVal.error || 'يرجى إدخال رقم هاتف عماني صحيح (مثال: 94842840).');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    setTimeout(() => {
      const orderData: CreateOrderInput = {
        customerName: customerName.trim(),
        email: email.trim() || `${phoneVal.formatted}@customer.montaji.om`,
        phone: phoneVal.formatted,
        governorate: selectedGovernorate.name,
        wilayat: wilayat.trim(),
        address: address.trim(),
        paymentMethod: paymentMethod === 'omannet_qr' ? 'bank_muscat' : paymentMethod,
      };

      placeOrder(orderData);
      setIsProcessing(false);
      onNavigate('order-confirmation.html');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8" dir="rtl">
      {/* Title */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => onNavigate('cart.html')}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 mb-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى سلة التسوق</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          إتمام الطلب والدفع الوطني المعتمد
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          بوابات دفع عمانية مرخصة (شبكة عمان OmanNet ومحفظة ثواني) وحاسبة شحن موحدة لكافة المحافظات
        </p>
      </div>

      <form onSubmit={handleCompleteOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer & Delivery Address */}
            <div className="bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#153e4d] text-[#dfba83] flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h2 className="text-base font-black text-slate-900 dark:text-white">
                    بيانات العميل وعنوان التوصيل في سلطنة عمان
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowWaybillModal(true)}
                  className="px-3 py-1.5 bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:bg-sky-100 transition"
                  title="معاينة بوليصة الشحن الرسمية"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>معاينة بوليصة الشحن (Waybill)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الاسم بالكامل: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: حذيفة بن موسى"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1f5b70]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    رقم الهاتف العُماني (يبدأ بـ 9 أو 7): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="94842840"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono font-bold focus:ring-2 focus:ring-[#1f5b70]"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  البريد الإلكتروني (لتلقي الفاتورة):
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.om"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1f5b70] text-left font-mono"
                  dir="ltr"
                />
              </div>

              {/* Governorates Shipping Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    المحافظة (حاسبة الشحن المخفض الموحد): <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedGovernorate.id}
                    onChange={(e) => {
                      const found = OMAN_SHIPPING_RATES.find((r) => r.id === e.target.value);
                      if (found) setSelectedGovernorate(found);
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#1f5b70] cursor-pointer text-right font-medium"
                  >
                    {OMAN_SHIPPING_RATES.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.name} (+{gov.rate.toFixed(3)} ر.ع. • وصول خلال {gov.deliveryDays})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    الولاية / المنطقة: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wilayat}
                    onChange={(e) => setWilayat(e.target.value)}
                    placeholder="مثال: صلالة، نزوى، السيب، صحار..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1f5b70]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  العنوان التفصيلي / رقم المنزل / ملاحظات الناقل: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الشارع، رقم المبنى، أقرب معلم مميز..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#1f5b70]"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1f5b70] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  طرق الدفع الإلكتروني الوطنية السريعة
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Thawani Pay */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'thawani'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'thawani'}
                    onChange={() => setPaymentMethod('thawani')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">محفظة ثواني Thawani Pay</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                          عُمان
                        </span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">فوري</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      الدفع المباشر عبر محفظة ثواني الذكية برقم الهاتف العماني
                    </p>
                  </div>
                </label>

                {/* 2. OmanNet QR Code */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'omannet_qr'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'omannet_qr'}
                    onChange={() => setPaymentMethod('omannet_qr')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">رمز QR المباشر (للبوثات والمعارض)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-bold">
                          OmanNet QR
                        </span>
                      </span>
                      <span className="text-[10px] text-[#c59b5f] font-bold">مسح فوري</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      امسح الرمز عبر تطبيق بنكك (مسقط، ظفار، صحار، الوطني) واستلم فوراً في المعرض
                    </p>
                  </div>
                </label>

                {/* 3. Bank Muscat / OmanNet Direct Debit */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'bank_muscat'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'bank_muscat'}
                    onChange={() => setPaymentMethod('bank_muscat')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>شبكة عُمان للخصم المباشر (OmanNet)</span>
                      <span className="text-[10px] bg-[#c59b5f]/20 text-[#845d25] px-1.5 py-0.2 rounded font-bold">
                        بطاقات بنوك عمان
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      خصم مباشر وآمن عبر بطاقتك البنكية الصادرة من أي بنك في السلطنة
                    </p>
                  </div>
                </label>

                {/* 4. Apple Pay */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'apple_pay'}
                    onChange={() => setPaymentMethod('apple_pay')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">Apple Pay</span>
                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-sans">
                          Pay
                        </span>
                      </span>
                      <span className="text-[10px] text-[#c59b5f] font-bold">نقرة واحدة</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      دفع سريع وفوري عبر بصمة الوجه أو الإصبع (iPhone / Mac / iPad)
                    </p>
                  </div>
                </label>
              </div>

              {/* OmanNet QR Code Display Container for Booths & Exhibitions */}
              {paymentMethod === 'omannet_qr' && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-amber-300 dark:border-amber-700/60 text-center space-y-3 animate-in fade-in">
                  <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                    <QrCode className="w-4 h-4 text-[#c59b5f]" />
                    <span>رمز الاستجابة السريع لمعارض الأسر ورواد الأعمال (OmanNet QR)</span>
                  </div>
                  <div className="w-44 h-44 bg-white p-3 rounded-2xl border-2 border-slate-900 mx-auto shadow-md flex flex-col items-center justify-center">
                    <div className="font-mono text-[9px] text-slate-400 mb-1">OMAN-NET-QR-BOOTH</div>
                    <div className="w-28 h-28 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-mono font-black tracking-widest p-2 text-center">
                      [QR-PAY]
                      <br />
                      {finalTotal.toFixed(3)} ر.ع.
                    </div>
                    <div className="text-[10px] font-bold text-slate-800 mt-1">امسح للدفع بالهاتف</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                    افتح تطبيق بنكك (بنك مسقط، بنك ظفار، صحار الدولي، أو بنك عُمان الوطني)، اختر <strong>Scan QR</strong> وادفع فوراً للمشروع.
                  </p>
                </div>
              )}

              {/* Thawani Phone Input */}
              {paymentMethod === 'thawani' && (
                <div className="p-4 bg-indigo-50/60 dark:bg-slate-800 rounded-2xl border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs">
                  <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    <span>رقم الهاتف المرتبط بمحفظة ثواني:</span>
                  </div>
                  <input
                    type="tel"
                    value={thawaniPhone || phone}
                    onChange={(e) => setThawaniPhone(e.target.value)}
                    placeholder="9XXXXXXX"
                    className="w-full bg-white dark:bg-slate-700 border border-indigo-300 dark:border-indigo-600 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    dir="ltr"
                  />
                  <p className="text-[11px] text-indigo-800 dark:text-indigo-300">
                    ستصلك رسالة دفع فورية على تطبيق ثواني لتأكيد المبلغ ({finalTotal.toFixed(3)} ر.ع.).
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-4 bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700 shadow-md space-y-5">
            <h3 className="font-black text-slate-900 dark:text-white text-base border-b border-slate-100 dark:border-slate-800 pb-3">
              المنتجات في طلبك ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 dark:text-white line-clamp-1">
                      {product.title}
                    </div>
                    <div className="text-slate-400">
                      الكمية: {quantity} × {product.price.toFixed(3)} ر.ع.
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-left shrink-0">
                    {(product.price * quantity).toFixed(3)} ر.ع.
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-900 dark:text-white">{subtotal.toFixed(3)} ر.ع.</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>- {discount.toFixed(3)} ر.ع.</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span>شحن {selectedGovernorate.name}:</span>
                <span className="font-bold text-[#008450]">
                  {shippingFee === 0 ? 'مجاني' : `${shippingFee.toFixed(3)} ر.ع.`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (5%):</span>
                <span>{calculatedTax.toFixed(3)} ر.ع.</span>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-3 flex justify-between items-baseline">
                <span className="font-black text-slate-900 dark:text-white text-sm">المبلغ الإجمالي النهائي:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#008450] dark:text-emerald-400">{finalTotal.toFixed(3)}</span>{' '}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">ر.ع.</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-[#153e4d] to-[#1f5b70] hover:from-[#122e3a] hover:to-[#153e4d] text-[#dfba83] font-black rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <span>جاري معالجة الدفع والطلب...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد الطلب والدفع الفوري ({finalTotal.toFixed(3)} ر.ع.)</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>معاملتك محمية وفق معايير البنك المركزي العماني</span>
            </div>
          </div>
        </div>
      </form>

      {/* Waybill Modal */}
      <WaybillModal
        isOpen={showWaybillModal}
        onClose={() => setShowWaybillModal(false)}
        governorate={selectedGovernorate}
        customerName={customerName}
        phone={phone}
        wilayat={wilayat}
        address={address}
        totalOmr={finalTotal}
      />
    </div>
  );
};
