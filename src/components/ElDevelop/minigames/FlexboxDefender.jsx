import React, { useMemo, useState, useEffect } from "react";
import styles from "../style.module.css";
import { pick, shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

const CHALLENGES = [
  {
    goal: "Centrá el botón en el medio de la caja",
    need: { display: "flex", "justify-content": "center", "align-items": "center" },
  },
  {
    goal: "Mandá el botón abajo a la derecha",
    need: { display: "flex", "justify-content": "flex-end", "align-items": "flex-end" },
  },
  {
    goal: "Poné el botón arriba y al centro",
    need: { display: "flex", "justify-content": "center", "align-items": "flex-start" },
  },
  {
    goal: "Botón abajo a la izquierda",
    need: { display: "flex", "justify-content": "flex-start", "align-items": "flex-end" },
  },
];

const POOL = [
  ["display", "flex"],
  ["display", "block"],
  ["justify-content", "center"],
  ["justify-content", "flex-end"],
  ["justify-content", "flex-start"],
  ["align-items", "center"],
  ["align-items", "flex-end"],
  ["align-items", "flex-start"],
  ["float", "left"],
  ["text-align", "right"],
  ["z-index", "999"],
];

const camel = (prop) => prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

export default function FlexboxDefender({ timeMult, onFinish }) {
  const total = 30 * timeMult;
  const finishOnce = useFinishOnce(onFinish);
  const challenge = useMemo(() => pick(CHALLENGES), []);
  const chips = useMemo(() => shuffle(POOL), []);
  const [applied, setApplied] = useState({ display: "block" });
  const [won, setWon] = useState(false);
  const left = useCountdown(total, !won, () => finishOnce(false));

  useEffect(() => {
    const ok = Object.entries(challenge.need).every(([k, v]) => applied[k] === v);
    if (ok && !won) {
      setWon(true);
      setTimeout(() => finishOnce(true), 700);
    }
  }, [applied, challenge, won, finishOnce]);

  const toggle = (prop, value) => {
    if (won) return;
    setApplied((prev) => {
      const next = { ...prev };
      if (next[prop] === value) delete next[prop];
      else next[prop] = value;
      return next;
    });
  };

  const style = Object.fromEntries(Object.entries(applied).map(([k, v]) => [camel(k), v]));
  const mood = left / total > 0.6 ? "🙂" : left / total > 0.3 ? "😠" : "🤬";

  return (
    <div>
      <TimerBar left={left} total={total} label={`Paciencia del usuario ${mood}`} />
      <p className={styles.mgGoal}>🎯 {challenge.goal}</p>
      <div className={styles.flexLayout}>
        <div>
          <div className={styles.flexPreview} style={style}>
            <button type="button" className={`${styles.flexTarget} ${won ? styles.flexWon : ""}`}>
              Comprar
            </button>
          </div>
          <pre className={styles.cssCode}>
            {`.container {\n${Object.entries(applied)
              .map(([k, v]) => `  ${k}: ${v};`)
              .join("\n")}\n}`}
          </pre>
        </div>
        <div className={styles.cssChips}>
          {chips.map(([prop, value]) => {
            const active = applied[prop] === value;
            return (
              <button
                type="button"
                key={`${prop}:${value}`}
                className={`${styles.cssChip} ${active ? styles.cssChipOn : ""}`}
                onClick={() => toggle(prop, value)}
              >
                {prop}: {value};
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
