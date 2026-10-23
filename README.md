# Portée

Solfège sight-reading trainer (Next.js, React, TypeScript).

```
npm run dev        # http://localhost:3000
npm test           # unit tests (vitest)
npm run lint && npm run typecheck && npm run build
```

## Layout

| Path | Role |
| --- | --- |
| `src/domain/` | Pure logic, no React or DOM: notes, clefs, staff geometry, settings, timing, key mapping. Unit-tested. |
| `src/session/` | The practice session: a pure reducer (`reducer.ts`), `useSession` (timers + persistence), `useCountdown`. |
| `src/i18n/` | All UI text (`messages.ts`, French and English, including note names) and the `useMessages` hook. |
| `src/lib/` | Browser glue: guarded `localStorage` access, class-name helper. |
| `src/hooks/` | Reusable hooks (keyboard shortcuts). |
| `src/components/` | Presentational React components, each with a co-located CSS module. |
| `src/styles/tokens.css` | Colour/typography tokens, light and dark. |

Data flows one way: `useSession` owns state → `PracticeApp` passes it down → components render and call back.
Randomness and clocks are passed into the reducer as action fields, so it stays pure.

`Portée Flash.html` is the original single-file version, kept for reference.
