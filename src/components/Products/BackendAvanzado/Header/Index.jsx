import React from "react";
import styles from "./style.module.css";

export default function FundamentosBackend() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Llevá tus habilidades al siguiente nivel: <br />
          Dominá el Backend Profesional.
        </h1>
        <p className={styles.subtitle}>
          "Construí servidores robustos, gestioná servicios web y trabajá con
          herramientas esenciales como Docker. Transformá tu carrera con el
          curso que va más allá de la teoría."
        </p>
      </div>
      <div className={styles.subcontainer}>
        <div className={styles.subcontainerLeft}>
          <h1 className={styles.courseTitle}>Backend Avanzado</h1>
          <h3 className={styles.name}>Marcos Schmite</h3>
          <p className={styles.description}>
            "El desarrollo backend es el motor detrás de las aplicaciones más
            usadas en el mundo. Con estas habilidades, podés trabajar para
            empresas globales, ofrecer servicios freelance o crear tus propios
            proyectos. La alta demanda y los salarios competitivos te permiten
            generar ingresos desde cualquier lugar, entrando de lleno en la
            economía digital global."
          </p>
        </div>
        <div className={styles.subcontainerRight}>
          <div className={styles.stat}>
            <h1 className={styles.number}>+10</h1>
            <h3 className={styles.statDescription}>Años de Experiencia</h3>
          </div>
          <div className={styles.stat}>
            <h1 className={styles.number}>+600</h1>
            <h3 className={styles.statDescription}>Proyectos completados</h3>
          </div>
          <div className={styles.stat}>
            <h1 className={styles.number}>+300</h1>
            <h3 className={styles.statDescription}>Clientes Satisfechos</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
