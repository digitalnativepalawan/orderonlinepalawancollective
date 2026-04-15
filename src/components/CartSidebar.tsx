import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cart, cartTotal, updateCartQty, removeFromCart, checkout, products } = useApp();
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const handleCheckout = () => {
    if (cart.length === 0) { toast.error("Cart is empty"); return; }
    const orderId = checkout(name, contact);
    if (orderId) {
      toast.success(`Order #${orderId} placed!`);
      setCheckoutMode(false);
      setName("");
      setContact("");
      onClose();
    }
  };

  const handleQtyUp = (id: string) => {
    const ci = cart.find(i => i.id === id);
    const prod = products.find(p => p.id === id);
    if (ci && prod && ci.quantity >= prod.inventory) {
      toast.error("Stock limit reached");
      return;
    }
    updateCartQty(id, 1);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-card border-l border-border z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading text-lg font-bold text-card-foreground flex items-center gap-2">
                <ShoppingBag size={20} /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <p className="text-center text-muted-foreground py-12">Your cart is empty</p>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-3 bg-secondary/50 rounded-lg p-3">
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-card-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">₱{item.price.toFixed(2)}/{item.unit}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold text-card-foreground w-6 text-center">{item.quantity}</span>
                        <button onClick={() => handleQtyUp(item.id)} className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-border transition-colors">
                          <Plus size={12} />
                        </button>
                        <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-primary whitespace-nowrap">₱{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-card-foreground">Total</span>
                  <span className="text-xl font-bold text-primary">₱{cartTotal.toFixed(2)}</span>
                </div>
                {checkoutMode ? (
                  <div className="space-y-2">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                    <input value={contact} onChange={e => setContact(e.target.value)} placeholder="Phone or email" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                    <div className="flex gap-2">
                      <button onClick={() => setCheckoutMode(false)} className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">Cancel</button>
                      <button onClick={handleCheckout} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Place Order</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setCheckoutMode(true)} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                    Checkout
                  </button>
                )}
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
