# Bloom Marketing Website - Performance Optimization

**High-performance marketing website for Bloom extraction FPS game**

Built with Astro 4.x, Tailwind CSS 3.x, and optimized for Core Web Vitals excellence.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

This site is designed for Docker deployment on Unraid via reverse proxy.

```bash
# Build Docker image
docker build -t bloom-website:latest .

# Run container
docker run -d -p 8080:80 --name bloom-website bloom-website:latest
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

---

## Performance Targets

| Metric                         | Target        | Status     |
| ------------------------------ | ------------- | ---------- |
| Lighthouse Score               | ≥90           | 🟡 Pending |
| LCP (Largest Contentful Paint) | <2.5s         | 🟡 Pending |
| FID/INP                        | <100ms/<200ms | 🟡 Pending |
| CLS (Cumulative Layout Shift)  | <0.1          | 🟡 Pending |
| Total Page Weight              | <1MB          | 🟡 Pending |
| Initial Load Time              | <3s           | 🟡 Pending |

---

## Quick Start

### Using Docker (Recommended for Production)

Pre-built Docker images are automatically published to GitHub Container Registry:

```bash
# Pull and run the latest image
docker run -d -p 8080:80 ghcr.io/zachyzissou/terminal-grounds-website:latest

# Or use docker-compose
docker pull ghcr.io/zachyzissou/terminal-grounds-website:latest
docker-compose up -d

# Access the website at http://localhost:8080
```

### Local Development

```bash
# Install dependencies
npm install

# Copy example configurations (first time only)
cp astro.config.example.mjs astro.config.mjs
cp tailwind.config.example.mjs tailwind.config.mjs
cp package.example.json package.json

# Optimize fonts and images
npm run optimize:fonts
npm run optimize:images

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
bloom-website/
├── .github/workflows/performance.yml   # CI/CD performance audits
├── scripts/
│   ├── optimize-images.sh              # Image optimization pipeline
│   └── subset-fonts.sh                 # Font subsetting
├── src/
│   ├── components/
│   │   ├── OptimizedImage.astro        # Responsive image component
│   │   ├── VideoEmbed.astro            # Click-to-load videos
│   │   └── FactionCard.astro           # Faction card
│   ├── layouts/BaseLayout.astro        # Base layout
│   ├── pages/                          # Route pages
│   ├── assets/
│   │   ├── fonts/                      # Source fonts
│   │   └── raw/                        # Raw images (not committed)
│   └── styles/global.css               # Global styles
├── public/
│   ├── images/                         # Optimized images
│   └── fonts/                          # Subset fonts
├── astro.config.mjs                    # Astro configuration
├── tailwind.config.mjs                 # Tailwind configuration
├── netlify.toml                        # Netlify deployment
├── .lighthouserc.json                  # Lighthouse CI
├── budget.json                         # Performance budgets
├── PERFORMANCE_STRATEGY.md             # Full performance strategy
├── PERFORMANCE_CHECKLIST.md            # Pre-launch checklist
└── IMPLEMENTATION_GUIDE.md             # Implementation guide
```

---

## Key Features

### Image Optimization

- Automated pipeline converts Unity HDRP screenshots to WebP/AVIF
- 80%+ size reduction from original PNGs
- Responsive images with srcset and sizes
- Lazy loading for below-fold content
- Blur-up placeholders for smooth loading

### Font Optimization

- Self-hosted fonts (Inter + Orbitron)
- 60-70% size reduction via subsetting
- WOFF2 format with optimal compression
- font-display: swap to prevent FOIT
- Total weight <40KB for all fonts

### JavaScript Optimization

- Zero JavaScript by default (Astro Islands)
- Partial hydration only for interactive components
- Code splitting for better caching
- Total bundle <50KB (critical path)

### CSS Optimization

- Tailwind CSS purging removes 95%+ unused styles
- Critical CSS inlined in HTML
- Non-critical CSS deferred for faster FCP
- Total CSS <30KB (critical path)

---

## Available Scripts

### Development

```bash
npm run dev          # Start dev server (http://localhost:4321)
npm run build        # Build for production
npm run preview      # Preview production build
```

### Optimization

```bash
npm run optimize:images    # Process all images
npm run optimize:fonts     # Subset fonts and generate CSS
```

### Testing

```bash
npm run lighthouse         # Run Lighthouse CI audit
npm run perf:audit        # Full performance audit
npm test                  # Run all tests
```

---

## Performance Budgets

| Resource            | Budget | Per Asset |
| ------------------- | ------ | --------- |
| Total Page          | 1MB    | -         |
| JavaScript          | 50KB   | -         |
| CSS                 | 30KB   | -         |
| Fonts               | 40KB   | -         |
| Images (above fold) | 150KB  | 100KB     |

---

## Documentation

### Strategy & Planning

- **[PERFORMANCE_STRATEGY.md](./PERFORMANCE_STRATEGY.md)** - Comprehensive performance strategy (18 sections, 200KB)
- **[PERFORMANCE_CHECKLIST.md](./PERFORMANCE_CHECKLIST.md)** - Pre-launch checklist
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation

### Configuration

- **[astro.config.example.mjs](./astro.config.example.mjs)** - Astro configuration
- **[tailwind.config.example.mjs](./tailwind.config.example.mjs)** - Tailwind configuration
- **[netlify.toml](./netlify.toml)** - Netlify deployment settings

### Components

- **[OptimizedImage.astro](./src/components/OptimizedImage.astro)** - Responsive images
- **[VideoEmbed.astro](./src/components/VideoEmbed.astro)** - Click-to-load videos
- **[FactionCard.astro](./src/components/FactionCard.astro)** - Faction cards

---

## Deployment

### Netlify Auto-Deploy

- **Production**: Push to `main` → https://bloom.slurpgg.net
- **Preview**: Open PR → https://deploy-preview-[NUMBER]--bloom.netlify.app

### Performance Gates

- Lighthouse CI runs on every PR
- Build fails if score <90
- Performance budget enforced

---

## Browser Support

| Browser       | Version | Status          |
| ------------- | ------- | --------------- |
| Chrome        | Latest  | ✅ Full support |
| Firefox       | Latest  | ✅ Full support |
| Safari        | Latest  | ✅ Full support |
| Edge          | Latest  | ✅ Full support |
| Mobile Safari | Latest  | ✅ Full support |
| Chrome Mobile | Latest  | ✅ Full support |

---

## License

UNLICENSED - Proprietary

---

## Contact

**Development Team**

- GitHub: https://github.com/zachyzissou/bloom-website
- Issues: https://github.com/zachyzissou/bloom-website/issues

---

**Built with performance in mind. Every kilobyte counts.**
