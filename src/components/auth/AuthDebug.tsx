'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';

const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, isLoading, token } = useAuth();
  const { connected, publicKey } = useWallet();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 p-4 rounded-lg backdrop-blur-sm text-xs text-white max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Wallet Connected: {connected ? 'Yes' : 'No'}</div>
        <div>Has Token: {token ? 'Yes' : 'No'}</div>
        <div>Has User: {user ? 'Yes' : 'No'}</div>
        {user && (
          <div>Username: {user.username}</div>
        )}
        {publicKey && (
          <div>Wallet: {publicKey.toString().slice(0, 8)}...</div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 