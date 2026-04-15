import { useState } from "react";
import { X, Lock } from "lucide-react";

interface AdminLoginModalProps {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function AdminLoginModal({ open, onClose, onLogin }: AdminLoginModalProps) {
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (passkey === "5309") {
      onLogin();
      setPasskey("");
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-card w-full max-w-xs rounded-2xl shadow-2xl border border-border p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-card-foreground flex items-center gap-2"><Lock size={18} /> Admin Access</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted text-muted-foreground"><X size={16} /></button>
        </div>
        <input
          type="password"
          value={passkey}
          onChange={e => { setPasskey(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="Enter passkey"
          className={`w-full px-3 py-2.5 rounded-lg bg-secondary border text-sm text-foreground placeholder:text-muted-foreground ${error ? "border-destructive" : "border-border"}`}
        />
        {error && <p className="text-destructive text-xs">Wrong passkey</p>}
        <button onClick={handleSubmit} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Login</button>
      </div>
    </div>
  );
}
