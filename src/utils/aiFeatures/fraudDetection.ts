
import { Transaction } from "../../types/transaction";

// Simple anomaly detection based on user patterns
export const detectAnomalies = (
  transactions: Transaction[],
  newTransaction: Transaction
): { isAnomaly: boolean; reasons: string[] } => {
  if (transactions.length < 5) {
    // Not enough history to detect anomalies
    return { isAnomaly: false, reasons: [] };
  }

  const reasons: string[] = [];
  
  // Check for duplicate transactions (same card used in multiple locations in a short time)
  const last30Minutes = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const recentTransactions = transactions.filter(
    t => t.date > last30Minutes && t.cardId === newTransaction.cardId
  );
  
  if (recentTransactions.length > 0) {
    // Find transactions in different locations
    const differentLocations = recentTransactions.some(t => 
      t.location && newTransaction.location && t.location !== newTransaction.location
    );
    
    if (differentLocations) {
      reasons.push("Card used in multiple locations within 30 minutes");
    }
  }
  
  // Check for unusually large transactions
  const userAvgAmount = transactions
    .filter(t => t.type === "payment" && t.cardId === newTransaction.cardId)
    .reduce((sum, t) => sum + t.amount, 0) / 
    transactions.filter(t => t.type === "payment" && t.cardId === newTransaction.cardId).length;
  
  if (newTransaction.amount > userAvgAmount * 3) {
    reasons.push(`Transaction amount (${newTransaction.amount.toFixed(2)}) is significantly higher than your average (${userAvgAmount.toFixed(2)})`);
  }

  // Check for unusual merchant category
  const userMerchants = new Set(
    transactions
      .filter(t => t.merchant && t.cardId === newTransaction.cardId)
      .map(t => t.merchant)
  );
  
  if (newTransaction.merchant && !userMerchants.has(newTransaction.merchant) && userMerchants.size > 3) {
    reasons.push(`First time transaction with merchant: ${newTransaction.merchant}`);
  }

  return {
    isAnomaly: reasons.length > 0,
    reasons
  };
};
