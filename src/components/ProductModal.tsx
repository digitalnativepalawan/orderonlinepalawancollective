import { useState, useRef, useEffect } from "react";
import { Product, CATEGORIES } from "@/lib/types";
import { X, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: Omit<Product, "id"> & { id?: string }) => void;
}

export default function ProductModal({ open, onClose, product, onSave }: ProductModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("pack");
  const [inventory, setInventory] = useState("0");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(String(product.price));
      setUnit(product.unit);
      setInventory(String(product.inventory));
      setIsAvailable(product.isAvailable);
      setImagePreview(product.image.startsWith("data:") ? product.image : "");
      setImageUrl(product.image.startsWith("http") ? product.image : "");
    } else {
      setName(""); setCategory(CATEGORIES[0]); setPrice(""); setUnit("pack");
      setInventory("0"); setIsAvailable(true); setImagePreview(""); setImageUrl("");
    }
  }, [product, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(fileName, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setImageUrl(urlData.publicUrl);
      setImagePreview("");
    } catch (err) {
      console.error('Upload failed:', err);
      // Fallback to base64
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setImageUrl("");
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    let finalImage = "";
    if (imagePreview.startsWith("data:")) finalImage = imagePreview;
    else if (imageUrl) finalImage = imageUrl;
    else finalImage = `https://placehold.co/400x300/E8DCC8/6B5B3E?text=${encodeURIComponent(name.slice(0, 14))}`;

    onSave({
      ...(product ? { id: product.id } : {}),
      name: name.trim(),
      category,
      price: parseFloat(price) || 0,
      unit,
      inventory: parseInt(inventory) || 0,
      image: finalImage,
      isAvailable,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-card-foreground">{product ? "Edit Product" : "Add Product"}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Product name" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="flex gap-3">
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" className="flex-1 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
            <input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit" className="w-24 px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
          <input value={inventory} onChange={e => setInventory(e.target.value)} placeholder="Inventory" type="number" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-1.5"><ImageIcon size={14} /> Product Image</label>
            <button onClick={() => fileRef.current?.click()} className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Upload size={16} /> Upload from device
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {(imagePreview || imageUrl) && (
              <img src={imagePreview || imageUrl} alt="Preview" className="h-24 object-contain rounded-lg mx-auto" />
            )}
            <input value={imageUrl} onChange={e => { setImageUrl(e.target.value); setImagePreview(""); }} placeholder="Or paste image URL" className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground" />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isAvailable} onChange={e => setIsAvailable(e.target.checked)} className="w-4 h-4 rounded accent-primary" />
            <span className="text-sm text-card-foreground">Available for users</span>
          </label>
        </div>
        <div className="flex gap-2 p-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Save</button>
        </div>
      </div>
    </div>
  );
}
