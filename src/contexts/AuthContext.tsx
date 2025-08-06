'use client'
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { useLogin, usePrivy } from '@privy-io/react-auth';

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
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { connection } = useConnection();
  const router = useRouter();



  const { login } = useLogin({
    onComplete: () => loginServer(user?.wallet?.address || ''),
  });

  const {
    ready,
    authenticated,
    user,
    logout,
  } = usePrivy();

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;


  // API base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage and validate with backend
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (storedToken && storedUser) {
        try {
          // Validate token with backend
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${storedToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setToken(storedToken);
            setUserProfile(data.user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
          }
        } catch (error) {
          console.error('Error validating token:', error);
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth_user');
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-connect wallet when connected
  useEffect(() => {
    if (ready && wallet?.address && !isAuthenticated) {
      handleWalletConnection();
    }
  }, [ready, wallet?.address, isAuthenticated]);

  // Check if wallet is disconnected but user is still authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // Wallet disconnected but user still authenticated - force logout
      console.log("Wallet disconnected, forcing logout");
      forceLogout();
    }
  }, [isAuthenticated]);

  // Periodic token validation
  useEffect(() => {
    if (isAuthenticated && token) {
      const validateToken = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/auth/verify`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            // Token is invalid, logout
            forceLogout();
          }
        } catch (error) {
          console.error('Token validation error:', error);
          forceLogout();
        }
      };

      // Validate token every 5 minutes
      const interval = setInterval(validateToken, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token]);

  const handleWalletConnection = async () => {
    if (!wallet?.address) return;

    try {
      setIsLoading(true);
      await loginServer(wallet?.address.toString());
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginServer = async (walletAddress: string): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/connect-wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect wallet');
      }

      const data = await response.json();

      setToken(data.token);
      setUserProfile(data.user);

      // Store in localStorage
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));

      console.log('Login successful:', data);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logoutServer = () => {
    setUserProfile(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');

    // Redirect to home page after logout
    router.push('/');
  };

  const forceLogout = () => {
    // Force logout without redirect (used when wallet disconnects)
    setUserProfile(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (userProfile) {
      const updatedUser = { ...userProfile, ...userData };
      setUserProfile(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const refreshToken = async (): Promise<void> => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setUserProfile(data.user);
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
      } else {
        // Token is invalid, logout
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    userProfile,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 