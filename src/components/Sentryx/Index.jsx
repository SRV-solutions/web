import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import Seo from "../Seo";

const SENTRYX_URL = "https://sentryx.wearesrv.com";

export default function Sentryx() {
  return (
    <div className={styles.sentryxContainer}>
      <Seo
        title="Sentryx - Plataforma escolar digital | WEARESRV"
        description="Sentryx es la plataforma escolar que reúne en un solo lugar comunicados, calificaciones, boletines, asistencia y aulas virtuales para colegios de Inicial, Primario y Secundario."
        path="/sentryx"
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.sentryxLogo}>
          <img src="/sentryx-icon.svg" alt="Sentryx" />
        </div>
        <div className={styles.badge}>Plataforma escolar digital</div>
        <h1 className={styles.heroTitle}>
          Sentryx: La plataforma escolar <span className={styles.blue}>todo</span> <span className={styles.green}>en</span> <span className={styles.highlight}>uno</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Reúne en un solo lugar comunicados, calificaciones, boletines, asistencia y aulas virtuales.
          Para colegios con Inicial, Primario y Secundario.
        </p>
        <a href={SENTRYX_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
          Ingresar a Sentryx →
        </a>
      </section>

      {/* Description Section */}
      <section className={styles.description}>
        <div className={styles.contentWrapper}>
          <h2>¿Cómo funciona Sentryx?</h2>

          <div className={styles.textContent}>
            <p>
              Sentryx es la plataforma escolar que reúne en un solo lugar todo lo que pasa en el colegio:
              comunicados, mensajes con las familias, calificaciones, boletines, asistencia y aulas virtuales.
              Está pensada para colegios con Inicial, Primario y Secundario, y funciona desde el celular
              (se instala como una app) o la computadora. Cada colegio tiene su propio espacio, con su nombre,
              su escudo y su link de ingreso.
            </p>

            <p>
              Cada persona ve solo lo que le corresponde. La conducción envía comunicados con confirmación
              de lectura y sabe quién los leyó; los docentes cargan notas y publican materiales en sus aulas;
              preceptoría toma asistencia y recibe alertas automáticas cuando un alumno acumula faltas;
              y las familias reciben todo en el celular, ven el boletín publicado de sus hijos y escriben
              directamente a la escuela, sin grupos de WhatsApp ni cuadernos que se pierden.
            </p>

            <p>
              La administración del colegio también está adentro: alta de personal, alumnos y familias
              desde planillas de Excel, ciclo lectivo con promoción anual, roles y permisos, y un registro
              de auditoría de cada cambio. Se cobra por persona activa, con un plan Básico que incluye todo
              lo anterior y planes superiores que se asignan solo a quien los necesita.
            </p>
          </div>

          <div className={styles.plans}>
            <h3>Planes disponibles</h3>
            <p className={styles.plansSubtitle}>Precios en pesos argentinos, por usuario por mes</p>
            <div className={styles.plansGrid}>
              <div className={styles.planCard}>
                <h4>Plan Básico</h4>
                <p className={styles.price}>$660/mes</p>
                <p className={styles.storage}>5 GB</p>
                <ul className={styles.features}>
                  <li>Comunicados con confirmación de lectura</li>
                  <li>Calificaciones y boletines</li>
                  <li>Aulas virtuales</li>
                  <li>Asistencia</li>
                  <li>Gestión de roles y permisos</li>
                </ul>
              </div>

              <div className={styles.planCard}>
                <h4>Plan Ampliado</h4>
                <p className={styles.price}>$720/mes</p>
                <p className={styles.storage}>15 GB</p>
                <ul className={styles.features}>
                  <li>Todo del plan Básico</li>
                  <li>Recibos de sueldo digitales</li>
                  <li>Legajo docente</li>
                </ul>
              </div>

              <div className={styles.planCard}>
                <h4>Plan Profesional</h4>
                <p className={styles.price}>$2.150/mes</p>
                <p className={styles.storage}>30 GB</p>
                <ul className={styles.features}>
                  <li>Todo del plan Ampliado</li>
                  <li>Calendario de actos</li>
                  <li>Programas de materias</li>
                  <li>Juegos de preguntas en el aula</li>
                </ul>
              </div>

              <div className={styles.planCard}>
                <h4>Plan Integral</h4>
                <p className={styles.price}>$3.000/mes</p>
                <p className={styles.storage}>50 GB</p>
                <ul className={styles.features}>
                  <li>Todo del plan Profesional</li>
                  <li>Soporte prioritario</li>
                  <li>Integraciones avanzadas</li>
                  <li>Reportes personalizados</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.cta}>
            <p>¿Tu colegio quiere usar Sentryx?</p>
            <a href={SENTRYX_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              Ingresar a la plataforma →
            </a>
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
