# Technical Planning: Wiki Alignment Update

**Created**: 2025-11-02
**Status**: Planning Complete
**Prerequisites**: Completed business specification (Spec.md)

---

## Research & Analysis

### Research Scope

This research phase investigated five critical technical areas for implementing automated wiki-to-website content synchronization:

1. **Codebase Integration**: Analysis of existing Astro architecture, component patterns, and data layer to determine integration points and implementation complexity
2. **GitLab Wiki API Access**: Research into authentication methods, API capabilities, and build-time data fetching strategies for private GitLab instances
3. **Design Language Extraction**: Investigation of markdown parsing libraries and design token extraction techniques for converting wiki specifications into CSS
4. **Content Audit Automation**: Evaluation of comparison algorithms and report generation tools for identifying discrepancies between wiki and website content
5. **Astro Framework Patterns**: Study of Astro 4.x best practices for build-time operations, performance optimization, and TypeScript integration

### Key Findings Summary

**Primary Technology Decisions**:
- **API Access**: GitLab REST API with @gitbeaker/rest package using Personal Access Tokens (read_api scope)
- **Markdown Parsing**: Remark + Unified ecosystem for AST-based extraction with remark-gfm for table support
- **Content Comparison**: microdiff for object diffing (fastest performance), string-similarity for fuzzy text matching
- **Design Tokens**: Style Dictionary for transforming extracted specs into CSS variables and Tailwind config
- **Architecture Approach**: Plain JSON files with build-time scripts (not Content Collections) for maximum control and simplicity

**Critical Constraints Identified**:
- GitLab API requires authentication (blocker - needs token before implementation)
- Image-based design specs need semi-automated extraction with manual validation
- Build time will increase 5-15 seconds per wiki sync (mitigated with caching)
- Wiki format consistency is critical for automated transformation success

### Codebase Integration Analysis

**Existing Architecture Patterns**:
- Astro component-based architecture with TypeScript interfaces and scoped CSS
- Path aliases configured (`@/*`, `@components/*`, `@data/*`)
- Performance-focused: GPU-accelerated transforms, lazy loading, responsive images (OptimizedImage.astro)
- Existing optimization scripts in `/scripts/` (optimize-images.sh, optimize-build.sh) demonstrate bash pattern for build automation

**Current Data Layer**:
- **Location**: `/src/data/*.json` (factions.json, biomes.json, features.json, roadmap.json)
- **Structure**: Well-defined JSON schemas with 10 factions (4 EA launch, 6 expansion), 12 biomes
- **Status**: Data files exist but NOT YET consumed by UI components (prepared but not integrated)
- **No validation**: Missing schema versions, lastModified timestamps, or integrity checks

**Integration Requirements**:
- **Files to Modify** (7): `/src/data/*.json` (add metadata), `package.json` (new scripts), `astro.config.mjs` (optional hooks), `.github/workflows/*.yml` (CI integration)
- **New Files to Create** (12): `scripts/fetch-wiki-data.mjs`, `scripts/transform-wiki-to-json.mjs`, `scripts/validate-data.mjs`, `scripts/schemas/*.schema.json`, `scripts/wiki-config.json`, `/src/components/BiomeCard.astro`, faction/biome pages (optional Phase 5)
- **Data Flow**: GitLab Wiki API → fetch script → raw markdown → transform script → validate → update JSON → Astro build → static HTML

**Implementation Considerations**:
- **Consistency**: Must follow existing bash script patterns (logging, error handling from optimize-*.sh)
- **Potential Conflicts**: Manual JSON edits vs wiki updates (need merge strategy or wiki-as-truth policy)
- **Build Performance**: Wiki sync adds ~5-15s to build (mitigate with caching, skip in dev mode)

### Technology Research

#### @gitbeaker/rest (GitLab API Client)
**Version**: v40.x+
**Documentation**: https://github.com/jdalrymple/gitbeaker, https://docs.gitlab.com/api/wikis/
**Research Date**: 2025-11-02

**Key Capabilities**:
- Full TypeScript support with comprehensive type definitions
- Covers GitLab API up to version 16.5, native fetch-based (Node.js, Deno, Bun, browsers)
- Supports wiki page listing (`Wikis.all()`), individual page retrieval (`Wikis.show()`), pagination control
- Built-in rate limit handling and retry logic support

**Authentication**: Personal Access Token with `read_api` scope (recommended) or project access tokens
**Rate Limits**: Self-managed defaults: 7,200 requests per hour per user (configurable)

**Decision Rationale**: Actively maintained (legacy `gitlab` npm package is 6+ years old), complete TypeScript support, works in build-time Node.js environment

#### remark + unified (Markdown Parsing)
**Version**: remark@15.0.1, unified@11.0.4, remark-gfm@4.0.0
**Documentation**: https://remark.js.org/, https://unifiedjs.com/, https://www.npmjs.com/package/remark-gfm

**Key Capabilities**:
- Industry standard AST-based markdown processor with extensible plugin architecture
- remark-gfm adds GitHub Flavored Markdown (tables, strikethrough, task lists)
- unist-util-visit enables powerful AST traversal for extracting structured data
- mdast-util-to-string extracts plain text from nodes

**Use Cases**: Parse wiki markdown, extract design specs from code blocks/tables, handle frontmatter with gray-matter

**Decision Rationale**: Battle-tested ecosystem, superior to markdown-it/marked for complex extraction needs, TypeScript-friendly

#### microdiff + string-similarity (Content Comparison)
**Versions**: microdiff@1.3.2, string-similarity@4.0.4
**Documentation**: https://github.com/AsyncBanana/microdiff, https://www.npmjs.com/package/string-similarity

**microdiff Performance**: 100% baseline (fastest), handles circular references, <1KB bundle, zero dependencies
**string-similarity Algorithm**: Dice's Coefficient (superior to Levenshtein for finding similarity)

**Use Cases**:
- microdiff: Deep object comparison for JSON data structures (faction/biome objects)
- string-similarity: Fuzzy matching for descriptions with minor wording changes (>0.85 similarity = acceptable)

**Decision Rationale**: microdiff is performance leader (alternatives 149-1565% slower), string-similarity provides human-perception-accurate text matching

#### style-dictionary (Design Token Generation)
**Version**: v4.0.1
**Documentation**: https://www.npmjs.com/package/style-dictionary

**Key Capabilities**:
- Multi-format output (CSS custom properties, SCSS, JSON, Tailwind config, iOS, Android)
- Automatic transforms (unit conversion, color manipulation, naming conventions)
- Validation and schema support

**Output Formats**:
- CSS: `:root { --color-primary: #007bff; }`
- Tailwind: `module.exports = { colors: { primary: '#007bff' } }`

**Decision Rationale**: Industry standard for design tokens, battle-tested at scale, supports all required output formats

### API & Service Research

#### GitLab Wiki API (gitlab.slurpgg.net)
**Documentation**: https://docs.gitlab.com/api/wikis/
**API Version**: v4 (GitLab REST API)
**Research Date**: 2025-11-02

**Key Endpoints**:
- `GET /api/v4/projects/:id/wikis` - List all wiki pages
- `GET /api/v4/projects/:id/wikis/:slug` - Retrieve specific page
- **Response Format**: JSON with `content` (UTF-8 markdown), `format`, `slug`, `title` fields

**Authentication**: Personal Access Token via `PRIVATE-TOKEN` header (read_api scope required)

**Rate Limits**: Self-managed GitLab defaults to 7,200 requests/hour per user (configurable by admin)

**Fallback Strategy**: If API unavailable, clone wiki as Git repository (https://gitlab.slurpgg.net/{namespace}/{project}.wiki.git)

**Decision Rationale**: Official GitLab API provides structured access to wiki content, better than web scraping, with fallback to Git clone for resilience

### Architecture Pattern Research

#### Build-Time Data Fetching (Astro Pattern)
**Research Sources**: https://docs.astro.build/en/guides/data-fetching/
**Research Date**: 2025-11-02

**Approach**:
- Fetch external data during build process using global `fetch()` in component frontmatter or pre-build scripts
- Data fetched once at build time, not runtime (static site)
- Use npm `prebuild` hook to run fetch scripts before Astro build

**Benefits**:
- Zero runtime overhead (no client-side data fetching)
- Data validated at build time, errors caught before deployment
- Perfect for static content that updates infrequently

**Implementation**:
```javascript
// scripts/fetch-wiki-data.mjs
const response = await fetch('https://gitlab.slurpgg.net/api/v4/projects/ID/wikis');
const pages = await response.json();
await fs.writeFile('src/data/factions.json', JSON.stringify(pages));
```

**Decision Rationale**: Aligns perfectly with Astro's static site architecture, no runtime performance impact

#### Plain JSON vs Content Collections (Astro)
**Research Sources**: https://docs.astro.build/en/guides/content-collections/
**Research Date**: 2025-11-02

**Decision**: Use plain JSON files, not Content Collections

**Rationale**:
- External API is data source (wiki), not local files
- Simple JSON structure doesn't require Markdown rendering
- Build script provides better control over API integration
- Content Collections add complexity without benefits for this use case

**Pattern**: Store generated JSON in `src/data/` and import directly in components

### Research-Informed Recommendations

**Primary Technology Stack**:
1. **@gitbeaker/rest**: GitLab API client for wiki access
2. **remark + remark-gfm**: Markdown parsing and table extraction
3. **microdiff + string-similarity**: Content comparison and audit
4. **style-dictionary**: Design token generation
5. **diff2html**: Visual diff reporting for audit results

**Architecture Approach**: Build-time pipeline with three phases:
1. **Fetch**: GitLab API → raw wiki markdown
2. **Transform**: Markdown → validated JSON with design tokens
3. **Audit**: Compare wiki vs website, generate reports

**Key Constraints Identified**:
- GitLab token required before implementation (blocker)
- Build time +5-15s per sync (acceptable, cache to mitigate)
- Wiki format must be consistent (risk if manually edited)
- Image-based specs need manual extraction (semi-automated)

---

## Technical Architecture

> **Note**: This section references the detailed research findings above to avoid duplication.

### System Overview

**High-Level Architecture**: Three-phase build-time pipeline that fetches wiki content via GitLab API, transforms markdown to JSON with design token extraction, and audits for discrepancies before Astro build

**Core Components**:
- **Wiki Fetcher** (`scripts/fetch-wiki-data.mjs`): @gitbeaker/rest client fetches wiki pages, handles auth/retries, outputs raw markdown
- **Content Transformer** (`scripts/transform-wiki-to-json.mjs`): remark parser extracts structured data, validates schema, updates JSON files
- **Design Token Extractor** (within transformer): Parses color/typography specs, generates CSS variables via style-dictionary
- **Content Auditor** (`scripts/audit-content.mjs`): microdiff compares wiki vs website data, generates multi-format reports with diff2html
- **Validation Layer** (`scripts/validate-data.mjs`): JSON schema validation, WCAG contrast checks, integrity verification

**Data Flow**:
```
GitLab Wiki API (gitlab.slurpgg.net)
    ↓ [fetch-wiki-data.mjs using @gitbeaker/rest]
Raw Markdown + Metadata
    ↓ [transform-wiki-to-json.mjs using remark/unified]
Structured JSON + Design Tokens
    ↓ [validate-data.mjs using ajv schemas]
Validated src/data/*.json + design tokens
    ↓ [audit-content.mjs using microdiff/string-similarity]
Audit Reports (JSON/MD/HTML)
    ↓ [Astro build process]
Static HTML Site (dist/)
```

### Web Implementation Details

#### Build Scripts Architecture

**Script Organization** (all in `scripts/` directory):

1. **fetch-wiki-data.mjs** (Primary wiki fetcher):
   ```javascript
   // Responsibilities:
   - Initialize @gitbeaker/rest client with Personal Access Token
   - Fetch wiki page list from 8 specified URLs
   - Retrieve full content for each page
   - Implement retry logic (3 attempts, exponential backoff)
   - Output raw markdown to temp directory
   - Log metadata (timestamp, page count, sync status)
   ```

2. **transform-wiki-to-json.mjs** (Content transformer):
   ```javascript
   // Responsibilities:
   - Parse markdown with remark + remark-gfm
   - Extract faction/biome tables using unist-util-visit
   - Map wiki structure → existing JSON schema
   - Extract design tokens (colors, typography) from Brand Guidelines
   - Generate style-dictionary config from extracted tokens
   - Validate transformed data against schemas
   - Update src/data/*.json files
   ```

3. **extract-design-tokens.mjs** (Design system generator):
   ```javascript
   // Responsibilities:
   - Parse Brand Guidelines markdown for design specs
   - Extract color palette (hex codes from code blocks/tables)
   - Extract typography system (font families, sizes, weights)
   - Generate style-dictionary JSON format
   - Build CSS custom properties (src/styles/design-tokens.css)
   - Build Tailwind config extension (tailwind.tokens.js)
   ```

4. **audit-content.mjs** (Discrepancy detector):
   ```javascript
   // Responsibilities:
   - Load wiki-transformed data + current website JSON
   - Compare with microdiff for object differences
   - Fuzzy match descriptions with string-similarity (>0.85 threshold)
   - Categorize severity (critical/warning/minor)
   - Generate JSON/Markdown/HTML reports with diff2html
   - Exit code 1 if critical discrepancies (blocks build)
   ```

5. **validate-data.mjs** (Schema validator):
   ```javascript
   // Responsibilities:
   - Validate JSON against ajv schemas
   - Check WCAG contrast ratios (colors)
   - Verify faction count === 10
   - Check required fields presence
   - Exit code 1 on validation failures
   ```

#### Data Layer Design

**Storage Strategy**: Plain JSON files in `src/data/` (no Content Collections)

**Data Schema**:
```typescript
// src/types/wiki.ts
interface Faction {
  id: string;              // e.g., "FCT_DIR"
  name: string;            // "Sky Bastion Directorate"
  shortName: string;       // "Directorate"
  role: string;            // "tank"
  colors: {
    primary: string;       // "#001F3F" (validated hex)
    secondary: string;
    accent: string;
  };
  description: string;     // Lore description
  abilities: Ability[];
  launchStatus: "ea-launch" | "expansion";
  lastSynced?: Date;       // Added by transform script
}

interface DesignTokens {
  color: Record<string, { value: string; type: "color" }>;
  typography: {
    family: Record<string, { value: string; type: "fontFamily" }>;
    size: Record<string, { value: string; type: "fontSize" }>;
  };
}
```

**Data Access Pattern**:
```astro
---
// Astro component imports JSON directly at build time
import factionsData from '@/data/factions.json';
const factions = factionsData.factions.filter(f => f.launchStatus === 'ea-launch');
---
{factions.map(faction => <FactionCard {...faction} />)}
```

**Decision Rationale**:
- Plain JSON simpler than Content Collections for API-sourced data
- Type-safe with TypeScript interfaces
- Zero runtime overhead (static imports)
- Easy to validate and audit

#### Build Integration Strategy

**Package.json Scripts**:
```json
{
  "scripts": {
    "sync:wiki": "node scripts/fetch-wiki-data.mjs && node scripts/transform-wiki-to-json.mjs",
    "extract:tokens": "node scripts/extract-design-tokens.mjs && style-dictionary build",
    "audit": "node scripts/audit-content.mjs",
    "validate": "node scripts/validate-data.mjs",
    "prebuild": "npm run sync:wiki && npm run extract:tokens && npm run audit && npm run validate",
    "build": "astro check && astro build",
    "build:skip-sync": "astro check && astro build"
  }
}
```

**Environment Variables** (`.env`):
```bash
GITLAB_TOKEN=glpat-xxxxxxxxxxxxxxxxxxxx
GITLAB_PROJECT_ID=your-project-id
WIKI_CACHE_MAX_AGE=86400000  # 24 hours
```

**Dependency Management**:
```json
{
  "dependencies": {
    "@gitbeaker/rest": "^40.0.0",
    "remark": "^15.0.1",
    "remark-parse": "^11.0.0",
    "remark-gfm": "^4.0.0",
    "unified": "^11.0.4",
    "unist-util-visit": "^5.0.0",
    "microdiff": "^1.3.2",
    "string-similarity": "^4.0.4",
    "style-dictionary": "^4.0.1",
    "diff2html": "^3.4.47",
    "ajv": "^8.12.0",
    "chroma-js": "^2.4.2"
  }
}
```

#### Platform-Specific Considerations

**Web Performance**:
- **Lighthouse Score**: Maintain ≥90 (current performance budget)
- **Page Weight**: Stay <1MB total (wiki sync adds ~50-100KB JSON)
- **Build Time Impact**: +5-15s per sync (acceptable, cache mitigates)
- **Zero Runtime Impact**: All processing at build time

**Browser Compatibility**:
- **Target**: Modern browsers (Chrome, Firefox, Safari, Edge last 2 years)
- **CSS Variables**: Widely supported (no polyfills needed)
- **JavaScript**: ES2020+ (Astro bundles appropriately)

**Accessibility Compliance** (WCAG AA):
- **Color Validation**: Automated contrast ratio checking in validate-data.mjs
- **Semantic HTML**: Maintained by Astro components
- **Keyboard Navigation**: Existing patterns preserved

### Implementation Complexity Assessment

**Complexity Level**: **Complex** (due to schema transformation logic and multi-phase pipeline)

**Implementation Challenges**:
- **Setup and Infrastructure** (MEDIUM): Obtaining GitLab Personal Access Token, configuring environment variables, establishing wiki content format standards
- **Core Implementation** (HIGH): Transform script with markdown → JSON schema mapping is most complex component (300-400 LOC estimated)
- **Integration Points** (LOW): Astro build process integration is straightforward (npm prebuild hook)
- **Testing Requirements** (MEDIUM): Need unit tests for comparison logic, integration tests for full pipeline, manual QA for design token extraction

**Risk Assessment**:
- **High Risk Areas**:
  - Schema transformation complexity (wiki format → JSON structure mapping)
  - Wiki format inconsistency if manually edited outside standards
  - Image-based design specs require semi-automated extraction (can't fully automate)
- **Mitigation Strategies**:
  - Create strict wiki content templates with examples
  - Implement comprehensive validation with clear error messages
  - Build hybrid automated/manual workflow for image-based specs
  - Extensive testing with sample wiki data before production use
- **Unknowns**:
  - Exact wiki markdown structure (need sample pages to finalize parsing logic)
  - GitLab API reliability for build-time fetching (fallback to Git clone if needed)
  - Frequency of wiki updates (determines caching strategy importance)

**Dependency Analysis**:
- **External Dependencies**: 9 npm packages (@gitbeaker/rest, remark ecosystem, microdiff, string-similarity, style-dictionary, diff2html, ajv, chroma-js)
- **Internal Dependencies**: Minimal - only updates to existing JSON files and addition of design token CSS
- **Breaking Changes**: None - feature is additive, doesn't modify existing functionality

**Testing Strategy**:
- **Unit Tests**: Test individual functions (color extraction, schema validation, comparison logic) with Chai/Mocha
- **Integration Tests**: End-to-end pipeline test with mock wiki data → validate JSON output
- **Manual Testing**: Visual review of generated audit reports, design token CSS, transformed JSON against wiki source

### Technical Clarifications

**Resolved Prerequisites**:
- Wiki access method: GitLab REST API with Personal Access Token (read_api scope)
- Data storage: Plain JSON files in src/data/ (not Content Collections)
- Build integration: npm prebuild hook with sequential script execution
- Design token format: style-dictionary JSON → CSS custom properties + Tailwind config

**No unresolved clarifications** - research phase addressed all technical uncertainties

---

**Next Phase**: After this technical planning is approved, proceed to `/ctxk:plan:3-steps` for implementation task breakdown.
