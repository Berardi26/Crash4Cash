'use client'
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivy } from '@privy-io/react-auth';

const AuthDebug: React.FC = () => {
  const { isAuthenticated, isLoading, token } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const {
    ready,
    authenticated,
    user,
  } = usePrivy();

  const email = user?.email;
  const phone = user?.phone;
  const wallet = user?.wallet;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 p-4 rounded-lg backdrop-blur-sm text-xs text-white max-w-sm z-50">
      <h4 className="font-bold mb-2">Auth Debug</h4>
      <div className="space-y-1">
        <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
        <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
        <div>Wallet Connected: {authenticated ? 'Yes' : 'No'}</div>
        <div>Has Token: {token ? 'Yes' : 'No'}</div>
        <div>Has User: {user ? 'Yes' : 'No'}</div>
        {user && (
          <div>email:<p>{email?.address}</p></div>
        )}
        {wallet && (
          <div>Wallet: {wallet?.address.toString().slice(0, 8)}...</div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug; 