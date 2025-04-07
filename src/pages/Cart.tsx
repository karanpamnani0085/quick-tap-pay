
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Plus, Minus, ShoppingCart, Store } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the shop and item types
interface ShopItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

interface Shop {
  id: string;
  name: string;
  items: ShopItem[];
}

interface CartItem extends ShopItem {
  quantity: number;
  shopId: string;
  shopName: string;
}

// Define our shop data
const shops: Shop[] = [
  {
    id: "shop-a",
    name: "Shop A - Chaat Corner",
    items: [
      { id: "a1", name: "Papdi Chaat", price: 50, description: "Crispy fried dough wafers with potatoes, chickpeas and chutneys" },
      { id: "a2", name: "Samosa Chaat", price: 50, description: "Crushed samosas topped with yogurt and tangy chutneys" },
      { id: "a3", name: "Pani Puri", price: 30, description: "Hollow crisp fried balls filled with flavored water and spicy mixture" }
    ]
  },
  {
    id: "shop-b",
    name: "Shop B - Quick Bites",
    items: [
      { id: "b1", name: "Dairy Milk", price: 80, description: "Creamy milk chocolate bar" },
      { id: "b2", name: "Chips", price: 20, description: "Crunchy potato chips" },
      { id: "b3", name: "Juice", price: 40, description: "Refreshing fruit juice" }
    ]
  }
];

const Cart = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeShop, setActiveShop] = useState<string>(shops[0].id);

  const addToCart = (item: ShopItem, shop: Shop) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      } else {
        return [
          ...prevCart, 
          { 
            ...item, 
            quantity: 1, 
            shopId: shop.id,
            shopName: shop.name
          }
        ];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`
    });
  };
  
  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === itemId);
      
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item => 
          item.id === itemId 
            ? { ...item, quantity: item.quantity - 1 } 
            : item
        );
      } else {
        return prevCart.filter(item => item.id !== itemId);
      }
    });
  };

  const getItemQuantityInCart = (itemId: string): number => {
    const item = cart.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  };
  
  const calculateTotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const currentShop = shops.find(shop => shop.id === activeShop) || shops[0];

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-rfid-blue mb-8">Food Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shop Selection and Items */}
        <div className="lg:col-span-2">
          <div className="flex space-x-4 mb-6">
            {shops.map(shop => (
              <Button
                key={shop.id}
                variant={activeShop === shop.id ? "default" : "outline"}
                className={activeShop === shop.id ? "bg-rfid-teal hover:bg-rfid-blue" : ""}
                onClick={() => setActiveShop(shop.id)}
              >
                <Store className="mr-2 h-4 w-4" />
                {shop.name}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentShop.items.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="font-bold text-lg">₹{item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => removeFromCart(item.id)}
                      disabled={getItemQuantityInCart(item.id) === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{getItemQuantityInCart(item.id)}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => addToCart(item, currentShop)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    className="bg-rfid-teal hover:bg-rfid-blue"
                    onClick={() => addToCart(item, currentShop)}
                  >
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Cart Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="mr-2 h-5 w-5" /> Your Cart
              </CardTitle>
              <CardDescription>
                {cart.length === 0 
                  ? "Your cart is empty" 
                  : `${cart.reduce((total, item) => total + item.quantity, 0)} items in your cart`
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>Add some items to get started</p>
                </div>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.shopName} · ₹{item.price} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-rfid-teal hover:bg-rfid-blue"
                disabled={cart.length === 0}
                asChild
              >
                <Link to={`/payment?amount=${calculateTotal()}`}>
                  Proceed to Payment
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
