import type { PracticeMode } from "./settings";

export const SESSION_MS = 60_000;
export const LOW_TIME_MS = 10_000;

/** How long the answer stays on screen before the next note appears. */
export function nextNoteDelay(isRight: boolean, mode: PracticeMode): number {
  if (isRight) return 220;
  return mode === "timed" ? 800 : 1300;
}

/** "1,3 s" — French decimal comma. */
export function formatSeconds(ms: number): string {
  return (ms / 1000).toFixed(1).replace(".", ",") + " s";
}

export function average(values: readonly number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}
