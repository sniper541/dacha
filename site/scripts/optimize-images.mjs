import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

// __dirname / scripts -> project root (one level up)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const imgRoot = path.join(projectRoot, 'img');

// Reasonable defaults for a marketing site with fullscreen viewer.
// - maxWidth 1600 keeps fullscreen sharp on most screens
// - quality 80 is a good balance; effort raises compression (slower but one-time)
const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;
const WEBP_EFFORT = 6;

async function* walkTellFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      yield* walkTellFiles(p);
    } else if (e.isFile()) {
      yield p;
    }
  }
}

function isJpeg(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg';
}

async function ensureDirForFile(outPath) {
  await fs.mkdir(path.dirname(outPath), { recursive: true });
}

async function convertOne(jpgPath) {
  const webpPath = jpgPath.replace(/\.(jpe?g)$/i, '.webp');

  // Skip if already exists and is newer than source
  try {
    const [srcStat, dstStat] = await Promise.all([fs.stat(jpgPath), fs.stat(webpPath)]);
    if (dstStat.mtimeMs >= srcStat.mtimeMs) return { skipped: true, webpPath };
  } catch {
    // ignore
  }

  await ensureDirForFile(webpPath);

  const pipeline = sharp(jpgPath, { failOn: 'none' }).rotate();
  const meta = await pipeline.metadata();

  let img = pipeline;
  if (meta.width && meta.width > MAX_WIDTH) {
    img = img.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  await img
    .webp({ quality: WEBP_QUALITY, effort: WEBP_EFFORT })
    .toFile(webpPath);

  return { skipped: false, webpPath };
}

async function main() {
  // Validate img root
  try {
    const st = await fs.stat(imgRoot);
    if (!st.isDirectory()) throw new Error('img is not a directory');
  } catch (e) {
    console.error(`Cannot find img directory at: ${imgRoot}`);
    process.exitCode = 1;
    return;
  }

  let total = 0;
  let converted = 0;
  let skipped = 0;
  const failures = [];

  for await (const filePath of walkTellFiles(imgRoot)) {
    if (!isJpeg(filePath)) continue;
    total += 1;
    try {
      const res = await convertOne(filePath);
      if (res.skipped) skipped += 1;
      else converted += 1;
    } catch (e) {
      failures.push({ filePath, error: String(e?.message ?? e) });
    }
  }

  console.log(`JPEG files found: ${total}`);
  console.log(`Converted to WebP: ${converted}`);
  console.log(`Skipped (up-to-date): ${skipped}`);
  if (failures.length) {
    console.log(`Failures: ${failures.length}`);
    for (const f of failures.slice(0, 20)) {
      console.log(`- ${f.filePath}: ${f.error}`);
    }
    if (failures.length > 20) console.log('... more failures omitted');
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

