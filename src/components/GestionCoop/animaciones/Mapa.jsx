import React, { useEffect, useMemo, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { LuMoon, LuSun } from "react-icons/lu";
import a from "./animaciones.module.css";
import { azar } from "./util";

// Mapa estilizado de un pueblo inventado: cada punto es una conexión con su situación (al día, con deuda, en mora,
// cortada). De a ratos alguien paga y su punto se pone verde. Pasa solo del día a la noche (de noche se prenden las
// luces de las casas), y también se puede elegir con los botones. Las lecturas en vivo laten.
const COLUMNAS = [255, 345, 435, 525, 615, 705];
const FILAS = [80, 160, 240, 320];

const ESTADOS = [
  { id: "alDia", nombre: "Al día", color: "#30a05a" },
  { id: "deuda", nombre: "Con deuda", color: "#f6950a" },
  { id: "mora", nombre: "En mora", color: "#e5484d" },
  { id: "cortado", nombre: "Cortado", color: "#6b7280" },
];
const COLOR = Object.fromEntries(ESTADOS.map((e) => [e.id, e.color]));

const estadoAlAzar = (n) => (n < 0.74 ? "alDia" : n < 0.86 ? "deuda" : n < 0.95 ? "mora" : "cortado");

const CASAS = (() => {
  const r = azar(2026);
  const casas = [];
  const sumar = (x, y) => casas.push({ x: x + (r() - 0.5) * 3, y: y + (r() - 0.5) * 3, estado: estadoAlAzar(r()) });
  for (let f = 0; f < FILAS.length - 1; f++) {
    for (let c = 0; c < COLUMNAS.length - 1; c++) {
      const x0 = COLUMNAS[c] + 14;
      const x1 = COLUMNAS[c + 1] - 14;
      for (const y of [FILAS[f] + 13, FILAS[f + 1] - 13]) {
        for (let x = x0; x <= x1 + 0.1; x += 15.5) {
          if (r() < 0.16) continue;
          sumar(x, y);
        }
      }
    }
  }
  // Casas sueltas sobre la ruta y del otro lado del arroyo
  for (let i = 0; i < 8; i++) sumar(30 + i * 26, 44 + i * 4.6 + (i % 2 ? 13 : -13));
  for (let x = 300; x <= 690; x += 34) if (r() > 0.3) sumar(x, 462);
  return casas;
})();

// Las que laten: lecturas que llegan en vivo
const EN_VIVO = CASAS.map((_, i) => i).filter((i) => i % 17 === 5);

const CALLES = [
  ...FILAS.map((y) => `M230 ${y}H730`),
  ...COLUMNAS.map((x) => `M${x} 60V345`),
  "M435 345V480",
  "M615 345V480",
].join("");
const RUTA = "M0 34Q130 44 230 80";
const RIO = "M0 420C120 380 220 450 340 410S560 380 660 420S860 452 960 402";

const DIA = { tierra: "#e7ece4", parque: "#d3e3cc", rio: "#9cc8f2", calle: "#ffffff", borde: "#cdd5ca", ruta: "#fff3d6" };
const NOCHE = { tierra: "#070b11", parque: "#0a1410", rio: "#0d2847", calle: "#1a2330", borde: "#0e141c", ruta: "#2a2a22" };

function Capa({ c }) {
  return (
    <g>
      <rect width="960" height="480" fill={c.tierra} />
      <rect x="40" y="150" width="160" height="120" rx="34" fill={c.parque} />
      <rect x="770" y="80" width="160" height="210" rx="44" fill={c.parque} />
      <path d={RIO} fill="none" stroke={c.rio} strokeWidth="18" strokeLinecap="round" />
      <path d={CALLES} fill="none" stroke={c.borde} strokeWidth="12" strokeLinecap="round" />
      <path d={CALLES} fill="none" stroke={c.calle} strokeWidth="8" strokeLinecap="round" />
      <path d={RUTA} fill="none" stroke={c.borde} strokeWidth="16" strokeLinecap="round" />
      <path d={RUTA} fill="none" stroke={c.ruta} strokeWidth="11" strokeLinecap="round" />
    </g>
  );
}

const contar = (estados, ...ids) => estados.filter((e) => ids.includes(e)).length;
const DEUDORES_AL_EMPEZAR = contar(CASAS.map((c) => c.estado), "deuda", "mora");
const EN_MORA_AL_EMPEZAR = contar(CASAS.map((c) => c.estado), "mora");

// Qué pasa en cada tic: alguien paga, a alguien se le vence una factura o una deuda pasa a mora. Se mantiene cerca
// de las cantidades del principio, para que el mapa no termine todo verde ni todo rojo.
function proximoCambio(estados) {
  const deudores = contar(estados, "deuda", "mora");
  const tipo =
    deudores >= DEUDORES_AL_EMPEZAR
      ? "pago"
      : contar(estados, "mora") < EN_MORA_AL_EMPEZAR && Math.random() < 0.4
        ? "atraso"
        : "vence";
  const busca = tipo === "pago" ? ["deuda", "mora"] : tipo === "vence" ? ["alDia"] : ["deuda"];
  const candidatas = [];
  estados.forEach((e, i) => busca.includes(e) && candidatas.push(i));
  if (!candidatas.length) return null;
  const i = candidatas[Math.floor(Math.random() * candidatas.length)];
  return { i, tipo, nuevo: tipo === "pago" ? "alDia" : tipo === "vence" ? "deuda" : "mora" };
}

export default function Mapa() {
  const ref = useRef(null);
  const enPantalla = useInView(ref, { amount: 0.3 });
  const reducido = Boolean(useReducedMotion());
  const [estados, setEstados] = useState(() => CASAS.map((c) => c.estado));
  const [noche, setNoche] = useState(false);
  const [manual, setManual] = useState(false);
  const [pago, setPago] = useState(null);
  const estadosRef = useRef(estados);
  estadosRef.current = estados;
  const vivo = enPantalla && !reducido;

  useEffect(() => {
    if (!vivo) return undefined;
    let tics = 0;
    const id = setInterval(() => {
      tics += 1;
      const cambio = proximoCambio(estadosRef.current);
      if (cambio) {
        setEstados((prev) => prev.map((e, i) => (i === cambio.i ? cambio.nuevo : e)));
        if (cambio.tipo === "pago") setPago({ i: cambio.i, t: Date.now() });
      }
      if (!manual && tics % 4 === 0) setNoche((v) => !v);
    }, 1500);
    return () => clearInterval(id);
  }, [vivo, manual]);

  const conteo = useMemo(() => {
    const c = Object.fromEntries(ESTADOS.map((e) => [e.id, 0]));
    estados.forEach((e) => {
      c[e] += 1;
    });
    return c;
  }, [estados]);

  const elegir = (deNoche) => {
    setManual(true);
    setNoche(deNoche);
  };

  return (
    <div ref={ref} className={`${a.mapa} ${noche ? a.mapaNoche : ""}`}>
      <div className={a.mapaLienzo}>
        <svg
          viewBox="0 0 960 480"
          preserveAspectRatio="xMidYMid slice"
          className={a.mapaSvg}
          role="img"
          aria-label={`Mapa de ejemplo de ${noche ? "noche" : "día"} con ${CASAS.length} conexiones: ${conteo.alDia} al día, ${conteo.deuda} con deuda, ${conteo.mora} en mora y ${conteo.cortado} cortadas.`}
        >
          <defs>
            <radialGradient id="gcBrillo">
              <stop offset="0" stopColor="#ffd27a" stopOpacity="0.85" />
              <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
            </radialGradient>
          </defs>

          <Capa c={DIA} />
          <m.g initial={false} animate={{ opacity: noche ? 1 : 0 }} transition={{ duration: 1.2 }}>
            <Capa c={NOCHE} />
          </m.g>

          <rect x="517" y="150" width="196" height="100" rx="10" className={`${a.zonaCorte} ${vivo ? a.zonaCorteViva : ""}`} />

          <m.g initial={false} animate={{ opacity: noche ? 1 : 0 }} transition={{ duration: 1.2 }}>
            {CASAS.map((c, i) =>
              estados[i] === "cortado" ? null : <circle key={i} cx={c.x} cy={c.y} r="12" fill="url(#gcBrillo)" />
            )}
          </m.g>

          {CASAS.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="4.4" className={a.casa} style={{ fill: COLOR[estados[i]] }} />
          ))}

          {vivo &&
            EN_VIVO.map((i, n) => (
              <circle
                key={i}
                cx={CASAS[i].x}
                cy={CASAS[i].y}
                r="5"
                className={a.pulso}
                style={{ animationDelay: `${(n * 0.43).toFixed(2)}s` }}
              />
            ))}

          {pago && (
            <m.circle
              key={pago.t}
              cx={CASAS[pago.i].x}
              cy={CASAS[pago.i].y}
              fill="none"
              stroke="#30a05a"
              strokeWidth="2.5"
              initial={{ r: 4, opacity: 1 }}
              animate={{ r: 24, opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
            />
          )}

          <g className={a.mapaTexto}>
            <text x="610" y="48" textAnchor="middle">Barrio Norte</text>
            <text x="480" y="205" textAnchor="middle">Centro</text>
            <text x="615" y="196" textAnchor="middle" className={a.mapaTextoAzul}>Corte programado</text>
            <text x="615" y="215" textAnchor="middle" className={a.mapaTextoAzul}>vie 4/12 · 8 a 12 h</text>
            <text x="560" y="446" textAnchor="middle" className={a.mapaTextoRio}>Arroyo del Monte</text>
          </g>
        </svg>

        <div className={a.mapaControles}>
          <span className={a.mapaHora}>
            {noche ? <LuMoon aria-hidden="true" /> : <LuSun aria-hidden="true" />}
            <b>{noche ? "21:30" : "14:30"}</b>
          </span>
          <span className={a.mapaSelector} role="group" aria-label="Ver el mapa de día o de noche">
            <button type="button" aria-pressed={!noche} onClick={() => elegir(false)}>
              Día
            </button>
            <button type="button" aria-pressed={noche} onClick={() => elegir(true)}>
              Noche
            </button>
          </span>
        </div>
      </div>

      <ul className={a.mapaLeyenda}>
        {ESTADOS.map((e) => (
          <li key={e.id}>
            <i style={{ background: e.color }} /> {e.nombre} <b>{conteo[e.id]}</b>
          </li>
        ))}
        <li>
          <i className={a.leyendaVivo} /> Lectura en vivo
        </li>
      </ul>
    </div>
  );
}
