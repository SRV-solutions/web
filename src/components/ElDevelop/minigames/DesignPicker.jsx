import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";
import { Icon, IconLabel } from "../icons";


export default function DesignPicker({ timeMult, diff = 1, design, onFinish }) {
  const MIN_GOOD = [3, 4, 4, 5][diff - 1];
  const MAX_BAD = diff >= 3 ? 0 : 1;
  const total = [40, 36, 34, 32][diff - 1] * timeMult;
  const finishOnce = useFinishOnce(onFinish);
  const pieces = useMemo(() => shuffle(design.pieces), [design]);
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
        <IconLabel icon="blocks" color="var(--blue)">
          {design.prompt}
        </IconLabel>
        <br />
        Elegí al menos {MIN_GOOD} piezas correctas. {MAX_BAD === 0 ? "Sin ninguna pifiada." : `Más de ${MAX_BAD} pifiada y te bochan.`}
      </p>
      <div className={styles.designGrid}>
        {pieces.map((p) => {
          const on = selected.has(p.label);
          let cls = `${styles.designPiece} ${on ? styles.designOn : ""}`;
          if (sent) cls += p.good ? ` ${styles.quizRight}` : on ? ` ${styles.quizWrong}` : "";
          return (
            <button type="button" key={p.label} className={cls} onClick={() => toggle(p.label)}>
              <Icon name={on ? "squareCheck" : "square"} color={on ? "var(--green)" : "var(--muted)"} style={{ marginRight: "0.35em" }} />
              {p.label}
            </button>
          );
        })}
      </div>
      <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={submit} disabled={sent}>
        <IconLabel icon="send">Presentar diseño</IconLabel>
      </button>
    </div>
  );
}
