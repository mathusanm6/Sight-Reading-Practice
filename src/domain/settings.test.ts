import { describe, expect, it } from "vitest";
import { DEFAULT_SETTINGS, parseSettings } from "./settings";

describe("parseSettings", () => {
  it("accepts valid settings", () => {
    const s = { clefMode: "fa", ledger: 4, mode: "timed" };
    expect(parseSettings(s)).toEqual(s);
  });

  it("falls back per field on invalid data", () => {
    expect(parseSettings({ clefMode: "alto", ledger: 4, mode: 3 })).toEqual({ ...DEFAULT_SETTINGS, ledger: 4 });
  });

  it("falls back entirely on non-objects", () => {
    expect(parseSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(parseSettings("x")).toEqual(DEFAULT_SETTINGS);
  });
});
