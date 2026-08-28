import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styles from './style.module.css';
import logoSRV from '/SRV-LOGO.png'; // Ajusta la ruta a tu archivo logo.png

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vS24rJruNALBJYy9zfrp0x8jIPjilekUYscu3HNlRnh6Jwt2QzgyqFGiZFAgdlYrruCb_g3wulmHVm1/pub?output=csv';

export default function Certificates() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(GOOGLE_SHEET_CSV_URL);
        const csvText = await response.text();

        // Parsea las filas delimitadas por comas
        const rows = csvText
          .split('\n')
          .map((row) => row.split(',').map((cell) => cell.trim()));

        // Fila 0: Nombre, Apellido, DNI, Codigo, Formacion
        const dataRows = rows.slice(1);

        const usersList = dataRows
          .filter((row) => row.length >= 4 && row[0] !== '')
          .map((row) => ({
            nombre: row[0],
            apellido: row[1],
            dni: row[2],
            codigo: row[3],
            formacion: row[4] || 'Bases de Datos Intensivo', // fallback por defecto
            nota: row[6]
          }));

        // Búsqueda por código o DNI
        const foundUser = usersList.find(
          (u) =>
            u.codigo.toLowerCase() === id?.toLowerCase() ||
            u.dni === id
        );

        if (foundUser) {
          setUser(foundUser);
        } else {
          setError('No se encontró ningún certificado válido con ese identificador.');
        }
      } catch (err) {
        console.error('Error al cargar la hoja de Google:', err);
        setError('Ocurrió un problema al validar el certificado.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUsers();
    }
  }, [id]);

  return (
    <section className={styles.wrapperSection}>
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Verificando certificado en el sistema...</p>
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorCard}>
          <div className={styles.errorIcon}>✕</div>
          <h3>Certificado No Encontrado</h3>
          <p>{error}</p>
          <Link to="/" className={styles.btnBack}>
            Volver al Inicio
          </Link>
        </div>
      )}

      {user && !loading && (
        <div className={styles.certificateOuterBorder}>
          <div className={styles.certificateCanvas}>
            {/* Logo SRV en PNG */}
            <div className={styles.logoContainer}>
              <img src={logoSRV} alt="SRV Logo" className={styles.srvLogoImg} />
            </div>

            {/* Título de Formación/Curso */}
            <h1 className={styles.courseTitle}>
              {user.formacion.toUpperCase()}
            </h1>

            {/* Nombre del Estudiante */}
            <h2 className={styles.studentName}>
              {user.nombre.toUpperCase()} {user.apellido.toUpperCase()}
            </h2>

            <div className={styles.dividerLine}></div>

            {/* Identificación DNI y Código */}
            <p className={styles.metaData}>DNI: {user.dni}</p>

            {/* Leyenda de Certificación */}
            <p className={styles.statement}>
              POR EL PRESENTE CERTIFICADO SE NOTIFICA QUE HA COMPLETADO CON ÉXITO LA FORMACIÓN EN SRV.
            </p>

            <p className={styles.certCodeNotice}>
              CÓDIGO DE VERIFICACIÓN OFICIAL: <strong>{user.codigo}</strong>
            </p>
            <p className={styles.certCodeNotice}>
              NOTA: <strong>{user.nota}</strong>
            </p>

            {/* Firmas Institucionales */}
            <div className={styles.signaturesGrid}>
              <div className={styles.signatureBlock}>
                <div className={styles.handwrittenSignatureAlt}>Marcos Roberto Costa Schmite</div>
                <div className={styles.sigLine}></div>
                <span className={styles.sigName}>MARCOS ROBERTO COSTA SCHMITE</span>
                <span className={styles.sigRole}>Educador</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}