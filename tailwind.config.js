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
          light: '#e9f5db',   // پس‌زمینه
          DEFAULT: '#3fa34d', // رنگ اصلی
          dark: '#2e7d32',    // رنگ هاور
          text: '#1b4332',    // رنگ متن
        }
      },
      fontFamily: {
        sans: ['Vazirmatn', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}