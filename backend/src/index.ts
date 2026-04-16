import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerHandlers } from './socket/handlers.js';
import { allPrompts } from './services/prompts.js';
import { getActiveSessions } from './services/session.js';
import { getQueueLength } from './services/matchmaking.js';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// ─── REST endpoints ───────────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (_req, res) => {
  res.json({
    onlineCount: getQueueLength(),
    activeSessions: getActiveSessions(),
  });
});

app.get('/api/prompts', (_req, res) => {
  res.json(allPrompts);
});

// ─── Socket.io ────────────────────────────────────────────────────────────────

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  registerHandlers(io, socket);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
