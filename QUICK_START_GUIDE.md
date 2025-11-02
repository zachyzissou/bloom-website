# Quick Start Guide - Using Bloom Wiki Data

This is your fast-track guide to using the extracted Bloom game data in your marketing website.

---

## What You Have

### 4 JSON Data Files (Ready to Use)

Located in `/mnt/c/Users/Zachg/Bloom-Website/src/data/`:

1. **factions.json** - 10 playable factions with complete details
2. **biomes.json** - 12 biomes across 3 difficulty tiers
3. **features.json** - All game features organized by category
4. **roadmap.json** - Development timeline and content schedule

---

## Quick Implementation

### Option 1: Direct JSON Import (Fastest)

```astro
---
// Any .astro page
import factionData from '../data/factions.json';
import biomeData from '../data/biomes.json';

const { factions } = factionData;
const { biomes } = biomeData;
---

<div>
  {factions.map(faction => (
    <div class="faction-card">
      <h3>{faction.name}</h3>
      <p>{faction.lore}</p>
    </div>
  ))}
</div>
```

### Option 2: Astro Content Collections (Recommended)

See `ASTRO_INTEGRATION_EXAMPLES.md` for complete setup.

---

## Marketing Page Priorities

### 1. Homepage Hero (5 minutes)

```astro
---
import roadmapData from '../data/roadmap.json';
const { currentSprint } = roadmapData.developmentPhases;
---

<section class="hero">
  <h1>Bloom</h1>
  <p>8-10 Player Co-op Extraction Shooter</p>
  <p class="tagline">Choose Your Faction. Master the 32km World. Extract or Die.</p>
  <div class="status">
    <strong>Development Status:</strong> Week {currentSprint.week}
    <span>Q1 2026 Early Access</span>
  </div>
  <a href="#signup" class="cta-button">Join the Waitlist</a>
</section>
```

### 2. Factions Showcase (10 minutes)

```astro
---
import factionData from '../data/factions.json';
const eaFactions = factionData.factions.filter(f => f.launchStatus === 'ea-launch');
---

<section class="factions">
  <h2>Choose Your Faction</h2>
  <div class="faction-grid">
    {eaFactions.map(faction => (
      <div class="faction-card" style={`border-color: ${faction.colors.primary}`}>
        <h3>{faction.name}</h3>
        <span class="role">{faction.role}</span>
        <p>{faction.lore}</p>
        <div class="ability">
          <strong>Co-op Ability:</strong>
          <p>{faction.coopAbility}</p>
        </div>
      </div>
    ))}
  </div>
  <p class="expansion-note">+ 6 more factions coming in post-launch expansions</p>
</section>
```

### 3. World Map Overview (15 minutes)

```astro
---
import biomeData from '../data/biomes.json';
const eaBiomes = biomeData.biomes.filter(b => b.launchStatus === 'ea-launch');
---

<section class="world">
  <h2>Explore the 32km x 32km World</h2>
  <p>1024 procedurally generated tiles across 12 unique biomes</p>

  <div class="biome-showcase">
    {eaBiomes.map(biome => (
      <div class={`biome-card tier-${biome.threatTier.toLowerCase()}`}>
        <h3>{biome.displayName}</h3>
        <span class="threat">{biome.threatLevel}</span>
        <p>{biome.description}</p>
        <div class="features">
          {biome.keyFeatures.slice(0, 3).map(feature => (
            <span class="feature-tag">{feature}</span>
          ))}
        </div>
      </div>
    ))}
  </div>
</section>

<style>
  .tier-h1 { border-color: #32CD32; }
  .tier-h2 { border-color: #FFA500; }
  .tier-h3 { border-color: #DC143C; }
</style>
```

### 4. Roadmap Transparency (10 minutes)

```astro
---
import roadmapData from '../data/roadmap.json';
const { eaLaunch, month3to6, month6to9 } = roadmapData.contentRoadmap;
---

<section class="roadmap">
  <h2>Development Roadmap</h2>

  <div class="timeline">
    <div class="milestone ea">
      <h3>Early Access - {eaLaunch.date}</h3>
      <ul>
        <li>{eaLaunch.factions.length} Factions</li>
        <li>{eaLaunch.biomes.length} Biomes</li>
        <li>8-10 Player Co-op</li>
        <li>Full Extraction Shooter</li>
      </ul>
    </div>

    <div class="milestone expansion">
      <h3>Expansion 1 - {month3to6.date}</h3>
      <ul>
        <li>+3 Factions</li>
        <li>+3 Biomes</li>
        <li>Advanced AI</li>
      </ul>
    </div>

    <div class="milestone expansion">
      <h3>Expansion 2 - {month6to9.date}</h3>
      <ul>
        <li>+3 Factions (10 total)</li>
        <li>+3 Biomes (12 total)</li>
        <li>Endgame Content</li>
      </ul>
    </div>
  </div>
</section>
```

---

## Key Messaging (Copy & Paste)

### Taglines

```
"Survive Together in a 32km Wasteland"
"8-10 Players. 10 Factions. 12 Biomes. One Goal: Extract or Die."
"Co-op Extraction Shooter. Deep Faction Synergy. Massive Procedural World."
```

### Feature Highlights

```
✓ 8-10 player PvE co-op with faction synergy
✓ 32km x 32km procedural world (1024 tiles)
✓ 10 unique factions with distinct playstyles
✓ 12 biomes from frozen peaks to toxic wetlands
✓ Dynamic weather system (14 types)
✓ Extraction shooter with high-risk, high-reward gameplay
```

### Development Status

```
Current Status: Week 10/12 of Q1 2026 EA Sprint

✅ Complete: Terrain generation, weather system, world architecture
🔄 In Progress: Multiplayer foundation, core gameplay loop
🔜 Coming Soon: Early Access launch Q1 2026

Built on Unity 6 + HDRP | Target: 60+ FPS on RTX 2060 6GB
```

---

## Common Use Cases

### Display Faction Count by Status

```astro
---
import factionData from '../data/factions.json';
const eaCount = factionData.factions.filter(f => f.launchStatus === 'ea-launch').length;
const expansionCount = factionData.factions.filter(f => f.launchStatus === 'expansion').length;
---

<p>{eaCount} factions at EA launch, {expansionCount} more in expansions</p>
```

### Show Biomes by Difficulty

```astro
---
import biomeData from '../data/biomes.json';
const byTier = {
  H1: biomeData.biomes.filter(b => b.threatTier === 'H1'),
  H2: biomeData.biomes.filter(b => b.threatTier === 'H2'),
  H3: biomeData.biomes.filter(b => b.threatTier === 'H3'),
};
---

<div class="difficulty-breakdown">
  <div class="safe">
    <h4>Safe Zones (H1)</h4>
    <p>{byTier.H1.length} biomes for learning</p>
  </div>
  <div class="medium">
    <h4>Medium Threat (H2)</h4>
    <p>{byTier.H2.length} biomes for experienced players</p>
  </div>
  <div class="hardcore">
    <h4>Hardcore (H3)</h4>
    <p>{byTier.H3.length} biomes for experts only</p>
  </div>
</div>
```

### Feature Status Icons

```astro
---
import featuresData from '../data/features.json';
const coreFeatures = featuresData.gameFeatures.core.features;

const statusIcons = {
  'complete': '✅',
  'in-development': '🔄',
  'planned': '🔜',
  'partial': '⚙️'
};
---

<ul class="feature-list">
  {coreFeatures.map(feature => (
    <li>
      <span class="status">{statusIcons[feature.status]}</span>
      <strong>{feature.name}</strong>
      <p>{feature.description}</p>
    </li>
  ))}
</ul>
```

---

## Styling Tips

### Faction Color Theming

Each faction has primary, secondary, and accent colors:

```css
.faction-card {
  border-left: 4px solid var(--faction-primary);
  background: linear-gradient(
    135deg,
    var(--faction-primary)20,
    var(--faction-secondary)20
  );
}
```

### Threat Tier Colors

Consistent color scheme across the site:

```css
:root {
  --tier-h1: #32CD32; /* Safe - Green */
  --tier-h2: #FFA500; /* Medium - Orange */
  --tier-h3: #DC143C; /* Hardcore - Red */
}
```

### Status Indicators

```css
.status-complete { color: #32CD32; }
.status-in-progress { color: #FFA500; }
.status-planned { color: #666; opacity: 0.7; }
```

---

## Content Writing Guidelines

### Tone Examples

**Good (Aspirational + Honest):**
> "Bloom is an 8-10 player co-op extraction shooter set in a massive 32km world. Currently in Week 10/12 of development, we're building toward Q1 2026 Early Access with 4 factions, 6 biomes, and core extraction gameplay. Our terrain generation system is production-ready, and multiplayer is coming soon."

**Avoid (Overpromise):**
> "The ultimate extraction shooter experience with revolutionary AI and groundbreaking graphics!"

**Avoid (Too Negative):**
> "Still early in development with lots of missing features and bugs to fix."

### Feature Descriptions

**Complete Features** - Present tense, confident:
> "The weather system creates dynamic atmospheric conditions across all 12 biomes with 14 distinct weather types."

**In-Progress Features** - Active development, optimistic:
> "We're implementing Unity Netcode multiplayer foundation to support 8-10 concurrent players in co-op sessions."

**Planned Features** - Future tense, exciting but realistic:
> "Post-launch expansions will introduce 6 additional factions, each with unique abilities and playstyles."

---

## Next Steps

1. **Copy a page template** from `ASTRO_INTEGRATION_EXAMPLES.md`
2. **Customize the styling** to match your brand
3. **Add images** for factions and biomes (request from art team)
4. **Test responsive design** on mobile/tablet
5. **Set up analytics** to track interest

---

## Quick Reference

### File Locations
- Data: `/src/data/factions.json`, `/src/data/biomes.json`, etc.
- Examples: `/ASTRO_INTEGRATION_EXAMPLES.md`
- Summary: `/DATA_EXTRACTION_SUMMARY.md`

### Key Numbers
- Factions: 10 total (4 EA, 6 expansion)
- Biomes: 12 total (6 EA, 6 expansion)
- World Size: 32km x 32km (1024 tiles)
- Players: 8-10 concurrent co-op
- Weather Types: 14
- Development: Week 10/12, Q1 2026 EA

### Marketing Keywords
- "8-10 player co-op extraction shooter"
- "32km procedural world"
- "Faction synergy gameplay"
- "Deep Rock Galactic-inspired teamwork"
- "High-stakes loot and extraction"
- "Unity 6 + HDRP visuals"

---

**Ready to build your marketing site? Start with the homepage hero and faction showcase - they'll give you the biggest impact in the least time!**
