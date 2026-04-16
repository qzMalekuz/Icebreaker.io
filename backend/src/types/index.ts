export interface MCQOption {
  id: string; // 'a' | 'b' | 'c' | 'd'
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
}

export interface Round {
  questionId: string;
  answers: Record<string, string | null>; // socketId -> optionId (null = not answered)
  matched: boolean | null;                 // null until both answered
}

export interface Session {
  roomId: string;
  players: [string, string];
  usernames: [string, string];
  questions: MCQQuestion[];  // 3 questions selected at match time
  rounds: Round[];           // 3 rounds, one per question
  currentRound: number;      // 0-indexed, 0–2
  status: 'active' | 'complete';
  createdAt: Date;
  cleanupTimer?: ReturnType<typeof setTimeout>;
}

export interface QueueEntry {
  socketId: string;
  username: string;
  joinedAt: Date;
}
