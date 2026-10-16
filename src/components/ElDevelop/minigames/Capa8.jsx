import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { CAPA8_TICKETS } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

const COUNT = 5;
const REQUIRED = 3;

// Clasificar tickets: ¿bug real o error de Capa 8?
export default function Capa8({ timeMult, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const tickets = useMemo(() => shuffle(CAPA8_TICKETS).slice(0, COUNT), []);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const perTicket = 14 * timeMult;

  const answer = (isCapa8) => {
    if (feedback) return;
    const ok = isCapa8 === tickets[idx].capa8;
    const next = correct + (ok ? 1 : 0);
    setCorrect(next);
    setFeedback(ok ? "✅ ¡Bien ahí!" : `❌ Era ${tickets[idx].capa8 ? "Capa 8" : "un bug real"}`);
    setTimeout(() => {
      if (idx + 1 >= tickets.length) finishOnce(next >= REQUIRED);
      else {
        setIdx(idx + 1);
        setFeedback(null);
      }
    }, 900);
  };

  return (
    <TicketView
      key={idx}
      ticket={tickets[idx]}
      number={idx + 1}
      correct={correct}
      perTicket={perTicket}
      feedback={feedback}
      onAnswer={answer}
    />
  );
}

function TicketView({ ticket, number, correct, perTicket, feedback, onAnswer }) {
  const left = useCountdown(perTicket, !feedback, () => onAnswer(!ticket.capa8));
  return (
    <div>
      <TimerBar left={left} total={perTicket} label={`Ticket ${number}/${COUNT} · Bien: ${correct} (necesitás ${REQUIRED})`} />
      <div className={styles.ticket}>
        <span className={styles.ticketId}>#INC-{4000 + number * 137}</span>
        <p>{ticket.text}</p>
      </div>
      <div className={styles.binaryBtns}>
        <button type="button" className={`${styles.bigChoice} ${styles.choiceOrange}`} onClick={() => onAnswer(true)} disabled={!!feedback}>
          🙋 Capa 8<small>El problema es el usuario</small>
        </button>
        <button type="button" className={`${styles.bigChoice} ${styles.choiceBlue}`} onClick={() => onAnswer(false)} disabled={!!feedback}>
          🐛 Bug real<small>Hay que escalar a desarrollo</small>
        </button>
      </div>
      <p className={styles.mgMsg}>{feedback || " "}</p>
    </div>
  );
}
