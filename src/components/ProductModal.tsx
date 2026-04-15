import { useState, useEffect } from "react";
import { Product } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/types";
import { toast } from "sonner";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (data: Omit<Product, "id"> & { id?: string }) => void;
}

export default function ProductModal({ open, onClose, product, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    cost: 0,
    category: "Meats",
    description: "",
    imageBase64: "",
    inventory: 0,
    isAvailable: true,
    unit: "kg",
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  // Calculate margin and profit
  const profit = formData.price - formData.cost;
  const margin = formData.price > 0 ? ((profit / formData.price) * 100) : 0;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        cost: product.cost || 0,
        category: product.category,
        description: product.description || "",
        imageBase64: product.imageBase64 || product.image || "",
        inventory: product.inventory,
        isAvailable: product.isAvailable,
        unit: product.unit || "kg",
      });
      setImagePreview(product.imageBase64 || product.image || "");
    } else {
      setFormData({
        name: "",
        price: 0,
        cost: 0,
        category: "Meats",
        description: "",
        imageBase64: "",
        inventory: 0,
        isAvailable: true,
        unit: "kg",
      });
      setImagePreview("");
    }
  }, [product, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFormData(prev => ({ ...prev, imageBase64: base64 }));
        setImagePreview(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.name || formData.price <= 0) {
      toast.error("Please fill in required fields");
      return;
    }
    if (formData.cost > formData.price) {
      toast.warning("Cost is higher than selling price!");
    }
    onSave(formData);
    onClose();
  };

  const getMarginColor = () => {
    if (margin >= 30) return "text-success bg-success/10";
    if (margin >= 15) return "text-warning bg-warning/10";
    if (margin >= 0) return "text-destructive bg-destructive/10";
    return "text-destructive bg-destructive/20";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Product Name */}
          <div>
            <Label>Product Name *</Label>
            <Input
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., US Tenderloin"
            />
          </div>

          {/* Price & Cost Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Selling Price (₱) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label>Food Cost (₱) *</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={e => setFormData(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Profit Margin Display */}
          <div className={`rounded-lg p-3 flex items-center justify-between ${getMarginColor()}`}>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span className="text-sm font-medium">Profit Margin:</span>
            </div>
            <span className="text-lg font-bold">
              {margin.toFixed(1)}%
            </span>
          </div>

          {/* Profit Per Unit */}
          <div className="bg-primary/10 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator size={18} className="text-primary" />
              <span className="text-sm font-medium">Profit Per Unit:</span>
            </div>
            <span className="text-lg font-bold text-primary">
              ₱{profit.toFixed(2)}
            </span>
          </div>

          {/* Category & Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData(prev => ({ ...prev, category: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={v => setFormData(prev => ({ ...prev, unit: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">kg</SelectItem>
                  <SelectItem value="pack">pack</SelectItem>
                  <SelectItem value="pcs">pcs</SelectItem>
                  <SelectItem value="liter">liter</SelectItem>
                  <SelectItem value="g">g</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Inventory */}
          <div>
            <Label>Inventory Stock</Label>
            <Input
              type="number"
              value={formData.inventory}
              onChange={e => setFormData(prev => ({ ...prev, inventory: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Product description..."
              rows={3}
            />
          </div>

          {/* Image Upload */}
          <div>
            <Label>Product Image</Label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-1" />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-lg" />
            )}
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={formData.isAvailable}
              onChange={e => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
              className="rounded"
            />
            <Label htmlFor="available">Available for Sale</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
