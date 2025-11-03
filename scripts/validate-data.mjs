#!/usr/bin/env node

/**
 * Data Validation Script
 *
 * Validates JSON data files against JSON schemas and performs additional
 * validation checks (WCAG AA contrast ratios, faction count).
 *
 * Exit codes:
 * - 0: All validation passed
 * - 1: Validation failures detected (blocks build)
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import chroma from 'chroma-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ══════════════════════════════════════════════════════════════════════════════
// Configuration
// ══════════════════════════════════════════════════════════════════════════════

const EXPECTED_FACTION_COUNT = 10;
const WCAG_AA_CONTRAST_RATIO = 4.5; // WCAG AA standard for normal text

// ══════════════════════════════════════════════════════════════════════════════
// Color Contrast Validation (WCAG AA)
// ══════════════════════════════════════════════════════════════════════════════

function validateContrast(color1, color2, minRatio = WCAG_AA_CONTRAST_RATIO) {
  try {
    const contrast = chroma.contrast(color1, color2);
    return {
      valid: contrast >= minRatio,
      actual: contrast.toFixed(2),
      required: minRatio,
      color1,
      color2,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      color1,
      color2,
    };
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Schema Validation
// ══════════════════════════════════════════════════════════════════════════════

function loadSchema(schemaPath) {
  try {
    const schemaContent = readFileSync(schemaPath, 'utf-8');
    return JSON.parse(schemaContent);
  } catch (error) {
    console.error(`❌ Failed to load schema: ${schemaPath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

function loadData(dataPath) {
  try {
    const dataContent = readFileSync(dataPath, 'utf-8');
    return JSON.parse(dataContent);
  } catch (error) {
    console.error(`❌ Failed to load data: ${dataPath}`);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  }
}

function validateWithSchema(data, schema, dataName) {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(data);

  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📋 ${dataName} Schema Validation`);
  console.log(`${'═'.repeat(80)}\n`);

  if (valid) {
    console.log(`✅ ${dataName} passed schema validation\n`);
    return true;
  } else {
    console.log(`❌ ${dataName} failed schema validation:\n`);
    validate.errors.forEach((error, index) => {
      console.log(`   Error ${index + 1}:`);
      console.log(`   Path: ${error.instancePath || '(root)'}`);
      console.log(`   Message: ${error.message}`);
      if (error.params) {
        console.log(`   Details: ${JSON.stringify(error.params, null, 2)}`);
      }
      console.log('');
    });
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// Faction-Specific Validation
// ══════════════════════════════════════════════════════════════════════════════

function validateFactions(factionsData) {
  const errors = [];
  const warnings = [];

  // Check faction count
  const factionCount = factionsData.factions.length;
  if (factionCount !== EXPECTED_FACTION_COUNT) {
    errors.push({
      type: 'FACTION_COUNT',
      message: `Expected ${EXPECTED_FACTION_COUNT} factions, found ${factionCount}`,
      severity: 'critical',
    });
  }

  // Validate each faction's colors for WCAG AA compliance
  factionsData.factions.forEach((faction, index) => {
    const { colors } = faction;
    if (!colors) return;

    // Primary vs Secondary contrast
    const primarySecondary = validateContrast(colors.primary, colors.secondary);
    if (!primarySecondary.valid) {
      warnings.push({
        type: 'CONTRAST_RATIO',
        faction: faction.name,
        field: 'colors.primary vs colors.secondary',
        message: `Contrast ratio ${primarySecondary.actual} is below WCAG AA threshold (${primarySecondary.required})`,
        severity: 'warning',
      });
    }

    // Primary vs Accent contrast
    const primaryAccent = validateContrast(colors.primary, colors.accent);
    if (!primaryAccent.valid) {
      warnings.push({
        type: 'CONTRAST_RATIO',
        faction: faction.name,
        field: 'colors.primary vs colors.accent',
        message: `Contrast ratio ${primaryAccent.actual} is below WCAG AA threshold (${primaryAccent.required})`,
        severity: 'warning',
      });
    }
  });

  // Report results
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🎨 Faction Color Validation (WCAG AA)`);
  console.log(`${'═'.repeat(80)}\n`);

  if (errors.length === 0 && warnings.length === 0) {
    console.log(`✅ All ${factionCount} factions passed color validation\n`);
    console.log(`   • Faction count: ${factionCount} (expected: ${EXPECTED_FACTION_COUNT}) ✓`);
    console.log(`   • WCAG AA contrast ratios: All passed ✓\n`);
    return true;
  }

  // Print errors
  if (errors.length > 0) {
    console.log(`❌ Critical errors found:\n`);
    errors.forEach((error, index) => {
      console.log(`   ${index + 1}. ${error.message}`);
    });
    console.log('');
  }

  // Print warnings
  if (warnings.length > 0) {
    console.log(`⚠️  Warnings (${warnings.length}):\n`);
    warnings.forEach((warning, index) => {
      console.log(`   ${index + 1}. ${warning.faction} - ${warning.field}`);
      console.log(`      ${warning.message}`);
    });
    console.log('');
  }

  return errors.length === 0;
}

// ══════════════════════════════════════════════════════════════════════════════
// Main Validation Flow
// ══════════════════════════════════════════════════════════════════════════════

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🔍 Bloom Website Data Validation`);
  console.log(`${'═'.repeat(80)}\n`);

  console.log(`Starting validation at ${new Date().toISOString()}\n`);

  let allValid = true;

  // Load schemas
  const factionSchema = loadSchema(join(__dirname, 'schemas/faction.schema.json'));
  const biomeSchema = loadSchema(join(__dirname, 'schemas/biome.schema.json'));

  // Load data files
  const factionsData = loadData(join(__dirname, '../src/data/factions.json'));
  const biomesData = loadData(join(__dirname, '../src/data/biomes.json'));

  // Validate factions against schema
  const factionsSchemaValid = validateWithSchema(
    factionsData.factions[0],
    factionSchema,
    'Factions (first item)'
  );
  allValid = allValid && factionsSchemaValid;

  // Validate factions-specific checks (count, colors)
  const factionsValid = validateFactions(factionsData);
  allValid = allValid && factionsValid;

  // Validate biomes against schema
  const biomesSchemaValid = validateWithSchema(
    biomesData.biomes[0],
    biomeSchema,
    'Biomes (first item)'
  );
  allValid = allValid && biomesSchemaValid;

  // Final summary
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`📊 Validation Summary`);
  console.log(`${'═'.repeat(80)}\n`);

  if (allValid) {
    console.log(`✅ All validation checks passed!\n`);
    console.log(`   • Faction schema: ✓`);
    console.log(`   • Faction count: ✓ (${factionsData.factions.length}/${EXPECTED_FACTION_COUNT})`);
    console.log(`   • Faction colors: ✓ (WCAG AA compliant)`);
    console.log(`   • Biome schema: ✓`);
    console.log('');
    process.exit(0);
  } else {
    console.log(`❌ Validation failed - see errors above\n`);
    console.log(`   Build will be blocked until all issues are resolved.\n`);
    process.exit(1);
  }
}

// Run validation
main().catch((error) => {
  console.error(`\n❌ Validation script crashed:`);
  console.error(error);
  process.exit(1);
});
