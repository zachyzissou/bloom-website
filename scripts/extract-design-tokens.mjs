#!/usr/bin/env node

/**
 * Design Token Extraction Script
 *
 * Extracts design tokens (colors, typography) from Brand Guidelines wiki page
 * and generates Style Dictionary source files.
 *
 * Usage:
 *   node scripts/extract-design-tokens.mjs
 *   npx style-dictionary build  # Then run to generate CSS/Tailwind outputs
 *
 * Exit codes:
 *   0 - Success (tokens extracted and written)
 *   1 - Failure (file errors, parsing issues)
 */

import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// Configuration
// ══════════════════════════════════════════════════════════════════════════════

const BRAND_GUIDELINES_FILE = join(__dirname, '../temp/wiki-raw/brand-guidelines.md');
const TOKENS_OUTPUT_DIR = join(__dirname, '../src/styles/tokens');
const TOKENS_OUTPUT_FILE = join(TOKENS_OUTPUT_DIR, 'design-tokens.json');

// ══════════════════════════════════════════════════════════════════════════════
// Utility Functions
// ══════════════════════════════════════════════════════════════════════════════

function normalizeHexColor(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, '');
  
  // Convert 3-digit to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  // Ensure uppercase
  return '#' + hex.toUpperCase();
}

function parseMarkdown(content) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm);
  
  return processor.parse(content);
}

function extractTextFromNode(node) {
  if (node.type === 'text') return node.value;
  if (node.type === 'inlineCode') return node.value;
  if (node.type === 'code') return node.value;
  
  if (node.children) {
    return node.children.map(extractTextFromNode).join('');
  }
  
  return '';
}

// ══════════════════════════════════════════════════════════════════════════════
// Token Extraction
// ══════════════════════════════════════════════════════════════════════════════

function extractColorTokens(ast) {
  const colors = {};
  
  // Extract from code blocks (CSS custom properties)
  visit(ast, 'code', (node) => {
    if (node.lang === 'css' || node.lang === 'scss') {
      const lines = node.value.split('\n');
      lines.forEach(line => {
        // Match --color-name: #HEX;
        const match = line.match(/--([a-z-]+):\s*(#[0-9A-Fa-f]{3,6})/);
        if (match) {
          const [, name, hex] = match;
          colors[name] = {
            value: normalizeHexColor(hex),
            type: 'color',
          };
        }
      });
    }
  });
  
  // Extract from tables (Token | Value | Usage format)
  visit(ast, 'table', (node) => {
    if (!node.children || node.children.length < 2) return;
    
    const headerRow = node.children[0];
    const headers = headerRow.children.map(cell => extractTextFromNode(cell).toLowerCase());
    
    if (headers.includes('token') || headers.includes('color')) {
      for (let i = 1; i < node.children.length; i++) {
        const row = node.children[i];
        const cells = row.children.map(extractTextFromNode);
        
        // Find hex color in row
        const hexMatch = cells.join(' ').match(/#[0-9A-Fa-f]{3,6}/);
        if (hexMatch) {
          const tokenName = cells[0].toLowerCase().replace(/\s+/g, '-');
          colors[tokenName] = {
            value: normalizeHexColor(hexMatch[0]),
            type: 'color',
          };
        }
      }
    }
  });
  
  return colors;
}

function extractTypographyTokens(ast) {
  const typography = {};
  
  // Extract from code blocks
  visit(ast, 'code', (node) => {
    if (node.lang === 'css' || node.lang === 'scss') {
      const lines = node.value.split('\n');
      lines.forEach(line => {
        // Font family
        const fontMatch = line.match(/font-family:\s*([^;]+)/);
        if (fontMatch) {
          typography['font-primary'] = {
            value: fontMatch[1].trim().replace(/['"]/g, ''),
            type: 'fontFamily',
          };
        }
        
        // Font size
        const sizeMatch = line.match(/font-size:\s*([^;]+)/);
        if (sizeMatch) {
          const name = 'font-size-base';
          typography[name] = {
            value: sizeMatch[1].trim(),
            type: 'fontSize',
          };
        }
      });
    }
  });
  
  return typography;
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Execution
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🎨 Design Token Extraction`);
  console.log(`${'═'.repeat(80)}\n`);
  
  // Check if brand guidelines exist
  if (!existsSync(BRAND_GUIDELINES_FILE)) {
    console.error(`❌ Brand Guidelines not found: ${BRAND_GUIDELINES_FILE}`);
    console.error(`   Run 'node scripts/fetch-wiki-data.mjs' first`);
    process.exit(1);
  }
  
  // Load and parse brand guidelines
  console.log(`📥 Loading Brand Guidelines...\n`);
  const content = readFileSync(BRAND_GUIDELINES_FILE, 'utf-8');
  console.log(`   Loaded ${content.length} bytes\n`);
  
  const ast = parseMarkdown(content);
  
  // Extract tokens
  console.log(`🔍 Extracting design tokens...\n`);
  
  const colorTokens = extractColorTokens(ast);
  const typographyTokens = extractTypographyTokens(ast);
  
  console.log(`   • Colors: ${Object.keys(colorTokens).length} tokens`);
  console.log(`   • Typography: ${Object.keys(typographyTokens).length} tokens\n`);
  
  // Build Style Dictionary format
  const designTokens = {
    color: colorTokens,
    typography: typographyTokens,
  };
  
  // Ensure output directory exists
  if (!existsSync(TOKENS_OUTPUT_DIR)) {
    mkdirSync(TOKENS_OUTPUT_DIR, { recursive: true });
    console.log(`📁 Created directory: ${TOKENS_OUTPUT_DIR}\n`);
  }
  
  // Write tokens
  console.log(`💾 Writing design tokens...\n`);
  writeFileSync(TOKENS_OUTPUT_FILE, JSON.stringify(designTokens, null, 2), 'utf-8');
  console.log(`   ✅ Wrote: ${TOKENS_OUTPUT_FILE}\n`);
  
  // Summary
  console.log(`${'═'.repeat(80)}`);
  console.log(`📊 Extraction Summary`);
  console.log(`${'═'.repeat(80)}\n`);
  
  console.log(`✅ Design tokens extracted successfully!\n`);
  console.log(`   Total tokens: ${Object.keys(colorTokens).length + Object.keys(typographyTokens).length}`);
  console.log(`   Output: ${TOKENS_OUTPUT_FILE}\n`);
  
  if (Object.keys(colorTokens).length === 0 && Object.keys(typographyTokens).length === 0) {
    console.warn(`⚠️  No tokens extracted from Brand Guidelines`);
    console.warn(`   This may indicate the wiki uses image-based design specs`);
    console.warn(`   Manual extraction may be required\n`);
  } else {
    console.log(`${'─'.repeat(80)}\n`);
    console.log(`Next step: Run 'npx style-dictionary build' to generate CSS/Tailwind files\n`);
  }
  
  process.exit(0);
}

// Run extraction
main().catch((error) => {
  console.error(`\n❌ Extraction script crashed:`);
  console.error(error);
  process.exit(1);
});
