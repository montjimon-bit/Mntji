import React, { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Printer,
  Copy,
  Check,
  Building,
  Coins,
  ShieldCheck,
  RefreshCw,
  Lightbulb,
  FileSpreadsheet,
  AlertCircle,
  Clock,
  ArrowRight,
  Cpu,
  ShoppingCart,
  Sprout,
  Compass,
  Truck,
  HeartPulse,
  Leaf,
  Layers,
  ChevronDown,
  Info,
  Folder,
  Bookmark,
} from 'lucide-react';
import { OMAN_GOVERNORATES } from '../data/mockData';
import { AiService } from '../services/ai-service';
import { useAuth } from '../context/AuthContext';
import {
  AwniClassificationService,
  SavedAwniConversation,
  AwniCategoryKey,
} from '../services/awni-classification-service';

interface AiBusinessIdeaViewProps {
  onNavigate: (view: string) => void;
}

interface SectorCategory {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  subSectors: string[];
  licensingAuthority: string;
  fundingOpportunities: string;
  sampleIdeas: {
    title: string;
    subSector: string;
    gov: string;
    budget: string;
    desc: string;
  }[];
}

const SECTOR_CATEGORIES: SectorCategory[] = [
  {
    id: 'tech',
    name: 'التقنية والذكاء الاصطناعي (Tech & AI)',
    badge: 'أولوية رؤية 2040',
    icon: Cpu,
    description: 'تطبيقات الجوال، حلول الذكاء الاصطناعي، البرمجيات السحابية، والتقنية المالية (FinTech).',
    subSectors: [
      'تطبيقات الجوال والمنصات الرقمية',
      'حلول الذكاء الاصطناعي وتحليل البيانات',
      'التقنية المالية وأنظمة الدفع (FinTech)',
      'إنترنت الأشياء والأتمتة الذكية',
    ],
    licensingAuthority: 'وزارة النقل والاتصالات وتقنية المعلومات + منصة عُمان للأعمال (استثمر بسهولة)',
    fundingOpportunities: 'صندوق تنمية التكنولوجيا العماني (OTF)، بنك التنمية العماني، وحوافز ريادة للابتكار',
    sampleIdeas: [
      {
        title: 'نظام ذكاء اصطناعي لأتمتة خدمة عملاء المتاجر العمانية',
        subSector: 'حلول الذكاء الاصطناعي وتحليل البيانات',
        gov: 'محافظة مسقط',
        budget: 'من 15,000 إلى 30,000 ريال عماني',
        desc: 'روبوت محادثة تفاعلي يفهم اللهجة العمانية ويدير طلبات الزبائن والمخزون ويرتبط بـ WhatsApp و Instagram للمؤسسات الصغيرة.',
      },
      {
        title: 'تطبيق تنظيم النقل التشاركي للطرود بين المحافظات',
        subSector: 'تطبيقات الجوال والمنصات الرقمية',
        gov: 'محافظة شمال الباطنة',
        budget: 'من 20,000 إلى 40,000 ريال عماني',
        desc: 'منصة تقنية تربط المسافرين وسائقي التوصيل بالمحلات والأفراد لشحن الطرود السريعة في نفس اليوم بين مسقط وصحار ونزوى.',
      },
      {
        title: 'بوابة دفع وفواتير ميسرة لأصحاب الأعمال الحرة والأسر المنتجة',
        subSector: 'التقنية المالية وأنظمة الدفع (FinTech)',
        gov: 'محافظة مسقط',
        budget: 'من 25,000 إلى 50,000 ريال عماني',
        desc: 'حل تقني مالي يوفر روابط دفع فورية عبر Apple Pay والبطاقات البنكية العمانية مع إدارة فواتير إلكترونية مبسطة ومتوافقة مع ريادة.',
      },
    ],
  },
  {
    id: 'ecommerce',
    name: 'التجارة الإلكترونية والمنصات الرقمية',
    badge: 'نمو فائق',
    icon: ShoppingCart,
    description: 'متاجر المنتجات العمانية، الدروب شيبينغ، منصات الأسر المنتجة، والتسويق الرقمي.',
    subSectors: [
      'متاجر بيع المنتجات العمانية والحرفية',
      'منصات وسيطة لحجز الخدمات والورش',
      'تطبيقات التوصيل والطلب السريع',
      'التجارة الإلكترونية والتصدير الخليجي',
    ],
    licensingAuthority: 'وزارة التجارة والصناعة وترويج الاستثمار (ترخيص التجارة الإلكترونية)',
    fundingOpportunities: 'تمويل المشاريع الصغيرة من بنك التنمية، وبرامج هيئة ريادة لتسويق المتاجر',
    sampleIdeas: [
      {
        title: 'متجر إلكتروني لصناديق الهدايا العمانية الفاخرة المخصصة',
        subSector: 'متاجر بيع المنتجات العمانية والحرفية',
        gov: 'محافظة مسقط',
        budget: 'من 5,000 إلى 15,000 ريال عماني',
        desc: 'متجر رقمي يتيح للعملاء والشركات تصميم بوكس إهداء يحتوي على لبان حوجري، حلوى بركاء، وفضيات عمانية، مع تغليف مخصص وتوصيل.',
      },
      {
        title: 'سوق إلكتروني متكامل للحرفيين وصنّاع الفخار والفضة',
        subSector: 'منصات وسيطة لحجز الخدمات والورش',
        gov: 'محافظة الداخلية',
        budget: 'من 12,000 إلى 25,000 ريال عماني',
        desc: 'منصة لعرض منتجات حرفيي بهلاء ونزوى وربطهم بالمشترين من داخل وخارج السلطنة مع خدمات الشحن الدولي والدفع الإلكتروني.',
      },
      {
        title: 'منصة توريد وتوصيل القهوة والتمور العمانية للشركات',
        subSector: 'التجارة الإلكترونية والتصدير الخليجي',
        gov: 'محافظة جنوب الباطنة',
        budget: 'من 10,000 إلى 20,000 ريال عماني',
        desc: 'خدمة اشتراكات شهرية للجهات والمؤسسات لتوفير القهوة المختصة العمانية وأجود أنواع التمور الفاخرة للضيافة المكتبية الدورية.',
      },
    ],
  },
  {
    id: 'agriculture',
    name: 'الزراعة والأمن الغذائي والاستزراع',
    badge: 'أمن غذائي وطني',
    icon: Sprout,
    description: 'الزراعة المائية، البيوت المحمية، النخيل والتمور، مناحل العسل الجبلي، والاستزراع السمكي.',
    subSectors: [
      'الزراعة المائية والعمودية الحديثة (Hydroponics)',
      'إنتاج وتعبئة عسل السدر والسمر العماني النقي',
      'الاستزراع السمكي والربيان (Aquaculture)',
      'الصناعات الغذائية التحويلية للتمور والفواكه',
    ],
    licensingAuthority: 'وزارة الثروة الزراعية والسمكية وموارد المياه + بلدية المحافظة',
    fundingOpportunities: 'قروض زراعية وسمكية ميسرة بنسبة فائدة صفرية من بنك التنمية العماني، وأراضي حق انتفاع مخفضة',
    sampleIdeas: [
      {
        title: 'مزرعة بيوت محمية ذكية لإنتاج الفراولة والخضار الورقية في الجبل الأخضر',
        subSector: 'الزراعة المائية والعمودية الحديثة (Hydroponics)',
        gov: 'محافظة الداخلية',
        budget: 'من 20,000 إلى 45,000 ريال عماني',
        desc: 'استغلال طقس الجبل الأخضر المعتدل لإنتاج محاصيل نوعية عالية القيمة بتقنيات الري الذكي وتوريدها للفنادق والمطاعم الراقية.',
      },
      {
        title: 'مركز نموذجي لتصفية وتعبئة عسل السدر الجبلي بمواصفات التصدير',
        subSector: 'إنتاج وتعبئة عسل السدر والسمر العماني النقي',
        gov: 'محافظة الظاهرة',
        budget: 'من 15,000 إلى 30,000 ريال عماني',
        desc: 'مشروع لتجميع العسل من النحالين المحليين وفحصه مخبرياً وتعبئته بهوية تسويقية فاخرة تحمل علامة الجودة العمانية للأسواق الإقليمية.',
      },
      {
        title: 'أحواض استزراع سمكي مكثف لأسماك الهامور والكوفر',
        subSector: 'الاستزراع السمكي والربيان (Aquaculture)',
        gov: 'محافظة الوسطى',
        budget: 'من 35,000 إلى 70,000 ريال عماني',
        desc: 'مشروع استزراع ساحلي باستخدام مياه البحر المفلترة لتوفير أسماك طازجة يومية للأسواق المحلية مع الاستفادة من حوافز الأمن الغذائي.',
      },
    ],
  },
  {
    id: 'crafts',
    name: 'الصناعات الحرفية والمنتجات التراثية',
    badge: 'هوية وطنية',
    icon: Layers,
    description: 'تقطير اللبان الظفاري، صياغة الفضيات والخناجر العمانية، الفخار البهلاوي، والنسيج والأزياء.',
    subSectors: [
      'استخلاص الزيوت ومستحضرات اللبان الحوجري',
      'صياغة وتطريز الخناجر والفضيات النزوية',
      'صناعة وتطوير الخزف والفخار البهلاوي التراثي',
      'تصميم وخياطة الأزياء والعبايات العمانية المطرزة',
    ],
    licensingAuthority: 'هيئة تنمية المؤسسات الصغيرة والمتوسطة (إدارة الصناعات الحرفية) + وزارة التجارة',
    fundingOpportunities: 'دعم حرفي كامل من ريادة، أولوية في المعارض الدولية والوطنية، وقروض ميسرة من بنك التنمية',
    sampleIdeas: [
      {
        title: 'معمل تقطير واستخلاص زيت اللبان الحوجري الطبيعي النقي 100%',
        subSector: 'استخلاص الزيوت ومستحضرات اللبان الحوجري',
        gov: 'محافظة ظفار',
        budget: 'من 15,000 إلى 35,000 ريال عماني',
        desc: 'استخلاص الزيوت العطرية والطبية من لبان حوجري قطفة أولى بجبال سمحان مع توثيق مخبري للتصدير لشركات العطور العالمية.',
      },
      {
        title: 'ورشة حديثة لصياغة الخناجر والفضيات العمانية عيار 925 مع حفر الليزر',
        subSector: 'صياغة وتطريز الخناجر والفضيات النزوية',
        gov: 'محافظة الداخلية',
        budget: 'من 20,000 إلى 40,000 ريال عماني',
        desc: 'الجمع بين الصياغة اليدوية العمانية الأصيلة والتقنيات الحديثة لإنتاج هدايا تذكارية وتذكارات كبار الشخصيات والبروتوكول.',
      },
      {
        title: 'استوديو تصميم أواني وقطع ديكور من الفخار البهلاوي المعاصر',
        subSector: 'صناعة وتطوير الخزف والفخار البهلاوي التراثي',
        gov: 'محافظة الداخلية',
        budget: 'من 10,000 إلى 22,000 ريال عماني',
        desc: 'إعادة إحياء طين بهلاء بأشكال هندسية عصرية وألوان تناسب المقاهي والفنادق الراقية مع تقديم ورش تجارب حية للسياح.',
      },
    ],
  },
  {
    id: 'tourism',
    name: 'السياحة والضيافة والتراث',
    badge: 'فرص سياحية واعدة',
    icon: Compass,
    description: 'النزل التراثية والبيئية، سياحة المغامرات والتخييم، المقاهي والمطاعم ذات الطابع العماني الأصيل.',
    subSectors: [
      'النزل التراثية والبيئية (Heritage Inns)',
      'سياحة المغامرات والتخييم الفاخر (Glamping)',
      'المقاهي والمطاعم الثقافية العمانية',
      'تنظيم الجولات السياحية والتجارب البيئية',
    ],
    licensingAuthority: 'وزارة التراث والسياحة + بلدية المحافظة والدفاع المدني',
    fundingOpportunities: 'تسهيلات بنك التنمية للقطاع الفندقي والسياحي، وإعفاءات للمشاريع المنفذة بالمحافظات المستهدفة',
    sampleIdeas: [
      {
        title: 'نزل ضيافة تراثي في حارة العقر القديمة بنزوى',
        subSector: 'النزل التراثية والبيئية (Heritage Inns)',
        gov: 'محافظة الداخلية',
        budget: 'من 30,000 إلى 65,000 ريال عماني',
        desc: 'ترميم بيت أثري وتحويله لنزل سياحي فاخر يقدم تجربة الإقامة التراثية والمأكولات العمانية مع جولات تعريفية بالقلعة والسوق.',
      },
      {
        title: 'مخيم تخييم فاخر بيئي (Glamping) في رمال الشرقية (بدية)',
        subSector: 'سياحة المغامرات والتخييم الفاخر (Glamping)',
        gov: 'محافظة شمال الشرقية',
        budget: 'من 40,000 إلى 80,000 ريال عماني',
        desc: 'خيام شمسية مكيفة ومجهزة بالكامل بأسلوب بدوي راقٍ تمنح النزلاء تجربة رصد النجوم والرحلات الصحراوية وقيادة الدراجات الرملية.',
      },
      {
        title: 'مركز سياحة مغامرات بحرية واستكشاف الدلافين بمضيق هرمز',
        subSector: 'تنظيم الجولات السياحية والتجارب البيئية',
        gov: 'محافظة مسندم',
        budget: 'من 25,000 إلى 50,000 ريال عماني',
        desc: 'قوارب سريعة مجهزة للغطس ومشاهدة الدلافين واستكشاف الخيران البحرية الشهيرة بمسندم مع مرشدين عمانيين معتمدين.',
      },
    ],
  },
  {
    id: 'logistics',
    name: 'اللوجستيات وسلاسل الإمداد',
    badge: 'مركز لوجستي إقليمي',
    icon: Truck,
    description: 'توصيل الميل الأخير، التخزين الجاف والمبرد، وربط الموانئ والمناطق الحرة بالمحافظات.',
    subSectors: [
      'توصيل الميل الأخير السريع لولايات السلطنة',
      'المستودعات الذكية والتخزين المبرد للمنتجات الطازجة',
      'النقل التشاركي للبضائع والمحاصيل الزراعية',
      'حلول التغليف والشحن الدولي للشركات الناشئة',
    ],
    licensingAuthority: 'وزارة النقل والاتصالات وتقنية المعلومات + شرطة عمان السلطانية',
    fundingOpportunities: 'تمويل أساطيل النقل من بنك التنمية، وحوافز المناطق الحرة والمدن الصناعية (مدائن وخزائن)',
    sampleIdeas: [
      {
        title: 'شبكة شحن مبرد سريع لنقل الأسماك من الوسطى وظفار إلى مسقط',
        subSector: 'توصيل الميل الأخير السريع لولايات السلطنة',
        gov: 'محافظة الوسطى',
        budget: 'من 30,000 إلى 60,000 ريال عماني',
        desc: 'شاحنات مجهزة بحساسات حرارية لتوصيل صيد اليوم البحري الطازج مباشرة للمطاعم والمنازل خلال ساعات معدودة.',
      },
      {
        title: 'مستودع تخزين مركزي وتجهيز الطلبات لمتاجر التجارة الإلكترونية العمانية',
        subSector: 'المستودعات الذكية والتخزين المبرد للمنتجات الطازجة',
        gov: 'محافظة جنوب الباطنة',
        budget: 'من 35,000 إلى 75,000 ريال عماني',
        desc: 'مرفق تخزين في مدينة خزائن اللوجستية يقدم خدمات التعبئة والتغليف وإدارة المرتجعات لمتاجر إنستغرام ورواد الأعمال.',
      },
      {
        title: 'خدمة دراجات وسيارات كهربائية للتوصيل السريع الصديق للبيئة في مسقط',
        subSector: 'توصيل الميل الأخير السريع لولايات السلطنة',
        gov: 'محافظة مسقط',
        budget: 'من 20,000 إلى 45,000 ريال عماني',
        desc: 'أسطول توصيل نظيف يقلل تكاليف الوقود بنسبة 60% ويقدم خدمات توصيل فورية للمستندات والأدوية والهدايا داخل العاصمة.',
      },
    ],
  },
  {
    id: 'health_beauty',
    name: 'الصحة والجمال والعناية الطبيعية',
    badge: 'طلب متنامٍ',
    icon: HeartPulse,
    description: 'مستحضرات التجميل العضوية باللبان العماني، الأغذية الصحية والمكملات، والمراكز المتخصصة.',
    subSectors: [
      'مستحضرات عناية طبيعية بزيت اللبان العماني',
      'صابون ومنتجات عناية عضوية بالأعشاب البرية',
      'مراكز الاستشفاء والعناية الطبيعية المستوحاة من التراث',
      'المكملات الغذائية والأغذية العضوية البديلة',
    ],
    licensingAuthority: 'وزارة الصحة + بلدية المحافظة + وزارة التجارة والصناعة',
    fundingOpportunities: 'تسهيلات تسجيل المنتجات بالمختبرات المعتمدة، وقروض دعم المشاريع الصناعية والطبية من بنك التنمية',
    sampleIdeas: [
      {
        title: 'خط إنتاج سيروم وكريمات مكافحة الشيخوخة بخلاصة اللبان الحوجري',
        subSector: 'مستحضرات عناية طبيعية بزيت اللبان العماني',
        gov: 'محافظة مسقط',
        budget: 'من 20,000 إلى 40,000 ريال عماني',
        desc: 'تركيبة مرخصة طبياً غنية بحمض البوزويلك المستخرج من اللبان الظفاري موجهة للأسواق المحلية والخليجية.',
      },
      {
        title: 'معمل صابون وزيوت استحمام عضوية بنباتات الجبل الأخضر العطرية',
        subSector: 'صابون ومنتجات عناية عضوية بالأعشاب البرية',
        gov: 'محافظة الداخلية',
        budget: 'من 10,000 إلى 22,000 ريال عماني',
        desc: 'صناعة منتجات صابون يدوي معجون بزيت الزيتون العماني والريحان والورد الجبلي بتغليف صديق للبيئة خالي من البلاستيك.',
      },
      {
        title: 'مركز عافية وتدليك استرخائي تراثي باستخدام الزيوت واللبان العماني',
        subSector: 'مراكز الاستشفاء والعناية الطبيعية المستوحاة من التراث',
        gov: 'محافظة ظفار',
        budget: 'من 25,000 إلى 50,000 ريال عماني',
        desc: 'مركز متخصص يقدم جلسات استرخاء وعلاج طبيعي تجمع بين التقاليد العمانية والأساليب الحديثة في صلالة.',
      },
    ],
  },
  {
    id: 'sustainability',
    name: 'الاقتصاد الأخضر والطاقة والاستدامة',
    badge: 'المستقبل المستدام',
    icon: Leaf,
    description: 'الطاقة الشمسية، تدوير المخلفات، ترشيد المياه، والحلول البيئية للمزارع والمباني.',
    subSectors: [
      'تركيب وصيانة أنظمة الطاقة الشمسية للمزارع والمنازل',
      'إعادة تدوير المخلفات العضوية وإنتاج السماد العماني',
      'حلول ترشيد وتقنية تنقية مياه الآبار والري الذكي',
      'التعبئة والتغليف القابل للتحلل الصديق للبيئة',
    ],
    licensingAuthority: 'هيئة البيئة + وزارة الطاقة والمعادن + هيئة تنظيم الخدمات العامة',
    fundingOpportunities: 'مبادرات الحياد الصفري الكربوني 2050، منح الابتكار الأخضر، وتمويل ميسر من بنك التنمية',
    sampleIdeas: [
      {
        title: 'محطات طاقة شمسية مستقلة لتشغيل مضخات مياه الآبار في مزارع الباطنة',
        subSector: 'تركيب وصيانة أنظمة الطاقة الشمسية للمزارع والمنازل',
        gov: 'محافظة جنوب الباطنة',
        budget: 'من 25,000 إلى 55,000 ريال عماني',
        desc: 'تزويد المزارعين بأنظمة طاقة كهروضوئية تخفض فواتير الكهرباء وتعمل باستقلالية في المناطق الزراعية النائية.',
      },
      {
        title: 'مصنع تدوير مخلفات النخيل وتحويلها إلى سماد عضوي وفحم صديق للبيئة',
        subSector: 'إعادة تدوير المخلفات العضوية وإنتاج السماد العماني',
        gov: 'محافظة الداخلية',
        budget: 'من 30,000 إلى 60,000 ريال عماني',
        desc: 'معالجة مخلفات تقليم النخيل والاستفادة منها في إنتاج فحم نباتي عالي الجودة للشواء والتدفئة وأسمدة عضوية للمزارع.',
      },
      {
        title: 'إنتاج بدائل الأكياس البلاستيكية من نشا الذرة وألياف النخيل القابلة للتحلل',
        subSector: 'التعبئة والتغليف القابل للتحلل الصديق للبيئة',
        gov: 'محافظة مسقط',
        budget: 'من 40,000 إلى 85,000 ريال عماني',
        desc: 'حل وطني يتماشى مع قرار حظر الأكياس البلاستيكية في عمان، ويوفر عبوات وتغليف مستدام للمحلات والمطاعم.',
      },
    ],
  },
];

export const AiBusinessIdeaView: React.FC<AiBusinessIdeaViewProps> = ({ onNavigate }) => {
  const [selectedSectorId, setSelectedSectorId] = useState<string>('tech');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [subSector, setSubSector] = useState(SECTOR_CATEGORIES[0].subSectors[0]);
  const [targetGovernorate, setTargetGovernorate] = useState('محافظة مسقط');
  const [budgetRange, setBudgetRange] = useState('من 15,000 إلى 35,000 ريال عماني');
  const [targetAudience, setTargetAudience] = useState('الأفراد والشركات في سلطنة عُمان');
  const [description, setDescription] = useState('');

  const [loadingMode, setLoadingMode] = useState<'feasibility' | 'evaluation' | null>(null);
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const [savedToAwni, setSavedToAwni] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Active sector metadata
  const currentSector =
    SECTOR_CATEGORIES.find((s) => s.id === selectedSectorId) || SECTOR_CATEGORIES[0];

  const handleSelectSector = (secId: string) => {
    setSelectedSectorId(secId);
    const sec = SECTOR_CATEGORIES.find((s) => s.id === secId);
    if (sec) {
      setSubSector(sec.subSectors[0]);
    }
  };

  const handleApplySample = (s: {
    title: string;
    subSector: string;
    gov: string;
    budget: string;
    desc: string;
  }) => {
    setIdeaTitle(s.title);
    setSubSector(s.subSector);
    setTargetGovernorate(s.gov);
    setBudgetRange(s.budget);
    setDescription(s.desc);
    setErrorMsg(null);
    setSavedToAwni(false);
  };

  const handleGenerateFeasibility = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ideaTitle.trim() || !description.trim()) {
      setErrorMsg('يرجى كتابة اسم الفكرة ووصف مبسط لها للبدء في إعداد دراسة الجدوى المتخصصة.');
      return;
    }

    setErrorMsg(null);
    setLoadingMode('feasibility');
    setGeneratedReport(null);
    setEvaluationResult(null);
    setSavedToAwni(false);

    try {
      const report = await AiService.generateFeasibilityStudy({
        ideaTitle,
        sector: currentSector.name,
        subSector,
        targetGovernorate,
        budgetRange,
        description,
        targetAudience,
      });
      setGeneratedReport(report);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'تعذر إعداد دراسة الجدوى. يرجى إعادة المحاولة.');
    } finally {
      setLoadingMode(null);
    }
  };

  const handleEvaluateIdea = async () => {
    if (!ideaTitle.trim()) {
      setErrorMsg('يرجى إدخال اسم الفكرة أولاً لتقييمها.');
      return;
    }
    setErrorMsg(null);
    setLoadingMode('evaluation');
    setGeneratedReport(null);
    setEvaluationResult(null);
    setSavedToAwni(false);

    try {
      const evaluation = await AiService.evaluateIdea(
        `${ideaTitle} [القطاع: ${currentSector.name} - ${subSector}]: ${description}`,
        currentSector.name,
        budgetRange
      );
      setEvaluationResult(evaluation);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'تعذر تقييم الفكرة حالياً.');
    } finally {
      setLoadingMode(null);
    }
  };

  const handleSaveToAwni = async () => {
    const reportText = generatedReport || evaluationResult;
    if (!reportText) return;

    const title = ideaTitle.trim() || `${currentSector.name} - ${subSector}`;
    const category: AwniCategoryKey = generatedReport ? 'feasibility' : 'ideas';

    const userPrompt = generatedReport
      ? `طلب دراسة جدوى استثمارية لمشروع "${title}" في ${targetGovernorate} بميزانية تقديرية ${budgetRange}.`
      : `طلب تقييم الجاهزية والابتكار لفكرة مشروع "${title}" في قطاع ${currentSector.name}.`;

    const newConv: SavedAwniConversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: user?.uid,
      title: `دراسة جدوى: ${title}`,
      category,
      summary: `${currentSector.name} (${subSector}) في ${targetGovernorate} - الميزانية ${budgetRange}`,
      tags: ['دراسة_جدوى', currentSector.name, subSector.slice(0, 15), targetGovernorate],
      messages: [
        {
          id: `user-${Date.now()}`,
          role: 'user',
          text: userPrompt,
          timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
        },
        {
          id: `model-${Date.now()}`,
          role: 'model',
          text: reportText,
          timestamp: new Date().toLocaleTimeString('ar-OM', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      starred: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await AwniClassificationService.saveConversation(newConv, user?.uid);
      setSavedToAwni(true);
      setSaveToast('تم حفظ وتصنيف دراسة الجدوى في مجلدات وأرشيف المستشار "عوني"! 📁✨');
      setTimeout(() => setSaveToast(null), 4000);
    } catch (e) {
      console.error(e);
      setSaveToast('تم حفظ الدراسة محلياً.');
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleCopy = () => {
    const textToCopy = generatedReport || evaluationResult;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-60 bg-[#122e3a] text-[#e9cca0] border border-[#c59b5f] px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Banner with Teal & Desert Gold Branding */}
      <div className="bg-gradient-to-r from-[#122e3a] via-[#153e4d] to-[#1f5b70] rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl border border-[#c59b5f]/40">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#c59b5f]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#c59b5f]/25 border border-[#c59b5f]/40 px-3 py-1 rounded-full text-xs font-bold text-[#dfba83]">
            <Sparkles className="w-3.5 h-3.5 text-[#c59b5f]" />
            <span>نظام النمذجة ودراسات الجدوى الاقتصادية الذكية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            دراسة جدوى استثمارية تخصصية معتمدة
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            صنّف فكرتك ضمن قطاعات رؤية عُمان 2040 للحصول على دراسة جدوى استرشادية عميقة وشديدة الدقة، تشمل حساب التكاليف الرأسمالية والتشغيلية بالريال العماني (OMR)، والتراخيص الرسمية، وتسهيلات بنك التنمية وبطاقة ريادة.
          </p>
        </div>
      </div>

      {/* SECTOR CLASSIFICATION SYSTEM (ميزة تصنيف الأفكار التجارية) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-xl font-black text-[#153e4d] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c59b5f]" />
              <span>1. اختر تصنيف القطاع الاستثماري المستهدف</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              تحديد القطاع يوجّه المحلل الاستشاري لتقديم أرقام واشتراطات وتراخيص دقيقة ومطابقة لأنظمة السلطنة
            </p>
          </div>

          <span className="text-xs bg-[#153e4d]/10 text-[#153e4d] font-bold px-3 py-1 rounded-full border border-[#1f5b70]/20">
            8 قطاعات اقتصادية معتمدة
          </span>
        </div>

        {/* Sector Grid Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {SECTOR_CATEGORIES.map((sec) => {
            const isSelected = sec.id === selectedSectorId;
            const Icon = sec.icon;

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => handleSelectSector(sec.id)}
                className={`text-right p-4 rounded-2xl transition-all duration-200 flex flex-col justify-between border cursor-pointer group relative ${
                  isSelected
                    ? 'bg-[#153e4d] text-white border-[#c59b5f] shadow-lg scale-[1.02] ring-2 ring-[#c59b5f]/40'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/90 shadow-2xs hover:border-[#1f5b70]/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#c59b5f] text-slate-950 font-bold'
                          : 'bg-[#153e4d]/10 text-[#1f5b70] group-hover:bg-[#153e4d] group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#c59b5f]/30 text-[#e9cca0] border border-[#c59b5f]/40'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  </div>

                  <h3
                    className={`font-black text-xs leading-snug line-clamp-1 ${
                      isSelected ? 'text-[#e9cca0]' : 'text-slate-900 group-hover:text-[#153e4d]'
                    }`}
                  >
                    {sec.name}
                  </h3>

                  <p
                    className={`text-[11px] mt-1.5 line-clamp-2 leading-relaxed ${
                      isSelected ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {sec.description}
                  </p>
                </div>

                <div
                  className={`mt-3 pt-2 border-t text-[10px] flex items-center justify-between font-semibold ${
                    isSelected ? 'border-white/15 text-[#dfba83]' : 'border-slate-100 text-[#1f5b70]'
                  }`}
                >
                  <span>{sec.subSectors.length} أنشطة فرعية</span>
                  <span>{isSelected ? '✓ تم التحديد' : 'اختر هذا القطاع'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED SECTOR INSIGHTS & SUB-SECTOR PILLS */}
      <div className="bg-[#122e3a]/5 border border-[#1f5b70]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#c59b5f]" />
              <h3 className="font-bold text-sm text-[#153e4d]">
                القطاع النشط: <span className="text-[#c59b5f] font-black">{currentSector.name}</span>
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              اختر النشاط التخصصي الدقيق لتضمينه مباشرة في دراسة الجدوى:
            </p>
          </div>

          {/* Sub-sector chips */}
          <div className="flex flex-wrap gap-2">
            {currentSector.subSectors.map((sub, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setSubSector(sub)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  subSector === sub
                    ? 'bg-[#153e4d] text-[#e9cca0] border border-[#c59b5f] shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Sector Regulatory & Funding Quick Facts Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <Building className="w-4 h-4 text-[#c59b5f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">جهة الترخيص الحكومية الرسمية:</span>
              <span className="text-slate-600 text-[11px] leading-relaxed">
                {currentSector.licensingAuthority}
              </span>
            </div>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 flex items-start gap-2.5">
            <Coins className="w-4 h-4 text-[#c59b5f] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">تسهيلات التمويل والحوافز الوطنية:</span>
              <span className="text-slate-600 text-[11px] leading-relaxed">
                {currentSector.fundingOpportunities}
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic Sample Ideas for the Chosen Sector */}
        <div className="pt-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-[#c59b5f]" />
              نماذج أفكار جاهزة للتجربة في قطاع ({currentSector.name}):
            </span>
            <span className="text-[11px] text-slate-400">انقر لتعبئة النموذج تلقائياً</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentSector.sampleIdeas.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplySample(s)}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1f5b70] rounded-2xl text-right transition-all shadow-2xs group cursor-pointer"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-[#153e4d] line-clamp-1">
                  {s.title}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>{s.gov}</span>
                  <span className="text-[#1f5b70] font-bold">{s.budget}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN FORM & REPORT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-md space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-[#153e4d] flex items-center gap-2">
              <span>2. تفاصيل ومعايير فكرتك الاستثمارية</span>
            </h2>
            <p className="text-xs text-slate-500">
              أدخل تفاصيل المشروع وسيقوم المستشار عوني بصياغة دراسة متكاملة ومحكمة بالأرقام
            </p>
          </div>

          <form onSubmit={handleGenerateFeasibility} className="space-y-4">
            {/* Sector Summary Pill */}
            <div className="p-3 bg-[#153e4d]/5 border border-[#1f5b70]/20 rounded-2xl flex items-center justify-between text-xs">
              <span className="text-slate-600 font-semibold">القطاع المحدد:</span>
              <span className="font-bold text-[#153e4d]">{currentSector.name}</span>
            </div>

            {/* Sub-Sector input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                النشاط التخصصي الفرعي:
              </label>
              <select
                value={subSector}
                onChange={(e) => setSubSector(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-[#153e4d] focus:outline-hidden focus:border-[#1f5b70] cursor-pointer text-right"
              >
                {currentSector.subSectors.map((sub, i) => (
                  <option key={i} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم المشروع / الفكرة المقترحة:
              </label>
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="مثال: منصة تسويق الحرف اليدوية العمانية، معمل تقطير لبان..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#1f5b70] text-right"
              />
            </div>

            {/* Governorate & Budget in two cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  المحافظة المستهدفة:
                </label>
                <select
                  value={targetGovernorate}
                  onChange={(e) => setTargetGovernorate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-[#1f5b70] cursor-pointer text-right"
                >
                  {OMAN_GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الميزانية التقديرية:
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs focus:outline-hidden focus:border-[#1f5b70] cursor-pointer text-right"
                >
                  <option value="أقل من 5,000 ريال عماني">أقل من 5,000 ر.ع.</option>
                  <option value="من 5,000 إلى 15,000 ريال عماني">من 5,000 إلى 15,000 ر.ع.</option>
                  <option value="من 15,000 إلى 35,000 ريال عماني">من 15,000 إلى 35,000 ر.ع.</option>
                  <option value="من 35,000 إلى 80,000 ريال عماني">من 35,000 إلى 80,000 ر.ع.</option>
                  <option value="أكثر من 80,000 ريال عماني">أكثر من 80,000 ر.ع.</option>
                </select>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الجمهور والعملاء المستهدفون:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="مثال: الأسر في مسقط، السياح الخليجيين، الشركات التجارية..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#1f5b70] text-right"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                وصف الفكرة والقيمة المضافة:
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="صف الخدمة أو المنتج، ما هي المشكلة التي يحلها، وما الذي يميزه في السوق العماني..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-hidden focus:border-[#1f5b70] text-right leading-relaxed"
              />
            </div>

            {/* Error display */}
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Action buttons with Teal & Gold styling */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loadingMode !== null}
                className="w-full py-3.5 bg-gradient-to-r from-[#153e4d] via-[#1f5b70] to-[#122e3a] hover:from-[#122e3a] hover:to-[#153e4d] text-[#e9cca0] border border-[#c59b5f]/50 rounded-xl font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-[#c59b5f]" />
                <span>توليد دراسة الجدوى لقطاع ({currentSector.name})</span>
              </button>

              <button
                type="button"
                onClick={handleEvaluateIdea}
                disabled={loadingMode !== null}
                className="w-full py-2.5 bg-[#153e4d]/10 hover:bg-[#153e4d]/20 text-[#153e4d] rounded-xl font-bold text-xs transition-colors border border-[#1f5b70]/30 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#c59b5f]" />
                <span>تقييم فكرة المشروع والجاهزية التنافسية</span>
              </button>
            </div>
          </form>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-md min-h-[580px] flex flex-col justify-between">
          {/* Header of Report box */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#c59b5f]" />
              <div>
                <span className="font-black text-slate-900 text-sm block">
                  مخرجات دراسة الجدوى الاسترشادية المتخصصة
                </span>
                <span className="text-[11px] text-slate-400">
                  {currentSector.name} • {subSector}
                </span>
              </div>
            </div>

            {(generatedReport || evaluationResult) && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleSaveToAwni}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    savedToAwni
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-[#153e4d] hover:bg-[#122e3a] text-[#e9cca0] shadow-sm'
                  }`}
                  title="حفظ وتصنيف دراسة الجدوى في مجلدات وأرشيف المستشار عوني"
                >
                  {savedToAwni ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>محفوظة في الأرشيف 📁</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-3.5 h-3.5 text-[#c59b5f]" />
                      <span>حفظ في أرشيف عوني</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="نسخ التقرير"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">تم النسخ</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  title="طباعة التقرير"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="py-6 flex-1">
            {loadingMode ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#153e4d] border border-[#c59b5f]/40 flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-8 h-8 text-[#e9cca0] animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    جاري التحليل الاقتصادي لقطاع ({currentSector.name})...
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {loadingMode === 'feasibility'
                      ? 'يتم احتساب رأس المال وتكاليف التشغيل بالريال العماني ومطابقة اشتراطات التراخيص وبنك التنمية...'
                      : 'يتم قياس الجاهزية والابتكار ومطابقة الفكرة مع مستهدفات رؤية عمان 2040...'}
                  </p>
                </div>
                <div className="w-48 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-[#153e4d] h-full rounded-full animate-pulse w-3/4"></div>
                </div>
              </div>
            ) : generatedReport ? (
              <div className="space-y-4 text-right">
                <div className="p-3 bg-[#153e4d]/10 border border-[#1f5b70]/30 rounded-2xl text-xs text-[#153e4d] flex items-center justify-between">
                  <span className="font-bold">
                    دراسة جدوى استرشادية لقطاع: {currentSector.name} ({subSector})
                  </span>
                  <span className="font-bold text-[#c59b5f]">رؤية عُمان 2040</span>
                </div>
                <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {generatedReport}
                </div>
              </div>
            ) : evaluationResult ? (
              <div className="space-y-4 text-right">
                <div className="p-3 bg-[#153e4d]/10 border border-[#1f5b70]/30 rounded-2xl text-xs text-[#153e4d] flex items-center justify-between">
                  <span>بطاقة تقييم الفكرة والابتكار: {currentSector.name}</span>
                  <span className="font-bold text-[#c59b5f]">جاهزية السوق</span>
                </div>
                <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed whitespace-pre-wrap font-normal">
                  {evaluationResult}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
                  <Lightbulb className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="font-bold text-slate-700 text-sm">
                  لم تقم بتوليد أي دراسة بعد
                </h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  اختر القطاع والنشاط المناسبين بالأعلى، أو اختر أحد النماذج المقترحة وانقر على زر "توليد دراسة الجدوى" للبدء.
                </p>
              </div>
            )}
          </div>

          {/* Footer note with Awni assistant link */}
          <div className="border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="text-[11px]">
              هذه الدراسة استرشادية، ويمكنك مناقشة تفاصيلها وتطويرها مباشرة مع المساعد الذكي "عوني".
            </span>
            <button
              onClick={() => onNavigate('ai-platform.html')}
              className="text-[#153e4d] font-bold hover:text-[#1f5b70] flex items-center gap-1 cursor-pointer shrink-0"
            >
              <span>محادثة "عوني" الآن</span>
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
