/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- Base Surface Tokens ---
        surface: {
          base:     '#0a0c10',  // deepest background
          panel:    '#111318',  // panel background
          elevated: '#181b23',  // elevated card
          overlay:  '#1e2230',  // overlays, dropdowns
        },
        // --- Border Tokens ---
        border: {
          subtle:  '#1a1f2e',
          default: '#242a3c',
          strong:  '#303650',
        },
        // --- Text Tokens ---
        text: {
          primary:   '#e2e8f0',
          secondary: '#8892a4',
          muted:     '#525f7a',
          disabled:  '#3a4255',
          inverse:   '#0a0c10',
        },
        // --- Brand (Blue accent) ---
        brand: {
          DEFAULT: '#3b82f6',
          subtle:  'rgba(59,130,246,0.12)',
          border:  'rgba(59,130,246,0.3)',
          strong:  '#60a5fa',
        },
        // --- Semantic Status ---
        status: {
          critical:        '#ef4444',
          'critical-bg':   'rgba(239,68,68,0.1)',
          'critical-border':'rgba(239,68,68,0.25)',
          warning:         '#f59e0b',
          'warning-bg':    'rgba(245,158,11,0.1)',
          'warning-border':'rgba(245,158,11,0.25)',
          success:         '#22c55e',
          'success-bg':    'rgba(34,197,94,0.1)',
          'success-border':'rgba(34,197,94,0.25)',
          info:            '#3b82f6',
          'info-bg':       'rgba(59,130,246,0.1)',
          'info-border':   'rgba(59,130,246,0.25)',
          neutral:         '#6b7a99',
          'neutral-bg':    'rgba(107,122,153,0.1)',
          'neutral-border':'rgba(107,122,153,0.2)',
        },
        // --- Legacy aliases (kept for existing component references that will be progressively replaced) ---
        cyber: {
          bg:          '#0a0c10',
          panel:       '#111318',
          panelHeader: '#181b23',
          border:      '#242a3c',
          borderLight: '#303650',
          textMuted:   '#525f7a',
          textMain:    '#e2e8f0',
        },
        neon: {
          cyan:    '#3b82f6',   // mapped to brand blue
          coral:   '#ef4444',   // mapped to critical red
          emerald: '#22c55e',   // mapped to success green
          amber:   '#f59e0b',   // mapped to warning amber
          violet:  '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'heading':    ['18px', { lineHeight: '1.4', fontWeight: '700' }],
        'subheading': ['14px', { lineHeight: '1.5', fontWeight: '600' }],
        'body':       ['13px', { lineHeight: '1.6', fontWeight: '400' }],
        'caption':    ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'meta':       ['11px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '4.5': '1.125rem',
        '13':  '3.25rem',
        '15':  '3.75rem',
        '18':  '4.5rem',
      },
      borderRadius: {
        'sm':  '4px',
        'md':  '6px',
        'lg':  '8px',
        'xl':  '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
        'card-hover':  '0 4px 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
        'card-primary':'0 4px 24px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)',
        'overlay':     '0 8px 32px rgba(0,0,0,0.7)',
        'brand':       '0 0 0 2px rgba(59,130,246,0.3)',
        'none':        'none',
      },
      animation: {
        'fade-in':       'fadeIn 200ms ease-out',
        'slide-up':      'slideUp 250ms ease-out',
        'slide-down':    'slideDown 250ms ease-out',
        'scale-in':      'scaleIn 300ms cubic-bezier(0.22,1,0.36,1)',
        'pulse-slow':    'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'skeleton':      'skeleton 1.5s ease-in-out infinite',
        'ping-sm':       'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'spin-slow':     'spin 3s linear infinite',
        'globe-glow':    'globeGlow 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%':   { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        skeleton: {
          '0%, 100%': { opacity: '0.4' },
          '50%':      { opacity: '0.8' },
        },
        globeGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '0.8' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
};
