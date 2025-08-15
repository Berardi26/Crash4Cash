// socket.ts
import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || 'http://localhost:3001';

export const socket: Socket = io(WS_URL, {
   transports: ['polling'],
  reconnection: true,
  timeout: 20000,
  autoConnect: false, // connect later
});
 