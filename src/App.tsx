import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import Layout from "@/components/Layout";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Specials from "@/pages/Specials";
import AdminDashboard from "@/components/AdminDashboard";  // ✅ Add this import

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/specials" element={<Layout><Specials /></Layout>} />
          {/* ✅ ADD THIS ADMIN ROUTE - no Layout wrapper because Admin has its own layout */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
