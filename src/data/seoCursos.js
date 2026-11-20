// Título y descripción del inicio y de las páginas de los cursos grabados: salen de cursosGrabados.js.
// Los usan las páginas y el build (scripts/seo-html.mjs); el resto de las páginas está en seo.js.
import { CURSOS_GRABADOS, estaEnPreventa, formatearPrecio } from "./cursosGrabados.js";

// Cursos del inicio (los mismos de la ruta de aprendizaje de Home/Index.jsx)
const RUTA_INICIO = ["scripting", "python", "fundamentos-backend", "backend-avanzado", "fullstack-csharp"];

export function seoInicio() {
  const clases = RUTA_INICIO.reduce((total, key) => total + CURSOS_GRABADOS[key].clases, 0);
  const desde = Math.min(...RUTA_INICIO.map((key) => CURSOS_GRABADOS[key].precio));
  return {
    path: "/",
    title: "WEARESRV | Escuela de programación online: cursos grabados desde cero y con IA",
    description: `Cursos grabados de programación con acceso de por vida: Scripting y Python con IA, JavaScript, Backend con Node.js y Fullstack con C#. ${clases} clases grabadas y guías de estudio. Desde ${formatearPrecio(desde)}.`,
  };
}

// Páginas de curso que existen (las claves que App.jsx le pasa a CursoGrabado)
export const CURSOS_CON_PAGINA = ["scratch", "scripting", "python", "ruta-backend", "fullstack-csharp", "redes", "excel", "sql"];

// tituloBusqueda (cursosGrabados.js) es el título con las palabras de quien busca en Google. Si falta, se usa
// el nombre del curso. Mientras dura una preventa, el título lo avisa: se calcula al cargar la página, y en el
// HTML del build queda el del día en que se publicó.
export function seoCurso(cursoKey) {
  const curso = CURSOS_GRABADOS[cursoKey];
  const nombre = [curso.tituloInicio, curso.tituloDestacado, curso.tituloFin].filter(Boolean).join(" ");
  const preventa = estaEnPreventa(curso);
  const base = curso.tituloBusqueda || `${nombre}: curso online con acceso de por vida`;
  const aviso = preventa ? ` · ${curso.preventa.yaHayClases ? "Preventa con acceso inmediato" : "Preventa"}` : "";
  return {
    path: `/${curso.ruta}/inscripcion`,
    title: `${base}${aviso} | WEARESRV`,
    description: curso.metaDescripcion,
    type: "product",
  };
}
