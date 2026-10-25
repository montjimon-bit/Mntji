import React, { useState, useMemo, useRef } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  PlusCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  Filter,
  Layers,
  Calendar,
  Zap,
  Target,
  PieChart as PieIcon,
  HelpCircle,
  Truck,
  Check,
  AlertCircle,
  UserCheck,
  Building,
  RefreshCw,
  Store,
  Crown,
  Edit3,
  User,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Award,
  UploadCloud,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { useCart, Order } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { OMAN_GOVERNORATES, Product } from '../data/mockData';

interface EntrepreneurDashboardViewProps {
  onNavigate: (view: string) => void;
}

// Monthly sales dataset with revenue and profit projections
const MONTHLY_PERFORMANCE_DATA = [
  { month: 'يناير', revenue: 1650.0, cost: 980.0, profit: 670.0, orders: 48, profitMargin: 40.6 },
  { month: 'فبراير', revenue: 2120.5, cost: 1220.0, profit: 900.5, orders: 62, profitMargin: 42.4 },
  { month: 'مارس', revenue: 2890.0, cost: 1540.0, profit: 1350.0, orders: 84, profitMargin: 46.7 },
  { month: 'أبريل', revenue: 3620.0, cost: 1850.0, profit: 1770.0, orders: 104, profitMargin: 48.8 },
  { month: 'مايو', revenue: 3340.0, cost: 1780.0, profit: 1560.0, orders: 96, profitMargin: 46.7 },
  { month: 'يونيو', revenue: 3980.5, cost: 2050.0, profit: 1930.5, orders: 118, profitMargin: 48.5 },
  { month: 'يوليو', revenue: 4450.0, cost: 2240.0, profit: 2210.0, orders: 132, profitMargin: 49.6 },
  { month: 'أغسطس', revenue: 5120.0, cost: 2510.0, profit: 2610.0, orders: 152, profitMargin: 50.9 },
  { month: 'سبتمبر', revenue: 5890.0, cost: 2790.0, profit: 3100.0, orders: 174, profitMargin: 52.6 },
  { month: 'أكتوبر', revenue: 6480.0, cost: 2980.0, profit: 3500.0, orders: 190, profitMargin: 54.0 },
  { month: 'نوفمبر', revenue: 7150.0, cost: 3200.0, profit: 3950.0, orders: 210, profitMargin: 55.2 },
  { month: 'ديسمبر', revenue: 8250.0, cost: 3550.0, profit: 4700.0, orders: 242, profitMargin: 56.9 },
];

// 3-Year Profitability & Growth Forecasts (2025 - 2027)
const PROFITABILITY_FORECAST_DATA = [
  { quarter: 'Q1-2025', expectedRevenue: 6660, expectedProfit: 2920, breakevenBaseline: 2400 },
  { quarter: 'Q2-2025', expectedRevenue: 10940, expectedProfit: 5260, breakevenBaseline: 2400 },
  { quarter: 'Q3-2025', expectedRevenue: 15460, expectedProfit: 7920, breakevenBaseline: 2400 },
  { quarter: 'Q4-2025', expectedRevenue: 21880, expectedProfit: 12150, breakevenBaseline: 2400 },
  { quarter: 'Q1-2026 (توقع)', expectedRevenue: 27500, expectedProfit: 15800, breakevenBaseline: 2800 },
  { quarter: 'Q2-2026 (توقع)', expectedRevenue: 34200, expectedProfit: 20100, breakevenBaseline: 2800 },
  { quarter: 'Q3-2026 (توقع)', expectedRevenue: 41800, expectedProfit: 25300, breakevenBaseline: 2800 },
  { quarter: 'Q4-2026 (توقع)', expectedRevenue: 51000, expectedProfit: 31900, breakevenBaseline: 2800 },
  { quarter: '2027 (مستهدف)', expectedRevenue: 85000, expectedProfit: 54500, breakevenBaseline: 3200 },
];

// Governorates distribution
const GOVERNORATE_SALES_DATA = [
  { name: 'مسقط', value: 36, amount: 19800, fill: '#153e4d' },
  { name: 'ظفار', value: 24, amount: 13200, fill: '#1f5b70' },
  { name: 'الداخلية', value: 16, amount: 8800, fill: '#c59b5f' },
  { name: 'شمال الباطنة', value: 12, amount: 6600, fill: '#008450' },
  { name: 'جنوب الباطنة', value: 7, amount: 3850, fill: '#3b82f6' },
  { name: 'محافظات أخرى', value: 5, amount: 2750, fill: '#8b5cf6' },
];

const CustomSalesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d232d]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs font-sans space-y-2 min-w-[210px] text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
          <span className="font-black text-[#dfba83] text-sm">{label}</span>
          <span className="text-[10px] bg-[#c59b5f]/20 text-[#dfba83] px-2 py-0.5 rounded-full font-bold">
            مؤشر الأداء المالي
          </span>
        </div>
        {payload.map((entry: any, index: number) => {
          const isOrders = entry.dataKey === 'orders';
          return (
            <div key={`item-${index}`} className="flex items-center justify-between text-xs pt-0.5">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold font-mono text-white">
                {isOrders
                  ? `${entry.value} طلب`
                  : `${Number(entry.value).toLocaleString('ar-OM', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ر.ع.`}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const CustomForecastTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0d232d]/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 text-xs font-sans space-y-2 min-w-[220px] text-right" dir="rtl">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5">
          <span className="font-black text-[#dfba83] text-sm">{label}</span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            نموذج التوقع والجدوى
          </span>
        </div>
        {payload.map((entry: any, index: number) => (
          <div key={`fc-${index}`} className="flex items-center justify-between text-xs pt-0.5">
            <span className="text-slate-300 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
              {entry.name}:
            </span>
            <span className="font-bold font-mono text-white">
              {Number(entry.value).toLocaleString('ar-OM')} ر.ع.
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const EntrepreneurDashboardView: React.FC<EntrepreneurDashboardViewProps> = ({ onNavigate }) => {
  const { user, userProfile, isAdmin, isSeller, isCustomer, hasStore, signInWithGoogle, switchUserRole } = useAuth();
  const { products, allOrders, updateOrderStatus, addNewProduct } = useCart();

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'fease' | 'add-product'>('analytics');
  const [salesChartType, setSalesChartType] = useState<'area' | 'bar' | 'line'>('area');
  const [statusChangeToast, setStatusChangeToast] = useState<string | null>(null);
  const [isUpgrading, setIsUpgrading] = useState(false);

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('عطور وبخور');
  const [newGovernorate, setNewGovernorate] = useState(userProfile?.governorate || 'محافظة مسقط');
  const [newStock, setNewStock] = useState('25');
  const [newDescription, setNewDescription] = useState('');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80');
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return;
    }

    setIsCompressingImage(true);
    setImageFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/webp', 0.85);
        setNewImage(compressed);
        setIsCompressingImage(false);
      };
      img.onerror = () => {
        setIsCompressingImage(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };
  const [isSuccessAdd, setIsSuccessAdd] = useState(false);

  // Feasibility Quick Calculator
  const [calcInitialCapital, setCalcInitialCapital] = useState(5000);
  const [calcMonthlyOpex, setCalcMonthlyOpex] = useState(1200);
  const [calcUnitPrice, setCalcUnitPrice] = useState(25);
  const [calcUnitCost, setCalcUnitCost] = useState(12);

  const unitContribution = Math.max(1, calcUnitPrice - calcUnitCost);
  const breakevenUnits = Math.ceil(calcMonthlyOpex / unitContribution);
  const breakevenRevenue = (breakevenUnits * calcUnitPrice).toLocaleString('ar-OM');

  const currentStoreName = userProfile?.storeName || (user?.displayName ? `متجر ${user.displayName}` : 'منصة مُنتجي الوطنية');

  // فلترة المنتجات: إذا كان الإيميل هو إيميلك الرئيسي تظهر كل منتجات السوق، وإذا كان بائعاً آخراً يرى فقط ما صوره
  const isMasterAdmin = user?.email === 'hudifamoosa2007@gmail.com' || isAdmin;

  const myStoreProducts = useMemo(() => {
    if (!user) return [];
    if (isMasterAdmin) {
      // حسابك الأساسي يرى جميع منتجات المنصة
      return products;
    }
    // البائع العادي يرى فقط المنتجات التابعة لمعرفه أو إيميله
    return products.filter((prod: any) => {
      const matchId = prod.sellerId && prod.sellerId === user.uid;
      const matchEmail = prod.sellerEmail && prod.sellerEmail.toLowerCase() === (user.email || '').toLowerCase();
      const matchLegacyName = userProfile?.storeName && prod.seller?.name === userProfile.storeName;
      return matchId || matchEmail || matchLegacyName;
    });
  }, [products, user, isMasterAdmin, userProfile]);

  const totalRevenue = useMemo(() => {
    return MONTHLY_PERFORMANCE_DATA.reduce((sum, item) => sum + item.revenue, 0);
  }, []);

  const totalNetProfit = useMemo(() => {
    return MONTHLY_PERFORMANCE_DATA.reduce((sum, item) => sum + item.profit, 0);
  }, []);

  const totalOrdersCount = useMemo(() => {
    return MONTHLY_PERFORMANCE_DATA.reduce((sum, item) => sum + item.orders, 0);
  }, []);

  const averageProfitMargin = ((totalNetProfit / totalRevenue) * 100).toFixed(1);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPrice) return;

    await addNewProduct({
      title: newTitle,
      description: newDescription || 'منتج عماني عالي الجودة ومعتمد من منصة منتجي.',
      price: parseFloat(newPrice) || 15,
      category: newCategory,
      governorate: newGovernorate,
      seller: {
        name: currentStoreName,
        isRiyadaCertified: true,
        rating: 5.0,
      },
      image: newImage,
      stock: parseInt(newStock) || 20,
      featured: true,
    });

    setIsSuccessAdd(true);
    setTimeout(() => {
      setIsSuccessAdd(false);
      setNewTitle('');
      setNewPrice('');
      setNewDescription('');
      setActiveTab('products');
    }, 1200);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: Order['status']) => {
    await updateOrderStatus(orderId, newStatus);
    setStatusChangeToast(`تم تحديث حالة الطلب إلى "${newStatus}" بنجاح`);
    setTimeout(() => setStatusChangeToast(null), 3000);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-[#153e4d] text-[#dfba83] flex items-center justify-center mx-auto shadow-lg">
          <BarChart3 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#153e4d]">لوحة تحكم رائد الأعمال والمشاريع</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            يرجى تسجيل الدخول بحساب Google أو بريدك الإلكتروني للوصول إلى مؤشرات المبيعات، توقعات الربحية، وإدارة منتجاتك.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => signInWithGoogle('seller')}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] rounded-2xl text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <UserCheck className="w-4 h-4 text-[#c59b5f]" />
            <span>تسجيل الدخول كبائع عبر Google</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('login.html')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-slate-300 text-slate-800 rounded-2xl text-xs font-bold hover:bg-slate-50 transition cursor-pointer"
          >
            <span>الدخول بالبريد الإلكتروني وكلمة المرور</span>
          </button>
        </div>
      </div>
    );
  }

  if (user && isCustomer && !isMasterAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6" dir="rtl">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#1f5b70] flex items-center justify-center mx-auto shadow-md border border-blue-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 text-[#1f5b70] border border-blue-200 px-3 py-1 rounded-full text-xs font-bold">
            <span>نوع الحساب: عميل (زبون) 🛒</span>
          </div>
          <h2 className="text-2xl font-black text-[#153e4d]">المتاجر الخاصة مخصصة للبائعين فقط</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            مرحباً {user.displayName || 'بك'}! حسابك الحالي مسجل كـ <strong>عميل (مشتري)</strong>. لوحة تحكم المتجر وإدارة المنتجات مخصصة للبائعين ورواد الأعمال.
          </p>
        </div>

        <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200 space-y-3 text-right">
          <div className="flex items-center gap-2 text-xs font-black text-amber-900">
            <Store className="w-4 h-4 text-[#c59b5f]" />
            <span>هل تملك مشروعاً أو منتجات وترغب في بيعها؟</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            يمكنك ترقية حسابك إلى <strong>بائع</strong> بضغطة زر واحدة مجاناً، لإنشاء متجرك الخاص فوراً، إضافة منتجاتك بالصور والأسعار، واستقبال طلبات الزبائن.
          </p>
          <button
            type="button"
            disabled={isUpgrading}
            onClick={async () => {
              setIsUpgrading(true);
              await switchUserRole('seller');
              setIsUpgrading(false);
            }}
            className="w-full py-3 bg-[#c59b5f] hover:bg-[#b58b4f] text-slate-950 font-black rounded-xl text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
          >
            <Store className="w-4 h-4" />
            <span>{isUpgrading ? 'جارٍ ترقية حسابك وفتح المتجر...' : 'ترقية الحساب إلى بائع وفتح متجري الخاص مجاناً 🏪'}</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate('marketplace.html')}
            className="w-full sm:w-auto px-6 py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] rounded-2xl text-xs font-black shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
            <span>تصفح سوق المنتجات والشراء</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" dir="rtl">
      {statusChangeToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#153e4d] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-[#c59b5f]/40 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-[#dfba83]" />
          <span>{statusChangeToast}</span>
        </div>
      )}

      {/* الترويسة العلوية */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-[#153e4d] to-[#0d232d] text-white p-6 sm:p-8 border border-[#1f5b70]/40 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-[#c59b5f]/20 border border-[#c59b5f]/40 text-[#dfba83] px-3 py-1 rounded-full text-xs font-bold">
              {isMasterAdmin ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>المشرف العام للنظام والمنصة (hudifamoosa2007@gmail.com) 👑</span>
                </>
              ) : (
                <>
                  <Award className="w-3.5 h-3.5 text-[#dfba83]" />
                  <span>بائع معتمد في منصة مُنتجي الوطنية 🇴🇲</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isMasterAdmin
                  ? 'لوحة إدارة المنتجات العامة والمشرف العام'
                  : `متجر البائع: ${currentStoreName}`}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isMasterAdmin
                ? 'إشراف شامل على جميع المنتجات الافتراضية والوطنية، الطلبات، ومؤشرات الأداء.'
                : 'إدارة المنتجات والمجسمات التي قمت بتصويرها وتدشينها، ومتابعة مبيعاتها واستقبال الطلبات.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl">
              <div className="w-9 h-9 rounded-xl bg-[#c59b5f] text-slate-950 flex items-center justify-center font-black text-sm">
                {user.displayName ? user.displayName.slice(0, 1) : 'ع'}
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-white line-clamp-1">{user.displayName || user.email}</div>
                <div className="text-[10px] text-[#dfba83] font-semibold">
                  {isMasterAdmin ? 'المدير العام للمنصة 👑' : 'بائع نشط 🟢'}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('add-product')}
              className="px-4 py-3 bg-[#c59b5f] hover:bg-[#dfba83] text-slate-950 font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة منتج لمتجري</span>
            </button>
          </div>
        </div>
      </div>

      {/* صف بطاقات المؤشرات */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي المبيعات</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#153e4d] font-mono">
            {totalRevenue.toLocaleString('ar-OM', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">ر.ع.</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.8% نمو المبيعات</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">صافي الأرباح المحققة</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#c59b5f] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-[#c59b5f] font-mono">
            {totalNetProfit.toLocaleString('ar-OM', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">ر.ع.</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#1f5b70] font-bold">
            <Zap className="w-3.5 h-3.5 text-[#c59b5f]" />
            <span>هامش ربح صافي {averageProfitMargin}%</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">إجمالي طلبات الشراء</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#1f5b70] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {totalOrdersCount} <span className="text-xs font-sans text-slate-500">طلب</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#008450]" />
            <span>تسليم سريع لكافة المحافظات</span>
          </div>
        </div>

        {/* عدد المنتجات التابعة لهذا الحساب تحديداً */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold">
              {isMasterAdmin ? 'جميع منتجات المنصة' : 'منتجات متجري المعروضة'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-700 font-mono">
            {myStoreProducts.length} <span className="text-xs font-sans text-slate-500">منتجات نشطة</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isMasterAdmin ? 'ظاهرة في السوق' : 'مصورة ومعروضة باسمك'}</span>
          </div>
        </div>
      </div>

      {/* أزرار التبويبات */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'bg-[#153e4d] text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#dfba83]" />
          <span>مؤشرات المبيعات والربحية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'bg-[#153e4d] text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Package className="w-4 h-4 text-[#dfba83]" />
          <span>
            {isMasterAdmin ? `منتجات المنصة (${myStoreProducts.length})` : `منتجاتي الخاصة (${myStoreProducts.length})`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-[#153e4d] text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4 text-[#dfba83]" />
          <span>طلبات الزبائن ({allOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fease')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fease'
              ? 'bg-[#153e4d] text-white shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Target className="w-4 h-4 text-[#dfba83]" />
          <span>حاسبة الجدوى الاقتصادية</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('add-product')}
          className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'add-product'
              ? 'bg-[#c59b5f] text-slate-950 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة منتج لمتجري</span>
        </button>
      </div>

      {/* التبويب 1: الرسوم البيانية */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-[#153e4d]">
                    منحنى نمو المبيعات وصافي الأرباح (2025)
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    تحديث حي
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  مقارنة تفاعلية بين إجمالي المبيعات، تكاليف المنتجات، والأرباح الصافية بالريال العماني.
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold self-start">
                <button
                  type="button"
                  onClick={() => setSalesChartType('area')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    salesChartType === 'area' ? 'bg-white text-[#153e4d] shadow-2xs font-black' : 'text-slate-600'
                  }`}
                >
                  مساحي (Area)
                </button>
                <button
                  type="button"
                  onClick={() => setSalesChartType('bar')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    salesChartType === 'bar' ? 'bg-white text-[#153e4d] shadow-2xs font-black' : 'text-slate-600'
                  }`}
                >
                  أعمدة (Bar)
                </button>
                <button
                  type="button"
                  onClick={() => setSalesChartType('line')}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    salesChartType === 'line' ? 'bg-white text-[#153e4d] shadow-2xs font-black' : 'text-slate-600'
                  }`}
                >
                  خطي (Line)
                </button>
              </div>
            </div>

            <div className="h-[360px] w-full" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                {salesChartType === 'area' ? (
                  <AreaChart data={MONTHLY_PERFORMANCE_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1f5b70" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#1f5b70" stopOpacity={0.05} />
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c59b5f" stopOpacity={0.9} />
                        <stop offset="95%" stopColor="#c59b5f" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" ر.ع." />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Area type="monotone" dataKey="revenue" name="إجمالي المبيعات" stroke="#1f5b70" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area type="monotone" dataKey="profit" name="صافي الأرباح" stroke="#c59b5f" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfit)" />
                  </AreaChart>
                ) : salesChartType === 'bar' ? (
                  <BarChart data={MONTHLY_PERFORMANCE_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" ر.ع." />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Bar dataKey="revenue" name="إجمالي المبيعات" fill="#153e4d" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="profit" name="صافي الأرباح" fill="#c59b5f" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="cost" name="التكاليف" fill="#94a3b8" radius={[6, 6, 0, 0]} />
                  </BarChart>
                ) : (
                  <LineChart data={MONTHLY_PERFORMANCE_DATA} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} unit=" ر.ع." />
                    <Tooltip content={<CustomSalesTooltip />} />
                    <Legend verticalAlign="top" height={36} />
                    <Line type="monotone" dataKey="revenue" name="إجمالي المبيعات" stroke="#1f5b70" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                    <Line type="monotone" dataKey="profit" name="صافي الأرباح" stroke="#c59b5f" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 7 }} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* التبويب 2: عرض المنتجات - مخصصة حسب صاحب الحساب */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-[#153e4d]">
                {isMasterAdmin
                  ? 'جميع المنتجات الوطنية المسجلة في منصة مُنتجي'
                  : 'منتجات ومجسمات متجري الخاص المعروضة للبيع'}
              </h3>
              <p className="text-xs text-slate-500">
                {isMasterAdmin
                  ? 'كامل منتجات السوق العام كمسؤول للنظام'
                  : 'المنتجات التي قمت برفعها وتصويرها وتظهر للزبائن في السوق'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('add-product')}
              className="px-4 py-2 bg-[#1f5b70] text-white rounded-xl text-xs font-bold hover:bg-[#153e4d] flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <PlusCircle className="w-4 h-4 text-[#dfba83]" />
              <span>إضافة منتج جديد</span>
            </button>
          </div>

          {myStoreProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-slate-800 text-sm">لا توجد منتجات مسجلة في متجرك حتى الآن</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  قم بالتقاط صورة لمنتجك أو مجسمك في البوث أو اضغط "إضافة منتج جديد" لعرضه فوراً في السوق الوطني.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('add-product')}
                className="px-5 py-2.5 bg-[#c59b5f] text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer"
              >
                + صوّر واعرض منتجك الآن
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myStoreProducts.map((prod) => (
                <div key={prod.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-[#1f5b70]/40 transition-all">
                  <div>
                    <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                      <img src={prod.image} alt={prod.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 right-3 bg-white/95 backdrop-blur-md text-[#153e4d] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {prod.category}
                      </span>
                      <span className="absolute bottom-3 left-3 bg-[#153e4d] text-[#dfba83] text-xs font-black px-2.5 py-1 rounded-xl shadow-xs font-mono">
                        {prod.price.toFixed(3)} ر.ع.
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{prod.title}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2">{prod.description}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                        <span>الجهة: {prod.seller?.name || 'متجر معتمد'}</span>
                        <span className="font-bold text-[#008450]">المخزون: {prod.stock || 20}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <button
                      type="button"
                      onClick={() => onNavigate('marketplace.html')}
                      className="w-full py-2 bg-slate-100 hover:bg-[#1f5b70] hover:text-white text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer text-center"
                    >
                      معاينة في السوق الوطني 🛍️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* التبويب 3: طلبات الزبائن */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#153e4d]">طلبات الزبائن في منصة مُنتجي</h3>
            <p className="text-xs text-slate-500">إدارة شحن وتوصيل الطلبات للزبائن</p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="divide-y divide-slate-100">
              {allOrders.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">لا توجد طلبات مسجلة حالياً</div>
              ) : (
                allOrders.map((ord) => (
                  <div key={ord.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-xs text-[#153e4d]">{ord.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ord.status === 'تم التسليم'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ord.status === 'قيد التوصيل'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ord.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        الزبون: {ord.customerName} ({ord.governorate})
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {ord.items.map((i) => `${i.title} (x${i.quantity})`).join('، ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-left">
                        <div className="font-mono font-black text-sm text-[#153e4d]">
                          {Number(ord.total).toFixed(3)} ر.ع.
                        </div>
                        <div className="text-[10px] text-slate-400">{ord.createdAt}</div>
                      </div>

                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateStatus(ord.id, e.target.value as Order['status'])}
                        className="text-xs font-bold bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-[#1f5b70] cursor-pointer"
                      >
                        <option value="تم الاستلام">تم الاستلام</option>
                        <option value="قيد التجهيز">قيد التجهيز</option>
                        <option value="قيد التوصيل">قيد التوصيل</option>
                        <option value="تم التسليم">تم التسليم</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* التبويب 4: حاسبة الجدوى الاقتصادية */}
      {activeTab === 'fease' && (
        <div className="space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#153e4d]">حاسبة الجدوى الاقتصادية ونقطة التعادل</h3>
            <p className="text-xs text-slate-500">حساب نقطة التعادل وهوامش الربح الصافية بالريال العماني</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-5">
              <h4 className="font-black text-sm text-[#153e4d] border-b border-slate-100 pb-2">
                بيانات المشروع والتكاليف بالريال العماني (OMR)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    رأس المال التأسيسي للمشروع (أصول ومخزون)
                  </label>
                  <input
                    type="number"
                    value={calcInitialCapital}
                    onChange={(e) => setCalcInitialCapital(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    النفقات التشغيلية الثابتة شهرياً
                  </label>
                  <input
                    type="number"
                    value={calcMonthlyOpex}
                    onChange={(e) => setCalcMonthlyOpex(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    متوسط سعر بيع المنتج للزبون
                  </label>
                  <input
                    type="number"
                    value={calcUnitPrice}
                    onChange={(e) => setCalcUnitPrice(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    التكلفة المباشرة لإنتاج/شراء الوحدة
                  </label>
                  <input
                    type="number"
                    value={calcUnitCost}
                    onChange={(e) => setCalcUnitCost(Number(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                  />
                </div>
              </div>
            </div>

            <div className="bg-radial from-[#153e4d] to-[#0d232d] text-white p-6 sm:p-8 rounded-3xl border border-[#1f5b70]/50 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="text-xs font-bold text-[#dfba83] mb-1">نتائج دراسة الجدوى</div>
                <h4 className="text-lg font-black text-white">نقطة التعادل التقديرية</h4>
              </div>
              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-[11px] text-slate-300">الوحدات المطلوب بيعها شهرياً:</div>
                  <div className="text-2xl font-black text-[#dfba83] font-mono mt-1">
                    {breakevenUnits} <span className="text-xs text-white">وحدة</span>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                  <div className="text-[11px] text-slate-300">مبيعات التعادل النقدية شهرياً:</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                    {breakevenRevenue} <span className="text-xs text-white">ر.ع.</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('ai-business-idea.html')}
                className="w-full py-3 bg-[#c59b5f] hover:bg-[#dfba83] text-slate-950 font-black rounded-xl text-xs transition cursor-pointer text-center"
              >
                توليد دراسة جدوى متقدمة مع عوني AI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* التبويب 5: إضافة منتج جديد */}
      {activeTab === 'add-product' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-lg font-black text-[#153e4d]">إضافة منتج جديد لمتجرك في منصة مُنتجي</h3>
            <p className="text-xs text-slate-500">سيتم إدراج المنتج فوراً في السوق الوطني العماني باسم متجرك</p>
          </div>

          {isSuccessAdd && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>تمت إضافة المنتج بنجاح إلى متجرك في المنصة!</span>
            </div>
          )}

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">اسم المنتج</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="مثال: لبان حوجري ظفاري ملكي فاخر"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#1f5b70]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">السعر (ر.ع.)</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="15.0"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الكمية المتوفرة</label>
                <input
                  type="number"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:border-[#1f5b70]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#1f5b70]"
                >
                  <option value="عطور وبخور">عطور وبخور</option>
                  <option value="أغذية ومنتجات طبيعية">أغذية ومنتجات طبيعية</option>
                  <option value="مشغولات يدوية وفخار">مشغولات يدوية وفخار</option>
                  <option value="تقنية وابتكار">تقنية وابتكار</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المحافظة</label>
                <select
                  value={newGovernorate}
                  onChange={(e) => setNewGovernorate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#1f5b70]"
                >
                  {OMAN_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>{gov}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  صورة المنتج (رفع مباشر من الهاتف أو الجهاز):
                </label>
                {newImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setNewImage('');
                      setImageFileName(null);
                    }}
                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>حذف الصورة</span>
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileUpload}
                className="hidden"
              />

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="sm:col-span-8 p-4 border-2 border-dashed border-slate-300 hover:border-[#1f5b70] rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-all cursor-pointer text-center space-y-2 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#153e4d]/10 text-[#153e4d] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-5 h-5 text-[#1f5b70]" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#153e4d] block">
                      {isCompressingImage ? 'جاري معالجة وضغط الصورة...' : 'اضغط لاختيار صورة من هاتفك أو ألبوم الصور'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      يدعم JPG و PNG و WebP (يتم الضغط والتحسين محلياً وفورياً)
                    </span>
                  </div>
                  {imageFileName && (
                    <div className="text-[10px] font-mono text-emerald-600 font-bold">
                      ✓ الملف المرفوع: {imageFileName}
                    </div>
                  )}
                </div>

                <div className="sm:col-span-4 h-24 rounded-2xl border border-slate-200 bg-slate-100 overflow-hidden relative flex items-center justify-center shadow-2xs">
                  {newImage ? (
                    <img src={newImage} alt="معاينة المنتج" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-2 text-slate-400">
                      <ImageIcon className="w-6 h-6 mx-auto mb-1 opacity-50" />
                      <span className="text-[10px]">لا توجد صورة</span>
                    </div>
                  )}
                  {newImage && (
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded font-bold backdrop-blur-xs">
                      معاينة حية ✓
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">وصف المنتج</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="وصف تفصيلي لمزايا المنتج والمكونات العمانية الطبيعية..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:border-[#1f5b70]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#153e4d] hover:bg-[#1f5b70] text-[#dfba83] font-black rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <PlusCircle className="w-4 h-4" />
                <span>نشر المنتج في منصة مُنتجي بالسوق الوطني</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
