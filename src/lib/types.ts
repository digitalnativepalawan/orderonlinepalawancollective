export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  inventory: number;
  image: string;
  isAvailable: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  quantity: number;
}

export type OrderStatus = "Pending" | "Confirmed" | "Preparing" | "Ready" | "Completed";

export interface Order {
  id: string;
  date: string;
  timestamp: string;
  customer: string;
  email: string;
  phone: string;
  countryCode: string;
  deliveryType: "delivery" | "pickup";
  notes: string;
  contact: string;
  items: { name: string; quantity: number; price: number; unit: string }[];
  total: number;
  status: OrderStatus;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  address: string;
  logoBase64: string;
  whatsappTemplate: string;
  invoiceFooter: string;
  taxRate: number;
}

export interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  deliveryType: "delivery" | "pickup";
  notes: string;
}

export const ORDER_STATUSES: OrderStatus[] = ["Pending", "Confirmed", "Preparing", "Ready", "Completed"];

export const CATEGORIES = [
  "Sausages", "Meats", "Seafood", "Dairy's", "Pampangga's Best",
  "Butter", "Syrup", "Baking", "Fries"
] as const;

export const CATEGORY_ICONS: Record<string, string> = {
  "Sausages": "🌭",
  "Meats": "🥩",
  "Seafood": "🐟",
  "Dairy's": "🧀",
  "Pampangga's Best": "🍖",
  "Butter": "🧈",
  "Syrup": "🍯",
  "Baking": "🍰",
  "Fries": "🍟",
};

export const COUNTRY_CODES = [
  { code: "+63", label: "🇵🇭 +63", country: "PH" },
  { code: "+1", label: "🇺🇸 +1", country: "US" },
  { code: "+44", label: "🇬🇧 +44", country: "UK" },
  { code: "+61", label: "🇦🇺 +61", country: "AU" },
  { code: "+81", label: "🇯🇵 +81", country: "JP" },
  { code: "+82", label: "🇰🇷 +82", country: "KR" },
  { code: "+65", label: "🇸🇬 +65", country: "SG" },
  { code: "+60", label: "🇲🇾 +60", country: "MY" },
  { code: "+66", label: "🇹🇭 +66", country: "TH" },
  { code: "+971", label: "🇦🇪 +971", country: "AE" },
];
