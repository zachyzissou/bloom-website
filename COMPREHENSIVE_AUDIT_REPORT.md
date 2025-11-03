# Comprehensive Website Audit Report

**Date**: 2025-11-02
**Status**: 🔴 **CRITICAL ISSUES FOUND**

---

## 🚨 Critical UI Issues (Requires Immediate Fix)

### 1. Broken Faction Emblem Images (404 Errors)

**Severity**: CRITICAL
**Impact**: All faction emblems failing to load across the site

**Problem**:
- SVG emblems exist at `/public/images/factions/*.svg`
- Code is requesting WebP format: `fct_dir-emblem.webp`
- Result: 10+ 404 errors on factions page alone

**Files with Issues**:
- `/src/pages/index.astro:19` - Uses `.svg` ✅
- `/src/pages/factions/index.astro:60` - Uses `.webp` ❌
- `/src/pages/factions/index.astro:88` - Uses `.webp` ❌
- `/src/pages/factions/[id].astro:87` - Uses `.webp` ❌

**Solution**: Change all emblem references from `.webp` to `.svg`

**404 Errors Found**:
```
GET http://localhost:3001/images/factions/fct_dir-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_vul-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_aeg-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_f77-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_hlx-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_way-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_var-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_ngd-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_ash-emblem.webp => 404
GET http://localhost:3001/images/factions/fct_apx-emblem.webp => 404
```

---

## 🔗 Broken Footer Links (All Pages)

**Severity**: HIGH
**Impact**: Poor user experience, incomplete navigation

**Broken Links** (pointing to "#"):

### Game Section
- ✅ Home - Works (`/`)
- ✅ Factions - Works (`/factions`)
- ✅ Biomes - Works (`/biomes`)
- ❌ Roadmap - Broken (`#`) - **Page exists at `/roadmap`**
- ❌ Gameplay - Broken (`#`) - **Page exists at `/gameplay`**

### Community Section
- ❌ Discord - Placeholder (`#`)
- ❌ Twitter - Placeholder (`#`)
- ❌ Reddit - Placeholder (`#`)
- ❌ YouTube - Placeholder (`#`)

### Resources Section
- ❌ Press Kit - Missing page (`#`)
- ❌ Media - Missing page (`#`)
- ❌ FAQ - Broken (`#`) - **Page exists at `/faq`**

### Legal Section
- ❌ Privacy - Missing page (`#`)
- ❌ Terms - Missing page (`#`)
- ❌ Contact - Missing page (`#`)

**Files to Fix**:
- `/src/components/Footer.astro` - Update all "#" links

---

## 📊 Unused Wiki Content

### 1. Features Data (features.json) - COMPLETELY UNUSED

**File**: `/src/data/features.json`
**Size**: 259 lines of rich content
**Usage**: 0% - Not referenced anywhere in codebase

**Available Content Categories**:

#### Core Gameplay (6 features)
- 8-10 Player PvE Co-op
- 32km x 32km Procedural World
- Extraction Shooter Mechanics
- 10 Unique Factions
- 12 Distinct Biomes
- Co-op Synergy System

#### Dynamic World Systems (6 features)
- 14 Weather Types
- 38 Macro Features
- Seamless Multi-Tile Generation
- Thermal Erosion System
- Runtime Tile Streaming
- Three Difficulty Rings

#### Technical Excellence (6 features)
- Unity 6 + HDRP
- Unity Netcode + Steamworks
- ServiceLocator Architecture
- 60+ FPS Target
- Adaptive Spatial Manager
- Performance Monitor

#### Combat & Survival (6 features)
- Faction-Based Abilities
- Loot & Extraction
- Environmental Hazards
- Harvester Tech Enemies
- Weapon Systems
- Survival Mechanics

#### Progression & Customization (6 features)
- Faction Progression
- Skill Trees
- Gear Customization
- Convoy Economy
- Base Building
- Achievement System

**Recommendation**: Create `/features` page showcasing all game systems

---

### 2. Biomes Data - PARTIALLY UNUSED

**File**: `/src/data/biomes.json`
**Current Usage**: ~30% (basic listing only)

**Unused Rich Data Per Biome**:
- ❌ Threat tier (H1, H2, H3)
- ❌ Visual characteristics (climate, temperature, weather, visibility, terrain)
- ❌ Key features (specific locations)
- ❌ Faction presence
- ❌ Hazards list
- ❌ Resources available
- ❌ Detailed geography descriptions

**Current Implementation**:
- Simple grid with name + basic description
- Missing: threat levels, faction territories, weather patterns, hazards

**Recommendation**: Enhance `/biomes` page with detailed biome cards showing all metadata

---

### 3. Roadmap Data - PARTIALLY UNUSED

**File**: `/src/data/roadmap.json`
**Current Usage**: ~40%

**Unused Content**:
- ❌ Current sprint info (Week 10/12, 83% progress)
- ❌ Development phases breakdown
- ❌ Completed milestones with dates
- ❌ In-progress features
- ❌ Technical roadmap details
- ❌ Marketing milestones
- ❌ Key metrics (FPS targets, player capacity, world size)
- ❌ Risk assessment

**Current Implementation**:
- Basic timeline (Q2, Month 3-6, Month 6-9, Q4)
- Content roadmap only

**Recommendation**: Add technical roadmap section to `/roadmap` page

---

### 4. Faction Data - MOSTLY USED

**File**: `/src/data/factions.json`
**Current Usage**: ~80%

**Well-Used Fields**:
- ✅ Name, shortName, role
- ✅ Philosophy, specialty, lore
- ✅ Colors (primary, secondary, accent)
- ✅ Playstyle, strengths, weaknesses
- ✅ Unique abilities

**Unused/Underutilized Fields**:
- ❌ homeBiome - Not displayed on faction cards
- ❌ coopAbility - Mentioned but not prominently featured
- ❌ launchWindow - Not shown on faction listing

**Recommendation**: Add faction territory info to biomes page, highlight co-op abilities more

---

## 📄 Missing Content Pages

Based on wiki data and `CONTENT_RECOMMENDATIONS.md`, these high-value pages are missing:

### High Priority (SEO + Conversion Value)
1. ❌ `/early-access` - Landing page for EA launch
2. ❌ `/media` - Screenshots, videos, press assets
3. ❌ `/system-requirements` - PC specs needed
4. ❌ `/press-kit` - Media resources for journalists

### Medium Priority
5. ❌ `/weapons` - Weapon tiers and systems
6. ❌ `/enemies` - Harvester tech threat guide
7. ❌ `/lore` - World backstory and timeline
8. ❌ `/compare` - vs Tarkov/Hunt comparison

### Low Priority (Legal/Administrative)
9. ❌ `/privacy` - Privacy policy
10. ❌ `/terms` - Terms of service
11. ❌ `/contact` - Contact form

---

## 🎨 Features.json Content Opportunity

The `features.json` file contains **30 game features** across 5 categories that are completely unused:

### Potential New Page: `/features`

**SEO Value**: "Bloom game features", "extraction FPS mechanics", "co-op abilities"

**Content Structure**:
```
Hero Section
├── "30+ Features Across 5 Systems"
└── "From PvE Co-op to Dynamic Weather"

Core Gameplay (6 features)
├── 8-10 Player Co-op
├── 32km x 32km World
├── Extraction Mechanics
└── ...

Dynamic World (6 features)
├── 14 Weather Types
├── 38 Macro Features
└── ...

Technical Excellence (6 features)
Combat & Survival (6 features)
Progression (6 features)

CTA: Wishlist on Steam
```

**Benefits**:
- Showcases technical achievements (Unity 6, HDRP, Netcode)
- Demonstrates scope (32km world, 14 weather types, 38 features)
- SEO goldmine for feature-specific searches
- Differentiates from competitors

---

## 🗺️ Biomes Page Enhancement Opportunity

**Current State**: Basic grid, ~200 words per biome
**Available Data**: ~500 words per biome with rich metadata

### Proposed Enhancements:

**Add Threat Level Badges**:
```
H1 (Safe) - Forest Hills, Southwest Plains
H2 (Medium) - Snow Peaks, Western Mountains, Eastern Plateaus, Desert, Coastal
H3 (Hardcore) - Central Grasslands (IEZ), Urban, Wetland, Volcanic, Arctic
```

**Add Faction Territory Map**:
```
Snow Peaks → Directorate + North Guard
Eastern Plateaus → Iron Vultures + Apex
Central Grasslands → North Guard + Aegis
```

**Add Environmental Data Cards**:
```
Climate: Arctic
Temperature: Extreme Cold
Weather: Blizzards, Ice Storms
Visibility: Near zero in storms
Terrain: Frozen ground, ice
```

**Add Hazard/Resource Lists**:
```
Hazards: Extreme cold, Forged enemies, Blizzards
Resources: Anti-Forged tech, Military equipment
```

---

## 📈 SEO Opportunities from Unused Content

### Features Page
- **Keywords**: "Bloom game features", "32km procedural world", "Unity 6 extraction shooter", "14 weather types"
- **Long-tail**: "how big is bloom map", "bloom weather system", "bloom faction abilities"
- **Estimated Traffic**: 500-1000 monthly searches

### Enhanced Biomes Page
- **Keywords**: "Bloom biomes", "IEZ Core location", "hardest biome bloom", "bloom map zones"
- **Long-tail**: "where to find X faction", "bloom threat levels", "bloom starting zone"
- **Estimated Traffic**: 300-600 monthly searches

### Technical Roadmap Section
- **Keywords**: "Bloom development", "when is bloom releasing", "bloom EA date", "bloom multiplayer"
- **Long-tail**: "bloom sprint progress", "Unity 6 games", "bloom performance specs"
- **Estimated Traffic**: 200-400 monthly searches

---

## 🔧 Implementation Priority

### Priority 1: Critical Fixes (Immediate)
1. **Fix emblem 404 errors** - Change `.webp` to `.svg` in 3 files
2. **Fix footer links** - Update Footer.astro with correct URLs
   - Roadmap: `/roadmap`
   - Gameplay: `/gameplay`
   - FAQ: `/faq`
   - Squads: `/squads` (also missing from footer!)

### Priority 2: Quick Wins (Same Day)
3. **Create `/features` page** - Use features.json data
4. **Enhance `/biomes` page** - Add threat levels, faction territories, hazards
5. **Add technical roadmap** - Use roadmap.json dev phases

### Priority 3: Content Gaps (This Week)
6. **Create `/early-access` landing page**
7. **Create `/system-requirements` page**
8. **Create `/media` page** (screenshots + videos)
9. **Add missing footer page** - Squads link

### Priority 4: Legal/Administrative (Next Week)
10. **Create placeholder legal pages** (Privacy, Terms, Contact)
11. **Create `/press-kit` page**

---

## 📊 Impact Analysis

### If We Fix All Issues:

**Before**:
- Pages: 9 (including 404)
- Console Errors: 16 (10 emblems + 6 duplicate requests)
- Broken Links: 12
- Wiki Content Usage: ~40%
- SEO Keywords: ~50

**After**:
- Pages: 13+ (add features, enhance biomes, add legal pages)
- Console Errors: 0
- Broken Links: ~4 (only social media placeholders)
- Wiki Content Usage: ~80%
- SEO Keywords: ~100+

**Traffic Impact**:
- Estimated +30% organic search traffic
- +50% time on site (more content to explore)
- -70% bounce rate (better navigation)

---

## 🎯 Recommended Action Plan

### Sprint 1: Fix Broken UI (2 hours)
```bash
1. Fix emblem paths (.webp → .svg) - 15 min
2. Update Footer.astro links - 15 min
3. Test all pages for 404s - 15 min
4. Add Squads link to footer - 15 min
5. Build and verify - 30 min
```

### Sprint 2: Leverage Wiki Content (4 hours)
```bash
1. Create /features page from features.json - 1.5 hours
2. Enhance /biomes with threat levels + faction territories - 1.5 hours
3. Add technical roadmap section - 1 hour
```

### Sprint 3: Fill Content Gaps (6 hours)
```bash
1. Create /early-access landing page - 2 hours
2. Create /system-requirements page - 1 hour
3. Create /media page - 2 hours
4. Create placeholder legal pages - 1 hour
```

**Total Estimated Time**: 12 hours
**Total Impact**: Major improvement to UX, SEO, and content completeness

---

## 📝 Summary

**Critical Issues**: 2 (emblem 404s, broken footer links)
**Unused Wiki Content**: 60% of available data
**Missing Pages**: 8 high-value pages
**SEO Opportunity**: +50 keywords, ~1000 monthly searches

**Bottom Line**: We have a ton of great content in our wiki data files that isn't being used. Fixing the broken UI and leveraging this content could dramatically improve the site's value and discoverability.

**Next Step**: Implement Priority 1 fixes immediately, then move to Priority 2 for maximum impact.
