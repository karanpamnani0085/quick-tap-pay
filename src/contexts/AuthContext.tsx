
import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbService } from '@/services/dbService';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user exists in our database
      const existingUser = dbService.getUserByEmail(email);
      
      if (!existingUser) {
        throw new Error('Invalid email or password');
      }
      
      // In real app, you would hash and compare passwords
      if (existingUser.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      // Create a sanitized user object (without password)
      const userToSave = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        phone: existingUser.phone
      };
      
      localStorage.setItem('user', JSON.stringify(userToSave));
      setUser(userToSave);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const existingUser = dbService.getUserByEmail(email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
      
      // Split name into first and last name
      const [firstName, ...lastNameParts] = name.split(' ');
      const lastName = lastNameParts.join(' ');
      
      // Create new user in our database
      const newUser = dbService.createUser({
        name,
        email,
        password,
        firstName,
        lastName,
        phone: ''
      });
      
      // Create a sanitized user object (without password)
      const userToSave = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phone: newUser.phone
      };
      
      localStorage.setItem('user', JSON.stringify(userToSave));
      setUser(userToSave);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...data };
    
    // Update name if firstName or lastName changed
    if (data.firstName || data.lastName) {
      updatedUser.name = `${updatedUser.firstName || ''} ${updatedUser.lastName || ''}`.trim();
    }
    
    // Update user in our database
    dbService.updateUser(user.id, updatedUser);
    
    // Update local storage and state
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      signup, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
