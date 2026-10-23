import { useCallback, useEffect, useReducer } from "react";
import { pickNote } from "@/domain/notes";
import { DEFAULT_SETTINGS, type Settings } from "@/domain/settings";
import { nextNoteDelay } from "@/domain/timing";
import { loadBestScore, loadSettings, saveBestScore, saveSettings } from "@/lib/storage";
import { createInitialState, sessionReducer } from "./reducer";
import { useCountdown } from "./useCountdown";

/** Owns the practice session: state, timers, persistence. Components only render it. */
export function useSession() {
  const [state, dispatch] = useReducer(sessionReducer, undefined, createInitialState);
  const { settings, phase, note, answer } = state;

  const reset = useCallback((next: Settings) => {
    dispatch({
      type: "reset",
      settings: next,
      note: next.mode === "free" ? pickNote(next, null) : null,
      now: performance.now(),
    });
  }, []);

  // Settings come from localStorage, so the first session starts after mount (keeps SSR markup deterministic).
  useEffect(() => reset(loadSettings() ?? DEFAULT_SETTINGS), [reset]);

  const showNext = useCallback(
    () => dispatch({ type: "show", note: pickNote(settings, note), now: performance.now() }),
    [settings, note],
  );

  // After an answer, move on automatically; leaving the locked state cancels the pending timeout.
  useEffect(() => {
    if (phase !== "playing" || !answer) return;
    const id = setTimeout(showNext, nextNoteDelay(answer.isRight, settings.mode));
    return () => clearTimeout(id);
  }, [phase, answer, settings.mode, showNext]);

  const start = useCallback(() => {
    dispatch({ type: "start", note: pickNote(settings, null), now: performance.now() });
  }, [settings]);

  const finish = () => {
    if (phase !== "playing") return;
    const previous = loadBestScore(settings);
    const isRecord = previous !== null && state.correct > previous;
    if (isRecord) saveBestScore(settings, state.correct);
    dispatch({ type: "finish", record: { previous, isRecord } });
  };

  const msLeft = useCountdown(phase === "playing" && settings.mode === "timed" ? state.endAt : null, finish);

  return {
    state,
    msLeft,
    changeSettings: (next: Settings) => {
      saveSettings(next);
      const onlyLanguageChanged =
        next.clefMode === settings.clefMode && next.ledger === settings.ledger && next.mode === settings.mode;
      if (onlyLanguageChanged) dispatch({ type: "language", language: next.language });
      else reset(next);
    },
    restart: () => reset(settings),
    answer: (index: number) => dispatch({ type: "answer", index, now: performance.now() }),
    start,
    /** Enter/Space: start a timed session, or skip the wait after an answer. Returns whether it did anything. */
    advance: (): boolean => {
      if (phase === "idle" || phase === "finished") start();
      else if (answer) showNext();
      else return false;
      return true;
    },
  };
}
