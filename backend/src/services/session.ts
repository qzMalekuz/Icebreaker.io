import { Session, MCQQuestion, Round } from '../types/index.js';

const sessions = new Map<string, Session>();
const SESSION_TTL_MS = parseInt(process.env.SESSION_TTL_MS ?? '300000', 10);

// ─── Create ───────────────────────────────────────────────────────────────────

export function createSession(
  roomId: string,
  players: [string, string],
  usernames: [string, string],
  questions: MCQQuestion[]
): Session {
  const rounds: Round[] = questions.map((q) => ({
    questionId: q.id,
    answers: { [players[0]]: null, [players[1]]: null },
    matched: null,
  }));

  const session: Session = {
    roomId,
    players,
    usernames,
    questions,
    rounds,
    currentRound: 0,
    status: 'active',
    createdAt: new Date(),
  };
  sessions.set(roomId, session);
  return session;
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getSession(roomId: string): Session | undefined {
  return sessions.get(roomId);
}

export function getSessionBySocketId(socketId: string): Session | undefined {
  for (const s of sessions.values()) {
    if (s.players.includes(socketId)) return s;
  }
  return undefined;
}

export function getActiveSessions(): number {
  return [...sessions.values()].filter((s) => s.status !== 'complete').length;
}

// ─── Answer logic ─────────────────────────────────────────────────────────────

/**
 * Records a player's answer for the current round.
 * Returns null if invalid (wrong status, already answered, wrong round).
 */
export function recordAnswer(
  roomId: string,
  socketId: string,
  optionId: string
): { bothAnswered: boolean } | null {
  const session = sessions.get(roomId);
  if (!session || session.status !== 'active') return null;

  const round = session.rounds[session.currentRound];
  if (!round) return null;

  // Idempotent — don't overwrite an existing answer
  if (round.answers[socketId] !== null && round.answers[socketId] !== undefined) return null;

  round.answers[socketId] = optionId;

  const bothAnswered = session.players.every((pid) => round.answers[pid] !== null);
  return { bothAnswered };
}

/**
 * Resolves the current round — checks if answers match, advances round counter.
 * Returns the round result and whether the game is over.
 */
export function resolveRound(roomId: string): {
  matched: boolean;
  answers: Record<string, string>;
  roundIndex: number;
  gameOver: boolean;
  allMatched: boolean;
} | null {
  const session = sessions.get(roomId);
  if (!session) return null;

  const roundIndex = session.currentRound;
  const round = session.rounds[roundIndex];

  const [a, b] = session.players;
  const answerA = round.answers[a] as string;
  const answerB = round.answers[b] as string;

  const matched = answerA === answerB;
  round.matched = matched;

  if (!matched) {
    // Mismatch — game over immediately
    session.status = 'complete';
    return { matched, answers: { [a]: answerA, [b]: answerB }, roundIndex, gameOver: true, allMatched: false };
  }

  // Matched — advance to next round
  const nextRound = roundIndex + 1;
  if (nextRound >= session.rounds.length) {
    // All 3 matched
    session.status = 'complete';
    return { matched, answers: { [a]: answerA, [b]: answerB }, roundIndex, gameOver: true, allMatched: true };
  }

  session.currentRound = nextRound;
  return { matched, answers: { [a]: answerA, [b]: answerB }, roundIndex, gameOver: false, allMatched: false };
}

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export function scheduleCleanup(roomId: string): void {
  const session = sessions.get(roomId);
  if (!session) return;
  session.cleanupTimer = setTimeout(() => sessions.delete(roomId), SESSION_TTL_MS);
}

export function deleteSession(roomId: string): void {
  const session = sessions.get(roomId);
  if (session?.cleanupTimer) clearTimeout(session.cleanupTimer);
  sessions.delete(roomId);
}
