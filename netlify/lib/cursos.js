// ==========================================
// CATÁLOGO DE CURSOS CON PAGO POR MERCADO PAGO
// El precio SIEMPRE se define acá (servidor), nunca desde el navegador.
// Si cambiás un precio o agregás un curso, actualizá también:
//   - CURSOS en appscript-cursos.gs (misma clave, itemId y precioMinimo)
//   - src/data/cursosGrabados.js (precio que se muestra en la web)
// ==========================================
// Preventa de Scratch: antes de esta fecha se cobra precioPreventa; desde ese día, precio.
// Misma fecha que en src/data/cursosGrabados.js. El acceso se envía recién ese día.
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
  "fundamentos-backend": {
    itemId: "curso-fundamentos-backend",
    titulo: "Backend Fundamentos - WEARESRV",
    contentName: "Infoproducto Backend Fundamentos",
    precio: 84900,
    ruta: "fundamentos-backend",
  },
  "backend-avanzado": {
    itemId: "curso-backend-avanzado",
    titulo: "Backend Avanzado - WEARESRV",
    contentName: "Infoproducto Backend Avanzado",
    precio: 99900,
    ruta: "backend-avanzado",
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
