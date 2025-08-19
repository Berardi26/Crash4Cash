import { WSMessage } from '@/types/socket';
import { usePrivy } from '@privy-io/react-auth';
import { createContext, useContext, useEffect, useRef, ReactNode, useState } from 'react';

interface WSContextType {
  ws: WebSocket | null;
  sendMessage: (data: WSMessage) => void;
}

const WSContext = createContext<WSContextType>({
  ws: null,
  sendMessage: () => { },
});

export const WSProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<string[]>([]);
  const { authenticated, getAccessToken } = usePrivy()
  const intentionalClose = useRef(false);

  const connect = async () => {
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
    };

    ws.current.onclose = () => {
      console.log('❌ WebSocket closed');
      if (!intentionalClose.current) {
        console.log('↻ Reconnecting in 2s...');
        reconnectTimeout.current = setTimeout(connect, 2000);
      }
    };

    ws.current.onerror = (err) => {
      console.error('⚠️ WebSocket error:', err);
      ws.current?.close(); // will trigger onclose
    };
  };

  useEffect(() => {
    console.log('🔌 trying to connect to WebSocket...');
    connect();

    return () => {
      intentionalClose.current = true; // mark as intentional
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, [authenticated]);


  const sendMessage = (msg: WSMessage) => {
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

  return (
    <WSContext.Provider value={{ ws: socket, sendMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWebSocket = () => useContext(WSContext);
