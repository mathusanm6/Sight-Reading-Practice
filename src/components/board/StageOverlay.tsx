import { useEffect, useRef } from "react";
import { average } from "@/domain/timing";
import { useMessages } from "@/i18n/MessagesProvider";
import { cx } from "@/lib/cx";
import type { SessionState } from "@/session/reducer";
import { Sparkle } from "../Sparkle";
import styles from "./StageOverlay.module.css";

function IdleContent({ onStart }: { onStart: () => void }) {
  const m = useMessages();
  return (
    <>
      <p className={styles.kicker}>{m.timedMode}</p>
      <p className={styles.title}>{m.timedIntro[0]}<br />{m.timedIntro[1]}</p>
      <button className={styles.primary} type="button" onClick={onStart}><Sparkle size={16} />{m.start}<Sparkle size={16} /></button>
    </>
  );
}

function ResultContent({ state, onStart }: { state: SessionState; onStart: () => void }) {
  const m = useMessages();
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus({ preventScroll: true }), []);

  const { correct, total, times, record } = state;
  const pct = total ? m.formatPercent(Math.round((100 * correct) / total)) : "–";
  const avg = average(times);

  return (
    <>
      <p className={styles.kicker}>{m.timeUp}</p>
      <p className={styles.big}><b>{correct}</b><span>{m.correctNotes}</span></p>
      <p className={styles.sub}>{m.summary(total, pct, avg === null ? null : m.formatSeconds(avg))}</p>
      {record?.isRecord && <p className={cx(styles.record, styles.new)}>{m.newRecord}</p>}
      {!record?.isRecord && !!record?.previous && (
        <p className={styles.record}>{m.record(record.previous)}</p>
      )}
      <button ref={button} className={styles.primary} type="button" onClick={onStart}><Sparkle size={16} />{m.playAgain}<Sparkle size={16} /></button>
    </>
  );
}

/** Covers the staff in timed mode before the session starts and after it ends. */
export function StageOverlay({ state, onStart }: { state: SessionState; onStart: () => void }) {
  if (state.phase === "playing") return null;
  return (
    <div className={styles.overlay}>
      {state.phase === "idle" ? <IdleContent onStart={onStart} /> : <ResultContent state={state} onStart={onStart} />}
    </div>
  );
}
