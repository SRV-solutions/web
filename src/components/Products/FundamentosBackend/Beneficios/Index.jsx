// Archivo: beneficios/index.jsx

import React from 'react';
import styles from './style.module.css';

const Beneficios = () => {
  const beneficios = [
    {
      titulo: 'Sin experiencia previa.',
      descripcion:
        '¿Nunca programaste antes? No te preocupes! Este curso está diseñado para guiarte paso a paso, desde los conceptos básicos hasta construir tus propios proyectos.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/SINEXPERIENCIA.png', // Ruta actualizada con respeto a los colores
    },
    {
      titulo: 'Proyectos reales.',
      descripcion:
        'Aprendé haciendo: trabajá en proyectos reales que podés incluir en tu portafolio profesional para impresionar a empleadores o clientes.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/PROYECTOSREALES.png', // Ruta actualizada con respeto a los colores
    },
    {
      titulo: 'Acceso permanente.',
      descripcion:
        'Tu tiempo, tus reglas. Accedé al curso y a todos los materiales de por vida, para que aprendas a tu propio ritmo sin presiones.',
      imagen: 'https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/ACCESOPERMANENTE.png', // Ruta actualizada con respeto a los colores
    },
  ];

  return (
    <div className={styles.container}>
      {beneficios.map((beneficio, index) => (
        <div key={index} className={styles.card}>
          <img src={beneficio.imagen} alt={beneficio.titulo} className={styles.image} />
          <h3 className={styles.title}>{beneficio.titulo}</h3>
          <p className={styles.description}>{beneficio.descripcion}</p>
        </div>
      ))}
    </div>
  );
};

export default Beneficios;