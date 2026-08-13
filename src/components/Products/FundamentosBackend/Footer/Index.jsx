import React from "react";
import styles from "./style.module.css";

const Footer = ({redirectToUrl}) => {
    return (
        <div className={styles.container}>
            <div>
                <div className={styles.header}>
                    <h1 className={styles.title}>¡Tu futuro comienza hoy!</h1>
                    <h1 className={styles.title}>¡No esperes más!</h1>
                </div>
                <div className={styles.content}>
                    <button onClick={redirectToUrl} className={styles.button}>¡Quiero Comenzar!</button>
                    <p className={styles.description}>
                        "Tu destino no está escrito; lo construís con cada decisión que tomás.
                        Hoy tenés la oportunidad de tomar las riendas de tu futuro, aprender algo nuevo y transformar tu 2025.
                        ¿Te animás a dar el primer paso hacia el cambio?"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
