const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const jobs = [
  // ── MEADOWLARK ─────────────────────────────────────────────────────────────
  {
    src: 'images/projects/meadowlark/Screenshot 2025-07-11 093910.png',
    dest: 'images/projects/meadowlark/meadowlark-10.jpg',
  },
  {
    src: 'images/projects/meadowlark/Screenshot 2025-07-15 165326.png',
    dest: 'images/projects/meadowlark/meadowlark-11.jpg',
  },
  {
    src: 'images/projects/meadowlark/Screenshot 2025-08-02 131214.png',
    dest: 'images/projects/meadowlark/meadowlark-12.jpg',
  },
  // ── MOUNTAIN CASITA ────────────────────────────────────────────────────────
  {
    src: 'images/projects/mountain-casita/persp 3.png',
    dest: 'images/projects/mountain-casita/mountain-casita-04.jpg',
  },
  {
    src: 'images/projects/mountain-casita/Screenshot 2025-11-03 220604.png',
    dest: 'images/projects/mountain-casita/mountain-casita-05.jpg',
  },
];

async function optimize() {
  for (const job of jobs) {
    if (!fs.existsSync(job.src)) {
      console.log(`SKIP (not found): ${job.src}`);
      continue;
    }
    const before = fs.statSync(job.src).size;
    await sharp(job.src)
      .rotate()
      .resize({ width: 3840, withoutEnlargement: true })
      .jpeg({ quality: 90, progressive: true, mozjpeg: true })
      .toFile(job.dest);
    const after = fs.statSync(job.dest).size;
    console.log(`✓ ${path.basename(job.dest)}: ${(before/1024/1024).toFixed(1)}MB → ${(after/1024/1024).toFixed(1)}MB`);
  }
  console.log('\nAll done!');
}

optimize().catch(console.error);
