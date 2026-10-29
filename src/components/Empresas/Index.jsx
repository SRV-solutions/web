import React from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";

// Capacitación in-company y paquete para colegios (plan 2027, Tanda 2).
// ⚠ Antes de publicar: confirmar el estado del alta como Unidad Capacitadora (UCAP) en DNA2
// para el programa de Crédito Fiscal; el texto de abajo está escrito en neutro a propósito.
const TALLERES = [
  {
    nombre: "IA para el trabajo",
    tag: "El más pedido",
    texto:
      "Tu equipo usando IA todos los días: redacción de mails e informes, análisis de datos, resúmenes de reuniones y prompts que funcionan, con reglas claras para no exponer datos de la empresa.",
    temas: ["Prompts efectivos para el trabajo real", "Automatizar informes y reportes", "IA con datos propios, sin filtrarlos"],
  },
  {
    nombre: "Automatización con Python y Apps Script",
    tag: "Para equipos administrativos",
    texto:
      "Detectamos los procesos repetitivos de tu equipo (planillas, mails, reportes) y los convertimos en automatizaciones que quedan funcionando y documentadas.",
    temas: ["Google Sheets, Gmail y Drive automatizados", "Scripts en Python a medida", "El equipo aprende a mantenerlos"],
  },
  {
    nombre: "AWS y DevOps",
    tag: "Para equipos técnicos",
    texto:
      "De los servidores a la nube: fundamentos de AWS, despliegues, buenas prácticas y costos bajo control, con ejercicios sobre la infraestructura real del equipo.",
    temas: ["Fundamentos de AWS y redes", "Linux y despliegues", "Buenas prácticas y seguridad"],
  },
];

const COLEGIO = [
  { nombre: "IA para docentes", texto: "Taller práctico: planificaciones, correcciones, rúbricas y material didáctico con IA, pensado para el aula real." },
  { nombre: "Scratch para alumnos", texto: "Programación desde cero para primaria y secundaria: historias animadas y videojuegos propios." },
  { nombre: "Sentryx", texto: "Nuestra plataforma de gestión escolar: comunicados con confirmación de lectura, boletines, asistencia y aulas virtuales." },
];

const WA_EMPRESAS = whatsappLink("Hola, quiero una capacitación para mi empresa");
const WA_COLEGIOS = whatsappLink("Hola, soy de un colegio y quiero saber más del paquete para instituciones");

export default function Empresas() {
  return (
    <section className={styles.page}>
      <Seo
        title="Capacitación para empresas e instituciones | IA, automatización y AWS | WEARESRV"
        description="Talleres de IA, automatización con Python y Apps Script, y AWS para equipos. En vivo, a medida y con certificado verificable. Paquete especial para colegios con IA para docentes, Scratch y Sentryx."
        path="/empresas"
      />
      <div className={styles.inner}>
        <p className={styles.kicker}>Empresas e instituciones</p>
        <h1 className={styles.title}>
          Capacitá a tu equipo en <span className={styles.orange}>IA y automatización</span>
        </h1>
        <p className={styles.lead}>
          Talleres en vivo, a medida del equipo y con certificado verificable para cada participante. Los dicta el
          mismo equipo que programa y automatiza todos los días: salís del taller con cosas funcionando, no con una
          charla teórica.
        </p>

        <div className={styles.grid}>
          {TALLERES.map((t) => (
            <article key={t.nombre} className={styles.card}>
              <span className={styles.cardTag}>{t.tag}</span>
              <h2>{t.nombre}</h2>
              <p>{t.texto}</p>
              <ul>
                {t.temas.map((tema) => (
                  <li key={tema}>✓ {tema}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className={styles.modalidad}>
          <h2 className={styles.h2}>Cómo trabajamos</h2>
          <ul>
            <li>En vivo por videollamada, o presencial en Buenos Aires.</li>
            <li>El contenido se arma sobre los procesos y las herramientas reales de tu equipo.</li>
            <li>Cada participante recibe un certificado verificable online, como nuestros alumnos.</li>
            <li>Si después del taller quieren automatizar en serio, también desarrollamos el software a medida.</li>
          </ul>
        </div>

        <div className={styles.creditoFiscal}>
          <h2>💡 Capacitación con crédito fiscal</h2>
          <p>
            Si tu empresa es PyME, podés recuperar parte de lo que invertís en capacitación a través del programa de
            Crédito Fiscal para Capacitación. Escribinos y vemos juntos si tu empresa califica y cómo aprovecharlo.
          </p>
        </div>

        <h2 className={styles.h2}>Para colegios</h2>
        <p className={styles.lead}>
          Un solo proveedor para digitalizar la escuela: formación para docentes, programación para alumnos y la
          plataforma de gestión.
        </p>
        <div className={styles.grid}>
          {COLEGIO.map((c) => (
            <article key={c.nombre} className={styles.card}>
              <h2>{c.nombre}</h2>
              <p>{c.texto}</p>
            </article>
          ))}
        </div>
        <p className={styles.notaColegio}>
          Conocé más de Sentryx en <Link to="/sentryx">su página</Link> y de Scratch en{" "}
          <Link to="/scratch/inscripcion">Scratch para Chicos</Link>.
        </p>

        <div className={styles.finalCta}>
          <h2>Contanos qué necesita tu equipo</h2>
          <p>Te respondemos con una propuesta concreta: temario, duración y precio.</p>
          <div className={styles.acciones}>
            <a className={styles.btnWhatsapp} href={WA_EMPRESAS} target="_blank" rel="noopener noreferrer">
              Cotizar para mi empresa
            </a>
            <a className={styles.btnSecundario} href={WA_COLEGIOS} target="_blank" rel="noopener noreferrer">
              Soy de un colegio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
