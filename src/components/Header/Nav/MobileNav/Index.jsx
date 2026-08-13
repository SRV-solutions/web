import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';  
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaInstagram, FaTiktok, FaYoutube, FaDiscord } from 'react-icons/fa';
import styles from './style.module.css';
import menuData from '../../../../data/menuData';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNav = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();  

    const toggleMenu = () => {
        if (menuOpen) {
            setActiveMenu(null); // Resetea el submenú cuando el menú se abre
        }
        setMenuOpen(!menuOpen);
    };
    

    const toggleSubMenu = (index) => {
        setActiveMenu(activeMenu === index ? null : index);
    };

    const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenu(null);  // Resetea el estado del submenú cuando se cierra el menú
};


    // Volver arriba cada vez que la ruta cambia
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);  

    return (
        <header className={styles.mobileHeader}>
            <div className={styles.navbar}>
                <Link to="/" className={styles.logoContainer}>
                    <img src="https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/logotipo.png" alt="Logo" className={styles.logo} />
                </Link>
                <button className={styles.menuButton} onClick={toggleMenu}>
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>
            
            <AnimatePresence>
                {menuOpen && (
                    <motion.nav 
                        initial={{ opacity: 0, y: 0 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={styles.mobileMenu}
                    >
                        <ul>
                            {menuData.map((menu, index) => (
                                <li key={index} className={styles.menuItem}>
                                    <div className={styles.menuTitle} onClick={() => toggleSubMenu(index)}>
                                        {menu.title}
                                        {activeMenu === index ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                    <AnimatePresence>
                                        {activeMenu === index && (
                                            <motion.ul 
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className={styles.subMenu}
                                            >
                                                {menu.links.map((link, idx) => (
                                                    <li key={idx}>
                                                        <Link to={link.to} className={styles.subMenuItem} onClick={closeMenu}>
                                                            {link.label.toUpperCase()}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </li>
                            ))}
                        </ul>
                        {/* Redes sociales debajo del menú */}
                        <div className={styles.socialIconsContainer}>
                            <a className={styles.socialIcon} href="https://www.instagram.com/wearesrv/" target="_blank" rel="noopener noreferrer">
                                <FaInstagram size={24} />
                            </a>
                            <a className={styles.socialIcon} href="https://www.tiktok.com/@wearesrv" target="_blank" rel="noopener noreferrer">
                                <FaTiktok size={24} />
                            </a>
                            <a className={styles.socialIcon} href="https://www.youtube.com/@weareSRV" target="_blank" rel="noopener noreferrer">
                                <FaYoutube size={24} />
                            </a>
                            <a className={styles.socialIcon} href="https://discord.com/invite/QuAmDxrNMu" target="_blank" rel="noopener noreferrer">
                                <FaDiscord size={24} />
                            </a>
                        </div>
                    </motion.nav>
                )}
            </AnimatePresence>
        </header>
    );
};

export default MobileNav;