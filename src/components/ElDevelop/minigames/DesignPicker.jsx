import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { DESIGN_PIECES } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

const MIN_GOOD = 3;
const MAX_BAD = 1;

export default function DesignPicker({ timeMult, onFinish }) {
  const total = 40 * timeMult;
  const finishOnce = useFinishOnce(onFinish);
  const pieces = useMemo(() => shuffle(DESIGN_PIECES), []);
  const [selected, setSelected] = useState(new Set());
  const [sent, setSent] = useState(false);

  const evaluate = (sel) => {
    const chosen = pieces.filter((p) => sel.has(p.label));
    const good = chosen.filter((p) => p.good).length;
    const bad = chosen.length - good;
    return good >= MIN_GOOD && bad <= MAX_BAD;
  };

  const submit = () => {
    if (sent) return;
    setSent(true);
    setTimeout(() => finishOnce(evaluate(selected)), 1200);
  };

  const left = useCountdown(total, !sent, submit);

  const toggle = (label) => {
    if (sent) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div>
      <TimerBar left={left} total={total} label="Tiempo para la pizarra" />
      <p className={styles.mgGoal}>
        🏗️ Elegí al menos {MIN_GOOD} componentes que escalen. Más de {MAX_BAD} pifiada y te bochan.
      </p>
      <div className={styles.designGrid}>
        {pieces.map((p) => {
          const on = selected.has(p.label);
          let cls = `${styles.designPiece} ${on ? styles.designOn : ""}`;
          if (sent) cls += p.good ? ` ${styles.quizRight}` : on ? ` ${styles.quizWrong}` : "";
          return (
            <button type="button" key={p.label} className={cls} onClick={() => toggle(p.label)}>
              {on ? "☑" : "☐"} {p.label}
            </button>
          );
        })}
      </div>
      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={submit} disabled={sent}>
        📤 Presentar diseño
      </button>
    </div>
  );
}
