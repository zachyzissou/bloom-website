# Wiki Synchronization Scripts

Automated pipeline to synchronize GitLab wiki content with the Bloom marketing website, ensuring accurate lore, faction data, and brand identity.

## Overview

This system fetches content from the official Bloom GitLab wiki and transforms it into structured JSON data consumed by the Astro website. All synchronization happens at **build time** - no runtime API calls or client-side data fetching.

**Key Benefits**:
- ✅ Single source of truth (wiki is authoritative)
- ✅ Automated content updates (no manual JSON editing)
- ✅ Data validation (JSON schemas enforce structure)
- ✅ Audit trail (discrepancy reports for review)
- ✅ Zero runtime overhead (all work done at build time)

## Prerequisites

### 1. GitLab Personal Access Token

Create a token with `read_api` scope:

1. Go to https://gitlab.slurpgg.net/-/user_settings/personal_access_tokens
2. Click "Add new token"
3. Name: "Bloom Website Wiki Sync"
4. Scopes: Check **read_api** only (no write permissions needed)
5. Expiration: Recommend 1 year for stability
6. Click "Create personal access token"
7. Copy the token immediately (format: `glpat-xxxxxxxxxxxxxxxxxxxx`)

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `GITLAB_TOKEN`: Your personal access token from step 1
- `GITLAB_PROJECT_ID`: Project ID for zachgonser/bloom (find in GitLab project settings)
- `WIKI_CACHE_MAX_AGE`: Cache duration in milliseconds (default: 86400000 = 24 hours)

## Scripts

### Core Pipeline Scripts

#### 1. `fetch-wiki-data.mjs`
Downloads raw markdown from GitLab wiki pages defined in `wiki-config.json`.

**Usage**:
```bash
node scripts/fetch-wiki-data.mjs         # Use cache if < 24 hours old
node scripts/fetch-wiki-data.mjs --force # Force fresh fetch, bypass cache
```

**Output**: Raw markdown files in `temp/wiki-raw/*.md`

**Features**:
- ✅ Retry logic (3 attempts, exponential backoff)
- ✅ Rate limiting (respects `Retry-After` header)
- ✅ File-based caching (24-hour TTL by default)
- ✅ Error handling (401/404/429/network errors)

---

#### 2. `transform-wiki-to-json.mjs`
Parses markdown files and transforms them into structured JSON data.

**Usage**:
```bash
node scripts/transform-wiki-to-json.mjs
```

**Input**: `temp/wiki-raw/*.md` (from fetch step)
**Output**: 
- `src/data/factions.json` (updated with wiki data)
- `src/data/wiki-metadata.json` (sync timestamps)
- `src/data/factions.json.bak` (backup of previous version)

**Features**:
- ✅ Markdown table parsing (remark + remark-gfm)
- ✅ AST traversal for structured data extraction
- ✅ Frontmatter parsing (gray-matter)
- ✅ Merge strategy (wiki takes precedence over existing data)
- ✅ `lastSynced` timestamps added to each faction

---

#### 3. `validate-data.mjs`
Validates JSON files against JSON schemas and checks data integrity.

**Usage**:
```bash
node scripts/validate-data.mjs
```

**Validates**:
- ✅ `src/data/factions.json` against `scripts/schemas/faction.schema.json`
- ✅ `src/data/biomes.json` against `scripts/schemas/biome.schema.json`
- ✅ Faction count === 10 (requirement from spec)
- ✅ Color format (hex codes: #RRGGBB)
- ✅ WCAG AA contrast ratios for faction colors

**Exit Codes**:
- `0` - All validation passed
- `1` - Validation failures detected (blocks build)

---

#### 4. `audit-content.mjs`
Compares wiki-transformed data with current website data, generating discrepancy reports.

**Usage**:
```bash
node scripts/audit-content.mjs
```

**Output**:
- `audit-report.json` (machine-readable)
- `audit-report.md` (human-readable for PR comments)
- `audit-report.html` (visual diff with syntax highlighting)

**Discrepancy Categories**:
- 🔴 **Critical**: Missing factions, incorrect colors, broken data structure
- 🟡 **Warning**: Description mismatches (≥0.85 similarity threshold)
- 🟢 **Minor**: Formatting differences, whitespace changes

**Exit Codes**:
- `0` - No critical issues (warnings/minor only)
- `1` - Critical issues detected (blocks build)

---

#### 5. `extract-design-tokens.mjs`
Extracts design tokens (colors, typography) from Brand Guidelines wiki page.

**Usage**:
```bash
node scripts/extract-design-tokens.mjs
npx style-dictionary build  # Generate CSS/Tailwind outputs
```

**Input**: `temp/wiki-raw/brand-guidelines.md`
**Output**:
- `src/styles/tokens/design-tokens.json` (Style Dictionary source)
- `src/styles/design-tokens.css` (CSS custom properties via Style Dictionary)
- `tailwind.tokens.js` (Tailwind config via Style Dictionary)

**Features**:
- ✅ CSS code block extraction (--color-*, font-family)
- ✅ Markdown table parsing (Token | Value | Usage)
- ✅ Hex code normalization (#RGB → #RRGGBB, lowercase)
- ✅ Style Dictionary format (DTCG spec: $type/$value)

---

### NPM Scripts

Convenient wrappers for common workflows:

```bash
# Full wiki synchronization pipeline
npm run sync:wiki
# Runs: fetch-wiki-data.mjs → transform-wiki-to-json.mjs

# Extract and generate design tokens
npm run extract:tokens
# Runs: extract-design-tokens.mjs → style-dictionary build

# Validate all JSON data files
npm run validate
# Runs: validate-data.mjs

# Generate audit reports
npm run audit
# Runs: audit-content.mjs

# Full build with all pre-build hooks
npm run build
# Runs: sync:wiki → extract:tokens → audit → validate → astro build

# Fast build (skip wiki sync, use cached data)
npm run build:skip-sync
# Runs: astro check → astro build

# Development with initial sync
npm run dev:sync
# Runs: sync:wiki → astro dev

# Development (fast, no sync)
npm run dev
# Runs: astro dev
```

## Cache System

**Location**: `temp/wiki-raw/*.md`
**TTL**: 24 hours (configurable via `WIKI_CACHE_MAX_AGE`)
**Behavior**:
- If cached files exist and are **< 24 hours old**: Use cache (fast)
- If cached files are **> 24 hours old**: Refetch from GitLab (slower)
- **Force bypass**: Use `--force` flag on fetch script

**Why caching matters**:
- Faster local development (no API calls on every build)
- Reduced GitLab API rate limit usage
- CI/CD reliability (less susceptible to network issues)

**Cache invalidation**:
```bash
# Manual cache clear
rm -rf temp/wiki-raw/

# Force fresh fetch
node scripts/fetch-wiki-data.mjs --force
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ GitLab Wiki (8 pages)                                           │
│ https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/*          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ fetch-wiki-data.mjs
                 │ (GitLab API via @gitbeaker/rest)
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ Raw Markdown Cache (temp/wiki-raw/*.md)                        │
│ • brand-guidelines.md                                           │
│ • faction-marketing-profiles.md                                │
│ • lore-*.md (4 files)                                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ transform-wiki-to-json.mjs
                 │ (remark + unified + remark-gfm)
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ Structured JSON Data (src/data/*.json)                         │
│ • factions.json (10 factions with lastSynced)                  │
│ • wiki-metadata.json (sync timestamp)                          │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ validate-data.mjs
                 │ (ajv + JSON schemas)
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ Validation Report (console output)                             │
│ ✅ Schema compliance                                            │
│ ✅ WCAG AA contrast ratios                                      │
│ ✅ Faction count === 10                                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ audit-content.mjs
                 │ (microdiff + string-similarity)
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ Audit Reports (audit-report.{json,md,html})                    │
│ • Critical discrepancies (blocks build)                        │
│ • Warnings (similarity < 0.85)                                 │
│ • Minor issues (formatting)                                    │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ astro build
                 │ (consumes src/data/*.json)
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│ Static Website (dist/)                                          │
│ • Accurate faction data from wiki                              │
│ • Canonical lore and timeline                                  │
│ • Official brand design tokens                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Error Handling

### 401 Unauthorized
**Cause**: Invalid or expired GitLab token
**Fix**: 
1. Check `.env` has correct `GITLAB_TOKEN`
2. Verify token hasn't expired in GitLab settings
3. Regenerate token if needed

### 404 Not Found
**Cause**: Wiki page doesn't exist or slug is incorrect
**Fix**:
1. Check `scripts/wiki-config.json` has correct slugs
2. Verify pages exist in GitLab wiki
3. Update slugs if wiki pages were renamed

### 429 Rate Limited
**Cause**: Too many API requests
**Fix**:
- Script automatically retries with `Retry-After` delay
- Use cache to reduce API calls (`temp/` directory)
- Increase `WIKI_CACHE_MAX_AGE` for longer cache

### Network Errors
**Cause**: Connection issues, timeouts
**Fix**:
- Script retries 3 times with exponential backoff
- Check network connectivity
- Verify GitLab instance is accessible

## CI/CD Integration

### GitHub Actions Setup

1. Add GitLab token to GitHub Secrets:
   - Go to Repository → Settings → Secrets → Actions
   - Add secret: `GITLAB_TOKEN` (same value as local `.env`)

2. Workflow runs automatically on push to `main`:
   - Fetches wiki data
   - Transforms to JSON
   - Validates data
   - Generates audit reports
   - Uploads reports as artifacts
   - Fails build if critical discrepancies found

3. PR comments show audit report summary:
   - Critical issues highlighted in red
   - Warnings in yellow
   - Minor issues in gray

## Troubleshooting

### "Faction count is X, expected 10"
**Cause**: Wiki has incorrect number of factions
**Fix**: Contact content team to add missing factions to wiki

### "Color validation failed: #RGB format"
**Cause**: Faction colors not in hex format
**Fix**: Update wiki with valid hex codes (#RRGGBB)

### "WCAG AA contrast ratio failed"
**Cause**: Faction colors don't meet accessibility standards
**Fix**: Adjust colors in wiki to pass contrast requirements

### "Transform script failed: table not found"
**Cause**: Wiki page structure changed (no markdown table)
**Fix**: Update `transform-wiki-to-json.mjs` to handle new structure

## Files & Directories

```
scripts/
├── README.md                     # This file
├── wiki-config.json              # Wiki page URLs and metadata
├── schemas/                      # JSON schemas
│   ├── faction.schema.json       # Faction data validation
│   └── biome.schema.json         # Biome data validation
├── fetch-wiki-data.mjs           # GitLab API fetch script
├── transform-wiki-to-json.mjs    # Markdown → JSON parser
├── extract-design-tokens.mjs     # Design token extractor
├── validate-data.mjs             # JSON schema validator
├── audit-content.mjs             # Discrepancy reporter
└── test-pipeline.mjs             # Integration test

temp/wiki-raw/                    # Cached markdown (ignored by git)
├── brand-guidelines.md
├── marketing-strategy.md
├── faction-marketing-profiles.md
├── factions-index.md
├── lore-index.md
├── lore-characters.md
├── lore-technology.md
└── lore-timeline.md

src/data/                         # Output JSON files
├── factions.json                 # Updated by transform script
├── factions.json.bak             # Backup before transformation
└── wiki-metadata.json            # Sync timestamps

audit-report.json                 # Machine-readable report
audit-report.md                   # PR comment format
audit-report.html                 # Visual diff (open in browser)
```

## Development Workflow

### First Time Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env from template
cp .env.example .env

# 3. Add your GitLab token to .env
# (follow instructions in .env.example)

# 4. Test wiki fetch
node scripts/fetch-wiki-data.mjs

# 5. Start development with sync
npm run dev:sync
```

### Daily Development
```bash
# Fast iteration (uses cached wiki data)
npm run dev

# Force wiki refresh if content changed
npm run sync:wiki && npm run dev
```

### Before Committing
```bash
# Run full validation
npm run validate
npm run audit

# Build to ensure no errors
npm run build
```

## Performance Impact

**Build Time**:
- Fetch 8 wiki pages: ~2-5 seconds (cached: 0 seconds)
- Transform markdown: ~1 second
- Validation: <1 second
- Total added: **~3-6 seconds per build**

**Runtime Impact**:
- Zero (all work happens at build time)
- Output is static JSON files
- No API calls from browser
- No client-side processing

**Optimization**:
- ✅ File-based caching (24-hour TTL)
- ✅ `build:skip-sync` for fast iteration
- ✅ `--force` flag for manual refresh
- ✅ Parallel API requests (Promise.all)

## Maintenance

### Updating Wiki Page List

Edit `scripts/wiki-config.json`:
```json
{
  "wikiPages": [
    {
      "slug": "New/Page_Slug",
      "url": "https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/New/Page_Slug",
      "purpose": "Description of what data this page contains",
      "outputPath": "temp/wiki-raw/new-page.md",
      "dataType": "content"
    }
  ]
}
```

### Updating JSON Schemas

Modify `scripts/schemas/*.schema.json` to add/remove fields:
```json
{
  "required": ["id", "name", "newField"],
  "properties": {
    "newField": {
      "type": "string",
      "description": "New required field"
    }
  }
}
```

## Support

**Issues**: https://github.com/your-org/bloom-website/issues
**Documentation**: See `Context/Features/001-WikiAlignmentUpdate/` for detailed spec and tech docs
**Contact**: Reach out to the Bloom development team

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-02  
**Feature**: Wiki Alignment Update (001-WikiAlignmentUpdate)
