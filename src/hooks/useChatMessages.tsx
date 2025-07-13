import { useEffect, useRef, useState, useCallback } from 'react';

// Define the shape of a chat message
export interface ChatMessage {
  id: string;
  user: string;
  level?: number;
  avatar?: string;
  content: string;
  timestamp: string;
}

const WS_URL = 'wss://your-chat-server.example/ws'; // TODO: Replace with your actual WebSocket URL

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(

    [
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Hello",
        timestamp: "23:20"
      },
      {
        id: '23233',
        user: "Zill",
        level: 22,
        content: "I can show the world, shining shimering splended tell me princes now when did you last let your heart decide, I can open your eyes, take wonder by wonder, over said way under on a magic capet ride.",
        timestamp: "23:22"
      },
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Ah whole new world, Ah new fantasitc point of view, no one to tell us No, or where to go, or say we are only dreaming, Ah whole new world, Ah fantaistic place I never knew, but now it's cristal clear, that now I am in the whole new world with you.",
        timestamp: "23:26"
      },
      {
        id: '23233',
        user: "Zill",
        level: 22,
        content: "I can show the world, shining shimering splended tell me princes now when did you last let your heart decide, I can open your eyes, take wonder by wonder, over said way under on a magic capet ride.",
        timestamp: "23:22"
      },
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Ah whole new world, Ah new fantasitc point of view, no one to tell us No, or where to go, or say we are only dreaming, Ah whole new world, Ah fantaistic place I never knew, but now it's cristal clear, that now I am in the whole new world with you.",
        timestamp: "23:26"
      },
      {
        id: '23233',
        user: "Zill",
        level: 22,
        content: "I can show the world, shining shimering splended tell me princes now when did you last let your heart decide, I can open your eyes, take wonder by wonder, over said way under on a magic capet ride.",
        timestamp: "23:22"
      },
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Ah whole new world, Ah new fantasitc point of view, no one to tell us No, or where to go, or say we are only dreaming, Ah whole new world, Ah fantaistic place I never knew, but now it's cristal clear, that now I am in the whole new world with you.",
        timestamp: "23:26"
      },
      {
        id: '23233',
        user: "Zill",
        level: 22,
        content: "I can show the world, shining shimering splended tell me princes now when did you last let your heart decide, I can open your eyes, take wonder by wonder, over said way under on a magic capet ride.",
        timestamp: "23:22"
      },
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Ah whole new world, Ah new fantasitc point of view, no one to tell us No, or where to go, or say we are only dreaming, Ah whole new world, Ah fantaistic place I never knew, but now it's cristal clear, that now I am in the whole new world with you.",
        timestamp: "23:26"
      },
      {
        id: '23233',
        user: "Zill",
        level: 22,
        content: "I can show the world, shining shimering splended tell me princes now when did you last let your heart decide, I can open your eyes, take wonder by wonder, over said way under on a magic capet ride.",
        timestamp: "23:22"
      },
      {
        id: '23234',
        user: "Chris",
        level: 12,
        content: "Ah whole new world, Ah new fantasitc point of view, no one to tell us No, or where to go, or say we are only dreaming, Ah whole new world, Ah fantaistic place I never knew, but now it's cristal clear, that now I am in the whole new world with you.",
        timestamp: "23:26"
      },
    ]
  );
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          setMessages(data);
        } else if (data && data.type === 'message') {
          setMessages((prev) => [...prev, data.message]);
        }
      } catch (e) {
        // Handle parse error
      }
    };

    ws.current.onerror = (err) => {
      // Optionally handle error
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = useCallback((msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'message', ...msg }));
    }
  }, []);

  return { messages, sendMessage };
} 