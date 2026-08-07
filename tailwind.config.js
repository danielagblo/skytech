/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        // Unified Skytech brand blue scale (anchored at the legacy #1E5AC8 primary)
        brand: {
          50: '#eef3ff',
          100: '#dce7fd',
          200: '#b9d0fb',
          300: '#8db2f4',
          400: '#5b8be4',
          500: '#3a6dd0',
          600: '#1E5AC8',
          700: '#1749a3',
          800: '#143c82',
          900: '#0f2e63',
          950: '#0a1f46',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 46, 99, 0.04), 0 8px 24px -8px rgba(15, 46, 99, 0.10)',
        lift: '0 2px 4px rgba(15, 46, 99, 0.05), 0 24px 48px -20px rgba(15, 46, 99, 0.18)',
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1.25rem',
      },
      maxWidth: {
        shell: '80rem',
      },
    },
  },
  plugins: [],
}
