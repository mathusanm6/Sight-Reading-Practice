import { useEffect, useRef } from "react";
import { answerIndexForKey } from "@/domain/keyboard";

interface Handlers {
  onAnswer: (index: number) => void;
  /** Returns true if the key press was used. */
  onAdvance: () => boolean;
}

/** Note-name keys (C–G, A, B or 1–7) answer; Enter/Space starts or skips ahead. */
export function useKeyboardShortcuts(handlers: Handlers) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const index = answerIndexForKey(e);
      if (index !== null) {
        e.preventDefault();
        ref.current.onAnswer(index);
        return;
      }
      // Let focused buttons handle their own Enter/Space activation.
      const onButton = e.target instanceof HTMLElement && e.target.tagName === "BUTTON";
      if ((e.key === "Enter" || e.key === " ") && !onButton && ref.current.onAdvance()) {
        e.preventDefault();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
