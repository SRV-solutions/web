// ==========================================
// CATÁLOGO DE CURSOS CON PAGO POR MERCADO PAGO
// El precio SIEMPRE se define acá (servidor), nunca desde el navegador.
// Si cambiás un precio o agregás un curso, actualizá también:
//   - CURSOS en appscript-cursos.gs (misma clave, itemId y precioMinimo)
//   - src/data/cursosGrabados.js (precio que se muestra en la web)
// ==========================================
// Preventa de Scratch: antes de esta fecha se cobra precioPreventa; desde ese día, precio.
// Misma fecha que en src/data/cursosGrabados.js y en appscript-cursos.gs. La carpeta de Drive se
// comparte al instante (vacía) y las clases se suben ese día.
const SCRATCH_PREVENTA_HASTA = Date.parse("2026-11-18T00:00:00-03:00");

// Preventa de Redes, Linux y AWS: igual que Scratch, hasta el 27/01/2027 (ese día se habilitan las clases).
// Misma fecha que en src/data/cursosGrabados.js y en appscript-cursos.gs.
const REDES_PREVENTA_HASTA = Date.parse("2027-01-27T00:00:00-03:00");

// CYBER SRV: del 2 al 4 de noviembre de 2026 todo al 50% de su precio de lista (el Intensivo Full
// Stack en vivo no participa). Mismas fechas en src/data/cursosGrabados.js (precio que se muestra),
// appscript-cursos.gs (mínimo que acepta el webhook) y PROMOCIONES en src/data/legal.js.
const CYBER_DESDE = Date.parse("2026-11-02T00:00:00-03:00");
const CYBER_HASTA = Date.parse("2026-11-05T00:00:00-03:00"); // termina el 4/11 a las 23:59
const enCyber = () => {
  const ahora = Date.now();
  return ahora >= CYBER_DESDE && ahora < CYBER_HASTA;
};

export const CURSOS = {
  scratch: {
    itemId: "curso-scratch-chicos",
    titulo: "Scratch para Chicos Desde Cero - WEARESRV",
    contentName: "Infoproducto Scratch",
    precio: 18000,
    precioPreventa: 10000,
    preventaHasta: SCRATCH_PREVENTA_HASTA,
    ruta: "scratch",
  },
  scripting: {
    itemId: "curso-scripting",
    titulo: "Curso de Scripting Desde Cero - WEARESRV",
    contentName: "Infoproducto Scripting",
    precio: 15000,
    ruta: "scripting",
  },
  python: {
    itemId: "curso-python-infoproducto",
    titulo: "Master en Python Desde Cero - WEARESRV",
    contentName: "Infoproducto Python Completo",
    precio: 80000,
    ruta: "python",
  },
  // Ex "Backend Fundamentos". Clave e itemId no se tocan: el Apps Script identifica el curso
  // por el external_reference "fundamentos-backend:..." del pago.
  "fundamentos-backend": {
    itemId: "curso-fundamentos-backend",
    titulo: "Master en JavaScript Desde Cero - WEARESRV",
    contentName: "Infoproducto Master en JavaScript",
    precio: 84900,
    ruta: "javascript", // página de gracias: /javascript/gracias
    // La compra vive en la página única de la ruta backend, con este curso preseleccionado
    urlInscripcion: "/ruta-backend/inscripcion?elegir=fundamentos-backend",
  },
  "backend-avanzado": {
    itemId: "curso-backend-avanzado",
    titulo: "Backend Avanzado - WEARESRV",
    contentName: "Infoproducto Backend Avanzado",
    precio: 99900,
    ruta: "backend-avanzado", // página de gracias: /backend-avanzado/gracias
    urlInscripcion: "/ruta-backend/inscripcion?elegir=backend-avanzado",
  },
  // Curso Fullstack con C# (.NET + PostgreSQL + React). Tiene código de alumnos: con el código
  // correcto se cobra cuponAlumnos.precio. El código no está acá: en Netlify vive solo su hash
  // SHA-256 en la variable "envHash" (ver netlify/lib/cupones.js y scripts/cupon-hash.mjs).
  // El Apps Script acepta ese monto porque crear-preferencia marca metadata.cupon = "alumnos".
  "fullstack-csharp": {
    itemId: "curso-fullstack-csharp",
    titulo: "Curso Fullstack con C#, .NET, PostgreSQL y React - WEARESRV",
    contentName: "Infoproducto Fullstack C#",
    precio: 87900,
    cuponAlumnos: { precio: 20000, envHash: "CUPON_ALUMNOS_FULLSTACK_SHA256" },
    ruta: "fullstack-csharp",
  },
  // Curso grabado en preventa. En sus packs vale la tabla de la campaña (SUMA_CON_REDES, más abajo).
  redes: {
    itemId: "curso-redes-linux-aws",
    titulo: "Redes, Linux y AWS - WEARESRV",
    contentName: "Infoproducto Redes Linux AWS",
    precio: 89900,
    precioPreventa: 62900,
    preventaHasta: REDES_PREVENTA_HASTA,
    ruta: "redes",
  },
  // Combo: Master en JavaScript + Backend Avanzado en un solo pago.
  // El Apps Script comparte las dos carpetas de Drive (clave "incluye" en appscript-cursos.gs).
  "ruta-backend": {
    itemId: "curso-ruta-backend",
    titulo: "Ruta Backend Completa: Master en JavaScript + Backend Avanzado - WEARESRV",
    contentName: "Infoproducto Ruta Backend Completa",
    precio: 149900,
    // Los dos cursos que entrega: así un pago de la ruta (o de un pack que la incluye) se confirma
    // también en la página de gracias de cada curso suelto
    incluye: ["fundamentos-backend", "backend-avanzado"],
    ruta: "ruta-backend",
  },

  // SUMÁ A TU COMPRA: combos de dos o tres cursos que se ofrecen dentro de la página de cada curso
  // que incluyen (src/data/cursosGrabados.js > SUMAS, mismas claves, itemId y precios) y se pagan
  // como un solo producto. "incluye" usa claves vendibles (puede incluir "ruta-backend", que ya es
  // un combo). "ruta" es la página de gracias por defecto; crear-preferencia usa la del curso desde
  // cuya página se compró ("desde"). El Apps Script comparte todas las carpetas (clave "incluye").
  "scripting-python": {
    itemId: "combo-scripting-python",
    titulo: "Combo Curso de Scripting + Master en Python - WEARESRV",
    contentName: "Combo Scripting + Python",
    precio: 69900,
    incluye: ["scripting", "python"],
    ruta: "scripting",
  },
  "scratch-scripting": {
    itemId: "combo-scratch-scripting",
    titulo: "Combo Scratch para Chicos + Curso de Scripting - WEARESRV",
    contentName: "Combo Scratch + Scripting",
    precio: 24900,
    precioPreventa: 17900,
    preventaHasta: SCRATCH_PREVENTA_HASTA,
    incluye: ["scratch", "scripting"],
    ruta: "scratch",
  },
  "scripting-javascript": {
    itemId: "combo-scripting-javascript",
    titulo: "Combo Curso de Scripting + Master en JavaScript - WEARESRV",
    contentName: "Combo Scripting + Master en JavaScript",
    precio: 89900,
    incluye: ["scripting", "fundamentos-backend"],
    ruta: "scripting",
  },
  "scripting-ruta-backend": {
    itemId: "combo-scripting-ruta-backend",
    titulo: "Combo Curso de Scripting + Ruta Backend Completa - WEARESRV",
    contentName: "Combo Scripting + Ruta Backend Completa",
    precio: 154900,
    incluye: ["scripting", "ruta-backend"],
    ruta: "scripting",
  },
  "python-javascript": {
    itemId: "combo-python-javascript",
    titulo: "Combo Master en Python + Master en JavaScript - WEARESRV",
    contentName: "Combo Python + Master en JavaScript",
    precio: 139900,
    incluye: ["python", "fundamentos-backend"],
    ruta: "python",
  },
  "python-ruta-backend": {
    itemId: "combo-python-ruta-backend",
    titulo: "Combo Master en Python + Ruta Backend Completa - WEARESRV",
    contentName: "Combo Python + Ruta Backend Completa",
    precio: 199900,
    incluye: ["python", "ruta-backend"],
    ruta: "python",
  },
  // Pack Completo: Scripting + Python + Ruta Backend (4 cursos) en un solo pago.
  // En la web reemplaza a "python-ruta-backend", que se conserva acá por si quedó un pago en curso.
  "pack-completo": {
    itemId: "combo-pack-completo",
    titulo: "Pack Completo: Scripting + Master en Python + Ruta Backend - WEARESRV",
    contentName: "Pack Completo: Scripting + Python + Ruta Backend",
    precio: 199900,
    incluye: ["scripting", "python", "ruta-backend"],
    ruta: "python",
  },
  // Combos con Fullstack C# (mismas claves y precios que src/data/cursosGrabados.js > SUMAS)
  "scripting-csharp": {
    itemId: "combo-scripting-csharp",
    titulo: "Combo Curso de Scripting + Curso Fullstack con C# - WEARESRV",
    contentName: "Combo Scripting + Fullstack C#",
    precio: 92900,
    incluye: ["scripting", "fullstack-csharp"],
    ruta: "scripting",
  },
  "python-csharp": {
    itemId: "combo-python-csharp",
    titulo: "Combo Master en Python + Curso Fullstack con C# - WEARESRV",
    contentName: "Combo Python + Fullstack C#",
    precio: 139900,
    incluye: ["python", "fullstack-csharp"],
    ruta: "python",
  },
  "javascript-csharp": {
    itemId: "combo-javascript-csharp",
    titulo: "Combo Master en JavaScript + Curso Fullstack con C# - WEARESRV",
    contentName: "Combo Master en JavaScript + Fullstack C#",
    precio: 144900,
    incluye: ["fundamentos-backend", "fullstack-csharp"],
    ruta: "javascript",
  },
  "backend-avanzado-csharp": {
    itemId: "combo-backend-avanzado-csharp",
    titulo: "Combo Backend Avanzado + Curso Fullstack con C# - WEARESRV",
    contentName: "Combo Backend Avanzado + Fullstack C#",
    precio: 159900,
    incluye: ["backend-avanzado", "fullstack-csharp"],
    ruta: "backend-avanzado",
  },
  "ruta-backend-csharp": {
    itemId: "combo-ruta-backend-csharp",
    titulo: "Combo Ruta Backend Completa + Curso Fullstack con C# - WEARESRV",
    contentName: "Combo Ruta Backend + Fullstack C#",
    precio: 199900,
    incluye: ["ruta-backend", "fullstack-csharp"],
    ruta: "ruta-backend",
  },
};

// Clave del producto que figura en el external_reference ("clave:uuid") de un pago
export function claveDeReferencia(ref) {
  const texto = String(ref || "");
  const separador = texto.indexOf(":");
  return separador > 0 ? texto.slice(0, separador) : "";
}

// ¿El producto pagado corresponde a la página de gracias de este curso?
// Sí si es el mismo curso o una suma que lo incluye (un pago de "scripting-python" se confirma
// en /scripting/gracias o en /python/gracias).
export function pagoCorrespondeA(pagadoKey, cursoKey) {
  if (!pagadoKey || !cursoKey) return false;
  return cursosQueEntrega(pagadoKey).includes(cursoKey);
}

// URL del webhook de cursos (un solo Apps Script para todos) con la clave secreta compartida.
// La usan crear-preferencia (notification_url de MP) y confirmar-compra (respaldo desde la página de gracias).
export function webhookCursosUrl() {
  const baseUrl = process.env.MP_WEBHOOK_URL;
  const secret = process.env.MP_WEBHOOK_SECRET;
  if (!baseUrl || !secret) {
    // Sin esto nadie recibe el acceso al curso: que quede bien visible en los logs de Netlify
    console.error("Cursos: faltan MP_WEBHOOK_URL o MP_WEBHOOK_SECRET en Netlify; el Apps Script no se entera de los pagos");
    return undefined;
  }

  const url = new URL(baseUrl);
  url.searchParams.set("key", secret);
  url.searchParams.set("source_news", "webhooks");
  return url.toString();
}

export function getCurso(key) {
  if (typeof key !== "string") return null;
  if (key.startsWith("pack-")) return productoPack(key);
  if (!Object.prototype.hasOwnProperty.call(CURSOS, key)) return null;
  const curso = CURSOS[key];
  let precio = curso.precio;
  if (curso.preventaHasta && Date.now() < curso.preventaHasta) precio = curso.precioPreventa;
  // Durante el Cyber vale la mitad del precio de lista; si hay preventa, el menor de los dos
  if (enCyber()) precio = Math.min(precio, Math.round(curso.precio / 2));
  return precio === curso.precio ? curso : { ...curso, precio };
}

// ==========================================
// PACKS "SUMÁ A TU COMPRA": varios cursos en un pago, armados por el visitante.
// La MISMA regla que src/data/packs.js (lo que se muestra) y appscript-cursos.gs (mínimo aceptado):
//   precio = suma de precios − AHORRO_POR_CURSO × (cursos − 1), nunca menos que el curso más caro,
//   redondeado a un número terminado en 900.
// Clave: "pack-" + nombres cortos ordenados alfabéticamente (ej. "pack-csharp-python").
// ==========================================
export const AHORRO_POR_CURSO = 30000;

// Unidades combinables: cursos grabados y la Ruta Backend como una sola unidad
const UNIDADES_PACK = [
  { key: "scratch", corto: "scratch" },
  { key: "scripting", corto: "scripting" },
  { key: "python", corto: "python" },
  { key: "fundamentos-backend", corto: "javascript" },
  { key: "backend-avanzado", corto: "backend" },
  { key: "ruta-backend", corto: "ruta" },
  { key: "fullstack-csharp", corto: "csharp" },
  { key: "redes", corto: "redes" },
];
const SOLO_CON_SCRATCH = ["scripting", "python"];

// CAMPAÑA DE REDES: mientras dura la preventa de Redes, un pack con Redes cuesta el precio de Redes más
// estos montos fijos por cada curso que se suma (misma tabla que src/data/packs.js y appscript-cursos.gs)
const SUMA_CON_REDES = {
  scripting: 0,
  python: 20000,
  "fundamentos-backend": 20000,
  "backend-avanzado": 20000,
  "ruta-backend": 35000,
  "fullstack-csharp": 20000,
};
const enCampaniaRedes = () => Date.now() < REDES_PREVENTA_HASTA;
const unidadPorKey = Object.fromEntries(UNIDADES_PACK.map((u) => [u.key, u]));
const keyPorCorto = Object.fromEntries(UNIDADES_PACK.map((u) => [u.corto, u.key]));
const ordenUnidad = (key) => UNIDADES_PACK.findIndex((u) => u.key === key);

export function normalizarSet(keys) {
  let set = [...new Set((keys || []).filter((k) => unidadPorKey[k]))];
  if (set.includes("ruta-backend") || (set.includes("fundamentos-backend") && set.includes("backend-avanzado"))) {
    set = set.filter((k) => k !== "fundamentos-backend" && k !== "backend-avanzado");
    if (!set.includes("ruta-backend")) set.push("ruta-backend");
  }
  return set.sort((a, b) => ordenUnidad(a) - ordenUnidad(b));
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
    .map((k) => unidadPorKey[k].corto)
    .sort()
    .join("-");

export function unidadesDeClave(clave) {
  if (typeof clave !== "string" || !clave.startsWith("pack-")) return null;
  const keys = clave.slice(5).split("-").map((c) => keyPorCorto[c]);
  if (keys.some((k) => !k)) return null;
  const set = normalizarSet(keys);
  return setValido(set) && claveDePack(set) === clave ? set : null;
}

const redondear900 = (n) => Math.floor((n - 900) / 1000) * 1000 + 900;

export function precioPack(keys) {
  const set = normalizarSet(keys);
  if (set.includes("redes") && enCampaniaRedes()) {
    return set.reduce((t, k) => t + (k === "redes" ? getCurso("redes").precio : SUMA_CON_REDES[k]), 0);
  }
  const precios = set.map((k) => getCurso(k).precio);
  const suma = precios.reduce((t, p) => t + p, 0);
  const maximo = Math.max(...precios);
  const conDescuento = suma - AHORRO_POR_CURSO * (set.length - 1);
  if (conDescuento <= maximo) return maximo;
  return Math.max(maximo, redondear900(conDescuento));
}

// Producto que se cobra por un pack: mismo formato que una entrada de CURSOS
export function productoPack(clave) {
  const set = unidadesDeClave(clave);
  if (!set) return null;
  const nombres = set.map((k) => CURSOS[k].contentName.replace(/^Infoproducto /, ""));
  return {
    itemId: clave,
    titulo: `Pack ${nombres.join(" + ")} - WEARESRV`,
    contentName: `Pack: ${nombres.join(" + ")}`,
    precio: precioPack(set),
    incluye: set,
    ruta: CURSOS[set[0]].ruta,
    pack: true,
  };
}

// Claves de todo lo que entrega un producto: él mismo, sus unidades y los cursos de cada combo
// (un pack con "ruta-backend" también entrega "fundamentos-backend" y "backend-avanzado").
export function cursosQueEntrega(key) {
  const producto = getCurso(key);
  if (!producto) return [];
  const salida = [key];
  for (const k of producto.incluye || []) {
    for (const sub of cursosQueEntrega(k)) if (!salida.includes(sub)) salida.push(sub);
  }
  return salida;
}
