
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "payment" | "transfer" | "topup";
  status: "pending" | "completed" | "failed";
  date: string;
  cardId: string;
  cardName: string;
  merchant?: string;
  location?: string;
  category?: string;
  currency: string;
}
