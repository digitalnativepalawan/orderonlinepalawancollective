import { Order, BusinessSettings } from "@/lib/types";
import { X, Printer } from "lucide-react";

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  business: BusinessSettings;
}

export default function InvoiceModal({ open, onClose, order, business }: InvoiceModalProps) {
  if (!open || !order) return null;

  const subtotal = order.total;
  const tax = business.taxRate > 0 ? subtotal * (business.taxRate / 100) : 0;
  const grandTotal = subtotal + tax;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html><head><title>Invoice ${order.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', -apple-system, sans-serif; }
        body { padding: 40px; color: #1a1a1a; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #e5e7eb; padding-bottom: 24px; }
        .logo { max-height: 60px; object-fit: contain; }
        .biz-name { font-size: 24px; font-weight: 700; }
        .biz-detail { font-size: 12px; color: #6b7280; }
        .invoice-title { font-size: 28px; font-weight: 700; color: #374151; text-align: right; }
        .invoice-id { font-size: 14px; color: #6b7280; text-align: right; }
        .section { margin-bottom: 24px; }
        .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #9ca3af; margin-bottom: 8px; }
        .info { font-size: 14px; line-height: 1.6; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        th { background: #f3f4f6; padding: 10px 12px; text-align: left; font-size: 12px; font-weight: 600; text-transform: uppercase; color: #6b7280; }
        td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
        .text-right { text-align: right; }
        .totals { margin-left: auto; width: 280px; }
        .total-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .total-row.grand { font-size: 18px; font-weight: 700; border-top: 2px solid #1a1a1a; padding-top: 12px; margin-top: 8px; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <div>
          ${business.logoBase64 ? `<img src="${business.logoBase64}" class="logo" alt="Logo" />` : ""}
          <div class="biz-name">${business.businessName}</div>
          <div class="biz-detail">${business.address}</div>
          <div class="biz-detail">${business.phone} | ${business.email}</div>
        </div>
        <div>
          <div class="invoice-title">INVOICE</div>
          <div class="invoice-id">${order.id}</div>
          <div class="invoice-id">${new Date(order.timestamp).toLocaleString()}</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">Bill To</div>
        <div class="info">
          <strong>${order.customer}</strong><br/>
          ${order.email}<br/>
          ${order.countryCode}${order.phone}<br/>
          ${order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}
          ${order.notes ? `<br/><em>Notes: ${order.notes}</em>` : ""}
        </div>
      </div>
      <table>
        <thead><tr><th>Item</th><th>Unit</th><th class="text-right">Price</th><th class="text-right">Qty</th><th class="text-right">Total</th></tr></thead>
        <tbody>
          ${order.items.map(i => `<tr><td>${i.name}</td><td>${i.unit}</td><td class="text-right">₱${i.price.toFixed(2)}</td><td class="text-right">${i.quantity}</td><td class="text-right">₱${(i.price * i.quantity).toFixed(2)}</td></tr>`).join("")}
        </tbody>
      </table>
      <div class="totals">
        <div class="total-row"><span>Subtotal</span><span>₱${subtotal.toFixed(2)}</span></div>
        ${tax > 0 ? `<div class="total-row"><span>Tax (${business.taxRate}%)</span><span>₱${tax.toFixed(2)}</span></div>` : ""}
        <div class="total-row grand"><span>Total</span><span>₱${grandTotal.toFixed(2)}</span></div>
      </div>
      <div class="footer">${business.invoiceFooter || "Thank you for your order!"}</div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 300);
  };

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-card w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-card-foreground">Invoice</h2>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground" title="Print / Download">
              <Printer size={18} />
            </button>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              {business.logoBase64 && <img src={business.logoBase64} alt="Logo" className="h-10 object-contain mb-2" />}
              <p className="font-heading font-bold text-card-foreground">{business.businessName}</p>
              <p className="text-xs text-muted-foreground">{business.address}</p>
              <p className="text-xs text-muted-foreground">{business.phone} | {business.email}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Invoice</p>
              <p className="text-sm font-semibold text-card-foreground">{order.id}</p>
              <p className="text-xs text-muted-foreground">{new Date(order.timestamp).toLocaleString()}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Bill To</p>
            <p className="text-sm font-medium text-card-foreground">{order.customer}</p>
            <p className="text-xs text-muted-foreground">{order.email}</p>
            <p className="text-xs text-muted-foreground">{order.countryCode}{order.phone}</p>
            <p className="text-xs text-muted-foreground">{order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}</p>
            {order.notes && <p className="text-xs text-muted-foreground italic mt-1">Notes: {order.notes}</p>}
          </div>

          {/* Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Item</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Price</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Qty</th>
                  <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 text-card-foreground">{item.name}</td>
                    <td className="py-2 text-right text-muted-foreground">₱{item.price.toFixed(2)}</td>
                    <td className="py-2 text-right text-muted-foreground">{item.quantity}</td>
                    <td className="py-2 text-right font-medium text-card-foreground">₱{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-1 pt-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-card-foreground">₱{subtotal.toFixed(2)}</span>
            </div>
            {tax > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax ({business.taxRate}%)</span>
                <span className="text-card-foreground">₱{tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
              <span className="text-card-foreground">Total</span>
              <span className="text-primary">₱{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {business.invoiceFooter && (
            <p className="text-xs text-muted-foreground text-center pt-2">{business.invoiceFooter}</p>
          )}
        </div>
      </div>
    </div>
  );
}
