import { useRef } from 'react';
import { io, Socket } from 'socket.io-client';

// Connect through Vite's proxy (same origin) to avoid CORS entirely.
// The proxy forwards /socket.io → http://localhost:3001 with WebSocket support.
const socket: Socket = io({
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
