import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { addToQueue, removeFromQueue, tryMatch } from '../services/matchmaking.js';
import {
  createSession,
  getSession,
  getSessionBySocketId,
  recordAnswer,
  resolveRound,
  scheduleCleanup,
  deleteSession,
} from '../services/session.js';
import { getSessionQuestions } from '../services/prompts.js';

function broadcastOnlineCount(io: Server): void {
  io.emit('queue_update', { onlineCount: io.engine.clientsCount });
}


export function registerHandlers(io: Server, socket: Socket): void {
  console.log(`[connect]    ${socket.id} | total: ${io.engine.clientsCount}`);
  broadcastOnlineCount(io);

  // ─── join_queue ────────────────────────────────────────────────────
  socket.on('join_queue', ({ username }: { username: string }) => {
    const cleanName = (username ?? '').slice(0, 20).trim();
    if (!cleanName) return;

    addToQueue({ socketId: socket.id, username: cleanName, joinedAt: new Date() });
    console.log(`[queue]      ${socket.id} as "${cleanName}"`);

    const pair = tryMatch();
    if (pair) {
      const [a, b] = pair;
      const roomId = uuidv4();
      const questions = getSessionQuestions();

      createSession(roomId, [a.socketId, b.socketId], [a.username, b.username], questions);
      console.log(`[match]      "${a.username}" <-> "${b.username}" room: ${roomId}`);

      io.in(a.socketId).socketsJoin(roomId);
      io.in(b.socketId).socketsJoin(roomId);

      // Send each player the first question — no usernames revealed yet
      const firstQ = questions[0];
      io.to(a.socketId).emit('match_found', { roomId, question: firstQ, round: 1, totalRounds: 3 });
      io.to(b.socketId).emit('match_found', { roomId, question: firstQ, round: 1, totalRounds: 3 });
    } else {
      console.log(`[queue]      waiting for pair...`);
    }

    broadcastOnlineCount(io);
  });

  // ─── leave_queue ───────────────────────────────────────────────────
  socket.on('leave_queue', () => {
    removeFromQueue(socket.id);
    broadcastOnlineCount(io);
  });

  // ─── submit_answer ─────────────────────────────────────────────────
  // Payload: { roomId: string, optionId: string }
  socket.on('submit_answer', ({ roomId, optionId }: { roomId: string; optionId: string }) => {
    const session = getSession(roomId);
    if (!session || session.status !== 'active') return;

    // Only players in this room can answer
    if (!session.players.includes(socket.id)) return;

    // Valid option ids are a-d
    if (!['a', 'b', 'c', 'd'].includes(optionId)) return;

    const result = recordAnswer(roomId, socket.id, optionId);
    if (!result) return; // already answered or invalid

    // Confirm to the answering player that their answer was received
    socket.emit('answer_received', { round: session.currentRound + 1 });
    console.log(`[answer]     ${socket.id} round ${session.currentRound + 1}: ${optionId}`);

    if (!result.bothAnswered) {
      // Tell both players that one person has answered (anonymously)
      io.to(roomId).emit('waiting_for_other', { round: session.currentRound + 1 });
      return;
    }

    // Both answered — resolve the round
    const resolution = resolveRound(roomId);
    if (!resolution) return;

    const { matched, answers, roundIndex, gameOver, allMatched } = resolution;
    const [pidA, pidB] = session.players;

    console.log(`[resolve]    round ${roundIndex + 1}: ${matched ? 'MATCH' : 'MISMATCH'}`);

    // Send each player the result — they see what BOTH chose (reveal after both answer)
    const roundResult = {
      round: roundIndex + 1,
      matched,
      yourAnswer: '',       // filled per player below
      theirAnswer: '',
      optionTexts: Object.fromEntries(
        session.questions[roundIndex].options.map((o) => [o.id, o.text])
      ),
    };

    io.to(pidA).emit('round_result', {
      ...roundResult,
      yourAnswer: answers[pidA],
      theirAnswer: answers[pidB],
    });
    io.to(pidB).emit('round_result', {
      ...roundResult,
      yourAnswer: answers[pidB],
      theirAnswer: answers[pidA],
    });

    if (gameOver) {
      scheduleCleanup(roomId);

      if (allMatched) {
        // All 3 matched — reveal usernames and offer to connect
        const shareLink = `${process.env.CLIENT_URL ?? 'http://localhost:5173'}/share/${roomId}`;
        io.to(pidA).emit('game_over', {
          outcome: 'connected',
          strangerUsername: session.usernames[1],
          shareLink,
        });
        io.to(pidB).emit('game_over', {
          outcome: 'connected',
          strangerUsername: session.usernames[0],
          shareLink,
        });
      } else {
        // Mismatch — vanish, no info
        io.to(roomId).emit('game_over', { outcome: 'vanished' });
      }
    } else {
      // Advance — send next question after short delay so the UI can show the result
      const nextQ = session.questions[session.currentRound];
      setTimeout(() => {
        io.to(roomId).emit('next_question', {
          question: nextQ,
          round: session.currentRound + 1,
          totalRounds: 3,
        });
      }, 2500); // 2.5s for both players to read the round result
    }
  });

  // ─── disconnect ────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[disconnect] ${socket.id} | total: ${io.engine.clientsCount}`);
    removeFromQueue(socket.id);

    const session = getSessionBySocketId(socket.id);
    if (session && session.status !== 'complete') {
      const otherId = session.players.find((p) => p !== socket.id);
      if (otherId) io.to(otherId).emit('stranger_disconnected');
      deleteSession(session.roomId);
    }

    broadcastOnlineCount(io);
  });
}
