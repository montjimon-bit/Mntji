import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth, OperationType, handleFirestoreError } from '../services/firebase';
import { Product, PRODUCTS_DATA } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  userId: string;
  customerName: string;
  email: string;
  phone: string;
  governorate: string;
  wilayat: string;
  address: string;
  paymentMethod: 'apple_pay' | 'google_pay' | 'samsung_pay' | 'bank_muscat' | 'thawani' | 'card' | 'cod';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: 'تم الاستلام' | 'قيد التجهيز' | 'قيد التوصيل' | 'تم التسليم';
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  phone: string;
  governorate: string;
  wilayat: string;
  address: string;
  paymentMethod: 'apple_pay' | 'google_pay' | 'samsung_pay' | 'bank_muscat' | 'thawani' | 'card' | 'cod';
}

interface CartContextType {
  items: CartItem[];
  products: Product[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode: string;
  couponDiscountPercent: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  orders: Order[];
  allOrders: Order[]; // For Admin
  lastOrder: Order | null;
  placeOrder: (customerInfo: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('montaji_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('montaji_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('montaji_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  // Sync products from Firestore or seed if empty
  useEffect(() => {
    const productsColRef = collection(db, 'products');

    const unsubscribe = onSnapshot(
      productsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedProducts = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              title: data.title || '',
              description: data.description || '',
              price: Number(data.price) || 0,
              category: data.category || 'عام',
              governorate: data.governorate || 'محافظة مسقط',
              seller: {
                name: data.sellerName || 'رائد أعمال عماني',
                isRiyadaCertified: Boolean(data.isRiyadaCertified),
                rating: Number(data.rating) || 4.8,
              },
              image: data.image || '',
              stock: Number(data.stock) || 10,
              featured: Boolean(data.featured),
            } as Product;
          });
          setProducts(loadedProducts);
        } else {
          // Seed initial products into Firestore if database collection is empty
          PRODUCTS_DATA.forEach(async (prod) => {
            try {
              await setDoc(doc(db, 'products', prod.id), {
                id: prod.id,
                title: prod.title,
                description: prod.description,
                price: prod.price,
                category: prod.category,
                governorate: prod.governorate,
                sellerName: prod.seller.name,
                isRiyadaCertified: prod.seller.isRiyadaCertified,
                rating: prod.seller.rating,
                image: prod.image,
                stock: prod.stock,
                featured: Boolean(prod.featured),
                createdAt: serverTimestamp(),
              });
            } catch (err) {
              console.log('Seeding product note:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'products');
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to Orders from Firestore
  useEffect(() => {
    if (!user) return;

    if (isAdmin) {
      // Admin sees ALL orders
      const ordersColRef = collection(db, 'orders');
      const unsubscribe = onSnapshot(
        ordersColRef,
        (snapshot) => {
          const loadedOrders = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Order[];
          setAllOrders(loadedOrders);
          setOrders(loadedOrders);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsubscribe();
    } else {
      // Normal user sees their own orders
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(
        ordersQuery,
        (snapshot) => {
          const userOrders = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          })) as Order[];
          setOrders(userOrders);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'orders');
        }
      );
      return () => unsubscribe();
    }
  }, [user, isAdmin]);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
    setCouponDiscountPercent(0);
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'OMAN2040' || clean === 'RIYADA10') {
      setCouponCode(clean);
      setCouponDiscountPercent(10);
      return { success: true, message: 'تم تطبيق خصم 10% بنجاح لدعم رواد الأعمال!' };
    }
    if (clean === 'MONTAJI15') {
      setCouponCode(clean);
      setCouponDiscountPercent(15);
      return { success: true, message: 'تم تطبيق خصم 15% ترحيبي خاص بمنصة منتجي!' };
    }
    return { success: false, message: 'رمز القسيمة غير صالح أو منتهي الصلاحية.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscountPercent(0);
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = Number(
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(3)
  );

  const discount = Number(((subtotal * couponDiscountPercent) / 100).toFixed(3));
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const shippingFee = items.length === 0 ? 0 : discountedSubtotal >= 30 ? 0 : 2.0;
  const tax = Number((discountedSubtotal * 0.05).toFixed(3));
  const total = Number((discountedSubtotal + shippingFee + tax).toFixed(3));

  const placeOrder = async (customerInfo: CreateOrderInput): Promise<Order> => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ord-${Date.now()}`;
    const currentUserId = user?.uid || `guest-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber: `OMN-${new Date().getFullYear()}-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      userId: currentUserId,
      customerName: customerInfo.customerName,
      email: customerInfo.email,
      phone: customerInfo.phone,
      governorate: customerInfo.governorate,
      wilayat: customerInfo.wilayat,
      address: customerInfo.address,
      paymentMethod: customerInfo.paymentMethod,
      items: items.map((i) => ({
        id: i.product.id,
        title: i.product.title,
        price: i.product.price,
        quantity: i.quantity,
        image: i.product.image,
      })),
      subtotal,
      discount,
      shippingFee,
      tax,
      total,
      status: 'تم الاستلام',
    };

    // Save to Firestore Database
    try {
      await setDoc(doc(db, 'orders', orderId), {
        ...newOrder,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Saving to local orders fallback:', error);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);

    // Save to localStorage as well
    try {
      const existingSaved = JSON.parse(localStorage.getItem('montaji_orders') || '[]');
      localStorage.setItem('montaji_orders', JSON.stringify([newOrder, ...existingSaved]));
    } catch (e) {
      console.error(e);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      setAllOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const addNewProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;
    const productRef = doc(db, 'products', newId);
    try {
      await setDoc(productRef, {
        id: newId,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        governorate: productData.governorate,
        sellerName: productData.seller.name,
        sellerId: user?.uid || 'admin',
        isRiyadaCertified: productData.seller.isRiyadaCertified,
        rating: 5.0,
        image: productData.image,
        stock: productData.stock,
        featured: Boolean(productData.featured),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `products/${newId}`);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${productId}`);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        products,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        couponCode,
        couponDiscountPercent,
        applyCoupon,
        removeCoupon,
        orders,
        allOrders,
        lastOrder,
        placeOrder,
        updateOrderStatus,
        addNewProduct,
        deleteProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
