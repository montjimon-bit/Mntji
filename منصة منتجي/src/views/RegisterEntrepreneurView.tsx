import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  User,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Award,
  Zap,
  Lock,
  ShoppingBag,
  Store,
  TrendingUp,
  Mail,
  Crown,
  BarChart3,
  Phone,
  KeyRound,
  Trash2,
  Edit2,
  Building,
  AlertCircle,
  PackageCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateOmaniPhone, validateCommercialRegister, validateRiyadaCard } from '../utils/validation';

interface RegisterEntrepreneurViewProps {
  onNavigate: (view: string) => void;
  initialMode?: 'register' | 'login';
}

export const RegisterEntrepreneurView: React.FC<RegisterEntrepreneurViewProps> = ({
  onNavigate,
  initialMode = 'register',
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

  const [authMode, setAuthMode] = useState<'register' | 'login' | 'forgot'>(initialMode);
  // نوع الحساب: عميل (زبون) أو تاجر (بائع)
  const [accountRole, setAccountRole] = useState<'customer' | 'seller'>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [phone, setPhone] = useState('');
  const [crNumber, setCrNumber] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [crError, setCrError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  // Profile Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');
  const [editCr, setEditCr] = useState(userProfile?.commercialRegNumber || '');
  const [editGov, setEditGov] = useState(userProfile?.governorate || 'محافظة مسقط');
  const [profileUpdateToast, setProfileUpdateToast] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      await signInWithGoogle(accountRole);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (accountRole === 'seller') {
          onNavigate('dashboard.html');
        } else {
          onNavigate('marketplace.html');
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
    setPhoneError(null);
    setCrError(null);
    setErrorMessage(null);

    if (authMode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('يرجى إدخال البريد الإلكتروني لاستعادة الحساب.');
        return;
      }
      try {
        setLoading(true);
        await resetPassword(email);
        setResetEmailSent(true);
      } catch (err: any) {
        setErrorMessage('تعذر إرسال رابط الاستعادة. يرجى التحقق من صحة البريد.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim() || !password.trim()) {
      setErrorMessage('يرجى كتابة البريد الإلكتروني وكلمة المرور.');
      return;
    }

    if (authMode === 'register') {
      if (accountRole === 'seller') {
        if (phone.trim()) {
          const phoneVal = validateOmaniPhone(phone);
          if (!phoneVal.isValid) {
            setPhoneError(phoneVal.error || 'رقم الهاتف العماني غير صحيح.');
            return;
          }
        }
        if (crNumber.trim()) {
          const crVal = validateCommercialRegister(crNumber);
          if (!crVal.isValid) {
            setCrError(crVal.error || 'رقم السجل التجاري غير صحيح.');
            return;
          }
        }
      }
      if (password.length < 6) {
        setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
        return;
      }
    }

    try {
      setErrorMessage(null);
      setLoading(true);

      if (authMode === 'login') {
        await signInWithEmail(email, password);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          // Customer does NOT get redirected to dashboard!
          if (accountRole === 'seller' || isSeller) {
            onNavigate('dashboard.html');
          } else {
            onNavigate('marketplace.html');
          }
        }, 1200);
      } else {
        if (accountRole === 'seller') {
          await registerWithEmail(email, password, displayName, 'seller', {
            storeName: storeName.trim() || `متجر ${displayName}`,
            phone: phone.trim(),
            commercialRegNumber: crNumber.trim(),
          });
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onNavigate('dashboard.html');
          }, 1200);
        } else {
          // حساب عميل (بدون متجر خاص)
          await registerWithEmail(email, password, displayName, 'customer');
          setIsSuccess(true);
          setTimeout(() => {
            setIsSuccess(false);
            onNavigate('marketplace.html');
          }, 1200);
        }
      }
    } catch (err: any) {
      console.error(err);
      const code = err?.code;
      if (code === 'auth/user-not-found' || code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setErrorMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (code === 'auth/email-already-in-use') {
        setErrorMessage('هذا البريد مسجل بالفعل. يرجى اختيار تسجيل الدخول.');
      } else if (code === 'auth/invalid-email') {
        setErrorMessage('البريد الإلكتروني المدخل غير صالح.');
      } else if (code === 'auth/weak-password') {
        setErrorMessage('كلمة المرور ضعيفة. يرجى إدخال كلمة مرور أطول.');
      } else {
        setErrorMessage('حدث خطأ أثناء المصادقة. يرجى المحاولة مجدداً.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setCrError(null);
    if (editPhone.trim()) {
      const pVal = validateOmaniPhone(editPhone);
      if (!pVal.isValid) {
        setPhoneError(pVal.error || 'رقم هاتف غير صحيح.');
        return;
      }
    }
    if (editCr.trim()) {
      const cVal = validateCommercialRegister(editCr);
      if (!cVal.isValid) {
        setCrError(cVal.error || 'رقم سجل تجاري غير صحيح.');
        return;
      }
    }

    try {
      setLoading(true);
      await saveUserProfileDetails({
        phone: editPhone.trim(),
        commercialRegNumber: editCr.trim(),
        governorate: editGov,
      });
      setProfileUpdateToast(true);
      setIsEditing(false);
      setTimeout(() => setProfileUpdateToast(false), 3000);
    } catch {
      setErrorMessage('تعذر تحديث البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMyAccount = async () => {
    if (window.confirm('هل أنت متأكد من رغبتك في حذف حسابك نهائياً من منصة مُنتجي؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      try {
        setLoading(true);
        await deleteAccount();
        onNavigate('home');
      } catch (err: any) {
        setErrorMessage('تعذر حذف الحساب. يرجى إعادة تسجيل الدخول أولاً ثم المحاولة.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 text-slate-900 dark:text-white" dir="rtl">
      {/* Hero Badge */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 bg-[#c59b5f]/15 border border-[#c59b5f]/30 text-[#9e763b] dark:text-[#dfba83] px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#c59b5f]" />
          <span>منظومة التسجيل الرسمية - منصة مُنتجي 🇴🇲</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          {authMode === 'register' ? 'إنشاء حساب جديد في منصة مُنتجي' : 'تسجيل الدخول إلى حسابك'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
          سجّل دخولك إما عبر حساب Google الموحد بنقرة واحدة، أو باستخدام بريدك الإلكتروني وكلمة المرور.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (Benefits & Ecosystem Overview) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-radial from-[#153e4d] to-[#0d232d] text-white p-6 sm:p-8 rounded-3xl border border-[#1f5b70]/40 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#dfba83]">عضوية منصة مُنتجي الوطنية</span>
                <h3 className="text-lg font-black text-white">مميزات حسابك الرقمي</h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-[#c59b5f]/20 border border-[#c59b5f]/40 flex items-center justify-center text-[#dfba83]">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">سوق المنتجات العمانية الفاخرة</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    تصفح وتسوق اللبان الظفاري، العسل الجبلي، الحلوى، والمشغولات الحرفية والتقنية.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">لوحة تحكم ريادية ومؤشرات Recharts</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    متابعة نمو المبيعات الشهرية وتوقعات الربحية وهوامش الأرباح وإدارة المنتجات والطلبات.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs">المستشار الاقتصادي "عوني"</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    دراسات جدوى استثمارية وحساب نقطة التعادل المتوافقة مع قروض بنك التنمية ورؤية 2040.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-5 h-5 text-[#dfba83] shrink-0" />
              <span>تسجيل فوري وآمن بضمان معايير المصادقة المعتمدة.</span>
            </div>
          </div>
        </div>

        {/* Right Column (Standard Auth Form: Google OR Email/Password) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#0d232d] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-xl space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">تم تسجيل الدخول بنجاح!</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">جاري نقلك إلى المنصة...</p>
            </div>
          ) : user ? (
            /* Logged in state & Account Management */
            <div className="text-center space-y-5">
              <div className="relative inline-block">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1f5b70]/30 mx-auto shadow-sm"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#153e4d] text-[#dfba83] flex items-center justify-center mx-auto text-2xl font-black shadow-md">
                    {user.displayName ? user.displayName.slice(0, 1) : 'ع'}
                  </div>
                )}
                {isAdmin && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1 rounded-full shadow-md">
                    <Crown className="w-4 h-4 fill-slate-950" />
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-750">
                  {isAdmin ? (
                    <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200">المشرف العام (Admin 👑)</span>
                  ) : isSeller ? (
                    <span className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-[#c59b5f]" />
                      <span>بائع معتمد 🏪 • يمتلك متجراً خاصاً</span>
                    </span>
                  ) : (
                    <span className="text-blue-800 dark:text-cyan-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 flex items-center gap-1">
                      <ShoppingBag className="w-3.5 h-3.5 text-[#1f5b70] dark:text-cyan-400" />
                      <span>حساب عميل (مشتري) 🛒 • تصفح وشراء بدون متجر</span>
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white pt-1">{user.displayName || 'مستخدم مسجل'}</h3>
                <p className="text-xs font-mono text-slate-500 dark:text-slate-400">{user.email}</p>
                {userProfile?.phone && (
                  <p className="text-xs font-mono text-emerald-700 font-bold" dir="ltr">
                    +968 {userProfile.phone}
                  </p>
                )}
                {userProfile?.commercialRegNumber && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    السجل التجاري: {userProfile.commercialRegNumber}
                  </p>
                )}
              </div>

              {/* If customer, offer upgrade to seller */}
              {isCustomer && !isAdmin && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 text-right space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Store className="w-4 h-4 text-[#c59b5f]" />
                    <span>هل تود بيع منتجاتك في المنصة؟</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    يمكنك ترقية حسابك إلى <strong>بائع</strong> في أي وقت لفتح متجرك الخاص وإضافة منتجاتك.
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
                    <span>{switchingRole ? 'جارٍ الترقية...' : 'ترقية الحساب إلى بائع والحصول على متجر خاص'}</span>
                  </button>
                </div>
              )}

              {profileUpdateToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>تم حفظ وتحديث بيانات حسابك بنجاح!</span>
                </div>
              )}

              {/* Profile details editor */}
              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="space-y-3 text-right bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <div className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-1.5">
                    تعديل بيانات الحساب
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم الهاتف العماني</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="94842840"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono font-bold"
                      dir="ltr"
                    />
                    {phoneError && <p className="text-[10px] text-rose-600 mt-0.5">{phoneError}</p>}
                  </div>

                  {isSeller && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">رقم السجل التجاري / ريادة</label>
                      <input
                        type="text"
                        value={editCr}
                        onChange={(e) => setEditCr(e.target.value)}
                        placeholder="1428590"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-mono"
                        dir="ltr"
                      />
                      {crError && <p className="text-[10px] text-rose-600 mt-0.5">{crError}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">المحافظة</label>
                    <select
                      value={editGov}
                      onChange={(e) => setEditGov(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 font-medium"
                    >
                      <option value="محافظة مسقط">محافظة مسقط</option>
                      <option value="محافظة ظفار">محافظة ظفار</option>
                      <option value="محافظة الداخلية">محافظة الداخلية</option>
                      <option value="محافظة شمال الباطنة">محافظة شمال الباطنة</option>
                      <option value="محافظة جنوب الباطنة">محافظة جنوب الباطنة</option>
                      <option value="محافظة شمال الشرقية">محافظة شمال الشرقية</option>
                      <option value="محافظة جنوب الشرقية">محافظة جنوب الشرقية</option>
                      <option value="محافظة الظاهرة">محافظة الظاهرة</option>
                      <option value="محافظة البريمي">محافظة البريمي</option>
                      <option value="محافظة مسندم">محافظة مسندم</option>
                      <option value="محافظة الوسطى">محافظة الوسطى</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-2 py-2 bg-[#153e4d] text-[#dfba83] font-bold rounded-xl text-xs shadow-xs"
                    >
                      {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#1f5b70]" />
                  <span>تعديل بيانات الهاتف والسجل</span>
                </button>
              )}

              <div className="space-y-2 pt-2">
                {hasStore ? (
                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard.html')}
                    className="w-full py-3.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-[#c59b5f]" />
                    <span>الانتقال لمتجري ولوحة التحكم والإدارة</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('orders.html')}
                    className="w-full py-3.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <PackageCheck className="w-4 h-4 text-[#c59b5f]" />
                    <span>متابعة مشترياتي وطلباتي</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onNavigate('marketplace.html')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#1f5b70]" />
                  <span>تصفح سوق المنتجات الوطنية</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>تسجيل الخروج الفوري من هذا الحساب</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteMyAccount}
                  className="w-full py-2 text-rose-500 hover:text-rose-700 text-[11px] font-bold transition cursor-pointer flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>حذف الحساب نهائياً</span>
                </button>
              </div>
            </div>
          ) : (
            /* Register / Login / Forgot Password Form */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setErrorMessage(null);
                    setResetEmailSent(false);
                  }}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  إنشاء حساب جديد
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setErrorMessage(null);
                    setResetEmailSent(false);
                  }}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  تسجيل الدخول
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('forgot');
                    setErrorMessage(null);
                    setResetEmailSent(false);
                  }}
                  className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                    authMode === 'forgot'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs font-black'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  استعادة كلمة المرور
                </button>
              </div>

              {/* تحديد نوع الحساب: عميل (زبون) أو تاجر (بائع) */}
              {authMode !== 'forgot' && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                    <span>تحديد نوع الحساب في المنصة:</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-300 font-normal">اختر صفتك للمتابعة</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {/* عميل (زبون) */}
                    <button
                      type="button"
                      onClick={() => {
                        setAccountRole('customer');
                        setErrorMessage(null);
                      }}
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        accountRole === 'customer'
                          ? 'border-[#1f5b70] bg-[#1f5b70]/10 dark:bg-[#1f5b70]/25 ring-2 ring-[#1f5b70]/30 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${accountRole === 'customer' ? 'bg-[#153e4d] text-[#dfba83]' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        {accountRole === 'customer' && (
                          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">✓ مفعّل</span>
                        )}
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-900 dark:text-white">عميل (زبون)</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                          تصفح المنتجات والشراء، السلة، والمفضلة (بدون متجر)
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
                      className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        accountRole === 'seller'
                          ? 'border-[#c59b5f] bg-[#c59b5f]/15 dark:bg-[#c59b5f]/25 ring-2 ring-[#c59b5f]/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-2 rounded-xl ${accountRole === 'seller' ? 'bg-[#c59b5f] text-slate-950 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                          <Store className="w-5 h-5" />
                        </div>
                        {accountRole === 'seller' && (
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">✓ مفعّل</span>
                        )}
                      </div>
                      <div>
                        <div className="text-base font-black text-slate-900 dark:text-white">تاجر (بائع)</div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
                          متجر إلكتروني خاص بك، إضافة المنتجات، وإدارة المبيعات
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forgot Password Mode */}
              {authMode === 'forgot' ? (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="text-right space-y-1">
                    <h3 className="font-black text-sm text-[#153e4d]">استعادة كلمة المرور وحسابك</h3>
                    <p className="text-xs text-slate-500">
                      أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مباشراً لتعيين كلمة مرور جديدة فوراً.
                    </p>
                  </div>

                  {resetEmailSent && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني بنجاح!</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني</label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] text-left"
                        dir="ltr"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold rounded-2xl text-xs transition shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-xs text-[#1f5b70] hover:underline font-bold"
                    >
                      العودة إلى تسجيل الدخول
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Google Button */}
                  <button
                    type="button"
                    onClick={handleGoogleAuth}
                    disabled={loading}
                    className="w-full py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-[#1f5b70] text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-750 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>المتابعة بنقرة واحدة عبر Google كـ ({accountRole === 'seller' ? 'تاجر • متجر خاص' : 'عميل • تصفح وشراء'})</span>
                  </button>

                  {/* Divider */}
                  <div className="relative text-center my-2">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <span className="relative bg-white dark:bg-[#0d232d] px-3 text-xs text-slate-700 dark:text-slate-300 font-semibold">
                      أو كتابة البريد الإلكتروني وكلمة المرور
                    </span>
                  </div>

                  {/* Email Form */}
                  <form onSubmit={handleEmailAuth} className="space-y-3">
                    {authMode === 'register' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">الاسم الكامل</label>
                          <div className="relative">
                            <input
                              type="text"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="مثال: سعيد بن أحمد"
                              className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70]"
                            />
                            <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                          </div>
                        </div>

                        {/* إظهار بيانات المتجر والسجل للبائع فقط */}
                        {accountRole === 'seller' && (
                          <>
                            <div>
                              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                                اسم المتجر الخاص / المشروع
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={storeName}
                                  onChange={(e) => setStoreName(e.target.value)}
                                  placeholder="مثال: لبان ظفار الفاخر"
                                  className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70]"
                                />
                                <Store className="w-4 h-4 text-[#c59b5f] absolute right-3 top-2.5 pointer-events-none" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                                رقم الهاتف العُماني (يبدأ بـ 9 أو 7)
                              </label>
                              <div className="relative">
                                <input
                                  type="tel"
                                  value={phone}
                                  onChange={(e) => {
                                    setPhone(e.target.value);
                                    setPhoneError(null);
                                  }}
                                  placeholder="94842840"
                                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border ${
                                    phoneError ? 'border-rose-500' : 'border-slate-300 dark:border-slate-600'
                                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70] text-left font-mono font-bold`}
                                  dir="ltr"
                                />
                                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                              </div>
                              {phoneError && (
                                <p className="text-[10px] text-rose-600 font-bold mt-1">{phoneError}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">
                                رقم السجل التجاري (CR) أو بطاقة ريادة (اختياري)
                              </label>
                              <div className="relative">
                                <input
                                  type="text"
                                  value={crNumber}
                                  onChange={(e) => {
                                    setCrNumber(e.target.value);
                                    setCrError(null);
                                  }}
                                  placeholder="مثال: 1428590 أو OM-RIYADA-XXXX"
                                  className={`w-full pr-9 pl-3 py-2 text-xs rounded-xl border ${
                                    crError ? 'border-rose-500' : 'border-slate-300 dark:border-slate-600'
                                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70] text-left font-mono`}
                                  dir="ltr"
                                />
                                <Building className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                              </div>
                              {crError && (
                                <p className="text-[10px] text-rose-600 font-bold mt-1">{crError}</p>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-900 dark:text-white mb-1">البريد الإلكتروني</label>
                      <div className="relative">
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70] text-left"
                          dir="ltr"
                        />
                        <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-900 dark:text-white">كلمة المرور</label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            onClick={() => {
                              setAuthMode('forgot');
                              setErrorMessage(null);
                            }}
                            className="text-[10px] text-[#1f5b70] dark:text-[#dfba83] hover:underline font-bold cursor-pointer"
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
                          className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 font-semibold focus:border-[#1f5b70] text-left font-mono"
                          dir="ltr"
                        />
                        <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-2 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold rounded-2xl text-xs transition shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <span>
                        {loading
                          ? 'جاري التحقق...'
                          : authMode === 'register'
                          ? 'إنشاء الحساب والمتابعة'
                          : 'تسجيل الدخول'}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </>
              )}

              <div className="text-[11px] text-slate-400 text-center">
                * البريد <span dir="ltr">hudifamoosa2007@gmail.com</span> يمتلك صلاحيات المشرف العام (Admin).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
