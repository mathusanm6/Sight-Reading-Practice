import { describe, expect, it } from "vitest";
import type { Note } from "@/domain/notes";
import { SESSION_MS } from "@/domain/timing";
import { DEFAULT_SETTINGS } from "@/domain/settings";
import { createInitialState, sessionReducer, type SessionAction, type SessionState } from "./reducer";

const MI: Note = { clef: "sol", step: 0 }; // Mi → index 2
const run = (actions: SessionAction[], from = createInitialState()) => actions.reduce(sessionReducer, from);
const free = (note: Note | null = MI): SessionAction => ({ type: "reset", settings: DEFAULT_SETTINGS, note, now: 1000 });
const timed = (): SessionAction => ({ type: "reset", settings: { ...DEFAULT_SETTINGS, mode: "timed" }, note: null, now: 0 });

describe("sessionReducer", () => {
  it("starts a free session playing, and a timed one idle", () => {
    expect(run([free()]).phase).toBe("playing");
    expect(run([timed()]).phase).toBe("idle");
  });

  it("scores a correct answer with its reaction time", () => {
    const s = run([free(), { type: "answer", index: 2, now: 1400 }]);
    expect(s).toMatchObject({ correct: 1, total: 1, streak: 1, lastTime: 400, times: [400] });
    expect(s.answer).toEqual({ chosen: 2, correct: 2, isRight: true });
  });

  it("breaks the streak on a wrong answer without recording a time", () => {
    const s = run([free(), { type: "answer", index: 2, now: 1100 }, { type: "show", note: MI, now: 1200 }, { type: "answer", index: 0, now: 1300 }]);
    expect(s).toMatchObject({ correct: 1, total: 2, streak: 0, times: [100] });
    expect(s.answer?.isRight).toBe(false);
  });

  it("ignores a second answer to the same note", () => {
    const once = run([free(), { type: "answer", index: 0, now: 1100 }]);
    expect(sessionReducer(once, { type: "answer", index: 2, now: 1200 })).toBe(once);
  });

  it("unlocks on the next note", () => {
    const s = run([free(), { type: "answer", index: 0, now: 1100 }, { type: "show", note: MI, now: 1200 }]);
    expect(s.answer).toBeNull();
    expect(s.shownAt).toBe(1200);
  });

  it("runs a timed session from start to finish", () => {
    const started = run([timed(), { type: "start", note: MI, now: 5000 }]);
    expect(started).toMatchObject({ phase: "playing", endAt: 5000 + SESSION_MS });

    const done = sessionReducer(started, { type: "finish", record: { previous: 3, isRecord: false } });
    expect(done.phase).toBe("finished");
    expect(sessionReducer(done, { type: "answer", index: 2, now: 9000 })).toBe(done);
  });

  it("clears stats when a new timed session starts", () => {
    let s: SessionState = run([timed(), { type: "start", note: MI, now: 0 }, { type: "answer", index: 2, now: 100 }]);
    s = sessionReducer(s, { type: "finish", record: { previous: 0, isRecord: true } });
    s = sessionReducer(s, { type: "start", note: MI, now: 70000 });
    expect(s).toMatchObject({ correct: 0, total: 0, streak: 0, times: [], record: null });
  });
});
