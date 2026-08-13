import { useNavigate } from 'react-router-dom';
import React from "react";
import styles from "./style.module.css";

const Testimonios = ({redirectToUrl}) => {
  const navigate = useNavigate();
  const localRedirectToUrl = () => {
    navigate('/products/pay?productId=be2&header=false');
    window.scrollTo({
      top: 0
  })
  };
  const testimonios = [
    {
      testimonio:
        "Gracias a Backend Avanzado, entendí cómo funcionan los sistemas que siempre quise crear. Hoy estoy trabajando en una startup y todo comenzó aquí.",
      user: "Leila Fernandez, Brazil",
      image:
        "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LEILA.png",
    },
    {
      testimonio:
        "La parte práctica fue increíble. Docker y los sockets me parecían conceptos inalcanzables, pero ahora son herramientas que uso a diario.",
      user: "Juan Gabriel, Uruguay",
      image:
        "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/JUANGA.png",
    },
    {
      testimonio:
        "Gracias a todo lo que aprendi aca en SRV hoy puedo ser un trabajador independiente, y hacer mi trabajo desde cualquier parte del mundo",
      user: "David Martinez, Argentina",
      image:
        "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/DAVIDMARTINEZ.png",
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>POR QUE BACKEND AVANZADO?</h1>
      <div className={styles.header}>
      </div>
      <div className={styles.testimonialsSection}>
        <div className={styles.testimonials}>
          {testimonios.map((item, index) => (
            <div className={styles.testimonialItem} key={index}>
              <img
                src={item.image}
                alt={item.user}
                className={styles.testimonialImage}
              />
              <p className={styles.testimonialText}>
                "{item.testimonio}"
              </p>
              <p className={styles.testimonialUser}>- {item.user}</p>
            </div>
          ))}
        </div>
        <div className={styles.infoSection}>
          <p className={styles.description}>
            "Backend Profesional no es solo un curso, es un trampolín hacia el
            mundo real del desarrollo backend. Aquí no solo aprendés a escribir
            código, aprendés a crear soluciones sólidas que responden a los
            estándares de la industria. Desde nuestros estudiantes que ahora
            lideran proyectos tecnológicos hasta quienes transformaron su
            carrera, sus historias son la prueba de que este curso es la clave
            para desbloquear tu potencial."
          </p>
          <hr className={styles.separator} />
          <div className={styles.article}>
            <h2>SRV · Enero 30, 2025</h2>
            <h3 className={styles.articleTitle}>
              Programadores Backend rompen records salariales
            </h3>
            <p className={styles.articleDescription}>
              Este último año se estima que los programadores mejores pagos y más
              demandados cuentan con las siguientes herramientas...
            </p>
            <br></br>
            <button className={styles.button} onClick={redirectToUrl || localRedirectToUrl}>
              ¡Quiero Comenzar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonios;
