import type { Settings } from "@/domain/settings";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "./SettingsSidebar.module.css";
import { SettingsForm } from "./SettingsForm";

export const SIDEBAR_ID = "settings-sidebar";

interface Props {
  open: boolean | null;
  settings: Settings;
  onChange: (settings: Settings) => void;
  onClose: () => void;
}

/** Left panel with the settings. A drawer over the exercise on narrow screens. */
export function SettingsSidebar({ open, settings, onChange, onClose }: Props) {
  const m = useMessages();
  // data-open is absent until the user chooses, leaving the viewport-based CSS default in charge.
  const state = open === null ? undefined : String(open);
  return (
    <>
      <button className={styles.backdrop} data-open={state} type="button" aria-label={m.closeSettings} tabIndex={-1} onClick={onClose} />
      <aside id={SIDEBAR_ID} className={styles.sidebar} data-open={state} aria-label={m.settings}>
        <div className={styles.head}>
          <h2 className={styles.title}>{m.settings}</h2>
          <button className={styles.close} type="button" onClick={onClose}>{m.hideSettings}</button>
        </div>
        <SettingsForm settings={settings} onChange={onChange} />
      </aside>
    </>
  );
}
