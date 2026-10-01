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
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: { name: string; role: 'admin' | 'entrepreneur' }) => void;
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
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    logout,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGoogleAuth = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      await signInWithGoogle();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
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
    if (!email.trim() || !password.trim()) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    try {
      setErrorMessage(null);
      setLoading(true);

      if (authMode === 'login') {
        await signInWithEmail(email, password);
      } else {
        if (password.length < 6) {
          setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام.');
          setLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
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
        setErrorMessage('حدث خطأ أثناء المصادقة. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto" dir="rtl">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute left-6 top-6 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              {authMode === 'login' ? 'أهلاً بك مجدداً!' : 'تم إنشاء الحساب بنجاح!'}
            </h3>
            <p className="text-xs text-slate-500">تم تسجيل دخولك بنجاح في منصة مُنتجي 🇴🇲✨</p>
          </div>
        ) : user ? (
          /* Profile & Logout View */
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
              <h4 className="text-xl font-black text-slate-900">{user.displayName || 'عضو المنصة'}</h4>
              <p className="text-xs font-mono text-slate-500">{user.email}</p>
              <div className="pt-2">
                {isAdmin ? (
                  <span className="bg-amber-100 text-amber-900 text-xs font-black px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 border border-amber-300 shadow-2xs">
                    <Crown className="w-4 h-4 text-amber-600" />
                    <span>المشرف العام للنظام (Admin 👑)</span>
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>عضو معتمد في منظومة مُنتجي 🇴🇲</span>
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullPage('dashboard.html');
                }}
                className="w-full bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-bold py-3 rounded-xl text-xs transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>لوحة التحكم والمبيعات</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigateToFullPage('marketplace.html');
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-[#1f5b70]" />
                <span>تصفح سوق المنتجات</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="w-full bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 font-bold py-2 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        ) : (
          /* Authentication Screen */
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#c59b5f]/15 text-[#9e763b] px-3 py-0.5 rounded-full text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-[#c59b5f]" />
                <span>منصة مُنتجي العمانية</span>
              </div>
              <h3 className="text-lg font-black text-[#153e4d]">
                {authMode === 'login' ? 'تسجيل الدخول إلى حسابك' : 'إنشاء حساب جديد'}
              </h3>
              <p className="text-xs text-slate-500">
                سجّل الدخول عبر حساب Google أو بريدك الإلكتروني
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
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
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                حساب جديد
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Direct Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3 bg-white border-2 border-slate-200 hover:border-[#1f5b70] text-slate-800 hover:bg-slate-50 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span>المتابعة عبر حساب Google</span>
            </button>

            {/* Divider */}
            <div className="relative text-center my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold">
                أو بالبريد الإلكتروني وكلمة المرور
              </span>
            </div>

            {/* Email & Password Form */}
            <form onSubmit={handleEmailAuth} className="space-y-3">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="مثال: راشد المعمري"
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] focus:ring-1 focus:ring-[#1f5b70]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                  </div>
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
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] focus:ring-1 focus:ring-[#1f5b70] text-left"
                    dir="ltr"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كلمة المرور</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] focus:ring-1 focus:ring-[#1f5b70] text-left font-mono"
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
                    : authMode === 'login'
                    ? 'تسجيل الدخول'
                    : 'إنشاء الحساب والمتابعة'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-[11px] text-slate-400 text-center pt-1">
              * حساب المشرف العام (<span dir="ltr">hudifamoosa2007@gmail.com</span>) يمتلك صلاحيات الإدارة الكاملة تلقائياً.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
