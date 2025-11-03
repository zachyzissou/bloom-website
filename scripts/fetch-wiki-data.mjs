#!/usr/bin/env node

/**
 * Wiki Data Fetching Script
 *
 * Fetches raw markdown content from GitLab wiki pages and caches locally.
 * Uses @gitbeaker/rest for GitLab API access with Personal Access Token authentication.
 *
 * Usage:
 *   node scripts/fetch-wiki-data.mjs         # Use cache if < 24h old
 *   node scripts/fetch-wiki-data.mjs --force # Force fresh fetch, bypass cache
 *
 * Exit codes:
 *   0 - Success (all pages fetched or cached)
 *   1 - Failure (missing env vars, API errors, all fetches failed)
 */

import { Gitlab } from '@gitbeaker/rest';
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
config({ path: join(__dirname, '../.env') });

// ══════════════════════════════════════════════════════════════════════════════
// Configuration
// ══════════════════════════════════════════════════════════════════════════════

const GITLAB_TOKEN = process.env.GITLAB_TOKEN;
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID;
const GITLAB_HOST = process.env.GITLAB_HOST || 'https://gitlab.slurpgg.net';
const WIKI_CACHE_MAX_AGE = parseInt(process.env.WIKI_CACHE_MAX_AGE || '86400000', 10);

const TEMP_DIR = join(__dirname, '../temp/wiki-raw');
const WIKI_CONFIG_PATH = join(__dirname, 'wiki-config.json');

const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000; // 1 second

// Parse command line flags
const FORCE_FETCH = process.argv.includes('--force');

// ══════════════════════════════════════════════════════════════════════════════
// Utility Functions
// ══════════════════════════════════════════════════════════════════════════════

function loadWikiConfig() {
  try {
    const configContent = readFileSync(WIKI_CONFIG_PATH, 'utf-8');
    return JSON.parse(configContent);
  } catch (error) {
    console.error(`❌ Failed to load wiki config: ${WIKI_CONFIG_PATH}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

function ensureTempDirectory() {
  if (!existsSync(TEMP_DIR)) {
    mkdirSync(TEMP_DIR, { recursive: true });
    console.log(`📁 Created cache directory: ${TEMP_DIR}\n`);
  }
}

function isCacheFresh(filePath) {
  if (!existsSync(filePath)) return false;
  if (FORCE_FETCH) return false;

  const stats = statSync(filePath);
  const age = Date.now() - stats.mtimeMs;
  return age < WIKI_CACHE_MAX_AGE;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ══════════════════════════════════════════════════════════════════════════════
// Retry Logic (Exponential Backoff)
// ══════════════════════════════════════════════════════════════════════════════

async function retryWithBackoff(fn, context, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;

      // Handle specific GitLab API errors
      if (error.response) {
        const status = error.response.status;

        // 401: Authentication failure - don't retry
        if (status === 401) {
          throw new Error(
            `GitLab authentication failed. Check GITLAB_TOKEN in .env file.\n` +
            `   Status: ${status}\n` +
            `   Message: ${error.message}`
          );
        }

        // 404: Page not found - don't retry, but don't fail build
        if (status === 404) {
          console.warn(`⚠️  Wiki page not found: ${context}`);
          console.warn(`   Status: 404 - Page may not exist yet`);
          return null; // Return null to skip this page
        }

        // 429: Rate limited - respect Retry-After header
        if (status === 429) {
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : RETRY_DELAY_BASE * Math.pow(2, attempt);
          
          if (!isLastAttempt) {
            console.warn(`⚠️  Rate limited (429) - retrying in ${delay / 1000}s... (${attempt}/${maxRetries})`);
            await sleep(delay);
            continue;
          }
        }

        // 5xx: Server errors - retry with backoff
        if (status >= 500) {
          if (!isLastAttempt) {
            const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
            console.warn(`⚠️  Server error (${status}) - retrying in ${delay / 1000}s... (${attempt}/${maxRetries})`);
            await sleep(delay);
            continue;
          }
        }
      }

      // Network errors or other issues - retry with backoff
      if (!isLastAttempt) {
        const delay = RETRY_DELAY_BASE * Math.pow(2, attempt - 1);
        console.warn(`⚠️  Error: ${error.message} - retrying in ${delay / 1000}s... (${attempt}/${maxRetries})`);
        await sleep(delay);
        continue;
      }

      // All retries exhausted
      throw error;
    }
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// GitLab Wiki Fetching
// ══════════════════════════════════════════════════════════════════════════════

async function fetchWikiPage(api, slug, outputPath) {
  // Check cache first
  if (isCacheFresh(outputPath)) {
    const stats = statSync(outputPath);
    const ageHours = ((Date.now() - stats.mtimeMs) / (1000 * 60 * 60)).toFixed(1);
    console.log(`   ✓ Using cached version (${ageHours}h old)`);
    return { cached: true, slug };
  }

  // Fetch from GitLab API
  try {
    const wikiPage = await retryWithBackoff(
      async () => {
        return await api.ProjectWikis.show(GITLAB_PROJECT_ID, slug);
      },
      slug
    );

    if (!wikiPage) {
      // Page not found (404) - skip gracefully
      return { skipped: true, slug, reason: '404 Not Found' };
    }

    // Save to cache
    writeFileSync(outputPath, wikiPage.content, 'utf-8');
    console.log(`   ✓ Fetched and cached`);

    return { success: true, slug };
  } catch (error) {
    console.error(`   ✗ Failed to fetch: ${error.message}`);
    return { failed: true, slug, error: error.message };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Execution
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📥 Bloom Wiki Data Fetching`);
  console.log(`${'═'.repeat(80)}\n`);

  // Validate environment variables
  if (!GITLAB_TOKEN) {
    console.error(`❌ Missing GITLAB_TOKEN environment variable`);
    console.error(`   Create a .env file with your GitLab Personal Access Token`);
    console.error(`   See .env.example for instructions\n`);
    process.exit(1);
  }

  if (!GITLAB_PROJECT_ID) {
    console.error(`❌ Missing GITLAB_PROJECT_ID environment variable`);
    console.error(`   Add your GitLab project ID to .env file`);
    console.error(`   See .env.example for instructions\n`);
    process.exit(1);
  }

  console.log(`GitLab Instance: ${GITLAB_HOST}`);
  console.log(`Project ID: ${GITLAB_PROJECT_ID}`);
  console.log(`Cache TTL: ${WIKI_CACHE_MAX_AGE / 1000 / 60 / 60} hours`);
  console.log(`Force Fetch: ${FORCE_FETCH ? 'Yes' : 'No'}\n`);

  // Initialize GitLab API client
  const api = new Gitlab({
    host: GITLAB_HOST,
    token: GITLAB_TOKEN,
  });

  // Load wiki configuration
  const wikiConfig = loadWikiConfig();
  const wikiPages = wikiConfig.wikiPages;

  console.log(`Found ${wikiPages.length} wiki pages to fetch\n`);
  console.log(`${'─'.repeat(80)}\n`);

  // Ensure temp directory exists
  ensureTempDirectory();

  // Fetch each wiki page
  const results = {
    success: 0,
    cached: 0,
    skipped: 0,
    failed: 0,
  };

  for (const page of wikiPages) {
    console.log(`📄 ${page.slug}`);
    console.log(`   Purpose: ${page.purpose}`);

    const result = await fetchWikiPage(api, page.slug, page.outputPath);

    if (result.cached) results.cached++;
    else if (result.success) results.success++;
    else if (result.skipped) results.skipped++;
    else if (result.failed) results.failed++;

    console.log('');
  }

  // Summary
  console.log(`${'─'.repeat(80)}\n`);
  console.log(`📊 Fetch Summary:`);
  console.log(`   • Fetched: ${results.success}`);
  console.log(`   • Cached: ${results.cached}`);
  console.log(`   • Skipped: ${results.skipped}`);
  console.log(`   • Failed: ${results.failed}`);
  console.log(`   • Total: ${wikiPages.length}\n`);

  // Exit with appropriate code
  if (results.failed > 0 && results.success === 0 && results.cached === 0) {
    console.error(`❌ All fetches failed - build cannot continue\n`);
    process.exit(1);
  }

  if (results.failed > 0) {
    console.warn(`⚠️  Some fetches failed, but continuing with available data\n`);
  } else {
    console.log(`✅ Wiki data fetching complete!\n`);
  }

  process.exit(0);
}

// Run script
main().catch((error) => {
  console.error(`\n❌ Script crashed:`);
  console.error(error);
  process.exit(1);
});
