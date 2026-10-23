import {
  CLEF_MODES, LANGUAGES, LEDGER_LIMITS, PRACTICE_MODES, type Settings,
} from "@/domain/settings";
import { useMessages } from "@/i18n/MessagesProvider";
import styles from "./SettingsForm.module.css";
import { SegmentedControl } from "./SegmentedControl";

interface Props {
  settings: Settings;
  onChange: (settings: Settings) => void;
}

export function SettingsForm({ settings, onChange }: Props) {
  const m = useMessages();
  return (
    <form className={styles.settings} aria-label={m.settings} onSubmit={(e) => e.preventDefault()}>
      <SegmentedControl label={m.settingLabels.clef} name="clef" value={settings.clefMode}
        options={CLEF_MODES.map((value) => ({ value, label: m.clefOptions[value] }))}
        onChange={(clefMode) => onChange({ ...settings, clefMode })} />
      <SegmentedControl label={m.settingLabels.ledger} name="ledger" value={settings.ledger}
        options={LEDGER_LIMITS.map((value) => ({ value, label: m.ledgerOptions[value] }))}
        onChange={(ledger) => onChange({ ...settings, ledger })} />
      <SegmentedControl label={m.settingLabels.mode} name="mode" value={settings.mode}
        options={PRACTICE_MODES.map((value) => ({ value, label: m.modeOptions[value] }))}
        onChange={(mode) => onChange({ ...settings, mode })} />
      <SegmentedControl label={m.settingLabels.language} name="language" value={settings.language}
        options={LANGUAGES.map((value) => ({ value, label: m.languageOptions[value] }))}
        onChange={(language) => onChange({ ...settings, language })} />
    </form>
  );
}
