import { useApp } from "@/context/AppContext";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function OrdersPanel() {
  const { orders, markOrderReady } = useApp();

  if (orders.length === 0) return <p className="text-center text-muted-foreground py-6 text-sm">No orders yet</p>;

  return (
    <div className="space-y-3">
      <h3 className="font-heading text-lg font-bold text-foreground">📋 Orders</h3>
      {orders.map(o => (
        <div key={o.id} className="bg-card rounded-xl border border-border p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm text-card-foreground">{o.customer}</span>
            <span className="text-xs text-muted-foreground">{o.date}</span>
          </div>
          <p className="text-xs text-muted-foreground">{o.items.map(i => `${i.quantity}x ${i.name}`).join(", ")}</p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-bold">₱{o.total.toFixed(2)}</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                o.status === "Ready for pickup" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}>{o.status}</span>
              {o.status !== "Ready for pickup" && (
                <button
                  onClick={() => { markOrderReady(o.id); toast.success("Order updated"); }}
                  className="flex items-center gap-1 text-xs text-success hover:text-success/80 transition-colors"
                >
                  <CheckCircle size={14} /> Ready
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
