# Performance Optimization Implementation Guide
**Bloom Marketing Website**

This guide provides step-by-step instructions for implementing the performance optimization strategy.

---

## Quick Start

### 1. Initial Setup (15 minutes)

```bash
# Navigate to project directory
cd /mnt/c/Users/Zachg/Bloom-Website

# Initialize Astro project (if not already done)
npm create astro@latest . -- --template minimal --typescript strict

# Install dependencies
npm install

# Copy example configurations
cp astro.config.example.mjs astro.config.mjs
cp tailwind.config.example.mjs tailwind.config.mjs
cp package.example.json package.json

# Install all dependencies
npm install

# Make scripts executable
chmod +x scripts/optimize-images.sh
chmod +x scripts/subset-fonts.sh
```

### 2. Configure Fonts (20 minutes)

```bash
# Create fonts directory
mkdir -p src/assets/fonts

# Run font optimization script (downloads and subsets fonts)
npm run optimize:fonts

# Verify fonts were created
ls -lh public/fonts/
# Should see: inter-subset.woff2, orbitron-subset.woff2, fonts.css
```

### 3. Set Up Images (30 minutes)

```bash
# Create image directories
mkdir -p src/assets/raw
mkdir -p public/images

# Place your raw Unity screenshots in src/assets/raw/
# Example: src/assets/raw/hero-screenshot.png

# Run image optimization
npm run optimize:images

# Verify optimized images
ls -lh public/images/
# Should see: multiple sizes of .avif, .webp, .jpg, and blur placeholders
```

### 4. Test Build (10 minutes)

```bash
# Build the site
npm run build

# Preview the build
npm run preview

# In another terminal, run Lighthouse
npm run lighthouse
```

---

## Detailed Implementation Steps

### Phase 1: Foundation Setup (Week 1)

#### Day 1: Project Structure

**Goal**: Set up Astro project with optimal configuration

1. **Initialize Project**
   ```bash
   npm create astro@latest . -- --template minimal --typescript strict
   ```

2. **Install Core Dependencies**
   ```bash
   npm install @astrojs/tailwind @astrojs/sitemap @astrojs/mdx astro-compress
   npm install -D @lhci/cli @tailwindcss/typography @tailwindcss/forms
   ```

3. **Copy Configuration Files**
   - `astro.config.mjs` - Main Astro configuration
   - `tailwind.config.mjs` - Tailwind CSS configuration
   - `netlify.toml` - Netlify deployment settings
   - `.lighthouserc.json` - Lighthouse CI configuration
   - `budget.json` - Performance budgets

4. **Create Directory Structure**
   ```bash
   mkdir -p src/{components,layouts,pages,assets/{fonts,raw},styles}
   mkdir -p public/{images,fonts}
   mkdir -p scripts
   mkdir -p .github/workflows
   ```

#### Day 2: Font Optimization

**Goal**: Self-host optimized fonts (<40KB total)

1. **Download Fonts** (script does this automatically)
   - Inter (body text): Variable font
   - Orbitron (headings): Variable font

2. **Subset Fonts**
   ```bash
   # Install fonttools
   pip install fonttools brotli

   # Run subset script
   npm run optimize:fonts
   ```

3. **Verify Font Loading**
   - Check `public/fonts/fonts.css` was generated
   - Total size should be <40KB
   - Import in your base layout:
     ```astro
     ---
     // src/layouts/BaseLayout.astro
     import '../styles/global.css';
     ---
     <html>
       <head>
         <link rel="preload" href="/fonts/inter-subset.woff2" as="font" type="font/woff2" crossorigin>
         <link rel="preload" href="/fonts/orbitron-subset.woff2" as="font" type="font/woff2" crossorigin>
         <link rel="stylesheet" href="/fonts/fonts.css">
       </head>
     </html>
     ```

4. **Test Font Display**
   - Open site in browser
   - Check for FOIT (Flash of Invisible Text) - should see fallback immediately
   - Verify custom fonts load

#### Day 3: Image Optimization Pipeline

**Goal**: Set up automated image processing

1. **Install ImageMagick** (if not installed)
   ```bash
   # macOS
   brew install imagemagick webp libavif

   # Ubuntu/Debian
   sudo apt-get install imagemagick webp libavif-bin

   # Windows (WSL)
   sudo apt-get update
   sudo apt-get install imagemagick webp
   ```

2. **Test Image Optimization Script**
   ```bash
   # Place a test image in src/assets/raw/
   cp /path/to/unity-screenshot.png src/assets/raw/test.png

   # Run optimization
   npm run optimize:images

   # Check output
   ls -lh public/images/test-*
   ```

3. **Verify Output Formats**
   - `test-1600.avif` (best compression)
   - `test-1200.webp` (good compression)
   - `test-1200.jpg` (fallback)
   - `test-blur.webp` (placeholder)

4. **Calculate Compression Ratio**
   ```bash
   # Compare original vs optimized
   du -h src/assets/raw/test.png
   du -h public/images/test-1200.webp
   # Should see 70-90% reduction
   ```

#### Day 4: Component Development

**Goal**: Create performance-optimized components

1. **Copy Example Components**
   - `OptimizedImage.astro` - Responsive images with AVIF/WebP
   - `VideoEmbed.astro` - Click-to-load video embeds
   - `FactionCard.astro` - Static faction cards with CSS containment

2. **Create Base Layout**
   ```astro
   ---
   // src/layouts/BaseLayout.astro
   interface Props {
     title: string;
     description?: string;
   }

   const { title, description } = Astro.props;
   ---
   <!DOCTYPE html>
   <html lang="en">
     <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">

       <!-- Preconnect to external domains -->
       <link rel="preconnect" href="https://plausible.io">

       <!-- Preload critical fonts -->
       <link rel="preload" href="/fonts/inter-subset.woff2" as="font" type="font/woff2" crossorigin>

       <title>{title} | Bloom</title>
       {description && <meta name="description" content={description}>}

       <!-- Font stylesheet -->
       <link rel="stylesheet" href="/fonts/fonts.css">
     </head>
     <body>
       <slot />

       <!-- Plausible Analytics -->
       <script defer data-domain="bloom.slurpgg.net" src="https://plausible.io/js/script.js"></script>
     </body>
   </html>
   ```

3. **Test Components**
   ```astro
   ---
   // src/pages/test.astro
   import BaseLayout from '../layouts/BaseLayout.astro';
   import OptimizedImage from '../components/OptimizedImage.astro';
   import VideoEmbed from '../components/VideoEmbed.astro';
   import FactionCard from '../components/FactionCard.astro';
   ---
   <BaseLayout title="Component Test">
     <OptimizedImage
       src="test"
       alt="Test image"
       width={1200}
       height={675}
       loading="eager"
       fetchpriority="high"
     />

     <VideoEmbed
       platform="youtube"
       videoId="dQw4w9WgXcQ"
       title="Bloom Trailer"
     />

     <FactionCard
       name="Sky Bastion Directorate"
       tagline="Military precision"
       emblem="/images/sky-bastion-emblem.webp"
       colors={{ primary: '#1e3a8a', secondary: '#475569' }}
       href="/factions/sky-bastion"
     />
   </BaseLayout>
   ```

#### Day 5: Tailwind Configuration

**Goal**: Configure Tailwind for optimal CSS output

1. **Configure Content Paths** (already in example config)
   ```javascript
   // tailwind.config.mjs
   content: [
     './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
   ]
   ```

2. **Add Faction Colors**
   - Copy faction colors from `tailwind.config.example.mjs`
   - Use in components: `bg-bloom-sky-bastion`, `text-bloom-iron-scavengers`, etc.

3. **Test CSS Purging**
   ```bash
   npm run build

   # Check CSS size
   find dist -name "*.css" -exec ls -lh {} \;
   # Should be <30KB for critical CSS
   ```

4. **Verify No Unused CSS**
   - Open DevTools → Coverage tab
   - Load homepage
   - Check CSS usage % - should be >90%

---

### Phase 2: Content Integration (Week 2)

#### Day 6-7: Content Creation

1. **Create Content Collections**
   ```typescript
   // src/content/config.ts
   import { defineCollection, z } from 'astro:content';

   const factions = defineCollection({
     schema: z.object({
       name: z.string(),
       tagline: z.string(),
       description: z.string(),
       emblem: z.string(),
       colors: z.object({
         primary: z.string(),
         secondary: z.string(),
       }),
       order: z.number(),
     }),
   });

   export const collections = { factions };
   ```

2. **Add Faction Content**
   ```markdown
   ---
   // src/content/factions/sky-bastion.md
   name: "Sky Bastion Directorate"
   tagline: "Military precision, unwavering authority"
   description: "Former military forces maintaining order..."
   emblem: "/images/factions/sky-bastion-emblem.webp"
   colors:
     primary: "#1e3a8a"
     secondary: "#475569"
   order: 1
   ---

   # Sky Bastion Directorate

   Full faction lore and details here...
   ```

3. **Create Dynamic Pages**
   ```astro
   ---
   // src/pages/factions/[slug].astro
   import { getCollection } from 'astro:content';
   import BaseLayout from '../../layouts/BaseLayout.astro';

   export async function getStaticPaths() {
     const factions = await getCollection('factions');
     return factions.map(faction => ({
       params: { slug: faction.slug },
       props: { faction },
     }));
   }

   const { faction } = Astro.props;
   const { Content } = await faction.render();
   ---
   <BaseLayout title={faction.data.name}>
     <Content />
   </BaseLayout>
   ```

#### Day 8-9: Image Integration

1. **Process All Unity Screenshots**
   ```bash
   # Copy all Unity screenshots to src/assets/raw/
   cp /path/to/unity/screenshots/*.png src/assets/raw/

   # Run optimization (may take 15-30 minutes)
   npm run optimize:images
   ```

2. **Create Image Manifest**
   - The script generates `public/images/manifest.json`
   - Use this to dynamically load images in components

3. **Implement Image Gallery**
   ```astro
   ---
   // src/components/Gallery.astro
   import OptimizedImage from './OptimizedImage.astro';

   const images = [
     { src: 'screenshot-1', alt: 'Combat in the wastes' },
     { src: 'screenshot-2', alt: 'Faction encounter' },
     // ... more images
   ];
   ---
   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
     {images.map(img => (
       <OptimizedImage
         src={img.src}
         alt={img.alt}
         width={800}
         height={450}
         loading="lazy"
       />
     ))}
   </div>
   ```

#### Day 10: Video Integration

1. **Implement Click-to-Load Videos**
   ```astro
   ---
   // src/pages/index.astro
   import VideoEmbed from '../components/VideoEmbed.astro';
   ---
   <section class="py-20">
     <h2>Watch the Trailer</h2>
     <VideoEmbed
       platform="youtube"
       videoId="YOUR_VIDEO_ID"
       title="Bloom Official Trailer"
     />
   </section>
   ```

2. **Test Video Loading**
   - Verify no iframe until click
   - Check network waterfall - no video resources until interaction

---

### Phase 3: Performance Testing (Week 3)

#### Day 11-12: Lighthouse CI Setup

1. **Configure GitHub Actions**
   - `.github/workflows/performance.yml` is already created
   - Add GitHub secret: `LHCI_GITHUB_APP_TOKEN` (optional)

2. **Run Local Lighthouse Audit**
   ```bash
   npm run build
   npm run preview &
   sleep 5
   npm run lighthouse
   ```

3. **Review Results**
   - Open `.lighthouseci/` directory
   - Check HTML reports
   - Target: All scores ≥90

4. **Fix Any Issues**
   - Images not optimized? Re-run optimization script
   - High JS bundle? Check for heavy dependencies
   - Poor caching? Verify Netlify headers

#### Day 13: Performance Budget Enforcement

1. **Test Budget Compliance**
   ```bash
   # Build and check sizes
   npm run build

   # Check against budget.json
   lighthouse --budget-path=budget.json http://localhost:4322
   ```

2. **Review Budget Violations**
   - If any resource exceeds budget, optimize
   - Update budget if targets were unrealistic

3. **Add to CI/CD**
   - GitHub Actions workflow already includes budget checks
   - Will fail PR if budget exceeded

#### Day 14: Real Device Testing

1. **Test on Mobile Devices**
   - iPhone (Safari)
   - Android (Chrome)
   - Tablet (iPad)

2. **Test Network Conditions**
   ```bash
   # Chrome DevTools → Network tab → Throttling
   # Test with:
   # - Fast 3G
   # - Slow 3G
   # - Offline (service worker, if implemented)
   ```

3. **Document Issues**
   - Create spreadsheet of device + issue
   - Prioritize based on severity
   - Fix critical issues before launch

---

### Phase 4: Deployment (Week 4)

#### Day 15: Netlify Setup

1. **Connect Repository**
   - Go to Netlify dashboard
   - "New site from Git"
   - Select repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Configure Environment**
   - Add environment variables (if any)
   - Node version: 18

3. **Test Deploy Preview**
   - Create test PR
   - Netlify auto-deploys preview
   - Check preview URL

4. **Verify Performance**
   - Run Lighthouse on preview URL
   - Should match local scores

#### Day 16: Domain & SSL

1. **Configure Custom Domain**
   - Add domain in Netlify settings
   - Update DNS records (A/CNAME)
   - Wait for DNS propagation

2. **Enable SSL**
   - Netlify auto-provisions Let's Encrypt certificate
   - Force HTTPS (already in netlify.toml)

3. **Test HTTPS Redirect**
   ```bash
   curl -I http://bloom.slurpgg.net
   # Should see 301 redirect to https://
   ```

#### Day 17: Analytics & Monitoring

1. **Set Up Plausible Analytics**
   - Create account at plausible.io
   - Add site: bloom.slurpgg.net
   - Verify tracking script (already in BaseLayout)

2. **Configure Uptime Monitoring**
   - UptimeRobot, Pingdom, or similar
   - Monitor homepage every 5 minutes
   - Set up email alerts

3. **Set Up Error Tracking** (optional)
   - Sentry.io for JavaScript errors
   - Add to BaseLayout if needed

#### Day 18: Launch Preparation

1. **Final Performance Audit**
   ```bash
   # Run comprehensive audit
   npm run perf:audit

   # Check all pages
   lighthouse https://bloom.slurpgg.net/
   lighthouse https://bloom.slurpgg.net/factions/
   lighthouse https://bloom.slurpgg.net/biomes/
   lighthouse https://bloom.slurpgg.net/gallery/
   ```

2. **SEO Audit**
   - All pages have titles
   - All pages have meta descriptions
   - Images have alt text
   - Sitemap generated
   - Robots.txt configured

3. **Accessibility Audit**
   - Lighthouse accessibility score ≥90
   - Keyboard navigation works
   - Screen reader compatible

4. **Cross-Browser Testing**
   - Chrome ✓
   - Firefox ✓
   - Safari ✓
   - Edge ✓

---

## Maintenance Schedule

### Weekly Tasks
- [ ] Review Plausible analytics
- [ ] Check uptime reports
- [ ] Monitor Core Web Vitals

### Monthly Tasks
- [ ] Run full Lighthouse audit on all pages
- [ ] Review and update content
- [ ] Check for dependency updates
- [ ] Competitive performance benchmarking

### Quarterly Tasks
- [ ] Full performance review
- [ ] Update images with new compression formats
- [ ] Review and update performance budgets
- [ ] A/B test optimization strategies

---

## Troubleshooting

### Build Fails

**Issue**: `npm run build` fails

**Solutions**:
1. Check Node version: `node -v` (should be 18+)
2. Clear cache: `rm -rf node_modules .astro && npm install`
3. Check for syntax errors in Astro files
4. Review build logs for specific errors

### Images Not Loading

**Issue**: Optimized images don't display

**Solutions**:
1. Verify images exist: `ls public/images/`
2. Check image paths in components (should start with `/images/`)
3. Ensure optimization script completed: `npm run optimize:images`
4. Check browser console for 404 errors

### Lighthouse Score Low

**Issue**: Lighthouse score <90

**Solutions**:
1. **Performance**: Check image sizes, JS bundle size, caching
2. **Accessibility**: Add alt text, ensure proper heading hierarchy
3. **Best Practices**: Check console errors, HTTPS, security headers
4. **SEO**: Add meta descriptions, sitemap, robots.txt

### Fonts Not Loading

**Issue**: Custom fonts don't display

**Solutions**:
1. Check font files exist: `ls public/fonts/`
2. Verify preload links in `<head>`
3. Check font-display is set to `swap`
4. Ensure CORS headers if using CDN

---

## Performance Metrics Targets

### Core Web Vitals (Field Data)
- **LCP**: <2.5s (75th percentile)
- **FID**: <100ms (75th percentile)
- **CLS**: <0.1 (75th percentile)
- **INP**: <200ms (75th percentile)

### Lighthouse Lab Data
- **Performance**: ≥90
- **Accessibility**: ≥90
- **Best Practices**: ≥90
- **SEO**: ≥90

### Page Weight Budgets
- Homepage: <500KB initial load
- Content pages: <400KB initial load
- Gallery: <450KB initial load

---

## Support & Resources

### Documentation
- Astro Docs: https://docs.astro.build
- Tailwind CSS: https://tailwindcss.com
- Web.dev Performance: https://web.dev/performance

### Tools
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- WebPageTest: https://www.webpagetest.org
- Plausible: https://plausible.io

### Community
- Astro Discord: https://astro.build/chat
- Web Performance Slack: https://webperformance.slack.com

---

**Last Updated**: 2025-11-01
**Version**: 1.0
**Contact**: Development Team
