import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { useState } from "react";
import CartSidebar from "@/components/CartSidebar";
import AdminLoginModal from "@/components/AdminLoginModal";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { adminMode } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  // If in admin mode, don't show header/footer
  if (adminMode) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onOpenCart={() => setCartOpen(true)} 
        onOpenAdmin={() => setAdminLoginOpen(true)} 
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
      <AdminLoginModal 
        open={adminLoginOpen} 
        onClose={() => setAdminLoginOpen(false)} 
        onLogin={() => {
          setAdminLoginOpen(false);
          // Admin login logic handled by AppContext
        }} 
      />
    </div>
  );
}
