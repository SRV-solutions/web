import React from 'react';
import styles from './style.module.css';

const Contenido = ({redirectToUrl}) => {
  
  const temas = [
    {
      titulo: 'APIs RESTful - Creación y Gestión:',
      descripcion: 'Dominá cómo estructurar y gestionar APIs que permitan una comunicación fluida entre tus aplicaciones y el mundo.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/WEB.png',
    },
    {
      titulo: 'Sockets y Comunicación en Tiempo Real:',
      descripcion: 'Descubrí cómo implementar conexiones persistentes y trabajar con datos en tiempo real, esenciales para proyectos como chats, videojuegos y más.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/JS.png',
    },
    {
      titulo: 'Integración con Docker:',
      descripcion: 'Aprendé a crear contenedores que simplifiquen el despliegue y escalabilidad de tus aplicaciones en cualquier entorno.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/NODE.png',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h1 className={styles.heading}>Herramientas que te ayudan a generar ingresos</h1>
        <div className={styles.itemsContainer}>
          <div className={styles.leftSection}>
            <img
              src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/HOMBREHACKER.png"
              alt="Personaje"
              className={styles.characterImage}
            />
          </div>
          <div className={styles.rightSection}>
            {temas.map((tema, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.textContent}>
                  <h3 className={styles.title}>{tema.titulo}</h3>
                  <p className={styles.description}>{tema.descripcion}</p>
                </div>
              </div>
            ))}
            <button className={styles.button} onClick={redirectToUrl}>
              ¡Quiero Comenzar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contenido;
