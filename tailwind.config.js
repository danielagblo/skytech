/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "#4ADE80", foreground: "#000000" },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: { DEFAULT: "#EF4444", foreground: "#FFFFFF" },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        info: "#3B82F6",
        sidebar: "#F8FAF8",
        prospecting: "#8B5CF6",
        negotiation: "#3B82F6",
        settlement: "#F59E0B",
        payment: "#22C55E",
        retention: "#EC4899",
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
  plugins: [require("tailwindcss-animate")],
};
