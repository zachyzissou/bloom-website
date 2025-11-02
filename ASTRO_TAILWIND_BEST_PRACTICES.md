# Astro 4.x + Tailwind CSS 3.x Best Practices Guide
## Game Marketing Website Implementation

> **Project Context**: 7-page static marketing website for a game with 10 factions, 12 biomes, screenshot gallery, video embeds. Target: <3s load time, Lighthouse ≥90, deployed on Netlify.

---

## Table of Contents

1. [Astro 4.x Best Practices](#1-astro-4x-best-practices)
2. [Tailwind CSS 3.x Configuration](#2-tailwind-css-3x-configuration)
3. [Content Collections Architecture](#3-content-collections-architecture)
4. [Image Optimization](#4-image-optimization)
5. [Video Embed Strategy](#5-video-embed-strategy)
6. [SEO Implementation](#6-seo-implementation)
7. [Performance Optimization](#7-performance-optimization)
8. [Component Patterns](#8-component-patterns)
9. [TypeScript Configuration](#9-typescript-configuration)
10. [Build & Deployment](#10-build--deployment)
11. [Code Examples](#11-code-examples)

---

## 1. Astro 4.x Best Practices

### 1.1 Why Astro for Game Marketing Sites

**Performance Excellence:**
- Astro sites achieve **100% Lighthouse scores** on average
- **Islands Architecture**: Static by default, interactive components opt-in
- **Zero JavaScript by default**: Only hydrate what needs interactivity
- **Partial Hydration**: Users download only the JavaScript they need
- Beats average web performance (40.5% pass rate) by significant margins

**Key Advantages for Marketing Sites:**
- Static site generation for fast, cacheable pages
- Built-in image optimization with modern formats (WebP, AVIF)
- Excellent SEO capabilities with meta tags and structured data
- File-based routing for simple navigation
- Content Collections for type-safe content management

### 1.2 Project Structure

```
/mnt/c/Users/Zachg/Bloom-Website/
├── src/
│   ├── components/
│   │   ├── BaseHead.astro          # SEO meta tags
│   │   ├── Header.astro            # Site navigation
│   │   ├── Footer.astro            # Site footer
│   │   ├── FactionCard.astro       # Reusable faction display
│   │   ├── BiomeCard.astro         # Reusable biome display
│   │   ├── Gallery.astro           # Screenshot gallery
│   │   ├── VideoEmbed.astro        # Lazy-loaded video
│   │   └── StructuredData.astro    # JSON-LD schemas
│   ├── layouts/
│   │   └── BaseLayout.astro        # Main layout wrapper
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── factions/
│   │   │   ├── index.astro         # All factions
│   │   │   └── [slug].astro        # Individual faction
│   │   ├── biomes/
│   │   │   ├── index.astro         # All biomes
│   │   │   └── [slug].astro        # Individual biome
│   │   ├── gallery.astro           # Screenshot gallery
│   │   ├── about.astro             # About the game
│   │   └── community.astro         # Community page
│   ├── content/
│   │   ├── config.ts               # Content Collections config
│   │   ├── factions/               # Faction markdown files
│   │   │   ├── harvesters.md
│   │   │   ├── guardians.md
│   │   │   └── ...
│   │   └── biomes/                 # Biome markdown files
│   │       ├── crystal-caverns.md
│   │       ├── toxic-wastes.md
│   │       └── ...
│   ├── styles/
│   │   └── global.css              # Tailwind imports
│   └── assets/
│       ├── images/                 # Local images
│       └── fonts/                  # Custom fonts
├── public/
│   ├── robots.txt
│   ├── favicon.ico
│   └── og-image.jpg                # Open Graph image
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

### 1.3 File-Based Routing

Astro uses file-based routing automatically:

- `src/pages/index.astro` → `/`
- `src/pages/about.astro` → `/about`
- `src/pages/factions/index.astro` → `/factions`
- `src/pages/factions/[slug].astro` → `/factions/harvesters`, `/factions/guardians`, etc.

**Dynamic Routes with Content Collections:**

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
  <h1>{faction.data.name}</h1>
  <Content />
</BaseLayout>
```

### 1.4 Islands Architecture & Partial Hydration

**Client Directives** - Use sparingly, only for interactive components:

```astro
---
// Only interactive components need JavaScript
import InteractiveMap from '../components/InteractiveMap.jsx';
import FactionCard from '../components/FactionCard.astro'; // Static
---

<!-- Static Astro components = 0 JS -->
<FactionCard name="Harvesters" />

<!-- Interactive components with client directives -->
<InteractiveMap client:visible />       <!-- Load when visible -->
<ShareButton client:idle />             <!-- Load when browser idle -->
<VideoPlayer client:load />             <!-- Load immediately -->
<DarkModeToggle client:only="react" />  <!-- Client-only, no SSR -->
```

**Available Client Directives:**

| Directive | When to Use | Load Timing |
|-----------|-------------|-------------|
| `client:load` | Critical interactive content | Immediately on page load |
| `client:idle` | Non-critical interactivity | After initial page load (requestIdleCallback) |
| `client:visible` | Below-the-fold content | When component enters viewport |
| `client:media` | Responsive features | When CSS media query matches |
| `client:only` | Client-side only (no SSR) | Never rendered on server |

**Performance Impact:**
- **Without client directives**: 0 KB JavaScript
- **With selective hydration**: Only 10-50 KB for interactive islands
- **Traditional SPA**: 200-500 KB+ JavaScript bundle

### 1.5 Component Architecture

**Reusable Component Best Practices:**

1. **Use TypeScript Interfaces for Props:**

```astro
---
// src/components/FactionCard.astro
interface Props {
  name: string;
  description: string;
  status: 'launched' | 'coming-soon' | 'concept';
  image: ImageMetadata;
  slug: string;
}

const { name, description, status, image, slug } = Astro.props;
---

<article class="faction-card">
  <Image src={image} alt={name} />
  <h3>{name}</h3>
  <p>{description}</p>
  <span class="status">{status}</span>
  <a href={`/factions/${slug}`}>Learn More</a>
</article>
```

2. **Use Slots for Composability:**

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
}

const { title, description = "Default game description" } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <BaseHead title={title} description={description} />
    <slot name="head" /> <!-- Additional head content -->
  </head>
  <body>
    <Header />
    <main>
      <slot /> <!-- Page content goes here -->
    </main>
    <Footer />
    <slot name="scripts" /> <!-- Page-specific scripts -->
  </body>
</html>
```

3. **Named Slots for Flexible Layouts:**

```astro
---
// Usage in a page
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Factions">
  <Fragment slot="head">
    <link rel="preload" as="image" href="/hero-image.jpg" />
  </Fragment>

  <h1>Factions</h1>
  <p>Main content here...</p>

  <Fragment slot="scripts">
    <script src="/analytics.js"></script>
  </Fragment>
</BaseLayout>
```

---

## 2. Tailwind CSS 3.x Configuration

### 2.1 Installation & Setup

```bash
npx astro add tailwind
```

This automatically:
- Installs `tailwindcss` and `@astrojs/tailwind`
- Creates `tailwind.config.mjs`
- Updates `astro.config.mjs`
- Creates/updates CSS file with Tailwind directives

### 2.2 Tailwind Config for Game Marketing Site

```javascript
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  darkMode: 'selector', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        // Custom "Harvester-punk" theme colors
        primary: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main brand color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#2a2a2a',
        },
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'], // Futuristic headings
        body: ['Inter', 'system-ui', 'sans-serif'], // Readable body text
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px theme(colors.primary.500)' },
          '100%': { boxShadow: '0 0 20px theme(colors.primary.500)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For rich text content
    require('@tailwindcss/forms'),      // Better form styling
    require('@tailwindcss/aspect-ratio'), // Aspect ratio utilities
  ],
}
```

### 2.3 JIT Mode & Content Configuration (Tailwind 3.x)

**Important Changes in Tailwind 3.x:**
- ✅ **JIT mode is DEFAULT** (always enabled)
- ❌ **No `purge` option** (replaced by `content`)
- ✅ **Identical CSS in dev and production**
- ✅ **All variants enabled by default**

**Content Configuration Best Practices:**

```javascript
// ✅ GOOD: Specific patterns
content: [
  './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  './src/components/**/*.astro',
  './src/layouts/**/*.astro',
  './src/pages/**/*.astro',
]

// ❌ BAD: Too broad, includes node_modules
content: ['./**/*.{astro,js}']

// ❌ BAD: Missing file extensions
content: ['./src/**/*']
```

**Safelist for Dynamic Classes:**

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx,vue}'],
  safelist: [
    // Dynamic status colors
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'text-green-700',
    'text-yellow-700',
    'text-red-700',
    // Dynamic grid columns
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    // Pattern-based safelist
    {
      pattern: /bg-(red|green|blue|yellow)-(100|500|900)/,
      variants: ['hover', 'focus', 'dark'],
    },
  ],
}
```

### 2.4 Dark Mode Strategy

**Class-Based Dark Mode** (Best for user toggle):

```javascript
// tailwind.config.mjs
export default {
  darkMode: 'selector', // or 'class' (legacy)
  // ...
}
```

**Implementation:**

```astro
---
// src/components/DarkModeToggle.astro
---

<button id="theme-toggle" class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
  <svg class="w-6 h-6 dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <!-- Sun icon -->
  </svg>
  <svg class="w-6 h-6 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
    <!-- Moon icon -->
  </svg>
</button>

<script>
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check localStorage or system preference
  const theme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (theme === 'dark') {
    html.classList.add('dark');
  }

  toggle?.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });
</script>
```

**Dark Mode Utility Classes:**

```html
<!-- Background colors -->
<div class="bg-white dark:bg-dark-bg">
  <!-- Text colors -->
  <h1 class="text-gray-900 dark:text-white">Title</h1>
  <p class="text-gray-600 dark:text-gray-400">Description</p>

  <!-- Borders -->
  <div class="border border-gray-200 dark:border-dark-border">
    <!-- Hover states -->
    <button class="bg-primary-500 hover:bg-primary-600 dark:bg-primary-700 dark:hover:bg-primary-800">
      Action
    </button>
  </div>
</div>
```

### 2.5 Performance Optimization

**Bundle Size Optimization (Automatic in v3.x):**
- Tailwind 3.x generates **only used classes** via JIT
- Typical production CSS: **5-20 KB** (compared to 3+ MB uncompressed)
- No manual purging needed

**Performance Checklist:**
- ✅ Use `content` configuration correctly
- ✅ Avoid dynamic class construction: `class="${isDark ? 'bg-black' : 'bg-white'}"` (use safelist)
- ✅ Use CSS variables for dynamic values instead of inline styles
- ✅ Enable `@tailwindcss/typography` only if needed for blog content
- ✅ Tree-shake unused plugins

### 2.6 Accessibility with Tailwind

**Focus States (Required for WCAG):**

```html
<!-- ✅ GOOD: Visible focus state -->
<button class="focus:ring-2 focus:ring-primary-500 focus:outline-none">
  Click me
</button>

<!-- ✅ GOOD: Focus-visible for keyboard navigation -->
<a href="/factions" class="focus-visible:ring-2 focus-visible:ring-primary-500">
  View Factions
</a>

<!-- ❌ BAD: Removing focus outline without replacement -->
<button class="focus:outline-none">
  Bad UX
</button>
```

**Screen Reader Utilities:**

```html
<!-- Hide visually, keep for screen readers -->
<span class="sr-only">Skip to main content</span>

<!-- Show only on focus (skip links) -->
<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  Skip to content
</a>
```

**ARIA Attribute Variants (Tailwind 3.2+):**

```html
<!-- Conditional styling based on ARIA state -->
<button
  aria-pressed="false"
  class="aria-pressed:ring-2 aria-pressed:ring-primary-500"
>
  Toggle
</button>

<div
  aria-expanded="false"
  class="aria-expanded:block hidden"
>
  Expandable content
</div>
```

**Color Contrast (WCAG AA):**
- Normal text: **4.5:1** contrast ratio
- Large text (18pt+): **3:1** contrast ratio
- Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## 3. Content Collections Architecture

### 3.1 Why Content Collections?

**Benefits:**
- ✅ **Type Safety**: Automatic TypeScript types from Zod schemas
- ✅ **Validation**: Frontmatter validated at build time
- ✅ **Autocomplete**: Full IDE support with intellisense
- ✅ **References**: Link between collections (factions → biomes)
- ✅ **Performance**: Optimized content loading
- ✅ **Error Messages**: Clear validation errors during development

### 3.2 Schema Design for Factions & Biomes

```typescript
// src/content/config.ts
import { z, defineCollection, reference } from 'astro:content';

// Faction collection schema
const factionsCollection = defineCollection({
  type: 'content', // Markdown/MDX content
  schema: ({ image }) => z.object({
    name: z.string(),
    tagline: z.string().max(100),
    description: z.string(),
    status: z.enum(['launched', 'coming-soon', 'concept']), // Launch status
    featured: z.boolean().default(false),
    order: z.number().int().min(1).max(10), // Display order

    // Images
    thumbnail: image(), // Astro image optimization
    heroImage: image().optional(),

    // Metadata
    color: z.string().regex(/^#[0-9A-F]{6}$/i), // Theme color for faction
    icon: z.string(), // Path to icon SVG

    // Relationships
    homeBiomes: z.array(reference('biomes')).optional(), // Reference to biomes collection

    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),

    // Publish date
    publishDate: z.date(),
    lastUpdated: z.date().optional(),
  }),
});

// Biome collection schema
const biomesCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    climate: z.enum(['arctic', 'temperate', 'tropical', 'desert', 'toxic']),
    dangerLevel: z.number().int().min(1).max(5),

    // Images
    thumbnail: image(),
    mapImage: image().optional(),

    // Resources & Features
    resources: z.array(z.string()),
    uniqueFeatures: z.array(z.string()),

    // Relationships
    nativeFactions: z.array(reference('factions')).optional(),

    // Colors for map visualization
    mapColor: z.string().regex(/^#[0-9A-F]{6}$/i),

    // SEO
    metaTitle: z.string().optional(),
    metaDescription: z.string().max(160).optional(),
  }),
});

// Screenshots/Gallery collection (data-only, JSON/YAML)
const galleryCollection = defineCollection({
  type: 'data', // JSON or YAML files
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().optional(),
    image: image(),
    category: z.enum(['gameplay', 'environment', 'character', 'ui']),
    faction: reference('factions').optional(),
    biome: reference('biomes').optional(),
    featured: z.boolean().default(false),
    date: z.date(),
  }),
});

// Export collections
export const collections = {
  factions: factionsCollection,
  biomes: biomesCollection,
  gallery: galleryCollection,
};
```

### 3.3 Content File Examples

**Faction Markdown File:**

```markdown
---
# src/content/factions/harvesters.md
name: "The Harvesters"
tagline: "Masters of resource extraction"
description: "Ancient machines awakened to harvest the planet's resources."
status: "launched"
featured: true
order: 1
thumbnail: "../../assets/images/factions/harvesters-thumb.jpg"
heroImage: "../../assets/images/factions/harvesters-hero.jpg"
color: "#FF6B35"
icon: "/icons/harvesters.svg"
homeBiomes: ['toxic-wastes', 'industrial-ruins']
publishDate: 2024-01-15
metaTitle: "The Harvesters Faction - Game Name"
metaDescription: "Discover The Harvesters, masters of resource extraction in the post-apocalyptic world."
---

## Origins

The Harvesters emerged from the ruins of the old world...

## Abilities

- **Resource Bonus**: +25% mining efficiency
- **Toxic Immunity**: Can operate in toxic environments
- **Mechanical Adaptation**: Self-repair capabilities

## Strategy Tips

Focus on early resource control...
```

**Biome JSON File:**

```json
// src/content/biomes/toxic-wastes.json
{
  "name": "Toxic Wastes",
  "description": "Poisonous landscapes where only the hardiest survive",
  "climate": "toxic",
  "dangerLevel": 4,
  "thumbnail": "../../assets/images/biomes/toxic-wastes.jpg",
  "mapColor": "#8B5CF6",
  "resources": ["Toxium", "Scrap Metal", "Chemical Compounds"],
  "uniqueFeatures": ["Acid Rain", "Toxic Fog", "Radioactive Zones"],
  "nativeFactions": ["harvesters"],
  "metaDescription": "Explore the Toxic Wastes, a dangerous biome filled with valuable resources."
}
```

### 3.4 Querying Content Collections

**Get All Factions (Sorted):**

```astro
---
// src/pages/factions/index.astro
import { getCollection } from 'astro:content';
import FactionCard from '../../components/FactionCard.astro';

// Get all factions, sorted by order
const allFactions = await getCollection('factions');
const sortedFactions = allFactions.sort((a, b) => a.data.order - b.data.order);

// Filter by status
const launchedFactions = sortedFactions.filter(f => f.data.status === 'launched');
const comingSoonFactions = sortedFactions.filter(f => f.data.status === 'coming-soon');
---

<h2>Available Now</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {launchedFactions.map(faction => (
    <FactionCard faction={faction} />
  ))}
</div>

<h2>Coming Soon</h2>
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {comingSoonFactions.map(faction => (
    <FactionCard faction={faction} />
  ))}
</div>
```

**Get Single Entry with References:**

```astro
---
// src/pages/factions/[slug].astro
import { getCollection, getEntry } from 'astro:content';

export async function getStaticPaths() {
  const factions = await getCollection('factions');
  return factions.map(faction => ({
    params: { slug: faction.slug },
    props: { faction },
  }));
}

const { faction } = Astro.props;
const { Content } = await faction.render();

// Get referenced biomes
const homeBiomes = faction.data.homeBiomes
  ? await Promise.all(faction.data.homeBiomes.map(ref => getEntry(ref)))
  : [];
---

<h1>{faction.data.name}</h1>
<p>{faction.data.tagline}</p>

<Content />

{homeBiomes.length > 0 && (
  <section>
    <h2>Home Biomes</h2>
    <ul>
      {homeBiomes.map(biome => (
        <li>
          <a href={`/biomes/${biome.slug}`}>{biome.data.name}</a>
        </li>
      ))}
    </ul>
  </section>
)}
```

### 3.5 TypeScript Integration

**Automatic Type Generation:**

```typescript
// Astro automatically generates types from your schema
import type { CollectionEntry } from 'astro:content';

// Use in component props
interface Props {
  faction: CollectionEntry<'factions'>;
}

// Or extract just the data type
type FactionData = CollectionEntry<'factions'>['data'];
```

**Type-Safe Component:**

```astro
---
// src/components/FactionCard.astro
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';

interface Props {
  faction: CollectionEntry<'factions'>;
}

const { faction } = Astro.props;
const { name, tagline, status, thumbnail, color } = faction.data;
---

<article class="faction-card" style={`--faction-color: ${color}`}>
  <Image src={thumbnail} alt={name} />
  <h3>{name}</h3>
  <p>{tagline}</p>
  <span class={`status status-${status}`}>{status}</span>
  <a href={`/factions/${faction.slug}`}>Learn More</a>
</article>

<style>
  .faction-card {
    border-left: 4px solid var(--faction-color);
  }
</style>
```

---

## 4. Image Optimization

### 4.1 Astro Assets API (Built-in, Recommended)

**Evolution:**
- ❌ `@astrojs/image` (deprecated, removed in Astro 3.0)
- ✅ **Astro Assets API** (built-in since Astro 3.0, stable in 4.x)

**Key Benefits:**
- Built-in, no external integration needed
- Automatic layout shift (CLS) prevention
- Native Markdown/MDX support
- WebP and AVIF format support
- Responsive images with `srcset`
- Local and remote image support
- Integration with Netlify Image CDN

### 4.2 Image Component Usage

```astro
---
import { Image, Picture } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg'; // Local import
---

<!-- Basic usage with automatic optimization -->
<Image
  src={heroImage}
  alt="Game hero"
  width={1200}
  height={630}
  loading="eager" // Above the fold
/>

<!-- Lazy loading (default for below-the-fold) -->
<Image
  src={heroImage}
  alt="Screenshot"
  loading="lazy"  // Default behavior
  decoding="async" // Default behavior
/>

<!-- Remote images -->
<Image
  src="https://example.com/image.jpg"
  alt="Remote image"
  width={800}
  height={600}
  inferSize // Automatically determine dimensions
/>
```

### 4.3 Picture Component for Modern Formats

```astro
---
import { Picture } from 'astro:assets';
import screenshot from '../assets/images/screenshot.jpg';
---

<!-- Automatically generates multiple formats -->
<Picture
  src={screenshot}
  formats={['avif', 'webp', 'jpg']}
  alt="Game screenshot"
  widths={[400, 800, 1200]}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"
  loading="lazy"
/>

<!-- Output HTML (simplified):
<picture>
  <source type="image/avif" srcset="...400w, ...800w, ...1200w" sizes="..." />
  <source type="image/webp" srcset="...400w, ...800w, ...1200w" sizes="..." />
  <img src="...jpg" srcset="...400w, ...800w, ...1200w" sizes="..." alt="..." loading="lazy" />
</picture>
-->
```

### 4.4 Responsive Images Best Practices

**Layout Property for Automatic srcset:**

```astro
---
import { Image } from 'astro:assets';
import banner from '../assets/images/banner.jpg';
---

<!-- Responsive with automatic srcset generation -->
<Image
  src={banner}
  alt="Banner"
  widths={[320, 640, 960, 1280, 1920]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1280px"
  class="w-full h-auto"
/>
```

**Sizes Attribute Guide:**

```html
<!-- Mobile-first approach -->
sizes="
  (max-width: 640px) 100vw,    /* Full width on mobile */
  (max-width: 1024px) 80vw,    /* 80% width on tablet */
  (max-width: 1280px) 1200px,  /* Fixed width on desktop */
  1200px                        /* Max width */
"
```

### 4.5 Gallery Implementation

**Screenshot Gallery Component:**

```astro
---
// src/components/Gallery.astro
import { Image } from 'astro:assets';
import { getCollection } from 'astro:content';

const screenshots = await getCollection('gallery');
const sortedScreenshots = screenshots.sort((a, b) =>
  b.data.date.getTime() - a.data.date.getTime()
);
---

<div class="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {sortedScreenshots.map((screenshot) => (
    <div class="gallery-item group relative overflow-hidden rounded-lg">
      <Image
        src={screenshot.data.image}
        alt={screenshot.data.title}
        widths={[400, 800]}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        class="w-full h-auto transition-transform group-hover:scale-110"
        loading="lazy"
      />
      <div class="overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex items-center justify-center">
        <button class="text-white opacity-0 group-hover:opacity-100 transition-opacity">
          View Full Size
        </button>
      </div>
    </div>
  ))}
</div>
```

### 4.6 Image Optimization Checklist

**Performance Optimization:**

- ✅ Use `loading="eager"` for above-the-fold images (LCP)
- ✅ Use `loading="lazy"` for below-the-fold images (default)
- ✅ Specify `width` and `height` to prevent CLS
- ✅ Use modern formats: `formats={['avif', 'webp']}`
- ✅ Provide appropriate `sizes` attribute for responsive images
- ✅ Use `Picture` component for art direction or format fallbacks
- ✅ Compress source images before importing (TinyPNG, Squoosh)
- ✅ Use appropriate image dimensions (don't serve 4K for thumbnails)
- ⚠️ Astro dev toolbar warns about lazy-loaded above-the-fold images

**Image Service Configuration:**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  image: {
    // Use Sharp for better performance and quality
    service: {
      entrypoint: 'astro/assets/services/sharp',
      config: {
        limitInputPixels: false, // For large images
      },
    },
    // Or use Squoosh (WASM-based, slower but no dependencies)
    // service: { entrypoint: 'astro/assets/services/squoosh' }
  },
});
```

**Netlify Image CDN Integration:**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'static', // or 'server' for SSR
  adapter: netlify(),
  image: {
    // Netlify automatically provides image optimization
    // No additional configuration needed
    domains: ['example.com'], // Allow remote images
  },
});
```

---

## 5. Video Embed Strategy

### 5.1 Facade Pattern (Recommended)

**Why Facades?**
- Standard YouTube embed: **~1.2 MB** (500+ KB savings)
- Facade embed: **~28 KB** until user clicks
- **Massive performance boost** for Lighthouse scores
- **Critical for SEO** and Core Web Vitals

### 5.2 Astro Lazy YouTube Embed

**Installation:**

```bash
npm install astro-lazy-youtube-embed
```

**Usage:**

```astro
---
// src/components/VideoEmbed.astro
import LazyYouTube from 'astro-lazy-youtube-embed';
---

<!-- Simple lazy-loaded YouTube embed -->
<LazyYouTube id="dQw4w9WgXcQ" title="Game Trailer" />

<!-- With custom poster image -->
<LazyYouTube
  id="dQw4w9WgXcQ"
  title="Game Trailer"
  poster="https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg"
/>
```

### 5.3 Custom Facade Implementation

```astro
---
// src/components/VideoFacade.astro
interface Props {
  videoId: string;
  title: string;
  posterQuality?: 'default' | 'hqdefault' | 'sddefault' | 'maxresdefault';
}

const { videoId, title, posterQuality = 'maxresdefault' } = Astro.props;
const posterUrl = `https://img.youtube.com/vi/${videoId}/${posterQuality}.jpg`;
---

<div
  class="video-facade relative cursor-pointer group"
  data-video-id={videoId}
  data-title={title}
>
  <!-- Poster image -->
  <img
    src={posterUrl}
    alt={title}
    class="w-full h-auto"
    loading="lazy"
  />

  <!-- Play button overlay -->
  <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-50 transition">
    <svg class="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  </div>
</div>

<script>
  // Click-to-load functionality
  document.querySelectorAll('.video-facade').forEach(facade => {
    facade.addEventListener('click', function() {
      const videoId = this.dataset.videoId;
      const title = this.dataset.title;

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
      iframe.setAttribute('title', title);
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.classList.add('w-full', 'aspect-video');

      // Replace facade with iframe
      this.parentNode.replaceChild(iframe, this);
    });
  });
</script>

<style>
  .video-facade {
    aspect-ratio: 16 / 9;
  }
</style>
```

### 5.4 Alternative: lite-youtube-embed

```bash
npm install lite-youtube-embed
```

```astro
---
// src/components/LiteYouTube.astro
interface Props {
  videoId: string;
  title: string;
  params?: string;
}

const { videoId, title, params = '' } = Astro.props;
---

<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.2/src/lite-yt-embed.css" />

<lite-youtube
  videoid={videoId}
  params={params}
  playlabel={`Play: ${title}`}
>
  <button type="button" class="lty-playbtn">
    <span class="lyt-visually-hidden">{title}</span>
  </button>
</lite-youtube>

<script src="https://cdn.jsdelivr.net/npm/lite-youtube-embed@0.3.2/src/lite-yt-embed.js"></script>
```

### 5.5 Video Gallery Page

```astro
---
// src/pages/videos.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import VideoFacade from '../components/VideoFacade.astro';

const videos = [
  { id: 'dQw4w9WgXcQ', title: 'Gameplay Trailer', category: 'trailer' },
  { id: 'abc123def45', title: 'Faction Spotlight: Harvesters', category: 'spotlight' },
  { id: 'xyz789ghi01', title: 'Biome Tour: Toxic Wastes', category: 'biome' },
];
---

<BaseLayout title="Videos">
  <h1 class="text-4xl font-bold mb-8">Watch Gameplay Videos</h1>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    {videos.map(video => (
      <div class="video-card">
        <VideoFacade videoId={video.id} title={video.title} />
        <h3 class="mt-4 text-xl font-semibold">{video.title}</h3>
        <span class="text-sm text-gray-600 dark:text-gray-400">{video.category}</span>
      </div>
    ))}
  </div>
</BaseLayout>
```

---

## 6. SEO Implementation

### 6.1 SEO Strategy for Static Sites

**Core Components:**
1. Meta tags (title, description, canonical)
2. Open Graph tags (social sharing)
3. Twitter Card tags
4. Structured data (JSON-LD)
5. Sitemap
6. Robots.txt

### 6.2 Reusable SEO Component

**Installation (Optional Helper):**

```bash
npm install astro-seo
```

**Custom BaseHead Component:**

```astro
---
// src/components/BaseHead.astro
export interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: URL | string;
  type?: 'website' | 'article' | 'game';
  publishDate?: Date;
}

const {
  title,
  description,
  image = '/og-image.jpg',
  canonicalURL = new URL(Astro.url.pathname, Astro.site),
  type = 'website',
  publishDate,
} = Astro.props;

const siteName = 'Your Game Name';
const twitterHandle = '@yourgame';
---

<!-- Essential Meta Tags -->
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="generator" content={Astro.generator} />

<!-- Primary Meta Tags -->
<title>{title}</title>
<meta name="title" content={title} />
<meta name="description" content={description} />
<link rel="canonical" href={canonicalURL} />

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site)} />
<meta property="og:site_name" content={siteName} />
{publishDate && <meta property="article:published_time" content={publishDate.toISOString()} />}

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content={canonicalURL} />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, Astro.site)} />
<meta name="twitter:creator" content={twitterHandle} />

<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

<!-- Fonts Preload (Performance) -->
<link rel="preload" href="/fonts/Orbitron-Variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />
```

### 6.3 Structured Data (JSON-LD)

**Website Schema (Homepage):**

```astro
---
// src/components/schemas/WebsiteSchema.astro
const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Your Game Name',
  url: Astro.site,
  description: 'An epic harvester-punk strategy game',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${Astro.site}search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**VideoObject Schema:**

```astro
---
// src/components/schemas/VideoSchema.astro
interface Props {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  contentUrl: string;
  embedUrl: string;
}

const { name, description, thumbnailUrl, uploadDate, contentUrl, embedUrl } = Astro.props;

const schema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name,
  description,
  thumbnailUrl,
  uploadDate,
  contentUrl,
  embedUrl,
  publisher: {
    '@type': 'Organization',
    name: 'Your Game Studio',
    logo: {
      '@type': 'ImageObject',
      url: `${Astro.site}logo.png`,
    },
  },
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

**VideoGame Schema (Homepage):**

```astro
---
// src/components/schemas/VideoGameSchema.astro
const schema = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Your Game Name',
  description: 'An epic harvester-punk strategy game',
  image: `${Astro.site}og-image.jpg`,
  genre: ['Strategy', 'Sci-Fi'],
  gamePlatform: ['PC', 'Steam'],
  operatingSystem: 'Windows, macOS, Linux',
  applicationCategory: 'Game',
  offers: {
    '@type': 'Offer',
    price: '29.99',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
    url: 'https://store.steampowered.com/app/123456',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '1250',
  },
};
---

<script type="application/ld+json" set:html={JSON.stringify(schema)} />
```

### 6.4 Sitemap & RSS Integration

**Installation:**

```bash
npx astro add sitemap
npm install @astrojs/rss
```

**Configuration:**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourgame.com', // REQUIRED for sitemap
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/admin/') &&
        !page.includes('/draft/'),
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],
});
```

**RSS Feed (Future Blog):**

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const blog = await getCollection('blog'); // Future blog collection
  return rss({
    title: 'Your Game Blog',
    description: 'Latest updates and news',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      link: `/blog/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
```

### 6.5 Robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://yourgame.com/sitemap-index.xml
```

### 6.6 SEO Checklist

**On-Page SEO:**
- ✅ Unique `<title>` per page (50-60 characters)
- ✅ Meta description (150-160 characters)
- ✅ Canonical URLs
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags
- ✅ Structured data (JSON-LD)
- ✅ Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`)
- ✅ Heading hierarchy (single `<h1>`, logical `<h2>`-`<h6>`)
- ✅ Image `alt` attributes
- ✅ Internal linking
- ✅ Mobile-responsive design

**Technical SEO:**
- ✅ Sitemap.xml generated
- ✅ Robots.txt configured
- ✅ Fast page load (<3s)
- ✅ Core Web Vitals optimized
- ✅ HTTPS enabled (Netlify auto-SSL)
- ✅ No broken links
- ✅ Clean URLs (no `.html` extensions)

---

## 7. Performance Optimization

### 7.1 Core Web Vitals Targets

| Metric | Good | Needs Improvement | Poor |
|--------|------|-------------------|------|
| **LCP** (Largest Contentful Paint) | ≤2.5s | 2.5s-4.0s | >4.0s |
| **FID** (First Input Delay) | ≤100ms | 100ms-300ms | >300ms |
| **INP** (Interaction to Next Paint) | ≤200ms | 200ms-500ms | >500ms |
| **CLS** (Cumulative Layout Shift) | ≤0.1 | 0.1-0.25 | >0.25 |

### 7.2 Astro Performance Advantages

**Automatic Optimizations:**
- ✅ **Code splitting** per page (automatic)
- ✅ **Tree shaking** unused code
- ✅ **Asset optimization** via Vite
- ✅ **Partial hydration** for interactive components
- ✅ **Static HTML** by default (0 JS)

**Measured Results:**
- Astro sites beat **40.5% average** pass rate
- Astro.build achieves **100% Lighthouse** on every page
- **Near-perfect Core Web Vitals** scores

### 7.3 Font Optimization

**Variable Fonts Strategy:**

```css
/* src/styles/global.css */

/* Orbitron Variable Font (Display) */
@font-face {
  font-family: 'Orbitron';
  src: url('/fonts/Orbitron-Variable.woff2') format('woff2-variations');
  font-weight: 400 900;
  font-display: swap; /* Prevent FOIT, allow FOUT */
  font-style: normal;
}

/* Inter Variable Font (Body) */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}
```

**Preloading Critical Fonts:**

```astro
---
// src/components/BaseHead.astro
---
<link
  rel="preload"
  href="/fonts/Orbitron-Variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
<link
  rel="preload"
  href="/fonts/Inter-Variable.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

**Font Display Strategies:**

| Value | Behavior | Use Case |
|-------|----------|----------|
| `swap` | Show fallback, swap when loaded | **Recommended** for most cases |
| `optional` | No swap after 100ms | Ultra-fast performance priority |
| `fallback` | Brief invisible period, swap | Balanced approach |
| `block` | Invisible up to 3s | Avoid (causes FOIT) |

### 7.4 Critical CSS Inlining

Astro automatically handles critical CSS extraction. For manual control:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    build: {
      cssCodeSplit: true, // Split CSS per page
      assetsInlineLimit: 4096, // Inline assets <4KB
    },
  },
});
```

### 7.5 Build Optimization

**Code Splitting Configuration:**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Separate vendor chunks
            'vendor-react': ['react', 'react-dom'],
            'vendor-utils': ['date-fns', 'lodash-es'],
          },
        },
      },
    },
  },
});
```

**Tree Shaking & Dead Code Elimination:**

Astro + Vite automatically tree-shake unused code. Ensure:

- ✅ Use ES6 imports (`import`), not CommonJS (`require`)
- ✅ Import only what you need: `import { specific } from 'library'`
- ✅ Avoid side-effect imports unless necessary
- ✅ Use `package.json` `sideEffects: false` for libraries

### 7.6 Performance Budget

**Lighthouse Budget Configuration:**

```json
// budget.json (use with Lighthouse CI)
[
  {
    "path": "/*",
    "resourceSizes": [
      {
        "resourceType": "script",
        "budget": 150
      },
      {
        "resourceType": "total",
        "budget": 500
      },
      {
        "resourceType": "image",
        "budget": 1000
      }
    ],
    "resourceCounts": [
      {
        "resourceType": "third-party",
        "budget": 10
      }
    ],
    "timings": [
      {
        "metric": "first-contentful-paint",
        "budget": 1500
      },
      {
        "metric": "largest-contentful-paint",
        "budget": 2000
      },
      {
        "metric": "cumulative-layout-shift",
        "budget": 0.1
      }
    ]
  }
]
```

**Examples of Performance Budgets:**

| Metric | Target | Reasoning |
|--------|--------|-----------|
| LCP | <2.0s | Google "Good" threshold is 2.5s |
| Lighthouse Score | ≥90 | Project requirement |
| Total Page Size | <500 KB | Fast mobile load |
| JavaScript Bundle | <150 KB | Minimal JS for static site |
| Image Size | <1 MB | Lazy loading mitigates |
| Third-Party Scripts | <5 | Reduce external dependencies |

### 7.7 Lazy Loading Strategies

**Images:**

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
import screenshot1 from '../assets/screenshot1.jpg';
---

<!-- Above the fold: Eager loading -->
<Image
  src={heroImage}
  alt="Hero"
  loading="eager"
  fetchpriority="high"
/>

<!-- Below the fold: Lazy loading (default) -->
<Image
  src={screenshot1}
  alt="Screenshot"
  loading="lazy"
/>
```

**Components (Islands):**

```astro
---
import InteractiveMap from '../components/InteractiveMap.jsx';
---

<!-- Load when visible (best for below-fold) -->
<InteractiveMap client:visible />

<!-- Load when browser is idle (non-critical) -->
<ChatWidget client:idle />

<!-- Load immediately (critical interaction) -->
<WishlistButton client:load />
```

**Third-Party Scripts:**

```astro
---
// src/layouts/BaseLayout.astro
---
<script>
  // Load analytics after page interaction
  window.addEventListener('load', () => {
    setTimeout(() => {
      const script = document.createElement('script');
      script.src = 'https://analytics.example.com/script.js';
      script.async = true;
      document.head.appendChild(script);
    }, 3000);
  });
</script>
```

### 7.8 Caching Strategy

**Netlify Auto-Caching:**

Netlify automatically sets cache headers for static assets:

- HTML: No cache (for fresh content)
- JS/CSS/Images: 1 year cache with content hashing

**Custom Headers:**

```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## 8. Component Patterns

### 8.1 Hero Section

```astro
---
// src/components/Hero.astro
import { Image } from 'astro:assets';
import heroImage from '../assets/images/hero.jpg';
---

<section class="hero relative h-screen flex items-center justify-center overflow-hidden">
  <!-- Background Image -->
  <div class="absolute inset-0 z-0">
    <Image
      src={heroImage}
      alt="Game hero"
      class="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    />
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 text-center text-white px-4">
    <h1 class="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-in">
      Your Game Name
    </h1>
    <p class="text-xl md:text-2xl font-body mb-8 max-w-2xl mx-auto animate-slide-up">
      Master resources, conquer factions, dominate the wasteland
    </p>
    <div class="flex gap-4 justify-center">
      <a
        href="#"
        class="bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
      >
        Wishlist on Steam
      </a>
      <a
        href="#trailer"
        class="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition backdrop-blur-sm"
      >
        Watch Trailer
      </a>
    </div>
  </div>
</section>
```

### 8.2 Card Grid

```astro
---
// src/components/FactionGrid.astro
import { getCollection } from 'astro:content';
import FactionCard from './FactionCard.astro';

const factions = await getCollection('factions');
const sortedFactions = factions.sort((a, b) => a.data.order - b.data.order);
---

<section class="py-16 px-4">
  <h2 class="text-4xl font-display font-bold text-center mb-12">
    Choose Your Faction
  </h2>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
    {sortedFactions.map(faction => (
      <FactionCard faction={faction} />
    ))}
  </div>
</section>
```

**Faction Card Component:**

```astro
---
// src/components/FactionCard.astro
import type { CollectionEntry } from 'astro:content';
import { Image } from 'astro:assets';

interface Props {
  faction: CollectionEntry<'factions'>;
}

const { faction } = Astro.props;
const { name, tagline, thumbnail, status, color } = faction.data;

const statusColors = {
  launched: 'bg-green-500 text-green-900',
  'coming-soon': 'bg-yellow-500 text-yellow-900',
  concept: 'bg-gray-500 text-gray-900',
};
---

<article
  class="faction-card group relative bg-white dark:bg-dark-surface rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
  style={`--faction-color: ${color}`}
>
  <!-- Accent Border -->
  <div class="absolute top-0 left-0 right-0 h-1 bg-[var(--faction-color)]"></div>

  <!-- Image -->
  <div class="relative h-48 overflow-hidden">
    <Image
      src={thumbnail}
      alt={name}
      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
      loading="lazy"
    />

    <!-- Status Badge -->
    <span class={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase ${statusColors[status]}`}>
      {status.replace('-', ' ')}
    </span>
  </div>

  <!-- Content -->
  <div class="p-6">
    <h3 class="text-2xl font-display font-bold mb-2 text-gray-900 dark:text-white">
      {name}
    </h3>
    <p class="text-gray-600 dark:text-gray-400 mb-4">
      {tagline}
    </p>
    <a
      href={`/factions/${faction.slug}`}
      class="inline-flex items-center text-[var(--faction-color)] hover:underline font-semibold"
    >
      Learn More
      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  </div>
</article>
```

### 8.3 Responsive Navigation

```astro
---
// src/components/Header.astro
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Factions', href: '/factions' },
  { label: 'Biomes', href: '/biomes' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
];
---

<header class="sticky top-0 z-50 bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
  <nav class="container mx-auto px-4 py-4 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2">
      <img src="/logo.svg" alt="Game Logo" class="h-10 w-10" />
      <span class="text-2xl font-display font-bold text-gray-900 dark:text-white">
        Game Name
      </span>
    </a>

    <!-- Desktop Navigation -->
    <ul class="hidden md:flex items-center gap-6">
      {navItems.map(item => (
        <li>
          <a
            href={item.href}
            class="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition"
          >
            {item.label}
          </a>
        </li>
      ))}
      <li>
        <a
          href="#wishlist"
          class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Wishlist
        </a>
      </li>
    </ul>

    <!-- Mobile Menu Toggle -->
    <button
      id="mobile-menu-toggle"
      class="md:hidden p-2 text-gray-700 dark:text-gray-300"
      aria-label="Toggle menu"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>

  <!-- Mobile Navigation -->
  <div
    id="mobile-menu"
    class="hidden md:hidden bg-white dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border"
  >
    <ul class="py-4">
      {navItems.map(item => (
        <li>
          <a
            href={item.href}
            class="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {item.label}
          </a>
        </li>
      ))}
      <li class="px-4 py-3">
        <a
          href="#wishlist"
          class="block text-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Wishlist on Steam
        </a>
      </li>
    </ul>
  </div>
</header>

<script>
  const toggle = document.getElementById('mobile-menu-toggle');
  const menu = document.getElementById('mobile-menu');

  toggle?.addEventListener('click', () => {
    menu?.classList.toggle('hidden');
  });
</script>
```

### 8.4 Footer Component

```astro
---
// src/components/Footer.astro
const currentYear = new Date().getFullYear();

const socialLinks = [
  { name: 'Twitter', icon: 'twitter', href: 'https://twitter.com/yourgame' },
  { name: 'Discord', icon: 'discord', href: 'https://discord.gg/yourgame' },
  { name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/@yourgame' },
  { name: 'Steam', icon: 'steam', href: 'https://store.steampowered.com/app/123456' },
];
---

<footer class="bg-gray-900 text-gray-300 py-12">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      <!-- About -->
      <div>
        <h4 class="text-white font-display font-bold text-lg mb-4">Game Name</h4>
        <p class="text-sm">
          An epic harvester-punk strategy game set in a post-apocalyptic world.
        </p>
      </div>

      <!-- Links -->
      <div>
        <h4 class="text-white font-semibold mb-4">Explore</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="/factions" class="hover:text-primary-400 transition">Factions</a></li>
          <li><a href="/biomes" class="hover:text-primary-400 transition">Biomes</a></li>
          <li><a href="/gallery" class="hover:text-primary-400 transition">Gallery</a></li>
          <li><a href="/about" class="hover:text-primary-400 transition">About</a></li>
        </ul>
      </div>

      <!-- Community -->
      <div>
        <h4 class="text-white font-semibold mb-4">Community</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="#" class="hover:text-primary-400 transition">Discord Server</a></li>
          <li><a href="#" class="hover:text-primary-400 transition">Forums</a></li>
          <li><a href="#" class="hover:text-primary-400 transition">Dev Blog</a></li>
          <li><a href="#" class="hover:text-primary-400 transition">Press Kit</a></li>
        </ul>
      </div>

      <!-- Social -->
      <div>
        <h4 class="text-white font-semibold mb-4">Follow Us</h4>
        <div class="flex gap-4">
          {socialLinks.map(link => (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-gray-800 hover:bg-primary-500 rounded-full flex items-center justify-center transition"
              aria-label={link.name}
            >
              <!-- Add icons here -->
              <span class="sr-only">{link.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
      <p>&copy; {currentYear} Your Game Studio. All rights reserved.</p>
      <p class="mt-2">
        <a href="/privacy" class="hover:text-primary-400 transition">Privacy Policy</a>
        {' • '}
        <a href="/terms" class="hover:text-primary-400 transition">Terms of Service</a>
      </p>
    </div>
  </div>
</footer>
```

---

## 9. TypeScript Configuration

### 9.1 Recommended tsconfig.json

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    // Path Aliases
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@assets/*": ["src/assets/*"]
    },

    // Type Checking
    "strict": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,

    // Module Resolution
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,

    // JavaScript Support
    "allowJs": true,
    "checkJs": false,

    // Types
    "types": ["astro/client"],

    // JSX (if using React/Preact)
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 9.2 Content Collections Type Safety

**Automatic Type Generation:**

Astro automatically generates types when you define schemas:

```typescript
// This is auto-generated in .astro/types.d.ts
declare module 'astro:content' {
  export function getCollection(collection: 'factions'): Promise<CollectionEntry<'factions'>[]>;
  export function getEntry(collection: 'factions', slug: string): Promise<CollectionEntry<'factions'>>;
  // ... more types
}
```

**Using Generated Types:**

```typescript
// src/utils/factionHelpers.ts
import type { CollectionEntry } from 'astro:content';

// Type-safe helper function
export function getFactionsByStatus(
  factions: CollectionEntry<'factions'>[],
  status: 'launched' | 'coming-soon' | 'concept'
) {
  return factions.filter(f => f.data.status === status);
}

// Type-safe sort function
export function sortFactionsByOrder(factions: CollectionEntry<'factions'>[]) {
  return [...factions].sort((a, b) => a.data.order - b.data.order);
}
```

### 9.3 Component Props Types

```astro
---
// src/components/BiomeCard.astro
import type { CollectionEntry } from 'astro:content';
import type { HTMLAttributes } from 'astro/types';

// Extend HTML attributes for the wrapper element
interface Props extends HTMLAttributes<'article'> {
  biome: CollectionEntry<'biomes'>;
  featured?: boolean;
}

const { biome, featured = false, class: className, ...rest } = Astro.props;
---

<article class={`biome-card ${featured ? 'featured' : ''} ${className || ''}`} {...rest}>
  <!-- Component content -->
</article>
```

### 9.4 Environment Variables

```typescript
// src/env.d.ts
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_STEAM_APP_ID: string;
  readonly PUBLIC_ANALYTICS_ID: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string; // Private, not prefixed with PUBLIC_
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

**Usage:**

```astro
---
const steamAppId = import.meta.env.PUBLIC_STEAM_APP_ID;
const analyticsId = import.meta.env.PUBLIC_ANALYTICS_ID;
---

<a href={`https://store.steampowered.com/app/${steamAppId}`}>
  Wishlist on Steam
</a>
```

---

## 10. Build & Deployment

### 10.1 Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Redirect rules
[[redirects]]
  from = "/old-page"
  to = "/new-page"
  status = 301

# SPA fallback (if using SSR)
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# Custom headers
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

# Image optimization (Netlify automatic)
[[plugins]]
  package = "@netlify/plugin-lighthouse"

  [plugins.inputs]
    performance = 90
    accessibility = 90
    best-practices = 90
    seo = 90
```

### 10.2 Astro Build Configuration

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import netlify from '@astrojs/netlify';

export default defineConfig({
  site: 'https://yourgame.com',
  output: 'static', // or 'server' for SSR

  integrations: [
    tailwind({
      applyBaseStyles: false, // Use custom global.css
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  adapter: netlify({
    edgeMiddleware: false,
  }),

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['img.youtube.com'], // Allow YouTube thumbnails
  },

  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom'], // If using React islands
          },
        },
      },
    },
  },
});
```

### 10.3 Build Scripts

```json
{
  "name": "game-marketing-site",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx,.astro",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@astrojs/netlify": "^5.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "astro": "^4.0.0",
    "astro-lazy-youtube-embed": "^1.0.0",
    "astro-seo": "^0.8.0",
    "tailwindcss": "^3.4.0"
  },
  "devDependencies": {
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@tailwindcss/forms": "^0.5.7",
    "@tailwindcss/typography": "^0.5.10",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.57.0",
    "eslint-plugin-astro": "^0.31.0",
    "prettier": "^3.2.0",
    "prettier-plugin-astro": "^0.13.0",
    "typescript": "^5.3.0"
  }
}
```

### 10.4 ESLint & Prettier Configuration

**ESLint Configuration:**

```javascript
// eslint.config.js (Flat Config - ESLint 9+)
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';
import astroParser from 'astro-eslint-parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: ['.astro'],
      },
    },
    plugins: {
      astro: astroPlugin,
    },
    rules: {
      ...astroPlugin.configs.recommended.rules,
    },
  },
];
```

**Prettier Configuration:**

```javascript
// prettier.config.mjs
export default {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  trailingComma: 'es5',
  printWidth: 100,
  plugins: ['prettier-plugin-astro'],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};
```

### 10.5 Continuous Deployment

**GitHub Actions (Optional):**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Netlify

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run check

      - name: Build site
        run: npm run build

      - name: Run Lighthouse CI
        run: npx lighthouse-ci --config=lighthouserc.json
```

### 10.6 Pre-Deploy Checklist

**Before Production Deployment:**

- ✅ Run `npm run build` locally without errors
- ✅ Run `npm run check` for TypeScript errors
- ✅ Test all pages in preview mode (`npm run preview`)
- ✅ Verify all images load correctly
- ✅ Test responsive design on mobile/tablet/desktop
- ✅ Check SEO meta tags with browser inspector
- ✅ Validate structured data with Google Rich Results Test
- ✅ Test all internal links
- ✅ Verify video embeds load and play
- ✅ Check dark mode toggle functionality
- ✅ Test lazy loading (scroll through pages)
- ✅ Run Lighthouse audit (target: ≥90 all scores)
- ✅ Verify sitemap generates correctly (`/sitemap-index.xml`)
- ✅ Check robots.txt accessibility
- ✅ Test 404 page
- ✅ Verify analytics tracking (if implemented)

---

## 11. Code Examples

### 11.1 Complete Faction Page

```astro
---
// src/pages/factions/[slug].astro
import { getCollection, getEntry } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../../layouts/BaseLayout.astro';
import BiomeCard from '../../components/BiomeCard.astro';
import VideoSchema from '../../components/schemas/VideoSchema.astro';

export async function getStaticPaths() {
  const factions = await getCollection('factions');
  return factions.map(faction => ({
    params: { slug: faction.slug },
    props: { faction },
  }));
}

const { faction } = Astro.props;
const { Content } = await faction.render();

// Get referenced biomes
const homeBiomes = faction.data.homeBiomes
  ? await Promise.all(faction.data.homeBiomes.map(ref => getEntry(ref)))
  : [];

const metaTitle = faction.data.metaTitle || `${faction.data.name} - Your Game Name`;
const metaDescription = faction.data.metaDescription || faction.data.tagline;
---

<BaseLayout
  title={metaTitle}
  description={metaDescription}
  image={faction.data.heroImage?.src || faction.data.thumbnail.src}
  type="article"
  publishDate={faction.data.publishDate}
>
  <article class="faction-page">
    <!-- Hero Section -->
    <section class="hero relative h-96 flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <Image
          src={faction.data.heroImage || faction.data.thumbnail}
          alt={faction.data.name}
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-5xl md:text-6xl font-display font-bold mb-4">
          {faction.data.name}
        </h1>
        <p class="text-xl md:text-2xl font-body">
          {faction.data.tagline}
        </p>
      </div>
    </section>

    <!-- Content -->
    <section class="container mx-auto px-4 py-16 max-w-4xl">
      <div class="prose prose-lg dark:prose-invert max-w-none">
        <Content />
      </div>
    </section>

    <!-- Home Biomes -->
    {homeBiomes.length > 0 && (
      <section class="bg-gray-100 dark:bg-dark-surface py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-display font-bold mb-8 text-center">
            Home Biomes
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeBiomes.map(biome => (
              <BiomeCard biome={biome} />
            ))}
          </div>
        </div>
      </section>
    )}

    <!-- Call to Action -->
    <section class="py-16 text-center">
      <h2 class="text-3xl font-display font-bold mb-6">
        Ready to lead {faction.data.name}?
      </h2>
      <a
        href="#wishlist"
        class="inline-block bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
      >
        Wishlist on Steam
      </a>
    </section>
  </article>
</BaseLayout>
```

### 11.2 Complete Gallery Page

```astro
---
// src/pages/gallery.astro
import { getCollection } from 'astro:content';
import { Image } from 'astro:assets';
import BaseLayout from '../layouts/BaseLayout.astro';

const allScreenshots = await getCollection('gallery');
const sortedScreenshots = allScreenshots.sort((a, b) =>
  b.data.date.getTime() - a.data.date.getTime()
);

const categories = [...new Set(allScreenshots.map(s => s.data.category))];
---

<BaseLayout
  title="Screenshot Gallery - Your Game Name"
  description="Explore stunning screenshots from our harvester-punk strategy game"
>
  <div class="gallery-page py-16">
    <div class="container mx-auto px-4">
      <h1 class="text-4xl md:text-5xl font-display font-bold text-center mb-12">
        Screenshot Gallery
      </h1>

      <!-- Category Filter -->
      <div class="flex flex-wrap justify-center gap-4 mb-12">
        <button
          class="filter-btn active px-6 py-2 rounded-lg font-semibold transition"
          data-category="all"
        >
          All
        </button>
        {categories.map(category => (
          <button
            class="filter-btn px-6 py-2 rounded-lg font-semibold transition"
            data-category={category}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      <!-- Gallery Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedScreenshots.map((screenshot) => (
          <div
            class="gallery-item group relative overflow-hidden rounded-lg cursor-pointer"
            data-category={screenshot.data.category}
          >
            <Image
              src={screenshot.data.image}
              alt={screenshot.data.title}
              widths={[400, 800]}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              class="w-full h-auto transition-transform group-hover:scale-110"
              loading="lazy"
            />
            <div class="overlay absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-opacity flex items-center justify-center">
              <div class="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity p-4">
                <h3 class="text-lg font-bold mb-2">{screenshot.data.title}</h3>
                {screenshot.data.description && (
                  <p class="text-sm">{screenshot.data.description}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</BaseLayout>

<style>
  .filter-btn {
    @apply bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300;
  }

  .filter-btn:hover {
    @apply bg-gray-300 dark:bg-gray-700;
  }

  .filter-btn.active {
    @apply bg-primary-500 text-white;
  }
</style>

<script>
  // Category filtering
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
</script>
```

### 11.3 Complete Base Layout

```astro
---
// src/layouts/BaseLayout.astro
import BaseHead from '../components/BaseHead.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import WebsiteSchema from '../components/schemas/WebsiteSchema.astro';

interface Props {
  title: string;
  description: string;
  image?: string;
  canonicalURL?: URL | string;
  type?: 'website' | 'article' | 'game';
  publishDate?: Date;
}

const { title, description, image, canonicalURL, type, publishDate } = Astro.props;
---

<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
  <head>
    <BaseHead
      title={title}
      description={description}
      image={image}
      canonicalURL={canonicalURL}
      type={type}
      publishDate={publishDate}
    />
    <WebsiteSchema />
    <slot name="head" />
  </head>

  <body class="bg-white dark:bg-dark-bg text-gray-900 dark:text-white antialiased">
    <Header />

    <main id="main-content">
      <slot />
    </main>

    <Footer />

    <slot name="scripts" />
  </body>
</html>

<style is:global>
  @import '../styles/global.css';

  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
```

---

## Summary

This comprehensive guide covers all best practices for building a high-performance game marketing website with Astro 4.x and Tailwind CSS 3.x, including:

1. **Astro 4.x fundamentals**: Islands architecture, partial hydration, content collections
2. **Tailwind CSS 3.x**: JIT mode, dark mode, accessibility, performance optimization
3. **Content Collections**: Type-safe schemas for factions, biomes, gallery
4. **Image Optimization**: Astro Assets API, responsive images, WebP/AVIF formats
5. **Video Strategy**: Facade pattern for lazy-loaded YouTube embeds
6. **SEO**: Meta tags, structured data (JSON-LD), sitemap, Open Graph
7. **Performance**: Core Web Vitals, Lighthouse scores, font optimization
8. **Component Patterns**: Hero sections, card grids, navigation, footer
9. **TypeScript**: Strict configuration, type-safe content collections
10. **Deployment**: Netlify configuration, build optimization, CI/CD

**Key Takeaways:**

- ✅ Astro achieves **100% Lighthouse scores** with proper implementation
- ✅ Tailwind 3.x uses **JIT mode** (no manual purging needed)
- ✅ Content Collections provide **type safety** and validation
- ✅ **Facade pattern** for videos saves **500+ KB** per embed
- ✅ Proper **lazy loading** and **partial hydration** critical for performance
- ✅ **SEO** requires meta tags, structured data, and sitemap
- ✅ **Netlify** provides automatic optimization and caching

**Project Structure Files:**

- `/mnt/c/Users/Zachg/Bloom-Website/ASTRO_TAILWIND_BEST_PRACTICES.md` (this file)

Follow this guide for a production-ready, SEO-optimized, high-performance game marketing website that meets your <3s load time and Lighthouse ≥90 requirements.
