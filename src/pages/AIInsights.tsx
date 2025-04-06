
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  LineChart, 
  BarChart, 
  MapPin, 
  ShoppingBag, 
  Tag, 
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { detectAnomalies } from "../utils/aiFeatures/fraudDetection";
import { generateMonthlyInsights, getTopMerchants } from "../utils/aiFeatures/userBehaviorAnalytics";
import { getPersonalizedRecommendations } from "../utils/aiFeatures/recommendationEngine";
import { Transaction } from "../types/transaction";

const AIInsights = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "txn-1",
      description: "Coffee Shop Purchase",
      amount: 4.75,
      type: "payment",
      status: "completed",
      date: "2025-04-04T09:15:32Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Downtown Cafe",
      location: "123 Main St",
      currency: "USD"
    },
    {
      id: "txn-2",
      description: "Transportation Fare",
      amount: 2.50,
      type: "payment",
      status: "completed",
      date: "2025-04-03T17:45:12Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Metro Transit",
      location: "Central Station",
      currency: "USD"
    },
    {
      id: "txn-3",
      description: "Card Top Up",
      amount: 50.00,
      type: "topup",
      status: "completed",
      date: "2025-04-02T14:33:22Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      currency: "USD"
    },
    {
      id: "txn-4",
      description: "Grocery Purchase",
      amount: 32.45,
      type: "payment",
      status: "completed",
      date: "2025-04-01T18:22:43Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "FreshMart",
      location: "500 Elm Street",
      currency: "USD"
    },
    {
      id: "txn-5",
      description: "Card Top Up",
      amount: 25.00,
      type: "topup",
      status: "completed",
      date: "2025-03-30T11:17:35Z",
      cardId: "card-2",
      cardName: "Backup Tag",
      currency: "USD"
    },
    {
      id: "txn-6",
      description: "Pharmacy Purchase",
      amount: 18.99,
      type: "payment",
      status: "completed",
      date: "2025-03-29T13:42:09Z",
      cardId: "card-2",
      cardName: "Backup Tag",
      merchant: "City Pharmacy",
      location: "712 Oak Ave",
      currency: "USD"
    },
    {
      id: "txn-7",
      description: "Vending Machine",
      amount: 2.00,
      type: "payment",
      status: "failed",
      date: "2025-03-28T15:11:27Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Office Vending",
      location: "Work Building, Floor 3",
      currency: "USD"
    },
    // Adding more transactions to build better insights
    {
      id: "txn-8",
      description: "Restaurant Dinner",
      amount: 45.50,
      type: "payment",
      status: "completed",
      date: "2025-03-25T19:22:11Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Italian Restaurant",
      location: "210 Pine Boulevard",
      currency: "USD"
    },
    {
      id: "txn-9",
      description: "Coffee Purchase",
      amount: 5.25,
      type: "payment",
      status: "completed",
      date: "2025-03-24T08:12:55Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Downtown Cafe",
      location: "123 Main St",
      currency: "USD"
    },
    {
      id: "txn-10",
      description: "Movie Tickets",
      amount: 24.00,
      type: "payment",
      status: "completed",
      date: "2025-03-20T20:05:32Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Cineplex",
      location: "Mall of Entertainment",
      currency: "USD"
    },
    // Additional transaction with anomaly
    {
      id: "txn-11",
      description: "Unusual Purchase",
      amount: 299.99,
      type: "payment",
      status: "completed",
      date: "2025-04-05T10:45:22Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Electronics Store",
      location: "Tech Mall",
      flagged: true,
      flagReason: "Amount significantly higher than average spending",
      currency: "USD"
    }
  ]);

  const [insights, setInsights] = useState<{
    monthlyInsights: any[];
    flaggedTransactions: Transaction[];
    recommendations: any[];
  }>({
    monthlyInsights: [],
    flaggedTransactions: [],
    recommendations: []
  });

  useEffect(() => {
    // Generate insights when transactions change
    const monthlyInsights = generateMonthlyInsights(transactions);
    
    // Find flagged transactions
    const flagged = transactions.filter(t => t.flagged);
    
    // Get personalized recommendations
    const recommendations = getPersonalizedRecommendations(transactions);
    
    setInsights({
      monthlyInsights,
      flaggedTransactions: flagged,
      recommendations
    });
  }, [transactions]);

  // Simulate a new transaction to demonstrate fraud detection
  const simulateTransaction = () => {
    const newTransaction: Transaction = {
      id: `txn-${transactions.length + 1}`,
      description: "Unusual Activity",
      amount: 500.00,
      type: "payment",
      status: "completed",
      date: new Date().toISOString(),
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Unknown Merchant",
      location: "Distant Location",
      currency: "USD"
    };
    
    const anomalyCheck = detectAnomalies(transactions, newTransaction);
    
    if (anomalyCheck.isAnomaly) {
      newTransaction.flagged = true;
      newTransaction.flagReason = anomalyCheck.reasons.join("; ");
    }
    
    setTransactions([...transactions, newTransaction]);
    
    if (anomalyCheck.isAnomaly) {
      toast({
        title: "Potential Fraudulent Activity Detected",
        description: anomalyCheck.reasons[0],
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-rfid-blue mb-2">AI Insights</h1>
      <p className="text-gray-600 mb-8">Smart analysis of your payment activity</p>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Protection</TabsTrigger>
          <TabsTrigger value="behavior">Spending Analysis</TabsTrigger>
          <TabsTrigger value="offers">Personalized Offers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-rfid-blue text-lg">Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                {insights.monthlyInsights.length > 0 ? (
                  <div className="flex items-center">
                    {insights.monthlyInsights[0].difference > 0 ? (
                      <TrendingUp className="h-8 w-8 text-red-500 mr-3" />
                    ) : (
                      <TrendingDown className="h-8 w-8 text-green-500 mr-3" />
                    )}
                    <p>{insights.monthlyInsights[0].message}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Not enough data to analyze monthly trends</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-rfid-blue text-lg">Potential Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {insights.flaggedTransactions.length > 0 ? (
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-amber-500 mr-3" />
                    <p>{insights.flaggedTransactions.length} suspicious {insights.flaggedTransactions.length === 1 ? 'transaction' : 'transactions'} detected</p>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 mr-2">Secure</Badge>
                    <p className="text-gray-500">No suspicious activity detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-rfid-blue text-lg">Top Merchants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {getTopMerchants(transactions).map((merchant, i) => (
                  <div key={i} className="flex items-center">
                    <ShoppingBag className="h-4 w-4 mr-2 text-gray-400" />
                    <span>{merchant}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Demo: Fraud Detection</CardTitle>
              <CardDescription>Simulate a suspicious transaction to see our AI fraud detection in action</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Button onClick={simulateTransaction} className="bg-rfid-teal hover:bg-rfid-blue">
                Simulate Unusual Transaction
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fraud" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Protection System</CardTitle>
              <CardDescription>Our AI constantly monitors for unusual activity on your cards</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <h3 className="font-semibold text-xl text-rfid-blue">How Our System Works</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <AlertTriangle className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Anomaly Detection</h4>
                    <p className="text-gray-600">We analyze your typical spending patterns and flag unusual activities</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <MapPin className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Location Intelligence</h4>
                    <p className="text-gray-600">Our system detects when your card is used in multiple locations within a short time</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <BarChart className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Spending Pattern Analysis</h4>
                    <p className="text-gray-600">We flag transactions that don't match your usual spending habits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Flagged Transactions</CardTitle>
              <CardDescription>Transactions our AI system has identified as potentially suspicious</CardDescription>
            </CardHeader>
            <CardContent>
              {insights.flaggedTransactions.length > 0 ? (
                <div className="space-y-4">
                  {insights.flaggedTransactions.map(txn => (
                    <div key={txn.id} className="flex items-center p-4 border rounded-lg bg-red-50 border-red-200">
                      <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
                      <div className="flex-grow">
                        <h4 className="font-medium">{txn.description}</h4>
                        <p className="text-gray-600">{txn.merchant} • {new Date(txn.date).toLocaleString()}</p>
                        <p className="text-red-600 text-sm mt-1">{txn.flagReason}</p>
                      </div>
                      <div className="text-xl font-bold text-red-700">${txn.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                    <Badge className="bg-green-500">✓</Badge>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">No Suspicious Activity</h3>
                  <p className="text-gray-500 mt-2">Your account is secure. We'll notify you if we detect any unusual transactions.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="behavior" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Patterns & Behavior</CardTitle>
              <CardDescription>AI-powered insights about your spending habits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 mr-2 text-rfid-teal" />
                    <h3 className="font-medium">Monthly Analysis</h3>
                  </div>
                  {insights.monthlyInsights.length > 0 ? (
                    <div>
                      <p className="text-gray-800">
                        {insights.monthlyInsights[0].message}
                      </p>
                      <div className="mt-2 flex items-center">
                        {insights.monthlyInsights[0].difference > 0 ? (
                          <span className="text-red-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-1" /> 
                            {Math.abs(insights.monthlyInsights[0].difference).toFixed(0)}% increase
                          </span>
                        ) : (
                          <span className="text-green-500 flex items-center">
                            <TrendingDown className="h-4 w-4 mr-1" /> 
                            {Math.abs(insights.monthlyInsights[0].difference).toFixed(0)}% decrease
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Not enough data for monthly analysis yet</p>
                  )}
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <ShoppingBag className="h-5 w-5 mr-2 text-rfid-teal" />
                    <h3 className="font-medium">Spending Categories</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Food & Drink</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-rfid-teal rounded-full" style={{width: "65%"}}></div>
                        </div>
                        <span className="text-sm text-gray-600">65%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Transport</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-rfid-blue rounded-full" style={{width: "20%"}}></div>
                        </div>
                        <span className="text-sm text-gray-600">20%</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Shopping</span>
                      <div className="flex items-center">
                        <div className="w-20 h-2 bg-gray-200 rounded-full mr-2">
                          <div className="h-full bg-purple-500 rounded-full" style={{width: "15%"}}></div>
                        </div>
                        <span className="text-sm text-gray-600">15%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <LineChart className="h-5 w-5 mr-2 text-rfid-teal" />
                  <h3 className="font-medium">Behavior Analysis</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">You visit <span className="font-medium">Downtown Cafe</span> more frequently than any other merchant</p>
                  <p className="text-gray-600">Your average transaction amount is <span className="font-medium">${(transactions.filter(t => t.type === "payment").reduce((sum, t) => sum + t.amount, 0) / transactions.filter(t => t.type === "payment").length).toFixed(2)}</span></p>
                  <p className="text-gray-600">You typically make payments in the <span className="font-medium">afternoon</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Recommendations</CardTitle>
              <CardDescription>Personalized offers based on your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {insights.recommendations.map((rec, i) => (
                  <Card key={i} className="border-2 border-rfid-teal/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle>{rec.title}</CardTitle>
                        {rec.discount && (
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                            {rec.discount}
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{rec.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {rec.merchant && (
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <ShoppingBag className="h-4 w-4 mr-1" /> {rec.merchant}
                        </div>
                      )}
                      {rec.category && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Tag className="h-4 w-4 mr-1" /> {rec.category}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full border-rfid-teal text-rfid-teal hover:bg-rfid-teal hover:text-white">
                        View Offer
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How Recommendations Work</CardTitle>
              <CardDescription>Our AI analyzes your spending patterns to provide relevant offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <ShoppingBag className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Merchant Analysis</h4>
                    <p className="text-gray-600">We identify your most frequently visited merchants and find relevant deals</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <Tag className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Category Preferences</h4>
                    <p className="text-gray-600">We analyze spending categories to recommend relevant offers</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-rfid-teal/10 p-2 rounded-full mr-3">
                    <Calendar className="h-6 w-6 text-rfid-teal" />
                  </div>
                  <div>
                    <h4 className="font-medium">Seasonal Offers</h4>
                    <p className="text-gray-600">We provide timely recommendations based on your spending patterns and the time of year</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIInsights;
