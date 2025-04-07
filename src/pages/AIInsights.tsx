
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { aiService, AIInsight } from "@/services/aiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BadgeCheck, AlertTriangle, RefreshCw, ChevronRight, ShieldAlert, Lightbulb, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const AIInsights = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    loadInsights();
  }, [isAuthenticated, navigate]);

  const loadInsights = () => {
    if (user) {
      setIsLoading(true);
      const userInsights = aiService.getInsights(user.id);
      setInsights(userInsights);
      setIsLoading(false);
    }
  };

  const refreshAnalysis = () => {
    if (user) {
      setRefreshing(true);
      aiService.runFullAnalysis(user.id);
      
      // Add a small delay to simulate processing
      setTimeout(() => {
        loadInsights();
        setRefreshing(false);
      }, 1500);
    }
  };

  const markAsRead = (insightId: string) => {
    aiService.markInsightAsRead(insightId);
    loadInsights();
  };

  const getFilteredInsights = () => {
    if (activeTab === "all") {
      return insights;
    }
    return insights.filter(insight => insight.type === activeTab);
  };

  const getInsightIcon = (type: string, severity?: string) => {
    switch (type) {
      case "fraud":
        return <ShieldAlert className="h-5 w-5 text-red-500" />;
      case "spending":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case "behavior":
        return severity === "high" ? 
          <AlertTriangle className="h-5 w-5 text-orange-500" /> : 
          <BadgeCheck className="h-5 w-5 text-green-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "high":
        return "border-red-200 bg-red-50";
      case "medium":
        return "border-orange-200 bg-orange-50";
      case "low":
        return "border-green-200 bg-green-50";
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredInsights = getFilteredInsights();

  return (
    <div className="container max-w-5xl py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Insights & Recommendations</h1>
        <Button 
          onClick={refreshAnalysis} 
          disabled={refreshing || isLoading}
          className="bg-rfid-teal hover:bg-rfid-blue flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          {refreshing ? "Analyzing..." : "Refresh Analysis"}
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="fraud">Security</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendations</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-20" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full my-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredInsights.length > 0 ? (
        <div className="space-y-4">
          {filteredInsights.map((insight) => (
            <Card 
              key={insight.id} 
              className={`border hover:shadow-md transition-all ${!insight.isRead ? "border-left-4 border-l-rfid-teal" : ""}`}
            >
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type, insight.severity)}
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{formatDate(insight.timestamp)}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  {!insight.isRead && (
                    <span className="inline-flex h-2 w-2 rounded-full bg-rfid-teal mr-2"></span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-rfid-teal"
                    onClick={() => markAsRead(insight.id)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{insight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Alert>
          <AlertTitle>No insights available</AlertTitle>
          <AlertDescription>
            We don't have any personalized insights for you yet. Click on "Refresh Analysis" to generate new insights based on your recent activity.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AIInsights;
