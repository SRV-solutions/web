// ==========================================
// CATÁLOGO DE CURSOS CON PAGO POR MERCADO PAGO
// El precio SIEMPRE se define acá (servidor), nunca desde el navegador.
// Si cambiás un precio o agregás un curso, actualizá también:
//   - CURSOS en appscript-cursos.gs (misma clave, itemId y precioMinimo)
//   - src/data/cursosGrabados.js (precio que se muestra en la web)
// ==========================================
export const CURSOS = {
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
  return typeof key === "string" && Object.prototype.hasOwnProperty.call(CURSOS, key)
    ? CURSOS[key]
    : null;
}
