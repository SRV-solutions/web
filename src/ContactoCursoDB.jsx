import React, { useState } from 'react';
import styles from './ContactoCursoDB.module.css';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/1MLXh7nuJk4cNT4iT0jhOMOFq-sCXUTcegs85lbZgfWU/formResponse';
const ENTRY_NOMBRE = 'entry.1230473828';
const ENTRY_EMAIL = 'entry.1117912367';
const ENTRY_TELEFONO = 'entry.818855332';

const CRONOGRAMA = [
  // Módulo I
  { clase: 1, fecha: '02/09', modulo: 'Módulo I', titulo: 'Introducción a BD Relacionales y MER' },
  { clase: 2, fecha: '09/09', modulo: 'Módulo I', titulo: 'Teoría de Conjuntos Aplicada a Bases de Datos' },
  { clase: 3, fecha: '16/09', modulo: 'Módulo I', titulo: 'Álgebra Relacional en Profundidad' },
  // Módulo II
  { clase: 4, fecha: '23/09', modulo: 'Módulo II', titulo: 'DDL (Parte 1) - Creación de Estructuras (CREATE TABLE)' },
  { clase: 5, fecha: '30/09', modulo: 'Módulo II', titulo: 'DDL (Parte 2) - Modificación y Restricciones (ALTER, CHECK, FK)' },
  { clase: 6, fecha: '07/10', modulo: 'Módulo II', titulo: 'DML (Parte 1) - Inserción, Actualización y Borrado' },
  { clase: 7, fecha: '14/10', modulo: 'Módulo II', titulo: 'DML (Parte 2) - Consultas y Filtrado (SELECT, WHERE)' },
  { clase: 8, fecha: '21/10', modulo: 'Módulo II', titulo: 'DML (Parte 3) - Funciones de Agregación y Agrupamiento' },
  // Módulo III
  { clase: 9, fecha: '28/10', modulo: 'Módulo III', titulo: 'Joins (Parte 1) - Combinación Interna (INNER JOIN)' },
  { clase: 10, fecha: '04/11', modulo: 'Módulo III', titulo: 'Joins (Parte 2) - Combinaciones Externas (LEFT, RIGHT, FULL)' },
  { clase: 11, fecha: '11/11', modulo: 'Módulo III', titulo: 'Consultas Avanzadas y Subconsultas (CTEs, Subqueries)' },
  // Módulo IV
  { clase: 12, fecha: '18/11', modulo: 'Módulo IV', titulo: 'TCL - Control de Transacciones y Propiedades ACID' },
  { clase: 13, fecha: '25/11', modulo: 'Módulo IV', titulo: 'Programación en BD - Vistas, Funciones y Stored Procedures' },
  { clase: 14, fecha: '02/12', modulo: 'Módulo IV', titulo: 'Programación en BD - Triggers y Auditoría' },
  { clase: 15, fecha: '09/12', modulo: 'Módulo IV', titulo: 'DCL - Control de Seguridad, Usuarios, Roles y Permisos' },
  { clase: 16, fecha: '16/12', modulo: 'Módulo IV', titulo: 'Administración, Mantenimiento y Mapeo MySQL' },
];

export default function ContactoCursoDB() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section id="curso-db" className={styles.section}>
      <div className={styles.fullLayout}>
        
        {/* COLUMNA IZQUIERDA: Formulario de Inscripción */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={`${styles.badge} ${styles.blue}`}>Inicio: 2 de Septiembre</div>
              <h2 className={styles.title}>
                Bases de Datos <span className={styles.orange}>Intensivo</span>
              </h2>
              <p className={styles.description}>
                Aprende PostgreSQL & MySQL desde cero con un enfoque técnico, teórico-práctico y orientado a proyectos reales.
              </p>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Inicio</span>
                  <span className={styles.detailValue}>2 de Septiembre</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>4 Meses (16 clases)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Horario</span>
                  <span className={styles.detailValue}>Miércoles 18:00 a 19:30</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Modalidad</span>
                  <span className={styles.detailValue}>100% Virtual</span>
                </div>
              </div>
            </div>

            {!submitted ? (
              <>
                <iframe
                  name="hidden_iframe_db"
                  id="hidden_iframe_db"
                  style={{ display: 'none' }}
                />

                <form
                  action={GOOGLE_FORM_ACTION_URL}
                  method="POST"
                  target="hidden_iframe_db"
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <h3 className={styles.formTitle}>Inscríbete Ahora</h3>

                  <div className={styles.inputGroup}>
                    <label htmlFor="nombre" className={styles.label}>Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name={ENTRY_NOMBRE}
                      required
                      placeholder="Ej: Laura Pérez"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name={ENTRY_EMAIL}
                      required
                      placeholder="ejemplo@correo.com"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="telefono" className={styles.label}>Número de Teléfono</label>
                    <input
                      type="tel"
                      id="telefono"
                      name={ENTRY_TELEFONO}
                      required
                      placeholder="Ej: +54 9 11 1234-5678"
                      className={styles.input}
                    />
                  </div>

                  <button type="submit" disabled={loading} className={styles.btnSubmit}>
                    {loading ? 'Enviando...' : 'Inscribirme al Curso'}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>¡Inscripción recibida!</h3>
                <p>Nos pondremos en contacto contigo para coordinar el acceso a las clases.</p>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: Contenido y Cronograma */}
        <div className={styles.contentColumn}>
          
          <div className={styles.modulesSummary}>
            <h3 className={styles.subTitle}>Módulos del Programa</h3>
            <div className={styles.modulesGrid}>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>01</span>
                <h4>Fundamentos y Teoría Relacional</h4>
                <p>MER, entidades, relaciones, teoría de conjuntos y álgebra relacional[cite: 1].</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>02</span>
                <h4>DDL y DML Completo</h4>
                <p>Creación de esquemas, restricciones, inserción, filtrado y agregación.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>03</span>
                <h4>Joins y Consultas Avanzadas</h4>
                <p>Combinación de tablas (INNER, LEFT, FULL), CTEs y subconsultas.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>04</span>
                <h4>Programación, TCL y Seguridad</h4>
                <p>Transacciones, vistas, Stored Procedures, Triggers y DCL.</p>
              </div>
            </div>
          </div>

          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <h3 className={styles.subTitle}>Calendario de Clases</h3>
              <span className={styles.badgeBlue}>Ejercicios + Clases Grabadas</span>
            </div>

            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Clase</th>
                    <th>Fecha</th>
                    <th>Módulo</th>
                    <th>Temario</th>
                  </tr>
                </thead>
                <tbody>
                  {CRONOGRAMA.map((item) => (
                    <tr key={item.clase}>
                      <td className={styles.classCol}>#{item.clase}</td>
                      <td className={styles.dateCol}>{item.fecha}</td>
                      <td>
                        <span className={styles.moduleTag}>{item.modulo}</span>
                      </td>
                      <td className={styles.titleCol}>{item.titulo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}