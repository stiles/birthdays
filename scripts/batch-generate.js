/**
 * Batch-generate PDFs for all 366 valid dates.
 * Run with: node scripts/batch-generate.js
 *
 * Skips dates that already have a PDF in static/prints/.
 * Resume a partial run by just running the script again.
 */

import { readFileSync, existsSync } from 'fs';
import { execFileSync } from 'child_process';

const birthdayData = JSON.parse(
  readFileSync(new URL('../src/lib/data/birthdays.json', import.meta.url), 'utf-8')
);

const total = birthdayData.length;
let generated = 0;
let skipped = 0;

console.log(`Starting batch generation for ${total} dates...\n`);

for (const { month, day } of birthdayData) {
  const outPath = `static/prints/${month}-${day}.pdf`;

  if (existsSync(outPath)) {
    skipped++;
    continue;
  }

  try {
    execFileSync('node', ['scripts/generate-print-graphic.js', '--month', String(month), '--day', String(day)], {
      stdio: 'inherit'
    });
    generated++;
  } catch (err) {
    console.error(`  Failed: ${month}/${day}`);
  }
}

console.log(`\nDone. Generated: ${generated}, skipped (already existed): ${skipped}`);
