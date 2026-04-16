import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GameOverPayload } from '../types';
import s from './Result.module.css';

interface Particle {
  id: number; top: string; left: string;
  tx: string; ty: string;
  color: string; delay: string; duration: string;
}

interface RevealPrefs {
  shareEnabled: boolean;
  contact: string;
  note: string;
}

const GOLD = ['#c9933a', '#e6b85c', '#f0d080', '#b87820', '#ffd700'];

function makeParticles(): Particle[] {
  return Array.from({ length: 48 }, (_, i) => {
    const angle = Math.random() * 360;
    const dist = 80 + Math.random() * 180;
    const rad = (angle * Math.PI) / 180;
    return {
      id: i,
      top: `${40 + Math.random() * 20}%`,
      left: `${40 + Math.random() * 20}%`,
      tx: `${Math.cos(rad) * dist}px`,
      ty: `${Math.sin(rad) * dist}px`,
      color: GOLD[Math.floor(Math.random() * GOLD.length)],
      delay: `${Math.random() * 0.5}s`,
      duration: `${1.2 + Math.random() * 0.8}s`,
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

  function handleMatchAgain() {
    sessionStorage.clear();
    navigate('/');
  }

  function handleToggleSharing() {
    const next = !sharing;
    setSharing(next);
    const updated = { ...prefs, shareEnabled: next };
    setPrefs(updated);
    sessionStorage.setItem('revealPrefs', JSON.stringify(updated));
  }

  if (!result) return null;

  // ── Connected ─────────────────────────────────────────────────────
  if (result.outcome === 'connected') {
    const hasCredentials = prefs.contact || prefs.note;

    return (
      <div className={s.page}>
        {particles.map((p) => (
          <div
            key={p.id}
            className={s.particle}
            style={{
              top: p.top, left: p.left,
              backgroundColor: p.color,
              '--tx': p.tx, '--ty': p.ty,
              '--delay': p.delay, '--duration': p.duration,
            } as React.CSSProperties}
          />
        ))}
        <div className={s.card}>
          <p className={s.headline}>you matched.</p>
          {result.strangerUsername && (
            <p className={s.reveal}>
              your stranger was <span className={s.name}>{result.strangerUsername}</span>
            </p>
          )}
          <p className={s.sub}>all 3 rounds. same answers. not a coincidence.</p>

          {/* ── Identity Reveal Panel ─────────────────────────────── */}
          <div className={s.revealPanel}>
            <div className={s.revealHeader}>
              <div>
                <div className={s.revealTitle}>The Reveal</div>
                <div className={s.revealSubtitle}>Identity Protocol</div>
              </div>
              <button
                className={s.toggleBtn}
                onClick={handleToggleSharing}
                aria-label="Toggle identity sharing"
                aria-pressed={sharing}
              >
                <div className={`${s.toggleTrack} ${sharing ? s.toggleTrackOn : ''}`} />
                <div className={`${s.toggleThumb} ${sharing ? s.toggleThumbOn : ''}`} />
              </button>
            </div>

            {hasCredentials ? (
              <div className={s.credFields}>
                {prefs.contact && (
                  <div className={s.credRow}>
                    <span className={s.credLabel}>Stay Connected Via</span>
                    <span className={`${s.credValue} ${sharing ? s.credVisible : s.credBlurred}`}>
                      {prefs.contact}
                    </span>
                  </div>
                )}
                {prefs.note && (
                  <div className={s.credRow}>
                    <span className={s.credLabel}>A Personal Note</span>
                    <span className={`${s.credValue} ${sharing ? s.credVisible : s.credBlurred}`}>
                      {prefs.note}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className={s.noCredsNote}>No credentials saved. Toggle won't reveal anything.</p>
            )}

            <p className={s.revealDisclaimer}>
              {sharing
                ? 'Your identity is unmasked. Share the link below to connect.'
                : 'Toggle on to reveal your credentials to your match.'}
            </p>
          </div>

          {result.shareLink && (
            <button
              className={`${s.sharePill}${copied ? ` ${s.copied}` : ''}`}
              onClick={handleCopy}
            >
              {copied ? 'copied ✓' : result.shareLink}
            </button>
          )}

          <button className={s.again} onClick={handleMatchAgain}>match again →</button>
        </div>
      </div>
    );
  }

  // ── Vanished ──────────────────────────────────────────────────────
  return (
    <div className={s.vanishedPage}>
      <p className={s.gone}>gone.</p>
      <div className={s.vanishedFooter}>
        <button className={s.again} onClick={handleMatchAgain}>match again →</button>
      </div>
    </div>
  );
}
