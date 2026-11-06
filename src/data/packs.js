// ==========================================
// SUMÁ A TU COMPRA: packs armados por el visitante
// ==========================================
// Desde la página de cualquier curso grabado se pueden sumar otros cursos al mismo pago.
// Una sola regla de precio, la MISMA en netlify/lib/cursos.js (precio que se cobra) y en
// appscript-cursos.gs (mínimo que acepta el webhook):
//
//   la escalera: los cursos se ordenan de mayor a menor precio, el primero va entero, cada uno de los
//   siguientes tiene más descuento (ESCALERA_PACK) y del 5.º en adelante van de regalo. Si un curso vale
//   menos que su descuento, también va de regalo. Se redondea a un número terminado en 900.
//   Sumar un curso nunca baja el total, y cuanto más grande el pack, menos cuesta el curso que se suma.
//
// Unidades que se combinan: cada curso grabado, y "Ruta Backend" como UNA unidad (ya es
// Master en JavaScript + Backend Avanzado con su propio precio). Si alguien elige esos dos
// sueltos, el pack los convierte en la ruta. Dentro de un pack más grande, la escalera se calcula sobre
// los cursos sueltos. Scratch (chicos) solo se mezcla con Scripting y Python.
// La clave del pack es "pack-" + nombres cortos ordenados alfabéticamente, y es lo que viaja
// como external_reference del pago, igual que la clave de un curso.
//
// CAMPAÑA DE REDES: mientras dura la preventa de Redes, Linux y AWS, un pack con Redes NO usa la regla
// de arriba: cuesta el precio de Redes más un monto fijo por cada curso que se suma (SUMA_CON_REDES).
// En esos días Redes solo se suma desde su propia página. Misma tabla en netlify/lib/cursos.js y
// appscript-cursos.gs, y publicada en PROMOCIONES de src/data/legal.js.
//
// EXCEL + SCRIPTING: tienen su propio combo (excel-scripting). Si alguien elige solo esos dos, se cobran como
// el combo, igual que Master en JavaScript + Backend Avanzado con la ruta.
import { CURSOS_GRABADOS, estaEnPreventa } from "./cursosGrabados.js";

// Descuento del 2.º, 3.º y 4.º curso de un pack, de mayor a menor precio. Del 5.º en adelante, de regalo.
export const ESCALERA_PACK = [30000, 50000, 70000];

export const SUMA_CON_REDES = {
  scripting: 0,
  python: 20000,
  "fundamentos-backend": 20000,
  "backend-avanzado": 20000,
  "ruta-backend": 35000,
  "fullstack-csharp": 20000,
  excel: 30000,
  "excel-scripting": 30000, // Scripting no suma nada en la campaña
};

// "Llevate todos": los cursos grabados para adultos. Scratch queda afuera porque es para chicos y solo se
// combina con Scripting y Python. Si se agrega un curso nuevo a la venta, sumarlo acá.
export const CURSOS_TODO = ["scripting", "python", "fundamentos-backend", "backend-avanzado", "fullstack-csharp", "redes", "excel"];
export const enCampaniaRedes = () => estaEnPreventa(CURSOS_GRABADOS.redes);

// Orden en que se muestran las unidades y nombre corto para la clave del pack
export const UNIDADES = [
  { key: "scratch", corto: "scratch", pitch: "Para que tu hijo o hija aprenda jugando mientras vos aprendés en serio." },
  { key: "scripting", corto: "scripting", pitch: "Automatizá planillas, mails y documentos con JavaScript, Python, Apps Script e IA." },
  { key: "python", corto: "python", pitch: "El lenguaje de la IA: lógica, POO, APIs, apps con interfaz gráfica y automatizaciones con IA." },
  { key: "fundamentos-backend", corto: "javascript", pitch: "90 clases para programar en JavaScript con Node.js como un profesional." },
  { key: "backend-avanzado", corto: "backend", pitch: "Servidores y APIs REST con Express, sockets, testing y Docker." },
  { key: "ruta-backend", corto: "ruta", pitch: "Master en JavaScript + Backend Avanzado: la ruta backend completa con Node.js." },
  { key: "fullstack-csharp", corto: "csharp", pitch: "Una app completa con C#, .NET, PostgreSQL y React, de punta a punta." },
  { key: "redes", corto: "redes", pitch: "Redes, Linux y AWS para rendir la certificación AWS Cloud Practitioner." },
  { key: "excel", corto: "excel", pitch: "Excel y Google Sheets de cero a experto, con Power Query, VBA, Apps Script e IA." },
  { key: "excel-scripting", corto: "excelscripting", pitch: "Master en Excel y Sheets con IA + Curso de Scripting con IA." },
];

const SOLO_CON_SCRATCH = ["scripting", "python"];
const porKey = Object.fromEntries(UNIDADES.map((u) => [u.key, u]));
const porCorto = Object.fromEntries(UNIDADES.map((u) => [u.corto, u.key]));
const orden = (key) => UNIDADES.findIndex((u) => u.key === key);

export const esUnidad = (key) => Boolean(porKey[key]);

// Deja el conjunto canónico: sin repetidos, JavaScript + Backend Avanzado => Ruta Backend,
// Excel + Scripting => su combo, en orden
export function normalizarSet(keys) {
  let set = [...new Set((keys || []).filter(esUnidad))];
  if (set.includes("ruta-backend") || (set.includes("fundamentos-backend") && set.includes("backend-avanzado"))) {
    set = set.filter((k) => k !== "fundamentos-backend" && k !== "backend-avanzado");
    if (!set.includes("ruta-backend")) set.push("ruta-backend");
  }
  if (set.includes("excel-scripting") || (set.includes("excel") && set.includes("scripting"))) {
    set = set.filter((k) => k !== "excel" && k !== "scripting");
    if (!set.includes("excel-scripting")) set.push("excel-scripting");
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
  if (set.includes("redes") && enCampaniaRedes()) {
    return set.reduce((t, k) => t + (k === "redes" ? CURSOS_GRABADOS.redes.precio : SUMA_CON_REDES[k]), 0);
  }
  const [maximo, ...resto] = cursosDeSet(set).map((c) => c.precio).sort((a, b) => b - a);
  const total = resto.reduce((t, p, i) => t + (i < ESCALERA_PACK.length ? Math.max(p - ESCALERA_PACK[i], 0) : 0), maximo);
  return Math.max(maximo, redondear900(total));
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
  const precioSeparado = cursos.reduce((t, c) => t + c.precio, 0); // cada curso comprado por su cuenta, a su precio de hoy
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

// El pack más grande y dónde se arma: en la página de Redes vale en cualquier fecha, y durante su campaña
// es la única que puede sumar Redes
export const packTodo = () => infoPack(CURSOS_TODO);
export const linkPackTodo = () =>
  `/redes/inscripcion?sumar=${CURSOS_TODO.filter((k) => k !== "redes").map((k) => porKey[k].corto).join(",")}`;

// Unidades que se pueden sumar desde la página de un curso (en orden de muestra)
export function agregablesPara(baseKey) {
  if (!esUnidad(baseKey)) return [];
  return UNIDADES.map((u) => u.key).filter((k) => {
    if (k === baseKey) return false;
    // El combo no se ofrece como tarjeta: se elige con el selector de Excel o tildando Excel y Scripting
    if (k === "excel-scripting") return false;
    if (baseKey === "excel-scripting" && (k === "excel" || k === "scripting")) return false;
    if (baseKey === "scratch") return SOLO_CON_SCRATCH.includes(k);
    if (k === "scratch") return SOLO_CON_SCRATCH.includes(baseKey);
    // Durante la campaña, Redes con sus precios especiales se arma solo desde la página de Redes
    if (k === "redes") return !enCampaniaRedes();
    if (baseKey === "ruta-backend") return k !== "fundamentos-backend" && k !== "backend-avanzado";
    if (baseKey === "fundamentos-backend" || baseKey === "backend-avanzado") return k !== "ruta-backend";
    return true;
  });
}

export const pitchUnidad = (key) => (porKey[key] ? porKey[key].pitch : "");

// Para la página de gracias: los cursos que incluye un pack comprado (null si la clave no es un pack)
export function cursosDePack(clave) {
  if (CURSOS_GRABADOS[clave]?.combo) return cursosDeSet([clave]); // combos fijos: Ruta Backend, Excel + Scripting
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
