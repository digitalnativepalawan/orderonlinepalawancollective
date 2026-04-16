import { Sun, Moon, ShoppingCart, Lock, LogOut, Menu, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { Link } from "react-router-dom";  // ✅ Removed useNavigate

// Inline SVG Icons for Social Media (Reliable for builds)
const FacebookIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 20, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface HeaderProps {
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export default function Header({ onOpenCart, onOpenAdmin }: HeaderProps) {
  const { business, adminMode, setAdminMode, cartCount } = useApp();
  const { dark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // ✅ Removed: const navigate = useNavigate();

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Specials", href: "/specials" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: FacebookIcon, href: "https://web.facebook.com/jayceetrading" },
    { name: "Instagram", icon: InstagramIcon, href: "https://www.instagram.com/jayceetradingservices/" },
  ];

  // ✅ FIXED: Use window.location.href instead of navigate
  const handleExitAdmin = () => {
    setAdminMode(false);
    setMobileMenuOpen(false);
    window.location.href = "/";
  };

  // ✅ FIXED: Use window.location.href instead of navigate
  const handleGoToAdmin = () => {
    window.location.href = "/admin";
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container max-w-7xl mx-auto flex items-center justify-between py-3 px-4">
        {/* Logo & Business Name */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {business.logoBase64 ? (
            <img src={business.logoBase64} alt="Logo" className="h-10 w-auto object-contain rounded-lg" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
              J
            </div>
          )}
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-bold text-foreground truncate">
              {business.businessName || "JayCee Trading & Services"}
            </h1>
            {adminMode && (
              <span className="inline-block bg-destructive text-destructive-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin Mode
              </span>
            )}
          </div>
        </div>

        {/* Desktop Navigation & Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Nav Links */}
          <nav className="flex items-center gap-6">
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

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Social Icons */}
          <div className="flex items-center gap-1">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                aria-label={social.name}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors" aria-label="Toggle theme">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {adminMode ? (
              <>
                <button onClick={handleGoToAdmin} className="p-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors" aria-label="Go to admin dashboard">
                  <Lock size={18} />
                </button>
                <button onClick={handleExitAdmin} className="p-2.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors" aria-label="Exit admin">
                  <LogOut size={18} />
                </button>
              </>
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
          </div>
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {/* Cart (Mobile) */}
          <button onClick={onOpenCart} className="relative p-2.5 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity" aria-label="Cart">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container max-w-7xl mx-auto py-4 px-4 flex flex-col gap-1">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-3 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Social Links */}
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-3 rounded-lg transition-colors"
              >
                <social.icon size={20} className="text-foreground" />
                {social.name}
              </a>
            ))}

            {/* Divider */}
            <div className="my-2 border-t border-border" />

            {/* Theme Toggle */}
            <button
              onClick={() => {
                toggle();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-3 rounded-lg transition-colors w-full text-left"
            >
              {dark ? <Sun size={20} /> : <Moon size={20} />}
              {dark ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Admin Toggle */}
            {adminMode ? (
              <>
                <button
                  onClick={handleGoToAdmin}
                  className="flex items-center gap-3 text-base font-medium text-primary hover:bg-primary/10 px-3 py-3 rounded-lg transition-colors w-full text-left"
                >
                  <Lock size={20} />
                  Admin Dashboard
                </button>
                <button
                  onClick={handleExitAdmin}
                  className="flex items-center gap-3 text-base font-medium text-destructive hover:bg-destructive/10 px-3 py-3 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut size={20} />
                  Exit Admin
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted px-3 py-3 rounded-lg transition-colors w-full text-left"
              >
                <Lock size={20} />
                Admin Login
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
