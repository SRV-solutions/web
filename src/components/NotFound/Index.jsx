import React from "react";
import Seo from "../Seo";
import { Link } from "react-router-dom";
import styles from "./style.module.css";

const CURSOS_DISPONIBLES = [
  { label: "Scratch para Chicos", to: "/scratch/inscripcion" },
  { label: "Curso de Scripting", to: "/scripting/inscripcion" },
  { label: "Master en Python", to: "/python/inscripcion" },
  { label: "Ruta Backend: JavaScript + Backend Avanzado", to: "/ruta-backend/inscripcion" },
  { label: "Intensivo Full Stack", to: "/full-stack/inscripcion" },
];

export default function NotFound() {
  return (
    <section className={styles.section}>
      <Seo title="Página no encontrada | WEARESRV" description="La página que buscás no existe. Mirá nuestras formaciones disponibles." path="/404" noindex />


      <span className={styles.code}>404</span>
      <h1 className={styles.title}>
        Esta página <span className={styles.orange}>no existe</span>
      </h1>
      <p className={styles.description}>
        Puede que el link esté desactualizado o que ese curso ya no tenga
        inscripciones abiertas. Estas son nuestras formaciones disponibles:
      </p>

      <div className={styles.grid}>
        {CURSOS_DISPONIBLES.map((curso) => (
          <Link key={curso.to} to={curso.to} className={styles.card}>
            {curso.label} →
          </Link>
        ))}
      </div>

      <Link to="/" className={styles.btnHome}>
        Volver al inicio
      </Link>
    </section>
  );
}
