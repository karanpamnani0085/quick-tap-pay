
import { Transaction } from "@/types/transaction";
import { dbService } from "./dbService";
import { 
  detectAnomalies
} from "@/utils/aiFeatures/fraudDetection";
import { 
  getPersonalizedRecommendations 
} from "@/utils/aiFeatures/recommendationEngine";
import { 
  generateLocationInsights,
  generateMonthlyInsights,
  getTopMerchants
} from "@/utils/aiFeatures/userBehaviorAnalytics";

export interface AIInsight {
  id: string;
  userId: string;
  type: "fraud" | "spending" | "recommendation" | "behavior";
  title: string;
  description: string;
  timestamp: string;
  severity?: "low" | "medium" | "high";
  isRead: boolean;
}

// Mock local storage for AI insights
export const aiService = {
  // Store and retrieve AI insights
  getInsights: (userId: string): AIInsight[] => {
    const insights = localStorage.getItem('ai_insights');
    const allInsights = insights ? JSON.parse(insights) : [];
    return allInsights.filter((insight: AIInsight) => insight.userId === userId);
  },
  
  addInsight: (insight: Omit<AIInsight, "id" | "timestamp" | "isRead">): AIInsight => {
    const insights = localStorage.getItem('ai_insights');
    const allInsights = insights ? JSON.parse(insights) : [];
    
    const newInsight: AIInsight = {
      ...insight,
      id: `insight-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    localStorage.setItem('ai_insights', JSON.stringify([...allInsights, newInsight]));
    return newInsight;
  },
  
  markInsightAsRead: (insightId: string): boolean => {
    const insights = localStorage.getItem('ai_insights');
    const allInsights = insights ? JSON.parse(insights) : [];
    
    const updatedInsights = allInsights.map((insight: AIInsight) => {
      if (insight.id === insightId) {
        return { ...insight, isRead: true };
      }
      return insight;
    });
    
    localStorage.setItem('ai_insights', JSON.stringify(updatedInsights));
    return true;
  },
  
  // Real-time analysis functions
  analyzeTransaction: (transaction: Transaction & { userId: string }): void => {
    // Only analyze payment transactions
    if (transaction.type !== "payment") return;
    
    // Get user's previous transactions for context
    const userTransactions = dbService.getTransactionsByUserId(transaction.userId);
    
    // Analyze for fraud using detectAnomalies
    const anomalyResult = detectAnomalies(userTransactions, transaction);
    
    if (anomalyResult.isAnomaly) {
      aiService.addInsight({
        userId: transaction.userId,
        type: "fraud",
        title: "Suspicious Transaction Detected",
        description: `We detected unusual activity: ${anomalyResult.reasons.join(". ")}`,
        severity: "high"
      });
    }
    
    // Generate location insights
    if (transaction.location) {
      const locationInsight = generateLocationInsights(userTransactions, transaction.location);
      if (locationInsight) {
        aiService.addInsight({
          userId: transaction.userId,
          type: "spending",
          title: "Location Spending Pattern",
          description: locationInsight.message,
          severity: locationInsight.message.includes("double") ? "medium" : "low"
        });
      }
    }
  },
  
  generateRecommendations: (userId: string): void => {
    // Get user transactions
    const transactions = dbService.getTransactionsByUserId(userId);
    
    // Only proceed if we have payment transactions to analyze
    const paymentTransactions = transactions.filter(t => t.type === "payment");
    if (paymentTransactions.length === 0) return;
    
    // Generate product recommendations
    const recommendations = getPersonalizedRecommendations(paymentTransactions);
    
    if (recommendations && recommendations.length > 0) {
      recommendations.forEach(recommendation => {
        aiService.addInsight({
          userId,
          type: "recommendation",
          title: recommendation.title || "Personalized Recommendation",
          description: recommendation.description,
          severity: "low"
        });
      });
    }
  },
  
  analyzeUserBehavior: (userId: string): void => {
    // Get user transactions
    const transactions = dbService.getTransactionsByUserId(userId);
    
    // Only proceed if we have payment transactions to analyze
    const paymentTransactions = transactions.filter(t => t.type === "payment");
    if (paymentTransactions.length === 0) return;
    
    // Generate monthly spending insights
    const monthlyInsights = generateMonthlyInsights(paymentTransactions);
    
    if (monthlyInsights && monthlyInsights.length > 0) {
      monthlyInsights.forEach(insight => {
        aiService.addInsight({
          userId,
          type: "behavior",
          title: "Monthly Spending Analysis",
          description: insight.message,
          severity: insight.difference && Math.abs(insight.difference) > 20 ? "medium" : "low"
        });
      });
    }
    
    // Analyze top merchants
    const topMerchants = getTopMerchants(paymentTransactions);
    if (topMerchants.length > 0) {
      aiService.addInsight({
        userId,
        type: "behavior",
        title: "Your Favorite Places",
        description: `Your top merchants are: ${topMerchants.join(", ")}`,
        severity: "low"
      });
    }
  },
  
  // Run all analyses at once
  runFullAnalysis: (userId: string): void => {
    aiService.generateRecommendations(userId);
    aiService.analyzeUserBehavior(userId);
  }
};

// Initialize some demo AI insights
export const initializeAIInsights = (): void => {
  if (!localStorage.getItem('ai_insights')) {
    const demoInsights: AIInsight[] = [
      {
        id: 'insight-1',
        userId: '1',
        type: 'spending',
        title: 'Monthly Spending Alert',
        description: 'Your spending is 20% higher this month compared to last month. You spent ₹4,750.50 in April versus ₹3,958.75 in March.',
        timestamp: '2025-04-04T15:32:00Z',
        severity: 'medium',
        isRead: false
      },
      {
        id: 'insight-2',
        userId: '1',
        type: 'recommendation',
        title: 'Recommended Service',
        description: 'Based on your recent transactions, you might be interested in our Automatic Bill Payment service.',
        timestamp: '2025-04-03T09:15:00Z',
        severity: 'low',
        isRead: true
      }
    ];
    
    localStorage.setItem('ai_insights', JSON.stringify(demoInsights));
  }
};

// Initialize demo insights when the service is loaded
initializeAIInsights();

// Add sample transactions to help AI features work better
const addSampleTransactions = () => {
  const existingTransactions = localStorage.getItem('transactions');
  if (existingTransactions) {
    const parsedTransactions = JSON.parse(existingTransactions);
    
    // Only add sample data if we have less than 5 transactions
    if (parsedTransactions.length < 5) {
      const sampleTransactions = [
        {
          id: 'tx-3',
          description: 'Restaurant Dinner',
          amount: 850,
          type: 'payment',
          status: 'completed',
          date: '2025-04-02T20:15:00Z',
          cardId: 'card-1',
          cardName: 'My Primary Card',
          merchant: 'Taj Restaurant',
          location: 'Mumbai',
          userId: '1',
          currency: 'INR'
        },
        {
          id: 'tx-4',
          description: 'Movie Tickets',
          amount: 600,
          type: 'payment',
          status: 'completed',
          date: '2025-04-03T18:30:00Z',
          cardId: 'card-1',
          cardName: 'My Primary Card',
          merchant: 'PVR Cinemas',
          location: 'Delhi',
          userId: '1',
          currency: 'INR'
        },
        {
          id: 'tx-5',
          description: 'Grocery Shopping',
          amount: 1200,
          type: 'payment',
          status: 'completed',
          date: '2025-03-25T11:45:00Z',
          cardId: 'card-1',
          cardName: 'My Primary Card',
          merchant: 'Big Bazaar',
          location: 'Mumbai',
          userId: '1',
          currency: 'INR'
        },
        {
          id: 'tx-6',
          description: 'Top-up',
          amount: 3000,
          type: 'topup',
          status: 'completed',
          date: '2025-03-20T09:30:00Z',
          cardId: 'card-1',
          cardName: 'My Primary Card',
          userId: '1',
          currency: 'INR'
        }
      ];
      
      localStorage.setItem('transactions', JSON.stringify([...parsedTransactions, ...sampleTransactions]));
    }
  }
};

// Add sample transactions
addSampleTransactions();
