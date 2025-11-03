#!/usr/bin/env node

/**
 * Integration Test Script
 *
 * Tests the complete wiki synchronization pipeline:
 * fetch → transform → validate → audit
 *
 * Usage:
 *   node scripts/test-pipeline.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runCommand(command, description) {
  console.log(`\n📌 ${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stderr) console.log(stderr);
    console.log(stdout);
    console.log(`   ✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`   ❌ ${description} failed:`);
    console.error(error.message);
    return false;
  }
}

async function main() {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`🧪 Wiki Synchronization Pipeline Test`);
  console.log(`${'═'.repeat(80)}\n`);

  const steps = [
    { cmd: 'node scripts/fetch-wiki-data.mjs', desc: 'Step 1: Fetch wiki data' },
    { cmd: 'node scripts/transform-wiki-to-json.mjs', desc: 'Step 2: Transform to JSON' },
    { cmd: 'node scripts/validate-data.mjs', desc: 'Step 3: Validate data' },
    { cmd: 'node scripts/audit-content.mjs', desc: 'Step 4: Audit content' },
  ];

  let allPassed = true;

  for (const step of steps) {
    const passed = await runCommand(step.cmd, step.desc);
    if (!passed) {
      allPassed = false;
      break;
    }
  }

  console.log(`${'═'.repeat(80)}`);
  if (allPassed) {
    console.log(`✅ All pipeline steps passed!\n`);
    process.exit(0);
  } else {
    console.log(`❌ Pipeline test failed\n`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Pipeline test crashed:', error);
  process.exit(1);
});
