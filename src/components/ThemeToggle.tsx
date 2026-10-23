import { useSyncExternalStore } from "react";
import { useMessages } from "@/i18n/MessagesProvider";
import { saveTheme, type Theme } from "@/lib/storage";
import styles from "./Header.module.css";

/** The theme in effect: an explicit data-theme if the user chose one, otherwise the system setting. */
function currentTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const query = matchMedia("(prefers-color-scheme: dark)");
  query.addEventListener("change", onChange);
  return () => {
    observer.disconnect();
    query.removeEventListener("change", onChange);
  };
}

export function ThemeToggle() {
  const m = useMessages();
  // null on the server: it can't know the system setting.
  const theme = useSyncExternalStore<Theme | null>(subscribe, currentTheme, () => null);

  const toggle = () => {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    saveTheme(next);
  };

  const label = theme === "dark" ? m.switchToLight : m.switchToDark;
  return (
    <button className={styles.toggle} type="button" aria-label={label} title={label} onClick={toggle}>
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        {theme === "dark" ? (
          <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none">
            <circle cx="9" cy="9" r="3.2" fill="currentColor" stroke="none" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="9" y1="1.6" x2="9" y2="3.4" transform={`rotate(${a} 9 9)`} />
            ))}
          </g>
        ) : (
          <path d="M14.5 10.6A6 6 0 0 1 7.4 3.5a6 6 0 1 0 7.1 7.1z" fill="currentColor" />
        )}
      </svg>
    </button>
  );
}
