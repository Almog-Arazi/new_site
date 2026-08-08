#!/usr/bin/env node
/**
 * Guards the two rules that silently rot this codebase:
 *   1. No physical CSS properties — they mirror wrong under dir="rtl".
 *   2. No raw colour/shadow values in components — tokens.css is the only
 *      place a value may exist.
 *
 * Works on parsed declarations, not on raw line regexes, so `border-radius:
 * var(--r-4)` (symmetric, safe) passes while `border-radius: 20px 4px`
 * (asymmetric, mirrors wrong) fails.
 *
 * Escape hatch: append `/* check-rtl-ignore *\/` to a line.
 *
 * Usage: node scripts/check-rtl.mjs src
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, extname, relative } from 'node:path';

const root = process.argv[2] ?? 'src';

/** tokens.css owns raw values; fonts.css owns metrics. */
const VALUE_EXEMPT = ['styles/tokens.css', 'styles/fonts.css', 'styles/print.css'];

const PHYSICAL_PROPS = new Map([
  ['margin-left', 'margin-inline-start'],
  ['margin-right', 'margin-inline-end'],
  ['padding-left', 'padding-inline-start'],
  ['padding-right', 'padding-inline-end'],
  ['border-left', 'border-inline-start'],
  ['border-right', 'border-inline-end'],
  ['border-left-width', 'border-inline-start-width'],
  ['border-right-width', 'border-inline-end-width'],
  ['border-left-color', 'border-inline-start-color'],
  ['border-right-color', 'border-inline-end-color'],
  ['left', 'inset-inline-start'],
  ['right', 'inset-inline-end'],
]);

const DECLARATION = /(^|[;{]|^\s*)\s*([a-z-]+)\s*:\s*([^;{}]+)/gim;

const files = [];
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (['.astro', '.css'].includes(extname(entry.name))) files.push(path);
  }
}
await walk(root);

const problems = [];

for (const file of files) {
  const rel = relative(process.cwd(), file);
  const source = await readFile(file, 'utf8');
  const checkValues = !VALUE_EXEMPT.some((e) => rel.endsWith(e));
  const lines = source.split('\n');

  lines.forEach((line, index) => {
    if (line.includes('check-rtl-ignore')) return;
    let code = line.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!code || code.startsWith('*') || code.startsWith('//')) return;

    /* A declaration whose value wraps onto later lines used to escape every
       check — only the `prop:` fragment was ever examined. Pull the rest of
       the value in before testing it. */
    if (/[a-z-]+\s*:/.test(code) && !code.includes(';') && !code.endsWith('{')) {
      for (let j = index + 1; j < lines.length && j < index + 8; j += 1) {
        const cont = lines[j].replace(/\/\*[\s\S]*?\*\//g, '').trim();
        code += ' ' + cont;
        if (cont.includes(';') || cont.includes('}')) break;
      }
    }

    DECLARATION.lastIndex = 0;
    let match;
    while ((match = DECLARATION.exec(code)) !== null) {
      const prop = match[2].toLowerCase();
      const value = match[3].trim();
      const at = `${rel}:${index + 1}`;

      if (PHYSICAL_PROPS.has(prop)) {
        problems.push(`${at}  ${prop} → ${PHYSICAL_PROPS.get(prop)}\n    ${code}`);
      }

      if (prop === 'text-align' && /^(left|right)$/.test(value)) {
        problems.push(`${at}  text-align:${value} → start/end\n    ${code}`);
      }

      if (prop === 'float' && /^(left|right)$/.test(value)) {
        problems.push(`${at}  float:${value} → inline-start/end\n    ${code}`);
      }

      /* A multi-value border-radius shorthand is physical and mirrors wrong. */
      if (prop === 'border-radius' && tokenCount(value) > 1) {
        problems.push(`${at}  asymmetric border-radius shorthand → use logical corners\n    ${code}`);
      }

      if (checkValues) {
        if (/#[0-9a-f]{3,8}\b/i.test(value)) {
          problems.push(`${at}  raw hex colour → use a var(--c-*) token\n    ${code}`);
        }
        if (/\brgba?\(/i.test(value) && !/^inset /.test(value)) {
          problems.push(`${at}  raw rgb()/rgba() → use a var(--c-*) token\n    ${code}`);
        }
        if (prop === 'box-shadow' && !/^(none|var\(|inset )/.test(value)) {
          problems.push(`${at}  raw box-shadow → use a var(--e-*) token\n    ${code}`);
        }
      }
    }
  });
}

/** Counts top-level whitespace-separated tokens, ignoring spaces inside var(). */
function tokenCount(value) {
  let depth = 0;
  let tokens = 0;
  let inToken = false;
  for (const char of value) {
    if (char === '(') depth += 1;
    else if (char === ')') depth -= 1;
    if (depth === 0 && /\s/.test(char)) {
      inToken = false;
      continue;
    }
    if (!inToken) {
      tokens += 1;
      inToken = true;
    }
  }
  return tokens;
}

if (problems.length) {
  console.error(`\n✗ check-rtl found ${problems.length} problem(s):\n`);
  console.error(problems.join('\n'));
  process.exit(1);
}

console.log(`✓ check-rtl: ${files.length} files clean`);
