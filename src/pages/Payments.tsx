
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, CreditCard, Search, ArrowDown, ArrowUp, Filter, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface TransactionType {
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
}

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");

  const transactions: TransactionType[] = [
    {
      id: "txn-1",
      description: "Coffee Shop Purchase",
      amount: 4.75,
      type: "payment",
      status: "completed",
      date: "2025-04-04T09:15:32Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Downtown Cafe",
      location: "123 Main St"
    },
    {
      id: "txn-2",
      description: "Transportation Fare",
      amount: 2.50,
      type: "payment",
      status: "completed",
      date: "2025-04-03T17:45:12Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Metro Transit",
      location: "Central Station"
    },
    {
      id: "txn-3",
      description: "Card Top Up",
      amount: 50.00,
      type: "topup",
      status: "completed",
      date: "2025-04-02T14:33:22Z",
      cardId: "card-1",
      cardName: "My Primary Card"
    },
    {
      id: "txn-4",
      description: "Grocery Purchase",
      amount: 32.45,
      type: "payment",
      status: "completed",
      date: "2025-04-01T18:22:43Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "FreshMart",
      location: "500 Elm Street"
    },
    {
      id: "txn-5",
      description: "Card Top Up",
      amount: 25.00,
      type: "topup",
      status: "completed",
      date: "2025-03-30T11:17:35Z",
      cardId: "card-2",
      cardName: "Backup Tag"
    },
    {
      id: "txn-6",
      description: "Pharmacy Purchase",
      amount: 18.99,
      type: "payment",
      status: "completed",
      date: "2025-03-29T13:42:09Z",
      cardId: "card-2",
      cardName: "Backup Tag",
      merchant: "City Pharmacy",
      location: "712 Oak Ave"
    },
    {
      id: "txn-7",
      description: "Vending Machine",
      amount: 2.00,
      type: "payment",
      status: "failed",
      date: "2025-03-28T15:11:27Z",
      cardId: "card-1",
      cardName: "My Primary Card",
      merchant: "Office Vending",
      location: "Work Building, Floor 3"
    }
  ];

  const filteredTransactions = transactions
    .filter(txn => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        txn.description.toLowerCase().includes(searchLower) ||
        txn.cardName.toLowerCase().includes(searchLower) ||
        txn.merchant?.toLowerCase().includes(searchLower) ||
        txn.location?.toLowerCase().includes(searchLower);
      
      // Date filter
      const txnDate = new Date(txn.date);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      
      let matchesDate = true;
      if (dateFilter === "today") {
        matchesDate = txnDate.toDateString() === today.toDateString();
      } else if (dateFilter === "yesterday") {
        matchesDate = txnDate.toDateString() === yesterday.toDateString();
      } else if (dateFilter === "week") {
        matchesDate = txnDate >= lastWeek;
      } else if (dateFilter === "month") {
        matchesDate = txnDate >= lastMonth;
      }
      
      return matchesSearch && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy 'at' h:mm a");
  };

  const getTransactionIcon = (type: string) => {
    return type === "payment" ? 
      <ArrowUp className="h-5 w-5 text-red-500" /> : 
      <ArrowDown className="h-5 w-5 text-green-500" />;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-rfid-blue">Payment History</h1>
          <p className="text-gray-600 mt-2">View and manage your transaction history</p>
        </div>
        <Button className="bg-rfid-teal hover:bg-rfid-blue">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Transactions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="topups">Top Ups</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Transaction Filters</CardTitle>
              <CardDescription>Narrow down your transaction history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={dateFilter === "all" ? "default" : "outline"}
                    size="sm"
                    className={dateFilter === "all" ? "bg-rfid-teal hover:bg-rfid-blue" : ""}
                    onClick={() => setDateFilter("all")}
                  >
                    All Time
                  </Button>
                  <Button 
                    variant={dateFilter === "today" ? "default" : "outline"}
                    size="sm"
                    className={dateFilter === "today" ? "bg-rfid-teal hover:bg-rfid-blue" : ""}
                    onClick={() => setDateFilter("today")}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={dateFilter === "week" ? "default" : "outline"}
                    size="sm"
                    className={dateFilter === "week" ? "bg-rfid-teal hover:bg-rfid-blue" : ""}
                    onClick={() => setDateFilter("week")}
                  >
                    Last 7 Days
                  </Button>
                  <Button 
                    variant={dateFilter === "month" ? "default" : "outline"}
                    size="sm"
                    className={dateFilter === "month" ? "bg-rfid-teal hover:bg-rfid-blue" : ""}
                    onClick={() => setDateFilter("month")}
                  >
                    Last 30 Days
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {filteredTransactions.length > 0 ? (
            <div className="space-y-4">
              {filteredTransactions.map(txn => (
                <Card key={txn.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-4">
                          {getTransactionIcon(txn.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{txn.description}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{formatDate(txn.date)}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <CreditCard className="h-3 w-3 mr-1" /> {txn.cardName}
                            </span>
                          </div>
                          {txn.merchant && (
                            <div className="text-sm text-gray-500 mt-1">
                              {txn.merchant} {txn.location && `(${txn.location})`}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${txn.type === "payment" ? "text-red-600" : "text-green-600"}`}>
                          {txn.type === "payment" ? "-" : "+"} ${txn.amount.toFixed(2)}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`
                            ${txn.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : 
                              txn.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                              "bg-red-50 text-red-700 border-red-200"}
                          `}
                        >
                          {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700">No transactions found</h3>
                <p className="text-gray-500 mt-2 text-center max-w-md">
                  We couldn't find any transactions matching your search criteria. Try adjusting your filters.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="payments">
          {/* Similar content as 'all' tab but filtered for payment transactions */}
          <Card>
            <CardContent className="pt-6">
              <p>View of payment transactions only will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topups">
          {/* Similar content as 'all' tab but filtered for top up transactions */}
          <Card>
            <CardContent className="pt-6">
              <p>View of top up transactions only will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
