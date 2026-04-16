import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import s from './WaitingRoom.module.css';

const TIPS = [
  'Connections happen in the spaces between words.',
  'The best conversations start with a question.',
  'Every stranger is a story you haven\'t heard yet.',
  'Anonymity is the beginning of honesty.',
  'Three answers. One connection. No names.',
];

export default function WaitingRoom() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [strangerNum] = useState(() => Math.floor(1000 + Math.random() * 9000));

  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (!username) {
      navigate('/');
      return;
    }

    function joinQueue() {
      console.log('[WaitingRoom] emitting join_queue as', username);
      socket.emit('join_queue', { username });
    }

    if (socket.connected) {
      joinQueue();
    } else {
      socket.once('connect', joinQueue);
    }

    socket.on('reconnect', joinQueue);

    socket.on('online_count', (count: number) => setOnlineCount(count));

    socket.on('match_found', (payload) => {
      console.log('[WaitingRoom] match_found!', payload.roomId);
      sessionStorage.setItem('matchPayload', JSON.stringify(payload));
      navigate(`/session/${payload.roomId}`);
    });

    return () => {
      socket.off('connect', joinQueue);
      socket.off('reconnect', joinQueue);
      socket.off('online_count');
      socket.off('match_found');
    };
  }, [socket, navigate]);

  function handleCancel() {
    socket.emit('leave_queue');
    navigate('/');
  }

  return (
    <div className={s.page}>
      {/* Film grain */}
      <div className={s.grain} />

      {/* Ambient glows */}
      <div className={s.glowTL} />
      <div className={s.glowBR} />

      {/* Concentric atmospheric rings */}
      <div className={`${s.ring} ${s.ring1}`} />
      <div className={`${s.ring} ${s.ring2}`} />
      <div className={`${s.ring} ${s.ring3}`} />

      {/* Center content */}
      <div className={s.center}>
        <h1 className={s.title}>finding your stranger</h1>
        <div className={s.statusWrap}>
          <span className={s.statusLabel}>Establishing Secure Link</span>
          <div className={s.dots}>
            <div className={`${s.dot} ${s.dotActive}`} />
            <div className={`${s.dot} ${s.dotMid}`} />
            <div className={`${s.dot} ${s.dotFaint}`} />
          </div>
        </div>
      </div>

      {/* Bottom-left identity panel */}
      <div className={s.identityPanel}>
        <div className={s.identityInner}>
          <div className={s.avatar}>👤</div>
          <div>
            <div className={s.identityLabel}>Stranger #{strangerNum}</div>
            <div className={s.identitySubLabel}>Anonymous Mode Active</div>
          </div>
        </div>
      </div>

      {/* Top-right insights panel */}
      <div className={s.insightsPanel}>
        <div className={s.insightsLabel}>Currently Online</div>
        <div className={s.insightsCount}>
          {onlineCount !== null ? `${onlineCount} stranger${onlineCount !== 1 ? 's' : ''}` : '—'}
        </div>
        <div className={s.divider} />
        <div className={s.tipLabel}>Tonight's Thought</div>
        <div className={s.tipText}>{tip}</div>
      </div>

      {/* Bottom-right actions */}
      <div className={s.actions}>
        <button className={s.leaveBtn} onClick={handleCancel}>
          <span>↩</span>
          Leave Lobby
        </button>
      </div>

      {/* Footer */}
      <div className={s.footer}>
        <span className={s.footerCopy}>© 2026 Icebreaker.io</span>
        <div className={s.footerLinks}>
          <button className={s.footerLink}>Safety</button>
          <button className={s.footerLink}>Privacy</button>
        </div>
      </div>
    </div>
  );
}
