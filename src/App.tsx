import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";

function HomePage() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>JayCee Trading & Services</h1>
      <p>App is working! Now check your original App.tsx</p>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
