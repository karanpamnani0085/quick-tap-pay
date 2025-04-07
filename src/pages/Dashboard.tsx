
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TransactionCharts from "@/components/dashboard/TransactionCharts";
import { aiService } from "@/services/aiService";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Run AI analysis when dashboard loads
    if (user) {
      aiService.runFullAnalysis(user.id);
    }
  }, [isAuthenticated, navigate, user]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-rfid-blue mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <TransactionCharts />
      </div>
    </div>
  );
};

export default Dashboard;
