
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
  
  // Get the most recent transaction amount for this location
  const latestTransaction = locationTransactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];
  
  // If latest transaction is more than double the average
  if (latestTransaction.amount > avgSpent * 2) {
    return {
      type: "average",
      message: `You spent ₹${latestTransaction.amount.toFixed(2)} at ${location}, which is more than double your average spending of ₹${avgSpent.toFixed(2)} at this location`
    };
  }
  
  return {
    type: "average",
    message: `You typically spend ₹${avgSpent.toFixed(2)} at ${location}`
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
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    insights.push({
      type: "comparison",
      message: `Your spending ${difference > 0 ? 'increased' : 'decreased'} by ${Math.abs(difference).toFixed(0)}% compared to last month. You spent ₹${currentMonthTotal.toFixed(2)} in ${monthNames[currentMonth]} versus ₹${previousMonthTotal.toFixed(2)} in ${monthNames[lastMonth]}.`,
      difference: difference
    });
  }
  
  return insights;
};

export const getTopMerchants = (transactions: Transaction[]): string[] => {
  const merchantCounts: Record<string, number> = {};
  
  transactions.forEach(t => {
    if (t.merchant && t.type === "payment") {
      merchantCounts[t.merchant] = (merchantCounts[t.merchant] || 0) + 1;
    }
  });
  
  return Object.entries(merchantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([merchant]) => merchant);
};
