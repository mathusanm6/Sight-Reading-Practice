import { SESSION_MS } from "@/domain/timing";
import { noteNameIndex, type Note } from "@/domain/notes";
import { DEFAULT_SETTINGS, type Settings } from "@/domain/settings";

/**
 * idle: timed mode waiting for "Démarrer"; playing: a note is on screen (or
 * being replaced); finished: timed session over, result overlay showing.
 */
export type Phase = "idle" | "playing" | "finished";

export interface AnswerResult {
  chosen: number;
  correct: number;
  isRight: boolean;
}

export interface RecordInfo {
  /** Previous best for these settings; null when storage is unavailable. */
  previous: number | null;
  isRecord: boolean;
}

export interface SessionState {
  settings: Settings;
  phase: Phase;
  note: Note | null;
  /** Bumped whenever a new note is shown, so the view can replay its entrance animation. */
  noteSeq: number;
  shownAt: number;
  /** Set once the current note has been answered; the note is "locked" until the next one. */
  answer: AnswerResult | null;
  correct: number;
  total: number;
  streak: number;
  /** Reaction times (ms) of correct answers. */
  times: number[];
  lastTime: number | null;
  /** performance.now() deadline of the timed session. */
  endAt: number;
  record: RecordInfo | null;
}

/**
 * Randomness and clocks are inputs (`note`, `now`) rather than read inside the
 * reducer, which keeps it pure and trivially testable.
 */
export type SessionAction =
  | { type: "reset"; settings: Settings; note: Note | null; now: number }
  | { type: "start"; note: Note; now: number }
  | { type: "show"; note: Note; now: number }
  | { type: "answer"; index: number; now: number }
  | { type: "finish"; record: RecordInfo };

const emptyStats = {
  correct: 0, total: 0, streak: 0, times: [] as number[], lastTime: null as number | null,
  answer: null as AnswerResult | null, record: null as RecordInfo | null,
};

export function createInitialState(): SessionState {
  return {
    settings: DEFAULT_SETTINGS, phase: "playing", note: null, noteSeq: 0,
    shownAt: 0, endAt: 0, ...emptyStats,
  };
}

export function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "reset":
      return {
        ...state,
        ...emptyStats,
        settings: action.settings,
        phase: action.settings.mode === "timed" ? "idle" : "playing",
        note: action.note,
        noteSeq: state.noteSeq + 1,
        shownAt: action.now,
      };

    case "start":
      return {
        ...state,
        ...emptyStats,
        phase: "playing",
        note: action.note,
        noteSeq: state.noteSeq + 1,
        shownAt: action.now,
        endAt: action.now + SESSION_MS,
      };

    case "show":
      if (state.phase !== "playing") return state;
      return { ...state, note: action.note, noteSeq: state.noteSeq + 1, shownAt: action.now, answer: null };

    case "answer": {
      if (state.phase !== "playing" || state.answer || !state.note) return state;
      const correct = noteNameIndex(state.note);
      const isRight = correct === action.index;
      const reactionTime = action.now - state.shownAt;
      return {
        ...state,
        answer: { chosen: action.index, correct, isRight },
        total: state.total + 1,
        correct: state.correct + (isRight ? 1 : 0),
        streak: isRight ? state.streak + 1 : 0,
        times: isRight ? [...state.times, reactionTime] : state.times,
        lastTime: isRight ? reactionTime : state.lastTime,
      };
    }

    case "finish":
      if (state.phase !== "playing") return state;
      return { ...state, phase: "finished", record: action.record };
  }
}
