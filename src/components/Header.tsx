import styles from "./Header.module.css";
import { Sparkle } from "./Sparkle";
import { SIDEBAR_ID } from "./settings/SettingsSidebar";

interface Props {
  settingsOpen: boolean | null;
  onToggleSettings: () => void;
}

export function Header({ settingsOpen, onToggleSettings }: Props) {
  return (
    <header className={styles.header}>
      <button
        className={styles.toggle}
        type="button"
        aria-label="Réglages"
        title="Réglages"
        aria-controls={SIDEBAR_ID}
        aria-expanded={settingsOpen ?? undefined}
        onClick={onToggleSettings}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          {[4.5, 13.5].flatMap((cx) => [4.5, 13.5].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" />))}
        </svg>
      </button>
      <div className={styles.titles}>
        <h1 className={styles.title}>Portée Flash</h1>
        <p className={styles.sub}>Solfège · lecture de notes</p>
      </div>
      <span className={styles.badge} aria-hidden="true"><Sparkle size={20} /></span>
    </header>
  );
}
