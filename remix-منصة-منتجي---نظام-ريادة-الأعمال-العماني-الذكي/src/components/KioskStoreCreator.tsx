import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { GoogleGenAI } from '@google/genai';
import {
  Camera,
  Printer,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Award,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Store,
  Tag,
  Share2,
} from 'lucide-react';

interface KioskStoreCreatorProps {
  onBack?: () => void;
}

interface CustomStore {
  storeId: string;
  storeName: string;
  ownerName: string;
  productTitle: string;
  description: string;
  priceOMR: string;
  category: string;
  productImage: string;
  storeUrl: string;
  qrDataUrl: string;
  createdAt: string;
}

export const KioskStoreCreator: React.FC<KioskStoreCreatorProps> = ({ onBack }) => {
  const [ownerName, setOwnerName] = useState('حذيفة الشعيلي');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  const [createdStore, setCreatedStore] = useState<CustomStore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // التقاط وقراءة الصورة من كاميرا الجوال أو الألبوم
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        const base64Data = result.split(',')[1];
        setImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  // معالجة وتحليل وتوليد المتجر الخاص
  const handleAnalyzeAndCreateStore = async () => {
    if (!imageBase64 || !ownerName.trim()) {
      setErrorMsg('يرجى كتابة اسمك والتقاط صورة للمنتج/المجسم أولاً');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setStatusMessage('جارٍ فحص وتحليل المنتج بالذكاء الاصطناعي...');

    try {
      const apiKey =
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        '';

      let aiData = {
        productTitle: 'مجسم الابتكار العُماني الذكي',
        category: 'ابتكار وطني',
        priceOMR: '25.000',
        description: 'منتج ابتكاري عُماني رائد تم تدشينه وإدراجه عبر منصة مُنتجي الوطنية.',
        storeSuggestedName: `متجر ${ownerName.trim()}`,
      };

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `أنت خبير اقتصادي ومقيم ابتكارات في منصة "مُنتجي" العُمانية.
حلل صورة هذا المنتج أو المجسم واستخرج الآتي بصيغة JSON حصرية ودقيقة:
{
  "productTitle": "اسم ابتكاري وجذاب للمنتج بالعربية",
  "category": "تصنيف المنتج",
  "priceOMR": "سعر تقديري بالريال العماني بـ 3 خانات عشرية (مثال: 22.500)",
  "description": "وصف تسويقي احترافي ومختصر في حدود سطرين",
  "storeSuggestedName": "اسم المتجر المقترح لصاحبه ${ownerName}"
}
أجب بـ JSON فقط.`;

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [
                  { text: prompt },
                  {
                    inlineData: {
                      mimeType: imageMimeType,
                      data: imageBase64,
                    },
                  },
                ],
              },
            ],
          });

          const responseText = response.text || '{}';
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiData = { ...aiData, ...JSON.parse(jsonMatch[0]) };
          }
        } catch (aiErr) {
          console.warn('AI fallback active:', aiErr);
        }
      }

      setStatusMessage('جارٍ بناء متجرك الخاص وتوليد رمز QR...');
      
      // معرف فريد وخاص بمتجرك
      const uniqueStoreId = 'store-' + Date.now().toString().slice(-6);

      const origin =
        typeof window !== 'undefined' &&
        window.location.origin &&
        !window.location.origin.includes('localhost')
          ? window.location.origin
          : 'https://montji-om.vercel.app';

      // رابط مباشر إلى متجرك الخاص
      const personalStoreUrl = `${origin}/#store?id=${uniqueStoreId}`;

      // حفظ المتجر في سجلات المتصفح لربطه فوراً
      const storeRecord: CustomStore = {
        storeId: uniqueStoreId,
        storeName: aiData.storeSuggestedName,
        ownerName: ownerName.trim(),
        productTitle: aiData.productTitle,
        description: aiData.description,
        priceOMR: aiData.priceOMR,
        category: aiData.category,
        productImage: imagePreview!,
        storeUrl: personalStoreUrl,
        qrDataUrl: '',
        createdAt: new Date().toLocaleDateString('ar-OM'),
      };

      // توليد رمز QR عالي الدقة
      const qrUrl = await QRCode.toDataURL(personalStoreUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#153e4d',
          light: '#ffffff',
        },
      });

      storeRecord.qrDataUrl = qrUrl;

      try {
        const currentStores = JSON.parse(localStorage.getItem('montji_user_stores') || '[]');
        currentStores.unshift(storeRecord);
        localStorage.setItem('montji_user_stores', JSON.stringify(currentStores));
        localStorage.setItem('montji_active_store', JSON.stringify(storeRecord));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      // الانتقال المباشر لواجهة المتجر الخاص بك
      setCreatedStore(storeRecord);

    } catch (err: any) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء إعداد المتجر: ' + (err.message || 'حاول مجدداً'));
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafb] text-slate-800 pb-16 font-sans antialiased" dir="rtl">
      {/* تنسيقات الطباعة A5 المخصصة */}
      <style>{`
        @media print {
          @page {
            size: A5 portrait;
            margin: 0;
          }
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
          #kiosk-print-sheet, #kiosk-print-sheet * {
            visibility: visible !important;
          }
          #kiosk-print-sheet {
            display: block !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 148mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 8mm !important;
            box-sizing: border-box !important;
            background: #112d38 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      {/* الشريط العلوي للجوال والكمبيوتر */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between print:hidden">
        <button
          onClick={onBack || (() => (window.location.hash = ''))}
          className="flex items-center gap-1.5 text-xs font-bold text-[#153e4d] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>
        <span className="text-xs font-black text-[#153e4d] truncate max-w-[200px]">
          {createdStore ? createdStore.storeName : 'تدشين متجرك الفوري'}
        </span>
        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5 print:hidden">
        {!createdStore ? (
          /* واجهة الجوال لإدخال البيانات والتصوير */
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#153e4d]/10 text-[#153e4d] rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Store className="w-6 h-6 text-[#c59b5f]" />
              </div>
              <h1 className="text-lg font-black text-[#153e4d]">شكّل مجسمك وافتح متجرك فوراً</h1>
              <p className="text-xs text-slate-500">
                التقط صورة لمنتجك، وسيقوم الذكاء الاصطناعي ببناء متجرك الخاص وتجهيز بطاقة A5 للطباعة
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسم رائد الأعمال / صانع المجسم:
                </label>
                <input
                  type="text"
                  placeholder="أدخل اسمك الكريم"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#153e4d] focus:bg-white transition"
                />
              </div>

              {/* منطقة التصوير المخصصة للهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  صورة المنتج أو الابتكار:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={fileInputRef}
                  onChange={handleImageCapture}
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[#c59b5f] h-48 bg-slate-900 flex items-center justify-center">
                    <img src={imagePreview} alt="معاينة المجسم" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-[#153e4d]/90 text-white text-[11px] px-3 py-1.5 rounded-xl border border-[#c59b5f]/50 flex items-center gap-1 font-bold shadow"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      إعادة الالتقاط
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-40 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#153e4d] bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500 active:scale-98 transition"
                  >
                    <div className="w-11 h-11 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
                      <Camera className="w-5 h-5 text-[#c59b5f]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">اضغط لالتقاط صورة المجسم بالكاميرا</span>
                    <span className="text-[10px] text-slate-400">سيتعرف الذكاء الاصطناعي على نوع المنتج وسعره</span>
                  </button>
                )}
              </div>

              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyzeAndCreateStore}
                disabled={isAnalyzing || !imagePreview || !ownerName.trim()}
                className="w-full bg-[#153e4d] text-[#dfba83] font-black py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50 text-xs sm:text-sm border border-[#c59b5f]/40"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تحليل المجسم وإنشاء متجري الخاص فوراً</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* واجهة المتجر الخاص بك المنشأ (مخصصة ومحسنة للجوال 100%) */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* بنر التهنئة */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم تدشين متجرك الخاص بنجاح!</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                نشط أونلاين
              </span>
            </div>

            {/* بطاقة واجهة المتجر الخاصة بك */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
              {/* هيدر المتجر */}
              <div className="bg-[#153e4d] p-5 text-white text-center relative">
                <span className="inline-block bg-[#c59b5f]/20 border border-[#c59b5f]/60 text-[#dfba83] text-[10px] font-bold px-3 py-0.5 rounded-full mb-2">
                  متجر رائد أعمال معتمد 🇴🇲
                </span>
                <h2 className="text-lg font-black text-white">{createdStore.storeName}</h2>
                <p className="text-xs text-[#dfba83] mt-0.5 font-medium">
                  المالك: {createdStore.ownerName}
                </p>
              </div>

              {/* صورة المنتج وتفاصيله */}
              <div className="p-4 space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                  <img
                    src={createdStore.productImage}
                    alt={createdStore.productTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-[#153e4d]/90 text-[#dfba83] border border-[#c59b5f]/40 px-2.5 py-1 rounded-xl text-xs font-black">
                    {createdStore.priceOMR} ر.ع
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-sm text-[#153e4d]">{createdStore.productTitle}</h3>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                      {createdStore.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {createdStore.description}
                  </p>
                </div>

                {/* كرت الـ QR الخاص بالمتجر */}
                <div className="bg-[#f8fafb] border border-slate-200 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 text-right">
                    <span className="text-xs font-black text-[#153e4d] block">امسح لزيارة المتجر</span>
                    <span className="text-[10px] text-slate-500 block">
                      وجه كاميرا أي هاتف لفتح متجرك والشراء مباشرة
                    </span>
                  </div>
                  <div className="bg-white p-1 rounded-xl border border-slate-200 shrink-0">
                    <img src={createdStore.qrDataUrl} alt="QR Code" className="w-16 h-16 object-contain" />
                  </div>
                </div>

                {/* أزرار الإجراءات السريعة للجوال */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="bg-[#c59b5f] hover:bg-[#b58b4f] text-white py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة بطاقة A5</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: createdStore.storeName,
                          text: `تفضل بزيارة متجري على منصة مُنتجي: ${createdStore.productTitle}`,
                          url: createdStore.storeUrl,
                        });
                      } else {
                        navigator.clipboard.writeText(createdStore.storeUrl);
                        alert('تم نسخ رابط متجرك الخاص بنجاح!');
                      }
                    }}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4 text-[#153e4d]" />
                    <span>مشاركة الرابط</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCreatedStore(null);
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="w-full text-center text-xs text-slate-400 hover:text-slate-600 font-bold py-1.5"
                >
                  تدشين مجسم أو منتج آخر
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* البطاقة المعدة للطباعة A5 بالإطار العماني الكحلي والذهبي (صفحة واحدة فقط) */}
      {/* ========================================================================= */}
      {createdStore && (
        <div id="kiosk-print-sheet" className="hidden">
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
            {/* شريط علوي ذهبي */}
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

            {/* الترويسة */}
            <div style={{ marginTop: '2px' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#ffffff', marginBottom: '1px' }}>
                مَنصّة مُنتَجي
              </div>
              <div style={{ fontSize: '10px', color: '#dfba83', fontWeight: 600, marginBottom: '6px' }}>
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
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                {createdStore.storeName}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                صاحب الابتكار: <strong style={{ color: '#dfba83' }}>{createdStore.ownerName}</strong>
              </div>
            </div>

            {/* إطار صورة المجسم */}
            <div
              style={{
                width: '110mm',
                height: '60mm',
                borderRadius: '14px',
                border: '2px solid #c59b5f',
                overflow: 'hidden',
                background: '#0a1820',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={createdStore.productImage}
                alt="المجسم"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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

            {/* رمز الـ QR الخاص بمتجرك */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: '14px',
                padding: '8px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: '2px solid #dfba83',
              }}
            >
              <img
                src={createdStore.qrDataUrl}
                alt="QR Code"
                style={{ width: '34mm', height: '34mm', display: 'block' }}
              />
              <span style={{ fontSize: '10px', fontWeight: 900, color: '#153e4d', marginTop: '4px' }}>
                امسح الرمز لزيارة المتجر والشراء مباشرة
              </span>
            </div>

            {/* تذييل الكرت */}
            <div
              style={{
                borderTop: '1px solid rgba(197, 155, 95, 0.4)',
                width: '100%',
                paddingTop: '4px',
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
