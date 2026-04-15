import { useApp } from "@/context/AppContext";
import { Product, CATEGORY_ICONS } from "@/lib/types";
import { ShoppingCart, Edit, Trash2, AlertTriangle, Package } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onEdit?: (p: Product) => void;
}

export default function ProductCard({ product, onEdit }: ProductCardProps) {
  const { adminMode, addToCart, toggleAvailability, deleteProduct, updateInventory } = useApp();
  const lowStock = product.inventory <= 3 && product.inventory > 0;

  const handleAddToCart = () => {
    if (product.inventory <= 0 || !product.isAvailable) {
      toast.error("Not available");
      return;
    }
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleDelete = () => {
    if (confirm("Delete this product?")) {
      deleteProduct(product.id);
      toast.success("Deleted");
    }
  };

  const handleInvEdit = () => {
    const val = prompt("New inventory:", String(product.inventory));
    if (val && !isNaN(parseInt(val))) {
      updateInventory(product.id, parseInt(val));
      toast.success("Inventory updated");
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
        adminMode && !product.isAvailable ? "opacity-60" : ""
      }`}
    >
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://placehold.co/400x300/E8DCC8/6B5B3E?text=${encodeURIComponent(product.name.slice(0, 14))}`;
          }}
        />
        <span className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm text-xs px-2 py-1 rounded-full font-medium text-card-foreground">
          {CATEGORY_ICONS[product.category] || "📦"} {product.category}
        </span>
        {product.inventory > 0 ? (
          <span className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded-full font-semibold ${
            lowStock ? "bg-warning text-warning-foreground" : "bg-success/90 text-success-foreground"
          }`}>
            {lowStock ? `Only ${product.inventory} left` : `${product.inventory} in stock`}
          </span>
        ) : (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-[10px] px-2 py-0.5 rounded-full font-semibold">
            Out of stock
          </span>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-semibold text-sm text-card-foreground leading-tight mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-primary font-bold text-lg">₱{product.price.toFixed(2)}<span className="text-muted-foreground text-xs font-normal">/{product.unit}</span></p>

        {adminMode ? (
          <div className="mt-3 space-y-2">
            {lowStock && (
              <div className="flex items-center gap-1.5 text-warning text-xs font-medium">
                <AlertTriangle size={12} /> Low stock alert
              </div>
            )}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={product.isAvailable}
                    onChange={() => {
                      toggleAvailability(product.id);
                      toast.success(product.isAvailable ? "Marked unavailable" : "Marked available");
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-muted rounded-full peer-checked:bg-success transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-card rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
                </div>
                <span className="text-muted-foreground">Available</span>
              </label>
              <button onClick={handleInvEdit} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Package size={12} /> {product.inventory}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onEdit?.(product)} className="flex-1 flex items-center justify-center gap-1.5 text-xs py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors font-medium">
                <Edit size={13} /> Edit
              </button>
              <button onClick={handleDelete} className="flex items-center justify-center gap-1.5 text-xs py-2 px-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors font-medium">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.inventory <= 0 || !product.isAvailable}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={15} /> Add to cart
          </button>
        )}
      </div>
    </motion.div>
  );
}
