import { WSMessage } from '@/types/socket';
import { BaseUser, ChatMessage, GameMessage } from '@/types/types';
import { usePrivy } from '@privy-io/react-auth';
import { createContext, useContext, useEffect, useRef, ReactNode, useState, useMemo } from 'react';

interface WSContextType {
  ws: WebSocket | null;
  chatMessage: any;
  newEnteredUsers:BaseUser[];
  sendMessage: (data: any) => void;
}

const WSContext = createContext<WSContextType>({
  ws: null,
  chatMessage: [],
  newEnteredUsers: [],
  sendMessage: () => { },
});

export const WSProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const [chatMessage, setChatMessage] = useState<ChatMessage[]>([])
  const messageQueue = useRef<string[]>([]);
  const { authenticated, getAccessToken } = usePrivy()
  const intentionalClose = useRef(false);

  const [newEnteredUsers, setNewEnteredUsers] = useState<BaseUser[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat/messages`);
        const data = await res.json();
        if (Array.isArray(data.messages)) setChatMessage(data.messages);
      } catch (e) {
        console.error("Error fetching chat history:", e);
      }
    };
    fetchHistory();
  }, []);

  const connect = async () => {

    if (ws.current &&
      (ws.current.readyState === WebSocket.OPEN ||
        ws.current.readyState === WebSocket.CONNECTING)) {
      console.log("⚠️ Already connecting/open, skip");
      return;
    }

    intentionalClose.current = false;

    let WS_URL = 'ws://localhost:3001';
    try {
      const token = await getAccessToken();
      if (token) WS_URL += `?token=${token}`;
      else WS_URL += `?mode=anon`;
    } catch {
      WS_URL += `?mode=anon`;
    }

    ws.current = new WebSocket(WS_URL);
    setSocket(ws.current);

    ws.current.onopen = () => {
      console.log('✅ WebSocket connected');
      messageQueue.current.forEach((msg) => ws.current?.send(msg));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      const msg: WSMessage = JSON.parse(event.data);
      console.log('📩 Incoming:', msg);
      if (msg.type === 'chat') {
        setChatMessage((prev) => [...(prev), msg.data as ChatMessage]);
      }
      else if (msg.type === "game") {
        const data = msg.data as GameMessage
        if (data.category === "crash") {
          if (data.action === "join")
          {
            setNewEnteredUsers((prev) => [...(prev), data.user as BaseUser]);
          }
        }
      }
    };

    ws.current.onclose = () => {
      console.log('❌ WebSocket closed');
      if (!intentionalClose.current) {
        console.log('↻ Reconnecting in 5s...');
        reconnectTimeout.current = setTimeout(connect, 5000);
      }
    };

    ws.current.onerror = (err) => {
      console.log('⚠️ WebSocket error:', err);
      ws.current?.close(); // will trigger onclose
    };
  };



  useEffect(() => {
    console.log('🔌 trying to connect to WebSocket...');
    intentionalClose.current = true;
    if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    intentionalClose.current = false;

    connect();

    return () => {
      intentionalClose.current = true; // mark as intentional
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
      ws.current = null;
    };
  }, [authenticated]);


  const sendMessage = (msg: any) => {
    console.log("Sending message:", JSON.stringify(msg));
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
      console.log("Message sent:", JSON.stringify(msg));
    } else {
      // queue message if not connected
      messageQueue.current.push(JSON.stringify(msg));
      console.warn("WebSocket not open, message queued:", JSON.stringify(msg));
    }
  };


  const value = useMemo(() => (
    { ws: socket, chatMessage, newEnteredUsers, sendMessage }
  ), [socket, chatMessage, sendMessage]);

  return (
    <WSContext.Provider value={value}>
      {children}
    </WSContext.Provider>
  );
};

export const useWebSocket = () => useContext(WSContext);
