'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { addToast } from '@heroui/react';
import api from '@/utils/axios';

interface User {
  id: string;
  walletAddress: string | undefined;
  username: string;
  email?: string | undefined;
  avatar?: string;
  isVerified: boolean;
  balance: number;
  totalBets: number;
  totalWins: number;
  totalLosses: number;
  totalWagered: number;
  totalWon: number;
  winRate: string;
  profitLoss: number;
  exp: number;
  level: number;
  createdAt: Date;
}

interface AuthContextType {
  userProfile: User | null;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const {
    ready,
    authenticated,
    user,
    getAccessToken,
  } = usePrivy();


  // Initialize auth state from localStorage and validate with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getAccessToken()

      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        api.defaults.headers.common["address"] = user?.wallet?.address || '';
      } else {
        delete api.defaults.headers.common["Authorization"];
        delete api.defaults.headers.common["address"];
      }
      
      try {
        // Validate token with backend
        const response = await api.get(`/auth/profile`);
        console.log("User profile response:", response);
        if (response.status === 200) {
          setUserProfile(response.data.user);
        } 
      } catch (error) {
        console.error('Error validating token:', error);
      }
    };
    if (authenticated) {
      initializeAuth();
    }
  }, [authenticated]);

  const updateUser = (userData: Partial<User>) => {
    if (userProfile) {
      const updatedUser = { ...userProfile, ...userData };
      setUserProfile(updatedUser);
    }
  };


  const value: AuthContextType = {
    userProfile,
    updateUser
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 