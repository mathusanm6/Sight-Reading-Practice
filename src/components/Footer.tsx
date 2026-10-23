import { SHORTCUT_LETTERS } from "@/domain/keyboard";
import type { Language } from "@/domain/settings";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "./Footer.module.css";

export function Footer({ language, onReset }: { language: Language; onReset: () => void }) {
  const m = useMessages();
  return (
    <div className={styles.foot}>
      <p className={styles.hint}>
        {m.keyboardBefore} {SHORTCUT_LETTERS[language].map((l) => <kbd key={l} className={styles.kbd}>{l}</kbd>)} {m.keyboardAfter}
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
