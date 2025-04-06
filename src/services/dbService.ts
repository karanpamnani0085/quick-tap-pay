
import { Transaction } from "@/types/transaction";

interface User {
  id: string;
  name: string;
  email: string;
  password: string; // In a real app, this would be hashed
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface Card {
  id: string;
  name: string;
  cardNumber: string;
  balance: number;
  isActive: boolean;
  userId: string;
  lastUsed?: string;
}

// Mock database using localStorage
export const dbService = {
  // User methods
  getUsers: (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },
  
  getUserById: (id: string): User | undefined => {
    const users = dbService.getUsers();
    return users.find(user => user.id === id);
  },
  
  getUserByEmail: (email: string): User | undefined => {
    const users = dbService.getUsers();
    return users.find(user => user.email === email);
  },
  
  createUser: (user: Omit<User, 'id'>): User => {
    const users = dbService.getUsers();
    const newUser = { ...user, id: Date.now().toString() };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    return newUser;
  },
  
  updateUser: (id: string, data: Partial<User>): User | undefined => {
    const users = dbService.getUsers();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) return undefined;
    
    const updatedUser = { ...users[userIndex], ...data };
    users[userIndex] = updatedUser;
    
    localStorage.setItem('users', JSON.stringify(users));
    return updatedUser;
  },
  
  // Card methods
  getCardsByUserId: (userId: string): Card[] => {
    const cards = localStorage.getItem('cards');
    const allCards = cards ? JSON.parse(cards) : [];
    return allCards.filter((card: Card) => card.userId === userId);
  },
  
  createCard: (card: Omit<Card, 'id'>): Card => {
    const cards = localStorage.getItem('cards');
    const allCards = cards ? JSON.parse(cards) : [];
    const newCard = { ...card, id: `card-${Date.now()}` };
    
    localStorage.setItem('cards', JSON.stringify([...allCards, newCard]));
    return newCard;
  },
  
  updateCard: (id: string, data: Partial<Card>): Card | undefined => {
    const cards = localStorage.getItem('cards');
    const allCards = cards ? JSON.parse(cards) : [];
    const cardIndex = allCards.findIndex((card: Card) => card.id === id);
    
    if (cardIndex === -1) return undefined;
    
    const updatedCard = { ...allCards[cardIndex], ...data };
    allCards[cardIndex] = updatedCard;
    
    localStorage.setItem('cards', JSON.stringify(allCards));
    return updatedCard;
  },
  
  deleteCard: (id: string): boolean => {
    const cards = localStorage.getItem('cards');
    const allCards = cards ? JSON.parse(cards) : [];
    const filteredCards = allCards.filter((card: Card) => card.id !== id);
    
    if (filteredCards.length === allCards.length) return false;
    
    localStorage.setItem('cards', JSON.stringify(filteredCards));
    return true;
  },
  
  // Transaction methods
  getTransactionsByUserId: (userId: string): Transaction[] => {
    const transactions = localStorage.getItem('transactions');
    const allTransactions = transactions ? JSON.parse(transactions) : [];
    return allTransactions.filter((tx: Transaction & { userId?: string }) => tx.userId === userId);
  },
  
  createTransaction: (transaction: Transaction & { userId: string }): Transaction => {
    const transactions = localStorage.getItem('transactions');
    const allTransactions = transactions ? JSON.parse(transactions) : [];
    
    localStorage.setItem('transactions', JSON.stringify([...allTransactions, transaction]));
    return transaction;
  },
  
  getAllTransactions: (): (Transaction & { userId: string })[] => {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  },
};

// Initialize some demo data if needed
export const initializeDemoData = () => {
  // Only initialize if there's no data
  if (!localStorage.getItem('users')) {
    const demoUser = {
      id: '1',
      name: 'John Doe',
      email: 'demo@example.com',
      password: 'password123', // In a real app, this would be hashed
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1 (555) 123-4567'
    };
    
    localStorage.setItem('users', JSON.stringify([demoUser]));
    
    const demoCard = {
      id: 'card-1',
      name: 'My Primary Card',
      cardNumber: 'RFID-8741-2396',
      balance: 4750.50,
      isActive: true,
      userId: '1',
      lastUsed: '2025-04-01T10:23:12Z'
    };
    
    localStorage.setItem('cards', JSON.stringify([demoCard]));
    
    // Create some sample transactions
    const demoTransactions = [
      {
        id: 'tx-1',
        description: 'Coffee Shop',
        amount: 120,
        type: 'payment',
        status: 'completed',
        date: '2025-04-01T08:30:00Z',
        cardId: 'card-1',
        cardName: 'My Primary Card',
        merchant: 'Starbucks',
        location: 'Mumbai',
        userId: '1',
        currency: 'INR'
      },
      {
        id: 'tx-2',
        description: 'Top-up',
        amount: 2000,
        type: 'topup',
        status: 'completed',
        date: '2025-03-28T14:15:00Z',
        cardId: 'card-1',
        cardName: 'My Primary Card',
        userId: '1',
        currency: 'INR'
      }
    ];
    
    localStorage.setItem('transactions', JSON.stringify(demoTransactions));
  }
};

// Call initialization once when the service is imported
initializeDemoData();
