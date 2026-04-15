import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Specials from "./pages/Specials.tsx";
import AdminDashboard from "./components/AdminDashboard";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Pages (with Header/Footer) */}
            <Route path="/" element={<Layout><Index /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/specials" element={<Layout><Specials /></Layout>} />
            
            {/* Admin Page (NO Header/Footer - standalone) */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
