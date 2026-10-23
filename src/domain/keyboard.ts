import type { Language } from "./settings";

/**
 * Letter shortcuts for Do…Si / C…B, in order. English uses the note letters;
 * French uses the AZERTY home row, laid out like piano keys under the fingers.
 */
export const SHORTCUT_LETTERS: Readonly<Record<Language, readonly string[]>> = {
  fr: ["Q", "S", "D", "F", "G", "H", "J"],
  en: ["C", "D", "E", "F", "G", "A", "B"],
};

/**
 * Maps a key press to an answer index (0 = Do … 6 = Si), or null.
 * Digits use the physical key (`code`) so AZERTY works without Shift.
 */
export function answerIndexForKey(e: { code: string; key: string }, language: Language): number | null {
  const digit = /^(Digit|Numpad)([1-7])$/.exec(e.code);
  if (digit) return Number(digit[2]) - 1;
  if (e.key.length !== 1) return null;
  const index = SHORTCUT_LETTERS[language].indexOf(e.key.toUpperCase());
  return index >= 0 ? index : null;
}
