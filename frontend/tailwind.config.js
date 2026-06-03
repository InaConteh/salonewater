/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CleanFlow Color Palette (from Design System)
        primary: '#0056b3',      // Primary Blue for branding
        success: '#28a745',      // Green - Safe water
        warning: '#ffc107',      // Yellow - Boil water
        danger: '#dc3545',       // Red - Unsafe/Down
        neutral: '#6c757d',      // Gray - Secondary text
        bgLight: '#f8f9fa',      // Background color
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'base': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
      }
    },
  },
  plugins: [],
}
