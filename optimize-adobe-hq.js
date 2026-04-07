const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\rajah\\.gemini\\antigravity\\brain\\7518394a-a159-49dd-8aac-59372024f2ca';
const destDir = 'C:\\Users\\rajah\\Website Operations\\studioBOSE Site\\images\\projects\\adobe-abode';

// Only process the files created in this current turn
const targetFiles = [
  'media__1775533153219.jpg',
  'media__1775533153244.jpg',
  'media__1775533153601.jpg',
  'media__1775533153609.jpg',
  'media__1775533153649.jpg'
];

async function optimize() {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  for (let i = 0; i < targetFiles.length; i++) {
    const src = path.join(srcDir, targetFiles[i]);
    if (!fs.existsSync(src)) continue;
    
    const dest = path.join(destDir, `adobe-abode-${String(i+1).padStart(2,'0')}.jpg`);
    
    // High Quality Optimization
    await sharp(src)
      .rotate() // preserve EXIF orientation
      .resize({ width: 2560, withoutEnlargement: true })
      .jpeg({ quality: 95, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(dest);
    
    console.log(`Optimized (HQ) to ${dest}`);
  }
}

optimize().catch(console.error);
