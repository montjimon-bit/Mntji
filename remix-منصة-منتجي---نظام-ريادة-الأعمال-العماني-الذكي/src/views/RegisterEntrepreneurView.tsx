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
  TrendingUp,
  Mail,
  Crown,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
    isAdmin,
    signInWithGoogle,
    signInWithEmail,
    registerWithEmail,
    logout,
  } = useAuth();

  const [authMode, setAuthMode] = useState<'register' | 'login'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleGoogleAuth = async () => {
    try {
      setErrorMessage(null);
      setLoading(true);
      await signInWithGoogle();
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onNavigate('dashboard.html');
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
      setErrorMessage('يرجى كتابة البريد الإلكتروني وكلمة المرور.');
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
        onNavigate('dashboard.html');
      }, 1200);
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10" dir="rtl">
      {/* Hero Badge */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 bg-[#c59b5f]/15 border border-[#c59b5f]/30 text-[#9e763b] px-3.5 py-1 rounded-full text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#c59b5f]" />
          <span>منظومة التسجيل الرسمية - منصة مُنتجي 🇴🇲</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#153e4d]">
          {authMode === 'register' ? 'إنشاء حساب جديد في منصة مُنتجي' : 'تسجيل الدخول إلى حسابك'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
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
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#008450] flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-black text-slate-900">تم تسجيل الدخول بنجاح!</h2>
              <p className="text-xs text-slate-500">جاري نقلك إلى المنصة...</p>
            </div>
          ) : user ? (
            /* Logged in state */
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border">
                  {isAdmin ? (
                    <span className="text-amber-800 bg-amber-50 border-amber-200">المشرف العام (Admin 👑)</span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-50 border-emerald-200">عضو معتمد في المنصة 🇴🇲</span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 pt-1">{user.displayName || 'مستخدم مسجل'}</h3>
                <p className="text-xs font-mono text-slate-500">{user.email}</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard.html')}
                  className="w-full py-3.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>الانتقال للوحة التحكم والمبيعات</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('marketplace.html')}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4 text-[#1f5b70]" />
                  <span>تصفح سوق المنتجات</span>
                </button>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="w-full py-2 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 font-bold rounded-2xl text-xs transition cursor-pointer"
                >
                  تسجيل الخروج من هذا الحساب
                </button>
              </div>
            </div>
          ) : (
            /* Register / Login Form */
            <div className="space-y-5">
              {/* Tab Selector */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl text-xs font-bold">
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
                  إنشاء حساب جديد
                </button>
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
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                  {errorMessage}
                </div>
              )}

              {/* 1. Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={loading}
                className="w-full py-3 bg-white border-2 border-slate-200 hover:border-[#1f5b70] text-slate-800 hover:bg-slate-50 rounded-2xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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
                <span>المتابعة والتسجيل بنقرة واحدة عبر Google</span>
              </button>

              {/* Divider */}
              <div className="relative text-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <span className="relative bg-white px-3 text-xs text-slate-400 font-semibold">
                  أو كتابة البريد الإلكتروني وكلمة المرور
                </span>
              </div>

              {/* 2. Email & Password Form */}
              <form onSubmit={handleEmailAuth} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكامل</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="مثال: سعيد بن أحمد"
                        className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70]"
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
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] text-left"
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
                      className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-slate-300 font-semibold focus:border-[#1f5b70] text-left font-mono"
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
