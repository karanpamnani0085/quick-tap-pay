
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, CreditCard, Search, ArrowDown, ArrowUp, Filter, Download, IndianRupee } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Transaction } from "@/types/transaction";
import { dbService } from "@/services/dbService";
import { useAuth } from "@/contexts/AuthContext";

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { user } = useAuth();

  // Fetch transactions when component mounts or when user changes
  useEffect(() => {
    if (user) {
      const userTransactions = dbService.getTransactionsByUserId(user.id);
      setTransactions(userTransactions);
    } else {
      // If not logged in, use demo transactions or empty array
      setTransactions(dbService.getAllTransactions());
    }
  }, [user]);

  const filteredTransactions = transactions
    .filter(txn => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        txn.description.toLowerCase().includes(searchLower) ||
        txn.cardName.toLowerCase().includes(searchLower) ||
        txn.merchant?.toLowerCase().includes(searchLower) ||
        txn.location?.toLowerCase().includes(searchLower);
      
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

  const handleExportTransactions = () => {
    const csvContent = [
      ["Date", "Description", "Amount", "Type", "Status", "Card", "Merchant", "Location"].join(","),
      ...filteredTransactions.map(txn => [
        new Date(txn.date).toLocaleDateString(),
        txn.description,
        txn.amount.toFixed(2),
        txn.type,
        txn.status,
        txn.cardName,
        txn.merchant || "",
        txn.location || ""
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-rfid-blue">Payment History</h1>
          <p className="text-gray-600 mt-2">View and manage your transaction history</p>
        </div>
        <Button className="bg-rfid-teal hover:bg-rfid-blue" onClick={handleExportTransactions}>
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
                        <div className={`text-lg font-bold ${txn.type === "payment" ? "text-red-600" : "text-green-600"} flex items-center justify-end`}>
                          {txn.type === "payment" ? "-" : "+"} 
                          <IndianRupee size={16} className="mx-1" />
                          {txn.amount.toFixed(2)}
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
          <Card>
            <CardContent className="pt-6 py-6">
              <div className="space-y-4">
                {filteredTransactions
                  .filter(txn => txn.type === "payment")
                  .map(txn => (
                    <div key={txn.id} className="flex justify-between items-center p-4 border-b">
                      <div>
                        <h4 className="font-medium">{txn.description}</h4>
                        <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                      </div>
                      <div className="flex items-center text-red-600 font-bold">
                        <IndianRupee size={16} className="mr-1" />
                        {txn.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}

                {filteredTransactions.filter(txn => txn.type === "payment").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No payment transactions found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="topups">
          <Card>
            <CardContent className="pt-6 py-6">
              <div className="space-y-4">
                {filteredTransactions
                  .filter(txn => txn.type === "topup")
                  .map(txn => (
                    <div key={txn.id} className="flex justify-between items-center p-4 border-b">
                      <div>
                        <h4 className="font-medium">{txn.description}</h4>
                        <p className="text-sm text-gray-500">{formatDate(txn.date)}</p>
                      </div>
                      <div className="flex items-center text-green-600 font-bold">
                        <IndianRupee size={16} className="mr-1" />
                        {txn.amount.toFixed(2)}
                      </div>
                    </div>
                  ))}

                {filteredTransactions.filter(txn => txn.type === "topup").length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No top-up transactions found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payments;
