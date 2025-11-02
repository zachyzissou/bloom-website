# Project Context: Bloom Marketing Website

## Project Overview

- **Version**: ContextKit 0.2.0
- **Setup Date**: 2025-11-02
- **Components**: 1 main website component (single-component project)
- **Workspace**: None (standalone project)
- **Primary Tech Stack**: Astro 4.x, Node.js, TypeScript, Tailwind CSS
- **Development Guidelines**: JavaScript/TypeScript (no specific guideline template copied)

## Component Architecture

**Project Structure**:

```
📁 Bloom Marketing Website
└── 🌐 Website (Static Site) - Performance-optimized marketing site for Bloom extraction FPS - Astro 4.x + Tailwind - ./
```

**Component Summary**:
- **1 Astro website component** - Static site generator with performance optimization focus
- **Dependencies**: 28 total (3 prod + 11 dev + 14 optional performance tools)

---

## Component Details

### Bloom Website - Static Marketing Site

**Location**: `./` (project root)
**Purpose**: High-performance marketing website for Bloom extraction FPS game, built with Astro 4.x, Tailwind CSS, and optimized for Core Web Vitals excellence
**Tech Stack**: Astro 4.16.18, Node.js ≥20.0.0, TypeScript 5.6.3, Tailwind CSS (via Astro integration)

**File Structure**:
```
bloom-website/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── OptimizedImage.astro
│   │   ├── VideoEmbed.astro
│   │   ├── FactionCard.astro
│   │   └── Analytics.astro
│   ├── layouts/
│   │   └── BaseLayout.astro # Base HTML structure
│   ├── pages/               # Route pages (7 core pages)
│   ├── data/                # JSON data files (factions, biomes, features, roadmap)
│   └── styles/
│       └── global.css       # Global styles
├── public/                  # Static assets (fonts, images, robots.txt)
├── scripts/                 # Optimization scripts
│   ├── optimize-images.sh
│   ├── optimize-fonts.sh
│   └── subset-fonts.sh
├── .github/workflows/       # CI/CD pipelines
│   ├── deploy.yml
│   ├── performance.yml
│   └── dependency-review.yml
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration (if exists)
├── tsconfig.json            # TypeScript configuration
├── .eslintrc.json           # ESLint configuration
├── .prettierrc.json         # Prettier configuration
├── .lighthouserc.json       # Lighthouse CI configuration
├── netlify.toml             # Netlify deployment settings
└── package.json             # Node.js dependencies and scripts
```

**Dependencies** (from package.json):

**Production**:
- `astro@^4.16.18` - Static site generator with islands architecture
- `@astrojs/sitemap@^3.2.1` - Automatic sitemap generation
- `astro-robots-txt@^1.0.0` - Robots.txt generation

**Development**:
- `@astrojs/check@^0.9.4` - Type checking for Astro files
- `typescript@^5.6.3` - TypeScript compiler
- `eslint@^8.57.1` + plugins - Code linting with Astro, TypeScript, JSX-a11y support
- `prettier@^3.3.3` + `prettier-plugin-astro@^0.13.0` - Code formatting
- `@lhci/cli@^0.13.0` - Lighthouse CI for performance testing
- `husky@^8.0.3` + `lint-staged@^15.2.10` - Git hooks for pre-commit quality checks
- `sharp@^0.33.5` - Image processing library

**Development Commands**:
```bash
# Install dependencies first (required before build/dev)
npm install

# Development server (runs on http://localhost:4321)
npm run dev

# Build for production (with type checking)
npm run build

# Build for production (fast, skip type checking)
npm run build:fast

# Preview production build
npm run preview

# Type checking only
npm run check

# Linting
npm run lint              # Check for errors
npm run lint:fix         # Auto-fix errors

# Formatting
npm run format           # Format all files
npm run format:check     # Check formatting without changes

# Performance testing
npm run lighthouse       # Run Lighthouse CI audit
npm run analyze          # Build and analyze bundle size

# Optimization scripts (manual)
./scripts/optimize-images.sh    # Optimize images to WebP/AVIF
./scripts/optimize-fonts.sh     # Subset fonts for Latin only
```

**Code Style** (detected from configs):

**.prettierrc.json**:
- Semi: false (no semicolons)
- Single quotes: true
- Trailing comma: es5
- Tab width: 2 spaces
- Astro plugin enabled

**.eslintrc.json**:
- TypeScript ESLint parser
- Astro plugin for .astro files
- JSX-a11y plugin for accessibility
- Max warnings: 0 (strict mode)

**Actual indentation**: 2 spaces (detected from package.json and configs)

**Framework Usage**:
- Astro islands architecture (partial hydration)
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- ESLint + Prettier for code quality
- Lighthouse CI for performance monitoring

---

## Development Environment

**Requirements**:
- **Node.js**: ≥20.0.0 (currently using v20.19.5)
- **npm**: ≥10.0.0 (currently using v10.8.2)
- **Git**: For version control

**Build Tools**:
- **Astro CLI**: 4.16.18 (static site generator)
- **TypeScript**: 5.6.3 (type checking)
- **ESLint**: 8.57.1 (linting)
- **Prettier**: 3.3.3 (formatting)
- **Lighthouse CI**: 0.13.0 (performance audits)

**Formatters**:
- **Prettier**: Configured with Astro plugin, 2-space tabs, no semicolons, single quotes
- **ESLint**: TypeScript + Astro + JSX-a11y plugins, max warnings 0
- **Pre-commit hooks**: Husky + lint-staged for automatic formatting/linting

## Development Guidelines

**Applied Guidelines**: JavaScript/TypeScript project patterns
- Guidelines focus on modern JavaScript/TypeScript best practices
- Astro-specific conventions for component architecture
- Performance-first approach (Core Web Vitals optimization)
- Accessibility-first design (WCAG AA compliance)

**Guidelines Integration**:
- All planning phases reference Astro and performance best practices
- Implementation phases apply Astro islands architecture patterns
- Quality agents validate performance budgets and accessibility standards

## Constitutional Principles

**Core Principles**:
- ✅ Accessibility-first design (WCAG AA compliance, keyboard navigation, screen reader support)
- ✅ Privacy by design (minimal analytics, no tracking without consent, Plausible Analytics instead of Google Analytics)
- ✅ Performance-first approach (Lighthouse score ≥90, Core Web Vitals optimization, <1MB total page weight)
- ✅ Code maintainability (TypeScript for type safety, ESLint + Prettier for consistency, comprehensive documentation)
- ✅ Web standards compliance (semantic HTML, progressive enhancement, modern CSS)

**Workspace Inheritance**: None - using global defaults (standalone project)

## ContextKit Workflow

**Systematic Feature Development**:
- `/ctxk:plan:1-spec` - Create business requirements specification (prompts interactively)
- `/ctxk:plan:2-research-tech` - Define technical research, architecture and implementation approach
- `/ctxk:plan:3-steps` - Break down into executable implementation tasks

**Development Execution**:
- `/ctxk:impl:start-working` - Continue development within feature branch (requires completed planning phases)
- `/ctxk:impl:commit-changes` - Auto-format code and commit with intelligent messages

**Quality Assurance**: Automated agents validate code quality during development
**Project Management**: All validated build/test commands documented above for immediate use

## Development Automation

**Quality Agents Available**:
- `build-project` - Execute builds with constitutional compliance validation
- `check-accessibility` - WCAG AA contrast, keyboard navigation, ARIA validation
- `check-performance` - Lighthouse CI, performance budgets, Core Web Vitals monitoring
- `check-modern-code` - Modern JavaScript/TypeScript patterns, Astro best practices
- `check-code-debt` - Technical debt cleanup and AI artifact removal

## Configuration Hierarchy

**Inheritance**: None → **This Project** (standalone)

**This Project Inherits From**:
- **Workspace**: None (standalone project)
- **Project**: Astro-specific configurations documented above

**Override Precedence**: Project settings are authoritative (no workspace to override)

---
*Generated by ContextKit with comprehensive component analysis. Manual edits preserved during updates.*