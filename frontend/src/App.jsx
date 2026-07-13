import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/lib/theme";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingChat } from "@/components/FloatingChat";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Assistant from "@/pages/Assistant";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Recommendations from "@/pages/Recommendations";
import ProductDetail from "@/pages/ProductDetail";
import History from "@/pages/History";

function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-4 text-muted-foreground">Page not found.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/history" element={<History />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <FloatingChat />
      </div>
    </ThemeProvider>
  );
}