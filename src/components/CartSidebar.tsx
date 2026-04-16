import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import { toast } from "sonner";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder, products } = useApp();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [showForm, setShowForm] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, delta: number) => {
    const item = cart.find(i => i.id === id);
    const product = products.find(p => p.id === id);
    if (item && product) {
      const newQty = item.quantity + delta;
      if (newQty < 1) {
        removeFromCart(id);
      } else if (newQty <= product.inventory) {
        updateCartQuantity(id, newQty);
      } else {
        toast.error("Stock limit reached");
      }
    }
  };

  const handleCheckout = async () => {
    if (!customerName || !customerPhone) {
      toast.error("Please enter your name and phone number");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    await placeOrder({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: "",
      delivery_type: "pickup",
      address: "",
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit
      })),
      total: cartTotal
    });
    
    toast.success("Order placed!");
    setShowForm(false);
    setCustomerName("");
    setCustomerPhone("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 py-12">Your cart is empty</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <img 
                  src={item.image || "/placeholder.svg"} 
                  alt={item.name} 
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0" 
                  onError={e => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} 
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">₱{item.price.toFixed(2)}/{item.unit}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => handleQuantityChange(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Minus size={12} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)} className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Plus size={12} />
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold text-emerald-600 whitespace-nowrap">₱{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t space-y-3">
            {!showForm ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold text-emerald-600">₱{cartTotal.toFixed(2)}</span>
                </div>
                <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                  Checkout
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Your name *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800"
                />
                <input
                  type="tel"
                  placeholder="Phone number *"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800"
                />
                <div className="flex gap-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg border border-gray-300">
                    Back
                  </button>
                  <button onClick={handleCheckout} className="flex-1 py-2 rounded-lg bg-emerald-600 text-white">
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
