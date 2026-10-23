import { CLEFS, type ClefId } from "./clefs";
import type { LedgerLimit, Settings } from "./settings";

/**
 * A note on the staff. `step` counts half staff-spaces upward from the bottom
 * line: 0 = bottom line, 1 = first space, 8 = top line, -2 = first ledger line below.
 */
export interface Note {
  clef: ClefId;
  step: number;
}

const BOTTOM_STEP = 0;
const TOP_STEP = 8;
export const MIDDLE_C_STEP = { sol: -2, fa: 10 } as const;

/** Lowest/highest step reachable with `ledger` ledger lines, including the space beyond the last one. */
export function stepRange(ledger: LedgerLimit): { min: number; max: number } {
  return { min: BOTTOM_STEP - (2 * ledger + 1), max: TOP_STEP + 2 * ledger + 1 };
}

export const isLedgerStep = (step: number) => step <= -2 || step >= 10;

/** Index into NOTE_NAMES (Do=0 … Si=6) for the note. */
export function noteNameIndex(note: Note): number {
  return (((CLEFS[note.clef].bottomLineIndex + note.step) % 7) + 7) % 7;
}

export function isMiddleC(note: Note): boolean {
  return note.step === MIDDLE_C_STEP[note.clef];
}

const randomInt = (n: number, random: () => number) => Math.floor(random() * n);

/** Picks a random note for the settings, avoiding an immediate repeat of `previous`. */
export function pickNote(
  { clefMode, ledger }: Pick<Settings, "clefMode" | "ledger">,
  previous: Note | null,
  random: () => number = Math.random,
): Note {
  const { min, max } = stepRange(ledger);
  let note: Note;
  let tries = 0;
  do {
    const clef: ClefId = clefMode === "both" ? (random() < 0.5 ? "sol" : "fa") : clefMode;
    const ledgerSteps: number[] = [];
    for (let s = min; s <= max; s++) if (isLedgerStep(s)) ledgerSteps.push(s);
    // Half the picks come from the ledger zone so those notes get practised often.
    const step =
      ledger > 0 && random() < 0.5
        ? ledgerSteps[randomInt(ledgerSteps.length, random)]
        : min + randomInt(max - min + 1, random);
    note = { clef, step };
    tries++;
  } while (previous && note.clef === previous.clef && note.step === previous.step && tries < 20);
  return note;
}
