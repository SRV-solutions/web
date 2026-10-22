import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuRotateCw, LuCable, LuDownload, LuEraser, LuPower, LuPhoneCall, LuEye, LuHeadphones, LuCheck, LuX } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosB.module.css";
import { randInt, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Simon del Help Desk: mirá el procedimiento y repetilo. Un paso mal y el cliente corta.
const PASOS = [
  { id: "reiniciar", label: "Reiniciar", Icon: LuRotateCw, c: "#0b78fb", bg: "rgba(11, 120, 251, 0.4)" },
  { id: "cable", label: "Revisar el cable", Icon: LuCable, c: "#f6950a", bg: "rgba(246, 149, 10, 0.4)" },
  { id: "driver", label: "Actualizar driver", Icon: LuDownload, c: "#22c55e", bg: "rgba(34, 197, 94, 0.4)" },
  { id: "cache", label: "Limpiar caché", Icon: LuEraser, c: "#a855f7", bg: "rgba(168, 85, 247, 0.4)" },
  { id: "power", label: "Apagar y prender", Icon: LuPower, c: "#ef4444", bg: "rgba(239, 68, 68, 0.4)" },
  { id: "proveedor", label: "Llamar al proveedor", Icon: LuPhoneCall, c: "#06b6d4", bg: "rgba(6, 182, 212, 0.4)" },
];

const TICKETS = [
  "'No anda internet' (el cable está en la mano del cliente)",
  "'La impresora me mira mal'",
  "'Se me borró el Excel' (estaba en el Escritorio)",
  "'El mouse no hace click' (está al revés)",
  "'La compu está lenta' (47 pestañas de YouTube)",
  "'Me hackearon' (olvidó la contraseña)",
  "'El Wi-Fi no llega al patio'",
  "'Teams no abre' (era Zoom)",
  "'La pantalla está negra' (apagada)",
  "'Se me cerró todo' (apretó la X)",
];

const CFG = [
  { inicio: 2, rondas: 3, botones: 4, paso: 620 },
  { inicio: 3, rondas: 4, botones: 4, paso: 560 },
  { inicio: 3, rondas: 5, botones: 6, paso: 490 },
  { inicio: 4, rondas: 6, botones: 6, paso: 430 },
];

export const configSimon = (diff) => CFG[clamp(diff, 1, 4) - 1];

// Secuencia completa (la ronda r muestra los primeros inicio + r pasos). Nunca tres iguales seguidos.
export function generarSecuencia(diff) {
  const cfg = configSimon(diff);
  const largo = cfg.inicio + cfg.rondas - 1;
  const seq = [];
  while (seq.length < largo) {
    const b = randInt(0, cfg.botones - 1);
    const l = seq.length;
    if (l >= 2 && seq[l - 1] === b && seq[l - 2] === b) continue;
    seq.push(b);
  }
  return seq;
}

const ESTADO = {
  show: "Mirá el procedimiento...",
  input: "Tu turno: repetí los pasos en orden.",
  ok: "Procedimiento correcto. Entra otro ticket...",
  fail: "Paso equivocado. El cliente cortó y llamó a su sobrino.",
  win: "Todos los tickets cerrados. Te mandaron un 'gracias genio'.",
};

export default function SimonHelpDesk({ timeMult = 1, diff = 1, onFinish }) {
  const cfg = configSimon(diff);
  const finishOnce = useFinishOnce(onFinish);
  const seq = useMemo(() => generarSecuencia(diff), [diff]);
  const reduced = useMemo(
    () => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState("show");
  const [lit, setLit] = useState(null);
  const [step, setStep] = useState(0);
  const [pressed, setPressed] = useState(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const len = cfg.inicio + round;
  const inputTotal = (3 + 2 * len) * timeMult;
  const left = useCountdown(inputTotal, phase === "input", () => {
    setPhase("fail");
    later(() => finishOnce(false), 600);
  });

  // Reproducción de la secuencia: timeouts guardados y limpiados en el cleanup
  useEffect(() => {
    if (phase !== "show") return undefined;
    const paso = reduced ? cfg.paso + 120 : cfg.paso;
    const prendido = Math.round(paso * (reduced ? 0.8 : 0.62));
    const ids = [];
    seq.slice(0, len).forEach((b, i) => {
      const t0 = 700 + i * paso;
      ids.push(setTimeout(() => setLit(b), t0));
      ids.push(setTimeout(() => setLit(null), t0 + prendido));
    });
    ids.push(
      setTimeout(() => {
        setStep(0);
        setPhase("input");
      }, 700 + len * paso + 200)
    );
    return () => ids.forEach(clearTimeout);
  }, [phase, len, seq, cfg, reduced]);

  const flash = (i, ok) => {
    setPressed({ i, ok, id: Date.now() });
    later(() => setPressed((p) => (p && p.i === i ? null : p)), 260);
  };

  const tocar = (i) => {
    if (phase !== "input") return;
    if (seq[step] === i) {
      flash(i, true);
      const next = step + 1;
      setStep(next);
      if (next < len) return;
      if (round + 1 >= cfg.rondas) {
        setPhase("win");
        later(() => finishOnce(true), 600);
      } else {
        setPhase("ok");
        later(() => {
          setRound(round + 1);
          setPhase("show");
        }, 900);
      }
    } else {
      flash(i, false);
      setPhase("fail");
      later(() => finishOnce(false), 800);
    }
  };

  const botones = PASOS.slice(0, cfg.botones);
  const ticket = TICKETS[(round * 3 + diff) % TICKETS.length];

  return (
    <div>
      <TimerBar
        left={phase === "input" ? left : inputTotal}
        total={inputTotal}
        label={`Ticket ${round + 1}/${cfg.rondas} · Paso ${Math.min(step, len)}/${len}`}
      />
      <p className={ex.siTicket}>
        Ticket #{4100 + round * 7 + diff}: {ticket}
      </p>
      <p className={`${styles.mgGoal} ${ex.goal} ${phase === "fail" ? styles.danger : phase === "win" ? styles.green : ""}`}>
        {phase === "show" && <LuEye className={ex.ico} />}
        {phase === "input" && <LuHeadphones className={ex.ico} />}
        {(phase === "ok" || phase === "win") && <LuCheck className={ex.ico} />}
        {phase === "fail" && <LuX className={ex.ico} />}
        <span>{ESTADO[phase]}</span>
      </p>
      <div className={ex.siDots} aria-hidden="true">
        {Array.from({ length: len }, (_, i) => (
          <span key={i} className={`${ex.siDot} ${i < step && phase !== "show" ? ex.siDotOn : ""} ${i === step && phase === "input" ? ex.siDotNow : ""}`} />
        ))}
      </div>
      <div className={`${ex.siGrid} ${cfg.botones === 4 ? ex.siGrid4 : ""}`}>
        {botones.map((p, i) => {
          const Icon = p.Icon;
          let cls = ex.siBtn;
          if (lit === i) cls += ` ${ex.siLit}`;
          if (pressed && pressed.i === i) cls += ` ${pressed.ok ? ex.siOk : ex.siBad}`;
          return (
            <button
              type="button"
              key={p.id}
              className={cls}
              style={{ "--c": p.c, "--cbg": p.bg }}
              onClick={() => tocar(i)}
              disabled={phase !== "input"}
              aria-label={p.label}
            >
              <Icon className={ex.siIcon} />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
