# Performance Optimization Checklist
**Bloom Marketing Website**

Use this checklist before deploying to production to ensure all performance optimizations are in place.

---

## Pre-Launch Checklist

### Images (Critical)

- [ ] All images converted to WebP/AVIF with JPEG fallbacks
- [ ] Responsive images implemented with `srcset` and `sizes`
- [ ] Lazy loading configured for below-fold images (`loading="lazy"`)
- [ ] Image dimensions specified (`width` and `height` attributes)
- [ ] Blur-up placeholders generated for hero/featured images
- [ ] Image CDN configured and tested (Netlify Image CDN)
- [ ] Average image size <100KB (compressed)
- [ ] No images exceed 150KB (for lazy-loaded content)
- [ ] Hero images use `fetchpriority="high"` and `loading="eager"`
- [ ] All images have descriptive `alt` text (accessibility + SEO)

**Verification**:
```bash
# Check average image size
find public/images -name "*.webp" -exec ls -lh {} \; | awk '{sum+=$5; count++} END {print "Average:", sum/count/1024, "KB"}'

# Find images over 100KB
find public/images -name "*.webp" -size +100k
```

---

### Fonts (Critical)

- [ ] Fonts self-hosted (no external font requests)
- [ ] Font files subsetted (only necessary glyphs)
- [ ] WOFF2 format used exclusively
- [ ] `font-display: swap` implemented in all `@font-face` declarations
- [ ] Critical fonts preloaded with `<link rel="preload">`
- [ ] Fallback fonts match loaded fonts (minimize CLS)
- [ ] Total font weight <40KB
- [ ] Fonts served with proper cache headers (1 year)
- [ ] Font files compressed (WOFF2 has built-in compression)

**Verification**:
```bash
# Check total font size
du -sh public/fonts

# Verify font formats
ls -lh public/fonts/*.woff2
```

---

### JavaScript (Critical)

- [ ] Zero JavaScript shipped on static pages
- [ ] Interactive components use Astro Islands pattern
- [ ] Client directives appropriate (`client:load`, `client:idle`, `client:visible`)
- [ ] Third-party scripts deferred or async (`defer`, `async` attributes)
- [ ] No render-blocking JavaScript
- [ ] Total JS bundle <50KB (critical path)
- [ ] Code splitting configured for large components
- [ ] Unused JavaScript removed (tree shaking verified)
- [ ] Analytics script lightweight (<5KB) - Plausible recommended

**Verification**:
```bash
# Check total JS size
find dist -name "*.js" -exec ls -lh {} \;

# Check for blocking scripts in HTML
grep -r "<script" dist/*.html | grep -v "defer\|async"
```

---

### CSS (Critical)

- [ ] Tailwind CSS purging enabled and configured
- [ ] Critical CSS inlined in `<head>`
- [ ] Non-critical CSS deferred (load after initial render)
- [ ] No unused CSS (verified with Chrome DevTools Coverage)
- [ ] CSS containment used where appropriate (`contain: layout style paint`)
- [ ] Total CSS <30KB (critical path)
- [ ] CSS minified in production build
- [ ] No `@import` statements (use bundler instead)

**Verification**:
```bash
# Check CSS size
find dist -name "*.css" -exec ls -lh {} \;

# Check for unused Tailwind classes (manual in DevTools)
```

---

### Caching (Critical)

- [ ] Cache headers configured correctly
  - Static assets: `Cache-Control: public, max-age=31536000, immutable`
  - HTML: `Cache-Control: public, max-age=0, must-revalidate`
- [ ] CDN edge caching enabled (Netlify)
- [ ] Proper cache invalidation strategy (content hashing in filenames)
- [ ] Service worker implemented (optional, for offline support)
- [ ] Font files have CORS headers if needed

**Verification**:
```bash
# Test cache headers (after deployment)
curl -I https://bloom.slurpgg.net/assets/main.js
curl -I https://bloom.slurpgg.net/
```

---

### Performance Metrics (Critical)

- [ ] Lighthouse score ≥90 on all pages (Performance category)
- [ ] Largest Contentful Paint (LCP) <2.5s
- [ ] First Input Delay (FID) <100ms / Interaction to Next Paint (INP) <200ms
- [ ] Cumulative Layout Shift (CLS) <0.1
- [ ] Time to First Byte (TTFB) <600ms
- [ ] Total page weight within budget (see budget.json)
- [ ] Speed Index <3.0s
- [ ] Total Blocking Time <300ms

**Verification**:
```bash
# Run Lighthouse CI
npm run lighthouse

# Check budget
lighthouse --budget-path=budget.json http://localhost:4321
```

---

### Monitoring (Important)

- [ ] Lighthouse CI configured in GitHub Actions
- [ ] Performance monitoring active (Plausible Analytics)
- [ ] Real User Monitoring tracking Core Web Vitals
- [ ] Alerts configured for performance regression
- [ ] Error tracking configured (Sentry, optional)
- [ ] Uptime monitoring active (UptimeRobot, Pingdom, etc.)

**Verification**:
```bash
# Check GitHub Actions workflow
cat .github/workflows/performance.yml

# Verify analytics script
grep "plausible" dist/index.html
```

---

### SEO & Accessibility (Important)

- [ ] All pages have unique `<title>` tags
- [ ] All pages have `<meta name="description">` tags
- [ ] All images have `alt` attributes
- [ ] Semantic HTML used throughout (`<header>`, `<main>`, `<nav>`, etc.)
- [ ] Proper heading hierarchy (`<h1>` → `<h2>` → `<h3>`)
- [ ] Links have descriptive text (no "click here")
- [ ] Form labels associated with inputs
- [ ] Color contrast meets WCAG AA standards
- [ ] Keyboard navigation works correctly
- [ ] Sitemap generated and submitted (`sitemap.xml`)
- [ ] Robots.txt configured (`robots.txt`)
- [ ] OpenGraph tags for social sharing

**Verification**:
```bash
# Check sitemap
ls -lh dist/sitemap-*.xml

# Run accessibility audit
lighthouse --only-categories=accessibility http://localhost:4321
```

---

## Per-Page Checklist

Run this checklist for each page type (Homepage, Factions, Biomes, Gallery):

### Homepage

- [ ] Initial load <500KB (uncompressed)
- [ ] Above-fold content loads in <1.8s
- [ ] Hero image optimized (<100KB WebP/AVIF)
- [ ] No layout shifts during load
- [ ] Mobile performance tested on real devices (iPhone, Android)
- [ ] 3G performance acceptable (tested with Chrome DevTools throttling)
- [ ] Video embeds use click-to-load pattern
- [ ] Critical content visible without JavaScript

### Faction Pages

- [ ] Initial load <400KB (uncompressed)
- [ ] Faction emblems optimized (<30KB each)
- [ ] Screenshots lazy-loaded (below fold)
- [ ] Grid layout uses CSS containment
- [ ] Faction data fetched efficiently (no N+1 queries)
- [ ] Animations use GPU-accelerated properties (transform, opacity)

### Biome Pages

- [ ] Initial load <400KB (uncompressed)
- [ ] Gallery images lazy-loaded with intersection observer
- [ ] Image placeholders prevent layout shifts
- [ ] Thumbnails used for grid view (<20KB each)
- [ ] Full-size images loaded on click/modal open
- [ ] Virtual scrolling implemented (if >20 images)

### Gallery Page

- [ ] Initial load <450KB (uncompressed)
- [ ] Gallery uses progressive loading
- [ ] Lightbox/modal loads images on demand
- [ ] Image grid uses blur-up placeholders
- [ ] Filter/sort doesn't cause layout shifts
- [ ] Pagination or infinite scroll for large galleries

---

## Testing Checklist

### Local Testing

- [ ] Test on Chrome (latest)
- [ ] Test on Firefox (latest)
- [ ] Test on Safari (latest)
- [ ] Test on Edge (latest)
- [ ] Test on mobile Safari (iOS)
- [ ] Test on Chrome mobile (Android)
- [ ] Test with JavaScript disabled
- [ ] Test with slow 3G throttling (Chrome DevTools)
- [ ] Test with ad blockers enabled

### Performance Testing Tools

- [ ] Run Lighthouse audit (all pages)
- [ ] Run WebPageTest audit (key pages)
- [ ] Check bundle size with Webpack Bundle Analyzer
- [ ] Test with Chrome DevTools Performance panel
- [ ] Test with Chrome DevTools Coverage tool (unused CSS/JS)
- [ ] Test with Chrome DevTools Network panel (waterfall)

### Real Device Testing

- [ ] Test on iPhone (Safari)
- [ ] Test on Android phone (Chrome)
- [ ] Test on tablet (iPad or Android)
- [ ] Test on low-end device (simulate with CPU throttling)
- [ ] Test on different network conditions (3G, 4G, WiFi)

---

## Deployment Checklist

### Pre-Deployment

- [ ] All images optimized (run `npm run optimize:images`)
- [ ] All fonts subsetted (run `npm run optimize:fonts`)
- [ ] Production build successful (`npm run build`)
- [ ] No build warnings or errors
- [ ] Lighthouse CI passing (≥90 scores)
- [ ] Bundle size within budget
- [ ] Environment variables configured (Netlify)
- [ ] DNS configured correctly
- [ ] SSL certificate active (HTTPS)

### Post-Deployment

- [ ] Verify homepage loads correctly
- [ ] Test all navigation links
- [ ] Verify images load correctly (all formats)
- [ ] Verify fonts load correctly
- [ ] Check cache headers (curl -I)
- [ ] Test mobile responsiveness
- [ ] Verify analytics tracking (Plausible)
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Test 404 page
- [ ] Test redirects (HTTP → HTTPS, www → non-www)

### Monitoring Setup

- [ ] Configure performance alerts (Lighthouse CI)
- [ ] Set up error tracking (Sentry, optional)
- [ ] Configure uptime monitoring
- [ ] Set up Core Web Vitals tracking (Plausible)
- [ ] Schedule monthly performance audits
- [ ] Create performance dashboard (Plausible)

---

## Maintenance Checklist (Monthly)

- [ ] Run Lighthouse audits on all pages
- [ ] Review Core Web Vitals from real users
- [ ] Check WebPageTest results
- [ ] Analyze largest assets (image/JS/CSS)
- [ ] Check for performance regressions
- [ ] Review mobile vs desktop performance
- [ ] Update dependencies (Astro, Tailwind, etc.)
- [ ] Re-optimize images with new codecs (if available)
- [ ] Review and update performance budget
- [ ] Competitive benchmarking (Arc Raiders, etc.)

---

## Quick Commands Reference

```bash
# Development
npm run dev                     # Start dev server
npm run build                   # Production build
npm run preview                 # Preview production build

# Optimization
npm run optimize:images         # Optimize all images
npm run optimize:fonts          # Subset fonts
npm run perf:audit             # Run Lighthouse audit

# Testing
npm run lighthouse              # Run Lighthouse CI
npm test                        # Run all tests

# Deployment
git push origin main            # Deploy to production (auto-deploy)
netlify deploy --prod           # Manual Netlify deploy
```

---

## Performance Budget Summary

| Resource Type | Budget | Current | Status |
|---------------|--------|---------|--------|
| Total Page Weight | 1MB | TBD | 🟡 |
| Critical JS | 50KB | TBD | 🟡 |
| Critical CSS | 30KB | TBD | 🟡 |
| Fonts | 40KB | TBD | 🟡 |
| Images (above fold) | 150KB | TBD | 🟡 |
| LCP | <2.5s | TBD | 🟡 |
| FID/INP | <100ms/<200ms | TBD | 🟡 |
| CLS | <0.1 | TBD | 🟡 |
| Lighthouse Score | ≥90 | TBD | 🟡 |

Legend: 🟢 Pass | 🟡 Pending | 🔴 Fail

---

## Common Performance Issues & Solutions

### Issue: Large LCP (>2.5s)
**Solutions**:
- Optimize hero image (WebP/AVIF, <100KB)
- Preload hero image with `<link rel="preload">`
- Use `fetchpriority="high"` on LCP image
- Defer non-critical CSS
- Reduce server response time (TTFB)

### Issue: High CLS (>0.1)
**Solutions**:
- Specify image dimensions (width/height)
- Use aspect-ratio for responsive images
- Reserve space for ads/embeds
- Avoid inserting content above existing content
- Use font-display: swap with matching fallback fonts

### Issue: Large JavaScript Bundle
**Solutions**:
- Use Astro Islands (client:visible, client:idle)
- Remove unused dependencies
- Code split large components
- Defer third-party scripts
- Use native browser APIs instead of libraries

### Issue: Slow Initial Load
**Solutions**:
- Enable compression (gzip/brotli)
- Implement caching (1 year for static assets)
- Use CDN (Netlify Edge)
- Optimize critical rendering path
- Inline critical CSS

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Next Review**: Before production launch
