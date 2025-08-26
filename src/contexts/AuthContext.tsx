'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { addToast } from '@heroui/react';
import api from '@/utils/axios';
import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';

interface User {
  _id: string;
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
  loading: Boolean,
  setLoading: (loading: boolean) => void;
  balance: Number
  fetchingBalance: Boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const network = process.env.NEXT_PUBLIC_NETWORK || "devnet"

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
  const [loading, setLoading] = useState(false)
  const [balance, setBalance] = useState(0)
  const [fetchingBalance, setFetchingBalance] = useState(false)
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
      setLoading(true)
      try {
        // Validate token with backend
        const response = await api.get(`/auth/profile`);
        console.log("User profile response:", response);
        if (response.status === 200) {
          setUserProfile(response.data.user);
        }
      } catch (error) {
        console.log('Error validating token:', error);
      }
      setLoading(false)
    };
    if (authenticated) {
      initializeAuth();
    }
    else {
      setUserProfile(null)
    }
  }, [authenticated]);

  useEffect(() => {
    if (!user?.wallet?.address)
      return
    const connection = new Connection(clusterApiUrl(network as Cluster), "confirmed");
    const publicKey = new PublicKey(user?.wallet?.address!);

    const fetchBalance = async () => {
      try {
        setFetchingBalance(true)
        // connect to Solana devnet (you can use "mainnet-beta" or "testnet")

        // replace with the wallet address you want to check

        // get balance in lamports (1 SOL = 1e9 lamports)
        const lamports = await connection.getBalance(publicKey);
        const sol = lamports / 1e9;

        setBalance(sol);
      } catch (err) {
        console.error("Error fetching balance:", err);
      }
      setFetchingBalance(false)
    };
    const subscriptionId = connection.onAccountChange(
      publicKey,
      (accountInfo) => {
        const lamports = accountInfo.lamports;
        setBalance(lamports / 1e9);
      },
      "confirmed"
    );


    if (user?.wallet?.address)
      fetchBalance();

    return () => {
      connection.removeAccountChangeListener(subscriptionId);
    };
  }, [user?.wallet])

  const updateUser = (userData: Partial<User>) => {
    if (userProfile) {
      const updatedUser = { ...userProfile, ...userData };
      setUserProfile(updatedUser);
    }
  };


  const value: AuthContextType = {
    userProfile,
    updateUser,
    loading,
    setLoading,
    balance,
    fetchingBalance
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 