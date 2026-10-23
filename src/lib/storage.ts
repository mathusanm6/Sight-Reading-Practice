import { parseSettings, type Settings } from "@/domain/settings";

const PREFS_KEY = "portee-flash:prefs";
const SIDEBAR_KEY = "portee-flash:sidebar";
const bestKey = ({ clefMode, ledger }: Settings) => `portee-flash:best:${clefMode}:${ledger}`;

// localStorage can throw (private mode, blocked site data), so every access is guarded.

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw === null ? null : parseSettings(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(settings));
  } catch {}
}

/** Best timed score for these settings: 0 if none yet, null if storage is unavailable. */
export function loadBestScore(settings: Settings): number | null {
  try {
    const raw = localStorage.getItem(bestKey(settings));
    return raw === null ? 0 : Number(raw) || 0;
  } catch {
    return null;
  }
}

export function saveBestScore(settings: Settings, score: number): void {
  try {
    localStorage.setItem(bestKey(settings), String(score));
  } catch {}
}

/** Whether the user last left the settings sidebar open; null if they never chose. */
export function loadSidebarOpen(): boolean | null {
  try {
    const raw = localStorage.getItem(SIDEBAR_KEY);
    return raw === null ? null : raw === "1";
  } catch {
    return null;
  }
}

export function saveSidebarOpen(open: boolean): void {
  try {
    localStorage.setItem(SIDEBAR_KEY, open ? "1" : "0");
  } catch {}
}
