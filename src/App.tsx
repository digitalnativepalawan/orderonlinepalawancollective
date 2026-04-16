import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import Layout from "@/components/Layout";
import AdminDashboard from "@/components/AdminDashboard";

// Pages
import Index from "@/pages/Index";
import About from "@/pages/About";
import Specials from "@/pages/Specials";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* All public routes - wrapped in Layout (Header + Footer) */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/specials" element={<Layout><Specials /></Layout>} />
            <Route path="/cart" element={<Layout><Cart /></Layout>} />
            <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
            
            {/* Admin route - NO Layout wrapper (Admin has its own header) */}
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
