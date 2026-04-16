import { useNavigate } from 'react-router-dom';
import s from './StaticPage.module.css';

export default function Safety() {
  const navigate = useNavigate();
  return (
    <div className={s.page}>
      <div className={s.inner}>
        <button className={s.back} onClick={() => navigate('/')}>← back</button>

        <h1 className={s.heading}>Your Safety, Your Call.</h1>

        <p className={s.body}>
          Icebreaker.io is fully open source. Every line of code that handles your session,
          your messages, and your anonymity is public and auditable.
        </p>

        <p className={s.body}>
          No accounts. No stored messages. No logs. Sessions are ephemeral —
          when you vanish, you're gone for real.
        </p>

        <div className={s.warningCard}>
          <p className={s.warningText}>
            ⚠ What you share is your choice. By entering this space, you acknowledge that
            anything you type is shared voluntarily with a stranger. Icebreaker.io, its
            contributors, and its maintainers hold no responsibility for the content of
            conversations between users.
          </p>
        </div>

        <p className={s.body}>
          Be real. Be kind. Don't be a fool about what you share.
        </p>

        <div className={s.sourceBlock}>
          <span className={s.sourceLabel}>Source Code</span>
          <a
            className={s.sourcePill}
            href="https://github.com/yourusername/icebreaker-io"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/yourusername/icebreaker-io
          </a>
          <span className={s.sourceSub}>Read the code. Trust the code.</span>
        </div>
      </div>
    </div>
  );
}
