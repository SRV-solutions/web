import { Link } from "react-router-dom";
import { PROMO, cursosDePromo } from "../../data/promo";
import styles from "./style.module.css";

// Aviso arriba de todas las páginas mientras dura la promo de la variable PROMO de Netlify (src/data/promo.js).
// Siempre con las fechas y el link a las bases, como pide la ley para una promo.
// El ícono (llama de Lucide, licencia ISC) va en SVG directo: este aviso está en todas las páginas y así no
// arrastra react-icons al archivo principal.
const Llama = ({ className }) => (
  <svg className={className} width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);
export default function BannerPromo() {
  if (!PROMO) return null;
  const cursos = cursosDePromo(PROMO) || "todos los cursos grabados";
  return (
    <div className={styles.banner} role="note">
      <Llama className={styles.icono} />
      <p>
        <strong>{PROMO.nombre}:</strong> {PROMO.porcentaje}% off en {cursos}, {PROMO.fechasTexto}.{" "}
        <Link to="/#cursos">Ver cursos</Link> · <Link to="/terminos">Bases</Link>
      </p>
    </div>
  );
}
