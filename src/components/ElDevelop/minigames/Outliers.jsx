import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuChartScatter, LuCheck, LuX } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosB.module.css";
import { rand, chance, shuffle, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Caza de Outliers: un scatter con una tendencia y algunos puntos que se escapan.
// Tocá los outliers; tocar un dato normal resta tiempo.
const W = 300;
const H = 200;
const PX = 36;
const PY = 12;
const PW = W - PX - 10;
const PH = H - PY - 24;
const HIT_PX = 24; // radio de toque en píxeles de pantalla
const R = 4.5;

const CFG = [
  { n: 20, k: 2, sigma: 4, mult: [6.5, 8], clampSig: 2.0, time: 18, multa: 2.5 },
  { n: 28, k: 3, sigma: 5, mult: [5, 6.5], clampSig: 2.0, time: 22, multa: 3 },
  { n: 34, k: 4, sigma: 6, mult: [4.5, 5.5], clampSig: 2.0, time: 27, multa: 3.5 },
  { n: 40, k: 5, sigma: 7, mult: [3.8, 4.8], clampSig: 2.0, time: 32, multa: 4 },
];

const TEMAS = [
  { y: "precio del alfajor", x: "mes", min: 800, max: 2600, fmt: (v) => `$${Math.round(v / 10) * 10}`, trend: "lineal" },
  { y: "latencia del server", x: "deploy", min: 80, max: 420, fmt: (v) => `${Math.round(v)} ms`, trend: "onda" },
  { y: "usuarios activos", x: "semana", min: 2, max: 95, fmt: (v) => `${Math.round(v)}k`, trend: "s" },
  { y: "dólar blue", x: "mes", min: 900, max: 2100, fmt: (v) => `$${Math.round(v / 10) * 10}`, trend: "expo" },
];

// Tendencia normalizada: t en [0, 1] -> valor en [0, 1]
function tendencia(tipo, t, fase) {
  switch (tipo) {
    case "onda":
      return 0.5 + 0.5 * Math.sin(Math.PI * 2 * 1.1 * t + fase);
    case "s":
      return 1 / (1 + Math.exp(-10 * (t - 0.5)));
    case "expo":
      return (Math.exp(3 * t) - 1) / (Math.exp(3) - 1);
    default:
      return t;
  }
}

// Ruido gaussiano (Box-Muller)
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

export const configOutliers = (diff) => CFG[clamp(diff, 1, 4) - 1];

// Distancia mínima (en unidades del viewBox) entre un outlier y cualquier dato normal, por dificultad.
// En tendencias empinadas un vecino normal puede quedar pegado al outlier: ese dataset se descarta.
const MIN_SEP = [18, 16, 14, 12];

export function minSeparacion(puntos) {
  let min = Infinity;
  for (const o of puntos) {
    if (!o.out) continue;
    for (const p of puntos) if (!p.out) min = Math.min(min, Math.hypot(p.x - o.x, p.y - o.y));
  }
  return min;
}

export function generarDataset(diff, intento = 0) {
  const d = clamp(diff, 1, 4);
  const cfg = CFG[d - 1];
  const tema = TEMAS[d - 1];
  const fase = rand(0, Math.PI * 2);
  const { n, k, sigma } = cfg;
  // Índices de los outliers: nunca en las puntas y separados entre sí
  const outliers = [];
  for (const c of shuffle(Array.from({ length: n - 2 }, (_, i) => i + 1))) {
    if (outliers.length >= k) break;
    if (outliers.every((o) => Math.abs(o - c) >= 3)) outliers.push(c);
  }
  const puntos = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const base = PY + PH - (0.15 + 0.7 * tendencia(tema.trend, t, fase)) * PH;
    const out = outliers.includes(i);
    let dy;
    if (out) {
      dy = rand(cfg.mult[0], cfg.mult[1]) * sigma * (chance(0.5) ? 1 : -1);
      if (base + dy < PY + 5 || base + dy > PY + PH - 5) dy = -dy;
    } else {
      dy = clamp(gauss() * sigma, -cfg.clampSig * sigma, cfg.clampSig * sigma);
    }
    puntos.push({ x: PX + 6 + t * (PW - 12), y: clamp(base + dy, PY + 3, PY + PH - 3), base, out });
  }
  if (minSeparacion(puntos) < MIN_SEP[d - 1] && intento < 40) return generarDataset(diff, intento + 1);
  return { puntos, outliers, tema, n, k, sigma };
}

const valorEn = (tema, y) => tema.min + ((PY + PH - y) / PH) * (tema.max - tema.min);

export default function Outliers({ timeMult = 1, diff = 1, onFinish }) {
  const cfg = configOutliers(diff);
  const finishOnce = useFinishOnce(onFinish);
  const total = cfg.time * timeMult;
  const multa = cfg.multa;
  const data = useMemo(() => generarDataset(diff), [diff]);
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [penalty, setPenalty] = useState(0);
  const [msg, setMsg] = useState({ ok: null, text: "Los datos normales dejalos tranquilos." });
  const [done, setDone] = useState(false);
  const svgRef = useRef(null);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const rawLeft = useCountdown(total, !done, () => {});
  const left = Math.max(0, rawLeft - penalty);
  const timedOut = left <= 0 && !done;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  const tap = (e) => {
    if (done) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const scale = rect.width / W;
    const ux = (e.clientX - rect.left) / scale;
    const uy = (e.clientY - rect.top) / scale;
    // Gana el punto más cercano al dedo, si está a menos de HIT_PX píxeles
    let best = -1;
    let bestD = Infinity;
    data.puntos.forEach((p, i) => {
      const dist = Math.hypot(p.x - ux, p.y - uy);
      if (dist < bestD) {
        bestD = dist;
        best = i;
      }
    });
    if (best < 0 || bestD * scale > HIT_PX || found.includes(best)) return;
    if (data.puntos[best].out) {
      const next = [...found, best];
      setFound(next);
      if (next.length >= data.k) {
        setDone(true);
        setMsg({ ok: true, text: "Dataset limpio. Los outliers eran un bug del ETL, como siempre." });
        later(() => finishOnce(true), 500);
      } else {
        setMsg({ ok: true, text: `Outlier cazado. Faltan ${data.k - next.length}.` });
      }
    } else {
      setPenalty((p) => p + multa);
      setWrong({ i: best, id: Date.now() });
      setMsg({ ok: false, text: `Ese es un dato normal, che. -${multa}s` });
    }
  };

  const { tema, n } = data;
  const xTicks = [0, 0.5, 1].map((t) => ({ t, label: `${tema.x} ${Math.max(1, Math.round(1 + t * (n - 1)))}` }));
  const yTicks = [0.15, 0.5, 0.85].map((v) => PY + PH - v * PH);

  return (
    <div>
      <TimerBar left={left} total={total} label={`Outliers: ${found.length}/${data.k} · dato normal: -${multa}s`} />
      <p className={`${styles.mgGoal} ${ex.goal}`}>
        <LuChartScatter className={ex.ico} />
        <span>Cazá los {data.k} puntos que se escapan de la tendencia.</span>
      </p>
      <div className={ex.chartCap}>
        <span>{tema.y}</span>
        <span className={styles.muted}>por {tema.x}</span>
      </div>
      <svg ref={svgRef} className={ex.chart} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${tema.y} por ${tema.x}`} onPointerDown={tap}>
        {yTicks.map((y) => (
          <g key={y}>
            <line className={ex.grid} x1={PX} x2={PX + PW} y1={y} y2={y} />
            <text className={ex.axisText} x={PX - 4} y={y + 3} textAnchor="end">
              {tema.fmt(valorEn(tema, y))}
            </text>
          </g>
        ))}
        <line className={ex.axis} x1={PX} x2={PX + PW} y1={PY + PH} y2={PY + PH} />
        <line className={ex.axis} x1={PX} x2={PX} y1={PY} y2={PY + PH} />
        {xTicks.map(({ t, label }) => (
          <text
            key={label}
            className={ex.axisText}
            x={PX + 6 + t * (PW - 12)}
            y={PY + PH + 14}
            textAnchor={t === 0 ? "start" : t === 1 ? "end" : "middle"}
          >
            {label}
          </text>
        ))}
        {data.puntos.map((p, i) => (
          <circle key={i} className={`${ex.pt} ${found.includes(i) ? ex.ptFound : ""}`} cx={p.x} cy={p.y} r={R} />
        ))}
        {found.map((i) => {
          const p = data.puntos[i];
          return (
            <g key={i} transform={`translate(${p.x} ${p.y})`}>
              <circle className={ex.ring} r={R + 4.5} />
              <path className={ex.check} d="M-3.5 0.5 L-1 3 L3.5 -2.5" />
            </g>
          );
        })}
        {wrong && (
          <g key={wrong.id} transform={`translate(${data.puntos[wrong.i].x} ${data.puntos[wrong.i].y})`}>
            <circle className={ex.ringBad} r={R + 5} />
            <path className={ex.cross} d="M-3 -3 L3 3 M3 -3 L-3 3" />
          </g>
        )}
      </svg>
      <p className={`${ex.msg} ${msg.ok === true ? ex.msgGood : msg.ok === false ? ex.msgBad : ""}`}>
        {msg.ok === true && <LuCheck className={ex.ico} />}
        {msg.ok === false && <LuX className={ex.ico} />}
        <span>{msg.text}</span>
      </p>
    </div>
  );
}
