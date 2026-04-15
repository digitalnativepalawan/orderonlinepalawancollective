import { useState, useMemo, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { Order, OrderStatus, ORDER_STATUSES, Product, CATEGORIES, CATEGORY_ICONS } from "@/lib/types";
import { exportProductsCSV, importProductsCSV } from "@/lib/store";
import { toast } from "sonner";
import {
  Package, ClipboardList, Settings, BarChart3, LogOut, Search,
  Plus, Download, Upload, AlertTriangle, MessageCircle,
  FileText, ChevronDown, TrendingUp, ShoppingBag, Calculator, DollarSign
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import BusinessModal from "./BusinessModal";
import InvoiceModal from "./InvoiceModal";
import { AnimatePresence } from "framer-motion";

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: "bg-warning/10 text-warning",
  Confirmed: "bg-blue-500/10 text-blue-500",
  Preparing: "bg-orange-500/10 text-orange-500",
  Ready: "bg-success/10 text-success",
  Completed: "bg-muted text-muted-foreground",
};

export default function AdminDashboard() {
  const {
    products, orders, business, setBusiness,
    setProducts, updateProduct, addProduct, deleteProduct,
    updateOrderStatus, setAdminMode,
  } = useApp();

  const navigate = useNavigate();

  const [tab, setTab] = useState<"orders" | "products" | "settings" | "analytics">("orders");
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCategory, setProductCategory] = useState("all");
  const csvRef = useRef<HTMLInputElement>(null);

  const handleExitAdmin = () => {
    setAdminMode(false);
    navigate("/");
  };

  // Orders filtering
  const filteredOrders = useMemo(() => {
    let list = [...orders];
    if (orderStatusFilter !== "all") list = list.filter(o => o.status === orderStatusFilter);
    if (orderSearch) {
      const s = orderSearch.toLowerCase();
      list = list.filter(o =>
        o.customer.toLowerCase().includes(s) ||
        o.id.toLowerCase().includes(s) ||
        o.email?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [orders, orderStatusFilter, orderSearch]);

  // Products filtering
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (productSearch) list = list.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()));
    if (productCategory !== "all") list = list.filter(p => p.category === productCategory);
    return list;
  }, [products, productSearch, productCategory]);

  // 🆕 Enhanced Analytics with Profit Tracking
  const analytics = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayOrders = orders.filter(o => o.timestamp?.slice(0, 10) === todayStr);
    const weekOrders = orders.filter(o => o.timestamp && new Date(o.timestamp) >= weekAgo);

    const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
    const weekRevenue = weekOrders.reduce((s, o) => s + o.total, 0);

    // Calculate costs and profits
    const todayCost = todayOrders.reduce((s, o) => {
      return s + o.items.reduce((itemSum, item) => {
        const product = products.find(p => p.name === item.name);
        return itemSum + ((product?.cost || 0) * item.quantity);
      }, 0);
    }, 0);

    const weekCost = weekOrders.reduce((s, o) => {
      return s + o.items.reduce((itemSum, item) => {
        const product = products.find(p => p.name === item.name);
        return itemSum + ((product?.cost || 0) * item.quantity);
      }, 0);
    }, 0);

    const todayProfit = todayRevenue - todayCost;
    const weekProfit = weekRevenue - weekCost;

    // Low stock alerts
    const lowStock = products.filter(p => p.inventory <= 3 && p.inventory > 0);

    // Low margin alerts
    const lowMarginProducts = products
      .filter(p => p.price > 0 && ((p.price - (p.cost || 0)) / p.price * 100) < 15)
      .map(p => ({
        ...p,
        margin: ((p.price - (p.cost || 0)) / p.price * 100)
      }))
      .sort((a, b) => a.margin - b.margin)
      .slice(0, 5);

    // Item sales with profit
    const itemSales: Record<string, { quantity: number; profit: number }> = {};
    orders.forEach(o => o.items.forEach(i => {
      const product = products.find(p => p.name === i.name);
      const cost = product?.cost || 0;
      const profit = (i.price - cost) * i.quantity;
      if (!itemSales[i.name]) {
        itemSales[i.name] = { quantity: 0, profit: 0 };
      }
      itemSales[i.name].quantity += i.quantity;
      itemSales[i.name].profit += profit;
    }));

    const topProducts = Object.entries(itemSales)
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5);

    const topProfitProducts = Object.entries(itemSales)
      .sort((a, b) => b[1].profit - a[1].profit)
      .slice(0, 5);

    // Average margin across all products
    const avgMargin = products.filter(p => p.price > 0).length > 0
      ? products.filter(p => p.price > 0).reduce((sum, p) => {
          return sum + ((p.price - (p.cost || 0)) / p.price * 100);
        }, 0) / products.filter(p => p.price > 0).length
      : 0;

    // Total inventory value
    const inventoryValue = products.reduce((sum, p) => sum + ((p.cost || 0) * p.inventory), 0);
    const inventoryRetailValue = products.reduce((sum, p) => sum + (p.price * p.inventory), 0);

    return {
      todayOrders: todayOrders.length,
      weekOrders: weekOrders.length,
      todayRevenue,
      weekRevenue,
      todayCost,
      weekCost,
      todayProfit,
      weekProfit,
      lowStock,
      lowMarginProducts,
      topProducts,
      topProfitProducts,
      avgMargin,
      inventoryValue,
      inventoryRetailValue,
    };
  }, [orders, products]);

  const sendWhatsApp = (order: Order) => {
    const phone = `${order.countryCode || ""}${order.phone || ""}`.replace(/[^0-9]/g, "");
    if (!phone) { toast.error("No phone number"); return; }
    let msg = business.whatsappTemplate || "Hello {name}, your order #{id} is {status}. Total: ₱{total}. Thank you!";
    msg = msg
      .replace(/\{name\}/g, order.customer)
      .replace(/\{id\}/g, order.id)
      .replace(/\{status\}/g, order.status)
      .replace(/\{total\}/g, order.total.toFixed(2));
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleExport = () => {
    const csv = exportProductsCSV(products);
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products_export.csv";
    a.click();
    toast.success("CSV exported");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importProductsCSV(ev.target?.result as string);
      if (result) { setProducts(result); toast.success(`Imported ${result.length} products`); }
      else toast.error("Invalid CSV");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleEditProduct = (p: Product) => { setEditingProduct(p); setProductModalOpen(true); };
  const handleSaveProduct = (data: Omit<Product, "id"> & { id?: string }) => {
    if (data.id) updateProduct({ ...data, id: data.id } as Product);
    else addProduct(data);
    toast.success("Saved");
  };

  const tabs = [
    { id: "orders" as const, label: "Orders", icon: ClipboardList, count: orders.length },
    { id: "products" as const, label: "Products", icon: Package, count: products.length },
    { id: "settings" as const, label: "Settings", icon: Settings },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-lg font-bold text-foreground">{business.businessName}</h1>
            <span className="bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase">Admin</span>
          </div>
          <button onClick={handleExitAdmin} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors">
            <LogOut size={14} /> Exit
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card/50">
        <div className="container max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={16} />
              {t.label}
              {t.count !== undefined && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-5">
        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <select value={orderStatusFilter} onChange={e => setOrderStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground">
                <option value="all">All statuses</option>
                {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-sm">No orders found</p>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-card rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-card-foreground">{order.id}</p>
                      <p className="text-xs text-muted-foreground">{order.timestamp ? new Date(order.timestamp).toLocaleString() : order.date}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_COLORS[order.status as OrderStatus] || "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Customer</p>
                      <p className="text-card-foreground font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                      <p className="text-xs text-muted-foreground">{order.countryCode}{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-semibold">Order Type</p>
                      <p className="text-card-foreground">{order.deliveryType === "delivery" ? "🚚 Delivery" : "🏪 Pickup"}</p>
                      {order.notes && <p className="text-xs text-muted-foreground italic mt-1">"{order.notes}"</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground uppercase font-semibold">Items</p>
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-card-foreground">{item.quantity}x {item.name}</span>
                        <span className="text-muted-foreground">₱{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold pt-1 border-t border-border/50">
                      <span className="text-card-foreground">Total</span>
                      <span className="text-primary">₱{order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="relative flex-1 min-w-[140px]">
                      <select
                        value={order.status}
                        onChange={e => {
                          updateOrderStatus(order.id, e.target.value as OrderStatus);
                          toast.success("Status updated");
                        }}
                        className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground appearance-none pr-8"
                      >
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    </div>
                    <button onClick={() => sendWhatsApp(order)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium hover:bg-green-500/20 transition-colors">
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                    <button onClick={() => setInvoiceOrder(order)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
                      <FileText size={14} /> Invoice
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button onClick={() => { setEditingProduct(null); setProductModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                <Plus size={14} /> Add Product
              </button>
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
                <Download size={14} /> Export CSV
              </button>
              <button onClick={() => csvRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
                <Upload size={14} /> Import CSV
              </button>
              <input ref={csvRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <select value={productCategory} onChange={e => setProductCategory(e.target.value)} className="px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground">
                <option value="all">📋 All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c] || "📦"} {c}</option>)}
              </select>
            </div>

            {filteredProducts.length === 0 ? (
              <p className="text-center text-muted-foreground py-12 text-sm">No products found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map(p => (
                    <ProductCard key={p.id} product={p} onEdit={handleEditProduct} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="max-w-lg mx-auto">
            <BusinessModal open={true} onClose={() => setTab("orders")} settings={business} onSave={setBusiness} inline />
          </div>
        )}

        {/* 🆕 ENHANCED ANALYTICS TAB */}
        {tab === "analytics" && (
          <div className="space-y-6">
            {/* Revenue & Profit Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <ShoppingBag size={20} className="text-primary mb-2" />
                <p className="text-2xl font-bold">{analytics.todayOrders}</p>
                <p className="text-xs text-muted-foreground">Today's Orders</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <TrendingUp size={20} className="text-success mb-2" />
                <p className="text-2xl font-bold">₱{analytics.todayRevenue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Today's Revenue</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <DollarSign size={20} className="text-blue-500 mb-2" />
                <p className="text-2xl font-bold">₱{analytics.todayProfit.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Today's Profit</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <BarChart3 size={20} className="text-orange-500 mb-2" />
                <p className="text-2xl font-bold">{analytics.avgMargin.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Avg Margin</p>
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-4">
                <ClipboardList size={20} className="text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{analytics.weekOrders}</p>
                <p className="text-xs text-muted-foreground">Week Orders</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <TrendingUp size={20} className="text-success mb-2" />
                <p className="text-2xl font-bold">₱{analytics.weekRevenue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Week Revenue</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <Calculator size={20} className="text-primary mb-2" />
                <p className="text-2xl font-bold">₱{analytics.weekProfit.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Week Profit</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-4">
                <Package size={20} className="text-warning mb-2" />
                <p className="text-2xl font-bold">₱{analytics.inventoryValue.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">Stock Value</p>
              </div>
            </div>

            {/* Low Stock Alerts */}
            {analytics.lowStock.length > 0 && (
              <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-warning" />
                  <p className="text-sm font-semibold text-foreground">Low Stock Alerts</p>
                </div>
                <div className="space-y-1">
                  {analytics.lowStock.map(p => (
                    <p key={p.id} className="text-sm text-foreground">{p.name} — <span className="text-warning font-semibold">{p.inventory} left</span></p>
                  ))}
                </div>
              </div>
            )}

            {/* Low Margin Alerts */}
            {analytics.lowMarginProducts.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-destructive" />
                  <p className="text-sm font-semibold text-foreground">Low Profit Margin Products</p>
                </div>
                <div className="space-y-1">
                  {analytics.lowMarginProducts.map(p => (
                    <p key={p.id} className="text-sm text-foreground">{p.name} — <span className="text-destructive font-semibold">{p.margin.toFixed(1)}% margin</span></p>
                  ))}
                </div>
              </div>
            )}

            {/* Top Selling Products */}
            {analytics.topProducts.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-card-foreground mb-3">🏆 Top Selling Products</p>
                <div className="space-y-2">
                  {analytics.topProducts.map(([name, data], i) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm text-card-foreground">{name}</span>
                      </div>
                      <span className="text-xs font-semibold text-primary">{data.quantity} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Profit Products */}
            {analytics.topProfitProducts.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-4">
                <p className="text-sm font-semibold text-card-foreground mb-3">💰 Top Profit Products</p>
                <div className="space-y-2">
                  {analytics.topProfitProducts.map(([name, data], i) => (
                    <div key={name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                        <span className="text-sm text-card-foreground">{name}</span>
                      </div>
                      <span className="text-xs font-semibold text-success">₱{data.profit.toFixed(0)} profit</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <ProductModal open={productModalOpen} onClose={() => { setProductModalOpen(false); setEditingProduct(null); }} product={editingProduct} onSave={handleSaveProduct} />
      <InvoiceModal open={!!invoiceOrder} onClose={() => setInvoiceOrder(null)} order={invoiceOrder} business={business} />
    </div>
  );
}
