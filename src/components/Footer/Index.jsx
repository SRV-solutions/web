import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import { FaInstagram, FaTiktok, FaYoutube, FaDiscord, FaWhatsapp } from "react-icons/fa";
import Dato, { hayDato } from "../Legal/Dato";
import { LEGAL } from "../../data/legal";

const PHONE_NUMBER = "5491123869799";
const WHATSAPP_MESSAGE = encodeURIComponent("Hola, quiero cotizar un software");
const WHATSAPP_URL = `https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MESSAGE}`;
const YOUTUBE_URL = "https://www.youtube.com/@weareSRV";
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer_container}>
      <div className={styles["footer_data-container"]}>
        {/* Marca y Ubicación */}
        <div className={styles.data_srv}>
          <img
            className={styles.logo_footer}
            src="/srv-logo-256.webp"
            alt="Logo de WEARESRV"
            width="130"
            height="130"
            loading="lazy"
            decoding="async"
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
                href={YOUTUBE_URL}
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

        {/* Productos */}
        <div className={styles.links_container}>
          <h3 className={styles.section_heading}>
            <span className={styles.green}>Productos</span>
          </h3>
          <Link className={styles.footer_link} to="/sentryx">
            Sentryx · Colegios
          </Link>
          <Link className={styles.footer_link} to="/eventbox">
            Event Box · Empresas de eventos
          </Link>
          <Link className={styles.footer_link} to="/el-develop">
            El Develop · Juego gratis
          </Link>
        </div>

        {/* Formaciones */}
        <div className={styles.links_container}>
          <h3 className={styles.section_heading}>
            <span className={styles.blue}>Formaciones</span>
          </h3>
          <Link className={styles.footer_link} to="/scratch/inscripcion">
            Scratch para Chicos
          </Link>
          <Link className={styles.footer_link} to="/scripting/inscripcion">
            Curso de Scripting
          </Link>
          <Link className={styles.footer_link} to="/python/inscripcion">
            Master en Python
          </Link>
          <Link className={styles.footer_link} to="/ruta-backend/inscripcion">
            Ruta Backend: JavaScript + Backend Avanzado
          </Link>
          <Link className={styles.footer_link} to="/fullstack-csharp/inscripcion">
            Fullstack con C# y React
          </Link>
          <Link className={styles.footer_link} to="/full-stack/inscripcion">
            Intensivo Full Stack
          </Link>
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
              Diseñamos soluciones a medida para startups y empresas. Escribinos por WhatsApp y cotizamos tu desarrollo.
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
        {/* Venta online: botón de arrepentimiento visible sin registrarse (Disp. 954/2025), contratos de adhesión
            (Res. 271/2020), privacidad (Ley 25.326) y quién vende, con CUIT y Data Fiscal. Datos en src/data/legal.js */}
        <nav className={styles.legal_links} aria-label="Información legal">
          <Link className={styles.arrepentimiento} to="/arrepentimiento">
            Botón de arrepentimiento
          </Link>
          <Link className={styles.legal_link} to="/baja">
            Botón de baja de servicio
          </Link>
          <Link className={styles.legal_link} to="/terminos">
            Contratos de adhesión – Ley 24.240
          </Link>
          <Link className={styles.legal_link} to="/privacidad">
            Política de privacidad
          </Link>
        </nav>
        <div className={styles.datos_legales}>
          <p>
            {[
              { valor: LEGAL.razonSocial, nombre: "razón social" },
              { valor: LEGAL.cuit && `CUIT ${LEGAL.cuit}`, nombre: "CUIT" },
              { valor: LEGAL.domicilio, nombre: "domicilio" },
              { valor: LEGAL.email, nombre: "mail" },
            ]
              .filter((d) => hayDato(d.valor))
              .map((d, i) => (
                <span key={d.nombre}>
                  {i > 0 && " · "}
                  <Dato valor={d.valor} nombre={d.nombre} />
                </span>
              ))}
          </p>
          {LEGAL.dataFiscalUrl && LEGAL.dataFiscalImg ? (
            <a href={LEGAL.dataFiscalUrl} target="_F960AFIPInfo" rel="noopener noreferrer">
              <img src={LEGAL.dataFiscalImg} alt="Data Fiscal" width="48" height="64" loading="lazy" />
            </a>
          ) : (
            <Dato valor={null} nombre="QR de Data Fiscal" />
          )}
        </div>
        <p className={styles.derechos}>
          © {CURRENT_YEAR} <span className={styles.orange}>SRV</span>. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}