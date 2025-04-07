
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, Pie, Cell } from "recharts";
import { dbService } from "@/services/dbService";
import { useAuth } from "@/contexts/AuthContext";
import { Transaction } from "@/types/transaction";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const TransactionCharts = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [chartType, setChartType] = useState<"spending" | "category" | "timeline">("spending");
  
  useEffect(() => {
    if (user) {
      const userTransactions = dbService.getTransactionsByUserId(user.id);
      // Filter to payment-related transactions only
      const paymentTransactions = userTransactions.filter(tx => 
        ['payment', 'transfer', 'topup'].includes(tx.type)
      );
      setTransactions(paymentTransactions);
    }
  }, [user]);
  
  // Prepare data for spending by category chart
  const getCategoryData = () => {
    const categoryMap: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + transaction.amount;
    });
    
    return Object.keys(categoryMap).map(key => ({
      name: key,
      value: categoryMap[key]
    }));
  };
  
  // Prepare data for spending timeline
  const getTimelineData = () => {
    const now = new Date();
    const timeframeMap: Record<string, { date: string, spending: number }> = {};
    
    // Define date format based on timeframe
    let dateFormat: Intl.DateTimeFormatOptions;
    let daysToLookBack: number;
    
    switch (timeframe) {
      case 'week':
        dateFormat = { weekday: 'short' };
        daysToLookBack = 7;
        break;
      case 'month':
        dateFormat = { day: '2-digit' };
        daysToLookBack = 30;
        break;
      case 'year':
        dateFormat = { month: 'short' };
        daysToLookBack = 365;
        break;
    }
    
    // Initialize timeframe map with empty values
    for (let i = daysToLookBack - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let key: string;
      if (timeframe === 'year') {
        key = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
      } else {
        key = new Intl.DateTimeFormat('en-US', dateFormat).format(date);
      }
      
      if (!timeframeMap[key]) {
        timeframeMap[key] = { date: key, spending: 0 };
      }
    }
    
    // Populate with actual transaction data
    transactions.forEach(transaction => {
      const txDate = new Date(transaction.date);
      
      // Skip transactions outside our timeframe
      const daysDiff = Math.floor((now.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysDiff > daysToLookBack) return;
      
      let key: string;
      if (timeframe === 'year') {
        key = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(txDate);
      } else {
        key = new Intl.DateTimeFormat('en-US', dateFormat).format(txDate);
      }
      
      if (timeframeMap[key]) {
        timeframeMap[key].spending += transaction.amount;
      }
    });
    
    return Object.values(timeframeMap);
  };
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Transaction Analysis</CardTitle>
        <CardDescription>Visualize your spending patterns and transaction history</CardDescription>
        <div className="flex flex-wrap justify-between gap-2 pt-4">
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as any)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="spending">Spending</TabsTrigger>
              <TabsTrigger value="category">Categories</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)} className="w-full sm:w-auto">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <>
            {chartType === "category" && (
              <ChartContainer className="h-80" config={{}}>
                <PieChart>
                  <Pie
                    data={getCategoryData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getCategoryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ChartContainer>
            )}
            
            {chartType === "timeline" && (
              <ChartContainer className="h-80" config={{}}>
                <LineChart data={getTimelineData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spending"
                    stroke="#0088FE"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ChartContainer>
            )}
            
            {chartType === "spending" && (
              <ChartContainer className="h-80" config={{}}>
                <BarChart data={getTimelineData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="spending" fill="#00C49F" />
                </BarChart>
              </ChartContainer>
            )}
          </>
        ) : (
          <div className="text-center py-10 text-gray-500">
            <p>No transaction data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionCharts;
