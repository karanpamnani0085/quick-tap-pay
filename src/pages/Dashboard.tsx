
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import TransactionCharts from "@/components/dashboard/TransactionCharts";
import { aiService, AIInsight } from "@/services/aiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [latestInsight, setLatestInsight] = useState<AIInsight | null>(null);
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    // Run AI analysis when dashboard loads and fetch insights
    if (user) {
      aiService.runFullAnalysis(user.id);
      
      // Get latest insights
      const userInsights = aiService.getInsights(user.id);
      setInsights(userInsights);
      
      // Set the latest unread insight if available
      const unreadInsights = userInsights.filter(insight => !insight.isRead);
      if (unreadInsights.length > 0) {
        setLatestInsight(unreadInsights[0]);
      } else if (userInsights.length > 0) {
        setLatestInsight(userInsights[0]);
      }
    }
  }, [isAuthenticated, navigate, user]);

  const handleViewAllInsights = () => {
    navigate("/ai-insights");
  };
  
  const handleMarkAsRead = (insightId: string) => {
    aiService.markInsightAsRead(insightId);
    setLatestInsight(null);
    if (user) {
      const updatedInsights = aiService.getInsights(user.id);
      setInsights(updatedInsights);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-rfid-blue mb-8">Your Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {latestInsight && (
          <Card className={`col-span-1 md:col-span-3 border-l-4 ${
            latestInsight.severity === 'high' 
              ? 'border-l-red-500 bg-red-50' 
              : latestInsight.severity === 'medium'
                ? 'border-l-yellow-500 bg-yellow-50'
                : 'border-l-blue-500 bg-blue-50'
          }`}>
            <CardContent className="pt-6 flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center">
                  {latestInsight.severity === 'high' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  ) : (
                    <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                  )}
                  <h3 className="font-semibold text-lg">{latestInsight.title}</h3>
                </div>
                <p className="text-sm text-gray-700">{latestInsight.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs"
                onClick={() => handleMarkAsRead(latestInsight.id)}
              >
                Dismiss
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <TransactionCharts />
        
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold flex items-center text-rfid-blue">
            <Bell className="mr-2 h-5 w-5" /> AI Insights
          </h2>
          <Button variant="outline" size="sm" onClick={handleViewAllInsights}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {insights.slice(0, 3).map(insight => (
            <Card key={insight.id} className={`${
              insight.isRead ? 'opacity-70' : ''
            } ${
              insight.type === 'fraud' 
                ? 'border-red-200' 
                : insight.type === 'spending'
                  ? 'border-yellow-200'
                  : 'border-blue-200'
            }`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <CardDescription className="text-xs">
                  {new Date(insight.timestamp).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
