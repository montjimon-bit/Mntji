import React, { useState, useRef } from 'react';
import {
  Camera,
  Sparkles,
  X,
  Store,
  CheckCircle2,
  Phone,
  User,
  ShieldCheck,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { processAndCompressImage } from '../utils/imageUpload';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface BoothStoreCreatorProps {
  onSuccessNavigate?: (view: string) => void;
  className?: string;
}

interface CreatedStoreData {
  storeName: string;
  ownerName: string;
  phoneNumber: string;
  productTitle: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export const BoothStoreCreator: React.FC<BoothStoreCreatorProps> = ({
  onSuccessNavigate,
  className = '',
}) => {
  const { addNewProduct } = useCart();
  const { user, userProfile, signInWithGoogle, saveUserProfileDetails } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [visitorName, setVisitorName] = useState(userProfile?.displayName || user?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile?.phone || '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // بيانات المتجر بعد تدشينه كبائع
  const [createdStore, setCreatedStore] = useState<CreatedStoreData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث الاسم تلقائياً إذا سجل دخوله
  React.useEffect(() => {
    if (userProfile?.displayName && !visitorName) {
      setVisitorName(userProfile.displayName);
    }
    if (userProfile?.phone && !phoneNumber) {
      setPhoneNumber(userProfile.phone);
    }
  }, [userProfile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setErrorMessage('');
      try {
        const compressed = await processAndCompressImage(file, 900, 0.8);
        setImagePreview(compressed.dataUrl);
      } catch {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImagePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  // تسجيل دخول إجباري عبر Google ليصبح بائعاً موثقاً
  const handleGoogleAuth = async () => {
    setIsLoggingIn(true);
    setErrorMessage('');
    try {
      await signInWithGoogle('seller');
    } catch (err: any) {
      console.error(err);
      setErrorMessage('تعذر تسجيل الدخول عبر Google، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCreateStoreNow = async () => {
    // 1. التحقق الإجباري من تسجيل الدخول
    if (!user) {
      setErrorMessage('يجب تسجيل الدخول أولاً لإنشاء متجرك كبائع معتمد في المنصة.');
      return;
    }

    if (!visitorName.trim()) {
      setErrorMessage('يرجى كتابة اسمك الكريم أو اسم المتجر.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('يرجى كتابة رقم الهاتف للتواصل واستقبال الطلبات.');
      return;
    }
    if (!imagePreview) {
      setErrorMessage('يرجى التقاط صورة للمنتج بكاميرا الهاتف.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const cleanImg = imagePreview;
    const calculatedPrice = 15.0;
    const generatedTitle = `ابتكار ${visitorName.trim()}`;
    const storeTitle = `متجر ${visitorName.trim()}`;
    const productDesc = `منتج وطني مبتكر تم تدشينه بواسطة ${visitorName.trim()} عبر منصة مُنتجي.`;

    try {
      // 2. تحديث بروفايل المستخدم ليصبح بائعاً (Seller) معتمد مع اسم المتجر ورقم هاتفه
      try {
        await saveUserProfileDetails({
          role: 'seller',
          storeName: storeTitle,
          phone: phoneNumber.trim(),
          displayName: visitorName.trim(),
        });
      } catch (profileErr) {
        console.warn('تحديث الملف الشخصي:', profileErr);
      }

      // 3. رفع المنتج وحفظه رسمياً في Firestore كسجل بائع حقيقي في المنصة
      try {
        await addNewProduct({
          title: generatedTitle,
          description: productDesc,
          price: calculatedPrice,
          category: 'تقنية وابتكار',
          governorate: userProfile?.governorate || 'محافظة مسقط',
          seller: {
            name: storeTitle,
            isRiyadaCertified: true,
            rating: 5.0,
          },
          image: cleanImg,
          stock: 1,
          featured: true,
        });
      } catch (saveErr) {
        console.warn('تنبيه حفظ المنتج:', saveErr);
      }

      // 4. حفظ المتجر في الذاكرة لعرضه مباشرة للعميل
      setCreatedStore({
        storeName: storeTitle,
        ownerName: visitorName.trim(),
        phoneNumber: phoneNumber.trim(),
        productTitle: generatedTitle,
        description: productDesc,
        price: calculatedPrice,
        image: cleanImg,
        category: 'تقنية وابتكار',
      });

    } catch (err: any) {
      console.error(err);
      setErrorMessage('حدث خطأ أثناء تدشين المتجر، يرجى المحاولة ثانية.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImageFile(null);
    setImagePreview(null);
    setCreatedStore(null);
    setErrorMessage('');
    setIsOpen(false);
  };

  return (
    <div className={`w-full ${className}`} dir="rtl">
      {/* 1. البانر التفاعلي في الصفحة الرئيسية */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1b4d5e] via-[#2a768e] to-[#1b4d5e] p-6 sm:p-8 text-white shadow-2xl border border-[#d4ab71]/40">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-[#d4ab71]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <div className="inline-flex items-center gap-2 bg-[#d4ab71]/20 border border-[#d4ab71]/50 px-3 py-1 rounded-full text-[#ebd0a3] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ميزة زوار البوث ورواد الأعمال 🇴🇲</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              شكّل مجسمك بالبوث وسجّل كبائع في "مُنتجي" فوراً
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl leading-relaxed">
              صوّر منتجك، وسجل دخولك لتصبح بائعاً رسمياً في المنصة مع متجر خاص بك ومنتج معروض في السوق الوطني.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 px-6 py-4 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer text-sm"
          >
            <Camera className="w-5 h-5 text-slate-900" />
            <span>صوّر وافتح متجرك كبائع</span>
          </button>
        </div>
      </div>

      {/* 2. النافذة المنبثقة: تسجيل الدخول + إدخال البيانات + المتجر المعتمد */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#0f242e] border border-slate-200 dark:border-slate-700 rounded-3xl p-5 sm:p-7 max-w-lg w-full space-y-4 text-right shadow-2xl relative my-auto">
            {/* زر الإغلاق */}
            <button
              type="button"
              onClick={resetAll}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!createdStore ? (
              <>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[#2a768e] dark:text-[#ebd0a3] font-bold text-xs">
                    <Store className="w-4 h-4" />
                    <span>التسجيل كبائع معتمد في منصة مُنتجي</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    تدشين متجرك وعرض منتجك في السوق
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    يلزم تسجيل الدخول لتوثيق ملكية المتجر وإدراجه في قائمة البائعين
                  </p>
                </div>

                {/* شرط تسجيل الدخول الإجباري */}
                {!user ? (
                  <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 text-center space-y-3 my-2">
                    <p className="text-xs text-amber-900 dark:text-amber-200 font-bold">
                      يرجى تسجيل الدخول بحساب Google لتوثيق متجرك وحفظ منتجاتك كبائع معتمد
                    </p>
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={isLoggingIn}
                      className="w-full py-3 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-300 shadow-sm flex items-center justify-center gap-2 text-xs transition cursor-pointer"
                    >
                      {isLoggingIn ? (
                        <>
                          <span className="w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin" />
                          <span>جارٍ الاتصال بحساب Google...</span>
                        </>
                      ) : (
                        <>
                          <LogIn className="w-4 h-4 text-[#2a768e]" />
                          <span>تسجيل الدخول السريع عبر Google</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl px-3 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>مسجل دخولك باسم: {user.displayName || user.email}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                      بائع معتمد ✓
                    </span>
                  </div>
                )}

                <div className="space-y-3 pt-1">
                  {/* اسم صاحب المتجر */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      اسم صاحب المتجر:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={visitorName}
                        onChange={(e) => setVisitorName(e.target.value)}
                        placeholder="مثال: أحمد بن سعيد المعمري"
                        className="w-full bg-slate-50 dark:bg-[#16303d] border border-slate-300 dark:border-slate-600 rounded-xl pr-9 pl-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2a768e]"
                      />
                      <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* الهاتف */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      رقم الهاتف لتواصل الزبائن والطلبات:
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        dir="ltr"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+968 9XXXXXXX"
                        className="w-full bg-slate-50 dark:bg-[#16303d] border border-slate-300 dark:border-slate-600 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-[#2a768e] text-right"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* التقاط الصورة */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                      صورة المنتج أو المجسم:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    {imagePreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#2a768e] bg-slate-900/40 p-2 flex flex-col items-center">
                        <img
                          src={imagePreview}
                          alt="معاينة المنتج"
                          className="h-40 w-full object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 text-xs text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>إعادة التقاط الصورة</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-[#2a768e] dark:hover:border-[#d4ab71] rounded-2xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer transition bg-slate-50 dark:bg-[#16303d]/40"
                      >
                        <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center">
                          <Camera className="w-4 h-4 text-[#2a768e] dark:text-[#d4ab71]" />
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          اضغط لفتح الكاميرا وتصوير المنتج
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2 font-bold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCreateStoreNow}
                  disabled={loading || !user || !visitorName.trim() || !phoneNumber.trim() || !imagePreview}
                  className="w-full py-3.5 bg-[#d4ab71] hover:bg-[#ebd0a3] text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ توثيق الحساب وإدراجك كبائع في المنصة...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>تدشين متجري كبائع وعرض المنتج فوراً ✨</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              /* واجهة المتجر كبائع رسمي دائم في المنصة */
              <div className="space-y-4 pt-1 animate-in zoom-in-95 duration-200">
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>تم تدشين حسابك كبائع معتمد في منصة مُنتجي!</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    بائع معتمد 🇴🇲
                  </span>
                </div>

                <div className="bg-white dark:bg-[#16303d] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md">
                  <div className="bg-gradient-to-r from-[#122e3a] via-[#1b4d5e] to-[#122e3a] p-4 text-white text-center border-b border-[#c59b5f]/40">
                    <span className="inline-flex items-center gap-1 bg-[#c59b5f]/20 border border-[#c59b5f]/60 text-[#dfba83] text-[9px] font-bold px-2.5 py-0.5 rounded-full mb-1.5">
                      <ShieldCheck className="w-3 h-3 text-[#c59b5f]" />
                      <span>متجر وطني معتمد • مُنتجي 🇴🇲</span>
                    </span>
                    <h3 className="text-lg font-black text-white">{createdStore.storeName}</h3>
                    <p className="text-xs text-[#dfba83] mt-0.5 font-medium">
                      صاحب المتجر: {createdStore.ownerName} • <span dir="ltr">{createdStore.phoneNumber}</span>
                    </p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 dark:border-slate-700">
                      <img
                        src={createdStore.image}
                        alt={createdStore.productTitle}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#122e3a]/90 backdrop-blur-xs text-[#dfba83] border border-[#c59b5f]/60 px-3 py-1 rounded-xl text-xs font-black shadow-md">
                        <span>{createdStore.price.toFixed(3)}</span>
                        <span className="mr-1">ر.ع.</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-slate-900 dark:text-white">
                          {createdStore.productTitle}
                        </h4>
                        <span className="text-[10px] bg-[#1b4d5e]/10 text-[#2a768e] dark:text-[#ebd0a3] px-2 py-0.5 rounded font-bold">
                          {createdStore.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {createdStore.description}
                      </p>
                    </div>

                    <a
                      href={`https://wa.me/${createdStore.phoneNumber.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>تواصل مع صاحب المتجر عبر واتساب</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      resetAll();
                      if (onSuccessNavigate) {
                        onSuccessNavigate('marketplace');
                      } else {
                        window.location.hash = 'marketplace';
                      }
                    }}
                    className="flex-1 py-3 bg-[#1b4d5e] hover:bg-[#2a768e] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#d4ab71]" />
                    <span>مشاهدة المنتج في السوق العام</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCreatedStore(null);
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs transition cursor-pointer"
                  >
                    إضافة منتج آخر
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
