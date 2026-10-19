export type EvaluatorRole = 'investor' | 'visitor' | 'business_partner' | 'expert';

export interface ProjectRating {
  id: string;
  projectId: string;
  projectName: string;
  evaluatorName: string;
  evaluatorRole: EvaluatorRole;
  evaluatorOrganization?: string;
  rating: number; // 1 - 5
  investmentPotentialScore: number; // 1 - 5
  innovationScore: number; // 1 - 5
  marketReadinessScore: number; // 1 - 5
  comment: string;
  recommendToInvestors: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface ProjectRatingStats {
  averageRating: number;
  totalRatings: number;
  investorCount: number;
  visitorCount: number;
  recommendationRate: number; // e.g. 95%
  scores: {
    investmentPotential: number;
    innovation: number;
    marketReadiness: number;
  };
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const INITIAL_PROJECT_RATINGS: Record<string, ProjectRating[]> = {
  'story-1': [
    {
      id: 'pr-101',
      projectId: 'story-1',
      projectName: 'مؤسسة سمارت نخلة لتقنيات النخيل والذكاء الاصطناعي',
      evaluatorName: 'المهندس هيثم بن قيس الخروصي',
      evaluatorRole: 'investor',
      evaluatorOrganization: 'مستثمر ملائكي في التقنية الزراعية (AgriTech)',
      rating: 5,
      investmentPotentialScore: 5,
      innovationScore: 5,
      marketReadinessScore: 4.8,
      comment: 'مشروع نوعي وحيوي يدعم الأمن الغذائي العماني ورؤية 2040. استخدام الذكاء الاصطناعي وحساسات إنترنت الأشياء للكشف المبكر عن سوسة النخيل حل مبتكر يوفر ملايين الريالات سنوياً على المزارع الوطنية. فريق العمل متمرس ونموذج الأعمال قابل للتوسع إقليمياً في دول الخليج.',
      recommendToInvestors: true,
      helpfulCount: 23,
      createdAt: '2026-09-21T11:30:00Z',
    },
    {
      id: 'pr-102',
      projectId: 'story-1',
      projectName: 'مؤسسة سمارت نخلة لتقنيات النخيل والذكاء الاصطناعي',
      evaluatorName: 'د. سعود بن ناصر الحبسي',
      evaluatorRole: 'expert',
      evaluatorOrganization: 'خبير زراعي وباحث في استدامة الواحات',
      rating: 5,
      investmentPotentialScore: 4.8,
      innovationScore: 5,
      marketReadinessScore: 4.9,
      comment: 'دقة الحساسات والذكاء الاصطناعي تجاوزت 96% في التجارب الميدانية بولايات بركاء ونخل والرستاق. جاهزية المنتج ممتازة وهناك طلب متزايد من أصحاب المزارع الكبيرة والشركات الزراعية المساهمة.',
      recommendToInvestors: true,
      helpfulCount: 16,
      createdAt: '2026-09-23T15:20:00Z',
    },
    {
      id: 'pr-103',
      projectId: 'story-1',
      projectName: 'مؤسسة سمارت نخلة لتقنيات النخيل والذكاء الاصطناعي',
      evaluatorName: 'محمد بن حمد المعمري',
      evaluatorRole: 'visitor',
      evaluatorOrganization: 'مهتم بالاستثمار في ريادة الأعمال',
      rating: 4.8,
      investmentPotentialScore: 4.6,
      innovationScore: 5,
      marketReadinessScore: 4.7,
      comment: 'عرض تقديمي ممتاز ووضوح كبير في دراسة الجدوى وتكلفة الحساس لكل هكتار. من أفضل المشاريع التكنولوجية العمانية التي شاهدتها هذا العام.',
      recommendToInvestors: true,
      helpfulCount: 9,
      createdAt: '2026-09-25T08:45:00Z',
    },
  ],
  'story-2': [
    {
      id: 'pr-201',
      projectId: 'story-2',
      projectName: 'مؤسسة أريج اللبان للصناعات الطبية والعطرية',
      evaluatorName: 'فاطمة بنت أحمد الشنفري',
      evaluatorRole: 'investor',
      evaluatorOrganization: 'صندوق الاستثمار النسائي العماني',
      rating: 5,
      investmentPotentialScore: 5,
      innovationScore: 4.8,
      marketReadinessScore: 5,
      comment: 'د. أمل المعشنية استطاعت ابتكار قيمة مضافة غير مسبوقة للبان الحوجري العماني بتحويله لمستخلصات طبية ومستحضرات معتمدة بمواصفات الآيزو. التصدير لـ 14 دولة يعكس قوة العلامة التجارية والقدرة التنافسية العالمية.',
      recommendToInvestors: true,
      helpfulCount: 31,
      createdAt: '2026-09-20T10:15:00Z',
    },
    {
      id: 'pr-202',
      projectId: 'story-2',
      projectName: 'مؤسسة أريج اللبان للصناعات الطبية والعطرية',
      evaluatorName: 'خالد بن زاهر العبري',
      evaluatorRole: 'business_partner',
      evaluatorOrganization: 'موزع منتجات عضوية وصيدلانية بالخليج',
      rating: 4.7,
      investmentPotentialScore: 4.7,
      innovationScore: 4.6,
      marketReadinessScore: 4.9,
      comment: 'طلب المنتجات في الصيدليات والمراكز الصحية بدول الخليج يتنامى بشكل كبير، ونسبة تكرار الشراء لدى المستهلكين تتجاوز 78%. فرصة استثمارية واعدة جداً للتوسع في خطوط الإنتاج.',
      recommendToInvestors: true,
      helpfulCount: 18,
      createdAt: '2026-09-24T12:00:00Z',
    },
    {
      id: 'pr-203',
      projectId: 'story-2',
      projectName: 'مؤسسة أريج اللبان للصناعات الطبية والعطرية',
      evaluatorName: 'سارة بنت حمود البلوشية',
      evaluatorRole: 'visitor',
      evaluatorOrganization: 'زائرة ومتذوقة للمنتجات العمانية الفاخرة',
      rating: 5,
      investmentPotentialScore: 4.8,
      innovationScore: 4.9,
      marketReadinessScore: 4.8,
      comment: 'جودة الزيوت العطرية ومصل اللبان للوجه مذهلة وتفوق العلامات التجارية العالمية. فخر للصناعة الوطنية العمانية.',
      recommendToInvestors: true,
      helpfulCount: 12,
      createdAt: '2026-09-26T17:10:00Z',
    },
  ],
  'story-3': [
    {
      id: 'pr-301',
      projectId: 'story-3',
      projectName: 'دار بهلاء للخزف المعاصر والتصميم المعماري',
      evaluatorName: 'المهندس سالم بن حبيب الرواحي',
      evaluatorRole: 'investor',
      evaluatorOrganization: 'مستثمر في قطاع الضيافة والتطوير العقاري',
      rating: 4.8,
      investmentPotentialScore: 4.6,
      innovationScore: 4.9,
      marketReadinessScore: 4.7,
      comment: 'فكرة الجمع بين أصالة طين بهلاء العريق والخطوط المعمارية الحديثة للفنادق والمنتجعات الفاخرة فكرة عبقرية. العقود الموقعة مع 6 منتجعات تثبت جاذبية السوق وقدرة عبدالله الهنائي على الإيفاء بالمعايير الفندقية العالمية.',
      recommendToInvestors: true,
      helpfulCount: 19,
      createdAt: '2026-09-22T14:40:00Z',
    },
    {
      id: 'pr-302',
      projectId: 'story-3',
      projectName: 'دار بهلاء للخزف المعاصر والتصميم المعماري',
      evaluatorName: 'أصيلة بنت مسعود المغيرية',
      evaluatorRole: 'visitor',
      evaluatorOrganization: 'مصممة ديكور داخلي ومعمارية',
      rating: 4.7,
      investmentPotentialScore: 4.5,
      innovationScore: 4.8,
      marketReadinessScore: 4.7,
      comment: 'القطع الفنية جودتها فائقة ولمستها التراثية المعاصرة تضفي روح الهوية العمانية على أي مساحة داخلية. مشروع حرفي مستدام يستحق كل الدعم.',
      recommendToInvestors: true,
      helpfulCount: 14,
      createdAt: '2026-09-25T19:30:00Z',
    },
  ],
};
