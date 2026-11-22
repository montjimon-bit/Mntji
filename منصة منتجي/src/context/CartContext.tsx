import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, PRODUCTS_DATA } from '../data/mockData';
import { PLATFORM_CONFIG } from '../config/platformConfig';
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
  allOrders: Order[];
  lastOrder: Order | null;
  placeOrder: (customerInfo: CreateOrderInput) => Promise<Order>;
  updateOrderStatus: (orderId: string, newStatus: Order['status']) => Promise<void>;
  addNewProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const PRODUCTS_STORAGE_KEY = 'montaji_products_v1';
const CART_STORAGE_KEY = 'montaji_cart_v1';
const ORDERS_STORAGE_KEY = 'montaji_orders_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // تجاهل أخطاء القراءة
    }
    return PRODUCTS_DATA;
  });

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [couponCode, setCouponCode] = useState<string>('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState<number>(0);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.warn('تعذر حفظ المنتجات محلياً:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('تعذر حفظ السلة محلياً:', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('تعذر حفظ الطلبيات محلياً:', e);
    }
  }, [orders]);

  // مزامنة بيانات المنتجات في السلة مع أحدث حالة للمخزون
  const syncedItems = items.map((item) => {
    const latestProduct = products.find((p) => p.id === item.product.id) || item.product;
    return {
      ...item,
      product: latestProduct,
    };
  });

  const addToCart = (product: Product, quantity = 1) => {
    const latestProduct = products.find((p) => p.id === product.id) || product;
    const availableStock = Number(latestProduct.stock) || 0;
    if (availableStock <= 0) return;

    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === latestProduct.id);
      if (existing) {
        const nextQty = Math.min(availableStock, existing.quantity + quantity);
        return prev.map((item) =>
          item.product.id === latestProduct.id
            ? { ...item, product: latestProduct, quantity: nextQty }
            : item
        );
      }
      return [...prev, { product: latestProduct, quantity: Math.min(availableStock, quantity) }];
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

    const currentProduct = products.find((p) => p.id === productId);
    const maxStock = currentProduct ? Number(currentProduct.stock) || 0 : quantity;
    if (maxStock <= 0) {
      removeFromCart(productId);
      return;
    }

    const clampedQty = Math.min(maxStock, quantity);

    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, product: currentProduct || item.product, quantity: clampedQty }
          : item
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

  const cartCount = syncedItems.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = Number(
    syncedItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(3)
  );

  const discount = Number(((subtotal * couponDiscountPercent) / 100).toFixed(3));
  const discountedSubtotal = Math.max(0, subtotal - discount);

  const shippingFee =
    syncedItems.length === 0
      ? 0
      : discountedSubtotal >= PLATFORM_CONFIG.freeShippingThreshold
      ? 0
      : PLATFORM_CONFIG.standardShippingFee;

  const tax = Number((discountedSubtotal * PLATFORM_CONFIG.vatRate).toFixed(3));
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
      items: syncedItems.map((i) => ({
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

    // خصم الكمية المباعة من مخزون المنتجات تلقائياً
    setProducts((prevProducts) =>
      prevProducts.map((prod) => {
        const orderedItem = syncedItems.find((i) => i.product.id === prod.id);
        if (!orderedItem) return prod;
        const currentStock = Number(prod.stock) || 0;
        return {
          ...prod,
          stock: Math.max(0, currentStock - orderedItem.quantity),
        };
      })
    );

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const addNewProduct = async (productData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now()}`;

    const createdProduct: Product = {
      id: newId,
      title: productData.title,
      description: productData.description,
      price: Number(productData.price) || 0,
      category: productData.category,
      subCategory: productData.subCategory,
      governorate: productData.governorate,
      seller: {
        name: productData.seller.name,
        isRiyadaCertified: Boolean(productData.seller.isRiyadaCertified),
        rating: 5.0,
        email: productData.sellerEmail || user?.email || PLATFORM_CONFIG.merchantEmail,
      },
      sellerId: productData.sellerId || user?.uid || 'hudifamoosa2007',
      sellerEmail: productData.sellerEmail || user?.email || PLATFORM_CONFIG.merchantEmail,
      image:
        productData.image ||
        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
      stock: Number(productData.stock) || 20,
      featured: Boolean(productData.featured),
    };

    setProducts((prev) => [createdProduct, ...prev]);
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    removeFromCart(productId);
  };

  return (
    <CartContext.Provider
      value={{
        items: syncedItems,
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
        allOrders: orders,
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