import React, { useState } from 'react';
import {
  PackageCheck,
  ShoppingBag,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  Printer,
  CheckCircle2,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useCart, Order } from '../context/CartContext';

interface OrdersViewProps {
  onNavigate: (view: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ onNavigate }) => {
  const { orders } = useCart();
  const [filterStatus, setFilterStatus] = useState<string>('الكل');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === 'الكل') return true;
    return order.status === filterStatus;
  });

  const toggleExpand = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'تم الاستلام':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'قيد التجهيز':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'قيد التوصيل':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'تم التسليم':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
            <PackageCheck className="w-7 h-7 text-[#008450]" />
            <span>طلباتي وتتبع الشحنات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تابع حالة طلبياتك المباشرة وفواتير المشتريات من رواد الأعمال العمانيين
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {['الكل', 'تم الاستلام', 'قيد التوصيل', 'تم التسليم'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterStatus === st
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">لا توجد طلبات مسجلة</h2>
          <p className="text-xs text-slate-500">
            لم تسجل أي طلبات بهذه الحالة بعد. تصفح منتجات رواد الأعمال وأضف ما يعجبك!
          </p>
          <button
            onClick={() => onNavigate('marketplace.html')}
            className="px-5 py-2.5 bg-[#008450] text-white rounded-xl text-xs font-bold hover:bg-[#00683f] transition-colors"
          >
            تصفح السوق العماني
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all"
              >
                {/* Order Top Bar */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {order.orderNumber}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>
                        تاريخ الطلب:{' '}
                        {new Date(order.createdAt).toLocaleDateString('ar-OM', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {order.governorate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="text-right sm:text-left">
                      <div className="text-xs text-slate-400">إجمالي الطلب</div>
                      <div className="text-base font-black text-[#008450]">
                        {order.total.toFixed(3)}{' '}
                        <span className="text-xs font-bold text-slate-600">ر.ع.</span>
                      </div>
                    </div>

                    <div className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-100 space-y-4 bg-slate-50/40 text-xs">
                    {/* Items */}
                    <div className="pt-3 space-y-2">
                      <span className="font-bold text-slate-800 block">
                        المنتجات ({order.items.length}):
                      </span>
                      <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 overflow-hidden">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-bold text-slate-800">{item.title}</div>
                                <div className="text-slate-400">
                                  {item.quantity} × {item.price.toFixed(3)} ر.ع.
                                </div>
                              </div>
                            </div>
                            <span className="font-bold text-slate-900">
                              {(item.price * item.quantity).toFixed(3)} ر.ع.
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">عنوان التوصيل:</span>
                        <div className="text-slate-600">
                          {order.customerName} ({order.phone})
                        </div>
                        <div className="text-slate-500">
                          {order.governorate} - {order.wilayat}
                        </div>
                        <div className="text-slate-400">{order.address}</div>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="font-bold text-slate-700 block">تفاصيل السداد:</span>
                        <div className="text-slate-600">
                          وسيلة الدفع:{' '}
                          <span className="font-bold">
                            {order.paymentMethod === 'bank_muscat'
                              ? 'بطاقة بنك مسقط / عُمان نت'
                              : order.paymentMethod === 'thawani'
                              ? 'محفظة ثواني'
                              : order.paymentMethod === 'card'
                              ? 'بطاقة ائتمانية'
                              : 'الدفع عند الاستلام'}
                          </span>
                        </div>
                        <div className="text-slate-600">
                          المجموع الفرعي: {order.subtotal.toFixed(3)} ر.ع.
                        </div>
                        <div className="text-slate-600">
                          الشحن: {order.shippingFee === 0 ? 'مجاني' : `${order.shippingFee.toFixed(3)} ر.ع.`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
