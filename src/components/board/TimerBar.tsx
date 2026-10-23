import { LOW_TIME_MS, SESSION_MS } from "@/domain/timing";
import { cx } from "@/lib/cx";
import type { Phase } from "@/session/reducer";
import styles from "./TimerBar.module.css";

export function TimerBar({ phase, msLeft }: { phase: Phase; msLeft: number }) {
  const left = phase === "idle" ? SESSION_MS : phase === "finished" ? 0 : msLeft;
  return (
    <div className={styles.timer}>
      <div
        className={cx(styles.fill, left <= LOW_TIME_MS && styles.low)}
        style={{ transform: `scaleX(${(left / SESSION_MS).toFixed(4)})` }}
      />
    </div>
  );
}
