import React, { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import { rand, randInt } from "../helpers";
import { useFinishOnce, TimerBar } from "./common";

const DURATION = 18;
const MAX_PODS = 5;
const LB_COOLDOWN = 7;
const NAMES = ["api-1", "api-2", "worker", "auth"];

export default function ServerJuggler({ timeMult, onFinish }) {
  const finishOnce = useFinishOnce(onFinish);
  const [, setFrame] = useState(0);
  const g = useRef({
    loads: NAMES.map(() => rand(15, 30)),
    rates: NAMES.map(() => rand(2, 4)),
    spike: null,
    spikeIn: 2,
    pods: MAX_PODS,
    podTimer: 0,
    lbCd: 0,
    left: DURATION,
    over: false,
    msg: "",
  });

  useEffect(() => {
    let last = performance.now();
    const start = last;
    const id = setInterval(() => {
      const s = g.current;
      if (s.over) return;
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      s.left = Math.max(0, DURATION - (now - start) / 1000);

      s.spikeIn -= dt;
      if (s.spikeIn <= 0) {
        s.spike = { idx: randInt(0, NAMES.length - 1), until: 1.6 };
        s.msg = `⚠️ Pico de tráfico en ${NAMES[s.spike.idx]}`;
        s.spikeIn = rand(2.2, 3.8);
      }
      if (s.spike) {
        s.spike.until -= dt;
        if (s.spike.until <= 0) s.spike = null;
      }

      s.loads = s.loads.map((load, i) => {
        const extra = s.spike && s.spike.idx === i ? 12 : 0;
        return load + ((s.rates[i] + extra) * dt) / timeMult;
      });

      s.podTimer += dt;
      if (s.podTimer >= 1) {
        s.podTimer = 0;
        s.pods = Math.min(MAX_PODS, s.pods + 1);
      }
      s.lbCd = Math.max(0, s.lbCd - dt);

      if (s.loads.some((l) => l >= 100)) {
        s.over = true;
        s.msg = "💥 Se cayó un server. 503 Service Unavailable.";
        setTimeout(() => finishOnce(false), 700);
      } else if (s.left <= 0) {
        s.over = true;
        s.msg = "✅ Aguantaste el pico. Prod estable.";
        setTimeout(() => finishOnce(true), 700);
      }
      setFrame((f) => f + 1);
    }, 50);
    return () => clearInterval(id);
  }, [timeMult, finishOnce]);

  const s = g.current;

  const deploy = (i) => {
    if (s.over || s.pods <= 0) return;
    s.pods -= 1;
    s.loads[i] = Math.max(0, s.loads[i] - 30);
    setFrame((f) => f + 1);
  };

  const balance = () => {
    if (s.over || s.lbCd > 0) return;
    const avg = s.loads.reduce((a, b) => a + b, 0) / s.loads.length;
    s.loads = s.loads.map(() => avg);
    s.lbCd = LB_COOLDOWN;
    setFrame((f) => f + 1);
  };

  return (
    <div>
      <TimerBar left={s.left} total={DURATION} label="Aguantá el pico de tráfico" />
      <p className={styles.mgMsg}>{s.msg || "Monitoreando…"}</p>
      <div className={styles.servers}>
        {s.loads.map((load, i) => {
          const pct = Math.min(100, load);
          const color = pct > 80 ? "#ef4444" : pct > 55 ? "#f6950a" : "#22c55e";
          return (
            <button type="button" key={NAMES[i]} className={styles.server} onClick={() => deploy(i)}>
              <div className={styles.serverBar}>
                <div className={styles.serverFill} style={{ height: `${pct}%`, background: color }} />
              </div>
              <span className={styles.serverName}>
                {s.spike && s.spike.idx === i ? "🔥 " : "🖥️ "}
                {NAMES[i]}
              </span>
              <span className={styles.serverPct}>{Math.round(pct)}%</span>
            </button>
          );
        })}
      </div>
      <div className={styles.serverControls}>
        <span>🐳 Pods disponibles: {"■".repeat(s.pods)}{"□".repeat(MAX_PODS - s.pods)}</span>
        <button type="button" className={styles.btn} onClick={balance} disabled={s.lbCd > 0}>
          ⚖️ Load Balancer {s.lbCd > 0 ? `(${s.lbCd.toFixed(1)}s)` : ""}
        </button>
      </div>
    </div>
  );
}
