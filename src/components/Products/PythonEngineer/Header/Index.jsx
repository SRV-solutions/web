import { useEffect } from 'react';
import styles from './style.module.css'
import FeaturesSection from './FeatureBadge/Index';

const Header = ({redirectToUrl}) => {

    useEffect(() => {
        const link = document.createElement('link')
        link.rel = 'preload';
        link.href = 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/FONDOGAMER.webp'; 
        link.as = 'image';
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link); // Limpieza si el componente se desmonta
        };
    }, [])

    return (
        <section className={styles.container}>
            <div className={styles.header_container}>
                <div className={styles.title_container}>
                    <h1>APRENDÉ PYTHON DESDE CERO</h1>
                    <h2>Y DESBLOQUEÁ UN MUNDO DE POSIBILIDADES</h2>
                </div>
                <p className={styles.header_description}>"Desde fundamentos básicos hasta proyectos prácticos, dominá uno de los lenguajes más versatiles y demandados del mercado"</p>
            </div>
            <FeaturesSection />
            <div className={styles.button_container}>
                <button className={styles.header_button} onClick={redirectToUrl}>
                    <span>¡Comenzá Ahora!</span>
                </button>
            </div>
        </section>
    )
}

export default Header;