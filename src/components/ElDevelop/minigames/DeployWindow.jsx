import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuRocket, LuHeart, LuHeartCrack, LuCheck, LuX, LuTarget } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosA.module.css";
import { rand, pick, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Ventana de Deploy: el marcador va y viene; tocá DEPLOY cuando esté en la zona verde.
// Cada error es un rollback (perdés una de 3 vidas) y queda registrado en la consola.
export const SPEED = [60, 75, 92, 110]; // % del track por segundo
export const ZONE = [26, 20, 15, 12]; // ancho de la zona verde en %
export const NEED = [3, 4, 5, 6];
export const TIME = [25, 26, 30, 32];
const SPEED_UP = [0, 2, 3, 3]; // el marcador se acelera un poco con cada deploy exitoso
const SHRINK = 0.3; // en diff 3+ la zona se achica hasta un 30% con el tiempo
export const LIVES = 3;
const LOCK_MS = 350;

const FAILS = [
  "prod se cayó un viernes a las 18:59",
  "el QA dijo que andaba",
  "rollback en curso... el CTO ya está en el canal",
  "funcionaba en mi máquina",
  "el deploy pisó el .env de producción",
  "se cayó el carrito justo en el Hot Sale",
  "alguien hizo push --force a main",
  "la migración borró la tabla usuarios (había backup... creo)",
  "503 Service Unavailable: el pager suena a las 3 AM",
];
const OKS = [
  "deploy OK · 0 errores (por ahora)",
  "pipeline verde · prod respira",
  "health check 200 · nadie se enteró",
  "rollout completo · el PM aplaude en la daily",
  "canary feliz · métricas estables",
];

// Dónde arranca la zona para que quede entera adentro del track
export const zoneStart = (width) => rand(5, 95 - width);

// Timeouts que se limpian solos al desmontar
function useLater() {
  const ids = useRef([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    ids.current.push(id);
  }, []);
}

export default function DeployWindow({ timeMult = 1, diff = 1, onFinish }) {
  const d = clamp(diff, 1, 4) - 1;
  const finishOnce = useFinishOnce(onFinish);
  const later = useLater();
  const total = TIME[d] * timeMult;
  const need = NEED[d];
  const shrinks = d >= 2;
  const zone0 = useMemo(() => ({ start: zoneStart(ZONE[d]), width: ZONE[d] }), [d]);
  const g = useRef(null);
  if (g.current === null) {
    g.current = { pos: 0, dir: 1, speed: SPEED[d], zone: { ...zone0 }, w0: ZONE[d], lock: 0, over: false, hits: 0, lives: LIVES, reduced: false, logId: 0 };
  }
  const markerRef = useRef(null);
  const zoneRef = useRef(null);
  const [hits, setHits] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [flash, setFlash] = useState(null);
  const [log, setLog] = useState([]);
  const [over, setOver] = useState(false);
  const left = useCountdown(total, !over, () => {
    g.current.over = true;
    setOver(true);
    finishOnce(false);
  });

  // Animación: la posición vive en el ref y se pinta con transform, sin re-render
  useEffect(() => {
    const s = g.current;
    s.reduced = typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    const start = last;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!s.over) {
        s.pos += s.dir * s.speed * (s.reduced ? 0.65 : 1) * dt;
        if (s.pos >= 100) {
          s.pos = 200 - s.pos;
          s.dir = -1;
        } else if (s.pos <= 0) {
          s.pos = -s.pos;
          s.dir = 1;
        }
        s.pos = clamp(s.pos, 0, 100);
        if (shrinks) {
          const elapsed = clamp((now - start) / 1000 / total, 0, 1);
          s.zone.width = s.w0 * (1 - SHRINK * elapsed);
        }
      }
      if (markerRef.current) markerRef.current.style.transform = `translateX(${s.pos}%)`;
      if (zoneRef.current) {
        zoneRef.current.style.left = `${s.zone.start}%`;
        zoneRef.current.style.width = `${s.zone.width}%`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [total, shrinks]);

  const addLog = (ok, text) => {
    const id = ++g.current.logId;
    setLog((l) => [...l, { ok, text, id }].slice(-4));
  };

  const deploy = () => {
    const s = g.current;
    const now = performance.now();
    if (s.over || now < s.lock) return;
    s.lock = now + LOCK_MS;
    const inZone = s.pos >= s.zone.start && s.pos <= s.zone.start + s.zone.width;
    setFlash(inZone ? "ok" : "bad");
    later(() => setFlash(null), 300);
    if (inZone) {
      s.hits += 1;
      s.speed += SPEED_UP[d];
      // En diff 2+ la zona se muda después de cada deploy
      if (d >= 1) s.zone.start = zoneStart(s.zone.width);
      setHits(s.hits);
      addLog(true, `v1.${s.hits}.0 ${pick(OKS)}`);
      if (s.hits >= need) {
        s.over = true;
        setOver(true);
        later(() => finishOnce(true), 600);
      }
    } else {
      s.lives -= 1;
      setLives(s.lives);
      addLog(false, `ROLLBACK: ${pick(FAILS)}`);
      if (s.lives <= 0) {
        s.over = true;
        setOver(true);
        later(() => finishOnce(false), 700);
      }
    }
  };

  const onKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      deploy();
    }
  };

  const trackCls = `${ex.dwTrack} ${flash === "ok" ? ex.dwOk : ""} ${flash === "bad" ? ex.dwBad : ""}`;
  const won = over && hits >= need;
  const endLine = won
    ? "release terminado. Andá a dormir, que mañana es lunes."
    : lives <= 0
    ? "se te acabaron los rollbacks. Te mandaron a hacer el curso de ITIL."
    : "se cerró la ventana de deploy. El change manager dice que la semana que viene.";

  return (
    <div>
      <TimerBar left={left} total={total} label={`Deploys: ${hits}/${need} · Rollbacks: ${LIVES - lives}/${LIVES}`} />
      <p className={styles.mgGoal}>
        <LuTarget className={ex.ico} />
        Tocá DEPLOY con el marcador adentro de la zona verde. Al tercer rollback te sacan el acceso a prod.
      </p>

      <div className={ex.dwTop}>
        <span>{shrinks ? "La ventana se achica con el tiempo" : d >= 1 ? "La ventana se muda en cada deploy" : "Ventana fija: aprovechala"}</span>
        <span className={ex.dwLives} aria-label={`Vidas: ${lives} de ${LIVES}`}>
          {Array.from({ length: LIVES }, (_, i) =>
            i < lives ? <LuHeart key={i} className={ex.dwLive} /> : <LuHeartCrack key={i} className={ex.dwLost} />
          )}
        </span>
      </div>

      <div className={trackCls}>
        <div className={ex.dwZone} ref={zoneRef} style={{ left: `${zone0.start}%`, width: `${zone0.width}%` }} />
        <div className={ex.dwMarker} ref={markerRef} />
      </div>

      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary} ${ex.dwBtn}`}
        onPointerDown={(e) => e.button === 0 && deploy()}
        onKeyDown={onKey}
        disabled={over}
      >
        <LuRocket /> DEPLOY
      </button>

      <div className={ex.dwConsole} aria-live="polite">
        {log.length === 0 && (
          <div className={ex.dwLine}>
            <span>$</span>
            <span>
              esperando ventana de deploy<span className={ex.dwCursor}>_</span>
            </span>
          </div>
        )}
        {log.map((l) => (
          <div key={l.id} className={`${ex.dwLine} ${l.ok ? ex.dwLineOk : ex.dwLineBad}`}>
            <span>$</span>
            <span>
              {l.ok ? <LuCheck className={ex.ico} /> : <LuX className={ex.ico} />}
              {l.text}
            </span>
          </div>
        ))}
        {over && (
          <div className={`${ex.dwLine} ${won ? ex.dwLineOk : ex.dwLineBad}`}>
            <span>$</span>
            <span>{endLine}</span>
          </div>
        )}
      </div>
    </div>
  );
}
