import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./style.module.css";
import Seo, { SITE_URL } from "../Seo";
import { CURSOS_GRABADOS, formatearPrecio, estaEnPreventa, estaEnEstellarium, linkInscripcion, promoDe } from "../../data/cursosGrabados";
import { seoInicio } from "../../data/seoCursos";
import { linkPackTodo, packTodo } from "../../data/packs";
import { TESTIMONIOS, ENCUESTA, promedioEncuesta } from "../../data/testimonios";
import { LuBanknote, LuBuilding2, LuClapperboard, LuCompass, LuGift, LuHourglass, LuOrbit, LuQuote, LuRocket, LuStar, LuTarget, LuTrophy } from "react-icons/lu";
import Icono from "../Icono";

const WHATSAPP_URL = `https://wa.me/5491123869799?text=${encodeURIComponent("Hola, quiero cotizar un software")}`;

// Orden de la ruta de aprendizaje
const RUTA = ["scripting", "python", "fundamentos-backend", "backend-avanzado", "fullstack-csharp"];
const ETIQUETAS = {
  scripting: "Paso 1 · Empezá acá",
  python: "Paso 2 · Python a fondo",
  "fundamentos-backend": "Paso 2 · JavaScript a fondo",
  "backend-avanzado": "Paso 3 · Nivel profesional",
  "fullstack-csharp": "Paso 3 · App completa con C#",
};

// Los cursos que no son de la ruta de programación: van en su propia grilla, con tarjetas como las de la ruta,
// para que se vean con su precio (y el de la promo, cuando hay) al entrar por "Ver cursos"
const MAS = ["redes", "excel", "sql", "scratch"];
const ETIQUETAS_MAS = {
  redes: "Certificación AWS",
  excel: "Sin saber programar",
  sql: "Para trabajar con datos",
  scratch: "Chicos de 8 a 13 años",
};

// Debajo del precio: hasta cuándo vale el de la promo y, en una preventa, cuándo están las clases
function notaPrecio(c) {
  const promo = promoDe(c);
  const partes = [];
  if (promo) partes.push(`Precio ${promo.nombre}, solo ${promo.fechasTexto}.`);
  if (estaEnPreventa(c)) {
    partes.push(
      c.preventa.yaHayClases
        ? `Preventa: empezás hoy y el curso queda completo el ${c.preventa.fechaTexto}.`
        : `Preventa: las clases se habilitan el ${c.preventa.fechaTexto}.`
    );
  }
  return partes.join(" ") || null;
}

function TarjetaCurso({ c, etiqueta, destacado = false, verde = false }) {
  const nota = notaPrecio(c);
  return (
    <article className={`${styles.courseCard} ${destacado ? styles.courseFeatured : ""}`}>
      <span className={`${styles.courseStep} ${verde ? styles.courseStepVerde : ""}`}>{etiqueta}</span>
      <h3>
        {c.tituloInicio} <span className={styles.orange}>{c.tituloDestacado}</span>
      </h3>
      <p className={styles.courseHook}>{c.gancho}</p>
      <ul className={styles.courseMeta}>
        <li>
          <Icono de={LuClapperboard} /> {c.clases} clases grabadas
        </li>
        <li>
          <Icono de={LuTarget} /> {c.nivel.split(" · ")[0]}
        </li>
        {estaEnEstellarium(c) && (
          <li className={styles.enEstellarium}>
            <Icono de={LuOrbit} /> En E-stellarium
          </li>
        )}
      </ul>
      <div className={styles.coursePrice}>
        {/* Tachado solo si es un precio real (preventa con fecha): nada de "precios regulares" que nunca se cobraron */}
        {c.precioRegular > c.precio && <span className={styles.oldPrice}>{formatearPrecio(c.precioRegular)}</span>}
        <strong>{formatearPrecio(c.precio)}</strong>
      </div>
      {nota && <p className={styles.courseNota}>{nota}</p>}
      <Link to={linkInscripcion(c)} className={destacado ? styles.btnPrimary : styles.btnSecondary}>
        Ver el curso
      </Link>
    </article>
  );
}

// Combo de los dos cursos de backend (no va en RUTA para no duplicar clases ni precios)
const COMBO = CURSOS_GRABADOS["ruta-backend"];
// Todos los cursos en un pago: el link lleva a la página que los deja tildados
const TODO = packTodo();
const TOTAL_CLASES = RUTA.reduce((total, key) => total + CURSOS_GRABADOS[key].clases, 0);
const PRECIO_DESDE = Math.min(...RUTA.map((key) => CURSOS_GRABADOS[key].precio));

// E-stellarium, la plataforma de práctica (otro proyecto: e-stellarium.wearesrv.com)
const ESTELLARIUM_URL = "https://e-stellarium.wearesrv.com";
const ESTELLARIUM_PUNTOS = [
  { icono: LuOrbit, titulo: "Una constelación por curso.", texto: "Cuatro tipos de juegos para fijar cada tema." },
  { icono: LuTrophy, titulo: "Desafíos y ranking.", texto: "Sumás experiencia, mantenés tu racha y competís con otros alumnos." },
  { icono: LuGift, titulo: "Cupones de descuento.", texto: "Aprobás tu constelación y te llevás un cupón para tu próximo curso." },
];

// Una constelación decorativa al lado del anuncio: estrellas unidas por líneas, la última en naranja (la que
// estás por completar). Las estrellas titilan con un desfase cada una; sin animación si se pidió menos movimiento.
const ESTRELLAS = [
  [40, 190, 5], [95, 120, 4], [150, 150, 6], [205, 70, 4], [255, 110, 5], [300, 40, 7],
];
function Constelacion() {
  return (
    <svg className={styles.constelacion} viewBox="0 0 340 230" aria-hidden="true">
      <polyline points={ESTRELLAS.map(([x, y]) => `${x},${y}`).join(" ")} className={styles.constelacionLinea} />
      {ESTRELLAS.map(([x, y, r], i) => (
        <g key={i} className={styles.constelacionEstrella} style={{ animationDelay: `${i * 0.45}s` }}>
          <circle cx={x} cy={y} r={r * 2.6} className={i === ESTRELLAS.length - 1 ? styles.haloNaranja : styles.halo} />
          <circle cx={x} cy={y} r={r} className={i === ESTRELLAS.length - 1 ? styles.estrellaNaranja : styles.estrella} />
        </g>
      ))}
    </svg>
  );
}

const DOLORES = [
  { icono: LuCompass, texto: "Viste mil tutoriales sueltos y todavía no sabés por dónde empezar." },
  { icono: LuBanknote, texto: "Querés cambiar de laburo, pero los cursos cuestan una fortuna." },
  { icono: LuHourglass, texto: "Hacés a mano tareas que una computadora resolvería en segundos." },
];

const PASOS = [
  { titulo: "Elegís tu curso", texto: "Si nunca programaste, arrancá por Scripting. Si ya tenés bases, saltá directo a Python o Backend." },
  { titulo: "Pagás una sola vez", texto: "Con Mercado Pago, sin suscripciones. El acceso te llega al mail apenas se aprueba el pago." },
  { titulo: "Aprendés a tu ritmo", texto: "Clases grabadas para ver cuando quieras, guías de estudio y una comunidad en Discord." },
];

const FAQ = [
  { q: "Nunca programé, ¿por dónde empiezo?", a: "Por el Curso de Scripting con IA: arranca desde cero, cuesta $15.000 y te da la base de lógica para después seguir con Python o Backend." },
  { q: "¿Enseñan a usar IA?", a: "Sí. El Curso de Scripting con IA y el Master en Python con IA incluyen un módulo de 8 clases para automatizar con IA (si los compraste antes, ya lo tenés en tu carpeta). En Fundamentos de IA tenés 4 videos y sus guías gratis, y estamos preparando el curso 'IA para el trabajo': anotate en la lista de espera desde la página de próximos cursos." },
  { q: "¿Las clases son en vivo o grabadas?", a: "El Curso de Scripting con IA, el Master en Python con IA, Master en JavaScript, Backend Avanzado, Fullstack con C#, Scratch para Chicos, Redes, Linux y AWS, Master en Excel y Sheets con IA y SQL y Bases de Datos son grabados, con acceso de por vida. El Intensivo Full Stack es una cursada en vivo." },
  { q: "¿Tienen un curso para certificarme en AWS?", a: `Sí: Redes, Linux y AWS, un curso grabado para rendir la certificación AWS Certified Cloud Practitioner (CLF-C02).${estaEnPreventa(CURSOS_GRABADOS.redes) ? ` Está en preventa hasta el ${CURSOS_GRABADOS.redes.preventa.fechaTexto}, cuando se habilitan las clases.` : ""} El examen lo toma y lo cobra AWS, aparte del curso.` },
  { q: "¿Tienen un curso de Excel?", a: `Sí: el Master en Excel y Sheets con IA, ${CURSOS_GRABADOS.excel.clases} clases grabadas para ir de cero a tablas dinámicas, Power Query, VBA y Google Apps Script, sin saber programar.${estaEnPreventa(CURSOS_GRABADOS.excel) ? ` Está en preventa hasta el ${CURSOS_GRABADOS.excel.preventa.fechaTexto}, cuando se habilitan las clases.` : ""} También se vende en combo con el Curso de Scripting con IA.` },
  { q: "¿Tienen algo para chicos?", a: `Sí: Scratch para Chicos, un curso grabado de 14 clases para que chicos de 8 a 13 años creen una historia animada y su primer videojuego. Ya está disponible por ${formatearPrecio(CURSOS_GRABADOS.scratch.precio)}, con acceso de por vida al material en Google Drive.` },
  { q: "¿Cómo recibo el curso después de pagar?", a: "Automáticamente: apenas Mercado Pago aprueba el pago, te llega un mail con el acceso a la carpeta del curso en Google Drive." },
  { q: "¿Qué es E-stellarium?", a: "Es nuestra plataforma para repasar cada curso jugando: una constelación por curso, desafíos semanales con ranking y cupones de descuento para tus próximos cursos. Ya está abierta y está incluida en los cursos, sin pagar nada extra: al comprar te llega un mail para crear tu contraseña (Excel, SQL y Redes, Linux y AWS se suman más adelante). También podés probar la demo sin cuenta en e-stellarium.wearesrv.com/demo." },
  { q: "¿Hacen software para empresas?", a: "Sí. Además de la escuela, desarrollamos backend, APIs, plataformas web y automatizaciones a medida. Escribinos por WhatsApp y lo cotizamos." },
  { q: "¿Tienen productos propios?", a: "Sí, dos plataformas por suscripción mensual: Sentryx, para colegios (comunicados, boletines, asistencia y aulas virtuales), y Event Box, para empresas de eventos (stock, contenedores y órdenes de servicio). Los planes están en la página de cada una." },
];

const PRODUCTOS = [
  {
    nombre: "Sentryx",
    tag: "Para colegios",
    ruta: "/sentryx",
    icono: "/sentryx-icon.svg",
    texto: "Comunicados con confirmación de lectura, boletines, asistencia y aulas virtuales en una sola app para Inicial, Primario y Secundario. Desde $660 por persona al mes.",
  },
  {
    nombre: "Event Box",
    tag: "Para empresas de eventos",
    ruta: "/eventbox",
    icono: "/eventbox-icon.svg",
    texto: "Stock, contenedores y órdenes de servicio con recorrido y responsable por etapa, para que cada evento salga sin sorpresas. Planes desde USD 520 por empresa al mes.",
  },
];

export default function Home() {
  const { hash } = useLocation();

  // Scroll suave a las anclas del menú (/#backend, /#saas, etc.)
  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Cursos de programación de WEARESRV",
      itemListElement: RUTA.map((key, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${CURSOS_GRABADOS[key].ruta}/inscripcion`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className={styles.homeContainer}>
      <Seo {...seoInicio()} jsonLd={jsonLd} />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.badge}>Escuela de programación online · Buenos Aires</div>
        <h1 className={styles.heroTitle}>
          Aprendé a programar <span className={styles.blue}>con IA</span> y <span className={styles.orange}>automatizá</span> tu trabajo
        </h1>
        <p className={styles.heroSubtitle}>
          Cursos grabados de Scripting y Python con IA, JavaScript y Backend con acceso de por vida, un intensivo con profe en vivo y
          certificados verificables online. Por una fracción de lo que cuesta una academia: pagás una vez y empezás hoy mismo.
        </p>
        <div className={styles.heroActions}>
          <Link to="/scripting/inscripcion" className={styles.btnPrimary}>
            Empezá desde {formatearPrecio(PRECIO_DESDE)} →
          </Link>
          <a href="#cursos" className={styles.btnSecondary}>
            Ver todos los cursos
          </a>
        </div>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.heroAlt}>
          ¿Necesitás software para tu empresa? Cotizalo acá →
        </a>

        <ul className={styles.trustBar}>
          <li>
            <strong>{TOTAL_CLASES}</strong> clases grabadas
          </li>
          <li>
            <strong>De por vida</strong> acceso al material
          </li>
          <li>
            <strong>Al instante</strong> te llega al mail
          </li>
          <li>
            <strong>Mercado Pago</strong> pago seguro
          </li>
        </ul>
      </section>

      {/* ---------- E-stellarium: la plataforma ya está abierta ---------- */}
      <section className={`${styles.section} ${styles.sectionAnuncio}`}>
        <div className={styles.estellarium}>
          <div className={styles.estellariumTexto}>
            <span className={styles.estellariumTag}>
              <i className={styles.estellariumPulso} aria-hidden="true" /> Ya está abierta
            </span>
            <h2 className={styles.estellariumTitle}>
              Ya llegó <span className={styles.blue}>E-stellarium</span>
            </h2>
            <p className={styles.estellariumBajada}>
              Nuestra plataforma para repasar cada curso jugando. Cada módulo es una estrella de tu constelación: la
              completás con desafíos de código, sin instalar ni ejecutar nada.
            </p>
            <ul className={styles.estellariumLista}>
              {ESTELLARIUM_PUNTOS.map(({ icono, titulo, texto }) => (
                <li key={titulo}>
                  <span className={styles.estellariumIcono}>
                    <Icono de={icono} />
                  </span>
                  <span>
                    <strong>{titulo}</strong> {texto}
                  </span>
                </li>
              ))}
            </ul>
            <div className={styles.estellariumBotones}>
              <a href={ESTELLARIUM_URL} className={styles.estellariumEntrar}>
                Entrar a E-stellarium
              </a>
              <a href={`${ESTELLARIUM_URL}/demo`} className={styles.estellariumDemo}>
                Probar la demo
              </a>
            </div>
            <p className={styles.estellariumNota}>
              La demo no necesita cuenta y te regala un cupón del 25&nbsp;% para tu primer curso. ¿Ya compraste? Tu cuenta
              está incluida: te llega un mail para crear tu contraseña.
            </p>
          </div>
          <Constelacion />
        </div>
      </section>

      {/* ---------- Dolores ---------- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          ¿Te suena <span className={styles.orange}>alguna</span>?
        </h2>
        <div className={styles.painGrid}>
          {DOLORES.map((d) => (
            <div key={d.texto} className={styles.painCard}>
              <span className={styles.painEmoji}>
                <Icono de={d.icono} />
              </span>
              <p>{d.texto}</p>
            </div>
          ))}
        </div>
        <p className={styles.painAnswer}>
          La solución no es mirar más videos: es seguir <strong>una ruta clara</strong>, de tu primera línea de código al
          backend profesional.
        </p>
      </section>

      {/* ---------- Cursos ---------- */}
      <section id="cursos" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Tu ruta de <span className={styles.blue}>aprendizaje</span>
          </h2>
          <p className={styles.sectionDescription}>Empezá por donde estés. Cada curso tiene acceso inmediato y de por vida.</p>
        </div>

        <div className={styles.coursesGrid}>
          {RUTA.map((key) => (
            <TarjetaCurso key={key} c={CURSOS_GRABADOS[key]} etiqueta={ETIQUETAS[key]} destacado={key === "scripting"} />
          ))}
        </div>

        <h3 className={styles.coursesSubtitle}>
          Más <span className={styles.green}>cursos</span>
        </h3>
        <div className={styles.coursesGrid}>
          {MAS.map((key) => (
            <TarjetaCurso key={key} c={CURSOS_GRABADOS[key]} etiqueta={ETIQUETAS_MAS[key]} verde />
          ))}
        </div>

        <Link to={`/${COMBO.ruta}/inscripcion`} className={styles.comboBanner}>
          <span className={styles.kidsIcon}>
            <Icono de={LuGift} />
          </span>
          <span>
            <strong>Combo Ruta Backend Completa:</strong> Master en JavaScript + Backend Avanzado por{" "}
            {formatearPrecio(COMBO.precio)}. Ahorrás {formatearPrecio(COMBO.precioRegular - COMBO.precio)} →
          </span>
        </Link>

        {TODO && (
          <Link to={linkPackTodo()} className={styles.comboBanner}>
            <span className={styles.kidsIcon}>
              <Icono de={LuRocket} />
            </span>
            <span>
              <strong>Cuantos más cursos sumás, menos pagás.</strong> Llevate los {TODO.cantidadCursos} cursos ({TODO.clases} clases) por{" "}
              {formatearPrecio(TODO.precio)}: uno por uno saldrían {formatearPrecio(TODO.precioSeparado)}. Ahorrás{" "}
              {formatearPrecio(TODO.ahorro)} →
            </span>
          </Link>
        )}

        <Link to="/full-stack/inscripcion" className={styles.liveBanner}>
          <span className={styles.liveDot} />
          <span>
            <strong>¿Preferís clases en vivo?</strong> Conocé el Intensivo Full Stack 2027 →
          </span>
        </Link>
      </section>

      {/* ---------- Cómo funciona ---------- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Así de <span className={styles.green}>simple</span>
        </h2>
        <ol className={styles.steps}>
          {PASOS.map((p, i) => (
            <li key={p.titulo}>
              <span className={styles.stepNum}>{i + 1}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Testimonios ---------- */}
      <section id="testimonios" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Lo que dicen <span className={styles.orange}>nuestros alumnos</span>
          </h2>
          <p className={styles.sectionDescription}>
            Feedback real de alumnos de nuestras clases. Puntaje promedio en la encuesta post-clase:{" "}
            <strong className={styles.green}>{promedioEncuesta().toLocaleString("es-AR", { maximumFractionDigits: 1 })}/10</strong> ({ENCUESTA.notas.length}{" "}
            respuestas).
          </p>
        </div>
        <ul className={styles.testimonios}>
          {TESTIMONIOS.map((t) => (
            <li key={t.texto} className={styles.testimonio}>
              <LuQuote className={styles.testimonioComillas} aria-hidden="true" />
              <blockquote>{t.texto}</blockquote>
              <footer>
                <span className={styles.testimonioAvatar} aria-hidden="true">
                  {t.autor === "Alumno/a" ? "?" : t.autor[0]}
                </span>
                <span>
                  <strong>{t.autor}</strong>
                  <small>{t.origen}</small>
                </span>
                {t.nota != null && (
                  <span className={styles.testimonioNota} aria-label={`Puntaje ${t.nota} de 10`}>
                    <LuStar aria-hidden="true" /> {t.nota}/10
                  </span>
                )}
              </footer>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------- El Develop ---------- */}
      <section className={styles.section}>
        <div className={styles.sectionGames}>
          <Link to="/el-develop" className={styles.gameBanner}>
            <span className={styles.gameIcon}>{"</>"}</span>
            <span className={styles.gameText}>
              <strong>Jugá gratis a El Develop</strong>
              <span>Simulá tu carrera IT: sobreviví a la inflación, los paros y los errores de Capa 8 hasta llegar a una Big Tech.</span>
            </span>
            <span className={styles.gameCta}>Jugar →</span>
          </Link>
          <Link target="_blank" to="https://dev-clicker.wearesrv.com/" className={styles.gameBanner}>
            <span className={styles.gameIcon}>
              <Icono de={LuBuilding2} style={{ fontSize: "1.6rem" }} />
            </span>
            <span className={styles.gameText}>
              <strong>Jugá gratis a Dev Clicker</strong>
              <span>Empezá programando desde tu casa, completá contratos, contratá
        desarrolladores y desbloqueá tecnologías. ¡Convertí tu pequeño
        emprendimiento en un imperio del software!</span>
            </span>
            <span className={styles.gameCta}>Jugar →</span>
          </Link>
        </div>
      </section>

      {/* ---------- Software a medida ---------- */}
      <section id="servicios" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Software <span className={styles.orange}>a medida</span> para tu empresa
          </h2>
          <p className={styles.sectionDescription}>
            Lo mismo que enseñamos, lo usamos para construir: backend, APIs y automatizaciones que funcionan.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          <div id="backend" className={styles.serviceCard}>
            <h3 className={styles.orange}>Backend & APIs</h3>
            <p>Microservicios, bases de datos optimizadas e integraciones con Node.js, Python y la nube.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
              Consultar por Backend →
            </a>
          </div>
          <div id="saas" className={styles.serviceCard}>
            <h3 className={styles.blue}>Plataformas Web & SaaS</h3>
            <p>Diseño y desarrollo de punta a punta de aplicaciones web preparadas para crecer.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
              Consultar por SaaS →
            </a>
          </div>
          <div id="automatizacion" className={styles.serviceCard}>
            <h3 className={styles.green}>Automatización & Cloud</h3>
            <p>Automatizamos procesos repetitivos con planillas, mails, bots e integraciones para que tu equipo gane horas.</p>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
              Consultar por Automatización →
            </a>
          </div>
        </div>
      </section>

      {/* ---------- Productos ---------- */}
      <section id="productos" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Nuestros <span className={styles.blue}>productos</span>
          </h2>
          <p className={styles.sectionDescription}>
            Plataformas propias, listas para usar, construidas con el mismo backend que hacemos para empresas.
          </p>
        </div>
        <div className={styles.productsGrid}>
          {PRODUCTOS.map((p) => (
            <Link key={p.ruta} to={p.ruta} className={styles.productCard}>
              <img src={p.icono} alt="" width="56" height="56" loading="lazy" decoding="async" />
              <span className={styles.productBody}>
                <span className={styles.productTag}>{p.tag}</span>
                <strong className={styles.productName}>{p.nombre}</strong>
                <span className={styles.productText}>{p.texto}</span>
                <span className={styles.productCta}>Conocer {p.nombre} →</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Preguntas frecuentes ---------- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          Preguntas <span className={styles.blue}>frecuentes</span>
        </h2>
        <div className={styles.faq}>
          {FAQ.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ---------- Manifiesto + cierre ---------- */}
      <section id="manifiesto" className={styles.section}>
        <div className={styles.manifestoWrapper}>
          <h2 className={styles.sectionTitle}>
            Nuestra <span className={styles.green}>filosofía</span>
          </h2>
          <p className={styles.manifestoText}>
            Dominar el código no es solo una habilidad técnica: es ganar libertad para construir tu futuro y diseñar tus
            propios términos. No venimos a enseñarte qué pensar, sino a darte las herramientas para que descubras cómo crear.
          </p>
          <p className={`${styles.quote} ${styles.orange}`}>"Acá no solo aprendés… ¡acá creás la mejor versión de vos mismo!"</p>
          <Link to="/scripting/inscripcion" className={styles.btnPrimary}>
            Empezar hoy por {formatearPrecio(PRECIO_DESDE)}
          </Link>
        </div>
      </section>
    </div>
  );
}
