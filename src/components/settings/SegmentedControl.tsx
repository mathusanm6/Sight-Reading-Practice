import { useId } from "react";
import styles from "./SegmentedControl.module.css";

export interface Option<T> {
  value: T;
  label: string;
}

interface Props<T extends string | number> {
  label: string;
  name: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string | number>({ label, name, value, options, onChange }: Props<T>) {
  const labelId = useId();
  return (
    <div className={styles.opt} role="radiogroup" aria-labelledby={labelId}>
      <span className={styles.lab} id={labelId}>{label}</span>
      <div className={styles.seg}>
        {options.map((o) => (
          <label key={o.value}>
            <input type="radio" name={name} value={o.value} checked={o.value === value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
