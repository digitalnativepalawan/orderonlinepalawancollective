import { createClient } from "@supabase/supabase-js";
import { Product, Order, BusinessSettings, CartItem } from "./types";

// Supabase Configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase URL:", supabaseUrl ? "✅ Set" : "❌ Missing");
console.log("Supabase Key:", supabaseAnonKey ? "✅ Set" : "❌ Missing");

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found. Using localStorage fallback.");
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// ============================================
// PRODUCTS
// ============================================

const PRODUCTS_KEY = "jaycee_products";

export async function loadProductsFromDb(): Promise<Product[]> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Supabase error loading products:", error);
      } else if (data && data.length > 0) {
        console.log("✅ Loaded", data.length, "products from Supabase");
        return data as Product[];
      } else {
        console.warn("⚠️ Supabase returned empty products");
      }
    } catch (err) {
      console.error("Supabase connection failed:", err);
    }
  }
  
  // Fallback to localStorage (RECOVERY)
  console.warn("🔄 Falling back to localStorage for products");
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      const localProducts = JSON.parse(saved);
      console.log("✅ Recovered", localProducts.length, "products from localStorage");
      return localProducts;
    }
  } catch (err) {
    console.error("localStorage fallback failed:", err);
  }
  
  return [];
}

export async function saveProductToDb(product: Product): Promise<void> {
  // Save to Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: product.name,
          category: product.category,
          price: product.price,
          cost: product.cost || (product.price * 0.80),
          unit: product.unit,
          inventory: product.inventory,
          isAvailable: product.isAvailable,
          description: product.description || "",
          image: product.imageBase64 || product.image || "",
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);
      
      if (error) console.error("Error saving product:", error);
      else console.log("✅ Product saved to Supabase:", product.name);
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  }
  
  // ALSO save to localStorage as backup
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    const products = saved ? JSON.parse(saved) : [];
    const index = products.findIndex((p: Product) => p.id === product.id);
    if (index >= 0) {
      products[index] = product;
    } else {
      products.push(product);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    console.log("✅ Product backed up to localStorage");
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

export async function addProductToDb(product: Omit<Product, "id">): Promise<Product | null> {
  if (!supabase) {
    console.warn("⚠️ No Supabase connection, creating local product");
    // Create product with local ID if no Supabase
    const localProduct: Product = {
      ...product,
      id: `local_${Date.now()}`,
      cost: product.cost || (product.price * 0.80),
    } as Product;
    
    // Save to localStorage
    try {
      const saved = localStorage.getItem(PRODUCTS_KEY);
      const products = saved ? JSON.parse(saved) : [];
      products.push(localProduct);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      return localProduct;
    } catch (err) {
      console.error("Failed to save local product:", err);
      return null;
    }
  }
  
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: product.name,
        category: product.category,
        price: product.price,
        cost: product.cost || (product.price * 0.80),
        unit: product.unit,
        inventory: product.inventory,
        isAvailable: product.isAvailable,
        description: product.description || "",
        image: product.imageBase64 || product.image || "",
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Error adding product:", error);
      return null;
    }
    
    console.log("✅ Product added to Supabase:", data.name);
    return data as Product;
  } catch (err) {
    console.error("Failed to add product:", err);
    return null;
  }
}

export async function deleteProductFromDb(id: string): Promise<void> {
  // Delete from Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);
      
      if (error) console.error("Error deleting product:", error);
      else console.log("✅ Product deleted from Supabase");
    } catch (err) {
      console.error("Failed to delete product:", err);
    }
  }
  
  // Also delete from localStorage backup
  try {
    const saved = localStorage.getItem(PRODUCTS_KEY);
    if (saved) {
      const products = JSON.parse(saved);
      const filtered = products.filter((p: Product) => p.id !== id);
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error("Failed to delete from localStorage:", err);
  }
}

// ============================================
// CART (LocalStorage Only)
// ============================================

const CART_KEY = "jaycee_cart";

export function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
}

// ============================================
// ORDERS
// ============================================

const ORDERS_KEY = "jaycee_orders";

export async function loadOrdersFromDb(): Promise<Order[]> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("timestamp", { ascending: false });
      
      if (!error && data && data.length > 0) {
        console.log("✅ Loaded", data.length, "orders from Supabase");
        return data as Order[];
      }
    } catch (err) {
      console.error("Failed to load orders from Supabase:", err);
    }
  }
  
  // Fallback to localStorage
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      const localOrders = JSON.parse(saved);
      console.log("✅ Recovered", localOrders.length, "orders from localStorage");
      return localOrders;
    }
  } catch (err) {
    console.error("localStorage orders fallback failed:", err);
  }
  
  return [];
}

export async function addOrderToDb(order: Order): Promise<void> {
  // Save to Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .insert([{
          id: order.id,
          date: order.date,
          timestamp: order.timestamp,
          customer: order.customer,
          email: order.email || "",
          phone: order.phone || "",
          countryCode: order.countryCode || "",
          deliveryType: order.deliveryType,
          notes: order.notes || "",
          contact: order.contact || "",
          items: order.items,
          total: order.total,
          totalCost: order.totalCost || 0,
          profit: order.profit || 0,
          status: order.status,
        }]);
      
      if (error) console.error("Error adding order:", error);
      else console.log("✅ Order saved to Supabase:", order.id);
    } catch (err) {
      console.error("Failed to add order:", err);
    }
  }
  
  // ALSO save to localStorage as backup
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    const orders = saved ? JSON.parse(saved) : [];
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error("Failed to save order to localStorage:", err);
  }
}

export async function updateOrderStatusInDb(id: string, status: string): Promise<void> {
  // Update in Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      
      if (error) console.error("Error updating order status:", error);
      else console.log("✅ Order status updated in Supabase:", id);
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  }
  
  // Also update in localStorage backup
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      const orders = JSON.parse(saved);
      const updated = orders.map((o: Order) => o.id === id ? { ...o, status } : o);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    }
  } catch (err) {
    console.error("Failed to update order in localStorage:", err);
  }
}

// ============================================
// BUSINESS SETTINGS
// ============================================

const BUSINESS_KEY = "jaycee_business";

export async function loadBusinessFromDb(): Promise<BusinessSettings> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("business_settings")
        .select("*")
        .limit(1)
        .single();
      
      if (!error && data) {
        console.log("✅ Loaded business settings from Supabase");
        return data as BusinessSettings;
      }
    } catch (err) {
      console.error("Failed to load business from Supabase:", err);
    }
  }
  
  // Fallback to localStorage
  try {
    const saved = localStorage.getItem(BUSINESS_KEY);
    if (saved) {
      console.log("✅ Loaded business settings from localStorage");
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error("localStorage business fallback failed:", err);
  }
  
  // Default settings
  return {
    businessName: "JayCee Trading & Services",
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    address: "",
    logoBase64: "",
    whatsappTemplate: "",
    invoiceFooter: "",
    taxRate: 0,
  };
}

export async function saveBusinessToDb(settings: BusinessSettings): Promise<void> {
  // Save to Supabase
  if (supabase) {
    try {
      const { data: existing } = await supabase
        .from("business_settings")
        .select("id")
        .limit(1)
        .single();
      
      if (existing) {
        const { error } = await supabase
          .from("business_settings")
          .update({
            businessName: settings.businessName,
            phone: settings.phone,
            email: settings.email,
            facebook: settings.facebook,
            instagram: settings.instagram,
            address: settings.address,
            logoBase64: settings.logoBase64,
            whatsappTemplate: settings.whatsappTemplate,
            invoiceFooter: settings.invoiceFooter,
            taxRate: settings.taxRate,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        
        if (error) console.error("Error saving business:", error);
      } else {
        const { error } = await supabase
          .from("business_settings")
          .insert([{
            businessName: settings.businessName,
            phone: settings.phone,
            email: settings.email,
            facebook: settings.facebook,
            instagram: settings.instagram,
            address: settings.address,
            logoBase64: settings.logoBase64,
            whatsappTemplate: settings.whatsappTemplate,
            invoiceFooter: settings.invoiceFooter,
            taxRate: settings.taxRate,
          }]);
        
        if (error) console.error("Error saving business:", error);
      }
      console.log("✅ Business settings saved to Supabase");
    } catch (err) {
      console.error("Failed to save business to Supabase:", err);
    }
  }
  
  // ALSO save to localStorage as backup
  try {
    localStorage.setItem(BUSINESS_KEY, JSON.stringify(settings));
    console.log("✅ Business settings backed up to localStorage");
  } catch (err) {
    console.error("Failed to save business to localStorage:", err);
  }
}

// ============================================
// CSV EXPORT/IMPORT
// ============================================

export function exportProductsCSV(products: Product[]): string {
  const headers = ["id", "name", "category", "price", "cost", "unit", "inventory", "isAvailable", "description", "image"];
  
  const rows = products.map(p => [
    p.id,
    `"${p.name.replace(/"/g, '""')}"`,
    p.category,
    p.price.toFixed(2),
    (p.cost || 0).toFixed(2),
    p.unit,
    p.inventory,
    p.isAvailable,
    `"${(p.description || '').replace(/"/g, '""')}"`,
    p.image || p.imageBase64 || ''
  ].join(","));

  return [headers.join(","), ...rows].join("\n");
}

export function importProductsCSV(csvText: string): Product[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
  
  const idx: Record<string, number> = {
    id: headers.indexOf("id"),
    name: headers.indexOf("name"),
    category: headers.indexOf("category"),
    price: headers.indexOf("price"),
    cost: headers.indexOf("cost"),
    unit: headers.indexOf("unit"),
    inventory: headers.indexOf("inventory"),
    isAvailable: headers.indexOf("isavailable"),
    description: headers.indexOf("description"),
    image: headers.indexOf("image"),
  };

  const products: Product[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    
    const price = parseFloat(values[idx.price]) || 0;
    const costValue = parseFloat(values[idx.cost]) || 0;
    const cost = costValue > 0 ? costValue : price * 0.80;

    products.push({
      id: values[idx.id] || `prod_${Date.now()}_${i}`,
      name: values[idx.name]?.replace(/^"|"$/g, '') || "Unknown",
      category: values[idx.category] || "Meats",
      price: price,
      cost: cost,
      unit: values[idx.unit] || "kg",
      inventory: parseInt(values[idx.inventory]) || 0,
      isAvailable: values[idx.isAvailable] !== "false",
      description: values[idx.description]?.replace(/^"|"$/g, '') || "",
      image: values[idx.image] || "",
    });
  }

  return products;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}
