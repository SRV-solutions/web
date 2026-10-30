import React from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { whatsappLink } from "../../data/legal";

// Próximos cursos con lista de espera (plan 2027, Tanda 2). La lista de espera sale por WhatsApp
// con el texto prellenado; cuando esté el Apps Script de listas, el botón pasa a un formulario
// que pega a una Netlify Function (mismo esquema que los cursos).
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

export default function ProximosCursos() {
  const [searchParams] = useSearchParams();
  const destacado = searchParams.get("curso");

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
              <a
                className={styles.btnLista}
                href={whatsappLink(`Hola, quiero sumarme a la lista de espera de "${c.nombre}"`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Sumarme a la lista de espera
              </a>
            </article>
          ))}
        </div>

        <p className={styles.nota}>
          ¿Querés arrancar hoy? Los cursos grabados de Scripting, Python, JavaScript, Backend y Fullstack con C# ya
          están disponibles con acceso de por vida.
        </p>
      </div>
    </section>
  );
}
