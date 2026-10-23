import { useMessages } from "@/i18n/MessagesProvider";
import styles from "./Footer.module.css";

const SHORTCUT_LETTERS = ["C", "D", "E", "F", "G", "A", "B"];

export function Footer({ onReset }: { onReset: () => void }) {
  const m = useMessages();
  return (
    <div className={styles.foot}>
      <p className={styles.hint}>
        {m.keyboardBefore} {SHORTCUT_LETTERS.map((l) => <kbd key={l} className={styles.kbd}>{l}</kbd>)} {m.keyboardAfter}
      </p>
      <button
        className={styles.link}
        type="button"
        onClick={(e) => {
          onReset();
          if (e.detail > 0) e.currentTarget.blur(); // mouse click: don't keep focus, Space/Enter keep working
        }}
      >
        {m.reset}
      </button>
    </div>
  );
}
