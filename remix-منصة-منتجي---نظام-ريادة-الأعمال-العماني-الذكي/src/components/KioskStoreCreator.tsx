import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import {
  Camera,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Store,
  Phone,
  User,
  ShieldCheck,
  ShoppingBag as CartIcon,
} from 'lucide-react';
import { processAndCompressImage } from '../utils/imageUpload';

interface KioskStoreCreatorProps {
  onBack?: () => void;
  onNavigate?: (view: string) => void;
}

interface CustomStore {
  storeId: string;
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  productTitle: string;
  description: string;
  priceOMR: string;
  category: string;
  productImage: string;
  createdAt: string;
}

export const KioskStoreCreator: React.FC<KioskStoreCreatorProps> = ({ onBack, onNavigate }) => {
  const [ownerName, setOwnerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');

  const [createdStore, setCreatedStore] = useState<CustomStore | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ضغط ومعالجة الصورة المباشرة لتفادي انهيار الذاكرة وتسريع الذكاء الاصطناعي
  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setErrorMsg('');
        // ضغط ذكي بدقة ممتازة وجودة 85% لتقليل الحجم وتسريع الرفع
        const compressed = await processAndCompressImage(file, 1000, 0.85);
        setImagePreview(compressed.dataUrl);
        setImageMimeType('image/jpeg');
        const base64Data = compressed.dataUrl.split(',')[1];
        setImageBase64(base64Data);
      } catch (err) {
        // بديل احتياطي إذا لم تكتمل المعالجة
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setImageMimeType(file.type || 'image/jpeg');
          const base64Data = result.split(',')[1];
          setImageBase64(base64Data);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // معالجة وتحليل وتوليد المتجر الخاص
  const handleAnalyzeAndCreateStore = async () => {
    if (!ownerName.trim()) {
      setErrorMsg('يرجى إدخال اسمك الكريم');
      return;
    }

    if (!phoneNumber.trim()) {
      setErrorMsg('يرجى إدخال رقم هاتفك للتواصل');
      return;
    }

    if (!imageBase64) {
      setErrorMsg('يرجى التقاط صورة لمنتجك أو مجسمك');
      return;
    }

    setErrorMsg('');
    setIsAnalyzing(true);
    setStatusMessage('جارٍ فحص وتحليل المنتج بالذكاء الاصطناعي وتقدير السعر...');

    try {
      const apiKey =
        (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) ||
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        '';

      let aiData = {
        productTitle: `ابتكار ${ownerName.trim()}`,
        category: 'تقنية وابتكار',
        priceOMR: '15.000',
        description: `منتج ابتكاري واعد تم تصميمه بواسطة ${ownerName.trim()} عبر منصة مُنتجي الوطنية.`,
        storeSuggestedName: `متجر ${ownerName.trim()}`,
      };

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const prompt = `أنت خبير اقتصادي ومقيم ابتكارات في منصة "مُنتجي" العُمانية.
حلل صورة هذا المنتج أو المجسم واستخرج الآتي بصيغة JSON حصرية ودقيقة:
{
  "productTitle": "اسم ابتكاري وجذاب للمنتج بالعربية",
  "category": "تصنيف المنتج (مثال: تقنية وابتكار، حرف يدوية، عطور، أغذية)",
  "priceOMR": "سعر تقديري مناسب بالريال العماني بـ 3 خانات عشرية (مثال: 18.500)",
  "description": "وصف تسويقي احترافي ومختصر في حدود سطرين",
  "storeSuggestedName": "اسم المتجر المقترح لصاحبه ${ownerName.trim()}"
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
          console.warn('AI analysis fallback used:', aiErr);
        }
      }

      setStatusMessage('جارٍ تدشين متجرك الخاص وعرض المنتج...');

      const uniqueStoreId = 'store-' + Date.now().toString().slice(-6);

      const storeRecord: CustomStore = {
        storeId: uniqueStoreId,
        storeName: aiData.storeSuggestedName,
        ownerName: ownerName.trim(),
        phoneNumber: phoneNumber.trim(),
        productTitle: aiData.productTitle,
        description: aiData.description,
        priceOMR: aiData.priceOMR,
        category: aiData.category,
        productImage: imagePreview!,
        createdAt: new Date().toLocaleDateString('ar-OM'),
      };

      // حفظ آمن في الذاكرة المحلية مع حماية كاملة من الأخطاء
      try {
        const currentStores = JSON.parse(localStorage.getItem('montji_user_stores') || '[]');
        currentStores.unshift(storeRecord);
        localStorage.setItem('montji_user_stores', JSON.stringify(currentStores));
        localStorage.setItem('montji_active_store', JSON.stringify(storeRecord));
      } catch (err) {
        console.warn('LocalStorage limit exceeded, proceeding smoothly:', err);
      }

      setCreatedStore(storeRecord);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('حدث خطأ أثناء تدشين المتجر: ' + (err.message || 'حاول مجدداً'));
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  const handleReset = () => {
    setCreatedStore(null);
    setImagePreview(null);
    setImageBase64(null);
    setOwnerName('');
    setPhoneNumber('');
    setErrorMsg('');
  };

  return (
    <div className="w-full min-h-screen bg-[#f8fafb] text-slate-800 pb-16 font-sans antialiased" dir="rtl">
      {/* الشريط العلوي */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between">
        <button
          onClick={onBack || (() => (window.location.hash = ''))}
          className="flex items-center gap-1.5 text-xs font-bold text-[#153e4d] bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>
        <span className="text-xs font-black text-[#153e4d] truncate max-w-[200px]">
          {createdStore ? createdStore.storeName : 'تدشين متجرك الفوري'}
        </span>
        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto px-4 py-5">
        {!createdStore ? (
          /* واجهة إدخال البيانات والتصوير */
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-[#153e4d]/10 text-[#153e4d] rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Store className="w-6 h-6 text-[#c59b5f]" />
              </div>
              <h1 className="text-lg font-black text-[#153e4d]">شكّل منتجك وافتح متجرك فوراً 🇴🇲</h1>
              <p className="text-xs text-slate-500">
                صوّر مجسمك أو منتجك، وسيقوم الذكاء الاصطناعي بتقدير السعر وتدشين متجرك المباشر
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {/* حقل اسم صاحب المتجر */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  اسمك الكريم (صاحب المتجر):
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="مثال: أحمد بن سعيد المعمري"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#153e4d] focus:bg-white transition"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* حقل رقم الهاتف */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  رقم الهاتف (للتواصل والطلبات):
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="+968 9XXXXXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#153e4d] focus:bg-white transition text-right"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* منطقة التصوير المباشر */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  صورة المنتج أو المجسم:
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
                    <img src={imagePreview} alt="معاينة المنتج" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-[#153e4d]/90 text-white text-[11px] px-3 py-1.5 rounded-xl border border-[#c59b5f]/50 flex items-center gap-1 font-bold shadow cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      إعادة الالتقاط
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#153e4d] bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-500 active:scale-98 transition cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center border border-slate-200">
                      <Camera className="w-5 h-5 text-[#c59b5f]" />
                    </div>
                    <span className="text-xs font-bold text-slate-700">اضغط لالتقاط صورة المنتج بالكاميرا</span>
                    <span className="text-[10px] text-slate-400">سيتعرف الذكاء الاصطناعي على المنتج ويقترح سعره</span>
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
                disabled={isAnalyzing || !imagePreview || !ownerName.trim() || !phoneNumber.trim()}
                className="w-full bg-[#153e4d] hover:bg-[#1a4a5c] text-[#dfba83] font-black py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition disabled:opacity-50 text-xs sm:text-sm border border-[#c59b5f]/40 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{statusMessage}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>تدشين متجري وعرض المنتج فوراً ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* واجهة المتجر الخاص للعميل بعد التدشين مع منتجه وسعره */
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* إشعار النجاح */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم فتح متجرك الخاص وعرض المنتج بنجاح!</span>
              </div>
              <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                متجر نشط 🟢
              </span>
            </div>

            {/* بطاقة واجهة المتجر الخاصة بالعميل */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
              {/* واجهة المتجر العلوية (Store Header) */}
              <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#122e3a] p-6 text-white text-center relative border-b-2 border-[#c59b5f]/40">
                <span className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 border border-[#c59b5f]/60 text-[#dfba83] text-[10px] font-bold px-3 py-1 rounded-full mb-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#c59b5f]" />
                  <span>متجر معتمد - منصة مُنتجي 🇴🇲</span>
                </span>
                <h2 className="text-xl font-black text-white">{createdStore.storeName}</h2>
                <div className="flex items-center justify-center gap-3 text-xs text-[#dfba83] mt-1.5 font-medium">
                  <span>المالك: {createdStore.ownerName}</span>
                  <span>•</span>
                  <span dir="ltr">{createdStore.phoneNumber}</span>
                </div>
              </div>

              {/* قسم عرض المنتج المعروض داخل المتجر */}
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                    <CartIcon className="w-4 h-4 text-[#c59b5f]" />
                    <span>المنتج المعروض للبيع في متجرك:</span>
                  </span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                    {createdStore.category}
                  </span>
                </div>

                {/* صورة المنتج مع السعر البارز */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-slate-200 aspect-square sm:aspect-video bg-slate-100 shadow-sm">
                  <img
                    src={createdStore.productImage}
                    alt={createdStore.productTitle}
                    className="w-full h-full object-cover"
                  />
                  {/* شارة السعر المعتمد */}
                  <div className="absolute bottom-3 right-3 bg-[#153e4d]/95 backdrop-blur-xs text-[#dfba83] border border-[#c59b5f]/60 px-3 py-1.5 rounded-xl text-sm font-black shadow-lg">
                    <span>{createdStore.priceOMR}</span>
                    <span className="text-xs mr-1 font-bold">ر.ع.</span>
                  </div>
                </div>

                {/* تفاصيل المنتج والوصف */}
                <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <h3 className="font-black text-base text-[#153e4d]">{createdStore.productTitle}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {createdStore.description}
                  </p>
                </div>

                {/* بيانات التواصل للشراء المباشر */}
                <div className="bg-[#153e4d]/5 border border-[#153e4d]/20 rounded-2xl p-3 flex items-center justify-between">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-bold">رقم التواصل المعتمد للطلبات</span>
                    <span className="text-xs font-black text-[#153e4d]" dir="ltr">{createdStore.phoneNumber}</span>
                  </div>
                  <a
                    href={`https://wa.me/${createdStore.phoneNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    <span>طلب عبر واتساب</span>
                  </a>
                </div>

                {/* زر تدشين منتج آخر */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    + فتح متجر جديد أو إضافة منتج آخر
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
