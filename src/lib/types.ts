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

export interface Order {
  id: string;
  date: string;
  customer: string;
  contact: string;
  items: { name: string; quantity: number; price: number; unit: string }[];
  total: number;
  status: string;
}

export interface BusinessSettings {
  businessName: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  address: string;
  logoBase64: string;
}

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
