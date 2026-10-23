import { useEffect, useRef, useState } from "react";
import { SESSION_MS } from "@/domain/timing";

/**
 * Milliseconds left until `endAt` (a performance.now() deadline), refreshed
 * every 100 ms. Pass null to stop. `onExpire` fires once when time runs out.
 */
export function useCountdown(endAt: number | null, onExpire: () => void): number {
  const [msLeft, setMsLeft] = useState(SESSION_MS);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    if (endAt === null) return;
    const tick = () => {
      const left = Math.max(0, endAt - performance.now());
      setMsLeft(left);
      if (left <= 0) {
        clearInterval(id);
        onExpireRef.current();
      }
    };
    const id = setInterval(tick, 100);
    tick();
    return () => clearInterval(id);
  }, [endAt]);

  return msLeft;
}
