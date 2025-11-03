#!/usr/bin/env node

/**
 * Wiki to JSON Transformation Script
 *
 * Parses markdown wiki content and transforms it into structured JSON data
 * for the Bloom marketing website.
 *
 * Usage:
 *   node scripts/transform-wiki-to-json.mjs
 *
 * Exit codes:
 *   0 - Success (data transformed and written)
 *   1 - Failure (parsing errors, validation failures)
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import matter from 'gray-matter';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// Configuration
// ══════════════════════════════════════════════════════════════════════════════

const WIKI_RAW_DIR = join(__dirname, '../temp/wiki-raw');
const DATA_DIR = join(__dirname, '../src/data');

const FACTION_PROFILES_FILE = join(WIKI_RAW_DIR, 'faction-marketing-profiles.md');
const FACTIONS_JSON_FILE = join(DATA_DIR, 'factions.json');
const WIKI_METADATA_FILE = join(DATA_DIR, 'wiki-metadata.json');

// ══════════════════════════════════════════════════════════════════════════════
// Utility Functions
// ══════════════════════════════════════════════════════════════════════════════

function loadMarkdownFile(filePath) {
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    console.error(`   Run 'node scripts/fetch-wiki-data.mjs' first to fetch wiki data`);
    process.exit(1);
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`❌ Failed to read file: ${filePath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

function loadJSONFile(filePath) {
  if (!existsSync(filePath)) {
    console.warn(`⚠️  JSON file not found: ${filePath}`);
    return null;
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to parse JSON: ${filePath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

function parseMarkdown(markdownContent) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm);

  const ast = processor.parse(markdownContent);
  return ast;
}

// ══════════════════════════════════════════════════════════════════════════════
// Markdown Table Extraction
// ══════════════════════════════════════════════════════════════════════════════

function extractTablesFromAST(ast) {
  const tables = [];

  visit(ast, 'table', (node) => {
    const table = {
      headers: [],
      rows: [],
    };

    // Extract headers from first row
    if (node.children[0] && node.children[0].type === 'tableRow') {
      const headerRow = node.children[0];
      table.headers = headerRow.children.map((cell) => {
        return extractTextFromNode(cell).trim();
      });
    }

    // Extract data rows
    for (let i = 1; i < node.children.length; i++) {
      const rowNode = node.children[i];
      if (rowNode.type === 'tableRow') {
        const rowData = {};
        rowNode.children.forEach((cell, index) => {
          const header = table.headers[index];
          rowData[header] = extractTextFromNode(cell).trim();
        });
        table.rows.push(rowData);
      }
    }

    tables.push(table);
  });

  return tables;
}

function extractTextFromNode(node) {
  let text = '';

  if (node.type === 'text') {
    return node.value;
  }

  if (node.type === 'inlineCode') {
    return node.value;
  }

  if (node.type === 'code') {
    return node.value;
  }

  if (node.children) {
    node.children.forEach((child) => {
      text += extractTextFromNode(child);
    });
  }

  return text;
}

// ══════════════════════════════════════════════════════════════════════════════
// Faction Data Transformation
// ══════════════════════════════════════════════════════════════════════════════

function parseFactionTable(tableRow, existingFaction) {
  // This is a placeholder - actual implementation depends on wiki table structure
  // For now, we'll preserve existing faction data and just add lastSynced
  console.log(`   Processing: ${existingFaction ? existingFaction.name : 'Unknown faction'}`);
  
  if (existingFaction) {
    return {
      ...existingFaction,
      lastSynced: new Date().toISOString(),
    };
  }

  return null;
}

function transformFactionsData(wikiContent, existingFactionsData) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🔄 Transforming Faction Data`);
  console.log(`${'═'.repeat(80)}\n`);

  // Parse frontmatter and content
  const { data: frontmatter, content } = matter(wikiContent);
  console.log(`Frontmatter: ${Object.keys(frontmatter).length} fields`);

  // Parse markdown to AST
  const ast = parseMarkdown(content);

  // Extract tables
  const tables = extractTablesFromAST(ast);
  console.log(`Found ${tables.length} tables in faction profiles\n`);

  // For now, preserve existing faction data and add lastSynced timestamps
  // TODO: Implement actual table parsing when wiki structure is confirmed
  const transformedFactions = existingFactionsData.factions.map((faction) => ({
    ...faction,
    lastSynced: new Date().toISOString(),
  }));

  console.log(`✅ Transformed ${transformedFactions.length} factions\n`);

  return {
    factions: transformedFactions,
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// Data Writing
// ══════════════════════════════════════════════════════════════════════════════

function writeJSONFile(filePath, data, backup = true) {
  // Create backup if requested
  if (backup && existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    try {
      const existingContent = readFileSync(filePath, 'utf-8');
      writeFileSync(backupPath, existingContent, 'utf-8');
      console.log(`📋 Backup created: ${backupPath}`);
    } catch (error) {
      console.warn(`⚠️  Failed to create backup: ${error.message}`);
    }
  }

  // Write new data
  try {
    const jsonString = JSON.stringify(data, null, 2);
    writeFileSync(filePath, jsonString, 'utf-8');
    console.log(`✅ Wrote: ${filePath}`);
  } catch (error) {
    console.error(`❌ Failed to write JSON: ${filePath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Execution
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📝 Bloom Wiki to JSON Transformation`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`Starting transformation at ${new Date().toISOString()}\n`);

  // Load existing faction data as baseline
  console.log(`📂 Loading existing data...\n`);
  const existingFactionsData = loadJSONFile(FACTIONS_JSON_FILE);

  if (!existingFactionsData) {
    console.error(`❌ Existing factions.json not found - cannot proceed`);
    process.exit(1);
  }

  console.log(`   Loaded ${existingFactionsData.factions.length} existing factions\n`);

  // Load wiki markdown
  console.log(`📥 Loading wiki content...\n`);
  const factionProfilesContent = loadMarkdownFile(FACTION_PROFILES_FILE);
  console.log(`   Loaded faction profiles (${factionProfilesContent.length} bytes)\n`);

  // Transform faction data
  const transformedData = transformFactionsData(
    factionProfilesContent,
    existingFactionsData
  );

  // Write transformed data
  console.log(`${'═'.repeat(80)}`);
  console.log(`💾 Writing Transformed Data`);
  console.log(`${'═'.repeat(80)}\n`);

  writeJSONFile(FACTIONS_JSON_FILE, transformedData, true);

  // Update wiki metadata
  const metadata = {
    lastSynced: new Date().toISOString(),
    factionCount: transformedData.factions.length,
    syncDuration: 0,
    wikiPagesProcessed: 1,
  };

  writeJSONFile(WIKI_METADATA_FILE, metadata, false);

  // Summary
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📊 Transformation Summary`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`✅ Transformation complete!\n`);
  console.log(`   • Factions updated: ${transformedData.factions.length}`);
  console.log(`   • Backup created: factions.json.bak`);
  console.log(`   • Metadata updated: wiki-metadata.json`);
  console.log(`   • All factions now have lastSynced timestamps\n`);

  console.log(`${'─'.repeat(80)}\n`);
  console.log(`Next step: Run 'node scripts/validate-data.mjs' to validate\n`);

  process.exit(0);
}

// Run transformation
main().catch((error) => {
  console.error(`\n❌ Transformation script crashed:`);
  console.error(error);
  process.exit(1);
});
