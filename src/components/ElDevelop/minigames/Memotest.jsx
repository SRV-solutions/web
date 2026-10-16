import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { MEMO_PAIRS } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Memotest de tecnologías
export default function Memotest({ timeMult, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const total = 60 * timeMult;
  const cards = useMemo(
    () => shuffle(MEMO_PAIRS.flatMap((p) => [{ ...p, id: `${p.name}-a` }, { ...p, id: `${p.name}-b` }])),
    []
  );
  const [open, setOpen] = useState([]);
  const [found, setFound] = useState(new Set());
  const won = found.size === MEMO_PAIRS.length;
  const left = useCountdown(total, !won, () => finishOnce(false));

  const flip = (i) => {
    if (open.length === 2 || open.includes(i) || found.has(cards[i].name)) return;
    const next = [...open, i];
    setOpen(next);
    if (next.length === 2) {
      const [a, b] = next;
      if (cards[a].name === cards[b].name) {
        const f = new Set(found);
        f.add(cards[a].name);
        setTimeout(() => {
          setFound(f);
          setOpen([]);
          if (f.size === MEMO_PAIRS.length) setTimeout(() => finishOnce(true), 500);
        }, 350);
      } else {
        setTimeout(() => setOpen([]), 800);
      }
    }
  };

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pares: ${found.size}/${MEMO_PAIRS.length}`} />
      <div className={styles.memoGrid}>
        {cards.map((c, i) => {
          const visible = open.includes(i) || found.has(c.name);
          return (
            <button
              type="button"
              key={c.id}
              className={`${styles.memoCard} ${visible ? styles.memoOpen : ""} ${found.has(c.name) ? styles.memoFound : ""}`}
              onClick={() => flip(i)}
            >
              {visible ? (
                <>
                  <span className={styles.memoIcon}>{c.icon}</span>
                  <span className={styles.memoName}>{c.name}</span>
                </>
              ) : (
                <span className={styles.memoBack}>{"</>"}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
