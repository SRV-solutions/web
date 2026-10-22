import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { MEMO_PAIRS } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";
import { TechIcon } from "../icons";

// Memotest de tecnologías
export default function Memotest({ timeMult, diff = 1, onFinish }) {
  const pares = useMemo(() => MEMO_PAIRS.slice(0, diff >= 3 ? 8 : 6), [diff]);
  const finishOnce = useFinishOnce(onFinish);
  const total = [60, 50, 65, 55][diff - 1] * timeMult;
  const cards = useMemo(
    () => shuffle(pares.flatMap((p) => [{ ...p, id: `${p.name}-a` }, { ...p, id: `${p.name}-b` }])),
    [pares]
  );
  const [open, setOpen] = useState([]);
  const [found, setFound] = useState(new Set());
  const won = found.size === pares.length;
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
          if (f.size === pares.length) setTimeout(() => finishOnce(true), 500);
        }, 350);
      } else {
        setTimeout(() => setOpen([]), 800);
      }
    }
  };

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pares: ${found.size}/${pares.length}`} />
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
                  <span className={styles.memoIcon} style={{ display: "inline-flex", lineHeight: 1 }}>
                    <TechIcon name={c.name} size="1em" />
                  </span>
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
