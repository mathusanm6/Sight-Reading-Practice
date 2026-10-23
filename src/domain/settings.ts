export const CLEF_MODES = ["both", "sol", "fa"] as const;
export const LEDGER_LIMITS = [0, 2, 4] as const;
export const PRACTICE_MODES = ["free", "timed"] as const;
export const LANGUAGES = ["fr", "en"] as const;

export type ClefMode = (typeof CLEF_MODES)[number];
export type LedgerLimit = (typeof LEDGER_LIMITS)[number];
export type PracticeMode = (typeof PRACTICE_MODES)[number];
/** Drives both the interface text and the note names (Do Ré Mi… or C D E…). */
export type Language = (typeof LANGUAGES)[number];

export interface Settings {
  clefMode: ClefMode;
  ledger: LedgerLimit;
  mode: PracticeMode;
  language: Language;
}

export const DEFAULT_SETTINGS: Settings = { clefMode: "both", ledger: 2, mode: "free", language: "fr" };

const oneOf = <T>(values: readonly T[], value: unknown, fallback: T): T =>
  values.includes(value as T) ? (value as T) : fallback;

/** Validates untrusted (e.g. persisted) data, falling back to defaults field by field. */
export function parseSettings(raw: unknown): Settings {
  const p = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    clefMode: oneOf(CLEF_MODES, p.clefMode, DEFAULT_SETTINGS.clefMode),
    ledger: oneOf(LEDGER_LIMITS, p.ledger, DEFAULT_SETTINGS.ledger),
    mode: oneOf(PRACTICE_MODES, p.mode, DEFAULT_SETTINGS.mode),
    language: oneOf(LANGUAGES, p.language, DEFAULT_SETTINGS.language),
  };
}
