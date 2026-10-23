import { describe, expect, it } from "vitest";
import { answerIndexForKey } from "./keyboard";

describe("answerIndexForKey", () => {
  it("maps English note letters, case-insensitively", () => {
    expect(answerIndexForKey({ code: "KeyC", key: "c" }, "en")).toBe(0);
    expect(answerIndexForKey({ code: "KeyB", key: "B" }, "en")).toBe(6);
  });

  it("maps the AZERTY home row in French", () => {
    const keys = ["q", "s", "d", "f", "g", "h", "j"];
    expect(keys.map((key) => answerIndexForKey({ code: "", key }, "fr"))).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it("keeps the two languages' letters separate", () => {
    expect(answerIndexForKey({ code: "KeyC", key: "c" }, "fr")).toBeNull();
    expect(answerIndexForKey({ code: "KeyQ", key: "q" }, "en")).toBeNull();
    expect(answerIndexForKey({ code: "KeyD", key: "d" }, "fr")).toBe(2);
    expect(answerIndexForKey({ code: "KeyD", key: "d" }, "en")).toBe(1);
  });

  it("maps digits by physical key in both languages, even when AZERTY produces a symbol", () => {
    expect(answerIndexForKey({ code: "Digit1", key: "&" }, "fr")).toBe(0);
    expect(answerIndexForKey({ code: "Numpad7", key: "7" }, "en")).toBe(6);
  });

  it("ignores everything else", () => {
    expect(answerIndexForKey({ code: "Digit8", key: "8" }, "fr")).toBeNull();
    expect(answerIndexForKey({ code: "KeyZ", key: "z" }, "fr")).toBeNull();
    expect(answerIndexForKey({ code: "Enter", key: "Enter" }, "en")).toBeNull();
  });
});
