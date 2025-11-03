# Bloom Website - Launch Readiness Checklist

**Status**: 🟡 95% Complete - Launch Ready After Fixes
**Date**: 2025-11-02
**Est. Time to Launch**: 1 hour (dev work) + external dependencies

---

## 🚨 LAUNCH BLOCKERS (Must Fix - 1 Hour Total)

### 1. TypeScript Build Errors ❌ (30 min)
**Status**: BLOCKING
**Impact**: Cannot run `npm run build`

**Files to Fix**:
```bash
src/pages/early-access.astro (lines 14-16)
  - Remove: eaData, expansion1, expansion2 (unused vars)

src/pages/media.astro (line 93)
  - Change: (_, i) => to (_, _i) =>

src/pages/roadmap.astro (line 13)
  - Remove: riskAssessment from destructuring

src/pages/squads.astro (lines 12, 396, 430, 436)
  - Remove: factionsByRole, index (unused)
  - Add: member.faction?.shortName (type guard)
  - Add: member.faction?.colors.primary (type guard)
```

**Test**: `npm run check` should pass

---

### 2. Footer Navigation Links ❌ (15 min)
**Status**: BLOCKING
**Impact**: 7 broken links, poor UX

**File**: `src/components/Footer.astro`

**Fix**:
```diff
Line 50: - <a href="#">Press Kit</a>
         + <a href="/media">Press Kit</a>

Line 51: - <a href="#">Media</a>
         + <a href="/media">Media</a>

Line 60: - <a href="#">Privacy</a>
         + <a href="/privacy">Privacy</a>

Line 61: - <a href="#">Terms</a>
         + <a href="/terms">Terms</a>

Line 62: - <a href="#">Contact</a>
         + <a href="/contact">Contact</a>
```

**Leave as-is** (external dependencies):
- Discord: `#` (need invite URL)
- Twitter: `#` (need profile URL)
- Reddit: `#` (need community URL)
- YouTube: `#` (need channel URL)

---

### 3. Steam Wishlist URL ❌ (5 min)
**Status**: BLOCKING (if Steam page exists)
**Impact**: Primary CTA broken

**File**: `src/pages/index.astro` (line 143)

**Current**: `<a href="#wishlist">`
**Replace with**: `<a href="https://store.steampowered.com/app/YOUR_APP_ID">`

**Action Required**: Obtain Steam App ID from marketing team

---

## ⚠️ RECOMMENDED BEFORE LAUNCH (2-3 Hours)

### 4. Font Files Missing ⚠️ (1 hour)
**Status**: Cosmetic (falls back to system fonts)
**Impact**: Brand consistency

**Fix**:
```bash
# Download fonts
wget https://fonts.gstatic.com/s/orbitron/v29/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6xpmIyXjU1pg.woff2 \
  -O public/fonts/orbitron-v29-latin-regular.woff2

wget https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2 \
  -O public/fonts/inter-v13-latin-regular.woff2
```

---

### 5. Legal Review ⚠️ (External - 1 week)
**Status**: Placeholder content
**Impact**: Legal compliance risk

**Files**:
- `src/pages/privacy.astro` - Generic GDPR template
- `src/pages/terms.astro` - Generic TOS with EA disclaimers

**Action**: Send to legal counsel for review

---

### 6. Email Addresses ⚠️ (30 min)
**Status**: Placeholder
**Impact**: Contact form may fail

**File**: `src/pages/contact.astro`

**Replace**:
- `hello@bloom-game.com` → Real general inbox
- `press@bloom-game.com` → Real press contact
- `support@bloom-game.com` → Real support inbox
- `business@bloom-game.com` → Real business contact

---

### 7. Performance Testing ⚠️ (15 min)
**Status**: Not tested
**Impact**: Unknown performance

**Run**:
```bash
npm run build
npm run preview
npm run lighthouse
```

**Target**: Lighthouse score ≥90

---

## ✅ CAN LAUNCH WITHOUT (Post-Launch OK)

### 8. Media Gallery Screenshots ✓
**Status**: Placeholders
**Impact**: Low (press kit has emblems)
**When**: Add when screenshots available

---

### 9. Video Content ✓
**Status**: No videos uploaded
**Impact**: Low
**When**: Add announcement trailer when ready

---

### 10. Social Media Links ✓
**Status**: Placeholders
**Impact**: Low (users can find via search)
**When**: Add when channels established

---

## 📊 CURRENT STATUS

### Build Status
- ❌ Full Build (`npm run build`): FAILING (TypeScript errors)
- ✅ Fast Build (`npm run build:fast`): PASSING
- ✅ Pages Generated: 25
- ✅ Build Size: 876KB (within 1MB budget)
- ✅ Console Errors: 0 (emblems fixed)

### Content Status
- ✅ Pages: 16 unique + 10 faction details = 25 total
- ✅ Wiki Sync: Operational (80% content utilized)
- ✅ SEO: Meta tags, sitemap, robots.txt all working
- ⚠️ Links: 7 placeholders in footer
- ⚠️ CTAs: Steam wishlist URL needed

### Quality Status
- ❌ TypeScript: 9 errors (blocking)
- ✅ Functionality: All features working
- ✅ Performance: 876KB total (good)
- ⚠️ Testing: Lighthouse not run
- ⚠️ Legal: Needs review

---

## 🎯 RECOMMENDED LAUNCH SEQUENCE

### Phase 1: Critical Fixes (TODAY - 1 hour)
1. ✅ Fix TypeScript errors (30 min)
2. ✅ Update footer links (15 min)
3. ✅ Verify build passes (5 min)
4. ⚠️ Await Steam URL (external)

**Checkpoint**: Run `npm run build` - must succeed

---

### Phase 2: Quality Assurance (TODAY - 2 hours)
1. ⚠️ Run Lighthouse audit (15 min)
2. ⚠️ Cross-browser testing (1 hour)
3. ⚠️ Mobile device testing (30 min)
4. ⚠️ Link validation (15 min)

**Checkpoint**: Lighthouse ≥90, all links work

---

### Phase 3: Content Finalization (THIS WEEK)
1. ⚠️ Legal review privacy/terms (external)
2. ⚠️ Set up email addresses (30 min)
3. ⚠️ Download font files (1 hour)
4. ⚠️ Obtain social URLs (external)

**Checkpoint**: All placeholder content replaced

---

### Phase 4: Deployment (AFTER APPROVALS)
1. ⚠️ Deploy to staging (30 min)
2. ⚠️ Staging testing (1 hour)
3. ⚠️ Deploy to production (30 min)
4. ⚠️ Post-launch monitoring (ongoing)

**Checkpoint**: Live site operational

---

## 📝 QUICK DECISION MATRIX

**Can we launch with TypeScript errors?** ❌ NO - Blocks build
**Can we launch with placeholder footer links?** ⚠️ NOT RECOMMENDED - Poor UX
**Can we launch without Steam URL?** ⚠️ NOT RECOMMENDED - Primary CTA broken
**Can we launch without fonts?** ✅ YES - Graceful degradation
**Can we launch with placeholder legal?** ⚠️ RISKY - Consult legal
**Can we launch without screenshots?** ✅ YES - Can add later
**Can we launch without social links?** ✅ YES - Can add later

---

## 🚀 FINAL VERDICT

**LAUNCH READINESS**: ⚠️ **NOT READY YET**

**After fixing 3 blockers**: ✅ **READY TO LAUNCH**

**Minimum to Launch**:
1. Fix TypeScript errors (30 min) ← DEV TEAM
2. Update footer links (15 min) ← DEV TEAM
3. Get Steam URL (external) ← MARKETING TEAM

**Estimated Time**: **1 hour dev work + external dependencies**

**Confidence Level**: **HIGH** (post-fixes)

**Risk Level**: **LOW** (after blockers resolved)

---

## 📞 OWNERS & CONTACTS

**Dev Team**: TypeScript fixes, footer updates
**Marketing Team**: Steam URL, social links
**Legal Team**: Privacy/Terms review
**DevOps Team**: Deployment, hosting
**QA Team**: Testing, validation

---

**Last Updated**: 2025-11-02
**Next Review**: After blocker fixes
**Target Launch**: TBD (pending Steam URL)

---

*Quick reference: See PROJECT_COMPLETION_REPORT.md for full audit*
