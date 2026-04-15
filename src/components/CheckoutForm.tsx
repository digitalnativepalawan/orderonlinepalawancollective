import { useState } from "react";
import { CheckoutData, COUNTRY_CODES } from "@/lib/types";
import { User, Mail, Phone, MapPin, MessageSquare } from "lucide-react";

interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void;
  onCancel: () => void;
}

export default function CheckoutForm({ onSubmit, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+63");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("pickup");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = "Invalid email";
    if (!phone.trim()) errs.phone = "Phone is required";
    else if (!/^\d{7,15}$/.test(phone.trim().replace(/\s/g, ""))) errs.phone = "Invalid phone number";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({ name: name.trim(), email: email.trim(), phone: phone.trim(), countryCode, deliveryType, notes: notes.trim() });
  };

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30";
  const errorClass = "text-[11px] text-destructive mt-0.5";

  return (
    <div className="space-y-3">
      <div>
        <div className="relative">
          <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name *" className={`${inputClass} pl-9`} />
        </div>
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <div className="relative">
          <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address *" type="email" className={`${inputClass} pl-9`} />
        </div>
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <div className="flex gap-2">
          <select value={countryCode} onChange={e => setCountryCode(e.target.value)} className="px-2 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground w-24 flex-shrink-0">
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone number *" type="tel" className={`${inputClass} pl-9`} />
          </div>
        </div>
        {errors.phone && <p className={errorClass}>{errors.phone}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <MapPin size={12} /> Order Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setDeliveryType("pickup")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              deliveryType === "pickup"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            🏪 Pickup
          </button>
          <button
            onClick={() => setDeliveryType("delivery")}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              deliveryType === "delivery"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-muted"
            }`}
          >
            🚚 Delivery
          </button>
        </div>
      </div>

      <div className="relative">
        <MessageSquare size={14} className="absolute left-3 top-3 text-muted-foreground" />
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className={`${inputClass} pl-9 resize-none`}
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm">Cancel</button>
        <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity">Place Order</button>
      </div>
    </div>
  );
}
