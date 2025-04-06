
import { Transaction } from "@/types/transaction";
import { dbService } from "./dbService";
import { 
  detectFraudulentTransaction, 
  generateTransactionInsights 
} from "@/utils/aiFeatures/fraudDetection";
import { 
  recommendProducts 
} from "@/utils/aiFeatures/recommendationEngine";
import { 
  analyzeUserBehavior 
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
    // Analyze for fraud
    const isFraudulent = detectFraudulentTransaction(transaction);
    
    if (isFraudulent) {
      aiService.addInsight({
        userId: transaction.userId,
        type: "fraud",
        title: "Suspicious Transaction Detected",
        description: `We detected unusual activity for your transaction of ${transaction.amount} at ${transaction.merchant}. Please verify this transaction.`,
        severity: "high"
      });
    }
    
    // Generate transaction insights
    const insight = generateTransactionInsights(transaction);
    if (insight) {
      aiService.addInsight({
        userId: transaction.userId,
        type: "spending",
        title: "Spending Pattern Insight",
        description: insight,
        severity: "low"
      });
    }
  },
  
  generateRecommendations: (userId: string): void => {
    // Get user transactions
    const transactions = dbService.getTransactionsByUserId(userId);
    
    // Generate product recommendations
    const recommendations = recommendProducts(transactions);
    
    if (recommendations && recommendations.length > 0) {
      recommendations.forEach(recommendation => {
        aiService.addInsight({
          userId,
          type: "recommendation",
          title: "Personalized Recommendation",
          description: recommendation,
          severity: "low"
        });
      });
    }
  },
  
  analyzeUserBehavior: (userId: string): void => {
    // Get user transactions
    const transactions = dbService.getTransactionsByUserId(userId);
    
    // Analyze user behavior
    const behaviorInsights = analyzeUserBehavior(transactions);
    
    if (behaviorInsights && behaviorInsights.length > 0) {
      behaviorInsights.forEach(insight => {
        aiService.addInsight({
          userId,
          type: "behavior",
          title: "User Behavior Insight",
          description: insight,
          severity: "medium"
        });
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
