import type { PlaceholderVariant } from '../../content.config';
import { PLACEHOLDER_VARIANTS } from '../../content.config';

export type { PlaceholderVariant };
export { PLACEHOLDER_VARIANTS };

/**
 * Line-icon path data for the branded geometric placeholders.
 * 64×64 grid, 1.75px strokes, round caps — one icon language across the site.
 * These stand in until the photo day; PhotoFrame swaps to <img> the moment a
 * real `image` is supplied, with no other change to the page.
 */
export const PLACEHOLDER_ART: Record<PlaceholderVariant, { paths: string[]; label: string }> = {
  forklift: {
    label: 'מלגזה',
    paths: [
      'M8 44h22V26H18l-6 8v10Z',
      'M30 44V16h6',
      'M36 12v32',
      'M40 20h10',
      'M44 44h14',
      'M44 44V20',
      'M16 50a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
      'M40 50a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
    ],
  },
  crane: {
    label: 'עגורן גשר',
    paths: [
      'M8 14h48',
      'M12 14v36',
      'M52 14v36',
      'M8 50h48',
      'M20 14v8h24v-8',
      'M32 22v14',
      'M28 36h8v6h-8Z',
      'M32 42v6',
      'M29 48c0 4 6 4 6 0',
    ],
  },
  platform: {
    label: 'במת הרמה',
    paths: [
      'M14 12h36v8H14Z',
      'M18 20v4',
      'M46 20v4',
      'M18 24l28 12',
      'M46 24 18 36',
      'M18 36l28 12',
      'M46 36 18 48',
      'M10 52h44',
      'M20 52v-4h24v4',
    ],
  },
  lifeline: {
    label: 'קו חיים',
    paths: [
      'M8 20h48',
      'M14 20v10',
      'M32 20v10',
      'M50 20v10',
      'M10 30h8v6h-8Z',
      'M28 30h8v6h-8Z',
      'M46 30h8v6h-8Z',
      'M32 36v8',
      'M28 44a4 6 0 1 0 8 0 4 6 0 1 0-8 0Z',
      'M8 52h48',
    ],
  },
  accessory: {
    label: 'אביזרי הרמה',
    paths: [
      'M22 14a8 8 0 0 1 16 0v6',
      'M30 20h8',
      'M26 26a8 8 0 1 0 12 0',
      'M22 34a7 7 0 1 0 14 0 7 7 0 1 0-14 0Z',
      'M28 44a7 7 0 1 0 14 0 7 7 0 1 0-14 0Z',
      'M18 50h28',
    ],
  },
  generic: {
    label: 'ציוד הרמה',
    paths: [
      'M32 12v6',
      'M32 46v6',
      'M12 32h6',
      'M46 32h6',
      'M18 18l4 4',
      'M42 42l4 4',
      'M46 18l-4 4',
      'M22 42l-4 4',
      'M20 32a12 12 0 1 0 24 0 12 12 0 1 0-24 0Z',
      'M28 32a4 4 0 1 0 8 0 4 4 0 1 0-8 0Z',
    ],
  },
  portrait: {
    label: 'בודק מוסמך',
    paths: [
      'M20 26a12 10 0 0 1 24 0',
      'M16 26h32',
      'M32 16v-4',
      'M24 30a8 8 0 0 0 16 0',
      'M14 54c0-9 8-14 18-14s18 5 18 14',
      'M26 40l6 8 6-8',
    ],
  },
  document: {
    label: 'תסקיר בדיקה',
    paths: [
      'M16 10h24l10 10v34H16Z',
      'M40 10v10h10',
      'M22 28h20',
      'M22 34h20',
      'M22 40h12',
      'M34 46l4 4 8-8',
    ],
  },
  factory: {
    label: 'סביבת מפעל',
    paths: [
      'M8 54V26l14 9v-9l14 9V14h6l4 40Z',
      'M16 54v-8',
      'M28 54v-8',
      'M40 54v-8',
      'M44 14V8h6v6',
      'M8 54h48',
    ],
  },
};
