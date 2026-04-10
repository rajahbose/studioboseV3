/**
 * convert-to-avif.js
 * Converts all food-to-power-headquarters JPG images to AVIF format
 * using sharp — the same library Next.js uses for its Image Optimization API.
 *
 * Usage: node convert-to-avif.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PROJECT_DIR = path.join(
  __dirname,
  'images',
  'projects',
  'food-to-power-headquarters'
);

// AVIF encoding settings mirroring Next.js defaults:
// quality: 75, effort: 4 (balanced speed/compression)
const AVIF_OPTIONS = {
  quality: 75,
  effort: 4,
  chromaSubsampling: '4:2:0',
};

async function convertToAvif() {
  const files = fs.readdirSync(PROJECT_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f));

  if (files.length === 0) {
    console.log('No JPG/PNG files found in', PROJECT_DIR);
    return;
  }

  console.log(`Found ${files.length} image(s) to convert:\n`);

  const results = [];

  for (const file of files) {
    const inputPath = path.join(PROJECT_DIR, file);
    const outputName = file.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    const outputPath = path.join(PROJECT_DIR, outputName);

    const originalSize = fs.statSync(inputPath).size;

    try {
      await sharp(inputPath)
        .avif(AVIF_OPTIONS)
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

      console.log(`  ✓  ${file}`);
      console.log(`       ${(originalSize / 1024).toFixed(1)} KB  →  ${(newSize / 1024).toFixed(1)} KB  (${savings}% smaller)`);

      results.push({ file, outputName, originalSize, newSize, savings });
    } catch (err) {
      console.error(`  ✗  ${file} — FAILED:`, err.message);
    }
  }

  // Summary
  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalNew      = results.reduce((s, r) => s + r.newSize, 0);
  const totalSavings  = (((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1);

  console.log(`\n─────────────────────────────────────────────────`);
  console.log(`  Total: ${(totalOriginal / 1024).toFixed(1)} KB  →  ${(totalNew / 1024).toFixed(1)} KB`);
  console.log(`  Overall savings: ${totalSavings}%`);
  console.log(`─────────────────────────────────────────────────\n`);
  console.log('All AVIF files written alongside the originals.');
  console.log('Run the update-refs script next to update projects.js references.');
}

convertToAvif().catch(console.error);
