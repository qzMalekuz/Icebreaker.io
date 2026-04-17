import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import RevealModal from './RevealModal';

// Three orbit rings shown during the void transition
const RING_SIZES = [
  { size: 'min(300px, 60vw)',  border: 'rgba(248,188,95,0.45)', delay: '0s' },
  { size: 'min(550px, 90vw)',  border: 'rgba(248,188,95,0.25)', delay: '0.08s' },
  { size: 'min(800px, 130vw)', border: 'rgba(248,188,95,0.12)', delay: '0.16s' },
];

export default function Landing() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [username, setUsername] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [error, setError] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    socket.on('queue_update', ({ onlineCount }: { onlineCount: number }) => setOnlineCount(onlineCount));
    return () => { socket.off('queue_update'); };
  }, [socket]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const raw = username.trim();
    if (!raw) { setError('alias cannot be empty.'); return; }
    if (/[^a-zA-Z0-9_ ]/.test(raw)) { setError('letters, numbers, spaces and underscores only.'); return; }
    const clean = raw.slice(0, 20);
    setError('');
    sessionStorage.setItem('username', clean);
    setShowReveal(true);
  }

  function handleRevealEnter() {
    setShowReveal(false);
    // Play the void transition, then navigate
    setTransitioning(true);
    setTimeout(() => navigate('/waiting'), 900);
  }

  function openReveal() {
    const clean = username.trim().replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 20);
    if (clean) { sessionStorage.setItem('username', clean); setShowReveal(true); }
    else inputRef.current?.focus();
  }

  return (
    <>
      {/* ── Void transition overlay ── */}
      {transitioning && (
        <div className="fixed inset-0 z-[300] flex h-screen items-center justify-center overflow-hidden bg-bg animate-void-enter">
          {/* Rings */}
          {RING_SIZES.map((r, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-ring-pulse"
              style={{
                width: r.size, height: r.size,
                top: '50%', left: '50%',
                marginLeft: `calc(${r.size} / -2)`,
                marginTop: `calc(${r.size} / -2)`,
                border: `1px solid ${r.border}`,
                animationDelay: r.delay,
              }}
            />
          ))}
          {/* Glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none animate-glow-pulse"
            style={{ background: 'radial-gradient(circle, rgba(201,147,58,0.22) 0%, transparent 65%)' }}
          />
          {/* Label */}
          <span
            className="relative z-10 font-mono text-[0.62rem] uppercase tracking-[0.45em] text-[rgba(230,225,223,0.5)] animate-stagger-fade"
            style={{ animationDelay: '0.2s', animationFillMode: 'forwards', opacity: 0 }}
          >
            entering the void...
          </span>
        </div>
      )}

      <div className={`bg-bg text-text-soft font-body overflow-x-hidden relative transition-opacity duration-500 ${transitioning ? 'opacity-0 pointer-events-none' : 'opacity-100 animate-page-in'}`}>
        {showReveal && <RevealModal onEnter={handleRevealEnter} />}

        {/* Atmosphere glows — radial-gradient only, zero filter/blur so scroll stays smooth */}
        <div
          className="fixed -top-[10%] -left-[10%] w-[55%] h-[55%] pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(248,188,95,0.07) 0%, transparent 70%)', transform: 'translate3d(0,0,0)' }}
        />
        <div
          className="fixed -bottom-[10%] -right-[10%] w-[60%] h-[60%] pointer-events-none z-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(201,147,58,0.05) 0%, transparent 70%)', transform: 'translate3d(0,0,0)' }}
        />

        {/* Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-[rgba(13,12,11,0.8)] backdrop-blur-nav shadow-[0_0_20px_rgba(20,19,18,0.8)]">
          <div className="flex justify-between items-center px-6 py-5 max-w-container mx-auto md:px-12">
            <div className="flex items-center gap-2 font-display italic text-[1.35rem] text-text-dim tracking-tight leading-none">
              <img src="/favicon.png" className="w-8 h-8 rounded-[0.4rem] object-cover flex-shrink-0" alt="" aria-hidden />
              Icebreaker.io
            </div>
            <div className="hidden md:flex items-center gap-10">
              <Link className="text-accent-bright font-mono text-[0.78rem] font-bold border-b-2 border-[rgba(248,188,95,0.3)] no-underline tracking-wide transition-colors hover:text-[#ffd885]" to="/">Experience</Link>
              <Link className="text-[rgba(230,225,223,0.5)] font-mono text-[0.78rem] no-underline tracking-wide transition-colors hover:text-accent-bright" to="/safety">Safety</Link>
              <Link className="text-[rgba(230,225,223,0.5)] font-mono text-[0.78rem] no-underline tracking-wide transition-colors hover:text-accent-bright" to="/philosophy">Philosophy</Link>
            </div>
            <button
              onClick={openReveal}
              className="bg-accent text-[#281800] px-6 py-2 rounded-btn font-mono text-[0.7rem] font-bold uppercase tracking-[0.15em] cursor-pointer transition-all hover:bg-[#daa84a] hover:scale-[1.02] active:scale-[0.95]"
            >
              Enter the Void
            </button>
          </div>
        </nav>

        {/* Main */}
        <main className="relative z-10 pt-32 pb-24 px-6 max-w-container mx-auto flex flex-col justify-center md:px-12">

          {/* Hero */}
          <div className="relative z-10 flex flex-col items-center text-center mb-24">
            <span className="font-mono text-[0.65rem] tracking-[0.4em] uppercase text-[rgba(230,225,223,0.4)] mb-6">The Digital Speakeasy</span>
            <h1 className="font-display italic font-bold text-text-dim tracking-tight leading-none mb-12 text-shadow-amber" style={{ fontSize: 'clamp(4rem, 12vw, 8rem)' }}>
              Icebreaker.io
            </h1>

            <div className="w-full max-w-md flex flex-col items-center gap-6">
              <form onSubmit={handleSubmit} className="contents">
                <div className="w-full border-b border-[rgba(80,69,55,0.5)] focus-within:border-accent-bright transition-colors">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Enter your alias..."
                    value={username}
                    maxLength={20}
                    onChange={e => setUsername(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleSubmit(e as unknown as React.FormEvent); }}
                    className="w-full bg-transparent border-none outline-none text-text-soft font-mono text-[1.1rem] text-center py-4 caret-amber italic placeholder:text-[rgba(230,225,223,0.25)] placeholder:not-italic"
                  />
                </div>
                {error && <p className="font-mono text-[0.72rem] text-danger-light -mt-3">{error}</p>}
                <button
                  type="submit"
                  disabled={!username.trim()}
                  className="bg-accent text-[#281800] px-10 py-5 rounded-btn font-mono text-[0.78rem] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(201,147,58,0.3)] flex items-center gap-3 whitespace-nowrap transition-all hover:bg-[#daa84a] hover:shadow-[0_0_30px_rgba(201,147,58,0.5)] hover:scale-[1.02] active:scale-[0.95] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Find a Stranger <span>→</span>
                </button>
              </form>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent-bright flex-shrink-0 animate-pulse-amber" />
                <span className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-[rgba(230,225,223,0.4)]">
                  {onlineCount} {onlineCount === 1 ? 'stranger' : 'strangers'} online
                </span>
              </div>
            </div>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 gap-6 mb-24 md:grid-cols-[7fr_5fr]">
            {/* Night shift card */}
            <div className="relative overflow-hidden rounded-xl bg-surface3 border border-[rgba(80,69,55,0.1)] p-8 min-h-[20rem] flex flex-col justify-end transition-colors hover:border-[rgba(80,69,55,0.3)] group">
              <img
                src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
                alt="" aria-hidden
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.4] opacity-20 transition-opacity group-hover:opacity-[0.35]"
              />
              <div className="relative z-10">
                <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-accent-bright mb-4">The Night Shift</p>
                <h2 className="font-display italic text-[2.2rem] text-text-soft mb-5 leading-[1.2]">Voices in the dark.</h2>
                <p className="font-body text-[0.88rem] text-[rgba(212,196,177,0.7)] leading-[1.7] max-w-md font-light">
                  We operate on human time. No algorithms, no permanent records.
                  Just ephemeral connections made in the quiet hours of the night.
                </p>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-surface4 p-8 rounded-xl border border-[rgba(80,69,55,0.1)] transition-colors hover:bg-[#3f3d3b]">
                <span className="block text-[1.4rem] text-accent-bright mb-3">🔒</span>
                <h3 className="font-display text-[1.2rem] text-text-soft mb-3">Anonymous Trust</h3>
                <p className="font-mono text-[0.75rem] text-[rgba(212,196,177,0.6)] leading-[1.75]">
                  Your identity is your choice. Use an alias, speak your truth,
                  and vanish when the sun rises. Encryption is our bedrock.
                </p>
              </div>
              <div className="flex-1 bg-[rgba(201,147,58,0.08)] p-8 rounded-xl border border-[rgba(248,188,95,0.12)] relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 text-[7rem] opacity-[0.07] select-none leading-none">🍸</div>
                <h3 className="font-display text-[1.2rem] text-accent-bright mb-3">The Protocol</h3>
                <p className="font-mono text-[0.75rem] text-[rgba(212,196,177,0.6)] leading-[1.75]">
                  Rules of engagement: Be kind. Be real. Leave no trace.
                  This is where high-society meets digital anonymity.
                </p>
              </div>
            </div>
          </div>

          {/* Editorial quote */}
          <section className="text-center max-w-[40rem] mx-auto mb-20">
            <p className="font-display italic text-[rgba(230,225,223,0.5)] leading-[1.55] mb-8" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}>
              "Modern life is too loud. We provide the{' '}
              <strong className="text-text-soft not-italic">silence</strong> to hear someone else."
            </p>
            <div className="w-12 h-px bg-[rgba(201,147,58,0.4)] mx-auto" />
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#0a0908] border-t border-[rgba(255,255,255,0.05)] py-20 z-10 relative">
          <div className="max-w-container mx-auto px-6 flex flex-col gap-16 md:flex-row md:justify-between md:items-start md:px-12">

            {/* Left */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <img src="/favicon.png" className="w-11 h-11 rounded-lg object-cover" alt="" aria-hidden />
                <span className="font-body text-[1.4rem] font-bold text-text-soft uppercase tracking-tight">
                  Icebreaker<span className="text-accent-bright">.io</span>
                </span>
              </div>
              <p className="font-mono text-[0.82rem] text-[rgba(230,225,223,0.35)] leading-[1.85] max-w-[360px]">
                Anonymous stranger matching built for the quiet hours.<br />
                No accounts. No history. Just two people and three questions.
              </p>
              <div className="flex gap-3 mt-1">
                <a href="https://github.com/qzMalekuz" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                  className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[rgba(230,225,223,0.4)] no-underline transition-all hover:bg-[rgba(248,188,95,0.1)] hover:text-accent-bright hover:border-[rgba(248,188,95,0.25)]">
                  <svg className="w-[1.1rem] h-[1.1rem]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
                </a>
                <a href="https://x.com/qzmalekuz" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                  className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[rgba(230,225,223,0.4)] no-underline transition-all hover:bg-[rgba(248,188,95,0.1)] hover:text-accent-bright hover:border-[rgba(248,188,95,0.25)]">
                  <svg className="w-[1.1rem] h-[1.1rem]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/qzmalekuz/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                  className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[rgba(230,225,223,0.4)] no-underline transition-all hover:bg-[rgba(248,188,95,0.1)] hover:text-accent-bright hover:border-[rgba(248,188,95,0.25)]">
                  <svg className="w-[1.1rem] h-[1.1rem]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-2 md:text-right">
              <span className="font-mono text-[0.65rem] tracking-[0.3em] uppercase text-[rgba(230,225,223,0.25)] mb-1">Credits</span>
              <p className="font-display text-[rgba(230,225,223,0.6)] leading-[1.2]" style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)' }}>
                Built and designed by{' '}
                <a href="https://zafarr.xyz/" target="_blank" rel="noopener noreferrer" className="text-text-soft font-bold no-underline transition-colors hover:text-accent-bright">zafarr.</a>
              </p>
              <p className="font-mono text-[0.65rem] text-[rgba(230,225,223,0.2)] mt-1">© 2026 Icebreaker.io All Rights Reserved</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
