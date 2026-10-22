import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuMinus, LuPlus, LuEyeOff, LuRuler } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosA.module.css";
import { randInt, shuffle, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Pixel Perfect: el diseño te pasa una caja y vos la copiás con CSS, a golpe de − / +.
// Propiedades que pueden tocarse: rango, paso y tolerancia por dificultad (índice = diff - 1)
export const PROPS = [
  { key: "width", label: "width", unit: "px", min: 50, max: 130, step: [10, 10, 5, 5], tol: [8, 5, 3, 2] },
  { key: "height", label: "height", unit: "px", min: 30, max: 90, step: [10, 10, 5, 5], tol: [8, 5, 3, 2] },
  { key: "radius", label: "border-radius", unit: "px", min: 0, max: 40, step: [8, 5, 4, 2], tol: [8, 5, 3, 2] },
  { key: "padding", label: "padding", unit: "px", min: 0, max: 24, step: [4, 4, 2, 2], tol: [8, 5, 3, 2] },
  { key: "rotate", label: "rotate", unit: "deg", min: -40, max: 40, step: [10, 10, 5, 5], tol: [8, 6, 4, 2] },
  { key: "opacity", label: "opacity", unit: "%", min: 20, max: 100, step: [20, 10, 10, 5], tol: [15, 10, 8, 5] },
  { key: "spacing", label: "letter-spacing", unit: "px", min: 0, max: 6, step: [2, 1, 1, 0.5], tol: [2, 1.5, 1, 0.5] },
  { key: "font", label: "font-size", unit: "px", min: 12, max: 28, step: [4, 4, 2, 2], tol: [6, 4, 3, 2] },
];

// Valores de las propiedades que no están en juego (iguales en las dos cajas)
const DEFAULTS = { width: 100, height: 60, radius: 8, padding: 8, rotate: 0, opacity: 100, spacing: 0, font: 16 };

const TIME = [28, 34, 45, 55];
const COUNT = [2, 3, 3, 4];
// Distancia inicial al objetivo, en pasos de la grilla
const DIST = [
  [2, 4],
  [3, 5],
  [3, 6],
  [4, 7],
];

const r1 = (v) => Math.round(v * 10) / 10;
export const fmtVal = (v) => (Number.isInteger(v) ? String(v) : v.toFixed(1));

// Arma el round: elige propiedades y genera objetivo + valor inicial sobre la grilla del paso,
// así el objetivo siempre se puede alcanzar exacto.
export function makeRound(diff) {
  const d = clamp(diff, 1, 4) - 1;
  const [kMin, kMax] = DIST[d];
  return shuffle(PROPS)
    .slice(0, COUNT[d])
    .map((p) => {
      const step = p.step[d];
      const tol = p.tol[d];
      const n = Math.round((p.max - p.min) / step);
      const ti = randInt(0, n);
      const cands = [];
      for (let i = 0; i <= n; i++) {
        const dist = Math.abs(i - ti);
        // Arrancás a kMin..kMax pasos y siempre fuera de la tolerancia (si no, ya estaría "bien")
        if (dist >= kMin && dist <= kMax && dist * step > tol) cands.push(i);
      }
      // Rango chico sin candidatos: arrancás en la punta opuesta
      const si = cands.length ? cands[randInt(0, cands.length - 1)] : ti <= n / 2 ? n : 0;
      const val = (i) => r1(p.min + i * step);
      return { key: p.key, label: p.label, unit: p.unit, min: p.min, max: p.max, step, tol, target: val(ti), start: val(si) };
    });
}

export function boxStyle(vals) {
  const v = { ...DEFAULTS, ...vals };
  return {
    width: `${v.width}px`,
    height: `${v.height}px`,
    borderRadius: `${v.radius}px`,
    padding: `${v.padding}px`,
    transform: `rotate(${v.rotate}deg)`,
    opacity: v.opacity / 100,
    letterSpacing: `${v.spacing}px`,
    fontSize: `${v.font}px`,
  };
}

// Parecido global (0..1): promedio de qué tan cerca está cada propiedad
export function similarity(round, vals) {
  if (!round.length) return 1;
  const sum = round.reduce((acc, p) => acc + Math.max(0, 1 - Math.abs(vals[p.key] - p.target) / (p.max - p.min)), 0);
  return sum / round.length;
}

export const within = (p, v) => Math.abs(v - p.target) <= p.tol + 1e-9;

// Timeouts que se limpian solos al desmontar
function useLater() {
  const ids = useRef([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    ids.current.push(id);
  }, []);
}

export default function PixelPerfect({ timeMult = 1, diff = 1, onFinish }) {
  const d = clamp(diff, 1, 4) - 1;
  const finishOnce = useFinishOnce(onFinish);
  const later = useLater();
  const total = TIME[d] * timeMult;
  const showTargets = d < 2;
  const round = useMemo(() => makeRound(diff), [diff]);
  const [vals, setVals] = useState(() => Object.fromEntries(round.map((p) => [p.key, p.start])));
  const [won, setWon] = useState(false);
  const left = useCountdown(total, !won, () => finishOnce(false));

  const okCount = round.filter((p) => within(p, vals[p.key])).length;
  const allOk = okCount === round.length;
  const pct = Math.round(similarity(round, vals) * 100);

  useEffect(() => {
    if (allOk && !won) {
      setWon(true);
      later(() => finishOnce(true), 650);
    }
  }, [allOk, won, later, finishOnce]);

  const bump = (p, dir) => {
    if (won) return;
    setVals((prev) => ({ ...prev, [p.key]: clamp(r1(prev[p.key] + dir * p.step), p.min, p.max) }));
  };

  const targetVals = Object.fromEntries(round.map((p) => [p.key, p.target]));
  const meterColor = pct >= 90 ? "var(--green)" : pct >= 60 ? "var(--orange)" : "var(--red)";

  return (
    <div>
      <TimerBar left={left} total={total} label={`Propiedades: ${okCount}/${round.length}`} />
      <p className={styles.mgGoal}>
        <LuRuler className={ex.ico} />
        Ajustá tu caja hasta que quede igual a la del diseño.
        {!showTargets && (
          <>
            {" "}
            <LuEyeOff className={ex.ico} />
            Sin números: a ojo, como en la vida real.
          </>
        )}
      </p>

      <div className={ex.ppStages}>
        <div className={ex.ppStage}>
          <span className={ex.ppStageTitle}>Diseño (Figma)</span>
          <div className={ex.ppBox} style={boxStyle(targetVals)}>
            Pagar
          </div>
        </div>
        <div className={`${ex.ppStage} ${won ? ex.ppStageWon : ex.ppStageMine}`}>
          <span className={ex.ppStageTitle}>Tu CSS</span>
          <div className={`${ex.ppBox} ${won ? ex.ppBoxWon : ""}`} style={boxStyle(vals)}>
            Pagar
          </div>
        </div>
      </div>

      <div className={ex.ppMeter}>
        <div className={ex.ppMeterLabel}>
          <span>Parecido</span>
          <span>{won ? "Pixel perfect" : `${pct}%`}</span>
        </div>
        <div className={ex.ppMeterTrack}>
          <div className={ex.ppMeterFill} style={{ width: `${won ? 100 : pct}%`, background: won ? "var(--green)" : meterColor }} />
        </div>
      </div>

      <div className={ex.ppRows}>
        {round.map((p) => {
          const cur = vals[p.key];
          const ok = within(p, cur);
          return (
            <div className={ex.ppRow} key={p.key}>
              <button
                type="button"
                className={ex.ppStep}
                onClick={() => bump(p, -1)}
                disabled={won || cur <= p.min}
                aria-label={`Bajar ${p.label}`}
              >
                <LuMinus />
              </button>
              <div className={`${ex.ppVal} ${ok ? ex.ppValOk : ""}`}>
                <span className={ex.ppProp}>{p.label}:</span>
                <span className={ex.ppNum}>
                  {fmtVal(cur)}
                  {p.unit}
                </span>
                {showTargets && (
                  <span className={ex.ppTarget}>
                    objetivo {fmtVal(p.target)}
                    {p.unit}
                  </span>
                )}
                {ok && <LuCheck className={ex.ppOkIcon} aria-label="Coincide" />}
              </div>
              <button
                type="button"
                className={ex.ppStep}
                onClick={() => bump(p, 1)}
                disabled={won || cur >= p.max}
                aria-label={`Subir ${p.label}`}
              >
                <LuPlus />
              </button>
            </div>
          );
        })}
      </div>

      <p className={`${ex.msg} ${won ? ex.msgOk : ""}`}>
        {won ? (
          <>
            <LuCheck /> Pixel perfect. El diseñador no encontró nada para marcar en rojo.
          </>
        ) : left <= 0 ? (
          "Se acabó el tiempo. El cliente lo vio en el celu y dijo que 'se ve raro'."
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
