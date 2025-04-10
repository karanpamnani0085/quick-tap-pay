import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nfc, Check, CreditCard, Lock, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { dbService } from "@/services/dbService";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useSearchParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [activeCard, setActiveCard] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTapping, setIsTapping] = useState(false);
  const [isPinDialogOpen, setIsPinDialogOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [pendingPayment, setPendingPayment] = useState<{
    amount: number;
    cardId: string;
    card: any;
  } | null>(null);

  // Get amount from query parameter if present
  useEffect(() => {
    const queryAmount = searchParams.get("amount");
    if (queryAmount) {
      setAmount(queryAmount);
    }
  }, [searchParams]);

  // Load user cards when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userCards = dbService.getCardsByUserId(user.id);
      setCards(userCards);
      if (userCards.length > 0) {
        setActiveCard(userCards[0].id);
      }
    } else {
      setCards([]);
      setActiveCard("");
    }
  }, [user]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const initiatePayment = () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You need to log in to make payments.",
        variant: "destructive"
      });
      return;
    }
    
    const paymentAmount = parseFloat(amount);
    
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    const selectedCard = cards.find(card => card.id === activeCard);
    
    if (!selectedCard) {
      toast({
        title: "Card Not Found",
        description: "Please select a valid card.",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedCard.balance < paymentAmount) {
      toast({
        title: "Insufficient Balance",
        description: "Your card doesn't have enough balance for this payment.",
        variant: "destructive"
      });
      return;
    }

    // Store payment details for after PIN verification
    setPendingPayment({
      amount: paymentAmount,
      cardId: selectedCard.id,
      card: selectedCard
    });

    // If user has a PIN, show PIN dialog
    if (user.pin) {
      setPinError("");
      setEnteredPin("");
      setIsPinDialogOpen(true);
    } else {
      // No PIN set, proceed with payment
      proceedWithPayment(paymentAmount, selectedCard);
    }
  };

  const verifyPinAndPay = () => {
    if (enteredPin === user?.pin) {
      setIsPinDialogOpen(false);
      
      if (pendingPayment) {
        proceedWithPayment(pendingPayment.amount, pendingPayment.card);
        setPendingPayment(null);
      }
    } else {
      setPinError("Incorrect PIN. Please try again.");
      setEnteredPin("");
    }
  };

  const proceedWithPayment = (paymentAmount: number, selectedCard: any) => {
    setIsTapping(true);
    
    setTimeout(() => {
      setIsTapping(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        // Update card balance
        const updatedCard = dbService.updateCard(selectedCard.id, { 
          balance: selectedCard.balance - paymentAmount,
          lastUsed: new Date().toISOString()
        });
        
        if (updatedCard) {
          // Get merchant name from cart if it's a cart payment
          const merchant = searchParams.get("from") === "cart" 
            ? "Food Cart" 
            : "QuickTapPay Demo";

          // Record transaction
          dbService.createTransaction({
            id: `tx-${Date.now()}`,
            description: searchParams.get("from") === "cart" ? "Food Purchase" : "Quick Payment",
            amount: paymentAmount,
            type: "payment",
            status: "completed",
            date: new Date().toISOString(),
            cardId: selectedCard.id,
            cardName: selectedCard.name,
            merchant: merchant,
            location: "Store",
            userId: user?.id,
            currency: "INR"
          });
          
          // Update local cards state
          setCards(cards.map(c => c.id === selectedCard.id ? updatedCard : c));
        }
        
        setIsProcessing(false);
        setIsComplete(true);
        
        toast({
          title: "Payment Successful",
          description: `₹${paymentAmount.toFixed(2)} paid with ${selectedCard.name}`,
        });
      }, 2000);
    }, 1500);
  };

  const handleTapToPay = () => {
    initiatePayment();
  };

  const handleReset = () => {
    setIsComplete(false);
    setAmount("");
    
    // If we came from cart, navigate back to cart
    if (searchParams.get("from") === "cart") {
      navigate("/cart");
    }
  };

  const selectedCard = cards.find(card => card.id === activeCard);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-rfid-blue text-center mb-8">Quick Payment</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter amount and tap your RFID card</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Merchant</span>
                <span className="font-medium">{searchParams.get("from") === "cart" ? "Food Cart" : "QuickTapPay Demo"}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="space-y-2 pb-2 border-b">
                <Label htmlFor="amount" className="text-gray-600">Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                  <Input 
                    id="amount"
                    type="text"
                    value={amount}
                    onChange={handleAmountChange}
                    className="pl-8"
                    placeholder="0.00"
                    disabled={isComplete || isProcessing || isTapping || searchParams.has("amount")}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-rfid-blue flex items-center">
                  <IndianRupee size={18} className="mr-1" />
                  {parseFloat(amount || "0").toFixed(2)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {!isComplete ? (
          <>
            <Tabs defaultValue="tap" className="mb-6">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="tap">Tap to Pay</TabsTrigger>
                <TabsTrigger value="select">Select Card</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tap" className="pt-4">
                <div className="text-center space-y-8">
                  <div 
                    className={`tap-area w-40 h-40 rounded-full mx-auto flex items-center justify-center cursor-pointer transition-all ${isTapping || isProcessing ? 'active bg-rfid-teal/10' : 'bg-gray-50'}`}
                    onClick={() => !isProcessing && !isTapping && handleTapToPay()}
                  >
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rfid-teal"></div>
                        <span className="mt-2 text-rfid-blue font-medium">Processing...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Nfc size={64} className={`${isTapping ? 'text-rfid-teal animate-tap' : 'text-gray-400'}`} />
                        <span className={`mt-2 font-medium ${isTapping ? 'text-rfid-teal' : 'text-gray-500'}`}>
                          {isTapping ? 'Reading...' : 'Tap to Pay'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-500 text-sm">
                    Hold your RFID card or device near the reader to complete payment
                  </p>
                  
                  <div className="flex items-center justify-center text-sm text-gray-500">
                    <Lock size={14} className="mr-1" />
                    <span>Secure RFID Payment</span>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="select" className="pt-4">
                <div className="space-y-4">
                  <p className="text-gray-500 text-sm mb-4">Choose a payment card</p>
                  
                  {cards.length === 0 ? (
                    <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-500">No cards available. Add a card first.</p>
                    </div>
                  ) : (
                    cards.map(card => (
                      <Card 
                        key={card.id}
                        className={`cursor-pointer hover:shadow transition-all ${activeCard === card.id ? 'border-rfid-teal ring-1 ring-rfid-teal' : ''}`}
                        onClick={() => setActiveCard(card.id)}
                      >
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard size={28} className="text-rfid-teal mr-3" />
                            <div>
                              <p className="font-medium text-gray-900">{card.name}</p>
                              <p className="text-sm text-gray-500">{card.cardNumber}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2 font-bold text-rfid-blue flex items-center">
                              <IndianRupee size={16} className="mr-1" />
                              {card.balance.toFixed(2)}
                            </span>
                            {activeCard === card.id && (
                              <div className="w-6 h-6 rounded-full bg-rfid-teal flex items-center justify-center text-white">
                                <Check size={16} />
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                  
                  <Button 
                    className="w-full mt-4 bg-rfid-teal hover:bg-rfid-blue" 
                    onClick={initiatePayment}
                    disabled={isProcessing || isTapping || parseFloat(amount || "0") <= 0 || cards.length === 0}
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 pb-4 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-green-800 mb-1">Payment Successful!</h2>
              <p className="text-green-600 mb-4">Your payment has been processed</p>
              
              <div className="bg-white rounded-lg p-4 mb-4 text-left">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-bold text-gray-900 flex items-center">
                    <IndianRupee size={16} className="mr-1" />
                    {parseFloat(amount || "0").toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Card</span>
                  <span className="text-gray-900">{selectedCard?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-medium text-gray-900 flex items-center">
                    <IndianRupee size={16} className="mr-1" />
                    {selectedCard ? (selectedCard.balance - parseFloat(amount || "0")).toFixed(2) : "0.00"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="outline" 
                className="border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={handleReset}
              >
                Make Another Payment
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <Dialog open={isPinDialogOpen} onOpenChange={setIsPinDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Enter Your Payment PIN</DialogTitle>
            <DialogDescription>
              Please enter your 4-digit PIN to authorize this payment
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-3">
                <InputOTP maxLength={4} value={enteredPin} onChange={setEnteredPin}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
                {pinError && (
                  <p className="text-sm text-red-500">{pinError}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsPinDialogOpen(false);
                setPendingPayment(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              className="bg-rfid-teal hover:bg-rfid-blue"
              onClick={verifyPinAndPay}
              disabled={enteredPin.length !== 4}
            >
              Verify & Pay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payment;
