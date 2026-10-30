import React, { useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";

// Próximos cursos con lista de espera (plan 2027, Tanda 2). El formulario postea a
// netlify/functions/lista-espera.js, que lo guarda en la pestaña "Lista de espera" del Apps Script
// de registros (appscript-fundamentos.gs). Las claves de PROXIMOS tienen que coincidir con las de
// esa función. En local no funciona (Vite no corre las Netlify Functions): probarlo en el deploy.
// /redes/inscripcion (link "Formate como DevOps en AWS" del Linktree) redirige acá con ?curso=redes.
const PROXIMOS = [
  {
    key: "ia-trabajo",
    nombre: "IA para el trabajo",
    tag: "Nuevo",
    texto:
      "Usá IA todos los días sin saber programar: redactá mails e informes, analizá datos, resumí documentos y automatizá tareas repetitivas con prompts que funcionan.",
    para: "Para cualquier persona que trabaje con una computadora.",
  },
  {
    key: "sql",
    nombre: "SQL desde cero",
    tag: "Muy pronto",
    texto:
      "Las bases de datos desde cero: consultas, filtros, JOIN y reportes. Las clases ya están grabadas, con resúmenes animados de cada tema, y vienen con guías de apoyo gratuitas. Certificado verificable con examen final en vivo.",
    para: "Para sumar la herramienta que piden en casi todos los trabajos con datos.",
  },
  {
    key: "ia-docentes",
    nombre: "IA para docentes",
    tag: "Educación",
    texto:
      "Planificaciones, correcciones, rúbricas y material didáctico con IA, pensado para el aula real y con criterio pedagógico.",
    para: "Para docentes y equipos directivos de cualquier nivel.",
  },
  {
    key: "redes",
    nombre: "Redes, Linux y AWS",
    tag: "DevOps",
    texto:
      "Formate como DevOps: redes desde cero, Linux a fondo y despliegues en AWS, con práctica real sobre servidores propios.",
    para: "Para quienes ya programan o trabajan en soporte y quieren dar el salto a infraestructura.",
  },
];

const MENSAJES_CAMPO = {
  curso: "Elegí el curso.",
  nombre: "Revisá tu nombre.",
  apellido: "Revisá tu apellido.",
  email: "Revisá el mail: parece que tiene un error.",
  celular: "Revisá el celular: escribilo con código de área, por ejemplo 11 2345-6789.",
};

export default function ProximosCursos() {
  const [searchParams] = useSearchParams();
  const destacado = searchParams.get("curso");
  const formRef = useRef(null);

  const [cursoElegido, setCursoElegido] = useState(PROXIMOS.some((c) => c.key === destacado) ? destacado : "");
  const [envio, setEnvio] = useState("inicial"); // inicial | enviando | listo | error
  const [campoInvalido, setCampoInvalido] = useState(null);
  const [ultimos, setUltimos] = useState({}); // datos del último envío, para anotarse en otro curso sin retipear
  const [anotadoEn, setAnotadoEn] = useState(null);

  const elegir = (key) => {
    setCursoElegido(key);
    setEnvio("inicial");
    setCampoInvalido(null);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const registrar = async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.target));
    setEnvio("enviando");
    setCampoInvalido(null);
    setUltimos(datos);
    try {
      const res = await fetch("/.netlify/functions/lista-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      if (res.ok) {
        setAnotadoEn(PROXIMOS.find((c) => c.key === datos.curso)?.nombre || "");
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

  const nombreElegido = PROXIMOS.find((c) => c.key === cursoElegido)?.nombre;

  return (
    <section className={styles.page}>
      <Seo
        title="Próximos cursos: IA para el trabajo, SQL, IA para docentes y DevOps | WEARESRV"
        description="Anotate en la lista de espera de los próximos cursos de WEARESRV: IA para el trabajo, SQL desde cero, IA para docentes y Redes, Linux y AWS. Te avisamos primero y accedés al precio de lanzamiento."
        path="/proximos-cursos"
      />
      <div className={styles.inner}>
        <p className={styles.kicker}>Próximos cursos</p>
        <h1 className={styles.title}>
          Lo que se viene en <span className={styles.orange}>WEARESRV</span>
        </h1>
        <p className={styles.lead}>
          Estos cursos están en preparación, todos con certificado verificable y examen final en vivo. Sumate a la
          lista de espera: no te comprometés a nada, te avisamos antes que a nadie cuando abran y el precio de
          lanzamiento se anuncia primero a la lista.
        </p>

        <div className={styles.grid}>
          {PROXIMOS.map((c) => (
            <article key={c.key} className={`${styles.card} ${destacado === c.key ? styles.cardDestacada : ""}`}>
              <span className={styles.cardTag}>{c.tag}</span>
              <h2>{c.nombre}</h2>
              <p>{c.texto}</p>
              <p className={styles.para}>{c.para}</p>
              <p className={styles.lanzamiento}>El precio de lanzamiento se anuncia primero a la lista de espera.</p>
              <button type="button" className={styles.btnLista} onClick={() => elegir(c.key)}>
                Sumarme a la lista de espera
              </button>
            </article>
          ))}
        </div>

        <div className={styles.registro} ref={formRef} id="lista-espera">
          <h2>{nombreElegido ? `Lista de espera: ${nombreElegido}` : "Anotate en la lista de espera"}</h2>
          <p>
            Dejanos tus datos y te avisamos por mail antes que a nadie cuando abra la inscripción, con el precio de
            lanzamiento para la lista. No te compromete a nada.
          </p>
          {envio === "listo" ? (
            <div className={styles.registroOk}>
              <p>
                ✅ ¡Listo! Quedaste en la lista de espera de <strong>{anotadoEn}</strong>. Te llega un mail de
                confirmación.
              </p>
              <button
                type="button"
                className={styles.btnOtro}
                onClick={() => {
                  setCursoElegido("");
                  setEnvio("inicial");
                }}
              >
                Anotarme en otro curso
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={registrar}>
              <select
                className={`${styles.campo} ${styles.campoCurso}`}
                name="curso"
                value={cursoElegido}
                onChange={(e) => setCursoElegido(e.target.value)}
                required
              >
                <option value="" disabled>
                  Elegí el curso
                </option>
                {PROXIMOS.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <input className={styles.campo} type="text" name="nombre" placeholder="Nombre" required autoComplete="given-name" defaultValue={ultimos.nombre} />
              <input className={styles.campo} type="text" name="apellido" placeholder="Apellido" required autoComplete="family-name" defaultValue={ultimos.apellido} />
              <input className={styles.campo} type="email" name="email" placeholder="Mail" required autoComplete="email" defaultValue={ultimos.email} />
              <input className={styles.campo} type="tel" name="celular" placeholder="Celular (con código de área)" required autoComplete="tel" defaultValue={ultimos.celular} />
              <input className={styles.trampa} type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <button className={styles.btnRegistro} type="submit" disabled={envio === "enviando"}>
                {envio === "enviando" ? "Enviando..." : "Anotarme"}
              </button>
              <p className={styles.consentimiento}>
                Al enviar aceptás nuestra <Link to="/privacidad">política de privacidad</Link>. Usamos tus datos solo
                para avisarte de este curso y podés darte de baja cuando quieras.
              </p>
              {envio === "error" && campoInvalido && (
                <p className={styles.registroError}>{MENSAJES_CAMPO[campoInvalido] || "Revisá los datos."}</p>
              )}
              {envio === "error" && !campoInvalido && (
                <p className={styles.registroError}>
                  No pudimos anotarte. Probá de nuevo o{" "}
                  <a
                    href={whatsappLink(`Hola, quiero sumarme a la lista de espera de "${nombreElegido || "los próximos cursos"}"`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    escribinos por WhatsApp
                  </a>
                  .
                </p>
              )}
            </form>
          )}
        </div>

        <p className={styles.nota}>
          ¿Querés arrancar hoy? Los cursos grabados de Scripting, Python, JavaScript, Backend y Fullstack con C# ya
          están disponibles con acceso de por vida.
        </p>
      </div>
    </section>
  );
}
