import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import Seo, { SITE_URL } from "../Seo";
import { whatsappLink } from "../../data/legal";
import { trackEvent } from "../../data/metaPixel";
import {
  ANTES_DESPUES,
  BLOQUES,
  CICLO,
  DATOS_AHORA,
  FAQ,
  HERO_IMAGEN,
  KYDO_CIFRAS,
  KYDO_IMG,
  KYDO_MUESTRA_URL,
  KYDO_PARA,
  KYDO_URL,
  OG_IMAGEN,
  OG_IMAGEN_ALT,
  PASOS,
  QR_IMAGEN,
  ROLES,
  SEGURIDAD,
} from "./contenido";

const SENTRYX_URL = "https://sentryx.wearesrv.com/";
const WHATSAPP_DEMO = whatsappLink("Hola, quiero una demo de Sentryx para mi colegio");
const WHATSAPP_KYDO = whatsappLink("Hola, quiero Sentryx con Kydo para mi colegio");

// En el plan Ampliado se elige con o sin Kydo; los planes Profesional e Integral ya lo incluyen
const AMPLIADO = { conKydo: 999, sinKydo: 720 };
const KYDO_EXTRA = AMPLIADO.conKydo - AMPLIADO.sinKydo;

const DESCRIPCION =
  "Comunicados con confirmación de lectura, notas, boletines, asistencia, aulas y convivencia en un solo lugar. Para colegios con Inicial, Primario y Secundario. Pedí tu demo.";

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Sentryx",
    applicationCategory: "EducationalApplication",
    // "Web" hasta que la app esté publicada en las tiendas (entonces: "Web, Android, iOS")
    operatingSystem: "Web",
    url: SENTRYX_URL,
    description:
      "Plataforma escolar para colegios de Inicial, Primario y Secundario: comunicados con confirmación de lectura, calificaciones, boletines, asistencia y aulas virtuales.",
    publisher: { "@id": "https://wearesrv.com/#organization" },
    offers: {
      "@type": "Offer",
      price: "660",
      priceCurrency: "ARS",
      description: "Plan Básico, por persona activa por mes",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

// Clic en un botón que abre WhatsApp: evento de Meta (trackEvent solo manda desde wearesrv.com) y de Tag Manager
const medirContacto = (nombre) => {
  trackEvent("Contact", { content_name: nombre });
  window.dataLayer?.push({ event: `${nombre}_click` });
};

const BotonDemo = () => (
  <a
    href={WHATSAPP_DEMO}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.btnPrimary}
    onClick={() => medirContacto("sentryx_demo")}
  >
    Pedir una demo por WhatsApp →
  </a>
);

const BotonIngresar = () => (
  <a href={SENTRYX_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
    Ya tengo usuario: ingresar →
  </a>
);

const KydoLink = () => <a href="#kydo">Kydo</a>;

export default function Sentryx() {
  const [conKydo, setConKydo] = useState(true);
  const conOSin = conKydo ? "con" : "sin";
  // Sin Kydo, sus puntos quedan tachados: se ve lo que se pierde y la tarjeta no cambia de alto
  const claseKydo = conKydo ? undefined : styles.featureApagada;

  // og:image:alt está fijo en index.html y Seo no lo maneja: se cambia solo mientras se está en esta página
  useEffect(() => {
    const meta = document.querySelector('meta[property="og:image:alt"]');
    if (!meta) return undefined;
    const anterior = meta.getAttribute("content");
    meta.setAttribute("content", OG_IMAGEN_ALT);
    return () => meta.setAttribute("content", anterior);
  }, []);

  return (
    <div className={styles.sentryxContainer}>
      <Seo
        title="Sentryx - Plataforma escolar digital | WEARESRV"
        description={DESCRIPCION}
        path="/sentryx"
        image={`${SITE_URL}${OG_IMAGEN}`}
        jsonLd={JSON_LD}
      />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroTexto}>
          <div className={styles.badge}>Sentryx · Plataforma escolar digital</div>
          <h1 className={styles.heroTitle}>
            Todo tu colegio.
            <br />
            <span className={styles.blue}>Una sola plataforma</span>
            <span className={styles.highlight}>.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Comunicados, notas, boletines, asistencia, aulas y convivencia en un solo lugar. Para colegios con Inicial,
            Primario y Secundario.
          </p>
          <div className={styles.acciones}>
            <BotonDemo />
            <BotonIngresar />
          </div>
          <p className={styles.heroDesde}>Desde $660 por persona, por mes.</p>
        </div>
        <img
          className={styles.heroImagen}
          src={HERO_IMAGEN.src}
          width={HERO_IMAGEN.ancho}
          height={HERO_IMAGEN.alto}
          alt={HERO_IMAGEN.alt}
          fetchpriority="high"
        />
      </section>

      {/* Antes y después */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>Tu colegio funciona en demasiados lugares a la vez.</h2>
        <p className={styles.bajada}>
          Los avisos en el grupo de WhatsApp. Las notas en un Excel. Las faltas en la planilla de preceptoría. Las actas
          en una carpeta. Y la secretaría, atendiendo las preguntas de todo eso.
        </p>
        <table className={styles.antesDespues}>
          <thead>
            <tr>
              <th scope="col">Hoy</th>
              <th scope="col">Con Sentryx</th>
            </tr>
          </thead>
          <tbody>
            {ANTES_DESPUES.map(([antes, despues]) => (
              <tr key={antes}>
                <td>
                  <s>{antes}</s>
                </td>
                <td>{despues}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Qué hace */}
      <section className={styles.seccion}>
        <div className={styles.bloques}>
          {BLOQUES.map((b) => (
            <article key={b.titulo} className={styles.bloque}>
              <div className={styles.bloqueTexto}>
                <h2>{b.titulo}</h2>
                <ul className={styles.features}>
                  {b.puntos.map((punto) => (
                    <li key={punto}>{punto}</li>
                  ))}
                </ul>
              </div>
              <img
                className={styles.bloqueImagen}
                src={b.imagen.src}
                width={b.imagen.ancho}
                height={b.imagen.alto}
                alt={b.imagen.alt}
                loading="lazy"
              />
            </article>
          ))}
        </div>
      </section>

      {/* Por qué ahora: los textos del ciclo están en CICLO (contenido.js) */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>{CICLO.titulo}</h2>
        <p className={styles.bajada}>{CICLO.bajada}</p>
        <div className={styles.datos}>
          {DATOS_AHORA.map((d) => (
            <div key={d.valor} className={styles.dato}>
              <strong>{d.valor}</strong>
              <p>{d.texto}</p>
              <a href={d.url} target="_blank" rel="noopener noreferrer">
                Fuente: {d.fuente}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Para cada persona, lo suyo */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>Cada rol ve lo que le toca. Y nada más.</h2>
        <div className={styles.tarjetas}>
          {ROLES.map((r) => (
            <div key={r.rol} className={styles.tarjeta}>
              <h3>{r.rol}</h3>
              <p>{r.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Seguridad y orden */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>Seguridad y orden</h2>
        <div className={styles.tarjetas}>
          {SEGURIDAD.map((s) => (
            <div key={s.titulo} className={styles.tarjeta}>
              <h3>{s.titulo}</h3>
              <p>{s.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Planes. Cada precio es por persona por mes */}
      <section className={styles.seccion} id="planes">
        <h2 className={styles.titulo}>Planes disponibles</h2>
        <p className={styles.bajada}>
          Precios en pesos argentinos, por persona por mes. Se cobra por cada persona con acceso en el mes: personal,
          familias y estudiantes con cuenta. Cada persona puede tener su plan: no hace falta el mismo para todos.
        </p>
        <div className={styles.plansGrid}>
          <div className={styles.planCard}>
            <h3>Plan Básico</h3>
            <p className={styles.price}>$660/mes</p>
            <p className={styles.storage}>5 GB</p>
            <ul className={styles.features}>
              <li>Comunicados con confirmación de lectura</li>
              <li>Conversaciones con familias y estudiantes</li>
              <li>Notas y boletines</li>
              <li>Asistencia y alertas</li>
              <li>Aulas, canales y calendario del aula</li>
              <li>Convivencia</li>
              <li>Roles, permisos y auditoría</li>
            </ul>
          </div>

          <div className={styles.planCard}>
            <h3>Plan Ampliado</h3>
            <div className={styles.kydoSelector} role="group" aria-label="Elegí el plan con o sin Kydo">
              <button
                type="button"
                aria-pressed={conKydo}
                className={conKydo ? styles.kydoOpcionActiva : styles.kydoOpcion}
                onClick={() => setConKydo(true)}
              >
                Con Kydo
              </button>
              <button
                type="button"
                aria-pressed={!conKydo}
                className={conKydo ? styles.kydoOpcion : styles.kydoOpcionActiva}
                onClick={() => setConKydo(false)}
              >
                Sin Kydo
              </button>
            </div>
            <p className={styles.price} aria-live="polite">
              ${conKydo ? AMPLIADO.conKydo : AMPLIADO.sinKydo}/mes
            </p>
            <p className={styles.planSuma}>
              {conKydo ? `Kydo incluido por $${KYDO_EXTRA} más` : `Sumá Kydo por solo $${KYDO_EXTRA} más`}
            </p>
            <p className={styles.storage}>15 GB</p>
            <ul className={styles.features}>
              <li>Todo lo del Básico</li>
              <li>Más espacio para archivos</li>
              <li className={claseKydo}>
                <KydoLink />: juegos de 1.º a 7.º grado sobre el Diseño Curricular de CABA
              </li>
              <li className={claseKydo}>Lecciones en video cuando se traban</li>
              <li className={claseKydo}>Panel del curso para la maestra</li>
            </ul>
            <a
              href={whatsappLink(`Hola, quiero el Plan Ampliado ${conOSin} Kydo de Sentryx para mi colegio`)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPlan}
              onClick={() => medirContacto("sentryx_kydo")}
            >
              Quiero este plan {conOSin} Kydo
            </a>
          </div>

          <div className={styles.planCard}>
            <h3>Plan Profesional</h3>
            <p className={styles.price}>$2.450/mes</p>
            <p className={styles.storage}>30 GB</p>
            <ul className={styles.features}>
              <li>Todo lo del Ampliado</li>
              <li>
                <KydoLink /> incluido
              </li>
              <li>Recibos de sueldo digitales con conformidad</li>
              <li>Legajo docente: cargos, horas, turnos y horario</li>
            </ul>
          </div>

          <div className={styles.planCard}>
            <h3>Plan Integral</h3>
            <p className={styles.price}>$3.300/mes</p>
            <p className={styles.storage}>50 GB</p>
            <ul className={styles.features}>
              <li>Todo lo del Profesional</li>
              <li>
                <KydoLink /> incluido
              </li>
              <li>Calendario de actos y eventos</li>
              <li>Encargados de actos con su espacio de trabajo</li>
              <li>Programas de las materias</li>
              <li>Juegos de preguntas en vivo o como tarea</li>
            </ul>
          </div>
        </div>

        {/* Kydo */}
        <div className={styles.kydo} id="kydo">
          <div className={styles.kydoMarca}>
            <img src="/kydo-icon.svg" alt="" width="42" height="40" />
            <span>Kydo</span>
          </div>
          <h2 className={styles.titulo}>Los chicos juegan y la maestra ve qué aprendieron</h2>
          <p className={styles.bajada}>
            Kydo es una aplicación para primaria, de 1.º a 7.º grado, con actividades para jugar en el celular o la
            tablet, armadas sobre los NAP y el Diseño Curricular de la Ciudad de Buenos Aires. Funciona en el navegador:
            el colegio no tiene que instalar ni cargar nada. Viene incluido en los planes Profesional e Integral, y se
            suma al Ampliado por ${KYDO_EXTRA} más por persona.
          </p>

          <div className={styles.kydoCifras}>
            {KYDO_CIFRAS.map((c) => (
              <div key={c.texto} className={styles.kydoCifra}>
                <strong>{c.valor}</strong>
                <span>{c.texto}</span>
              </div>
            ))}
          </div>

          <div className={styles.kydoGrid}>
            {KYDO_PARA.map((p) => (
              <article key={p.titulo} className={styles.kydoCard}>
                <div className={styles.kydoImagen}>
                  <img src={`${KYDO_IMG}/${p.imagen}`} alt={p.alt} loading="lazy" style={{ objectPosition: p.posicion }} />
                </div>
                <h3>{p.titulo}</h3>
                <ul className={styles.features}>
                  {p.puntos.map((punto) => (
                    <li key={punto}>{punto}</li>
                  ))}
                </ul>
                {p.link && (
                  <a href={p.link.url} target="_blank" rel="noopener noreferrer" className={styles.kydoLink}>
                    {p.link.texto}
                  </a>
                )}
              </article>
            ))}
          </div>

          <div className={styles.acciones}>
            <a
              href={WHATSAPP_KYDO}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
              onClick={() => medirContacto("sentryx_kydo")}
            >
              Quiero Kydo en mi colegio
            </a>
            <a href={KYDO_MUESTRA_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
              Jugar una actividad de muestra
            </a>
            <a href={KYDO_URL} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary}>
              Conocer más de Kydo
            </a>
          </div>
          <p className={styles.kydoNota}>
            Kydo es una aplicación de su creador, que ofrecemos en Sentryx con su autorización.
          </p>
        </div>
      </section>

      {/* Cómo empezamos */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>Cómo empezamos</h2>
        <ol className={styles.pasos}>
          {PASOS.map((p) => (
            <li key={p.titulo}>
              <strong>{p.titulo}</strong> {p.texto}
            </li>
          ))}
        </ol>
      </section>

      {/* Preguntas frecuentes: las mismas del JSON-LD FAQPage */}
      <section className={styles.seccion}>
        <h2 className={styles.titulo}>Preguntas frecuentes</h2>
        <div className={styles.faq}>
          {FAQ.map((f) => (
            <details key={f.q} className={styles.faqItem}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Cierre */}
      <section className={styles.seccion}>
        <div className={styles.cierre}>
          <div className={styles.cierreTexto}>
            <h2 className={styles.titulo}>Pedí tu demo.</h2>
            <p className={styles.bajada}>{CICLO.cierre}</p>
            <div className={styles.acciones}>
              <BotonDemo />
              <BotonIngresar />
            </div>
            <p className={styles.cierreContacto}>WhatsApp 11 2386-9799 · info@wearesrv.com</p>
          </div>
          <div className={styles.cierreQr}>
            <img src={QR_IMAGEN} width="900" height="900" alt="Código QR para pedir una demo por WhatsApp" loading="lazy" />
            <p>Escaneá para escribirnos</p>
          </div>
        </div>
      </section>

      {/* Back to Home */}
      <section className={styles.backSection}>
        <Link to="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </section>
    </div>
  );
}
