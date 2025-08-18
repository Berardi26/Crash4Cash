import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';

interface WSContextType {
  ws: WebSocket | null;
  sendMessage: (data: string) => void;
}

const WSContext = createContext<WSContextType>({
  ws: null,
  sendMessage: () => {},
});

export const WSProvider = ({ children }: { children: ReactNode }) => {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const messageQueue = useRef<string[]>([]);

  const connect = () => {
    const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:3001';
    ws.current = new WebSocket('ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket connected');

      // send queued messages
      messageQueue.current.forEach((msg) => ws.current?.send(msg));
      messageQueue.current = [];
    };

    ws.current.onmessage = (event) => {
      console.log('Server message:', event.data);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected, reconnecting in 2s...');
      reconnectTimeout.current = setTimeout(connect, 2000);
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
      ws.current?.close(); // trigger reconnect
    };
  };

  useEffect(() => {
    console.log("trying to connect to WebSocket...");
    connect();

    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      ws.current?.close();
    };
  }, []);

  const sendMessage = (data: string) => {
    console.log("Sending message:", data);
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(data);
      console.log("Message sent:", data);
    } else {
      // queue message if not connected
      messageQueue.current.push(data);
      console.warn("WebSocket not open, message queued:", data);
    }
  };

  return (
    <WSContext.Provider value={{ ws: ws.current, sendMessage }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWebSocket = () => useContext(WSContext);
