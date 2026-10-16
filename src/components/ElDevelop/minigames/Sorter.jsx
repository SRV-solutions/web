import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Minijuego de clasificación: cada ítem va a una de varias categorías (bins).
// Lo usan los minijuegos propios de cada rol (status codes, phishing, MoSCoW, triage…).
export default function Sorter({ set, timeMult, diff = 1, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const count = Math.min(set.items.length, [5, 6, 8, 10][diff - 1]);
  const required = Math.ceil(count * [0.6, 0.67, 0.75, 0.8][diff - 1]);
  const perItem = [13, 11, 9, 7.5][diff - 1] * timeMult;
  const items = useMemo(() => shuffle(set.items).slice(0, count), [set, count]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const answer = (bin) => {
    if (feedback) return;
    const ok = bin === items[idx].answer;
    const next = correct + (ok ? 1 : 0);
    setCorrect(next);
    setFeedback(ok ? "✅ ¡Bien!" : `❌ Era: ${items[idx].answer}`);
    setTimeout(() => {
      if (idx + 1 >= items.length) finishOnce(next >= required);
      else {
        setIdx(idx + 1);
        setFeedback(null);
      }
    }, 850);
  };

  return (
    <SorterItem
      key={idx}
      item={items[idx]}
      bins={set.bins}
      number={idx + 1}
      count={count}
      required={required}
      correct={correct}
      perItem={perItem}
      feedback={feedback}
      onAnswer={answer}
    />
  );
}

function SorterItem({ item, bins, number, count, required, correct, perItem, feedback, onAnswer }) {
  const left = useCountdown(perItem, !feedback, () => onAnswer(null));
  return (
    <div>
      <TimerBar left={left} total={perItem} label={`${number}/${count} · Bien: ${correct} (necesitás ${required})`} />
      <div className={styles.ticket}>
        <span className={styles.ticketId}>#{String(number).padStart(2, "0")}</span>
        <p>{item.text}</p>
      </div>
      <div className={styles.sorterBins} style={{ gridTemplateColumns: `repeat(${bins.length > 3 ? 2 : bins.length}, 1fr)` }}>
        {bins.map((bin) => {
          let cls = styles.sorterBin;
          if (feedback && bin === item.answer) cls += ` ${styles.quizRight}`;
          return (
            <button type="button" key={bin} className={cls} onClick={() => onAnswer(bin)} disabled={!!feedback}>
              {bin}
            </button>
          );
        })}
      </div>
      <p className={styles.mgMsg}>{feedback || (left <= 0 ? "⏰ ¡Se te acabó el tiempo!" : " ")}</p>
    </div>
  );
}
