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
} from 'lucide-react';
import { useCart, CreateOrderInput } from '../context/CartContext';
import { OMAN_GOVERNORATES } from '../data/mockData';

interface CheckoutViewProps {
  onNavigate: (view: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onNavigate }) => {
  const { items, subtotal, discount, shippingFee, tax, total, placeOrder } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [governorate, setGovernorate] = useState(OMAN_GOVERNORATES[0]);
  const [wilayat, setWilayat] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<
    'apple_pay' | 'google_pay' | 'samsung_pay' | 'bank_muscat' | 'thawani' | 'card' | 'cod'
  >('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">سلتك فارغة</h2>
        <p className="text-xs text-slate-500">
          لا يوجد منتجات لإتمام عملية الشراء. يرجى إضافة منتجات من السوق أولاً.
        </p>
        <button
          onClick={() => onNavigate('marketplace.html')}
          className="px-6 py-2.5 bg-[#008450] text-white rounded-xl text-xs font-bold hover:bg-[#00683f] transition-colors"
        >
          العودة لسوق المنتجات
        </button>
      </div>
    );
  }

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !wilayat || !address) {
      setErrorMsg('يرجى ملء جميع الحقول الإلزامية وعنوان التوصيل.');
      return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    setTimeout(() => {
      const orderData: CreateOrderInput = {
        customerName,
        email: email || `${phone.replace(/\D/g, '')}@customer.montaji.om`,
        phone,
        governorate,
        wilayat,
        address,
        paymentMethod,
      };

      placeOrder(orderData);
      setIsProcessing(false);
      onNavigate('order-confirmation.html');
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <button
          onClick={() => onNavigate('cart.html')}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 mb-2 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى سلة التسوق</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          إتمام الطلب والدفع الآمن
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          أدخل بيانات الشحن واختر وسيلة الدفع المفضلة لديك في سلطنة عُمان
        </p>
      </div>

      <form onSubmit={handleCompleteOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Columns */}
          <div className="lg:col-span-8 space-y-6">
            {/* Step 1: Customer & Delivery Address */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#008450] text-white flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h2 className="text-base font-black text-slate-900">
                  بيانات العميل وعنوان التوصيل
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم بالكامل: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد بن سعيد المعمري"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الهاتف النقال (عُمان): <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+968 9XXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 font-mono"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  البريد الإلكتروني (لتلقي الفاتورة):
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@domain.om"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 text-left font-mono"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    المحافظة: <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 cursor-pointer text-right"
                  >
                    {OMAN_GOVERNORATES.map((gov) => (
                      <option key={gov} value={gov}>
                        {gov}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الولاية / المنطقة: <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={wilayat}
                    onChange={(e) => setWilayat(e.target.value)}
                    placeholder="مثال: ولاية السيب - الخوض، صحار..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  العنوان التفصيلي / رقم المنزل / ملاحظات التوصيل: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="الشارع، رقم المبنى، أقرب معلم مميز لتسهيل التوصيل..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-full bg-[#1f5b70] text-white flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h2 className="text-base font-black text-slate-900">
                  طرق الدفع الإلكتروني المعتمدة في سلطنة عمان
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Apple Pay */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'apple_pay'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
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
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">Apple Pay</span>
                        <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-sans">
                          Pay
                        </span>
                      </span>
                      <span className="text-[10px] text-[#c59b5f] font-bold">نقرة واحدة</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      دفع سريع وفوري وآمن عبر بصمة الوجه أو الإصبع (iPhone / Mac / iPad)
                    </p>
                  </div>
                </label>

                {/* Google Pay */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'google_pay'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'google_pay'}
                    onChange={() => setPaymentMethod('google_pay')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">Google Pay</span>
                        <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-bold border border-blue-200">
                          GPay
                        </span>
                      </span>
                      <span className="text-[10px] text-emerald-600 font-bold">آمن 100%</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      الدفع المباشر عبر بطاقاتك المحفوظة في محفظة Google Pay
                    </p>
                  </div>
                </label>

                {/* Samsung Pay */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'samsung_pay'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'samsung_pay'}
                    onChange={() => setPaymentMethod('samsung_pay')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <span className="font-black">Samsung Pay</span>
                        <span className="text-[10px] bg-indigo-900 text-white px-1.5 py-0.5 rounded font-bold">
                          Pay
                        </span>
                      </span>
                      <span className="text-[10px] text-indigo-600 font-bold">Galaxy</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      الدفع المشفر عبر أجهزة Samsung Galaxy الذكية
                    </p>
                  </div>
                </label>

                {/* Bank Muscat / OmanNet */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'bank_muscat'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
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
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>بطاقات الخصم المباشر (بنك مسقط / عُمان نت)</span>
                      <span className="text-[10px] bg-[#c59b5f]/20 text-[#845d25] px-1.5 py-0.2 rounded font-bold">
                        محلي
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      دفع مباشر عبر البطاقات البنكية العمانية
                    </p>
                  </div>
                </label>

                {/* Thawani */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'thawani'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'thawani'}
                    onChange={() => setPaymentMethod('thawani')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>محفظة ثواني Thawani Pay</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded font-bold">
                        محلي
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      بوابة الدفع الإلكتروني المعتمدة في عمان
                    </p>
                  </div>
                </label>

                {/* Card */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'card'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      بطاقة ائتمانية (Visa / MasterCard)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      دفع دولي ومحلي آمن ومشفر 3D Secure
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cod'
                      ? 'border-[#1f5b70] bg-[#1f5b70]/5'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 text-[#1f5b70] focus:ring-[#1f5b70]"
                  />
                  <div>
                    <div className="font-bold text-xs text-slate-900">
                      الدفع عند الاستلام (COD)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      ادفع نقداً لمندوب التوصيل عند استلام الطلب
                    </p>
                  </div>
                </label>
              </div>

              {/* Extra mock inputs for card */}
              {(paymentMethod === 'bank_muscat' || paymentMethod === 'card') && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 pt-3">
                  <div className="text-xs font-bold text-slate-700">بيانات البطاقة البنكية:</div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="رقم البطاقة (16 رقماً)"
                      defaultValue="4215 8920 1142 9012"
                      className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono"
                      dir="ltr"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        defaultValue="12/28"
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-center"
                        dir="ltr"
                      />
                      <input
                        type="password"
                        placeholder="CVV"
                        defaultValue="891"
                        maxLength={4}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-center"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Instant pay note for digital wallets */}
              {(paymentMethod === 'apple_pay' || paymentMethod === 'google_pay' || paymentMethod === 'samsung_pay') && (
                <div className="p-4 bg-[#f8fafb] rounded-2xl border border-[#c59b5f]/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <ShieldCheck className="w-5 h-5 text-[#c59b5f]" />
                    <span>
                      سيتم فتح نافذة{' '}
                      <strong>
                        {paymentMethod === 'apple_pay'
                          ? 'Apple Pay'
                          : paymentMethod === 'google_pay'
                          ? 'Google Pay'
                          : 'Samsung Pay'}
                      </strong>{' '}
                      لتأكيد العملية بصورة فورية ومحمية برمز التشفير الحي.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Order Summary */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md space-y-5">
            <h3 className="font-black text-slate-900 text-base border-b border-slate-100 pb-3">
              المنتجات في طلبك ({items.length})
            </h3>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-800 line-clamp-1">
                      {product.title}
                    </div>
                    <div className="text-slate-400">
                      الكمية: {quantity} × {product.price.toFixed(3)} ر.ع.
                    </div>
                  </div>
                  <div className="font-bold text-slate-900 text-left shrink-0">
                    {(product.price * quantity).toFixed(3)} ر.ع.
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations breakdown */}
            <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>المجموع الفرعي:</span>
                <span className="font-bold text-slate-900">{subtotal.toFixed(3)} ر.ع.</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>الخصم المطبق:</span>
                  <span>- {discount.toFixed(3)} ر.ع.</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>رسوم التوصيل:</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#008450] font-bold">مجاني</span>
                  ) : (
                    `${shippingFee.toFixed(3)} ر.ع.`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>ضريبة القيمة المضافة (5%):</span>
                <span>{tax.toFixed(3)} ر.ع.</span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">المبلغ الإجمالي:</span>
                <div className="text-right">
                  <span className="text-xl font-black text-[#008450]">{total.toFixed(3)}</span>{' '}
                  <span className="text-xs font-bold text-slate-600">ر.ع.</span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 bg-gradient-to-r from-[#008450] to-[#059669] hover:from-[#00683f] hover:to-[#047857] text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isProcessing ? (
                <span>جاري معالجة الدفع والطلب...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>تأكيد الطلب والدفع النهائي</span>
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
    </div>
  );
};
