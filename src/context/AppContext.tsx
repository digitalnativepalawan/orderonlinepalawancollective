import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, Order, BusinessSettings, CheckoutData, OrderStatus } from "@/lib/types";
import {
  loadProductsFromDb, saveProductToDb, addProductToDb, deleteProductFromDb,
  loadCart, saveCart,
  loadOrdersFromDb, addOrderToDb, updateOrderStatusInDb,
  loadBusinessFromDb, saveBusinessToDb,
} from "@/lib/store";

function generateOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${ts}-${rand}`;
}

interface AppState {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  business: BusinessSettings;
  adminMode: boolean;
  loading: boolean;
  setAdminMode: (v: boolean) => void;
  setProducts: (p: Product[]) => void;
  addToCart: (product: Product) => boolean;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: (data: CheckoutData) => Promise<string | null>;
  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, "id">) => void;
  deleteProduct: (id: string) => void;
  toggleAvailability: (id: string) => void;
  updateInventory: (id: string, val: number) => void;
  setBusiness: (b: BusinessSettings) => void;
  addOrder: (o: Order) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  cartTotal: number;
  cartCount: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>([]);
  const [cart, setCartState] = useState<CartItem[]>(loadCart);
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [business, setBusinessState] = useState<BusinessSettings>({
    businessName: "Jaycee's Pantry", phone: "", email: "", facebook: "", instagram: "",
    address: "", logoBase64: "", whatsappTemplate: "", invoiceFooter: "", taxRate: 0,
  });
  const [adminMode, setAdminMode] = useState(() => localStorage.getItem("admin_session") === "true");
  const [loading, setLoading] = useState(true);

  // Load all data from Cloud on mount
  useEffect(() => {
    async function init() {
      try {
        const [prods, ords, biz] = await Promise.all([
          loadProductsFromDb(),
          loadOrdersFromDb(),
          loadBusinessFromDb(),
        ]);
        setProductsState(prods);
        setOrdersState(ords);
        setBusinessState(biz);
      } catch (err) {
        console.error("Failed to load data from Cloud:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // Cart stays in localStorage
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => {
    if (adminMode) localStorage.setItem("admin_session", "true");
    else localStorage.removeItem("admin_session");
  }, [adminMode]);

  const setProducts = useCallback((p: Product[]) => setProductsState(p), []);

  const addToCart = useCallback((product: Product): boolean => {
    setCartState(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.quantity >= product.inventory) return prev;
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, unit: product.unit, image: product.image, quantity: 1 }];
    });
    return true;
  }, []);

  const updateCartQty = useCallback((id: string, delta: number) => {
    setCartState(prev => {
      return prev.map(i => {
        if (i.id !== id) return i;
        const newQty = i.quantity + delta;
        if (newQty <= 0) return i;
        return { ...i, quantity: newQty };
      }).filter(i => i.quantity > 0);
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartState(prev => prev.filter(i => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setCartState([]), []);

  const checkout = useCallback(async (data: CheckoutData): Promise<string | null> => {
    if (cart.length === 0) return null;
    const orderId = generateOrderId();
    const now = new Date();
    const order: Order = {
      id: orderId,
      date: now.toLocaleString(),
      timestamp: now.toISOString(),
      customer: data.name || "Guest",
      email: data.email || "",
      phone: data.phone || "",
      countryCode: data.countryCode || "+63",
      deliveryType: data.deliveryType || "pickup",
      notes: data.notes || "",
      contact: `${data.countryCode}${data.phone}`,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price, unit: i.unit })),
      total: cart.reduce((s, i) => s + i.price * i.quantity, 0),
      status: "Pending",
    };
    // Update product inventory in DB
    const updatedProducts = products.map(p => {
      const ci = cart.find(c => c.id === p.id);
      if (ci) return { ...p, inventory: Math.max(0, p.inventory - ci.quantity) };
      return p;
    });
    setProductsState(updatedProducts);
    // Save inventory changes to DB
    for (const p of updatedProducts) {
      const ci = cart.find(c => c.id === p.id);
      if (ci) saveProductToDb(p);
    }
    setOrdersState(prev => [order, ...prev]);
    await addOrderToDb(order);
    setCartState([]);
    return orderId;
  }, [cart, products]);

  const updateProduct = useCallback((product: Product) => {
    setProductsState(prev => prev.map(p => p.id === product.id ? product : p));
    saveProductToDb(product);
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    addProductToDb(product).then(newProduct => {
      if (newProduct) setProductsState(prev => [...prev, newProduct]);
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
    deleteProductFromDb(id);
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setProductsState(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p);
      const product = updated.find(p => p.id === id);
      if (product) saveProductToDb(product);
      return updated;
    });
  }, []);

  const updateInventory = useCallback((id: string, val: number) => {
    setProductsState(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, inventory: val } : p);
      const product = updated.find(p => p.id === id);
      if (product) saveProductToDb(product);
      return updated;
    });
  }, []);

  const setBusiness = useCallback((b: BusinessSettings) => {
    setBusinessState(b);
    saveBusinessToDb(b);
  }, []);

  const addOrder = useCallback((o: Order) => {
    setOrdersState(prev => [o, ...prev]);
    addOrderToDb(o);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrdersState(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    updateOrderStatusInDb(id, status);
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <AppContext.Provider value={{
      products, cart, orders, business, adminMode, loading, setAdminMode,
      setProducts, addToCart, updateCartQty, removeFromCart, clearCart,
      checkout, updateProduct, addProduct, deleteProduct, toggleAvailability,
      updateInventory, setBusiness, addOrder, updateOrderStatus, cartTotal, cartCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
