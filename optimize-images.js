const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Source images
const srcDir = 'C:\\Users\\rajah\\.gemini\\antigravity\\brain\\6f33b5b0-ecbe-4ff2-a6de-9d0e91b11991';
const destDir = 'C:\\Users\\rajah\\Website Operations\\studioBOSE Site\\images\\projects\\santa-fai-concept-designs';

const files = [
  'media__1774742922541.jpg',
  'media__1774742922635.jpg',
  'media__1774742922662.jpg',
  'media__1774742922707.jpg',
  'media__1774742922741.jpg',
];

const destNames = [
  'santa-fai-concept-designs-01.jpg',
  'santa-fai-concept-designs-02.jpg',
  'santa-fai-concept-designs-03.jpg',
  'santa-fai-concept-designs-04.jpg',
  'santa-fai-concept-designs-05.jpg',
];

// Create destination folder
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

// Check if sharp is available, if not use a simple copy with size report
try {
  require.resolve('sharp');
} catch(e) {
  console.log('sharp not found, installing...');
  execSync('npm install sharp --save-dev', { cwd: 'C:\\Users\\rajah\\Website Operations\\studioBOSE Site', stdio: 'inherit' });
}

const sharp = require('sharp');

async function optimize() {
  for (let i = 0; i < files.length; i++) {
    const src = path.join(srcDir, files[i]);
    const dest = path.join(destDir, destNames[i]);
    
    const before = fs.statSync(src).size;
    
    await sharp(src)
      .resize({ width: 1400, withoutEnlargement: true })
      .jpeg({ quality: 82, progressive: true, mozjpeg: true })
      .toFile(dest);
    
    const after = fs.statSync(dest).size;
    const savings = (((before - after) / before) * 100).toFixed(1);
    console.log(`${destNames[i]}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (${savings}% saved)`);
  }
  console.log('\nAll images optimized and saved.');
}

optimize().catch(console.error);
