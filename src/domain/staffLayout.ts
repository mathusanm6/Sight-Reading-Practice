import type { ClefId } from "./clefs";
import { isLedgerStep, stepRange, type Note } from "./notes";
import type { ClefMode, LedgerLimit } from "./settings";

/** One staff space, in SVG viewBox units. */
export const UNIT = 16;

const PADDING = 1.3; // staff spaces above/below the outermost step
const round2 = (n: number) => +n.toFixed(2);

/**
 * Everything is placed on one vertical axis of "global steps" measured from the
 * bottom line of the topmost staff.
 */
export interface StaffSpec {
  clef: ClefId;
  /** Global step of this staff's bottom line. */
  bottom: number;
}

/**
 * On the grand staff the gap between the staves grows with the ledger limit, so
 * the treble clef's ledger lines going down and the bass clef's going up (both
 * may pass middle C) never run into each other. With no ledger lines the gap is
 * the usual 4 steps and middle C sits halfway between the staves.
 */
export function stavesFor(clefMode: ClefMode, ledger: LedgerLimit): StaffSpec[] {
  if (clefMode !== "both") return [{ clef: clefMode, bottom: 0 }];
  const gap = 4 * ledger + 4;
  return [{ clef: "sol", bottom: 0 }, { clef: "fa", bottom: -(8 + gap) }];
}

export interface StaffGeometry {
  width: number;
  height: number;
  /** Y coordinate of a global step. */
  y: (globalStep: number) => number;
  staves: StaffSpec[];
  /** Global steps of the top line of the first staff and bottom line of the last. */
  top: number;
  bottom: number;
  left: number;
  right: number;
  noteX: number;
}

export function staffGeometry(clefMode: ClefMode, ledger: LedgerLimit): StaffGeometry {
  const staves = stavesFor(clefMode, ledger);
  const range = stepRange(ledger);
  const max = Math.max(...staves.map((s) => s.bottom + range.max));
  const min = Math.min(...staves.map((s) => s.bottom + range.min));
  const yBase = (PADDING + max / 2) * UNIT;
  return {
    width: 19 * UNIT,
    height: Math.round((PADDING * 2 + (max - min) / 2) * UNIT),
    y: (step) => round2(yBase - (step * UNIT) / 2),
    staves,
    top: Math.max(...staves.map((s) => s.bottom + 8)),
    bottom: Math.min(...staves.map((s) => s.bottom)),
    left: 0.5 * UNIT,
    right: 18.5 * UNIT,
    noteX: 11 * UNIT,
  };
}

export interface NoteGeometry {
  x: number;
  y: number;
  /** Y coordinates of the ledger lines to draw, centred on `x`. */
  ledgerYs: number[];
  stem: { x: number; y1: number; y2: number };
}

export function noteGeometry(note: Note, geo: StaffGeometry): NoteGeometry {
  const { step } = note;
  const bottom = (geo.staves.find((s) => s.clef === note.clef) ?? geo.staves[0]).bottom;
  const at = (s: number) => geo.y(bottom + s);

  const ledgerYs: number[] = [];
  if (isLedgerStep(step)) {
    if (step <= -2) for (let k = -2; k >= step; k -= 2) ledgerYs.push(at(k));
    else for (let k = 10; k <= step; k += 2) ledgerYs.push(at(k));
  }

  const y = at(step);
  const stemUp = step < 4; // below the middle line: stem up on the right
  const length = Math.max(3.5, Math.abs(4 - step) / 2) * UNIT;
  return {
    x: geo.noteX,
    y,
    ledgerYs,
    stem: {
      x: geo.noteX + (stemUp ? 0.53 : -0.53) * UNIT,
      y1: y + (stemUp ? -0.1 : 0.1) * UNIT,
      y2: stemUp ? y - length : y + length,
    },
  };
}
