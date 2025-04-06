
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Edit, Trash2, IndianRupee } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { dbService } from "@/services/dbService";

interface RFIDCard {
  id: string;
  name: string;
  cardNumber: string;
  balance: number;
  isActive: boolean;
  userId: string;
  lastUsed?: string;
}

const Cards = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cards, setCards] = useState<RFIDCard[]>([]);
  
  const [newCard, setNewCard] = useState({
    name: "",
    cardNumber: "",
  });
  
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    isActive: true
  });

  // Load cards when component mounts or user changes
  useEffect(() => {
    if (user) {
      const userCards = dbService.getCardsByUserId(user.id);
      setCards(userCards);
    } else {
      setCards([]);
    }
  }, [user]);

  const handleAddCard = () => {
    if (!user) {
      toast({
        title: "Not Logged In",
        description: "You need to log in to add cards.",
        variant: "destructive"
      });
      return;
    }

    if (!newCard.name || !newCard.cardNumber) {
      toast({
        title: "Validation Error",
        description: "Card name and Card ID are required",
        variant: "destructive"
      });
      return;
    }
    
    const newRFIDCard = dbService.createCard({
      name: newCard.name,
      cardNumber: newCard.cardNumber,
      balance: 0,
      isActive: true,
      userId: user.id
    });

    setCards([...cards, newRFIDCard]);
    setNewCard({
      name: "",
      cardNumber: "",
    });

    toast({
      title: "Card Added Successfully",
      description: `${newCard.name} has been added to your account.`,
      variant: "default"
    });
  };

  const handleTopUp = (id: string, amount: number) => {
    if (!user) return;
    
    const updatedCard = dbService.updateCard(id, { 
      balance: (cards.find(card => card.id === id)?.balance || 0) + amount,
      lastUsed: new Date().toISOString()
    });

    if (updatedCard) {
      // Record the transaction
      dbService.createTransaction({
        id: `tx-${Date.now()}`,
        description: "Top Up",
        amount: amount,
        type: "topup",
        status: "completed",
        date: new Date().toISOString(),
        cardId: id,
        cardName: updatedCard.name,
        userId: user.id,
        currency: "INR"
      });

      setCards(cards.map(card => 
        card.id === id ? updatedCard : card
      ));

      toast({
        title: "Card Topped Up",
        description: `Successfully added ₹${amount.toFixed(2)} to your card.`,
        variant: "default",
      });
    }
  };

  const handleDeleteCard = (id: string, name: string) => {
    if (dbService.deleteCard(id)) {
      setCards(cards.filter(card => card.id !== id));
      
      toast({
        title: "Card Removed",
        description: `${name} has been removed from your account.`,
        variant: "destructive",
      });
    }
  };

  const startEditing = (card: RFIDCard) => {
    setIsEditing(card.id);
    setEditData({
      name: card.name,
      isActive: card.isActive
    });
  };

  const saveCardChanges = () => {
    if (!isEditing) return;
    
    const updatedCard = dbService.updateCard(isEditing, editData);
    
    if (updatedCard) {
      setCards(cards.map(card => 
        card.id === isEditing ? updatedCard : card
      ));
      
      setIsEditing(null);
      
      toast({
        title: "Card Updated",
        description: "Card information has been updated successfully.",
        variant: "default"
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-rfid-blue">My RFID Cards</h1>
          <p className="text-gray-600 mt-2">Manage your registered RFID payment cards</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-rfid-teal hover:bg-rfid-blue">
              <Plus className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New RFID Card</DialogTitle>
              <DialogDescription>
                Enter the details of your RFID card to register it with your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newCard.name}
                  onChange={(e) => setNewCard({...newCard, name: e.target.value})}
                  placeholder="My Card Name"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cardNumber" className="text-right">Card ID</Label>
                <Input
                  id="cardNumber"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({...newCard, cardNumber: e.target.value})}
                  placeholder="RFID-XXXX-XXXX"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button className="bg-rfid-teal hover:bg-rfid-blue" onClick={handleAddCard}>Add Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No RFID cards</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            You haven't added any RFID cards to your account yet. Click the "Add New Card" button to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => (
            <Card key={card.id} className={`rfid-card ${!card.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center">
                  <CreditCard className="h-6 w-6 text-rfid-teal" />
                  <div className="ml-2">
                    <CardTitle className="text-rfid-blue text-xl">{card.name}</CardTitle>
                    <CardDescription>{card.cardNumber}</CardDescription>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${card.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {card.isActive ? 'Active' : 'Inactive'}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                    <span>Current Balance</span>
                    <span>Last Used</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-rfid-blue flex items-center">
                      <IndianRupee size={18} className="mr-1" />
                      {card.balance.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">{card.lastUsed ? new Date(card.lastUsed).toLocaleDateString() : 'Never used'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2 border-t">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="border-rfid-teal text-rfid-teal hover:bg-rfid-teal hover:text-white">
                      <Plus className="mr-1 h-4 w-4" /> Top Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Top Up Card Balance</DialogTitle>
                      <DialogDescription>
                        Select an amount to add to your card balance.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-3 gap-4 py-4">
                      <Button variant="outline" onClick={() => handleTopUp(card.id, 500)}>₹500</Button>
                      <Button variant="outline" onClick={() => handleTopUp(card.id, 1000)}>₹1000</Button>
                      <Button variant="outline" onClick={() => handleTopUp(card.id, 2000)}>₹2000</Button>
                    </div>
                    <DialogFooter className="flex justify-between">
                      <Button variant="outline" onClick={() => handleTopUp(card.id, 5000)}>₹5000</Button>
                      <Button className="bg-rfid-teal hover:bg-rfid-blue" onClick={() => handleTopUp(card.id, 1000)}>
                        Add ₹1000
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-rfid-blue">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Card</DialogTitle>
                        <DialogDescription>
                          Update your card information
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">Name</Label>
                          <Input
                            id="edit-name"
                            value={editData.name}
                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-status" className="text-right">Status</Label>
                          <div className="flex items-center space-x-2 col-span-3">
                            <Label htmlFor="active-toggle">
                              {editData.isActive ? 'Active' : 'Inactive'}
                            </Label>
                            <input
                              id="active-toggle"
                              type="checkbox"
                              checked={editData.isActive}
                              onChange={(e) => setEditData({...editData, isActive: e.target.checked})}
                              className="ml-2 h-4 w-4"
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button className="bg-rfid-teal hover:bg-rfid-blue" onClick={saveCardChanges}>
                          Save Changes
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500" onClick={() => handleDeleteCard(card.id, card.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cards;
