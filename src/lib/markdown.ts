import MarkdownIt from 'markdown-it';

/**
 * Inline-markdown renderer for JSON/frontmatter string fields.
 * `typographer: false` is mandatory — the typographer turns בע"מ into
 * בע”מ, in the company name itself.
 */
const inlineMd = new MarkdownIt('zero', { html: false, typographer: false }).enable([
  'emphasis',
  'link',
  'linkify',
  'backticks',
]);

const blockMd = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: false,
  typographer: false,
});

/** Bold / links inside a single line. Returns HTML without a wrapping <p>. */
export function renderInline(text: string): string {
  return inlineMd.renderInline(text ?? '');
}

/** Paragraphs, lists and headings for `richText` block bodies. */
export function renderBlock(text: string): string {
  return blockMd.render(text ?? '');
}

/**
 * Plain text for JSON-LD. Schema.org `acceptedAnswer.text` must not carry
 * escaped HTML, so the visible answer and the structured answer come from
 * the same source string but take different exits.
 */
export function stripMarkdown(text: string): string {
  return (text ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
