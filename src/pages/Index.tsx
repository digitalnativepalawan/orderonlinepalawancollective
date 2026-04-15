import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Product, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";
import { Loader2, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { AnimatePresence } from "framer-motion";

export default function Index() {
  const { products, loading } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  // Debug: Log products to console
  useMemo(() => {
    console.log("📦 Total products:", products.length);
    console.log("📦 Available products:", products.filter(p => p.isAvailable).length);
    console.log("📦 In stock products:", products.filter(p => p.inventory > 0).length);
    console.log("📦 First 5 products:", products.slice(0, 5));
  }, [products]);

  const filtered = useMemo(() => {
    let list = products;  // ✅ Show ALL products (removed isAvailable && inventory filter)
    
    if (search) {
      list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (category !== "all") {
      list = list.filter(p => p.category === category);
    }
    
    return list;
  }, [products, search, category]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-6 space-y-5">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
        >
          <option value="all">📋 All categories</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{CATEGORY_ICONS[c] || "📦"} {c}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No items found 📭</p>
          <p className="text-sm text-muted-foreground">
            Products loaded: {products.length} | Filtered: {filtered.length}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
