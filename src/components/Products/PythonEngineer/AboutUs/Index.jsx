import styles from './style.module.css'
import { FaArrowRight } from 'react-icons/fa';

const AboutUs = ({redirectToUrl}) => {

    return (
        <>
            <div className={styles.container}>
                <div className={styles.header_section}>
                    <h2 className={styles.header_title}>¿POR QUÉ NOSOTROS?</h2>
                </div>
                <div className={styles.list_container}>
                    <ul className={styles.list_container}>
                        <div className={styles.list_item_container}>
                            <img className={styles.image_item} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/ASTERISCOGAMER.png" alt="list item" />
                            <li className={styles.list_item}>
                                "Este curso está diseñado para guiarte desde lo básico, asegurando que entendés cada concepto antes de avanzar. ¡Es perfecto para quienes recién comienzan!"
                            </li>
                        </div>
                        <div className={styles.list_item_container}>
                            <img className={styles.image_item} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/ASTERISCOGAMER.png" alt="list item" />
                            <li className={styles.list_item}>
                                "Vas a aprender a crear proyectos prácticos, desde pequeños programas hasta análisis de datos, para consolidar tu aprendizaje mientras construís un portafolio profesional."
                            </li>
                        </div>
                        <div className={styles.list_item_container}>
                            <img className={styles.image_item} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/ASTERISCOGAMER.png" alt="list item" />
                            <li className={styles.list_item}>
                                "Python es uno de los lenguajes más utilizados en desarrollo web, análisis de datos, inteligencia artificial y más. Este curso te da las bases para explorarlos todos."
                            </li>
                        </div>
                    </ul>
                </div>
                <div className={styles.button_container}>
                    <button onClick={redirectToUrl} className={styles.button}>
                        <span>COMENZA YA <FaArrowRight/></span>
                    </button>
                </div>
            </div>
        </>
    )
}

export default AboutUs;