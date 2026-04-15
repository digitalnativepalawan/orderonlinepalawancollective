import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product, CartItem, Order, BusinessSettings, CheckoutData, OrderStatus } from "@/lib/types";
import {
  loadProducts, saveProducts, loadCart, saveCart,
  loadOrders, saveOrders, loadBusiness, saveBusiness,
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
  setAdminMode: (v: boolean) => void;
  setProducts: (p: Product[]) => void;
  addToCart: (product: Product) => boolean;
  updateCartQty: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  checkout: (data: CheckoutData) => string | null;
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
  const [products, setProductsState] = useState<Product[]>(loadProducts);
  const [cart, setCartState] = useState<CartItem[]>(loadCart);
  const [orders, setOrdersState] = useState<Order[]>(loadOrders);
  const [business, setBusinessState] = useState<BusinessSettings>(loadBusiness);
  const [adminMode, setAdminMode] = useState(() => localStorage.getItem("admin_session") === "true");

  useEffect(() => { saveProducts(products); }, [products]);
  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => { saveOrders(orders); }, [orders]);
  useEffect(() => { saveBusiness(business); }, [business]);
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

  const checkout = useCallback((data: CheckoutData): string | null => {
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
    setProductsState(prev => prev.map(p => {
      const ci = cart.find(c => c.id === p.id);
      if (ci) return { ...p, inventory: Math.max(0, p.inventory - ci.quantity) };
      return p;
    }));
    setOrdersState(prev => [order, ...prev]);
    setCartState([]);
    return orderId;
  }, [cart]);

  const updateProduct = useCallback((product: Product) => {
    setProductsState(prev => prev.map(p => p.id === product.id ? product : p));
  }, []);

  const addProduct = useCallback((product: Omit<Product, "id">) => {
    setProductsState(prev => [...prev, { ...product, id: `p${Date.now()}` }]);
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProductsState(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleAvailability = useCallback((id: string) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
  }, []);

  const updateInventory = useCallback((id: string, val: number) => {
    setProductsState(prev => prev.map(p => p.id === id ? { ...p, inventory: val } : p));
  }, []);

  const setBusiness = useCallback((b: BusinessSettings) => setBusinessState(b), []);

  const addOrder = useCallback((o: Order) => {
    setOrdersState(prev => [o, ...prev]);
  }, []);

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrdersState(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  }, []);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <AppContext.Provider value={{
      products, cart, orders, business, adminMode, setAdminMode,
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
