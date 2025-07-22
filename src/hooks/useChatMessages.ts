import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

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
const WS_URL = API_URL.replace(/\/api$/, '');

export function useChatMessages() {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const socketRef = useRef<Socket | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/chat/messages?limit=50`);
        const data = await res.json();
        console.log("chat history", data)
        if (Array.isArray(data.messages)) {
          setMessages(
            data.messages.map((msg: any) => ({
              id: msg.id || msg._id,
              user: msg.user?.username || 'Unknown',
              avatar: msg.user?.avatar,
              content: msg.message,
              timestamp: msg.createdAt,
              type: msg.type,
            }))
          );
        }
      } catch (e) {
        console.error("Error fetching chat history:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Setup socket connection
  useEffect(() => {
    console.log("useChatMessages useEffect, token:", token);
    console.log("WebSocket URL:", WS_URL);
    console.log("Creating socket connection...");
    
    // Always connect to socket for receiving messages (even without token)
    const socket = io(WS_URL, {
      auth: token ? { token } : undefined,
      transports: ['polling'],
      reconnection: true,
      timeout: 20000,
      forceNew: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log("✅ socket connected!")
      console.log("Socket ID:", socket.id);
      console.log("Transport:", socket.io.engine.transport.name);
    });

    socket.on('connect_error', (err) => {
      console.log("❌ socket failed!", err)
    });

    socket.on('disconnect', (reason) => {
      console.log("🔌 socket disconnected:", reason)
    });

    socket.on('error', (error) => {
      console.log("🚨 socket error:", error)
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log("🔄 socket reconnected after", attemptNumber, "attempts");
    });

    socket.on('reconnect_error', (error) => {
      console.log("🚨 socket reconnect error:", error);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log("🔄 reconnect attempt:", attemptNumber);
    });

    socket.on('new_message', (msg: any) => {
      console.log("new message")
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || msg._id,
          user: msg.user?.username || 'Unknown',
          avatar: msg.user?.avatar,
          content: msg.message,
          timestamp: msg.createdAt,
          type: msg.type,
        },
      ]);
    });

    socket.on('user_typing', (data: { username: string }) => {
      console.log("user typing")
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    socket.on('user_stopped_typing', (data: { username: string }) => {
      console.log("stop typing")
      setTypingUsers((prev) => prev.filter((u) => u !== data.username));
    });

    socket.on('online_users_count', (count: number) => {
      console.log("online user count")
      setOnlineCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Send message - only works if user is logged in
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !token || !content.trim()) {
      console.log("Cannot send message:", { 
        hasSocket: !!socketRef.current, 
        hasToken: !!token, 
        hasContent: !!content.trim() 
      });
      return;
    }
    console.log("Sending message:", content);
    socketRef.current.emit('send_message', {
      message: content,
      type: 'text',
    });
    stopTyping();
  }, [token]);

  // Typing indicator logic - only works if user is logged in
  const startTyping = useCallback(() => {
    if (!socketRef.current || !token) return;
    socketRef.current.emit('typing_start', {});
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [token]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !token) return;
    socketRef.current.emit('typing_stop', {});
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, [token]);

  return { 
    messages, 
    sendMessage, 
    loading, 
    typingUsers, 
    onlineCount, 
    startTyping, 
    stopTyping,
    isAuthenticated: !!token 
  };
} 