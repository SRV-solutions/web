import React, { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import { FALLING_SETS } from "../data";
import { rand, pick, chance } from "../helpers";
import { useFinishOnce, TimerBar } from "./common";
import { Icon, IconLabel, IconText } from "../icons";


// Minijuego genérico de "lluvia": Hack the Hacker, Data Cleaning y Prioritizer
export default function FallingClick({ variant, timeMult, diff = 1, onFinish }) {
  const DURATION = [20, 22, 25, 28][diff - 1];
  const LIVES = [5, 4, 3, 3][diff - 1];
  const velocidad = 1 + 0.22 * (diff - 1);
  const set = FALLING_SETS[variant];
  const finishOnce = useFinishOnce(onFinish);
  const [, setFrame] = useState(0);
  // msg: { icon, text } (ícono de icons.jsx)
  const g = useRef({ items: [], lives: LIVES, score: 0, nextId: 1, spawnIn: 0.3, left: DURATION, over: false, msg: null });

  useEffect(() => {
    let last = performance.now();
    const start = last;
    const id = setInterval(() => {
      const s = g.current;
      if (s.over) return;
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const elapsed = (now - start) / 1000;
      s.left = Math.max(0, DURATION - elapsed);

      s.spawnIn -= dt;
      if (s.spawnIn <= 0) {
        const bad = chance(0.6);
        s.items.push({
          id: s.nextId++,
          bad,
          text: pick(bad ? set.bad : set.good),
          x: rand(2, 62),
          y: -12,
          speed: (rand(11, 16) + elapsed * 0.3) * velocidad,
        });
        s.spawnIn = Math.max(0.7, rand(0.9, 1.3) - elapsed * 0.01);
      }

      const alive = [];
      for (const it of s.items) {
        it.y += (it.speed * dt) / timeMult;
        if (it.y >= 92) {
          if (it.bad) {
            s.lives -= 1;
            s.msg = { icon: "bomb", text: set.badHit };
          }
        } else {
          alive.push(it);
        }
      }
      s.items = alive;

      if (s.lives <= 0) {
        s.over = true;
        setTimeout(() => finishOnce(false), 700);
      } else if (s.left <= 0) {
        s.over = true;
        s.msg = { icon: "circleCheck", text: "¡Aguantaste!" };
        setTimeout(() => finishOnce(true), 700);
      }
      setFrame((f) => f + 1);
    }, 40);
    return () => clearInterval(id);
  }, [set, timeMult, finishOnce, DURATION, velocidad]);

  const s = g.current;

  const hit = (item) => {
    if (s.over || !s.items.some((i) => i.id === item.id)) return;
    s.items = s.items.filter((i) => i.id !== item.id);
    if (item.bad) {
      s.score += 1;
      s.msg = { icon: "shieldCheck", text: "¡Bloqueado!" };
    } else {
      s.lives -= 1;
      s.msg = { icon: "alert", text: set.goodHit };
    }
    setFrame((f) => f + 1);
  };

  return (
    <div>
      <TimerBar
        left={s.left}
        total={DURATION}
        label={
          <>
            Vidas:{" "}
            {Array.from({ length: Math.max(0, s.lives) }, (_, i) => (
              <Icon key={i} name="heart" size={14} color="var(--red)" fill="currentColor" />
            ))}{" "}
            · Bloqueados: {s.score}
          </>
        }
      />
      <p className={styles.mgMsg}>{s.msg ? <IconLabel icon={s.msg.icon}>{s.msg.text}</IconLabel> : "Atento…"}</p>
      <div className={styles.fallArea}>
        {s.items.map((it) => (
          <button
            type="button"
            key={it.id}
            className={styles.fallItem}
            style={{ left: `${it.x}%`, top: `${it.y}%` }}
            onPointerDown={() => hit(it)}
          >
            {it.text}
          </button>
        ))}
        <div className={styles.fallFloor}>
          <IconText text={set.floor} />
        </div>
      </div>
    </div>
  );
}
