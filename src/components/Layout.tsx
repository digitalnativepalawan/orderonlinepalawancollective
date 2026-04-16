import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cart, updateCartQuantity, removeFromCart, clearCart, placeOrder } = useApp();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_type: 'pickup',
    address: ''
  });

  const total = cart.reduce((sum, item) => {
    const price = item?.price || 0;
    const quantity = item?.quantity || 0;
    return sum + (price * quantity);
  }, 0);

  const handleCheckout = async () => {
    if (!customerInfo.customer_name || !customerInfo.customer_phone) {
      alert("Please enter your name and phone number");
      return;
    }

    setIsCheckingOut(true);
    try {
      await placeOrder({
        ...customerInfo,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit
        })),
        total: total
      });
      onClose();
      setCustomerInfo({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        delivery_type: 'pickup',
        address: ''
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-50"
          onClick={onClose}
        />
      )}
      
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Your cart is empty
            </div>
          ) : (
            cart.map((item, idx) => {
              const itemTotal = (item?.price || 0) * (item?.quantity || 0);
              return (
                <div key={idx} className="flex gap-3 border-b pb-3 dark:border-gray-700">
                  <img 
                    src={item?.image || 'https://placehold.co/400x300/DDDDDD/555?text=Product'} 
                    alt={item?.name || 'Product'} 
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-semibold dark:text-white">{item?.name || 'Unknown Product'}</p>
                    <p className="text-sm text-muted-foreground">₱{(item?.price || 0).toFixed(2)} / {item?.unit || 'pc'}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateCartQuantity(item.id, (item?.quantity || 1) - 1)}
                        className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center">{item?.quantity || 0}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, (item?.quantity || 0) + 1)}
                        className="p-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 ml-auto"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  <div className="font-bold dark:text-white">
                    ₱{itemTotal.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-4 border-t dark:border-gray-700 space-y-3">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input
                type="text"
                value={customerInfo.customer_name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, customer_name: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone *</label>
              <input
                type="tel"
                value={customerInfo.customer_phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, customer_phone: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="Your phone number"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={customerInfo.customer_email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, customer_email: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Type</label>
              <select
                value={customerInfo.delivery_type}
                onChange={(e) => setCustomerInfo({ ...customerInfo, delivery_type: e.target.value })}
                className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              >
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            {customerInfo.delivery_type === 'delivery' && (
              <div>
                <label className="text-sm font-medium">Delivery Address</label>
                <textarea
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                  rows={2}
                  placeholder="Your delivery address"
                />
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total:</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearCart} className="flex-1">
                Clear Cart
              </Button>
              <Button onClick={handleCheckout} disabled={isCheckingOut} className="flex-1">
                {isCheckingOut ? 'Placing Order...' : 'Place Order'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
