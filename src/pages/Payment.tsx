
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NFC, Check, CreditCard, Lock, ChevronRight, MoreHorizontal } from "lucide-react";
import { useToast } from "@/components/ui/toast";

const Payment = () => {
  const { toast } = useToast();
  const [activeCard, setActiveCard] = useState("card-1");
  const [amount, setAmount] = useState(5.99);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isTapping, setIsTapping] = useState(false);

  const cards = [
    {
      id: "card-1",
      name: "My Primary Card",
      cardNumber: "RFID-8741-2396",
      balance: 67.50,
    },
    {
      id: "card-2",
      name: "Backup Tag",
      cardNumber: "RFID-6235-9012",
      balance: 25.00,
    }
  ];

  const handleTapToPay = () => {
    setIsTapping(true);
    
    setTimeout(() => {
      setIsTapping(false);
      setIsProcessing(true);
      
      setTimeout(() => {
        setIsProcessing(false);
        setIsComplete(true);
        
        toast({
          title: "Payment Successful",
          description: `$${amount.toFixed(2)} paid with ${cards.find(card => card.id === activeCard)?.name}`,
        });
      }, 2000);
    }, 1500);
  };

  const handleReset = () => {
    setIsComplete(false);
  };

  const selectedCard = cards.find(card => card.id === activeCard);

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-rfid-blue text-center mb-8">Quick Payment</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Complete your payment by tapping your device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Merchant</span>
                <span className="font-medium">QuickTapPay Demo</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="text-gray-600">Date</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="text-xl font-bold text-rfid-blue">${amount.toFixed(2)}</span>
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
                        <NFC size={64} className={`${isTapping ? 'text-rfid-teal animate-tap' : 'text-gray-400'}`} />
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
                  
                  {cards.map(card => (
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
                          <span className="mr-2 font-bold text-rfid-blue">${card.balance.toFixed(2)}</span>
                          {activeCard === card.id && (
                            <div className="w-6 h-6 rounded-full bg-rfid-teal flex items-center justify-center text-white">
                              <Check size={16} />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <Button 
                    className="w-full mt-4 bg-rfid-teal hover:bg-rfid-blue" 
                    onClick={handleTapToPay}
                    disabled={isProcessing || isTapping}
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
                  <span className="font-bold text-gray-900">${amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Card</span>
                  <span className="text-gray-900">{selectedCard?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">New Balance</span>
                  <span className="font-medium text-gray-900">
                    ${selectedCard ? (selectedCard.balance - amount).toFixed(2) : "0.00"}
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
    </div>
  );
};

export default Payment;
