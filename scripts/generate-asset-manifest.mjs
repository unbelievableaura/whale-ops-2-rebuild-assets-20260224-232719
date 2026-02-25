import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'client', 'public');
const outFile = path.join(publicDir, 'asset-manifest.json');

const exts = new Set(['.png','.jpg','.jpeg','.gif','.webp','.svg','.mp4','.webm','.mp3','.wav','.ogg','.ico','.avif']);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (exts.has(ext)) files.push(full);
    }
  }
  return files;
}

const files = await walk(publicDir);
const resolved = (await Promise.all(
  files.map(async (full) => {
    const rel = path.relative(publicDir, full).replaceAll(path.sep, '/');
    const s = await fs.stat(full);
    return {
      path: `/${rel}`,
      ext: path.extname(rel).toLowerCase(),
      size: s.size,
      name: path.basename(rel),
    };
  })
)).sort((a, b) => a.path.localeCompare(b.path));

await fs.writeFile(
  outFile,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: resolved.length, assets: resolved }, null, 2) + '\n',
  'utf8'
);

console.log(`Wrote ${resolved.length} assets to ${path.relative(root, outFile)}`);
