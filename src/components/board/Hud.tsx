import { average, SESSION_MS } from "@/domain/timing";
import { useMessages } from "@/i18n/MessagesProvider";
import type { Messages } from "@/i18n/messages";
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

function thirdStat({ phase, settings, times }: SessionState, msLeft: number, m: Messages): [string, string] {
  if (settings.mode === "free") {
    const avg = average(times);
    return [m.stats.average, avg === null ? "–" : m.formatSeconds(avg)];
  }
  const seconds = phase === "idle" ? SESSION_MS / 1000 : phase === "finished" ? 0 : Math.ceil(msLeft / 1000);
  return [m.stats.time, `${seconds} s`];
}

export function Hud({ state, msLeft }: { state: SessionState; msLeft: number }) {
  const m = useMessages();
  const [thirdLabel, thirdValue] = thirdStat(state, msLeft, m);
  return (
    <div className={styles.hud}>
      <Stat label={m.stats.correct}>{state.correct}<small>/{state.total}</small></Stat>
      <Stat label={m.stats.streak}>{state.streak}</Stat>
      <Stat label={thirdLabel}>{thirdValue}</Stat>
    </div>
  );
}
