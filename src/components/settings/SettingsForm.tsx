import { CLEF_OPTIONS, LEDGER_OPTIONS, MODE_OPTIONS, type Settings } from "@/domain/settings";
import styles from "./SettingsForm.module.css";
import { SegmentedControl } from "./SegmentedControl";

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SettingsForm({ settings, onChange }: Props) {
  return (
    <form className={styles.settings} aria-label="Réglages" onSubmit={(e) => e.preventDefault()}>
      <SegmentedControl label="Clé" name="clef" options={CLEF_OPTIONS} value={settings.clefMode}
        onChange={(clefMode) => onChange({ ...settings, clefMode })} />
      <SegmentedControl label="Lignes suppl." name="ledger" options={LEDGER_OPTIONS} value={settings.ledger}
        onChange={(ledger) => onChange({ ...settings, ledger })} />
      <SegmentedControl label="Mode" name="mode" options={MODE_OPTIONS} value={settings.mode}
        onChange={(mode) => onChange({ ...settings, mode })} />
    </form>
  );
}
