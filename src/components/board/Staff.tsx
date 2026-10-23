import { CLEFS } from "@/domain/clefs";
import type { Note } from "@/domain/notes";
import type { ClefMode, LedgerLimit } from "@/domain/settings";
import { noteGeometry, staffGeometry, UNIT } from "@/domain/staffLayout";
import { useMessages } from "@/i18n/MessagesProvider";
import { cx } from "@/lib/cx";
import styles from "./Staff.module.css";

interface Props {
  note: Note | null;
  /** Changes with every new note so its entrance animation replays. */
  noteKey: number;
  clefMode: ClefMode;
  ledger: LedgerLimit;
  result: "ok" | "bad" | null;
}

const STAFF_LINE_STEPS = [0, 2, 4, 6, 8];

export function Staff({ note, noteKey, clefMode, ledger, result }: Props) {
  const m = useMessages();
  const geo = staffGeometry(clefMode, ledger);
  const { y } = geo;
  const n = note && noteGeometry(note, geo);

  return (
    <svg className={styles.staff} viewBox={`0 0 ${geo.width} ${geo.height}`} role="img" aria-label={m.staffLabel}>
      {geo.staves.map(({ clef, bottom }) => (
        <g key={clef}>
          {STAFF_LINE_STEPS.map((step) => (
            <line key={step} className={styles.line} x1={geo.left} x2={geo.right} y1={y(bottom + step)} y2={y(bottom + step)} />
          ))}
          <g className={styles.clef} transform={`translate(${1.0 * UNIT} ${y(bottom + CLEFS[clef].originStep)}) scale(${UNIT})`}>
            <path d={CLEFS[clef].path} />
          </g>
        </g>
      ))}
      {/* Barlines span the whole system, joining both staves on the grand staff. */}
      <line className={styles.line} x1={geo.left} x2={geo.left} y1={y(geo.top)} y2={y(geo.bottom)} />
      <line className={styles.line} x1={17.5 * UNIT} x2={17.5 * UNIT} y1={y(geo.top)} y2={y(geo.bottom)} />
      <rect className={styles.thick} x={17.9 * UNIT} y={y(geo.top)} width={0.6 * UNIT} height={y(geo.bottom) - y(geo.top)} />

      {note && n && (
        <g key={noteKey} className={styles.enter}>
          {n.ledgerYs.map((ly) => (
            <line key={ly} className={styles.ledger} x1={n.x - 1.25 * UNIT} x2={n.x + 1.25 * UNIT} y1={ly} y2={ly} />
          ))}
          <g className={cx(styles.note, result === "ok" && styles.ok, result === "bad" && styles.bad)}>
            <line className={styles.stem} x1={n.stem.x} x2={n.stem.x} y1={n.stem.y1} y2={n.stem.y2} />
            <ellipse className={styles.head} rx={0.65 * UNIT} ry={0.43 * UNIT} transform={`translate(${n.x} ${n.y}) rotate(-24)`} />
          </g>
        </g>
      )}
    </svg>
  );
}
