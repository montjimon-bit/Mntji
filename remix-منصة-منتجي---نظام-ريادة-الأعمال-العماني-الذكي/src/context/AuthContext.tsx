import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, ADMIN_EMAIL, OperationType, handleFirestoreError } from '../services/firebase';

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

interface AuthContextType {
  user: FirebaseUser | null;
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Designated Admin is exclusively hudifamoosa2007@gmail.com
  const isAdmin = Boolean(
    user?.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  );

  const isSeller = Boolean(
    isAdmin || userProfile?.role === 'seller' || userProfile?.role === 'entrepreneur'
  );

  const isCustomer = Boolean(!isAdmin && userProfile?.role === 'customer');

  const hasStore = isSeller;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const isUserAdmin = currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            if (isUserAdmin && data.role !== 'admin') {
              const updatedData: UserProfile = { ...data, role: 'admin' };
              await setDoc(userDocRef, { role: 'admin' }, { merge: true });
              setUserProfile(updatedData);
            } else {
              setUserProfile(data);
            }
          } else {
            // First time login for this user -> Create profile
            // Check if there was a selected role in sessionStorage, default to 'customer' so guests/visitors don't get a store by default
            const pendingRole = (sessionStorage.getItem('pending_user_role') as 'seller' | 'customer') || 'customer';
            const pendingStoreName = sessionStorage.getItem('pending_store_name') || '';

            const newProfile: UserProfile = {
              userId: currentUser.uid,
              displayName: currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : 'عضو المنصة'),
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              role: isUserAdmin ? 'admin' : pendingRole,
              storeName: pendingStoreName,
              hasRiyadaCard: pendingRole === 'seller',
              governorate: 'محافظة مسقط',
              createdAt: serverTimestamp(),
            };

            await setDoc(userDocRef, newProfile);
            setUserProfile(newProfile);
            sessionStorage.removeItem('pending_user_role');
            sessionStorage.removeItem('pending_store_name');
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (chosenRole?: 'seller' | 'customer') => {
    try {
      if (chosenRole) {
        sessionStorage.setItem('pending_user_role', chosenRole);
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (error) {
      console.error('Email Sign-in Error:', error);
      throw error;
    }
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName?: string,
    role: 'seller' | 'customer' = 'customer',
    extraDetails?: Partial<UserProfile>
  ) => {
    try {
      sessionStorage.setItem('pending_user_role', role);
      if (extraDetails?.storeName) {
        sessionStorage.setItem('pending_store_name', extraDetails.storeName);
      }

      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (displayName?.trim()) {
        await updateProfile(cred.user, { displayName: displayName.trim() });
      }

      const isUserAdmin = cred.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const userDocRef = doc(db, 'users', cred.user.uid);
      const newProfile: UserProfile = {
        userId: cred.user.uid,
        displayName: displayName?.trim() || (cred.user.email ? cred.user.email.split('@')[0] : 'عضو المنصة'),
        email: cred.user.email || '',
        photoURL: cred.user.photoURL || '',
        role: isUserAdmin ? 'admin' : role,
        storeName: extraDetails?.storeName || '',
        phone: extraDetails?.phone || '',
        hasRiyadaCard: role === 'seller' ? Boolean(extraDetails?.hasRiyadaCard ?? true) : false,
        commercialRegNumber: extraDetails?.commercialRegNumber || '',
        governorate: extraDetails?.governorate || 'محافظة مسقط',
        createdAt: serverTimestamp(),
      };

      await setDoc(userDocRef, newProfile);
      setUserProfile(newProfile);
    } catch (error) {
      console.error('Email Registration Error:', error);
      throw error;
    }
  };

  const resetPassword = async (emailToReset: string) => {
    try {
      await sendPasswordResetEmail(auth, emailToReset.trim());
    } catch (error) {
      console.error('Password Reset Error:', error);
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      const uid = user.uid;
      const userDocRef = doc(db, 'users', uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Account Deletion Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Sign-out Error:', error);
    }
  };

  const saveUserProfileDetails = async (details: Partial<UserProfile>) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, details, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, ...details } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const switchUserRole = async (newRole: 'seller' | 'customer') => {
    if (!user) return;
    if (isAdmin) return; // Admin keeps admin role
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, { role: newRole }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, role: newRole } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
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
