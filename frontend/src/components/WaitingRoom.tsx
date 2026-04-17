import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';

const TIPS = [
  'Connections happen in the spaces between words.',
  'The best conversations start with a question.',
  "Every stranger is a story you haven't heard yet.",
  'Anonymity is the beginning of honesty.',
  'Three answers. One connection. No names.',
];

const GRAIN_SVG = "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function WaitingRoom() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const [strangerNum] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [matched, setMatched] = useState(false);

  useEffect(() => {
    const username = sessionStorage.getItem('username') || 'demo';
    if (!username) { navigate('/'); return; }

    function joinQueue() {
      console.log('[WaitingRoom] emitting join_queue as', username);
      socket.emit('join_queue', { username });
    }

    if (socket.connected) joinQueue();
    else socket.once('connect', joinQueue);

    socket.on('reconnect', joinQueue);
    socket.on('online_count', (count: number) => setOnlineCount(count));
    socket.on('match_found', (payload) => {
      console.log('[WaitingRoom] match_found!', payload.roomId);
      sessionStorage.setItem('matchPayload', JSON.stringify(payload));
      // Hold the match animation for ~2s before navigating
      setMatched(true);
      setTimeout(() => navigate(`/session/${payload.roomId}`), 2100);
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
    <div className="relative h-dvh w-full flex items-center justify-center overflow-hidden bg-bg">

      {/* Film grain */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.06] bg-repeat"
        style={{ backgroundImage: GRAIN_SVG, backgroundSize: '200px 200px' }}
      />

      {/* Ambient glows — radial-gradient only, no filter/blur to keep compositing clean */}
      <div
        className="fixed -top-[10%] -left-[10%] w-[55%] h-[55%] pointer-events-none transition-opacity duration-700"
        style={{ background: matched ? 'radial-gradient(ellipse at center, rgba(201,147,58,0.2) 0%, transparent 70%)' : 'radial-gradient(ellipse at center, rgba(201,147,58,0.06) 0%, transparent 70%)', transform: 'translate3d(0,0,0)' }}
      />
      <div
        className="fixed -bottom-[10%] -right-[10%] w-[55%] h-[55%] pointer-events-none transition-opacity duration-700"
        style={{ background: matched ? 'radial-gradient(ellipse at center, rgba(201,147,58,0.15) 0%, transparent 70%)' : 'radial-gradient(ellipse at center, rgba(201,147,58,0.04) 0%, transparent 70%)', transform: 'translate3d(0,0,0)' }}
      />

      {/* Orbiting rings — speed up & brighten on match */}
      {/* Ring 1 */}
      <div
        className={`absolute rounded-full pointer-events-none border transition-all duration-500 after:content-[''] after:absolute after:rounded-full after:bg-accent-bright after:shadow-[0_0_8px_2px_rgba(248,188,95,0.6)] after:w-[5px] after:h-[5px] after:-top-[2.5px] after:left-1/2 after:-translate-x-1/2 ${matched ? 'border-[rgba(248,188,95,0.55)] animate-ring-pulse' : 'border-[rgba(248,188,95,0.22)] animate-orbit1'}`}
        style={{ width: 'min(300px, 60vw)', height: 'min(300px, 60vw)', top: '50%', left: '50%', marginLeft: 'calc(min(300px, 60vw) / -2)', marginTop: 'calc(min(300px, 60vw) / -2)' }}
      />
      {/* Ring 2 */}
      <div
        className={`absolute rounded-full pointer-events-none border transition-all duration-500 after:content-[''] after:absolute after:rounded-full after:bg-accent-bright after:shadow-[0_0_8px_2px_rgba(248,188,95,0.6)] after:w-[4px] after:h-[4px] after:-top-[2px] after:left-1/2 after:-translate-x-1/2 after:opacity-70 ${matched ? 'border-[rgba(248,188,95,0.38)] animate-ring-pulse' : 'border-[rgba(248,188,95,0.13)] animate-orbit2'}`}
        style={{ width: 'min(550px, 90vw)', height: 'min(550px, 90vw)', top: '50%', left: '50%', marginLeft: 'calc(min(550px, 90vw) / -2)', marginTop: 'calc(min(550px, 90vw) / -2)', animationDelay: matched ? '0.1s' : '0s' }}
      />
      {/* Ring 3 */}
      <div
        className={`absolute rounded-full pointer-events-none border transition-all duration-500 after:content-[''] after:absolute after:rounded-full after:bg-accent-bright after:shadow-[0_0_8px_2px_rgba(248,188,95,0.6)] after:w-[3px] after:h-[3px] after:-top-[1.5px] after:left-1/2 after:-translate-x-1/2 after:opacity-45 ${matched ? 'border-[rgba(248,188,95,0.22)] animate-ring-pulse' : 'border-[rgba(248,188,95,0.07)] animate-orbit3'}`}
        style={{ width: 'min(800px, 130vw)', height: 'min(800px, 130vw)', top: '50%', left: '50%', marginLeft: 'calc(min(800px, 130vw) / -2)', marginTop: 'calc(min(800px, 130vw) / -2)', animationDelay: matched ? '0.2s' : '0s' }}
      />

      {/* Center content — switches between waiting and matched states */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
        {matched ? (
          /* ── Match found state ── */
          <div className="flex flex-col items-center gap-5 animate-match-hold">
            <div
              className="w-16 h-16 rounded-full border-2 border-accent-bright flex items-center justify-center mb-2"
              style={{ boxShadow: '0 0 40px rgba(248,188,95,0.5), inset 0 0 20px rgba(248,188,95,0.1)' }}
            >
              <svg className="w-7 h-7 text-accent-bright" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h1
              className="font-display italic font-normal text-accent-bright leading-[1.15] tracking-[-0.02em] text-shadow-amber-lg"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)' }}
            >
              connection found.
            </h1>
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.35em] text-[rgba(230,225,223,0.45)]">entering the void...</span>
          </div>
        ) : (
          /* ── Waiting state ── */
          <>
            <h1
              className="font-display italic font-normal text-accent-bright leading-[1.15] tracking-[-0.02em] text-shadow-amber-lg"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.8rem)' }}
            >
              finding your stranger
            </h1>
            <div className="flex flex-col items-center gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[rgba(230,225,223,0.35)]">Establishing Secure Link</span>
              <div className="flex items-center gap-[6px]">
                <div className="w-[6px] h-[6px] rounded-full bg-accent-bright animate-pulse-dot" />
                <div className="w-[6px] h-[6px] rounded-full bg-[rgba(248,188,95,0.35)]" />
                <div className="w-[6px] h-[6px] rounded-full bg-[rgba(248,188,95,0.15)]" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bottom-left identity panel */}
      <div className={`fixed bottom-12 left-12 hidden md:block z-20 transition-opacity duration-500 ${matched ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-4 bg-[rgba(29,27,26,0.45)] backdrop-blur-glass px-5 py-4 rounded-xl border border-[rgba(80,69,55,0.15)]">
          <div className="w-10 h-10 rounded-full bg-surface4 border border-[rgba(248,188,95,0.15)] flex items-center justify-center text-[1.1rem] text-[rgba(230,225,223,0.5)] flex-shrink-0 overflow-hidden">
            👤
          </div>
          <div>
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-accent-bright leading-[1.8]">Stranger #{strangerNum}</div>
            <div className="font-mono text-[0.5rem] uppercase tracking-[0.15em] text-[rgba(230,225,223,0.25)]">Anonymous Mode Active</div>
          </div>
        </div>
      </div>

      {/* Top-right insights panel */}
      <div className={`fixed top-12 right-12 hidden lg:block z-20 text-right max-w-[18rem] transition-opacity duration-500 ${matched ? 'opacity-0' : 'opacity-100'}`}>
        <div className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[rgba(230,225,223,0.35)] mb-1">Currently Online</div>
        <div className="font-display text-[1.1rem] text-text-soft leading-[1.4]">
          {onlineCount !== null ? `${onlineCount} stranger${onlineCount !== 1 ? 's' : ''}` : '—'}
        </div>
        <div className="w-12 h-px bg-[rgba(201,147,58,0.18)] my-5 ml-auto" />
        <div className="font-mono text-[0.55rem] uppercase tracking-[0.3em] text-[rgba(230,225,223,0.35)] mb-[0.35rem]">Tonight's Thought</div>
        <div className="font-body text-[0.8rem] italic text-[rgba(230,225,223,0.5)] leading-[1.65]">{tip}</div>
      </div>

      {/* Bottom-right actions */}
      <div className={`fixed bottom-12 right-12 flex items-center gap-3 z-20 transition-opacity duration-500 ${matched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <button
          data-testid="leave-lobby-btn"
          onClick={handleCancel}
          className="flex items-center gap-[0.6rem] px-5 py-[0.65rem] rounded-full bg-[rgba(29,27,26,0.6)] border border-[rgba(80,69,55,0.12)] backdrop-blur-glass text-[rgba(230,225,223,0.5)] font-mono text-[0.6rem] uppercase tracking-[0.2em] cursor-pointer whitespace-nowrap transition-all hover:bg-[rgba(147,0,10,0.15)] hover:text-danger-light active:scale-[0.96]"
        >
          <span>↩</span> Leave Lobby
        </button>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 px-12 py-6 flex justify-between items-center z-20">
        <span className="font-mono text-[0.5rem] tracking-[0.4em] uppercase text-[rgba(230,225,223,0.18)]">© 2026 Icebreaker.io</span>
        <div className="flex gap-8">
          <button className="font-mono text-[0.5rem] tracking-[0.4em] uppercase text-[rgba(230,225,223,0.18)] bg-none border-none cursor-pointer transition-colors hover:text-accent-bright">Safety</button>
          <button className="font-mono text-[0.5rem] tracking-[0.4em] uppercase text-[rgba(230,225,223,0.18)] bg-none border-none cursor-pointer transition-colors hover:text-accent-bright">Privacy</button>
        </div>
      </div>
    </div>
  );
}
