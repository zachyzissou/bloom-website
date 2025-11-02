# Astro Integration Examples for Bloom Data

This document provides code examples for integrating the extracted Bloom data into your Astro marketing website.

---

## Setup Content Collections

### 1. Configure Content Collections

**File**: `src/content/config.ts`

```typescript
import { defineCollection, z } from 'astro:content';

// Faction schema
const factionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    shortName: z.string(),
    role: z.enum(['tank', 'scavenger', 'medic', 'scout', 'tech', 'defender', 'all-rounder', 'food-provider', 'elite-hunter', 'stealth']),
    coopAbility: z.string(),
    homeBiome: z.string(),
    launchStatus: z.enum(['ea-launch', 'expansion']),
    launchWindow: z.string(),
    philosophy: z.string(),
    specialty: z.string(),
    lore: z.string(),
    colors: z.object({
      primary: z.string(),
      secondary: z.string(),
      accent: z.string(),
    }),
    playstyle: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    uniqueAbilities: z.array(z.object({
      name: z.string(),
      description: z.string(),
      cooldown: z.string(),
    })),
  }),
});

// Biome schema
const biomesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    displayName: z.string(),
    threatTier: z.enum(['H1', 'H2', 'H3']),
    threatLevel: z.enum(['Safe', 'Medium', 'Hardcore']),
    location: z.string(),
    launchStatus: z.enum(['ea-launch', 'expansion']),
    launchWindow: z.string(),
    geography: z.string(),
    macroFeatures: z.array(z.string()),
    visualCharacteristics: z.object({
      climate: z.string(),
      temperature: z.string(),
      weather: z.array(z.string()),
      visibility: z.string(),
      terrain: z.string(),
    }),
    keyFeatures: z.array(z.string()),
    factionPresence: z.array(z.string()),
    hazards: z.array(z.string()),
    resources: z.array(z.string()),
    description: z.string(),
  }),
});

export const collections = {
  factions: factionsCollection,
  biomes: biomesCollection,
};
```

### 2. Move JSON Files to Content Directory

```bash
# Create content directories
mkdir -p src/content/factions
mkdir -p src/content/biomes

# Move data files (or create symlinks)
cp src/data/factions.json src/content/factions/factions.json
cp src/data/biomes.json src/content/biomes/biomes.json
```

---

## Page Examples

### Factions Overview Page

**File**: `src/pages/factions.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import factionData from '../data/factions.json';

const { factions } = factionData;

// Separate EA launch and expansion factions
const eaFactions = factions.filter(f => f.launchStatus === 'ea-launch');
const expansionFactions = factions.filter(f => f.launchStatus === 'expansion');

// Group expansion factions by launch window
const month3to6 = expansionFactions.filter(f => f.launchWindow === 'Month 3-6');
const month6to9 = expansionFactions.filter(f => f.launchWindow === 'Month 6-9');
---

<Layout title="Factions - Bloom">
  <main class="factions-page">
    <section class="hero">
      <h1>Choose Your Faction</h1>
      <p>10 unique playstyles. Deep co-op synergy. Every faction changes how you fight.</p>
    </section>

    <!-- EA Launch Factions -->
    <section class="faction-section">
      <h2>Available at Early Access Launch</h2>
      <div class="faction-grid">
        {eaFactions.map(faction => (
          <div class="faction-card" style={`--faction-color: ${faction.colors.primary}`}>
            <div class="faction-header">
              <h3>{faction.name}</h3>
              <span class="role-badge">{faction.role}</span>
            </div>
            <p class="philosophy">{faction.philosophy}</p>
            <p class="lore">{faction.lore}</p>
            <div class="coop-ability">
              <strong>Co-op Ability:</strong>
              <p>{faction.coopAbility}</p>
            </div>
            <a href={`/factions/${faction.id}`} class="learn-more">
              Learn More →
            </a>
          </div>
        ))}
      </div>
    </section>

    <!-- Expansion Factions -->
    <section class="faction-section expansion">
      <h2>Post-Launch Expansions</h2>

      <div class="expansion-group">
        <h3>Month 3-6 Expansion</h3>
        <div class="faction-grid">
          {month3to6.map(faction => (
            <div class="faction-card expansion-card">
              <div class="faction-header">
                <h4>{faction.name}</h4>
                <span class="role-badge">{faction.role}</span>
              </div>
              <p class="specialty">{faction.specialty}</p>
              <p class="coop-ability">{faction.coopAbility}</p>
            </div>
          ))}
        </div>
      </div>

      <div class="expansion-group">
        <h3>Month 6-9 Expansion</h3>
        <div class="faction-grid">
          {month6to9.map(faction => (
            <div class="faction-card expansion-card">
              <div class="faction-header">
                <h4>{faction.name}</h4>
                <span class="role-badge">{faction.role}</span>
              </div>
              <p class="specialty">{faction.specialty}</p>
              <p class="coop-ability">{faction.coopAbility}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
</Layout>

<style>
  .faction-card {
    border-left: 4px solid var(--faction-color, #666);
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    transition: transform 0.2s;
  }

  .faction-card:hover {
    transform: translateY(-4px);
  }

  .role-badge {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: var(--faction-color, #666);
    border-radius: 1rem;
    font-size: 0.875rem;
    text-transform: capitalize;
  }

  .expansion-card {
    opacity: 0.8;
    border-left-style: dashed;
  }
</style>
```

---

### Individual Faction Detail Page

**File**: `src/pages/factions/[id].astro`

```astro
---
import Layout from '../../layouts/Layout.astro';
import factionData from '../../data/factions.json';

export async function getStaticPaths() {
  const { factions } = factionData;
  return factions.map(faction => ({
    params: { id: faction.id },
    props: { faction },
  }));
}

const { faction } = Astro.props;
---

<Layout title={`${faction.name} - Bloom Factions`}>
  <main class="faction-detail">
    <div class="hero" style={`background: linear-gradient(135deg, ${faction.colors.primary}, ${faction.colors.secondary})`}>
      <h1>{faction.name}</h1>
      <p class="tagline">"{faction.philosophy}"</p>
      <div class="faction-meta">
        <span class="role">{faction.role}</span>
        <span class="status">{faction.launchWindow}</span>
      </div>
    </div>

    <section class="faction-overview">
      <div class="lore-section">
        <h2>Faction Background</h2>
        <p>{faction.lore}</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <h3>Playstyle</h3>
          <p>{faction.playstyle}</p>
        </div>
        <div class="stat-card">
          <h3>Home Biome</h3>
          <p>{faction.homeBiome}</p>
        </div>
        <div class="stat-card">
          <h3>Specialty</h3>
          <p>{faction.specialty}</p>
        </div>
      </div>
    </section>

    <section class="abilities">
      <h2>Co-op Synergy Ability</h2>
      <div class="coop-ability-card">
        <p>{faction.coopAbility}</p>
      </div>

      <h3>Unique Abilities</h3>
      <div class="abilities-grid">
        {faction.uniqueAbilities.map(ability => (
          <div class="ability-card">
            <h4>{ability.name}</h4>
            <p>{ability.description}</p>
            <span class="cooldown">Cooldown: {ability.cooldown}</span>
          </div>
        ))}
      </div>
    </section>

    <section class="strengths-weaknesses">
      <div class="strengths">
        <h3>Strengths</h3>
        <ul>
          {faction.strengths.map(strength => (
            <li>✓ {strength}</li>
          ))}
        </ul>
      </div>
      <div class="weaknesses">
        <h3>Weaknesses</h3>
        <ul>
          {faction.weaknesses.map(weakness => (
            <li>✗ {weakness}</li>
          ))}
        </ul>
      </div>
    </section>
  </main>
</Layout>
```

---

### Biomes Map Page

**File**: `src/pages/world.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import biomeData from '../data/biomes.json';

const { biomes } = biomeData;

// Group by threat tier
const h1Biomes = biomes.filter(b => b.threatTier === 'H1');
const h2Biomes = biomes.filter(b => b.threatTier === 'H2');
const h3Biomes = biomes.filter(b => b.threatTier === 'H3');
---

<Layout title="World Map - Bloom">
  <main class="world-page">
    <section class="hero">
      <h1>Explore the 32km x 32km World</h1>
      <p>12 unique biomes across 1024 procedurally generated tiles</p>
    </section>

    <div class="threat-tier-nav">
      <button data-tier="all" class="active">All Biomes</button>
      <button data-tier="h1" class="safe">H1 - Safe</button>
      <button data-tier="h2" class="medium">H2 - Medium</button>
      <button data-tier="h3" class="hardcore">H3 - Hardcore</button>
    </div>

    <!-- H1 Safe Zones -->
    <section class="biome-tier" data-tier="h1">
      <h2>H1 - Safe Zones</h2>
      <p>Perfect for learning the game and gathering basic resources</p>
      <div class="biome-grid">
        {h1Biomes.map(biome => (
          <div class="biome-card safe">
            <h3>{biome.displayName}</h3>
            <div class="biome-meta">
              <span class="location">{biome.location}</span>
              <span class="launch-status">{biome.launchWindow}</span>
            </div>
            <p class="description">{biome.description}</p>
            <div class="biome-features">
              <strong>Key Features:</strong>
              <ul>
                {biome.keyFeatures.slice(0, 3).map(feature => (
                  <li>{feature}</li>
                ))}
              </ul>
            </div>
            <a href={`/world/${biome.id}`}>Explore Biome →</a>
          </div>
        ))}
      </div>
    </section>

    <!-- H2 Medium Zones -->
    <section class="biome-tier" data-tier="h2">
      <h2>H2 - Medium Threat</h2>
      <p>Balanced risk and reward for experienced operators</p>
      <div class="biome-grid">
        {h2Biomes.map(biome => (
          <div class="biome-card medium">
            <h3>{biome.displayName}</h3>
            <div class="biome-meta">
              <span class="location">{biome.location}</span>
              <span class="launch-status">{biome.launchWindow}</span>
            </div>
            <p class="description">{biome.description}</p>
            <a href={`/world/${biome.id}`}>Explore Biome →</a>
          </div>
        ))}
      </div>
    </section>

    <!-- H3 Hardcore Zones -->
    <section class="biome-tier" data-tier="h3">
      <h2>H3 - Hardcore</h2>
      <p>Extreme danger. Extreme rewards. Expert operators only.</p>
      <div class="biome-grid">
        {h3Biomes.map(biome => (
          <div class="biome-card hardcore">
            <h3>{biome.displayName}</h3>
            <div class="biome-meta">
              <span class="location">{biome.location}</span>
              <span class="launch-status">{biome.launchWindow}</span>
            </div>
            <p class="description">{biome.description}</p>
            <div class="hazards">
              <strong>Hazards:</strong>
              <ul>
                {biome.hazards.slice(0, 4).map(hazard => (
                  <li>⚠ {hazard}</li>
                ))}
              </ul>
            </div>
            <a href={`/world/${biome.id}`}>Explore Biome →</a>
          </div>
        ))}
      </div>
    </section>
  </main>
</Layout>

<script>
  // Biome filtering
  const buttons = document.querySelectorAll('[data-tier]');
  const sections = document.querySelectorAll('.biome-tier');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const tier = button.dataset.tier;

      buttons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      if (tier === 'all') {
        sections.forEach(s => s.style.display = 'block');
      } else {
        sections.forEach(s => {
          s.style.display = s.dataset.tier === tier ? 'block' : 'none';
        });
      }
    });
  });
</script>

<style>
  .biome-card {
    border: 2px solid;
    padding: 1.5rem;
    border-radius: 8px;
  }

  .biome-card.safe { border-color: #32CD32; }
  .biome-card.medium { border-color: #FFA500; }
  .biome-card.hardcore { border-color: #DC143C; }

  .threat-tier-nav button.safe { color: #32CD32; }
  .threat-tier-nav button.medium { color: #FFA500; }
  .threat-tier-nav button.hardcore { color: #DC143C; }
</style>
```

---

### Roadmap Timeline Page

**File**: `src/pages/roadmap.astro`

```astro
---
import Layout from '../layouts/Layout.astro';
import roadmapData from '../data/roadmap.json';

const { developmentPhases, contentRoadmap } = roadmapData;
---

<Layout title="Development Roadmap - Bloom">
  <main class="roadmap-page">
    <section class="hero">
      <h1>Bloom Development Roadmap</h1>
      <p>Transparent development from Week 10/12 to full launch</p>
      <div class="current-status">
        <strong>Current Week:</strong> {developmentPhases.currentSprint.week}
        <div class="progress-bar">
          <div class="progress" style={`width: ${developmentPhases.currentSprint.progress}%`}></div>
        </div>
      </div>
    </section>

    <!-- Technical Roadmap -->
    <section class="technical-timeline">
      <h2>Development Phases</h2>
      {developmentPhases.phases.map(phase => (
        <div class={`phase-card ${phase.status}`}>
          <div class="phase-header">
            <h3>{phase.phase}</h3>
            <span class="status-badge">{phase.status}</span>
          </div>
          {phase.completionDate && (
            <p class="completion-date">Completed: {phase.completionDate}</p>
          )}
          {phase.expectedCompletion && (
            <p class="expected-date">Expected: {phase.expectedCompletion}</p>
          )}
          <ul class="milestones">
            {phase.milestones.map(milestone => (
              <li class={milestone.status}>
                <strong>{milestone.name}</strong>
                {milestone.date && <span class="date">({milestone.date})</span>}
                <p>{milestone.description}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>

    <!-- Content Roadmap -->
    <section class="content-timeline">
      <h2>Content Release Schedule</h2>

      <div class="content-phase ea-launch">
        <h3>Early Access Launch - {contentRoadmap.eaLaunch.date}</h3>
        <div class="content-grid">
          <div>
            <h4>Factions ({contentRoadmap.eaLaunch.factions.length})</h4>
            <ul>
              {contentRoadmap.eaLaunch.factions.map(faction => (
                <li>✓ {faction}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Biomes ({contentRoadmap.eaLaunch.biomes.length})</h4>
            <ul>
              {contentRoadmap.eaLaunch.biomes.map(biome => (
                <li>✓ {biome}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div class="content-phase expansion">
        <h3>First Expansion - {contentRoadmap.month3to6.date}</h3>
        <div class="content-grid">
          <div>
            <h4>New Factions (+{contentRoadmap.month3to6.newFactions.length})</h4>
            <ul>
              {contentRoadmap.month3to6.newFactions.map(faction => (
                <li>🔜 {faction.name} - {faction.role}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>New Biomes (+{contentRoadmap.month3to6.newBiomes.length})</h4>
            <ul>
              {contentRoadmap.month3to6.newBiomes.map(biome => (
                <li>🔜 {biome.name} ({biome.tier})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div class="content-phase expansion">
        <h3>Major Expansion - {contentRoadmap.month6to9.date}</h3>
        <div class="content-grid">
          <div>
            <h4>New Factions (+{contentRoadmap.month6to9.newFactions.length})</h4>
            <ul>
              {contentRoadmap.month6to9.newFactions.map(faction => (
                <li>🔜 {faction.name} - {faction.role}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>New Biomes (+{contentRoadmap.month6to9.newBiomes.length})</h4>
            <ul>
              {contentRoadmap.month6to9.newBiomes.map(biome => (
                <li>🔜 {biome.name} ({biome.tier})</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  </main>
</Layout>

<style>
  .phase-card.complete { border-left: 4px solid #32CD32; }
  .phase-card.in-progress { border-left: 4px solid #FFA500; }
  .phase-card.planned { border-left: 4px solid #666; }

  .status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    text-transform: uppercase;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress {
    height: 100%;
    background: linear-gradient(90deg, #32CD32, #00FF00);
    transition: width 0.3s;
  }
</style>
```

---

## Component Examples

### Faction Role Icon Component

**File**: `src/components/FactionRoleIcon.astro`

```astro
---
interface Props {
  role: string;
  size?: 'sm' | 'md' | 'lg';
}

const { role, size = 'md' } = Astro.props;

const roleIcons = {
  'tank': '🛡️',
  'scavenger': '🔧',
  'medic': '❤️',
  'scout': '👁️',
  'tech': '💻',
  'defender': '🏰',
  'all-rounder': '⭐',
  'food-provider': '🌾',
  'elite-hunter': '🎯',
  'stealth': '🥷',
};

const roleNames = {
  'tank': 'Tank/Leader',
  'scavenger': 'Scavenger/DPS',
  'medic': 'Medic/Support',
  'scout': 'Scout/Mobility',
  'tech': 'Tech/Engineer',
  'defender': 'Defender',
  'all-rounder': 'All-Rounder',
  'food-provider': 'Food Provider',
  'elite-hunter': 'Elite Hunter',
  'stealth': 'Stealth/Intel',
};
---

<div class={`role-icon role-${size}`} title={roleNames[role]}>
  <span class="icon">{roleIcons[role]}</span>
  <span class="label">{roleNames[role]}</span>
</div>

<style>
  .role-icon {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .role-sm { font-size: 0.875rem; }
  .role-md { font-size: 1rem; }
  .role-lg { font-size: 1.25rem; }
</style>
```

---

## Dynamic API Routes

### Faction API Endpoint

**File**: `src/pages/api/factions.json.ts`

```typescript
import type { APIRoute } from 'astro';
import factionData from '../../data/factions.json';

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify(factionData),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
};
```

---

## Summary

These examples show how to:

1. ✅ Set up Astro content collections with proper TypeScript schemas
2. ✅ Create faction overview and detail pages
3. ✅ Build an interactive biome map with filtering
4. ✅ Display development roadmap with timeline
5. ✅ Create reusable components for faction roles
6. ✅ Set up API routes for dynamic data access

All examples maintain the "aspirational but honest" tone while effectively showcasing Bloom's unique features and transparent development progress.
