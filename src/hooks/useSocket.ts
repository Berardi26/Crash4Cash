import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ESOCKET_NAMESPACE,
  IGameServerToClientEvents,
  IChatServerToClientEvents,
  IChatClientToServerEvents
} from '@/types/socket';
import { SOCKET_URL } from '@/config';

type SocketNamespaces = {
  game: Socket<IGameServerToClientEvents>;
  chat: Socket<IChatServerToClientEvents, IChatClientToServerEvents>;
};

type SocketConnectionState = {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
};

export const useSocket = () => {
  const sockets = useRef<SocketNamespaces>({} as SocketNamespaces);
  const [connections, setConnections] = useState<{
    game: SocketConnectionState;
    chat: SocketConnectionState;
  }>({
    game: { isConnected: false, error: null, reconnectAttempts: 0 },
    chat: { isConnected: false, error: null, reconnectAttempts: 0 }
  });

  useEffect(() => {
    // Initialize Game Socket
    console.log("Initialize socket", SOCKET_URL)
    sockets.current.game = io(`${SOCKET_URL}${ESOCKET_NAMESPACE.game}`, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    });

    // Initialize Chat Socket
    sockets.current.chat = io(`${SOCKET_URL}${ESOCKET_NAMESPACE.chat}`, {
      withCredentials: true,
      autoConnect: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 5000,
    });

    // Setup Game Socket Event Handlers
    const setupGameSocket = () => {
      const gameSocket = sockets.current.game;

      gameSocket.on('connect', () => {
        setConnections(prev => ({
          ...prev,
          game: {
            ...prev.game,
            isConnected: true,
            error: null,
            reconnectAttempts: 0
          }
        }));
      });

      gameSocket.on('disconnect', () => {
        setConnections(prev => ({
          ...prev,
          game: { ...prev.game, isConnected: false }
        }));
      });

      gameSocket.on('connect_error', (err) => {
        setConnections(prev => ({
          ...prev,
          game: {
            ...prev.game,
            error: err.message,
            isConnected: false
          }
        }));
      });

    (gameSocket as Socket).on('reconnect_attempt', (attempt: number) => {
      setConnections((prev: {
        game: SocketConnectionState;
        chat: SocketConnectionState;
      }) => ({
        ...prev,
        game: { ...prev.game, reconnectAttempts: attempt }
      }));
    });
    };

    // Setup Chat Socket Event Handlers
    const setupChatSocket = () => {
      const chatSocket = sockets.current.chat;

      chatSocket.on('connect', () => {
        setConnections(prev => ({
          ...prev,
          chat: {
            ...prev.chat,
            isConnected: true,
            error: null,
            reconnectAttempts: 0
          }
        }));
      });

      chatSocket.on('disconnect', () => {
        setConnections(prev => ({
          ...prev,
          chat: { ...prev.chat, isConnected: false }
        }));
      });

      chatSocket.on('connect_error', (err) => {
        setConnections(prev => ({
          ...prev,
          chat: {
            ...prev.chat,
            error: err.message,
            isConnected: false
          }
        }));
      });

    (chatSocket as Socket).on('reconnect_attempt', (attempt: number) => {
      setConnections((prev: {
        game: SocketConnectionState;
        chat: SocketConnectionState;
      }) => ({
        ...prev,
        chat: { ...prev.chat, reconnectAttempts: attempt }
      }));
    });
    };

    setupGameSocket();
    setupChatSocket();

    // Cleanup function
    return () => {
      Object.entries(sockets.current).forEach(([namespace, socket]) => {
        if (namespace === 'game') {
          (socket as Socket<IGameServerToClientEvents>).off('connect');
          (socket as Socket<IGameServerToClientEvents>).off('disconnect');
          (socket as Socket<IGameServerToClientEvents>).off('connect_error');
          (socket as Socket).off('reconnect_attempt');
          (socket as Socket<IGameServerToClientEvents>).disconnect();
        } else if (namespace === 'chat') {
          (socket as Socket<IChatServerToClientEvents, IChatClientToServerEvents>).off('connect');
          (socket as Socket<IChatServerToClientEvents, IChatClientToServerEvents>).off('disconnect');
          (socket as Socket<IChatServerToClientEvents, IChatClientToServerEvents>).off('connect_error');
          (socket as Socket).off('reconnect_attempt');
          (socket as Socket<IChatServerToClientEvents, IChatClientToServerEvents>).disconnect();
        }
      });
    };
  }, []);

  return {
    sockets: sockets.current,
    connections,
    // Helper methods
    reconnectAll: () => {
      Object.values(sockets.current).forEach(socket => {
        if (!socket.connected) {
          socket.connect();
        }
      });
    }
  };
};