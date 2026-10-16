import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../style.module.css";
import { TERMINAL_COMMANDS, TERMINAL_COMMANDS_PRO } from "../data";
import { shuffle } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";


// Tipear comandos cortos en una terminal
export default function Terminal({ timeMult, diff = 1, onFinish }) {
  const COUNT = [3, 4, 4, 5][diff - 1];
  const finishOnce = useFinishOnce(onFinish);
  const commands = useMemo(() => {
    // a partir de dificultad 2 se mezclan comandos largos de verdad
    const pro = diff >= 2 ? shuffle(TERMINAL_COMMANDS_PRO).slice(0, diff - 1) : [];
    return shuffle([...pro, ...shuffle(TERMINAL_COMMANDS).slice(0, COUNT - pro.length)]);
  }, [diff, COUNT]);
  const total = [40, 45, 45, 48][diff - 1] * timeMult;
  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);
  const done = idx >= commands.length;
  const left = useCountdown(total, !done, () => finishOnce(false));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (done) return;
    const target = commands[idx];
    if (value.trim().toLowerCase() === target.toLowerCase()) {
      setHistory((h) => [...h, `$ ${target}`, "✔ OK"]);
      setValue("");
      setError(false);
      if (idx + 1 >= commands.length) setTimeout(() => finishOnce(true), 600);
      setIdx(idx + 1);
    } else {
      setHistory((h) => [...h, `$ ${value}`, `bash: ${value.split(" ")[0] || "?"}: command not found`]);
      setValue("");
      setError(true);
    }
  };

  return (
    <div>
      <TimerBar left={left} total={total} label={`Comandos: ${Math.min(idx, COUNT)}/${COUNT}`} />
      {!done && (
        <p className={styles.mgGoal}>
          Tipeá: <code className={styles.cmdTarget}>{commands[idx]}</code> y apretá Enter
        </p>
      )}
      <div className={styles.terminal} onClick={() => inputRef.current?.focus()}>
        <div className={styles.termBar}>
          <span />
          <span />
          <span />
          <em>usuario@prod-server: ~</em>
        </div>
        <div className={styles.termBody}>
          {history.slice(-8).map((l, i) => (
            <div key={i} className={l.startsWith("bash") ? styles.termErr : ""}>
              {l}
            </div>
          ))}
          {!done && (
            <form onSubmit={submit} className={styles.termLine}>
              <span>$</span>
              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
                aria-label="Comando"
                className={`${styles.termInput} ${error ? styles.termShake : ""}`}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
