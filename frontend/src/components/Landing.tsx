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
          <span className={s.navBrand}>Icebreaker.io</span>
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
          <span className={s.footerCopy}>© 2026 Icebreaker.io. For the children of the night.</span>
          <div className={s.footerLinks}>
            <button className={s.footerLink}>Safety Guidelines</button>
            <button className={s.footerLink}>Privacy Protocol</button>
            <button className={s.footerLink}>Terms of Engagement</button>
            <button className={s.footerLink}>Support</button>
          </div>
          <div className={s.footerIcons}>
            <button className={s.footerIcon}>🌐</button>
            <button className={s.footerIcon}>✉</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
