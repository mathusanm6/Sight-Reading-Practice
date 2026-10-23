import { describe, expect, it } from "vitest";
import { LANGUAGES } from "@/domain/settings";
import { messages } from "./messages";

describe("messages", () => {
  it.each(LANGUAGES)("%s names all seven notes", (language) => {
    expect(messages[language].noteNames).toHaveLength(7);
  });

  it("names notes in solfège in French and by letter in English", () => {
    expect(messages.fr.noteNames[0]).toBe("Do");
    expect(messages.en.noteNames[0]).toBe("C");
  });

  it("formats seconds with the language's decimal separator", () => {
    expect(messages.fr.formatSeconds(1250)).toBe("1,3 s");
    expect(messages.en.formatSeconds(1250)).toBe("1.3 s");
  });
});
