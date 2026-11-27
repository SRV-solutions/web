// Título, descripción y vista previa de cada página, en un solo lugar. Lo usan dos cosas:
//  - las páginas (src/components/Seo.jsx), para poner sus tags cuando React ya cargó;
//  - el build (scripts/seo-html.mjs), que escribe un HTML por ruta con esos mismos tags en el <head>, para
//    WhatsApp, Facebook y los buscadores, que leen el HTML sin ejecutar JavaScript.
// Los de los cursos grabados y el inicio se calculan en seoCursos.js, porque salen de cursosGrabados.js.
// Va sin imports a propósito: este archivo entra en todas las páginas y lo lee Node al compilar.

export const SITE_URL = "https://wearesrv.com";
export const IMAGEN_POR_DEFECTO = `${SITE_URL}/og-image.jpg`;

// noindex: la página no se ofrece a los buscadores. sitemap: false la deja afuera del control del sitemap.
export const SEO_PAGINAS = {
  "/full-stack/inscripcion": {
    title: "Intensivo Full Stack 2027 en vivo: Frontend, Backend o Full Stack | WEARESRV",
    description:
      "Cursada intensiva en vivo de enero a marzo: Frontend con React y Backend con Node.js y bases de datos, con código real y mentoría. Reservá tu lugar.",
  },
  "/empresas": {
    title: "Capacitación en IA, automatización y AWS para empresas y colegios | WEARESRV",
    description:
      "Talleres de IA, automatización con Python y Apps Script, y AWS para equipos. En vivo, a medida y con certificado verificable. Paquete especial para colegios con IA para docentes, Scratch y Sentryx.",
  },
  "/proximos-cursos": {
    title: "Próximos cursos: IA para el trabajo, IA para docentes, SQL, AWS y Excel | WEARESRV",
    description:
      "Anotate en la lista de espera de los próximos cursos de WEARESRV: IA para el trabajo e IA para docentes. Y reservá en preventa SQL y Bases de Datos, Redes, Linux y AWS, y el Master en Excel y Sheets con IA.",
  },
  "/fundamentos-ia": {
    title: "Curso gratis de inteligencia artificial para empezar: Fundamentos de IA | WEARESRV",
    description:
      "Material gratuito para entender la IA y empezar a usarla hoy, sin saber programar: qué es la IA generativa, prompts que funcionan, IA en el trabajo diario y tu primer script con IA.",
  },
  "/redes": {
    title: "Guía gratis de redes y nube desde cero: modelo OSI, IP, Cisco y AWS | WEARESRV",
    description:
      "La guía de los clips de WEARESRV, gratis: la nube, el usuario root de AWS, cómo viaja un mensaje, el cable de red, las 7 capas del modelo OSI, el switch, las IPs y los comandos de Cisco. Para leer en la web o descargar en PDF.",
  },
  "/el-develop": {
    title: "El Develop: juego gratis de carrera IT | WEARESRV",
    description:
      "Juego gratis de carrera IT bien argentino: sobreviví a la inflación, los paros y los errores de Capa 8 hasta llegar a una Big Tech o vender tu propia startup.",
  },
  "/sentryx": {
    title: "Sentryx: plataforma escolar para colegios (comunicados, notas y asistencia) | WEARESRV",
    description:
      "Comunicados con confirmación de lectura, notas, boletines, asistencia, aulas y convivencia en un solo lugar. Para colegios con Inicial, Primario y Secundario. Pedí tu demo.",
    image: `${SITE_URL}/sentryx-landing/og-sentryx.jpg`,
    imageAlt: "Sentryx: todo tu colegio en una sola plataforma",
  },
  "/eventbox": {
    title: "Event Box: stock y órdenes de servicio para empresas de eventos | WEARESRV",
    description:
      "Event Box ordena el stock, los contenedores y las órdenes de servicio de tu empresa de eventos. Cada orden con su recorrido, su responsable por etapa y su PDF. Por SRV.",
  },
  "/amigo-invisible": {
    title: "Amigo invisible online gratis, con sorteo por mail y pistas anónimas | WEARESRV",
    description:
      "Sorteá el amigo invisible gratis y sin registrarte: a cada uno le llega por mail a quién le regala, y puede mandarle pistas anónimas y adivinar quién es el suyo.",
  },
  "/terminos": {
    title: "Términos y condiciones | WEARESRV",
    description:
      "Condiciones de venta de los cursos de WEARESRV: precios, pagos, promociones con sus fechas, acceso, arrepentimiento y certificados.",
    sitemap: false,
  },
  "/privacidad": {
    title: "Política de privacidad | WEARESRV",
    description:
      "Qué datos personales junta WEARESRV, para qué los usa, con quién los comparte y cómo ejercer tus derechos.",
    sitemap: false,
  },
  "/arrepentimiento": {
    title: "Botón de arrepentimiento | WEARESRV",
    description: "Arrepentite de tu compra dentro de los 10 días corridos, sin registrarte y sin costo.",
    sitemap: false,
  },
  "/baja": {
    title: "Botón de baja de servicio | WEARESRV",
    description: "Dá de baja un servicio de WEARESRV sin registrarte.",
    sitemap: false,
  },
};

// Páginas que no se ofrecen a los buscadores
export const SEO_GRACIAS = {
  title: "¡Gracias por tu compra! | WEARESRV",
  description: "Confirmación de compra en WEARESRV.",
  noindex: true,
};
export const SEO_CERTIFICADO = {
  title: "Certificado | WEARESRV",
  description: "Verificación de certificados emitidos por WEARESRV.",
  noindex: true,
};
export const SEO_NO_ENCONTRADA = {
  title: "Página no encontrada | WEARESRV",
  description: "La página que buscás no existe. Mirá nuestras formaciones disponibles.",
  path: "/404",
  noindex: true,
};
