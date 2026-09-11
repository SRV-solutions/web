import React, { useState } from 'react';
import styles from './ContactoCursoProgramacion.module.css';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeoNWLxV0qFulyLj18W3Iqo4dCCgiccIy_Nw_xkMLtyR_fVLA/formResponse';
const ENTRY_NOMBRE = 'entry.1681211851';
const ENTRY_EMAIL = 'entry.1652703216';
const ENTRY_TELEFONO = 'entry.1195006180';

const CRONOGRAMA = [
  // Módulo I: Fundamentos & TypeScript con Node.js
  { clase: 1, fecha: '14/10', modulo: 'Módulo I', titulo: 'Introducción a Node.js, NVM y Entorno Backend' },
  { clase: 2, fecha: '15/10', modulo: 'Módulo I', titulo: 'Fundamentos de TypeScript: Tipos, Interfaces y Tuplas' },
  { clase: 3, fecha: '21/10', modulo: 'Módulo I', titulo: 'Programación Asíncrona: Async/Await y Promesas' },
  { clase: 4, fecha: '22/10', modulo: 'Módulo I', titulo: 'Módulos en Node (ESM vs CommonJS) y NPM Scripts' },
  { clase: 5, fecha: '28/10', modulo: 'Módulo I', titulo: 'Manejo del Sistema de Archivos (FS) y Eventos' },
  { clase: 6, fecha: '29/10', modulo: 'Módulo I', titulo: 'Práctica Integradora I: CLI Tool con TypeScript' },

  // Módulo II: Arquitectura Web & Express.js
  { clase: 7, fecha: '04/11', modulo: 'Módulo II', titulo: 'Arquitectura Cliente-Servidor y Protocolo HTTP' },
  { clase: 8, fecha: '05/11', modulo: 'Módulo II', titulo: 'Primer Servidor con Express & Routing Avanzado' },
  { clase: 9, fecha: '11/11', modulo: 'Módulo II', titulo: 'Request Body, Query Params y Route Params' },
  { clase: 10, fecha: '12/11', modulo: 'Módulo II', titulo: 'Middlewares: Concepto, Tipos y Manejo Global de Errores' },
  { clase: 11, fecha: '18/11', modulo: 'Módulo II', titulo: 'Validación de DTOs y Sanitización de Datos con Zod/Joi' },
  { clase: 12, fecha: '19/11', modulo: 'Módulo II', titulo: 'Estructuración de Proyecto: Controlador, Servicio y Rutas' },

  // Módulo III: Base de Datos & ORM Sequelize
  { clase: 13, fecha: '25/11', modulo: 'Módulo III', titulo: 'Bases de Datos Relacionales (PostgreSQL/MySQL)' },
  { clase: 14, fecha: '26/11', modulo: 'Módulo III', titulo: 'Introducción a Sequelize ORM: Conexión y Modelos' },
  { clase: 15, fecha: '02/12', modulo: 'Módulo III', titulo: 'Relaciones y Asociaciones (1:1, 1:N, N:M)' },
  { clase: 16, fecha: '03/12', modulo: 'Módulo III', titulo: 'Consultas Avanzadas, Filtros, Paginación y Sorting' },
  { clase: 17, fecha: '09/12', modulo: 'Módulo III', titulo: 'Migraciones y Seeders con Sequelize CLI' },
  { clase: 18, fecha: '10/12', modulo: 'Módulo III', titulo: 'Transacciones y Control de Concurrencia' },
  { clase: 19, fecha: '16/12', modulo: 'Módulo III', titulo: 'Integración del ORM con Express Controllers' },
  { clase: 20, fecha: '17/12', modulo: 'Módulo III', titulo: 'Taller Práctico: CRUD Completo y Persistencia' },

  // Módulo IV: Seguridad, Autenticación & APIs Pro
  { clase: 21, fecha: '23/12', modulo: 'Módulo IV', titulo: 'Seguridad en APIs: Hashing de Passwords con Bcrypt' },
  { clase: 22, fecha: '24/12', modulo: 'Módulo IV', titulo: 'Autenticación Basada en Tokens con JWT' },
  { clase: 23, fecha: '30/12', modulo: 'Módulo IV', titulo: 'Middleware de Autenticación y Cierre de Sesiones' },
  { clase: 24, fecha: '31/12', modulo: 'Módulo IV', titulo: 'Control de Acceso Basado en Roles (RBAC Authorization)' },
  { clase: 25, fecha: '06/01', modulo: 'Módulo IV', titulo: 'Manejo de CORS, Rate Limiting y Helmet Security' },
  { clase: 26, fecha: '07/01', modulo: 'Módulo IV', titulo: 'Carga y Manejo de Archivos/Imágenes en la API' },
  { clase: 27, fecha: '13/01', modulo: 'Módulo IV', titulo: 'Documentación de APIs con Swagger / OpenAPI' },
  { clase: 28, fecha: '14/01', modulo: 'Módulo IV', titulo: 'Variables de Entorno y Configuración Multientorno' },
  { clase: 29, fecha: '20/01', modulo: 'Módulo IV', titulo: 'Testing de Integración para Endpoints' },
  { clase: 30, fecha: '21/01', modulo: 'Módulo IV', titulo: 'Estrategias de Deploy (Render / Railway / Vercel)' },
  { clase: 31, fecha: '27/01', modulo: 'Módulo IV', titulo: 'Integración Final Backend API RESTful' },
  { clase: 32, fecha: '28/01', modulo: 'Módulo IV', titulo: 'Presentación de Proyectos, Code Review y Cierre' },
];

export default function ContactoCursoProgramacion() {
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
    <section id="curso-programacion" className={styles.section}>
      <div className={styles.fullLayout}>
        
        {/* COLUMNA IZQUIERDA: Formulario de Inscripción y Promoción */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={`${styles.badge} ${styles.blue}`}>Inicio: 14 de Octubre</div>
              <h2 className={styles.title}>
                Desarrollo API <span className={styles.orange}>Backend Pro</span>
              </h2>
              <p className={styles.description}>
                Domina Node.js, TypeScript, Express, Sequelize ORM, JWT, Bcrypt y arquitectura de microservicios desde cero para construir APIs profesionales.
              </p>

              {/* BANNER DE PRECIO CON ANIMACIÓN MARKETINERA */}
              <div className={styles.promoCard}>
                <div className={styles.promoBadge}>🔥 74% OFF - BECA DERECHO DE EXAMEN</div>
                <div className={styles.priceContainer}>
                  <div className={styles.oldPriceBox}>
                    <span className={styles.oldPriceLabel}>Precio Regular</span>
                    <span className={styles.oldPrice}>$350.000</span>
                  </div>
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>Inversión Única</span>
                    <div className={styles.mainPrice}>
                      $90.000 <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>
                <div className={styles.monthlyPerk}>
                  💡 Equivale a solo <strong>$22.500 / mes</strong> durante los 4 meses del curso.
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Inicio</span>
                  <span className={styles.detailValue}>14 de Octubre</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>4 Meses (32 Clases)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Horario</span>
                  <span className={styles.detailValue}>Mié y Jue 15:00 a 17:00</span>
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
                  name="hidden_iframe_programacion"
                  id="hidden_iframe_programacion"
                  style={{ display: 'none' }}
                />

                <form
                  action={GOOGLE_FORM_ACTION_URL}
                  method="POST"
                  target="hidden_iframe_programacion"
                  onSubmit={handleSubmit}
                  className={styles.form}
                >
                  <h3 className={styles.formTitle}>Asegurar Vacante Promocional</h3>

                  <div className={styles.inputGroup}>
                    <label htmlFor="nombre" className={styles.label}>Nombre Completo</label>
                    <input
                      type="text"
                      id="nombre"
                      name={ENTRY_NOMBRE}
                      required
                      placeholder="Ej: Laura Martínez"
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
                    <label htmlFor="telefono" className={styles.label}>Número de Teléfono / WhatsApp</label>
                    <input
                      type="text"
                      id="telefono"
                      name={ENTRY_TELEFONO}
                      required
                      placeholder="Ej: +54 9 11 1234-5678"
                      className={styles.input}
                    />
                  </div>

                  <button type="submit" disabled={loading} className={styles.btnSubmit}>
                    {loading ? 'Enviando...' : 'Quiero la Beca y Mi Vacante'}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>¡Inscripción recibida!</h3>
                <p>Nos pondremos en contacto contigo para congelar tu precio promocional.</p>
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
                <h4>Node.js & TypeScript Fundamentals</h4>
                <p>Entorno de ejecución, TypeScript estricto, asincronismo y CLI Tools.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>02</span>
                <h4>Express.js & Arquitectura REST</h4>
                <p>Ruteo, controllers, middlewares de validación, manejo de errores y DTOs.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>03</span>
                <h4>Bases de Datos & Sequelize ORM</h4>
                <p>Modelado relacional, asociaciones, migraciones, seeders y CRUDs complejos.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>04</span>
                <h4>Seguridad, Auth & API Deploy</h4>
                <p>JWT, Bcrypt, RBAC, Swagger, testing de endpoints y despliegue a producción.</p>
              </div>
            </div>
          </div>

          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <h3 className={styles.subTitle}>Calendario de Clases</h3>
              <span className={styles.badgeBlue}>Proyectos Reales + Clases Grabadas</span>
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