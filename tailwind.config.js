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
      },
    },
  },
  plugins: [],
};
