/**
 * Tailwind CSS Configuration - Performance Optimized
 * Bloom Marketing Website
 *
 * Optimizations:
 * - Aggressive content purging (95%+ size reduction)
 * - Custom color palette (faction themes)
 * - Custom fonts (Orbitron, Inter)
 * - Extended utilities for game marketing
 */

/** @type {import('tailwindcss').Config} */
export default {
  // Content paths for purging unused CSS
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './public/**/*.html',
  ],

  // Dark mode configuration
  darkMode: 'class',

  theme: {
    extend: {
      // Custom color palette (Bloom faction colors)
      colors: {
        bloom: {
          // Brand colors
          primary: '#1e3a8a', // Deep blue
          secondary: '#ef4444', // Red accent
          dark: '#0f172a', // Almost black
          light: '#f1f5f9', // Off white

          // Faction colors
          'sky-bastion': {
            DEFAULT: '#1e3a8a',
            light: '#3b82f6',
            dark: '#1e293b',
          },
          'iron-scavengers': {
            DEFAULT: '#ea580c',
            light: '#fb923c',
            dark: '#9a3412',
          },
          'seventy-seven': {
            DEFAULT: '#ca8a04',
            light: '#fbbf24',
            dark: '#854d0e',
          },
          'corporate-hegemony': {
            DEFAULT: '#06b6d4',
            light: '#22d3ee',
            dark: '#0e7490',
          },
          'nomad-clans': {
            DEFAULT: '#f97316',
            light: '#fb923c',
            dark: '#c2410c',
          },
          'archive-keepers': {
            DEFAULT: '#7c3aed',
            light: '#a78bfa',
            dark: '#5b21b6',
          },
          'civic-wardens': {
            DEFAULT: '#14b8a6',
            light: '#2dd4bf',
            dark: '#0f766e',
          },
        },
      },

      // Custom font families
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Orbitron', 'Impact', 'Arial Black', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },

      // Custom spacing (for faction cards, galleries, etc.)
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
      },

      // Custom gradients for faction themes
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'faction-sky-bastion': 'linear-gradient(135deg, #1e3a8a 0%, #475569 100%)',
        'faction-iron-scavengers': 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
        'faction-seventy-seven': 'linear-gradient(135deg, #ca8a04 0%, #84cc16 100%)',
      },

      // Custom box shadows
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
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

    // Forms plugin (if using newsletter signup, etc.)
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
    'bg-faction-sky-bastion',
    'bg-faction-iron-scavengers',
    'bg-faction-seventy-seven',
    'bg-faction-corporate-hegemony',
    'bg-faction-nomad-clans',
    'bg-faction-archive-keepers',
    'bg-faction-civic-wardens',

    // Glow effects
    'shadow-glow-blue',
    'shadow-glow-red',
    'shadow-glow-orange',

    // Animation delays (for staggered animations)
    ...Array.from({ length: 10 }, (_, i) => `delay-${i * 100}`),
  ],

  // Future flags (opt into future breaking changes)
  future: {
    hoverOnlyWhenSupported: true,
  },
};
