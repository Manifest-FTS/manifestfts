/** Portable extension: install with tokens.css and a .signal-theme ancestor. */
module.exports = {
  colors: {
    signal: {
      canvas: 'var(--bg-canvas)', surface: 'var(--bg-surface)', elevated: 'var(--bg-elevated)',
      ink: 'var(--text-primary)', muted: 'var(--text-secondary)', rust: 'var(--accent-signal-primary)',
      'rust-hover': 'var(--accent-signal-hover)', amber: 'var(--accent-warning)', sage: 'var(--accent-success)',
      clay: 'var(--border-subtle)', outline: 'var(--border-strong)',
    },
  },
  fontFamily: {
    'signal-display': ['var(--font-display)'], 'signal-body': ['var(--font-body)'], 'signal-mono': ['var(--font-mono)'],
  },
  borderRadius: { 'signal-sm': '12px', 'signal-md': '16px', 'signal-lg': '24px' },
  boxShadow: { 'signal-soft': 'var(--shadow-soft)', 'signal-raised': 'var(--shadow-raised)' },
  transitionTimingFunction: { 'signal-spring': 'cubic-bezier(.34,1.35,.64,1)', 'signal-settle': 'cubic-bezier(.22,1,.36,1)' },
  keyframes: { 'signal-breathe': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.12)' } } },
  animation: { 'signal-breathe': 'signal-breathe 2.8s ease-in-out infinite' },
};