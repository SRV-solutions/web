import React from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { CURSOS_GRABADOS, estaEnPreventa, textoPreventa } from "../../data/cursosGrabados";

// Guía gratis de los clips de Redes (Reels, Shorts y TikTok): las descripciones dicen «La guía gratis está en
// wearesrv.com/redes». Se descarga directo, sin registro. El PDF sale de REDES\guias-redes\pdf: si se
// actualiza, reemplazar el archivo de public/guias con el mismo nombre.
const GUIA_PDF = "/guias/WEARESRV_Guia_Gratis_Redes_y_Nube_desde_cero.pdf";

// Mismas secciones que la tabla «Encontrá tu tema» de la guía: la palabra es la que se comenta en cada clip
const TEMAS = [
  {
    palabra: "NUBE",
    titulo: "La nube es la computadora de otro",
    texto: "Servidores, data centers, regiones y zonas de disponibilidad, y cuál es la región de AWS más cercana.",
  },
  {
    palabra: "AWS",
    titulo: "El usuario root: la llave maestra",
    texto: "Por qué no se usa para trabajar y los cinco hábitos que te cuidan la cuenta: MFA, IAM y alerta de presupuesto.",
  },
  {
    palabra: "RED",
    titulo: "El viaje de tu mensaje",
    texto: "Paquetes, nodos, Las Toninas y los cables submarinos, y por qué internet no se apaga con un botón.",
  },
  {
    palabra: "CABLE",
    titulo: "El cable de red y sus colores",
    texto: "Los 8 colores de la norma T568B, cómo se arma un cable paso a paso y cuándo va directo o cruzado.",
  },
  {
    palabra: "OSI",
    titulo: "Las 7 capas (y la capa 8)",
    texto: "Qué hace cada capa, con ejemplos, y el chiste que todo técnico conoce.",
  },
  {
    palabra: "SWITCH",
    titulo: "Hub, switch y cómo aprende",
    texto: "Half y full duplex, la tabla MAC y el switch explicado como un portero nuevo.",
  },
  {
    palabra: "IP",
    titulo: "¿Por qué 254 y no 256?",
    texto: "Qué quiere decir /24, la dirección de red, el broadcast y los comandos para mirar tu red desde Windows.",
  },
  {
    palabra: "CISCO",
    titulo: "Los comandos de Cisco, la chuleta",
    texto: "Los modos de la consola, la configuración básica, cómo guardarla y qué hacer si se queda pensando.",
  },
  {
    palabra: "PRÁCTICA",
    titulo: "Tu primer reto en Packet Tracer",
    texto: "Una red con un switch y 3 PCs en 10 minutos, y una autoevaluación de 8 preguntas para cerrar.",
  },
];

export default function GuiaRedes() {
  const redes = CURSOS_GRABADOS.redes;

  return (
    <section className={styles.page}>
      <Seo
        title="Guía gratis: Redes y nube desde cero | WEARESRV"
        description="La guía de los clips de WEARESRV, gratis y en PDF: la nube, el usuario root de AWS, cómo viaja un mensaje, el cable de red, las 7 capas del modelo OSI, el switch, las IPs y los comandos de Cisco."
        path="/redes"
      />
      <div className={styles.inner}>
        <p className={styles.kicker}>100% gratis · Guía en PDF · Sin registro</p>
        <h1 className={styles.title}>
          Redes y nube <span className={styles.orange}>desde cero</span>
        </h1>
        <p className={styles.lead}>
          Lo que viste en los clips, explicado fácil y en un solo PDF: la nube, cómo viaja un mensaje, el cable de red,
          las 7 capas, el switch, las IPs y los comandos de Cisco. Descargala y buscá el tema que comentaste.
        </p>
        <a className={styles.btnDescargar} href={GUIA_PDF} target="_blank" rel="noopener noreferrer">
          ⤓ Descargar la guía gratis
        </a>

        <h2 className={styles.subtitulo}>¿Qué comentaste? Encontrá tu tema</h2>
        <div className={styles.grid}>
          {TEMAS.map((t, i) => (
            <article key={t.palabra} className={styles.card}>
              <div className={styles.cardCabecera}>
                <span className={styles.palabra}>{t.palabra}</span>
                <span className={styles.seccion}>Sección {i + 1}</span>
              </div>
              <h3>{t.titulo}</h3>
              <p>{t.texto}</p>
            </article>
          ))}
        </div>

        <div className={styles.curso}>
          <h2>¿Querés seguir?</h2>
          <p>
            En el curso <strong>Redes, Linux y AWS</strong> armamos todo esto en la práctica: redes con Cisco Packet
            Tracer, servidores con Ubuntu y la nube con AWS, hasta rendir la certificación AWS Certified Cloud
            Practitioner.
            {estaEnPreventa(redes) && <> {textoPreventa(redes)}.</>}
          </p>
          <div className={styles.acciones}>
            <Link className={styles.btnCurso} to="/redes/inscripcion">
              Ver el curso
            </Link>
            <a className={styles.btnSecundario} href={GUIA_PDF} target="_blank" rel="noopener noreferrer">
              ⤓ Descargar la guía
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
