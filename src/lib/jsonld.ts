/**
 * Serialise JSON-LD for `set:html`.
 *
 * Two rules that break the payload if ignored:
 *  1. Emit with `set:html={safeJsonLd(obj)}` — plain `{JSON.stringify(obj)}`
 *     interpolation HTML-escapes the quotes and produces invalid JSON.
 *     This is the single most common failure in an Astro build.
 *  2. Hebrew stays UTF-8. Escaping it to \uXXXX doubles the payload and
 *     buys nothing — Google reads UTF-8 fine.
 *
 * The only escaping needed is `<`, so CMS-authored copy containing a
 * literal closing script tag cannot break out of the block.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data, dropEmpty).replace(/</g, '\\u003c');
}

/** Drops empty values so the emitted graph carries no null noise. */
function dropEmpty(_key: string, value: unknown) {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value) && value.length === 0) return undefined;
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}
