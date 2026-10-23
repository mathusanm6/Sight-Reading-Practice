import styles from "./Header.module.css";
import { SIDEBAR_ID } from "./settings/SettingsSidebar";

interface Props {
  settingsOpen: boolean | null;
  onToggleSettings: () => void;
}

export function Header({ settingsOpen, onToggleSettings }: Props) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Solfège · lecture de notes</p>
        <h1 className={styles.title}>Portée Flash</h1>
      </div>
      <button
        className={styles.toggle}
        type="button"
        aria-controls={SIDEBAR_ID}
        aria-expanded={settingsOpen ?? undefined}
        onClick={onToggleSettings}
      >
        Réglages
      </button>
    </header>
  );
}
