import { useEffect, useRef } from "react";
import { average, formatSeconds } from "@/domain/timing";
import { cx } from "@/lib/cx";
import type { SessionState } from "@/session/reducer";
import { Sparkle } from "../Sparkle";
import styles from "./StageOverlay.module.css";

function IdleContent({ onStart }: { onStart: () => void }) {
  return (
    <>
      <p className={styles.kicker}>Mode chrono</p>
      <p className={styles.title}>60 secondes.<br />Nomme un maximum de notes.</p>
      <button className={styles.primary} type="button" onClick={onStart}><Sparkle size={16} />Démarrer<Sparkle size={16} /></button>
    </>
  );
}

function ResultContent({ state, onStart }: { state: SessionState; onStart: () => void }) {
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => button.current?.focus({ preventScroll: true }), []);

  const { correct, total, times, record } = state;
  const pct = total ? `${Math.round((100 * correct) / total)} %` : "–";
  const avg = average(times);

  return (
    <>
      <p className={styles.kicker}>Temps écoulé</p>
      <p className={styles.big}><b>{correct}</b><span>notes justes</span></p>
      <p className={styles.sub}>sur {total} · {pct}{avg === null ? "" : ` · ${formatSeconds(avg)} par note`}</p>
      {record?.isRecord && <p className={cx(styles.record, styles.new)}>Nouveau record</p>}
      {!record?.isRecord && !!record?.previous && (
        <p className={styles.record}>Record : {record.previous} pour ces réglages</p>
      )}
      <button ref={button} className={styles.primary} type="button" onClick={onStart}><Sparkle size={16} />Rejouer<Sparkle size={16} /></button>
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
