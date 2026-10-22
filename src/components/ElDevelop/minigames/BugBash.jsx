import React, { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import { BUG_FILES } from "../data";
import { rand, randInt } from "../helpers";
import { useFinishOnce, TimerBar } from "./common";
import { Icon } from "../icons";


// Aplastar bugs que asoman en los archivos (tipo "pegale al topo")
export default function BugBash({ timeMult, diff = 1, onFinish }) {
  const DURATION = [25, 25, 26, 27][diff - 1];
  const GOAL = [8, 10, 12, 14][diff - 1];
  const visible = [1, 0.85, 0.72, 0.62][diff - 1]; // los bugs se esconden más rápido
  const finishOnce = useFinishOnce(onFinish);
  const [, setFrame] = useState(0);
  const g = useRef({ bugs: {}, squashed: {}, score: 0, left: DURATION * timeMult, spawnIn: 0.5, over: false });
  const total = DURATION * timeMult;

  useEffect(() => {
    let last = performance.now();
    const start = last;
    const id = setInterval(() => {
      const s = g.current;
      if (s.over) return;
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      s.left = Math.max(0, total - (now - start) / 1000);

      for (const k of Object.keys(s.bugs)) {
        s.bugs[k] -= dt;
        if (s.bugs[k] <= 0) delete s.bugs[k];
      }
      for (const k of Object.keys(s.squashed)) {
        s.squashed[k] -= dt;
        if (s.squashed[k] <= 0) delete s.squashed[k];
      }
      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        const cell = randInt(0, BUG_FILES.length - 1);
        if (!s.bugs[cell]) s.bugs[cell] = rand(1.4, 2) * visible * timeMult;
        s.spawnIn = rand(0.5, 0.9);
      }

      if (s.score >= GOAL) {
        s.over = true;
        setTimeout(() => finishOnce(true), 600);
      } else if (s.left <= 0) {
        s.over = true;
        setTimeout(() => finishOnce(false), 600);
      }
      setFrame((f) => f + 1);
    }, 50);
    return () => clearInterval(id);
  }, [total, timeMult, finishOnce, GOAL, visible]);

  const s = g.current;

  const hit = (cell) => {
    if (s.over || !s.bugs[cell]) return;
    delete s.bugs[cell];
    s.squashed[cell] = 0.4;
    s.score += 1;
    setFrame((f) => f + 1);
  };

  return (
    <div>
      <TimerBar left={s.left} total={total} label={`Bugs aplastados: ${s.score}/${GOAL}`} />
      <div className={styles.bugGrid}>
        {BUG_FILES.map((file, i) => (
          <button type="button" key={file} className={`${styles.bugCell} ${s.bugs[i] ? styles.bugOn : ""}`} onPointerDown={() => hit(i)}>
            <span className={styles.bugIcon} style={{ display: "inline-flex", lineHeight: 1 }}>
              {s.squashed[i] ? (
                <Icon name="bugOff" size="1em" color="var(--green)" />
              ) : s.bugs[i] ? (
                <Icon name="bug" size="1em" color="var(--orange)" />
              ) : (
                <Icon name="fileCode" size="1em" color="var(--muted)" />
              )}
            </span>
            <span className={styles.bugFile}>{file}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
