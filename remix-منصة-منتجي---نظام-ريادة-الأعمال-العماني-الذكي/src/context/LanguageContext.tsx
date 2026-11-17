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

// قاموس شامل يغطي 100% من نصوص، فقرات، منتجات، دورات، وقصص نجاح المنصة
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
  'المستشار الاقتصادي "عوني"': 'Economic Advisor "Awni"',
  'مستشارك الذكي في منصة مُنتَجي 🇴🇲': 'Your Smart Omani Advisor 🇴🇲',
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

  // 2. الصفحة الرئيسية والفقرات الوصفية
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
  'تنظيم متكامل يضمن وصولك الفوري إلى سوق المنتجات العمانية والدورات التدريبية بكل سهولة ووضوح.':
    'Structured navigation giving you instant access to the Omani Marketplace and Training Courses.',
  'سوق المنتجات والتسوق': 'Products Marketplace & Shopping',
  'تصفح المنتجات العمانية الأصيلة، العسل، اللبان، والحرف اليدوية مع استعراض متجر كل تاجر وتقييمه وتوصيل لكل المحافظات.':
    'Browse authentic Omani products, honey, frankincense, and handicrafts, view each seller store and rating, with delivery across Oman.',
  'سلة المشتريات والإنهاء': 'Shopping Cart & Checkout',
  'قائمة المفضلة': 'My Wishlist',
  'متابعة الشحنات والطلبات': 'Track Orders & Shipments',
  'الدورات التدريبية وبناء القدرات': 'Training Courses & Capacity Building',
  'تطوير مهارات ريادة الأعمال، ورش تدريبية معتمدة، وتجارب ملهمة لشركات عمانية ناشئة حققت نمواً استثنائياً.':
    'Develop entrepreneurship skills through certified workshops and explore inspiring success stories of Omani startups.',
  'قصص النجاح والمشاريع المسجلة': 'Success Stories & Registered Projects',
  'قصص نجاح رواد الأعمال': 'Success Stories',
  'تقييم المشاريع ⭐': 'Project Ratings ⭐',
  'سوق ريادة الأعمال': 'Entrepreneurship Marketplace',
  'منتجات وابتكارات عمانية أصيلة': 'Authentic Omani Products & Innovations',
  'منتجات متميزة مسجلة برعاية رواد الأعمال وحاملي بطاقة ريادة من كافة المحافظات.':
    'Featured products from Riyada-certified entrepreneurs across all governorates.',
  'دفع رقمي آمن 100% في سلطنة عمان': '100% Secure Digital Payments in Oman',
  'ادفع بسهولة عبر Apple Pay و Google Pay و Samsung Pay': 'Pay Easily via Apple Pay, Google Pay & Samsung Pay',
  'ندعم كافة المحافظات الرقمية وبطاقات الخصم المباشر (عُمان نت وبنك مسقط) ومحفظة ثواني لتجربة تسوق آمنة وسريعة.':
    'Supporting all digital wallets, OmanNet & Bank Muscat debit cards, and Thawani for a fast, secure checkout.',
  'ندعم كافة المحافظ الرقمية وبطاقات الخصم المباشر (عُمان نت وبنك مسقط) ومحفظة ثواني.':
    'Supporting all digital wallets, OmanNet & Bank Muscat debit cards, and Thawani.',
  'ثواني Thawani': 'Thawani',
  'بناء القدرات': 'Capacity Building',
  'ورش وبرامج تدريبية متخصصة': 'Specialized Training Workshops & Programs',
  'دورات معتمدة لرواد الأعمال بالتعاون مع هيئة ريادة والخبراء الماليين في عمان.':
    'Certified courses for entrepreneurs in collaboration with Riyada and Omani financial experts.',
  'عرض كل الدورات والورش': 'View All Courses & Workshops',
  'قراءة قصص النجاح الأخرى': 'Read More Success Stories',

  // 3. المنتجات الـ 6 (العناوين، الأوصاف، التصنيفات، والمتاجر)
  'لبان حوجري ظفاري ملكي نقي قطفة أولى': 'Royal First-Harvest Dhofari Hojari Frankincense',
  'لبان حوجري نادر طبيعي 100% مستخرج من جبال سمحان بمحافظة ظفار، ذو جودة طبية وعطرية فائقة برائحة ليمونية زكية.':
    '100% pure rare Hojari frankincense harvested from Jabal Samhan in Dhofar, offering therapeutic and aromatic quality with a crisp citrus scent.',
  'مؤسسة كنوز اللبان العمانية': 'Omani Frankincense Treasures Est.',
  'اللبان الظفاري والبخور الملكي': 'Dhofari Frankincense & Royal Incense',

  'عسل سدر عماني جبلي أصلي (موسم الجبل الأخضر)': 'Authentic Omani Mountain Sidr Honey (Jabal Akhdar)',
  'عسل نحل بري نقي مفحوص مخبرياً من أزهار السدر البري في جبال الجبل الأخضر، خالٍ تماماً من أي إضافات أو تغذية سكرية.':
    'Lab-tested pure wild Sidr honey harvested from Jabal Akhdar mountains, 100% free from additives or sugar feeding.',
  'مناحل الجبل الأخضر الحديثة': 'Modern Jabal Akhdar Apiaries',
  'عسل عماني مفحوص': 'Lab-Tested Omani Honey',

  'حلوى عمانية سلطانية زعفرانية بالمكسرات والسمن البقري': 'Royal Saffron Omani Halwa with Nuts & Local Ghee',
  'حلوى عمانية مطبوخة على الحطب بالطريقة العمانية الأصيلة باستخدام السمن البقري المحلي، والزعفران الإيراني الفاخر والهيل والمكسرات.':
    'Traditional wood-fired Omani Halwa crafted with local cow ghee, premium saffron, cardamom, and roasted nuts.',
  'مصنع بركاء للحلوى العمانية': 'Barka Omani Halwa Factory',
  'الحلوى العمانية التقليدية': 'Traditional Omani Halwa',
  'الحلوى العمانية والتمور': 'Omani Halwa & Dates',

  'طقم دلال وفناجين قهوة تراثية بصياغة فضية': 'Heritage Silver-Crafted Arabic Dallah & Coffee Cups Set',
  'طقم تقديم قهوة عمانية أصيل مكسو بالنقوش الفضية الدقيقة المستوحاة من قلاع وحصون عُمان، يضم دلة رسلان وستة فناجين منقوشة.':
    'Authentic Omani coffee serving set engraved with intricate silver motifs inspired by Omani forts, including a Dallah and six cups.',
  'فضيات مطرح العريقة': 'Heritage Muttrah Silversmiths',
  'الفضيات وأدوات الضيافة': 'Silverware & Hospitality',

  'طقم فخار بهلاوي أصيل مطلي يدوياً بالنقوش التراثية': 'Authentic Hand-Painted Bahla Pottery Set',
  'إبداع حرفي من واحة بهلاء التاريخية، مصنوع من طين الواحة الطبيعي ومحروق في الأفران التقليدية لحفظ برودة الماء الطبيعية.':
    'Artisanal pottery from historic Bahla Oasis, crafted from natural clay and kiln-fired to naturally keep water cool.',
  'فخاريات الواحة القديمة': 'Old Oasis Pottery',
  'فخاريات بهلاء': 'Bahla Pottery',

  'خنجر عماني صوري أصلي فضة خالصة (صياغة يدوية)': 'Authentic Handcrafted Suri Pure Silver Omani Khanjar',
  'خنجر عماني بنصل فولاذي مقبض من الخشب الفاخر المطعم بالفضة الخالصة، وحزام منسوج بنقوش عمانية أصيلة مع غمد محفور بدقة.':
    'Traditional Omani Khanjar with steel blade, pure silver-inlaid hilt, embroidered belt, and finely engraved scabbard.',
  'دار الصياغة العمانية التراثية': 'Omani Heritage Silversmith House',
  'الخناجر والفضيات العمانية': 'Omani Khanjars & Silverware',

  // 4. الدورات التدريبية الـ 3 (العناوين، المدربون، المحاور)
  'إدارة وتوسيع المشاريع الناشئة وفق رؤية عُمان 2040': 'Managing & Scaling Startups under Oman Vision 2040',
  'إدارة الأعمال والاستثمار': 'Business & Investment',
  'د. سالم بن ناصر الحارثي': 'Dr. Salim Nasser Al Harthi',
  '4 أسابيع (16 ساعة)': '4 Weeks (16 Hours)',
  'تحديد القيمة المحلية المضافة (ICV) للمشروع': 'Defining In-Country Value (ICV) for your project',
  'بناء نموذج العمل التجاري وتوليد الإيرادات': 'Building a sustainable business model & revenue streams',
  'إدارة التدفقات النقدية وهوامش الأرباح بالريال العماني': 'Managing cash flows & profit margins in OMR',
  'الاستفادة من التسهيلات والتمويلات الوطنية': 'Leveraging national financing and SME facilities',

  'التسويق الرقمي وبناء الهوية التجارية للمنتجات الوطنية': 'Digital Marketing & Branding for National Products',
  'التسويق الرقمي والمبيعات': 'Digital Marketing & Sales',
  'أ. مريم بنت عبدالله البلوشية': 'Ms. Maryam Abdullah Al Balushi',
  '3 أسابيع (12 ساعة)': '3 Weeks (12 Hours)',
  'إدارة الحملات الإعلانية الموجهة للسوق المحلي والخليجي': 'Running targeted ad campaigns for Oman & GCC markets',
  'تصوير وإبراز المنتجات باحترافية على منصات التجارة': 'Professional product photography for e-commerce',
  'صياغة المحتوى التسويقي الجذاب عبر منصة مُنتجي': 'Crafting compelling marketing copy on Montaji',
  'أتمتة خدمة العملاء واستقبال الطلبات عبر واتساب': 'Automating customer support & WhatsApp orders',

  'دراسات الجدوى الاقتصادية وحساب نقطة التعادل': 'Economic Feasibility Studies & Break-Even Analysis',
  'المالية والاقتصاد': 'Finance & Economics',
  'م. خالد بن راشد المعمري': 'Eng. Khalid Rashid Al Maamari',
  'أسبوعان (8 ساعات)': '2 Weeks (8 Hours)',
  'حساب التكاليف الثابتة والمتغيرة بدقة': 'Accurately calculating fixed and variable costs',
  'تحديد سعر بيع الوحدة وهامش المساهمة الربحي': 'Setting unit selling price and contribution margin',
  'حساب نقطة التعادل النقدية ومعدل العائد الاستثماري (ROI)': 'Calculating cash break-even point and ROI',
  'تطبيق خطط التوسع المالي باستخدام الذكاء الاصطناعي': 'Applying financial expansion plans using AI',

  'مجاناً برعاية ريادة': 'Free (Sponsored by Riyada)',

  // 5. قصص النجاح (Success Stories)
  'تقنيات النخلة الذكية': 'Smart Palm Technologies',
  'أحمد بن حمد الشبيبي': 'Ahmed Hamad Al Shukaili',
  'الابتكار والتقنية الزراعية': 'AgriTech & Innovation',
  'بدأ المشروع كمجسم ابتكاري ونموذج أولي لفحص النخيل ومكافحة سوسة النخيل الحمراء بواسطة الذكاء الاصطناعي، ثم تحول عبر منصة مُنتجي إلى شركة ناشئة تخدم مزارع السلطنة.':
    'Started as an AI prototype to inspect date palms and combat red palm weevil, evolving through Montaji into a startup serving farms across Oman.',
  'تقطير اللبان العضوي الفاخر': 'Luxury Organic Frankincense Distillation',
  'فاطمة بنت سالم الحبسية': 'Fatma Salim Al Habsi',
  'الصناعات العطرية والتحويلية': 'Aromatic & Manufacturing Industries',

  // 6. سوق المنتجات والسلة والدفع والدورات والتذييل
  'السوق الوطني الموحد للمنتجات العمانية': 'National Omani Products Marketplace',
  'تسوق إبداعات رواد الأعمال العمانيين': 'Shop Authentic Omani Creations',
  'منتجات عمانية أصيلة وابتكارات تقنية حديثة من مشاريع معتمدة ومسجلة في ريادة من كافة محافظات السلطنة.':
    'Authentic Omani goods and innovations from licensed Riyada entrepreneurs across all governorates.',
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
  'مشغولات يدوية وفخار': 'Handicrafts & Pottery',
  'تقنية وابتكار': 'Tech & Innovation',
  'حاملو بطاقة ريادة فقط': 'Riyada Card Holders Only',
  'تم العثور على': 'Found',
  'منتج': 'products',
  'أضف للسلة': 'Add to Cart',
  'إضافة للسلة': 'Add to Cart',
  'إضافة إلى السلة': 'Add to Cart',
  'بطاقة ريادة': 'Riyada Card',
  'ريادة': 'Riyada',
  'ر.ع.': 'OMR',
  'ر.ع': 'OMR',
  'مشتري مؤكد': 'Verified Buyer',
  'تقييم النجوم:': 'Star Rating:',
  'قيّم طلبك': 'Rate Order',
  'اكتب مراجعة': 'Write Review',

  // المحافظات
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

  // أكاديمية الدورات والتذييل
  'أكاديمية مُنتجي لريادة الأعمال والتدريب المهني': 'Montaji Entrepreneurship & Training Academy',
  'برامج تدريبية متخصصة لتطوير مهارات الرواد': 'Specialized Training Programs for Entrepreneurs',
  'ورش عمل ودورات تفاعلية معتمدة يقدمها نخبة من الخبراء والاستشاريين العمانيين في مجالات الإدارة المالية، وتراخيص الأعمال، والتسويق الرقمي الحديث.':
    'Certified interactive workshops delivered by Omani experts covering financial management, business licensing, and modern digital marketing.',
  'المجال:': 'Field:',
  'المستوى:': 'Level:',
  'جميع المستويات': 'All Levels',
  'مبتدئ': 'Beginner',
  'متوسط': 'Intermediate',
  'متقدم': 'Advanced',
  'التشريعات والتراخيص الحكومية': 'Licensing & Regulations',
  'الإدارة والمالية': 'Finance & Management',
  'التسويق والتجارة الإلكترونية': 'E-Commerce & Marketing',
  'المحاضر:': 'Instructor:',
  'أبرز المحاور التدريبية:': 'Key Course Modules:',
  'التسجيل بالدورة': 'Enroll Now',
  'منصة عمانية متكاملة تهدف إلى تسريع نمو الشركات الناشئة ورواد الأعمال العمانيين، وربط المنتجات الوطنية المبتكرة بالأسواق المحلية والخليجية دعماً لرؤية عُمان 2040.':
    'An integrated Omani platform dedicated to empowering startups and connecting authentic Omani products to local and GCC markets under Oman Vision 2040.',
  'متوافقة مع معايير ريادة ووزارة التجارة العمانية': 'Compliant with Riyada & MOCI Oman Standards',
  'أقسام المنصة': 'Platform Sections',
  'خدمات الرواد والعملاء': 'User & Seller Services',
  'بيانات التواصل المباشر': 'Direct Contact',
  'مسقط، سلطنة عُمان - واحة المعرفة': 'Muscat, Oman - Knowledge Oasis',
  'بوابات وطنية شريكة:': 'Partner Portals:',
  'هيئة ريادة • منصة عُمان للأعمال • بنك التنمية العماني': 'Riyada • Oman Business Platform • Oman Development Bank',
  'شروط الاستخدام': 'Terms of Use',
  'سياسة الخصوصية': 'Privacy Policy',
  'صُنع بفخر في سلطنة عمان 🇴🇲': 'Proudly Made in Oman 🇴🇲',
};

const SORTED_DICTIONARY_KEYS = Object.keys(FULL_PLATFORM_DICTIONARY).sort(
  (a, b) => b.length - a.length
);

const originalTextNodeMap = new WeakMap<Text, string>();
const originalPlaceholderMap = new WeakMap<HTMLElement, string>();
const originalTitleMap = new WeakMap<HTMLElement, string>();

function translateArabicToEnglish(rawText: string): string {
  const trimmed = rawText.trim();
  if (!trimmed || !/[\u0600-\u06FF]/.test(trimmed)) return rawText;

  if (FULL_PLATFORM_DICTIONARY[trimmed]) {
    return rawText.replace(trimmed, FULL_PLATFORM_DICTIONARY[trimmed]);
  }

  let result = rawText;

  // ترجمة الأنماط الديناميكية
  result = result.replace(/المقاعد المتبقية:\s*(\d+)/g, 'Seats left: $1');
  result = result.replace(/مستوى:\s*مبتدئ/g, 'Level: Beginner');
  result = result.replace(/مستوى:\s*متوسط/g, 'Level: Intermediate');
  result = result.replace(/مستوى:\s*متقدم/g, 'Level: Advanced');
  result = result.replace(/(\d+)\s*مراجعات/g, '$1 reviews');
  result = result.replace(/عرض السلة\s*\((\d+)\s*عناصر\)/g, 'View Cart ($1 items)');
  result = result.replace(/استعراض كافة المنتجات\s*\((\d+)\)/g, 'View All Products ($1)');
  result = result.replace(/قصة نجاح ملهمة من\s*/g, 'Inspiring Success Story from ');
  result = result.replace(/المؤسس:\s*/g, 'Founder: ');
  result = result.replace(/•\s*تأسست عام\s*(\d+)/g, '• Est. $1');

  for (const arKey of SORTED_DICTIONARY_KEYS) {
    if (result.includes(arKey)) {
      result = result.split(arKey).join(FULL_PLATFORM_DICTIONARY[arKey]);
    }
  }

  return result;
}

function translateEntirePage(targetLang: AppLang) {
  if (typeof document === 'undefined' || !document.body) return;

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

    translateEntirePage(lang);

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
