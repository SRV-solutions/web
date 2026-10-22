import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuX, LuSend, LuServer } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosA.module.css";
import { shuffle, pick, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Endpoint Rush: el front pide cosas y vos armás la respuesta correcta: método + ruta + status.
export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];
export const PATHS = ["/users", "/users/:id", "/users/:id/posts", "/posts", "/posts/:id", "/login", "/me", "/admin/stats"];
export const STATUSES = [200, 201, 204, 400, 401, 403, 404, 409];
export const STATUS_TEXT = {
  200: "OK",
  201: "Created",
  204: "No Content",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

// nearM / nearP / nearS: distractores "parecidos" (los que confunden de verdad).
// hard: solo aparecen en dificultad 3+ (401 vs 403, 409, 204 vs 200...).
export const CASES = [
  { text: "Crear un usuario nuevo con mail y contraseña válidos.", method: "POST", path: "/users", status: 201, nearM: ["PUT"], nearP: ["/users/:id", "/login"], nearS: [200] },
  { text: "Traer la lista completa de usuarios.", method: "GET", path: "/users", status: 200, nearM: ["POST"], nearP: ["/users/:id", "/me"], nearS: [201, 204] },
  { text: "Traer el perfil del usuario 7 (existe, token válido).", method: "GET", path: "/users/:id", status: 200, nearM: ["POST"], nearP: ["/users", "/me", "/users/:id/posts"], nearS: [201, 204] },
  { text: "Borrar el post 42: existe y es tuyo.", method: "DELETE", path: "/posts/:id", status: 204, nearM: ["PATCH"], nearP: ["/posts", "/users/:id/posts"], nearS: [200, 404] },
  { text: "Traer el post 999, que no existe.", method: "GET", path: "/posts/:id", status: 404, nearM: ["POST"], nearP: ["/posts", "/users/:id/posts"], nearS: [400, 204] },
  { text: "Traer el perfil del usuario 7 sin mandar ningún token.", method: "GET", path: "/users/:id", status: 401, nearM: ["POST"], nearP: ["/login", "/me", "/users"], nearS: [403, 400] },
  { text: "Reemplazar TODO el perfil del usuario 7 por uno nuevo (token válido).", method: "PUT", path: "/users/:id", status: 200, nearM: ["PATCH", "POST"], nearP: ["/users", "/me"], nearS: [201, 204] },
  { text: "Cambiar SOLO el teléfono del usuario 7 (token válido).", method: "PATCH", path: "/users/:id", status: 200, nearM: ["PUT", "POST"], nearP: ["/users", "/me"], nearS: [201, 204] },
  { text: "Crear un usuario, pero el mail viene sin @ (formato inválido).", method: "POST", path: "/users", status: 400, nearM: ["PUT"], nearP: ["/users/:id", "/login"], nearS: [409, 404] },
  { text: "Loguearse con usuario y contraseña correctos.", method: "POST", path: "/login", status: 200, nearM: ["GET"], nearP: ["/me", "/users"], nearS: [201, 204] },
  { text: "Loguearse, pero la contraseña está mal.", method: "POST", path: "/login", status: 401, nearM: ["GET"], nearP: ["/me", "/users"], nearS: [403, 400] },
  { text: "Traer todos los posts del usuario 7 (existe).", method: "GET", path: "/users/:id/posts", status: 200, nearM: ["POST"], nearP: ["/posts", "/users/:id"], nearS: [201, 204] },
  { text: "Publicar un post nuevo (token válido, body perfecto).", method: "POST", path: "/posts", status: 201, nearM: ["PUT"], nearP: ["/posts/:id", "/users/:id/posts"], nearS: [200] },
  { text: "Traer el perfil del usuario logueado, con token válido.", method: "GET", path: "/me", status: 200, nearM: ["POST"], nearP: ["/users/:id", "/login"], nearS: [201, 204] },
  { text: "Cambiar SOLO el título del post 42 (existe, es tuyo).", method: "PATCH", path: "/posts/:id", status: 200, nearM: ["PUT", "POST"], nearP: ["/posts", "/users/:id/posts"], nearS: [201, 204] },
  { text: "Publicar un post, pero el body viene vacío.", method: "POST", path: "/posts", status: 400, nearM: ["PUT"], nearP: ["/posts/:id", "/users/:id/posts"], nearS: [409, 404] },
  { text: "Traer el perfil del usuario 9999, que no existe.", method: "GET", path: "/users/:id", status: 404, nearM: ["POST"], nearP: ["/users", "/users/:id/posts"], nearS: [400, 204] },
  { text: "Borrar al usuario 7 sin mandar token.", method: "DELETE", path: "/users/:id", status: 401, nearM: ["PATCH"], nearP: ["/users", "/me"], nearS: [403, 400] },
  // Difíciles
  { hard: true, text: "Un usuario común (token válido) quiere borrar al usuario 3. Eso es solo para admins.", method: "DELETE", path: "/users/:id", status: 403, nearM: ["PATCH"], nearP: ["/users", "/admin/stats"], nearS: [401, 400] },
  { hard: true, text: "Crear un usuario con un mail que ya está registrado.", method: "POST", path: "/users", status: 409, nearM: ["PUT"], nearP: ["/users/:id", "/login"], nearS: [400, 201] },
  { hard: true, text: "Borrar el post 42, pero ya lo habían borrado antes: no existe más.", method: "DELETE", path: "/posts/:id", status: 404, nearM: ["PATCH"], nearP: ["/posts", "/users/:id/posts"], nearS: [204, 400] },
  { hard: true, text: "Un usuario logueado (no admin) pide las estadísticas del panel de admin.", method: "GET", path: "/admin/stats", status: 403, nearM: ["POST"], nearP: ["/me", "/users"], nearS: [401, 404] },
  { hard: true, text: "Un admin borra al usuario 7 (existe).", method: "DELETE", path: "/users/:id", status: 204, nearM: ["PATCH"], nearP: ["/me", "/users"], nearS: [200, 403] },
  { hard: true, text: "Traer el perfil del usuario 7 con un token vencido.", method: "GET", path: "/users/:id", status: 401, nearM: ["POST"], nearP: ["/me", "/login"], nearS: [403, 400] },
  { hard: true, text: "Loguearse, pero el body viene sin el campo password (ni llega a validar la clave).", method: "POST", path: "/login", status: 400, nearM: ["GET"], nearP: ["/me", "/users"], nearS: [401, 403] },
  { hard: true, text: "Reemplazar COMPLETO el post 42 (existe, es tuyo).", method: "PUT", path: "/posts/:id", status: 200, nearM: ["PATCH", "POST"], nearP: ["/posts", "/users/:id/posts"], nearS: [201, 204] },
  { hard: true, text: "Traer los posts del usuario 9999, que no existe.", method: "GET", path: "/users/:id/posts", status: 404, nearM: ["POST"], nearP: ["/users/:id", "/posts"], nearS: [204, 400] },
  { hard: true, text: "Un usuario común quiere cambiarle el rol a otro usuario (token válido).", method: "PATCH", path: "/users/:id", status: 403, nearM: ["PUT"], nearP: ["/users", "/admin/stats"], nearS: [401, 400] },
];

const OK_LINES = [
  "El front te manda un corazón.",
  "Postman está contento.",
  "Swagger lo aprueba sin leer.",
  "Directo a prod, total es viernes.",
  "QA dijo que anda (y esta vez era verdad).",
];
const FAIL_LINES = [
  "El front abrió un ticket EN MAYÚSCULAS.",
  "Capa 8, pero del lado del server.",
  "Lo googleaste y Stack Overflow te retó.",
  "El PM preguntó si 'eso es normal'.",
];

const COUNT = [4, 5, 7, 8];
const NEED = [3, 4, 5, 6];
const HARD = [0, 0, 3, 5];
const OPTS = [3, 4, 5, 5];
const PER_REQ = [13, 11, 10, 9];

// Opciones de una fila: la correcta + hasta `nearCount` parecidas + relleno al azar, mezcladas
function pickOptions(correct, near, all, k, nearCount) {
  const out = [correct];
  for (const n of shuffle(near)) {
    if (out.length >= 1 + nearCount || out.length >= k) break;
    if (!out.includes(n)) out.push(n);
  }
  for (const a of shuffle(all)) {
    if (out.length >= k) break;
    if (!out.includes(a)) out.push(a);
  }
  return shuffle(out);
}

export function buildRound(c, diff) {
  const d = clamp(diff, 1, 4) - 1;
  const k = OPTS[d];
  const tricky = d >= 2;
  return {
    ...c,
    methods: pickOptions(c.method, c.nearM, METHODS, k, [0, 1, 1, 2][d]),
    paths: pickOptions(c.path, c.nearP, PATHS, k, [1, 2, 3, 3][d]),
    // En fácil, los status confundibles ni aparecen; en difícil, aparecen a propósito
    statuses: pickOptions(c.status, tricky ? c.nearS : [], tricky ? STATUSES : STATUSES.filter((s) => !c.nearS.includes(s)), k, [0, 0, 2, 3][d]),
  };
}

export function makeRounds(diff) {
  const d = clamp(diff, 1, 4) - 1;
  const hard = HARD[d];
  const easy = shuffle(CASES.filter((c) => !c.hard)).slice(0, COUNT[d] - hard);
  const hards = shuffle(CASES.filter((c) => c.hard)).slice(0, hard);
  return shuffle([...easy, ...hards]).map((c) => buildRound(c, diff));
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

const ROWS = [
  { key: "method", label: "Método", opts: "methods" },
  { key: "path", label: "Ruta", opts: "paths" },
  { key: "status", label: "Status", opts: "statuses" },
];

export default function Endpoints({ timeMult = 1, diff = 1, onFinish }) {
  const d = clamp(diff, 1, 4) - 1;
  const finishOnce = useFinishOnce(onFinish);
  const later = useLater();
  const rounds = useMemo(() => makeRounds(diff), [diff]);
  const M = rounds.length;
  const need = NEED[d];
  const total = M * PER_REQ[d] * timeMult;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState({});
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [done, setDone] = useState(false);
  const left = useCountdown(total, !done, () => finishOnce(false));

  const r = rounds[idx];
  const canSend = ROWS.every((row) => picked[row.key] !== undefined) && !feedback && !done;

  const choose = (key, value) => {
    if (feedback || done) return;
    setPicked((prev) => ({ ...prev, [key]: prev[key] === value ? undefined : value }));
  };

  const send = () => {
    if (!canSend) return;
    const ok = picked.method === r.method && picked.path === r.path && picked.status === r.status;
    const nCorrect = correct + (ok ? 1 : 0);
    const nWrong = wrong + (ok ? 0 : 1);
    setCorrect(nCorrect);
    setWrong(nWrong);
    setFeedback({ ok, line: ok ? pick(OK_LINES) : pick(FAIL_LINES) });
    later(
      () => {
        if (nCorrect >= need) {
          setDone(true);
          finishOnce(true);
        } else if (nWrong > M - need || idx + 1 >= M) {
          setDone(true);
          finishOnce(false);
        } else {
          setIdx(idx + 1);
          setPicked({});
          setFeedback(null);
        }
      },
      ok ? 900 : 1600
    );
  };

  const chipClass = (key, value) => {
    let cls = ex.epChip;
    if (feedback) {
      if (value === r[key]) cls += ` ${ex.epChipGood}`;
      else if (picked[key] === value) cls += ` ${ex.epChipBad}`;
    } else if (picked[key] === value) cls += ` ${ex.epChipOn}`;
    return cls;
  };

  const hole = <span className={ex.epHole}>___</span>;

  return (
    <div>
      <TimerBar left={left} total={total} label={`Pedidos: ${Math.min(idx + 1, M)}/${M} · Bien: ${correct} (necesitás ${need})`} />
      <p className={styles.mgGoal}>
        <LuServer className={ex.ico} />
        Armá la respuesta: método + ruta + status. Con {need} de {M} bien, pasás.
      </p>

      <div className={ex.epReq} key={idx}>
        <span className={ex.epKicker}>Pedido #{idx + 1} · El front pide:</span>
        <p>{r.text}</p>
      </div>

      <div className={ex.epRows}>
        {ROWS.map((row) => (
          <div key={row.key}>
            <span className={ex.epRowLabel}>{row.label}</span>
            <div className={ex.epChips}>
              {r[row.opts].map((value) => (
                <button
                  type="button"
                  key={value}
                  className={chipClass(row.key, value)}
                  onClick={() => choose(row.key, value)}
                  disabled={!!feedback || done}
                >
                  {value}
                  {row.key === "status" && <small>{STATUS_TEXT[value]}</small>}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={ex.epPreview}>
        <span>{picked.method ?? hole}</span>
        <span>{picked.path ?? hole}</span>
        <span>{"->"}</span>
        <span>{picked.status !== undefined ? `${picked.status} ${STATUS_TEXT[picked.status]}` : hole}</span>
      </div>

      <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${ex.epSend}`} onClick={send} disabled={!canSend}>
        <LuSend /> Enviar respuesta
      </button>

      <p className={`${ex.msg} ${feedback ? (feedback.ok ? ex.msgOk : ex.msgBad) : ""}`}>
        {feedback ? (
          feedback.ok ? (
            <>
              <LuCheck /> {r.status} {STATUS_TEXT[r.status]}. {feedback.line}
            </>
          ) : (
            <>
              <LuX /> Era {r.method} {r.path} {"->"} {r.status} {STATUS_TEXT[r.status]}. {feedback.line}
            </>
          )
        ) : (
          " "
        )}
      </p>
    </div>
  );
}
