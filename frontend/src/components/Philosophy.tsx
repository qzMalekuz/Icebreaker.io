import { useNavigate } from 'react-router-dom';

const quotes = [
  { text: 'The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.', author: '— Carl Jung', note: null },
  { text: "Strangers are just friends I haven't met yet.", author: '— Will Rogers', note: "we're not sure we agree — but we love the optimism." },
  { text: "Every person you meet knows something you don't.", author: '— Bill Nye', note: null },
  { text: 'We are all strangers to our own depths.', author: '— Unknown', note: null },
];

export default function Philosophy() {
  const navigate = useNavigate();
  return (
    <div className="min-h-dvh bg-[var(--bg)] flex justify-center px-6 py-24 animate-page-in-fast">
      <div className="w-full max-w-[800px] flex flex-col gap-8">
        <button
          onClick={() => navigate('/')}
          className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-text-muted bg-none border-none cursor-pointer p-0 text-left transition-colors hover:text-accent -mb-2"
        >
          ← back
        </button>

        <span className="font-mono text-[0.62rem] tracking-[0.35em] uppercase text-text-muted">The Philosophy</span>
        <h1 className="font-display italic text-text font-bold leading-[1.1] tracking-[-0.02em] -mt-3" style={{ fontSize: 'clamp(2.4rem, 6vw, 3.6rem)' }}>
          Why This Exists.
        </h1>

        <p className="font-mono text-[0.95rem] text-text-muted leading-[1.85]">
          We've never been more connected — and never more afraid to talk to strangers.
        </p>

        <div className="flex flex-col gap-10 my-4">
          {quotes.map((q, i) => (
            <blockquote key={i} className="border-l-2 border-accent pl-8 flex flex-col gap-3">
              <p className="font-display italic text-text leading-[1.55]" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)' }}>
                "{q.text}"
              </p>
              <footer className="font-mono text-[0.72rem] text-text-muted flex flex-col gap-1">
                {q.author}
                {q.note && <em className="text-[0.66rem] opacity-60">{q.note}</em>}
              </footer>
            </blockquote>
          ))}
        </div>

        <div className="mt-6 text-center py-12 px-4 border-t border-[var(--border)]">
          <p className="font-display italic text-text-muted leading-[2]" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)' }}>
            Icebreaker.io is an experiment in radical smallness.<br />
            No followers. No profiles. No history.<br />
            Just two people, one question, and the courage to answer honestly.<br />
            The conversation ends. The feeling doesn't have to.
          </p>
        </div>
      </div>
    </div>
  );
}
