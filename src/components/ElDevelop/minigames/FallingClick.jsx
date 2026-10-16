import React, { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import { FALLING_SETS } from "../data";
import { rand, pick, chance } from "../helpers";
import { useFinishOnce, TimerBar } from "./common";

const DURATION = 20;
const LIVES = 5;

// Minijuego genérico de "lluvia": Hack the Hacker, Data Cleaning y Prioritizer
export default function FallingClick({ variant, timeMult, onFinish }) {
  const set = FALLING_SETS[variant];
  const finishOnce = useFinishOnce(onFinish);
  const [, setFrame] = useState(0);
  const g = useRef({ items: [], lives: LIVES, score: 0, nextId: 1, spawnIn: 0.3, left: DURATION, over: false, msg: "" });

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
          speed: rand(11, 16) + elapsed * 0.3,
        });
        s.spawnIn = Math.max(0.7, rand(0.9, 1.3) - elapsed * 0.01);
      }

      const alive = [];
      for (const it of s.items) {
        it.y += (it.speed * dt) / timeMult;
        if (it.y >= 92) {
          if (it.bad) {
            s.lives -= 1;
            s.msg = `💥 ${set.badHit}`;
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
        s.msg = "✅ ¡Aguantaste!";
        setTimeout(() => finishOnce(true), 700);
      }
      setFrame((f) => f + 1);
    }, 40);
    return () => clearInterval(id);
  }, [set, timeMult, finishOnce]);

  const s = g.current;

  const hit = (item) => {
    if (s.over || !s.items.some((i) => i.id === item.id)) return;
    s.items = s.items.filter((i) => i.id !== item.id);
    if (item.bad) {
      s.score += 1;
      s.msg = "🛡️ ¡Bloqueado!";
    } else {
      s.lives -= 1;
      s.msg = `⚠️ ${set.goodHit}`;
    }
    setFrame((f) => f + 1);
  };

  return (
    <div>
      <TimerBar left={s.left} total={DURATION} label={`Vidas: ${"❤️".repeat(Math.max(0, s.lives))} · Bloqueados: ${s.score}`} />
      <p className={styles.mgMsg}>{s.msg || "Atento…"}</p>
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
        <div className={styles.fallFloor}>{set.floor}</div>
      </div>
    </div>
  );
}
