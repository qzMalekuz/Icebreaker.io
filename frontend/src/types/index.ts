export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
}

// Server → Client events
export interface MatchFoundPayload {
  roomId: string;
  question: MCQQuestion;
  round: number;       // 1-indexed
  totalRounds: number; // always 3
}

export interface NextQuestionPayload {
  question: MCQQuestion;
  round: number;
  totalRounds: number;
}

export interface RoundResultPayload {
  round: number;
  matched: boolean;
  yourAnswer: string;   // option id
  theirAnswer: string;  // option id
  optionTexts: Record<string, string>; // id -> text
}

export interface GameOverPayload {
  outcome: 'connected' | 'vanished';
  strangerUsername?: string;
  shareLink?: string;
}
