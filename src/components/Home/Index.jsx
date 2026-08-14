import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './style.module.css';

const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/@weareSRV/playlists';
const PHONE_NUMBER = '5491123869799';
const WHATSAPP_MESSAGE = encodeURIComponent('Hola, quiero cotizar un software');
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MESSAGE}`;

export default function Home() {
  const { hash } = useLocation();

  // Escucha cambios en el hash de la URL (/#servicios, /#backend, etc.) y hace scroll suave
  useEffect(() => {
    if (hash) {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className={styles.homeContainer}>
      {/* Hero Principal */}
      <section className={styles.hero}>
        <div className={`${styles.badge} ${styles.green}`}>Tech Studio & Education</div>
        <h1 className={styles.heroTitle}>
          Construimos software <span className={styles.orange}>escalable</span> y formamos la próxima generación de <span className={styles.blue}>talento</span>.
        </h1>
        <p className={styles.heroSubtitle}>
          En SRV desarrollamos soluciones backend de alta ingeniería para empresas globales y liberamos nuestro conocimiento para democratizar la tecnología.
        </p>
        <div className={styles.heroActions}>
          <a 
            href={WHATSAPP_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.btnPrimary}
          >
            Cotizar Software a Medida
          </a>
          <a href="#educacion" className={styles.btnSecondary}>Ver Cursos Gratuitos</a>
        </div>
      </section>

      {/* Servicios de Desarrollo de Software */}
      <section id="servicios" className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Ingeniería de Software <span className={styles.orange}>a Medida</span>
          </h2>
          <p className={styles.sectionDescription}>
            Arquitecturas sólidas, APIs robustas e infraestructura cloud diseñada para crecer.
          </p>
        </div>

        <div className={styles.servicesGrid}>
          {/* Tarjeta 1: Backend */}
          <div id="backend" className={styles.serviceCard}>
            <h3 className={styles.orange}>Backend & APIs</h3>
            <p>
              Desarrollo de microservicios, bases de datos optimizadas e integraciones complejas en Node.js, Python y arquitecturas cloud resilientes.
            </p>
            <a 
              href={WHATSAPP_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.cardLink}
            >
              Consultar por Backend →
            </a>
          </div>

          {/* Tarjeta 2: SaaS */}
          <div id="saas" className={styles.serviceCard}>
            <h3 className={styles.blue}>Plataformas Web & SaaS</h3>
            <p>
              Diseño y desarrollo end-to-end de aplicaciones de alto tráfico preparadas para operar con estabilidad operativa total.
            </p>
            <a 
              href={WHATSAPP_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.cardLink}
            >
              Consultar por SaaS →
            </a>
          </div>

          {/* Tarjeta 3: Automatización */}
          <div id="automatizacion" className={styles.serviceCard}>
            <h3 className={styles.green}>Automatización & Cloud</h3>
            <p>
              Sistemas de procesamiento de datos, automatización de flujos críticos y optimización de rendimiento sobre infraestructura existente.
            </p>
            <a 
              href={WHATSAPP_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.cardLink}
            >
              Consultar por Automatización →
            </a>
          </div>
        </div>
      </section>

      {/* Sección Cursos Gratuitos en YouTube */}
      <section id="educacion" className={styles.section}>
        <div className={styles.educationWrapper}>
          <h2 className={styles.sectionTitle}>
            Aprende Backend Gratis con <span className={styles.blue}>SRV</span>
          </h2>
          <p>
            Creemos que la educación técnica de calidad debe ser accesible. Hemos liberado nuestros programas de formación en Python, Fundamentos de Backend y Arquitectura web sin costo directamente en nuestra playlist oficial.
          </p>
          <a 
            href={YOUTUBE_PLAYLIST_URL} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.btnSecondary}
          >
            Acceder a la Playlist en YouTube
          </a>
        </div>
      </section>

      {/* Manifiesto SRV */}
      <section id="manifiesto" className={styles.section}>
        <div className={styles.manifestoWrapper}>
          <h2 className={styles.sectionTitle}>
            Nuestra <span className={styles.green}>Filosofía</span>
          </h2>
          <p className={styles.manifestoText}>
            En SRV entendemos que dominar el código no es solo una habilidad técnica: es ganar libertad para construir tu futuro, diseñar tus propios términos y generar impacto global. No venimos a enseñarte qué pensar, sino a darte las herramientas para que descubras cómo crear.
          </p>
          <p className={`${styles.quote} ${styles.orange}`}>
            "Acá no solo aprendés… ¡acá creás la mejor versión de vos mismo!"
          </p>
        </div>
      </section>
    </div>
  );
}