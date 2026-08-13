import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaYoutube, FaDiscord, FaChevronDown } from "react-icons/fa";
import menuData from '../../../data/menuData';
import MobileNav from './MobileNav/Index';
import styles from './style.module.css';

const Nav = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  if (isMobile) {
    return <MobileNav />;
  }

  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Navegación principal">
        {/* LOGO */}
        <div className={styles.logo_container}>
          <Link to="/" className={styles.link_logo} aria-label="Inicio">
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
                    {menu.links.map((link, idx) => (
                      <li key={idx} className={styles.dropdown_list_item}>
                        <Link
                          to={link.to || "#"}
                          className={styles.dropdown_link}
                        >
                          {link.label.toUpperCase()}
                        </Link>
                      </li>
                    ))}
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