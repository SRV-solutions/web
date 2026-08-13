import React from "react";
import styles from "./style.module.css";

const Footer = ({redirectToUrl}) => {
  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>
          "Estás a un paso de convertirte en un experto backend. No postergues más tus sueños."
        </h1>
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <button onClick={redirectToUrl} className={styles.button}>¡Quiero Comenzar!</button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
