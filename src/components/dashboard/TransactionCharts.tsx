import React, { useEffect, useState } from 'react';
import { dbService } from "@/services/dbService";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TransactionData {
  name: string;
  amount: number;
}

const TransactionCharts = () => {
  const { user } = useAuth();
  const [transactionData, setTransactionData] = useState<TransactionData[]>([]);

  useEffect(() => {
    if (user) {
      const transactions = dbService.getTransactionsByUserId(user.id);
      
      // Aggregate transaction amounts by category
      const categoryTotals: { [category: string]: number } = {};
      transactions.forEach(transaction => {
        const category = transaction.category || 'Uncategorized';
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
      });
      
      // Convert category totals to array format for Recharts
      const data: TransactionData[] = Object.keys(categoryTotals).map(category => ({
        name: category,
        amount: categoryTotals[category]
      }));
      
      setTransactionData(data);
    }
  }, [user]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={transactionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionCharts;
