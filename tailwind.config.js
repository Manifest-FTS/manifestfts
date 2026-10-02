module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#21759B', // WordPress Blue
        secondary: '#F0A500', // WordPress Yellow
        accent: '#F1F1F1', // Light background color
        dark: '#333333', // Dark text for readability
        light: '#FFFFFF', // Light background for sections
        success: '#28a745', // Green for success messages
        error: '#dc3545', // Red for error messages
        'green-900': '#3f8077',
        manifest: {
          canvas: '#ffffff', surface: '#f8fafc', subtle: '#f1f5f9',
          ink: '#101828', 'ink-soft': '#344054', muted: '#475467', border: '#dbe3ec',
          cyan: '#3f8077', 'cyan-deep': '#326b64',
        },
        signal: {
          DEFAULT: '#4353c7', hover: '#3544ad', subtle: '#eef0ff',
          emerald: '#087a55', 'emerald-subtle': '#e8f7f0',
          amber: '#9a5b00', 'amber-subtle': '#fff5df',
          coral: '#b93838', 'coral-subtle': '#fff0ef',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['SFMono-Regular', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      borderRadius: { control: '9px', panel: '14px' },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px rgb(15 23 42 / 0.04)',
        raised: '0 12px 32px rgb(15 23 42 / 0.10)',
        focus: '0 0 0 4px rgb(67 83 199 / 0.16)',
      },
    },
  },
  plugins: [],
};
