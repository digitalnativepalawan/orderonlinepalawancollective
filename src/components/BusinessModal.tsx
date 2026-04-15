import { useState, useRef, useEffect } from "react";
import { BusinessSettings } from "@/lib/types";
import { X, Upload } from "lucide-react";

interface BusinessModalProps {
  open: boolean;
  onClose: () => void;
  settings: BusinessSettings;
  onSave: (s: BusinessSettings) => void;
}

export default function BusinessModal({ open, onClose, settings, onSave }: BusinessModalProps) {
  const [data, setData] = useState<BusinessSettings>(settings);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setData(settings); }, [settings, open]);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setData(d => ({ ...d, logoBase64: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-heading text-lg font-bold text-card-foreground">Business Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"><X size={18} /></button>
        </div>
        <div className="p-4 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground">Logo</label>
            <button onClick={() => fileRef.current?.click()} className="w-full py-3 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Upload size={16} /> Upload logo
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/svg+xml" onChange={handleLogo} className="hidden" />
            {data.logoBase64 && <img src={data.logoBase64} alt="Logo preview" className="h-12 object-contain mx-auto" />}
          </div>
          {([
            ["businessName", "Business Name"],
            ["phone", "Phone"],
            ["email", "Email"],
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ["address", "Address"],
          ] as const).map(([key, label]) => (
            <input key={key} value={data[key]} onChange={e => setData(d => ({ ...d, [key]: e.target.value }))} placeholder={label} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground" />
          ))}
        </div>
        <div className="flex gap-2 p-4 border-t border-border">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">Cancel</button>
          <button onClick={() => { onSave(data); onClose(); }} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Save</button>
        </div>
      </div>
    </div>
  );
}
