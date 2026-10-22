import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuX, LuCrown, LuLink, LuRocket, LuKanban } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosB.module.css";
import { rand, randInt, shuffle, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Sprint Planner: una mochila (knapsack) disfrazada de planning.
// Elegí historias sin pasarte de la capacidad y juntá casi todo el valor posible.
const HISTORIAS = [
  "Login con Google (y con Facebook, insiste el jefe)",
  "Arreglar el checkout de MercadoPago",
  "Dark mode porque lo pidió el sobrino del CEO",
  "Migrar a la nube (o sea, al server de Juan)",
  "Botón 'pagar en cuotas sin interés'",
  "Mover el logo 2px a la izquierda",
  "Fix: el carrito suma mal el IVA",
  "Integrar la facturación con ARCA",
  "Sacar los console.log de producción",
  "Agregar el mate a los emojis del chat",
  "Reescribir todo en Rust (pedido de un junior)",
  "Notificaciones push a las 3 AM",
  "Pagos con Cuenta DNI",
  "Traducir la app al porteño ('che', 'dale')",
  "Optimizar la query que tarda 40 segundos",
  "Pantalla de carga con la cara del CEO",
  "Onboarding de 14 pasos (UX dijo que no)",
  "Exportar reportes a Excel para Contaduría",
  "Fix del bug de los feriados puente",
  "Tests automatizados (ja)",
  "Reemplazar jQuery por React",
  "Doble factor con SMS que nunca llega",
  "Cache en Redis para el ranking de asados",
  "Landing para el Hot Sale",
  "Modo offline para cuando se corta la luz",
  "Bot de WhatsApp que responde 'dale'",
  "Cambiar la fuente a Comic Sans (A/B test)",
  "Cupones de descuento que no se puedan apilar",
];

const CFG = [
  { n: 6, umbral: 0.7, time: 40, multa: 5, dep: false, ceo: false },
  { n: 8, umbral: 0.78, time: 48, multa: 6, dep: false, ceo: false },
  { n: 9, umbral: 0.85, time: 55, multa: 7, dep: true, ceo: false },
  { n: 10, umbral: 0.9, time: 60, multa: 8, dep: true, ceo: true },
];

export const configSprint = (diff) => CFG[clamp(diff, 1, 4) - 1];

// Por qué un sprint no cierra (null si es válido). sel: array de booleanos por índice.
export function validarSprint(items, cap, sel) {
  let pts = 0;
  for (let i = 0; i < items.length; i++) if (sel[i]) pts += items[i].puntos;
  if (pts > cap) return { tipo: "capacidad", exceso: pts - cap };
  for (let i = 0; i < items.length; i++) {
    if (items[i].ceo && !sel[i]) return { tipo: "ceo", item: items[i] };
  }
  for (let i = 0; i < items.length; i++) {
    const dep = items[i].dep;
    if (sel[i] && dep != null && !sel[dep]) return { tipo: "dep", item: items[i], necesita: items[dep] };
  }
  return null;
}

// Óptimo exacto por fuerza bruta (n <= 12 => 4096 subconjuntos)
export function optimoSprint(items, cap) {
  const n = items.length;
  let mejor = { valor: 0, mask: 0 };
  const sel = new Array(n);
  for (let mask = 0; mask < 1 << n; mask++) {
    let valor = 0;
    for (let i = 0; i < n; i++) {
      sel[i] = (mask >> i) & 1;
      if (sel[i]) valor += items[i].valor;
    }
    if (valor > mejor.valor && !validarSprint(items, cap, sel)) mejor = { valor, mask };
  }
  return mejor;
}

export function generarSprint(diff) {
  const cfg = configSprint(diff);
  for (let intento = 0; intento < 30; intento++) {
    const titulos = shuffle(HISTORIAS).slice(0, cfg.n);
    const items = titulos.map((titulo, i) => {
      const puntos = randInt(1, 8);
      // El valor acompaña (más o menos) al esfuerzo, para que haya que pensar
      const valor = clamp(Math.round(puntos * rand(0.6, 1.6) + rand(-1, 2)), 1, 10);
      return { id: i, titulo, valor, puntos, dep: null, ceo: false };
    });
    const sum = items.reduce((a, it) => a + it.puntos, 0);
    const cap = Math.max(6, Math.round(sum * rand(0.42, 0.55)));
    const orden = shuffle(items.map((it) => it.id));
    if (cfg.dep) {
      const [a, b] = orden;
      if (items[a].puntos + items[b].puntos > cap) continue;
      items[b].dep = a;
    }
    if (cfg.ceo) {
      const c = orden[2];
      items[c].ceo = true;
      items[c].valor = randInt(2, 4);
      items[c].puntos = randInt(3, 5);
      if (items[c].puntos + 3 > cap) continue;
    }
    if (sum <= cap) continue;
    const optimo = optimoSprint(items, cap);
    if (optimo.valor <= 0) continue;
    const objetivo = Math.ceil(optimo.valor * cfg.umbral);
    return { items, cap, optimo, objetivo, umbral: cfg.umbral };
  }
  // Fallback determinista (no debería pasar)
  const items = HISTORIAS.slice(0, cfg.n).map((titulo, i) => ({ id: i, titulo, valor: 5, puntos: 3, dep: null, ceo: false }));
  const cap = 9;
  const optimo = optimoSprint(items, cap);
  return { items, cap, optimo, objetivo: Math.ceil(optimo.valor * cfg.umbral), umbral: cfg.umbral };
}

export default function SprintPlanner({ timeMult = 1, diff = 1, onFinish }) {
  const cfg = configSprint(diff);
  const finishOnce = useFinishOnce(onFinish);
  const total = cfg.time * timeMult;
  const sprint = useMemo(() => generarSprint(diff), [diff]);
  const { items, cap, objetivo, optimo } = sprint;
  const [sel, setSel] = useState(() => items.map(() => false));
  const [penalty, setPenalty] = useState(0);
  const [msg, setMsg] = useState({ ok: null, text: "Tocá las historias para meterlas al sprint." });
  const [shake, setShake] = useState(0);
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const rawLeft = useCountdown(total, !done, () => {});
  const left = Math.max(0, rawLeft - penalty);
  const timedOut = left <= 0 && !done;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  const pts = items.reduce((a, it, i) => a + (sel[i] ? it.puntos : 0), 0);
  const valor = items.reduce((a, it, i) => a + (sel[i] ? it.valor : 0), 0);
  const nada = !sel.some(Boolean);

  const toggle = (i) => {
    if (done) return;
    setSel((s) => s.map((v, j) => (j === i ? !v : v)));
  };

  const cerrar = () => {
    if (done || nada) return;
    const err = validarSprint(items, cap, sel);
    let text = null;
    if (err) {
      if (err.tipo === "capacidad") text = `Te pasaste ${err.exceso} punto${err.exceso === 1 ? "" : "s"}. El equipo no hace horas extra (bueno, sí, pero no las cobra).`;
      else if (err.tipo === "ceo") text = `El CEO preguntó por "${err.item.titulo}". Entra sí o sí.`;
      else text = `"${err.item.titulo}" necesita "${err.necesita.titulo}" en el mismo sprint.`;
    } else if (valor < objetivo) {
      const afuera = items.filter((it, i) => !sel[i]).sort((a, b) => b.valor - a.valor)[0];
      text = `Valor ${valor}: te faltan ${objetivo - valor}.` + (afuera ? ` Dejaste afuera "${afuera.titulo}" (valor ${afuera.valor}).` : "");
    }
    if (text) {
      setPenalty((p) => p + cfg.multa);
      setShake((k) => k + 1);
      setMsg({ ok: false, text: `${text} -${cfg.multa}s` });
      return;
    }
    setDone(true);
    setMsg({ ok: true, text: `Sprint cerrado con valor ${valor} (el óptimo era ${optimo.valor}). El equipo festeja con facturas.` });
    later(() => finishOnce(true), 500);
  };

  const pctPts = Math.min(100, (pts / cap) * 100);
  const pctVal = Math.min(100, (valor / objetivo) * 100);

  return (
    <div>
      <TimerBar left={left} total={total} label={`Puntos: ${pts}/${cap} · Valor: ${valor}/${objetivo}`} />
      <p className={`${styles.mgGoal} ${ex.goal}`}>
        <LuKanban className={ex.ico} />
        <span>
          Armá el sprint: máximo {cap} puntos y al menos {objetivo} de valor ({Math.round(cfg.umbral * 100)}% del óptimo).
        </span>
      </p>
      <div className={ex.spMeter}>
        <div className={ex.spRow}>
          <span>Puntos del equipo</span>
          <span className={pts > cap ? styles.danger : ""}>
            {pts}/{cap}
          </span>
        </div>
        <div className={ex.spTrack}>
          <div className={`${ex.spFill} ${pts > cap ? ex.spFillOver : ""}`} style={{ width: `${pctPts}%` }} />
        </div>
        <div className={ex.spRow}>
          <span>Valor para el negocio</span>
          <span className={valor >= objetivo ? styles.green : ""}>
            {valor}/{objetivo}
          </span>
        </div>
        <div className={ex.spTrack}>
          <div className={`${ex.spFill} ${valor >= objetivo ? ex.spFillOk : ""}`} style={{ width: `${pctVal}%` }} />
        </div>
      </div>
      <div className={ex.spList}>
        {items.map((it, i) => (
          <button
            type="button"
            key={it.id}
            className={`${ex.spStory} ${sel[i] ? ex.spOn : ""}`}
            aria-pressed={sel[i]}
            onClick={() => toggle(i)}
            disabled={done}
          >
            <span className={ex.spBox}>{sel[i] && <LuCheck />}</span>
            <span className={ex.spBody}>
              <span className={ex.spTitle}>{it.titulo}</span>
              <span className={ex.spTags}>
                <span className={`${ex.spTag} ${ex.spVal}`}>valor {it.valor}</span>
                <span className={`${ex.spTag} ${ex.spPts}`}>
                  {it.puntos} pt{it.puntos === 1 ? "" : "s"}
                </span>
                {it.dep != null && (
                  <span className={`${ex.spTag} ${ex.spDep}`}>
                    <LuLink /> necesita: {items[it.dep].titulo.split(" (")[0]}
                  </span>
                )}
                {it.ceo && (
                  <span className={`${ex.spTag} ${ex.spCeo}`}>
                    <LuCrown /> pedido del CEO
                  </span>
                )}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className={ex.spActions}>
        <button
          type="button"
          key={shake}
          className={`${styles.btn} ${styles.btnPrimary} ${ex.spClose} ${shake ? ex.shake : ""}`}
          onClick={cerrar}
          disabled={done || nada}
        >
          <LuRocket /> Cerrar sprint
        </button>
        <span className={styles.muted}>Cerrar mal cuesta {cfg.multa}s.</span>
      </div>
      <p className={`${ex.msg} ${msg.ok === true ? ex.msgGood : msg.ok === false ? ex.msgBad : ""}`}>
        {msg.ok === true && <LuCheck className={ex.ico} />}
        {msg.ok === false && <LuX className={ex.ico} />}
        <span>{msg.text}</span>
      </p>
    </div>
  );
}
