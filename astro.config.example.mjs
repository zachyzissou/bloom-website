/**
 * Astro Configuration - Performance Optimized
 * Bloom Marketing Website
 *
 * This configuration is optimized for:
 * - Static site generation (zero SSR overhead)
 * - Image optimization (AVIF/WebP)
 * - CSS optimization (Tailwind purging)
 * - Fast builds and deployments
 */

import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  // Site URL (update for production)
  site: 'https://bloom.slurpgg.net',

  // Output mode: static for maximum performance
  output: 'static',

  // Integrations
  integrations: [
    // Tailwind CSS with optimizations
    tailwind({
      // Don't apply base styles (we'll manage them)
      config: {
        applyBaseStyles: false,
      },
    }),

    // Sitemap generation
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Exclude admin pages, etc.
      filter: (page) => !page.includes('/admin'),
    }),

    // MDX support (for content pages)
    mdx(),

    // HTML/CSS/JS compression (run last)
    compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
        minifyCSS: true,
        minifyJS: true,
      },
      Image: false, // Handle separately with our optimization script
      JavaScript: true,
      SVG: true,
    }),
  ],

  // Build options
  build: {
    // Inline small stylesheets automatically
    inlineStylesheets: 'auto',

    // Asset prefix (CDN, if using)
    // assets: 'cdn.bloom.slurpgg.net',

    // Format for output files
    format: 'directory', // /about/ instead of /about.html
  },

  // Vite configuration
  vite: {
    build: {
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
            // Component chunks
            if (id.includes('src/components')) {
              return 'components';
            }
          },

          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];

            // Organize by type
            if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff2?|ttf|otf|eot/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },

          // Chunk file naming (with hash for cache busting)
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },

      // Target modern browsers (smaller bundles)
      target: 'es2020',

      // Minify options
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.logs in production
          drop_debugger: true,
        },
      },
    },

    // SSR optimization
    ssr: {
      noExternal: ['@astrojs/image'],
    },

    // Dependency optimization
    optimizeDeps: {
      include: [],
    },
  },

  // Image service configuration
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // 16384x16384 (Unity HDRP screenshots)
      },
    },
    // Allowed remote image domains
    domains: ['cdn.bloom.slurpgg.net'],
  },

  // Markdown configuration (for content pages)
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },

  // Server configuration (dev only)
  server: {
    port: 4321,
    host: true, // Listen on all addresses
  },

  // Preview configuration
  preview: {
    port: 4322,
    host: true,
  },

  // Experimental features
  experimental: {
    // Enable experimental optimizations
    optimizeHoistedScript: true,
  },
});
