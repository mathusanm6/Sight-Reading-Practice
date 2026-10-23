import { useMessages } from "@/i18n/MessagesProvider";
import styles from "./Header.module.css";
import { SIDEBAR_ID } from "./settings/SettingsSidebar";

interface Props {
  settingsOpen: boolean | null;
  onToggleSettings: () => void;
}

export function Header({ settingsOpen, onToggleSettings }: Props) {
  const m = useMessages();
  return (
    <header className={styles.header}>
      <button
        className={styles.toggle}
        type="button"
        aria-label={m.settings}
        title={m.settings}
        aria-controls={SIDEBAR_ID}
        aria-expanded={settingsOpen ?? undefined}
        onClick={onToggleSettings}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          {[4.5, 13.5].flatMap((cx) => [4.5, 13.5].map((cy) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2.6" fill="currentColor" />))}
        </svg>
      </button>
      <div className={styles.titles}>
        <h1 className={styles.title}>{m.appTitle}</h1>
        <p className={styles.sub}>{m.appSubtitle}</p>
      </div>
    </header>
  );
}
