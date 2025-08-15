'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';

interface AuthStatusProps {
  showDetails?: boolean;
  className?: string;
}

const AuthStatus: React.FC<AuthStatusProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const { userProfile } = useAuth();
  const { connected } = useWallet();


  if (userProfile) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
          {userProfile.username.charAt(0).toUpperCase()}
        </div>
        {showDetails && (
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{userProfile.username}</span>
            <span className="text-gray-400 text-xs">
              {userProfile.walletAddress?.slice(0, 4)}...{userProfile.walletAddress?.slice(-4)}
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
    </div>
  );
};

export default AuthStatus; 