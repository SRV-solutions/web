import styles from './style.module.css'

const Motivation = () => {
    return (
        <div className={styles.motivation_container}>
            <p>SRV NO ES SOLO EDUCACIÓN, ES REVOLUCIÓN PARA TRANSFORMAR TU VIDA. <br/>DOMINÁ <span className={styles.orange}>HABILIDADES</span>, MULTIPLICÁ TUS <span className={styles.green}>INGRESOS</span> Y <span className={styles.blue}>CREÁ</span> TU FUTURO IDEAL</p>
            <p>¿POR DÓNDE QUERES COMENZAR?</p>
        </div>
    )
}

export default Motivation;