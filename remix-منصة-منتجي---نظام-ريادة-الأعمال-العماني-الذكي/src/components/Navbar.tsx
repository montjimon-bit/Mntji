import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Sparkles,
  ShoppingBag,
  BookOpen,
  Award,
  PackageCheck,
  User as UserIcon,
  Menu,
  X,
  Key,
  ShieldCheck,
  LogOut,
  Phone,
  Instagram,
  MessageCircle,
  Search,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronLeft,
  Check,
  Star,
  GraduationCap,
  Briefcase,
  Layers,
  Heart,
  BarChart3,
  Crown,
  Store,
  Bell,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { AiService } from '../services/ai-service';
import { MontajiLogo } from './MontajiLogo';
import {
  PRODUCTS_DATA,
  TRAINING_COURSES_DATA,
  SUCCESS_STORIES_DATA,
  Product,
  TrainingCourse,
  SuccessStory,
} from '../data/mockData';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenHub?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenAuth, onOpenHub }) => {
  const { cartCount, orders } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, userProfile, isAdmin, isSeller, isCustomer, hasStore, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Persistent Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<'all' | 'products' | 'courses' | 'stories'>('all');
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const mobileSearchContainerRef = useRef<HTMLDivElement>(null);
  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Popular search suggestions for instant discovery
  const popularKeywords = [
    { label: 'لبان حوجري ظفاري', type: 'product' },
    { label: 'عسل سدر الجبل الأخضر', type: 'product' },
    { label: 'حلوى بركاء بالسمن', type: 'product' },
    { label: 'فخار بهلاوي يدوي', type: 'product' },
    { label: 'بطاقة ريادة 2026', type: 'course' },
    { label: 'التسويق الرقمي', type: 'course' },
    { label: 'شركة نماء التقنية', type: 'story' },
    { label: 'أريج اللبان', type: 'story' },
  ];

  // Dynamic Navigation Links: Customers only browse; Sellers & Admin have their private store dashboard
  const navLinks = [
    { id: 'home', label: 'الرئيسية', icon: null },
    { id: 'marketplace.html', label: 'سوق المنتجات العمانية', icon: ShoppingBag, badge: 'جديد' },
    { id: 'ai-platform.html', label: 'المستشار "عوني"', icon: Sparkles, highlight: true },
    { id: 'ai-business-idea.html', label: 'دراسات الجدوى الاستثمارية', icon: TrendingUp },
    { id: 'training-courses.html', label: 'الدورات والورش', icon: BookOpen },
    ...(hasStore
      ? [{ id: 'dashboard.html', label: isAdmin ? 'لوحة المشرف العام' : 'متجري والتحكم', icon: Store }]
      : []),
    { id: 'success-stories.html', label: 'قصص النجاح', icon: Award },
    { id: 'wishlist.html', label: 'المفضلة', icon: Heart, badge: wishlistCount > 0 ? String(wishlistCount) : undefined },
    ...(user ? [{ id: 'orders.html', label: 'مشترياتي وطلباتي', icon: PackageCheck }] : []),
  ];

  // Normalized search query for multi-domain matching
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Filter Products
  const matchingProducts = useMemo(() => {
    if (!normalizedQuery) return [];
    return PRODUCTS_DATA.filter((p) =>
      p.title.toLowerCase().includes(normalizedQuery) ||
      p.description.toLowerCase().includes(normalizedQuery) ||
      p.category.toLowerCase().includes(normalizedQuery) ||
      p.governorate.toLowerCase().includes(normalizedQuery) ||
      p.seller.name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  // Filter Training Courses
  const matchingCourses = useMemo(() => {
    if (!normalizedQuery) return [];
    return TRAINING_COURSES_DATA.filter((c) =>
      c.title.toLowerCase().includes(normalizedQuery) ||
      c.category.toLowerCase().includes(normalizedQuery) ||
      c.instructor.toLowerCase().includes(normalizedQuery) ||
      c.level.toLowerCase().includes(normalizedQuery) ||
      c.syllabus.some((s) => s.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  // Filter Success Stories
  const matchingStories = useMemo(() => {
    if (!normalizedQuery) return [];
    return SUCCESS_STORIES_DATA.filter((s) =>
      s.companyName.toLowerCase().includes(normalizedQuery) ||
      s.founder.toLowerCase().includes(normalizedQuery) ||
      s.sector.toLowerCase().includes(normalizedQuery) ||
      s.governorate.toLowerCase().includes(normalizedQuery) ||
      s.story.toLowerCase().includes(normalizedQuery) ||
      s.achievements.some((a) => a.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  const totalResultsCount = matchingProducts.length + matchingCourses.length + matchingStories.length;

  // Keyboard shortcut listener (Ctrl+K or ⌘K) & Click-outside listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        if (window.innerWidth >= 1024) {
          desktopInputRef.current?.focus();
        } else {
          mobileInputRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideDesktop = searchContainerRef.current?.contains(target);
      const insideMobile = mobileSearchContainerRef.current?.contains(target);
      if (!insideDesktop && !insideMobile) {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGoogleSignIn = () => {
    onOpenAuth('login');
  };

  // Navigate to product in marketplace
  const handleSelectProduct = (product: Product) => {
    sessionStorage.setItem('montaji_search_query', product.title);
    window.dispatchEvent(
      new CustomEvent('montaji-search', { detail: { query: product.title, productId: product.id } })
    );
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    onNavigate('marketplace.html');
  };

  // Navigate to training course
  const handleSelectCourse = (course: TrainingCourse) => {
    sessionStorage.setItem('montaji_course_search', course.title);
    window.dispatchEvent(
      new CustomEvent('montaji-course-search', { detail: { query: course.title, courseId: course.id } })
    );
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    onNavigate('training-courses.html');
  };

  // Navigate to success story
  const handleSelectStory = (story: SuccessStory) => {
    sessionStorage.setItem('montaji_story_search', story.companyName);
    window.dispatchEvent(
      new CustomEvent('montaji-story-search', { detail: { query: story.companyName, storyId: story.id } })
    );
    setIsSearchOpen(false);
    setMobileMenuOpen(false);
    onNavigate('success-stories.html');
  };

  // Submit search query on Enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!normalizedQuery) return;

    if (searchTab === 'courses' || (matchingCourses.length > 0 && matchingProducts.length === 0)) {
      sessionStorage.setItem('montaji_course_search', searchQuery);
      window.dispatchEvent(new CustomEvent('montaji-course-search', { detail: { query: searchQuery } }));
      onNavigate('training-courses.html');
    } else if (searchTab === 'stories' || (matchingStories.length > 0 && matchingProducts.length === 0 && matchingCourses.length === 0)) {
      sessionStorage.setItem('montaji_story_search', searchQuery);
      window.dispatchEvent(new CustomEvent('montaji-story-search', { detail: { query: searchQuery } }));
      onNavigate('success-stories.html');
    } else {
      sessionStorage.setItem('montaji_search_query', searchQuery);
      window.dispatchEvent(new CustomEvent('montaji-search', { detail: { query: searchQuery } }));
      onNavigate('marketplace.html');
    }

    setIsSearchOpen(false);
    setMobileMenuOpen(false);
  };

  // Render search results dropdown content (shared by desktop and mobile)
  const renderSearchResultsDropdown = () => {
    if (!isSearchOpen) return null;

    return (
      <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-50 animate-in fade-in-50 zoom-in-95 max-h-[82vh] sm:max-h-[560px] flex flex-col text-right">
        {/* Results Category Tabs */}
        <div className="bg-[#f8fafb] px-3 py-2 border-b border-slate-200 flex items-center justify-between text-xs overflow-x-auto gap-1 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setSearchTab('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                searchTab === 'all'
                  ? 'bg-[#153e4d] text-[#e9cca0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <span>الكل</span>
              {normalizedQuery && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {totalResultsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchTab('products')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                searchTab === 'products'
                  ? 'bg-[#153e4d] text-[#e9cca0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>المنتجات</span>
              {normalizedQuery && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {matchingProducts.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchTab('courses')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                searchTab === 'courses'
                  ? 'bg-[#153e4d] text-[#e9cca0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>الدورات</span>
              {normalizedQuery && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {matchingCourses.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSearchTab('stories')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                searchTab === 'stories'
                  ? 'bg-[#153e4d] text-[#e9cca0] shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>قصص النجاح</span>
              {normalizedQuery && (
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">
                  {matchingStories.length}
                </span>
              )}
            </button>
          </div>

          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Esc للإغلاق
          </span>
        </div>

        {/* Scrollable Results List */}
        <div className="overflow-y-auto p-3 space-y-4 flex-1">
          {/* 1. When search query is empty: Show Popular Keywords */}
          {!normalizedQuery && (
            <div className="py-2 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
                <Sparkles className="w-4 h-4 text-[#c59b5f]" />
                <span>الأكثر بحثاً في منصة مُنتجي:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.label);
                      desktopInputRef.current?.focus();
                      mobileInputRef.current?.focus();
                    }}
                    className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-[#153e4d] hover:text-[#e9cca0] text-slate-700 rounded-xl transition-colors font-medium border border-slate-200/80 cursor-pointer flex items-center gap-1.5"
                  >
                    <Search className="w-3 h-3 text-[#c59b5f]" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* Quick Jump Buttons to Primary Sections */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate('marketplace.html');
                  }}
                  className="p-2.5 rounded-xl bg-[#153e4d]/5 hover:bg-[#153e4d]/10 text-[#153e4d] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
                    سوق المنتجات
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate('training-courses.html');
                  }}
                  className="p-2.5 rounded-xl bg-[#153e4d]/5 hover:bg-[#153e4d]/10 text-[#153e4d] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#c59b5f]" />
                    الدورات والورش
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate('success-stories.html');
                  }}
                  className="p-2.5 rounded-xl bg-[#153e4d]/5 hover:bg-[#153e4d]/10 text-[#153e4d] font-bold text-xs flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#c59b5f]" />
                    قصص النجاح
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          )}

          {/* 2. When query has no matches */}
          {normalizedQuery && totalResultsCount === 0 && (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                لم نجد نتائج مطابقة لـ "{searchQuery}"
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                جرب البحث بكلمات أخرى مثل "لبان"، "عسل"، "تمويل"، أو تصفح الأقسام مباشرة.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate('marketplace.html');
                  }}
                  className="px-4 py-2 bg-[#153e4d] text-[#e9cca0] text-xs font-bold rounded-xl hover:bg-[#122e3a] transition-colors cursor-pointer"
                >
                  تصفح السوق
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    onNavigate('ai-platform.html');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  اسأل المستشار عوني
                </button>
              </div>
            </div>
          )}

          {/* 3. PRODUCTS SECTION */}
          {normalizedQuery &&
            (searchTab === 'all' || searchTab === 'products') &&
            matchingProducts.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#153e4d]">
                    <ShoppingBag className="w-4 h-4 text-[#c59b5f]" />
                    <span>المنتجات العمانية في السوق ({matchingProducts.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('montaji_search_query', searchQuery);
                      window.dispatchEvent(new CustomEvent('montaji-search', { detail: { query: searchQuery } }));
                      setIsSearchOpen(false);
                      onNavigate('marketplace.html');
                    }}
                    className="text-[11px] text-[#1f5b70] hover:text-[#153e4d] font-bold cursor-pointer flex items-center gap-0.5"
                  >
                    <span>عرض الكل في السوق</span>
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {matchingProducts.map((prod) => (
                    <button
                      key={prod.id}
                      type="button"
                      onClick={() => handleSelectProduct(prod)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-[#1f5b70]/40 transition-all text-right flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={prod.image}
                        alt={prod.title}
                        className="w-13 h-13 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#153e4d] truncate">
                            {prod.title}
                          </h4>
                          {prod.seller.isRiyadaCertified && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                              ريادة ✓
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="truncate">{prod.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5 shrink-0">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {prod.governorate}
                          </span>
                        </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                        <div className="font-black text-xs text-[#153e4d]">
                          {prod.price.toFixed(1)} <span className="text-[10px]">ر.ع.</span>
                        </div>
                        <div className="text-[10px] text-amber-500 flex items-center justify-end gap-0.5 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{prod.seller.rating}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* 4. COURSES SECTION */}
          {normalizedQuery &&
            (searchTab === 'all' || searchTab === 'courses') &&
            matchingCourses.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#153e4d]">
                    <BookOpen className="w-4 h-4 text-[#c59b5f]" />
                    <span>الدورات والورش التدريبية ({matchingCourses.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('montaji_course_search', searchQuery);
                      window.dispatchEvent(new CustomEvent('montaji-course-search', { detail: { query: searchQuery } }));
                      setIsSearchOpen(false);
                      onNavigate('training-courses.html');
                    }}
                    className="text-[11px] text-[#1f5b70] hover:text-[#153e4d] font-bold cursor-pointer flex items-center gap-0.5"
                  >
                    <span>عرض كل الدورات</span>
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {matchingCourses.map((course) => (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => handleSelectCourse(course)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-[#1f5b70]/40 transition-all text-right flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-13 h-13 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#153e4d] truncate">
                            {course.title}
                          </h4>
                          <span className="text-[9px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.2 rounded shrink-0">
                            {course.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                          <span className="truncate">{course.instructor}</span>
                          <span>•</span>
                          <span className="shrink-0">{course.duration}</span>
                        </div>
                      </div>
                      <div className="text-left shrink-0 pl-1">
                        <div className="font-black text-xs text-[#153e4d]">
                          {typeof course.price === 'number' ? `${course.price} ر.ع.` : course.price}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {course.seatsAvailable} مقعد متاح
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          {/* 5. SUCCESS STORIES SECTION */}
          {normalizedQuery &&
            (searchTab === 'all' || searchTab === 'stories') &&
            matchingStories.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs font-black text-[#153e4d]">
                    <Award className="w-4 h-4 text-[#c59b5f]" />
                    <span>قصص النجاح العمانية الملهمة ({matchingStories.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('montaji_story_search', searchQuery);
                      window.dispatchEvent(new CustomEvent('montaji-story-search', { detail: { query: searchQuery } }));
                      setIsSearchOpen(false);
                      onNavigate('success-stories.html');
                    }}
                    className="text-[11px] text-[#1f5b70] hover:text-[#153e4d] font-bold cursor-pointer flex items-center gap-0.5"
                  >
                    <span>عرض كافة القصص</span>
                    <ChevronLeft className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  {matchingStories.map((story) => (
                    <button
                      key={story.id}
                      type="button"
                      onClick={() => handleSelectStory(story)}
                      className="w-full p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 hover:border-[#1f5b70]/40 transition-all text-right flex items-center gap-3 cursor-pointer group"
                    >
                      <img
                        src={story.image}
                        alt={story.companyName}
                        className="w-13 h-13 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#153e4d] truncate">
                            {story.companyName}
                          </h4>
                          <span className="text-[9px] bg-[#c59b5f]/20 text-[#855f26] font-bold px-1.5 py-0.2 rounded border border-[#c59b5f]/30 shrink-0">
                            {story.growthRate}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-medium text-slate-700 truncate">{story.founder}</span>
                          <span>•</span>
                          <span className="truncate">{story.sector}</span>
                          <span>•</span>
                          <span className="shrink-0">{story.governorate}</span>
                        </div>
                      </div>
                      <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-[#153e4d] transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Dropdown Action Footer */}
        {normalizedQuery && totalResultsCount > 0 && (
          <div className="bg-[#f8fafb] px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-500 font-medium">
              تم العثور على <strong className="text-[#153e4d] font-bold">{totalResultsCount}</strong> نتيجة
            </span>
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="px-3 py-1 bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>فتح النتائج</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Top National Announcement & Contact Bar */}
      <div className="bg-[#153e4d] text-white text-xs py-2 px-4 font-medium border-b border-[#1f5b70]/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Right: National Identity & Vision */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-[#c59b5f]/20 text-[#e9cca0] border border-[#c59b5f]/40 px-2.5 py-0.5 rounded text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c59b5f]" />
              رؤية عُمان 2040
            </span>
            <span className="hidden md:inline text-slate-300">
              المنظومة الوطنية المتكاملة لدعم وتمكين رواد الأعمال العمانيين
            </span>
          </div>

          {/* Left: Contact Phone, Instagram, Admin Badge & Keys */}
          <div className="flex items-center gap-4 text-[11px] flex-wrap">
            {/* Phone & WhatsApp Contact */}
            <a
              href="tel:+96894842840"
              className="flex items-center gap-1.5 text-slate-200 hover:text-[#dfba83] transition-colors font-mono"
              title="اتصال مباشر"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span>+968 9484 2840</span>
            </a>

            {/* Direct WhatsApp link */}
            <a
              href="https://wa.me/96894842840"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-[#dfba83] hover:text-white transition-colors bg-white/10 px-2 py-0.5 rounded"
              title="تواصل عبر واتساب"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>واتساب الدعم</span>
            </a>

            {/* Instagram Link */}
            <a
              href="https://www.instagram.com/montji_/?hl=ar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-slate-200 hover:text-[#dfba83] transition-colors"
              title="حساب إنستغرام الرسمي"
            >
              <Instagram className="w-3.5 h-3.5 text-[#c59b5f]" />
              <span className="font-semibold" dir="ltr">@montji_</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d232d]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3 xl:gap-4">
            {/* Logo and Identity with official custom MontajiLogo */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2 text-right group cursor-pointer focus:outline-hidden"
              >
                <div className="p-1 rounded-2xl group-hover:scale-105 transition-transform bg-[#f4f8fa] dark:bg-slate-800 border border-[#1f5b70]/15 dark:border-slate-700 shadow-xs">
                  <MontajiLogo size={46} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl sm:text-2xl font-black text-[#153e4d] dark:text-white tracking-tight group-hover:text-[#1f5b70] dark:group-hover:text-[#dfba83] transition-colors">
                      مُنتجي
                    </span>
                    <span className="text-[10px] bg-[#c59b5f]/15 text-[#9e763b] dark:text-[#dfba83] font-bold px-1.5 py-0.5 rounded-sm border border-[#c59b5f]/30">
                      عُمان 🇴🇲
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden xl:block">
                    منظومة ريادة الأعمال والابتكار
                  </p>
                </div>
              </button>
            </div>

            {/* PERSISTENT DESKTOP SEARCH BAR */}
            <div
              ref={searchContainerRef}
              className="relative hidden lg:block flex-1 max-w-xs xl:max-w-md mx-1"
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div
                  className={`flex items-center bg-[#f8fafb] hover:bg-white border rounded-2xl transition-all shadow-2xs ${
                    isSearchOpen
                      ? 'border-[#1f5b70] ring-2 ring-[#1f5b70]/20 bg-white'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="pr-3 pl-2 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4 text-[#1f5b70]" />
                  </div>

                  <input
                    ref={desktopInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="ابحث عن منتج، دورة تدريبية، قصة نجاح..."
                    className="w-full py-2.5 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden text-right font-medium"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        desktopInputRef.current?.focus();
                      }}
                      className="p-1.5 ml-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="pl-3 pr-1 hidden xl:flex items-center gap-1 pointer-events-none">
                    <kbd className="text-[10px] bg-white border border-slate-200 text-slate-400 px-1.5 py-0.5 rounded shadow-2xs font-mono font-semibold">
                      ⌘K
                    </kbd>
                  </div>
                </div>
              </form>

              {/* Render Search Results Dropdown for Desktop */}
              {renderSearchResultsDropdown()}
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navLinks.map((link) => {
                const isActive =
                  currentView === link.id ||
                  (link.id === 'home' && currentView === '') ||
                  currentView.startsWith(link.id.replace('.html', ''));
                const Icon = link.icon;

                return (
                  <button
                    key={link.id}
                    onClick={() => onNavigate(link.id)}
                    className={`relative px-2.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all duration-200 flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#153e4d] bg-[#1f5b70]/10 font-bold border-b-2 border-[#1f5b70]'
                        : link.highlight
                        ? 'text-[#1f5b70] hover:text-[#153e4d] hover:bg-[#1f5b70]/5 font-semibold'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100/70'
                    }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 xl:w-4 xl:h-4 ${
                          isActive
                            ? 'text-[#1f5b70]'
                            : link.highlight
                            ? 'text-[#c59b5f]'
                            : 'text-slate-400'
                        }`}
                      />
                    )}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="text-[9px] xl:text-[10px] bg-[#c59b5f] text-slate-950 px-1 py-0.2 rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Actions: Wishlist, Cart, Google Sign In, User Avatar */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Theme Toggle Button (Dark / Light Mode) */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d232d] text-slate-700 dark:text-[#dfba83] hover:text-[#153e4d] dark:hover:text-white transition-all shadow-2xs cursor-pointer flex items-center justify-center hover:scale-105"
                title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي الكحلي الفاخر'}
                aria-label="تبديل الثيم"
              >
                {isDark ? <Sun className="w-5 h-5 text-[#dfba83]" /> : <Moon className="w-5 h-5 text-[#153e4d]" />}
              </button>

              {/* Real-time Notifications Bell with Interactive Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0d232d] text-slate-700 dark:text-slate-200 hover:text-[#1f5b70] hover:border-[#1f5b70]/40 transition-colors shadow-2xs cursor-pointer flex items-center justify-center"
                  aria-label="التنبيهات والإشعارات اللحظية"
                  title="تنبيهات الطلبات المباشرة"
                >
                  <Bell className="w-5 h-5 text-[#1f5b70] dark:text-[#dfba83]" />
                  {orders && orders.length > 0 && (
                    <span className="absolute -top-1.5 -left-1.5 bg-emerald-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {Math.min(orders.length, 9)}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#0d232d] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl z-50 p-4 animate-in slide-in-from-top-2 text-right">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
                      <div className="flex items-center gap-1.5 font-black text-xs text-[#153e4d] dark:text-white">
                        <Bell className="w-4 h-4 text-[#c59b5f]" />
                        <span>التنبيهات الفورية للطلبات ({orders.length})</span>
                      </div>
                      <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                        تحديث لحظي ✓
                      </span>
                    </div>

                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {orders.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-400">
                          لا توجد طلبات واردة حالياً.
                        </div>
                      ) : (
                        orders.slice(0, 4).map((ord) => (
                          <div
                            key={ord.id}
                            className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-[#1f5b70] transition-colors space-y-1.5 text-xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-black text-[#153e4d] dark:text-[#dfba83]">
                                {ord.orderNumber}
                              </span>
                              <span className="font-bold text-[#008450] dark:text-emerald-400 font-mono">
                                {ord.total.toFixed(3)} ر.ع.
                              </span>
                            </div>
                            <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                              العميل: <strong>{ord.customerName}</strong> ({ord.governorate})
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <span className="text-[10px] text-slate-400">
                                {new Date(ord.createdAt).toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <a
                                href={`https://wa.me/96894842840?text=${encodeURIComponent(
                                  `طلب جديد رقم ${ord.orderNumber} بقيمة ${ord.total.toFixed(3)} ر.ع. للعميل ${ord.customerName} في ${ord.governorate}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1"
                              >
                                <span>واتساب</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setNotificationsOpen(false);
                          onNavigate('orders.html');
                        }}
                        className="text-[#1f5b70] dark:text-[#dfba83] font-bold hover:underline cursor-pointer"
                      >
                        عرض كل الطلبات
                      </button>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
                      >
                        إغلاق
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Wishlist Button */}
              <button
                onClick={() => onNavigate('wishlist.html')}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-rose-600 hover:border-rose-200 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                aria-label="قائمة الأمنيات والمفضلة"
                title="عرض قائمة أمنياتي"
              >
                <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'text-rose-500 fill-rose-500' : 'text-slate-600'}`} />
                <span className="hidden xl:inline text-xs font-bold text-slate-700">المفضلة</span>
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-rose-500 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={() => onNavigate('cart.html')}
                className="relative p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-[#1f5b70] hover:border-[#1f5b70]/40 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                aria-label="سلة المشتريات"
                title="عرض سلة التسوق"
              >
                <ShoppingBag className="w-5 h-5 text-[#1f5b70]" />
                <span className="hidden xl:inline text-xs font-bold text-slate-700">السلة</span>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -left-1.5 bg-[#c59b5f] text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Profile or Login */}
              {user ? (
                <div className="flex items-center gap-1.5 bg-[#f4f8fa] dark:bg-slate-800 border border-[#1f5b70]/20 dark:border-slate-700 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      if (hasStore) {
                        onNavigate('dashboard.html');
                      } else {
                        onOpenAuth('register');
                      }
                    }}
                    className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-right p-0.5"
                    title={isAdmin ? 'لوحة المشرف العام' : isSeller ? 'متجري الخاص ولوحة التحكم' : 'ملفي الشخصي (عميل المنصة)'}
                  >
                    <div className="relative">
                      {user.photoURL ? (
                        <img
                          src={user.photoURL}
                          alt={user.displayName || 'User'}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        />
                      ) : (
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isAdmin
                            ? 'bg-amber-500 text-slate-950 font-black'
                            : isSeller
                            ? 'bg-[#c59b5f] text-slate-950 font-black'
                            : 'bg-[#1f5b70] text-white'
                        }`}>
                          {user.displayName ? user.displayName.slice(0, 1) : 'ع'}
                        </div>
                      )}
                      {isAdmin ? (
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-500 absolute -top-1 -right-1" />
                      ) : isSeller ? (
                        <Store className="w-3 h-3 text-[#c59b5f] absolute -top-1 -right-1" />
                      ) : null}
                    </div>

                    <div className="hidden sm:block text-right pr-1">
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[120px]">
                        {user.displayName || (isCustomer ? 'عميل المنصة' : 'مستخدم مسجل')}
                      </div>
                      <div className={`text-[10px] font-bold ${
                        isAdmin
                          ? 'text-amber-700'
                          : isSeller
                          ? 'text-[#9e763b] dark:text-[#dfba83]'
                          : 'text-[#1f5b70] dark:text-[#dfba83]'
                      }`}>
                        {isAdmin ? 'المشرف العام 👑' : isSeller ? 'بائع معتمد 🏪' : 'عميل المنصة 🛍️'}
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={logout}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="تسجيل الخروج"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-2 text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 hover:border-[#1f5b70] rounded-xl shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-700"
                  title="تسجيل الدخول / إنشاء حساب"
                >
                  <UserIcon className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />
                  <span className="hidden sm:inline">دخول / تسجيل</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => {
                  if (onOpenHub) {
                    onOpenHub();
                  } else {
                    setMobileMenuOpen(!mobileMenuOpen);
                  }
                }}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-hidden cursor-pointer"
                aria-label="فتح دليل المنصة الشامل"
                title="دليل المنصة الشامل"
              >
                <Menu className="w-6 h-6 text-[#153e4d]" />
              </button>
            </div>
          </div>
        </div>

        {/* PERSISTENT MOBILE & TABLET SEARCH BAR STRIP (Permanently visible below header on mobile) */}
        <div
          ref={mobileSearchContainerRef}
          className="lg:hidden bg-slate-50 border-t border-slate-200/80 px-4 py-2.5 relative"
        >
          <form onSubmit={handleSearchSubmit} className="relative">
            <div
              className={`flex items-center bg-white border rounded-xl transition-all shadow-2xs ${
                isSearchOpen
                  ? 'border-[#1f5b70] ring-2 ring-[#1f5b70]/20'
                  : 'border-slate-300/80'
              }`}
            >
              <div className="pr-3 pl-2 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4 text-[#1f5b70]" />
              </div>

              <input
                ref={mobileInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="ابحث عن منتج، دورة، قصة نجاح..."
                className="w-full py-2 text-xs text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden text-right font-medium"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    mobileInputRef.current?.focus();
                  }}
                  className="p-1.5 ml-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </form>

          {/* Render Search Results Dropdown for Mobile */}
          {renderSearchResultsDropdown()}
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d232d] px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive =
                  currentView === link.id ||
                  (link.id === 'home' && currentView === '') ||
                  currentView.startsWith(link.id.replace('.html', ''));
                const Icon = link.icon;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      onNavigate(link.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-right cursor-pointer ${
                      isActive
                        ? 'text-[#153e4d] dark:text-[#dfba83] bg-[#1f5b70]/10 dark:bg-white/10 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />}
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] bg-[#c59b5f] text-slate-950 px-2 py-0.5 rounded-full font-bold">
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Mobile Contact Quick Links */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <a
                href="https://www.instagram.com/montji_/?hl=ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#c59b5f]" />
                  <span>حساب إنستغرام @montji_</span>
                </div>
                <span className="text-slate-400">متابعة ↗</span>
              </a>

              <a
                href="tel:+96894842840"
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-200"
                dir="ltr"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />
                  <span>+968 9484 2840</span>
                </div>
                <span className="text-slate-400">اتصال مباشر</span>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {!user ? (
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-sm font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4 text-[#1f5b70] dark:text-[#dfba83]" />
                  <span>تسجيل الدخول / حساب جديد (عميل أو بائع)</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-center text-sm font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-xl cursor-pointer"
                >
                  تسجيل الخروج
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
