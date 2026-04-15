import { Sun, Moon, ShoppingCart, Lock, LogOut, Menu } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenCart, onOpenAdmin }: HeaderProps) {
  const { business, adminMode, setAdminMode, cartCount } = useApp();
  const { dark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "About", href: "/about" },
    // Add more later: { name: "Blog", href: "/blog" },
    // Add more later: { name: "Specials", href: "/specials" },
  ];

  return (
    <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo & Business Name */}
        <div className="flex items-center gap-3 min-w-0">
          {business.logoBase64 ? (
            <img src={business.logoBase64} alt="Logo" className="h-10 sm:h-12 w-auto object-contain rounded-lg" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
              J
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground truncate">
              {business.businessName || "Jaycee's Pantry"}
            </h1>
            {adminMode && (
              <span className="inline-block bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Mode
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors" aria-label="Toggle theme">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {adminMode ? (
            <button onClick={() => setAdminMode(false)} className="p-2.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" aria-label="Exit admin">
              <LogOut size={18} />
            </button>
          ) : (
            <button onClick={onOpenAdmin} className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors" aria-label="Admin login">
              <Lock size={18} />
            </button>
          )}

          <button onClick={onOpenCart} className="relative p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity" aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container max-w-7xl mx-auto py-3 px-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-2 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
