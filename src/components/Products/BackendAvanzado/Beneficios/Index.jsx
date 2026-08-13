import React from "react";
import styles from "./style.module.css";

export default function Beneficios({redirectToUrl}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>BENEFICIOS DE BACKEND AVANZADO</h1>
      <div className={styles.subcontainer}>
        <div className={styles.left}>
          <div className={styles.benefit}>
            <h3 className={styles.benefitTitle}>Dominá Servicios Web</h3>
            <p className={styles.benefitDescription}>
              "Aprendé a diseñar y gestionar APIs que conecten aplicaciones y
              dispositivos de forma eficiente, garantizando alto rendimiento y
              escalabilidad."
            </p>
          </div>
          <div className={styles.benefit}>
            <h3 className={styles.benefitTitle}>
              Manejo de Protocolos y Middleware
            </h3>
            <p className={styles.benefitDescription}>
              "Entendé los fundamentos de los protocolos como HTTP y WebSocket,
              y cómo integrarlos con middleware para crear flujos de datos
              avanzados."
            </p>
          </div>
          <div className={styles.benefit}>
            <h3 className={styles.benefitTitle}>
              Herramientas del Mundo Real
            </h3>
            <p className={styles.benefitDescription}>
              "Sumergite en Docker y otras herramientas líderes para construir
              aplicaciones modernas, listas para enfrentar los desafíos del
              mercado laboral actual."
            </p>
          </div>
        </div>
        <div className={styles.image}></div>
        <div className={styles.right}>
          <div className={styles.stat}>
            <h1 className={styles.number}>+10</h1>
            <p className={styles.statDescription}>Módulos de Aprendizaje</p>
          </div>
          <div className={styles.stat}>
            <h1 className={styles.number}>+200</h1>
            <p className={styles.statDescription}>Ejercicios Reales</p>
          </div>
          <div className={styles.stat}>
            <h1 className={styles.number}>+69</h1>
            <p className={styles.statDescription}>Posiciones</p>
          </div>
        </div>
      </div>
      <button onClick={redirectToUrl} className={styles.ctaButton}>¡Empezá Hoy!</button>
    </div>
  );
}
