import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Truck,
  MapPin,
  Printer,
  ShoppingBag,
  ExternalLink,
  MailCheck,
  RefreshCw,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface OrderConfirmationViewProps {
  onNavigate: (view: string) => void;
}

const MERCHANT_EMAIL = 'montjimon@gmail.com';
const MERCHANT_WHATSAPP = '96894842840';

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ onNavigate }) => {
  const { lastOrder, orders } = useCart();
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const currentOrder = lastOrder || (orders.length > 0 ? orders[0] : null);

  const sendMerchantEmail = async (force = false) => {
    if (!currentOrder) return;

    const sentKey = `montaji_email_ok_${currentOrder.orderNumber}`;
    if (!force && sessionStorage.getItem(sentKey)) {
      setEmailStatus('sent');
      return;
    }

    setEmailStatus('sending');

    const itemsSummary = currentOrder.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.title} | الكمية: ${item.quantity} | السعر: ${(
            item.price * item.quantity
          ).toFixed(3)} ر.ع.`
      )
      .join('\n');

    const paymentLabel =
      currentOrder.paymentMethod === 'thawani'
        ? 'بوابة ثواني الإلكترونية (Thawani Pay)'
        : 'الدفع عند الاستلام (COD)';

    const fullDetailsMessage =
      `لديك طلبية جديدة في منصة مُنتَجي 🇴🇲\n\n` +
      `• رقم الطلبية: ${currentOrder.orderNumber}\n` +
      `• اسم العميل: ${currentOrder.customerName}\n` +
      `• رقم هاتف العميل: ${currentOrder.phone}\n` +
      `• إيميل العميل: ${currentOrder.email || 'غير متوفر'}\n` +
      `• العنوان: ${currentOrder.governorate} - ${currentOrder.wilayat} - ${currentOrder.address}\n` +
      `• وسيلة الدفع: ${paymentLabel}\n` +
      `• الإجمالي المستحق: ${currentOrder.total.toFixed(3)} ر.ع.\n\n` +
      `المنتجات المطلوبة:\n${itemsSummary}\n\n` +
      `يرجى الدخول إلى (متجري الخاص) في الموقع والضغط على زر تأكيد الطلبية.`;

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${MERCHANT_EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `طلبية جديدة في منصة منتجي - ${currentOrder.orderNumber}`,
          _template: 'table',
          _captcha: 'false',
          name: currentOrder.customerName,
          email: currentOrder.email || 'customer@montaji.om',
          phone: currentOrder.phone,
          order_number: currentOrder.orderNumber,
          total_omr: `${currentOrder.total.toFixed(3)} OMR`,
          details: fullDetailsMessage,
        }),
      });

      const data = await res.json();

      if (res.ok && (data.success === 'true' || data.success === true)) {
        sessionStorage.setItem(sentKey, 'true');
        setEmailStatus('sent');
      } else {
        console.error('FormSubmit response:', data);
        setEmailStatus('error');
      }
    } catch (err) {
      console.error('Email fetch error:', err);
      setEmailStatus('error');
    }
  };

  useEffect(() => {
    if (currentOrder) {
      sendMerchantEmail(false);
    }
  }, [currentOrder?.orderNumber]);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">لا يوجد طلب حالي لعرضه</h2>
        <p className="text-xs text-slate-500">
          يمكنك استعراض تاريخ طلباتك السابقة أو التسوق من منصة منتجي.
        </p>
        <button
          onClick={() => onNavigate('marketplace.html')}
          className="px-5 py-2.5 bg-[#008450] text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          تصفح سوق المنتجات
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const whatsappItemsText = currentOrder.items
    .map((item) => `• ${item.title} (${item.quantity} × ${item.price.toFixed(3)} ر.ع.)`)
    .join('\n');

  const whatsappMessage =
    `مرحباً! لديك طلبية جديدة عبر منصة مُنتَجي 🇴🇲\n` +
    `━━━━━━━━━━━━━━\n` +
    `📦 رقم الطلبية: ${currentOrder.orderNumber}\n` +
    `👤 اسم العميل: ${currentOrder.customerName}\n` +
    `📱 رقم العميل: ${currentOrder.phone}\n` +
    `📧 إيميل العميل: ${currentOrder.email || 'غير محدد'}\n` +
    `📍 العنوان: ${currentOrder.governorate} - ${currentOrder.wilayat} (${currentOrder.address})\n` +
    `💳 الدفع: ${currentOrder.paymentMethod === 'thawani' ? 'بوابة ثواني' : 'الدفع عند الاستلام'}\n` +
    `━━━━━━━━━━━━━━\n` +
    `🛍️ الطلبية:\n${whatsappItemsText}\n` +
    `━━━━━━━━━━━━━━\n` +
    `💰 الإجمالي: ${currentOrder.total.toFixed(3)} ر.ع.\n` +
    `يرجى الدخول إلى (متجري الخاص) في الموقع لتأكيد الطلبية.`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Success Hero */}
      <div className="bg-gradient-to-br from-emerald-900 to-teal-950 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl relative overflow-hidden">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black">
          شكراً لك! تم استلام طلبك بنجاح
        </h1>
        <p className="text-sm text-emerald-100 max-w-lg mx-auto">
          تم تسجيل طلبيتك في لوحة متجر التاجر لتأكيدها وتجهيزها وتوصيلها لك بعناية.
        </p>

        {/* حالة إشعار البريد للتاجر */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
            رقم الطلب: {currentOrder.orderNumber}
          </span>

          {emailStatus === 'sent' && (
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/25 border border-emerald-400/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200">
              <MailCheck className="w-3.5 h-3.5" />
              <span>تم إشعار بريد التاجر ✓</span>
            </span>
          )}

          {emailStatus === 'error' && (
            <button
              type="button"
              onClick={() => sendMerchantEmail(true)}
              className="inline-flex items-center gap-1.5 bg-amber-500/25 hover:bg-amber-500/40 border border-amber-300/40 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-200 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة إرسال إشعار البريد</span>
            </button>
          )}
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-700">مراحل الشحن والتجهيز المباشر:</h2>

        <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
          <div className="absolute top-4 right-1/8 left-1/8 h-1 bg-slate-100 -z-0" />
          <div className="absolute top-4 right-1/8 w-1/4 h-1 bg-[#008450] -z-0" />

          <div className="space-y-2 relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#008450] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              ✓
            </div>
            <span className="font-bold text-slate-900">تم الاستلام</span>
          </div>

          <div className="space-y-2 relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#008450] border-2 border-[#008450] flex items-center justify-center font-bold text-xs">
              2
            </div>
            <span className="font-semibold text-slate-700">قيد التجهيز</span>
          </div>

          <div className="space-y-2 relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
              3
            </div>
            <span className="text-slate-400">قيد التوصيل</span>
          </div>

          <div className="space-y-2 relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs">
              4
            </div>
            <span className="text-slate-400">تم التسليم</span>
          </div>
        </div>
      </div>

      {/* Invoice and Delivery Summary */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <h3 className="font-black text-slate-900 text-lg">تفاصيل الفاتورة والشحن</h3>
            <p className="text-xs text-slate-500">
              تاريخ الطلب:{' '}
              {new Date(currentOrder.createdAt).toLocaleDateString('ar-OM', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة الفاتورة</span>
            </button>
          </div>
        </div>

        {/* Delivery Details Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
          <div className="space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#008450]" />
              <span>بيانات العميل وعنوان التوصيل:</span>
            </div>
            <div className="text-slate-600 pr-5 font-semibold">
              {currentOrder.customerName} — <span dir="ltr">{currentOrder.phone}</span>
            </div>
            {currentOrder.email && (
              <div className="text-slate-500 pr-5" dir="ltr">
                {currentOrder.email}
              </div>
            )}
            <div className="text-slate-600 pr-5">
              {currentOrder.governorate}، {currentOrder.wilayat}
            </div>
            <div className="text-slate-500 pr-5">{currentOrder.address}</div>
          </div>

          <div className="space-y-1.5 md:border-r md:border-slate-200 md:pr-4">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>طريقة الدفع والشحن:</span>
            </div>
            <div className="text-slate-600 pr-5">
              طريقة الدفع:{' '}
              <span className="font-bold text-slate-800">
                {currentOrder.paymentMethod === 'thawani'
                  ? 'بوابة ثواني الإلكترونية (Thawani Pay)'
                  : 'الدفع عند الاستلام'}
              </span>
            </div>
            <div className="text-slate-600 pr-5">
              الشحن: توصيل سريع وموثوق إلى باب المنزل
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div>
          <h4 className="font-bold text-slate-900 text-sm mb-3">المنتجات المطلوبة:</h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {currentOrder.items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <div className="font-bold text-slate-800">{item.title}</div>
                    <div className="text-slate-400">
                      الكمية: {item.quantity} × {item.price.toFixed(3)} ر.ع.
                    </div>
                  </div>
                </div>
                <div className="font-black text-slate-900">
                  {(item.price * item.quantity).toFixed(3)} ر.ع.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600 max-w-xs mr-auto">
          <div className="flex justify-between">
            <span>المجموع الفرعي:</span>
            <span className="font-bold text-slate-900">{currentOrder.subtotal.toFixed(3)} ر.ع.</span>
          </div>
          {currentOrder.discount > 0 && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>الخصم المطبق:</span>
              <span>- {currentOrder.discount.toFixed(3)} ر.ع.</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>رسوم الشحن:</span>
            <span>
              {currentOrder.shippingFee === 0 ? 'مجاني' : `${currentOrder.shippingFee.toFixed(3)} ر.ع.`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>ضريبة القيمة المضافة (5%):</span>
            <span>{currentOrder.tax.toFixed(3)} ر.ع.</span>
          </div>
          <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline text-sm">
            <span className="font-black text-slate-900">المجموع المدفوع:</span>
            <span className="font-black text-emerald-700 text-base">
              {currentOrder.total.toFixed(3)} ر.ع.
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigate('orders.html')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              عرض سجل طلباتي بالكامل
            </button>
            <a
              href={`https://wa.me/${MERCHANT_WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>إرسال تفاصيل الطلبية عبر WhatsApp للتاجر</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <button
            onClick={() => onNavigate('marketplace.html')}
            className="px-6 py-2.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>متابعة التسوق في السوق العماني</span>
          </button>
        </div>
      </div>
    </div>
  );
};
