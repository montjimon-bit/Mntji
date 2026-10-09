import React from 'react';
import { X, Printer, Truck, CheckCircle2, ShieldCheck, MapPin, Package } from 'lucide-react';
import { GovernorateShippingRate } from '../utils/validation';

interface WaybillModalProps {
  isOpen: boolean;
  onClose: () => void;
  governorate: GovernorateShippingRate;
  customerName: string;
  phone: string;
  wilayat: string;
  address: string;
  orderNumber?: string;
  totalOmr?: number;
}

export const WaybillModal: React.FC<WaybillModalProps> = ({
  isOpen,
  onClose,
  governorate,
  customerName,
  phone,
  wilayat,
  address,
  orderNumber = `OM-${Math.floor(100000 + Math.random() * 900000)}`,
  totalOmr = 15.5,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString('ar-OM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>بوليصة شحن وتوصيل وطنية - منصة مُنتجي</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Cairo', sans-serif; padding: 25px; color: #0f172a; direction: rtl; }
          .box { border: 2px solid #0f172a; border-radius: 12px; padding: 20px; max-width: 550px; margin: auto; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 12px; }
          .title { font-size: 18px; font-weight: 900; margin: 0; color: #153e4d; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th, td { border: 1px solid #94a3b8; padding: 8px 10px; text-align: right; }
          th { background: #f1f5f9; width: 35%; font-weight: 800; }
          .barcode { font-family: monospace; font-size: 26px; font-weight: 900; letter-spacing: 4px; text-align: center; margin-top: 15px; background: #f8fafc; padding: 10px; border: 1px dashed #64748b; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="box">
          <div class="header">
            <div>
              <h2 class="title">منصة مُنتجي - شبكة الشحن والتوصيل الوطني</h2>
              <small>خدمة النقل اللوجستي الموحد للمحافظات العمانية الـ 11</small>
            </div>
            <div style="text-align: left;">
              <strong>${orderNumber}</strong>
              <div style="font-size: 11px; color: #64748b;">${todayStr}</div>
            </div>
          </div>

          <table>
            <tr><th>اسم المستلم:</th><td><strong>${customerName || 'المشتري الكريم'}</strong></td></tr>
            <tr><th>رقم هاتف الاتصال:</th><td dir="ltr" style="text-align: right;">+968 ${phone || '94842840'}</td></tr>
            <tr><th>المحافظة والولاية:</th><td><strong>${governorate.name} - ${wilayat || 'المركز'}</strong></td></tr>
            <tr><th>العنوان التفصيلي:</th><td>${address || 'توصيل مباشر لباب المنزل'}</td></tr>
            <tr><th>قيمة الشحن المخفضة:</th><td><strong>${governorate.rate.toFixed(3)} ر.ع.</strong></td></tr>
            <tr><th>إجمالي قيمة الطلب:</th><td><strong>${totalOmr.toFixed(3)} ريال عماني</strong> (مدفوع إلكترونياً)</td></tr>
            <tr><th>زمن التوصيل المعتمد:</th><td><strong>خلال ${governorate.deliveryDays}</strong></td></tr>
          </table>

          <div class="barcode">
            ||| | ||||| || |||| |||| ||||| ${orderNumber}
          </div>
          <p style="text-align: center; font-size: 11px; color: #64748b; margin-top: 8px;">
            امسح الرمز للتتبع اللحظي والتسليم للناقل الوطني المعتمد
          </p>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4" dir="rtl">
      <div className="bg-white dark:bg-[#0d232d] text-slate-800 dark:text-slate-100 rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 dark:border-slate-700 animate-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute left-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-[#153e4d] dark:text-white">بوليصة الشحن والتوصيل الفورية</h3>
              <p className="text-[11px] text-slate-500">جاهزة للطباعة والتسليم مع الطرد</p>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-500">رقم البوليصة:</span>
              <strong className="font-mono text-sm text-[#153e4d] dark:text-[#dfba83]">{orderNumber}</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">المستلم:</span>
              <span className="font-bold">{customerName || 'المشتري الكريم'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">الوجهة:</span>
              <span className="font-bold">{governorate.name} - {wilayat}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">رسوم الشحن:</span>
              <span className="font-bold text-[#008450]">{governorate.rate.toFixed(3)} ر.ع.</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">موعد التسليم المتوقع:</span>
              <span className="font-bold text-amber-600">خلال {governorate.deliveryDays}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بوليصة الشحن (PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
