import { describe, expect, it } from "vitest";
import { answerIndexForKey } from "./keyboard";

describe("answerIndexForKey", () => {
  it("maps letters, case-insensitively", () => {
    expect(answerIndexForKey({ code: "KeyC", key: "c" })).toBe(0);
    expect(answerIndexForKey({ code: "KeyB", key: "B" })).toBe(6);
  });

  it("maps digits by physical key, even when AZERTY produces a symbol", () => {
    expect(answerIndexForKey({ code: "Digit1", key: "&" })).toBe(0);
    expect(answerIndexForKey({ code: "Numpad7", key: "7" })).toBe(6);
  });

  it("ignores everything else", () => {
    expect(answerIndexForKey({ code: "Digit8", key: "8" })).toBeNull();
    expect(answerIndexForKey({ code: "KeyZ", key: "z" })).toBeNull();
    expect(answerIndexForKey({ code: "Enter", key: "Enter" })).toBeNull();
    expect(answerIndexForKey({ code: "KeyX", key: "constructor" })).toBeNull();
  });
});
