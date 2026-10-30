import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";

// Contenido gratuito para gente que empieza en el mundo de la IA (plan 2027).
// Los videos y las guías los va subiendo Marcos: completar "url" (video de YouTube)
// o "guia" (PDF en Drive) en cada tema y la tarjeta pasa sola de "En camino" a los botones.
const YOUTUBE_URL = "https://www.youtube.com/@weareSRV";
const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";

const TEMAS = [
  {
    nombre: "Qué es la IA generativa",
    texto: "Modelos de lenguaje explicados sin humo: qué son, qué hacen bien, en qué se equivocan y por qué.",
    url: null,
    guia: null,
  },
  {
    nombre: "Prompts que funcionan",
    texto: "Cómo pedirle a la IA lo que necesitás: contexto, ejemplos, formato de salida y cómo iterar la respuesta.",
    url: null,
    guia: null,
  },
  {
    nombre: "IA en tu trabajo diario",
    texto: "Mails, planillas, resúmenes e informes: casos reales de oficina resueltos con IA, paso a paso.",
    url: null,
    guia: null,
  },
  {
    nombre: "De la IA al código",
    texto: "Tu primer script generado con IA: cómo pedirlo, cómo probarlo y cómo darte cuenta si está mal.",
    url: null,
    guia: null,
  },
];

export default function FundamentosIA() {
  // Registro a la lista de Fundamentos IA por Netlify Forms (formulario oculto en index.html).
  // En local no funciona (Vite no procesa los forms de Netlify): probarlo en el deploy.
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | listo | error

  const registrar = async (e) => {
    e.preventDefault();
    const datos = new FormData(e.target);
    setEnvio("enviando");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams([...datos, ["form-name", "fundamentos-ia"]]).toString(),
      });
      setEnvio(res.ok ? "listo" : "error");
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
        <p className={styles.kicker}>100% gratis · Sin registro</p>
        <h1 className={styles.title}>
          Fundamentos de <span className={styles.orange}>IA</span>
        </h1>
        <p className={styles.lead}>
          Videos y guías gratuitas para entender la IA y empezar a usarla hoy, sin saber programar. Material abierto
          para toda la comunidad: estamos subiendo los primeros contenidos, y los nuevos se anuncian en el canal de
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

        <div className={styles.registro}>
          <h2>Recibí cada video y guía por correo</h2>
          <p>Dejanos tus datos: te llega por correo el acceso al material y cada novedad apenas sale. Gratis, sin spam.</p>
          {envio === "listo" ? (
            <p className={styles.registroOk}>
              ✅ ¡Listo! Quedaste en la lista: el acceso al material y cada novedad te llegan por correo.
            </p>
          ) : (
            <form className={styles.form} onSubmit={registrar}>
              <input className={styles.campo} type="text" name="nombre" placeholder="Tu nombre" required autoComplete="name" />
              <input className={styles.campo} type="email" name="email" placeholder="Tu mail" required autoComplete="email" />
              <input className={styles.campo} type="tel" name="celular" placeholder="Tu celular (con código de área)" required autoComplete="tel" />
              <button className={styles.btnRegistro} type="submit" disabled={envio === "enviando"}>
                {envio === "enviando" ? "Enviando..." : "Quiero recibirlos"}
              </button>
              <p className={styles.consentimiento}>
                Al enviar aceptás nuestra <Link to="/privacidad">política de privacidad</Link>. Podés darte de baja
                cuando quieras.
              </p>
              {envio === "error" && (
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
