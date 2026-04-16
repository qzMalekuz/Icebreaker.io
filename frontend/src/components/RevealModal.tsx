import { useState } from 'react';
import s from './RevealModal.module.css';

interface Props {
  onEnter: () => void;
}

export default function RevealModal({ onEnter }: Props) {
  const [shareEnabled, setShareEnabled] = useState(true);
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [contactError, setContactError] = useState('');

  const contactTrimmed = contact.trim();
  const canEnter = contactTrimmed.length > 0;

  function handleEnter() {
    if (!canEnter) {
      setContactError('This field is required to enter.');
      return;
    }
    setContactError('');
    sessionStorage.setItem(
      'revealPrefs',
      JSON.stringify({ shareEnabled, contact: contactTrimmed, note: note.trim() })
    );
    onEnter();
  }

  return (
    <div className={s.backdrop}>
      <div className={s.panel}>
        {/* Header */}
        <div className={s.header}>
          <div className={s.headerText}>
            <div className={s.title}>The Reveal</div>
            <div className={s.subtitle}>Identity Protocol</div>
          </div>

          {/* Toggle */}
          <button
            className={s.toggle}
            onClick={() => setShareEnabled((v) => !v)}
            aria-label="Toggle identity sharing"
            aria-pressed={shareEnabled}
          >
            <div className={`${s.toggleTrack} ${shareEnabled ? s.toggleTrackOn : ''}`} />
            <div className={`${s.toggleThumb} ${shareEnabled ? s.toggleThumbOn : ''}`} />
          </button>
        </div>

        {/* Fields */}
        <div className={s.fields}>
          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="reveal-contact">
              Stay Connected Via <span className={s.required}>*</span>
            </label>
            <input
              id="reveal-contact"
              className={`${s.fieldInput} ${contactError ? s.fieldInputError : ''}`}
              type="text"
              placeholder="Instagram @handle, LinkedIn, or Email"
              value={contact}
              maxLength={120}
              onChange={(e) => { setContact(e.target.value); if (contactError) setContactError(''); }}
              autoFocus
            />
            {contactError && <span className={s.fieldError}>{contactError}</span>}
          </div>

          <div className={s.field}>
            <label className={s.fieldLabel} htmlFor="reveal-note">
              A Personal Note
            </label>
            <input
              id="reveal-note"
              className={s.fieldInput}
              type="text"
              placeholder="Something only you would say..."
              value={note}
              maxLength={200}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <p className={s.disclaimer}>
          Information only shared if both parties choose to unmask.
        </p>

        <button className={`${s.cta} ${!canEnter ? s.ctaDisabled : ''}`} onClick={handleEnter}>
          Enter the Void
        </button>
      </div>
    </div>
  );
}
