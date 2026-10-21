// Promoción de cursos, donaciones y links para compartir "El Develop"
import { trackCustomEvent } from "../../data/metaPixel.js";

// Donaciones por Mercado Pago (netlify/functions/crear-donacion.js valida los mismos límites)
export const DONATION_MIN = 500;
export const DONATION_MAX = 500000;
export const DONATION_OPTIONS = [
  { amount: 1000, icon: "☕", label: "Un cafecito" },
  { amount: 2000, icon: "🧉", label: "Mate con facturas" },
  { amount: 5000, icon: "🍕", label: "Pizza para el equipo" },
  { amount: 10000, icon: "🥩", label: "Un asado" },
];

export const GAME_PATH = "/el-develop";
export const INSTAGRAM_HANDLE = "@wearesrv";

export const COURSES = {
  scripting: {
    to: "/scripting/inscripcion",
    icon: "⚡",
    name: "Curso de Scripting",
    pitch: "JavaScript, Python y Apps Script desde cero. ¡Solo $15.000!",
  },
  python: {
    to: "/python/inscripcion",
    icon: "🐍",
    name: "Master en Python",
    pitch: "Lógica, POO, APIs y automatización desde cero.",
  },
  "fundamentos-backend": {
    to: "/ruta-backend/inscripcion?elegir=fundamentos-backend",
    icon: "🟨",
    name: "Master en JavaScript",
    pitch: "JavaScript de verdad: lógica, POO, promesas y APIs. La base que te piden en cualquier entrevista.",
  },
  "backend-avanzado": {
    to: "/ruta-backend/inscripcion?elegir=backend-avanzado",
    icon: "🚀",
    name: "Backend Avanzado",
    pitch: "Bases de datos, APIs, servidores y arquitectura como un Senior.",
  },
  "full-stack": {
    to: "/full-stack/inscripcion",
    icon: "🌐",
    name: "Intensivo Full Stack",
    pitch: "Front y back: de cero a tu primer laburo en IT.",
  },
};

// Qué curso recomendar según el minijuego que te costó
export const MINIGAME_COURSE = {
  algo: "python",
  findbug: "python",
  data: "python",
  terminal: "scripting",
  gitflow: "fundamentos-backend",
  merge: "fundamentos-backend",
  bugbash: "fundamentos-backend",
  capa8: "scripting",
  memotest: "scripting",
  pipes: "backend-avanzado",
  servers: "backend-avanzado",
  hack: "backend-avanzado",
  design: "backend-avanzado",
  behavioral: "backend-avanzado",
  css: "full-stack",
  prioritizer: "full-stack",
};

// Curso recomendado al final según tu stat más flojo y tu nivel
export function recommendCourse(game) {
  if (game.level < 2 || game.stats.logic < 35) return "scripting";
  if (game.stats.logic < 50) return "python";
  if (game.level < 3) return "fundamentos-backend";
  if (game.role === "frontend" || game.role === "pm") return "full-stack";
  return "backend-avanzado";
}

export function track(name, data = {}) {
  try {
    trackCustomEvent(name, data);
  } catch {
    // El tracking nunca debe romper el juego
  }
}
