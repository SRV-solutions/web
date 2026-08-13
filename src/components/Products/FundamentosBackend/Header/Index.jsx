import React from "react";
import styles from "./style.module.css";

export default function FundamentosBackend({redirectToUrl}) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>
                    ¡CONVERTITE EN DESARROLLADOR WEB EN 9 SEMANAS!
                </h1>
                <p className={styles.subtitle}>
                    Aprendé desde cero, con ejercicios prácticos y proyectos reales.
                </p>
            </header>

            <main className={styles.mainContent}>
                <div className={styles.textContent}>
                    <p className={styles.subHighlight}>No sabes por dónde arrancar? Convertite en</p>
                    <h2 className={styles.highlight}>DISEÑADOR WEB</h2>
                    <p className={styles.subHighlight}>y comenzá a facturar gracias a</p>
                    <h2 className={styles.highlight}>FUNDAMENTOS BACKEND</h2>
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.ctaWrapper}>
                    {/* Botón */}
                    <button onClick={redirectToUrl} className={styles.ctaButton}>
                        <h4 className={styles.ctaTextButton}>¡QUIERO COMENZAR!</h4>
                    </button>

                    {/* Flecha y texto */}
                    <div className={styles.arrowWrapper}>
                        <img
                            src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/flecha.png"
                            alt="Flecha"
                            className={styles.arrowImage}
                        />
                        <p className={styles.note}>clickéame</p>
                    </div>
                </div>
            </footer>

            {/* Texto en la parte inferior derecha */}
            <div className={styles.bottomText}>
                "la mejor habilidad para generar ingresos en 2025 ¡¡¡no esperes más!!!"
            </div>
        </div>
    );
}
