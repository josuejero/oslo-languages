// Modify tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  corePlugins: {
    container: true, // Ensure container plugin is enabled
  },
  theme: {
    extend: {
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out 2s infinite',
        'fadeIn': 'fadeIn 1s ease-in forwards',
        'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
        'fadeInRight': 'fadeInRight 0.8s ease-out forwards',
        'fadeInLeft': 'fadeInLeft 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeInRight: {
          '0%': { opacity: 0, transform: 'translateX(-30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: 0, transform: 'translateX(30px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      colors: {
        // Main colors that match your design
        'text-primary': '#171717',
        'text-secondary': '#4B5563',
        'text-tertiary': '#9CA3AF',
        'text-inverse': '#FFFFFF',
        'background-primary': '#FFFFFF',
        'background-secondary': '#F9FAFB',
        'action-primary': '#3B82F6',
        'action-primaryHover': '#2563EB',
      },
    },
  },
  plugins: [],
}