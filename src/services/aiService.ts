
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
    // Get user's previous transactions for context
    const userTransactions = dbService.getTransactionsByUserId(transaction.userId);
    
    // Analyze for fraud using detectAnomalies instead of detectFraudulentTransaction
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
          severity: "low"
        });
      }
    }
  },
  
  generateRecommendations: (userId: string): void => {
    // Get user transactions
    const transactions = dbService.getTransactionsByUserId(userId);
    
    // Generate product recommendations
    const recommendations = getPersonalizedRecommendations(transactions);
    
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
    
    // Generate monthly spending insights
    const monthlyInsights = generateMonthlyInsights(transactions);
    
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
    const topMerchants = getTopMerchants(transactions);
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
        description: 'Your spending is 20% higher this month compared to last month.',
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

// Initialize demo insights
initializeAIInsights();
