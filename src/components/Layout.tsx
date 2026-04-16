import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useState } from "react";
import CartSidebar from "@/components/CartSidebar";
import AdminLoginModal from "@/components/AdminLoginModal";
import { useApp } from "@/context/AppContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { setAdminMode } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

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
          setAdminMode(true);
          setAdminLoginOpen(false);
          // ✅ CORRECT: Force full page reload to admin page
          window.location.href = "/admin";
        }} 
      />
    </div>
  );
}
