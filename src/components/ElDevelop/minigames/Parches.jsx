import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuX, LuShieldAlert, LuShieldCheck, LuSiren, LuWrench } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosA.module.css";
import { shuffle, pick, randInt, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Parche Express: amenazas a la izquierda, parches a la derecha. Tocá una y después el otro.
// Hay parches que no arreglan nada y, en difícil, un 0-day que aparece a mitad de partida.
export const PAIRS = [
  { id: "sqli", threat: "SQL Injection en el buscador", patch: "Prepared statements" },
  { id: "xss", threat: "XSS en los comentarios", patch: "Escapar el HTML" },
  { id: "brute", threat: "Fuerza bruta en el login", patch: "Rate limit + 2FA" },
  { id: "plain", threat: "Contraseñas en texto plano", patch: "Hashear con bcrypt" },
  { id: "phish", threat: "Phishing al CEO: 'transferí urgente'", patch: "Verificar por otro canal" },
  { id: "dep", threat: "Dependencia vulnerable", patch: "npm audit + actualizar" },
  { id: "ssh", threat: "Puerto 22 abierto al mundo", patch: "Firewall + VPN" },
  { id: "token", threat: "Token de AWS en el repo", patch: "Rotar el secreto + .gitignore" },
  { id: "csrf", threat: "CSRF desde un form ajeno", patch: "Token anti-CSRF" },
  { id: "tls", threat: "Datos sin cifrar en tránsito", patch: "HTTPS / TLS" },
  { id: "backup", threat: "Backups nunca probados", patch: "Restore de prueba mensual" },
  { id: "default", threat: "Router con admin/admin", patch: "Cambiar credenciales por defecto" },
];

// Parches que no arreglan nada de lo de arriba (pero suenan a solución)
export const DECOYS = [
  "Cambiar el puerto 22 al 2222",
  "Ofuscar el JavaScript del front",
  "Reiniciar el servidor",
  "Poner un cartel de 'Sitio 100% seguro'",
  "Mandar las claves por WhatsApp",
  "Comprar un antivirus en 12 cuotas",
  "Hacer el deploy un viernes a las 18",
];

export const ZERO_DAYS = [
  { id: "zd-logs", threat: "0-day en la librería de logs", patch: "Hotfix del proveedor + WAF" },
  { id: "zd-vpn", threat: "0-day en la VPN corporativa", patch: "Aislar + parche de emergencia" },
  { id: "zd-pdf", threat: "0-day en el visor de PDF", patch: "Deshabilitar hasta que salga el parche" },
];

const PAIR_COUNT = [4, 5, 7, 8];
const DECOY_COUNT = [1, 1, 2, 3];
const TIME = [40, 45, 55, 60];
const MULTA = [3, 4, 5, 6];
const ZD_AT = [0, 0, 0.3, 0.35]; // fracción del tiempo a la que aparece el 0-day (diff 3+)

export function makeBoard(diff) {
  const d = clamp(diff, 1, 4) - 1;
  const pairs = shuffle(PAIRS).slice(0, PAIR_COUNT[d]);
  const threats = shuffle(pairs.map((p) => ({ id: p.id, text: p.threat })));
  const patches = shuffle([
    ...pairs.map((p) => ({ id: `p-${p.id}`, pairId: p.id, text: p.patch })),
    ...shuffle(DECOYS)
      .slice(0, DECOY_COUNT[d])
      .map((text, i) => ({ id: `decoy-${i}`, pairId: null, text })),
  ]);
  const zd = d >= 2 ? pick(ZERO_DAYS) : null;
  return { threats, patches, zd, zdAt: ZD_AT[d], zdIndex: randInt(0, patches.length) };
}

// Timeouts que se limpian solos al desmontar
function useLater() {
  const ids = useRef([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    ids.current.push(id);
  }, []);
}

export default function Parches({ timeMult = 1, diff = 1, onFinish }) {
  const d = clamp(diff, 1, 4) - 1;
  const finishOnce = useFinishOnce(onFinish);
  const later = useLater();
  const total = TIME[d] * timeMult;
  const multa = MULTA[d];
  const board = useMemo(() => makeBoard(diff), [diff]);
  const [matched, setMatched] = useState(() => new Set());
  const [sel, setSel] = useState({ t: null, p: null });
  const [wrong, setWrong] = useState(null);
  const [penalty, setPenalty] = useState(0);
  const [zdOn, setZdOn] = useState(false);
  const [won, setWon] = useState(false);
  const rawLeft = useCountdown(total, !won, () => {});
  const left = Math.max(0, rawLeft - penalty);

  // Tablero actual: con el 0-day metido en el medio cuando aparece
  const threats = zdOn ? [...board.threats, { id: board.zd.id, text: board.zd.threat, zero: true }] : board.threats;
  const patches = zdOn
    ? [...board.patches.slice(0, board.zdIndex), { id: `p-${board.zd.id}`, pairId: board.zd.id, text: board.zd.patch, zero: true }, ...board.patches.slice(board.zdIndex)]
    : board.patches;

  const timedOut = left <= 0 && !won;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  // El 0-day aparece a mitad de partida (si todavía no ganaste)
  const zdDue = !!board.zd && !zdOn && !won && rawLeft <= total * (1 - board.zdAt);
  useEffect(() => {
    if (zdDue) setZdOn(true);
  }, [zdDue]);

  const tap = (col, id) => {
    if (won || timedOut) return;
    const next = { ...sel, [col]: sel[col] === id ? null : id };
    if (!next.t || !next.p) {
      setSel(next);
      return;
    }
    const patch = patches.find((p) => p.id === next.p);
    setSel({ t: null, p: null });
    if (patch && patch.pairId === next.t) {
      const m = new Set(matched);
      m.add(next.t);
      setMatched(m);
      if (m.size >= threats.length) {
        setWon(true);
        later(() => finishOnce(true), 600);
      }
    } else {
      setWrong(next);
      setPenalty((p) => p + multa);
      later(() => setWrong((w) => (w === next ? null : w)), 450);
    }
  };

  const itemCls = (col, item) => {
    let cls = ex.paItem;
    if (item.zero) cls += ` ${ex.paZero}`;
    if (matched.has(col === "t" ? item.id : item.pairId)) cls += ` ${ex.paDone}`;
    else if (wrong && wrong[col] === item.id) cls += ` ${ex.paWrong}`;
    else if (sel[col] === item.id) cls += ` ${ex.paOn}`;
    return cls;
  };

  const isDone = (col, item) => matched.has(col === "t" ? item.id : item.pairId);

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pares: ${matched.size}/${threats.length} (equivocarte resta ${multa}s)`} />
      <p className={styles.mgGoal}>
        <LuWrench className={ex.ico} />
        Tocá una amenaza y después su parche. Ojo: hay parches que no arreglan nada.
      </p>

      {zdOn && !matched.has(board.zd.id) && (
        <div className={ex.paBanner} role="status">
          <LuSiren />
          <span>0-DAY DETECTADO: apareció una amenaza nueva. Parchealá también.</span>
        </div>
      )}

      <div className={ex.paBoard}>
        <div className={ex.paCol}>
          <span className={ex.paColHead}>
            <LuShieldAlert /> Amenazas
          </span>
          {threats.map((t) => (
            <button type="button" key={t.id} className={itemCls("t", t)} onClick={() => tap("t", t.id)} disabled={isDone("t", t)}>
              {isDone("t", t) ? <LuCheck /> : wrong && wrong.t === t.id ? <LuX /> : t.zero ? <LuSiren className={ex.paZeroIcon} /> : null}
              {t.text}
            </button>
          ))}
        </div>
        <div className={ex.paCol}>
          <span className={ex.paColHead}>
            <LuShieldCheck /> Parches
          </span>
          {patches.map((p) => (
            <button type="button" key={p.id} className={itemCls("p", p)} onClick={() => tap("p", p.id)} disabled={isDone("p", p)}>
              {isDone("p", p) ? <LuCheck /> : wrong && wrong.p === p.id ? <LuX /> : null}
              {p.text}
            </button>
          ))}
        </div>
      </div>

      <p className={`${ex.msg} ${won ? ex.msgOk : timedOut ? ex.msgBad : ""}`}>
        {won ? (
          <>
            <LuCheck /> Todo parcheado. El auditor se fue sin encontrar nada (raro).
          </>
        ) : timedOut ? (
          <>
            <LuX /> Se acabó el tiempo. Ya están vendiendo la base en un foro ruso.
          </>
        ) : wrong ? (
          "Ese parche no arregla eso. Capa 8 en seguridad."
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
