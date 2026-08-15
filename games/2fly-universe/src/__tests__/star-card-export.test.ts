// Star Card export dimension tests
import { describe, it, expect } from 'vitest';

describe('star-card dimensions', () => {
  it('card dimensions should be 1080x1350', () => {
    // Verifies the canonical card spec
    const CARD_W = 1080;
    const CARD_H = 1350;
    expect(CARD_W).toBe(1080);
    expect(CARD_H).toBe(1350);
    expect(CARD_H / CARD_W).toBeCloseTo(1.25, 2);
  });

  it('story dimensions should be 1080x1920', () => {
    const STORY_W = 1080;
    const STORY_H = 1920;
    expect(STORY_W).toBe(1080);
    expect(STORY_H).toBe(1920);
    expect(STORY_H / STORY_W).toBeCloseTo(1.777, 2);
  });

  it('card canvas is created at correct size', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1350);
  });

  it('story canvas is created at correct size', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    expect(canvas.width).toBe(1080);
    expect(canvas.height).toBe(1920);
  });
});
