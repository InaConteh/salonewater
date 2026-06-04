/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0056b3',
          dark: '#004085',
          light: '#e7f1fb',
        },
        success: {
          DEFAULT: '#28a745',
          dark: '#218838',
          light: '#d4edda',
        },
        warning: {
          DEFAULT: '#ffc107',
          dark: '#e0a800',
          light: '#fff3cd',
        },
        danger: {
          DEFAULT: '#dc3545',
          dark: '#c82333',
          light: '#f8d7da',
        },
        neutral: {
          DEFAULT: '#6c757d',
          dark: '#495057',
          light: '#e9ecef',
        },
        surface: '#ffffff',
        bgLight: '#f8f9fa',
        body: '#212529',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.06)',
        cardHover: '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
