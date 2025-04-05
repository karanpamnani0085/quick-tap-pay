
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, CreditCard, Wallet, Lock, Zap, RefreshCw } from "lucide-react";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-rfid-blue to-rfid-teal py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                The Future of Payments Is Contactless
              </h1>
              <p className="text-xl mb-8 text-gray-100">
                Experience the simplicity and security of RFID payment technology with QuickTapPay. 
                Tap, pay, and go - no contact required.
              </p>
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-white text-rfid-blue hover:bg-gray-100"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-rfid-blue"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-full flex items-center justify-center tap-area active">
                  <div className="w-48 h-48 md:w-60 md:h-60 bg-rfid-teal rounded-full flex items-center justify-center">
                    <CreditCard size={100} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-rfid-blue mb-4">Why Choose QuickTapPay?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our RFID payment solution offers unparalleled convenience and security for both consumers and businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={32} className="text-rfid-teal" />
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Lightning Fast</h3>
              <p className="text-gray-600">
                Complete transactions in less than a second with just a tap. No more waiting in lines or fumbling with cash.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} className="text-rfid-teal" />
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Highly Secure</h3>
              <p className="text-gray-600">
                Advanced encryption and authentication protocols keep your payment information safe at all times.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw size={32} className="text-rfid-teal" />
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Versatile Use</h3>
              <p className="text-gray-600">
                From retail and transit to events and access control, our RFID technology works seamlessly across platforms.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-rfid-blue mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Getting started with QuickTapPay is simple and straightforward.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-rfid-teal rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Register a Card</h3>
              <p className="text-gray-600">
                Sign up for an account and register your RFID card or tag with our secure platform.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-rfid-teal rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Load Balance</h3>
              <p className="text-gray-600">
                Add funds to your account using your preferred payment method - credit card, bank transfer, or mobile payment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-rfid-teal rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-rfid-blue mb-3">Tap & Pay</h3>
              <p className="text-gray-600">
                Simply tap your card at any QuickTapPay terminal to make secure, instantaneous payments.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="bg-rfid-teal hover:bg-rfid-blue">
              Get Your Card Today
            </Button>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="bg-rfid-blue py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-4">Ready to experience the future of payments?</h2>
              <p className="text-xl text-gray-300">
                Join thousands of users who are already enjoying the convenience of QuickTapPay.
              </p>
            </div>
            <div className="flex space-x-4">
              <Button 
                size="lg" 
                className="bg-white text-rfid-blue hover:bg-gray-100"
              >
                Sign Up Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-rfid-blue"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
