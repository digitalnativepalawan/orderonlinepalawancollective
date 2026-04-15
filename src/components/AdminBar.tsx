import { useApp } from "@/context/AppContext";
import { Plus, Settings, Download, Upload, LogOut, AlertTriangle } from "lucide-react";
import { useRef } from "react";
import { exportProductsCSV, importProductsCSV } from "@/lib/store";
import { toast } from "sonner";

interface AdminBarProps {
  onAddProduct: () => void;
  onOpenSettings: () => void;
}

export default function AdminBar({ onAddProduct, onOpenSettings }: AdminBarProps) {
  const { products, setProducts, setAdminMode } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const lowStock = products.filter(p => p.inventory <= 3 && p.inventory > 0);

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
      if (result) {
        setProducts(result);
        toast.success(`Imported ${result.length} products`);
      } else {
        toast.error("Invalid CSV file");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button onClick={onAddProduct} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
          <Plus size={14} /> Add Product
        </button>
        <button onClick={onOpenSettings} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
          <Settings size={14} /> Settings
        </button>
        <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
          <Download size={14} /> Export CSV
        </button>
        <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-xs font-medium hover:bg-muted transition-colors">
          <Upload size={14} /> Import CSV
        </button>
        <input ref={fileRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />
        <button onClick={() => setAdminMode(false)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-xs font-medium hover:bg-destructive/20 transition-colors ml-auto">
          <LogOut size={14} /> Exit Admin
        </button>
      </div>
      {lowStock.length > 0 && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
          <AlertTriangle size={16} className="text-warning flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            <span className="font-semibold">Low stock:</span> {lowStock.map(p => p.name).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
