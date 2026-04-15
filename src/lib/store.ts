import { Product, CartItem, Order, BusinessSettings } from "./types";
import { buildDefaultProducts } from "./defaultProducts";

const KEYS = {
  PRODUCTS: "jc_products_v2",
  ORDERS: "jc_orders_v2",
  CART: "jc_cart_v2",
  BUSINESS: "jc_business_v2",
};

const DEFAULT_BUSINESS: BusinessSettings = {
  businessName: "Jaycee's Pantry",
  phone: "09917093792",
  email: "jayceepantry@gmail.com",
  facebook: "Jaycee Trading And Services",
  instagram: "@jaycee.tradingservices",
  address: "For orders and inquiries",
  logoBase64: "",
  whatsappTemplate: "Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!",
  invoiceFooter: "Thank you for your order! For inquiries, contact us.",
  taxRate: 0,
};

function load<T>(key: string, fallback: () => T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {}
  return fallback();
}

function save(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadProducts(): Product[] {
  return load(KEYS.PRODUCTS, buildDefaultProducts);
}
export function saveProducts(p: Product[]) { save(KEYS.PRODUCTS, p); }

export function loadCart(): CartItem[] {
  return load(KEYS.CART, () => []);
}
export function saveCart(c: CartItem[]) { save(KEYS.CART, c); }

export function loadOrders(): Order[] {
  return load(KEYS.ORDERS, () => []);
}
export function saveOrders(o: Order[]) { save(KEYS.ORDERS, o); }

export function loadBusiness(): BusinessSettings {
  return load(KEYS.BUSINESS, () => ({ ...DEFAULT_BUSINESS }));
}
export function saveBusiness(b: BusinessSettings) { save(KEYS.BUSINESS, b); }

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
