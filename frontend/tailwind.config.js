/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:           '#0d0c0b',
        surface:      '#171614',
        surface2:     '#211f1c',
        surface3:     '#1d1b1a',
        surface4:     '#363433',
        accent:       '#c9933a',
        'accent-bright': '#f8bc5f',
        'accent-glow':   'rgba(201,147,58,0.15)',
        text:         '#f0ece4',
        'text-soft':  '#e6e1df',
        'text-dim':   '#e0dbd8',
        'text-muted': '#7a7267',
        danger:       '#c45c3a',
        'danger-light': '#ffb4ab',
        success:      '#4a9e6b',
      },
      fontFamily: {
        display: ['"Playfair Display"', '"Noto Serif"', 'Georgia', 'serif'],
        mono:    ['"DM Mono"', '"Courier New"', 'monospace'],
        body:    ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn:  '8px',
      },
      maxWidth: {
        container: '1400px',
      },
      height: {
        dvh: '100dvh',
      },
      minHeight: {
        dvh: '100dvh',
      },
      backdropBlur: {
        xs: '6px',
      },
      transitionDuration: {
        '250': '250ms',
      },
      keyframes: {
        pageFadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pulseAmber: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.9)' },
        },
        orbit1: {
          from: { transform: 'rotate(0deg)   rotateX(72deg)' },
          to:   { transform: 'rotate(360deg) rotateX(72deg)' },
        },
        orbit2: {
          from: { transform: 'rotate(120deg) rotateX(60deg) rotateZ(15deg)' },
          to:   { transform: 'rotate(480deg) rotateX(60deg) rotateZ(15deg)' },
        },
        orbit3: {
          from: { transform: 'rotate(240deg) rotateX(50deg) rotateZ(-10deg)' },
          to:   { transform: 'rotate(600deg) rotateX(50deg) rotateZ(-10deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(1.3)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.2' },
        },
        /* burst keyframe is in styles.css (uses CSS custom props for per-particle timing) */
        dissolve: {
          '0%':   { opacity: '0' },
          '20%':  { opacity: '1' },
          '70%':  { opacity: '1' },
          '100%': { opacity: '0.08' },
        },
        fadeInLate: {
          '0%, 55%': { opacity: '0' },
          '100%':    { opacity: '1' },
        },
        matchFlash: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '40%':  { opacity: '1', transform: 'scale(1.04)' },
          '70%':  { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.08)' },
        },
        ringPulse: {
          '0%, 100%': { opacity: '0.22', transform: 'scale(1)' },
          '50%':      { opacity: '0.7',  transform: 'scale(1.06)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.82)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.12' },
          '50%':      { opacity: '0.35' },
        },
        staggerFade: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        voidEnter: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '40%':  { opacity: '1', transform: 'scale(1.01)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        voidExit: {
          '0%':   { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.08)' },
        },
        // Route-level page transition
        routeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        routeOut: {
          from: { opacity: '1', transform: 'translateY(0)' },
          to:   { opacity: '0', transform: 'translateY(-6px)' },
        },
        // Session-specific
        questionReveal: {
          from: { opacity: '0', transform: 'translateY(20px) scale(0.98)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        optionSlide: {
          from: { opacity: '0', transform: 'translateX(-12px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
        resultSlam: {
          '0%':   { opacity: '0', transform: 'scale(0.7)' },
          '60%':  { opacity: '1', transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Match found hold
        matchHold: {
          '0%':   { opacity: '0', transform: 'scale(0.88)' },
          '20%':  { opacity: '1', transform: 'scale(1.02)' },
          '80%':  { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(1.06)' },
        },
      },
      animation: {
        'page-in':      'pageFadeIn 500ms cubic-bezier(0.22,1,0.36,1) forwards',
        'page-in-fast': 'pageFadeIn 400ms cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-in':      'fadeIn 220ms ease forwards',
        'slide-up':     'slideUp 260ms cubic-bezier(0.22,1,0.36,1) forwards',
        'pulse-amber':  'pulseAmber 2s ease-in-out infinite',
        'pulse-dot':    'pulse 1.4s ease-in-out infinite',
        orbit1:         'orbit1 14s linear infinite',
        orbit2:         'orbit2 22s linear infinite',
        orbit3:         'orbit3 34s linear infinite',
        blink:          'blink 1.2s ease-in-out infinite',
        'match-flash':  'matchFlash 1.2s cubic-bezier(0.22,1,0.36,1) forwards',
        'ring-pulse':   'ringPulse 0.7s ease-in-out infinite',
        'scale-in':     'scaleIn 600ms cubic-bezier(0.22,1,0.36,1) forwards',
        'glow-pulse':   'glowPulse 2.4s ease-in-out infinite',
        'stagger-fade': 'staggerFade 500ms cubic-bezier(0.22,1,0.36,1) forwards',
        'void-enter':      'voidEnter 600ms cubic-bezier(0.22,1,0.36,1) forwards',
        'void-exit':       'voidExit 500ms cubic-bezier(0.4,0,1,1) forwards',
        'route-in':        'routeIn 380ms cubic-bezier(0.22,1,0.36,1) forwards',
        'question-reveal': 'questionReveal 520ms cubic-bezier(0.22,1,0.36,1) forwards',
        'option-slide':    'optionSlide 400ms cubic-bezier(0.22,1,0.36,1) forwards',
        'result-slam':     'resultSlam 550ms cubic-bezier(0.22,1,0.36,1) forwards',
        'match-hold':      'matchHold 2.2s cubic-bezier(0.22,1,0.36,1) forwards',
        dissolve:       'dissolve 4s ease forwards',
        'fade-in-late': 'fadeInLate 4.5s ease forwards',
      },
    },
  },
  plugins: [],
}
