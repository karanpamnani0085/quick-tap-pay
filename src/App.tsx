
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cards from "./pages/Cards";
import Payments from "./pages/Payments";
import Payment from "./pages/Payment";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import AIInsights from "./pages/AIInsights";
import Cart from "./pages/Cart"; // Add the Cart import
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/account" element={<Account />} />
                <Route path="/ai-insights" element={<AIInsights />} />
                <Route path="/cart" element={<Cart />} /> {/* Add the Cart route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
