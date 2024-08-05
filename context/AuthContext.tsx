'use client'; // Ensure this file is processed as a client-side module

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Auth, User, onAuthStateChanged } from 'firebase/auth'; // Adjust according to Firebase version
import { auth } from '@/app/firebase/firebaseConfig'; // Adjust path if necessary

// Define the shape of the authentication context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const defaultContextValue: AuthContextType = {
  user: null,
  loading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component that provides the auth context
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user state
      setLoading(false); // Set loading to false after checking auth state
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for accessing the auth context
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
