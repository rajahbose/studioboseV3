/**
 * convert-highschool-maker-space.js
 * Converts all highschool-maker-space images to AVIF format,
 * resized to 4K (3840px wide max), optimized for high-quality web display.
 *
 * Usage: node convert-highschool-maker-space.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PROJECT_DIR = path.join(__dirname, 'images', 'projects', 'highschool-maker-space');
const OUTPUT_DIR  = PROJECT_DIR; // write alongside originals

// 4K-optimized AVIF settings (high quality)
const AVIF_OPTIONS = {
  quality: 80,
  effort: 5,
  chromaSubsampling: '4:4:4', // better quality for large-format display
};

const RESIZE_OPTIONS = {
  width: 3840,
  withoutEnlargement: true,
};

async function convertToAvif() {
  const files = fs
    .readdirSync(PROJECT_DIR)
    .filter(f => /\.(jpg|jpeg|png)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log('No JPG/PNG files found in', PROJECT_DIR);
    return;
  }

  console.log(`Found ${files.length} image(s) to convert:\n`);

  const results = [];
  const nameMap = [];

  for (let i = 0; i < files.length; i++) {
    const file  = files[i];
    const num   = String(i + 1).padStart(2, '0');
    const outputName = `highschool-maker-space-${num}.avif`;
    const inputPath  = path.join(PROJECT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, outputName);

    const originalSize = fs.statSync(inputPath).size;

    try {
      await sharp(inputPath)
        .rotate()                   // auto-orient from EXIF
        .resize(RESIZE_OPTIONS)
        .avif(AVIF_OPTIONS)
        .toFile(outputPath);

      const newSize = fs.statSync(outputPath).size;
      const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

      console.log(`  ✓  ${file}  →  ${outputName}`);
      console.log(`       ${(originalSize / 1024 / 1024).toFixed(1)} MB  →  ${(newSize / 1024).toFixed(1)} KB  (${savings}% smaller)`);

      results.push({ file, outputName, originalSize, newSize, savings });
      nameMap.push(outputName);
    } catch (err) {
      console.error(`  ✗  ${file} — FAILED:`, err.message);
    }
  }

  // Summary
  const totalOriginal = results.reduce((s, r) => s + r.originalSize, 0);
  const totalNew      = results.reduce((s, r) => s + r.newSize, 0);
  const totalSavings  = (((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(1);

  console.log(`\n─────────────────────────────────────────────────`);
  console.log(`  Total: ${(totalOriginal / 1024 / 1024).toFixed(1)} MB  →  ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Overall savings: ${totalSavings}%`);
  console.log(`─────────────────────────────────────────────────\n`);

  console.log('imgs array for projects.js:\n');
  console.log(nameMap.map(n => `  "images/projects/highschool-maker-space/${n}"`).join(',\n'));
}

convertToAvif().catch(console.error);
