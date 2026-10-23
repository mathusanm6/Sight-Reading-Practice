import { useMessages } from "@/i18n/MessagesProvider";
import type { SessionState } from "@/session/reducer";
import styles from "./Board.module.css";
import { Feedback } from "./Feedback";
import { Hud } from "./Hud";
import { Staff } from "./Staff";
import { StageOverlay } from "./StageOverlay";
import { TimerBar } from "./TimerBar";

interface Props {
  state: SessionState;
  msLeft: number;
  onStart: () => void;
}

/** The "score sheet" card: stats, optional countdown, staff, and answer feedback. */
export function Board({ state, msLeft, onStart }: Props) {
  const m = useMessages();
  const { phase, settings, answer } = state;
  const timed = settings.mode === "timed";
  return (
    <section className={styles.board} aria-label={m.exercise}>
      <Hud state={state} msLeft={msLeft} />
      {timed && <TimerBar phase={phase} msLeft={msLeft} />}
      <div className={styles.stage}>
        <Staff
          note={state.note}
          noteKey={state.noteSeq}
          clefMode={settings.clefMode}
          ledger={settings.ledger}
          result={answer ? (answer.isRight ? "ok" : "bad") : null}
        />
        <StageOverlay state={state} onStart={onStart} />
      </div>
      <Feedback state={state} />
    </section>
  );
}
