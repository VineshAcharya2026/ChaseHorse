import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        brand: '#0066cc',
        'brand-light': '#3385d6',
        accent: '#38bdf8',
        navy: '#0c1f3d',
        'navy-light': '#1a3a6b',
        'section-gray': '#f4f6f9',
        'tesla-blue': '#3d6ae5',
        'tesla-black': '#171a20',
        'tesla-gray': '#f4f4f4',
        'tesla-body': '#393c41',
        'tesla-muted': '#5c5e62',
        'tesla-cream': '#fcf8f2',
        'tesla-cream-deep': '#f5f0e8',
        'tesla-frame': '#ffffff',
        'tesla-frameBorder': '#e8e0d4',
      },
      boxShadow: {
        card: '0 4px 24px -4px rgb(12 31 61 / 0.08)',
        glow: '0 8px 32px -8px rgb(0 102 204 / 0.25)',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
