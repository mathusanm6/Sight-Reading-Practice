import { useCallback, useSyncExternalStore } from "react";
import { loadSidebarOpen, saveSidebarOpen } from "@/lib/storage";

// The preference lives in localStorage, an external store, so it is read with
// useSyncExternalStore: null on the server, the saved value once hydrated.
let chosen: boolean | null = null; // survives unavailable storage for the rest of the page's life
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};
const getSnapshot = () => chosen ?? loadSidebarOpen();
const getServerSnapshot = () => null;

function choose(open: boolean) {
  chosen = open;
  saveSidebarOpen(open);
  listeners.forEach((l) => l());
}

/**
 * Open/closed state of the settings sidebar. `null` means the user hasn't
 * chosen yet, and CSS decides (open on wide screens, closed as a drawer on narrow ones).
 */
export function useSidebar() {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  /** Toggles from whatever is currently showing, which for `null` depends on the viewport. */
  const toggle = useCallback(() => {
    choose(!(open ?? window.matchMedia("(min-width: 900px)").matches));
  }, [open]);

  return { open, setOpen: choose, toggle };
}
