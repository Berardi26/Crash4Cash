'use client'
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@solana/wallet-adapter-react';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback 
}) => {
  const { isAuthenticated, isLoading, userProfile } = useAuth();
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !userProfile || !connected)) {
      // Only redirect if we're not already on the home page
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, userProfile, connected, router]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-crash bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/70 p-8 rounded-lg backdrop-blur-sm text-center">
          <LoadingSpinner size="lg" text="Checking authentication..." />
        </div>
      </div>
    );
  }

  // Show authentication required message
  if (!isAuthenticated || !userProfile || !connected) {
    return (
      <div className="min-h-screen bg-crash bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/70 p-8 rounded-lg backdrop-blur-sm text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Authentication Required</h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to access this page.
          </p>
          
          {!connected ? (
            <div className="space-y-4">
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-yellow-400 text-sm">
                Wallet connected but not authenticated. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Show protected content
  return <>{children}</>;
};

export default ProtectedRoute; 