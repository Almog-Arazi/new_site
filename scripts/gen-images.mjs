/**
 * Responsive variants for everything under public/uploads.
 *
 * The site deliberately bypasses `astro:assets`: the client uploads photos
 * through the CMS into `public/`, and `image()` in a content schema wants a
 * path relative to the content file, which a git-based CMS cannot produce.
 * The trade was made knowingly — and this script is the other half of it,
 * because the cost of that trade was shipping one 1600px file to a 375px
 * phone. Measured before this existed: 39 images, 5.8MB, every one of them
 * between 1112px and 1600px wide.
 *
 * Runs before `astro build`, so a photo the client uploads this morning has
 * variants this afternoon without anyone remembering to do anything. The
 * variants are gitignored: they are derived files, and committing them would
 * double the repo for no gain.
 *
 * Also emits the intrinsic size of each original into a manifest, which is
 * what lets PhotoFrame set width/height and stop the layout shifting as
 * photos arrive.
 */

import { readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const UPLOADS = 'public/uploads';
const MANIFEST = 'src/lib/image-manifest.json';

/** Covers a 375px phone at 2x, a tablet, and a desktop card column at 2x. */
const WIDTHS = [480, 800, 1200];

/** `img-01-name.webp` -> `img-01-name-800.webp` */
const variantName = (file, w) => file.replace(/\.webp$/, `-${w}.webp`);

const isVariant = (file) => /-\d{3,4}\.webp$/.test(file);

async function main() {
  if (!existsSync(UPLOADS)) {
    await mkdir(UPLOADS, { recursive: true });
    return;
  }

  const files = (await readdir(UPLOADS)).filter((f) => f.endsWith('.webp') && !isVariant(f));

  const manifest = {};
  let generated = 0;
  let bytesBefore = 0;
  let smallestBytes = 0;

  for (const file of files) {
    const src = path.join(UPLOADS, file);
    const image = sharp(src);
    const { width, height } = await image.metadata();
    if (!width || !height) continue;

    bytesBefore += (await stat(src)).size;

    const widths = [];
    for (const w of WIDTHS) {
      /* Never upscale — a 480px source blown up to 1200 is a bigger file
         that looks worse than the original. */
      if (w >= width) continue;
      const out = path.join(UPLOADS, variantName(file, w));
      widths.push(w);
      if (!existsSync(out)) {
        await sharp(src).resize({ width: w }).webp({ quality: 78, effort: 5 }).toFile(out);
        generated += 1;
      }
      /* The narrowest variant is the one a phone picks. */
      if (w === widths[0]) smallestBytes += (await stat(out)).size;
    }

    if (!widths.length) smallestBytes += (await stat(src)).size;

    manifest[`/uploads/${file}`] = { width, height, widths };
  }

  await writeFile(MANIFEST, `${JSON.stringify(manifest, null, 2)}\n`);

  /* Report what a phone actually downloads, not the total on disk. Summing
     every variant would flatter the number by counting files no single
     visitor ever fetches. */
  const saved = bytesBefore ? Math.round((1 - smallestBytes / bytesBefore) * 100) : 0;
  console.log(
    `images: ${files.length} originals, ${generated} new variants. ` +
      `A phone now fetches ${Math.round(smallestBytes / 1024)}KB where it ` +
      `used to fetch ${Math.round(bytesBefore / 1024)}KB (${saved}% less).`
  );
}

main().catch((error) => {
  console.error('image generation failed:', error);
  process.exit(1);
});
