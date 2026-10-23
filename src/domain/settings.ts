export type ClefMode = "both" | "sol" | "fa";
export type LedgerLimit = 0 | 2 | 4;
export type PracticeMode = "free" | "timed";

export interface Settings {
  clefMode: ClefMode;
  ledger: LedgerLimit;
  mode: PracticeMode;
}

export const DEFAULT_SETTINGS: Settings = { clefMode: "both", ledger: 2, mode: "free" };

export interface Option<T> {
  value: T;
  label: string;
}

export const CLEF_OPTIONS: Option<ClefMode>[] = [
  { value: "both", label: "Sol + Fa" },
  { value: "sol", label: "Sol" },
  { value: "fa", label: "Fa" },
];

export const LEDGER_OPTIONS: Option<LedgerLimit>[] = [
  { value: 0, label: "Aucune" },
  { value: 2, label: "Jusqu’à 2" },
  { value: 4, label: "Jusqu’à 4" },
];

export const MODE_OPTIONS: Option<PracticeMode>[] = [
  { value: "free", label: "Libre" },
  { value: "timed", label: "Chrono 60 s" },
];

const isOneOf = <T>(options: Option<T>[], value: unknown): value is T =>
  options.some((o) => o.value === value);

/** Validates untrusted (e.g. persisted) data, falling back to defaults field by field. */
export function parseSettings(raw: unknown): Settings {
  const p = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  return {
    clefMode: isOneOf(CLEF_OPTIONS, p.clefMode) ? p.clefMode : DEFAULT_SETTINGS.clefMode,
    ledger: isOneOf(LEDGER_OPTIONS, p.ledger) ? p.ledger : DEFAULT_SETTINGS.ledger,
    mode: isOneOf(MODE_OPTIONS, p.mode) ? p.mode : DEFAULT_SETTINGS.mode,
  };
}
