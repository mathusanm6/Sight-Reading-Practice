import { describe, expect, it } from "vitest";
import { noteGeometry, staffGeometry } from "./staffLayout";

const geo = staffGeometry("sol", 2);

describe("noteGeometry", () => {
  it("draws no ledger lines inside the staff", () => {
    expect(noteGeometry({ clef: "sol", step: 4 }, geo).ledgerYs).toEqual([]);
    expect(noteGeometry({ clef: "sol", step: -1 }, geo).ledgerYs).toEqual([]);
  });

  it("draws one ledger line per line crossed, below and above", () => {
    expect(noteGeometry({ clef: "sol", step: -4 }, geo).ledgerYs).toEqual([geo.y(-2), geo.y(-4)]);
    expect(noteGeometry({ clef: "sol", step: 11 }, geo).ledgerYs).toEqual([geo.y(10)]);
  });

  it("points stems up below the middle line and down from it", () => {
    const low = noteGeometry({ clef: "sol", step: 0 }, geo);
    const high = noteGeometry({ clef: "sol", step: 8 }, geo);
    expect(low.stem.y2).toBeLessThan(low.y);
    expect(high.stem.y2).toBeGreaterThan(high.y);
  });
});

describe("grand staff", () => {
  it("puts middle C halfway between the staves when there are no ledger lines", () => {
    const grand = staffGeometry("both", 0);
    const sol = noteGeometry({ clef: "sol", step: -2 }, grand);
    const fa = noteGeometry({ clef: "fa", step: 10 }, grand);
    expect(sol.y).toBe(fa.y);
    expect(sol.y).toBe((grand.y(0) + grand.y(-4)) / 2);
  });

  it.each([2, 4] as const)("keeps ledger zones of both staves apart with %i ledger lines", (ledger) => {
    const grand = staffGeometry("both", ledger);
    const lowestSol = noteGeometry({ clef: "sol", step: -(2 * ledger + 1) }, grand);
    const highestFa = noteGeometry({ clef: "fa", step: 8 + 2 * ledger + 1 }, grand);
    // y grows downward: the bass staff's highest note must sit below the treble staff's lowest.
    expect(highestFa.y).toBeGreaterThan(lowestSol.y);
  });

  it("is taller than a single staff", () => {
    expect(staffGeometry("both", 2).height).toBeGreaterThan(staffGeometry("sol", 2).height);
  });
});
