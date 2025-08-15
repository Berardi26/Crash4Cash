import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';
import { usePrivy } from '@privy-io/react-auth';

// Define the shape of a chat message
export interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  content: string;
  timestamp: string;
  type?: string;
  level?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export function useProfile() {
  const { userProfile, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {getAccessToken} = usePrivy();
  
  // Update profile API call
  const updateProfile = useCallback(async (profileData: {
    username?: string;
    email?: string | null;
    discordName?: string;
    discordAvatar?: string;
    xUsername?: string;
  }) => {
    const token = await getAccessToken();
    if (!token) {
      setError('Not authenticated');
      setSuccess(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Failed to update profile');
        setSuccess(false);
        setLoading(false);
        return false;
      }
      const data = await response.json();
      updateUser(data.user);
      setSuccess(true);
      return true
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      setSuccess(false);
      return false
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  return {
    updateProfile,
    loading,
    error,
    success,
    userProfile,
  };
} 