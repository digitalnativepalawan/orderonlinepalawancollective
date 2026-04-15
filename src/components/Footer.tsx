import { useApp } from "@/context/AppContext";
import { Phone, Mail, Facebook, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  const { business } = useApp();

  return (
    <footer className="mt-8 border-t border-border bg-card">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            {business.phone && (
              <p className="flex items-center gap-2"><Phone size={14} /> {business.phone}</p>
            )}
            {business.email && (
              <p className="flex items-center gap-2"><Mail size={14} /> {business.email}</p>
            )}
            {business.address && (
              <p className="flex items-center gap-2"><MapPin size={14} /> {business.address}</p>
            )}
          </div>
          <div className="space-y-2">
            {business.facebook && (
              <p className="flex items-center gap-2"><Facebook size={14} /> {business.facebook}</p>
            )}
            {business.instagram && (
              <p className="flex items-center gap-2"><Instagram size={14} /> {business.instagram}</p>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-4">© {new Date().getFullYear()} {business.businessName || "Jaycee's Pantry"}</p>
      </div>
    </footer>
  );
}
