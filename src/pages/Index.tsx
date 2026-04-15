import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Product, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import CartSidebar from "@/components/CartSidebar";
import ProductModal from "@/components/ProductModal";
import BusinessModal from "@/components/BusinessModal";
import AdminLoginModal from "@/components/AdminLoginModal";
import AdminBar from "@/components/AdminBar";
import OrdersPanel from "@/components/OrdersPanel";
import Footer from "@/components/Footer";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence } from "framer-motion";

export default function Index() {
  const { products, adminMode, setAdminMode, business, setBusiness, updateProduct, addProduct } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [businessModalOpen, setBusinessModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    let list = adminMode ? products : products.filter(p => p.isAvailable && p.inventory > 0);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "all") list = list.filter(p => p.category === category);
    return list;
  }, [products, adminMode, search, category]);

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductModalOpen(true);
  };

  const handleSaveProduct = (data: Omit<Product, "id"> & { id?: string }) => {
    if (data.id) {
      updateProduct({ ...data, id: data.id } as Product);
    } else {
      addProduct(data);
    }
    toast.success("Saved");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onOpenCart={() => setCartOpen(true)} onOpenAdmin={() => setAdminLoginOpen(true)} />

      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 space-y-5">
        {/* Search & Filter */}
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

        {/* Admin Bar */}
        {adminMode && (
          <AdminBar
            onAddProduct={() => { setEditingProduct(null); setProductModalOpen(true); }}
            onOpenSettings={() => setBusinessModalOpen(true)}
          />
        )}

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-sm">No items found 🍽️</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map(p => (
                <ProductCard key={p.id} product={p} onEdit={handleEditProduct} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Admin Orders */}
        {adminMode && <OrdersPanel />}
      </main>

      <Footer />

      {/* Modals & Sidebars */}
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <AdminLoginModal open={adminLoginOpen} onClose={() => setAdminLoginOpen(false)} onLogin={() => setAdminMode(true)} />
      <ProductModal open={productModalOpen} onClose={() => { setProductModalOpen(false); setEditingProduct(null); }} product={editingProduct} onSave={handleSaveProduct} />
      <BusinessModal open={businessModalOpen} onClose={() => setBusinessModalOpen(false)} settings={business} onSave={setBusiness} />
    </div>
  );
}
