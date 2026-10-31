export interface Product {
  id: string;
  title: string;
  description: string;
  price: number; // بالريال العماني OMR
  category: string;
  subCategory?: string;
  governorate: string;
  seller: {
    name: string;
    isRiyadaCertified: boolean;
    rating: number;
    email?: string;
  };
  sellerId?: string;
  sellerEmail?: string;
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
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock: 25,
    featured: true,
  },
  {
    id: 'prod-2',
    title: 'عسل سدر عماني جبلي أصلي (موسم الجبل الأخضر)',
    description: 'عسل نحل بري نقي مفحوص مخبرياً من أزهار السدر البري في جبال الجبل الأخضر، خالٍ تماماً من أي إضافات أو تغذية سكرية.',
    price: 32.0,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'عسل عماني مفحوص',
    governorate: 'محافظة الداخلية',
    seller: {
      name: 'مناحل الجبل الأخضر الحديثة',
      isRiyadaCertified: true,
      rating: 5.0,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    // صورة عسل سدر طبيعي فاخر بدلاً من صورة البطيخ
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80',
    stock: 14,
    featured: true,
  },
  {
    id: 'prod-3',
    title: 'حلوى عمانية سلطانية زعفرانية بالمكسرات والسمن البقري',
    description: 'حلوى عمانية مطبوخة على الحطب بالطريقة العمانية الأصيلة باستخدام السمن البقري المحلي، والزعفران الإيراني الفاخر والهيل والمكسرات.',
    price: 8.5,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'الحلوى العمانية التقليدية',
    governorate: 'محافظة جنوب الباطنة',
    seller: {
      name: 'مصنع بركاء للحلوى العمانية',
      isRiyadaCertified: true,
      rating: 4.8,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80',
    stock: 40,
    featured: true,
  },
  {
    id: 'prod-4',
    title: 'طقم دلال وفناجين قهوة تراثية بصياغة فضية',
    description: 'طقم تقديم قهوة عمانية أصيل مكسو بالنقوش الفضية الدقيقة المستوحاة من قلاع وحصون عُمان، يضم دلة رسلان وستة فناجين منقوشة.',
    price: 45.0,
    category: 'مشغولات يدوية وفخار',
    subCategory: 'الفضيات وأدوات الضيافة',
    governorate: 'محافظة مسقط',
    seller: {
      name: 'فضيات مطرح العريقة',
      isRiyadaCertified: false,
      rating: 4.7,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    stock: 8,
    featured: false,
  },
  {
    id: 'prod-5',
    title: 'طقم فخار بهلاوي أصيل مطلي يدوياً بالنقوش التراثية',
    description: 'إبداع حرفي من واحة بهلاء التاريخية، مصنوع من طين الواحة الطبيعي ومحروق في الأفران التقليدية لحفظ برودة الماء الطبيعية.',
    price: 14.0,
    category: 'مشغولات يدوية وفخار',
    subCategory: 'فخاريات بهلاء',
    governorate: 'محافظة الداخلية',
    seller: {
      name: 'فخاريات الواحة القديمة',
      isRiyadaCertified: true,
      rating: 4.9,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    stock: 19,
    featured: true,
  },
  {
    id: 'prod-6',
    title: 'خنجر عماني صوري أصلي فضة خالصة (صياغة يدوية)',
    description: 'خنجر عماني بنصل فولاذي مقبض من الخشب الفاخر المطعم بالفضة الخالصة، وحزام منسوج بنقوش عمانية أصيلة مع غمد محفور بدقة.',
    price: 185.0,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'الخناجر والفضيات العمانية',
    governorate: 'محافظة جنوب الشرقية',
    seller: {
      name: 'دار الصياغة العمانية التراثية',
      isRiyadaCertified: true,
      rating: 5.0,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    stock: 5,
    featured: true,
  },
  {
    id: 'prod-7',
    title: 'مبخرة نحاسية عمانية منقوشة باليد مع فحم سريع الاشتعال',
    description: 'مبخرة فاخرة مصنوعة من النحاس الخالص بتصميم تراثي عماني عريق لنشر رائحة اللبان والبخور في المجالس والمنازل.',
    price: 12.0,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'المباخر والمستلزمات التراثية',
    governorate: 'محافظة مسقط',
    seller: {
      name: 'مقتنيات مسقط التراثية',
      isRiyadaCertified: true,
      rating: 4.7,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
    stock: 30,
    featured: false,
  },
  {
    id: 'prod-8',
    title: 'زيت اللبان العماني العطري المقطر على البارد (15 مل)',
    description: 'زيت نقي 100% مستخلص بالتقطير البخاري لدموع اللبان الحوجري، مثالي للعناية بالبشرة والاسترخاء العطري الفاخر.',
    price: 22.0,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'الزيوت العطرية النقية',
    governorate: 'محافظة ظفار',
    seller: {
      name: 'تقطير لبان صلالة',
      isRiyadaCertified: true,
      rating: 4.9,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    stock: 22,
    featured: false,
  },
  {
    id: 'prod-9',
    title: 'صندوق تمر خلاص الظاهرة الملكي مع المكسرات والهيل',
    description: 'تمر خلاص فاخر منتقى حبة حبة من مزارع عبري الخصبة، محشو باللوز المحمص ومنكه بالهيل والزعفران الطبيعي.',
    price: 6.5,
    category: 'أغذية ومنتجات طبيعية',
    subCategory: 'التمور العمانية الفاخرة',
    governorate: 'محافظة الظاهرة',
    seller: {
      name: 'تمور الظاهرة الطبيعية',
      isRiyadaCertified: false,
      rating: 4.6,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1599785209707-a456fc1337bb?auto=format&fit=crop&w=800&q=80',
    stock: 50,
    featured: false,
  },
  {
    id: 'prod-10',
    title: 'سلة خوص من سعف النخيل المنسوج يدوياً (ميد ان صحار)',
    description: 'مشغولات سعفية أصيلة بأيدي نساء حرفيات في شمال الباطنة، مدموجة بخيوط قطنية ملونة لحفظ الخبز والضيافة العمانية.',
    price: 7.0,
    category: 'مشغولات يدوية وفخار',
    subCategory: 'السعينيات والمشغولات النسائية',
    governorate: 'محافظة شمال الباطنة',
    seller: {
      name: 'أنامل صحار الحرفية',
      isRiyadaCertified: true,
      rating: 4.8,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    stock: 15,
    featured: false,
  },
  {
    id: 'prod-11',
    title: 'دهن عود عماني خاص معتق (ربع تولة)',
    description: 'تركيبة دهن عود شرقي فاخر معتق ممزوج بنفحات اللبان العماني الملكي والعنبر، ثبات يدوم طويلاً للمناسبات الرسمية.',
    price: 28.0,
    category: 'منتجات عطرية وتراثية',
    subCategory: 'العطور الشرقية والعود',
    governorate: 'محافظة مسقط',
    seller: {
      name: 'أطياب السلطنة للعطور',
      isRiyadaCertified: true,
      rating: 5.0,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    stock: 12,
    featured: true,
  },
  {
    id: 'prod-12',
    title: 'صندوق خشبي مبيت عماني مطعم بالنحاس الأصفر',
    description: 'مندوس عماني تقليدي مصغر لحفظ المجوهرات والفضيات، مصنوع من خشب الساج الأصيل مع مسامير نحاسية بارزة ونقوش محفورة باليد.',
    price: 38.0,
    category: 'مشغولات يدوية وفخار',
    subCategory: 'المناديس والمقتنيات الخشبية',
    governorate: 'محافظة مسندم',
    seller: {
      name: 'حرفيو مسندم للتراث',
      isRiyadaCertified: true,
      rating: 4.9,
      email: 'hudifamoosa2007@gmail.com',
    },
    sellerId: 'hudifamoosa2007',
    sellerEmail: 'hudifamoosa2007@gmail.com',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    stock: 7,
    featured: false,
  },
];

export const TRAINING_COURSES_DATA: TrainingCourse[] = [
  {
    id: 'course-1',
    title: 'إدارة وتوسيع المشاريع الناشئة وفق رؤية عُمان 2040',
    category: 'إدارة الأعمال والاستثمار',
    instructor: 'د. سالم بن ناصر الحارثي',
    duration: '4 أسابيع (16 ساعة)',
    seatsAvailable: 18,
    price: 'مجاناً برعاية ريادة',
    rating: 4.9,
    level: 'مبتدئ',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'تحديد القيمة المحلية المضافة (ICV) للمشروع',
      'بناء نموذج العمل التجاري وتوليد الإيرادات',
      'إدارة التدفقات النقدية وهوامش الأرباح بالريال العماني',
      'الاستفادة من التسهيلات والتمويلات الوطنية',
    ],
  },
  {
    id: 'course-2',
    title: 'التسويق الرقمي وبناء الهوية التجارية للمنتجات الوطنية',
    category: 'التسويق الرقمي والمبيعات',
    instructor: 'أ. مريم بنت عبدالله البلوشية',
    duration: '3 أسابيع (12 ساعة)',
    seatsAvailable: 24,
    price: 'مجاناً برعاية ريادة',
    rating: 4.8,
    level: 'متوسط',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'إدارة الحملات الإعلانية الموجهة للسوق المحلي والخليجي',
      'تصوير وإبراز المنتجات باحترافية على منصات التجارة',
      'صياغة المحتوى التسويقي الجذاب عبر منصة مُنتجي',
      'أتمتة خدمة العملاء واستقبال الطلبات عبر واتساب',
    ],
  },
  {
    id: 'course-3',
    title: 'دراسات الجدوى الاقتصادية وحساب نقطة التعادل',
    category: 'المالية والاقتصاد',
    instructor: 'م. خالد بن راشد المعمري',
    duration: 'أسبوعان (8 ساعات)',
    seatsAvailable: 12,
    price: 'مجاناً برعاية ريادة',
    rating: 5.0,
    level: 'متوسط',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    syllabus: [
      'حساب التكاليف الثابتة والمتغيرة بدقة',
      'تحديد سعر بيع الوحدة وهامش المساهمة الربحي',
      'حساب نقطة التعادل النقدية ومعدل العائد الاستثماري (ROI)',
      'تطبيق خطط التوسع المالي باستخدام الذكاء الاصطناعي',
    ],
  },
];

export const SUCCESS_STORIES_DATA: SuccessStory[] = [
  {
    id: 'story-1',
    founder: 'أحمد بن حمد الشبيبي',
    companyName: 'تقنيات النخلة الذكية',
    sector: 'الابتكار والتقنية الزراعية',
    governorate: 'محافظة الداخلية',
    yearEstablished: 2023,
    story: 'بدأ المشروع كمجسم ابتكاري ونموذج أولي لفحص النخيل ومكافحة سوسة النخيل الحمراء بواسطة الذكاء الاصطناعي، ثم تحول عبر منصة مُنتجي إلى شركة ناشئة تخدم مزارع السلطنة.',
    achievements: [
      'فحص أكثر من 15,000 نخلة في مختلف ولايات الداخلية',
      'الحصول على شهادة اعتماد من ريادة ودعم الابتكار الوطني',
      'تحقيق نمو في المبيعات بنسبة تفوق 140% خلال عام واحد',
    ],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    growthRate: '+140%',
  },
  {
    id: 'story-2',
    founder: 'فاطمة بنت سالم الحبسية',
    companyName: 'تقطير اللبان العضوي الفاخر',
    sector: 'الصناعات العطرية والتحويلية',
    governorate: 'محافظة ظفار',
    yearEstablished: 2024,
    story: 'استطاعت فاطمة تحويل استخلاص زيوت اللبان العماني الحوجري من عمل منزلي بسيط إلى خط إنتاج مسجل يصدّر لعدة دول خليجية بجودة ومواصفات عالمية.',
    achievements: [
      'إنتاج 6 مستحضرات طبيعية معتمدة من وزارة التجارة والصناعة',
      'توزيع المنتجات عبر أكثر من 30 متجراً محلياً ومنصة مُنتجي',
      'تحقيق مبيعات شهرية منتظمة تغطي تكاليف التوسع وتوظيف كادر عماني',
    ],
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
    growthRate: '+95%',
  },
];
