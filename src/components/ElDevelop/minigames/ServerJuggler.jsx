import React, { useEffect, useRef, useState } from "react";
import styles from "../style.module.css";
import { rand, randInt } from "../helpers";
import { useFinishOnce, TimerBar } from "./common";
import { Icon, IconLabel } from "../icons";
import ico from "../icons.module.css";

const MAX_PODS = 5;
const LB_COOLDOWN = 7;
const NAMES = ["api-1", "api-2", "worker", "auth"];

export default function ServerJuggler({ timeMult, diff = 1, onFinish }) {
  const DURATION = [18, 21, 24, 27][diff - 1];
  const presion = 1 + 0.25 * (diff - 1); // más tráfico y picos más fuertes
  const finishOnce = useFinishOnce(onFinish);
  const [, setFrame] = useState(0);
  const g = useRef({
    loads: NAMES.map(() => rand(15, 30)),
    rates: NAMES.map(() => rand(2, 4) * presion),
    spike: null,
    spikeIn: 2,
    pods: MAX_PODS,
    podTimer: 0,
    lbCd: 0,
    left: DURATION,
    over: false,
    msg: null, // { icon, text }
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
        s.msg = { icon: "alert", text: `Pico de tráfico en ${NAMES[s.spike.idx]}` };
        s.spikeIn = rand(2.2, 3.8);
      }
      if (s.spike) {
        s.spike.until -= dt;
        if (s.spike.until <= 0) s.spike = null;
      }

      s.loads = s.loads.map((load, i) => {
        const extra = s.spike && s.spike.idx === i ? 12 * presion : 0;
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
        s.msg = { icon: "bomb", text: "Se cayó un server. 503 Service Unavailable." };
        setTimeout(() => finishOnce(false), 700);
      } else if (s.left <= 0) {
        s.over = true;
        s.msg = { icon: "circleCheck", text: "Aguantaste el pico. Prod estable." };
        setTimeout(() => finishOnce(true), 700);
      }
      setFrame((f) => f + 1);
    }, 50);
    return () => clearInterval(id);
  }, [timeMult, finishOnce, DURATION, presion]);

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
      <p className={styles.mgMsg}>{s.msg ? <IconLabel icon={s.msg.icon}>{s.msg.text}</IconLabel> : "Monitoreando…"}</p>
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
                {s.spike && s.spike.idx === i ? (
                  <IconLabel icon="flame" size={14} color="var(--red)">
                    {NAMES[i]}
                  </IconLabel>
                ) : (
                  <IconLabel icon="server" size={14}>
                    {NAMES[i]}
                  </IconLabel>
                )}
              </span>
              <span className={styles.serverPct}>{Math.round(pct)}%</span>
            </button>
          );
        })}
      </div>
      <div className={styles.serverControls}>
        <span className={ico.ico}>
          <Icon name="container" color="var(--blue)" />
          Pods disponibles:
          {Array.from({ length: MAX_PODS }, (_, i) => (
            <Icon
              key={i}
              name="square"
              size={12}
              color={i < s.pods ? "var(--blue)" : "var(--muted)"}
              fill={i < s.pods ? "currentColor" : "none"}
            />
          ))}
        </span>
        <button type="button" className={styles.btn} onClick={balance} disabled={s.lbCd > 0}>
          <IconLabel icon="scale">Load Balancer {s.lbCd > 0 ? `(${s.lbCd.toFixed(1)}s)` : ""}</IconLabel>
        </button>
      </div>
    </div>
  );
}
