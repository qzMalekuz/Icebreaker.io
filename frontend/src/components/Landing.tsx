import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSocket } from '../hooks/useSocket';
import RevealModal from './RevealModal';
import s from './Landing.module.css';

export default function Landing() {
  const navigate = useNavigate();
  const socket = useSocket();
  const [username, setUsername] = useState('');
  const [onlineCount, setOnlineCount] = useState(0);
  const [error, setError] = useState('');
  const [showReveal, setShowReveal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();

    socket.on('queue_update', ({ onlineCount }: { onlineCount: number }) => {
      setOnlineCount(onlineCount);
    });

    return () => {
      socket.off('queue_update');
    };
  }, [socket]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = username.trim().replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 20);
    if (!clean) {
      setError('letters, numbers, spaces and underscores only.');
      return;
    }
    setError('');
    sessionStorage.setItem('username', clean);
    setShowReveal(true);
  }

  function handleRevealEnter() {
    setShowReveal(false);
    navigate('/waiting');
  }

  return (
    <div className={s.page}>
      {showReveal && <RevealModal onEnter={handleRevealEnter} />}
      {/* Atmosphere blobs */}
      <div className={s.atmoBlobTL} />
      <div className={s.atmoBlobBR} />

      {/* Navbar */}
      <nav className={s.nav}>
        <div className={s.navInner}>
          <div className={s.navBrand}>
            <img src="/favicon.png" className={s.navLogo} alt="" aria-hidden />
            Icebreaker.io
          </div>
          <div className={s.navLinks}>
            <Link className={s.navLinkActive} to="/">Experience</Link>
            <Link className={s.navLink} to="/safety">Safety</Link>
            <Link className={s.navLink} to="/philosophy">Philosophy</Link>
          </div>
          <button className={s.navCta} onClick={() => {
            const clean = username.trim().replace(/[^a-zA-Z0-9_ ]/g, '').slice(0, 20);
            if (clean) { sessionStorage.setItem('username', clean); setShowReveal(true); }
            else inputRef.current?.focus();
          }}>
            Enter the Void
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className={s.main}>
        {/* Hero */}
        <div className={s.hero}>
          <span className={s.heroEyebrow}>The Digital Speakeasy</span>
          <h1 className={s.heroTitle}>Icebreaker.io</h1>

          <div className={s.formBlock}>
            <form onSubmit={handleSubmit} style={{ width: '100%', display: 'contents' }}>
              <div className={s.inputWrap}>
                <input
                  ref={inputRef}
                  className={s.input}
                  type="text"
                  placeholder="Enter your alias..."
                  value={username}
                  maxLength={20}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              {error && <p className={s.error}>{error}</p>}
              <button className={s.btn} type="submit" disabled={!username.trim()}>
                Find a Stranger <span>→</span>
              </button>
            </form>

            <div className={s.onlineRow}>
              <div className={s.pulseDot} />
              <span className={s.onlineText}>
                {onlineCount} {onlineCount === 1 ? 'stranger' : 'strangers'} online
              </span>
            </div>
          </div>
        </div>

        {/* Bento grid */}
        <div className={s.bento}>
          {/* Night shift card */}
          <div className={s.bentoDark}>
            <img
              className={s.bentoImg}
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80"
              alt=""
              aria-hidden
            />
            <div className={s.bentoContent}>
              <p className={s.bentoEyebrow}>The Night Shift</p>
              <h2 className={s.bentoHeadline}>Voices in the dark.</h2>
              <p className={s.bentoCopy}>
                We operate on human time. No algorithms, no permanent records.
                Just ephemeral connections made in the quiet hours of the night.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className={s.bentoRight}>
            <div className={s.bentoCardGray}>
              <span className={s.bentoCardIcon}>🔒</span>
              <h3 className={s.bentoCardTitle}>Anonymous Trust</h3>
              <p className={s.bentoCardBody}>
                Your identity is your choice. Use an alias, speak your truth,
                and vanish when the sun rises. Encryption is our bedrock.
              </p>
            </div>
            <div className={s.bentoCardAmber}>
              <div className={s.bentoCardAmberDeco}>🍸</div>
              <h3 className={s.bentoCardTitle} style={{ color: '#f8bc5f' }}>The Protocol</h3>
              <p className={s.bentoCardBody}>
                Rules of engagement: Be kind. Be real. Leave no trace.
                This is where high-society meets digital anonymity.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial quote */}
        <section className={s.editorial}>
          <p className={s.editorialQuote}>
            "Modern life is too loud. We provide the{' '}
            <strong>silence</strong> to hear someone else."
          </p>
          <div className={s.editorialRule} />
        </section>
      </main>

      {/* Footer */}
      <footer className={s.footer}>
        <div className={s.footerInner}>
          {/* Left — brand + description + socials */}
          <div className={s.footerLeft}>
            <div className={s.footerBrand}>
              <img src="/favicon.png" className={s.footerLogo} alt="" aria-hidden />
              <span className={s.footerBrandText}>Icebreaker<span className={s.footerBrandAccent}>.io</span></span>
            </div>
            <p className={s.footerDesc}>
              Anonymous stranger matching built for the quiet hours.<br />
              No accounts. No history. Just two people and three questions.
            </p>
            <div className={s.footerSocials}>
              {/* GitHub */}
              <a className={s.socialBtn} href="https://github.com/qzMalekuz" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a className={s.socialBtn} href="https://x.com/qzmalekuz" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a className={s.socialBtn} href="https://www.linkedin.com/in/qzmalekuz/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right — credits */}
          <div className={s.footerRight}>
            <span className={s.footerCreditsLabel}>Credits</span>
            <p className={s.footerCreditsText}>
              Built and designed by{' '}
              <a className={s.footerCreditsName} href="https://zafarr.xyz/" target="_blank" rel="noopener noreferrer">
                zafarr.
              </a>
            </p>
            <p className={s.footerCopyright}>© 2026 Icebreaker.io All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
