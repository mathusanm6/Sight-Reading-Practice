import type { CSSProperties } from "react";
import { NOTE_NAMES } from "@/domain/solfege";
import { cx } from "@/lib/cx";
import type { AnswerResult } from "@/session/reducer";
import styles from "./PianoKeys.module.css";

/** Decorative black keys sit between white keys; the value is the boundary after which white key (1 = between Do and Ré). */
const BLACK_KEY_POSITIONS = [1, 2, 4, 5, 6];

interface Props {
  answer: AnswerResult | null;
  disabled: boolean;
  onAnswer: (index: number) => void;
}

export function PianoKeys({ answer, disabled, onAnswer }: Props) {
  return (
    <section className={cx(styles.keys, disabled && styles.off)} aria-label="Nom de la note">
      {NOTE_NAMES.map((name, i) => (
        <button
          key={name}
          type="button"
          className={cx(
            styles.key,
            answer?.correct === i && styles.ok,
            answer && !answer.isRight && answer.chosen === i && styles.bad,
          )}
          onClick={(e) => {
            if (e.detail > 0) e.currentTarget.blur(); // mouse click: don't keep focus, Space/Enter keep working
            onAnswer(i);
          }}
        >
          {name}
        </button>
      ))}
      {BLACK_KEY_POSITIONS.map((pos) => (
        <i key={pos} className={styles.black} style={{ "--pos": pos } as CSSProperties} />
      ))}
    </section>
  );
}
