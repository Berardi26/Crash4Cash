// ChatMessagesContext.tsx
import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { socket } from "@/utils/socket";
import { Socket } from "socket.io-client";
import { ChatMessage } from "@/types/types";

type ChatContextType = {
  messages: ChatMessage[];
  sendMessage: (msg: string) => void;
  loading: boolean;
  typingUsers: string[];
  onlineCount: number;
  startTyping: () => void;
  stopTyping: () => void;
  isAuthenticated: boolean;
};

const ChatMessagesContext = createContext<ChatContextType | null>(null);

export const ChatMessagesProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineCount, setOnlineCount] = useState<number>(1);

  const socketRef = useRef<Socket | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const { authenticated, getAccessToken } = usePrivy();

  // Fetch token once when authenticated
  useEffect(() => {
    if (authenticated) {
      getAccessToken().then(setToken);
    }
  }, [authenticated, getAccessToken]);

  // Fetch chat history once
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/chat/messages`);
        const data = await res.json();
        if (Array.isArray(data.messages)) setMessages(data.messages);
      } catch (e) {
        console.error("Error fetching chat history:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Setup socket connection once
  useEffect(() => {
    if (!token || socketRef.current) return;

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
    });

    socket.on("new_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user_typing", ({ username }) => {
      setTypingUsers((prev) => (prev.includes(username) ? prev : [...prev, username]));
    });

    socket.on("user_stopped_typing", ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    socket.on("online_users_count", (count: number) => {
      setOnlineCount(count);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!socketRef.current || !token || !content.trim()) return;
      socketRef.current.emit("send_message", { message: content, type: "text" });
      stopTyping();
    },
    [token]
  );

  const startTyping = useCallback(() => {
    if (!socketRef.current || !token) return;
    socketRef.current.emit("typing_start", {});
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => stopTyping(), 2000);
  }, [token]);

  const stopTyping = useCallback(() => {
    if (!socketRef.current || !token) return;
    socketRef.current.emit("typing_stop", {});
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
  }, [token]);

  return (
    <ChatMessagesContext.Provider
      value={{
        messages,
        sendMessage,
        loading,
        typingUsers,
        onlineCount,
        startTyping,
        stopTyping,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </ChatMessagesContext.Provider>
  );
};

export const useChatMessages = () => {
  const ctx = useContext(ChatMessagesContext);
  if (!ctx) throw new Error("useChatMessages must be used inside ChatMessagesProvider");
  return ctx;
};
