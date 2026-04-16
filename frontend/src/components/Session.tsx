import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import {
  MCQQuestion,
  MatchFoundPayload,
  NextQuestionPayload,
  RoundResultPayload,
  GameOverPayload,
} from '../types';
import s from './Session.module.css';

type Phase =
  | 'answering'
  | 'waiting_for_other'
  | 'round_result'
  | 'disconnected';

export default function Session() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useSocket();

  const [question, setQuestion] = useState<MCQQuestion | null>(null);
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState<Phase>('answering');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<RoundResultPayload | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('matchPayload');
    if (raw) {
      const payload: MatchFoundPayload = JSON.parse(raw);
      setQuestion(payload.question);
      setRound(payload.round);
    }
  }, []);

  useEffect(() => {
    socket.on('answer_received', () => {
      setPhase('waiting_for_other');
    });

    socket.on('waiting_for_other', () => {
      setPhase((prev) => (prev === 'answering' ? prev : 'waiting_for_other'));
    });

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
      sessionStorage.setItem('matchPayload', JSON.stringify({ ...data, roomId }));
    });

    socket.on('game_over', (data: GameOverPayload) => {
      sessionStorage.setItem('gameOver', JSON.stringify(data));
      navigate(`/result/${roomId}`);
    });

    socket.on('stranger_disconnected', () => {
      setPhase('disconnected');
    });

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

  if (phase === 'disconnected') {
    return (
      <div className={s.centerPage}>
        <div className={s.card}>
          <p className={s.bigText}>they slipped away.</p>
          <p className={s.muted}>your stranger disconnected.</p>
          <button className={s.linkBtn} onClick={() => navigate('/')}>try again →</button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  if (phase === 'round_result' && roundResult) {
    const yourText = roundResult.optionTexts[roundResult.yourAnswer];
    const theirText = roundResult.optionTexts[roundResult.theirAnswer];

    return (
      <div className={s.centerPage}>
        <div className={s.resultCard}>
          <p className={s.roundTag}>round {roundResult.round} of 3</p>
          {roundResult.matched
            ? <p className={s.matchLabel}>matched.</p>
            : <p className={s.mismatchLabel}>no match.</p>
          }
          <div className={s.compareGrid}>
            <div className={s.compareBox}>
              <span className={s.compareWho}>you</span>
              <span className={s.compareAnswer}>{yourText}</span>
            </div>
            <div className={s.compareDivider}>{roundResult.matched ? '=' : '≠'}</div>
            <div className={s.compareBox}>
              <span className={s.compareWho}>stranger</span>
              <span className={s.compareAnswer}>{theirText}</span>
            </div>
          </div>
          {roundResult.matched && round < 3 && (
            <p className={s.nextHint}>next question incoming...</p>
          )}
          {!roundResult.matched && (
            <p className={s.muted}>one mismatch ends it all.</p>
          )}
        </div>
      </div>
    );
  }

  const waiting = phase === 'waiting_for_other';

  return (
    <div className={s.page}>
      <div className={s.roundBar}>
        {[1, 2, 3].map((r) => (
          <div
            key={r}
            className={`${s.roundDot} ${r < round ? s.dotDone : r === round ? s.dotActive : s.dotPending}`}
          />
        ))}
        <span className={s.roundLabel}>round {round} of 3</span>
      </div>

      <div className={s.questionCard}>
        <span className={s.questionLabel}>question</span>
        <p className={s.questionText}>{question.question}</p>
      </div>

      <p className={s.anonNote}>
        {waiting
          ? 'locked in. waiting for the stranger...'
          : 'your answer stays hidden until you both choose.'}
      </p>

      <div className={s.options}>
        {question.options.map((opt) => {
          const isSelected = selectedOption === opt.id;
          const isLocked = !!selectedOption;
          return (
            <button
              key={opt.id}
              className={`${s.option} ${isSelected ? s.optionSelected : ''} ${isLocked && !isSelected ? s.optionDimmed : ''}`}
              onClick={() => handleSelect(opt.id)}
              disabled={isLocked}
            >
              <span className={s.optionId}>{opt.id}</span>
              <span className={s.optionText}>{opt.text}</span>
              {isSelected && <span className={s.optionCheck}>✓</span>}
            </button>
          );
        })}
      </div>

      {waiting && (
        <div className={s.waitingBar}>
          <div className={s.waitingDot} />
          <span>waiting for the stranger to answer...</span>
        </div>
      )}
    </div>
  );
}
