// Promoción de cursos, donaciones y links para compartir "El Develop"
import { trackCustomEvent } from "../../data/metaPixel.js";

// Link de Cafecito (ej: "https://cafecito.app/tu-usuario"). Si está vacío, el botón no se muestra.
export const CAFECITO_URL = "";

export const GAME_PATH = "/el-develop";
export const INSTAGRAM_HANDLE = "@wearesrv";

export const COURSES = {
  python: {
    to: "/python/inscripcion",
    icon: "🐍",
    name: "Master en Python",
    pitch: "Lógica, POO, APIs y automatización desde cero.",
  },
  "fundamentos-backend": {
    to: "/fundamentos-backend/inscripcion",
    icon: "🧱",
    name: "Backend Fundamentos",
    pitch: "Las bases de JavaScript y backend que te piden en cualquier entrevista.",
  },
  "backend-avanzado": {
    to: "/backend-avanzado/inscripcion",
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
  terminal: "fundamentos-backend",
  gitflow: "fundamentos-backend",
  merge: "fundamentos-backend",
  bugbash: "fundamentos-backend",
  capa8: "fundamentos-backend",
  memotest: "fundamentos-backend",
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
