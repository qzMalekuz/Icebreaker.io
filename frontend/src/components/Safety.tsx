import { useNavigate } from 'react-router-dom';

export default function Safety() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-[var(--bg)] flex justify-center px-6 py-24 animate-page-in-fast">
      <div className="w-full max-w-[720px] flex flex-col gap-8">
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-muted bg-none border-none cursor-pointer p-0 text-left transition-colors hover:text-accent -mb-2"
        >
          ← back
        </button>

        <span className="font-mono text-[0.62rem] tracking-[0.35em] uppercase text-text-muted">The Fine Print (But Make It Honest)</span>
        <h1 className="font-display text-text font-bold leading-[1.1] tracking-[-0.02em] -mt-3" style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)' }}>
          Your Safety, Your Call.
        </h1>

        <p className="font-mono text-[0.88rem] text-text-muted leading-[1.9]">
          Icebreaker.io is fully open source. Every line of code that handles your session,
          your messages, and your anonymity is public and auditable.
        </p>

        <p className="font-mono text-[0.88rem] text-text-muted leading-[1.9]">
          No accounts. No stored messages. No logs. Sessions are ephemeral —
          when you vanish, you're gone for real.
        </p>

        <div className="bg-surface2 border-l-4 border-l-danger rounded-r-card p-6">
          <p className="font-mono text-[0.82rem] text-text-muted leading-[1.85]">
            ⚠ What you share is your choice. By entering this space, you acknowledge that
            anything you type is shared voluntarily with a stranger. Icebreaker.io, its
            contributors, and its maintainers hold no responsibility for the content of
            conversations between users.
          </p>
        </div>

        <p className="font-mono text-[0.88rem] text-text-muted leading-[1.9]">
          Be real. Be kind. Don't be a fool about what you share.
        </p>

        <div className="flex flex-col gap-[0.6rem] mt-2">
          <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase text-text-muted">Source Code</span>
          <a
            href="https://github.com/qzMalekuz/Icebreaker.io"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub repository"
            className="inline-flex self-start text-accent no-underline transition-all hover:text-[#ffd885] hover:scale-110"
          >
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <span className="font-mono text-[0.68rem] italic text-text-muted opacity-60">Read the code. Trust the code.</span>
        </div>
      </div>
    </div>
  );
}
