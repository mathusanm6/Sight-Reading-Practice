import { average, formatSeconds, SESSION_MS } from "@/domain/timing";
import type { SessionState } from "@/session/reducer";
import styles from "./Hud.module.css";

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.stat}>
      <span className={styles.k}>{label}</span>
      <span className={styles.v}>{children}</span>
    </div>
  );
}

function thirdStat({ phase, settings, times }: SessionState, msLeft: number): [string, string] {
  if (settings.mode === "free") {
    const avg = average(times);
    return ["Moyenne", avg === null ? "–" : formatSeconds(avg)];
  }
  const seconds = phase === "idle" ? SESSION_MS / 1000 : phase === "finished" ? 0 : Math.ceil(msLeft / 1000);
  return ["Temps", `${seconds} s`];
}

export function Hud({ state, msLeft }: { state: SessionState; msLeft: number }) {
  const [thirdLabel, thirdValue] = thirdStat(state, msLeft);
  return (
    <div className={styles.hud}>
      <Stat label="Justes">{state.correct}<small>/{state.total}</small></Stat>
      <Stat label="Série">{state.streak}</Stat>
      <Stat label={thirdLabel}>{thirdValue}</Stat>
    </div>
  );
}
