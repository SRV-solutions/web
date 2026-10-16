import React, { useEffect, useMemo, useState } from "react";
import styles from "../style.module.css";
import { GIT_FLOW, GIT_FLOW_PRO } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Ordenar los pasos del flujo de Git. Equivocarse solo resta tiempo.
export default function GitFlow({ timeMult, diff = 1, onFinish }) {
  const FLOW = diff >= 3 ? GIT_FLOW_PRO : GIT_FLOW;
  const multa = [3, 4, 5, 6][diff - 1];
  const finishOnce = useFinishOnce(onFinish);
  const total = [40, 34, 50, 44][diff - 1] * timeMult;
  const steps = useMemo(() => shuffle(FLOW), [FLOW]);
  const [doneCount, setDoneCount] = useState(0);
  const [penalty, setPenalty] = useState(0);
  const [wrong, setWrong] = useState(null);
  const finished = doneCount === FLOW.length;
  const rawLeft = useCountdown(total, !finished, () => {});
  const left = Math.max(0, rawLeft - penalty);

  const timedOut = left <= 0 && !finished;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  const click = (step) => {
    if (finished || FLOW.indexOf(step) < doneCount) return;
    if (step === FLOW[doneCount]) {
      const next = doneCount + 1;
      setDoneCount(next);
      setWrong(null);
      if (next === FLOW.length) setTimeout(() => finishOnce(true), 600);
    } else {
      setPenalty((p) => p + multa);
      setWrong(step);
    }
  };

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pasos: ${doneCount}/${FLOW.length} (equivocarte resta ${multa}s)`} />
      <div className={styles.gitDone}>
        {FLOW.slice(0, doneCount).map((s, i) => (
          <span key={s} className={styles.gitStepDone}>
            {i + 1}. {s}
          </span>
        ))}
        {!finished && <span className={styles.muted}>¿Qué sigue?</span>}
      </div>
      <div className={styles.gitOptions}>
        {steps.map((s) => {
          const used = FLOW.indexOf(s) < doneCount;
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
