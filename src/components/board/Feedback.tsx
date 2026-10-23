import { isMiddleC } from "@/domain/notes";
import { useMessages } from "@/i18n/MessagesProvider";
import type { Messages } from "@/i18n/messages";
import { cx } from "@/lib/cx";
import type { SessionState } from "@/session/reducer";
import styles from "./Feedback.module.css";

function message({ phase, note, answer }: SessionState, m: Messages): { text: string; tone: "muted" | "ok" | "bad" } {
  if (answer && note) {
    const name = m.noteNames[answer.correct] + (isMiddleC(note) ? ` (${m.middleC})` : "");
    return answer.isRight
      ? { text: m.rightAnswer(name), tone: "ok" }
      : { text: m.wrongAnswer(name), tone: "bad" };
  }
  return { text: phase === "playing" ? m.prompt : "", tone: "muted" };
}

export function Feedback({ state }: { state: SessionState }) {
  const m = useMessages();
  const { text, tone } = message(state, m);
  const showLast = state.phase !== "finished" && state.lastTime !== null;
  return (
    <div className={styles.feedback} aria-live="polite">
      <span className={cx(styles.msg, tone === "muted" && styles.muted, tone === "ok" && styles.ok, tone === "bad" && styles.bad)}>
        {text}
      </span>
      <span className={styles.last}>{showLast && m.lastTime(m.formatSeconds(state.lastTime!))}</span>
    </div>
  );
}
