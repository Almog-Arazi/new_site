#!/usr/bin/env node
/**
 * Post-build SEO gate. Runs on every Netlify deploy preview, so a bad CMS
 * edit surfaces as a failed build rather than as a silently broken page.
 *
 * Usage: node scripts/check-html.mjs dist
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist';

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}
await walk(root);

const problems = [];
const titles = new Map();
const descriptions = new Map();

for (const file of files) {
  const rel = relative(root, file);
  const html = await readFile(file, 'utf8');

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (h1s.length !== 1) problems.push(`${rel}: expected exactly 1 <h1>, found ${h1s.length}`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!title) problems.push(`${rel}: missing <title>`);
  else if (title.length > 70) problems.push(`${rel}: title is ${title.length} chars (max 70)`);

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  if (!desc) problems.push(`${rel}: missing meta description`);
  else if (desc.length > 190) problems.push(`${rel}: description is ${desc.length} chars (max 190)`);

  if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: missing canonical`);
  if (!/<html lang="he" dir="rtl">/.test(html)) problems.push(`${rel}: missing lang="he" dir="rtl"`);

  const noindex = /content="noindex/.test(html);
  if (!noindex && title) {
    if (titles.has(title)) problems.push(`${rel}: duplicate title, also in ${titles.get(title)}`);
    else titles.set(title, rel);
    if (desc && descriptions.has(desc)) {
      problems.push(`${rel}: duplicate description, also in ${descriptions.get(desc)}`);
    } else if (desc) descriptions.set(desc, rel);
  }

  /* Every JSON-LD block must parse. This catches the `{...}` interpolation
     mistake, which escapes the quotes and produces invalid JSON. */
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  blocks.forEach((block, i) => {
    try {
      JSON.parse(block[1]);
    } catch (error) {
      problems.push(`${rel}: JSON-LD block #${i + 1} does not parse — ${error.message}`);
    }
  });

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt=/.test(img[0])) problems.push(`${rel}: <img> without alt — ${img[0].slice(0, 90)}`);
  }
}

if (problems.length) {
  console.error(`\n✗ check-html found ${problems.length} problem(s):\n`);
  console.error(problems.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}

console.log(`✓ check-html: ${files.length} pages clean`);
