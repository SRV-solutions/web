import styles from './style.module.css'

const FooterSection = ({redirectToUrl}) => {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>NO IMPORTA SI NUNCA PROGRAMASTE ANTES</h3>
                <h4>HOY ES EL DÍA PARA EMPEZAR A CONSTRUIR TU FUTURO CON <span className={styles.python}>PYTHON</span></h4>
            </div>
            <div className={styles.description_container}>
                <p>"Python es uno de los lenguajes más demandados en la industria tecnológica. Sus aplicaciones van desde el análisis de datos hasta el desarrollo de inteligencia artificial. Con esta habilidad, podés trabajar en empresas globales, ofrecer servicios freelance o automatizar procesos en tu negocio. Aprender Python es invertir en un futuro lleno de posibilidades."</p>
                <div className={styles.button_container}>
                    <button className={styles.button} onClick={redirectToUrl}><span>QUIERO SER UN <img src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/python_ico.png" /> DEVELOPER </span></button>
                </div>
            </div>
        </div>
    )
}

export default FooterSection;