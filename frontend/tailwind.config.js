/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#0d0c0b',
        surface:   '#171614',
        surface2:  '#211f1c',
        surface3:  '#1d1b1a',
        surface4:  '#363433',
        accent:    '#c9933a',
        'accent-bright': '#f8bc5f',
        text:      '#f0ece4',
        'text-soft': '#e6e1df',
        'text-dim':  '#e0dbd8',
        'text-muted': '#7a7267',
        danger:    '#c45c3a',
        'danger-light': '#ffb4ab',
        success:   '#4a9e6b',
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
      backdropBlur: {
        xs: '6px',
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
          '50%':       { opacity: '0.5', transform: 'scale(0.9)' },
        },
        orbit1: {
          from: { transform: 'translate(-50%, -50%) rotate(0deg)   rotateX(72deg)' },
          to:   { transform: 'translate(-50%, -50%) rotate(360deg) rotateX(72deg)' },
        },
        orbit2: {
          from: { transform: 'translate(-50%, -50%) rotate(120deg) rotateX(60deg) rotateZ(15deg)' },
          to:   { transform: 'translate(-50%, -50%) rotate(480deg) rotateX(60deg) rotateZ(15deg)' },
        },
        orbit3: {
          from: { transform: 'translate(-50%, -50%) rotate(240deg) rotateX(50deg) rotateZ(-10deg)' },
          to:   { transform: 'translate(-50%, -50%) rotate(600deg) rotateX(50deg) rotateZ(-10deg)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':       { opacity: '0.5', transform: 'scale(1.3)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':       { opacity: '0.2' },
        },
        burst: {
          '0%':   { transform: 'translate(0,0) scale(1)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) scale(0.2)', opacity: '0' },
        },
        dissolve: {
          '0%':   { opacity: '0' },
          '20%':  { opacity: '1' },
          '70%':  { opacity: '1' },
          '100%': { opacity: '0.08' },
        },
        fadeInLate: {
          '0%, 55%': { opacity: '0' },
          '100%':     { opacity: '1' },
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
        burst:          'burst var(--duration, 1.5s) ease-out var(--delay, 0s) forwards',
        dissolve:       'dissolve 4s ease forwards',
        'fade-in-late': 'fadeInLate 4.5s ease forwards',
      },
    },
  },
  plugins: [],
}
