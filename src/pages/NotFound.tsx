
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-rfid-blue mb-4">404</h1>
        <div className="w-24 h-1 bg-rfid-teal mx-auto mb-6"></div>
        <p className="text-2xl font-medium text-gray-800 mb-6">Page Not Found</p>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the home page.
        </p>
        <Button asChild className="bg-rfid-teal hover:bg-rfid-blue">
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
