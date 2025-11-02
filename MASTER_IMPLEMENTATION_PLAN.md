# Bloom Website Master Implementation Plan
## Transform From Generic to Exceptional

**Generated:** 2025-11-02
**Status:** Ready for Implementation
**Scope:** Complete website transformation aligned with game's cosmic horror co-op extraction vision

---

## Executive Summary

Your current website describes **the wrong game**. It says "resource management" when Bloom is actually "cosmic horror co-op extraction where physics broke."

This plan transforms your website from generic marketing into an **immersive artifact from the IEZ**—a corrupted recruitment terminal that makes visitors FEEL the game before they play it.

**What We Discovered:**

1. **Bloom's True Soul:** "Awe-tinged dread" + desperate cooperation in a world where reality itself broke
2. **The Monolith Cascade (2161):** Not just an apocalypse—an ontological event that broke physics
3. **10 Factions:** Philosophies of survival, not RPG classes
4. **The IEZ:** Where time jitters, reality fractures, and cooperation becomes evolution

---

## Phase 1: Foundation (Week 1)

### 1.1 Technical Setup
**Time: 2 hours**

```bash
# Install dependencies
npm install

# Activate Tailwind CSS
mv tailwind.config.example.mjs tailwind.config.mjs

# Run font optimization
./scripts/subset-fonts.sh
```

### 1.2 Fix ESLint Configuration
**Time: 30 minutes**

**File:** `.eslintrc.json`

Remove invalid `ignorePatterns` (lines 47-53) and create `.eslintignore`:

```
dist
.astro
node_modules
*.config.js
*.config.mjs
```

### 1.3 Color System Transformation
**Time: 2 hours**

**File:** `src/layouts/BaseLayout.astro`

Replace current neon green/pink with reality-breaking palette:

```css
:root {
  /* Reality Breaking Colors */
  --harvester-cyan: #00D4E0;      /* Alien extraction tech */
  --fracture-purple: #8B2FD6;     /* Where physics fails */
  --salvage-orange: #D4511E;      /* Human desperation */
  --dead-sky-black: #0A0F14;      /* Corrupted atmosphere */
  --phase-white: #E8F4F8;         /* Reality stabilization */

  /* Old colors - remove these */
  /* --color-primary: #00ff88; */
  /* --color-secondary: #ff0055; */
}
```

### 1.4 Typography Revolution
**Time: 1 hour**

Replace Orbitron with corrupted broadcast fonts:

```css
@import url('https://fonts.googleapis.com/css2?family=Michroma&family=Exo+2:wght@400;600;700&display=swap');

:root {
  --font-heading: 'Michroma', 'Orbitron', monospace;  /* Corrupted broadcast */
  --font-body: 'Exo 2', 'Inter', sans-serif;         /* Technical desperation */
  --font-mono: 'Courier New', monospace;              /* Terminal text */
}
```

Add `font-display: swap` to prevent FOIT (200-500ms FCP improvement):

```css
@font-face {
  font-family: 'Michroma';
  font-display: swap;
  /* ... */
}
```

### 1.5 Homepage Critical Content Fix
**Time: 4 hours**

**File:** `src/pages/index.astro`

**CURRENT (WRONG):**
- Tagline: "Survive the Harvest"
- Description: "Resource management game"
- "8 unique factions" (actually 10)
- "mysterious entities known as Harvesters"

**REPLACE WITH:**

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/SEO.astro';
---

<BaseLayout>
  <SEO
    title="Bloom | Reality Breaks. We Hold Together."
    description="Cosmic horror extraction shooter where reality broke in 2161. 8-10 player co-op. 10 factions. Physics-defying IEZ. The Monolith Cascade changed everything."
    type="game"
  />

  <!-- Hero: Three-Phase Reality Cascade -->
  <section class="hero-cascade" id="main-content">
    <div class="phase-container">
      <!-- Phase 1: Normal (1s) -->
      <div class="phase phase-normal">
        <img src="/images/hero-clean.webp" alt="IEZ landscape before distortion" />
      </div>

      <!-- Phase 2: Fracture (2s) -->
      <div class="phase phase-fracture" aria-hidden="true">
        <img src="/images/hero-fractured.webp" alt="Reality breaking" class="glitch-layer" />
        <div class="reality-cracks"></div>
      </div>

      <!-- Phase 3: Stabilize (permanent) -->
      <div class="phase phase-stabilize">
        <div class="terminal-overlay">
          <p class="terminal-status">[IEZ RECRUITMENT TERMINAL // 2175.11.02 // STATUS: COMPROMISED]</p>

          <h1 class="glitch-text">BLOOM</h1>
          <p class="tagline corrupted">REALITY BREAKS. WE HOLD TOGETHER.</p>

          <div class="transmission">
            <p>Operator, if you're reading this, the physics still work where you are.</p>

            <p>In 2161, we tried to understand them. The Harvesters. Their technology.
            Their Monoliths. The cascade event that followed didn't just break our world—
            it broke the rules that hold reality together.</p>

            <p>Now we extract what we can from the Interdiction Exclusion Zone.
            Not because we're heroes. Because if we don't work together,
            the distortions spread. The Forged multiply. The frozen physics fracture further.</p>

            <p><strong>Ten factions. Different philosophies. One truth:</strong><br>
            In the IEZ, cooperation isn't virtue. <em>It's survival.</em></p>
          </div>

          <div class="cta-section">
            <a href="https://store.steampowered.com/app/YOUR_ID" class="btn-primary glitch">
              ACCEPT DEPLOYMENT
            </a>
            <a href="/factions" class="btn-secondary">
              ACCESS FACTION DOSSIERS
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Value Proposition: Reality Status Cards -->
  <section class="reality-status">
    <div class="status-grid">
      <article class="status-card critical">
        <h3>COSMIC HORROR CO-OP</h3>
        <p>8-10 operators per extraction. When reality tears,
        you need every gun, every ability, every desperate ally.</p>
      </article>

      <article class="status-card warning">
        <h3>EXTRACTION, NOT GLORY</h3>
        <p>Get in. Secure resources. Get out.
        Or become another ghost in the phase-shifted ruins.</p>
      </article>

      <article class="status-card anomaly">
        <h3>PHYSICS: [UNSTABLE]</h3>
        <p>Gravity optional. Time negotiable. Causality disputed.
        The Monolith Cascade left scars reality can't heal.</p>
      </article>

      <article class="status-card tactical">
        <h3>FACTION SYNERGY REQUIRED</h3>
        <p>Iron Vultures breach. Directorate holds. Aegis heals.
        Alone, you're dead. Together, you might extract.</p>
      </article>
    </div>
  </section>

  <!-- Faction Teaser Grid (10 factions, not 8) -->
  <section class="factions-preview">
    <h2 class="section-title glitch">TEN PHILOSOPHIES. ONE SURVIVAL.</h2>
    <p class="section-intro">Choose how you face the impossible.</p>

    <div class="faction-grid">
      <!-- We'll populate this with FactionCard components -->
    </div>

    <a href="/factions" class="btn-secondary">EXPLORE ALL FACTIONS</a>
  </section>
</BaseLayout>

<style>
  /* Phase Cascade Animation */
  .hero-cascade {
    position: relative;
    height: 100vh;
    overflow: hidden;
  }

  .phase {
    position: absolute;
    inset: 0;
    opacity: 0;
    transition: opacity 1s ease;
  }

  .phase-normal {
    animation: phase-normal 3s forwards;
  }

  .phase-fracture {
    animation: phase-fracture 3s 1s forwards;
  }

  .phase-stabilize {
    animation: phase-stabilize 3s 3s forwards;
  }

  @keyframes phase-normal {
    0%, 33% { opacity: 1; }
    100% { opacity: 0; }
  }

  @keyframes phase-fracture {
    0% { opacity: 0; }
    10% { opacity: 1; filter: hue-rotate(0deg); }
    90% { opacity: 1; filter: hue-rotate(360deg) saturate(200%); }
    100% { opacity: 0; }
  }

  @keyframes phase-stabilize {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  /* Glitch Text Effect */
  .glitch-text {
    font-family: var(--font-heading);
    font-size: clamp(3rem, 10vw, 8rem);
    font-weight: 700;
    text-transform: uppercase;
    position: relative;
    color: var(--harvester-cyan);
    text-shadow:
      0.05em 0 0 var(--salvage-orange),
      -0.05em 0 0 var(--fracture-purple);
    animation: glitch 0.5s infinite;
  }

  @keyframes glitch {
    0% { text-shadow: 0.05em 0 0 var(--salvage-orange), -0.05em 0 0 var(--fracture-purple); }
    14% { text-shadow: -0.05em 0 0 var(--salvage-orange), 0.05em 0 0 var(--fracture-purple); }
    15% { text-shadow: 0.05em 0 0 var(--salvage-orange), -0.05em 0 0 var(--fracture-purple); }
    100% { text-shadow: 0.05em 0 0 var(--salvage-orange), -0.05em 0 0 var(--fracture-purple); }
  }

  /* Terminal Text */
  .terminal-overlay {
    background: linear-gradient(135deg, rgba(10, 15, 20, 0.95), rgba(13, 27, 42, 0.9));
    padding: 3rem;
    border: 2px solid var(--harvester-cyan);
    box-shadow:
      0 0 20px rgba(0, 212, 224, 0.3),
      inset 0 0 40px rgba(0, 212, 224, 0.05);
  }

  .terminal-status {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--harvester-cyan);
    opacity: 0.7;
    margin-bottom: 2rem;
  }

  .tagline {
    font-family: var(--font-heading);
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    color: var(--phase-white);
    margin-bottom: 2rem;
    letter-spacing: 0.1em;
  }

  .transmission p {
    font-family: var(--font-body);
    font-size: 1.125rem;
    line-height: 1.8;
    color: var(--phase-white);
    margin-bottom: 1.5rem;
  }

  /* Reality Status Cards */
  .reality-status {
    padding: 4rem 2rem;
    background: var(--dead-sky-black);
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .status-card {
    background: linear-gradient(135deg, rgba(0, 212, 224, 0.05), rgba(139, 47, 214, 0.05));
    border: 1px solid;
    padding: 2rem;
    transition: all 0.3s ease;
  }

  .status-card.critical {
    border-color: var(--salvage-orange);
  }

  .status-card.warning {
    border-color: var(--harvester-cyan);
  }

  .status-card.anomaly {
    border-color: var(--fracture-purple);
  }

  .status-card.tactical {
    border-color: var(--phase-white);
  }

  .status-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 212, 224, 0.2);
  }

  .status-card h3 {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: var(--harvester-cyan);
  }

  .status-card p {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--phase-white);
    opacity: 0.9;
  }

  /* CTAs */
  .btn-primary,
  .btn-secondary {
    display: inline-block;
    padding: 1rem 2rem;
    font-family: var(--font-heading);
    font-size: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-radius: 0;
    transition: all 0.3s ease;
    text-decoration: none;
    border: 2px solid;
  }

  .btn-primary {
    background: var(--harvester-cyan);
    color: var(--dead-sky-black);
    border-color: var(--harvester-cyan);
  }

  .btn-primary:hover {
    background: transparent;
    color: var(--harvester-cyan);
    box-shadow: 0 0 20px var(--harvester-cyan);
  }

  .btn-secondary {
    background: transparent;
    color: var(--phase-white);
    border-color: var(--phase-white);
  }

  .btn-secondary:hover {
    background: var(--phase-white);
    color: var(--dead-sky-black);
  }

  .cta-section {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .cta-section {
      flex-direction: column;
    }
  }
</style>
```

**Week 1 Deliverables:**
- ✅ Dependencies installed
- ✅ Tailwind activated
- ✅ Color system transformed
- ✅ Typography improved with font-display: swap
- ✅ Homepage content completely rewritten
- ✅ Hero cascade animation implemented
- ✅ Reality status cards created
- ✅ Faction count corrected to 10

---

## Phase 2: Component Architecture (Week 2-3)

### 2.1 Component Reorganization
**Time: 4 hours**

Create proper component hierarchy:

```
src/components/
├── common/              # NEW
│   ├── Navigation.astro
│   ├── Header.astro
│   ├── Footer.astro
│   └── SEO.astro (move existing)
├── media/               # NEW
│   ├── OptimizedImage.astro (move existing)
│   └── VideoEmbed.astro (move existing)
├── faction/             # NEW
│   ├── FactionCard.astro (move existing)
│   ├── FactionGrid.astro
│   └── FactionComparison.astro
├── ui/                  # NEW
│   ├── Button.astro
│   ├── Card.astro
│   ├── Terminal.astro
│   └── GlitchText.astro
└── Analytics.astro (move to common/)
```

### 2.2 Navigation System: "Phase Anchor Points"
**Time: 6 hours**

**File:** `src/components/common/Navigation.astro`

```astro
---
// Phase Anchor Point Navigation (dimensional coordinates, not menu items)
const navItems = [
  { id: 'home', label: 'HOME.IEZ_CORE', href: '/' },
  { id: 'factions', label: 'FACTIONS.RECRUITMENT', href: '/factions' },
  { id: 'about', label: 'ABOUT.TIMELINE_BREACH', href: '/about' },
  { id: 'features', label: 'FEATURES.TACTICAL_BRIEF', href: '/features' },
];
---

<nav class="phase-anchors" aria-label="Main navigation">
  <div class="anchor-grid">
    {navItems.map(item => (
      <a
        href={item.href}
        class="anchor-point"
        data-anchor={item.id}
      >
        <span class="anchor-coordinates">{item.label}</span>
        <span class="anchor-status">[STABLE]</span>
      </a>
    ))}
  </div>
</nav>

<style>
  .phase-anchors {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 1000;
  }

  .anchor-grid {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .anchor-point {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1.5rem;
    background: rgba(10, 15, 20, 0.9);
    border: 1px solid var(--harvester-cyan);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--harvester-cyan);
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .anchor-point:hover {
    background: rgba(0, 212, 224, 0.1);
    box-shadow: 0 0 20px rgba(0, 212, 224, 0.3);
    transform: translateX(-4px);
  }

  .anchor-status {
    opacity: 0.5;
    font-size: 0.75rem;
  }

  @media (max-width: 768px) {
    .phase-anchors {
      position: static;
      width: 100%;
    }

    .anchor-grid {
      flex-direction: row;
      overflow-x: auto;
    }
  }
</style>
```

### 2.3 FactionCard Redesign: "Recruitment Terminals"
**Time: 8 hours**

**File:** `src/components/faction/FactionCard.astro`

Transform from generic card to corrupted terminal display:

```astro
---
export interface Props {
  faction: {
    id: string;
    name: string;
    shortName: string;
    role: string;
    philosophy: string;  // NEW
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    launchStatus: 'ea-launch' | 'expansion';
  };
}

const { faction } = Astro.props;
const isLink = Boolean(faction.id);
const Component = isLink ? 'a' : 'article';
---

<Component
  class="faction-terminal"
  href={isLink ? `/factions/${faction.id}` : undefined}
  data-faction={faction.id}
  style={`--faction-primary: ${faction.colors.primary}; --faction-secondary: ${faction.colors.secondary};`}
>
  <!-- CRT Scan Lines -->
  <div class="crt-overlay" aria-hidden="true"></div>

  <!-- Terminal Header -->
  <header class="terminal-header">
    <span class="terminal-status">[FCT_{faction.id.toUpperCase()}]</span>
    <span class="clearance-level">
      {faction.launchStatus === 'ea-launch' ? 'ALPHA ACCESS' : 'EXPANSION'}
    </span>
  </header>

  <!-- Faction Identity -->
  <div class="faction-identity">
    <h3 class="faction-name glitch">{faction.name}</h3>
    <p class="faction-role">{faction.role}</p>
  </div>

  <!-- Philosophy Statement -->
  <div class="philosophy-readout">
    <span class="field-label">PHILOSOPHY:</span>
    <p class="philosophy-text">{faction.philosophy}</p>
  </div>

  <!-- Status Indicators -->
  <footer class="terminal-footer">
    <div class="status-bar">
      <span class="indicator active">RECRUITMENT: OPEN</span>
      <span class="indicator">SYNERGY: COMPATIBLE</span>
    </div>
  </footer>

  <!-- Hover Effect: Reality Bleed -->
  <div class="reality-bleed" aria-hidden="true"></div>
</Component>

<style>
  .faction-terminal {
    position: relative;
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, rgba(10, 15, 20, 0.95), rgba(13, 27, 42, 0.9));
    border: 2px solid var(--faction-primary);
    padding: 1.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
    overflow: hidden;
  }

  /* CRT Scan Lines */
  .crt-overlay {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.15),
      rgba(0, 0, 0, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
    pointer-events: none;
    animation: scan 8s linear infinite;
  }

  @keyframes scan {
    0% { transform: translateY(0); }
    100% { transform: translateY(100%); }
  }

  /* Terminal Header */
  .terminal-header {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--faction-primary);
    margin-bottom: 1rem;
    opacity: 0.7;
  }

  /* Faction Identity */
  .faction-name {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    color: var(--faction-primary);
    margin-bottom: 0.5rem;
  }

  .faction-role {
    font-size: 0.875rem;
    color: var(--phase-white);
    opacity: 0.8;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  /* Philosophy Readout */
  .philosophy-readout {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .field-label {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--harvester-cyan);
    display: block;
    margin-bottom: 0.5rem;
  }

  .philosophy-text {
    font-size: 1rem;
    font-style: italic;
    color: var(--phase-white);
    line-height: 1.6;
  }

  /* Terminal Footer */
  .terminal-footer {
    margin-top: auto;
    padding-top: 1rem;
  }

  .status-bar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .indicator {
    font-family: var(--font-mono);
    font-size: 0.625rem;
    padding: 0.25rem 0.5rem;
    background: rgba(0, 212, 224, 0.1);
    border: 1px solid rgba(0, 212, 224, 0.3);
    color: var(--harvester-cyan);
  }

  .indicator.active {
    background: rgba(0, 212, 224, 0.2);
    border-color: var(--harvester-cyan);
    box-shadow: 0 0 10px rgba(0, 212, 224, 0.3);
  }

  /* Hover: Reality Bleed */
  .reality-bleed {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at center, var(--faction-primary), transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .faction-terminal:hover .reality-bleed {
    opacity: 0.15;
  }

  .faction-terminal:hover {
    transform: translateY(-4px);
    border-color: var(--faction-secondary);
    box-shadow:
      0 8px 24px rgba(0, 0, 0, 0.3),
      0 0 40px var(--faction-primary);
  }

  .faction-terminal:hover .faction-name {
    color: var(--faction-secondary);
    text-shadow: 0 0 20px var(--faction-primary);
  }
</style>
```

### 2.4 Implement Astro Content Collections
**Time: 6 hours**

**File:** `content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

const factionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
    philosophy: z.string(),  // NEW: One-line worldview
    role: z.enum(['tank', 'scavenger', 'medic', 'all-rounder', 'recon', 'support', 'engineer', 'specialist']),
    colors: z.object({
      primary: z.string().regex(/^#[0-9A-F]{6}$/i),
      secondary: z.string().regex(/^#[0-9A-F]{6}$/i),
      accent: z.string().regex(/^#[0-9A-F]{6}$/i),
    }),
    launchStatus: z.enum(['ea-launch', 'expansion']),
    quote: z.string(),  // NEW: Memorable faction member quote
    visualIdentity: z.string(),  // NEW: What they look like
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    uniqueAbilities: z.array(z.object({
      name: z.string(),
      description: z.string(),
      cooldown: z.number().optional(),
    })),
    cooperationStyle: z.string(),
    lore: z.string(),
    homeBiome: z.string(),
  }),
});

const biomesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    cascadeEvent: z.string(),  // NEW: What happened during Cascade
    threatAtmosphere: z.string(),  // NEW: Emotional tone
    environmentalNarrative: z.string(),  // NEW: Story this place tells
    memorableDetail: z.string(),  // NEW: Unforgettable feature
    threatLevel: z.enum(['H1', 'H2', 'H3']),
    description: z.string(),
    climate: z.string(),
    temperature: z.string(),
    weather: z.string(),
    visibility: z.string(),
    terrain: z.string(),
    resources: z.array(z.string()),
    factionPresence: z.array(z.string()),
  }),
});

export const collections = {
  factions: factionsCollection,
  biomes: biomesCollection,
};
```

**Migrate data:**
```bash
# Move JSON to content collections
mv src/data/factions.json content/factions.json
mv src/data/biomes.json content/biomes.json

# Update JSON with new required fields (philosophy, quote, etc.)
```

### 2.5 Extract Duplicate CSS to Global Styles
**Time: 3 hours**

**File:** `src/styles/global.css` (NEW)

```css
/* Button System */
.btn {
  display: inline-block;
  padding: 1rem 2rem;
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border-radius: 0;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid;
  cursor: pointer;
}

.btn-primary {
  background: var(--harvester-cyan);
  color: var(--dead-sky-black);
  border-color: var(--harvester-cyan);
}

.btn-primary:hover {
  background: transparent;
  color: var(--harvester-cyan);
  box-shadow: 0 0 20px var(--harvester-cyan);
}

.btn-secondary {
  background: transparent;
  color: var(--phase-white);
  border-color: var(--phase-white);
}

.btn-secondary:hover {
  background: var(--phase-white);
  color: var(--dead-sky-black);
}

/* Terminal Text Effects */
.terminal-text {
  font-family: var(--font-mono);
  color: var(--harvester-cyan);
}

.glitch {
  position: relative;
  animation: glitch 0.5s infinite;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 var(--salvage-orange), -0.05em 0 0 var(--fracture-purple);
  }
  14% {
    text-shadow: -0.05em 0 0 var(--salvage-orange), 0.05em 0 0 var(--fracture-purple);
  }
  15% {
    text-shadow: 0.05em 0 0 var(--salvage-orange), -0.05em 0 0 var(--fracture-purple);
  }
}

.corrupted {
  filter: hue-rotate(90deg) saturate(150%);
  animation: corrupt 2s infinite alternate;
}

@keyframes corrupt {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(20deg); }
}
```

Import in `BaseLayout.astro`:
```astro
<link rel="stylesheet" href="/src/styles/global.css" />
```

**Week 2-3 Deliverables:**
- ✅ Component hierarchy organized
- ✅ Phase Anchor navigation system
- ✅ FactionCard redesigned as recruitment terminal
- ✅ Content Collections implemented with Zod validation
- ✅ Global styles extracted (eliminates 96 lines duplication)
- ✅ Type safety for all data

---

## Phase 3: Content & Lore (Week 4-5)

### 3.1 World Lore Timeline Page
**Time: 8 hours**

**File:** `src/pages/about.astro`

Create fractured timeline showing Monolith Cascade:

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/common/SEO.astro';
---

<BaseLayout>
  <SEO
    title="About | The Monolith Cascade | Bloom"
    description="2161: Reality broke. 2175: We're still extracting. The timeline of Bloom's world, from First Contact to the Interdiction Exclusion Zone."
  />

  <article class="lore-timeline">
    <header class="page-header">
      <h1 class="glitch-text">THE CASCADE</h1>
      <p class="subtitle">When Reality Broke, Humanity Adapted</p>
    </header>

    <div class="timeline-fracture">
      <!-- 2147: First Contact -->
      <section class="timeline-shard year-2147">
        <div class="shard-header">
          <span class="year">2147.03.15</span>
          <span class="event-type">FIRST CONTACT</span>
        </div>

        <div class="shard-content">
          <p class="classified">They didn't invade. They simply... arrived.
          Monoliths touched down in <span class="redacted">[REDACTED]</span> locations worldwide.
          No communication. No demands. Just their technology,
          humming at frequencies that made physicists weep.</p>

          <blockquote class="field-note">
            "The Monolith's hum isn't sound. It's mathematics made audible.
            Every frequency contains equations we don't have symbols for."
            <cite>— Dr. Helena Cross, Pre-Cascade Research</cite>
          </blockquote>
        </div>
      </section>

      <!-- 2161: Monolith Cascade (CRITICAL) -->
      <section class="timeline-shard year-2161 critical">
        <div class="shard-header">
          <span class="year">2161.09.23</span>
          <span class="event-type critical">THE CASCADE</span>
        </div>

        <div class="shard-content">
          <p class="corrupted">We thought we understood their tech.
          Project <span class="redacted">[DATA EXPUNGED]</span> attempted integration with Monolith systems.
          14 minutes. That's how long reality held before the cascade began.</p>

          <p>Central Grasslands became... something else. Physics became negotiable.
          The Harvesters vanished. Their machines remained. Waiting.</p>

          <div class="anomaly-warning">
            <span class="warning-icon">⚠</span>
            <p class="glitch-text">ERROR: TEMPORAL PARADOX DETECTED.
            MULTIPLE TIMELINE VARIANTS RECORDED.</p>
          </div>

          <details class="classified-data">
            <summary>CLEARANCE REQUIRED: Cascade Event Analysis</summary>
            <div class="classified-content">
              <p><strong>What we know:</strong></p>
              <ul>
                <li>Monolith Alpha activation triggered simultaneous resonance worldwide</li>
                <li>Physics degradation spread at 847 km/h from epicenter</li>
                <li>Estimated 4.3 billion casualties in first 72 hours</li>
                <li>Reality stabilization occurred after 14 days, 7 hours, 23 minutes</li>
              </ul>

              <p><strong>What we suspect:</strong></p>
              <ul>
                <li>The Cascade wasn't malfunction—it was exit strategy</li>
                <li>Harvesters didn't leave Earth, they left <em>this dimension</em></li>
                <li>The machines continue their purpose without overseers</li>
                <li>Purpose unknown. Intent: unclear. Threat level: absolute.</li>
              </ul>
            </div>
          </details>
        </div>
      </section>

      <!-- 2168: Faction Formation -->
      <section class="timeline-shard year-2168">
        <div class="shard-header">
          <span class="year">2168.01.01</span>
          <span class="event-type">FACTION EMERGENCE</span>
        </div>

        <div class="shard-content">
          <p>Global Reconstruction Accord collapsed under ideological fractures.
          From its remnants, ten philosophies emerged. Each faction represents
          humanity's different answer to the same question:</p>

          <blockquote class="philosophy">
            <em>"How do we survive when the universe itself became hostile?"</em>
          </blockquote>

          <ul class="faction-formation">
            <li><strong>Sky Bastion Directorate:</strong> Order is the last barrier</li>
            <li><strong>Iron Vultures:</strong> Every corpse has something worth taking</li>
            <li><strong>Aegis Collective:</strong> Every life saved strengthens tomorrow</li>
            <li><strong>The Seventy-Seven:</strong> Professional standards in unprofessional world</li>
            <li><strong>Helix Syndicate:</strong> Information is the only currency</li>
            <li><strong>The Wayfarers:</strong> Motion is life, stagnation is death</li>
            <li><strong>Obsidian Archive:</strong> Knowledge is power is survival</li>
            <li><strong>North Guard:</strong> We are the line. The line holds.</li>
            <li><strong>Pact of Ash:</strong> Empty bellies breed empty futures</li>
            <li><strong>Apex Dynamics:</strong> Hunt the impossible, become legendary</li>
          </ul>
        </div>
      </section>

      <!-- 2175: Present Day -->
      <section class="timeline-shard year-2175 active">
        <div class="shard-header">
          <span class="year">2175.11.02</span>
          <span class="event-type active">CURRENT DEPLOYMENT</span>
        </div>

        <div class="shard-content">
          <p><strong>Fourteen years since the Cascade.</strong></p>

          <ul class="current-status">
            <li>IEZ expansion rate: 0.3km annually</li>
            <li>Forged factory production: +12% monthly</li>
            <li>Active extraction operators: <span class="redacted">[CLEARANCE REQUIRED]</span></li>
            <li>Operator survival rate: <span class="redacted">[CLEARANCE REQUIRED]</span></li>
            <li>Days until IEZ reaches major population centers: <span class="critical">1,247</span></li>
          </ul>

          <p class="terminal-text">Extraction operations remain humanity's only source
          of Monolith-tech advanced enough to fight back. Every operator who enters
          the IEZ does so knowing: <strong>Cooperation isn't virtue. It's survival.</strong></p>

          <a href="/factions" class="btn-primary">CHOOSE YOUR FACTION</a>
        </div>
      </section>

      <!-- Paradox Warning -->
      <aside class="timeline-paradox">
        <div class="paradox-header">
          <span class="warning-icon">⚠</span>
          <h3>TEMPORAL ANOMALY DETECTED</h3>
        </div>

        <p class="anomaly-text">WARNING: Chronometer discrepancy detected.
        Some operators report the year as 2162. Others insist it's 2189.
        IEZ temporal distortion makes consensus impossible.</p>

        <p class="anomaly-text">Current "year" is consensus average, not objective truth.
        Time is negotiable in the Interdiction Exclusion Zone.</p>
      </aside>
    </div>
  </article>
</BaseLayout>

<style>
  .lore-timeline {
    max-width: 900px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .page-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .timeline-fracture {
    position: relative;
  }

  .timeline-shard {
    position: relative;
    margin-bottom: 4rem;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(10, 15, 20, 0.95), rgba(13, 27, 42, 0.9));
    border-left: 4px solid var(--harvester-cyan);
  }

  .timeline-shard.critical {
    border-left-color: var(--salvage-orange);
    box-shadow: 0 0 40px rgba(212, 81, 30, 0.2);
  }

  .timeline-shard.active {
    border-left-color: var(--fracture-purple);
    box-shadow: 0 0 40px rgba(139, 47, 214, 0.2);
  }

  .shard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .year {
    font-family: var(--font-mono);
    font-size: 1.25rem;
    color: var(--harvester-cyan);
  }

  .event-type {
    font-family: var(--font-heading);
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 212, 224, 0.1);
    border: 1px solid var(--harvester-cyan);
    letter-spacing: 0.1em;
  }

  .event-type.critical {
    background: rgba(212, 81, 30, 0.2);
    border-color: var(--salvage-orange);
    color: var(--salvage-orange);
  }

  .event-type.active {
    background: rgba(139, 47, 214, 0.2);
    border-color: var(--fracture-purple);
    color: var(--fracture-purple);
  }

  .shard-content p {
    line-height: 1.8;
    margin-bottom: 1.5rem;
  }

  .classified,
  .corrupted {
    font-size: 1.125rem;
    color: var(--phase-white);
  }

  .redacted {
    background: var(--dead-sky-black);
    color: var(--dead-sky-black);
    padding: 0 0.5rem;
    border: 1px solid var(--salvage-orange);
    cursor: help;
  }

  .redacted:hover {
    background: rgba(212, 81, 30, 0.1);
    color: var(--salvage-orange);
  }

  .anomaly-warning {
    background: rgba(139, 47, 214, 0.1);
    border: 2px solid var(--fracture-purple);
    padding: 1.5rem;
    margin: 2rem 0;
  }

  .warning-icon {
    font-size: 2rem;
    margin-right: 1rem;
  }

  .classified-data summary {
    cursor: pointer;
    font-family: var(--font-mono);
    color: var(--harvester-cyan);
    padding: 1rem;
    background: rgba(0, 212, 224, 0.05);
    border: 1px solid var(--harvester-cyan);
    margin: 2rem 0;
  }

  .classified-data[open] summary {
    border-bottom: none;
  }

  .classified-content {
    padding: 1.5rem;
    background: rgba(0, 212, 224, 0.05);
    border: 1px solid var(--harvester-cyan);
    border-top: none;
  }

  .timeline-paradox {
    background: rgba(139, 47, 214, 0.1);
    border: 2px solid var(--fracture-purple);
    padding: 2rem;
    margin-top: 4rem;
  }

  .paradox-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .anomaly-text {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    line-height: 1.6;
    color: var(--fracture-purple);
  }
</style>
```

### 3.2 Faction Lore Enhancement
**Time: 12 hours**

Update `content/factions.json` with new required fields for all 10 factions:

```json
{
  "factions": [
    {
      "id": "FCT_DIR",
      "name": "Sky Bastion Directorate",
      "shortName": "Directorate",
      "philosophy": "Order is the last barrier against entropy.",
      "role": "tank",
      "quote": "The Cascade took everything from us—physics, certainty, hope. We took it back with iron discipline and superior firepower. Entropy is the enemy. Order is salvation.",
      "quoteAttribution": "General Helena Cross, Directorate Northern Command",
      "visualIdentity": "Military precision corrupted by desperation. Pristine navy uniforms patched with scavenged armor. Clean-shaven faces behind cracked tactical visors. They polish their boots even as reality dissolves around them—order as psychological warfare against chaos.",
      "colors": {
        "primary": "#001F3F",
        "secondary": "#36454F",
        "accent": "#4682B4"
      },
      "launchStatus": "ea-launch",
      "strengths": [
        "Heavy armor and shields",
        "Artillery support abilities",
        "Defensive positioning bonuses"
      ],
      "weaknesses": [
        "Low mobility",
        "Resource intensive",
        "Vulnerable to flanking"
      ],
      "uniqueAbilities": [
        {
          "name": "Fortress Protocol",
          "description": "Create defensive perimeter that grants team +70% damage resistance for 30 seconds",
          "cooldown": 120
        },
        {
          "name": "Tactical Strike",
          "description": "Call in precision artillery on marked location",
          "cooldown": 180
        }
      ],
      "cooperationStyle": "Anchor. The Directorate holds the line while allies maneuver.",
      "lore": "Born from the collapse of the Global Reconstruction Accord, the Directorate represents humanity's refusal to accept chaos. They maintain military discipline as an act of defiance against the universe's entropy.",
      "homeBiome": "snowpeaks",
      "relationships": {
        "allies": ["FCT_NGD", "FCT_AEG"],
        "rivals": ["FCT_VUL", "FCT_APX"],
        "ideologicalOpposition": ["FCT_WAY"]
      }
    }
    // ... 9 more factions with complete data
  ]
}
```

### 3.3 Biome Environmental Storytelling
**Time: 10 hours**

Update `content/biomes.json` with atmospheric narrative:

```json
{
  "biomes": [
    {
      "id": "iez-core",
      "name": "CentralGrasslands",
      "displayName": "IEZ Core",
      "cascadeEvent": "This is where reality gave up. Monolith Alpha's activation created concentric rings of increasing impossibility. At the center, physics don't just break—they negotiate. Time flows in multiple directions. Gravity points to different norths. Causality is a polite suggestion.",
      "threatAtmosphere": "Existential horror made manifest. Reality here is hostile to human consciousness. Operators report seeing themselves die in temporal echoes. Some meet versions of themselves from timelines where the Cascade never happened. The radiation isn't nuclear—it's ontological, degrading the concept of existence itself.",
      "environmentalNarrative": "The land screams the truth: we were never meant to understand. The closer to Monolith Alpha, the less human concepts apply. Mathematics stops working. Language becomes color. Color becomes pain. The North Guard maintains a perimeter not to keep things in, but to maintain a border where human thought remains possible.",
      "memorableDetail": "The Probability Gardens—zones where multiple versions of reality overlap. A dead tree that's simultaneously burning, frozen, and in full bloom. Operators report meeting themselves here, having conversations with versions who made different choices. Some never leave, paralyzed by infinite possibilities.",
      "threatLevel": "H3",
      "description": "The epicenter of the Monolith Cascade where reality itself remains fundamentally unstable",
      "climate": "Impossible - Physics-defying weather patterns",
      "temperature": "Variable (ranges from absolute zero to solar corona)",
      "weather": "Reality storms, temporal precipitation, causality inversions",
      "visibility": "Probability-dependent",
      "terrain": "Phase-shifted grasslands with dimensional overlaps",
      "resources": [
        "Monolith fragments (highest purity)",
        "Temporal crystals",
        "Reality-warped materials"
      ],
      "factionPresence": [
        "FCT_NGD (perimeter only)",
        "FCT_VAR (research expeditions)",
        "FCT_HLX (data collection)"
      ]
    }
    // ... 11 more biomes
  ]
}
```

**Week 4-5 Deliverables:**
- ✅ About page with Cascade timeline created
- ✅ All 10 faction lore fully enhanced with philosophy/quotes/visual identity
- ✅ All 12 biome narratives enhanced with environmental storytelling
- ✅ Content voice established and documented
- ✅ World feels REAL and immersive

---

## Phase 4: Pages & Features (Week 6-7)

### 4.1 Factions Hub Page
**Time: 8 hours**

**File:** `src/pages/factions.astro`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/common/SEO.astro';
import FactionCard from '@/components/faction/FactionCard.astro';

const allFactions = await getCollection('factions');
const eaFactions = allFactions.filter(f => f.data.launchStatus === 'ea-launch');
const expansionFactions = allFactions.filter(f => f.data.launchStatus === 'expansion');
---

<BaseLayout>
  <SEO
    title="Factions | Choose Your Philosophy | Bloom"
    description="10 factions, 10 philosophies of survival in the IEZ. From military order to salvage chaos, choose how you face impossible odds."
  />

  <article class="factions-hub">
    <header class="hub-header">
      <h1 class="glitch-text">TEN PHILOSOPHIES</h1>
      <p class="subtitle">Choose How You Face The Impossible</p>

      <div class="philosophy-intro terminal-text">
        <p>The Monolith Cascade broke more than physics—it shattered ideology.
        From the ruins of the Global Reconstruction Accord, ten factions emerged.
        Each represents a different answer to humanity's fundamental question:</p>

        <blockquote class="core-question">
          <em>"How do we survive when the universe itself became hostile?"</em>
        </blockquote>

        <p><strong>Your faction isn't a class. It's a philosophy. A commitment. A family.</strong></p>
      </div>
    </header>

    <!-- EA Launch Factions -->
    <section class="faction-tier">
      <div class="tier-header">
        <h2>ALPHA ACCESS FACTIONS</h2>
        <span class="tier-badge">EARLY ACCESS LAUNCH</span>
      </div>

      <div class="faction-grid">
        {eaFactions.map(faction => (
          <FactionCard faction={faction.data} />
        ))}
      </div>
    </section>

    <!-- Expansion Factions -->
    <section class="faction-tier expansion">
      <div class="tier-header">
        <h2>EXPANSION FACTIONS</h2>
        <span class="tier-badge expansion">COMING POST-LAUNCH</span>
      </div>

      <div class="faction-grid">
        {expansionFactions.map(faction => (
          <FactionCard faction={faction.data} />
        ))}
      </div>
    </section>

    <!-- Synergy Matrix Teaser -->
    <aside class="synergy-preview">
      <h3 class="terminal-text">FACTION SYNERGY SYSTEM</h3>
      <p>Factions don't just cooperate—they synthesize. When Iron Vultures breach
      and Helix hacks simultaneously, you don't get addition. You get multiplication.</p>

      <div class="synergy-examples">
        <div class="synergy-card">
          <span class="synergy-combo">Directorate + North Guard</span>
          <p class="synergy-effect">"Fortress Protocol" - 70% damage resistance, anti-Forged targeting</p>
        </div>

        <div class="synergy-card">
          <span class="synergy-combo">Iron Vultures + Helix</span>
          <p class="synergy-effect">"Scrapcode Symphony" - Control all mechanical entities for 30s</p>
        </div>

        <div class="synergy-card">
          <span class="synergy-combo">Aegis + Archive</span>
          <p class="synergy-effect">"Quantum Triage" - Revive from parallel timelines</p>
        </div>
      </div>
    </aside>
  </article>
</BaseLayout>

<style>
  .factions-hub {
    max-width: 1400px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .hub-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  .philosophy-intro {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background: linear-gradient(135deg, rgba(10, 15, 20, 0.95), rgba(13, 27, 42, 0.9));
    border: 2px solid var(--harvester-cyan);
  }

  .core-question {
    font-family: var(--font-heading);
    font-size: 1.5rem;
    text-align: center;
    margin: 2rem 0;
    color: var(--fracture-purple);
  }

  .faction-tier {
    margin-bottom: 4rem;
  }

  .tier-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid var(--harvester-cyan);
  }

  .tier-badge {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 212, 224, 0.2);
    border: 1px solid var(--harvester-cyan);
    color: var(--harvester-cyan);
  }

  .tier-badge.expansion {
    background: rgba(139, 47, 214, 0.2);
    border-color: var(--fracture-purple);
    color: var(--fracture-purple);
  }

  .faction-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
  }

  .synergy-preview {
    background: rgba(139, 47, 214, 0.1);
    border: 2px solid var(--fracture-purple);
    padding: 2rem;
    margin-top: 4rem;
  }

  .synergy-examples {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .synergy-card {
    background: rgba(0, 0, 0, 0.3);
    padding: 1rem;
    border-left: 3px solid var(--fracture-purple);
  }

  .synergy-combo {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--fracture-purple);
    display: block;
    margin-bottom: 0.5rem;
  }

  .synergy-effect {
    font-size: 0.875rem;
    line-height: 1.6;
  }
</style>
```

### 4.2 Individual Faction Pages (Dynamic Routes)
**Time: 10 hours**

**File:** `src/pages/factions/[id].astro`

```astro
---
import { getCollection, getEntry } from 'astro:content';
import BaseLayout from '@/layouts/BaseLayout.astro';
import SEO from '@/components/common/SEO.astro';

export async function getStaticPaths() {
  const factions = await getCollection('factions');
  return factions.map(faction => ({
    params: { id: faction.data.id.toLowerCase() },
    props: { faction },
  }));
}

const { faction } = Astro.props;
const factionData = faction.data;

// Get home biome data
const homeBiome = await getEntry('biomes', factionData.homeBiome);
---

<BaseLayout>
  <SEO
    title={`${factionData.name} | ${factionData.philosophy} | Bloom`}
    description={`${factionData.name}: ${factionData.philosophy}. ${factionData.role} specialists in Bloom's broken reality.`}
  />

  <article class="faction-dossier" data-faction={factionData.id}>
    <!-- Classified Header -->
    <header class="dossier-header" style={`--faction-primary: ${factionData.colors.primary}; --faction-secondary: ${factionData.colors.secondary};`}>
      <div class="classification-bar">
        <span class="file-number">FCT_{factionData.id.toUpperCase()}</span>
        <span class="clearance">CLEARANCE: {factionData.launchStatus === 'ea-launch' ? 'ALPHA ACCESS' : 'EXPANSION'}</span>
      </div>

      <h1 class="faction-name glitch">{factionData.name}</h1>
      <p class="faction-motto">{factionData.philosophy}</p>
    </header>

    <!-- Philosophy Deep Dive -->
    <section class="philosophy-section">
      <h2 class="section-title">PHILOSOPHY STATEMENT</h2>
      <blockquote class="philosophy-quote">
        "{factionData.quote}"
        <cite>— {factionData.quoteAttribution}</cite>
      </blockquote>
    </section>

    <!-- Visual Identity -->
    <section class="identity-section">
      <h2 class="section-title">VISUAL IDENTITY</h2>
      <p class="identity-description">{factionData.visualIdentity}</p>
    </section>

    <!-- Tactical Breakdown -->
    <section class="tactical-section">
      <h2 class="section-title">TACTICAL ASSESSMENT</h2>

      <div class="tactical-grid">
        <div class="tactical-card">
          <h3>Role</h3>
          <p class="role-badge">{factionData.role}</p>
        </div>

        <div class="tactical-card">
          <h3>Cooperation Style</h3>
          <p>{factionData.cooperationStyle}</p>
        </div>

        <div class="tactical-card">
          <h3>Home Territory</h3>
          <p>{homeBiome?.data.displayName || factionData.homeBiome}</p>
        </div>
      </div>

      <!-- Strengths/Weaknesses -->
      <div class="strengths-weaknesses">
        <div class="strength-list">
          <h3>Strengths</h3>
          <ul>
            {factionData.strengths.map(strength => (
              <li>{strength}</li>
            ))}
          </ul>
        </div>

        <div class="weakness-list">
          <h3>Weaknesses</h3>
          <ul>
            {factionData.weaknesses.map(weakness => (
              <li>{weakness}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>

    <!-- Unique Abilities -->
    <section class="abilities-section">
      <h2 class="section-title">UNIQUE ABILITIES</h2>

      <div class="abilities-grid">
        {factionData.uniqueAbilities.map(ability => (
          <div class="ability-card">
            <h3 class="ability-name">{ability.name}</h3>
            <p class="ability-description">{ability.description}</p>
            {ability.cooldown && (
              <span class="ability-cooldown">Cooldown: {ability.cooldown}s</span>
            )}
          </div>
        ))}
      </div>
    </section>

    <!-- Lore -->
    <section class="lore-section">
      <h2 class="section-title">HISTORICAL RECORD</h2>
      <p class="lore-text">{factionData.lore}</p>
    </section>

    <!-- Recruitment CTA -->
    <footer class="recruitment-footer">
      <div class="recruitment-terminal">
        <p class="terminal-prompt">OPERATOR, DO YOU ALIGN WITH THIS PHILOSOPHY?</p>
        <div class="recruitment-actions">
          <a href="https://store.steampowered.com/app/YOUR_ID" class="btn-primary">
            REQUEST FACTION ASSIGNMENT
          </a>
          <a href="/factions" class="btn-secondary">
            REVIEW OTHER FACTIONS
          </a>
        </div>
      </div>
    </footer>
  </article>
</BaseLayout>

<style>
  .faction-dossier {
    max-width: 1000px;
    margin: 0 auto;
    padding: 4rem 2rem;
  }

  .dossier-header {
    background: linear-gradient(135deg, rgba(10, 15, 20, 0.95), rgba(13, 27, 42, 0.9));
    border: 3px solid var(--faction-primary);
    padding: 2rem;
    margin-bottom: 3rem;
    position: relative;
    overflow: hidden;
  }

  .dossier-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top right, var(--faction-primary), transparent 60%);
    opacity: 0.1;
  }

  .classification-bar {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--faction-primary);
    margin-bottom: 1.5rem;
  }

  .faction-name {
    font-family: var(--font-heading);
    font-size: clamp(2rem, 6vw, 3.5rem);
    color: var(--faction-primary);
    margin-bottom: 1rem;
  }

  .faction-motto {
    font-family: var(--font-body);
    font-size: 1.5rem;
    font-style: italic;
    color: var(--phase-white);
  }

  .section-title {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--harvester-cyan);
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--harvester-cyan);
  }

  .philosophy-quote {
    font-size: 1.25rem;
    line-height: 1.8;
    font-style: italic;
    color: var(--phase-white);
    border-left: 4px solid var(--fracture-purple);
    padding-left: 2rem;
    margin: 2rem 0;
  }

  .philosophy-quote cite {
    display: block;
    margin-top: 1rem;
    font-size: 1rem;
    font-style: normal;
    color: var(--harvester-cyan);
  }

  .tactical-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .tactical-card {
    background: rgba(0, 212, 224, 0.05);
    border: 1px solid var(--harvester-cyan);
    padding: 1.5rem;
  }

  .tactical-card h3 {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--harvester-cyan);
    margin-bottom: 0.5rem;
  }

  .role-badge {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--phase-white);
    text-transform: uppercase;
  }

  .strengths-weaknesses {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  .strength-list,
  .weakness-list {
    background: rgba(0, 0, 0, 0.3);
    padding: 1.5rem;
    border-left: 3px solid;
  }

  .strength-list {
    border-left-color: var(--harvester-cyan);
  }

  .weakness-list {
    border-left-color: var(--salvage-orange);
  }

  .abilities-grid {
    display: grid;
    gap: 1.5rem;
  }

  .ability-card {
    background: linear-gradient(135deg, rgba(0, 212, 224, 0.05), rgba(139, 47, 214, 0.05));
    border: 2px solid var(--fracture-purple);
    padding: 1.5rem;
  }

  .ability-name {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--fracture-purple);
    margin-bottom: 0.75rem;
  }

  .ability-cooldown {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--harvester-cyan);
    display: block;
    margin-top: 1rem;
  }

  .recruitment-terminal {
    background: rgba(0, 212, 224, 0.1);
    border: 3px solid var(--harvester-cyan);
    padding: 2rem;
    text-align: center;
  }

  .terminal-prompt {
    font-family: var(--font-mono);
    font-size: 1.125rem;
    color: var(--harvester-cyan);
    margin-bottom: 1.5rem;
  }

  .recruitment-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .recruitment-actions {
      flex-direction: column;
    }
  }
</style>
```

**Week 6-7 Deliverables:**
- ✅ Factions hub page with philosophy focus
- ✅ Individual faction pages (10 dynamic routes)
- ✅ Faction synergy system showcased
- ✅ Visual polish and atmospheric effects
- ✅ All pages link together coherently

---

## Phase 5: Polish & Launch Prep (Week 8)

### 5.1 Performance Optimization
**Time: 6 hours**

1. **Switch to Astro Image Component**

Replace manual image optimization:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero-clean.png';
---

<Image
  src={heroImage}
  alt="IEZ landscape"
  widths={[400, 800, 1200, 1600]}
  formats={['avif', 'webp']}
  loading="eager"
  fetchpriority="high"
/>
```

2. **Add Lighthouse CI Budgets**

Create `.lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:4321/", "http://localhost:4321/factions/", "http://localhost:4321/about/"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.9 }],
        "first-contentful-paint": ["error", { "maxNumericValue": 1500 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "total-blocking-time": ["error", { "maxNumericValue": 300 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    }
  }
}
```

3. **Run Performance Audit**

```bash
npm run lighthouse
```

### 5.2 Accessibility Audit
**Time: 4 hours**

1. **Verify WCAG AA Compliance**
   - Color contrast ratios (4.5:1 minimum)
   - Keyboard navigation (all interactive elements)
   - Screen reader support (ARIA labels)
   - Focus indicators visible

2. **Test with Screen Readers**
   - NVDA (Windows)
   - VoiceOver (Mac)
   - Ensure all glitch/terminal effects don't break SR experience

### 5.3 Mobile Optimization
**Time: 6 hours**

1. **Responsive Breakpoints**

```css
/* Mobile: 320-767px */
@media (max-width: 767px) {
  .hero-cascade {
    height: 60vh;
  }

  .terminal-overlay {
    padding: 1.5rem;
  }

  .status-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 768-1023px */
@media (min-width: 768px) and (max-width: 1023px) {
  .status-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
  .status-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

2. **Mobile Performance Budget**
   - Reduce glitch animations on mobile
   - Simplify cascade effect
   - Defer non-critical CSS

### 5.4 SEO Final Pass
**Time: 3 hours**

1. **Meta Tags for All Pages**
2. **Structured Data (JSON-LD)**
3. **Open Graph Images**
4. **Sitemap Verification**
5. **Robots.txt Configuration**

### 5.5 Content Proofread
**Time: 4 hours**

1. **Voice Consistency Check**
2. **Technical Accuracy**
3. **Typo/Grammar Review**
4. **Link Verification**

**Week 8 Deliverables:**
- ✅ Lighthouse score 95+
- ✅ WCAG AA compliant
- ✅ Mobile-optimized
- ✅ SEO-ready
- ✅ Content polished

---

## Success Metrics

### Performance Targets
- ✅ Lighthouse Performance: 95+
- ✅ Lighthouse Accessibility: 95+
- ✅ Lighthouse Best Practices: 95+
- ✅ Lighthouse SEO: 100
- ✅ LCP: <1.5s
- ✅ FCP: <0.8s
- ✅ CLS: <0.02
- ✅ TBT: <80ms
- ✅ Total Page Weight: <500KB (homepage)

### Content Completeness
- ✅ Homepage transformed (cosmic horror co-op extraction)
- ✅ 10 factions with complete lore
- ✅ 12 biomes with environmental storytelling
- ✅ Timeline/About page created
- ✅ Voice consistent across all content
- ✅ No generic marketing speak

### Technical Quality
- ✅ Type-safe data via Content Collections
- ✅ Component hierarchy organized
- ✅ Zero CSS duplication
- ✅ Accessible (WCAG AA)
- ✅ Mobile-optimized
- ✅ Fast (sub-1s LCP)

---

## Post-Launch Iterations

### Month 1 Post-Launch
- Analytics integration (Plausible)
- User feedback collection
- A/B testing homepage cascade effect
- Content adjustments based on player engagement

### Month 2-3
- Blog/dev log section
- Community showcases
- Press kit downloadable assets
- Expansion faction teasers

### Month 4-6
- Interactive faction comparison tool
- Biome explorer (3D map)
- Timeline interactive visualization
- Enemy bestiary pages

---

## Risk Mitigation

### Technical Risks
**Risk:** Glitch effects break on older browsers
**Mitigation:** Progressive enhancement, feature detection

**Risk:** Performance issues on mobile
**Mitigation:** Reduce effects on low-power devices, lazy load

**Risk:** Content Collections migration breaks existing pages
**Mitigation:** Comprehensive testing, rollback plan

### Content Risks
**Risk:** Lore becomes too dense/confusing
**Mitigation:** User testing, clarity review, progressive disclosure

**Risk:** Voice inconsistency across pages
**Mitigation:** Style guide, content review process

---

## Final Checklist

Before Launch:
- [ ] `npm install` completed
- [ ] Tailwind CSS activated
- [ ] All fonts optimized with font-display: swap
- [ ] Homepage content completely rewritten
- [ ] 10 faction lore complete
- [ ] 12 biome narratives complete
- [ ] About/timeline page created
- [ ] Navigation system implemented
- [ ] All pages mobile-responsive
- [ ] Lighthouse audit passing (95+)
- [ ] Accessibility audit passing (WCAG AA)
- [ ] SEO optimized (meta tags, structured data)
- [ ] Content proofread
- [ ] Links verified
- [ ] Analytics configured
- [ ] Deployment pipeline tested
- [ ] Rollback plan documented

---

## Conclusion

This plan transforms your Bloom website from generic marketing into an **immersive IEZ artifact**. Every element—from glitch effects to faction philosophy statements—reinforces the core truth:

**Reality broke. We hold together.**

The website will make visitors FEEL the cosmic horror co-op extraction experience before they even download the game. It's not just information—it's recruitment into the IEZ.

**Estimated Total Time:** 8 weeks
**Result:** Exceptional website matching your game's soul

Ready to begin Phase 1?
