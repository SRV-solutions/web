import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { CAPA8_TICKETS } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";
import { IconLabel, IconText } from "../icons";


// Clasificar tickets: ¿bug real o error de Capa 8?
export default function Capa8({ timeMult, diff = 1, onFinish }) {
  const COUNT = [5, 6, 7, 8][diff - 1];
  const REQUIRED = [3, 4, 5, 6][diff - 1];
  const finishOnce = useFinishOnce(onFinish);
  const tickets = useMemo(() => shuffle(CAPA8_TICKETS).slice(0, COUNT), [COUNT]);
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const perTicket = [14, 12, 10, 9][diff - 1] * timeMult;

  const answer = (isCapa8) => {
    if (feedback) return;
    const ok = isCapa8 === tickets[idx].capa8;
    const next = correct + (ok ? 1 : 0);
    setCorrect(next);
    setFeedback(ok ? { ok: true, text: "¡Bien ahí!" } : { ok: false, text: `Era ${tickets[idx].capa8 ? "Capa 8" : "un bug real"}` });
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
      count={COUNT}
      required={REQUIRED}
      number={idx + 1}
      correct={correct}
      perTicket={perTicket}
      feedback={feedback}
      onAnswer={answer}
    />
  );
}

function TicketView({ ticket, count, required, number, correct, perTicket, feedback, onAnswer }) {
  const left = useCountdown(perTicket, !feedback, () => onAnswer(!ticket.capa8));
  return (
    <div>
      <TimerBar left={left} total={perTicket} label={`Ticket ${number}/${count} · Bien: ${correct} (necesitás ${required})`} />
      <div className={styles.ticket}>
        <span className={styles.ticketId}>#INC-{4000 + number * 137}</span>
        <p>
          <IconText text={ticket.text} />
        </p>
      </div>
      <div className={styles.binaryBtns}>
        <button type="button" className={`${styles.bigChoice} ${styles.choiceOrange}`} onClick={() => onAnswer(true)} disabled={!!feedback}>
          <IconLabel icon="hand" size={22}>
            Capa 8
          </IconLabel>
          <small>El problema es el usuario</small>
        </button>
        <button type="button" className={`${styles.bigChoice} ${styles.choiceBlue}`} onClick={() => onAnswer(false)} disabled={!!feedback}>
          <IconLabel icon="bug" size={22}>
            Bug real
          </IconLabel>
          <small>Hay que escalar a desarrollo</small>
        </button>
      </div>
      <p className={styles.mgMsg}>
        {feedback ? <IconLabel icon={feedback.ok ? "circleCheck" : "circleX"}>{feedback.text}</IconLabel> : " "}
      </p>
    </div>
  );
}
