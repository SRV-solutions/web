// Textos de la página de venta de Sentryx. Salen del brief del equipo de Sentryx (5/11/2026): lo que se promete
// acá tiene que coincidir con lo que hace la plataforma. No sumar testimonios, plazos, garantías ni soporte.

const IMG = "/sentryx-landing";

// ⚠ Vence en marzo de 2027: cambiar acá el texto del ciclo (sección «Por qué ahora» y cierre de la página).
export const CICLO = {
  titulo: "Marzo es tarde. El ciclo 2027 se ordena ahora.",
  bajada:
    "Importás alumnos y familias desde una planilla, armás los cursos y empezás marzo con la comunicación, las notas y la asistencia en un solo lugar.",
  cierre: "Escribinos y te mostramos cómo se vería tu colegio para el ciclo 2027.",
};

export const DATOS_AHORA = [
  {
    valor: "27%",
    texto: "menos matrícula primaria proyectada para 2030 en todo el país: unos 1,2 millones de alumnos menos que en 2023.",
    fuente: "Argentinos por la Educación, vía LM Neuquén",
    url: "https://www.lmneuquen.com/neuquen/proyectan-fuerte-caida-la-matricula-escolar-2030-que-pasa-neuquen-relacion-otras-provincias-n1226423",
  },
  {
    valor: "68%",
    texto: "de los directores señala el exceso de trabajo administrativo como fuente de estrés. Dato internacional.",
    fuente: "TALIS 2024 de la OCDE, vía Excélsior",
    url: "https://www.excelsior.com.mx/nacional/sobrecarga-administrativa-estresa-68-directores-escolares-ocde",
  },
];

export const HERO_IMAGEN = {
  src: `${IMG}/hero-plataforma.webp`,
  ancho: 1650,
  alto: 1200,
  alt: "Tres celulares con Sentryx: asistencia, inicio de una familia y perfil de un estudiante",
};

export const OG_IMAGEN = `${IMG}/og-sentryx.jpg`;
export const OG_IMAGEN_ALT = "Sentryx: todo tu colegio en una sola plataforma";
export const QR_IMAGEN = `${IMG}/qr-demo-whatsapp.png`;

export const ANTES_DESPUES = [
  ["Grupo de WhatsApp y mails sueltos", "Comunicados con tipo, urgencia y audiencia"],
  ["Cuaderno para firmar", "Confirmación de lectura y recordatorios"],
  ["Planilla de faltas", "Asistencia en el celular y alertas automáticas"],
  ["Excel de notas por mail", "Cada docente carga, la conducción publica"],
  ["Carpeta de actas", "Historial que no se puede borrar"],
  ["WhatsApp personal del docente", "Conversaciones sin compartir el número"],
];

export const BLOQUES = [
  {
    titulo: "Un aviso. Un solo lugar. Y sabés quién lo leyó.",
    imagen: {
      src: `${IMG}/comunicados.webp`,
      ancho: 1350,
      alto: 1200,
      alt: "Comunicado urgente en el celular, con confirmación de lectura y cantidad de personas que lo leyeron",
    },
    puntos: [
      "A quien corresponda: un alumno, varios, un curso, un nivel o toda la institución. Elegís si le llega a las familias, a los estudiantes o a ambos.",
      "Confirmación de lectura: quién leyó, quién confirmó y quién falta, con un botón para recordarles a los pendientes.",
      "Respuestas que no se vuelven un grupo: elegís si se puede responder, y cada respuesta es una conversación privada con quien lo envió.",
      "Ocho tipos, para que nada se mezcle: Institucional, Académico, Áulico, Asistencia, Convivencia, Administrativo, Eventos y actos, y Consulta. Además, cada uno se puede marcar como Urgente.",
    ],
  },
  {
    titulo: "Cerrar el bimestre no debería ser una maratón de planillas.",
    imagen: {
      src: `${IMG}/notas-boletines.webp`,
      ancho: 1500,
      alto: 1140,
      alt: "Planilla de notas en la compu y boletín en el celular",
    },
    puntos: [
      "Notas según el nivel: informes en Inicial, escala conceptual en Primario y conceptual más numérica en Secundario. Se configura por nivel.",
      "Cada docente carga sus notas y la conducción ve qué falta en cada curso.",
      "El boletín se publica por curso y período, las familias reciben el aviso y se puede imprimir.",
    ],
  },
  {
    titulo: "Que la familia no se entere por el boletín.",
    imagen: {
      src: `${IMG}/asistencia-alertas.webp`,
      ancho: 1350,
      alto: 1200,
      alt: "Toma de asistencia en el celular, con una alerta de inasistencias y la tarjeta de un alumno",
    },
    puntos: [
      "Asistencia en segundos, desde el celular o la compu: todos arrancan presentes y se toca al que faltó, llegó tarde o se retiró.",
      "La familia ve en su inicio si hoy está presente o ausente.",
      "Alertas por reglas de faltas configurables: avisan a preceptoría y conducción y, si lo definís, también a la familia.",
      "Estadísticas de asistencia y promedios por curso.",
    ],
  },
  {
    titulo: "Feriados, actos, evaluaciones y TPs. En el calendario del aula.",
    imagen: {
      src: `${IMG}/calendario-aula.webp`,
      ancho: 1500,
      alto: 1200,
      alt: "Calendario mensual del aula con evaluaciones, trabajos prácticos, actos y feriados",
    },
    puntos: [
      "Un aula por curso, con muro, material, tareas, TPs, evaluaciones, horario e integrantes.",
      "Lo que publican los docentes y los feriados nacionales aparecen solos. Los actos y eventos institucionales son del plan Integral.",
      "Las ausencias docentes se avisan a estudiantes y familias, y se ven en el aula.",
      "Canales por curso y por materia en Secundario, moderados por docentes y preceptoría. No hay mensajes privados entre estudiantes.",
    ],
  },
  {
    titulo: "Lo que pasó queda escrito. Y no se puede borrar.",
    imagen: {
      src: `${IMG}/convivencia-perfil.webp`,
      ancho: 1350,
      alto: 1200,
      alt: "Registro de convivencia con una rectificación, junto al perfil de un estudiante",
    },
    puntos: [
      "Historial de convivencia de cada alumno: qué pasó, cuándo y quién lo cargó. Un error se corrige con una rectificación, nunca borrando.",
      "Cada registro puede ser visible para la familia o interno del personal.",
      "Mi perfil del estudiante: sus materias con sus docentes y las notas publicadas de cada una, más asistencia y convivencia.",
      "Las familias con varios hijos ven todo desde una sola cuenta, aunque estén en distintos niveles.",
    ],
  },
  {
    titulo: "¿Capacitación de tres horas? Mejor te guía SOLVIX.",
    imagen: {
      src: `${IMG}/solvix-tutorial.webp`,
      ancho: 1350,
      alto: 930,
      alt: "SOLVIX, el astronauta de Sentryx, señalando un tutorial guiado",
    },
    puntos: [
      "SOLVIX es el astronauta de Sentryx: tutoriales guiados dentro de la plataforma, pantalla por pantalla y según el rol de cada persona.",
      "Si alguien se olvida, los vuelve a abrir desde su perfil.",
    ],
  },
];

export const ROLES = [
  {
    rol: "Representante Legal",
    texto: "Todo el colegio en un lugar: niveles, personal, facturación del servicio, planes y auditoría.",
  },
  {
    rol: "Dirección y Rectoría",
    texto: "Comunicar a su nivel, seguir alertas y estadísticas, publicar boletines y ver el estado académico de cada curso.",
  },
  {
    rol: "Secretaría y Administración",
    texto: "Altas desde planilla, legajos, cambios de curso, blanqueo de contraseñas y comunicación institucional.",
  },
  {
    rol: "Preceptoría",
    texto: "Asistencia desde el celular, alertas de sus cursos, convivencia y contacto con las familias.",
  },
  {
    rol: "Docentes",
    texto: "Sus materias, sus notas, material y evaluaciones en el aula, y comunicación sin dar su número.",
  },
  {
    rol: "Familias",
    texto: "Comunicados, boletín publicado, asistencia, aula y convivencia de todos sus hijos, y escribirle a la escuela.",
  },
  {
    rol: "Estudiantes (Secundario)",
    texto: "Su perfil, materias y notas publicadas, aulas, calendario, canales y comunicados con sus docentes.",
  },
];

export const SEGURIDAD = [
  {
    titulo: "Un espacio por colegio",
    texto: "Con su nombre, su escudo y su link de ingreso. Los datos de cada colegio están separados de los demás.",
  },
  { titulo: "Roles y permisos", texto: "Doce roles listos y la posibilidad de crear los propios." },
  { titulo: "Auditoría", texto: "Cada acción que modifica algo queda registrada con usuario, IP, fecha y hora." },
  {
    titulo: "Contactos protegidos",
    texto: "Docentes, familias y estudiantes se escriben sin ver el teléfono ni el email del otro.",
  },
  { titulo: "Celular y compu", texto: "Funciona desde el navegador y se instala como una app." },
  { titulo: "Reportar un problema", texto: "Desde el menú, con los datos para resolverlo." },
];

export const PASOS = [
  { titulo: "Demo.", texto: "Te mostramos un colegio funcionando, con un usuario por cada rol." },
  { titulo: "Tu colegio.", texto: "Armamos tus niveles, cursos y materias, con tu nombre y tu escudo." },
  { titulo: "Tu gente.", texto: "Importás alumnos y familias desde una planilla. Los hermanos se vinculan solos." },
  { titulo: "A clases.", texto: "SOLVIX guía a cada persona según su rol, y empezás el ciclo con todo adentro." },
];

export const FAQ = [
  {
    q: "¿Qué necesita una familia para usarlo?",
    a: "Un celular o una compu con navegador. Se instala como una app, y cada persona entra con su email o su DNI.",
  },
  {
    q: "¿Sirve para los tres niveles?",
    a: "Sí: Inicial, Primario y Secundario, cada uno con su forma de calificar. Se configura por nivel.",
  },
  {
    q: "¿Cómo cargamos a los alumnos y a las familias?",
    a: "Desde una planilla, con una plantilla que da la plataforma (se guarda desde Excel como CSV). Los hermanos se vinculan solos a la misma familia.",
  },
  {
    q: "¿Los estudiantes tienen cuenta?",
    a: "En Secundario, sí: se crea sola cuando el alumno entra al colegio, con su DNI como usuario. En Inicial y Primario, todo pasa por las familias.",
  },
  {
    q: "¿Qué pasa si un estudiante no tiene email?",
    a: "Entra con su DNI y puede cambiar su contraseña, pero no recuperarla solo. La conducción ve quién no tiene email y puede avisarles a las familias.",
  },
  {
    q: "¿Sentryx cobra las cuotas del colegio?",
    a: "No. Sentryx no gestiona cuotas ni cobranzas. Lo que sí podés hacer es avisar por un comunicado de tipo Administrativo, con confirmación de lectura.",
  },
  {
    q: "¿Cómo se cobra?",
    a: "Por cada persona con acceso en el mes: personal, familias y estudiantes con cuenta. Cada persona puede tener su plan. Si en un mes alguien tuvo dos planes, se cobra el más alto.",
  },
  {
    q: "¿Puedo verlo antes de decidir?",
    a: "Sí. Te mostramos una demo con un colegio de ejemplo y un usuario por cada rol.",
  },
];

// Kydo es una aplicación de otro titular (kydo.com.ar), que se ofrece en los planes de Sentryx con su autorización.
// Las cifras y los textos salen de kydo.com.ar y /escuela/institucional, y las imágenes se cargan desde su web:
// si cambian allá, revisarlos acá.
export const KYDO_URL = "https://kydo.com.ar/escuela/institucional";
export const KYDO_MUESTRA_URL = "https://mi.kydo.com.ar/act/muestra-kydo-4/?muestra=laboratorio_electrico";
export const KYDO_IMG = "https://kydo.com.ar/static/img";

export const KYDO_CIFRAS = [
  { valor: "448", texto: "saberes de 1.º a 7.º grado" },
  { valor: "444", texto: "actividades para jugar" },
  { valor: "396", texto: "lecciones en video" },
  { valor: "4", texto: "áreas: Matemática, Lengua, Naturales y Sociales" },
];

export const KYDO_PARA = [
  {
    titulo: "Para los chicos",
    imagen: "kydo-web-menu-con-voz-1ro.webp",
    posicion: "top",
    alt: "Cuaderno de Kydo de 1.º grado, con los juegos de Lengua",
    puntos: [
      "Arrancan con tres juegos cortos que los ubican en su nivel. No es una prueba y no restan estrellas.",
      "Cada día tienen una misión con tres juegos elegidos para cada uno.",
      "Si se traban, una lección narrada de pocos segundos les explica el tema.",
      "Las consignas se escuchan con voz argentina, para los que todavía no leen.",
    ],
  },
  {
    titulo: "Para la maestra",
    imagen: "kydo-web-adulto-informe-para-la-maestra.webp",
    posicion: "bottom",
    alt: "Informe de Kydo para la maestra, con los temas de Lengua trabajados en casa",
    puntos: [
      "Un panel del curso muestra qué domina cada chico, por materia, y quiénes necesitan más apoyo.",
      "Solo cuenta como dominado lo resuelto bien, sin ayuda y en días distintos.",
      "El cuaderno se ordena como se da en clase, y ese orden manda sobre la recomendación automática.",
    ],
    link: { texto: "Ver el panel de ejemplo →", url: "https://kydo.com.ar/escuela/curso/ejemplo" },
  },
  {
    titulo: "Para las familias",
    imagen: "kydo-web-adulto-progreso-primera-vez.webp",
    posicion: "bottom",
    alt: "Informe de progreso de Kydo para el adulto: cuánto jugó, dónde se trabó y qué le toca después",
    puntos: [
      "Ven desde el primer día cuánto jugó, dónde le costó y qué le conviene hacer después.",
      "Pueden imprimir o mandar en PDF un informe para la maestra, con los nombres del Diseño Curricular.",
      "El chico no necesita cuenta: entra por un link propio.",
    ],
  },
];
