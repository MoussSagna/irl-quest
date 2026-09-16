import { describe, expect, it } from 'vitest';
import { clampProgress, questStatusLabel } from './helpers';

describe('progression helpers', () => {
  it('clamps progress to the supported range', () => {
    expect(clampProgress(-0.2)).toBe(0);
    expect(clampProgress(0.65)).toBe(0.65);
    expect(clampProgress(1.4)).toBe(1);
  });

  it.each([
    ['locked', 'Locked'],
    ['available', 'Available'],
    ['in-progress', 'In progress'],
    ['completed', 'Completed'],
    ['failed', 'Failed'],
  ] as const)('formats the %s quest status', (status, label) => {
    expect(questStatusLabel(status)).toBe(label);
  });
});
