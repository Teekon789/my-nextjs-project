const { heroui } = require('@heroui/react');


/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './styles/**/*.{css,module.css}',
    './*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        primary: 'var(--primary)',
        accent: 'var(--accent)',
        secondary: 'var(--secondary)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        dark: 'var(--dark)', // สีสำหรับโหมดมืด
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
        sarabun: ['TH Sarabun New', 'sans-serif'],
      },
      screens: {
        'xxl': '1920px', // ขนาดหน้าจอที่กว้างที่สุด
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  darkMode: 'class', // This ensures dark mode is enabled by class
  plugins: [
    require('@tailwindcss/forms'), // Plugin for form elements styling
    require('@tailwindcss/typography'), // Plugin for typography
    heroui(), // Custom plugin for @heroui/react
  ],
};
