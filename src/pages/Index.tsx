
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  CreditCard, 
  Wallet, 
  Nfc, 
  Shield, 
  LineChart, 
  AlertTriangle 
} from "lucide-react";

const Index = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-rfid-blue mb-4">QuickTapPay RFID Payment System</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Fast, secure, and convenient payments with advanced AI-driven insights and fraud detection
        </p>
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button asChild className="bg-rfid-teal hover:bg-rfid-blue">
            <Link to="/cards">Manage Cards</Link>
          </Button>
          <Button asChild variant="outline" className="border-rfid-teal text-rfid-teal hover:bg-rfid-teal/10">
            <Link to="/payment">Make Payment</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-rfid-blue text-white hover:from-purple-700 hover:to-rfid-blue">
            <Link to="/ai-insights">AI Insights</Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-center text-rfid-blue mb-8">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <CreditCard className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Card Management</h3>
              <p className="text-gray-600">Register and manage multiple RFID cards or tags in one place</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <Nfc className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Tap to Pay</h3>
              <p className="text-gray-600">Make quick contactless payments using your RFID devices</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <Wallet className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Digital Wallet</h3>
              <p className="text-gray-600">Easily top up your balance and track your spending</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <AlertTriangle className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Fraud Detection</h3>
              <p className="text-gray-600">AI-powered detection of unusual spending patterns and potential fraud</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <LineChart className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Spending Analytics</h3>
              <p className="text-gray-600">Smart insights about your spending habits and patterns</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 pb-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rfid-teal/10 mb-4">
                <Shield className="h-6 w-6 text-rfid-teal" />
              </div>
              <h3 className="text-lg font-medium text-rfid-blue mb-2">Secure Transactions</h3>
              <p className="text-gray-600">Advanced security measures to protect your payment data</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
