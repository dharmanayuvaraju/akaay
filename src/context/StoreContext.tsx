import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  CustomerUser,
  OwnerUser,
  StaffMember,
  StaffRole,
  StoreSettings,
} from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_ORDERS, INITIAL_STAFF, INITIAL_SETTINGS } from '../data/seedOrders';

interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Products & Stock
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateStock: (productId: string, size: string, newStock: number) => void;
  getProduct: (idOrSlug: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (productId: string, size: string, color: string, quantity?: number) => boolean;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (
    orderData: Omit<Order, 'id' | 'createdAt' | 'statusHistory' | 'estimatedDelivery'>
  ) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  getOrder: (orderId: string) => Order | undefined;

  // Customer Auth
  customerUser: CustomerUser | null;
  customerLogin: (phone: string, name?: string) => void;
  customerLogout: () => void;

  // Owner & Staff Auth
  ownerUser: OwnerUser | null;
  ownerLogin: (phone: string) => { success: boolean; error?: string };
  ownerLogout: () => void;

  // Staff Management
  staff: StaffMember[];
  addStaff: (member: { name: string; phone: string; role: 'manager' | 'sales' }) => void;
  deleteStaff: (id: string) => void;

  // Store Settings
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;

  // Search overlay
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Toast
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LS_KEYS = {
  PRODUCTS: 'akaay_products_v2',
  ORDERS: 'akaay_orders_v2',
  CART: 'akaay_cart',
  WISHLIST: 'akaay_wishlist',
  CUSTOMER_USER: 'akaay_customer_user',
  OWNER_USER: 'akaay_owner_user',
  STAFF: 'akaay_staff',
  SETTINGS: 'akaay_store_settings',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Customer Auth
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.CUSTOMER_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Owner Auth
  const [ownerUser, setOwnerUser] = useState<OwnerUser | null>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.OWNER_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Staff
  const [staff, setStaff] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.STAFF);
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(LS_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LS_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.WISHLIST, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem(LS_KEYS.CUSTOMER_USER, JSON.stringify(customerUser));
    } else {
      localStorage.removeItem(LS_KEYS.CUSTOMER_USER);
    }
  }, [customerUser]);

  useEffect(() => {
    if (ownerUser) {
      localStorage.setItem(LS_KEYS.OWNER_USER, JSON.stringify(ownerUser));
    } else {
      localStorage.removeItem(LS_KEYS.OWNER_USER);
    }
  }, [ownerUser]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.STAFF, JSON.stringify(staff));
  }, [staff]);

  useEffect(() => {
    localStorage.setItem(LS_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Toast helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Product operations
  const getProduct = (idOrSlug: string) => {
    return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
  };

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newId = `aky-${Date.now().toString().slice(-4)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
    };
    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog`);
    return newProduct;
  };

  const updateProduct = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    showToast(`Saved changes to "${updated.name}"`);
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Deleted "${target?.name || id}"`);
  };

  const updateStock = (productId: string, size: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        const currentStock = { ...p.stock };
        currentStock[size] = Math.max(0, newStock);
        return {
          ...p,
          stock: currentStock,
        };
      })
    );
  };

  // Cart operations
  const addToCart = (productId: string, size: string, color: string, quantity = 1) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return false;

    const availableStock = product.stock[size] ?? 0;
    if (availableStock <= 0) {
      showToast(`Size ${size} is currently out of stock`, 'error');
      return false;
    }

    let success = true;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.productId === productId && item.size === size && item.color === color
      );

      if (existingIndex > -1) {
        const currentQty = prev[existingIndex].quantity;
        if (currentQty + quantity > availableStock) {
          showToast(`Only ${availableStock} in stock for size ${size}`, 'info');
          success = false;
          return prev;
        }
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + quantity,
        };
        return updated;
      } else {
        if (quantity > availableStock) {
          showToast(`Only ${availableStock} in stock for size ${size}`, 'info');
          success = false;
          return prev;
        }
        return [...prev, { productId, size, color, quantity }];
      }
    });

    if (success) {
      showToast(`Added ${product.name} (${size}) to bag`);
    }
    return success;
  };

  const removeFromCart = (productId: string, size: string, color: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.size === size && item.color === color)
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (
    productId: string,
    size: string,
    color: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const product = products.find((p) => p.id === productId);
    const availableStock = product?.stock[size] ?? 99;

    if (quantity > availableStock) {
      showToast(`Only ${availableStock} available in stock`, 'info');
      quantity = availableStock;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId && item.size === size && item.color === color) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(`Saved "${product?.name || 'item'}" to wishlist`);
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders & Stock deduction
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'createdAt' | 'statusHistory' | 'estimatedDelivery'>
  ): Order => {
    // Generate order ID e.g. AKY-2418
    const baseNumber = 2417;
    const newOrderNumber = baseNumber + orders.length + 1;
    const newOrderId = `AKY-${newOrderNumber}`;

    const now = new Date();
    const etaDate = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
    const etaString = etaDate.toISOString().split('T')[0];

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      status: 'Placed',
      createdAt: now.toISOString(),
      estimatedDelivery: etaString,
      statusHistory: [
        {
          status: 'Placed',
          timestamp: now.toISOString(),
          note: `Order placed via ${orderData.paymentMethod}`,
        },
      ],
    };

    // Deduct stock for all items
    setProducts((prev) =>
      prev.map((prod) => {
        const orderedForThisProd = orderData.items.filter((item) => item.productId === prod.id);
        if (orderedForThisProd.length === 0) return prod;

        const updatedStock = { ...prod.stock };
        orderedForThisProd.forEach((item) => {
          const current = updatedStock[item.size] ?? 0;
          updatedStock[item.size] = Math.max(0, current - item.quantity);
        });

        return {
          ...prod,
          stock: updatedStock,
        };
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    // If order was cancelled and now cancelling, restore stock
    if (newStatus === 'Cancelled' && targetOrder.status !== 'Cancelled') {
      setProducts((prev) =>
        prev.map((prod) => {
          const itemsForProd = targetOrder.items.filter((item) => item.productId === prod.id);
          if (itemsForProd.length === 0) return prod;

          const updatedStock = { ...prod.stock };
          itemsForProd.forEach((item) => {
            const current = updatedStock[item.size] ?? 0;
            updatedStock[item.size] = current + item.quantity;
          });

          return { ...prod, stock: updatedStock };
        })
      );
    }

    const timestamp = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          status: newStatus,
          statusHistory: [
            ...ord.statusHistory,
            { status: newStatus, timestamp, note: note || `Order marked as ${newStatus}` },
          ],
        };
      })
    );

    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const getOrder = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return orders.find((o) => o.id.toUpperCase() === clean);
  };

  // Customer auth
  const customerLogin = (phone: string, name?: string) => {
    const user: CustomerUser = {
      phone,
      name: name || 'Valued Guest',
      isLoggedIn: true,
    };
    setCustomerUser(user);
    showToast(`Signed in with +91 ${phone}`);
  };

  const customerLogout = () => {
    setCustomerUser(null);
    showToast('Signed out of customer account', 'info');
  };

  // Owner auth
  const ownerLogin = (phone: string): { success: boolean; error?: string } => {
    const cleanPhone = phone.trim();
    // Default owner
    if (cleanPhone === '7337422054' || cleanPhone === '9999999999') {
      const user: OwnerUser = {
        phone: cleanPhone,
        name: 'Yuvaraj (Owner)',
        role: 'owner',
        isLoggedIn: true,
      };
      setOwnerUser(user);
      showToast('Welcome to Akaay Boutique Back Office (Owner)', 'success');
      return { success: true };
    }

    // Check staff members
    const matchedStaff = staff.find((s) => s.phone === cleanPhone);
    if (matchedStaff) {
      const user: OwnerUser = {
        phone: matchedStaff.phone,
        name: matchedStaff.name,
        role: matchedStaff.role,
        isLoggedIn: true,
      };
      setOwnerUser(user);
      showToast(`Welcome back, ${matchedStaff.name} (${matchedStaff.role})`, 'success');
      return { success: true };
    }

    // Allow simulated owner login with any phone if requested, assigning manager/owner
    const user: OwnerUser = {
      phone: cleanPhone,
      name: 'Yuvaraj (Owner)',
      role: 'owner',
      isLoggedIn: true,
    };
    setOwnerUser(user);
    showToast('Welcome to Akaay Boutique Back Office', 'success');
    return { success: true };
  };

  const ownerLogout = () => {
    setOwnerUser(null);
    showToast('Owner session ended', 'info');
  };

  // Staff operations (Only owner can perform)
  const addStaff = (member: { name: string; phone: string; role: 'manager' | 'sales' }) => {
    const newStaff: StaffMember = {
      id: `stf-${Date.now().toString().slice(-4)}`,
      name: member.name,
      phone: member.phone,
      role: member.role,
      createdAt: new Date().toISOString(),
    };
    setStaff((prev) => [...prev, newStaff]);
    showToast(`Staff account for ${member.name} created`);
  };

  const deleteStaff = (id: string) => {
    const target = staff.find((s) => s.id === id);
    setStaff((prev) => prev.filter((s) => s.id !== id));
    showToast(`Removed staff access for ${target?.name || id}`, 'info');
  };

  // Store settings
  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Boutique settings updated');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        getProduct,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        isCartOpen,
        setIsCartOpen,

        wishlist,
        toggleWishlist,
        isInWishlist,

        orders,
        placeOrder,
        updateOrderStatus,
        getOrder,

        customerUser,
        customerLogin,
        customerLogout,

        ownerUser,
        ownerLogin,
        ownerLogout,

        staff,
        addStaff,
        deleteStaff,

        settings,
        updateSettings,

        isSearchOpen,
        setIsSearchOpen,

        toasts,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
