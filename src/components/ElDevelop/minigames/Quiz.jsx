import React, { useMemo, useState } from "react";
import styles from "../style.module.css";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";
import { IconLabel, IconText } from "../icons";

// Preguntas: { q, options, answer = 0, keepOrder }. Con mono=true las opciones se ven como código.
export default function Quiz({ pool, count, required, timePerQ, mono = false, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const questions = useMemo(
    () =>
      shuffle(pool)
        .slice(0, count)
        .map((q) => {
          const opts = q.options.map((text, i) => ({ text, correct: i === (q.answer ?? 0) }));
          return { q: q.q, keepOrder: q.keepOrder, options: q.keepOrder ? opts : shuffle(opts) };
        }),
    [pool, count]
  );
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [picked, setPicked] = useState(null);

  const answer = (optIdx) => {
    if (picked !== null) return;
    setPicked(optIdx);
    const ok = optIdx >= 0 && questions[idx].options[optIdx].correct;
    const nextCorrect = correct + (ok ? 1 : 0);
    setCorrect(nextCorrect);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        finishOnce(nextCorrect >= required);
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 1000);
  };

  // key en el idx reinicia la cuenta para cada pregunta
  return (
    <QuestionView
      key={idx}
      question={questions[idx]}
      number={idx + 1}
      total={questions.length}
      correct={correct}
      required={required}
      timePerQ={timePerQ}
      picked={picked}
      mono={mono}
      onAnswer={answer}
    />
  );
}

function QuestionView({ question, number, total, correct, required, timePerQ, picked, mono, onAnswer }) {
  const left = useCountdown(timePerQ, picked === null, () => onAnswer(-1));
  const codeLayout = mono && question.keepOrder;
  return (
    <div>
      <TimerBar left={left} total={timePerQ} label={`${number}/${total} · Correctas ${correct} (necesitás ${required})`} />
      <p className={styles.quizQ}>
        <IconText text={question.q} />
      </p>
      <div className={codeLayout ? styles.codeLines : styles.quizOptions}>
        {question.options.map((o, i) => {
          let cls = codeLayout ? styles.codeLine : styles.quizOpt;
          if (mono && !codeLayout) cls += ` ${styles.mono}`;
          if (picked !== null && o.correct) cls += ` ${styles.quizRight}`;
          else if (picked === i) cls += ` ${styles.quizWrong}`;
          return (
            <button type="button" key={o.text} className={cls} onClick={() => onAnswer(i)} disabled={picked !== null}>
              {codeLayout && <span className={styles.lineNo}>{i + 1}</span>}
              <IconText text={o.text} />
            </button>
          );
        })}
      </div>
      {picked === -1 && (
        <p className={styles.mgMsg}>
          <IconLabel icon="alarmClock">¡Se te acabó el tiempo!</IconLabel>
        </p>
      )}
    </div>
  );
}
