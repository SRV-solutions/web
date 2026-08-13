import React from "react";
import { useNavigate } from 'react-router-dom';

import styles from "./style.module.css";
import Carousel from "../../../Carousel/Index";

const Testimonios = ({redirectToUrl}) => {
  const navigate = useNavigate();
  const localRedirectToUrl = () => {
    navigate('/products/pay?productId=be1&header=false');
    window.scrollTo({
      top: 0
  })
  };
  const testimonios = [
    {
      testimonio:
        "De la mano de SRV y Backend se me abrieron las puertas al mundo tech desde cero.",
      user: "Leila Fernandez, Brazil",
      image:
        "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LEILA.png",
    },
    {
      testimonio:
        "Gracias al curso, conseguí mi primer trabajo como desarrollador.",
      user: "Juan Gabriel",
      image:
        "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/JUANGA.png",
    },
    // Agrega más testimonios si lo deseas
  ];

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Historias de Éxito</h1>
        </div>
        <div className={styles.content}>
          <p className={styles.description}>
            "En SRV no solo te enseñamos a programar, te damos las herramientas
            para transformar tu vida. Mientras otros cursos solo te muestran
            conceptos, nosotros te guiamos para que aprendas con proyectos reales
            y construyas un portafolio que abre puertas. Nuestra misión es
            revolucionar cómo se aprende, convirtiendo el proceso en una
            experiencia emocionante y personal."
          </p>
          <p className={styles.description}>
            "Desde personas que consiguieron su primer empleo en tecnología hasta
            quienes lanzaron sus propios proyectos, cada testimonio es un
            recordatorio de que, con el enfoque correcto, el cambio es posible.
            En SRV no solo aprendés habilidades, construís un futuro que parecía
            inalcanzable. ¡Y esto recién comienza!"
          </p>
          <button onClick={redirectToUrl || localRedirectToUrl} className={styles.button}>¡Quiero Comenzar!</button>
        </div>
      </div>
      <div className={styles.testimonialContainer}>
        <div className={styles.metricas}>
          <div className={styles.satisfaccion}>
            <h1 className={styles.satisfaccionTitle} >Satisfaccion de los alumnos</h1>
            <h1 className={styles.satisfaccionRate}>94,43%</h1>
          </div>
          <div className={styles.satisfaccion}>
            <h1 className={styles.satisfaccionTitle}>Rating del Producto</h1>
            <h1 className={styles.satisfaccionRate}>4.8/5</h1>
          </div>
        </div>
        <Carousel testimonios={testimonios} />
      </div>
    </div>
  );
};

export default Testimonios;
