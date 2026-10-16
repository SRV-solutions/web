// ==========================================
// INTENSIVOS DE VERANO 2027 (Frontend / Backend / Pack Fullstack)
// El precio y las cuotas SIEMPRE se definen acá (servidor), nunca desde el navegador.
// Si cambiás un precio o agregás un plan, actualizá también:
//   - PLANES en el Apps Script del Sheet "Curso FullStack" (misma clave y total)
//   - getOferta() en src/components/Courses/ContactoCursoWeb.jsx (lo que se muestra en la web)
// ==========================================

// Fin de la preventa Early Bird: 20/12/2026 23:59:59 hora Argentina
export const EARLY_BIRD_HASTA_MP = "2026-12-20T23:59:59.000-03:00"; // formato que pide Mercado Pago
export const EARLY_BIRD_HASTA = new Date(EARLY_BIRD_HASTA_MP);

// Prefijo del external_reference de los pagos de intensivos: "intensivo-<plan>:<id>"
export const PREFIJO_REF = "intensivo-";

// maxCuotas: tope de cuotas que ofrece el checkout de Mercado Pago.
// Que sean SIN interés depende de la configuración de la cuenta de MP ("Costos y cuotas").
export const PLANES = {
  frontend: {
    itemId: "intensivo-verano-2027-frontend",
    titulo: "Intensivo Verano 2027 - Frontend Web + Lógica",
    nombre: "Frontend Web + Lógica",
    precio: 140000,
    maxCuotas: 2,
  },
  backend: {
    itemId: "intensivo-verano-2027-backend",
    titulo: "Intensivo Verano 2027 - Backend Profundo + DB",
    nombre: "Backend Profundo + DB",
    precio: 160000,
    maxCuotas: 2,
  },
  fullstack: {
    itemId: "intensivo-verano-2027-fullstack",
    titulo: "Intensivo Verano 2027 - Pack Fullstack",
    nombre: "Pack Fullstack",
    precio: 220000,
    maxCuotas: 3,
  },
  earlybird: {
    itemId: "intensivo-verano-2027-fullstack-earlybird",
    titulo: "Intensivo Verano 2027 - Pack Fullstack (Early Bird)",
    nombre: "Pack Fullstack (Early Bird)",
    precio: 200000,
    maxCuotas: 1,
  },
};

export function preventaActiva(ahora = new Date()) {
  return ahora.getTime() <= EARLY_BIRD_HASTA.getTime();
}

// La web manda "frontend", "backend" o "fullstack". Durante la preventa,
// "fullstack" se cobra como Early Bird; la decisión la toma el servidor.
export function resolverPlan(planElegido, ahora = new Date()) {
  if (planElegido === "frontend" || planElegido === "backend") {
    return { key: planElegido, ...PLANES[planElegido] };
  }
  if (planElegido === "fullstack") {
    const key = preventaActiva(ahora) ? "earlybird" : "fullstack";
    return { key, ...PLANES[key] };
  }
  return null;
}

// Devuelve el plan a partir del external_reference de un pago ("intensivo-fullstack:uuid")
export function planDesdeReferencia(ref) {
  const texto = String(ref || "");
  if (!texto.startsWith(PREFIJO_REF) || texto.indexOf(":") === -1) return null;
  const key = texto.slice(PREFIJO_REF.length, texto.indexOf(":"));
  return Object.prototype.hasOwnProperty.call(PLANES, key) ? { key, ...PLANES[key] } : null;
}
