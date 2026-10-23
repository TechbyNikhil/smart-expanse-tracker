/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          main: '#0B1120',
          sidebar: '#111827',
          card: '#172033',
          input: '#1E293B',
          border: '#273449',
        },
        brand: {
          primary: '#10B981',
          secondary: '#8B5CF6',
        },
        status: {
          income: '#22C55E',
          expense: '#F43F5E',
          warning: '#F59E0B',
        },
        content: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
