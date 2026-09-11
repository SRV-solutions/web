import React, { useState, useMemo } from 'react';
import styles from './ContactoCursoRedes.module.css';

const GOOGLE_FORM_ACTION_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSc7qxFjwEjIznKNoJes6i5dQHHbZZaDTovYgeKPlUOX94LCWw/formResponse';

const ENTRY_NOMBRE = 'entry.1681211851';
const ENTRY_EMAIL = 'entry.1652703216';
const ENTRY_TELEFONO = 'entry.1195006180';

const CRONOGRAMA = [
  { clase: 1, fecha: '13/10', modulo: 'Módulo I', titulo: 'Introducción a Servidores y Laboratorio Virtual' },
  { clase: 2, fecha: '14/10', modulo: 'Módulo I', titulo: 'Consola Linux (Bash) I: Navegación y Archivos' },
  { clase: 3, fecha: '20/10', modulo: 'Módulo I', titulo: 'Consola Linux (Bash) II: Permisos y Usuarios' },
  { clase: 4, fecha: '21/10', modulo: 'Módulo I', titulo: 'Gestión de Procesos Servicios y Paquetes' },
  { clase: 5, fecha: '27/10', modulo: 'Módulo I', titulo: 'Servidores Web Locales y Acceso Remoto SSH' },
  { clase: 6, fecha: '28/10', modulo: 'Módulo I', titulo: 'Práctica Integradora Linux & SysAdmin' },
  { clase: 7, fecha: '03/11', modulo: 'Módulo II', titulo: 'Introducción a Redes y el Modelo OSI' },
  { clase: 8, fecha: '04/11', modulo: 'Módulo II', titulo: 'Modelo TCP/IP y Encapsulamiento' },
  { clase: 9, fecha: '10/11', modulo: 'Módulo II', titulo: 'Direccionamiento IPv4 y Clases de Red' },
  { clase: 10, fecha: '11/11', modulo: 'Módulo II', titulo: 'Servicios Fundamentales: DNS y DHCP' },
  { clase: 11, fecha: '17/11', modulo: 'Módulo II', titulo: 'Capas de Transporte: TCP vs UDP e ICMP' },
  { clase: 12, fecha: '18/11', modulo: 'Módulo II', titulo: 'Cisco Packet Tracer I: Primeras Topologías' },
  { clase: 13, fecha: '24/11', modulo: 'Módulo III', titulo: 'Switched Networks: Capa de Enlace y MAC' },
  { clase: 14, fecha: '25/11', modulo: 'Módulo III', titulo: 'Configuración de Switches y VLANs en Cisco' },
  { clase: 15, fecha: '01/12', modulo: 'Módulo III', titulo: 'Fundamentos de Enrutamiento (Routing)' },
  { clase: 16, fecha: '02/12', modulo: 'Módulo III', titulo: 'Introducción al Subnetting / Subneteo IPv4' },
  { clase: 17, fecha: '08/12', modulo: 'Módulo III', titulo: 'Subneteo Práctico FLSM (Fixed Length)' },
  { clase: 18, fecha: '09/12', modulo: 'Módulo III', titulo: 'Subneteo Avanzado VLSM (Variable Length)' },
  { clase: 19, fecha: '15/12', modulo: 'Módulo III', titulo: 'Configuración de Routers en Packet Tracer' },
  { clase: 20, fecha: '16/12', modulo: 'Módulo III', titulo: 'Enrutamiento Dinámico (OSPF)' },
  { clase: 21, fecha: '22/12', modulo: 'Módulo III', titulo: 'Seguridad y Traducción de Direcciones (NAT/PAT)' },
  { clase: 22, fecha: '23/12', modulo: 'Módulo III', titulo: 'Taller Integrador de Redes en Packet Tracer' },
  { clase: 23, fecha: '29/12', modulo: 'Módulo IV', titulo: 'Introducción a la Nube y AWS IAM' },
  { clase: 24, fecha: '30/12', modulo: 'Módulo IV', titulo: 'Networking en la Nube: AWS VPC' },
  { clase: 25, fecha: '05/01', modulo: 'Módulo IV', titulo: 'Servidores Virtuales en Cloud: AWS EC2' },
  { clase: 26, fecha: '06/01', modulo: 'Módulo IV', titulo: 'Despliegue en EC2 & Web Hosting' },
  { clase: 27, fecha: '12/01', modulo: 'Módulo IV', titulo: 'Almacenamiento Cloud: AWS S3 y EBS' },
  { clase: 28, fecha: '13/01', modulo: 'Módulo IV', titulo: 'Bases de Datos Managed: AWS RDS' },
  { clase: 29, fecha: '19/01', modulo: 'Módulo IV', titulo: 'Alta Disponibilidad: Load Balancers y Auto Scaling' },
  { clase: 30, fecha: '20/01', modulo: 'Módulo IV', titulo: 'Arquitectura Cloud Multi-capa' },
  { clase: 31, fecha: '26/01', modulo: 'Módulo IV', titulo: 'Despliegue de Infraestructura Cloud Integrada' },
  { clase: 32, fecha: '27/01', modulo: 'Módulo IV', titulo: 'Pruebas de Carga Optimización de Costos y Cierre' },
];

function ContactoCursoRedes() {
  const [formData, setFormData] = useState({ nombre: '', email: '', telefono: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = new FormData();
    body.append(ENTRY_NOMBRE, formData.nombre);
    body.append(ENTRY_EMAIL, formData.email);
    body.append(ENTRY_TELEFONO, formData.telefono);

    try {
      await fetch(GOOGLE_FORM_ACTION_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: body,
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const renderedRows = useMemo(() => {
    return CRONOGRAMA.map((item) => (
      <tr key={item.clase} className={styles.tableRow}>
        <td className={styles.classCol}>#{item.clase}</td>
        <td className={styles.dateCol}>{item.fecha}</td>
        <td>
          <span className={styles.moduleTag}>{item.modulo}</span>
        </td>
        <td className={styles.titleCol}>{item.titulo}</td>
      </tr>
    ));
  }, []);

  return (
    <section id="curso-redes" className={styles.section}>
      <div className={styles.fullLayout}>
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={`${styles.badge} ${styles.blue}`}>Inicio: 13 de Octubre</div>
              <h2 className={styles.title}>
                Redes & AWS <span className={styles.orange}>Intensivo</span>
              </h2>
              <p className={styles.description}>
                Aprende Administración Linux, Redes TCP/IP, Subneteo y Despliegue en AWS desde cero con laboratorios reales.
              </p>

              <div className={styles.promoCard}>
                <div className={styles.promoBadge}>🔥 66% OFF - BECA DERECHO DE EXAMEN</div>
                <div className={styles.priceContainer}>
                  <div className={styles.oldPriceBox}>
                    <span className={styles.oldPriceLabel}>Precio Regular</span>
                    <span className={styles.oldPrice}>$240.000</span>
                  </div>
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>Inversión Única</span>
                    <div className={styles.mainPrice}>
                      $80.000 <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>
                <div className={styles.monthlyPerk}>
                  💡 Equivale a solo <strong>$20.000 / mes</strong> durante los 4 meses del curso.
                </div>
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Inicio</span>
                  <span className={styles.detailValue}>13 de Octubre</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>4 Meses (32 Clases)</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Horario</span>
                  <span className={styles.detailValue}>Mar y Mié 20:30 a 22:00</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Modalidad</span>
                  <span className={styles.detailValue}>100% Virtual</span>
                </div>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3 className={styles.formTitle}>Asegurar Vacante Promocional</h3>

                <div className={styles.inputGroup}>
                  <label htmlFor="nombre" className={styles.label}>Nombre Completo</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej: Carlos Gómez"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ejemplo@correo.com"
                    className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="telefono" className={styles.label}>Número de Teléfono / Colegio</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    placeholder="Ej: +54 9 11 1234-5678"
                    className={styles.input}
                  />
                </div>

                <button type="submit" disabled={loading} className={styles.btnSubmit}>
                  {loading ? 'Enviando...' : 'Quiero la Beca y Mi Vacante'}
                </button>
              </form>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>¡Inscripción recibida!</h3>
                <p>Nos pondremos en contacto contigo para congelar tu precio promocional.</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.contentColumn}>
          <div className={styles.modulesSummary}>
            <h3 className={styles.subTitle}>Módulos del Programa</h3>
            <div className={styles.modulesGrid}>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>01</span>
                <h4>Fundamentos y Linux SysAdmin</h4>
                <p>Consola Bash, gestión de permisos, usuarios, servicios y SSH.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>02</span>
                <h4>Modelos de Red y Protocolos</h4>
                <p>Modelo OSI, TCP/IP, IPv4, DNS, DHCP y Packet Tracer.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>03</span>
                <h4>Networking Avanzado y Subneteo</h4>
                <p>Switches, VLANs, Subneteo FLSM/VLSM, OSPF y NAT/PAT.</p>
              </div>
              <div className={styles.moduleCard}>
                <span className={styles.moduleNum}>04</span>
                <h4>Cloud Computing con AWS</h4>
                <p>AWS EC2, VPC, S3, RDS, Auto Scaling y arquitectura multicapa.</p>
              </div>
            </div>
          </div>

          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <h3 className={styles.subTitle}>Calendario de Clases</h3>
              <span className={styles.badgeBlue}>Laboratorios + Clases Grabadas</span>
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
                <tbody>{renderedRows}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(ContactoCursoRedes);