import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Camera,
  Printer,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2,
} from 'lucide-react';

export interface KioskStoreCreatorProps {
  onBack?: () => void;
}

interface CreatedStore {
  storeId: string;
  storeName: string;
  ownerName: string;
  productTitle: string;
  priceOMR: string;
  productImage: string;
  storeUrl: string;
  qrDataUrl: string;
}

export const KioskStoreCreator: React.FC<KioskStoreCreatorProps> = ({ onBack }) => {
  const [ownerName, setOwnerName] = useState('حذيفة الشعيلي');
  const [storeName, setStoreName] = useState('متجر الابتكار الوطني');
  const [productTitle, setProductTitle] = useState('مجسم الذكاء الاصطناعي العُماني');
  const [priceOMR, setPriceOMR] = useState('25.000');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createdStore, setCreatedStore] = useState<CreatedStore | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // اختيار الصورة أو التقاطها عبر الكاميرا
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // إنشاء المتجر وتوليد رمز QR صالح 100% يفتح بالهاتف
  const handleCreateStore = async () => {
    if (!ownerName.trim()) return;
    setIsProcessing(true);

    try {
      // معرف المتجر
      const storeId = 'om-' + Date.now().toString().slice(-6);

      // تحديد النطاق الأساسي الصحيح
      const origin =
        typeof window !== 'undefined' &&
        window.location.origin &&
        !window.location.origin.includes('localhost')
          ? window.location.origin
          : 'https://montji-om.vercel.app';

      // رابط مباشر معتمد للسوق والمنتج
      const targetStoreUrl = `${origin}/#marketplace`;

      // توليد صورة الـ QR بدقة وضوح عالية وتدرج لوني كحلي المنصة
      const qrUrl = await QRCode.toDataURL(targetStoreUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#153e4d',
          light: '#ffffff',
        },
      });

      setCreatedStore({
        storeId,
        storeName: storeName.trim() || `متجر ${ownerName}`,
        ownerName: ownerName.trim(),
        productTitle: productTitle.trim() || 'ابتكار رائد أعمال عُماني',
        priceOMR: priceOMR || '20.000',
        productImage: imagePreview || '',
        storeUrl: targetStoreUrl,
        qrDataUrl: qrUrl,
      });
    } catch (err) {
      console.error('Failed to generate QR:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // أمر الطباعة الفورية بمقاس A5
  const handlePrintA5 = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b1c24] text-slate-100 py-6 px-4 sm:px-6 font-sans" dir="rtl">
      {/* أنماط الطباعة الصارمة الموجهة لصفحة واحدة A5 فقط مع الإطار العماني */}
      <style>{`
        @media print {
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            width: 148mm !important;
            height: 210mm !important;
            overflow: hidden !important;
          }
          body * {
            visibility: hidden !important;
          }
          #print-a5-sheet, #print-a5-sheet * {
            visibility: visible !important;
          }
          #print-a5-sheet {
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 148mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 10mm !important;
            box-sizing: border-box !important;
            background: #112d38 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
          @page {
            size: A5 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* شريط الرأس التوجيهي (يختفي في الطباعة) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <button
          onClick={onBack || (() => (window.location.hash = ''))}
          className="flex items-center gap-2 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] px-4 py-2 rounded-xl text-sm font-bold border border-[#c59b5f]/40 transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </button>

        <div className="text-center">
          <span className="text-[11px] bg-[#c59b5f]/20 text-[#dfba83] px-3 py-1 rounded-full font-bold border border-[#c59b5f]/40 inline-flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b5f]" />
            ركن الابتكار والفعاليات 🇴🇲
          </span>
          <h1 className="text-xl font-black text-white mt-1">شكّل مجسمك بالبوث وافتح متجرك فوراً</h1>
        </div>

        <div className="w-24 hidden sm:block"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        {!createdStore ? (
          /* نموذج الإدخال والتصوير */
          <div className="bg-[#122e3a] p-6 sm:p-8 rounded-3xl border border-[#1f5b70] shadow-2xl max-w-xl mx-auto">
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#153e4d] rounded-2xl flex items-center justify-center mx-auto border border-[#c59b5f]/50 mb-3 text-[#dfba83]">
                <Camera className="w-7 h-7" />
              </div>
              <h2 className="text-lg font-bold text-white">بيانات رائد الأعمال والمجسم</h2>
              <p className="text-xs text-slate-400 mt-1">
                صوّر ابتكارك بكاميرا البوث ليتم توليد كرت متجرك مقاس A5 برمز QR معتمد
              </p>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  اسم صاحب الابتكار / رائد الأعمال:
                </label>
                <input
                  type="text"
                  placeholder="مثال: حذيفة الشعيلي"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-[#0a1820] border border-[#1f5b70] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c59b5f]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">اسم المتجر الوطني:</label>
                <input
                  type="text"
                  placeholder="مثال: متجر حذيفة الشعيلي"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full bg-[#0a1820] border border-[#1f5b70] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#c59b5f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان المنتج / الابتكار:</label>
                  <input
                    type="text"
                    placeholder="مثال: مجسم ذكي"
                    value={productTitle}
                    onChange={(e) => setProductTitle(e.target.value)}
                    className="w-full bg-[#0a1820] border border-[#1f5b70] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#c59b5f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">السعر (ر.ع):</label>
                  <input
                    type="text"
                    placeholder="مثال: 25.000"
                    value={priceOMR}
                    onChange={(e) => setPriceOMR(e.target.value)}
                    className="w-full bg-[#0a1820] border border-[#1f5b70] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#c59b5f]"
                  />
                </div>
              </div>

              {/* التقاط أو رفع الصورة */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">صورة المجسم / النموذج:</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleImageCapture}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[#c59b5f] h-48 bg-black/50 flex items-center justify-center">
                    <img src={imagePreview} alt="المجسم" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-[#122e3a]/90 text-[#dfba83] text-xs px-3 py-1.5 rounded-lg border border-[#c59b5f]/50 flex items-center gap-1 font-bold"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      تغيير الصورة
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-2xl border-2 border-dashed border-[#1f5b70] hover:border-[#c59b5f] bg-[#0a1820]/60 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Camera className="w-8 h-8 text-[#c59b5f]" />
                    <span className="text-xs font-bold">التقط صورة المجسم الآن بكاميرا الهاتف أو الجهاز</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleCreateStore}
                disabled={isProcessing || !ownerName.trim()}
                className="w-full bg-gradient-to-r from-[#c59b5f] to-[#dfba83] hover:from-[#b58b4f] hover:to-[#c59b5f] text-[#0b1c24] font-black py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-4 text-sm"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    جاري اعتماد المتجر وإصدار بطاقة A5...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    اعتماد المتجر وتوليد بطاقة الـ A5
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* شاشة المعاينة بعد الإنشاء مع زر الطباعة الفورية */
          <div className="space-y-6">
            {/* شريط الإجراءات والتحكم */}
            <div className="bg-[#122e3a] p-4 rounded-2xl border border-[#1f5b70] flex flex-col sm:flex-row justify-between items-center gap-4 shadow-xl print:hidden">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                <span>تم تدشين المتجر وإعداد بطاقة الطباعة A5 بنجاح!</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrintA5}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-[#c59b5f] to-[#dfba83] text-[#0b1c24] px-6 py-2.5 rounded-xl font-black text-sm hover:scale-102 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#0b1c24]" />
                  طباعة بطاقة المتجر (A5)
                </button>
                <button
                  type="button"
                  onClick={() => setCreatedStore(null)}
                  className="bg-[#153e4d] hover:bg-[#1f5b70] text-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs border border-[#1f5b70] transition cursor-pointer"
                >
                  مجسم آخر
                </button>
              </div>
            </div>

            {/* معاينة شاشة المتجر قبل الطباعة */}
            <div className="bg-[#122e3a] p-6 rounded-3xl border border-[#1f5b70] text-center max-w-sm mx-auto shadow-2xl print:hidden">
              <span className="text-[11px] text-[#dfba83] bg-[#153e4d] border border-[#c59b5f]/50 px-3 py-1 rounded-full font-bold inline-block mb-3">
                معاينة البطاقة قبل الطباعة
              </span>
              <h2 className="text-lg font-black text-white">{createdStore.storeName}</h2>
              <p className="text-xs text-slate-400 mt-1">رائد الأعمال: {createdStore.ownerName}</p>

              {createdStore.productImage ? (
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#c59b5f]/60 my-4 bg-black/40">
                  <img src={createdStore.productImage} alt="المنتج" className="w-full h-full object-cover" />
                </div>
              ) : null}

              <div className="bg-white rounded-2xl p-3 inline-block shadow-lg my-2">
                <img src={createdStore.qrDataUrl} alt="QR Code" className="w-28 h-28 object-contain" />
              </div>
              <p className="text-xs text-emerald-400 font-bold mt-1">الرمز جاهز وقابل للمسح الفوري بالهاتف</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* البطاقة المعدة للطباعة الفعلية A5 (المجهزة بالإطار العماني الكحلي والذهبي) */}
      {/* ========================================================================= */}
      {createdStore && (
        <div id="print-a5-sheet" className="hidden">
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#112d38',
              border: '4px solid #c59b5f',
              borderRadius: '20px',
              padding: '16px',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              textAlign: 'center',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              fontFamily: "'Cairo', 'Segoe UI', sans-serif",
            }}
          >
            {/* شريط الزخرفة العلوي */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #c59b5f 0%, #dfba83 50%, #c59b5f 100%)',
              }}
            />

            {/* الترويسة الرسمية */}
            <div style={{ marginTop: '4px' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '0.5px',
                  marginBottom: '2px',
                }}
              >
                مَنصّة مُنتَجي
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#dfba83',
                  fontWeight: 600,
                  marginBottom: '8px',
                }}
              >
                المنظومة الوطنية للمشاريع العُمانية • عُمان 2040
              </div>

              <div
                style={{
                  display: 'inline-block',
                  background: 'rgba(197, 155, 95, 0.15)',
                  border: '1px solid #c59b5f',
                  color: '#dfba83',
                  padding: '2px 14px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                }}
              >
                متجر رائد أعمال معتمد 🇴🇲
              </div>

              <div
                style={{
                  fontSize: '19px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '8px',
                }}
              >
                {createdStore.storeName}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                صاحب الابتكار: <strong style={{ color: '#dfba83' }}>{createdStore.ownerName}</strong>
              </div>
            </div>

            {/* إطار صورة المجسم الحقيقي */}
            <div
              style={{
                width: '108mm',
                height: '60mm',
                borderRadius: '14px',
                border: '2px solid #c59b5f',
                overflow: 'hidden',
                background: '#0a1820',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)',
              }}
            >
              {createdStore.productImage ? (
                <img
                  src={createdStore.productImage}
                  alt="مجسم المنتج"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ color: '#dfba83', fontSize: '13px', fontWeight: 'bold' }}>
                  {createdStore.productTitle}
                </div>
              )}

              {/* شارة السعر بالريال العماني */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '6px',
                  right: '6px',
                  background: 'rgba(17, 45, 56, 0.95)',
                  color: '#dfba83',
                  padding: '3px 10px',
                  borderRadius: '8px',
                  border: '1px solid #c59b5f',
                  fontSize: '11px',
                  fontWeight: 800,
                }}
              >
                {createdStore.priceOMR} ر.ع
              </div>
            </div>

            {/* منطقة رمز الـ QR المعتمد والواضح للمسح */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #dfba83',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={createdStore.qrDataUrl}
                alt="QR Code"
                style={{ width: '34mm', height: '34mm', display: 'block' }}
              />
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 900,
                  color: '#153e4d',
                  marginTop: '4px',
                }}
              >
                امسح الرمز لزيارة المتجر والشراء مباشرة
              </span>
            </div>

            {/* تذييل الكرت الرسمي */}
            <div
              style={{
                borderTop: '1px solid rgba(197, 155, 95, 0.4)',
                width: '100%',
                paddingTop: '6px',
                fontSize: '9px',
                color: '#94a3b8',
              }}
            >
              سلطنة عُمان • ريادة الأعمال والابتكار 2026 • منصة مُنتجي
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
