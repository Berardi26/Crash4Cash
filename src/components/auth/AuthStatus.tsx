'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface AuthStatusProps {
  showDetails?: boolean;
  className?: string;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { connected } = useWallet();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        <span className="text-white text-sm">Loading...</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {user.username.charAt(0).toUpperCase()}
        </div>
        {showDetails && (
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{user.username}</span>
            <span className="text-gray-400 text-xs">
              {user.walletAddress.slice(0, 4)}...{user.walletAddress.slice(-4)}
            </span>
          </div>
        )}
      </div>
    );
  }

  if (connected) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-yellow-400 text-sm">Connecting...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <WalletMultiButton className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors" />
    </div>
  );
};

export default AuthStatus; 