/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx}", // Path ini memberitahu Tailwind file mana yang harus dipindai
  ],
  theme: {
    extend: {
      colors: {
        'light-background': '#FFFFFF',
        'light-text': '#000000',
        'dark-background': '#000000',
        'dark-text': '#FFFFFF',
        'light-heading': '#000000',
        'dark-heading': '#FFFFFF',
        'light-shadow1': '#333333',
        'dark-shadow1': '#666666',
        'light-shadow2': '#555555',
        'dark-shadow2': '#888888',
        'light-shadow3': '#777777',
        'dark-shadow3': '#AAAAAA',
        'light-shadow4': '#999999',
        'dark-shadow4': '#CCCCCC',
        'light-navbar': '#FFFFFF',
        'dark-navbar': '#1a1a1a',
      },
      fontFamily: {
        'moderniz': ['Moderniz', 'sans-serif'],
        'bauhaus': ['Bauhaus93', 'sans-serif'],
      },
      animation: {
        shadowFade: 'shadowFade 5s infinite ease-in-out',
        gradient: 'gradient 8s linear infinite',
      },
      keyframes: {
        shadowFade: {
          '0%, 100%': { filter: 'drop-shadow(-1px 6px 3px rgba(128, 128, 128, 0.5))' },
          '50%': { filter: 'drop-shadow(-1px 6px 3px rgba(128, 128, 128, 0.3))' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
