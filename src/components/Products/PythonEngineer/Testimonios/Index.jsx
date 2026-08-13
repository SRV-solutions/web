import styles from "./style.module.css";
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import testimonios from "../../../../data/testimonios-python";

export default function Testimonios() {
  // Array de objetos con los testimonios
  return (
    <div className={styles['testimonios_container']}>
      <h3 className={styles['testimonios_header']}>QUIENES NOS ELEGIERON<br /> NOS RECOMIENDAN</h3>
      <div className={styles['section-cards_container']}>
        {testimonios.map((testimonio, index) => (
          <div key={index} className={styles['card_container']}>
            <FaQuoteLeft className={styles['card_quoter']} />
            <h5>{testimonio.encabezado}</h5>
            <p>{testimonio.texto}</p>
            <div className={styles["stars_container"]}>
              {[...Array(testimonio.calificacion)].map((_, idx) => (
                <FaStar key={idx} className={styles['star_icon']} color="yellow" />
              ))}
            </div>
            <div className={styles['card_people']}>
              <img src={testimonio.imagen} alt={testimonio.nombre} />
              <div>
                <h4>{testimonio.nombre}</h4>
                <span>{testimonio.ocupacion}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
