import { isMiddleC } from "@/domain/notes";
import { NOTE_NAMES } from "@/domain/solfege";
import { formatSeconds } from "@/domain/timing";
import { cx } from "@/lib/cx";
import type { SessionState } from "@/session/reducer";
import styles from "./Feedback.module.css";

function message({ phase, note, answer }: SessionState): { text: string; tone: "muted" | "ok" | "bad" } {
  if (answer && note) {
    const name = NOTE_NAMES[answer.correct] + (isMiddleC(note) ? " (do central)" : "");
    return answer.isRight
      ? { text: `Juste · ${name}`, tone: "ok" }
      : { text: `Non · c’était ${name}`, tone: "bad" };
  }
  return { text: phase === "playing" ? "Quelle est cette note ?" : "", tone: "muted" };
}

export function Feedback({ state }: { state: SessionState }) {
  const { text, tone } = message(state);
  const showLast = state.phase !== "finished" && state.lastTime !== null;
  return (
    <div className={styles.feedback} aria-live="polite">
      <span className={cx(styles.msg, tone === "muted" && styles.muted, tone === "ok" && styles.ok, tone === "bad" && styles.bad)}>
        {text}
      </span>
      <span className={styles.last}>{showLast && `Dernière ${formatSeconds(state.lastTime!)}`}</span>
    </div>
  );
}
