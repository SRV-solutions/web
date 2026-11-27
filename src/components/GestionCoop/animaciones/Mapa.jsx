import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import { LuMoon, LuSun } from "react-icons/lu";
import a from "./animaciones.module.css";
import { CONEXIONES, VISTA, geometria } from "./mapaRelieve";

// Mapa en 3D de un pueblo inventado, con relieve: cada casa es una conexión y el color del techo, su situación (al día,
// con deuda, en mora, cortada). De a ratos alguien paga y su techo se pone verde. Pasa solo del día a la noche (de
// noche se prenden las luces de las casas), y también se puede elegir con los botones. Las lecturas en vivo laten.
//
// Para que sea liviano no usa WebGL ni librerías de 3D, y va en capas: el terreno con las casas y los árboles se dibuja
// una sola vez (la geometría sale de mapaRelieve.js, que se calcula cuando el mapa está por verse) y no se vuelve a
// tocar; la noche es un velo y una capa de luces que cambian solo de opacidad; arriba de todo van los techos, que
// son lo único que cambia de color.
const ESTADOS = [
  { id: "alDia", nombre: "Al día", color: "#30a05a" },
  { id: "deuda", nombre: "Con deuda", color: "#f6950a" },
  { id: "mora", nombre: "En mora", color: "#e5484d" },
  { id: "cortado", nombre: "Cortado", color: "#6b7280" },
];
const COLOR = Object.fromEntries(ESTADOS.map((e) => [e.id, e.color]));

// Las que laten: lecturas que llegan en vivo
const EN_VIVO = CONEXIONES.map((_, i) => i).filter((i) => i % 17 === 5);

// En el ejemplo nadie pasa a "cortado" ni sale de ahí (los cambios son entre al día, con deuda y en mora): las casas
// cortadas, sin luz de noche, son siempre las mismas
const CORTADAS = new Set(CONEXIONES.flatMap((c, i) => (c.estado === "cortado" ? [i] : [])));

const TONOS_ARBOL = ["#4f8f49", "#5d9d52", "#457f42"];

// El terreno, el arroyo, las calles, los árboles y las paredes: se dibujan una vez
const Suelo = memo(function Suelo({ geo }) {
  const { terreno, curvas, superficie, objetos } = geo;
  return (
    <svg viewBox={VISTA} preserveAspectRatio="xMidYMid slice" className={a.mapaCapa} aria-hidden="true">
      <defs>
        {/* Suaviza los escalones del sombreado. Cuesta solo la primera vez: esta capa no se vuelve a dibujar */}
        <filter id="gcRelieve" x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect x="-2000" y="-2000" width="4000" height="4000" fill="#e2eaf0" />
      <g filter="url(#gcRelieve)">
        {terreno.map((c, i) => (
          <path key={i} d={c.d} fill={c.color} stroke={c.color} strokeWidth="0.7" strokeLinejoin="round" />
        ))}
      </g>
      <path d={curvas} fill="none" stroke="rgba(52, 78, 44, 0.22)" strokeWidth="0.8" />
      <path d={superficie.parque} fill="rgba(150, 196, 124, 0.55)" />
      <path d={superficie.rio} fill="none" stroke="#6ea6d8" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" />
      <path d={superficie.rio} fill="none" stroke="#9cc9f1" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d={superficie.calles} fill="none" stroke="#c4ccbf" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={superficie.calles} fill="none" stroke="#fbfbf8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <path d={superficie.ruta} fill="none" stroke="#d8cfae" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d={superficie.ruta} fill="none" stroke="#fff3d6" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round" />
      {objetos.map((o) =>
        o.tipo === "arbol" ? (
          <g key={`a${o.base}`}>
            <ellipse cx={o.base[0] + 3} cy={o.base[1] + 1} rx={o.r + 1} ry={(o.r + 1) * 0.5} fill="rgba(28, 48, 26, 0.22)" />
            <line x1={o.base[0]} y1={o.base[1]} x2={o.copa[0]} y2={o.copa[1] + 2} stroke="#7a5a3c" strokeWidth="1.4" />
            <circle cx={o.copa[0]} cy={o.copa[1]} r={o.r} fill={TONOS_ARBOL[o.tono]} />
            <circle cx={o.copa[0] - o.r * 0.35} cy={o.copa[1] - o.r * 0.35} r={o.r * 0.45} fill="rgba(255, 255, 255, 0.2)" />
          </g>
        ) : (
          <g key={`c${o.i}`}>
            <polygon points={o.sur} fill="#b7bec8" />
            <polygon points={o.oeste} fill="#d9dde3" />
          </g>
        )
      )}
    </svg>
  );
});

// Las luces de la noche (menos en las casas cortadas): también se dibujan una vez
const Luces = memo(function Luces({ geo }) {
  return (
    <svg viewBox={VISTA} preserveAspectRatio="xMidYMid slice" className={`${a.mapaCapa} ${a.mapaLuces}`} aria-hidden="true">
      <defs>
        <radialGradient id="gcBrillo">
          <stop offset="0" stopColor="#ffd27a" stopOpacity="0.9" />
          <stop offset="1" stopColor="#ffb347" stopOpacity="0" />
        </radialGradient>
      </defs>
      {geo.casas.map((c, i) => (CORTADAS.has(i) ? null : <circle key={i} cx={c.luz[0]} cy={c.luz[1]} r="13" fill="url(#gcBrillo)" />))}
    </svg>
  );
});

const contar = (estados, ...ids) => estados.filter((e) => ids.includes(e)).length;
const DEUDORES_AL_EMPEZAR = contar(CONEXIONES.map((c) => c.estado), "deuda", "mora");
const EN_MORA_AL_EMPEZAR = contar(CONEXIONES.map((c) => c.estado), "mora");

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

// Corre `fn` cuando el navegador está libre (o enseguida, si no sabe avisar)
function cuandoEsteLibre(fn) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(fn, { timeout: 700 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 1);
  return () => clearTimeout(id);
}

export default function Mapa() {
  const ref = useRef(null);
  const enPantalla = useInView(ref, { amount: 0.3 });
  // La geometría se calcula un poco antes de llegar, para que al verlo ya esté dibujado
  const cerca = useInView(ref, { margin: "600px 0px", once: true });
  const reducido = Boolean(useReducedMotion());
  const [geo, setGeo] = useState(null);
  const [estados, setEstados] = useState(() => CONEXIONES.map((c) => c.estado));
  const [noche, setNoche] = useState(false);
  const [manual, setManual] = useState(false);
  const [pago, setPago] = useState(null);
  const estadosRef = useRef(estados);
  estadosRef.current = estados;
  const vivo = enPantalla && !reducido && Boolean(geo);

  useEffect(() => {
    if (!cerca || geo) return undefined;
    return cuandoEsteLibre(() => setGeo(geometria()));
  }, [cerca, geo]);

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

  const etiquetas = geo?.etiquetas;

  return (
    <div ref={ref} className={`${a.mapa} ${noche ? a.mapaNoche : ""}`}>
      <div className={a.mapaLienzo}>
        {geo && (
          <>
            <Suelo geo={geo} />
            <div className={a.mapaVelo} />
            <Luces geo={geo} />

            <svg
              viewBox={VISTA}
              preserveAspectRatio="xMidYMid slice"
              className={a.mapaCapa}
              role="img"
              aria-label={`Mapa en 3D de ejemplo, de ${noche ? "noche" : "día"}, con ${CONEXIONES.length} conexiones: ${conteo.alDia} al día, ${conteo.deuda} con deuda, ${conteo.mora} en mora y ${conteo.cortado} cortadas.`}
            >
              <path d={geo.superficie.corte} className={`${a.zonaCorte} ${vivo ? a.zonaCorteViva : ""}`} />

              {geo.casas.map((c, i) => (
                <polygon key={i} points={c.techo} className={a.techo} style={{ fill: COLOR[estados[i]] }} />
              ))}

              {vivo &&
                EN_VIVO.map((i, n) => (
                  <circle
                    key={i}
                    cx={geo.casas[i].centro[0]}
                    cy={geo.casas[i].centro[1]}
                    r="5"
                    className={a.pulso}
                    style={{ animationDelay: `${(n * 0.43).toFixed(2)}s` }}
                  />
                ))}

              {pago && (
                <m.circle
                  key={pago.t}
                  cx={geo.casas[pago.i].centro[0]}
                  cy={geo.casas[pago.i].centro[1]}
                  fill="none"
                  stroke="#30a05a"
                  strokeWidth="2.5"
                  initial={{ r: 4, opacity: 1 }}
                  animate={{ r: 24, opacity: 0 }}
                  transition={{ duration: 1.1, ease: "easeOut" }}
                />
              )}

              <g className={a.mapaTexto}>
                <text x={etiquetas.norte[0]} y={etiquetas.norte[1]} textAnchor="middle">Barrio Norte</text>
                <text x={etiquetas.centro[0]} y={etiquetas.centro[1]} textAnchor="middle">Centro</text>
                <text x={etiquetas.cerro[0]} y={etiquetas.cerro[1]} textAnchor="middle">El Cerrito</text>
                <text x={etiquetas.corte[0]} y={etiquetas.corte[1]} textAnchor="middle" className={a.mapaTextoAzul}>
                  Corte programado
                </text>
                <text x={etiquetas.corte[0]} y={etiquetas.corte[1] + 18} textAnchor="middle" className={a.mapaTextoAzul}>
                  vie 4/12 · 8 a 12 h
                </text>
                <text x={etiquetas.rio[0]} y={etiquetas.rio[1]} textAnchor="middle" className={a.mapaTextoRio}>
                  Arroyo del Monte
                </text>
              </g>
            </svg>
          </>
        )}

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
