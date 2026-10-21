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
  // Combo: Master en JavaScript + Backend Avanzado en un solo pago.
  // El Apps Script comparte las dos carpetas de Drive (clave "incluye" en appscript-cursos.gs).
  "ruta-backend": {
    itemId: "curso-ruta-backend",
    titulo: "Ruta Backend Completa: Master en JavaScript + Backend Avanzado - WEARESRV",
    contentName: "Infoproducto Ruta Backend Completa",
    precio: 149900,
    ruta: "ruta-backend",
  },
};

export function getCurso(key) {
  if (typeof key !== "string" || !Object.prototype.hasOwnProperty.call(CURSOS, key)) return null;
  const curso = CURSOS[key];
  if (curso.preventaHasta && Date.now() < curso.preventaHasta) {
    return { ...curso, precio: curso.precioPreventa };
  }
  return curso;
}
