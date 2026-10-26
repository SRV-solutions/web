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
  // Combo: Master en JavaScript + Backend Avanzado en un solo pago.
  // El Apps Script comparte las dos carpetas de Drive (clave "incluye" en appscript-cursos.gs).
  "ruta-backend": {
    itemId: "curso-ruta-backend",
    titulo: "Ruta Backend Completa: Master en JavaScript + Backend Avanzado - WEARESRV",
    contentName: "Infoproducto Ruta Backend Completa",
    precio: 149900,
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
  if (pagadoKey === cursoKey) return true;
  const pagado = Object.prototype.hasOwnProperty.call(CURSOS, pagadoKey) ? CURSOS[pagadoKey] : null;
  return Boolean(pagado && Array.isArray(pagado.incluye) && pagado.incluye.includes(cursoKey));
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
  if (typeof key !== "string" || !Object.prototype.hasOwnProperty.call(CURSOS, key)) return null;
  const curso = CURSOS[key];
  if (curso.preventaHasta && Date.now() < curso.preventaHasta) {
    return { ...curso, precio: curso.precioPreventa };
  }
  return curso;
}
