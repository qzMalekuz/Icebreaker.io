import { useNavigate } from 'react-router-dom';
import s from './StaticPage.module.css';

const quotes = [
  {
    text: 'The meeting of two personalities is like the contact of two chemical substances: if there is any reaction, both are transformed.',
    author: '— Carl Jung',
    note: null,
  },
  {
    text: "Strangers are just friends I haven't met yet.",
    author: '— Will Rogers',
    note: "we're not sure we agree — but we love the optimism.",
  },
  {
    text: "Every person you meet knows something you don't.",
    author: '— Bill Nye',
    note: null,
  },
  {
    text: 'We are all strangers to our own depths.',
    author: '— Unknown',
    note: null,
  },
];

export default function Philosophy() {
  const navigate = useNavigate();
  return (
    <div className={s.page}>
      <div className={s.inner} style={{ maxWidth: '800px' }}>
        <button className={s.back} onClick={() => navigate('/')}>← back</button>

        <h1 className={`${s.heading} ${s.headingItalic}`}>Why This Exists.</h1>

        <p className={s.opening}>
          We've never been more connected — and never more afraid to talk to strangers.
        </p>

        <div className={s.quotes}>
          {quotes.map((q, i) => (
            <blockquote key={i} className={s.quote}>
              <p className={s.quoteText}>"{q.text}"</p>
              <footer className={s.quoteAuthor}>
                {q.author}
                {q.note && <em className={s.quoteNote}>{q.note}</em>}
              </footer>
            </blockquote>
          ))}
        </div>

        <div className={s.closing}>
          <p className={s.closingText}>
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
