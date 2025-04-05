
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, CreditCard, History, Home, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { LoginModal } from "./auth/LoginModal";
import { SignupModal } from "./auth/SignupModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const navItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "My Cards", path: "/cards", icon: <CreditCard size={20} /> },
    { name: "Payments", path: "/payments", icon: <History size={20} /> },
    { name: "Account", path: "/account", icon: <User size={20} /> },
  ];

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleSignupClick = () => {
    setIsSignupModalOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    logout();
  };

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8 bg-rfid-teal text-white">
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/account">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    className="border-rfid-teal text-rfid-teal hover:bg-rfid-teal/10"
                    onClick={handleSignupClick}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-rfid-teal hover:bg-rfid-blue"
                    onClick={handleLoginClick}
                  >
                    Login
                  </Button>
                </div>
              )}
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
              {isAuthenticated ? (
                <>
                  <div className="flex items-center px-3 py-2 mb-2">
                    <Avatar className="h-8 w-8 bg-rfid-teal text-white mr-2">
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-gray-500">{user?.email}</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mb-2"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                    }}
                    asChild
                  >
                    <Link to="/account">Profile Settings</Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="w-full mb-2 border-rfid-teal text-rfid-teal hover:bg-rfid-teal/10"
                    onClick={() => {
                      handleSignupClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Up
                  </Button>
                  <Button 
                    variant="default" 
                    className="w-full bg-rfid-teal hover:bg-rfid-blue"
                    onClick={() => {
                      handleLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Auth Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
        onSwitchToLogin={handleSwitchToLogin}
      />
    </nav>
  );
};

export default Navbar;
