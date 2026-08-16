// The four-step cycle must contain exactly four list items.
//
// The arrows and the hub are decoration. While they were <li> inside the <ol>,
// any stylesheet that restores list markers - the accessibility widget's
// injected CSS, print, reader mode, forced-colors - numbered them 5 through 9
// and the client saw a nine-step process. This holds that line.
import { readFileSync } from 'node:fs';

const file = 'dist/index.html';
const html = readFileSync(file, 'utf8');
const ol = html.match(/<ol[^>]*class="[^"]*\bcycle__list\b[^"]*"[\s\S]*?<\/ol>/);

if (!ol) {
  console.error(`check-cycle: no <ol class="cycle__list"> found in ${file}`);
  process.exit(1);
}

const items = ol[0].match(/<li\b/g) ?? [];

if (items.length !== 4) {
  console.error(`check-cycle: the cycle <ol> holds ${items.length} <li>, expected exactly 4`);
  process.exit(1);
}

console.log('✓ check-cycle: 4 list items in the cycle');
