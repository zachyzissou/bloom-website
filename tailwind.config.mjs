/**
 * Tailwind CSS Configuration - Performance Optimized
 * Bloom Marketing Website
 *
 * Optimizations:
 * - JIT mode (automatic purging)
 * - Custom color palette (faction themes + design tokens)
 * - Custom fonts (Orbitron, Inter)
 * - Extended utilities for game marketing
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for JIT compilation
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],

  // Dark mode configuration
  darkMode: 'class',

  theme: {
    extend: {
      // Custom color palette (Bloom brand + faction colors)
      colors: {
        // Brand colors from design tokens
        primary: {
          DEFAULT: '#00ff88', // Extraction green
          50: '#f0fff4',
          100: '#dcfce7',
          500: '#00ff88',
          600: '#00cc6f',
          700: '#009955',
        },
        secondary: {
          DEFAULT: '#ff0055', // Harvester red
          500: '#ff0055',
          600: '#cc0044',
          700: '#990033',
        },
        // Faction colors (from factions.json)
        faction: {
          dir: {
            // Sky Bastion Directorate
            primary: '#1e3a8a',
            secondary: '#475569',
            accent: '#3b82f6',
          },
          vlt: {
            // Iron Vultures
            primary: '#ea580c',
            secondary: '#f59e0b',
            accent: '#fb923c',
          },
          svn: {
            // The Seventy-Seven
            primary: '#ca8a04',
            secondary: '#84cc16',
            accent: '#fbbf24',
          },
          cwd: {
            // Truce Wardens
            primary: '#14b8a6',
            secondary: '#0f766e',
            accent: '#2dd4bf',
          },
          hlx: {
            // Helix Collective
            primary: '#06b6d4',
            secondary: '#0e7490',
            accent: '#22d3ee',
          },
          way: {
            // Wayfarers
            primary: '#f97316',
            secondary: '#c2410c',
            accent: '#fb923c',
          },
          var: {
            // Vanguard
            primary: '#7c3aed',
            secondary: '#5b21b6',
            accent: '#a78bfa',
          },
          ngd: {
            // North Guard
            primary: '#dc2626',
            secondary: '#991b1b',
            accent: '#ef4444',
          },
          ash: {
            // Ashen Remnants
            primary: '#64748b',
            secondary: '#475569',
            accent: '#94a3b8',
          },
          apx: {
            // Apex Predators
            primary: '#059669',
            secondary: '#047857',
            accent: '#10b981',
          },
        },
        // Design token colors
        'iez-core': '#dc2626',
        'harvester-platinum': '#e5e7eb',
        'tactical-slate': '#475569',
        'extraction-green': '#22c55e',
        snowpeaks: '#1e3a8a',
        westernmountains: '#7c3aed',
        centralgrasslands: '#f59e0b',
        easternplateaus: '#dc2626',
        foresthills: '#65a30d',
        southwestplains: '#ea580c',
      },

      // Custom font families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Orbitron', 'Impact', 'Arial Black', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px theme(colors.primary.500)' },
          '100%': { boxShadow: '0 0 20px theme(colors.primary.500)' },
        },
      },

      // Custom gradients for faction themes
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'faction-dir': 'linear-gradient(135deg, #1e3a8a 0%, #475569 100%)',
        'faction-vlt': 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
        'faction-svn': 'linear-gradient(135deg, #ca8a04 0%, #84cc16 100%)',
        'faction-cwd': 'linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)',
      },

      // Custom box shadows
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'glow-orange': '0 0 20px rgba(234, 88, 12, 0.5)',
      },

      // Custom aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '21/9': '21 / 9',
      },

      // Custom container sizes
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },

  // Plugins
  plugins: [
    // Typography plugin for content pages
    require('@tailwindcss/typography'),

    // Forms plugin (for future forms)
    require('@tailwindcss/forms'),

    // Aspect ratio plugin
    require('@tailwindcss/aspect-ratio'),

    // Custom plugin for faction-specific utilities
    function ({ addUtilities }) {
      const newUtilities = {
        // GPU-accelerated transforms
        '.transform-gpu': {
          transform: 'translate3d(0, 0, 0)',
        },

        // Contain for performance
        '.contain-layout': {
          contain: 'layout',
        },
        '.contain-paint': {
          contain: 'paint',
        },
        '.contain-strict': {
          contain: 'layout style paint',
        },

        // Text stroke (for faction headings)
        '.text-stroke': {
          '-webkit-text-stroke': '1px rgba(0, 0, 0, 0.3)',
        },
        '.text-stroke-white': {
          '-webkit-text-stroke': '1px rgba(255, 255, 255, 0.5)',
        },
      };

      addUtilities(newUtilities);
    },
  ],

  // Safelist (classes generated dynamically)
  safelist: [
    // Faction-specific classes
    'bg-faction-dir',
    'bg-faction-vlt',
    'bg-faction-svn',
    'bg-faction-cwd',
    'bg-faction-hlx',
    'bg-faction-way',
    'bg-faction-var',
    'bg-faction-ngd',
    'bg-faction-ash',
    'bg-faction-apx',

    // Glow effects
    'shadow-glow-blue',
    'shadow-glow-red',
    'shadow-glow-green',
    'shadow-glow-orange',

    // Animation delays (for staggered animations)
    ...Array.from({ length: 10 }, (_, i) => `delay-${i * 100}`),
  ],

  // Future flags (opt into future breaking changes)
  future: {
    hoverOnlyWhenSupported: true,
  },
};

