import React, { useState, useRef } from 'react';
import QRCode from 'qrcode';
import { GoogleGenAI } from '@google/genai';
import { db } from '../firebase'; // تأكد من مسار إعداد فايربيس في مشروعك
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
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
} from 'lucide-react';

interface KioskStoreCreatorProps {
  onBack?: () => void;
}

interface GeneratedStore {
  id: string;
  storeName: string;
  ownerName: string;
  productTitle: string;
  description: string;
  priceOMR: string;
  category: string;
  productImage: string;
  storeUrl: string;
  qrDataUrl: string;
}

export const KioskStoreCreator: React.FC<KioskStoreCreatorProps> = ({ onBack }) => {
  const [ownerName, setOwnerName] = useState('حذيفة الشعيلي');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  
  const [createdStore, setCreatedStore] = useState<GeneratedStore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // قراءة وضغط الصورة الملتقطة
  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        // استخراج كود Base64 النقي لإرساله لموديل Gemini
        const base64Data = result.split(',')[1];
        setImageBase64(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  // الدالة الذكية لتحليل المجسم عبر Gemini وحفظ المتجر في Firebase
  const handleAnalyzeAndCreateStore = async () => {
    if (!imageBase64 || !ownerName.trim()) {
      setErrorMsg('يرجى كتابة اسمك والتقاط صورة للمجسم أولاً');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setStatusMessage('جارٍ فحص وتحليل المجسم بواسطة الذكاء الاصطناعي...');

    try {
      // 1. استدعاء Gemini لتحليل الصورة
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `أنت خبير اقتصادي ومقيم ابتكارات في منصة "مُنتجي" العُمانية.
قم بتحليل صورة هذا المجسم أو النموذج المصنوع في المعرض/البوث، واستخرج الآتي بصيغة JSON حصرية ودقيقة:
{
  "productTitle": "اسم ابتكاري وجذاب للمنتج بالعربية يناسب الهوية العمانية والابتكار",
  "category": "تصنيف المنتج مثل: ابتكار تقني، حرف تراثية، طاقة متجددة، بيئة، تعليم",
  "priceOMR": "سعر تقديري مناسب بالريال العماني مع 3 خانات عشرية (مثال: 18.500)",
  "description": "وصف تسويقي ملهم وموجز من سطرين يبرز فائدة الابتكار",
  "storeSuggestedName": "اسم مقترح للمتجر يرتبط برائد الأعمال ${ownerName}"
}
أجب بكود JSON فقط وبدون أي نصوص إضافية.`;

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

      setStatusMessage('جارٍ استخراج وتنسيق بيانات المتجر...');
      const responseText = response.text || '{}';
      
      // تنظيف النص واستخراج الـ JSON
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const aiData = jsonMatch ? JSON.parse(jsonMatch[0]) : {
        productTitle: 'مجسم الابتكار العُماني',
        category: 'ابتكار وطني',
        priceOMR: '20.000',
        description: 'ابتكار وطني واعد تم تصميمه وتدشينه عبر منصة مُنتجي',
        storeSuggestedName: `متجر ${ownerName} للابتكار`,
      };

      // 2. حفظ المتجر في قاعدة بيانات Firebase Firestore
      setStatusMessage('جارٍ تسجيل وتدشين المتجر في السوق العماني...');
      const storeId = 'om-' + Date.now().toString().slice(-6);
      
      const newStoreDoc = {
        storeId,
        ownerName: ownerName.trim(),
        storeName: aiData.storeSuggestedName || `متجر ${ownerName}`,
        productTitle: aiData.productTitle,
        category: aiData.category,
        priceOMR: aiData.priceOMR,
        description: aiData.description,
        productImage: imagePreview,
        createdAt: serverTimestamp(),
        status: 'active',
        verified: true,
      };

      try {
        await addDoc(collection(db, 'stores'), newStoreDoc);
      } catch (dbErr) {
        console.warn('Firebase save fallback:', dbErr);
      }

      // 3. توليد رمز QR صالح يفتح صفحة المتجر مباشرة
      setStatusMessage('جارٍ توليد رمز الـ QR وبطاقة A5 الرسمية...');
      const origin = typeof window !== 'undefined' && window.location.origin && !window.location.origin.includes('localhost')
        ? window.location.origin
        : 'https://montji-om.vercel.app';

      const finalStoreUrl = `${origin}/#marketplace?store=${storeId}`;

      const qrUrl = await QRCode.toDataURL(finalStoreUrl, {
        width: 380,
        margin: 2,
        color: {
          dark: '#153e4d',
          light: '#ffffff',
        },
      });

      setCreatedStore({
        id: storeId,
        storeName: newStoreDoc.storeName,
        ownerName: newStoreDoc.ownerName,
        productTitle: newStoreDoc.productTitle,
        description: newStoreDoc.description,
        priceOMR: newStoreDoc.priceOMR,
        category: newStoreDoc.category,
        productImage: imagePreview!,
        storeUrl: finalStoreUrl,
        qrDataUrl: qrUrl,
      });

    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setErrorMsg('حدث خطأ أثناء الاتصال بالذكاء الاصطناعي: ' + (err.message || 'يرجى التحقق من مفتاح الـ API'));
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-[calc(100vh-140px)] bg-[#f8fafb] py-8 px-4 sm:px-6 lg:px-8 font-sans" dir="rtl">
      {/* تنسيقات الطباعة الصارمة لورقة A5 واحدة بالإطار العماني */}
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
            page-break-after: avoid !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* الرأس التوجيهي */}
      <div className="max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          onClick={onBack || (() => (window.location.hash = ''))}
          className="flex items-center gap-2 bg-white text-[#153e4d] hover:bg-[#153e4d] hover:text-white px-5 py-2.5 rounded-2xl text-sm font-bold border border-slate-200 shadow-sm transition-all cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          العودة للرئيسية
        </button>

        <div className="text-center sm:text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c59b5f]/15 text-[#c59b5f] text-xs font-black border border-[#c59b5f]/30 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            تحليل المجسمات بالذكاء الاصطناعي 🇴🇲
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#153e4d]">
            شكّل مجسمك بالبوث وافتح متجرك فوراً
          </h1>
        </div>

        <div className="w-24 hidden lg:block"></div>
      </div>

      <div className="max-w-xl mx-auto print:hidden">
        {!createdStore ? (
          /* شاشة التقاط المجسم والتحليل الآلي */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                اسم رائد الأعمال / صانع المجسم:
              </label>
              <input
                type="text"
                placeholder="أدخل اسمك الكريم"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full bg-[#f8fafb] border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm font-semibold focus:outline-none focus:border-[#153e4d] focus:bg-white transition"
              />
            </div>

            {/* تصوير المجسم */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                صورة المجسم الفعلي:
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
                <div className="relative rounded-2xl overflow-hidden border-2 border-[#c59b5f] h-52 bg-slate-900 flex items-center justify-center">
                  <img src={imagePreview} alt="المجسم" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-[#153e4d] text-white text-xs px-3 py-1.5 rounded-xl border border-[#c59b5f]/50 flex items-center gap-1.5 font-bold shadow-md cursor-pointer hover:bg-[#1f5b70]"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    إعادة التصوير
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#153e4d] bg-[#f8fafb] hover:bg-slate-50 flex flex-col items-center justify-center gap-2.5 text-slate-500 hover:text-[#153e4d] transition-all cursor-pointer"
                >
                  <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
                    <Camera className="w-7 h-7 text-[#c59b5f]" />
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-bold block text-slate-700">اضغط لالتقاط صورة للمجسم بكاميرا البوث</span>
                    <span className="text-xs text-slate-400 mt-0.5 block">الذكاء الاصطناعي سيتعرف على نوع الابتكار ويسعّره فوراً</span>
                  </div>
                </button>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyzeAndCreateStore}
              disabled={isAnalyzing || !imagePreview || !ownerName.trim()}
              className="w-full bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] hover:text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-sm sm:text-base border border-[#c59b5f]/40"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>{statusMessage}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>تحليل المجسم وتدشين المتجر وإصدار A5</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* شاشة النجاح وعرض النتيجة المستخرجة بالذكاء الاصطناعي */
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>تم التعرف على المجسم وتدشين متجرك الوطني بنجاح!</span>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 sm:flex-none bg-[#c59b5f] hover:bg-[#b58b4f] text-white px-6 py-2.5 rounded-xl font-black text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  طباعة بطاقة A5 الرسمية
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatedStore(null);
                    setImagePreview(null);
                    setImageBase64(null);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                >
                  مجسم جديد
                </button>
              </div>
            </div>

            {/* بطاقة تحليل الذكاء الاصطناعي على الشاشة */}
            <div className="bg-[#112d38] rounded-3xl p-6 border-2 border-[#c59b5f] text-center text-white shadow-2xl space-y-4">
              <div className="inline-block bg-[#c59b5f]/20 border border-[#c59b5f] text-[#dfba83] px-3 py-0.5 rounded-full text-xs font-bold">
                ✓ متجر رائد أعمال معتمد 🇴🇲
              </div>

              <div>
                <h2 className="text-xl font-black">{createdStore.storeName}</h2>
                <p className="text-xs text-[#dfba83] mt-1 font-semibold">صاحب الابتكار: {createdStore.ownerName}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#0a1820]/80 p-3 rounded-2xl border border-[#1f5b70] text-right text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">الابتكار المستخرج:</span>
                  <span className="font-bold text-white">{createdStore.productTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">السعر التقديري:</span>
                  <span className="font-bold text-[#dfba83]">{createdStore.priceOMR} ر.ع</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-3 inline-block shadow-lg">
                <img src={createdStore.qrDataUrl} alt="QR Code" className="w-32 h-32 object-contain" />
              </div>
              <p className="text-xs text-emerald-400 font-bold">
                امسح الرمز بكاميرا هاتفك لفتح صفحة المتجر في السوق فوراً
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* البطاقة الرسمية للطباعة الفعلية A5 (تطبع ورقة واحدة فقط بالإطار العماني) */}
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
            {/* شريط ذهبي علوي */}
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

            {/* الترويسة الوطنية */}
            <div style={{ marginTop: '2px' }}>
              <div
                style={{
                  fontSize: '22px',
                  fontWeight: 900,
                  color: '#ffffff',
                  marginBottom: '1px',
                }}
              >
                مَنصّة مُنتَجي
              </div>
              <div
                style={{
                  fontSize: '10px',
                  color: '#dfba83',
                  fontWeight: 600,
                  marginBottom: '6px',
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
                  fontSize: '18px',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginTop: '6px',
                }}
              >
                {createdStore.storeName}
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                صاحب الابتكار: <strong style={{ color: '#dfba83' }}>{createdStore.ownerName}</strong>
              </div>
            </div>

            {/* إطار صورة المجسم الفعلي */}
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

              {/* شارة السعر المستخرج بالذكاء الاصطناعي */}
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

            {/* منطقة رمز QR الفعلي */}
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
