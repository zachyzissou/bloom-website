#!/usr/bin/env node

/**
 * Content Audit Script
 *
 * Compares wiki-transformed data with current website data and generates
 * discrepancy reports in JSON, Markdown, and HTML formats.
 *
 * Usage:
 *   node scripts/audit-content.mjs
 *
 * Exit codes:
 *   0 - No critical issues (warnings/minor only)
 *   1 - Critical issues detected (blocks build)
 */

import microdiff from 'microdiff';
import { compareTwoStrings } from 'string-similarity';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// Configuration
// ══════════════════════════════════════════════════════════════════════════════

const FACTIONS_JSON_FILE = join(__dirname, '../src/data/factions.json');
const FACTIONS_BACKUP_FILE = join(__dirname, '../src/data/factions.json.bak');

const STRING_SIMILARITY_THRESHOLD = 0.85;

// ══════════════════════════════════════════════════════════════════════════════
// Discrepancy Classification
// ══════════════════════════════════════════════════════════════════════════════

class AuditReport {
  constructor() {
    this.discrepancies = [];
    this.summary = {
      total: 0,
      critical: 0,
      warning: 0,
      minor: 0,
    };
    this.timestamp = new Date().toISOString();
  }

  addDiscrepancy(severity, field, wikiValue, websiteValue, description) {
    this.discrepancies.push({
      severity,
      field,
      wikiValue,
      websiteValue,
      description,
    });

    this.summary.total++;
    this.summary[severity]++;
  }

  toJSON() {
    return {
      timestamp: this.timestamp,
      summary: this.summary,
      discrepancies: this.discrepancies,
    };
  }

  toMarkdown() {
    let md = `# Content Audit Report\n\n`;
    md += `**Generated**: ${this.timestamp}\n\n`;
    md += `## Summary\n\n`;
    md += `- **Total Discrepancies**: ${this.summary.total}\n`;
    md += `- 🔴 **Critical**: ${this.summary.critical}\n`;
    md += `- 🟡 **Warning**: ${this.summary.warning}\n`;
    md += `- 🟢 **Minor**: ${this.summary.minor}\n\n`;

    if (this.summary.critical > 0) {
      md += `## 🔴 Critical Issues\n\n`;
      this.discrepancies
        .filter(d => d.severity === 'critical')
        .forEach((d, i) => {
          md += `### ${i + 1}. ${d.field}\n\n`;
          md += `**Description**: ${d.description}\n\n`;
          md += `- **Wiki Value**: \`${JSON.stringify(d.wikiValue)}\`\n`;
          md += `- **Website Value**: \`${JSON.stringify(d.websiteValue)}\`\n\n`;
        });
    }

    if (this.summary.warning > 0) {
      md += `## 🟡 Warnings\n\n`;
      this.discrepancies
        .filter(d => d.severity === 'warning')
        .forEach((d, i) => {
          md += `### ${i + 1}. ${d.field}\n\n`;
          md += `${d.description}\n\n`;
        });
    }

    return md;
  }

  toHTML() {
    let html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Content Audit Report</title>
  <style>
    body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { color: #1a202c; }
    .summary { display: flex; gap: 1rem; margin: 2rem 0; }
    .stat { padding: 1rem; border-radius: 8px; flex: 1; }
    .stat.critical { background: #fee; color: #c00; }
    .stat.warning { background: #ffa; color: #880; }
    .stat.minor { background: #efe; color: #080; }
    .discrepancy { padding: 1rem; margin: 1rem 0; border-left: 4px solid #ccc; }
    .discrepancy.critical { border-left-color: #c00; background: #fee; }
    .discrepancy.warning { border-left-color: #880; background: #ffa; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>📊 Content Audit Report</h1>
  <p><strong>Generated</strong>: ${this.timestamp}</p>
  
  <div class="summary">
    <div class="stat critical">
      <h3>${this.summary.critical}</h3>
      <p>Critical</p>
    </div>
    <div class="stat warning">
      <h3>${this.summary.warning}</h3>
      <p>Warnings</p>
    </div>
    <div class="stat minor">
      <h3>${this.summary.minor}</h3>
      <p>Minor</p>
    </div>
  </div>
  
  <h2>Discrepancies</h2>`;

    this.discrepancies.forEach((d, i) => {
      html += `
  <div class="discrepancy ${d.severity}">
    <h3>${i + 1}. ${d.field}</h3>
    <p>${d.description}</p>
    <p><strong>Wiki</strong>: <code>${JSON.stringify(d.wikiValue)}</code></p>
    <p><strong>Website</strong>: <code>${JSON.stringify(d.websiteValue)}</code></p>
  </div>`;
    });

    html += `
</body>
</html>`;

    return html;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Comparison Logic
// ══════════════════════════════════════════════════════════════════════════════

function compareFactions(wikiData, websiteData, report) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🔍 Comparing Faction Data`);
  console.log(`${'═'.repeat(80)}\n`);

  // Compare faction counts
  const wikiCount = wikiData.factions.length;
  const websiteCount = websiteData.factions.length;

  console.log(`   Wiki factions: ${wikiCount}`);
  console.log(`   Website factions: ${websiteCount}\n`);

  if (wikiCount !== websiteCount) {
    report.addDiscrepancy(
      'critical',
      'factionCount',
      wikiCount,
      websiteCount,
      `Faction count mismatch: wiki has ${wikiCount}, website has ${websiteCount}`
    );
  }

  // Compare each faction
  wikiData.factions.forEach((wikiFaction, index) => {
    const websiteFaction = websiteData.factions.find(f => f.id === wikiFaction.id);

    if (!websiteFaction) {
      report.addDiscrepancy(
        'critical',
        `factions[${index}].missing`,
        wikiFaction.name,
        null,
        `Faction "${wikiFaction.name}" exists in wiki but not on website`
      );
      return;
    }

    // Compare colors (exact match required)
    if (wikiFaction.colors && websiteFaction.colors) {
      ['primary', 'secondary', 'accent'].forEach(colorKey => {
        const wikiColor = wikiFaction.colors[colorKey]?.toUpperCase();
        const websiteColor = websiteFaction.colors[colorKey]?.toUpperCase();

        if (wikiColor !== websiteColor) {
          report.addDiscrepancy(
            'critical',
            `factions[${index}].colors.${colorKey}`,
            wikiColor,
            websiteColor,
            `${wikiFaction.name}: ${colorKey} color mismatch`
          );
        }
      });
    }

    // Compare descriptions (similarity threshold)
    if (wikiFaction.lore && websiteFaction.lore) {
      const similarity = compareTwoStrings(wikiFaction.lore, websiteFaction.lore);

      if (similarity < STRING_SIMILARITY_THRESHOLD) {
        report.addDiscrepancy(
          'warning',
          `factions[${index}].lore`,
          `${wikiFaction.lore.substring(0, 100)}...`,
          `${websiteFaction.lore.substring(0, 100)}...`,
          `${wikiFaction.name}: lore text similarity ${(similarity * 100).toFixed(1)}% (threshold: ${STRING_SIMILARITY_THRESHOLD * 100}%)`
        );
      }
    }
  });

  console.log(`   Completed faction comparison\n`);
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Execution
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📋 Bloom Content Audit`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`Starting audit at ${new Date().toISOString()}\n`);

  // Load data
  console.log(`📥 Loading data files...\n`);

  let wikiData, websiteData;

  try {
    wikiData = JSON.parse(readFileSync(FACTIONS_JSON_FILE, 'utf-8'));
    console.log(`   ✓ Current data (wiki-transformed): ${wikiData.factions.length} factions`);
  } catch (error) {
    console.error(`   ✗ Failed to load wiki-transformed data: ${error.message}`);
    process.exit(1);
  }

  try {
    websiteData = JSON.parse(readFileSync(FACTIONS_BACKUP_FILE, 'utf-8'));
    console.log(`   ✓ Previous data (backup): ${websiteData.factions.length} factions\n`);
  } catch (error) {
    console.warn(`   ⚠️  Backup not found - using current data as baseline`);
    websiteData = wikiData;
  }

  // Create audit report
  const report = new AuditReport();

  // Compare factions
  compareFactions(wikiData, websiteData, report);

  // Write reports
  console.log(`${'═'.repeat(80)}`);
  console.log(`💾 Writing Audit Reports`);
  console.log(`${'═'.repeat(80)}\n`);

  const reportDir = join(__dirname, '..');

  writeFileSync(join(reportDir, 'audit-report.json'), JSON.stringify(report.toJSON(), null, 2), 'utf-8');
  console.log(`   ✓ audit-report.json`);

  writeFileSync(join(reportDir, 'audit-report.md'), report.toMarkdown(), 'utf-8');
  console.log(`   ✓ audit-report.md`);

  writeFileSync(join(reportDir, 'audit-report.html'), report.toHTML(), 'utf-8');
  console.log(`   ✓ audit-report.html\n`);

  // Summary
  console.log(`${'═'.repeat(80)}`);
  console.log(`📊 Audit Summary`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`   Total discrepancies: ${report.summary.total}`);
  console.log(`   • Critical: ${report.summary.critical}`);
  console.log(`   • Warnings: ${report.summary.warning}`);
  console.log(`   • Minor: ${report.summary.minor}\n`);

  if (report.summary.critical > 0) {
    console.error(`❌ Audit failed: ${report.summary.critical} critical issues found\n`);
    console.error(`   Build will be blocked until critical issues are resolved.\n`);
    process.exit(1);
  } else {
    console.log(`✅ Audit passed: No critical issues\n`);
    process.exit(0);
  }
}

// Run audit
main().catch((error) => {
  console.error(`\n❌ Audit script crashed:`);
  console.error(error);
  process.exit(1);
});
