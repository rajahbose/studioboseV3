const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processDir(dirName, prefix) {
  const dirPath = path.join('images', 'projects', dirName);
  const files = fs.readdirSync(dirPath).filter(f => !f.endsWith('.js') && (f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.jpeg') || f.toLowerCase().endsWith('.png')));
  
  // Sort files for consistent indexing if needed (just string sort)
  files.sort();

  for (let i = 0; i < files.length; i++) {
    const src = path.join(dirPath, files[i]);
    const destName = `${prefix}-${String(i+1).padStart(2,'0')}.jpg`;
    const dest = path.join(dirPath, destName);
    
    let p = sharp(src).rotate(); // auto-rotate based on EXIF
    
    await p.resize({ width: 2560, withoutEnlargement: true })
      .jpeg({ quality: 88, progressive: true, mozjpeg: true })
      .toFile(dest);
    
    console.log(`Processed: ${src} -> ${dest}`);
    
    // remove the original file to keep it clean (as before)
    if (files[i] !== destName) {
      fs.unlinkSync(src);
    }
  }
}

async function main() {
  await processDir('adobe-abode', 'adobe-abode');
}

main().catch(console.error);
