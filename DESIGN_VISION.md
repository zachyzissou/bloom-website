# Bloom Website Design Vision: Stepping Into The IEZ

## Executive Summary: The Problem

The current Bloom website is a generic gaming template that completely fails to capture the soul of the game. It presents Bloom as a "resource management game" when it's actually a **cosmic horror co-op extraction experience** where reality itself is breaking. The disconnect between the website's clean sci-fi aesthetic and the game's "awe-tinged dread" is jarring.

**Current failures:**
- Hero text: "Survive the Harvest" sounds like a farming game
- Color scheme: Generic neon green (#00ff88) + hot pink (#ff0055) screams arcade, not cosmic horror
- Typography: Orbitron is clean military sci-fi, missing the desperation and corruption
- Factions: Presented as classes, not philosophies of survival
- No sense of the IEZ's reality-breaking horror
- Zero emotional impact in the first 3 seconds

This document presents a complete redesign that makes visitors **feel** Bloom's corrupted reality.

---

## Part 1: Visual Design System

### 1.1 Color Philosophy: Reality Is Breaking

**ABANDON** the current neon arcade palette. Bloom's colors tell the story of reality's corruption.

#### Core Palette: The IEZ Spectrum

```css
:root {
  /* Primary: Harvester Cyan - The color of extraction, of being taken */
  --bloom-cyan: #00D4E0;        /* Pure Harvester energy */
  --bloom-cyan-glow: #00FFE6;   /* Energy discharge */
  --bloom-cyan-dark: #006B75;   /* Deep extraction */

  /* Secondary: Reality Fracture Purple - Where physics fails */
  --bloom-purple: #8B2FD6;       /* Phase shear */
  --bloom-purple-light: #B565F3; /* Temporal jitter */
  --bloom-purple-dark: #4A1970;  /* Deep void */

  /* Tertiary: Salvage Orange - Human desperation */
  --bloom-orange: #D4511E;       /* Rust and survival */
  --bloom-orange-hot: #FF6B35;   /* Active salvage */
  --bloom-orange-dead: #8B3410;  /* Abandoned hope */

  /* Environmental: The World That Was */
  --bloom-black: #0A0A0B;        /* Deep space black, not pure black */
  --bloom-gray-900: #1A1A1D;     /* Terminal screens */
  --bloom-gray-800: #2A2A2F;     /* Metal surfaces */
  --bloom-gray-700: #3A3A41;     /* Concrete bunkers */
  --bloom-gray-600: #4A4A53;     /* Worn steel */
  --bloom-gray-500: #6A6A75;     /* Dust and ash */
  --bloom-gray-400: #8A8A95;     /* Static interference */
  --bloom-gray-300: #AAAAB5;     /* Faded text */
  --bloom-gray-200: #CACAD5;     /* Ghost signals */
  --bloom-gray-100: #EAEAEF;     /* Emergency lighting */

  /* State Colors: System Responses */
  --bloom-danger: #FF1744;       /* Critical failure */
  --bloom-warning: #FFA726;      /* Radiation warning */
  --bloom-success: #00E676;      /* Extraction complete */
  --bloom-info: #00B0FF;         /* Intel received */
}
```

#### Faction Color Integration Strategy

Each faction has distinct colors but must feel part of Bloom's world. Apply a **corruption filter**:

```css
.faction-card {
  /* Base faction colors */
  background: linear-gradient(135deg,
    var(--faction-primary),
    var(--faction-secondary)
  );

  /* Corruption overlay - reality breaking through */
  position: relative;
}

.faction-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 80%,
      var(--bloom-purple) 0%,
      transparent 40%),
    linear-gradient(180deg,
      transparent 70%,
      var(--bloom-cyan) 100%);
  opacity: 0.15;
  mix-blend-mode: screen;
  animation: reality-pulse 8s ease-in-out infinite;
}

@keyframes reality-pulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.25; }
}
```

### 1.2 Typography: Desperation Meets Technology

**REPLACE** Orbitron completely. It's too clean for cosmic horror.

#### Typography Stack

```css
:root {
  /* Primary Display: Corrupted military terminals */
  --font-display: 'Michroma', 'Share Tech Mono', monospace;
  /* Michroma: Angular, technical, slightly uncomfortable */

  /* Secondary Headers: Emergency broadcasts */
  --font-heading: 'Exo 2', 'Russo One', sans-serif;
  /* Exo 2: Technical but human, slight desperation */

  /* Body Text: Field reports */
  --font-body: 'Inter', 'Work Sans', sans-serif;
  /* Inter: Maximum readability under stress */

  /* Data/Terminal: System readouts */
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  /* JetBrains Mono: Technical data, coordinates */

  /* Glitch Text: Reality breaking */
  --font-glitch: 'Share Tech Mono', monospace;
}
```

#### Typography Scale with Corruption

```css
/* Display - Hero titles, massive impact */
.text-display-1 {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 0.9;
  text-transform: uppercase;
}

/* Add glitch to large text */
.text-display-1[data-glitch] {
  position: relative;
}

.text-display-1[data-glitch]::before,
.text-display-1[data-glitch]::after {
  content: attr(data-glitch);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.text-display-1[data-glitch]::before {
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  color: var(--bloom-cyan);
  z-index: -1;
}

.text-display-1[data-glitch]::after {
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  color: var(--bloom-purple);
  z-index: -2;
}

@keyframes glitch-1 {
  0% { clip-path: inset(20% 0 30% 0); transform: translate(-2px, 2px); }
  100% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -2px); }
}

@keyframes glitch-2 {
  0% { clip-path: inset(50% 0 30% 0); transform: translate(2px, 0); }
  100% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 0); }
}
```

### 1.3 Spacing & Layout: Claustrophobic Yet Vast

```css
:root {
  /* Spacing scale - tighter than typical for tension */
  --space-xs: 0.25rem;   /* 4px */
  --space-sm: 0.5rem;    /* 8px */
  --space-md: 1rem;      /* 16px */
  --space-lg: 1.5rem;    /* 24px */
  --space-xl: 2.5rem;    /* 40px */
  --space-2xl: 4rem;     /* 64px */
  --space-3xl: 6rem;     /* 96px */

  /* Container widths */
  --container-xs: 20rem;   /* 320px - Terminal windows */
  --container-sm: 40rem;   /* 640px - Data cards */
  --container-md: 60rem;   /* 960px - Content blocks */
  --container-lg: 80rem;   /* 1280px - Main content */
  --container-xl: 100rem;  /* 1600px - Full experiences */

  /* Border radius - sharp, military, breaking */
  --radius-sm: 2px;        /* Subtle softening */
  --radius-md: 4px;        /* Cards, buttons */
  --radius-lg: 8px;        /* Containers */
  --radius-terminal: 0;    /* Terminal windows - sharp */
}
```

### 1.4 Visual Effects: Reality Distortion Rules

#### When to Use Effects

**CRITICAL RULE**: Effects must enhance, not distract. Use the **3-Second Rule**:
- 0-1 second: Subtle environmental effects (ambient particles, slight color shifts)
- 1-2 seconds: User-triggered interactions (hover states, focus effects)
- 2-3 seconds: Major state changes (page transitions, loading states)
- 3+ seconds: User must be able to read/interact without distortion

#### Effect Library

```css
/* 1. Phase Shimmer - Subtle reality instability */
.phase-shimmer {
  animation: phase-shimmer 20s ease-in-out infinite;
}

@keyframes phase-shimmer {
  0%, 100% {
    filter: hue-rotate(0deg) brightness(1);
  }
  25% {
    filter: hue-rotate(5deg) brightness(1.05);
  }
  50% {
    filter: hue-rotate(-5deg) brightness(0.95);
  }
  75% {
    filter: hue-rotate(3deg) brightness(1.02);
  }
}

/* 2. Scan Lines - Terminal aesthetic */
.scan-lines::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 212, 224, 0.03) 2px,
    rgba(0, 212, 224, 0.03) 4px
  );
  pointer-events: none;
  animation: scan-move 8s linear infinite;
}

@keyframes scan-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(10px); }
}

/* 3. Data Corruption - Text breaking */
.corrupt-text {
  animation: corrupt 0.5s steps(10) infinite alternate;
}

@keyframes corrupt {
  0% { text-shadow: none; }
  20% { text-shadow: -2px 0 var(--bloom-cyan); }
  40% { text-shadow: 2px 0 var(--bloom-purple); }
  60% { text-shadow: -1px 0 var(--bloom-orange); }
  80% { text-shadow: 1px 0 var(--bloom-danger); }
  100% { text-shadow: 0 0 5px var(--bloom-cyan-glow); }
}

/* 4. Reality Break - Major distortions */
.reality-break {
  animation: reality-break 0.2s ease-out;
}

@keyframes reality-break {
  0% {
    transform: scale(1) rotate(0deg);
    filter: blur(0);
  }
  25% {
    transform: scale(1.02) rotate(0.5deg);
    filter: blur(1px) hue-rotate(180deg);
  }
  50% {
    transform: scale(0.98) rotate(-0.5deg);
    filter: blur(2px) hue-rotate(90deg);
  }
  75% {
    transform: scale(1.01) rotate(0.2deg);
    filter: blur(0.5px) hue-rotate(270deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    filter: blur(0);
  }
}
```

---

## Part 2: Component Redesign Specifications

### 2.1 Navigation: The Dimensional Anchor

**DESTROY** the concept of a traditional navigation bar. Navigation should feel like accessing different dimensional coordinates.

#### Design Concept: Phase Anchor Points

```astro
<!-- NavigationAnchor.astro -->
<nav class="phase-anchor" aria-label="Main navigation">
  <div class="anchor-grid">
    <!-- Home anchor - always stable -->
    <a href="/" class="anchor-point anchor-stable">
      <span class="coordinate">α-00</span>
      <span class="label">Origin</span>
      <span class="status">Stable</span>
    </a>

    <!-- Faction anchor - slight instability -->
    <a href="/factions" class="anchor-point anchor-unstable">
      <span class="coordinate">β-10</span>
      <span class="label">Factions</span>
      <span class="status">Phase Drift: 0.2%</span>
    </a>

    <!-- IEZ anchor - major instability -->
    <a href="/biomes" class="anchor-point anchor-critical">
      <span class="coordinate">Ω-99</span>
      <span class="label">IEZ Data</span>
      <span class="status">WARNING: Cascade Event</span>
    </a>
  </div>

  <!-- Phase stabilizer meter -->
  <div class="stabilizer-meter">
    <div class="meter-label">Phase Stability</div>
    <div class="meter-bar">
      <div class="meter-fill" style="width: 73%"></div>
    </div>
    <div class="meter-value">73%</div>
  </div>
</nav>
```

#### Styling

```css
.phase-anchor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    180deg,
    var(--bloom-black) 0%,
    transparent 100%
  );
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--bloom-cyan);
  box-shadow: 0 0 20px rgba(0, 212, 224, 0.3);
}

.anchor-point {
  display: grid;
  grid-template-areas:
    "coordinate status"
    "label label";
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--bloom-gray-900);
  border: 1px solid var(--bloom-gray-700);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.anchor-point:hover {
  background: var(--bloom-gray-800);
  border-color: var(--bloom-cyan);
  transform: translateY(-2px);
  box-shadow:
    0 10px 30px rgba(0, 212, 224, 0.2),
    inset 0 0 30px rgba(0, 212, 224, 0.1);
}

.anchor-unstable:hover {
  animation: phase-jitter 0.5s ease-out;
}

.anchor-critical:hover {
  animation: reality-break 0.2s ease-out;
  border-color: var(--bloom-purple);
}

.coordinate {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--bloom-cyan);
  text-transform: uppercase;
}

.status {
  font-size: 0.625rem;
  color: var(--bloom-gray-400);
  text-align: right;
}

.anchor-critical .status {
  color: var(--bloom-danger);
  animation: blink 1s step-start infinite;
}
```

### 2.2 Hero Section: First Contact Protocol

**CURRENT PROBLEM**: "Bloom - Survive the Harvest" with generic description. Zero emotional impact.

#### New Hero Concept: Reality Cascade Opening

```astro
<!-- HeroSection.astro -->
<section class="hero-cascade" data-phase="stable">
  <!-- Background: Animated IEZ environment -->
  <div class="hero-environment">
    <!-- Layer 1: Deep space particles -->
    <canvas id="particle-field" class="layer-particles"></canvas>

    <!-- Layer 2: Phase distortion grid -->
    <div class="layer-distortion">
      <div class="distortion-grid"></div>
    </div>

    <!-- Layer 3: Glitch overlays -->
    <div class="layer-glitch">
      <div class="glitch-blocks"></div>
    </div>
  </div>

  <!-- Content: The actual hero message -->
  <div class="hero-content">
    <!-- Phase 1: Initial stable state -->
    <div class="hero-phase phase-1 active">
      <h1 class="hero-title" data-glitch="BLOOM">
        BLOOM
      </h1>
      <p class="hero-status">
        <span class="status-label">IEZ STATUS:</span>
        <span class="status-value">DETECTING ANOMALY...</span>
      </p>
    </div>

    <!-- Phase 2: Reality break -->
    <div class="hero-phase phase-2">
      <h1 class="hero-title corrupted" data-glitch="BL▓▓M">
        BL<span class="break">▓▓</span>M
      </h1>
      <p class="hero-warning">
        <span class="warning-icon">⚠</span>
        CASCADE EVENT IN PROGRESS
      </p>
    </div>

    <!-- Phase 3: Message delivery -->
    <div class="hero-phase phase-3">
      <p class="hero-transmission">
        YEAR 2175. DAY 1,234 SINCE MONOLITH CASCADE.<br>
        THE HARVESTERS CAME. REALITY BROKE.<br>
        <span class="emphasis">WE LEARNED TO BREAK IT BACK.</span>
      </p>
      <div class="hero-cta">
        <button class="btn-volunteer" data-action="deploy">
          <span class="btn-text">VOLUNTEER FOR DEPLOYMENT</span>
          <span class="btn-coordinate">[Ψ-EXTRACT]</span>
        </button>
        <button class="btn-intel" data-action="briefing">
          <span class="btn-text">ACCESS INTEL BRIEFING</span>
          <span class="btn-coordinate">[α-DECODE]</span>
        </button>
      </div>
    </div>
  </div>

  <!-- Environmental details -->
  <div class="hero-telemetry">
    <div class="telemetry-item">
      <span class="label">PHASE VARIANCE</span>
      <span class="value" data-animate="jitter">2.7Δ</span>
    </div>
    <div class="telemetry-item">
      <span class="label">TEMPORAL DRIFT</span>
      <span class="value" data-animate="count">-0.003s</span>
    </div>
    <div class="telemetry-item">
      <span class="label">OPERATORS ACTIVE</span>
      <span class="value" data-animate="count">7,231</span>
    </div>
  </div>
</section>
```

#### Hero Animation Sequence

```javascript
// Hero phase progression
class HeroCascade {
  constructor() {
    this.phases = document.querySelectorAll('.hero-phase');
    this.currentPhase = 0;
    this.init();
  }

  init() {
    // Start with phase 1 for 2 seconds
    setTimeout(() => this.triggerCascade(), 2000);
  }

  triggerCascade() {
    // Add reality break effect
    document.querySelector('.hero-cascade').dataset.phase = 'breaking';

    // Glitch to phase 2
    setTimeout(() => {
      this.switchPhase(1);
      this.addDistortion();
    }, 300);

    // Resolve to phase 3
    setTimeout(() => {
      this.switchPhase(2);
      document.querySelector('.hero-cascade').dataset.phase = 'corrupted';
      this.initTelemetry();
    }, 1500);
  }

  addDistortion() {
    // Create visual glitch blocks
    const glitchContainer = document.querySelector('.glitch-blocks');
    for (let i = 0; i < 5; i++) {
      const block = document.createElement('div');
      block.className = 'glitch-block';
      block.style.cssText = `
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        width: ${50 + Math.random() * 200}px;
        height: ${2 + Math.random() * 20}px;
        background: ${Math.random() > 0.5 ? 'var(--bloom-cyan)' : 'var(--bloom-purple)'};
        animation-delay: ${Math.random() * 0.5}s;
      `;
      glitchContainer.appendChild(block);
    }
  }
}
```

### 2.3 Faction Cards: Philosophy Selection Interface

**TRANSFORM** from basic colored cards to **Recruitment Terminals**.

#### New FactionTerminal Component

```astro
<!-- FactionTerminal.astro -->
<article class="faction-terminal" data-faction={faction.id}>
  <!-- Terminal Frame -->
  <div class="terminal-frame">
    <div class="terminal-header">
      <span class="terminal-id">{faction.id}</span>
      <div class="terminal-status">
        <span class="status-indicator" data-status="online"></span>
        <span class="status-text">RECRUITING</span>
      </div>
    </div>

    <!-- Faction Emblem with corruption -->
    <div class="terminal-display">
      <div class="emblem-container">
        <div class="emblem-scanlines"></div>
        <img
          src={faction.emblem}
          alt={`${faction.name} emblem`}
          class="emblem-image"
        />
        <div class="emblem-interference"></div>
      </div>

      <!-- Philosophy Display -->
      <div class="philosophy-readout">
        <p class="philosophy-text" data-typewriter>
          {faction.philosophy}
        </p>
      </div>
    </div>

    <!-- Data Readout -->
    <div class="terminal-data">
      <div class="data-grid">
        <div class="data-item">
          <span class="data-label">DESIGNATION</span>
          <span class="data-value">{faction.name}</span>
        </div>
        <div class="data-item">
          <span class="data-label">HOME BIOME</span>
          <span class="data-value">{faction.homeBiome}</span>
        </div>
        <div class="data-item">
          <span class="data-label">SQUAD BOOST</span>
          <span class="data-value">{faction.coopAbility}</span>
        </div>
        <div class="data-item">
          <span class="data-label">THREAT RESPONSE</span>
          <span class="data-value">{faction.specialty}</span>
        </div>
      </div>
    </div>

    <!-- Interaction Layer -->
    <button class="terminal-access" aria-label={`Access ${faction.name} database`}>
      <span class="access-text">ACCESS DATABASE</span>
      <span class="access-arrow">→</span>
    </button>
  </div>

  <!-- Hover State: Additional Intel -->
  <div class="terminal-intel">
    <h3>CLASSIFIED INTEL</h3>
    <p>{faction.lore}</p>
    <ul class="ability-list">
      {faction.uniqueAbilities.map(ability => (
        <li class="ability-item">
          <span class="ability-name">{ability.name}</span>
          <span class="ability-cooldown">[{ability.cooldown}]</span>
        </li>
      ))}
    </ul>
  </div>
</article>
```

#### Terminal Styling

```css
.faction-terminal {
  position: relative;
  background: var(--bloom-gray-900);
  border: 2px solid var(--bloom-gray-700);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faction-terminal::before {
  /* CRT monitor effect */
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 255, 0.03) 2px,
      rgba(0, 255, 255, 0.03) 4px
    );
  pointer-events: none;
  animation: scan-lines 10s linear infinite;
}

.faction-terminal:hover {
  border-color: var(--faction-primary, var(--bloom-cyan));
  box-shadow:
    0 0 30px rgba(0, 212, 224, 0.3),
    inset 0 0 60px rgba(0, 212, 224, 0.05);
  transform: translateY(-4px) scale(1.02);
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  padding: var(--space-sm);
  background: var(--bloom-black);
  border-bottom: 1px solid var(--bloom-gray-700);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.status-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: var(--bloom-success);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.emblem-container {
  position: relative;
  padding: var(--space-xl);
}

.emblem-image {
  width: 120px;
  height: 120px;
  filter:
    drop-shadow(0 0 20px var(--faction-primary))
    brightness(1.1)
    contrast(1.2);
  transition: all 0.3s;
}

.faction-terminal:hover .emblem-image {
  animation: emblem-glitch 0.5s steps(5);
}

@keyframes emblem-glitch {
  0% { transform: translate(0); filter: hue-rotate(0deg); }
  20% { transform: translate(-2px, 2px); filter: hue-rotate(90deg); }
  40% { transform: translate(2px, -1px); filter: hue-rotate(180deg); }
  60% { transform: translate(-1px, 2px); filter: hue-rotate(270deg); }
  80% { transform: translate(1px, -2px); filter: hue-rotate(360deg); }
  100% { transform: translate(0); filter: hue-rotate(0deg); }
}

.philosophy-readout {
  text-align: center;
  padding: var(--space-md);
  min-height: 3rem;
}

.philosophy-text {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  color: var(--bloom-cyan);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Typewriter effect on hover */
.faction-terminal:hover .philosophy-text[data-typewriter] {
  animation: typewriter 2s steps(30) forwards;
}
```

### 2.4 Biome Presentation: Environmental Threat Matrix

**CREATE** an interactive threat assessment interface, not a static list.

#### BiomeThreatMatrix Component

```astro
<!-- BiomeThreatMatrix.astro -->
<section class="threat-matrix">
  <header class="matrix-header">
    <h2 class="matrix-title">IEZ ENVIRONMENTAL THREAT ASSESSMENT</h2>
    <div class="matrix-controls">
      <button class="control-btn" data-sort="threat">Sort by Threat</button>
      <button class="control-btn" data-sort="location">Sort by Location</button>
      <button class="control-btn" data-filter="available">Show Available</button>
    </div>
  </header>

  <div class="matrix-grid">
    {biomes.map(biome => (
      <div class="threat-cell" data-threat={biome.threatTier}>
        <!-- Threat indicator -->
        <div class="threat-indicator">
          <span class="threat-level">{biome.threatTier}</span>
          <span class="threat-label">{biome.threatLevel}</span>
        </div>

        <!-- Biome visualization -->
        <div class="biome-visual">
          <canvas
            class="biome-canvas"
            data-biome={biome.id}
            data-particles={biome.hazards.length}
          />
          <img
            src={`/images/biomes/${biome.id}-preview.webp`}
            alt={biome.displayName}
            class="biome-image"
            loading="lazy"
          />
        </div>

        <!-- Biome data -->
        <div class="biome-intel">
          <h3 class="biome-name">{biome.displayName}</h3>
          <p class="biome-location">SECTOR: {biome.location}</p>

          <!-- Hazard warnings -->
          <div class="hazard-list">
            {biome.hazards.slice(0, 3).map(hazard => (
              <span class="hazard-tag" data-severity={getHazardSeverity(hazard)}>
                {hazard}
              </span>
            ))}
            {biome.hazards.length > 3 && (
              <span class="hazard-more">+{biome.hazards.length - 3} more</span>
            )}
          </div>

          <!-- Entry status -->
          <div class="entry-status">
            {biome.launchStatus === 'ea-launch' ? (
              <span class="status-active">DEPLOYMENT ACTIVE</span>
            ) : (
              <span class="status-locked">CLEARANCE PENDING</span>
            )}
          </div>
        </div>

        <!-- Hover detail panel -->
        <div class="threat-detail">
          <div class="detail-content">
            <p class="detail-description">{biome.description}</p>

            <div class="detail-stats">
              <div class="stat-item">
                <span class="stat-label">Climate</span>
                <span class="stat-value">{biome.visualCharacteristics.climate}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Visibility</span>
                <span class="stat-value">{biome.visualCharacteristics.visibility}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Faction Control</span>
                <span class="stat-value">{biome.factionPresence.join(', ')}</span>
              </div>
            </div>

            <button class="detail-deploy">
              REQUEST DEPLOYMENT CLEARANCE
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>

  <!-- IEZ Core special warning -->
  <div class="iez-warning">
    <div class="warning-content">
      <h3>⚠ IEZ CORE WARNING ⚠</h3>
      <p>Central Grasslands designated as INTERDICTION EXCLUSION ZONE.</p>
      <p>Reality stability: CRITICAL. Monolith influence: EXTREME.</p>
      <p>Deployment requires APEX clearance and phase stabilization equipment.</p>
    </div>
  </div>
</section>
```

---

## Part 3: Page-by-Page Design Strategy

### 3.1 Homepage: The Recruitment Terminal

**Emotional Journey**: Curiosity → Unease → Determination → Action

#### Page Structure

```
[Navigation Anchor Points]
  ↓
[Hero: Reality Cascade] - 100vh, immediate impact
  ↓
[Transmission Intercept] - Lore snippet, 30vh
  ↓
[Threat Assessment] - Interactive biome grid, 80vh
  ↓
[Faction Recruitment] - Philosophy choice, 100vh
  ↓
[Mission Briefing] - Features as intel, 60vh
  ↓
[Deployment Ready] - Strong CTA, 40vh
  ↓
[Field Reports] - News/updates as transmissions, 60vh
```

#### Key Sections Design

**Transmission Intercept**: Between hero and main content
```astro
<section class="transmission-intercept">
  <div class="transmission-frame">
    <div class="transmission-header">
      <span class="signal-strength">SIGNAL: 67%</span>
      <span class="timestamp">2175.234.14:27:03</span>
    </div>
    <div class="transmission-content" data-scramble>
      <p class="transmission-text">
        "They don't harvest crops. They harvest <span class="corrupt">reality</span>.
        Every extraction leaves the world a little more <span class="corrupt">wrong</span>.
        But we found something in the IEZ. Something that lets us
        <span class="emphasis">fight back</span>."
      </p>
      <p class="transmission-source">
        - Intercepted from Sky Bastion Directorate, Squad Romeo-7
      </p>
    </div>
  </div>
</section>
```

### 3.2 Factions Page: The Philosophy Chamber

**Purpose**: Not picking a class, but choosing how you'll survive

#### Layout Concept: The War Room

```astro
<main class="factions-warroom">
  <!-- Central holographic table -->
  <section class="faction-table">
    <div class="table-projection">
      <!-- 3D CSS transform for perspective -->
      <div class="projection-grid">
        {factions.map((faction, index) => (
          <div
            class="faction-node"
            data-faction={faction.id}
            style={`--rotation: ${index * 36}deg`}
          >
            <!-- Faction emblem floating -->
            <div class="node-emblem">
              <img src={faction.emblem} alt={faction.name} />
            </div>

            <!-- Connection lines to other factions -->
            <svg class="node-connections">
              {/* Draw lines showing faction relationships */}
            </svg>
          </div>
        ))}
      </div>

      <!-- Central IEZ representation -->
      <div class="iez-core-hologram">
        <div class="hologram-layers">
          <div class="layer-1"></div>
          <div class="layer-2"></div>
          <div class="layer-3"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Faction detail panel -->
  <section class="faction-detail-panel">
    <div class="panel-content">
      <!-- Populated via JavaScript when faction selected -->
    </div>
  </section>

  <!-- Faction comparison tool -->
  <section class="faction-comparison">
    <h2>TACTICAL COMPARISON MATRIX</h2>
    <div class="comparison-grid">
      <!-- Interactive comparison interface -->
    </div>
  </section>
</main>
```

### 3.3 Individual Faction Pages: Deep Dive Dossiers

**Design as**: Classified faction intelligence files

```astro
<!-- /factions/[id].astro -->
<main class="faction-dossier" data-classification="LEVEL-3">
  <!-- Classification header -->
  <header class="dossier-header">
    <div class="classification-stamp">
      <span>CLASSIFIED</span>
      <span>LEVEL 3 CLEARANCE REQUIRED</span>
    </div>
    <h1 class="faction-designation">{faction.name}</h1>
  </header>

  <!-- Visual hero with faction in action -->
  <section class="faction-hero">
    <video
      class="hero-footage"
      autoplay
      muted
      loop
      poster={`/images/factions/${faction.id}-poster.webp`}
    >
      <source src={`/videos/factions/${faction.id}-hero.mp4`} type="video/mp4" />
    </video>
    <div class="hero-overlay">
      <blockquote class="faction-creed">
        "{faction.philosophy}"
      </blockquote>
    </div>
  </section>

  <!-- Tactical assessment -->
  <section class="tactical-assessment">
    <div class="assessment-grid">
      <!-- Strengths -->
      <div class="assessment-block strengths">
        <h2>TACTICAL ADVANTAGES</h2>
        <ul class="advantage-list">
          {faction.strengths.map(strength => (
            <li class="advantage-item">
              <span class="indicator">+</span>
              {strength}
            </li>
          ))}
        </ul>
      </div>

      <!-- Weaknesses -->
      <div class="assessment-block weaknesses">
        <h2>OPERATIONAL LIMITATIONS</h2>
        <ul class="limitation-list">
          {faction.weaknesses.map(weakness => (
            <li class="limitation-item">
              <span class="indicator">-</span>
              {weakness}
            </li>
          ))}
        </ul>
      </div>

      <!-- Abilities -->
      <div class="assessment-block abilities">
        <h2>UNIQUE CAPABILITIES</h2>
        <div class="ability-cards">
          {faction.uniqueAbilities.map(ability => (
            <div class="ability-card">
              <h3 class="ability-name">{ability.name}</h3>
              <p class="ability-description">{ability.description}</p>
              <span class="ability-cooldown">Cooldown: {ability.cooldown}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>

  <!-- Squad synergy -->
  <section class="squad-synergy">
    <h2>SQUAD COMPOSITION ANALYSIS</h2>
    <div class="synergy-matrix">
      <!-- Show how this faction works with others -->
    </div>
  </section>

  <!-- Field reports -->
  <section class="field-reports">
    <h2>RECENT FIELD REPORTS</h2>
    <div class="report-feed">
      <!-- Simulated player reports/testimonials -->
    </div>
  </section>
</main>
```

### 3.4 About Page: The Lore Archive

**Redesign as**: Corrupted historical database

```astro
<main class="lore-archive">
  <!-- Timeline interface -->
  <section class="temporal-timeline">
    <h1>TEMPORAL RECORD: 2147-2175</h1>
    <div class="timeline-container">
      <div class="timeline-track">
        <!-- Key events as nodes -->
        <div class="timeline-node" data-year="2147">
          <h3>The Harvester Arrival</h3>
          <p>First contact. Cities fall in hours.</p>
        </div>
        <div class="timeline-node critical" data-year="2161">
          <h3>Monolith Cascade</h3>
          <p>Reality breaks. The IEZ is born.</p>
        </div>
        <div class="timeline-node" data-year="2175">
          <h3>Present Day</h3>
          <p>Humanity adapts. The extraction begins.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Classified files -->
  <section class="classified-files">
    <div class="file-grid">
      <article class="file-entry" data-corruption="12%">
        <h2>FILE: HARVESTER-ORIGIN-7B</h2>
        <div class="file-content">
          <p>They came through [REDACTED] dimensional fold...</p>
        </div>
      </article>
    </div>
  </section>
</main>
```

---

## Part 4: Interaction Patterns & Motion Design

### 4.1 Micro-Interactions

**Every interaction should feel like manipulating corrupted technology**

#### Button States
```css
.btn-primary {
  position: relative;
  background: var(--bloom-gray-900);
  border: 2px solid var(--bloom-cyan);
  color: var(--bloom-cyan);
  padding: var(--space-md) var(--space-xl);
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: var(--bloom-cyan);
  transform: translate(-50%, -50%);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-primary:hover {
  color: var(--bloom-black);
  border-color: var(--bloom-cyan-glow);
  box-shadow:
    0 0 30px var(--bloom-cyan),
    inset 0 0 30px rgba(0, 212, 224, 0.2);
  transform: scale(1.05);
}

.btn-primary:hover::before {
  width: 120%;
  height: 120%;
}

.btn-primary:active {
  animation: reality-break 0.2s ease-out;
}
```

#### Form Inputs as Terminal Interfaces
```css
.input-terminal {
  background: var(--bloom-black);
  border: 1px solid var(--bloom-gray-700);
  color: var(--bloom-cyan);
  padding: var(--space-md);
  font-family: var(--font-mono);
  position: relative;
}

.input-terminal:focus {
  outline: none;
  border-color: var(--bloom-cyan);
  box-shadow:
    0 0 20px rgba(0, 212, 224, 0.3),
    inset 0 0 10px rgba(0, 212, 224, 0.1);
}

.input-terminal::placeholder {
  color: var(--bloom-gray-600);
  font-style: italic;
}

/* Typing animation */
.input-terminal:focus::after {
  content: '█';
  position: absolute;
  animation: blink 1s step-start infinite;
  color: var(--bloom-cyan);
}
```

### 4.2 Page Transitions

**Transition between pages like phase-shifting between dimensions**

```javascript
// Page transition controller
class PhaseTransition {
  constructor() {
    this.duration = 800;
    this.init();
  }

  init() {
    // Intercept all navigation
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[href^="/"]');
      if (link) {
        e.preventDefault();
        this.phaseShift(link.href);
      }
    });
  }

  phaseShift(destination) {
    // Phase 1: Destabilize current reality
    document.body.classList.add('phase-shifting');

    // Create distortion overlay
    const overlay = document.createElement('div');
    overlay.className = 'phase-overlay';
    overlay.innerHTML = `
      <div class="phase-grid">
        ${Array(20).fill('').map(() =>
          '<div class="phase-cell"></div>'
        ).join('')}
      </div>
      <div class="phase-static"></div>
    `;
    document.body.appendChild(overlay);

    // Phase 2: Transition
    setTimeout(() => {
      window.location.href = destination;
    }, this.duration);
  }
}
```

### 4.3 Scroll Behaviors

**Scrolling should reveal the world, not just move the page**

```css
/* Parallax depth layers */
.parallax-container {
  position: relative;
  overflow: hidden;
}

.parallax-layer {
  position: absolute;
  will-change: transform;
}

.parallax-layer[data-depth="0.1"] {
  transform: translateY(calc(var(--scroll-y) * 0.1px));
}

.parallax-layer[data-depth="0.3"] {
  transform: translateY(calc(var(--scroll-y) * 0.3px));
}

.parallax-layer[data-depth="0.5"] {
  transform: translateY(calc(var(--scroll-y) * 0.5px));
}

/* Reveal animations */
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered reveals */
.reveal-stagger:nth-child(1) { transition-delay: 0ms; }
.reveal-stagger:nth-child(2) { transition-delay: 100ms; }
.reveal-stagger:nth-child(3) { transition-delay: 200ms; }
.reveal-stagger:nth-child(4) { transition-delay: 300ms; }
```

### 4.4 Loading States

**Loading isn't waiting—it's stabilizing reality**

```astro
<!-- LoadingState.astro -->
<div class="loading-stabilizer">
  <div class="stabilizer-core">
    <div class="core-rings">
      <div class="ring ring-1"></div>
      <div class="ring ring-2"></div>
      <div class="ring ring-3"></div>
    </div>
    <div class="core-energy"></div>
  </div>

  <div class="stabilizer-status">
    <p class="status-text" data-text="CALIBRATING PHASE VARIANCE">
      CALIBRATING PHASE VARIANCE
    </p>
    <div class="status-bar">
      <div class="bar-fill"></div>
    </div>
    <p class="status-percentage">0%</p>
  </div>
</div>
```

---

## Part 5: Mobile & Responsive Strategy

### 5.1 Mobile-First Philosophy

**The IEZ doesn't care about your screen size**

```css
/* Base mobile styles - corruption intact */
.faction-terminal {
  background: var(--bloom-gray-900);
  border: 1px solid var(--bloom-gray-700);
  padding: var(--space-md);
}

/* Tablet enhancement */
@media (min-width: 768px) {
  .faction-terminal {
    border-width: 2px;
    padding: var(--space-lg);
  }

  /* Add scan lines on larger screens */
  .faction-terminal::before {
    content: '';
    /* Scan line effect */
  }
}

/* Desktop full experience */
@media (min-width: 1024px) {
  .faction-terminal {
    /* Full glitch effects */
    /* Hover interactions */
    /* Advanced animations */
  }
}
```

### 5.2 Performance Budget

**Mobile devices in 2025 can handle more, but battery matters**

```javascript
// Progressive enhancement based on device capability
class PerformanceManager {
  constructor() {
    this.tier = this.detectTier();
    this.applyTier();
  }

  detectTier() {
    const connection = navigator.connection;
    const memory = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // High-end: All effects
    if (memory >= 8 && cores >= 4) return 'high';

    // Mid-tier: Reduce particle effects
    if (memory >= 4 && cores >= 2) return 'medium';

    // Low-end: Minimal effects, focus on content
    return 'low';
  }

  applyTier() {
    document.documentElement.dataset.performanceTier = this.tier;

    if (this.tier === 'low') {
      // Disable particle canvas
      // Reduce animation complexity
      // Simplify gradients
    }
  }
}
```

---

## Part 6: Implementation Roadmap

### Phase 1: Foundation (Week 1)
1. Implement new color system
2. Replace typography
3. Create base component library
4. Set up animation utilities

### Phase 2: Core Components (Week 2)
1. Build NavigationAnchor
2. Create HeroCascade
3. Develop FactionTerminal
4. Design BiomeThreatMatrix

### Phase 3: Page Assembly (Week 3)
1. Redesign homepage
2. Build factions hub
3. Create individual faction pages
4. Develop about/lore archive

### Phase 4: Polish & Optimize (Week 4)
1. Add micro-interactions
2. Implement page transitions
3. Optimize for mobile
4. Performance testing
5. Accessibility audit

---

## Conclusion: The Soul of Bloom

This design transforms the Bloom website from a generic gaming template into an **experience**. Visitors won't just read about the IEZ—they'll feel its instability. They won't just pick a faction—they'll choose a philosophy of survival.

Every glitch, every distortion, every corrupted pixel serves the narrative: **Reality is broken, and we're inviting you to break it further.**

The website becomes a recruitment terminal, a field manual, and a warning all at once. It respects the player's intelligence while creating an atmosphere of "awe-tinged dread" that defines Bloom.

When someone lands on this site, they should feel the same tension as when they first deploy into the IEZ—excited, nervous, and absolutely certain they're about to experience something unlike anything else.

**This is Bloom. Reality breaks here. Welcome to the cascade.**