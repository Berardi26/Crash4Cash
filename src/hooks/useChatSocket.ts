import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ESOCKET_NAMESPACE, IChatClientToServerEvents, IChatServerToClientEvents } from '@/types/socket';
import { SOCKET_URL } from '@/config';

export const useChatSocket = () => {
    const [chatSocket, setChatSocket] = useState<Socket<
        IChatServerToClientEvents,
        IChatClientToServerEvents
    > | null>(null);
    const [isCConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(`${SOCKET_URL}${ESOCKET_NAMESPACE.chat}`, {
            withCredentials: true,
            autoConnect: true,
        })

        socketInstance.on('connect', () => {
            console.log("🚀 ~ socketInstance.on ~ connect:", "connect")
            setIsConnected(true);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });

        setChatSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return { chatSocket, isCConnected };
};