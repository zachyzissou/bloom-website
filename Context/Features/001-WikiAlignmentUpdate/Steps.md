# Implementation Steps: Wiki Alignment Update

**Created**: 2025-11-02
**Status**: Ready for Implementation
**Prerequisites**: Completed Spec.md and Tech.md

---

## 🚨 CRITICAL: This File is Your Progress Tracker

**This Steps.md file serves as the authoritative source of truth for implementation progress across all development sessions.**

### Key Principles
- **Token limits are irrelevant** - Progress is tracked here, sessions are resumable
- **Never rush or take shortcuts** - Each step deserves proper attention and time
- **Session boundaries don't matter** - User can resume where this file shows progress
- **Steps.md is the real todo list** - Even if AI uses TodoWrite during a session, THIS file is what persists
- **Quality over speed** - Thoroughness is mandatory, optimization for token limits is forbidden
- **Check off progress here** - Mark tasks as complete in this file as they're finished

### How This Works
1. Each task has a checkbox: `- [ ] **S001** Task description`
2. As tasks complete, they're marked: `- [x] **S001** Task description`
3. AI ignores token limit concerns and works methodically through steps
4. If context usage gets high (>80%), AI suggests user runs `/compact` before continuing
5. If session ends: User starts new session and resumes (this file has all progress)
6. Take the time needed for each step - there's no rush to finish in one session

---

## Implementation Overview

**Total Tasks**: 35 (across 7 phases)
**Estimated Complexity**: Complex
**Critical Path**: S001 → S002 → S003 → S011 → S021 → S031
**Parallel Opportunities**: Marked with [P] can run concurrently

**Technology Stack**:
- @gitbeaker/rest (GitLab API client)
- remark + remark-gfm (Markdown parsing)
- microdiff + string-similarity (Content comparison)
- style-dictionary (Design token generation)
- ajv (JSON schema validation)
- diff2html (Visual diff reporting)

---

## Phase 1: Project Setup & Dependencies (S001-S005)

- [ ] **S001** Create environment configuration file `.env.example` with required variables
  - Add `GITLAB_TOKEN=your_token_here` (placeholder)
  - Add `GITLAB_PROJECT_ID=your_project_id` (placeholder)
  - Add `WIKI_CACHE_MAX_AGE=86400000` (24 hours default)
  - Document token creation process in comments

- [ ] **S002** Install npm dependencies for wiki integration
  - Run: `npm install --save-dev @gitbeaker/rest@^40.0.0`
  - Run: `npm install --save-dev remark@^15.0.1 remark-parse@^11.0.0 remark-gfm@^4.0.0`
  - Run: `npm install --save-dev unified@^11.0.4 unist-util-visit@^5.0.0`
  - Run: `npm install --save-dev microdiff@^1.3.2 string-similarity@^4.0.4`
  - Run: `npm install --save-dev style-dictionary@^4.0.1 diff2html@^3.4.47`
  - Run: `npm install --save-dev ajv@^8.12.0 chroma-js@^2.4.2 gray-matter@^4.0.3`
  - Verify: `npm list` shows all packages installed

- [ ] **S003** Create `/scripts/` directory structure and config files
  - Create `scripts/wiki-config.json` with wiki source URLs (8 pages from spec)
  - Create `scripts/schemas/` directory
  - Create `.gitignore` entry for `temp/` (wiki cache directory)
  - Document: Add `scripts/README.md` explaining wiki sync workflow

- [ ] **S004** [P] Create TypeScript type definitions for wiki data
  - Create `src/types/wiki.ts` with Faction, Biome, DesignTokens interfaces
  - Match existing JSON schema structures from src/data/*.json
  - Add `lastSynced?:  Date` field for sync tracking
  - Export all interfaces for component use

- [ ] **S005** [P] Update package.json with new build scripts
  - Add `"sync:wiki": "node scripts/fetch-wiki-data.mjs && node scripts/transform-wiki-to-json.mjs"`
  - Add `"extract:tokens": "node scripts/extract-design-tokens.mjs && style-dictionary build"`
  - Add `"audit": "node scripts/audit-content.mjs"`
  - Add `"validate": "node scripts/validate-data.mjs"`
  - Add `"prebuild": "npm run sync:wiki && npm run extract:tokens && npm run audit && npm run validate"`
  - Add `"build:skip-sync": "astro check && astro build"` (for dev speed)

---

## Phase 2: JSON Schema Validation (S006-S010)

- [ ] **S006** Create JSON schema for Faction validation (`scripts/schemas/faction.schema.json`)
  - Define schema matching existing factions.json structure
  - Required fields: id, name, role, colors (primary, secondary, accent), launchStatus
  - Validate color fields as hex color format (#RRGGBB)
  - Add optional lastSynced field

- [ ] **S007** [P] Create JSON schema for Biome validation (`scripts/schemas/biome.schema.json`)
  - Define schema matching existing biomes.json structure
  - Required fields: id, name, threatLevel, factionPresence array
  - Validate nested visualCharacteristics object

- [ ] **S008** Create validation script (`scripts/validate-data.mjs`)
  - Import ajv, chroma-js for color validation
  - Load faction and biome schemas
  - Validate src/data/factions.json against faction schema
  - Validate src/data/biomes.json against biome schema
  - Check WCAG AA contrast ratios for faction colors
  - Verify faction count === 10
  - Exit code 1 on validation failures, 0 on success
  - Log validation results to console

- [ ] **S009** [P] Create style-dictionary configuration (`style-dictionary.config.js`)
  - Define source paths for design tokens
  - Configure CSS output platform (src/styles/design-tokens.css)
  - Configure Tailwind platform (tailwind.tokens.js)
  - Set up transforms for color and typography tokens

- [ ] **S010** Test validation with existing JSON files
  - Run: `node scripts/validate-data.mjs`
  - Verify current files pass validation (they should)
  - If failures: Document issues for later fixing

---

## Phase 3: Wiki Fetching Implementation (S011-S015)

- [ ] **S011** Create wiki fetch script (`scripts/fetch-wiki-data.mjs`)
  - Import @gitbeaker/rest Gitlab class
  - Load GITLAB_TOKEN and GITLAB_PROJECT_ID from env
  - Initialize Gitlab API client with token authentication
  - Implement retry logic function (3 attempts, exponential backoff)
  - Create temp/ directory if doesn't exist

- [ ] **S012** Implement wiki page fetching logic in fetch-wiki-data.mjs
  - Fetch all 8 wiki pages by slug (from wiki-config.json URLs)
  - Use Wikis.show() for each page to get full content
  - Handle pagination if wiki has >100 pages
  - Save raw markdown to `temp/wiki-raw/{page-slug}.md`
  - Log: timestamp, page count, sync status

- [ ] **S013** Add error handling to fetch-wiki-data.mjs
  - Catch 401 errors: "GitLab token invalid or expired"
  - Catch 404 errors: "Wiki page not found" (log and continue)
  - Catch 429 errors: Retry with Retry-After header delay
  - Catch network errors: Log and fail gracefully
  - If all fetches fail: Exit code 1

- [ ] **S014** [P] Create wiki content cache mechanism
  - Check if temp/wiki-raw/*.md files exist and are <24h old
  - If cache fresh: Skip fetch, use cached files
  - Add `--force` flag to bypass cache
  - Document cache behavior in scripts/README.md

- [ ] **S015** Test wiki fetching script
  - **MANUAL**: User must obtain GitLab Personal Access Token (read_api scope)
  - **MANUAL**: User adds token to `.env` file
  - Run: `node scripts/fetch-wiki-data.mjs`
  - Verify: temp/wiki-raw/ contains 8 .md files
  - Check: Log output shows successful fetches

---

## Phase 4: Markdown Transformation (S016-S020)

- [ ] **S016** Create transformation script (`scripts/transform-wiki-to-json.mjs`)
  - Import remark, remark-parse, remark-gfm, unified
  - Import unist-util-visit for AST traversal
  - Import gray-matter for frontmatter parsing
  - Load existing src/data/factions.json as baseline

- [ ] **S017** Implement markdown table parser for faction data
  - Parse Faction Marketing Profiles wiki page
  - Extract faction tables using unist-util-visit on 'table' nodes
  - Map columns: Name → name, Role → role, Colors → colors object
  - Handle missing fields gracefully with defaults or warnings

- [ ] **S018** Implement faction data transformation logic
  - Match wiki factions to existing JSON by name/ID
  - Merge wiki data with existing data (wiki takes precedence)
  - Preserve manual-only fields (if any marked with _manual prefix)
  - Add lastSynced timestamp to each faction
  - Validate transformed data against faction schema before writing

- [ ] **S019** Write transformed data to JSON files
  - Backup existing src/data/factions.json to src/data/factions.json.bak
  - Write updated factions to src/data/factions.json with pretty formatting (2 spaces)
  - Update src/data/wiki-metadata.json with sync info (timestamp, factionCount)
  - Log: Number of factions updated, changes made

- [ ] **S020** Test transformation script
  - Run: `node scripts/transform-wiki-to-json.mjs`
  - Verify: src/data/factions.json updated with wiki data
  - Check: Faction count is 10
  - Verify: lastSynced timestamps added
  - Run validation: `node scripts/validate-data.mjs` (should pass)

---

## Phase 5: Design Token Extraction (S021-S025)

- [ ] **S021** Create design token extraction script (`scripts/extract-design-tokens.mjs`)
  - Import remark, unified for markdown parsing
  - Load Brand Guidelines wiki page from temp/wiki-raw/
  - Initialize empty design tokens structure

- [ ] **S022** Implement color palette extraction
  - Search for code blocks with lang='css' or lang='scss'
  - Extract CSS custom properties (--color-*: #HEX;)
  - Parse markdown tables with columns: Token | Value | Usage
  - Normalize hex codes (#RGB → #RRGGBB, lowercase)
  - Store in style-dictionary format: `{ color: { primary: { value: "#...", type: "color" } } }`

- [ ] **S023** [P] Implement typography extraction
  - Extract font-family declarations from code blocks
  - Parse font-size scale from tables or lists
  - Extract font-weight specifications
  - Store in style-dictionary format with type: "fontFamily", "fontSize"

- [ ] **S024** Generate style-dictionary output
  - Write extracted tokens to `src/styles/tokens/design-tokens.json`
  - Run: `npx style-dictionary build`
  - Verify: `src/styles/design-tokens.css` created with :root variables
  - Verify: `tailwind.tokens.js` created with color/font objects

- [ ] **S025** Test design token extraction
  - Run: `node scripts/extract-design-tokens.mjs`
  - Check: design-tokens.css contains --color-* variables
  - **MANUAL**: If Brand Guidelines has image-based specs, note for manual extraction
  - Validate: Colors match hex format, fonts are valid CSS

---

## Phase 6: Content Audit Implementation (S026-S030)

- [ ] **S026** Create audit script (`scripts/audit-content.mjs`)
  - Import microdiff, string-similarity
  - Import diff2html for report generation
  - Load wiki-transformed data (from transform step)
  - Load current website data (src/data/factions.json before transformation)

- [ ] **S027** Implement comparison logic
  - Compare faction counts (wiki vs website)
  - For each faction: Use microdiff for object differences
  - For descriptions: Use string-similarity with 0.85 threshold
  - For colors: Exact hex match (normalized)
  - Categorize discrepancies: critical (colors, missing factions), warning (descriptions), minor (formatting)

- [ ] **S028** Generate audit reports
  - Create AuditReportGenerator class with toJSON(), toMarkdown(), toHTML() methods
  - JSON report: Save to audit-report.json (machine-readable)
  - Markdown report: Save to audit-report.md (PR comments)
  - HTML report: Save to audit-report.html with diff2html visualizations
  - Include summary stats: total, critical, warnings, minor

- [ ] **S029** Implement exit code logic for CI/CD
  - Exit code 1: If critical > 0 (blocks build)
  - Exit code 0: If warnings or minor only (allows build)
  - Log summary to console with colored output

- [ ] **S030** Test audit script
  - Run: `node scripts/audit-content.mjs`
  - Check: audit-report.* files generated
  - Open audit-report.html in browser for visual review
  - Verify: Discrepancy categorization makes sense

---

## Phase 7: CI/CD Integration & Testing (S031-S035)

- [ ] **S031** Update .github/workflows files for wiki sync
  - Add GITLAB_TOKEN to GitHub Secrets
  - Modify deploy.yml: Run `npm run sync:wiki` before build
  - Add audit report upload as artifact
  - Add PR comment with audit-report.md content
  - Configure build to fail if audit exits with code 1

- [ ] **S032** [P] Create npm script for local development
  - Add `"dev:sync": "npm run sync:wiki && npm run dev"` for initial local setup
  - Add `"dev": "astro dev"` (no sync, faster iteration)
  - Document in README: Use dev:sync first time, then dev for speed

- [ ] **S033** Write integration test script (`scripts/test-pipeline.mjs`)
  - Create mock wiki data in test fixtures
  - Run fetch → transform → validate → audit pipeline
  - Assert: JSON files updated correctly
  - Assert: Validation passes
  - Assert: Audit reports generated

- [ ] **S034** Run end-to-end pipeline test
  - **MANUAL**: Ensure .env has valid GITLAB_TOKEN
  - Run: `npm run sync:wiki`
  - Run: `npm run extract:tokens`
  - Run: `npm run audit`
  - Run: `npm run validate`
  - Verify: All steps pass without errors
  - Check: src/data/factions.json has 10 factions with lastSynced
  - Check: design-tokens.css exists and has CSS variables

- [ ] **S035** Final verification and documentation
  - Run full build: `npm run build`
  - Verify: Build succeeds with all pre-build hooks
  - Check: Lighthouse score still ≥90
  - Update scripts/README.md with complete workflow documentation
  - Document known issues or manual steps needed (e.g., image-based design specs)
  - Commit all changes with detailed commit message

---

## Critical Path

**Must complete in order**:
1. S001 (env config) → S002 (dependencies) → S003 (directory structure)
2. S006-S008 (schemas and validation)
3. S011-S015 (wiki fetching) - **BLOCKER**: Requires GitLab token from user
4. S016-S020 (transformation)
5. S026-S030 (audit)
6. S034 (end-to-end test)

**Parallel Opportunities**:
- S004 (types) and S005 (package.json scripts) can run parallel to S003
- S007 (biome schema) parallel to S006 (faction schema)
- S009 (style-dictionary config) parallel to S008 (validation script)
- S014 (cache) parallel to S013 (error handling)
- S023 (typography) parallel to S022 (colors)
- S032 (npm scripts) parallel to S031 (CI/CD)

**Known Risks**:
- S015 requires manual GitLab token acquisition (user action)
- S025 may require manual extraction if wiki has image-based specs
- S031 requires GitHub Secrets configuration (user action)

---

## Next Steps

After completing all tasks:
1. Run `/ctxk:impl:commit-changes` to commit the implementation
2. Create pull request with audit-report.md included
3. Review PR for any wiki discrepancies flagged
4. Merge once approved and all checks pass

**Resuming Work**: If session ends, start new chat and:
1. Navigate to feature branch: `git checkout feature/001-wiki-alignment-update`
2. Open this file: `Context/Features/001-WikiAlignmentUpdate/Steps.md`
3. Find first unchecked task
4. Tell AI: "Continue implementation from task SXXX in Steps.md"
