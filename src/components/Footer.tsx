import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

// Inline SVG Icons for Social Media (Matches Header exactly)
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

const WhatsAppIcon = ({ size = 20, className = "" }) => (
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
    <circle cx="12" cy="12" r="10" />
    <path d="M8 9.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0" />
    <path d="M16 9.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0" />
    <path d="M12 14c-2.5 0-4.5-1.5-4.5-3.5" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-lg font-bold text-foreground">
              JayCee Trading & Services
            </h3>
            <p className="text-sm text-muted-foreground">
              Supporting local farmers and artisans in Palawan through fresh, 
              organic products delivered straight to your door.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://web.facebook.com/jayceetrading" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
              <a 
                href="https://www.instagram.com/jayceetradingservices/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Home / Shop
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/specials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Specials
              </Link>
              {/* Future Links */}
              {/* <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link> */}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <div className="flex flex-col gap-2">
              {/* WhatsApp */}
              <a 
                href="https://wa.me/639917093792" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <WhatsAppIcon size={16} />
                <span>0991 709 3792</span>
              </a>
              
              {/* Email */}
              <a 
                href="mailto:tradingjaycee@gmail.com" 
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail size={16} />
                <span>tradingjaycee@gmail.com</span>
              </a>
              
              {/* Google Maps */}
              <a 
                href="https://maps.app.goo.gl/e1f4vcajwBnEWGBV9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>For food and inquiries - View on Map</span>
              </a>
              
              {/* Social Handles */}
              <div className="flex flex-col gap-1 text-sm text-muted-foreground pt-2 border-t border-border">
                <span className="font-medium text-foreground">Follow Us:</span>
                <span>Facebook: Jaycee Trading And Services</span>
                <span>Instagram: @jaycee.tradingservices</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} JayCee Trading & Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
