import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { Product, PRODUCTS_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  toastMessage: string | null;
  clearToast: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('montaji_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  const clearToast = () => setToastMessage(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('montaji_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Sync with Firestore when user is signed in
  useEffect(() => {
    if (!user) return;

    const wishlistColRef = collection(db, 'users', user.uid, 'wishlist');

    const unsubscribe = onSnapshot(
      wishlistColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts: Product[] = [];
          snapshot.docs.forEach((docSnap) => {
            const data = docSnap.data();
            if (data.product) {
              loadedProducts.push(data.product);
            } else {
              // Match from mock/catalog
              const found = PRODUCTS_DATA.find((p) => p.id === docSnap.id);
              if (found) loadedProducts.push(found);
            }
          });

          // Merge loaded products with local state
          setWishlist((currentLocal) => {
            const mergedMap = new Map<string, Product>();
            loadedProducts.forEach((p) => mergedMap.set(p.id, p));
            currentLocal.forEach((p) => {
              if (!mergedMap.has(p.id)) {
                mergedMap.set(p.id, p);
                // Also upload local guest items to Firestore
                setDoc(doc(db, 'users', user.uid, 'wishlist', p.id), {
                  productId: p.id,
                  product: p,
                  addedAt: serverTimestamp(),
                }).catch((err) =>
                  handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/wishlist/${p.id}`)
                );
              }
            });
            return Array.from(mergedMap.values());
          });
        } else {
          // If Firestore is empty but user had local guest items, upload them
          setWishlist((currentLocal) => {
            if (currentLocal.length > 0) {
              currentLocal.forEach((p) => {
                setDoc(doc(db, 'users', user.uid, 'wishlist', p.id), {
                  productId: p.id,
                  product: p,
                  addedAt: serverTimestamp(),
                }).catch((err) =>
                  handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/wishlist/${p.id}`)
                );
              });
            }
            return currentLocal;
          });
        }
      },
      (error) => {
        console.warn('Error listening to wishlist:', error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const isInWishlist = (productId: string): boolean => {
    return wishlist.some((p) => p.id === productId);
  };

  const addToWishlist = async (product: Product) => {
    if (isInWishlist(product.id)) return;

    setWishlist((prev) => [...prev, product]);
    showToast(`تمت إضافة "${product.title}" إلى قائمة أمنياتك ❤️`);

    if (user) {
      try {
        await setDoc(doc(db, 'users', user.uid, 'wishlist', product.id), {
          productId: product.id,
          product,
          addedAt: serverTimestamp(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/wishlist/${product.id}`);
      }
    }
  };

  const removeFromWishlist = async (productId: string) => {
    const item = wishlist.find((p) => p.id === productId);
    setWishlist((prev) => prev.filter((p) => p.id !== productId));
    if (item) {
      showToast(`تم حذف "${item.title}" من قائمة أمنياتك`);
    }

    if (user) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'wishlist', productId));
      } catch (err) {
        handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/wishlist/${productId}`);
      }
    }
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = async () => {
    const itemsToDelete = [...wishlist];
    setWishlist([]);
    showToast('تم إفراغ قائمة أمنياتك');

    if (user) {
      itemsToDelete.forEach((p) => {
        deleteDoc(doc(db, 'users', user.uid, 'wishlist', p.id)).catch(() => {});
      });
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        toastMessage,
        clearToast,
      }}
    >
      {children}
      {/* Global Wishlist Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#153e4d] text-white border border-[#c59b5f]/50 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs sm:text-sm font-semibold animate-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-[#c59b5f] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
