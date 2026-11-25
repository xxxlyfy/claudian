// @test-ci {"inputs":["src/style/**"]}
/** @vitest-environment jsdom */

import { readFileSync } from 'node:fs';
import path from 'node:path';

describe('Composer info row styles', () => {
  afterEach(() => {
    document.head.replaceChildren();
    document.body.replaceChildren();
  });

  function readRowStyles(): void {
    const style = document.createElement('style');
    style.textContent = readFileSync(path.resolve('src/style/components/composer-info-row.css'), 'utf8');
    document.head.appendChild(style);
  }

  it('suppresses Obsidian hover tooltips on the linked content chip', () => {
    readRowStyles();
    // Obsidian skips aria-label tooltips when the hovered element computes --no-tooltip to "true";
    // jsdom does not compute custom properties, so check the inherited declaration on the chip root.
    const declared = Array.from(document.head.querySelector('style')!.sheet!.cssRules)
      .filter((rule): rule is CSSStyleRule => rule instanceof CSSStyleRule)
      .filter(rule => rule.selectorText === '.claudian-input-info-linked')
      .map(rule => rule.style.getPropertyValue('--no-tooltip').trim())
      .filter(Boolean);
    expect(declared).toEqual(['true']);
  });

  it('collapses the row while it has no facts to show', () => {
    readRowStyles();
    const row = document.body.createDiv({ cls: 'claudian-input-info-row claudian-input-info-row--empty' });
    expect(window.getComputedStyle(row).display).toBe('none');
    // The row reappears as soon as the component drops the empty marker.
    row.classList.remove('claudian-input-info-row--empty');
    expect(window.getComputedStyle(row).display).toBe('flex');
  });
});
