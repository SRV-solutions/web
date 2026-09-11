import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
// Se mantienen los íconos; para optimizar aún más se pueden reemplazar por SVGs inline
import {
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaDiscord,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import menuData from "../../../data/menuData";
import styles from "./style.module.css";

const Nav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();
  const navRef = useRef(null);

  // Cerrar menú móvil y dropdowns al cambiar de ruta
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  // Manejador optimizado para detectar clics fuera del menú
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, { passive: true });
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
  }, []);

  const handleDropdownToggle = useCallback((index) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  }, []);

  const handleLogoClick = (e) => {
    if (location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNavClick = (e, targetUrl) => {
    if (targetUrl.includes("#")) {
      const hashId = targetUrl.split("#")[1];
      const element = document.getElementById(hashId);

      if (location.pathname === "/" && element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: "smooth" });
        setMobileMenuOpen(false);
      }
    }
  };

  return (
    <header className={styles.header} ref={navRef}>
      <nav className={styles.navbar} aria-label="Navegación principal">
        {/* LOGO CON DIMENSIONES DEFINIDAS Y LCP OPTIMIZADO */}
        <div className={styles.logo_container}>
          <Link
            to="/"
            className={styles.link_logo}
            aria-label="Inicio"
            onClick={handleLogoClick}
          >
            <img
              className={styles.logo}
              src="/SRV-LOGO.png"
              alt="Logo de SRV"
              width="45"
              height="45"
              fetchPriority="high"
            />
          </Link>
        </div>

        {/* BOTÓN MÓVIL */}
        <button
          className={styles.hamburger_btn}
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={mobileMenuOpen}
          type="button"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* CONTENEDOR DESPLEGABLE MÓVIL */}
        <div
          className={`${styles.mobile_wrapper} ${
            mobileMenuOpen ? styles.mobile_open : ""
          }`}
        >
          <div className={styles.menu_container}>
            <ul className={styles.list_menu}>
              {menuData.map((menu, index) => {
                const isOpen = activeDropdown === index;

                return (
                  <li
                    key={index}
                    className={`${styles.dropdown} ${
                      menu.disabled ? styles.disabled : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={`${styles.dropdown_title_btn} ${
                        menu.hasNotification ? styles.shimmer : ""
                      } ${isOpen ? styles.active : ""}`}
                      disabled={menu.disabled}
                      onClick={() => handleDropdownToggle(index)}
                      aria-expanded={isOpen}
                    >
                      <span>{menu.title}</span>
                      <FaChevronDown
                        className={`${styles.drop_flecha} ${
                          isOpen ? styles.rotate : ""
                        }`}
                      />
                    </button>

                    {!menu.disabled && (
                      <ul
                        className={`${styles.dropdown_menu} ${
                          isOpen ? styles.show : ""
                        }`}
                      >
                        {menu.links.map((link, idx) => {
                          const isExternal =
                            link.isExternal || link.to.startsWith("http");

                          return (
                            <li key={idx} className={styles.dropdown_list_item}>
                              {isExternal ? (
                                <a
                                  href={link.to}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.dropdown_link}
                                >
                                  <span>{link.label.toUpperCase()}</span>
                                  {link.isNew && (
                                    <span className={styles.badge_new}>NEW</span>
                                  )}
                                </a>
                              ) : (
                                <a
                                  href={link.to}
                                  className={styles.dropdown_link}
                                  onClick={(e) => handleNavClick(e, link.to)}
                                >
                                  <span>{link.label.toUpperCase()}</span>
                                  {link.isNew && (
                                    <span className={styles.badge_new}>NEW</span>
                                  )}
                                </a>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* REDES SOCIALES */}
          <div className={styles.social_container}>
            <a
              className={styles.icons}
              href="https://www.instagram.com/wearesrv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className={styles.icon_size} />
            </a>
            <a
              className={styles.icons}
              href="https://www.tiktok.com/@wearesrv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok className={styles.icon_size} />
            </a>
            <a
              className={styles.icons}
              href="https://www.youtube.com/@weareSRV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube className={styles.icon_size} />
            </a>
            <a
              className={styles.icons}
              href="https://discord.com/invite/QuAmDxrNMu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord className={styles.icon_size} />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Nav;