'use client'
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import { usePrivy } from '@privy-io/react-auth';

interface LogoutConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

const LogoutConfirm: React.FC<LogoutConfirmProps> = ({
  onConfirm,
  onCancel,
  isOpen
}) => {
  const { userProfile } = useAuth();
  const {
    authenticated,
    logout
  } = usePrivy();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Disconnect wallet first
    logout();
    // Small delay to show loading state
    setTimeout(() => {
      onConfirm();
      setIsLoggingOut(false);
    }, 500);
  };

  useEffect(()=>{
    console.log("LogoutConfirm authenticated changed", authenticated);
  },[authenticated])
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black/90 p-6 rounded-lg backdrop-blur-sm max-w-md w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">Confirm Logout</h3>

        <p className="text-gray-300 mb-6">
          Are you sure you want to logout? You'll need to reconnect your wallet to access your profile.
        </p>

        {userProfile && (
          <div className="bg-white/10 p-3 rounded-lg mb-6">
            <p className="text-white text-sm">
              <span className="text-gray-400">Currently logged in as:</span>
              <br />
              <span className="font-medium">{userProfile.username}</span>
              <br />
              <span className="text-xs text-gray-400">
                {userProfile.walletAddress?.slice(0, 4)}...{userProfile.walletAddress?.slice(-4)}
              </span>
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoggingOut}
            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            {isLoggingOut ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Logging out...
              </div>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirm; 