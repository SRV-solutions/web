import styles from "./style.module.css"; 
import { useNavigate } from 'react-router-dom';

export default function Gallery(){
    const navigate = useNavigate();
    const redirectToUrl = (path) => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        navigate(`/${path}`);
    }

    return (
        <section className={styles.images_container}>
            <img onClick={() => redirectToUrl("python-engineer")} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOPYTHONGRANDE.png" alt="Imagen representativa del infoproducto de Python" />
            <img onClick={() => redirectToUrl("fundamentos-backend")} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOFUNDAMENTOSBACKENDGRANDE.png" alt="Imagen representativa del infoproducto de Fundamentos de Backend" />
            <img onClick={() => redirectToUrl("backend-avanzado")} src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOBACKENDAVANZADOGRANDE.png" alt="Imagen representativa del infoproducto de Backend Avanzado" />
        </section>
    )
}