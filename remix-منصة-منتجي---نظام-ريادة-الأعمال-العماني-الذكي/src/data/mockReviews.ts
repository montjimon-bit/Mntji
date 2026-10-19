export interface Review {
  id: string;
  productId: string;
  userId?: string;
  userName: string;
  userPhoto?: string;
  governorate?: string;
  rating: number;
  comment: string;
  tags?: string[];
  helpfulCount: number;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export const INITIAL_REVIEWS_DATA: Record<string, Review[]> = {
  'prod-1': [
    {
      id: 'rev-101',
      productId: 'prod-1',
      userName: 'سالم بن حمد البلوشي',
      governorate: 'محافظة مسقط',
      rating: 5,
      comment: 'ما شاء الله تبارك الله، اللبان الحوجري نقي جداً وحباته خضراء ملكية فاخرة. الرائحة تملأ البيت لعدة ساعات ونقاء الدخان مميز للغاية. تغليف أنيق ووصلني خلال يومين.',
      tags: ['جودة فائقة 🌿', 'تغليف راقٍ 📦', 'رائحة تدوم ✨'],
      helpfulCount: 14,
      isVerifiedPurchase: true,
      createdAt: '2026-09-20T14:30:00Z',
    },
    {
      id: 'rev-102',
      productId: 'prod-1',
      userName: 'د. مريم المعمرية',
      governorate: 'محافظة شمال الباطنة',
      rating: 5,
      comment: 'من أفضل ما جربت في سوق اللبان بالسلطنة. أستخدمه للتبخير اليومي وإعداد ماء اللبان الصحي، نكهته نقية وخالي من الشوائب. فخورة بالمشاريع العمانية الشابة.',
      tags: ['منتج أصلي 🇴🇲', 'موصى به بشدة ⭐'],
      helpfulCount: 9,
      isVerifiedPurchase: true,
      createdAt: '2026-09-22T09:15:00Z',
    },
    {
      id: 'rev-103',
      productId: 'prod-1',
      userName: 'أحمد الكندي',
      governorate: 'محافظة الداخلية',
      rating: 4,
      comment: 'منتج ممتاز ورائحته زكية وهادئة، العبوة مناسبة للإهداء. نتمنى توفير أحجام أكبر (نصف كيلو وكيلو) مستقبلاً.',
      tags: ['توصيل سريع ⚡', 'مناسب للإهداء 🎁'],
      helpfulCount: 5,
      isVerifiedPurchase: true,
      createdAt: '2026-09-24T18:40:00Z',
    },
  ],
  'prod-2': [
    {
      id: 'rev-201',
      productId: 'prod-2',
      userName: 'عبدالله بن راشد الحارثي',
      governorate: 'محافظة جنوب الشرقية',
      rating: 5,
      comment: 'عسل سدر أصلي 100%، قوامه كثيف وطعمه مميز جداً فيه لسعة السدر الجبلي الأصيلة. تم فحصه مخبرياً والتأكد من جودته العالية. يستاهل كل بيسة!',
      tags: ['طبيعي ومفحوص 🔬', 'جودة استثنائية 🍯'],
      helpfulCount: 19,
      isVerifiedPurchase: true,
      createdAt: '2026-09-18T11:00:00Z',
    },
    {
      id: 'rev-202',
      productId: 'prod-2',
      userName: 'أمل العامرية',
      governorate: 'محافظة مسقط',
      rating: 5,
      comment: 'مناحل الجبل الأخضر معروفة بأمانتها وجودتها. التغليف زجاجي محكم ومحمي بطريقة ممتازة والتوصيل سريع. أنصح الجميع بشرائه قبل نفاد الكمية.',
      tags: ['تغليف محكم 🛡️', 'تعامل راقٍ 👏'],
      helpfulCount: 8,
      isVerifiedPurchase: true,
      createdAt: '2026-09-23T16:20:00Z',
    },
  ],
  'prod-3': [
    {
      id: 'rev-301',
      productId: 'prod-3',
      userName: 'محمد بن ناصر السيابي',
      governorate: 'محافظة مسقط',
      rating: 5,
      comment: 'حلوى بركاء لا يعلى عليها! طازجة جداً وريحة الهيل والزعفران والسمن العماني واضحة وفائحة، والمكسرات وفيرة ومحمصة بعناية. بيض الله وجوهكم.',
      tags: ['طازجة وشهية 🍬', 'سمن عماني أصلي 🧈'],
      helpfulCount: 22,
      isVerifiedPurchase: true,
      createdAt: '2026-09-15T20:10:00Z',
    },
    {
      id: 'rev-302',
      productId: 'prod-3',
      userName: 'شيخة الشامسية',
      governorate: 'محافظة البريمي',
      rating: 4,
      comment: 'حلوى فاخرة ولذيذة جداً، مناسبة للمناسبات الرسمية والأعياد. التوصيل إلى البريمي كان سريعاً وبحالة ممتازة دون أن تتأثر حرارتها.',
      tags: ['مناسبة للضيافة ☕', 'توصيل موثوق 🚚'],
      helpfulCount: 6,
      isVerifiedPurchase: true,
      createdAt: '2026-09-25T13:45:00Z',
    },
  ],
  'prod-4': [
    {
      id: 'rev-401',
      productId: 'prod-4',
      userName: 'هلال بن سعيد النبهاني',
      governorate: 'محافظة الداخلية',
      rating: 5,
      comment: 'تحفة فنية أصيلة من إرث بهلاء العريق. تفاصيل النقش متقنة واللون متناسق جداً مع ديكور المجلس العماني. فخور بالحرفيين العمانيين.',
      tags: ['حرف يدوية أصيلة 🏺', 'إتقان عالي ✨'],
      helpfulCount: 11,
      isVerifiedPurchase: true,
      createdAt: '2026-09-19T10:00:00Z',
    },
  ],
  'prod-5': [
    {
      id: 'rev-501',
      productId: 'prod-5',
      userName: 'المهندس خالد الرواحي',
      governorate: 'محافظة مسقط',
      rating: 5,
      comment: 'نظام ري ذكي أحدث نقلة في مزرعتي المصغرة ببركاء. التطبيق سهل الاستخدام والحساسات دقيقة جداً في قياس رطوبة التربة ووفرت أكثر من 40% في فاتورة المياه.',
      tags: ['ابتكار تقني عماني 💡', 'موفر للمياه 💧'],
      helpfulCount: 17,
      isVerifiedPurchase: true,
      createdAt: '2026-09-21T08:30:00Z',
    },
  ],
  'prod-6': [
    {
      id: 'rev-601',
      productId: 'prod-6',
      userName: 'بثينة الهنائية',
      governorate: 'محافظة الظاهرة',
      rating: 5,
      comment: 'تمور فاخرة جداً وحبات الفرض والخلاص منتقاة بعناية وحشوة المكسرات طازجة ومقرمشة. الصندوق أنيق جداً ويشرف في الضيافة والهدايا.',
      tags: ['تمور عمانية فاخرة 🌴', 'تغليف راقٍ 🎁'],
      helpfulCount: 8,
      isVerifiedPurchase: true,
      createdAt: '2026-09-22T12:00:00Z',
    },
  ],
  'prod-7': [
    {
      id: 'rev-701',
      productId: 'prod-7',
      userName: 'فيصل بن سلطان الوهيبي',
      governorate: 'محافظة مسقط',
      rating: 5,
      comment: 'عطر استثنائي بكل معنى الكلمة، مزيج اللبان العماني مع دهن العود والصندل يعطي فخامة وثبات يتجاوز 18 ساعة. الزجاجة وتصميمها مستوحى من الخنجر العماني تحفة حقيقية.',
      tags: ['ثبات مذهل ⏳', 'رائحة ملكية 👑', 'فخر عماني 🇴🇲'],
      helpfulCount: 25,
      isVerifiedPurchase: true,
      createdAt: '2026-09-23T15:20:00Z',
    },
  ],
  'prod-8': [
    {
      id: 'rev-801',
      productId: 'prod-8',
      userName: 'خلفان السعدي',
      governorate: 'محافظة جنوب الباطنة',
      rating: 5,
      comment: 'الخنجر العماني بصياغة فضية دقيقة ومتقنة، عمل يدوي خالص من الصاغة العمانيين المحترفين مع شهادة توثيق ونقاء الفضة. يستحق التقدير والاقتناء.',
      tags: ['فضة عمانية خالصة 🗡️', 'صناعة يدوية نادرة ✨'],
      helpfulCount: 30,
      isVerifiedPurchase: true,
      createdAt: '2026-09-24T17:10:00Z',
    },
  ],
};
