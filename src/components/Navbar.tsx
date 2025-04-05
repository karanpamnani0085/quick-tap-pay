
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, CreditCard, History, Home, Menu, X, User } from "lucide-react";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "My Cards", path: "/cards", icon: <CreditCard size={20} /> },
    { name: "Payments", path: "/payments", icon: <History size={20} /> },
    { name: "Account", path: "/account", icon: <User size={20} /> },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Wallet className="h-8 w-8 text-rfid-teal" />
              <span className="ml-2 text-xl font-bold text-rfid-blue">QuickTapPay</span>
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-rfid-blue hover:bg-gray-100"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
              <Button variant="default" className="bg-rfid-teal hover:bg-rfid-blue">
                Login
              </Button>
            </div>
          </div>
          
          <div className="md:hidden">
            <Button
              variant="ghost"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-rfid-blue hover:bg-gray-100"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Button 
                variant="default" 
                className="w-full bg-rfid-teal hover:bg-rfid-blue"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
