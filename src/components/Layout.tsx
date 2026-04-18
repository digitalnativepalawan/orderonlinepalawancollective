import { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminLoginModal from "@/components/AdminLoginModal";
import { useApp } from "@/context/AppContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps {
  const { setAdminMode } = useApp();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onOpenAdmin={() => setAdminLoginOpen(true)} />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      
      <AdminLoginModal 
        open={adminLoginOpen} 
        onClose={() => setAdminLoginOpen(false)} 
        onLogin={() => {
          setAdminMode(true);
          setAdminLoginOpen(false);
          window.location.href = "/admin";
        }} 
      />
    </div>
  );
}
