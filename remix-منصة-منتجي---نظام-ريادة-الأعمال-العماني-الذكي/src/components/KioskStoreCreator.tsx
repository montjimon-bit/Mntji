import React, { useState, useRef } from 'react';
import QRCode from 'qrcode'; // npm install qrcode @types/qrcode

interface CreatedStore {
  storeName: string;
  ownerName: string;
  productTitle: string;
  priceOMR: number;
  productImage: string;
  storeUrl: string;
  qrDataUrl: string;
}

export const KioskStoreCreator: React.FC = () => {
  const [ownerName, setOwnerName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<CreatedStore | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // معالجة اختيار/تصوير الصورة
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // إنشاء المتجر وتوليد QR Code
  const handleCreateStore = async () => {
    if (!imagePreview || !ownerName) return;
    setIsProcessing(true);

    // معرف فريد للمتجر
    const storeId = 'om-' + Date.now().toString().slice(-6);
    const storeUrl = `https://montaji-om.vercel.app/#store?id=${storeId}`;
    
    // توليد QR Code
    const qrDataUrl = await QRCode.toDataURL(storeUrl, { width: 300, margin: 1 });

    setCreatedStore({
      storeName: `متجر ${ownerName}`,
      ownerName: ownerName,
      productTitle: 'مجسم ابتكاري عُماني',
      priceOMR: 15.0,
      productImage: imagePreview,
      storeUrl: storeUrl,
      qrDataUrl: qrDataUrl,
    });

    setIsProcessing(false);
  };

  // طباعة ورقة A5
  const handlePrintA5 = () => {
    window.print();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto font-sans" dir="rtl">
      {/* قسم الإدخال والتصوير */}
      {!createdStore ? (
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center">
          <h2 className="text-2xl font-bold text-[#153e4d] mb-4">📸 صوّر مجسمك وافتح متجرك في لحظات</h2>
          <p className="text-slate-500 mb-6">التقط صورة لابتكارك أو مجسمك لإنشاء متجرك على منصة مُنتجي فوراً</p>

          <div className="space-y-4 max-w-md mx-auto text-right">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">اسم رائد الأعمال / صاحب المجسم:</label>
              <input
                type="text"
                placeholder="مثال: حذيفة الشعيلي"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:border-[#1f5b70]"
              />
            </div>

            <div>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageCapture}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-[#1f5b70] text-[#1f5b70] rounded-2xl font-bold hover:bg-slate-50 transition"
              >
                {imagePreview ? '✓ تم اختيار الصورة (اضغط للتغيير)' : '📷 التقاط صورة المجسم'}
              </button>
            </div>

            {imagePreview && (
              <div className="relative w-40 h-40 mx-auto rounded-xl overflow-hidden border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}

            <button
              onClick={handleCreateStore}
              disabled={!imagePreview || !ownerName || isProcessing}
              className="w-full bg-[#153e4d] hover:bg-[#1f5b70] text-white py-4 rounded-xl font-bold text-lg shadow-md transition disabled:opacity-50"
            >
              {isProcessing ? 'جاري إنشاء المتجر...' : '🚀 تدشين المتجر وإصدار البطاقة'}
            </button>
          </div>
        </div>
      ) : (
        /* واجهة المتجر المنشأ + خيار الطباعة */
        <div className="space-y-8">
          {/* شريط الإجراءات */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow no-print">
            <span className="text-emerald-700 font-bold">✓ تم تدشين متجرك بنجاح على منصة مُنتجي</span>
            <div className="flex gap-3">
              <button
                onClick={handlePrintA5}
                className="bg-[#c59b5f] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#dfba83] transition shadow flex items-center gap-2"
              >
                🖨️ طباعة بطاقة المتجر (A5)
              </button>
              <button
                onClick={() => setCreatedStore(null)}
                className="border border-slate-300 px-4 py-2.5 rounded-xl font-bold hover:bg-slate-100 transition"
              >
                مجسم جديد
              </button>
            </div>
          </div>

          {/* محاكاة واجهة البائع (كما في لوحة التحكم) */}
          <div className="bg-[#153e4d] text-white p-8 rounded-3xl relative overflow-hidden shadow-xl no-print">
            <div className="inline-block bg-[#c59b5f]/20 border border-[#c59b5f] text-[#dfba83] px-3 py-1 rounded-full text-xs font-bold mb-3">
              ✓ متجر معتمد - ريادة 2026
            </div>
            <h1 className="text-3xl font-extrabold mb-2">متجر رائد الأعمال: {createdStore.ownerName}</h1>
            <p className="text-slate-300 text-sm">تم إدراج منتجك بنجاح في السوق العُماني التفاعلي لمنصة مُنتجي</p>
          </div>

          {/* كرت المنتج كما يظهر للعملاء */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6 no-print">
            <img
              src={createdStore.productImage}
              alt={createdStore.productTitle}
              className="w-48 h-48 object-cover rounded-2xl border"
            />
            <div className="flex-1 text-right">
              <h3 className="text-xl font-bold text-slate-800">{createdStore.productTitle}</h3>
              <p className="text-emerald-600 font-black text-2xl my-2">{createdStore.priceOMR} ر.ع.</p>
              <p className="text-sm text-slate-500">البائع: {createdStore.ownerName}</p>
            </div>
          </div>

          {/* ========================================================= */}
          {/* تصميم ورقة A5 المعدة للطباعة فقط (تظهر تلقائياً عند أمر الطباعة) */}
          {/* ========================================================= */}
          <div className="print-a5-sheet hidden">
            <div className="a5-content">
              {/* الترويسة */}
              <div className="header">
                <h2>مَنصّة مُنتَجي</h2>
                <p>المنظومة الوطنية للمشاريع العُمانية · عُمان 2040</p>
              </div>

              <div className="badge">متجر رائد أعمال معتمد</div>

              <h1 className="store-title">{createdStore.storeName}</h1>
              <p className="owner-title">صاحب الابتكار: {createdStore.ownerName}</p>

              {/* صورة المنتج الفعلي */}
              <div className="product-box">
                <img src={createdStore.productImage} alt="Product" className="product-img" />
              </div>

              {/* رمز الـ QR */}
              <div className="qr-container">
                <img src={createdStore.qrDataUrl} alt="QR Code" className="qr-img" />
                <p className="qr-text">امسح الرمز لزيارة المتجر والشراء مباشرة</p>
              </div>

              {/* تذييل الورقة */}
              <div className="footer">
                <span>سلطنة عُمان - ريادة الأعمال والابتكار 2026</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* أنماط تنسيق صفحة الطباعة A5 */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .no-print {
            display: none !important;
          }
          .print-a5-sheet, .print-a5-sheet * {
            visibility: visible;
          }
          .print-a5-sheet {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 148mm;
            height: 210mm;
            margin: 0;
            padding: 12mm;
            box-sizing: border-box;
            background: #ffffff;
          }
          @page {
            size: A5 portrait;
            margin: 0;
          }
          .a5-content {
            border: 2px solid #153e4d;
            border-radius: 16px;
            height: 100%;
            padding: 16px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            text-align: center;
            font-family: 'Cairo', sans-serif;
          }
          .header h2 {
            font-size: 20px;
            color: #153e4d;
            margin: 0;
            font-weight: 800;
          }
          .header p {
            font-size: 10px;
            color: #64748b;
            margin: 2px 0 0;
          }
          .badge {
            background: #f8f3eb;
            color: #c59b5f;
            border: 1px solid #c59b5f;
            padding: 3px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: bold;
          }
          .store-title {
            font-size: 18px;
            color: #153e4d;
            margin: 4px 0 0;
            font-weight: bold;
          }
          .owner-title {
            font-size: 12px;
            color: #475569;
            margin: 0;
          }
          .product-box {
            width: 110mm;
            height: 65mm;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
          }
          .product-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .qr-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .qr-img {
            width: 38mm;
            height: 38mm;
          }
          .qr-text {
            font-size: 11px;
            font-weight: bold;
            color: #1e293b;
            margin-top: 4px;
          }
          .footer {
            font-size: 9px;
            color: #94a3b8;
            border-top: 1px solid #f1f5f9;
            width: 100%;
            padding-top: 4px;
          }
        }
      `}</style>
    </div>
  );
};