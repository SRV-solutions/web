/* global __PROMO__ */
import { leerPromo, promoVigente } from "../../netlify/lib/promo.js";

// Promo con fecha para los cursos grabados: vite.config.js inyecta acá la variable PROMO de Netlify al publicar
// (formato y reglas en netlify/lib/promo.js). Se evalúa al cargar la página, igual que las preventas.
const TEXTO = typeof __PROMO__ === "string" ? __PROMO__ : "";

// La promo, solo mientras está dentro de sus fechas
export const PROMO = promoVigente(TEXTO);

// La promo publicada en /terminos: desde que se carga la variable hasta que termina (se puede anunciar antes)
const leida = (() => {
  try {
    return leerPromo(TEXTO);
  } catch {
    return null;
  }
})();
export const PROMO_PUBLICADA = leida && Date.now() < leida.hasta ? leida : null;

// Nombres para el aviso y las bases (sin importar todo cursosGrabados.js, que es pesado y va aparte)
const NOMBRES = {
  scratch: "Scratch para Chicos",
  scripting: "Curso de Scripting con IA",
  python: "Master en Python con IA",
  "fundamentos-backend": "Master en JavaScript",
  "backend-avanzado": "Backend Avanzado",
  "fullstack-csharp": "Curso Fullstack con C#",
  redes: "Redes, Linux y AWS",
  excel: "Master en Excel y Sheets con IA",
  sql: "SQL y Bases de Datos",
  "ruta-backend": "Ruta Backend Completa",
  "excel-scripting": "Combo Excel + Scripting",
};
export const cursosDePromo = (p) => (p.cursos ? p.cursos.map((k) => NOMBRES[k] || k).join(", ") : null);
