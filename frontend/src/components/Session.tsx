import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import { MCQQuestion, MatchFoundPayload, NextQuestionPayload, RoundResultPayload, GameOverPayload } from '../types';

type Phase = 'answering' | 'waiting_for_other' | 'round_result' | 'disconnected';

export default function Session() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket();

  const [question, setQuestion]           = useState<MCQQuestion | null>(null);
  const [round, setRound]                 = useState(1);
  const [phase, setPhase]                 = useState<Phase>('answering');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roundResult, setRoundResult]     = useState<RoundResultPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('matchPayload');
    if (raw) {
      const payload: MatchFoundPayload = JSON.parse(raw);
      setQuestion(payload.question);
      setRound(payload.round);
    }
  }, []);

  useEffect(() => {
    socket.on('answer_received',    () => setPhase('waiting_for_other'));
    socket.on('waiting_for_other',  () => setPhase(prev => prev === 'answering' ? prev : 'waiting_for_other'));
    socket.on('round_result', (data: RoundResultPayload) => { setRoundResult(data); setPhase('round_result'); });
    socket.on('next_question', (data: NextQuestionPayload) => {
      setQuestion(data.question);
      setRound(data.round);
      setSelectedOption(null);
      setRoundResult(null);
      setPhase('answering');
      sessionStorage.setItem('matchPayload', JSON.stringify({ ...data, roomId }));
    });
    socket.on('game_over', (data: GameOverPayload) => {
      sessionStorage.setItem('gameOver', JSON.stringify(data));
      navigate(`/result/${roomId}`);
    });
    socket.on('stranger_disconnected', () => setPhase('disconnected'));

    return () => {
      socket.off('answer_received');
      socket.off('waiting_for_other');
      socket.off('round_result');
      socket.off('next_question');
      socket.off('game_over');
      socket.off('stranger_disconnected');
    };
  }, [socket, navigate, roomId]);

  function handleSelect(optionId: string) {
    if (phase !== 'answering' || selectedOption) return;
    setSelectedOption(optionId);
    socket.emit('submit_answer', { roomId, optionId });
  }

  const cardBase = "bg-surface border border-[var(--border)] rounded-card p-10 max-w-[380px] w-full flex flex-col items-center gap-4 text-center";

  if (phase === 'disconnected') {
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className={cardBase}>
          <p className="font-display italic text-[1.8rem] text-text">they slipped away.</p>
          <p className="font-mono text-[0.82rem] text-text-muted">your stranger disconnected.</p>
          <button className="font-mono text-[0.82rem] text-text-muted underline underline-offset-[3px] bg-none border-none cursor-pointer hover:text-text" onClick={() => navigate('/')}>try again →</button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  if (phase === 'round_result' && roundResult) {
    const yourText  = roundResult.optionTexts[roundResult.yourAnswer];
    const theirText = roundResult.optionTexts[roundResult.theirAnswer];
    return (
      <div className="min-h-dvh flex items-center justify-center p-6">
        <div className="bg-surface border border-[var(--border)] rounded-card p-10 max-w-[500px] w-full flex flex-col items-center gap-5 text-center">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.1em] text-text-muted">round {roundResult.round} of 3</p>
          {roundResult.matched
            ? <p className="font-display text-[2.4rem] font-bold text-success">matched.</p>
            : <p className="font-display text-[2.4rem] font-bold text-danger">no match.</p>
          }
          <div className="flex items-center gap-3 w-full">
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
          {roundResult.matched && round < 3 && <p className="font-mono text-[0.76rem] italic text-text-muted">next question incoming...</p>}
          {!roundResult.matched && <p className="font-mono text-[0.82rem] text-text-muted">one mismatch ends it all.</p>}
        </div>
      </div>
    );
  }

  const waiting = phase === 'waiting_for_other';

  return (
    <div className="min-h-dvh flex flex-col max-w-[600px] mx-auto px-4 pt-6 pb-8 gap-5">
      {/* Round bar */}
      <div className="flex items-center gap-[0.6rem] py-3 px-4 bg-surface border border-[var(--border)] rounded-card">
        {[1, 2, 3].map(r => (
          <div
            key={r}
            className={`w-[10px] h-[10px] rounded-full transition-all duration-300 ${
              r < round  ? 'bg-success' :
              r === round ? 'bg-accent shadow-[0_0_8px_rgba(201,147,58,0.6)]' :
              'bg-transparent border border-[rgba(255,255,255,0.15)]'
            }`}
          />
        ))}
        <span className="ml-auto font-mono text-[0.75rem] text-text-muted">round {round} of 3</span>
      </div>

      {/* Question card */}
      <div className="bg-surface2 border border-[var(--border)] border-l-4 border-l-accent rounded-card px-[1.4rem] py-5 shadow-[inset_0_0_40px_rgba(0,0,0,0.3)]">
        <span className="block font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent mb-2">question</span>
        <p className="font-display italic text-[1.15rem] text-text leading-[1.5]">{question.question}</p>
      </div>

      {/* Anon note */}
      <p className="font-mono text-[0.75rem] text-text-muted text-center">
        {waiting ? 'locked in. waiting for the stranger...' : 'your answer stays hidden until you both choose.'}
      </p>

      {/* Options */}
      <div className="flex flex-col gap-[0.65rem]">
        {question.options.map(opt => {
          const isSelected = selectedOption === opt.id;
          const isLocked   = !!selectedOption;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              disabled={isLocked}
              className={`flex items-center gap-4 bg-surface border rounded-card px-5 py-4 cursor-pointer transition-all text-left ${
                isSelected
                  ? 'border-accent bg-[rgba(201,147,58,0.1)] shadow-[0_0_20px_rgba(201,147,58,0.2)]'
                  : isLocked
                  ? 'border-[var(--border)] opacity-30'
                  : 'border-[var(--border)] hover:border-[rgba(201,147,58,0.4)] hover:bg-[rgba(201,147,58,0.05)]'
              }`}
            >
              <span className="font-mono text-[0.8rem] font-medium text-accent uppercase">{opt.id}</span>
              <span className="font-mono text-[0.88rem] text-text flex-1 leading-[1.4]">{opt.text}</span>
              {isSelected && <span className="text-[0.85rem] text-accent">✓</span>}
            </button>
          );
        })}
      </div>

      {waiting && (
        <div className="flex items-center justify-center gap-[0.6rem] font-mono text-[0.78rem] text-text-muted">
          <div className="w-[7px] h-[7px] bg-accent rounded-full animate-blink" />
          <span>waiting for the stranger to answer...</span>
        </div>
      )}
    </div>
  );
}
