
export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "payment" | "topup";
  status: "completed" | "pending" | "failed";
  date: string;
  cardId: string;
  cardName: string;
  merchant?: string;
  location?: string;
  flagged?: boolean;
  flagReason?: string;
}
