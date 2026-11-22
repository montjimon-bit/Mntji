import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RotateCw,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Printer,
  ShoppingBag,
  TrendingUp,
  ThumbsUp,
  Award,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

// -------------------------------------------------------------
// واجهة بيانات الابتكار
// -------------------------------------------------------------
interface InnovationResult {
  productName: string;
  productNameEn: string;
  slogan: string;
  suggestedPrice: string;
  category: string;
  description: string;
}

export const MontajiScienceLab: React.FC<{ onBackToHome: () => void }> = ({ onBackToHome }) => {
  // الخطوات: 1: تسجيل | 2: تصويت للسابق | 3: تصوير | 4: معالجة AI | 5: المتجر والنتيجة | 6: وضع الهولوجرام
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // 1. بيانات الزائر
  const [participantName, setParticipantName] = useState('');
  const [phone, setPhone] = useState('');
  const [specialty, setSpecialty] = useState('روبوتات وذكاء اصطناعي');

  // 2. بيانات تصويت الابتكار السابق (مخزنة افتراضياً أو من الجلسة السابقة)
  const [prevInnovation, setPrevInnovation] = useState({
    title: 'جهاز توليد الطاقة الحركية الذاتي',
    creator: 'أحمد البلوشي',
    price: '8.500 ر.ع',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
  });
  const [voted, setVoted] = useState(false);

  // 3. الكاميرا والتصوير
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // 4. الذكاء الاصطناعي والنتيجة
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [result, setResult] = useState<InnovationResult | null>(null);

  // دوران الهولوجرام
  const [isRotating, setIsRotating] = useState(true);

  // تشغيل الكاميرا الخلفية للهاتف
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn('تعذر فتح الكاميرا التلقائية، يمكنك رفع صورة:', err);
    }
  };

  // إيقاف الكاميرا عند مغادرة الشاشة
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
  };

  // التقاط الصورة من الفيديو
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedImage(dataUrl);
        stopCamera();
        processWithAI(dataUrl);
      }
    }
  };

  // بديل رفع صورة من الهاتف مباشرة
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        processWithAI(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // نصوص التشويق أثناء معالجة الذكاء الاصطناعي
  const loadingStages = [
    'جاري تحليل الشكل الهندسي للمجسم عبر رؤية الحاسوب...',
    'استنباط الفكرة العلمية وتقدير الجدوى الاقتصادية لسوق عُمان...',
    'ابتكار الاسم التجاري والهوية والشعار اللفظي...',
    'تهيئة المتجر الإلكتروني وضبط أبعاد الهولوجرام المضيء...',
  ];

  useEffect(() => {
    let interval: any;
    if (step === 4) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingStages.length);
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [step]);

  // استدعاء Gemini لتحليل المجسم وبناء المتجر
  const processWithAI = async (imgBase64: string) => {
    setStep(4);
    setIsGenerating(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
      أنت مستشار ابتكار وتسويق لرواد الأعمال في مهرجان عُمان للعلوم.
      أمامك صورة لمجسم تركيبي صنعه الزائر "${participantName}" بتخصص "${specialty}".
      حلل الشكل الهندسي واقترح منتجاً علمياً تجارياً مبتكراً وقابلاً للبيع في عُمان.
      أرجع النتيجة بصيغة JSON حصراً بالشكل التالي:
      {
        "productName": "اسم تجاري عربي جذاب للمنتج (3 كلمات كحد أقصى)",
        "productNameEn": "English Innovation Title",
        "slogan": "شعار تسويقي ملهم وقوي في سطر واحد",
        "category": "${specialty}",
        "suggestedPrice": "السعر المقترح بالريال العماني مثل: 6.500 ر.ع",
        "description": "وصف تسويقي للاختراع يشرح كيف يحل مشكلة في سطرين"
      }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  data: imgBase64.replace(/^data:image\/\w+;base64,/, ''),
                  mimeType: 'image/jpeg',
                },
              },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
        },
      });

      const data: InnovationResult = JSON.parse(response.text || '{}');
      setResult(data);
      setStep(5);
    } catch (err) {
      console.error('Error generating innovation:', err);
      // نتيجة احتياطية فورية في حال انقطاع شبكة المعرض
      setResult({
        productName: `نظام ${participantName} للطاقة الذكية`,
        productNameEn: 'Smart Eco Energy System',
        slogan: 'ابتكار وطني يختصر طاقة المستقبل برؤية عُمانية',
        category: specialty,
        suggestedPrice: '7.500 ر.ع',
        description: 'جهاز مبتكر يعمل على تحويل الطاقة الحركية والضوئية إلى طاقة كهربائية مستدامة مع شاشة تحكم رقمية.',
      });
      setStep(5);
    } finally {
      setIsGenerating(false);
    }
  };

  // طباعة بطاقة الابتكار فوراً
  const handlePrintBadge = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col items-center justify-center p-4 selection:bg-cyan-500 selection:text-black" dir="rtl">
      
      {/* رأس الصفحة الثابت للمختبر */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 border-b border-cyan-900/40 pb-3">
        <button
          onClick={onBackToHome}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لمنصة منتجي</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-xs font-black tracking-widest text-cyan-400">
            مختبر منتجي · مهرجان العلوم 🧪
          </span>
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl">

        {/* ========================================================
            الخطوة 1: تسجيل الزائر وإصدار تصريح المخترع
           ======================================================== */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-[11px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-full font-bold">
                محطة الابتكار 1 من 4
              </span>
              <h2 className="text-xl font-black text-white pt-2">إصدار تصريح مخترع المستقبل 🚀</h2>
              <p className="text-xs text-slate-400">سجل بياناتك لتحويل مجسمك إلى منتج ومتجر إلكتروني رسمي</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">اسم المبتكر / المبتكرة *</label>
                <input
                  type="text"
                  required
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="مثال: حذيفة المعمري"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">رقم الهاتف (لإرسال رابط المتجر عبر واتساب)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XXXXXXX"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-white outline-none font-mono"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1.5">المجال العلمي للاختراع:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    'روبوتات وذكاء اصطناعي',
                    'طاقة متجددة وبيئة',
                    'أجهزة وفضاء',
                    'تقنية طبية وصحية',
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSpecialty(cat)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                        specialty === cat
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={!participantName.trim()}
                onClick={() => setStep(2)}
                className="w-full mt-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>الانتقال لبنك الاستثمار والتصويت</span>
                <ArrowRight className="w-4 h-4 rotate-180" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            الخطوة 2: لعبة التصويت على ابتكار الزائر السابق
           ======================================================== */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full font-bold">
                محطة المستثمر الصغير 💰
              </span>
              <h3 className="text-lg font-black text-white pt-2">هل تستثمر في ابتكار زميلك السابق؟</h3>
              <p className="text-xs text-slate-400">معك 100 ر.ع افتراضية، قيّم المشروع الذي سبقك قبل تصوير مشروعك!</p>
            </div>

            {/* بطاقة الابتكار السابق */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden p-3 space-y-2">
              <img
                src={prevInnovation.image}
                alt={prevInnovation.title}
                className="w-full h-36 object-cover rounded-xl"
              />
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="font-bold text-white">{prevInnovation.title}</span>
                <span className="text-emerald-400 font-mono font-black">{prevInnovation.price}</span>
              </div>
              <div className="text-[11px] text-slate-400">ابتكار المبدع: {prevInnovation.creator}</div>
            </div>

            {/* أزرار التصويت */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setVoted(true);
                  setTimeout(() => {
                    setStep(3);
                    startCamera();
                  }, 800);
                }}
                className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-95"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>سأستثمر فيه! 💰</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  startCamera();
                }}
                className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>يحتاج تطوير 💡</span>
              </button>
            </div>

            {voted && (
              <div className="text-center text-xs text-emerald-400 font-bold animate-pulse">
                تم ضخ استثمارك بنجاح! جاري فتح الكاميرا لاختراعك...
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            الخطوة 3: تصوير المجسم بكاميرا التلفون
           ======================================================== */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center space-y-1">
              <span className="text-[11px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-3 py-1 rounded-full font-bold">
                الماسح الضوئي الذكي 📸
              </span>
              <h3 className="text-lg font-black text-white pt-1">وجّه الكاميرا نحو مجسمك واضغط مسح</h3>
              <p className="text-xs text-slate-400">ضع مجسم الليجو أو القطع التركيبية في المنتصف</p>
            </div>

            {/* شاشة الكاميرا مع شبكة الاستهداف المضيئة */}
            <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden border-2 border-cyan-500/50 flex items-center justify-center shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* خطوط ليزرية للمسح */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                  <div className="w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                </div>
                <div className="w-full h-0.5 bg-cyan-400/60 shadow-[0_0_10px_#06b6d4] animate-pulse" />
                <div className="flex justify-between">
                  <div className="w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
                  <div className="w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                </div>
              </div>
            </div>

            {/* أزرار التقاط الصورة أو رفعها كبديل */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={capturePhoto}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30 active:scale-95 transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>التقاط ومسح المجسم الآن</span>
              </button>

              <label className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors">
                <span>أو اختر صورة المجسم من ألبوم الهاتف</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* ========================================================
            الخطوة 4: شاشة المعالجة الذكية والانتظار
           ======================================================== */}
        {step === 4 && (
          <div className="py-10 text-center space-y-6 animate-in fade-in">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <Zap className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-black text-white">الذكاء الاصطناعي يبني متجرك...</h3>
              <p className="text-xs text-cyan-300/90 font-medium px-4 h-8 transition-all">
                {loadingStages[loadingTextIndex]}
              </p>
            </div>

            <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* ========================================================
            الخطوة 5: شاشة المتجر المولد والطباعة الفورية
           ======================================================== */}
        {step === 5 && result && (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="text-center space-y-1">
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full font-bold">
                تم تدشين المتجر بنجاح 🚀
              </span>
              <h3 className="text-lg font-black text-white pt-1">{result.productName}</h3>
              <p className="text-xs text-cyan-400 font-semibold">{result.slogan}</p>
            </div>

            {/* بطاقة المتجر والمنتج المنجز */}
            <div className="bg-slate-800/90 border border-cyan-500/30 rounded-2xl p-4 space-y-3">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black flex items-center justify-center">
                {capturedImage && (
                  <img
                    src={capturedImage}
                    alt="Prototype"
                    className="w-full h-full object-cover filter brightness-105"
                  />
                )}
                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] text-cyan-300 border border-cyan-500/30 font-bold">
                  المبتكر: {participantName}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-semibold">القيمة التقديرية في السوق:</span>
                <span className="text-base font-black text-emerald-400 font-mono">
                  {result.suggestedPrice}
                </span>
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed border-t border-slate-700/60 pt-2">
                {result.description}
              </p>

              {/* رمز QR تجريبي يحاكي الرابط المباشر */}
              <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-xl border border-slate-700 text-xs">
                <div>
                  <div className="font-bold text-white text-[11px]">رابط المتجر في منصة منتجي:</div>
                  <div className="text-[10px] text-cyan-400 font-mono">montaji.om/lab/{encodeURIComponent(participantName)}</div>
                </div>
                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://montaji.om/lab`}
                    alt="QR Code"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>

            {/* الأزرار التفاعلية: الهولوجرام والطباعة */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(6)}
                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/30 transition-all active:scale-95"
              >
                <Eye className="w-4 h-4" />
                <span>تشغيل شاشة الهولوجرام ثلاثي الأبعاد 🛸</span>
              </button>

              <button
                type="button"
                onClick={handlePrintBadge}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>طباعة بطاقة الابتكار والـ QR فوراً 🖨️</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setCapturedImage(null);
                  setResult(null);
                }}
                className="w-full py-2 text-slate-400 hover:text-white text-[11px] font-bold text-center cursor-pointer"
              >
                بدء تجربة جديدة لزائر آخر ↺
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          الخطوة 6: شاشة الهولوجرام الرباعية الكاملة لهرم البلاستيك
         ======================================================== */}
      {step === 6 && result && capturedImage && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden select-none">
          {/* شريط التحكم العلوي */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-50 opacity-60 hover:opacity-100 transition-opacity">
            <button
              onClick={() => setStep(5)}
              className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs border border-slate-700 cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>الرجوع للمتجر والطباعة</span>
            </button>

            <div className="text-cyan-400 font-bold text-xs tracking-wider">
              وضع الهولوجرام النشط · {result.productName}
            </div>

            <button
              onClick={() => setIsRotating(!isRotating)}
              className="flex items-center gap-2 bg-slate-900 text-cyan-400 px-4 py-2 rounded-xl text-xs border border-slate-700 cursor-pointer"
            >
              <RotateCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
              <span>{isRotating ? 'إيقاف' : 'دوران'}</span>
            </button>
          </div>

          {/* مسرح الانعكاس الرباعي المخصص للهرم */}
          <div className="relative w-[340px] h-[340px] md:w-[480px] md:h-[480px] flex items-center justify-center">
            {/* قمة الهرم الشفاف */}
            <div className="absolute w-12 h-12 border border-cyan-500/30 rounded-full flex items-center justify-center pointer-events-none">
              <div className="w-2 h-2 bg-cyan-400/50 rounded-full animate-ping" />
              <span className="absolute -bottom-6 text-[10px] text-cyan-400/60 whitespace-nowrap">
                ضع قمة الهرم الشفاف هنا
              </span>
            </div>

            {/* 1. الأعلى (مقلوب للأسفل) */}
            <div className="absolute top-0 flex flex-col items-center transform rotate-180">
              <HoloPiece image={capturedImage} isRotating={isRotating} />
            </div>

            {/* 2. الأسفل (متجه للأعلى) */}
            <div className="absolute bottom-0 flex flex-col items-center">
              <HoloPiece image={capturedImage} isRotating={isRotating} />
            </div>

            {/* 3. اليسار (متجه لليمين) */}
            <div className="absolute left-0 flex flex-col items-center transform rotate-90">
              <HoloPiece image={capturedImage} isRotating={isRotating} />
            </div>

            {/* 4. اليمين (متجه لليسار) */}
            <div className="absolute right-0 flex flex-col items-center transform -rotate-90">
              <HoloPiece image={capturedImage} isRotating={isRotating} />
            </div>
          </div>

          <div className="absolute bottom-6 text-slate-500 text-xs text-center flex items-center gap-1.5 opacity-70">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>ضع هرم البلاستيك الشفاف فوق المركز وانظر من الجوانب بمستوى العين</span>
          </div>
        </div>
      )}

    </div>
  );
};

// قطعة الصورة المعكوسة
const HoloPiece: React.FC<{ image: string; isRotating: boolean }> = ({ image, isRotating }) => (
  <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center p-2">
    <img
      src={image}
      alt="Holo Projection"
      className={`max-w-full max-h-full object-contain rounded-xl ${isRotating ? 'animate-pulse' : ''}`}
      style={{
        filter: 'drop-shadow(0 0 12px #06b6d4) contrast(1.2) brightness(1.2)',
      }}
    />
  </div>
);