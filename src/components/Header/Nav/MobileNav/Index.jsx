import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Importaciones directas para no cargar miles de íconos innecesarios
import FaBars from 'react-icons/fa/FaBars';
import FaTimes from 'react-icons/fa/FaTimes';
import FaChevronDown from 'react-icons/fa/FaChevronDown';
import FaChevronUp from 'react-icons/fa/FaChevronUp';
import FaInstagram from 'react-icons/fa/FaInstagram';
import FaTiktok from 'react-icons/fa/FaTiktok';
import FaYoutube from 'react-icons/fa/FaYoutube';
import FaDiscord from 'react-icons/fa/FaDiscord';

import styles from './style.module.css';
import menuData from '../../../../data/menuData';

const MobileNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();

  const toggleMenu = () => {
    if (menuOpen) {
      setActiveMenu(null);
    }
    setMenuOpen(!menuOpen);
  };

  const toggleSubMenu = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenu(null);
  };

  // Volver arriba cada vez que la ruta cambia
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <header className={styles.mobileHeader}>
      <div className={styles.navbar}>
        <Link to="/" className={styles.logoContainer} aria-label="Inicio">
          <img
            src="/SRV-LOGO.png"
            alt="SRV Logo"
            className={styles.logo}
            width="90"
            height="32"
            loading="eager"
            decoding="async"
          />
        </Link>
        <button
          className={styles.menuButton}
          onClick={toggleMenu}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {menuOpen && (
        <nav className={styles.mobileMenu}>
          <ul>
            {menuData.map((menu, index) => {
              const isOpen = activeMenu === index;
              return (
                <li key={index} className={styles.menuItem}>
                  <div
                    className={styles.menuTitle}
                    onClick={() => toggleSubMenu(index)}
                  >
                    {menu.title}
                    {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                  </div>

                  <ul className={`${styles.subMenu} ${isOpen ? styles.subMenuOpen : ''}`}>
                    {menu.links.map((link, idx) => (
                      <li key={idx}>
                        <Link
                          to={link.to}
                          className={styles.subMenuItem}
                          onClick={closeMenu}
                        >
                          {link.label.toUpperCase()}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>

          {/* Redes sociales */}
          <div className={styles.socialIconsContainer}>
            <a
              className={styles.socialIcon}
              href="https://www.instagram.com/wearesrv/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram size={24} />
            </a>
            <a
              className={styles.socialIcon}
              href="https://www.tiktok.com/@wearesrv"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <FaTiktok size={24} />
            </a>
            <a
              className={styles.socialIcon}
              href="https://www.youtube.com/@weareSRV"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <FaYoutube size={24} />
            </a>
            <a
              className={styles.socialIcon}
              href="https://discord.com/invite/QuAmDxrNMu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discord"
            >
              <FaDiscord size={24} />
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default MobileNav;