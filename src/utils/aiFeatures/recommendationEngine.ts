
import { Transaction } from "../../types/transaction";

interface Recommendation {
  title: string;
  description: string;
  discount?: string;
  merchant?: string;
  category?: string;
}

export const getPersonalizedRecommendations = (
  transactions: Transaction[]
): Recommendation[] => {
  if (transactions.length < 5) {
    return [
      {
        title: "Welcome to QuickTapPay!",
        description: "Start using your card to get personalized recommendations."
      }
    ];
  }
  
  const recommendations: Recommendation[] = [];
  
  // Find most visited merchant
  const merchantCounts: Record<string, number> = {};
  transactions
    .filter(t => t.merchant && t.type === "payment")
    .forEach(t => {
      if (t.merchant) {
        merchantCounts[t.merchant] = (merchantCounts[t.merchant] || 0) + 1;
      }
    });
  
  const topMerchants = Object.entries(merchantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([merchant]) => merchant);
  
  if (topMerchants.length > 0) {
    recommendations.push({
      title: `${topMerchants[0]} Special Deal`,
      description: "Based on your frequent visits, you might enjoy this offer",
      discount: "10% off on your next purchase",
      merchant: topMerchants[0]
    });
  }
  
  // Categorize spending
  const categories: Record<string, number> = {
    "Food & Drink": 0,
    "Transport": 0,
    "Shopping": 0
  };
  
  transactions.forEach(t => {
    if (t.merchant) {
      if (t.merchant.includes("Cafe") || t.merchant.includes("Restaurant") || t.merchant.includes("Market")) {
        categories["Food & Drink"] += t.amount;
      } else if (t.merchant.includes("Transit") || t.merchant.includes("Metro")) {
        categories["Transport"] += t.amount;
      } else {
        categories["Shopping"] += t.amount;
      }
    }
  });
  
  // Offer based on top category
  const topCategory = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])[0][0];
  
  recommendations.push({
    title: `${topCategory} Rewards`,
    description: `Earn extra cashback on ${topCategory.toLowerCase()} purchases`,
    category: topCategory
  });
  
  return recommendations;
};
