
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define user type
type User = {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  pin?: string; // Added PIN field
};

// Define context type
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => boolean;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => false,
  signup: () => false,
  logout: () => {},
  updateUserProfile: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // User database operations
  const getUsersFromStorage = (): User[] => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsersToStorage = (users: User[]) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  const login = (email: string, password: string): boolean => {
    const users = getUsersFromStorage();
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, firstName?: string, lastName?: string): boolean => {
    const users = getUsersFromStorage();
    
    // Check if user already exists
    if (users.some(u => u.email === email)) {
      return false;
    }
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      firstName,
      lastName
    };
    
    const updatedUsers = [...users, newUser];
    saveUsersToStorage(updatedUsers);
    
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (!user) return;

    const users = getUsersFromStorage();
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex >= 0) {
      const updatedUser = { ...users[userIndex], ...userData };
      users[userIndex] = updatedUser;
      
      saveUsersToStorage(users);
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const authContextValue: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
