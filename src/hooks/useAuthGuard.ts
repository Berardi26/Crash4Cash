'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { redirectTo = '/', requireAuth = true } = options;
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // If user is authenticated but shouldn't be on this page (e.g., login page)
        router.push('/profile');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  return {
    isAuthenticated,
    isLoading,
    shouldRender: requireAuth ? isAuthenticated : !isAuthenticated
  };
}; 