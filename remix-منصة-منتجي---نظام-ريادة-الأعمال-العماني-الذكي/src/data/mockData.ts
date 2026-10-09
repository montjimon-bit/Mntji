export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // in OMR
  category: string;
  subCategory?: string;
  governorate: string;
  seller: {
    name: string;
    isRiyadaCertified: boolean;
    rating: number;
  };
  image: string;
  stock: number;
  featured?: boolean;
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  seatsAvailable: number;
  price: number | 'مجاناً برعاية ريادة';
  rating: number;
  level: 'مبتدئ' | 'متوسط' | 'متقدم';
  image: string;
  syllabus: string[];
}

export interface SuccessStory {
  id: string;
  founder: string;
  companyName: string;
  sector: string;
  governorate: string;
  yearEstablished: number;
  story: string;
  achievements: string[];
  image: string;
  growthRate: string;
}

export const OMAN_GOVERNORATES = [
  'محافظة مسقط',
  'محافظة ظفار',
  'محافظة الداخلية',
  'محافظة شمال الباطنة',
  'محافظة جنوب الباطنة',
  'محافظة شمال الشرقية',
  'محافظة جنوب الشرقية',
  'محافظة الظاهرة',
  'محافظة البريمي',
  'محافظة مسندم',
  'محافظة الوسطى',
];

export const PRODUCTS_DATA: Product[] = [
  {
    id: 'prod-1',
    title: 'لبان حوجري ظفاري ملكي نقي قطفة أولى',
    description: 'لبان حوجري نادر طبيعي 100% مستخرج من جبال سمحان بمحافظة ظفار، ذو جودة طبية وعطرية فائقة برائحة ليمونية زكية.',
    price: 18.5,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'اللبان الظفاري والبخور الملكي',
    governorate: 'محافظة ظفار',
    seller: {
      name: 'مؤسسة كنوز اللبان العمانية',
      isRiyadaCertified: true,
      rating: 4.9,
    },
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    featured: true,
  },
  {
    id: 'prod-2',
    title: 'عسل سدر عماني جبلي أصلي (موسم الجبل الأخضر)',
    description: 'عسل نحل بري نقي مفحوص مخبرياً من أزهار السدر البري في جبال الجبل الأخضر، خالٍ تماماً من أي إضافات أو تغذية.',
    price: 32.0,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'عسل عماني مفحوص',
    governorate: 'محافظة الداخلية',
    seller: {
      name: 'مناحل الجبل الأخضر الحديثة',
      isRiyadaCertified: true,
      rating: 5.0,
    },
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stock: 14,
    featured: true,
  },
  {
    id: 'prod-3',
    title: 'حلوى عمانية سلطانية زعفرانية بالمكسرات بالسمن البقري العماني',
    description: 'حلوى عمانية تقليدية مجهزة بأيدي عمانية متخصصة ومصنوعة من السمن البقري العماني الأصلي والزعفران النقي والهيل الفاخر والمكسرات المحمصة.',
    price: 9.5,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'الحلوى العمانية والتمور',
    governorate: 'محافظة جنوب الباطنة',
    seller: {
      name: 'مصنع بركاء للحلوى العمانية الفاخرة',
      isRiyadaCertified: true,
      rating: 4.8,
    },
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    featured: true,
  },
  {
    id: 'prod-4',
    title: 'طقم خزف وفخار بهلاوي يدوي بتصميم إسلامي معاصر',
    description: 'أواني فخارية مستدامة مصنوعة يدوياً من طين بهلاء التراثي الشهير مع زخارف ناعمة مستوحاة من العمارة العمانية وتصلح للتقديم والديكور.',
    price: 24.0,
    category: 'حرف وفنون يدوية',
    subCategory: 'أعمال حرفية معاصرة',
    governorate: 'محافظة الداخلية',
    seller: {
      name: 'مشغل إرث بهلاء للحرف اليدوية',
      isRiyadaCertified: true,
      rating: 4.9,
    },
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    stock: 8,
  },
  {
    id: 'prod-5',
    title: 'نظام ري ذكي موفر للمياه مدعوم بإنترنت الأشياء (IoT)',
    description: 'ابتكار تقني عماني للمزارع والحدائق يقلل استهلاك المياه بنسبة تصل إلى 45% مع تطبيق هاتف ذكي للتحكم والمتابعة اللحظية.',
    price: 85.0,
    category: 'تقنية وابتكار',
    subCategory: 'معدات تقنية وأنظمة ذكية',
    governorate: 'محافظة مسقط',
    seller: {
      name: 'شركة نماء التقنية الذكية',
      isRiyadaCertified: true,
      rating: 4.9,
    },
    image: 'https://images.unsplash.com/photo-1558441719-8b489c63f7d1?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    featured: true,
  },
  {
    id: 'prod-6',
    title: 'صندوق تمور فرض وخلاص نخب أول محشوة بالمكسرات العمانية',
    description: 'تمور عضوية من مزارع وادي سمائل وعبري مغلفة بأسلوب عصري وأنيق مع عبوة هدايا فاخرة تعكس كرم الضيافة العمانية.',
    price: 12.0,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'منتجات عضوية وزيوت طبيعية',
    governorate: 'محافظة الظاهرة',
    seller: {
      name: 'مؤسسة نخلة الأصالة',
      isRiyadaCertified: true,
      rating: 4.7,
    },
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=800&q=80',
    stock: 30,
  },
  {
    id: 'prod-7',
    title: 'عطر الخنجر الملكي المستوحى من التراث العماني (100 مل)',
    description: 'عطر شرقي فاخر يجمع بين نفحات اللبان العماني، خشب الصندل، ودهن العود الكمبودي الفاخر بتركيز Eau de Parfum يدوم طويلاً.',
    price: 45.0,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'اللبان الظفاري والبخور الملكي',
    governorate: 'محافظة مسقط',
    seller: {
      name: 'دار مجان للعطور الراقية',
      isRiyadaCertified: true,
      rating: 4.9,
    },
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    stock: 19,
  },
  {
    id: 'prod-8',
    title: 'زيت المورينجا العماني النقي المعصور على البارد (150 مل)',
    description: 'زيت طبيعي 100% مستخلص من بذور شجرة المورينجا المزروعة في شمال الباطنة، غني بمضادات الأكسدة للعناية بالبشرة والشعر.',
    price: 15.0,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'منتجات عضوية وزيوت طبيعية',
    governorate: 'محافظة شمال الباطنة',
    seller: {
      name: 'معصرة الغاف الخضراء',
      isRiyadaCertified: true,
      rating: 4.8,
    },
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock: 22,
  },
];

export const TRAINING_COURSES_DATA: TrainingCourse[] = [
  {
    id: 'course-1',
    title: 'تأسيس المشاريع عبر منصة عُمان للأعمال والحصول على بطاقة ريادة',
    category: 'التشريعات والتراخيص الحكومية',
    instructor: 'أ. سالم بن خميس البلوشي (خبير استشاري معتمد لدى ريادة)',
    duration: '4 أيام (16 ساعة تدريبية)',
    seatsAvailable: 15,
    price: 'مجاناً برعاية ريادة',
    rating: 4.9,
    level: 'مبتدئ',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'خطوات حجز الاسم التجاري وإصدار السجل التجاري الإلكتروني',
      'شروط الحصول على بطاقة ريادة والإعفاءات الضريبية والجمركية',
      'إدارة الأنشطة والاشتراطات البلدية والدفاع المدني',
      'الاستفادة من نسبة المشتريات الحكومية المخصصة للمؤسسات الصغيرة 10%',
    ],
  },
  {
    id: 'course-2',
    title: 'الإدارة المالية وإعداد القوائم ودراسات الجدوى للشركات العمانية الناشئة',
    category: 'الإدارة والمالية',
    instructor: 'د. مريم بنت راشد المعمرية (مستشارة مالية ومصرفية)',
    duration: '5 أيام (20 ساعة)',
    seatsAvailable: 8,
    price: 25,
    rating: 4.9,
    level: 'متوسط',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'حساب تكاليف التأسيس والتكاليف التشغيلية بالريال العماني',
      'إعداد التدفقات النقدية المتوقعة ونقطة التعادل (Break-even)',
      'متطلبات التقديم على قروض بنك التنمية العماني وصندوق الرفد سابقاً',
      'الضريبة المضافة في سلطنة عمان (VAT 5%) وضريبة دخل الشركات',
    ],
  },
  {
    id: 'course-3',
    title: 'التسويق الرقمي وتنمية مبيعات المتاجر الإلكترونية في السوق الخليجي',
    category: 'التسويق والتجارة الإلكترونية',
    instructor: 'م. أحمد بن ناصر الحارثي (مؤسس وكالة تسويق رقمي)',
    duration: '3 أيام (12 ساعة)',
    seatsAvailable: 20,
    price: 'مجاناً برعاية ريادة',
    rating: 4.8,
    level: 'مبتدئ',
    image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'بناء الهوية البصرية العمانية والتسويق عبر تيك توك وإنستغرام',
      'إدارة الحملات الإعلانية الممولة واستهداف الجمهور العماني والخليجي',
      'ربط بوابات الدفع الإلكتروني المعتمدة (ثواني، بنك مسقط، عُمان نت)',
      'خدمات التوصيل والشحن المحلي بين محافظات السلطنة',
    ],
  },
  {
    id: 'course-4',
    title: 'تطبيقات الذكاء الاصطناعي في تسريع العمليات وخفض التكاليف التشغيلية',
    category: 'التقنية والابتكار',
    instructor: 'م. فاطمة بنت سعود الهنائية (باحثة في الذكاء الاصطناعي)',
    duration: '3 أيام (15 ساعة)',
    seatsAvailable: 12,
    price: 35,
    rating: 5.0,
    level: 'متقدم',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'استخدام نماذج الذكاء الاصطناعي التوليدي في خدمة العملاء وصياغة المحتوى',
      'أتمتة المحاسبة وإدارة المخزون الذكية',
      'تحليل سلوك المستهلك والتنبؤ بالمبيعات في السوق المحلي',
    ],
  },
];

export const SUCCESS_STORIES_DATA: SuccessStory[] = [
  {
    id: 'story-1',
    founder: 'م. هيثم بن زاهر السالمي',
    companyName: 'شركة نماء للحلول الزراعية وإنترنت الأشياء',
    sector: 'التقنية الزراعية والبيئية',
    governorate: 'محافظة مسقط',
    yearEstablished: 2022,
    story: 'انطلقت الشركة بفكرة بسيطة من خريجي جامعة السلطان قابوس لحل معضلة استهلاك المياه في المزارع العمانية. بدعم من منصة ريادة وحاضنات الأعمال التقنية، نجح الفريق في تطوير مستشعرات ذكية محلية الصنع تحلل رطوبة التربة ودرجة الحرارة وتدير الري تلقائياً.',
    achievements: [
      'توفير أكثر من 3 ملايين لتر ماء في أكثر من 45 مزرعة في الباطنة والداخلية',
      'الحصول على تمويل استثماري من صندوق تنمية التكنولوجيا العماني (OTF)',
      'الفوز بجائزة أفضل ابتكار شبابي بيئي لعام 2024',
    ],
    growthRate: '+140% نمو سنوي',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'story-2',
    founder: 'د. أمل بنت سالم المعشنية',
    companyName: 'مؤسسة أريج اللبان للصناعات الطبية والعطرية',
    sector: 'الصناعات التحويلية والمنتجات الطبيعية',
    governorate: 'محافظة ظفار',
    yearEstablished: 2021,
    story: 'استطاعت د. أمل تحويل اللبان الحوجري الظفاري من مجرد بخور تقليدي إلى مستخلصات طبية ومستحضرات تجميلية معيارية بفضل أبحاثها المخبرية وشغفها بالثروات الطبيعية لعمان.',
    achievements: [
      'تصدير المنتجات إلى 14 دولة خليجية وأوروبية',
      'توظيف 18 سيدة عمانية في خط الإنتاج والتغليف بصلالة',
      'الحصول على شهادة الآيزو العالمية في التصنيع الطبيعي النقي',
    ],
    growthRate: '+85% مبيعات تصديرية',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'story-3',
    founder: 'الحرفي عبدالله بن مسعود الهنائي',
    companyName: 'دار بهلاء للخزف المعاصر والتصميم المعماري',
    sector: 'الحرف التراثية والتصميم الداخلي',
    governorate: 'محافظة الداخلية',
    yearEstablished: 2020,
    story: 'توارث عبدالله صناعة الفخار أباً عن جد في ولاية بهلاء العريقة، لكنه أحدث نقلة نوعية بإدخال أفران تقنية حديثة وتصاميم هندسية عصرية تلائم الفنادق والمنتجعات السياحية الراقية بالسلطنة.',
    achievements: [
      'تجهيز أكثر من 6 منتجعات فندقية كبرى في مسقط والجبل الأخضر',
      'تدريب أكثر من 120 شاباً وشابة عمانيين في فنون الخزف الحديث',
      'افتتاح صالة عرض دائمة في مركز العاصمة التجاري',
    ],
    growthRate: '+95% نمو في عقود المشاريع',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
  },
];
