'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { addToast } from '@heroui/react';

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
    authenticated,
    user,
    getAccessToken,
  } = usePrivy();



  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Initialize auth state from localStorage and validate with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const token = await getAccessToken()
      try {
        // Validate token with backend
        const response = await fetch(`/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'address': user?.wallet?.address || '',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserProfile(data.user);
          addToast({
            title: 'Get User profile success.',
            color: 'success',
            timeout: 3000,
          })
        } else {
          // Token is invalid, clear storage
          addToast({
            title: 'Get User profile failed.',
            color: 'danger',
            timeout: 3000,
          })
        }
      } catch (error) {
        console.error('Error validating token:', error);
        addToast({
          title: 'Get User profile failed.',
          color: 'danger',
          timeout: 3000,
        })
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