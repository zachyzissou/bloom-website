/**
 * Visual Review Test - Captures screenshots of all pages
 * Run with: npx playwright test tests/visual-review.spec.ts
 */

import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';

// Read factions data to get all faction IDs
const factionsData = JSON.parse(
  readFileSync(join(process.cwd(), 'src/data/factions.json'), 'utf-8')
);

// All static pages
const staticPages = [
  '/',
  '/factions',
  '/biomes',
  '/features',
  '/gameplay',
  '/squads',
  '/roadmap',
  '/early-access',
  '/faq',
  '/contact',
  '/media',
  '/system-requirements',
  '/privacy',
  '/terms',
  '/404',
];

// Dynamic faction pages
const factionPages = factionsData.factions.map(
  (faction: { id: string }) => `/factions/${faction.id}`
);

// All pages combined
const allPages = [...staticPages, ...factionPages];

// Viewport sizes to test
const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1920, height: 1080 },
];

test.describe('Visual Review - All Pages', () => {
  // Test each page at different viewport sizes
  for (const page of allPages) {
    for (const viewport of viewports) {
      test(`${page} - ${viewport.name}`, async ({ page: browserPage }) => {
        // Set viewport
        await browserPage.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });

        // Navigate to page
        await browserPage.goto(`http://localhost:3000${page}`, {
          waitUntil: 'networkidle',
          timeout: 30000,
        });

        // Wait for page to be fully loaded
        await browserPage.waitForLoadState('domcontentloaded');
        await browserPage.waitForTimeout(1000); // Extra wait for animations

        // Check for console errors
        const consoleErrors: string[] = [];
        browserPage.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Check for failed network requests
        const failedRequests: string[] = [];
        browserPage.on('response', (response) => {
          if (response.status() >= 400) {
            failedRequests.push(`${response.url()} - ${response.status()}`);
          }
        });

        // Take screenshot
        const sanitizedPath = page.replace(/\//g, '_').replace(/^_/, '') || 'index';
        const screenshotPath = `tests/screenshots/${sanitizedPath}_${viewport.name}.png`;
        await browserPage.screenshot({
          path: screenshotPath,
          fullPage: true,
        });

        // Log issues
        if (consoleErrors.length > 0) {
          console.warn(`Console errors on ${page}:`, consoleErrors);
        }
        if (failedRequests.length > 0) {
          console.warn(`Failed requests on ${page}:`, failedRequests);
        }

        // Basic checks
        await expect(browserPage).toHaveTitle(/.+/); // Title should exist
      });
    }
  }
});

test.describe('Visual Review - Interactive Elements', () => {
  test('Navigation menu works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });

    // Find and click mobile menu toggle
    const menuToggle = page.locator('[aria-label*="menu"], [aria-label*="Menu"], button:has-text("Menu")').first();
    if (await menuToggle.isVisible()) {
      await menuToggle.click();
      await page.waitForTimeout(500);
      await page.screenshot({
        path: 'tests/screenshots/mobile_menu_open.png',
        fullPage: true,
      });
    }
  });

  test('Faction cards are clickable', async ({ page }) => {
    await page.goto('http://localhost:3000/factions', {
      waitUntil: 'networkidle',
    });
    await page.waitForTimeout(1000);

    // Hover over first faction card
    const firstCard = page.locator('.faction-card, [class*="faction"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.hover();
      await page.waitForTimeout(300);
      await page.screenshot({
        path: 'tests/screenshots/faction_card_hover.png',
        fullPage: false,
      });
    }
  });
});

test.describe('Visual Review - Canonical Content Checks', () => {
  test('Homepage shows current milestone strip', async ({ page }) => {
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByText('Current Milestone')).toBeVisible();
    await expect(page.getByText('M2 — Week 12: EA Launch Prep')).toBeVisible();
  });

  test('Roadmap shows current sprint card', async ({ page }) => {
    await page.goto('http://localhost:3000/roadmap', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByText('Current Sprint: M2 — Week 12: EA Launch Prep')).toBeVisible();
  });

  test('Gameplay page includes Inner Exclusion Zone 101 section', async ({ page }) => {
    await page.goto('http://localhost:3000/gameplay', { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    await expect(page.getByText('Inner Exclusion Zone (IEZ) 101')).toBeVisible();
    await expect(page.getByText('The Inner Exclusion Zone – the Dead Sky – is a roughly 200km radius of collapsed infrastructure, Harvester', { exact: false }).first()).toBeVisible();
  });
});

test.describe('Visual Review - Accessibility', () => {
  test('Skip to content link works', async ({ page }) => {
    await page.goto('http://localhost:3000/', {
      waitUntil: 'networkidle',
    });

    // Press Tab to focus skip link
    await page.keyboard.press('Tab');
    await page.waitForTimeout(300);
    await page.screenshot({
      path: 'tests/screenshots/skip_to_content_focused.png',
      fullPage: false,
    });
  });

  test('Focus indicators visible', async ({ page }) => {
    await page.goto('http://localhost:3000/', {
      waitUntil: 'networkidle',
    });

    // Tab through interactive elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/screenshots/focus_indicator_1.png',
      fullPage: false,
    });

    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);
    await page.screenshot({
      path: 'tests/screenshots/focus_indicator_2.png',
      fullPage: false,
    });
  });
});

