import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameOverPayload } from '../types';

interface Particle { id: number; top: string; left: string; tx: string; ty: string; color: string; delay: string; duration: string; }
interface RevealPrefs { shareEnabled: boolean; contact: string; note: string; }

const GOLD = ['#c9933a', '#e6b85c', '#f0d080', '#b87820', '#ffd700'];

function makeParticles(): Particle[] {
  return Array.from({ length: 64 }, (_, i) => {
    const angle = Math.random() * 360;
    const dist  = 60 + Math.random() * 240;
    const rad   = (angle * Math.PI) / 180;
    return {
      id: i,
      top:      `${35 + Math.random() * 30}%`,
      left:     `${35 + Math.random() * 30}%`,
      tx:       `${Math.cos(rad) * dist}px`,
      ty:       `${Math.sin(rad) * dist}px`,
      color:    GOLD[Math.floor(Math.random() * GOLD.length)],
      delay:    `${Math.random() * 0.8}s`,
      duration: `${1.0 + Math.random() * 1.0}s`,
    };
  });
}

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState<GameOverPayload | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [copied, setCopied] = useState(false);
  const [prefs, setPrefs] = useState<RevealPrefs>({ shareEnabled: false, contact: '', note: '' });
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('gameOver');
    if (raw) {
      const data: GameOverPayload = JSON.parse(raw);
      setResult(data);
      if (data.outcome === 'connected') setParticles(makeParticles());
    }
    const rawPrefs = sessionStorage.getItem('revealPrefs');
    if (rawPrefs) {
      const p: RevealPrefs = JSON.parse(rawPrefs);
      setPrefs(p);
      setSharing(p.shareEnabled);
    }
  }, []);

  function handleCopy() {
    if (!result?.shareLink) return;
    navigator.clipboard.writeText(result.shareLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleMatchAgain() { sessionStorage.clear(); navigate('/'); }

  function handleToggleSharing() {
    const next = !sharing;
    setSharing(next);
    const updated = { ...prefs, shareEnabled: next };
    setPrefs(updated);
    sessionStorage.setItem('revealPrefs', JSON.stringify(updated));
  }

  if (!result) return null;

  // ── Connected ──────────────────────────────────────────────────
  if (result.outcome === 'connected') {
    const hasCredentials = prefs.contact || prefs.note;
    return (
      <div className="min-h-dvh flex items-center justify-center p-8 overflow-hidden relative bg-bg">

        {/* Ambient glow behind card */}
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none animate-glow-pulse"
          style={{ background: 'radial-gradient(circle, rgba(201,147,58,0.18) 0%, transparent 70%)' }}
        />

        {/* Particles */}
        {particles.map(p => (
          <div
            key={p.id}
            className="fixed w-[5px] h-[5px] rounded-full pointer-events-none opacity-0 animate-burst"
            style={{ top: p.top, left: p.left, backgroundColor: p.color, '--tx': p.tx, '--ty': p.ty, '--delay': p.delay, '--duration': p.duration } as React.CSSProperties}
          />
        ))}

        {/* Card */}
        <div className="bg-surface border border-[var(--border)] rounded-card p-12 max-w-[440px] w-full flex flex-col items-center gap-5 text-center relative z-10"
          style={{ boxShadow: '0 0 60px rgba(201,147,58,0.08), 0 24px 64px rgba(0,0,0,0.5)' }}
        >
          {/* Heading — scale-in */}
          <p
            className="font-display text-[3rem] font-bold text-text tracking-[-0.02em] opacity-0 animate-scale-in"
            style={{ animationDelay: '0.05s', animationFillMode: 'forwards' }}
          >
            you matched.
          </p>

          {/* Sub-lines — stagger */}
          {result.strangerUsername && (
            <p
              className="font-mono text-[0.88rem] text-text-muted opacity-0 animate-stagger-fade"
              style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}
            >
              your stranger was <span className="text-accent font-medium">{result.strangerUsername}</span>
            </p>
          )}
          <p
            className="font-mono text-[0.82rem] text-text-muted italic max-w-[280px] leading-[1.6] opacity-0 animate-stagger-fade"
            style={{ animationDelay: '0.38s', animationFillMode: 'forwards' }}
          >
            all 3 rounds. same answers. not a coincidence.
          </p>

          {/* Reveal panel — stagger */}
          <div
            className="w-full  bg-[rgba(29,27,26,0.7)] border border-[rgba(80,69,55,0.25)] rounded-xl p-5 flex flex-col gap-4 text-left opacity-0 animate-stagger-fade"
            style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-[0.65rem] font-bold tracking-[0.25em] uppercase text-accent">The Reveal</div>
                <div className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(230,225,223,0.3)] mt-1">Identity Protocol</div>
              </div>
              <button
                onClick={handleToggleSharing}
                aria-label="Toggle identity sharing"
                aria-pressed={sharing}
                className="relative w-11 h-6 flex-shrink-0 bg-transparent border-none outline-none p-0 appearance-none-all cursor-pointer"
              >
                <div className={`w-full h-full rounded-full border transition-all duration-[250ms] ${sharing ? 'bg-[rgba(201,147,58,0.35)] border-[rgba(248,188,95,0.4)]' : 'bg-[rgba(80,69,55,0.35)] border-[rgba(80,69,55,0.4)]'}`} />
                <div className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full transition-all duration-[250ms] ${sharing ? 'translate-x-5 bg-accent-bright' : 'bg-[rgba(170,155,135,0.7)]'}`} />
              </button>
            </div>

            {hasCredentials ? (
              <div className="flex flex-col gap-[0.85rem]">
                {prefs.contact && (
                  <div className="flex flex-col gap-1 border-b border-[rgba(80,69,55,0.2)] pb-3">
                    <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(230,225,223,0.3)]">Stay Connected Via</span>
                    <span className={`font-mono text-[0.82rem] italic text-text transition-all duration-400 ${sharing ? 'blur-0 opacity-100' : 'blur-[6px] opacity-40 select-none'}`}>{prefs.contact}</span>
                  </div>
                )}
                {prefs.note && (
                  <div className="flex flex-col gap-1 border-b border-[rgba(80,69,55,0.2)] pb-3">
                    <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-[rgba(230,225,223,0.3)]">A Personal Note</span>
                    <span className={`font-mono text-[0.82rem] italic text-text transition-all duration-400 ${sharing ? 'blur-0 opacity-100' : 'blur-[6px] opacity-40 select-none'}`}>{prefs.note}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="font-mono text-[0.65rem] italic text-[rgba(230,225,223,0.25)]">No credentials saved. Toggle won't reveal anything.</p>
            )}
            <p className="font-mono text-[0.58rem] tracking-[0.1em] uppercase text-[rgba(230,225,223,0.2)] leading-[1.6]">
              {sharing ? 'Your identity is unmasked. Share the link below to connect.' : 'Toggle on to reveal your credentials to your match.'}
            </p>
          </div>

          {/* Share link — stagger */}
          {result.shareLink && (
            <button
              onClick={handleCopy}
              className={`w-full bg-surface2 border border-[var(--border)] rounded-full py-[0.6rem] px-5 font-mono text-[0.76rem] cursor-pointer transition-colors text-center break-all opacity-0 animate-stagger-fade ${copied ? 'text-success' : 'text-accent'} hover:bg-[rgba(201,147,58,0.15)]`}
              style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
            >
              {copied ? 'copied ✓' : result.shareLink}
            </button>
          )}

          {/* Match again — stagger */}
          <button
            onClick={handleMatchAgain}
            className="font-mono text-[0.82rem] text-text-muted underline underline-offset-[3px] bg-none border-none cursor-pointer transition-colors mt-1 hover:text-text opacity-0 animate-stagger-fade"
            style={{ animationDelay: '0.82s', animationFillMode: 'forwards' }}
          >
            match again →
          </button>
        </div>
      </div>
    );
  }

  // ── Vanished ───────────────────────────────────────────────────
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <p className="font-display italic text-[4rem] text-text-muted animate-dissolve">gone.</p>
      <div className="fixed bottom-8 left-0 right-0 flex justify-center animate-fade-in-late">
        <button onClick={handleMatchAgain} className="font-mono text-[0.82rem] text-text-muted underline underline-offset-[3px] bg-none border-none cursor-pointer transition-colors hover:text-text">
          match again →
        </button>
      </div>
    </div>
  );
}
