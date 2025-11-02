# Feature Specification: Wiki Alignment Update

**Feature Branch**: `feature/001-wiki-alignment-update`
**Created**: 2025-11-02
**Status**: Draft
**Input**:
"""
Alright, time for another sanity check, using that team of agents, pleae have them review the latest wiki information and cross-check with what is currently on the site. We need to perform a comprehensive update, including using the design language the game uses.

https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Marketing/Brand_Guidelines
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Marketing/Marketing_Strategy
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Marketing/Faction_Marketing_Profiles
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Lore/index
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Factions/index
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Lore/Characters
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Lore/Technology
https://gitlab.slurpgg.net/zachgonser/bloom/-/wikis/Lore/Timeline
"""

## User Scenarios & Testing *(mandatory)*

### Primary User Story
As a potential player or community member, I want to visit the Bloom website and see accurate, official information about the game's lore, factions, technology, and brand identity so that I can make an informed decision about playing and understand the game's unique cosmic horror universe.

**Platform Context**:
- **Web Platform**: Astro-based static site accessible via modern browsers (desktop and mobile)
- **User Experience**: Website must accurately reflect the game's official design language, color palette, typography, and visual identity as defined in the Brand Guidelines wiki
- **Content Accuracy**: All content (factions, lore, characters, technology, timeline) must align with official wiki documentation to maintain consistency across all Bloom touchpoints

### Acceptance Scenarios

1. **Given** the Brand Guidelines wiki contains official color palette, typography, and visual identity specifications, **When** the development team reviews the current website design, **Then** a comprehensive audit report identifies all discrepancies between current implementation and official guidelines (colors, fonts, spacing, UI patterns)
   - **Happy Path**: Audit successfully identifies specific color hex codes, font families, and design patterns that differ from wiki specifications
   - **Error Path**: If Brand Guidelines wiki is inaccessible, the audit notes missing data and creates clarification markers for manual review
   - **Edge Cases**: Wiki contains conflicting specifications (e.g., different color values in different sections) → Document conflicts for stakeholder resolution

2. **Given** the Faction Marketing Profiles and Factions wiki contain official faction data, **When** the current website faction pages are cross-checked, **Then** all faction names, descriptions, abilities, philosophies, and visual elements match wiki documentation exactly
   - **Happy Path**: Audit identifies outdated faction count (currently shows 8, should show 10), incorrect descriptions, missing factions
   - **Error Path**: If faction data structure differs between wiki and website JSON, create data migration plan
   - **Edge Cases**: Faction data exists in wiki but no corresponding website page → Flag for new page creation

3. **Given** the Lore wiki (index, Characters, Technology, Timeline) contains canonical story content, **When** website content is reviewed, **Then** all lore-related text, character bios, technology descriptions, and timeline events align with wiki canon
   - **Happy Path**: Audit finds mismatched taglines (e.g., "Survive the Harvest" vs official tagline), incorrect game descriptions, outdated timeline events
   - **Error Path**: If lore content contains spoilers or unreleased information, flag for content review before publishing
   - **Edge Cases**: Wiki content is more detailed than needed for marketing → Summarize appropriately while maintaining accuracy

4. **Given** the Marketing Strategy wiki defines brand voice, messaging, and positioning, **When** website copy is analyzed, **Then** all headlines, body text, and CTAs match the official brand voice and messaging framework
   - **Happy Path**: Copy audit identifies tone inconsistencies, outdated messaging, misaligned positioning statements
   - **Error Path**: If Marketing Strategy conflicts with Brand Guidelines, escalate for stakeholder alignment
   - **Edge Cases**: Marketing Strategy suggests features not yet in wiki lore → Hold for future implementation

5. **Given** all 8 wiki pages have been reviewed and changes identified, **When** the update implementation begins, **Then** changes are prioritized by user impact (critical brand identity issues first, minor copy tweaks last)
   - **Happy Path**: Implementation plan groups changes into phases: (1) Critical brand/design fixes, (2) Content accuracy updates, (3) Enhancement opportunities
   - **Error Path**: If resource constraints prevent full implementation, create minimum viable update scope
   - **Edge Cases**: Some wiki content requires new components or major refactoring → Document as future work vs immediate fixes

### Edge Cases

- **Wiki Authentication**: GitLab wiki pages may require authentication - audit team needs proper access credentials before starting review
- **Wiki Content Versioning**: Wiki pages may be updated during audit/implementation - establish baseline wiki snapshot date and track changes
- **Performance Impact**: New design elements from Brand Guidelines (animations, effects, custom fonts) must not degrade Lighthouse score below 90 or exceed 1MB page weight
- **Mobile Responsiveness**: Design language must adapt gracefully to mobile viewports while maintaining brand identity (test on iPhone, iPad, Android)
- **Browser Compatibility**: Official typography and visual effects must work across modern browsers (Chrome, Firefox, Safari, Edge) without polyfills
- **Accessibility Compliance**: Design changes must maintain WCAG AA compliance - color contrast ratios, keyboard navigation, screen reader support
- **SEO Preservation**: Content updates must not break existing SEO (maintain meta descriptions, structured data, URL structure)
- **Content Migration**: If wiki structure differs significantly from website data format (JSON files), may require data transformation scripts
- **Partial Updates**: Some wiki sections may be incomplete or draft status - need criteria for what content is "release ready"
- **Rollback Plan**: If design changes negatively impact user engagement metrics, need ability to revert to previous design

## Assumptions *(mandatory)*

- Wiki content represents approved, production-ready information
- GitLab wiki API access will be provided with appropriate read permissions
- Stakeholders are available within 48 hours for conflict resolution
- Current website codebase is the starting point (no full redesign)
- Wiki is the authoritative source of truth and will not be modified by this feature
- Brand Guidelines contain extractable design specifications (not solely images)
- Marketing Strategy defines clear brand voice and positioning guidelines

## Dependencies *(mandatory)*

- **GitLab API Access**: Personal access token or API credentials required before audit begins (blocker)
- **Brand Team Availability**: Approval required for design interpretations and conflict resolution
- **QA Resources**: Accessibility and performance testing capacity needed for validation
- **Stakeholder Availability**: Marketing and product stakeholders for wiki conflict resolution
- **Sample Wiki Access**: Need to review actual wiki structure before finalizing audit approach

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a comprehensive audit report that cross-references all 8 wiki pages against current website content, identifying specific discrepancies in: brand colors (hex codes), typography (font families, sizes, weights), faction data (names, count, descriptions), lore content (timeline events, character bios, technology descriptions), and marketing messaging
  - Success criteria: Audit report lists each discrepancy with wiki source URL, current website value, and recommended wiki value

- **FR-002**: System MUST extract official design language specifications from Brand Guidelines wiki, including: complete color palette with hex codes and usage rules, typography system (primary/secondary fonts, size scale, weight hierarchy), spacing/layout system, UI component patterns, and visual motifs
  - Success criteria: Design specification document created with all extractable values ready for implementation

- **FR-003**: System MUST verify that all faction information matches Faction Marketing Profiles and Factions wiki exactly, including: faction count (must show 10 total, with 4 early access and 6 expansion), faction names, colors, abilities, philosophies, and launch status
  - Success criteria: Faction audit identifies all mismatches; updated faction data passes automated comparison against wiki content

- **FR-004**: System MUST ensure all lore content (Characters, Technology, Timeline) aligns with canonical wiki documentation, including: game tagline and description, timeline events and dates, character names and backstories, technology descriptions and terminology
  - Success criteria: Content audit flags all non-canonical text; updated content matches wiki canon

- **FR-005**: System MUST validate that updated design elements maintain constitutional principles: Lighthouse performance score ≥90, total page weight <1MB, WCAG AA contrast ratios, keyboard navigation support, screen reader compatibility
  - Success criteria: Automated Lighthouse CI tests pass, accessibility audit shows zero WCAG violations

- **FR-006**: System MUST document any conflicts, ambiguities, or missing information discovered during wiki review, marking each with source wiki page, specific conflict description, and recommended resolution path
  - Success criteria: Clarification log created with all unresolved questions, ready for stakeholder review

- **FR-007**: System MUST create a prioritized implementation plan that groups changes into phases: (1) Critical brand identity fixes, (2) Content accuracy updates, (3) Design enhancement opportunities, with estimated effort and user impact for each phase
  - Success criteria: Implementation plan approved by stakeholders with clear acceptance criteria for each phase

- **FR-008**: System MUST ensure correct game positioning and messaging, including: genre identification as "cosmic horror co-op extraction FPS", 10 factions as key differentiator, official tagline from Marketing Strategy wiki, unique selling propositions that differentiate from generic extraction shooters
  - Success criteria: Homepage and key pages correctly position Bloom's cosmic horror aesthetic and extraction shooter mechanics; no references to "resource management game"

- **FR-009**: System MUST preserve and optimize conversion paths, including: maintaining all existing CTAs (wishlist, follow, community links), optimizing CTA placement based on Marketing Strategy guidance, ensuring mobile conversion paths remain functional, tracking conversion funnel metrics pre/post update
  - Success criteria: All CTAs functional post-update; conversion rate maintained or improved within 2 weeks of launch

### Non-Functional Requirements

- **NFR-001**: Page load time must remain <3 seconds on 3G mobile connections
  - Success criteria: WebPageTest audit shows <3s load time on 3G profile

- **NFR-002**: Support modern browser versions (Chrome, Firefox, Safari, Edge from last 2 years)
  - Success criteria: Cross-browser testing passes on specified browsers without polyfills

- **NFR-003**: Test on representative devices (iPhone 12+, Samsung Galaxy S20+, iPad Pro)
  - Success criteria: Mobile testing shows no layout breaks or functionality issues

- **NFR-004**: Content changes must be reversible within 24 hours via git revert
  - Success criteria: Rollback procedure documented and tested successfully

- **NFR-005**: SEO performance must be maintained (organic traffic should not drop >5% within 2 weeks)
  - Success criteria: Google Search Console shows <5% traffic change post-launch

## Success Metrics *(mandatory)*

### Technical Metrics
- 100% alignment between wiki and website content (zero discrepancies in final audit)
- Lighthouse performance score ≥90 maintained post-update
- Zero WCAG AA accessibility violations
- Page weight remains <1MB across all pages
- Build time increases by <20% with new content

### Marketing Metrics
- Conversion rate maintained or improved within 2 weeks of launch (baseline: current rate)
- Bounce rate does not increase by >10% (baseline: current bounce rate)
- Time on site maintained or improved (baseline: current average)
- SEO traffic change <5% within 2 weeks (baseline: pre-update organic traffic)
- Social media engagement on announcement (target: >100 shares across platforms)

### Business Metrics
- Website correctly positions Bloom as "cosmic horror co-op extraction FPS" (100% compliance)
- 10 factions accurately represented with complete information
- Official brand guidelines implemented with <5 minor deviations (documented and approved)
- Community feedback predominantly positive (>70% positive sentiment in first week)
- Zero critical bugs or broken functionality post-launch

## Rollback Criteria *(mandatory)*

Trigger immediate rollback if ANY of the following occur:

- **Performance**: Lighthouse score drops below 85
- **Accessibility**: Critical WCAG violations discovered (Level A failures)
- **Conversion**: Conversion rate drops >20% within 48 hours of launch
- **Traffic**: Bounce rate increases >25% within 48 hours
- **Functionality**: Critical site functionality broken (navigation, CTAs, mobile layout)
- **SEO**: Organic traffic drops >15% within 1 week
- **Brand**: Incorrect/offensive content discovered post-launch

**Rollback Procedure**:
1. Revert to previous git commit via `git revert`
2. Rebuild and redeploy within 30 minutes
3. Notify stakeholders of rollback and issue
4. Post-mortem within 24 hours to identify root cause

## Scope Boundaries *(mandatory)*

- **IN SCOPE**:
  - Comprehensive audit of current website vs 8 wiki pages (Brand Guidelines, Marketing Strategy, Faction Marketing Profiles, Lore index, Factions index, Characters, Technology, Timeline)
  - Extraction of official design language specifications (colors, typography, visual identity) from Brand Guidelines wiki
  - Content accuracy verification for all factions (10 total), lore elements, characters, technology, and timeline
  - Implementation of wiki-aligned brand identity, messaging, and visual design on website
  - Migration of faction data from wiki format to website JSON structure if needed
  - Validation that all changes maintain Lighthouse ≥90, <1MB page weight, WCAG AA compliance
  - Documentation of conflicts, ambiguities, and clarification needs discovered during review
  - Prioritized implementation plan with phased rollout (critical fixes → content updates → enhancements)
  - Mobile responsiveness testing for all design changes
  - SEO preservation throughout content updates
  - User communication strategy for announcing website updates to existing community
  - CTA optimization and conversion path preservation/enhancement
  - Competitive positioning emphasis (cosmic horror, 10 factions, extraction shooter mechanics)

- **OUT OF SCOPE**:
  - Creating or editing content in wiki pages (wiki is source of truth, not modified by this feature)
  - Implementing features or content not documented in the 8 wiki pages
  - Changes to game repository (bloom-game-repo) - only website repository affected
  - Backend API development or database schema changes
  - Third-party integrations not specified in wiki documentation
  - Marketing campaign execution or advertising creative development
  - User acquisition testing or conversion rate optimization experiments
  - Analytics implementation beyond basic page view tracking (Plausible Analytics)
  - Paid features, paywalls, or monetization components
  - Community features (forums, user accounts, social features) unless explicitly documented in Marketing Strategy wiki

---