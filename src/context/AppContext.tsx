import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  inventory: number;
  image: string;
  isAvailable: boolean;
  created_at?: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_type: string;
  address?: string;
  items: any[];
  total: number;
  status: string;
  timestamp: string;
}

interface AppContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cart: any[];
  setCart: React.Dispatch<React.SetStateAction<any[]>>;
  adminMode: boolean;
  setAdminMode: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (orderData: any) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  updateInventory: (id: string, newInventory: number) => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchOrders: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Save product to Supabase helper
  const saveProductToDb = useCallback(async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ isAvailable: product.isAvailable, inventory: product.inventory })
        .eq('id', product.id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error saving product to Supabase:', error);
    }
  }, []);

  // Fetch products from Supabase
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setProducts(data);
      } else {
        // Load default products if none exist
        const defaultProducts = getDefaultProducts();
        setProducts(defaultProducts);
        // Insert default products to Supabase
        for (const product of defaultProducts) {
          await supabase.from('products').insert([product]);
        }
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({ title: 'Error', description: 'Failed to load products', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch orders from Supabase
  const fetchOrders = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      if (data) setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('jaycee_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('jaycee_cart', JSON.stringify(cart));
  }, [cart]);

  // Load initial data
  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast({ title: 'Added to cart', description: `${product.name} added` });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (orderData: any) => {
    try {
      const newOrder = {
        id: Date.now().toString(),
        ...orderData,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      const { error } = await supabase.from('orders').insert([newOrder]);
      if (error) throw error;
      
      // Update inventory
      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          const newInventory = product.inventory - item.quantity;
          await supabase
            .from('products')
            .update({ inventory: newInventory })
            .eq('id', product.id);
        }
      }
      
      setOrders(prev => [newOrder, ...prev]);
      clearCart();
      await fetchProducts();
      
      toast({ title: 'Order placed!', description: `Order #${newOrder.id.slice(-6)} confirmed` });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({ title: 'Error', description: 'Failed to place order', variant: 'destructive' });
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(product)
        .eq('id', product.id);
      
      if (error) throw error;
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      toast({ title: 'Product updated', description: product.name });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ title: 'Error', description: 'Failed to update product', variant: 'destructive' });
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      toast({ title: 'Product deleted', variant: 'destructive' });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: 'Error', description: 'Failed to delete product', variant: 'destructive' });
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const newProduct = { ...product, id: Date.now().toString() };
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) throw error;
      setProducts(prev => [...prev, newProduct]);
      toast({ title: 'Product added', description: product.name });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({ title: 'Error', description: 'Failed to add product', variant: 'destructive' });
    }
  };

  // ✅ FIXED: toggleAvailability now saves to Supabase immediately
  const toggleAvailability = useCallback(async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const updatedProduct = { ...product, isAvailable: !product.isAvailable };
    
    // Update local state immediately
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    
    // Save to Supabase
    try {
      const { error } = await supabase
        .from('products')
        .update({ isAvailable: updatedProduct.isAvailable })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({ 
        title: updatedProduct.isAvailable ? 'Product available' : 'Product unavailable', 
        description: `${updatedProduct.name} is now ${updatedProduct.isAvailable ? 'visible to customers' : 'hidden from customers'}`
      });
    } catch (error) {
      console.error('Error toggling availability:', error);
      // Revert on error
      setProducts(prev => prev.map(p => p.id === id ? product : p));
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    }
  }, [products, toast]);

  const updateInventory = useCallback(async (id: string, newInventory: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    const updatedProduct = { ...product, inventory: newInventory };
    setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    
    try {
      const { error } = await supabase
        .from('products')
        .update({ inventory: newInventory })
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Inventory updated', description: `${product.name}: ${newInventory} left` });
    } catch (error) {
      console.error('Error updating inventory:', error);
      setProducts(prev => prev.map(p => p.id === id ? product : p));
    }
  }, [products, toast]);

  const getDefaultProducts = (): Product[] => {
    return [
      { id: "p1", name: "Hungarian Sausage 500g", category: "Sausages", price: 377, unit: "pack", inventory: 20, image: "https://placehold.co/400x300/FFE1C6/5a3e2b?text=Hungarian", isAvailable: true },
      { id: "p2", name: "Breakfast Links 500g", category: "Sausages", price: 376, unit: "pack", inventory: 18, image: "https://placehold.co/400x300/FFD966/5a3e2b?text=Breakfast", isAvailable: true },
      { id: "p3", name: "Frankfurter 250g", category: "Sausages", price: 188, unit: "pack", inventory: 25, image: "https://placehold.co/400x300/F9E5C8/5a3e2b?text=Frankfurter", isAvailable: true },
      { id: "p4", name: "Italian Garlic Sausage 250g", category: "Sausages", price: 187, unit: "pack", inventory: 22, image: "https://placehold.co/400x300/E8D5B5/5a3e2b?text=Italian", isAvailable: true },
      { id: "p5", name: "Double Smoked Ham 250g", category: "Sausages", price: 213, unit: "pack", inventory: 15, image: "https://placehold.co/400x300/F5D0A9/5a3e2b?text=Ham", isAvailable: true },
      { id: "p6", name: "Salami Milano 150g", category: "Sausages", price: 205, unit: "pack", inventory: 12, image: "https://placehold.co/400x300/ECB88A/5a3e2b?text=Salami", isAvailable: true },
      { id: "p7", name: "Crabstick 1kg", category: "Sausages", price: 499, unit: "pack", inventory: 10, image: "https://placehold.co/400x300/FFB6C1/5a3e2b?text=Crabstick", isAvailable: true },
      { id: "p8", name: "Pepperoni 1kg", category: "Sausages", price: 896, unit: "pack", inventory: 8, image: "https://placehold.co/400x300/D2691E/white?text=Pepperoni", isAvailable: true },
      { id: "p9", name: "US Chuck Eye Roll", category: "Meats", price: 1245, unit: "kg", inventory: 12, image: "https://placehold.co/400x300/D9C2A7/white?text=Chuck", isAvailable: true },
      { id: "p10", name: "US Shortplate", category: "Meats", price: 877, unit: "kg", inventory: 10, image: "https://placehold.co/400x300/CCAA88/white?text=Shortplate", isAvailable: true },
      { id: "p11", name: "US Rib Eye", category: "Meats", price: 3366, unit: "kg", inventory: 6, image: "https://placehold.co/400x300/E6B8A2/white?text=Ribeye", isAvailable: true },
      { id: "p12", name: "US Brisket", category: "Meats", price: 1245, unit: "kg", inventory: 9, image: "https://placehold.co/400x300/C49A6C/white?text=Brisket", isAvailable: true },
      { id: "p13", name: "US Tenderloin", category: "Meats", price: 2459, unit: "kg", inventory: 5, image: "https://placehold.co/400x300/DD9988/white?text=Tenderloin", isAvailable: true },
      { id: "p14", name: "US Beef Hanging Tender", category: "Meats", price: 2155, unit: "kg", inventory: 7, image: "https://placehold.co/400x300/BB8866/white?text=Hanging", isAvailable: true },
      { id: "p15", name: "US Striploin", category: "Meats", price: 1595, unit: "kg", inventory: 8, image: "https://placehold.co/400x300/DDAA88/white?text=Striploin", isAvailable: true },
      { id: "p16", name: "Bacon (LOCAL)", category: "Meats", price: 800, unit: "kg", inventory: 14, image: "https://placehold.co/400x300/FFA07A/white?text=Bacon", isAvailable: true },
      { id: "p17", name: "Whole Salmon", category: "Seafood", price: 1028, unit: "kg", inventory: 6, image: "https://placehold.co/400x300/AEE2FF/white?text=Salmon", isAvailable: true },
      { id: "p18", name: "Salmon Fillet", category: "Seafood", price: 1595, unit: "kg", inventory: 8, image: "https://placehold.co/400x300/B0E0E6/white?text=Fillet", isAvailable: true },
      { id: "p19", name: "Shrimp (per kg)", category: "Seafood", price: 825, unit: "kg", inventory: 10, image: "https://placehold.co/400x300/FFCC99/white?text=Shrimp", isAvailable: true },
      { id: "p20", name: "French Fries", category: "Fries", price: 478, unit: "kg", inventory: 20, image: "https://placehold.co/400x300/FADB67/white?text=Fries", isAvailable: true },
    ];
  };

  return (
    <AppContext.Provider value={{
      products, setProducts,
      orders, setOrders,
      cart, setCart,
      adminMode, setAdminMode,
      loading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      placeOrder,
      updateProduct,
      deleteProduct,
      addProduct,
      toggleAvailability,
      updateInventory,
      fetchProducts,
      fetchOrders,
    }}>
      {children}
    </AppContext.Provider>
  );
};
