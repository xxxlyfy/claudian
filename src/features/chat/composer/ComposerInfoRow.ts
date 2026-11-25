import { setIcon } from 'obsidian';

import { t } from '@/i18n/i18n';

/** Read-only conversation fact shown in the info row; it may still be opened or, before the first message, removed. */
export interface ComposerInfoItem {
  label: string;
  icon?: string;
  ariaLabel?: string;
  missing?: boolean;
  /** The item opens a menu anchored to its button. */
  hasPopup?: 'menu';
  /** Shown but not operable for now. */
  disabled?: boolean;
  onActivate: (anchorEl: HTMLElement) => void;
  onRemove?: () => void;
}

/**
 * Owns the row of conversation facts inside the top of the input box: the project
 * (its chip opens a menu to change it), then Linked content. The toolbar holds what
 * the user can change. The row collapses while it has no facts to show, so an empty
 * composer keeps its idle height.
 */
export class ComposerInfoRow {
  private readonly linkedSlotEl: HTMLElement;
  private readonly projectSlotEl: HTMLElement;

  constructor(private readonly containerEl: HTMLElement) {
    this.containerEl.addClass('claudian-input-info-row');
    this.projectSlotEl = this.containerEl.createDiv({
      cls: 'claudian-input-info-linked claudian-input-info-project',
    });
    this.linkedSlotEl = this.containerEl.createDiv({ cls: 'claudian-input-info-linked' });
    this.#syncEmptyState();
  }

  setLinkedContent(item: ComposerInfoItem | null): void {
    this.#renderSlot(this.linkedSlotEl, item);
  }

  setProject(item: ComposerInfoItem | null): void {
    this.#renderSlot(this.projectSlotEl, item);
  }

  destroy(): void {
    this.linkedSlotEl.empty();
    this.projectSlotEl.empty();
  }

  #renderSlot(slotEl: HTMLElement, item: ComposerInfoItem | null): void {
    const active = slotEl.ownerDocument.activeElement;
    const focusClass = active && slotEl.contains(active)
      ? active.classList.contains('claudian-input-info-linked-remove')
        ? 'claudian-input-info-linked-remove' : 'claudian-input-info-linked-main'
      : null;
    slotEl.empty();
    slotEl.toggleClass('claudian-input-info-linked--missing', item?.missing === true);
    if (!item) {
      this.#syncEmptyState();
      return;
    }
    const label = item.ariaLabel ?? item.label;
    const mainEl = slotEl.createEl('button', {
      cls: 'claudian-input-info-linked-main',
      attr: { type: 'button', 'aria-label': label, ...(item.hasPopup ? { 'aria-haspopup': item.hasPopup } : {}) },
    });
    mainEl.disabled = item.disabled === true;
    mainEl.addEventListener('click', () => {
      if (!mainEl.disabled) item.onActivate(mainEl);
    });
    if (item.icon) {
      const iconEl = mainEl.createSpan({ cls: 'claudian-input-info-linked-icon' });
      iconEl.setAttribute('aria-hidden', 'true');
      setIcon(iconEl, item.icon);
    }
    mainEl.createSpan({ cls: 'claudian-input-info-linked-label', text: item.label });

    if (item.onRemove) {
      const removeEl = slotEl.createEl('button', {
        cls: 'claudian-input-info-linked-remove',
        text: '×',
        attr: { type: 'button', 'aria-label': t('chat.removeItem', { item: label }) },
      });
      removeEl.addEventListener('click', item.onRemove);
    }
    if (focusClass) slotEl.querySelector<HTMLElement>(`.${focusClass}`)?.focus({ preventScroll: true });
    this.#syncEmptyState();
  }

  /** Collapses the row so the composer's box does not reserve a blank band above the text. */
  #syncEmptyState(): void {
    const empty = this.projectSlotEl.childElementCount === 0 && this.linkedSlotEl.childElementCount === 0;
    this.containerEl.toggleClass('claudian-input-info-row--empty', empty);
  }
}
