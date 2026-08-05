/**
 * Homepage equipment multi-select.
 *
 * Cross-stream contract (Phase 0, frozen):
 *   document dispatches CustomEvent('equipment:change', { detail: { ids: string[] } })
 * Stream A's lead form listens for it and preselects the equipment field.
 *
 * Markup contract (components/home/EquipmentPicker.astro):
 *   [data-equipment-picker]              the root
 *   [data-chip="<id>"][aria-pressed]     one per chip (ui/Chip.astro as="toggle")
 *   [data-picker-label][data-empty="…"]  the aria-live result line
 */

export const EQUIPMENT_CHANGE = 'equipment:change';

const picker = document.querySelector<HTMLElement>('[data-equipment-picker]');

if (picker) {
  const label = picker.querySelector<HTMLElement>('[data-picker-label]');
  const emptyText = label?.dataset.empty ?? '';
  const chips = [...picker.querySelectorAll<HTMLButtonElement>('[data-chip]')];

  /* Chip.astro renders a decorative ✓ alongside the text, so read the label
     span rather than the button's textContent. */
  const labelOf = (chip: HTMLButtonElement): string =>
    chip.querySelector<HTMLElement>('.chip__label')?.textContent?.trim() ??
    chip.textContent?.replace('✓', '').trim() ??
    '';

  const selected = (): { ids: string[]; labels: string[] } => {
    const on = chips.filter((c) => c.getAttribute('aria-pressed') === 'true');
    return { ids: on.map((c) => c.dataset.chip ?? ''), labels: on.map(labelOf) };
  };

  const sync = (): void => {
    const { ids, labels } = selected();
    if (label) label.textContent = labels.length ? `נבחר לבדיקה: ${labels.join(' · ')}` : emptyText;
    document.dispatchEvent(new CustomEvent(EQUIPMENT_CHANGE, { detail: { ids } }));
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.setAttribute(
        'aria-pressed',
        chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
      );
      sync();
    });
  });
}

export {};
