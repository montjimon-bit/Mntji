import React, { createContext, useContext, useEffect, useState } from 'react';

export type UserRole = 'admin' | 'seller' | 'customer' | 'entrepreneur';

export interface UserProfile {
  userId: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: UserRole;
  storeName?: string;
  phone?: string;
  hasRiyadaCard?: boolean;
  riyadaCardNumber?: string;
  commercialRegNumber?: string;
  governorate?: string;
  createdAt?: any;
}

interface StoredLocalAccount extends UserProfile {
  password?: string;
}

interface AuthContextType {
  user: { uid: string; email: string; displayName: string; photoURL?: string } | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  isSeller: boolean;
  isCustomer: boolean;
  hasStore: boolean;
  loading: boolean;
  signInWithGoogle: (chosenRole?: 'seller' | 'customer') => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName?: string,
    role?: 'seller' | 'customer',
    extraDetails?: Partial<UserProfile>
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => Promise<void>;
  saveUserProfileDetails: (details: Partial<UserProfile>) => Promise<void>;
  switchUserRole: (newRole: 'seller' | 'customer') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USERS_KEY = 'montaji_local_users_v1';
const STORAGE_CURRENT_KEY = 'montaji_current_session_v1';

// حسابات جاهزة للتجربة الفورية بدون قاعدة بيانات خارجية
const DEFAULT_DEMO_ACCOUNTS: StoredLocalAccount[] = [
  {
    userId: 'demo-customer-1',
    displayName: 'مريم المعمرية (عميل تجريبي)',
    email: 'customer@montaji.om',
    password: '123456',
    role: 'customer',
    phone: '91234567',
    governorate: 'محافظة مسقط',
  },
  {
    userId: 'demo-seller-1',
    displayName: 'سالم الحارثي (بائع معتمد)',
    email: 'seller@montaji.om',
    password: '123456',
    role: 'seller',
    storeName: 'دار اللبان الظفاري',
    phone: '92418530',
    hasRiyadaCard: true,
    riyadaCardNumber: 'RYD-2026-8841',
    governorate: 'محافظة ظفار',
  },
  {
    userId: 'demo-admin-1',
    displayName: 'حذيفة الشحيلي (المشرف العام)',
    email: 'hudifamoosa2007@gmail.com',
    password: '123456',
    role: 'admin',
    storeName: 'إدارة منصة مُنتجي',
    phone: '94842840',
    hasRiyadaCard: true,
    governorate: 'محافظة مسقط',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getAllStoredUsers = (): StoredLocalAccount[] => {
    try {
      const raw = localStorage.getItem(STORAGE_USERS_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_DEMO_ACCOUNTS));
        return DEFAULT_DEMO_ACCOUNTS;
      }
      const parsed = JSON.parse(raw) as StoredLocalAccount[];
      return parsed.length > 0 ? parsed : DEFAULT_DEMO_ACCOUNTS;
    } catch {
      return DEFAULT_DEMO_ACCOUNTS;
    }
  };

  const saveAllStoredUsers = (list: StoredLocalAccount[]) => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(list));
  };

  useEffect(() => {
    getAllStoredUsers();
    try {
      const savedSession = localStorage.getItem(STORAGE_CURRENT_KEY);
      if (savedSession) {
        setUserProfile(JSON.parse(savedSession));
      }
    } catch {
      localStorage.removeItem(STORAGE_CURRENT_KEY);
    }
    setLoading(false);
  }, []);

  const persistSession = (profile: UserProfile | null) => {
    setUserProfile(profile);
    if (profile) {
      localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_CURRENT_KEY);
    }
  };

  const isAdmin = Boolean(
    userProfile?.role === 'admin' ||
      userProfile?.email?.toLowerCase() === 'hudifamoosa2007@gmail.com'
  );

  const isSeller = Boolean(
    isAdmin || userProfile?.role === 'seller' || userProfile?.role === 'entrepreneur'
  );

  const isCustomer = Boolean(!isAdmin && userProfile?.role === 'customer');
  const hasStore = isSeller;

  // كائن user متوافق مع جميع مكونات المنصة
  const user = userProfile
    ? {
        uid: userProfile.userId,
        email: userProfile.email,
        displayName: userProfile.displayName,
        photoURL: userProfile.photoURL || '',
      }
    : null;

  // تسجيل دخول سريع بـ Google محلياً للتجربة الفورية بدون Firebase
  const signInWithGoogle = async (chosenRole: 'seller' | 'customer' = 'customer') => {
    const pendingRole =
      (sessionStorage.getItem('pending_user_role') as 'seller' | 'customer') || chosenRole;

    const demoProfile: UserProfile =
      pendingRole === 'seller'
        ? {
            userId: 'google-seller-demo',
            displayName: 'تاجر مُنتجي (دخول تجريبي)',
            email: 'seller.demo@montaji.om',
            role: 'seller',
            storeName: 'متجر الإبداع العُماني',
            phone: '92000001',
            hasRiyadaCard: true,
            governorate: 'محافظة مسقط',
          }
        : {
            userId: 'google-customer-demo',
            displayName: 'زائر مُنتجي (عميل تجريبي)',
            email: 'customer.demo@montaji.om',
            role: 'customer',
            phone: '91000001',
            governorate: 'محافظة مسقط',
          };

    sessionStorage.removeItem('pending_user_role');
    persistSession(demoProfile);
  };

  // تسجيل الدخول بالبريد وكلمة المرور محلياً (يقبل الحسابات المسجلة أو أي بريد للتجربة)
  const signInWithEmail = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 3) {
      throw new Error('يرجى إدخال البريد الإلكتروني وكلمة المرور (3 أحرف على الأقل).');
    }

    const users = getAllStoredUsers();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.password && existing.password !== pass) {
        throw new Error('كلمة المرور غير صحيحة.');
      }
      const { password: _, ...profile } = existing;
      persistSession(profile);
      return;
    }

    // إذا أدخل المستخدم بريداً جديداً في شاشة الدخول، ينشئ له جلسة تجربة تلقائية
    const isSellerEmail = cleanEmail.includes('seller') || cleanEmail.includes('store');
    const autoProfile: UserProfile = {
      userId: `local-${Date.now()}`,
      displayName: cleanEmail.split('@')[0],
      email: cleanEmail,
      role: cleanEmail === 'hudifamoosa2007@gmail.com' ? 'admin' : isSellerEmail ? 'seller' : 'customer',
      storeName: isSellerEmail ? `متجر ${cleanEmail.split('@')[0]}` : '',
      hasRiyadaCard: isSellerEmail,
      governorate: 'محافظة مسقط',
    };

    saveAllStoredUsers([...users, { ...autoProfile, password: pass }]);
    persistSession(autoProfile);
  };

  // إنشاء حساب جديد (عميل أو بائع) وحفظه محلياً
  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName?: string,
    role: 'seller' | 'customer' = 'customer',
    extraDetails?: Partial<UserProfile>
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || pass.length < 3) {
      throw new Error('يرجى إكمال البريد الإلكتروني وكلمة المرور.');
    }

    const users = getAllStoredUsers();
    const newProfile: UserProfile = {
      userId: `local-${Date.now()}`,
      displayName: displayName?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      role: cleanEmail === 'hudifamoosa2007@gmail.com' ? 'admin' : role,
      storeName:
        extraDetails?.storeName ||
        (role === 'seller' ? `متجر ${displayName?.trim() || cleanEmail.split('@')[0]}` : ''),
      phone: extraDetails?.phone || '90000000',
      hasRiyadaCard: role === 'seller',
      commercialRegNumber: extraDetails?.commercialRegNumber || '',
      governorate: extraDetails?.governorate || 'محافظة مسقط',
      createdAt: new Date().toISOString(),
    };

    const filtered = users.filter((u) => u.email.toLowerCase() !== cleanEmail);
    saveAllStoredUsers([...filtered, { ...newProfile, password: pass }]);
    persistSession(newProfile);
  };

  const resetPassword = async (emailToReset: string) => {
    const cleanEmail = emailToReset.trim().toLowerCase();
    const users = getAllStoredUsers();
    const updated = users.map((u) =>
      u.email.toLowerCase() === cleanEmail ? { ...u, password: '123456' } : u
    );
    saveAllStoredUsers(updated);
  };

  const deleteAccount = async () => {
    if (!userProfile) return;
    const users = getAllStoredUsers().filter((u) => u.userId !== userProfile.userId);
    saveAllStoredUsers(users);
    persistSession(null);
  };

  const logout = async () => {
    persistSession(null);
  };

  const saveUserProfileDetails = async (details: Partial<UserProfile>) => {
    if (!userProfile) return;
    const updatedProfile = { ...userProfile, ...details };
    const users = getAllStoredUsers().map((u) =>
      u.userId === userProfile.userId ? { ...u, ...details } : u
    );
    saveAllStoredUsers(users);
    persistSession(updatedProfile);
  };

  const switchUserRole = async (newRole: 'seller' | 'customer') => {
    if (!userProfile || isAdmin) return;
    await saveUserProfileDetails({
      role: newRole,
      storeName:
        newRole === 'seller' && !userProfile.storeName
          ? `متجر ${userProfile.displayName}`
          : userProfile.storeName,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isAdmin,
        isSeller,
        isCustomer,
        hasStore,
        loading,
        signInWithGoogle,
        signInWithEmail,
        registerWithEmail,
        resetPassword,
        deleteAccount,
        logout,
        saveUserProfileDetails,
        switchUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
