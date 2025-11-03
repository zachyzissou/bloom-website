# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marketing website for Bloom, a post-apocalyptic extraction FPS game. Built with Astro 4.x for static site generation with performance optimization as a primary goal. The site syncs content from a GitLab wiki and transforms it into structured JSON for the website.

**Key Architecture**: Wiki-driven content → JSON transformation → Static Astro site

## Development Commands

### Initial Setup
```bash
# First time setup
npm install

# Set up environment variables (required for wiki sync)
cp .env.example .env
# Edit .env to add GITLAB_TOKEN and GITLAB_PROJECT_ID
```

### Development
```bash
# Development with wiki sync (first time or after wiki updates)
npm run dev:sync

# Fast development (skip wiki sync - recommended for iteration)
npm run dev

# Type checking
npm run check
```

### Building
```bash
# Full production build (includes prebuild hooks: sync, extract, audit, validate)
npm run build

# Fast build (skip prebuild hooks and type checking)
npm run build:fast

# Build without wiki sync (uses cached data)
npm run build:skip-sync

# Preview production build
npm run preview
```

### Content Pipeline
```bash
# Sync content from GitLab wiki
npm run sync:wiki

# Extract design tokens from wiki
npm run extract:tokens

# Audit content for discrepancies
npm run audit

# Validate JSON data against schemas
npm run validate
```

### Code Quality
```bash
# Linting
npm run lint           # Check for errors
npm run lint:fix      # Auto-fix errors

# Formatting
npm run format        # Format all files
npm run format:check  # Check formatting
```

### Performance Testing
```bash
npm run lighthouse     # Run Lighthouse CI audit
npm run analyze        # Build and analyze bundle size
```

## Architecture

### Wiki Integration Pipeline

The website uses a sophisticated content synchronization system that pulls data from GitLab wiki pages:

1. **Fetch** (`scripts/fetch-wiki-data.mjs`):
   - Fetches raw markdown from 8 GitLab wiki pages
   - Caches locally in `temp/wiki-raw/` (24h TTL)
   - Requires `GITLAB_TOKEN` and `GITLAB_PROJECT_ID` in `.env`
   - Use `--force` flag to bypass cache

2. **Transform** (`scripts/transform-wiki-to-json.mjs`):
   - Parses markdown tables and frontmatter
   - Merges wiki data with existing `src/data/*.json` files
   - Preserves manual-only fields (prefixed with `_manual`)
   - Adds `lastSynced` timestamp to each faction

3. **Extract Tokens** (`scripts/extract-design-tokens.mjs`):
   - Extracts design tokens (colors, typography) from Brand Guidelines wiki page
   - Generates `src/styles/tokens/design-tokens.json`
   - Runs style-dictionary to create CSS variables and Tailwind config

4. **Audit** (`scripts/audit-content.mjs`):
   - Compares wiki data vs website data
   - Generates reports: `audit-report.{json,md,html}`
   - Categorizes discrepancies: critical (blocks build), warning, minor
   - Exit code 1 if critical issues found

5. **Validate** (`scripts/validate-data.mjs`):
   - Validates JSON files against schemas in `scripts/schemas/`
   - Checks WCAG AA contrast ratios for faction colors
   - Verifies faction count === 10
   - Exit code 1 on validation failures

### Data Structure

**Core Data Files**:
- `src/data/factions.json` - 10 faction definitions (EA launch + expansions)
- `src/data/biomes.json` - Biome data with faction presence
- `src/data/wiki-metadata.json` - Sync metadata and timestamps

**Faction Structure** (each faction has):
```typescript
{
  id: string;              // e.g., "FCT_DIR"
  name: string;            // Full name
  shortName: string;       // Display name
  role: string;            // tank | scavenger | medic | all-rounder | tech | scout | stealth | defender | food-provider | elite-hunter
  coopAbility: string;     // Squad bonus description
  homeBiome: string;       // Primary territory
  launchStatus: string;    // "ea-launch" | "expansion"
  launchWindow: string;    // "EA Launch" | "Month 3-6" | "Month 6-9"
  philosophy: string;      // Core belief
  specialty: string;       // Gameplay specialty
  lore: string;            // Lore description
  colors: {
    primary: string;       // Hex color
    secondary: string;     // Hex color
    accent: string;        // Hex color
  };
  playstyle: string;       // Description
  strengths: string[];     // 3-4 strengths
  weaknesses: string[];    // 1-2 weaknesses
  uniqueAbilities: Array<{
    name: string;
    description: string;
    cooldown: "passive" | "short" | "medium" | "long";
  }>;
  lastSynced?: string;     // ISO timestamp (added by transform script)
}
```

### Component Architecture

**Key Components**:
- `OptimizedImage.astro` - Responsive images with WebP/AVIF, lazy loading, blur-up placeholders
- `VideoEmbed.astro` - Click-to-load videos (performance optimization)
- `FactionCard.astro` - Displays faction info with colors and abilities
- `SEO.astro` - Meta tags, Open Graph, Twitter Cards
- `Analytics.astro` - Privacy-friendly analytics

**Layout**:
- `BaseLayout.astro` - Base HTML structure with SEO, analytics, global styles

### Performance Optimizations

**Critical Performance Targets**:
- Lighthouse Score: ≥90
- LCP (Largest Contentful Paint): <2.5s
- FID/INP: <100ms/<200ms
- CLS (Cumulative Layout Shift): <0.1
- Total Page Weight: <1MB
- Initial Load Time: <3s

**Optimization Strategies**:
- **Images**: WebP/AVIF with 80%+ size reduction, lazy loading, responsive srcset
- **Fonts**: Self-hosted Inter + Orbitron, subsetted for Latin (<40KB total)
- **JavaScript**: Zero JS by default, partial hydration only for interactive components (<50KB)
- **CSS**: Tailwind with purging, critical CSS inlined (<30KB)
- **Build**: Code splitting, vendor chunks, asset inlining (4KB threshold)

### Configuration Files

**Astro Config** (`astro.config.mjs`):
- Static site generation (`output: 'static'`)
- Image optimization with Sharp (AVIF → WebP → PNG/JPG)
- Manual chunk splitting (vendor chunks)
- Sitemap generation (changefreq: weekly)
- robots.txt generation
- Prefetching enabled (viewport strategy)

**Important Features**:
- Server: `localhost:3000` (dev), `localhost:4321` (preview)
- Experimental: Content layer enabled
- Compression: HTML minification enabled
- Security: Origin checking enabled

## Testing

### JSON Schema Validation

Schemas are defined in `scripts/schemas/`:
- `faction.schema.json` - Validates faction structure, required fields, hex colors
- `biome.schema.json` - Validates biome structure, nested objects

**Color Validation**:
- All faction colors must be valid hex (#RRGGBB format)
- WCAG AA contrast ratio validation between primary/secondary colors
- Uses `chroma-js` for color manipulation and validation

### Content Auditing

The audit system detects:
- **Critical**: Missing factions, invalid colors, structural changes
- **Warning**: Description changes (>85% similarity threshold)
- **Minor**: Formatting differences, whitespace changes

Reports are generated in three formats:
- `audit-report.json` - Machine-readable for CI/CD
- `audit-report.md` - Human-readable for PR comments
- `audit-report.html` - Visual diffs with diff2html

## CI/CD Integration

**Prebuild Hooks** (runs on `npm run build`):
```bash
npm run sync:wiki       # Fetch latest wiki content
npm run extract:tokens  # Extract design tokens
npm run audit          # Check for discrepancies
npm run validate       # Validate JSON schemas
```

**GitHub Actions** (`.github/workflows/deploy.yml`):
- Runs full pipeline before deployment
- Uploads audit report as artifact
- Posts audit report to PR comments
- Build fails if audit exits with code 1 (critical issues)

**Required Secrets**:
- `GITLAB_TOKEN` - Personal Access Token with `read_api` scope

## Development Notes

### Working with Wiki Content

**First-time setup**:
1. Obtain GitLab Personal Access Token (Settings → Access Tokens → `read_api` scope)
2. Add to `.env`: `GITLAB_TOKEN=your_token_here`
3. Get project ID from GitLab wiki settings
4. Add to `.env`: `GITLAB_PROJECT_ID=your_project_id`

**Cache Behavior**:
- Wiki content cached for 24 hours in `temp/wiki-raw/`
- Use `--force` flag to bypass cache: `node scripts/fetch-wiki-data.mjs --force`
- Cache directory is gitignored

**Manual Fields**:
- If a field in JSON has `_manual` prefix, it won't be overwritten by wiki sync
- Useful for website-specific data not in wiki

### Working with Factions

**Launch Status Values**:
- `"ea-launch"` - Available at Early Access launch (4 factions)
- `"expansion"` - Post-launch content (6 factions across 3 expansion windows)

**Launch Windows**:
- `"EA Launch"` - Initial 4 factions
- `"Month 3-6"` - First expansion (3 factions)
- `"Month 6-9"` - Second expansion (3 factions)

**Faction Count Validation**:
- System enforces exactly 10 factions
- 4 EA launch + 6 expansion = 10 total
- Validation fails if count ≠ 10

### Code Style

**Prettier Config** (`.prettierrc.json`):
- No semicolons (`semi: false`)
- Single quotes (`singleQuote: true`)
- 2 space indentation
- Trailing commas: ES5

**ESLint Config** (`.eslintrc.json`):
- TypeScript ESLint parser
- Astro plugin for `.astro` files
- JSX-a11y plugin for accessibility
- Max warnings: 0 (strict mode)

**Pre-commit Hooks** (via Husky):
- Auto-format with Prettier
- Auto-fix with ESLint
- Runs on staged files only

## Common Workflows

### Adding a New Faction

1. Add faction to GitLab wiki (Faction Marketing Profiles page)
2. Run sync: `npm run sync:wiki`
3. Validate: `npm run validate` (check for errors)
4. Audit: `npm run audit` (review changes)
5. Build: `npm run build` (test integration)

### Updating Design Tokens

1. Update Brand Guidelines wiki page with new colors/fonts
2. Run: `npm run extract:tokens`
3. Check generated files:
   - `src/styles/tokens/design-tokens.json`
   - `src/styles/design-tokens.css`
   - `tailwind.tokens.js`
4. Use in components via CSS variables or Tailwind classes

### Testing Performance

1. Build production: `npm run build`
2. Preview: `npm run preview`
3. Run Lighthouse: `npm run lighthouse`
4. Check reports in `.lighthouseci/` directory
5. Analyze bundle: `npm run analyze`

### Debugging Wiki Sync Issues

**401 Errors**: GitLab token invalid/expired
- Regenerate token in GitLab
- Update `.env` file

**404 Errors**: Wiki page not found
- Check wiki-config.json has correct page slugs
- Verify wiki pages exist in GitLab

**429 Errors**: Rate limit exceeded
- Script automatically retries with backoff
- Check `Retry-After` header delay

**Cache Issues**: Stale content
- Use `--force` flag: `npm run sync:wiki -- --force`
- Clear cache: `rm -rf temp/wiki-raw/`

## Special Considerations

### Performance Budget Enforcement

The build will warn/fail if:
- JavaScript bundle > 50KB
- CSS bundle > 30KB
- Individual images > 100KB (above fold)
- Total page weight > 1MB

### Accessibility Requirements

- WCAG AA compliance
- Contrast ratio validation for faction colors
- Semantic HTML structure
- Keyboard navigation support
- Screen reader optimization

### Browser Support

Targeting:
- Last 2 versions of major browsers
- Not IE 11
- Firefox ESR
- Modern mobile browsers (Safari, Chrome)
