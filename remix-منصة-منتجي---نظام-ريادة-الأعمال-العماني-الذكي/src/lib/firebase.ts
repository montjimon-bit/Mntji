/**
 * src/lib/firebase.ts
 * تهيئة الاتصال المباشر بـ Firebase و Firestore داخل مشروع "منتجي"
 * لإدارة بيانات المستخدمين، المشاريع، المنتجات العمانية، ودراسات الجدوى.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  type Firestore
} from 'firebase/firestore';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// تهيئة تطبيق Firebase وحفظ الحالة دون تكرار
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// تهيئة Firestore مع تحديد معرف قاعدة البيانات المخصصة لمشروع منتجي
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// تهيئة المصادقة
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// الثوابت ومحددات المنظومة
export const MONTAJI_FIREBASE_CONFIG = firebaseConfig;
export const MONTAJI_DB_ID = firebaseConfig.firestoreDatabaseId;
export const ADMIN_EMAIL = 'hudifamoosa2007@gmail.com';

// أسماء مجموعات قاعدة البيانات الرئيسية في مشروع منتجي
export const MONTAJI_COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  ADMINS: 'admins',
  AWNI_FOLDERS: 'awniFolders',
  AWNI_CONVERSATIONS: 'awniConversations',
  REVIEWS: 'reviews',
  WISHLIST: 'wishlist'
} as const;

// دوال مساعدة لإدارة مجموعات منتجي
export const getMontajiCollections = {
  users: () => collection(db, MONTAJI_COLLECTIONS.USERS),
  products: () => collection(db, MONTAJI_COLLECTIONS.PRODUCTS),
  orders: () => collection(db, MONTAJI_COLLECTIONS.ORDERS),
  admins: () => collection(db, MONTAJI_COLLECTIONS.ADMINS),
  userWishlist: (userId: string) => collection(db, MONTAJI_COLLECTIONS.USERS, userId, MONTAJI_COLLECTIONS.WISHLIST),
  userAwniFolders: (userId: string) => collection(db, MONTAJI_COLLECTIONS.USERS, userId, MONTAJI_COLLECTIONS.AWNI_FOLDERS),
  userAwniConversations: (userId: string) => collection(db, MONTAJI_COLLECTIONS.USERS, userId, MONTAJI_COLLECTIONS.AWNI_CONVERSATIONS),
  productReviews: (productId: string) => collection(db, MONTAJI_COLLECTIONS.PRODUCTS, productId, MONTAJI_COLLECTIONS.REVIEWS),
};

export {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  signInWithPopup,
  firebaseSignOut,
  onAuthStateChanged,
  type User
};

export default {
  app,
  db,
  auth,
  googleProvider,
  MONTAJI_COLLECTIONS,
  getMontajiCollections
};
