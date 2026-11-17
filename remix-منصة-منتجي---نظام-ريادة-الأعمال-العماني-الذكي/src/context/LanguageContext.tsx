import React, { createContext, useContext, useEffect, useState } from 'react';

export type AppLang = 'ar' | 'en';

interface LanguageContextType {
  lang: AppLang;
  toggleLanguage: () => void;
  t: (ar: string, en: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'ar',
  toggleLanguage: () => {},
  t: (ar) => ar,
  isRtl: true,
});

// قاموس شامل يغطي جميع صفحات المنصة، القوائم، النماذج، المنتجات، الدورات، لوحة التاجر، والسلة
const FULL_PLATFORM_DICTIONARY: Record<string, string> = {
  // 1. الهيدر والتنقل العام
  'منصة منتجي': 'Montaji Platform',
  'منصة مُنتجي': 'Montaji Platform',
  'مُنتجي': 'Montaji',
  'عُمان 🇴🇲': 'Oman 🇴🇲',
  'رؤية عُمان 2040': 'Oman Vision 2040',
  'المنظومة الوطنية لدعم وتمكين رواد الأعمال العمانيين': 'National Ecosystem for Omani Entrepreneurs',
  'المنظومة الوطنية لريادة الأعمال والابتكار': 'National Entrepreneurship & Innovation Ecosystem',
  'الرئيسية': 'Home',
  'الواجهة الرئيسية': 'Home',
  'سوق المنتجات': 'Marketplace',
  'السوق العُماني': 'Omani Marketplace',
  'سوق المنتجات العُمانية': 'Omani Products Marketplace',
  'سوق المنتجات العمانية': 'Omani Products Marketplace',
  'الدورات التدريبية': 'Training Courses',
  'الدورات': 'Courses',
  'الدورات والورش': 'Courses & Workshops',
  'الدورات والورش التدريبية': 'Training Courses & Workshops',
  'دراسة الجدوى': 'Feasibility Study',
  'دراسات الجدوى': 'Feasibility Studies',
  'إعداد دراسة جدوى': 'Feasibility Study',
  'المستشار عوني': 'Advisor Awni',
  'عوني': 'Awni',
  'متجري الخاص': 'My Private Store',
  'متجري': 'My Store',
  'لوحة الإدارة': 'Admin Dashboard',
  'لوحة تحكم الإدارة': 'Admin Dashboard',
  'تسجيل الدخول': 'Sign In',
  'دخول / تسجيل': 'Sign In / Register',
  'إنشاء حساب': 'Create Account',
  'تسجيل الخروج': 'Logout',
  'خروج': 'Logout',
  'حسابي': 'My Account',
  'السلة': 'Cart',
  'سلة التسوق': 'Shopping Cart',
  'سلة المشتريات': 'Shopping Cart',
  'المزيد': 'More',
  'تواصل معنا': 'Contact Us',
  'واتساب الدعم': 'WhatsApp Support',
  'واتساب الدعم المباشر': 'WhatsApp Direct Support',
  'تواصل مباشر مع المنصة': 'Direct Platform Support',
  'ابحث عن منتج، تاجر، مشروع...': 'Search product, seller, project...',
  'ابحث في منصة منتجي...': 'Search Montaji...',

  // 2. الصفحة الرئيسية (HomeView)
  'المظلة الوطنية لتمكين الابتكار العماني - رؤية عُمان 2040': 'National Umbrella for Omani Innovation - Oman Vision 2040',
  'انطلق بمشروعك في': 'Launch Your Venture in',
  'سلطنة عُمان': 'Sultanate of Oman',
  'بذكاء متكامل': 'with Integrated Intelligence',
  'منصة "مُنتجي" المنظومة الوطنية المعتمدة لرواد الأعمال والمشاريع العُمانية: سوق رقمي وطني للمنتجات العُمانية الأصيلة، وبرامج ودورات تدريبية متخصصة.':
    'Montaji Platform is the certified national ecosystem for Omani entrepreneurs: a national digital marketplace for authentic Omani products and specialized training courses.',
  'معتمد لحاملي بطاقة ريادة': 'Certified for Riyada Card Holders',
  'تكامل مع منصة عُمان للأعمال': 'Integrated with Oman Business Platform',
  'توصيل لجميع محافظات السلطنة': 'Delivery Across All Governorates',
  'قنوات التواصل المباشرة لمنصة "مُنتجي"': 'Montaji Direct Support Channels',
  'فريق الدعم الفني وخدمة رواد الأعمال متاح للرد على استفساراتكم': 'Technical support and entrepreneur assistance team is ready to help',
  'رائد عمل مسجل': 'Registered Entrepreneurs',
  'منتج عماني معتمد': 'Verified Omani Products',
  '3.8 مليون ر.ع.': '3.8M OMR',
  'حجم مبيعات وتمويلات ميسرة': 'Sales & Financing Volume',
  'نسبة الرضا والنجاح': 'Customer Satisfaction',
  'دليل الوصول السريع والمنظم': 'Organized Platform Directory',
  'خريطة أقسام المنصة المنظمة': 'Organized Platform Sections Map',
  'سوق المنتجات والتسوق': 'Products Marketplace & Shopping',
  'سلة المشتريات والإنهاء': 'Shopping Cart & Checkout',
  'قائمة المفضلة': 'My Wishlist',
  'متابعة الشحنات والطلبات': 'Track Orders & Shipments',
  'الدورات التدريبية وبناء القدرات': 'Training Courses & Capacity Building',
  'قصص النجاح والمشاريع المسجلة': 'Success Stories & Registered Projects',
  'قصص نجاح رواد الأعمال': 'Success Stories',
  'سوق ريادة الأعمال': 'Entrepreneurship Marketplace',
  'منتجات وابتكارات عمانية أصيلة': 'Authentic Omani Products & Innovations',
  'دفع رقمي آمن 100% في سلطنة عمان': '100% Secure Digital Payments in Oman',
  'ادفع بسهولة عبر Apple Pay و Google Pay و Samsung Pay': 'Pay Easily via Apple Pay, Google Pay & Samsung Pay',
  'بناء القدرات': 'Capacity Building',
  'ورش وبرامج تدريبية متخصصة': 'Specialized Training Workshops & Programs',
  'عرض كل الدورات والورش': 'View All Courses & Workshops',
  'قراءة قصص النجاح الأخرى': 'Read More Success Stories',

  // 3. سوق المنتجات (MarketplaceView)
  'السوق الوطني الموحد للمنتجات العمانية': 'National Omani Products Marketplace',
  'تسوق إبداعات رواد الأعمال العمانيين': 'Shop Authentic Omani Creations',
  'ابحث عن منتج وطني، صانع، أو نوع الحرفة...': 'Search product, seller, or craft...',
  'كل المحافظات (عُمان)': 'All Governorates (Oman)',
  'كل التصنيفات الفرعية': 'All Subcategories',
  'الترتيب: المميز': 'Sort: Featured',
  'السعر: تصاعدي': 'Price: Low to High',
  'السعر: تنازلي': 'Price: High to Low',
  'الأعلى تقييماً': 'Highest Rated',
  'الكل': 'All',
  'منتجات عطرية وتراثية': 'Fragrances & Heritage',
  'أغذية ومنتجات طبيعية': 'Natural Foods & Honey',
  'حرف وفنون يدوية': 'Handicrafts & Pottery',
  'تقنية وابتكار': 'Tech & Innovation',
  'حاملو بطاقة ريادة فقط': 'Riyada Card Holders Only',
  'تم العثور على': 'Found',
  'منتج': 'products',
  'لم يتم العثور على منتجات مطابقة': 'No matching products found',
  'إعادة تعيين الفلاتر': 'Reset Filters',
  'أضف للسلة': 'Add to Cart',
  'إضافة للسلة': 'Add to Cart',
  'إضافة إلى السلة': 'Add to Cart',
  'السعر الإجمالي': 'Total Price',
  'المخزون المتوفر:': 'Available Stock:',
  'قطعة': 'pcs',
  'المؤسسة / البائع:': 'Store / Seller:',
  'الاعتماد:': 'Verification:',
  'حامل بطاقة ريادة معتمد 🇴🇲': 'Certified Riyada Card Holder 🇴🇲',
  'بطاقة ريادة': 'Riyada Card',
  'ريادة': 'Riyada',
  'ر.ع.': 'OMR',
  'ر.ع': 'OMR',
  'مشاركة': 'Share',
  'حذف': 'Delete',
  'في المفضلة': 'In Wishlist',
  'حفظ بالمفضلة': 'Save to Wishlist',
  'مشتري مؤكد': 'Verified Buyer',
  'تقييم النجوم:': 'Star Rating:',
  'قيّم طلبك': 'Rate Order',
  'اكتب مراجعة': 'Write Review',
  'العودة إلى جميع المتاجر والمنتجات': 'Back to All Stores & Products',

  // 4. المحافظات العمانية
  'محافظة مسقط': 'Muscat Governorate',
  'محافظة ظفار': 'Dhofar Governorate',
  'محافظة الداخلية': 'Ad Dakhiliyah Governorate',
  'محافظة شمال الباطنة': 'North Al Batinah',
  'محافظة جنوب الباطنة': 'South Al Batinah',
  'محافظة جنوب الشرقية': 'South Ash Sharqiyah',
  'محافظة شمال الشرقية': 'North Ash Sharqiyah',
  'محافظة الظاهرة': 'Ad Dhahirah',
  'محافظة البريمي': 'Al Buraimi',
  'محافظة مسندم': 'Musandam',
  'محافظة الوسطى': 'Al Wusta',

  // 5. السلة والدفع والطلبات (Cart, Checkout, Orders, Wishlist)
  'سلة المشتريات فارغة': 'Your Shopping Cart is Empty',
  'تصفح السوق': 'Browse Marketplace',
  'إتمام الطلب': 'Proceed to Checkout',
  'إتمام الدفع': 'Complete Checkout',
  'تأكيد الطلب': 'Confirm Order',
  'ملخص الطلب': 'Order Summary',
  'المجموع الفرعي': 'Subtotal',
  'رسوم التوصيل': 'Delivery Fee',
  'الخصم': 'Discount',
  'الإجمالي النهائي': 'Grand Total',
  'الإجمالي': 'Total',
  'كود الخصم': 'Promo Code',
  'تطبيق': 'Apply',
  'بيانات التوصيل': 'Delivery Details',
  'الاسم الكامل': 'Full Name',
  'رقم الهاتف': 'Phone Number',
  'المحافظة': 'Governorate',
  'العنوان التفصيلي': 'Detailed Address',
  'طريقة الدفع': 'Payment Method',
  'الدفع عند الاستلام': 'Cash on Delivery',
  'تحويل بنكي': 'Bank Transfer',
  'بطاقة بنكية / محفظة رقمية': 'Card / Digital Wallet',
  'طلباتي': 'My Orders',
  'متابعة طلباتي': 'Track My Orders',
  'رقم الطلب': 'Order ID',
  'حالة الطلب': 'Order Status',
  'قيد التجهيز': 'Preparing',
  'تم الشحن': 'Shipped',
  'تم التوصيل': 'Delivered',
  'قائمة أمنياتي': 'My Wishlist',
  'المفضلة': 'Wishlist',

  // 6. الدورات التدريبية (TrainingCoursesView)
  'أكاديمية مُنتجي لريادة الأعمال والتدريب المهني': 'Montaji Entrepreneurship & Training Academy',
  'برامج تدريبية متخصصة لتطوير مهارات الرواد': 'Specialized Training Programs for Entrepreneurs',
  'المجال:': 'Field:',
  'المستوى:': 'Level:',
  'جميع المستويات': 'All Levels',
  'مبتدئ': 'Beginner',
  'متوسط': 'Intermediate',
  'متقدم': 'Advanced',
  'التشريعات والتراخيص الحكومية': 'Licensing & Regulations',
  'الإدارة والمالية': 'Finance & Management',
  'التسويق والتجارة الإلكترونية': 'E-Commerce & Marketing',
  'التقنية والابتكار': 'Tech & Innovation',
  'المحاضر:': 'Instructor:',
  'أبرز المحاور التدريبية:': 'Key Course Modules:',
  'التسجيل بالدورة': 'Enroll Now',
  'تأكيد التسجيل وحجز المقعد': 'Confirm Enrollment',
  'تم تسجيلك بنجاح في الدورة!': 'Successfully Enrolled!',
  'مجاني': 'Free',

  // 7. لوحة التاجر والمستشار عوني ودراسة الجدوى
  'لوحة تحكم البائع': 'Seller Dashboard',
  'إضافة منتج جديد': 'Add New Product',
  'اسم المنتج': 'Product Name',
  'السعر (ر.ع.)': 'Price (OMR)',
  'الكمية المتوفرة': 'Available Stock',
  'التصنيف': 'Category',
  'وصف المنتج': 'Product Description',
  'حفظ المنتج': 'Save Product',
  'إجمالي المبيعات': 'Total Sales',
  'الطلبات الواردة': 'Incoming Orders',
  'منتجاتي': 'My Products',
  'المستشار الاقتصادي "عوني"': 'Economic Advisor "Awni"',
  'توليد دراسة الجدوى': 'Generate Feasibility Study',
  'اسم المشروع': 'Project Name',
  'رأس المال المتوقع': 'Estimated Budget',
  'الفئة المستهدفة': 'Target Audience',

  // 8. تسجيل الدخول والتسجيل (AuthModal)
  'البريد الإلكتروني': 'Email Address',
  'كلمة المرور': 'Password',
  'نوع الحساب': 'Account Type',
  'عميل': 'Customer',
  'بائع': 'Seller',
  'تاجر / رائد أعمال': 'Seller / Entrepreneur',
  'اسم المتجر': 'Store Name',
  'نسيت كلمة المرور؟': 'Forgot Password?',
  'ليس لديك حساب؟ أنشئ حساباً جديداً': "Don't have an account? Register",
  'لديك حساب بالفعل؟ سجل الدخول': 'Already have an account? Sign In',

  // 9. التذييل (Footer)
  'أقسام المنصة': 'Platform Sections',
  'خدمات الرواد والعملاء': 'User & Seller Services',
  'بيانات التواصل المباشر': 'Direct Contact',
  'الشروط والأحكام العامة': 'Terms & Conditions',
  'سياسة الخصوصية وحماية البيانات': 'Privacy Policy',
  'شروط الاستخدام': 'Terms of Use',
  'سياسة الخصوصية': 'Privacy Policy',
  'صُنع بفخر في سلطنة عمان 🇴🇲': 'Proudly Made in Oman 🇴🇲',
};

// ترتيب المفاتيح من الأطول إلى الأقصر لضمان دقة استبدال العبارات المركبة أولاً
const SORTED_DICTIONARY_KEYS = Object.keys(FULL_PLATFORM_DICTIONARY).sort(
  (a, b) => b.length - a.length
);

// مخازن لحفظ النصوص العربية الأصلية لاستعادتها بدقة تامة عند العودة للعربية
const originalTextNodeMap = new WeakMap<Text, string>();
const originalPlaceholderMap = new WeakMap<HTMLElement, string>();
const originalTitleMap = new WeakMap<HTMLElement, string>();

function translateArabicToEnglish(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed || !/[\u0600-\u06FF]/.test(trimmed)) return rawText;

  // 1. مطابقة كاملة مباشرة
  if (FULL_PLATFORM_DICTIONARY[trimmed]) {
    return rawText.replace(trimmed, FULL_PLATFORM_DICTIONARY[trimmed]);
  }

  // 2. ترجمة الأنماط الديناميكية الشائعة
  let result = rawText;

  // مثال: "المقاعد المتبقية: 12" -> "Seats left: 12"
  result = result.replace(/المقاعد المتبقية:\s*(\d+)/g, 'Seats left: $1');
  // مثال: "مستوى: مبتدئ" -> "Level: Beginner"
  result = result.replace(/مستوى:\s*مبتدئ/g, 'Level: Beginner');
  result = result.replace(/مستوى:\s*متوسط/g, 'Level: Intermediate');
  result = result.replace(/مستوى:\s*متقدم/g, 'Level: Advanced');
  // مثال: "(3 مراجعات)" أو "3 مراجعات" -> "3 reviews"
  result = result.replace(/(\d+)\s*مراجعات/g, '$1 reviews');
  // مثال: "عرض السلة (2 عناصر)" -> "View Cart (2 items)"
  result = result.replace(/عرض السلة\s*\((\d+)\s*عناصر\)/g, 'View Cart ($1 items)');
  // مثال: "استعراض كافة المنتجات (6)" -> "View All Products (6)"
  result = result.replace(/استعراض كافة المنتجات\s*\((\d+)\)/g, 'View All Products ($1)');

  // 3. استبدال العبارات والكلمات من القاموس الشامل
  for (const arKey of SORTED_DICTIONARY_KEYS) {
    if (result.includes(arKey)) {
      result = result.split(arKey).join(FULL_PLATFORM_DICTIONARY[arKey]);
    }
  }

  return result;
}

function translateEntirePage(targetLang: AppLang) {
  if (typeof document === 'undefined' || !document.body) return;

  // أ) ترجمة جميع العقد النصية في الصفحة
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  let currentNode: Node | null;

  while ((currentNode = walker.nextNode())) {
    const textNode = currentNode as Text;
    const parentTag = textNode.parentElement?.tagName;
    if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'NOSCRIPT') continue;

    const currentVal = textNode.nodeValue || '';
    if (!currentVal.trim()) continue;

    if (targetLang === 'en') {
      if (!originalTextNodeMap.has(textNode) && /[\u0600-\u06FF]/.test(currentVal)) {
        originalTextNodeMap.set(textNode, currentVal);
      }
      const sourceArabic = originalTextNodeMap.get(textNode) || currentVal;
      const translated = translateArabicToEnglish(sourceArabic);
      if (translated !== currentVal) {
        textNode.nodeValue = translated;
      }
    } else {
      const savedArabic = originalTextNodeMap.get(textNode);
      if (savedArabic && savedArabic !== currentVal) {
        textNode.nodeValue = savedArabic;
      }
    }
  }

  // ب) ترجمة نصوص حقول الإدخال (placeholder) وعناوين التلميح (title)
  const interactiveElements = document.querySelectorAll<HTMLElement>('[placeholder], [title]');
  interactiveElements.forEach((el) => {
    const ph = el.getAttribute('placeholder');
    if (ph) {
      if (targetLang === 'en') {
        if (!originalPlaceholderMap.has(el) && /[\u0600-\u06FF]/.test(ph)) {
          originalPlaceholderMap.set(el, ph);
        }
        const sourcePh = originalPlaceholderMap.get(el) || ph;
        const translatedPh = translateArabicToEnglish(sourcePh);
        if (translatedPh !== ph) el.setAttribute('placeholder', translatedPh);
      } else {
        const savedPh = originalPlaceholderMap.get(el);
        if (savedPh && savedPh !== ph) el.setAttribute('placeholder', savedPh);
      }
    }

    const titleAttr = el.getAttribute('title');
    if (titleAttr) {
      if (targetLang === 'en') {
        if (!originalTitleMap.has(el) && /[\u0600-\u06FF]/.test(titleAttr)) {
          originalTitleMap.set(el, titleAttr);
        }
        const sourceTitle = originalTitleMap.get(el) || titleAttr;
        const translatedTitle = translateArabicToEnglish(sourceTitle);
        if (translatedTitle !== titleAttr) el.setAttribute('title', translatedTitle);
      } else {
        const savedTitle = originalTitleMap.get(el);
        if (savedTitle && savedTitle !== titleAttr) el.setAttribute('title', savedTitle);
      }
    }
  });
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<AppLang>(() => {
    return (localStorage.getItem('montaji_lang') as AppLang) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('montaji_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    // تطبيق الترجمة فوراً على كامل الصفحة
    translateEntirePage(lang);

    // مراقبة أي عناصر أو نوافذ جديدة تُفتح وترجمتها تلقائياً
    let frameId: number | null = null;
    const observer = new MutationObserver(() => {
      if (lang === 'en') {
        if (frameId) cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          translateEntirePage('en');
        });
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (ar: string, en: string) => (lang === 'ar' ? ar : en);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
