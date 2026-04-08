const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = 'images/projects/rocket-ramps/';
const srcFiles = [
  'IMG_1673.JPG',
  'IMG_1677.JPG',
  'IMG_1683.JPG',
  'IMG_1690.JPG',
  'IMG_1705.JPG',
  'IMG_1707.JPG',
  'IMG_1710.JPG',
  'IMG_1727.JPG',
  'IMG_1728.JPG',
  'IMG_1733.JPG',
  'IMG_1737.JPG',
  'IMG_1749.JPG',
];

async function optimize() {
  for (let i = 0; i < srcFiles.length; i++) {
    const src = path.join(dir, srcFiles[i]);
    const dest = path.join(dir, `rocket-ramps-${String(i + 1).padStart(2, '0')}.jpg`);

    const before = fs.statSync(src).size;

    await sharp(src)
      .rotate()                                    // auto-rotate from EXIF
      .resize({ width: 3840, withoutEnlargement: true })  // 4K max
      .jpeg({ quality: 90, progressive: true, mozjpeg: true })
      .toFile(dest);

    const after = fs.statSync(dest).size;
    console.log(`rocket-ramps-${String(i+1).padStart(2,'0')}.jpg: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB`);
  }
  console.log('\nAll done!');
}

optimize().catch(console.error);
