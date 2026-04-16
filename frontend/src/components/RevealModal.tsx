import { useState } from 'react';

interface Props { onEnter: () => void; }

export default function RevealModal({ onEnter }: Props) {
  const [shareEnabled, setShareEnabled] = useState(true);
  const [contact, setContact] = useState('');
  const [note, setNote] = useState('');
  const [contactError, setContactError] = useState('');
  const [entering, setEntering] = useState(false);

  const canEnter = contact.trim().length > 0;

  function handleEnter() {
    if (!canEnter) { setContactError('This field is required to enter.'); return; }
    setContactError('');
    sessionStorage.setItem('revealPrefs', JSON.stringify({ shareEnabled, contact: contact.trim(), note: note.trim() }));
    setEntering(true);
    // Small delay so the button press registers visually before the parent transitions
    setTimeout(onEnter, 320);
  }

  return (
    <div className="fixed inset-0 z-[200] h-screen flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-[500px] max-h-[90vh] overflow-y-auto bg-[#1a1917] border border-[rgba(80,69,55,0.25)] rounded-2xl p-8 flex flex-col gap-6 animate-slide-up">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-[0.75rem] font-bold tracking-[0.25em] uppercase text-accent-bright">The Reveal</div>
            <div className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-[rgba(230,225,223,0.3)] mt-1">Identity Protocol</div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => setShareEnabled(v => !v)}
            aria-label="Toggle identity sharing"
            aria-pressed={shareEnabled}
            className="relative w-12 h-[26px] flex-shrink-0 bg-transparent border-none outline-none p-0 appearance-none-all cursor-pointer"
          >
            <div className={`w-full h-full rounded-full border transition-all duration-[250ms] ${shareEnabled ? 'bg-[rgba(201,147,58,0.35)] border-[rgba(248,188,95,0.4)]' : 'bg-[rgba(80,69,55,0.35)] border-[rgba(80,69,55,0.4)]'}`} />
            <div className={`absolute top-[3px] left-[3px] w-5 h-5 rounded-full transition-all duration-[250ms] ${shareEnabled ? 'translate-x-[22px] bg-accent-bright' : 'bg-[rgba(170,155,135,0.7)]'}`} />
          </button>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-6">
          <div>
            <label className="block font-mono text-[0.6rem] tracking-[0.25em] uppercase text-[rgba(230,225,223,0.35)] mb-[0.6rem]" htmlFor="reveal-contact">
              Stay Connected Via <span className="text-accent-bright">*</span>
            </label>
            <input
              id="reveal-contact"
              type="text"
              placeholder="Instagram @handle, LinkedIn, or Email"
              value={contact}
              maxLength={120}
              autoFocus
              onChange={e => { setContact(e.target.value); if (contactError) setContactError(''); }}
              className={`w-full bg-transparent border-none border-b outline-none text-[rgba(230,225,223,0.75)] font-mono text-[0.88rem] italic py-[0.6rem] caret-amber transition-colors box-border placeholder:text-[rgba(230,225,223,0.2)] ${contactError ? 'border-b-[rgba(255,100,80,0.6)]' : 'border-b-[rgba(80,69,55,0.4)] focus:border-b-[rgba(248,188,95,0.5)]'}`}
            />
            {contactError && <span className="block font-mono text-[0.58rem] tracking-[0.1em] text-danger-light mt-1">{contactError}</span>}
          </div>

          <div>
            <label className="block font-mono text-[0.6rem] tracking-[0.25em] uppercase text-[rgba(230,225,223,0.35)] mb-[0.6rem]" htmlFor="reveal-note">
              A Personal Note
            </label>
            <input
              id="reveal-note"
              type="text"
              placeholder="Something only you would say..."
              value={note}
              maxLength={200}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-transparent border-none border-b border-b-[rgba(80,69,55,0.4)] outline-none text-[rgba(230,225,223,0.75)] font-mono text-[0.88rem] italic py-[0.6rem] caret-amber transition-colors box-border placeholder:text-[rgba(230,225,223,0.2)] focus:border-b-[rgba(248,188,95,0.5)]"
            />
          </div>
        </div>

        <p className="font-mono text-[0.58rem] tracking-[0.12em] uppercase text-[rgba(230,225,223,0.2)] text-center leading-[1.7]">
          Information only shared if both parties choose to unmask.
        </p>

        <button
          onClick={handleEnter}
          disabled={entering}
          className={`w-full py-4 bg-accent text-[#281800] border-none rounded-btn font-mono text-[0.72rem] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(201,147,58,0.25)] transition-all active:scale-[0.97] ${entering ? 'opacity-60 scale-[0.98] cursor-not-allowed' : !canEnter ? 'opacity-40 cursor-not-allowed hover:bg-accent hover:shadow-none' : 'cursor-pointer hover:bg-[#daa84a] hover:shadow-[0_0_30px_rgba(201,147,58,0.45)]'}`}
        >
          {entering ? 'entering...' : 'Enter the Void'}
        </button>
      </div>
    </div>
  );
}
