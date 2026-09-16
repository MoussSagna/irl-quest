import type { QuestStatus } from './QuestCard';

export function clampProgress(value: number): number {
  return Math.min(1, Math.max(0, value));
}

export function questStatusLabel(status: QuestStatus): string {
  switch (status) {
    case 'in-progress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    case 'locked':
      return 'Locked';
    default:
      return 'Available';
  }
}
