/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF6FF',
          100: '#D9EBFF',
          200: '#BCD9FF',
          500: '#133E87',
          600: '#0E2E66',
          700: '#0B2545',
          800: '#07182D',
          900: '#040E1B',
        },
        coral: {
          50: '#FFF5F0',
          100: '#FFE9DE',
          500: '#FF6B35',
          600: '#EA580C',
          700: '#C2410C',
        },
        gold: {
          400: '#FBBF24',
          500: '#F7B801',
          600: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(11, 37, 69, 0.08)',
        'float': '0 12px 32px -4px rgba(11, 37, 69, 0.16)',
        'glow': '0 0 25px -5px rgba(255, 107, 53, 0.4)',
      }
    },
  },
  plugins: [],
}
