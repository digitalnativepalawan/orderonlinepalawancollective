import { Product, CartItem, Order, BusinessSettings } from "./types";
import { buildDefaultProducts } from "./defaultProducts";
import { supabase } from "@/integrations/supabase/client";

const CART_KEY = "jc_cart_v2";

// ---- Cart (stays in localStorage since it's per-session) ----
export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}
export function saveCart(c: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}

// ---- Products (Cloud) ----
function dbProductToApp(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    unit: row.unit,
    inventory: row.inventory,
    image: row.image,
    isAvailable: row.is_available,
  };
}

export async function loadProductsFromDb(): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error || !data || data.length === 0) {
    // Seed default products if empty
    const defaults = buildDefaultProducts();
    await seedProducts(defaults);
    return defaults;
  }
  return data.map(dbProductToApp);
}

async function seedProducts(products: Product[]) {
  const rows = products.map(p => ({
    name: p.name,
    category: p.category,
    price: p.price,
    unit: p.unit,
    inventory: p.inventory,
    image: p.image,
    is_available: p.isAvailable,
  }));
  await supabase.from("products").insert(rows);
}

export async function saveProductToDb(product: Product) {
  await supabase.from("products").upsert({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    inventory: product.inventory,
    image: product.image,
    is_available: product.isAvailable,
  });
}

export async function addProductToDb(product: Omit<Product, "id">): Promise<Product | null> {
  const { data, error } = await supabase.from("products").insert({
    name: product.name,
    category: product.category,
    price: product.price,
    unit: product.unit,
    inventory: product.inventory,
    image: product.image,
    is_available: product.isAvailable,
  }).select().single();
  if (error || !data) return null;
  return dbProductToApp(data);
}

export async function deleteProductFromDb(id: string) {
  await supabase.from("products").delete().eq("id", id);
}

// ---- Orders (Cloud) ----
function dbOrderToApp(row: any): Order {
  return {
    id: row.id,
    date: row.date,
    timestamp: row.timestamp,
    customer: row.customer,
    email: row.email,
    phone: row.phone,
    countryCode: row.country_code,
    deliveryType: row.delivery_type as "delivery" | "pickup",
    notes: row.notes,
    contact: row.contact,
    items: row.items as any,
    total: Number(row.total),
    status: row.status as any,
  };
}

export async function loadOrdersFromDb(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error || !data) return [];
  return data.map(dbOrderToApp);
}

export async function addOrderToDb(order: Order) {
  await supabase.from("orders").insert({
    id: order.id,
    date: order.date,
    timestamp: order.timestamp,
    customer: order.customer,
    email: order.email,
    phone: order.phone,
    country_code: order.countryCode,
    delivery_type: order.deliveryType,
    notes: order.notes,
    contact: order.contact,
    items: order.items as any,
    total: order.total,
    status: order.status,
  });
}

export async function updateOrderStatusInDb(id: string, status: string) {
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function deleteOrderFromDb(id: string) {
  await supabase.from("orders").delete().eq("id", id);
}

// ---- Business Settings (Cloud) ----
function dbBizToApp(row: any): BusinessSettings {
  return {
    businessName: row.business_name,
    phone: row.phone,
    email: row.email,
    facebook: row.facebook,
    instagram: row.instagram,
    address: row.address,
    logoBase64: row.logo_base64,
    whatsappTemplate: row.whatsapp_template,
    invoiceFooter: row.invoice_footer,
    taxRate: Number(row.tax_rate),
  };
}

export async function loadBusinessFromDb(): Promise<BusinessSettings> {
  const { data, error } = await supabase.from("business_settings").select("*").limit(1).single();
  if (error || !data) {
    return {
      businessName: "Jaycee's Pantry", phone: "09917093792", email: "jayceepantry@gmail.com",
      facebook: "Jaycee Trading And Services", instagram: "@jaycee.tradingservices",
      address: "For orders and inquiries", logoBase64: "",
      whatsappTemplate: "Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!",
      invoiceFooter: "Thank you for your order! For inquiries, contact us.", taxRate: 0,
    };
  }
  return dbBizToApp(data);
}

export async function saveBusinessToDb(b: BusinessSettings) {
  // Get existing row id
  const { data } = await supabase.from("business_settings").select("id").limit(1).single();
  if (data) {
    await supabase.from("business_settings").update({
      business_name: b.businessName,
      phone: b.phone,
      email: b.email,
      facebook: b.facebook,
      instagram: b.instagram,
      address: b.address,
      logo_base64: b.logoBase64,
      whatsapp_template: b.whatsappTemplate,
      invoice_footer: b.invoiceFooter,
      tax_rate: b.taxRate,
    }).eq("id", data.id);
  }
}

// ---- CSV Export/Import (kept for admin tools) ----
export function exportProductsCSV(products: Product[]): string {
  const headers = ["id", "name", "category", "price", "unit", "inventory", "isAvailable", "image"];
  const rows = products.map(p =>
    [p.id, p.name, p.category, p.price, p.unit, p.inventory, p.isAvailable, p.image]
      .map(c => `"${String(c).replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function importProductsCSV(text: string): Product[] | null {
  const rows = text.split("\n").map(r => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < r.length; i++) {
      if (r[i] === '"') { inQuotes = !inQuotes; }
      else if (r[i] === ',' && !inQuotes) { result.push(current); current = ""; }
      else { current += r[i]; }
    }
    result.push(current);
    return result;
  });
  if (rows.length < 2) return null;
  const h = rows[0];
  const idx = (name: string) => h.indexOf(name);
  const products: Product[] = [];
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const name = r[idx("name")]?.trim();
    if (!name) continue;
    products.push({
      id: r[idx("id")] || `p${Date.now()}_${i}`,
      name,
      category: r[idx("category")] || "Others",
      price: parseFloat(r[idx("price")]) || 0,
      unit: r[idx("unit")] || "pc",
      inventory: parseInt(r[idx("inventory")]) || 0,
      image: r[idx("image")] || `https://placehold.co/400x300/E8DCC8/6B5B3E?text=${encodeURIComponent(name.slice(0, 14))}`,
      isAvailable: r[idx("isAvailable")]?.toLowerCase() !== "false",
    });
  }
  return products.length > 0 ? products : null;
}
