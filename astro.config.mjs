import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://bloom-game.com',

  // Static site generation
  output: 'static',

  // Build configuration
  build: {
    // Inline small scripts and styles
    inlineStylesheets: 'auto',

    // Asset handling
    assets: '_assets',

    // Minification and optimization happen automatically in production
  },

  // Vite configuration for additional optimizations
  vite: {
    build: {
      // Minify CSS and JS
      minify: 'esbuild',

      // CSS code splitting
      cssCodeSplit: true,

      // Rollup options
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          },
        },
      },

      // Asset inlining threshold (4kb)
      assetsInlineLimit: 4096,

      // Chunk size warnings
      chunkSizeWarningLimit: 500,
    },

    // Optimization deps
    optimizeDeps: {
      include: [],
    },

    // CSS preprocessing
    css: {
      devSourcemap: true,
    },
  },

  // Image optimization
  image: {
    // Enable image optimization service
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },

    // Supported formats
    formats: ['avif', 'webp', 'png', 'jpg'],

    // Caching
    cacheDir: '.astro/image-cache',
  },

  // Integrations
  integrations: [
    // Tailwind CSS
    tailwind({
      // Apply Tailwind to all files
      applyBaseStyles: false, // We'll handle base styles in global.css
    }),

    // Generate sitemap
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),

      // Custom entries
      customPages: [
        'https://bloom-game.com/',
        'https://bloom-game.com/factions/',
        'https://bloom-game.com/about/',
      ],

      // Filter pages
      filter: (page) => !page.includes('/draft/'),
    }),

    // Generate robots.txt
    robotsTxt({
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/', '/admin/', '/_assets/'],
          crawlDelay: 2,
        },
      ],
      sitemap: true,
    }),
  ],

  // Markdown configuration
  markdown: {
    shikiConfig: {
      theme: 'dracula',
      wrap: true,
    },
  },

  // Server configuration for development
  server: {
    port: 3000,
    host: true,
  },

  // Preview server configuration
  preview: {
    port: 4321,
    host: true,
  },

  // Prefetch configuration for faster navigation
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },

  // Experimental features (Astro 4.x)
  experimental: {
    // Enable content layer for better content management
    contentLayer: true,
  },

  // Security
  security: {
    checkOrigin: true,
  },

  // Compression (handled by Netlify, but can be enabled for preview)
  compressHTML: true,

  // Dev toolbar
  devToolbar: {
    enabled: true,
  },

  // Redirects (can also be defined here instead of netlify.toml)
  redirects: {
    '/home': '/',
    '/game': '/about',
  },
});
