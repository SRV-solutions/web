// ==========================================
// SUMÁ A TU COMPRA: packs armados por el visitante
// ==========================================
// Desde la página de cualquier curso grabado se pueden sumar otros cursos al mismo pago.
// Una sola regla de precio, la MISMA en netlify/lib/cursos.js (precio que se cobra) y en
// appscript-cursos.gs (mínimo que acepta el webhook):
//
//   precio del pack = suma de los precios − AHORRO_POR_CURSO × (cantidad de cursos − 1)
//   y nunca menos que el curso más caro del pack (si un curso vale menos que el descuento,
//   va de regalo). Se redondea a un número terminado en 900.
//
// Unidades que se combinan: cada curso grabado, y "Ruta Backend" como UNA unidad (ya es
// Master en JavaScript + Backend Avanzado con su propio precio). Si alguien elige esos dos
// sueltos, el pack los convierte en la ruta. Scratch (chicos) solo se mezcla con Scripting y Python.
// La clave del pack es "pack-" + nombres cortos ordenados alfabéticamente, y es lo que viaja
// como external_reference del pago, igual que la clave de un curso.
import { CURSOS_GRABADOS } from "./cursosGrabados.js";

export const AHORRO_POR_CURSO = 30000;

// Orden en que se muestran las unidades y nombre corto para la clave del pack
export const UNIDADES = [
  { key: "scratch", corto: "scratch", pitch: "Para que tu hijo o hija aprenda jugando mientras vos aprendés en serio." },
  { key: "scripting", corto: "scripting", pitch: "Automatizá planillas, mails y documentos con JavaScript, Python y Apps Script." },
  { key: "python", corto: "python", pitch: "El lenguaje más pedido del mundo: lógica, POO, APIs y apps con interfaz gráfica." },
  { key: "fundamentos-backend", corto: "javascript", pitch: "90 clases para programar en JavaScript con Node.js como un profesional." },
  { key: "backend-avanzado", corto: "backend", pitch: "Servidores y APIs REST con Express, sockets, testing y Docker." },
  { key: "ruta-backend", corto: "ruta", pitch: "Master en JavaScript + Backend Avanzado: la ruta backend completa con Node.js." },
  { key: "fullstack-csharp", corto: "csharp", pitch: "Una app completa con C#, .NET, PostgreSQL y React, de punta a punta." },
];

const SOLO_CON_SCRATCH = ["scripting", "python"];
const porKey = Object.fromEntries(UNIDADES.map((u) => [u.key, u]));
const porCorto = Object.fromEntries(UNIDADES.map((u) => [u.corto, u.key]));
const orden = (key) => UNIDADES.findIndex((u) => u.key === key);

export const esUnidad = (key) => Boolean(porKey[key]);

// Deja el conjunto canónico: sin repetidos, JavaScript + Backend Avanzado => Ruta Backend, en orden
export function normalizarSet(keys) {
  let set = [...new Set((keys || []).filter(esUnidad))];
  if (set.includes("ruta-backend") || (set.includes("fundamentos-backend") && set.includes("backend-avanzado"))) {
    set = set.filter((k) => k !== "fundamentos-backend" && k !== "backend-avanzado");
    if (!set.includes("ruta-backend")) set.push("ruta-backend");
  }
  return set.sort((a, b) => orden(a) - orden(b));
}

export function setValido(keys) {
  const set = normalizarSet(keys);
  if (set.length < 2) return false;
  if (set.includes("scratch") && set.some((k) => k !== "scratch" && !SOLO_CON_SCRATCH.includes(k))) return false;
  return true;
}

export const claveDePack = (keys) =>
  "pack-" +
  normalizarSet(keys)
    .map((k) => porKey[k].corto)
    .sort()
    .join("-");

export function unidadesDeClave(clave) {
  if (typeof clave !== "string" || !clave.startsWith("pack-")) return null;
  const keys = clave.slice(5).split("-").map((c) => porCorto[c]);
  if (keys.some((k) => !k)) return null;
  const set = normalizarSet(keys);
  return setValido(set) && claveDePack(set) === clave ? set : null;
}

const redondear900 = (n) => Math.floor((n - 900) / 1000) * 1000 + 900;

export function precioPack(keys) {
  const set = normalizarSet(keys);
  const precios = set.map((k) => CURSOS_GRABADOS[k].precio);
  const suma = precios.reduce((t, p) => t + p, 0);
  const maximo = Math.max(...precios);
  const conDescuento = suma - AHORRO_POR_CURSO * (set.length - 1);
  if (conDescuento <= maximo) return maximo;
  return Math.max(maximo, redondear900(conDescuento));
}

// Cursos sueltos que entrega un conjunto (abre la Ruta Backend en sus dos cursos)
export const cursosDeSet = (keys) =>
  normalizarSet(keys)
    .flatMap((k) => (CURSOS_GRABADOS[k].combo ? CURSOS_GRABADOS[k].combo : [k]))
    .map((k) => CURSOS_GRABADOS[k]);

export const nombreUnidad = (key) => {
  const c = CURSOS_GRABADOS[key];
  return [c.tituloInicio, c.tituloDestacado, c.combo ? c.tituloFin : null].filter(Boolean).join(" ");
};

// Todo lo que la página necesita mostrar y cobrar de un pack
export function infoPack(keys) {
  const set = normalizarSet(keys);
  if (!setValido(set)) return null;
  const cursos = cursosDeSet(set);
  const precioSeparado = set.reduce((t, k) => t + CURSOS_GRABADOS[k].precio, 0);
  const precio = precioPack(set);
  const key = claveDePack(set);
  return {
    key,
    itemId: key,
    contentName: `Pack: ${set.map(nombreUnidad).join(" + ")}`,
    nombre: set.map(nombreUnidad).join(" + "),
    unidades: set,
    cursos,
    cantidadCursos: cursos.length,
    clases: cursos.reduce((t, c) => t + c.clases, 0),
    precio,
    precioSeparado,
    ahorro: precioSeparado - precio,
  };
}

// Unidades que se pueden sumar desde la página de un curso (en orden de muestra)
export function agregablesPara(baseKey) {
  if (!esUnidad(baseKey)) return [];
  return UNIDADES.map((u) => u.key).filter((k) => {
    if (k === baseKey) return false;
    if (baseKey === "scratch") return SOLO_CON_SCRATCH.includes(k);
    if (k === "scratch") return SOLO_CON_SCRATCH.includes(baseKey);
    if (baseKey === "ruta-backend") return k !== "fundamentos-backend" && k !== "backend-avanzado";
    if (baseKey === "fundamentos-backend" || baseKey === "backend-avanzado") return k !== "ruta-backend";
    return true;
  });
}

export const pitchUnidad = (key) => (porKey[key] ? porKey[key].pitch : "");

// Para la página de gracias: los cursos que incluye un pack comprado (null si la clave no es un pack)
export function cursosDePack(clave) {
  const set = unidadesDeClave(clave);
  return set ? cursosDeSet(set) : null;
}

// Lee ?sumar=python,csharp (nombres cortos o claves) y devuelve las unidades válidas
export function unidadesDeParametro(texto) {
  if (!texto) return [];
  return texto
    .split(",")
    .map((t) => t.trim())
    .map((t) => porCorto[t] || (esUnidad(t) ? t : null))
    .filter(Boolean);
}
