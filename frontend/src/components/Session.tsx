import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { MCQQuestion, MatchFoundPayload, NextQuestionPayload, RoundResultPayload, GameOverPayload } from '../types';

const DEMO_PROMPT = "What's something you believed until embarrassingly recently?";

const DEMO_OPTIONS = [
  { id: 'A', text: 'That "irregardless" is not a real word' },
  { id: 'B', text: 'That cracking knuckles causes arthritis' },
  { id: 'C', text: 'That we only use 10% of our brains' },
  { id: 'D', text: 'That lightning never strikes the same place twice' },
];

const DEMO_MESSAGES = [
  { sender: 'you',      text: 'Honestly? That the Great Wall of China is visible from space. Took me way too long to learn otherwise.' },
  { sender: 'stranger', text: 'Ha! Same energy — I thought "decimate" meant completely destroy. Turns out it literally means to reduce by a tenth.' },
];

type Phase = 'answering' | 'waiting_for_other' | 'round_result' | 'disconnected';

export default function Session() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket();
  const [searchParams] = useSearchParams();

  const [question, setQuestion]             = useState<MCQQuestion | null>(null);
  const [round, setRound]                   = useState(1);
  const [phase, setPhase]                   = useState<Phase>('answering');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roundResult, setRoundResult]       = useState<RoundResultPayload | null>(null);

  // Controls re-mount animation when the question changes
  const [questionKey, setQuestionKey] = useState(0);

  // For exit animation before game_over navigation
  const [exiting, setExiting] = useState(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchParams.get('demo') === 'session') return; // demo mode uses static data, no sessionStorage
    const raw = sessionStorage.getItem('matchPayload');
    if (raw) {
      const payload: MatchFoundPayload = JSON.parse(raw);
      setQuestion(payload.question);
      setRound(payload.round);
    }
  }, [searchParams]);

  useEffect(() => {
    socket.on('answer_received',   () => setPhase('waiting_for_other'));
    socket.on('waiting_for_other', () => setPhase(prev => prev === 'answering' ? prev : 'waiting_for_other'));

    socket.on('round_result', (data: RoundResultPayload) => {
      setRoundResult(data);
      setPhase('round_result');
    });

    socket.on('next_question', (data: NextQuestionPayload) => {
      setQuestion(data.question);
      setRound(data.round);
      setSelectedOption(null);
      setRoundResult(null);
      setPhase('answering');
      setQuestionKey(k => k + 1);
      sessionStorage.setItem('matchPayload', JSON.stringify({ ...data, roomId }));
    });

    socket.on('game_over', (data: GameOverPayload) => {
      sessionStorage.setItem('gameOver', JSON.stringify(data));
      setExiting(true);
      exitTimerRef.current = setTimeout(() => navigate(`/result/${roomId}`), 600);
    });

    socket.on('stranger_disconnected', () => setPhase('disconnected'));

    return () => {
      socket.off('answer_received');
      socket.off('waiting_for_other');
      socket.off('round_result');
      socket.off('next_question');
      socket.off('game_over');
      socket.off('stranger_disconnected');
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, [socket, navigate, roomId]);

  function handleSelect(optionId: string) {
    if (phase !== 'answering' || selectedOption) return;
    setSelectedOption(optionId);
    socket.emit('submit_answer', { roomId, optionId });
  }

  function handleLeave() {
    socket.emit('leave_room', { roomId });
    sessionStorage.removeItem('matchPayload');
    navigate('/');
  }

  const cardBase = "bg-surface border border-[var(--border)] rounded-card p-10 max-w-[380px] w-full flex flex-col items-center gap-4 text-center";

  // ── Disconnected ────────────────────────────────────────────────
  if (phase === 'disconnected') {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6 animate-route-in">
        <div className={`${cardBase} animate-slide-up`}>
          <p className="font-display italic text-[1.8rem] text-text">they slipped away.</p>
          <p className="font-mono text-[0.82rem] text-text-muted">your stranger disconnected.</p>
          <button
            className="font-mono text-[0.82rem] text-text-muted underline underline-offset-[3px] bg-none border-none cursor-pointer hover:text-text"
            onClick={() => navigate('/')}
          >
            try again →
          </button>
        </div>
      </div>
    );
  }

  // ── Demo / preview mode (/session/demo?demo=session) ────────────
  if (searchParams.get('demo') === 'session') {
    const demoRound = 3; // show turn 3/6 (middle of session)
    return (
      <div data-testid="session-demo" className="min-h-dvh flex flex-col max-w-[600px] mx-auto px-4 pt-6 pb-8 gap-5">
        {/* Round bar — round 3 of 3, showing turn 3/6 */}
        <div data-testid="round-bar" className="flex items-center gap-[0.6rem] py-3 px-4 bg-surface border border-[var(--border)] rounded-card">
          {[1, 2, 3].map(r => (
            <div key={r} className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
              r < demoRound ? 'bg-success' :
              r === demoRound ? 'bg-accent shadow-[0_0_8px_rgba(201,147,58,0.6)]' :
              'bg-transparent border border-[rgba(255,255,255,0.15)]'
            }`} />
          ))}
          <span data-testid="round-label" className="ml-auto font-mono text-[0.75rem] text-text-muted">round {demoRound} of 3</span>
          <span data-testid="turn-counter" className="font-mono text-[0.65rem] text-text-muted ml-3 opacity-60">3 / 6 messages</span>
        </div>

        {/* Prompt card */}
        <div data-testid="prompt-card" className="bg-surface2 border border-[var(--border)] border-l-4 border-l-accent rounded-card px-[1.4rem] py-5 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]">
          <span className="block font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent mb-2">prompt</span>
          <p data-testid="prompt-text" className="font-display italic text-[1.15rem] text-text leading-[1.5]">{DEMO_PROMPT}</p>
        </div>

        {/* Turn indicator */}
        <p data-testid="turn-indicator" className="font-mono text-[0.75rem] text-text-muted text-center">
          your turn — type your next message below.
        </p>

        {/* Message thread — 2 sample messages */}
        <div data-testid="message-thread" className="flex flex-col gap-3">
          {DEMO_MESSAGES.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div
                data-testid={msg.sender === 'you' ? 'message-bubble-right' : 'message-bubble-left'}
                className={`max-w-[75%] px-4 py-3 rounded-2xl font-mono text-[0.82rem] leading-[1.55] ${
                  msg.sender === 'you'
                    ? 'bg-accent text-[#281800] rounded-br-sm'
                    : 'bg-surface border border-[var(--border)] text-text rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Message input — send button disabled when empty */}
        <div className="flex gap-3 mt-auto">
          <input
            data-testid="message-input"
            type="text"
            placeholder="say something..."
            className="flex-1 bg-surface border border-[var(--border)] rounded-card px-4 py-3 font-mono text-[0.85rem] text-text outline-none focus:border-accent placeholder:text-text-muted"
            disabled
          />
          <button
            data-testid="send-btn"
            disabled
            className="px-5 py-3 rounded-card bg-accent text-[#281800] font-mono text-[0.75rem] font-bold uppercase tracking-[0.15em] opacity-30 cursor-not-allowed"
          >
            Send
          </button>
        </div>

        <p className="font-mono text-[0.6rem] text-center text-text-muted opacity-40 tracking-widest uppercase">demo preview — no live connection</p>
      </div>
    );
  }

  if (!question) return null;

  // ── Round result ─────────────────────────────────────────────────
  if (phase === 'round_result' && roundResult) {
    const yourText  = roundResult.optionTexts[roundResult.yourAnswer];
    const theirText = roundResult.optionTexts[roundResult.theirAnswer];
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="bg-surface border border-[var(--border)] rounded-card p-10 max-w-[500px] w-full flex flex-col items-center gap-5 text-center animate-result-slam">

          <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-text-muted opacity-0 animate-stagger-fade" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            round {roundResult.round} of 3
          </p>

          {roundResult.matched
            ? <p className="font-display text-[2.4rem] font-bold text-success opacity-0 animate-scale-in" style={{ animationDelay: '0.18s', animationFillMode: 'forwards' }}>matched.</p>
            : <p className="font-display text-[2.4rem] font-bold text-danger opacity-0 animate-scale-in" style={{ animationDelay: '0.18s', animationFillMode: 'forwards' }}>no match.</p>
          }

          <div className="flex items-center gap-3 w-full opacity-0 animate-stagger-fade" style={{ animationDelay: '0.32s', animationFillMode: 'forwards' }}>
            <div className="flex-1 flex flex-col gap-1 bg-surface2 border border-[var(--border)] p-[0.85rem_0.75rem] rounded-card">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">you</span>
              <span className="font-mono text-[0.8rem] text-text leading-[1.4]">{yourText}</span>
            </div>
            <div className="font-mono text-[1.3rem] text-text-muted">{roundResult.matched ? '=' : '≠'}</div>
            <div className="flex-1 flex flex-col gap-1 bg-surface2 border border-[var(--border)] p-[0.85rem_0.75rem] rounded-card">
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">stranger</span>
              <span className="font-mono text-[0.8rem] text-text leading-[1.4]">{theirText}</span>
            </div>
          </div>

          {roundResult.matched && round < 3 && (
            <p className="font-mono text-[0.76rem] italic text-text-muted opacity-0 animate-stagger-fade" style={{ animationDelay: '0.48s', animationFillMode: 'forwards' }}>
              next question incoming...
            </p>
          )}
          {!roundResult.matched && (
            <p className="font-mono text-[0.82rem] text-text-muted opacity-0 animate-stagger-fade" style={{ animationDelay: '0.48s', animationFillMode: 'forwards' }}>
              one mismatch ends it all.
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Answering / waiting ──────────────────────────────────────────
  const waiting = phase === 'waiting_for_other';

  return (
    <div
      className={`min-h-dvh flex flex-col max-w-[600px] mx-auto px-4 pt-6 pb-8 gap-5 transition-opacity duration-500 ${exiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Round bar */}
      <div className="flex items-center gap-[0.6rem] py-3 px-4 bg-surface border border-[var(--border)] rounded-card opacity-0 animate-stagger-fade" style={{ animationDelay: '0s', animationFillMode: 'forwards' }}>
        {[1, 2, 3].map(r => (
          <div
            key={r}
            className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
              r < round   ? 'bg-success' :
              r === round ? 'bg-accent shadow-[0_0_8px_rgba(201,147,58,0.6)]' :
              'bg-transparent border border-[rgba(255,255,255,0.15)]'
            }`}
          />
        ))}
        <span className="ml-auto font-mono text-[0.75rem] text-text-muted">round {round} of 3</span>
      </div>

      {/* Question card — re-keyed so it re-animates on each new question */}
      <div
        key={`q-${questionKey}`}
        className="bg-surface2 border border-[var(--border)] border-l-4 border-l-accent rounded-card px-[1.4rem] py-5 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] animate-question-reveal"
      >
        <span className="block font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent mb-2">question</span>
        <p className="font-display italic text-[1.15rem] text-text leading-[1.5]">{question.question}</p>
      </div>

      {/* Anon note */}
      <p className="font-mono text-[0.75rem] text-text-muted text-center opacity-0 animate-stagger-fade" style={{ animationDelay: '0.18s', animationFillMode: 'forwards' }}>
        {waiting ? 'locked in. waiting for the stranger...' : 'your answer stays hidden until you both choose.'}
      </p>

      {/* Options — each slides in with staggered delay, re-keyed on question change */}
      <div key={`opts-${questionKey}`} className="flex flex-col gap-[0.65rem]">
        {question.options.map((opt, i) => {
          const isSelected = selectedOption === opt.id;
          const isLocked   = !!selectedOption;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isLocked}
              className={`flex items-center gap-4 bg-surface border rounded-card px-5 py-4 cursor-pointer transition-all text-left opacity-0 animate-option-slide ${
                isSelected
                  ? 'border-accent bg-[rgba(201,147,58,0.1)] shadow-[0_0_20px_rgba(201,147,58,0.2)]'
                  : isLocked
                  ? 'border-[var(--border)] opacity-30'
                  : 'border-[var(--border)] hover:border-[rgba(201,147,58,0.4)] hover:bg-[rgba(201,147,58,0.05)]'
              }`}
              style={{ animationDelay: `${0.25 + i * 0.07}s`, animationFillMode: 'forwards' }}
            >
              <span className="font-mono text-[0.8rem] font-medium text-accent uppercase">{opt.id}</span>
              <span className="font-mono text-[0.88rem] text-text flex-1 leading-[1.4]">{opt.text}</span>
              {isSelected && <span className="text-[0.85rem] text-accent">✓</span>}
            </button>
          );
        })}
      </div>

      {waiting && (
        <div className="flex items-center justify-center gap-[0.6rem] font-mono text-[0.78rem] text-text-muted animate-fade-in">
          <div className="w-[7px] h-[7px] bg-accent rounded-full animate-blink" />
          <span>waiting for the stranger to answer...</span>
        </div>
      )}

      {/* Leave lobby */}
      <div className="flex justify-center pt-2">
        <button
          onClick={handleLeave}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-transparent border border-[rgba(80,69,55,0.2)] text-text-muted font-mono text-[0.6rem] uppercase tracking-[0.2em] cursor-pointer transition-all hover:border-danger hover:text-danger-light active:scale-[0.96]"
        >
          <span>↩</span> leave lobby
        </button>
      </div>
    </div>
  );
}
