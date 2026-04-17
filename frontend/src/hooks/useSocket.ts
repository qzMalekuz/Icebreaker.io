import { useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// In dev: VITE_SOCKET_URL is empty → connects to same origin, Vite proxy forwards to localhost:3001.
// In production: VITE_SOCKET_URL=https://icebreaker.zafarr.xyz → connects directly to backend.
const socket: Socket = io("https://icebreaker.zafarr.xyz" , {
  path: '/socket.io',
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 3000,
});

socket.on('connect', () => {
  console.log('[socket] connected:', socket.id);
});
socket.on('disconnect', (reason) => {
  console.log('[socket] disconnected:', reason);
});
socket.on('connect_error', (err) => {
  console.log('[socket] connect_error:', err.message);
});

export function useSocket(): Socket {
  return useRef<Socket>(socket).current;
}

export function disconnectSocket(): void {
  socket.disconnect();
}
