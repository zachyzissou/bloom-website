# Bloom Wiki Content Extraction Summary

## Overview

This document summarizes the content extracted from `/mnt/c/Users/Zachg/Bloom/Wiki/` and structured for use in the Bloom marketing website.

**Source**: Bloom Wiki (Week 10/12 - Q1 2026 EA Sprint)
**Extraction Date**: November 1, 2025
**Output Location**: `/mnt/c/Users/Zachg/Bloom-Website/src/data/`

---

## Extracted Data Files

### 1. `/src/data/factions.json`

**10 Playable Factions** with complete marketing information:

#### EA Launch Factions (4)
- **Sky Bastion Directorate** - Tank/Leader (Supply drops, damage resist)
- **Iron Vultures** - Scavenger/DPS (Loot detection, equipment theft)
- **Aegis Collective** - Medic/Support (Healing, defensive fortifications)
- **The Seventy-Seven** - All-Rounder (Versatility, XP boost)

#### Expansion Factions (6)
- **Helix Syndicate** - Tech/Engineer (Month 3-6)
- **The Wayfarers** - Scout/Mobility (Month 3-6)
- **Obsidian Archive** - Stealth/Intel (Month 3-6)
- **North Guard** - Anti-Forged Defender (Month 6-9)
- **The Pact of Ash** - Food Provider/Support (Month 6-9)
- **Apex Dynamics** - Elite Hunter (Month 6-9)

#### Data Structure Per Faction
```json
{
  "id": "FCT_XXX",
  "name": "Full faction name",
  "shortName": "Display name",
  "role": "Combat role",
  "coopAbility": "Co-op synergy description",
  "homeBiome": "Home biome name",
  "launchStatus": "ea-launch | expansion",
  "launchWindow": "EA Launch | Month 3-6 | Month 6-9",
  "philosophy": "Faction philosophy",
  "specialty": "Combat specialty",
  "lore": "1-2 sentence lore snippet",
  "colors": { "primary", "secondary", "accent" },
  "playstyle": "Tactical playstyle description",
  "strengths": ["Array of strengths"],
  "weaknesses": ["Array of weaknesses"],
  "uniqueAbilities": [{ "name", "description", "cooldown" }]
}
```

---

### 2. `/src/data/biomes.json`

**12 Unique Biomes** across three difficulty tiers:

#### EA Launch Biomes (6)
- **ForestHills** - H1 (Safe) - Tutorial zone with metro tunnels
- **SouthwestPlains** - H1 (Safe) - Pact farmlands and convoys
- **WesternMountains** - H2 (Medium) - Machine Grave salvage
- **EasternPlateaus** - H2 (Medium) - Crimson Freeport trading hub
- **SnowPeaks** - H2 (Medium) - Northern military zones
- **CentralGrasslands (IEZ Core)** - H3 (Hardcore) - Monolith ground zero

#### Post-Launch Biomes (6)
- **Urban Ruins** - H3 (Hardcore) - Vertical combat, corporate warfare
- **Desert Wastes** - H2 (Medium) - Energy crystals, extreme heat
- **Coastal Regions** - H2 (Medium) - Amphibious combat, naval wrecks
- **Toxic Wetlands** - H3 (Hardcore) - Bio-hazards, monster hunting
- **Volcanic Fields** - H3 (Hardcore) - Extreme heat, molten hazards
- **Arctic Tundra** - H3 (Hardcore) - Forged factory, extreme cold

#### Data Structure Per Biome
```json
{
  "id": "biome-identifier",
  "name": "BiomeName",
  "displayName": "Display Name",
  "threatTier": "H1 | H2 | H3",
  "threatLevel": "Safe | Medium | Hardcore",
  "location": "Geographic location",
  "launchStatus": "ea-launch | expansion",
  "launchWindow": "EA Launch | Month 6-9",
  "geography": "Terrain description",
  "macroFeatures": ["Array of features"],
  "visualCharacteristics": {
    "climate", "temperature", "weather", "visibility", "terrain"
  },
  "keyFeatures": ["Array of notable features"],
  "factionPresence": ["Array of faction names"],
  "hazards": ["Array of environmental dangers"],
  "resources": ["Array of available loot"],
  "description": "Marketing description"
}
```

---

### 3. `/src/data/features.json`

**Core Game Features** organized by category:

#### Categories
1. **Core Gameplay** - Multiplayer, world, factions, extraction
2. **Dynamic World Systems** - Weather, terrain, streaming
3. **Technical Excellence** - Engine, networking, performance
4. **Combat & Survival** - Abilities, enemies, hazards
5. **Progression & Customization** - Skills, gear, economy

#### Feature Status Indicators
- `complete` - Production-ready
- `in-development` - Active work in progress
- `planned` - Designed but not yet implemented
- `partial` - Partially complete

#### Technical Specifications
- **Engine**: Unity 6000.2.2f1 with HDRP 17.2.0
- **Networking**: Unity Netcode + Steamworks P2P
- **Performance**: 60+ FPS on RTX 2060 6GB
- **World**: 32km x 32km, 1024 tiles
- **Players**: 8-10 concurrent co-op

---

### 4. `/src/data/roadmap.json`

**Development Roadmap** with milestone tracking:

#### Current Status
- **Week 10/12** of Q1 2026 EA Sprint
- **83% Complete** - Terrain and weather systems done
- **Critical Path**: Multiplayer implementation (Week 11-12)

#### Development Phases
1. **Phase 1: Terrain & World** (Complete)
   - Multi-tile terrain generation
   - 38 macro geographic features
   - 14 weather types
   - Seamless edge contracts

2. **Phase 2: Multiplayer & Core** (In Progress)
   - Unity Netcode foundation
   - Core extraction gameplay
   - Performance validation
   - EA launch preparation

3. **Phase 3: EA Launch** (Q1 2026)
   - 4 factions, 6 biomes
   - 8-10 player co-op
   - Core extraction shooter

#### Content Roadmap
- **EA Launch**: 4 factions, 6 biomes, core gameplay
- **Month 1-3**: Polish, balance, feedback
- **Month 3-6**: +3 factions, +3 biomes, advanced AI
- **Month 6-9**: +3 factions, +3 biomes, endgame content

---

## Marketing Messaging Guidelines

### Tone: Aspirational but Honest

✅ **DO**:
- Highlight the vision: massive co-op extraction shooter
- Emphasize unique features: faction synergy, 32km world
- Show development progress transparently
- Build excitement for EA launch and expansions
- Focus on completed systems (terrain, weather)

❌ **DON'T**:
- Overpromise on incomplete features
- Ignore EA status - be upfront about development
- Dwell on challenges or delays
- Compare unfavorably to competitors
- Hide that multiplayer is still in development

### Key Selling Points

1. **Massive Co-op Scale**
   - "8-10 players working together across a 32km world"
   - "Deep Rock Galactic-inspired faction synergy"

2. **Procedural World**
   - "1024 unique tiles with seamless generation"
   - "38 geographic features creating natural landscapes"

3. **Extraction Shooter Core**
   - "High-stakes missions where every choice matters"
   - "Extract with your loot or lose everything"

4. **Faction Diversity**
   - "10 unique factions, each changing how you play"
   - "From military tanks to stealth specialists"

5. **Dynamic World**
   - "14 weather types affecting gameplay"
   - "12 distinct biomes from arctic to volcanic"

### Development Transparency

**What's Complete** (Week 10/12):
- ✅ Terrain generation system (production-ready)
- ✅ Weather system (14 types, biome-specific)
- ✅ World architecture (32km x 32km framework)
- ✅ ServiceLocator performance optimization

**What's In Progress** (Week 11-12):
- 🔄 Multiplayer foundation (Unity Netcode + Steam)
- 🔄 Core extraction gameplay loop
- 🔄 Faction ability implementation
- 🔄 Performance optimization (60+ FPS target)

**What's Coming** (Q1 2026 EA):
- 🔜 4 playable factions
- 🔜 6 unique biomes
- 🔜 8-10 player co-op missions
- 🔜 Full extraction shooter mechanics

---

## Usage Recommendations

### For Astro Content Collections

These JSON files are ready for Astro content collections:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const factionsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    coopAbility: z.string(),
    // ... etc
  })
});

const biomesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    threatTier: z.enum(['H1', 'H2', 'H3']),
    // ... etc
  })
});
```

### For Marketing Pages

#### Homepage Hero
```
"Survive Together in a 32km Wasteland"
8-10 player co-op extraction shooter
Choose your faction. Master your biome. Extract or die.
```

#### Factions Page
- Feature all 10 factions with role icons
- Highlight EA launch vs expansion status
- Show faction synergy combinations
- Link to lore snippets

#### World Page
- Interactive biome map showing all 12 zones
- Filter by difficulty tier (H1/H2/H3)
- Display weather and hazards per biome
- Show faction territories

#### Roadmap Page
- Visual timeline of development phases
- Content release schedule (EA → Month 9)
- Transparent about current week status
- Feature status indicators

---

## Data Quality Notes

### Accuracy
- All data extracted from official Bloom Wiki (Week 10/12)
- Faction information validated against style guides
- Biome data cross-referenced with world scale docs
- Roadmap reflects actual development status

### Completeness
- ✅ All 10 factions documented
- ✅ All 12 biomes detailed
- ✅ Development phases mapped
- ✅ Technical specs included
- ⚠️ Some expansion content is conceptual (Month 6-9)

### Marketing Alignment
- Tone balances aspiration with honesty
- EA status clearly communicated
- Completed work highlighted
- Future content presented as roadmap, not promises

---

## Recommended Next Steps

1. **Integrate with Astro**
   - Set up content collections for factions/biomes
   - Create TypeScript schemas for type safety
   - Build dynamic pages from JSON data

2. **Visual Assets**
   - Request faction logos/icons from art team
   - Create biome preview images
   - Design roadmap timeline graphics

3. **Marketing Copy**
   - Expand faction lore into full character profiles
   - Write biome exploration guides
   - Create developer blog posts about terrain system

4. **Community Engagement**
   - Share roadmap transparency publicly
   - Highlight Week 10 completion milestone
   - Build anticipation for multiplayer alpha

---

## Questions or Issues?

If you need clarification on any extracted data or want to adjust the tone/messaging:

- **Source Documentation**: `/mnt/c/Users/Zachg/Bloom/Wiki/.worktrees/wiki-updates/`
- **Contact**: Development team via project documentation
- **Last Updated**: January 2025 (Week 10/12 status)

---

**Summary**: This extraction provides production-ready structured data for marketing Bloom's unique 8-10 player co-op extraction shooter. The tone is aspirational yet honest about EA status, highlighting completed systems while building excitement for the Q1 2026 launch.
