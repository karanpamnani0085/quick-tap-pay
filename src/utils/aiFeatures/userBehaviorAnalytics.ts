
import { Transaction } from "../../types/transaction";

interface SpendingInsight {
  type: "average" | "comparison" | "pattern";
  message: string;
  difference?: number;
}

export const generateLocationInsights = (
  transactions: Transaction[],
  location: string
): SpendingInsight | null => {
  const locationTransactions = transactions.filter(
    t => t.location === location && t.type === "payment"
  );
  
  if (locationTransactions.length < 2) return null;
  
  const totalSpent = locationTransactions.reduce((sum, t) => sum + t.amount, 0);
  const avgSpent = totalSpent / locationTransactions.length;
  
  return {
    type: "average",
    message: `You typically spend $${avgSpent.toFixed(2)} at ${location}`
  };
};

export const generateMonthlyInsights = (
  transactions: Transaction[]
): SpendingInsight[] => {
  const insights: SpendingInsight[] = [];
  
  // Current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
  // Filter transactions for current and previous month
  const currentMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && 
           date.getFullYear() === currentYear &&
           t.type === "payment";
  });
  
  const previousMonthTransactions = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getMonth() === lastMonth && 
           date.getFullYear() === lastMonthYear &&
           t.type === "payment";
  });
  
  // Calculate spending totals
  const currentMonthTotal = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  const previousMonthTotal = previousMonthTransactions.reduce((sum, t) => sum + t.amount, 0);
  
  // Only add insight if we have data for both months
  if (previousMonthTotal > 0 && currentMonthTotal > 0) {
    const difference = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
    
    insights.push({
      type: "comparison",
      message: `Your spending ${difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(difference).toFixed(0)}% compared to last month`,
      difference: difference
    });
  }
  
  return insights;
};

export const getTopMerchants = (transactions: Transaction[]): string[] => {
  const merchantCounts: Record<string, number> = {};
  
  transactions.forEach(t => {
    if (t.merchant) {
      merchantCounts[t.merchant] = (merchantCounts[t.merchant] || 0) + 1;
    }
  });
  
  return Object.entries(merchantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([merchant]) => merchant);
};
