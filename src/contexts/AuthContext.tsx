
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
  name?: string; // Add name property
};

// Define context type
type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean; // Add isAuthenticated property
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, firstName?: string, lastName?: string) => boolean;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false, // Add default value
  login: () => false,
  signup: () => false,
  logout: () => {},
  updateUserProfile: () => {},
});

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user; // Compute isAuthenticated based on user existence

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
      // Set name property if firstName and/or lastName exist
      if (foundUser.firstName || foundUser.lastName) {
        foundUser.name = [foundUser.firstName, foundUser.lastName]
          .filter(Boolean)
          .join(' ');
      }
      
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
    
    const name = [firstName, lastName].filter(Boolean).join(' ');
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      firstName,
      lastName,
      name: name || undefined
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

    // If firstName or lastName is updated, update name as well
    if (userData.firstName !== undefined || userData.lastName !== undefined) {
      const updatedFirstName = userData.firstName !== undefined ? userData.firstName : user.firstName;
      const updatedLastName = userData.lastName !== undefined ? userData.lastName : user.lastName;
      
      userData.name = [updatedFirstName, updatedLastName].filter(Boolean).join(' ');
    }

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
    isAuthenticated,
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
