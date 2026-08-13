import beneficiosPython from '../../../../data/beneficios-python';
import styles from './style.module.css'
import { useEffect } from 'react';

const BeneficiosSection = ({redirectToUrl}) => {

  useEffect(() => {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles['fadeIn']);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const cards = document.querySelectorAll(`.${styles['card_wrapper']}`);
    cards.forEach(card => {
      observer.observe(card);
    });

    return () => {
      cards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, []);


  return (
    <div>
      <div className={styles.container}>
        <div className={styles.title_container}>
          <h3 className={styles.title}>
            VAS A GENERAR INGRESOS DESDE DONDE QUIERAS
          </h3>
        </div>
      </div>
      <div className={styles.body}>
        {
          beneficiosPython.map((card, index) => (
            <div key={index} className={styles.card}>
              <figure>
                <img src={card.imgSrc} alt="" />
              </figure>
              <div className={styles.contenido}>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <a onClick={redirectToUrl}>Leer Más</a>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default BeneficiosSection;