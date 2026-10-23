"use client";

import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useSidebar } from "@/hooks/useSidebar";
import { useSession } from "@/session/useSession";
import styles from "./PracticeApp.module.css";
import { Board } from "./board/Board";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { PianoKeys } from "./keys/PianoKeys";
import { SettingsSidebar } from "./settings/SettingsSidebar";

export function PracticeApp() {
  const session = useSession();
  const sidebar = useSidebar();
  const { state } = session;

  useKeyboardShortcuts({ onAnswer: session.answer, onAdvance: session.advance });

  return (
    <div className={styles.shell}>
      <SettingsSidebar
        open={sidebar.open}
        settings={state.settings}
        onChange={session.changeSettings}
        onClose={() => sidebar.setOpen(false)}
      />
      <main className={styles.main}>
        <div className={styles.app}>
          <Header settingsOpen={sidebar.open} onToggleSettings={sidebar.toggle} />
          <Board state={state} msLeft={session.msLeft} onStart={session.start} />
          <PianoKeys answer={state.answer} disabled={state.phase !== "playing"} onAnswer={session.answer} />
          <Footer onReset={session.restart} />
        </div>
      </main>
    </div>
  );
}
