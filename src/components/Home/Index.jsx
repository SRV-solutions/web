import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./style.module.css";
import Seo, { SITE_URL } from "../Seo";
import { CURSOS_GRABADOS, formatearPrecio } from "../../data/cursosGrabados";

const WHATSAPP_URL = `https://wa.me/5491123869799?text=${encodeURIComponent("Hola, quiero cotizar un software")}`;

// Orden de la ruta de aprendizaje
const RUTA = ["scripting", "python", "fundamentos-backend", "backend-avanzado"];
const ETIQUETAS = {
  scripting: "Paso 1 · Empezá acá",
  python: "Paso 2 · Python a fondo",
  "fundamentos-backend": "Paso 2 · Backend con JavaScript",
  "backend-avanzado": "Paso 3 · Nivel profesional",
};

const TOTAL_CLASES = RUTA.reduce((total, key) => total + CURSOS_GRABADOS[key].clases, 0);
const PRECIO_DESDE = Math.min(...RUTA.map((key) => CURSOS_GRABADOS[key].precio));

const DOLORES = [
  { emoji: "🌀", texto: "Viste mil tutoriales sueltos y todavía no sabés por dónde empezar." },
  { emoji: "💸", texto: "Querés cambiar de laburo, pero los cursos cuestan una fortuna." },
  { emoji: "⏳", texto: "Hacés a mano tareas que una computadora resolvería en segundos." },
];

const PASOS = [
  { titulo: "Elegís tu curso", texto: "Si nunca programaste, arrancá por Scripting. Si ya tenés bases, saltá directo a Python o Backend." },
  { titulo: "Pagás una sola vez", texto: "Con Mercado Pago, sin suscripciones. El acceso te llega al mail apenas se aprueba el pago." },
  { titulo: "Aprendés a tu ritmo", texto: "Clases grabadas para ver cuando quieras, guías de estudio y una comunidad en Discord." },
];

const FAQ = [
  { q: "Nunca programé, ¿por dónde empiezo?", a: "Por el Curso de Scripting: arranca desde cero, cuesta $15.000 y te da la base de lógica para después seguir con Python o Backend." },
  { q: "¿Las clases son en vivo o grabadas?", a: "Los cursos de Scripting, Python, Backend Fundamentos y Backend Avanzado son grabados, con acceso de por vida. El Intensivo Full Stack es una cursada en vivo." },
  { q: "¿Cómo recibo el curso después de pagar?", a: "Automáticamente: apenas Mercado Pago aprueba el pago, te llega un mail con el acceso a la carpeta del curso en Google Drive." },
  { q: "¿Hacen software para empresas?", a: "Sí. Además de la escuela, desarrollamos backend, APIs, plataformas web y automatizaciones a medida. Escribinos por WhatsApp y lo cotizamos." },
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
      <Seo
        title="Aprendé a programar desde cero | Cursos de Scripting, Python y Backend | WEARESRV"
        description={`Cursos grabados de programación con acceso de por vida: Scripting, Python y Backend con Node.js. ${TOTAL_CLASES} clases grabadas y guías de estudio. Desde ${formatearPrecio(PRECIO_DESDE)}.`}
        path="/"
        jsonLd={jsonLd}
      />

      {/* ---------- Hero ---------- */}
      <section className={styles.hero}>
        <div className={styles.badge}>Escuela de programación online · Buenos Aires</div>
        <h1 className={styles.heroTitle}>
          Aprendé a programar <span className={styles.blue}>desde cero</span> y entrá al <span className={styles.orange}>mundo IT</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Cursos grabados de Scripting, Python y Backend con acceso de por vida, guías de estudio y comunidad. Pagás una
          vez y empezás hoy mismo.
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

      {/* ---------- Dolores ---------- */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          ¿Te suena <span className={styles.orange}>alguna</span>?
        </h2>
        <div className={styles.painGrid}>
          {DOLORES.map((d) => (
            <div key={d.texto} className={styles.painCard}>
              <span className={styles.painEmoji}>{d.emoji}</span>
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
          {RUTA.map((key) => {
            const c = CURSOS_GRABADOS[key];
            const destacado = key === "scripting";
            return (
              <article key={key} className={`${styles.courseCard} ${destacado ? styles.courseFeatured : ""}`}>
                <span className={styles.courseStep}>{ETIQUETAS[key]}</span>
                <h3>
                  {c.tituloInicio} <span className={styles.orange}>{c.tituloDestacado}</span>
                </h3>
                <p className={styles.courseHook}>{c.gancho}</p>
                <ul className={styles.courseMeta}>
                  <li>🎬 {c.clases} clases grabadas</li>
                  <li>🎯 {c.nivel.split(" · ")[0]}</li>
                </ul>
                <div className={styles.coursePrice}>
                  <span className={styles.oldPrice}>{formatearPrecio(c.precioRegular)}</span>
                  <strong>{formatearPrecio(c.precio)}</strong>
                </div>
                <Link to={`/${c.ruta}/inscripcion`} className={destacado ? styles.btnPrimary : styles.btnSecondary}>
                  Ver el curso
                </Link>
              </article>
            );
          })}
        </div>

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

      {/* ---------- El Develop ---------- */}
      <section className={styles.section}>
        <Link to="/el-develop" className={styles.gameBanner}>
          <span className={styles.gameIcon}>{"</>"}</span>
          <span className={styles.gameText}>
            <strong>Jugá gratis a El Develop</strong>
            <span>Simulá tu carrera IT: sobreviví a la inflación, los paros y los errores de Capa 8 hasta llegar a una Big Tech.</span>
          </span>
          <span className={styles.gameCta}>Jugar →</span>
        </Link>
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
