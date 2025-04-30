
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
  },
  {
    id: "shop-c",
    name: "SR Chat Corner",
    items: [
      { id: "c1", name: "SAMOSA CHAT", price: 50, description: "Delicious samosa topped with chutneys and spices" },
      { id: "c2", name: "CUTLET CHAT", price: 60, description: "Crispy cutlets served with tangy chutneys" },
      { id: "c3", name: "PAPDI CHAT", price: 50, description: "Crispy fried dough wafers with chutneys and yogurt" },
      { id: "c4", name: "KALKATA CHAT", price: 60, description: "Kolkata style spicy and tangy chaat" },
      { id: "c5", name: "AMERCIAN CHAT", price: 60, description: "Fusion American style chaat with unique flavors" },
      { id: "c6", name: "DILLAGI CHAT", price: 60, description: "Special chaat with a mix of sweet and spicy flavors" },
      { id: "c7", name: "CHANA SAMOSA", price: 50, description: "Samosa served with spicy chickpea curry" },
      { id: "c8", name: "CUTLET CHANA", price: 50, description: "Crispy cutlets served with chickpea curry" },
      { id: "c9", name: "ALOO CHAT", price: 50, description: "Spicy potato chaat with chutneys" },
      { id: "c10", name: "PAPDI CHANA", price: 50, description: "Crispy papdi topped with spicy chickpea curry" }
    ]
  },
  {
    id: "shop-d",
    name: "BUTTY 2",
    items: [
      { id: "d1", name: "DAHI PURI", price: 50, description: "Puris filled with yogurt and chutneys" },
      { id: "d2", name: "MASALA PURI", price: 50, description: "Puris topped with spicy masala" },
      { id: "d3", name: "SEV PURI", price: 50, description: "Puris topped with sev, onions, and chutneys" },
      { id: "d4", name: "PANI PURI (1 PLATE)", price: 30, description: "Hollow puris with flavored water and stuffing" },
      { id: "d5", name: "BHEL PURI", price: 50, description: "Puffed rice mixed with vegetables and chutneys" },
      { id: "d6", name: "SAMOSA (1 PLATE 2 PIECES)", price: 25, description: "Crispy pastry filled with spiced potatoes" },
      { id: "d7", name: "SAMOSA PAFF (1 PLATE 2 PIECES)", price: 25, description: "Puff pastry samosas" },
      { id: "d8", name: "CUTLET (1 PLATE 2 PIECES)", price: 40, description: "Crispy vegetable cutlets" },
      { id: "d9", name: "BARO BHAJI", price: 40, description: "Spicy vegetable curry" },
      { id: "d10", name: "PAV BHAJI", price: 50, description: "Spiced vegetable curry served with soft bread rolls" },
      { id: "d11", name: "VADA PAV", price: 50, description: "Spicy potato fritter in a bread bun" },
      { id: "d12", name: "CHEESE PAV BHAJI", price: 60, description: "Pav bhaji topped with cheese" },
      { id: "d13", name: "KACHORI (1 PLATE 2 PCS)", price: 40, description: "Deep fried pastry with spicy filling" },
      { id: "d14", name: "KACHORI CHAT", price: 60, description: "Kachori topped with yogurt and chutneys" }
    ]
  },
  {
    id: "shop-e",
    name: "MASALEDAAR KITCHEN",
    items: [
      { id: "e1", name: "Veg Thali (Any Vegetable)", price: 110, description: "Complete vegetarian meal with roti, rice, dal and vegetable" },
      { id: "e2", name: "Veg Thali (Rajma)", price: 120, description: "Complete meal with kidney beans curry" },
      { id: "e3", name: "Veg Thali (Chole)", price: 120, description: "Complete meal with chickpea curry" },
      { id: "e4", name: "Veg Thali (Kadhi)", price: 150, description: "Complete meal with yogurt based curry" },
      { id: "e5", name: "Veg Thali (Bhindi Masala)", price: 150, description: "Complete meal with spiced okra" },
      { id: "e6", name: "Anda Thali (2pcs)", price: 140, description: "Complete meal with 2 egg curry" },
      { id: "e7", name: "Chicken Thali (4 pcs)", price: 180, description: "Complete meal with 4 pieces of chicken curry" },
      { id: "e8", name: "Paneer Thali", price: 180, description: "Complete meal with cottage cheese curry" },
      { id: "e9", name: "Mutton Thali (100 gm.)", price: 300, description: "Complete meal with mutton curry" },
      { id: "e10", name: "Fish Thali (2pcs)", price: 170, description: "Complete meal with fish curry" },
      { id: "e11", name: "Maharaj Veg Thali", price: 300, description: "Deluxe vegetarian thali with multiple dishes" },
      { id: "e12", name: "Maharaja Non Veg Thali", price: 350, description: "Deluxe non-vegetarian thali with multiple dishes" }
    ]
  },
  {
    id: "shop-f",
    name: "DUCK DONALD",
    items: [
      { id: "f1", name: "LIME", price: 10, description: "Refreshing lime juice" },
      { id: "f2", name: "MINTCOOL LIME", price: 15, description: "Lime juice with cooling mint" },
      { id: "f3", name: "BLUEBERRY LIME", price: 20, description: "Lime juice with blueberry flavor" },
      { id: "f4", name: "MASALA LIME", price: 20, description: "Lime juice with spicy masala" },
      { id: "f5", name: "MAUSAMBI JUICE", price: 35, description: "Fresh sweet lime juice" },
      { id: "f6", name: "APPLE JUICE", price: 30, description: "Fresh apple juice" },
      { id: "f7", name: "BANANA JUICE", price: 30, description: "Fresh banana smoothie" },
      { id: "f8", name: "ABC JUICE", price: 50, description: "Apple, beetroot, and carrot mixed juice" },
      { id: "f9", name: "BEETROOT JUICE", price: 30, description: "Fresh beetroot juice" }
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
          <div className="flex flex-wrap gap-2 mb-6">
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
