import site from '../site.config';

/** Israeli display format: 050-123-4567. Always rendered inside <bdi>. */
export function displayPhone(e164: string = site.phoneE164): string {
  const digits = e164.replace(/\D/g, '').replace(/^972/, '0');
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  if (digits.length === 9) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
  return digits;
}

export function telHrefFor(e164: string = site.phoneE164): string {
  return `tel:${e164.replace(/[^\d+]/g, '')}`;
}

export function waHrefFor(number: string = site.whatsapp, message = site.whatsappMessage): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

/** Hebrew long date, e.g. 5 באוגוסט 2026. */
export function hebrewDate(date: Date): string {
  return new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/** ISO date for <time datetime> and schema. */
export function isoDate(date: Date): string {
  return date.toISOString().split('T')[0] ?? '';
}

/** Joins a Hebrew list with the correct final conjunction. */
export function hebrewList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  return `${items.slice(0, -1).join(', ')} ו${items[items.length - 1]}`;
}

export function absoluteUrl(path: string): string {
  return new URL(path, site.domain).toString();
}
