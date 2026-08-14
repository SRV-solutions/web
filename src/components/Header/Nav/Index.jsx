import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { Link, useLocation } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaYoutube, FaDiscord, FaChevronDown } from "react-icons/fa";
import menuData from '../../../data/menuData';
import MobileNav from './MobileNav/Index';
import styles from './style.module.css';

const Nav = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const location = useLocation();

  if (isMobile) {
    return <MobileNav />;
  }

  // Función para volver arriba de todo suavemente
  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault(); // Evita recargar si ya estás en la Home
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      // Limpia cualquier hash de la URL si lo hubiera
      window.history.pushState(null, "", "/");
    }
  };

  // Manejador de clics para desplazamientos dentro de la misma página (hash)
  const handleNavClick = (e, targetUrl) => {
    if (targetUrl.includes("#")) {
      const hashId = targetUrl.split("#")[1];
      const element = document.getElementById(hashId);

      // Si estamos en la Home '/', hacemos scroll directo sin recargar
      if (location.pathname === "/" && element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", targetUrl);
      }
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Navegación principal">
        {/* LOGO */}
        <div className={styles.logo_container}>
          <Link 
            to="/" 
            className={styles.link_logo} 
            aria-label="Inicio"
            onClick={handleLogoClick}
          >
            <img className={styles.logo} src="/SRV-LOGO.png" alt="Logo de SRV" />
          </Link>
        </div>

        {/* MENU */}
        <div className={styles.menu_container}>
          <ul className={styles.list_menu}>
            {menuData.map((menu, index) => (
              <li
                key={index}
                className={`${styles.dropdown} ${menu.disabled ? styles.disabled : ""}`}
              >
                <button 
                  type="button" 
                  className={styles.dropdown_title_btn}
                  disabled={menu.disabled}
                >
                  <span>{menu.title}</span>
                  <FaChevronDown className={styles.drop_flecha} />
                </button>

                {!menu.disabled && (
                  <ul className={styles.dropdown_menu}>
                    {menu.links.map((link, idx) => {
                      const isExternal = link.isExternal || link.to.startsWith("http");

                      return (
                        <li key={idx} className={styles.dropdown_list_item}>
                          {isExternal ? (
                            <a
                              href={link.to}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.dropdown_link}
                            >
                              {link.label.toUpperCase()}
                            </a>
                          ) : (
                            <a
                              href={link.to}
                              className={styles.dropdown_link}
                              onClick={(e) => handleNavClick(e, link.to)}
                            >
                              {link.label.toUpperCase()}
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* REDES SOCIALES */}
        <div className={styles.icons_container}>
          <a className={styles.icons} href="https://www.instagram.com/wearesrv/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram className={styles.icon_size} />
          </a>
          <a className={styles.icons} href="https://www.tiktok.com/@wearesrv" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
            <FaTiktok className={styles.icon_size} />
          </a>
          <a className={styles.icons} href="https://www.youtube.com/@weareSRV" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
            <FaYoutube className={styles.icon_size} />
          </a>
          <a className={styles.icons} href="https://discord.com/invite/QuAmDxrNMu" target="_blank" rel="noopener noreferrer" aria-label="Discord">
            <FaDiscord className={styles.icon_size} />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Nav;