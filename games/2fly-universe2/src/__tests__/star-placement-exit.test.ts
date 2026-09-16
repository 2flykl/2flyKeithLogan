// Unit Test: Star Placement Safe Exit & Unsaved Data Protection

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { openStarPlacementOverlay } from '../overlays/star-placement';

describe('Star Placement Safe Exit Flow', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  const ctx = {
    galaxyId: 'G2025',
    regionId: 'G2025-R1',
    x: 4800, y: 850, z: -2000,
  };

  it('renders BACK and CANCEL controls in header on info step', () => {
    openStarPlacementOverlay(container, ctx, () => {});
    const backBtn = container.querySelector('#place-back-header');
    const cancelBtn = container.querySelector('#place-close');
    expect(backBtn).not.toBeNull();
    expect(cancelBtn).not.toBeNull();
    expect(backBtn?.textContent).toContain('BACK');
    expect(cancelBtn?.textContent).toContain('CANCEL');
  });

  it('triggers unsaved data warning if user enters text and attempts cancel', () => {
    const onClose = vi.fn();
    openStarPlacementOverlay(container, ctx, onClose);

    const input = container.querySelector<HTMLInputElement>('#place-display-name');
    if (input) input.value = 'Keith Logan';

    const cancelBtn = container.querySelector<HTMLButtonElement>('#place-close');
    cancelBtn?.click();

    expect(onClose).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Discard this unfinished star?');
    expect(container.querySelector('#unsaved-keep')).not.toBeNull();
    expect(container.querySelector('#unsaved-discard')).not.toBeNull();
  });

  it('returns to info step when clicking BACK on confirm step', () => {
    openStarPlacementOverlay(container, ctx, () => {});
    const input = container.querySelector<HTMLInputElement>('#place-display-name');
    if (input) input.value = 'Keith Logan';

    const nextBtn = container.querySelector<HTMLButtonElement>('#place-next');
    nextBtn?.click();

    expect(container.textContent).toContain('Confirm Placement');

    const backBtn = container.querySelector<HTMLButtonElement>('#place-back');
    backBtn?.click();

    expect(container.textContent).toContain('Mark Your Place in the Universe');
    expect(container.querySelector<HTMLInputElement>('#place-display-name')?.value).toBe('Keith Logan');
  });

  it('closes immediately without warning if no text was entered', () => {
    const onClose = vi.fn();
    openStarPlacementOverlay(container, ctx, onClose);

    const cancelBtn = container.querySelector<HTMLButtonElement>('#place-close');
    cancelBtn?.click();

    expect(container.textContent).not.toContain('Discard this unfinished star?');
  });
});
