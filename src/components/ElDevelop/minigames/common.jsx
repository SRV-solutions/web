import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "../style.module.css";

// Cuenta regresiva en segundos; llama a onEnd una sola vez al llegar a 0
export function useCountdown(total, active, onEnd) {
  const [left, setLeft] = useState(total);
  const endRef = useRef(onEnd);
  endRef.current = onEnd;

  useEffect(() => {
    if (!active) return undefined;
    const start = performance.now();
    setLeft(total);
    const id = setInterval(() => {
      const l = Math.max(0, total - (performance.now() - start) / 1000);
      setLeft(l);
      if (l <= 0) {
        clearInterval(id);
        endRef.current();
      }
    }, 100);
    return () => clearInterval(id);
  }, [active, total]);

  return left;
}

// Garantiza que onFinish se llame una sola vez
export function useFinishOnce(onFinish) {
  const done = useRef(false);
  const cb = useRef(onFinish);
  cb.current = onFinish;
  return useCallback((win) => {
    if (done.current) return;
    done.current = true;
    cb.current(win);
  }, []);
}

export function TimerBar({ left, total, label }) {
  const pct = Math.max(0, (left / total) * 100);
  const danger = pct < 30;
  return (
    <div className={styles.timer}>
      <div className={styles.timerLabel}>
        <span>{label}</span>
        <span>{left.toFixed(1)}s</span>
      </div>
      <div className={styles.timerTrack}>
        <div
          className={`${styles.timerFill} ${danger ? styles.timerDanger : ""}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
