import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  Printer,
  ArrowLeft,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '../context/CartContext';

interface OrderConfirmationViewProps {
  onNavigate: (view: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({ onNavigate }) => {
  const { lastOrder, orders } = useCart();

  // If no lastOrder in context, use the most recent order from orders list
  const currentOrder = lastOrder || (orders.length > 0 ? orders[0] : null);

  if (!currentOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">لا يوجد طلب حالي لعرضه</h2>
        <p className="text-xs text-slate-500">
          يمكنك استعراض تاريخ طلباتك السابقة أو التسوق من منصة منتجي.
        </p>
        <button
          onClick={() => onNavigate('marketplace.html')}
          className="px-5 py-2.5 bg-[#008450] text-white rounded-xl text-xs font-bold"
        >
          تصفح سوق المنتجات
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

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
          تم تأكيد طلبيتك وإرسال إشعار فوري لرواد الأعمال وأصحاب المتاجر لتجهيز طلبك وتوصيله بعناية.
        </p>
        <div className="pt-2">
          <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider">
            رقم الطلب: {currentOrder.orderNumber}
          </span>
        </div>
      </div>

      {/* Tracking Stepper */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <h2 className="text-sm font-bold text-slate-700">مراحل الشحن والتجهيز المباشر:</h2>

        <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
          {/* Progress bar background */}
          <div className="absolute top-4 right-1/8 left-1/8 h-1 bg-slate-100 -z-0" />
          <div className="absolute top-4 right-1/8 w-1/4 h-1 bg-[#008450] -z-0" />

          {/* Steps */}
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
              <span>عنوان التوصيل:</span>
            </div>
            <div className="text-slate-600 pr-5">
              {currentOrder.customerName} - {currentOrder.phone}
            </div>
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
                {currentOrder.paymentMethod === 'bank_muscat'
                  ? 'بطاقة بنك مسقط / عُمان نت'
                  : currentOrder.paymentMethod === 'thawani'
                  ? 'محفظة ثواني الإلكترونية'
                  : currentOrder.paymentMethod === 'card'
                  ? 'بطاقة ائتمانية'
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
          <button
            onClick={() => onNavigate('orders.html')}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            عرض سجل طلباتي بالكامل
          </button>

          <button
            onClick={() => onNavigate('marketplace.html')}
            className="px-6 py-2.5 bg-[#008450] hover:bg-[#00683f] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>متابعة التسوق في السوق العماني</span>
          </button>
        </div>
      </div>
    </div>
  );
};
