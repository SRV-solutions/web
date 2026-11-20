// ==========================================
// PROMO CON FECHA para los cursos grabados, desde la variable de entorno PROMO de Netlify.
// La leen: la web (vite.config.js la inyecta al publicar), la función que cobra (netlify/lib/cursos.js)
// y crear-preferencia, que marca el pago para que el Apps Script acepte el precio con descuento.
//
// Formato:  nombre;desde;hasta;porcentaje[;cursos]
//   PROMO=Black Friday SRV;2026-11-27;2026-12-03;30
//   PROMO=Semana de Python;2026-12-07;2026-12-13;25;python,scripting
//
// - desde y hasta son días de Argentina: empieza a las 00:00 del primero y termina a las 23:59 del último.
// - porcentaje: de 5 a 50 (el Apps Script no acepta más del 50 %).
// - cursos (opcional): separados por coma; sin esto, todos los cursos grabados. Valen scratch, scripting,
//   python, javascript, backend, csharp, redes, excel, sql, ruta y excel-scripting. El intensivo en vivo nunca entra.
// - Si la variable está mal escrita, la publicación falla (vite.config.js) y sigue en línea la versión anterior.
// - Para sacarla: borrar la variable (o dejarla vacía) y volver a publicar. Fuera de sus fechas no hace nada.
// ==========================================

export const PORCENTAJE_MINIMO = 5;
export const PORCENTAJE_MAXIMO = 50;

// Nombre que se puede escribir en la variable -> clave interna del curso
const ALIAS = {
  scratch: "scratch",
  scripting: "scripting",
  python: "python",
  javascript: "fundamentos-backend",
  "fundamentos-backend": "fundamentos-backend",
  backend: "backend-avanzado",
  "backend-avanzado": "backend-avanzado",
  csharp: "fullstack-csharp",
  "fullstack-csharp": "fullstack-csharp",
  redes: "redes",
  excel: "excel",
  sql: "sql",
  ruta: "ruta-backend",
  "ruta-backend": "ruta-backend",
  "excel-scripting": "excel-scripting",
};

// Cursos que forman cada combo: el combo entra si entran todos sus cursos (o si se nombra el combo)
const PARTES_COMBO = {
  "ruta-backend": ["fundamentos-backend", "backend-avanzado"],
  "excel-scripting": ["excel", "scripting"],
};

const DIA = /^(\d{4})-(\d{2})-(\d{2})$/;

// "2026-11-27" -> instante de las 00:00 de ese día en Argentina (UTC-3, sin horario de verano)
function inicioDelDia(texto, campo) {
  const m = DIA.exec(texto);
  if (!m) throw new Error(`PROMO: la fecha de ${campo} tiene que ser AAAA-MM-DD y dice "${texto}"`);
  const t = Date.parse(`${texto}T00:00:00-03:00`);
  const d = new Date(t - 3 * 3600 * 1000);
  if (Number.isNaN(t) || d.getUTCDate() !== Number(m[3]) || d.getUTCMonth() + 1 !== Number(m[2])) {
    throw new Error(`PROMO: la fecha de ${campo} no existe: "${texto}"`);
  }
  return t;
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const diaTexto = (texto) => {
  const [, , mes, dia] = DIA.exec(texto);
  return `${Number(dia)} de ${MESES[Number(mes) - 1]}`;
};

// Lee la variable. Devuelve null si está vacía; si está mal escrita, tira un error que explica qué falta.
export function leerPromo(texto) {
  if (typeof texto !== "string" || !texto.trim()) return null;
  const partes = texto.split(";").map((p) => p.trim());
  if (partes.length < 4 || partes.length > 5) {
    throw new Error(`PROMO: tiene que ser "nombre;desde;hasta;porcentaje" (y opcional ";cursos"), y dice "${texto}"`);
  }
  const [nombre, desdeTexto, hastaTexto, porcentajeTexto, cursosTexto] = partes;
  if (!nombre || nombre.length > 40) throw new Error("PROMO: falta el nombre o tiene más de 40 letras");
  const desde = inicioDelDia(desdeTexto, "inicio");
  const hasta = inicioDelDia(hastaTexto, "fin") + 24 * 3600 * 1000; // hasta las 23:59 del último día
  if (hasta <= desde) throw new Error("PROMO: la fecha de fin es anterior a la de inicio");
  if (hasta - desde > 31 * 24 * 3600 * 1000) throw new Error("PROMO: dura más de un mes; una promo con fecha tiene que ser corta");
  const porcentaje = Number(porcentajeTexto);
  if (!Number.isInteger(porcentaje) || porcentaje < PORCENTAJE_MINIMO || porcentaje > PORCENTAJE_MAXIMO) {
    throw new Error(`PROMO: el porcentaje tiene que ser un número entero de ${PORCENTAJE_MINIMO} a ${PORCENTAJE_MAXIMO}, y dice "${porcentajeTexto}"`);
  }
  let cursos = null;
  if (cursosTexto) {
    cursos = cursosTexto.split(",").map((c) => c.trim().toLowerCase()).filter(Boolean).map((c) => {
      if (!ALIAS[c]) throw new Error(`PROMO: no conozco el curso "${c}" (valen: ${Object.keys(ALIAS).join(", ")})`);
      return ALIAS[c];
    });
    if (!cursos.length) cursos = null;
  }
  const mismoMes = desdeTexto.slice(0, 7) === hastaTexto.slice(0, 7);
  const fechasTexto = mismoMes
    ? `del ${Number(desdeTexto.slice(8))} al ${diaTexto(hastaTexto)}`
    : `del ${diaTexto(desdeTexto)} al ${diaTexto(hastaTexto)}`;
  return {
    nombre,
    desde,
    hasta,
    porcentaje,
    cursos,
    fechasTexto, // "del 27 de noviembre al 3 de diciembre"
    desdeCorto: `${desdeTexto.slice(8)}/${desdeTexto.slice(5, 7)}/${desdeTexto.slice(0, 4)}`,
    hastaCorto: `${hastaTexto.slice(8)}/${hastaTexto.slice(5, 7)}/${hastaTexto.slice(0, 4)}`,
  };
}

// La promo si hoy está dentro de sus fechas; si no (o si no hay), null. Nunca tira error: en el servidor,
// una variable mal escrita no puede frenar los cobros (la publicación ya la habría rechazado).
export function promoVigente(texto, ahora = Date.now()) {
  let promo;
  try {
    promo = leerPromo(texto);
  } catch {
    return null;
  }
  return promo && ahora >= promo.desde && ahora < promo.hasta ? promo : null;
}

// ¿La promo alcanza a este curso o combo?
export function promoAplicaA(promo, key) {
  if (!promo) return false;
  if (!promo.cursos) return true;
  if (promo.cursos.includes(key)) return true;
  const partes = PARTES_COMBO[key];
  return Boolean(partes) && partes.every((k) => promo.cursos.includes(k));
}

// Precio con el descuento, redondeado hacia abajo a una centena (el Apps Script usa la misma cuenta)
export const precioConPromo = (precioLista, porcentaje) => Math.floor((precioLista * (100 - porcentaje)) / 10000) * 100;
