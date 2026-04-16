import { QueueEntry } from '../types/index.js';

const queue: QueueEntry[] = [];

export function addToQueue(entry: QueueEntry): void {
  // Prevent duplicates
  if (!queue.find((e) => e.socketId === entry.socketId)) {
    queue.push(entry);
  }
}

export function removeFromQueue(socketId: string): void {
  const idx = queue.findIndex((e) => e.socketId === socketId);
  if (idx !== -1) queue.splice(idx, 1);
}

export function isInQueue(socketId: string): boolean {
  return queue.some((e) => e.socketId === socketId);
}

/**
 * Attempts to pair two different users from the queue.
 * Returns the two entries or null if fewer than 2 distinct users are waiting.
 */
export function tryMatch(): [QueueEntry, QueueEntry] | null {
  if (queue.length < 2) return null;
  const first = queue.shift()!;
  // Make sure we don't match with ourselves (same socketId guard already handled by add)
  const second = queue.shift()!;
  return [first, second];
}

export function getQueueLength(): number {
  return queue.length;
}
