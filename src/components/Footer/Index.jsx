import React from "react";
import styles from "./style.module.css";
import { FaInstagram, FaTiktok, FaYoutube, FaDiscord, FaWhatsapp } from "react-icons/fa";

const PHONE_NUMBER = "5491123869799";
const WHATSAPP_MESSAGE = encodeURIComponent("Hola, quiero cotizar un software");
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const YOUTUBE_PLAYLIST_URL = "https://www.youtube.com/@weareSRV/playlists";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer_container}>
      <div className={styles["footer_data-container"]}>
        {/* Marca y Ubicación */}
        <div className={styles.data_srv}>
          <img
            className={styles.logo_footer}
            src="./SRV-LOGO.png"
            alt="SRV Logo"
          />
          <div className={styles.srv_location}>
            <p>Ciudad Autónoma de Buenos Aires</p>
            <p className={styles.text_muted}>Buenos Aires, Argentina</p>
          </div>
          <div>
            <h3 className={styles.section_heading}>
              Conecta con <span className={styles.orange}>nosotros</span>
            </h3>
            <div className={styles.footer_icons_container}>
              <a
                className={styles.icons_links}
                href="https://www.instagram.com/wearesrv/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram className={styles["icon-size"]} />
              </a>
              <a
                className={styles.icons_links}
                href="https://www.tiktok.com/@wearesrv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FaTiktok className={styles["icon-size"]} />
              </a>
              <a
                className={styles.icons_links}
                href={YOUTUBE_PLAYLIST_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FaYoutube className={styles["icon-size"]} />
              </a>
              <a
                className={styles.icons_links}
                href="https://discord.com/invite/QuAmDxrNMu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Discord"
              >
                <FaDiscord className={styles["icon-size"]} />
              </a>
              <a
                className={styles.icons_links}
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className={styles["icon-size"]} />
              </a>
            </div>
          </div>
        </div>

        {/* Soluciones & Software */}
        <div className={styles.links_container}>
          <h3 className={styles.section_heading}>
            Desarrollo <span className={styles.orange}>Tech</span>
          </h3>
          <a
            className={styles.footer_link}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Software a Medida
          </a>
          <a
            className={styles.footer_link}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Backend & Arquitectura Cloud
          </a>
          <a
            className={styles.footer_link}
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Consultoría & APIs
          </a>
        </div>

        {/* Educación Gratuita */}
        <div className={styles.links_container}>
          <h3 className={styles.section_heading}>
            Educación <span className={styles.blue}>Gratuita</span>
          </h3>
          <a
            className={styles.footer_link}
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ruta Backend (YouTube)
          </a>
          <a
            className={styles.footer_link}
            href={YOUTUBE_PLAYLIST_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Python & Fundamentos
          </a>
          <a
            className={styles.footer_link}
            href="https://discord.com/invite/QuAmDxrNMu"
            target="_blank"
            rel="noopener noreferrer"
          >
            Comunidad en Discord
          </a>
        </div>

        {/* Información Corporativa */}
        <div className={styles.info_container}>
          <div className={styles.section_info}>
            <h3 className={styles.section_heading}>
              COTIZACIONES & <span className={styles.green}>CONTACTO</span>
            </h3>
            <p>
              Diseñamos soluciones personalizadas para startups y empresas. Escríbenos directamente para cotizar tu desarrollo.
            </p>
          </div>
          <div className={styles.section_info}>
            <h3 className={styles.section_heading}>SRV MANIFIESTO</h3>
            <p>
              Educación libre, tecnología sin fronteras y software de alto rendimiento.
            </p>
          </div>
        </div>
      </div>

      <div className={styles.bottom_bar}>
        <p className={styles.derechos}>
          © {currentYear} <span className={styles.orange}>SRV</span>. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}