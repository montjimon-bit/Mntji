import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  LogOut,
  ArrowRight,
  User,
  Mail,
  Lock,
  Crown,
  ShoppingBag,
  Store,
  BarChart3,
  Phone,
  Building,
  KeyRound,
  Trash2,
  Edit2,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateOmaniPhone, validateCommercialRegister } from '../utils/validation';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { name: string; role: 'admin' | 'entrepreneur' | 'seller' | 'customer' }) => void;
  onNavigateToFullPage: (view: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
  onNavigateToFullPage,
}) => {
  const {
    user,
    userProfile,
    isAdmin,
    isSeller,
    isCustomer,
    hasStore,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    resetPassword,
    deleteAccount,
    logout,
    saveUserProfileDetails,
    switchUserRole,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  // نوع الحساب: عميل (زبون) أو تاجر (بائع)
  const [accountRole, setAccountRole] = useState<'customer' | 'seller'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeCr, setStoreCr] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  // Profile Edit States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [editCr, setEditCr] = useState(userProfile?.commercialRegNumber || '');
  const [editGov, setEditGov] = useState(userProfile?.governorate || 'محافظة مسقط');
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      await signInWithGoogle(accountRole);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        if (accountRole === 'seller') {
          onNavigateToFullPage('dashboard.html');
        } else {
          onNavigateToFullPage('marketplace.html');
        }
      }, 1200);
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setErrorMessage('تم إلغاء نافذة تسجيل الدخول من Google.');
      } else {
        setErrorMessage('تعذر الاتصال بـ Google. يرجى المحاولة مجدداً.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || (!password.trim() && authMode !== 'forgot')) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    try {
      setErrorMessage(null);
      setLoading(true);

      if (authMode === 'login') {
        await signInWithEmail(email, password);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          // Customer does NOT have a store, keep them on marketplace/shopping
          if (accountRole === 'seller' || isSeller) {
            onNavigateToFullPage('dashboard.html');
          } else {
            onNavigateToFullPage('marketplace.html');
          }
        }, 1200);
      } else if (authMode === 'register') {
        if (password.length < 6) {
          setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
          setLoading(false);
          return;
        }

        if (accountRole === 'seller') {
          if (storePhone.trim()) {
            const pVal = validateOmaniPhone(storePhone);
            if (!pVal.isValid) {
              setErrorMessage(pVal.error || 'رقم هاتف غير صالح.');
              setLoading(false);
              return;
            }
          }
          if (storeCr.trim()) {
            const cVal = validateCommercialRegister(storeCr);
            if (!cVal.isValid) {
              setErrorMessage(cVal.error || 'رقم سجل تجاري غير صالح.');
              setLoading(false);
              return;
            }
          }

          await registerWithEmail(email, password, displayName, 'seller', {
            storeName: storeName.trim() || `متجر ${displayName}`,
            phone: storePhone.trim(),
            commercialRegNumber: storeCr.trim(),
          });

          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            onNavigateToFullPage('dashboard.html');
          }, 1200);
        } else {
          // حساب عميل (بدون متجر)
          await registerWithEmail(email, password, displayName, 'customer');
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onClose();
            onNavigateToFullPage('marketplace.html');
          }, 1200);
        }
      } else if (authMode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error(err);
      const code = err?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMessage('هذا البريد مسجل مسبقاً. يرجى اختيار "تسجيل الدخول".');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('صيغة البريد الإلكتروني غير صالحة.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('كلمة المرور ضعيفة. يرجى اختيار كلمة مرور أقوى.');
      } else {
        setErrorMessage('حدث خطأ أثناء المعالجة. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPhone.trim()) {
      const phoneVal = validateOmaniPhone(editPhone);
      if (!phoneVal.isValid) {
        setErrorMessage(phoneVal.error || 'رقم هاتف غير صالح.');
        return;
      }
    }
    if (editCr.trim()) {
      const crVal = validateCommercialRegister(editCr);
      if (!crVal.isValid) {
        setErrorMessage(crVal.error || 'رقم سجل تجاري غير صالح.');
        return;
      }
    }

    setErrorMessage(null);
    setLoading(true);
    try {
      await saveUserProfileDetails({
        phone: editPhone.trim(),
        commercialRegNumber: editCr.trim(),
        governorate: editGov,
      });
      setProfileSaveSuccess(true);
      setTimeout(() => {
        setProfileSaveSuccess(false);
        setIsEditingProfile(false);
      }, 1500);
    } catch (e: any) {
      setErrorMessage('فشل تحديث البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف حسابك نهائياً من منصة مُنتجي؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await deleteAccount();
        onClose();
        alert('تم حذف حسابك بنجاح.');
      } catch (err: any) {
        alert('تعذر حذف الحساب مباشرة. يرجى تسجيل الدخول مجدداً ثم إعادة المحاولة لمتطلبات الأمان.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white dark:bg-[#0d232d] text-black dark:text-white rounded-3xl max-w-md w-full p-5 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-black hover:opacity-75 dark:text-white dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-black dark:text-white">
              {authMode === 'login' ? 'أهلاً بك مجدداً!' : 'تم إنشاء الحساب بنجاح!'}
            </h3>
            <p className="text-xs text-black dark:text-white font-medium">تم تسجيل دخولك بنجاح في منصة مُنتجي 🇴🇲✨</p>
          </div>
        ) : user ? (
          /* Profile & Session Management View */
          <div className="space-y-5 text-center">
            <div className="relative inline-block">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1f5b70]/30 mx-auto shadow-sm"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-[#153e4d] text-[#dfba83] flex items-center justify-center mx-auto text-2xl font-black shadow-sm">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'ع'}
                </div>
              )}
              {isAdmin && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                  <Crown className="w-4 h-4 fill-slate-950" />
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h4 className="text-xl font-black text-black dark:text-white">{user.displayName || 'عضو المنصة'}</h4>
              <p className="text-xs font-mono text-black dark:text-white">{user.email}</p>
              <div className="pt-2">
                {isAdmin ? (
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-300 shadow-2xs">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span>المشرف العام للنظام (Admin 👑)</span>
                  </span>
                ) : isSeller ? (
                  <span className="bg-amber-50 dark:bg-amber-950/50 text-black dark:text-[#dfba83] border border-[#c59b5f]/40 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <Store className="w-4 h-4 text-[#c59b5f]" />
                    <span>تاجر (بائع) 🏪 • يمتلك متجراً خاصاً</span>
                  </span>
                ) : (
                  <span className="bg-blue-50 dark:bg-blue-950/50 text-black dark:text-cyan-300 border border-blue-200 dark:border-blue-800 text-xs font-bold px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <ShoppingBag className="w-4 h-4 text-[#1f5b70] dark:text-cyan-400" />
                    <span>عميل (زبون) 🛒 • تصفح وشراء بدون متجر</span>
                  </span>
                )}
              </div>
            </div>

            {/* If Customer, offer clean upgrade to seller with dedicated private store */}
            {isCustomer && !isAdmin && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-[#153e4d] dark:to-[#0d232d] rounded-2xl border border-amber-200/80 dark:border-[#c59b5f]/40 text-right space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-black dark:text-[#dfba83]">
                  <Store className="w-4 h-4 text-[#c59b5f]" />
                  <span>هل ترغب في بيع منتجاتك العُمانية؟</span>
                </div>
                <p className="text-[11px] text-black dark:text-white leading-relaxed font-medium">
                  يمكنك ترقية حسابك إلى <strong>تاجر (بائع)</strong> للحصول على متجرك الخاص، إضافة المنتجات، ومتابعة الأرباح والطلبات فوراً.
                </p>
                <button
                  type="button"
                  disabled={switchingRole}
                  onClick={async () => {
                    setSwitchingRole(true);
                    await switchUserRole('seller');
                    setSwitchingRole(false);
                  }}
                  className="w-full py-2 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 font-black rounded-xl text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{switchingRole ? 'جارٍ الترقية...' : 'ترقية الحساب إلى تاجر والحصول على متجر خاص'}</span>
                </button>
              </div>
            )}

            {/* Profile Edit Drawer / Form */}
            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="text-right space-y-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-black dark:text-white">تعديل بيانات الحساب</span>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="text-xs text-black hover:opacity-75 dark:text-white cursor-pointer font-bold"
                  >
                    إلغاء
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-[11px] rounded-lg border border-rose-200 dark:border-rose-800 font-bold">
                    {errorMessage}
                  </div>
                )}
                {profileSaveSuccess && (
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] rounded-lg border border-emerald-200 dark:border-emerald-800 font-bold">
                    تم حفظ وتحديث بياناتك بنجاح! ✓
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1">
                    رقم الهاتف العُماني (يبدأ بـ 9 أو 7):
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="94842840"
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white"
                  />
                </div>

                {isSeller && (
                  <div>
                    <label className="block text-[11px] font-bold text-black dark:text-white mb-1">
                      رقم السجل التجاري (CR):
                    </label>
                    <input
                      type="text"
                      value={editCr}
                      onChange={(e) => setEditCr(e.target.value)}
                      placeholder="1428590"
                      className="w-full px-3 py-2 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-black dark:text-white mb-1">
                    المحافظة:
                  </label>
                  <select
                    value={editGov}
                    onChange={(e) => setEditGov(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-black dark:text-white"
                  >
                    <option value="محافظة مسقط">محافظة مسقط</option>
                    <option value="محافظة ظفار">محافظة ظفار</option>
                    <option value="محافظة الداخلية">محافظة الداخلية</option>
                    <option value="محافظة شمال الباطنة">محافظة شمال الباطنة</option>
                    <option value="محافظة جنوب الباطنة">محافظة جنوب الباطنة</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  {loading ? 'جارٍ الحفظ...' : 'حفظ التعديلات'}
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingProfile(true)}
                className="inline-flex items-center gap-1.5 text-xs text-black dark:text-[#dfba83] hover:underline font-bold"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#1f5b70] dark:text-[#dfba83]" />
                <span>تعديل بيانات الحساب والهاتف</span>
              </button>
            )}

            <div className="pt-2 flex flex-col gap-2">
              {/* Only Seller and Admin have store dashboard */}
              {hasStore ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToFullPage('dashboard.html');
                  }}
                  className="w-full bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <Store className="w-4 h-4 text-[#c59b5f]" />
                  <span>دخول متجري ولوحة التحكم والإدارة</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateToFullPage('orders.html');
                  }}
                  className="w-full bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold py-2.5 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
                >
                  <PackageCheck className="w-4 h-4 text-[#c59b5f]" />
                  <span>متابعة مشترياتي وطلباتي</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullPage('marketplace.html');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-black dark:text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />
                <span>تصفح سوق المنتجات الوطنية</span>
              </button>

              {/* Immediate Sign Out */}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج الفوري (Sign Out)</span>
              </button>

              {/* Delete Account */}
              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                className="text-[11px] text-black hover:text-rose-600 dark:text-white dark:hover:text-rose-400 transition-colors pt-1 cursor-pointer font-medium"
              >
                حذف الحساب نهائياً
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Screen */
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#c59b5f]/15 text-[#9e763b] dark:text-[#dfba83] px-3 py-0.5 rounded-full text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-[#c59b5f]" />
                <span>منصة مُنتجي العمانية</span>
              </div>
              <h3 className="text-lg font-black text-black dark:text-white">
                {authMode === 'login'
                  ? 'تسجيل الدخول إلى حسابك'
                  : authMode === 'register'
                  ? 'إنشاء حساب جديد'
                  : 'استعادة كلمة المرور'}
              </h3>
              <p className="text-xs text-black dark:text-white font-medium">
                {authMode === 'forgot'
                  ? 'أدخل بريدك الإلكتروني لاستلام رابط إعادة تعيين كلمة المرور'
                  : 'سجّل الدخول بنقرة عبر Google أو ببريدك وكلمة السر'}
              </p>
            </div>

            {/* Mode Switcher */}
            {authMode !== 'forgot' && (
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-2xs font-black'
                      : 'text-black dark:text-white opacity-70 hover:opacity-100'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                  }}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-700 text-black dark:text-white shadow-2xs font-black'
                      : 'text-black dark:text-white opacity-70 hover:opacity-100'
                  }`}
                >
                  حساب جديد
                </button>
              </div>
            )}

            {/* تحديد نوع الحساب: عميل (زبون) أو تاجر (بائع) */}
            {authMode !== 'forgot' && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white">
                  <span>نوع الحساب:</span>
                  <span className="text-[11px] text-black dark:text-white font-normal">عميل أو تاجر</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* عميل (زبون) */}
                  <button
                    type="button"
                    onClick={() => {
                      setAccountRole('customer');
                      setErrorMessage(null);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      accountRole === 'customer'
                        ? 'border-[#1f5b70] bg-[#1f5b70]/10 dark:bg-[#1f5b70]/25 ring-2 ring-[#1f5b70]/30 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-xl ${accountRole === 'customer' ? 'bg-[#153e4d] text-[#dfba83]' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      {accountRole === 'customer' && (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ مفعّل</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-black dark:text-white">
                        عميل (زبون)
                      </div>
                      <div className="text-[11px] text-black dark:text-white mt-0.5 leading-tight font-medium">
                        تصفح وشراء بدون متجر
                      </div>
                    </div>
                  </button>

                  {/* تاجر (بائع) */}
                  <button
                    type="button"
                    onClick={() => {
                      setAccountRole('seller');
                      setErrorMessage(null);
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                      accountRole === 'seller'
                        ? 'border-[#c59b5f] bg-[#c59b5f]/15 dark:bg-[#c59b5f]/25 ring-2 ring-[#c59b5f]/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-xl ${accountRole === 'seller' ? 'bg-[#c59b5f] text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'}`}>
                        <Store className="w-4 h-4" />
                      </div>
                      {accountRole === 'seller' && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">✓ مفعّل</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-black text-black dark:text-white">
                        تاجر (بائع)
                      </div>
                      <div className="text-[11px] text-black dark:text-white mt-0.5 leading-tight font-medium">
                        متجر خاص وإدارة المنتجات
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-800 flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Reset Sent Message */}
            {resetSent && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 text-center space-y-1">
                <strong>تم إرسال رابط استعادة الحساب!</strong>
                <p className="text-[11px] text-emerald-700">تفقّد صندوق الوارد لبريدك الإلكتروني واضغط على الرابط لتعيين كلمة مرور جديدة.</p>
              </div>
            )}

            {/* Google One-Click Button */}
            {authMode !== 'forgot' && (
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-black dark:text-white text-xs font-bold rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>المتابعة بنقرة عبر Google كـ ({accountRole === 'seller' ? 'تاجر (بائع)' : 'عميل (زبون)'})</span>
              </button>
            )}

            {authMode !== 'forgot' && (
              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
                <span className="shrink mx-3 text-[11px] text-black dark:text-white font-bold">أو ببريدك الإلكتروني</span>
                <div className="grow border-t border-slate-200 dark:border-slate-700"></div>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-black dark:text-white mb-1">الاسم الكامل:</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="مثال: حذيفة بن موسى"
                      className="w-full px-3.5 py-2.5 pr-9 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-bold"
                    />
                    <User className="w-4 h-4 text-black dark:text-white absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {/* إذا اختار تاجر/بائع في التسجيل، نسأله عن اسم المتجر ورقم الهاتف */}
              {authMode === 'register' && accountRole === 'seller' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-black dark:text-white mb-1">
                      اسم المتجر الخاص / المشروع:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="مثال: لبان ظفار الفاخر"
                        className="w-full px-3.5 py-2.5 pr-9 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-bold"
                      />
                      <Store className="w-4 h-4 text-[#c59b5f] absolute right-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black dark:text-white mb-1">
                      رقم هاتف المتجر (WhatsApp):
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={storePhone}
                        onChange={(e) => setStorePhone(e.target.value)}
                        placeholder="94842840"
                        className="w-full px-3.5 py-2.5 pr-9 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                      />
                      <Phone className="w-4 h-4 text-black dark:text-white absolute right-3 top-3" />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-black dark:text-white mb-1">البريد الإلكتروني:</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 pr-9 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                    dir="ltr"
                  />
                  <Mail className="w-4 h-4 text-black dark:text-white absolute right-3 top-3" />
                </div>
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-black dark:text-white">كلمة المرور:</label>
                    {authMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot');
                          setErrorMessage(null);
                        }}
                        className="text-[11px] text-black dark:text-white hover:underline font-bold cursor-pointer"
                      >
                        نسيت كلمة المرور؟
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 pr-9 text-xs font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
                      dir="ltr"
                    />
                    <Lock className="w-4 h-4 text-black dark:text-white absolute right-3 top-3" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-xl text-xs transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {loading
                  ? 'جارٍ التحقق...'
                  : authMode === 'login'
                  ? 'تسجيل الدخول'
                  : authMode === 'register'
                  ? 'إنشاء الحساب والبدء'
                  : 'إرسال رابط استعادة الحساب'}
              </button>

              {authMode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setResetSent(false);
                    setErrorMessage(null);
                  }}
                  className="w-full text-center text-xs text-black dark:text-white hover:underline pt-1 cursor-pointer font-bold"
                >
                  العودة لتسجيل الدخول
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
