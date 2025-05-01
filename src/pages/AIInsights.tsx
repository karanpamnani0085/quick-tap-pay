
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { aiService, AIInsight } from "@/services/aiService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, ChevronRight, Lightbulb, TrendingUp, Info, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { dbService } from "@/services/dbService";
import { useToast } from "@/hooks/use-toast"; 
import { getFavoriteShopInsight } from "@/utils/aiFeatures/userBehaviorAnalytics";

const AIInsights = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();
  const [topMerchant, setTopMerchant] = useState("");
  const [favShop, setFavShop] = useState("");
  const [favShopCount, setFavShopCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    loadInsights();
    findTopShop();
  }, [isAuthenticated, navigate]);

  const loadInsights = () => {
    if (user) {
      setIsLoading(true);
      console.log("Loading insights for user:", user.id);
      const userInsights = aiService.getInsights(user.id);
      console.log("Retrieved insights:", userInsights);
      setInsights(userInsights);
      setIsLoading(false);
    }
  };

  const findTopShop = () => {
    if (user) {
      // Get favorite shop from cart history
      const favoriteShop = getFavoriteShopInsight();
      if (favoriteShop) {
        setFavShop(favoriteShop.shopName);
        setFavShopCount(favoriteShop.count);
      }
      
      // Get top merchant from transactions
      const transactions = dbService.getTransactionsByUserId(user.id);
      if (transactions && transactions.length > 0) {
        const merchantCounts: Record<string, number> = {};
        transactions.forEach(t => {
          if (t.merchant && t.type === "payment") {
            merchantCounts[t.merchant] = (merchantCounts[t.merchant] || 0) + 1;
          }
        });
        
        let maxCount = 0;
        let topMerchant = "";
        Object.entries(merchantCounts).forEach(([merchant, count]) => {
          if (count > maxCount) {
            maxCount = count;
            topMerchant = merchant;
          }
        });
        
        if (topMerchant) {
          setTopMerchant(topMerchant);
        }
      }
    }
  };

  const refreshAnalysis = () => {
    if (user) {
      setRefreshing(true);
      
      // Ensure we have the latest transactions
      const transactions = dbService.getTransactionsByUserId(user.id);
      console.log("Analyzing transactions for insights:", transactions);
      
      // Run the full analysis
      aiService.runFullAnalysis(user.id);
      
      // Update shop information
      findTopShop();
      
      // Add a small delay to simulate processing
      setTimeout(() => {
        loadInsights();
        setRefreshing(false);
        toast({
          title: "Analysis Complete",
          description: "Your AI insights have been updated based on your latest transactions.",
        });
      }, 1500);
    }
  };

  const markAsRead = (insightId: string) => {
    aiService.markInsightAsRead(insightId);
    loadInsights();
  };

  const getFilteredInsights = () => {
    return insights;
  };

  const getInsightIcon = (type: string, severity?: string) => {
    switch (type) {
      case "fraud":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "spending":
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case "recommendation":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />;
      case "behavior":
        return severity === "high" ? 
          <AlertTriangle className="h-5 w-5 text-orange-500" /> : 
          <Info className="h-5 w-5 text-green-500" />;
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

      {/* Top merchant and favorite shop section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="border-left-4 border-l-rfid-teal">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Top Transaction Merchant</CardTitle>
            <CardDescription>Based on your transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {topMerchant ? (
                <span>Your most frequent transaction merchant is <strong>{topMerchant}</strong></span>
              ) : (
                "Make more transactions to see your top merchant!"
              )}
            </p>
          </CardContent>
        </Card>
        <Card className="border-left-4 border-l-rfid-blue">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Favorite Food Shop</CardTitle>
            <CardDescription>Based on your ordering history</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {favShop ? (
                <span>You order most frequently from <strong>{favShop}</strong> ({favShopCount} items)</span>
              ) : (
                "Place more orders to see your favorite shop!"
              )}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-1 mb-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
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
