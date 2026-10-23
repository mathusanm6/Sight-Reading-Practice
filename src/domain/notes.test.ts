import { describe, expect, it } from "vitest";
import { isMiddleC, noteNameIndex, pickNote, stepRange } from "./notes";
import { messages } from "@/i18n/messages";

const NOTE_NAMES = messages.fr.noteNames;

describe("noteNameIndex", () => {
  it("names the treble clef lines and spaces", () => {
    const name = (step: number) => NOTE_NAMES[noteNameIndex({ clef: "sol", step })];
    expect(name(0)).toBe("Mi"); // bottom line
    expect(name(2)).toBe("Sol"); // the line the clef curls around
    expect(name(8)).toBe("Fa"); // top line
    expect(name(-2)).toBe("Do"); // middle C
  });

  it("names the bass clef lines and spaces", () => {
    const name = (step: number) => NOTE_NAMES[noteNameIndex({ clef: "fa", step })];
    expect(name(0)).toBe("Sol");
    expect(name(6)).toBe("Fa"); // the line the clef sits on
    expect(name(10)).toBe("Do"); // middle C
  });
});

describe("isMiddleC", () => {
  it("is true only for the ledger line between the staves", () => {
    expect(isMiddleC({ clef: "sol", step: -2 })).toBe(true);
    expect(isMiddleC({ clef: "fa", step: 10 })).toBe(true);
    expect(isMiddleC({ clef: "sol", step: 10 })).toBe(false);
  });
});

describe("pickNote", () => {
  const rng = (seed = 1) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  it("stays within the ledger range and the chosen clef", () => {
    const random = rng();
    for (const ledger of [0, 2, 4] as const) {
      const { min, max } = stepRange(ledger);
      for (let i = 0; i < 500; i++) {
        const note = pickNote({ clefMode: "fa", ledger }, null, random);
        expect(note.clef).toBe("fa");
        expect(note.step).toBeGreaterThanOrEqual(min);
        expect(note.step).toBeLessThanOrEqual(max);
      }
    }
  });

  it("uses both clefs on the grand staff, each with ledger lines on either side", () => {
    const random = rng(11);
    const seen = new Set<string>();
    let faAboveStaff = false;
    let solBelowStaff = false;
    for (let i = 0; i < 600; i++) {
      const { clef, step } = pickNote({ clefMode: "both", ledger: 4 }, null, random);
      seen.add(clef);
      if (clef === "fa" && step >= 10) faAboveStaff = true;
      if (clef === "sol" && step <= -2) solBelowStaff = true;
    }
    expect(seen).toEqual(new Set(["sol", "fa"]));
    expect(faAboveStaff && solBelowStaff).toBe(true);
  });

  it("uses no ledger lines when ledger is 0", () => {
    const random = rng(7);
    for (let i = 0; i < 200; i++) {
      const { step } = pickNote({ clefMode: "both", ledger: 0 }, null, random);
      expect(step).toBeGreaterThan(-2);
      expect(step).toBeLessThan(10);
    }
  });

  it("does not repeat the previous note", () => {
    const random = rng(3);
    let prev = pickNote({ clefMode: "sol", ledger: 0 }, null, random);
    for (let i = 0; i < 300; i++) {
      const next = pickNote({ clefMode: "sol", ledger: 0 }, prev, random);
      expect(next).not.toEqual(prev);
      prev = next;
    }
  });
});
