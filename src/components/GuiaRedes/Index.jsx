import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { CURSOS_GRABADOS, estaEnPreventa, textoPreventa } from "../../data/cursosGrabados";
import { INTRO, VOCABULARIO, SECCIONES } from "./Guia";

// Guía gratis de los clips de Redes (Reels, Shorts y TikTok): las descripciones dicen «La guía gratis está en
// wearesrv.com/redes». La introducción y la sección 1 se leen abiertas; el resto y el PDF se desbloquean con el
// mail, que queda en el newsletter (netlify/functions/newsletter.js -> pestaña «Newsletter» de
// appscript-fundamentos.gs). El PDF sale de REDES\guias-redes\pdf: si se actualiza, reemplazar el archivo de
// public/guias con el mismo nombre y el texto de Guia.jsx.
const GUIA_PDF = "/guias/WEARESRV_Guia_Gratis_Redes_y_Nube_desde_cero.pdf";

// Quien ya la desbloqueó en este navegador no vuelve a ver el formulario
const CLAVE_DESBLOQUEO = "guiaRedesDesbloqueada";
const leerDesbloqueo = () => {
  try {
    return localStorage.getItem(CLAVE_DESBLOQUEO) === "1";
  } catch {
    return false;
  }
};

const Seccion = ({ s }) => (
  <section id={`seccion-${s.num}`} className={styles.bloque}>
    <h2 className={styles.bloqueTitulo}>
      <span className={styles.num}>{s.num}</span>
      {s.titulo}
    </h2>
    {s.contenido}
  </section>
);

export default function GuiaRedes() {
  const redes = CURSOS_GRABADOS.redes;
  const [primera, ...resto] = SECCIONES;
  const [desbloqueada, setDesbloqueada] = useState(leerDesbloqueo);
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | error

  // Solo un mail inválido frena el desbloqueo: si falla el guardado, la guía se abre igual (la promesa de los
  // clips es la guía gratis) y el error queda en el log de la función. En local siempre pasa eso, porque Vite
  // no corre las Netlify Functions.
  const desbloquear = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    setEnvio("enviando");
    try {
      const res = await fetch("/.netlify/functions/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, origen: "guia-redes" }),
      });
      if (res.status === 400) {
        setEnvio("error");
        return;
      }
    } catch {
      // Sin conexión con la función: se abre igual
    }
    try {
      localStorage.setItem(CLAVE_DESBLOQUEO, "1");
    } catch {
      // Navegador sin almacenamiento: se abre igual por esta visita
    }
    setDesbloqueada(true);
  };

  return (
    <section className={styles.page}>
      <Seo
        title="Guía gratis: Redes y nube desde cero | WEARESRV"
        description="La guía de los clips de WEARESRV, gratis: la nube, el usuario root de AWS, cómo viaja un mensaje, el cable de red, las 7 capas del modelo OSI, el switch, las IPs y los comandos de Cisco. Para leer en la web o descargar en PDF."
        path="/redes"
      />
      <div className={styles.inner}>
        <p className={styles.kicker}>100% gratis · Para leer acá o descargar en PDF</p>
        <h1 className={styles.title}>
          Redes y nube <span className={styles.orange}>desde cero</span>
        </h1>
        <p className={styles.lead}>
          Lo que viste en los clips, explicado fácil: la nube, cómo viaja un mensaje, el cable de red, las 7 capas, el
          switch, las IPs y los comandos de Cisco.
        </p>
        {desbloqueada ? (
          <a className={styles.btnDescargar} href={GUIA_PDF} target="_blank" rel="noopener noreferrer">
            ⤓ Descargar el PDF
          </a>
        ) : (
          <a className={styles.btnDescargar} href="#desbloquear">
            🔓 Desbloquear la guía gratis
          </a>
        )}

        <div className={styles.guia}>{INTRO}</div>

        <h2 className={styles.subtitulo}>¿Qué comentaste? Encontrá tu tema</h2>
        <div className={styles.grid}>
          {SECCIONES.filter((s) => s.palabra).map((s) => (
            <a
              key={s.num}
              className={styles.card}
              href={desbloqueada || s.num === 1 ? `#seccion-${s.num}` : "#desbloquear"}
            >
              <div className={styles.cardCabecera}>
                <span className={styles.palabra}>{s.palabra}</span>
                <span className={styles.seccion}>
                  {desbloqueada || s.num === 1 ? `Sección ${s.num}` : `🔒 Sección ${s.num}`}
                </span>
              </div>
              <h3>{s.titulo}</h3>
              <p>{s.resumen}</p>
            </a>
          ))}
        </div>

        <div className={styles.guia}>
          <Seccion s={primera} />

          {desbloqueada ? (
            <>
              <div className={styles.desbloqueada}>
                <p>✅ ¡Listo! Ya tenés la guía completa. Seguí leyendo acá o bajala para tenerla siempre a mano.</p>
                <a className={styles.btnSecundario} href={GUIA_PDF} target="_blank" rel="noopener noreferrer">
                  ⤓ Descargar el PDF
                </a>
              </div>
              <section className={styles.bloque}>
                <h2 className={styles.bloqueTitulo}>Vocabulario para arrancar</h2>
                {VOCABULARIO}
              </section>
              {resto.map((s) => (
                <Seccion key={s.num} s={s} />
              ))}
            </>
          ) : (
            <div className={styles.candado} id="desbloquear">
              <div className={styles.adelanto} aria-hidden="true">
                <h2 className={styles.bloqueTitulo}>
                  <span className={styles.num}>2</span>
                  {resto[0].titulo}
                </h2>
                <p>
                  Cuando creás una cuenta de AWS, el primer usuario que existe es el root: el dueño de todo. Puede hacer
                  absolutamente cualquier cosa…
                </p>
              </div>
              <div className={styles.desbloquear}>
                <h2>Desbloqueá la guía completa, gratis</h2>
                <p>
                  Dejanos tu mail y se abre al instante el resto: el vocabulario, el usuario root de AWS, el viaje de tu
                  mensaje, el cable y sus colores, las 7 capas, el switch, las IPs, la chuleta de Cisco, tu primer reto
                  en Packet Tracer y la autoevaluación. Además, el PDF para descargar.
                </p>
                <form className={styles.form} onSubmit={desbloquear}>
                  <input
                    className={styles.campo}
                    type="email"
                    name="email"
                    placeholder="Tu mail"
                    required
                    autoComplete="email"
                  />
                  <input className={styles.trampa} type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                  <button className={styles.btnDesbloquear} type="submit" disabled={envio === "enviando"}>
                    {envio === "enviando" ? "Desbloqueando..." : "Desbloquear la guía"}
                  </button>
                  {envio === "error" && <p className={styles.error}>Revisá el mail: parece que tiene un error.</p>}
                  <p className={styles.consentimiento}>
                    Te sumás al newsletter de WEARESRV: guías gratis y novedades de redes, nube y programación. Al
                    enviar aceptás nuestra <Link to="/privacidad">política de privacidad</Link>. Podés darte de baja
                    cuando quieras.
                  </p>
                </form>
              </div>
            </div>
          )}
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
          </div>
        </div>
      </div>
    </section>
  );
}
