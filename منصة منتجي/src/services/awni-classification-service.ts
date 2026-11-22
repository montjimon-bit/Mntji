/**
 * awni-classification-service.ts
 * Smart categorization, tagging, and folder management system for Awni advisor conversations,
 * business ideas, and feasibility studies.
 * Dual-storage architecture: Firebase Firestore + local storage fallback.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from './firebase';
import { ChatMessage } from './ai-service';

export type AwniCategoryKey =
  | 'feasibility'
  | 'ideas'
  | 'riyada'
  | 'finance'
  | 'marketplace'
  | 'general';

export interface AwniCategoryConfig {
  id: AwniCategoryKey;
  name: string;
  badge: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export const AWNI_CATEGORIES: AwniCategoryConfig[] = [
  {
    id: 'feasibility',
    name: 'دراسات الجدوى المالية',
    badge: 'جدوى واستثمار 📊',
    iconName: 'TrendingUp',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    description: 'تقديرات رأس المال، تكاليف التشغيل، نقطة التعادل وهوامش الربح بالريال العماني.',
  },
  {
    id: 'ideas',
    name: 'أفكار المشاريع والابتكار',
    badge: 'أفكار مبتكرة 💡',
    iconName: 'Lightbulb',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'استكشاف الفرص التجارية الواعدة، ونماذج العمل المتوافقة مع رؤية عمان 2040.',
  },
  {
    id: 'riyada',
    name: 'تأسيس وبطاقة ريادة',
    badge: 'تأسيس وتراخيص 💼',
    iconName: 'Building',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    description: 'إجراءات السجل التجاري، استثمر بسهولة، تراخيص العمل المنزلي وشروط بطاقة ريادة.',
  },
  {
    id: 'finance',
    name: 'التمويل والقروض الحكومية',
    badge: 'تمويل ميسر 💰',
    iconName: 'CreditCard',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    description: 'قروض بنك التنمية العماني الميسرة بدون فوائد، وحسابات رأس المال والمنح.',
  },
  {
    id: 'marketplace',
    name: 'سوق المنتجات والتسويق',
    badge: 'منتجات وطنية 🛍️',
    iconName: 'ShoppingBag',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    description: 'تسعير المنتجات الوطنية، الهدايا العمانية الفاخرة، الدفع الإلكتروني وتجارة المنصة.',
  },
  {
    id: 'general',
    name: 'استشارات عامة',
    badge: 'استشارة 💬',
    iconName: 'MessageSquare',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    description: 'استفسارات عامة ونقاشات ريادية متنوعة مع المستشار عوني.',
  },
];

export interface AwniFolder {
  id: string;
  userId?: string;
  name: string;
  color: string;
  icon: string;
  createdAt: string;
}

export interface SavedAwniConversation {
  id: string;
  userId?: string;
  title: string;
  folderId?: string; // id of user custom folder or undefined
  category: AwniCategoryKey;
  summary: string;
  tags: string[];
  messages: ChatMessage[];
  starred?: boolean;
  createdAt: string;
  updatedAt: string;
}

const LOCAL_STORAGE_CONVERSATIONS_KEY = 'montaji_awni_saved_conversations_v2';
const LOCAL_STORAGE_FOLDERS_KEY = 'montaji_awni_custom_folders_v2';

// Initial pre-curated default Omani entrepreneurial studies to inspire the user
const INITIAL_SAMPLE_CONVERSATIONS: SavedAwniConversation[] = [
  {
    id: 'sample-study-frankincense',
    title: 'دراسة جدوى: متجر وتغليف لبان حوجري فاخر بظفار',
    category: 'feasibility',
    summary: 'تقدير رأس مال تأسيسي بقيمة 3,850 ر.ع ونقطة تعادل عند 120 عبوة شهرياً مع هوامش ربح 42%.',
    tags: ['دراسة_جدوى', 'لبان_حوجري', 'ظفار', 'ريادة_الأعمال'],
    starred: true,
    createdAt: '2026-09-28T10:00:00.000Z',
    updatedAt: '2026-09-28T10:00:00.000Z',
    messages: [
      {
        id: 'user-sample-1',
        role: 'user',
        text: 'كيف أعد دراسة جدوى استثمارية لمشروع تغليف وتوزيع اللبان الحوجري الملكي في صلالة؟',
        timestamp: '10:00 ص',
      },
      {
        id: 'model-sample-1',
        role: 'model',
        text: `يا هلا والله ومرحبا بيك! مشروع اللبان الحوجري الملكي من جبال سمحان بظفار من أنجح المشاريع الاستثمارية الوطنية:
        
1. 📊 **رأس المال التأسيسي المتوقع:**
- استئجار وتجهيز وحدة التغليف: 1,500 ريال عماني.
- شراء المادة الخام (لبان حوجري نقي درجة أولى): 1,600 ريال عماني.
- تصميم علب فاخرة وهوية بصرية عمانية: 750 ريال عماني.
- **إجمالي رأس المال الأولي:** 3,850 ريال عماني.

2. 📈 **هوامش الربح والتسعير:**
- تكلفة العبوة الفاخرة (100 جرام): 8.5 ريال عماني.
- سعر البيع المقترح على منصة منتجي: 18.5 ريال عماني.
- هامش الربح الصافي: يتجاوز 45%.

3. 💼 **التراخيص وبطاقة ريادة:**
- ترخيص عمل منزلي أو تجاري عبر منصة عُمان للأعمال (استثمر بسهولة).
- إصدار بطاقة ريادة للاستفادة من الإعفاء الضريبي وتسهيلات المناقصات بنسبة 10%.`,
        timestamp: '10:01 ص',
      },
    ],
  },
  {
    id: 'sample-idea-agri-hub',
    title: 'فكرة مشروع: منصة تجميع وتوزيع عسل الجبل الأخضر وتمور الباطنة',
    category: 'ideas',
    summary: 'نموذج عمل مبتكر يربط النحالين والمزارعين العمانيين بسوق التجزئة الرقمي والتوصيل السريع.',
    tags: ['أفكار_مشاريع', 'عسل_الجبل_الأخضر', 'سوق_عماني', 'رؤية_2040'],
    starred: false,
    createdAt: '2026-09-27T14:30:00.000Z',
    updatedAt: '2026-09-27T14:30:00.000Z',
    messages: [
      {
        id: 'user-sample-2',
        role: 'user',
        text: 'عندي فكرة ربط منتجي العسل العماني في الجبل الأخضر بمتجر إلكتروني وطني، ما رأيك؟',
        timestamp: '02:30 م',
      },
      {
        id: 'model-sample-2',
        role: 'model',
        text: `ما شاء الله، شور سديد وفكرة واعدة جداً وتخدم الأمن الغذائي وسلاسل الإمداد العمانية!

- **نقاط القوة:** عسل السدر والسمر الجبلي العماني مطلوب جداً ونادر وموثوق (يباع ما بين 30 إلى 35 ر.ع للغرشة).
- **الشراكات المقترحة:** التسجيل في منصة "مُنتجي" كبائع رسمي للأسر والمنتجين المحليين.
- **التمويل:** يمكن التقدم للحصول على تمويل مشروعات زراعية وحرفية من بنك التنمية العماني بنسبة فائدة صفرية لحاملي بطاقة ريادة.`,
        timestamp: '02:32 م',
      },
    ],
  },
  {
    id: 'sample-riyada-card-guide',
    title: 'دليل وتفرغ بطاقة ريادة وتسهيلات الأسر المنتجة 2026',
    category: 'riyada',
    summary: 'شروط التفرغ وإثبات التأمينات الاجتماعية والحصول على الإعفاءات الجمركية ونسبة الـ 10% الحكومية.',
    tags: ['بطاقة_ريادة', 'استثمر_بسهولة', 'تراخيص_منزلية', 'ريادة'],
    starred: false,
    createdAt: '2026-09-26T09:15:00.000Z',
    updatedAt: '2026-09-26T09:15:00.000Z',
    messages: [
      {
        id: 'user-sample-3',
        role: 'user',
        text: 'ما هي متطلبات وشروط بطاقة ريادة لعام 2026 وكيف تفيد مشروعي الصغير؟',
        timestamp: '09:15 ص',
      },
      {
        id: 'model-sample-3',
        role: 'model',
        text: `حياك الله يا رائد الأعمال العزيز! بطاقة "ريادة" هي الجواز الذهبي لكل صاحب مشروع في سلطنة عُمان:

1. **شروط الحصول على البطاقة:**
- أن تكون المؤسسة مسجلة في سجل المؤسسات الصغيرة أو المتوسطة أو الصغرى.
- تفرغ مالك المؤسسة (أو أحد الشركاء) لإدارتها والتسجيل في صندوق الحماية الاجتماعية كصاحب عمل متفرغ.

2. **أهم الامتيازات الوطنية:**
- تخصيص 10% من مشتريات ومناقصات الحكومة للمؤسسات الحاملة لبطاقة ريادة.
- إعفاءات من رسوم التراخيص ورسوم وزارة العمل لعدد محدد من العمال.
- أولوية الأراضي بحق الانتفاع في المخططات الصناعية والتجارية بمحافظات السلطنة.`,
        timestamp: '09:17 ص',
      },
    ],
  },
];

export class AwniClassificationService {
  /**
   * Smart AI Classifier:
   * Analyzes conversation text to automatically detect category, title, tags, and summary.
   */
  public static classifyConversation(
    messages: ChatMessage[],
    userCustomTitle?: string
  ): {
    category: AwniCategoryKey;
    title: string;
    tags: string[];
    summary: string;
  } {
    const textPool = messages.map((m) => m.text).join(' ');
    const lower = textPool.toLowerCase();

    // 1. Detect Category based on linguistic keywords & financial indicators
    let category: AwniCategoryKey = 'general';

    const feasibilityKeywords = [
      'جدوى',
      'دراسة جدوى',
      'تكاليف',
      'رأس مال',
      'رأس المال',
      'أرباح',
      'هامش ربح',
      'نقطة تعادل',
      'ريال عماني',
      'omr',
      'تكلفة تشغيل',
      'إيرادات',
      'ميزانية',
      'عائد',
    ];
    const riyadaKeywords = [
      'بطاقة ريادة',
      'ريادة',
      'سجل تجاري',
      'استثمر بسهولة',
      'ترخيص منزلي',
      'تفرغ',
      'مناقصات',
      'تأسيس',
      'وزارة التجارة',
      'غرفة تجارة',
      'سند',
      'مراكز سند',
    ];
    const financeKeywords = [
      'بنك التنمية',
      'تمويل',
      'قرض',
      'قروض',
      'قرض ميسر',
      'فوائد',
      'منحة',
      'صندوق الرفد',
      'شراكة',
      'رأس مال جريء',
    ];
    const marketplaceKeywords = [
      'لبان',
      'حلوى',
      'عسل',
      'خنجر',
      'فضيات',
      'زعفران',
      'سوق',
      'متجر',
      'توصيل',
      'شحن',
      'apple pay',
      'دفع إلكتروني',
      'صلالة',
      'نزوى',
      'مسقط',
    ];
    const ideaKeywords = [
      'فكرة',
      'أفكار',
      'مشروع جديد',
      'ابتكار',
      'اقتراح',
      'مشروع منزلي',
      'فرص',
      'رؤية 2040',
      'مشروع واعد',
    ];

    const matchCount = (words: string[]) =>
      words.reduce((acc, word) => acc + (lower.includes(word) ? 1 : 0), 0);

    const fCount = matchCount(feasibilityKeywords);
    const rCount = matchCount(riyadaKeywords);
    const finCount = matchCount(financeKeywords);
    const mCount = matchCount(marketplaceKeywords);
    const iCount = matchCount(ideaKeywords);

    const maxVal = Math.max(fCount, rCount, finCount, mCount, iCount);

    if (maxVal > 0) {
      if (maxVal === fCount) category = 'feasibility';
      else if (maxVal === rCount) category = 'riyada';
      else if (maxVal === finCount) category = 'finance';
      else if (maxVal === mCount) category = 'marketplace';
      else if (maxVal === iCount) category = 'ideas';
    }

    // 2. Generate or extract appropriate title
    let title = userCustomTitle?.trim() || '';
    if (!title) {
      const firstUserMsg = messages.find((m) => m.role === 'user')?.text || '';
      if (firstUserMsg) {
        // Clean leading question words
        const cleaned = firstUserMsg
          .replace(/^(كيف|ما هي|ما هو|موه|وين|هل يمكن|أريد|باغي|شورك في)\s+/i, '')
          .replace(/[؟?؟!.]/g, '')
          .trim();
        title = cleaned.slice(0, 55);
        if (title.length >= 50) title += '...';
      }
    }

    if (!title) {
      title = `استشارة ${AWNI_CATEGORIES.find((c) => c.id === category)?.name || 'ريادية'}`;
    }

    // 3. Extract Tags
    const tagsSet = new Set<string>();
    tagsSet.add(AWNI_CATEGORIES.find((c) => c.id === category)?.name.split(' ')[0] || 'ريادة');
    if (lower.includes('جدوى')) tagsSet.add('دراسة_جدوى');
    if (lower.includes('ريادة')) tagsSet.add('بطاقة_ريادة');
    if (lower.includes('تمويل') || lower.includes('بنك التنمية')) tagsSet.add('تمويل_ميسر');
    if (lower.includes('لبان')) tagsSet.add('لبان_ظفار');
    if (lower.includes('عسل')) tagsSet.add('عسل_عماني');
    if (lower.includes('حلوى')) tagsSet.add('حلوى_عمانية');
    if (lower.includes('خنجر') || lower.includes('فضة')) tagsSet.add('صناعات_حرفية');
    if (lower.includes('صلالة') || lower.includes('ظفار')) tagsSet.add('ظفار');
    if (lower.includes('مسقط')) tagsSet.add('مسقط');
    if (lower.includes('نزوى') || lower.includes('الداخلية')) tagsSet.add('نزوى');
    tagsSet.add('رؤية_عمان_2040');

    // 4. Generate Summary Snippet
    const firstModelMsg = messages.find((m) => m.role === 'model')?.text || '';
    const cleanSnippet = firstModelMsg
      .replace(/[*_#`~>-]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const summary = cleanSnippet.slice(0, 160) + (cleanSnippet.length > 160 ? '...' : '');

    return {
      category,
      title,
      tags: Array.from(tagsSet).slice(0, 4),
      summary,
    };
  }

  // ==========================================
  // CUSTOM FOLDERS OPERATIONS
  // ==========================================

  public static async getCustomFolders(userId?: string): Promise<AwniFolder[]> {
    // 1. Try local storage first for instant render
    let localFolders: AwniFolder[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_FOLDERS_KEY);
      if (stored) {
        localFolders = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading local folders:', e);
    }

    // 2. If user is logged in, fetch and sync from Firestore
    if (userId) {
      try {
        const colRef = collection(db, 'users', userId, 'awniFolders');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const remoteFolders: AwniFolder[] = snap.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as any),
          }));

          // Merge without duplicates
          const folderMap = new Map<string, AwniFolder>();
          localFolders.forEach((f) => folderMap.set(f.id, f));
          remoteFolders.forEach((f) => folderMap.set(f.id, f));
          const merged = Array.from(folderMap.values());
          localStorage.setItem(LOCAL_STORAGE_FOLDERS_KEY, JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('Firestore folders fetch fallback to local:', err);
      }
    }

    return localFolders;
  }

  public static async createCustomFolder(
    name: string,
    color: string = '#153e4d',
    icon: string = 'Folder',
    userId?: string
  ): Promise<AwniFolder> {
    const newFolder: AwniFolder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: userId || undefined,
      name: name.trim(),
      color,
      icon,
      createdAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const folders = await this.getCustomFolders(userId);
      folders.unshift(newFolder);
      localStorage.setItem(LOCAL_STORAGE_FOLDERS_KEY, JSON.stringify(folders));
    } catch (e) {
      console.error('Error saving folder locally', e);
    }

    // Save to Firestore if authenticated
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId, 'awniFolders', newFolder.id);
        await setDoc(docRef, {
          folderId: newFolder.id,
          userId,
          name: newFolder.name,
          color: newFolder.color,
          icon: newFolder.icon,
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `users/${userId}/awniFolders/${newFolder.id}`);
      }
    }

    return newFolder;
  }

  public static async deleteCustomFolder(folderId: string, userId?: string): Promise<void> {
    try {
      const folders = await this.getCustomFolders(userId);
      const filtered = folders.filter((f) => f.id !== folderId);
      localStorage.setItem(LOCAL_STORAGE_FOLDERS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error deleting local folder', e);
    }

    if (userId) {
      try {
        const docRef = doc(db, 'users', userId, 'awniFolders', folderId);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${userId}/awniFolders/${folderId}`);
      }
    }
  }

  // ==========================================
  // CONVERSATIONS STORAGE & CATEGORIZATION
  // ==========================================

  public static async getSavedConversations(userId?: string): Promise<SavedAwniConversation[]> {
    let list: SavedAwniConversation[] = [];

    // 1. Read local storage
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_CONVERSATIONS_KEY);
      if (stored) {
        list = JSON.parse(stored);
      } else {
        // Initialize with pre-curated samples on first load
        list = [...INITIAL_SAMPLE_CONVERSATIONS];
        localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed reading local conversations:', e);
      list = [...INITIAL_SAMPLE_CONVERSATIONS];
    }

    // 2. If logged in, fetch from Firestore and merge
    if (userId) {
      try {
        const colRef = collection(db, 'users', userId, 'awniConversations');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          const remoteList: SavedAwniConversation[] = snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));

          const map = new Map<string, SavedAwniConversation>();
          list.forEach((item) => map.set(item.id, item));
          remoteList.forEach((item) => map.set(item.id, item));
          const merged = Array.from(map.values()).sort(
            (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
          );
          localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(merged));
          return merged;
        }
      } catch (err) {
        console.warn('Firestore conversations fetch fallback to local:', err);
      }
    }

    return list.sort(
      (a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
    );
  }

  public static async saveConversation(
    conv: SavedAwniConversation,
    userId?: string
  ): Promise<void> {
    const enriched: SavedAwniConversation = {
      ...conv,
      userId: userId || undefined,
      updatedAt: new Date().toISOString(),
    };

    // Save locally
    try {
      const existing = await this.getSavedConversations(userId);
      const index = existing.findIndex((c) => c.id === conv.id);
      if (index >= 0) {
        existing[index] = enriched;
      } else {
        existing.unshift(enriched);
      }
      localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(existing));
    } catch (e) {
      console.error('Error saving conversation locally:', e);
    }

    // Save to Firestore if user is authenticated
    if (userId) {
      try {
        const docRef = doc(db, 'users', userId, 'awniConversations', conv.id);
        await setDoc(
          docRef,
          {
            id: conv.id,
            userId,
            title: conv.title,
            folderId: conv.folderId || null,
            category: conv.category,
            summary: conv.summary || '',
            tags: conv.tags || [],
            messages: conv.messages,
            starred: Boolean(conv.starred),
            createdAt: conv.createdAt,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${userId}/awniConversations/${conv.id}`);
      }
    }
  }

  public static async deleteConversation(convId: string, userId?: string): Promise<void> {
    try {
      const existing = await this.getSavedConversations(userId);
      const filtered = existing.filter((c) => c.id !== convId);
      localStorage.setItem(LOCAL_STORAGE_CONVERSATIONS_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error('Error deleting conversation locally:', e);
    }

    if (userId) {
      try {
        const docRef = doc(db, 'users', userId, 'awniConversations', convId);
        await deleteDoc(docRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${userId}/awniConversations/${convId}`);
      }
    }
  }

  public static async assignConversationToFolder(
    convId: string,
    folderId: string | undefined,
    category?: AwniCategoryKey,
    userId?: string
  ): Promise<void> {
    const list = await this.getSavedConversations(userId);
    const target = list.find((c) => c.id === convId);
    if (!target) return;

    target.folderId = folderId;
    if (category) target.category = category;
    target.updatedAt = new Date().toISOString();

    await this.saveConversation(target, userId);
  }
}
