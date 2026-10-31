import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";

// Contenido gratuito para gente que empieza en el mundo de la IA (plan 2027).
// El video y la guía de cada tema están en la carpeta de Drive «Fundamentos IA · WEARESRV», que llega por mail
// con el registro ("enCarpeta"). Si un tema se publica también abierto, completar "url" (video de YouTube) o
// "guia" (PDF) y la tarjeta muestra los botones. Un tema nuevo sin material va con enCarpeta: false ("En camino").
const YOUTUBE_URL = "https://www.youtube.com/@weareSRV";
const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";

const TEMAS = [
  {
    nombre: "Qué es la IA generativa",
    texto: "Modelos de lenguaje explicados sin humo: qué son, qué hacen bien, en qué se equivocan y por qué.",
    enCarpeta: true,
    url: null,
    guia: null,
  },
  {
    nombre: "Prompts que funcionan",
    texto: "Cómo pedirle a la IA lo que necesitás: contexto, ejemplos, formato de salida y cómo iterar la respuesta.",
    enCarpeta: true,
    url: null,
    guia: null,
  },
  {
    nombre: "IA en tu trabajo diario",
    texto: "Mails, planillas, resúmenes e informes: casos reales de oficina resueltos con IA, paso a paso.",
    enCarpeta: true,
    url: null,
    guia: null,
  },
  {
    nombre: "De la IA al código",
    texto: "Tu primer script generado con IA: cómo pedirlo, cómo probarlo y cómo darte cuenta si está mal.",
    enCarpeta: true,
    url: null,
    guia: null,
  },
];

export default function FundamentosIA() {
  // Registro a Fundamentos IA: netlify/functions/registro-fundamentos.js se lo pasa al Apps Script
  // (appscript-fundamentos.gs), que da el acceso al Drive y manda el mail.
  // En local no funciona (Vite no corre las Netlify Functions): probarlo en el deploy.
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | listo | error
  const [campoInvalido, setCampoInvalido] = useState(null);

  const registrar = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    setEnvio("enviando");
    setCampoInvalido(null);
    try {
      const res = await fetch("/.netlify/functions/registro-fundamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (res.ok) {
        setEnvio("listo");
        return;
      }
      const data = await res.json().catch(() => ({}));
      setCampoInvalido(res.status === 400 ? data.campo || null : null);
      setEnvio("error");
    } catch {
      setEnvio("error");
    }
  };

  return (
    <section className={styles.page}>
      <Seo
        title="Fundamentos de IA: videos y guías gratis para empezar | WEARESRV"
        description="Material gratuito para entender la IA y empezar a usarla hoy, sin saber programar: qué es la IA generativa, prompts que funcionan, IA en el trabajo diario y tu primer script con IA."
        path="/fundamentos-ia"
      />
      <div className={styles.inner}>
        <p className={styles.kicker}>100% gratis · 4 videos y sus guías · Acceso por mail</p>
        <h1 className={styles.title}>
          Fundamentos de <span className={styles.orange}>IA</span>
        </h1>
        <p className={styles.lead}>
          Videos y guías gratuitas para entender la IA y empezar a usarla hoy, sin saber programar. Ya están los 4
          temas, cada uno con su video y su guía en PDF, más una guía completa. Anotate más abajo y te llega por mail
          el acceso a la carpeta con todo el material; cada contenido nuevo se suma ahí y se anuncia en el canal de
          YouTube y en Discord.
        </p>

        <div className={styles.grid}>
          {TEMAS.map((t) => (
            <article key={t.nombre} className={styles.card}>
              <h2>{t.nombre}</h2>
              <p>{t.texto}</p>
              <div className={styles.cardAcciones}>
                {t.url ? (
                  <a className={styles.btnVideo} href={t.url} target="_blank" rel="noopener noreferrer">
                    ▶ Ver el video
                  </a>
                ) : t.enCarpeta ? (
                  <a className={styles.disponible} href="#registro">
                    ✅ Video y guía disponibles
                  </a>
                ) : (
                  <span className={styles.enCamino}>🎬 En camino</span>
                )}
                {t.guia && (
                  <a className={styles.btnGuia} href={t.guia} target="_blank" rel="noopener noreferrer">
                    ⤓ Descargar la guía
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className={styles.registro} id="registro">
          <h2>Recibí los videos y las guías por correo</h2>
          <p>
            Dejanos tus datos: te llega por correo el acceso a la carpeta con los 4 videos y las guías, y cada novedad
            apenas sale. Usá un mail de Gmail o de Google: la carpeta se abre con esa cuenta. Gratis, sin spam.
          </p>
          {envio === "listo" ? (
            <p className={styles.registroOk}>
              ✅ ¡Listo! Te llega por correo el acceso a la carpeta con los videos y las guías (si no lo ves, revisá
              el spam).
            </p>
          ) : (
            <form className={styles.form} onSubmit={registrar}>
              <input className={styles.campo} type="text" name="nombre" placeholder="Tu nombre" required autoComplete="name" />
              <input className={styles.campo} type="email" name="email" placeholder="Tu mail" required autoComplete="email" />
              <input className={styles.campo} type="tel" name="celular" placeholder="Tu celular (con código de área)" required autoComplete="tel" />
              <input className={styles.trampa} type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className={styles.btnRegistro} type="submit" disabled={envio === "enviando"}>
                {envio === "enviando" ? "Enviando..." : "Quiero recibirlos"}
              </button>
              <p className={styles.consentimiento}>
                Al enviar aceptás nuestra <Link to="/privacidad">política de privacidad</Link>. Podés darte de baja
                cuando quieras.
              </p>
              {envio === "error" && campoInvalido && (
                <p className={styles.registroError}>
                  {campoInvalido === "celular"
                    ? "Revisá el celular: escribilo con código de área, por ejemplo 11 2345-6789."
                    : campoInvalido === "email"
                      ? "Revisá el mail: parece que tiene un error."
                      : "Revisá tu nombre."}
                </p>
              )}
              {envio === "error" && !campoInvalido && (
                <p className={styles.registroError}>
                  No pudimos registrarte. Probá de nuevo o{" "}
                  <a href={whatsappLink("Hola, quiero recibir el material gratuito de Fundamentos IA")} target="_blank" rel="noopener noreferrer">
                    escribinos por WhatsApp
                  </a>.
                </p>
              )}
            </form>
          )}
        </div>

        <div className={styles.comunidad}>
          <h2>No te pierdas los próximos</h2>
          <p>Cada video y guía nueva se anuncia primero en la comunidad.</p>
          <div className={styles.acciones}>
            <a className={styles.btnYoutube} href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
              Suscribirme al canal
            </a>
            <a className={styles.btnDiscord} href={DISCORD_URL} target="_blank" rel="noopener noreferrer">
              Entrar al Discord
            </a>
          </div>
        </div>

        <div className={styles.siguiente}>
          <h2>¿Querés ir más allá de los fundamentos?</h2>
          <p>
            El <Link to="/scripting/inscripcion">Curso de Scripting</Link> te enseña a programar desde cero (con un
            módulo de automatización con IA en camino), y <Link to="/proximos-cursos?curso=ia-trabajo">IA para el
            trabajo</Link> ya tiene lista de espera.
          </p>
        </div>
      </div>
    </section>
  );
}
