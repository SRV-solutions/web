import React, { useEffect, useMemo, useState } from "react";
import styles from "../style.module.css";
import { GIT_FLOW } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Ordenar los pasos del flujo de Git. Equivocarse solo resta tiempo.
export default function GitFlow({ timeMult, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const total = 40 * timeMult;
  const steps = useMemo(() => shuffle(GIT_FLOW), []);
  const [doneCount, setDoneCount] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [wrong, setWrong] = useState(null);
  const finished = doneCount === GIT_FLOW.length;
  const rawLeft = useCountdown(total, !finished, () => {});
  const left = Math.max(0, rawLeft - penalty);

  const timedOut = left <= 0 && !finished;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  const click = (step) => {
    if (finished || GIT_FLOW.indexOf(step) < doneCount) return;
    if (step === GIT_FLOW[doneCount]) {
      const next = doneCount + 1;
      setDoneCount(next);
      setWrong(null);
      if (next === GIT_FLOW.length) setTimeout(() => finishOnce(true), 600);
    } else {
      setPenalty((p) => p + 3);
      setWrong(step);
    }
  };

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pasos: ${doneCount}/${GIT_FLOW.length} (equivocarte resta 3s)`} />
      <div className={styles.gitDone}>
        {GIT_FLOW.slice(0, doneCount).map((s, i) => (
          <span key={s} className={styles.gitStepDone}>
            {i + 1}. {s}
          </span>
        ))}
        {!finished && <span className={styles.muted}>¿Qué sigue?</span>}
      </div>
      <div className={styles.gitOptions}>
        {steps.map((s) => {
          const used = GIT_FLOW.indexOf(s) < doneCount;
          return (
            <button
              type="button"
              key={s}
              className={`${styles.quizOpt} ${styles.mono} ${wrong === s ? styles.quizWrong : ""}`}
              disabled={used}
              onClick={() => click(s)}
            >
              {s}
            </button>
          );
        })}
      </div>
    </div>
  );
}
