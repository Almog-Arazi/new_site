#!/usr/bin/env node
/**
 * Every internal href must resolve to a built page. This is what stops a
 * CMS-created nav entry from shipping as a dead link.
 *
 * Usage: node scripts/check-links.mjs dist
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
await walk(root);

const assets = new Set(files.map((f) => '/' + relative(root, f).split(join('a', 'b')[1]).join('')));
const routes = new Set(
  files
    .filter((f) => f.endsWith('.html'))
    .map((f) => {
      const rel = '/' + relative(root, f).replaceAll('\\', '/');
      return rel === '/index.html' ? '/' : rel.replace(/\.html$/, '');
    })
);

const problems = [];

for (const file of files.filter((f) => f.endsWith('.html'))) {
  const rel = relative(root, file);
  const html = await readFile(file, 'utf8');

  for (const match of html.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('//')) continue;

    const [path] = href.split(/[?#]/);
    if (!path || path === '/') continue;

    /* Static assets live on disk under the same path. */
    if (/\.\w{2,12}$/.test(path)) {
      const onDisk = files.some((f) => '/' + relative(root, f).replaceAll('\\', '/') === path);
      if (!onDisk) problems.push(`${rel}: asset not found — ${path}`);
      continue;
    }

    if (!routes.has(path)) problems.push(`${rel}: dead internal link — ${path}`);
  }
}

if (problems.length) {
  const unique = [...new Set(problems)];
  console.error(`\n✗ check-links found ${unique.length} problem(s):\n`);
  console.error(unique.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}

console.log(`✓ check-links: ${routes.size} routes, all internal links resolve`);
void assets;
