import React, { useState } from 'react';
import { Camera, Sparkles, X, Store, CheckCircle } from 'lucide-react';
import { generateHologramConcept } from '../services/ai-service';
import { processAndCompressImage } from '../utils/imageUpload';
import { useCart } from '../context/CartContext';

interface BoothStoreCreatorProps {
  onSuccessNavigate?: (view: string) => void;
  className?: string;
}

export const BoothStoreCreator: React.FC<BoothStoreCreatorProps> = ({
  onSuccessNavigate,
  className = '',
}) => {
  const { addNewProduct } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{
    storeName: string;
    productTitle: string;
    price: number;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateStoreNow = async () => {
    if (!visitorName.trim() || !imageFile) return;

    setLoading(true);
    try {
      // 1. معالجة وضغط صورة المجسم
      const compressed = await processAndCompressImage(imageFile, 800, 0.85);

      // 2. تحليل شكل المجسم بالذكاء الاصطناعي وتوليد تفاصيل المتجر
      const aiResult = await generateHologramConcept(compressed.dataUrl, visitorName);

      const productDetails = aiResult.success
        ? aiResult.data
        : {
            productName: `ابتكار ${visitorName}`,
            slogan: 'منتج ابتكاري واعد من زوار المنصة',
            suggestedPrice: '10.000 ر.ع.',
          };

      const cleanPrice =
        parseFloat(productDetails.suggestedPrice.replace(/[^\d.]/g, '')) || 10;

      // 3. إنشاء المتجر وحفظ المنتج في المنصة فوراً
      await addNewProduct({
        title: productDetails.productName,
        description: `${productDetails.slogan} - ابتكار تم تصميمه بواسطة ${visitorName} في منصة مُنتجي.`,
        price: cleanPrice,
        category: 'تقنية وابتكار',
        governorate: 'محافظة مسقط',
        seller: {
          name: `متجر ${visitorName}`,
          isRiyadaCertified: true,
          rating: 5.0,
        },
        image: compressed.dataUrl,
        stock: 1,
        featured: true,
      });

      setSuccessInfo({
        storeName: `متجر ${visitorName}`,
        productTitle: productDetails.productName,
        price: cleanPrice,
      });
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء رفع المنتج، يُرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setVisitorName('');
    setImageFile(null);
    setImagePreview(null);
    setSuccessInfo(null);
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} dir="rtl">
      {/* 1. البانر التفاعلي المباشر للبوث في واجهة الصفحة */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b4d5e] via-[#2a768e] to-[#1b4d5e] p-6 sm:p-8 text-white shadow-2xl border border-[#d4ab71]/40">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#d4ab71]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-[#d4ab71]/20 border border-[#d4ab71]/50 px-3 py-1 rounded-full text-[#ebd0a3] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>تفاعل زوار البوث الفوري</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              شكّل مجسمك بالبوث وافتح متجرك في "مُنتجي" فوراً 🇴🇲
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              صوّر أي مجسم صنعته بيدك، وسيقوم الذكاء الاصطناعي بإنشاء متجر رسمي باسمك وعرض منتجك في السوق الوطني بأسعار ومواصفات تجارية متكاملة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 px-6 py-4 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer text-sm"
          >
            <Camera className="w-5 h-5 text-slate-900" />
            <span>صوّر وافتح متجرك الآن</span>
          </button>
        </div>
      </div>

      {/* 2. نافذة الكاميرا وإنشاء المتجر (Modal) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 text-right shadow-2xl relative">
            <button
              type="button"
              onClick={resetForm}
              className="absolute top-5 left-5 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!successInfo ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#2a768e] dark:text-[#ebd0a3] font-bold text-xs">
                    <Store className="w-4 h-4" />
                    <span>منصة مُنتجي - خدمة زوار المعارض</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    إنشاء متجرك التفاعلي بالذكاء الاصطناعي
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    أدخل اسمك الكريم وصوّر المجسم بكاميرا هاتفك
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      اسمك الكريم (صاحب المتجر):
                    </label>
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="مثال: أحمد بن سعيد المعمري"
                      className="w-full bg-slate-50 dark:bg-[#16303d] border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2a768e]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                      صورة المجسم:
                    </label>

                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#2a768e] bg-slate-900/50 flex flex-col items-center p-2">
                        <img
                          src={imagePreview}
                          alt="المجسم"
                          className="h-44 w-full object-contain rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview(null);
                          }}
                          className="mt-2 text-xs text-rose-500 font-bold hover:underline cursor-pointer"
                        >
                          تغيير الصورة ↻
                        </button>
                      </div>
                    ) : (
                      <label className="border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#2a768e] dark:hover:border-[#d4ab71] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-slate-50 dark:bg-[#16303d]/40">
                        <Camera className="w-8 h-8 text-[#2a768e] dark:text-[#d4ab71]" />
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          اضغط لفتح الكاميرا والتقاط صورة المجسم
                        </span>
                        <span className="text-[10px] text-slate-400">
                          أو اختر صورة محفوظة من جهازك
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCreateStoreNow}
                  disabled={loading || !visitorName.trim() || !imageFile}
                  className="w-full py-4 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>الذكاء الاصطناعي يحلل المجسم وينشئ متجرك...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>إنشاء المتجر وعرض المنتج في السوق فوراً ✨</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">
                  مبروك يا {visitorName}!
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  تم فتح <strong className="text-[#2a768e] dark:text-[#ebd0a3]">{successInfo.storeName}</strong> وإدراج منتجك <strong className="text-[#2a768e] dark:text-[#ebd0a3]">"{successInfo.productTitle}"</strong> بسعر <strong className="text-emerald-600">{successInfo.price.toFixed(3)} ر.ع.</strong> رسمياً في السوق الوطني!
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();
                      if (onSuccessNavigate) {
                        onSuccessNavigate('marketplace');
                      } else {
                        window.location.hash = 'marketplace';
                      }
                    }}
                    className="flex-1 py-3 bg-[#2a768e] hover:bg-[#1b4d5e] text-white font-black rounded-xl text-xs transition cursor-pointer"
                  >
                    عرض منتجي في السوق الآن 🛍️
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="py-3 px-5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};