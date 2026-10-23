import { LETTER_SHORTCUTS } from "./solfege";

/**
 * Maps a key press to an answer index (0 = Do … 6 = Si), or null.
 * Digits use the physical key (`code`) so AZERTY works without Shift.
 */
export function answerIndexForKey(e: { code: string; key: string }): number | null {
  const digit = /^(Digit|Numpad)([1-7])$/.exec(e.code);
  if (digit) return Number(digit[2]) - 1;
  const letter = e.key.length === 1 ? e.key.toLowerCase() : "";
  return Object.hasOwn(LETTER_SHORTCUTS, letter) ? LETTER_SHORTCUTS[letter] : null;
}
