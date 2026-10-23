import type { ClefMode, Language, LedgerLimit, PracticeMode } from "@/domain/settings";

/** Every user-visible string. Adding a language means adding one object that satisfies this type. */
export interface Messages {
  appTitle: string;
  appSubtitle: string;
  /** Do/C … Si/B, indexed like the answer keys. */
  noteNames: readonly string[];
  /** "1,3 s" in French, "1.3 s" in English. */
  formatSeconds: (ms: number) => string;
  formatPercent: (percent: number) => string;

  settings: string;
  hideSettings: string;
  closeSettings: string;
  settingLabels: { clef: string; ledger: string; mode: string; language: string };
  clefOptions: Record<ClefMode, string>;
  ledgerOptions: Record<LedgerLimit, string>;
  modeOptions: Record<PracticeMode, string>;
  languageOptions: Record<Language, string>;

  exercise: string;
  staffLabel: string;
  noteNameKeys: string;
  stats: { correct: string; streak: string; average: string; time: string };
  prompt: string;
  rightAnswer: (name: string) => string;
  wrongAnswer: (name: string) => string;
  middleC: string;
  lastTime: (time: string) => string;

  timedMode: string;
  timedIntro: readonly [string, string];
  start: string;
  timeUp: string;
  correctNotes: string;
  summary: (total: number, percent: string, averageTime: string | null) => string;
  newRecord: string;
  record: (score: number) => string;
  playAgain: string;

  keyboardBefore: string;
  keyboardAfter: string;
  reset: string;
}

const seconds = (ms: number, decimal: string) => (ms / 1000).toFixed(1).replace(".", decimal) + " s";

const fr: Messages = {
  appTitle: "Portée",
  appSubtitle: "Solfège · lecture de notes",
  noteNames: ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"],
  formatSeconds: (ms) => seconds(ms, ","),
  formatPercent: (p) => `${p} %`,

  settings: "Réglages",
  hideSettings: "Masquer",
  closeSettings: "Fermer les réglages",
  settingLabels: { clef: "Clé", ledger: "Lignes suppl.", mode: "Mode", language: "Langue" },
  clefOptions: { both: "Sol + Fa", sol: "Sol", fa: "Fa" },
  ledgerOptions: { 0: "Aucune", 2: "Jusqu’à 2", 4: "Jusqu’à 4" },
  modeOptions: { free: "Libre", timed: "Chrono 60 s" },
  languageOptions: { fr: "Français", en: "English" },

  exercise: "Exercice",
  staffLabel: "Portée avec une note à nommer",
  noteNameKeys: "Nom de la note",
  stats: { correct: "Justes", streak: "Série", average: "Moyenne", time: "Temps" },
  prompt: "Quelle est cette note ?",
  rightAnswer: (name) => `Juste · ${name}`,
  wrongAnswer: (name) => `Non · c’était ${name}`,
  middleC: "do central",
  lastTime: (time) => `Dernière ${time}`,

  timedMode: "Mode chrono",
  timedIntro: ["60 secondes.", "Nomme un maximum de notes."],
  start: "Démarrer",
  timeUp: "Temps écoulé",
  correctNotes: "notes justes",
  summary: (total, percent, avg) => `sur ${total} · ${percent}${avg === null ? "" : ` · ${avg} par note`}`,
  newRecord: "Nouveau record",
  record: (score) => `Record : ${score} pour ces réglages`,
  playAgain: "Rejouer",

  keyboardBefore: "Clavier :",
  keyboardAfter: "pour Do à Si",
  reset: "Remettre à zéro",
};

const en: Messages = {
  appTitle: "Portée",
  appSubtitle: "Sight-reading · note names",
  noteNames: ["C", "D", "E", "F", "G", "A", "B"],
  formatSeconds: (ms) => seconds(ms, "."),
  formatPercent: (p) => `${p}%`,

  settings: "Settings",
  hideSettings: "Hide",
  closeSettings: "Close settings",
  settingLabels: { clef: "Clef", ledger: "Ledger lines", mode: "Mode", language: "Language" },
  clefOptions: { both: "Treble + Bass", sol: "Treble", fa: "Bass" },
  ledgerOptions: { 0: "None", 2: "Up to 2", 4: "Up to 4" },
  modeOptions: { free: "Free", timed: "Timed 60 s" },
  languageOptions: { fr: "Français", en: "English" },

  exercise: "Exercise",
  staffLabel: "Staff with a note to name",
  noteNameKeys: "Note name",
  stats: { correct: "Correct", streak: "Streak", average: "Average", time: "Time" },
  prompt: "What note is this?",
  rightAnswer: (name) => `Correct · ${name}`,
  wrongAnswer: (name) => `Wrong · it was ${name}`,
  middleC: "middle C",
  lastTime: (time) => `Last ${time}`,

  timedMode: "Timed mode",
  timedIntro: ["60 seconds.", "Name as many notes as you can."],
  start: "Start",
  timeUp: "Time’s up",
  correctNotes: "correct notes",
  summary: (total, percent, avg) => `out of ${total} · ${percent}${avg === null ? "" : ` · ${avg} per note`}`,
  newRecord: "New record",
  record: (score) => `Best: ${score} with these settings`,
  playAgain: "Play again",

  keyboardBefore: "Keyboard:",
  keyboardAfter: "for C to B",
  reset: "Reset",
};

export const messages: Record<Language, Messages> = { fr, en };
