import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        paper: '#e7e4dc',
        linen: '#f1efe8',
        rule: '#d3cfc4',
        ink: '#201d18',
        graphite: '#4a463e',
        dust: '#8a8577',
        accent: '#3d6a8a',
        accent2: '#6b7f6a',
        brick: '#a24a3a',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '14px',
        '3xl': '16px',
        full: '9999px',
      },
    },
  },
  plugins: [],
}

export default config
