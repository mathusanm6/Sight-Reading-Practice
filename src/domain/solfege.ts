export const NOTE_NAMES = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"] as const;

/** Letter shortcuts (English note names) mapped to an index in NOTE_NAMES. */
export const LETTER_SHORTCUTS: Readonly<Record<string, number>> = {
  c: 0, d: 1, e: 2, f: 3, g: 4, a: 5, b: 6,
};
