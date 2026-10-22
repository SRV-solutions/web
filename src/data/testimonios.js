// Feedback real de alumnos (con su permiso, sin datos de contacto). Para sumar uno nuevo, agregalo acá.
// nota: puntaje de la encuesta post-clase (1 a 10), si lo hay.
export const TESTIMONIOS = [
  {
    texto: "Excelente la metodología y dinámica de las clases. Considero que así los conocimientos quedan más sólidos. ¡Éxitos!",
    autor: "Miguel Díaz",
    origen: "Alumno de AWS",
  },
  {
    texto:
      "El curso es bueno y cubre bastantes contenidos. El profesor es paciente, activo y muchas veces incentiva a los alumnos a alguna actividad con respecto a la clase, lo último visto, etc.",
    autor: "Santino Rioja",
    origen: "Alumno de Redes y de Base de Datos",
  },
  {
    texto: "Estuvo muy bueno. El profe explicó los conceptos básicos de Base de Datos y explicaba ejemplos para consolidar conocimientos teóricos.",
    autor: "Alumno/a",
    origen: "Encuesta anónima · Bases de Datos Intensivo",
    nota: 10,
  },
  {
    texto: "Buena explicación, sin demasiadas vueltas, muy entendible la clase.",
    autor: "Alumno/a",
    origen: "Encuesta anónima · Python y Scripting",
    nota: 10,
  },
  {
    texto:
      "Me gustó lo que vimos y es una gran introducción a la gestión de base de datos. Es genial para gente que, a pesar de haber visto los contenidos, no los entendieron de base. El profe es piola.",
    autor: "Alumno/a",
    origen: "Encuesta anónima · Bases de Datos Intensivo",
    nota: 8,
  },
  {
    texto: "Yo ya sabía todo y lo re entendí todo, por eso todo perfe.",
    autor: "Alumno/a",
    origen: "Encuesta anónima · Python y Scripting",
    nota: 10,
  },
];

// Resumen de la encuesta post-clase (todas las respuestas, incluidas las que no dejaron comentario útil)
export const ENCUESTA = { notas: [10, 10, 10, 10, 8] };
export const promedioEncuesta = () => ENCUESTA.notas.reduce((a, b) => a + b, 0) / ENCUESTA.notas.length;
