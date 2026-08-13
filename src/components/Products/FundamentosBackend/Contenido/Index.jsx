import React from 'react';
import styles from './style.module.css';

const Aprendizaje = ({redirectToUrl}) => {
  const temas = [
    {
      titulo: 'HTML y CSS: Diseñá tu primera página web.',
      descripcion:
        'El primer paso hacia tu futuro digital. Aprendé a estructurar y diseñar páginas web desde cero con HTML y CSS, las herramientas esenciales que forman el esqueleto y la apariencia de todos los sitios web que visitás a diario. Creá tu propia página web, paso a paso, y sorprendete con lo que podés construir.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/WEB.png',
    },
    {
      titulo: 'JavaScript Básico: Dale vida a tus proyectos.',
      descripcion:
        'Pasá de lo estático a lo interactivo. Con JavaScript, vas a aprender cómo agregar animaciones, manejar eventos y hacer que tus páginas respondan al usuario de forma dinámica. Este módulo es tu puerta de entrada a darle verdadera vida a tus proyectos web.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/JS.png',
    },
    {
      titulo: 'Node.js: Creá servidores dinámicos.',
      descripcion:
        'Llevá tus habilidades al siguiente nivel con Node.js. Descubrí cómo desarrollar y configurar servidores que soporten aplicaciones modernas, mientras trabajás con herramientas que usan las empresas tecnológicas más importantes del mundo. Este módulo te prepara para el backend, el motor detrás de cada aplicación exitosa.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/NODE.png',
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.subContainer}>
        <h1 className={styles.heading}>¿Qué vas a aprender?</h1>
        <div className={styles.itemsContainer}>
          <div className={styles.leftSection}>
            {temas.map((tema, index) => (
              <div key={index} className={`${styles.card} ${index % 2 === 1 ? styles.shiftRight : ''}`}>
                <img src={tema.imagen} alt={tema.titulo} className={styles.image} />
                <div className={styles.textContent}>
                  <h3 className={styles.title}>{tema.titulo}</h3>
                  <p className={styles.description}>{tema.descripcion}</p>
                </div>
              </div>
            ))}
        <button onClick={redirectToUrl} className={styles.button}>¡QUIERO COMENZAR!</button>
          </div>
          <div className={styles.rightSection}>
            <img src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/HOMBRE.png" alt="Personaje" className={styles.characterImage} />
          </div>
        </div>
      </div>
    </div>

  );
};

export default Aprendizaje;
