# Bloom Marketing Website - Performance Optimization Strategy

**Project**: Bloom Game Marketing Website
**Framework**: Astro 4.x with Tailwind CSS
**Target Audience**: PC Gamers (60%+ mobile usage)
**Date**: 2025-11-01
**Status**: Implementation Ready

---

## Executive Summary

This document outlines a comprehensive performance optimization strategy for the Bloom game marketing website. The strategy focuses on achieving Core Web Vitals "Good" ratings, sub-3-second load times, and Lighthouse scores above 90 across all pages while handling high-resolution Unity HDRP screenshots and video content.

### Key Performance Targets
- **Load Time**: <3s (First Meaningful Paint)
- **Lighthouse Score**: ≥90 (all categories)
- **LCP**: <2.5s
- **FID/INP**: <100ms / <200ms
- **CLS**: <0.1
- **Mobile Performance**: Optimized for 3G/4G networks

---

## 1. Performance Budget Configuration

### 1.1 Page Weight Budgets

```yaml
# Budget by Page Type
Homepage:
  initial_load: 500KB  # uncompressed
  critical_js: 50KB
  critical_css: 30KB
  images_above_fold: 150KB
  total_resources: 2MB

Content Pages (Factions/Biomes):
  initial_load: 400KB
  critical_js: 50KB
  critical_css: 25KB
  images_above_fold: 120KB
  total_resources: 1.5MB

Gallery Pages:
  initial_load: 450KB
  critical_js: 60KB
  critical_css: 30KB
  images_above_fold: 200KB
  total_resources: 3MB
```

### 1.2 Resource Type Budgets

```yaml
# Individual Asset Limits
Images:
  hero_image: 100KB (WebP/AVIF)
  thumbnail: 20KB
  faction_emblem: 30KB
  screenshot: 150KB (lazy loaded)

Fonts:
  orbitron_woff2: 25KB (subset)
  inter_woff2: 15KB (subset)
  total_fonts: 40KB

Scripts:
  analytics: 3KB (Plausible)
  interaction: 30KB (islands only)
  total_js: 50KB (critical path)

Styles:
  critical_css: 30KB (inlined)
  deferred_css: 50KB (lazy loaded)
```

### 1.3 Network Performance Targets

```yaml
# By Connection Type
Fast 4G (9 Mbps):
  ttfb: 400ms
  fcp: 1.2s
  lcp: 2.0s
  tti: 2.5s

Slow 4G (1.6 Mbps):
  ttfb: 600ms
  fcp: 1.8s
  lcp: 2.5s
  tti: 3.5s

3G (0.4 Mbps):
  ttfb: 800ms
  fcp: 2.5s
  lcp: 3.5s
  tti: 5.0s
```

---

## 2. Image Optimization Strategy

### 2.1 Format Selection & Conversion

**Target**: 80%+ size reduction from original Unity HDRP screenshots

```bash
# Priority Order
1. AVIF (best compression, 50% smaller than WebP)
2. WebP (good compression, 30% smaller than PNG)
3. JPEG (fallback for unsupported browsers)

# Format Decision Tree
- High-detail screenshots → AVIF with WebP fallback
- UI elements/logos → WebP with PNG fallback
- Icons/small graphics → Inline SVG (when possible)
- Background images → AVIF with aggressive compression
```

### 2.2 Responsive Images Implementation

```html
<!-- Example: Hero Image -->
<picture>
  <source
    type="image/avif"
    srcset="
      /images/hero-400.avif 400w,
      /images/hero-800.avif 800w,
      /images/hero-1200.avif 1200w,
      /images/hero-1600.avif 1600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  />
  <source
    type="image/webp"
    srcset="
      /images/hero-400.webp 400w,
      /images/hero-800.webp 800w,
      /images/hero-1200.webp 1200w,
      /images/hero-1600.webp 1600w
    "
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
  />
  <img
    src="/images/hero-1200.jpg"
    alt="Bloom: Post-Cascade Extraction Gameplay"
    width="1200"
    height="675"
    loading="eager"
    fetchpriority="high"
  />
</picture>
```

### 2.3 Lazy Loading Strategy

```javascript
// Above-the-fold (0-800px): Eager loading
// Below-the-fold: Lazy loading with intersection observer

<!-- Critical Hero Image -->
<img loading="eager" fetchpriority="high" />

<!-- Lazy-loaded Gallery Images -->
<img loading="lazy" decoding="async" />
```

### 2.4 Blur-Up Placeholders (LQIP)

```html
<!-- Low-Quality Image Placeholder -->
<div class="image-container" style="background-image: url('data:image/webp;base64,[tiny-blur]');">
  <img
    src="/images/screenshot-800.webp"
    alt="Faction Combat"
    loading="lazy"
    class="fade-in"
  />
</div>
```

### 2.5 Image CDN Configuration

**Netlify Image CDN Implementation**

```javascript
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: 268402689, // 16384x16384
      }
    },
    domains: ['cdn.bloom.slurpgg.net'],
  }
});
```

**CDN Transformation Parameters**:
```
# Auto-format detection
?nf_resize=fit&w=800&h=450&f=auto&q=80

# Manual format specification
?nf_resize=fit&w=800&h=450&f=avif&q=70
```

---

## 3. Font Optimization

### 3.1 Font Strategy

**Fonts Used**:
- **Orbitron** (headings, sci-fi aesthetic) - Variable font preferred
- **Inter** (body, excellent readability) - Variable font

### 3.2 Font Subsetting

```bash
# Glyphset: Latin + numbers + basic punctuation
# Remove unused glyphs for 60-70% size reduction

# Orbitron Subset
pyftsubset Orbitron-VariableFont.ttf \
  --output-file=orbitron-subset.woff2 \
  --flavor=woff2 \
  --unicodes=U+0020-007E,U+00A0-00FF \
  --layout-features=*

# Inter Subset
pyftsubset Inter-VariableFont.ttf \
  --output-file=inter-subset.woff2 \
  --flavor=woff2 \
  --unicodes=U+0020-007E,U+00A0-00FF \
  --layout-features=*
```

### 3.3 Font Loading Strategy

```html
<!-- Preload Critical Fonts -->
<link rel="preload" href="/fonts/inter-subset.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/orbitron-subset.woff2" as="font" type="font/woff2" crossorigin>
```

```css
/* Font Face with font-display: swap */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-subset.woff2') format('woff2');
  font-weight: 400 700;
  font-display: swap;
  font-style: normal;
}

@font-face {
  font-family: 'Orbitron';
  src: url('/fonts/orbitron-subset.woff2') format('woff2');
  font-weight: 400 900;
  font-display: swap;
  font-style: normal;
}

/* Fallback stack to minimize CLS */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

h1, h2, h3 {
  font-family: 'Orbitron', 'Arial Black', sans-serif;
}
```

### 3.4 Size Adjustment for CLS Prevention

```css
/* Match fallback font metrics to reduce layout shift */
@font-face {
  font-family: 'Inter Fallback';
  src: local('Arial');
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
  size-adjust: 107%;
}
```

---

## 4. JavaScript Optimization

### 4.1 Astro Islands Strategy

**Principle**: Ship zero JavaScript by default, hydrate only interactive components

```astro
---
// FactionsCarousel.astro
// Only this component ships JS
---
<div class="carousel" client:visible>
  <!-- Hydrates when visible in viewport -->
</div>

<!-- Static content - zero JS -->
<section class="faction-grid">
  {factions.map(faction => (
    <FactionCard faction={faction} />
  ))}
</section>
```

### 4.2 Client Directives Usage

```astro
<!-- Load immediately (critical interactions) -->
<NavMenu client:load />

<!-- Load when idle (non-critical) -->
<NewsletterForm client:idle />

<!-- Load when visible (below fold) -->
<VideoEmbed client:visible />

<!-- No hydration (static only) -->
<FactionCard faction={data} />
```

### 4.3 Code Splitting

```javascript
// Vite automatic code splitting for dynamic imports
const VideoPlayer = () => import('./components/VideoPlayer.jsx');

// Astro lazy loading
const HeavyComponent = lazy(() => import('./components/HeavyComponent.astro'));
```

### 4.4 Third-Party Script Optimization

```html
<!-- Plausible Analytics (lightweight, privacy-focused) -->
<script defer data-domain="bloom.slurpgg.net" src="https://plausible.io/js/script.js"></script>

<!-- No Google Analytics, Tag Manager, or heavy tracking -->
```

---

## 5. CSS Optimization

### 5.1 Tailwind CSS Purging

```javascript
// tailwind.config.mjs
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  safelist: [
    // Only safelist dynamically generated classes
    'faction-iron-scavengers',
    'faction-sky-bastion',
  ],
  theme: {
    extend: {
      // Custom theme
    }
  }
}
```

**Expected Result**: 95%+ CSS reduction (from 3MB to <30KB)

### 5.2 Critical CSS Inlining

```astro
---
// BaseLayout.astro
import criticalCSS from '../styles/critical.css?inline';
---
<html>
  <head>
    <!-- Inline critical CSS for above-fold content -->
    <style set:html={criticalCSS} />

    <!-- Defer non-critical CSS -->
    <link rel="stylesheet" href="/styles/main.css" media="print" onload="this.media='all'">
  </head>
</html>
```

### 5.3 CSS Optimization Techniques

```css
/* Use CSS containment for performance */
.faction-card {
  contain: layout style paint;
}

/* Use will-change sparingly */
.hover-effect:hover {
  will-change: transform;
  transform: scale(1.05);
}

/* Prefer transforms over layout properties */
.slide-in {
  transform: translateX(100%); /* GPU-accelerated */
  /* NOT: left: 100%; (causes reflow) */
}

/* Avoid expensive properties */
.optimized {
  /* Good: transform, opacity */
  /* Bad: width, height, top, left (trigger layout) */
  /* Bad: box-shadow (expensive painting) */
}
```

---

## 6. Caching Strategy

### 6.1 HTTP Cache Headers

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

# Static assets - long-term cache
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# HTML - revalidate on every request
[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

# API/Data - short cache
[[headers]]
  for = "/api/*"
  [headers.values]
    Cache-Control = "public, max-age=300, stale-while-revalidate=600"
```

### 6.2 Service Worker Strategy (Optional)

```javascript
// service-worker.js
// Pre-cache critical assets
const CACHE_NAME = 'bloom-v1';
const CRITICAL_ASSETS = [
  '/',
  '/fonts/inter-subset.woff2',
  '/fonts/orbitron-subset.woff2',
  '/styles/critical.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CRITICAL_ASSETS))
  );
});

// Cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/images/') || event.request.url.includes('/fonts/')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
```

---

## 7. Rendering Optimization

### 7.1 Static Site Generation

```javascript
// astro.config.mjs
export default defineConfig({
  output: 'static', // Pre-render all pages at build time
  build: {
    inlineStylesheets: 'auto', // Inline small CSS files
  },
});
```

### 7.2 Critical Rendering Path Optimization

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 1. Preconnect to external domains -->
  <link rel="preconnect" href="https://plausible.io">
  <link rel="dns-prefetch" href="https://cdn.bloom.slurpgg.net">

  <!-- 2. Preload critical fonts -->
  <link rel="preload" href="/fonts/inter-subset.woff2" as="font" type="font/woff2" crossorigin>

  <!-- 3. Inline critical CSS -->
  <style>/* Critical CSS here */</style>

  <!-- 4. Defer non-critical CSS -->
  <link rel="stylesheet" href="/styles/main.css" media="print" onload="this.media='all'">

  <title>Bloom - Post-Cascade Extraction FPS</title>
</head>
<body>
  <!-- Content with proper dimensions to prevent CLS -->
  <img src="hero.webp" width="1200" height="675" alt="Hero">
</body>
</html>
```

### 7.3 Layout Shift Prevention

```html
<!-- Always specify dimensions -->
<img src="faction.webp" width="400" height="300" alt="Faction">

<!-- Use aspect-ratio for responsive images -->
<div style="aspect-ratio: 16/9;">
  <img src="screenshot.webp" alt="Screenshot">
</div>

<!-- Reserve space for dynamic content -->
<div class="skeleton-loader" style="min-height: 400px;">
  <!-- Content loads here -->
</div>
```

---

## 8. Video Optimization

### 8.1 Click-to-Load Strategy

```astro
---
// VideoEmbed.astro
const { videoId, title } = Astro.props;
---
<div class="video-container" data-video-id={videoId}>
  <!-- Thumbnail with play button -->
  <img
    src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
    alt={title}
    loading="lazy"
  />
  <button class="play-button" data-action="load-video">
    Play Video
  </button>
</div>

<script>
  // Load iframe only on click
  document.querySelectorAll('[data-action="load-video"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const container = e.target.closest('.video-container');
      const videoId = container.dataset.videoId;
      container.innerHTML = `
        <iframe
          src="https://www.youtube.com/embed/${videoId}?autoplay=1"
          frameborder="0"
          allow="autoplay; encrypted-media"
          allowfullscreen
        ></iframe>
      `;
    });
  });
</script>
```

### 8.2 Self-Hosted Video Optimization

```html
<!-- If hosting trailers directly -->
<video
  poster="trailer-poster.jpg"
  preload="metadata"
  controls
>
  <source src="trailer-720p.webm" type="video/webm">
  <source src="trailer-720p.mp4" type="video/mp4">
</video>

<!-- Don't use preload="auto" or autoplay -->
```

---

## 9. Build-Time Optimization

### 9.1 Image Processing Pipeline

Create `/scripts/optimize-images.sh`:

```bash
#!/bin/bash
# Image optimization script for Bloom website

INPUT_DIR="./src/assets/raw"
OUTPUT_DIR="./public/images"

# Install dependencies:
# brew install imagemagick webp libavif

echo "Optimizing images for Bloom website..."

# Function to process images
process_image() {
  local input=$1
  local basename=$(basename "$input" | sed 's/\.[^.]*$//')

  # Generate AVIF (best compression)
  magick "$input" -resize 1600x -quality 70 "$OUTPUT_DIR/${basename}-1600.avif"
  magick "$input" -resize 1200x -quality 70 "$OUTPUT_DIR/${basename}-1200.avif"
  magick "$input" -resize 800x -quality 75 "$OUTPUT_DIR/${basename}-800.avif"
  magick "$input" -resize 400x -quality 80 "$OUTPUT_DIR/${basename}-400.avif"

  # Generate WebP (good compression)
  magick "$input" -resize 1600x -quality 80 "$OUTPUT_DIR/${basename}-1600.webp"
  magick "$input" -resize 1200x -quality 80 "$OUTPUT_DIR/${basename}-1200.webp"
  magick "$input" -resize 800x -quality 85 "$OUTPUT_DIR/${basename}-800.webp"
  magick "$input" -resize 400x -quality 85 "$OUTPUT_DIR/${basename}-400.webp"

  # Generate JPEG fallback
  magick "$input" -resize 1200x -quality 85 "$OUTPUT_DIR/${basename}-1200.jpg"

  # Generate blur placeholder
  magick "$input" -resize 20x -quality 50 "$OUTPUT_DIR/${basename}-blur.webp"

  echo "Processed: $basename"
}

# Process all images
for img in "$INPUT_DIR"/*.{jpg,png,jpeg}; do
  [ -e "$img" ] || continue
  process_image "$img"
done

echo "Image optimization complete!"
```

### 9.2 Package.json Scripts

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run optimize:images && astro build",
    "preview": "astro preview",
    "optimize:images": "bash scripts/optimize-images.sh",
    "optimize:fonts": "bash scripts/subset-fonts.sh",
    "lighthouse": "lhci autorun",
    "perf:audit": "npm run build && npm run lighthouse"
  }
}
```

---

## 10. Monitoring & Testing

### 10.1 Lighthouse CI Configuration

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "staticDistDir": "./dist",
      "numberOfRuns": 3,
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/factions/",
        "http://localhost:4321/biomes/",
        "http://localhost:4321/gallery/"
      ],
      "settings": {
        "preset": "desktop",
        "throttling": {
          "rttMs": 40,
          "throughputKbps": 10240,
          "cpuSlowdownMultiplier": 1
        }
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-blocking-time": ["error", {"maxNumericValue": 300}],
        "speed-index": ["error", {"maxNumericValue": 3000}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 10.2 GitHub Actions CI Integration

Create `.github/workflows/performance.yml`:

```yaml
name: Performance Audit

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

      - name: Upload Lighthouse results
        uses: actions/upload-artifact@v3
        with:
          name: lighthouse-results
          path: .lighthouseci
```

### 10.3 Performance Monitoring Dashboard

**Plausible Analytics Configuration**:

```html
<!-- In BaseLayout.astro -->
<script defer data-domain="bloom.slurpgg.net" src="https://plausible.io/js/script.js"></script>

<!-- Optional: Custom event tracking -->
<script>
  window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }

  // Track page load performance
  window.addEventListener('load', () => {
    const perfData = performance.getEntriesByType('navigation')[0];
    const lcp = performance.getEntriesByType('largest-contentful-paint')[0];

    if (perfData && lcp) {
      plausible('Performance', {
        props: {
          loadTime: Math.round(perfData.loadEventEnd - perfData.fetchStart),
          lcp: Math.round(lcp.renderTime || lcp.loadTime)
        }
      });
    }
  });
</script>
```

### 10.4 WebPageTest Integration

**Monthly Performance Audits**:

```bash
# Run WebPageTest via API
curl -X POST "https://www.webpagetest.org/runtest.php" \
  -d "url=https://bloom.slurpgg.net" \
  -d "k=YOUR_API_KEY" \
  -d "location=Dulles:Chrome" \
  -d "runs=3" \
  -d "fvonly=1" \
  -d "video=1"
```

---

## 11. Deployment Configuration

### 11.1 Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

# Redirects
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Headers (see section 6.1 for complete headers)
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()"

# Compression
[[plugins]]
  package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
    output_path = "lighthouse-reports"

# Image CDN
[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### 11.2 Build Optimization

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';

export default defineConfig({
  site: 'https://bloom.slurpgg.net',
  integrations: [
    tailwind({
      config: { applyBaseStyles: false }
    }),
    sitemap(),
    compress({
      css: true,
      html: {
        removeAttributeQuotes: false,
        collapseWhitespace: true,
        removeComments: true
      },
      img: false, // Handle separately
      js: true,
      svg: true
    })
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor code
            'vendor': ['astro'],
          }
        }
      }
    },
    ssr: {
      noExternal: ['@astrojs/image']
    }
  }
});
```

---

## 12. Performance Checklist

### 12.1 Pre-Launch Checklist

**Images**:
- [ ] All images converted to WebP/AVIF with JPEG fallbacks
- [ ] Responsive images implemented with srcset
- [ ] Lazy loading configured for below-fold images
- [ ] Image dimensions specified (width/height attributes)
- [ ] Blur-up placeholders generated for key images
- [ ] Image CDN configured and tested
- [ ] Average image size <100KB (compressed)

**Fonts**:
- [ ] Fonts self-hosted (no external requests)
- [ ] Font files subsetted (only necessary glyphs)
- [ ] WOFF2 format used exclusively
- [ ] font-display: swap implemented
- [ ] Critical fonts preloaded
- [ ] Fallback fonts match loaded fonts (minimize CLS)
- [ ] Total font weight <40KB

**JavaScript**:
- [ ] Zero JavaScript on static pages
- [ ] Interactive components use Astro Islands
- [ ] Client directives appropriate (load/idle/visible)
- [ ] Third-party scripts deferred/async
- [ ] No render-blocking JavaScript
- [ ] Total JS bundle <50KB (critical path)

**CSS**:
- [ ] Tailwind purging enabled
- [ ] Critical CSS inlined
- [ ] Non-critical CSS deferred
- [ ] No unused CSS (verified with Coverage tool)
- [ ] CSS containment used where appropriate
- [ ] Total CSS <30KB (critical path)

**Caching**:
- [ ] Cache headers configured (static: 1 year, HTML: revalidate)
- [ ] CDN edge caching enabled
- [ ] Proper cache invalidation strategy
- [ ] Service worker implemented (optional)

**Performance Metrics**:
- [ ] Lighthouse score ≥90 (all pages)
- [ ] LCP <2.5s
- [ ] FID/INP <100ms/<200ms
- [ ] CLS <0.1
- [ ] TTFB <600ms
- [ ] Total page weight within budget

**Monitoring**:
- [ ] Lighthouse CI configured
- [ ] Performance monitoring (Plausible) active
- [ ] Real user monitoring tracking Core Web Vitals
- [ ] Alerts configured for performance regression

### 12.2 Per-Page Checklist

For each page type (Homepage, Factions, Biomes, Gallery):

- [ ] Initial load <500KB (uncompressed)
- [ ] Above-fold content loads in <1.8s
- [ ] No layout shifts during load
- [ ] Mobile performance tested on real devices
- [ ] 3G performance acceptable
- [ ] Video embeds use click-to-load
- [ ] Gallery images lazy loaded
- [ ] Critical content visible without JavaScript

---

## 13. Special Optimizations for Bloom

### 13.1 Unity HDRP Screenshot Handling

**Challenge**: High-resolution Unity screenshots are 5-10MB PNG files

**Solution**:
1. **Aggressive compression**: AVIF at quality 70 (1600px wide)
2. **Thumbnail generation**: 400px WebP at quality 85 for grid views
3. **Progressive loading**: Load thumbnails first, full-res on click
4. **Lazy loading**: Only load screenshots in viewport
5. **Blur placeholders**: 20px blur-up for smooth transition

```javascript
// Image processing settings for Unity screenshots
const SCREENSHOT_SETTINGS = {
  thumbnail: { width: 400, quality: 85, format: 'webp' },
  medium: { width: 800, quality: 80, format: 'avif' },
  large: { width: 1600, quality: 70, format: 'avif' },
  blur: { width: 20, quality: 50, format: 'webp' }
};
```

### 13.2 Faction Page Optimization

**Content**: 10+ factions with emblems, descriptions, screenshots

**Strategy**:
- Emblem SVGs (when possible) or optimized 30KB WebP
- Grid layout with CSS containment
- Lazy load faction screenshots
- Defer faction lore/details until interaction

```astro
---
// FactionGrid.astro
const factions = await getFactions();
---
<div class="faction-grid">
  {factions.map(faction => (
    <article class="faction-card" style="contain: layout style paint;">
      <img src={faction.emblem} width="120" height="120" loading="lazy" />
      <h3>{faction.name}</h3>
      <p>{faction.tagline}</p>
      <!-- Detailed content loaded on interaction -->
    </article>
  ))}
</div>
```

### 13.3 Biome Gallery Optimization

**Content**: 12+ biomes with multiple screenshots each

**Strategy**:
- Virtual scrolling for large galleries (optional)
- Progressive image loading
- IntersectionObserver for lazy loading
- Grid with proper aspect ratios (prevent CLS)

```javascript
// Gallery lazy loading
const observerOptions = {
  root: null,
  rootMargin: '50px', // Load 50px before entering viewport
  threshold: 0.01
};

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    }
  });
}, observerOptions);
```

### 13.4 Video Embed Strategy

**Trailers & Gameplay Videos**:
- YouTube/Vimeo embeds with click-to-load
- Self-hosted hero video (if needed): WebM + MP4, 720p max
- No autoplay (saves bandwidth)
- Poster images for all videos

---

## 14. Implementation Timeline

### Phase 1: Foundation (Week 1)
- [ ] Configure Astro project with performance settings
- [ ] Implement font optimization and subsetting
- [ ] Set up Tailwind with proper purging
- [ ] Configure image optimization pipeline
- [ ] Implement critical CSS strategy

### Phase 2: Assets (Week 2)
- [ ] Process all Unity screenshots (AVIF/WebP conversion)
- [ ] Generate responsive image variants
- [ ] Create blur-up placeholders
- [ ] Optimize faction emblems
- [ ] Set up CDN configuration

### Phase 3: Components (Week 3)
- [ ] Build optimized page templates
- [ ] Implement lazy loading for images
- [ ] Create click-to-load video components
- [ ] Configure Astro Islands for interactive elements
- [ ] Optimize gallery components

### Phase 4: Testing & Monitoring (Week 4)
- [ ] Set up Lighthouse CI
- [ ] Configure performance monitoring (Plausible)
- [ ] Run WebPageTest audits
- [ ] Test on real mobile devices (3G/4G)
- [ ] Performance regression testing

### Phase 5: Launch & Optimization (Ongoing)
- [ ] Monitor Core Web Vitals
- [ ] A/B test optimization strategies
- [ ] Continuous performance audits
- [ ] User feedback integration
- [ ] Regular performance reviews

---

## 15. Success Metrics

### 15.1 Quantitative Metrics

**Before Optimization (Baseline)**:
- Homepage load time: ~8s (unoptimized)
- Lighthouse score: ~40-60
- LCP: >5s
- Total page weight: 8-12MB
- Mobile bounce rate: 50%+

**After Optimization (Target)**:
- Homepage load time: <3s
- Lighthouse score: ≥90
- LCP: <2.5s
- Total page weight: <2MB
- Mobile bounce rate: <30%

### 15.2 Qualitative Metrics

- [ ] Smooth, fast user experience on mobile
- [ ] No perceived lag or jank during scrolling
- [ ] Images load smoothly without layout shifts
- [ ] Video embeds don't slow down page load
- [ ] Visitors can browse multiple pages quickly

---

## 16. Performance Budget Enforcement

### 16.1 Automated Size Budgets

Create `budget.json`:

```json
{
  "budgets": [
    {
      "path": "/*",
      "timings": [
        {
          "metric": "interactive",
          "budget": 3000
        },
        {
          "metric": "first-contentful-paint",
          "budget": 1800
        }
      ],
      "resourceSizes": [
        {
          "resourceType": "script",
          "budget": 50
        },
        {
          "resourceType": "stylesheet",
          "budget": 30
        },
        {
          "resourceType": "image",
          "budget": 500
        },
        {
          "resourceType": "font",
          "budget": 40
        },
        {
          "resourceType": "total",
          "budget": 1000
        }
      ]
    }
  ]
}
```

### 16.2 CI Integration

```yaml
# .github/workflows/budget.yml
name: Performance Budget

on: [pull_request]

jobs:
  budget-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - name: Check bundle size
        run: |
          npm install -g bundlesize
          bundlesize
```

---

## 17. Documentation & Training

### 17.1 Developer Guidelines

Create `PERFORMANCE_GUIDELINES.md` for team:

**Adding Images**:
- Place raw images in `/src/assets/raw/`
- Run `npm run optimize:images` before commit
- Use `<Picture>` component for all images
- Always specify width/height attributes

**Adding Components**:
- Default to static (no client directive)
- Use `client:visible` for below-fold interactive elements
- Keep components small (<5KB JS)
- Test performance impact with Lighthouse

**CSS Best Practices**:
- Use Tailwind utilities (automatically purged)
- Avoid custom CSS unless necessary
- Use CSS containment for isolated components
- Prefer transforms over layout properties

### 17.2 Content Editor Guidelines

**For Marketing Team**:
- Maximum image size: 2MB (before processing)
- Preferred format: PNG or JPEG (will be converted)
- Minimum dimensions: 1200px wide
- Video embeds: Provide YouTube/Vimeo ID only
- Alt text: Required for all images

---

## 18. Maintenance & Continuous Improvement

### 18.1 Monthly Performance Review

**Review Checklist**:
- [ ] Run Lighthouse audits on all pages
- [ ] Check Core Web Vitals from real users (Plausible)
- [ ] Review WebPageTest results
- [ ] Analyze largest assets (image/JS/CSS)
- [ ] Check for performance regressions
- [ ] Review mobile vs desktop performance
- [ ] Update budget if needed

### 18.2 Quarterly Optimization Sprint

- Review new performance best practices
- Update dependencies (Astro, Tailwind, etc.)
- Re-optimize images with new codecs (if available)
- Test new performance features
- A/B test optimization strategies
- Competitive performance benchmarking

---

## Appendix A: Tools & Resources

### Performance Tools
- **Lighthouse CI**: Automated performance testing
- **WebPageTest**: Real-world performance testing
- **Plausible Analytics**: Privacy-friendly analytics
- **ImageMagick**: Image optimization
- **squoosh.app**: Manual image compression testing
- **Chrome DevTools**: Performance profiling

### Learning Resources
- Web.dev Performance: https://web.dev/performance/
- Astro Performance: https://docs.astro.build/en/guides/performance/
- Core Web Vitals: https://web.dev/vitals/
- Image Optimization: https://web.dev/fast/#optimize-your-images

### Performance Benchmarks
- **Arc Raiders** (competitor): Lighthouse 85+
- **Hunt: Showdown** (competitor): LCP 3.2s
- **Target**: Beat competitor averages by 20%

---

## Appendix B: Quick Reference

### Command Reference

```bash
# Development
npm run dev                  # Start dev server
npm run build               # Build for production
npm run preview             # Preview production build

# Optimization
npm run optimize:images     # Process all images
npm run optimize:fonts      # Subset fonts
npm run perf:audit         # Run Lighthouse audit

# Testing
npm run lighthouse         # Run Lighthouse CI
npm test                   # Run all tests
```

### Key File Locations

```
/src/
├── assets/raw/           # Raw images (not committed)
├── components/           # Astro components
├── layouts/              # Page layouts
├── pages/                # Routes
└── styles/               # Global styles

/public/
├── images/               # Optimized images
├── fonts/                # Subsetted fonts
└── favicon.ico           # Favicon

/scripts/
├── optimize-images.sh    # Image processing
└── subset-fonts.sh       # Font subsetting

Configuration:
├── astro.config.mjs      # Astro configuration
├── tailwind.config.mjs   # Tailwind configuration
├── .lighthouserc.json    # Lighthouse CI config
├── netlify.toml          # Netlify deployment
└── budget.json           # Performance budgets
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-01
**Next Review**: 2025-12-01

**Contact**: Performance Engineering Team
**Questions**: Open GitHub issue with `performance` label
