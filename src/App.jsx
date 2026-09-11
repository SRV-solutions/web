import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import { initMetaPixels, trackPageView } from "./data/metaPixel.js";

// ✅ Header y Footer estáticos para mantener el Layout estable en móviles
import Header from "./components/Header/Index";
import Footer from "./components/Footer/Index";

// ✅ Code Splitting solo para las páginas principales
const Home = lazy(() => import("./components/Home/Index"));
const ContactoCursoDB = lazy(
  () => import("./components/Courses/ContactoCursoDB.jsx")
);
const ContactoCursoRedes = lazy(
  () => import("./components/Courses/ContactoCursoRedes.jsx")
);
const ContactoCursoProgramacion = lazy(
  () => import("./components/Courses/ContactoCursoProgramacion.jsx")
);
const Certificates = lazy(() => import("./components/Certificates/Index.jsx"));

// 🚀 PageLoader moderno con animación del Logo WEARESRV.COM
const PageLoader = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh",
      width: "100%",
      padding: "2rem 0",
    }}
  >
    {/* Estilos CSS dinámicos e inyectados */}
    <style>
      {`
        @keyframes srvPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.9;
            filter: drop-shadow(0 0 10px rgba(249, 115, 22, 0.3));
          }
          50% {
            transform: scale(1.06);
            opacity: 1;
            filter: drop-shadow(0 0 22px rgba(249, 115, 22, 0.7));
          }
        }

        @keyframes lineProgress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }

        .srv-logo-anim {
          animation: srvPulse 2s infinite ease-in-out;
        }

        .srv-progress-line {
          animation: lineProgress 1.6s infinite ease-in-out;
        }
      `}
    </style>

    {/* Logo Animado */}
    <div className="srv-logo-anim" style={{ marginBottom: "1.5rem" }}>
      <img
        src="/logo.png" // 👈 Asegúrate de que tu imagen esté en public/logo.png o cambia por tu import/ruta
        alt="WEARESRV.COM"
        style={{
          height: "55px",
          width: "auto",
          objectFit: "contain",
        }}
        onError={(e) => {
          // Fallback en texto si la imagen falla o está cargando
          e.target.style.display = "none";
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = "block";
          }
        }}
      />
      <span
        style={{
          display: "none",
          fontSize: "1.8rem",
          fontWeight: "800",
          letterSpacing: "1px",
          color: "#f97316",
          fontFamily: "sans-serif",
        }}
      >
        WEARE<span style={{ color: "#ffffff" }}>SRV</span>
      </span>
    </div>

    {/* Barra de Progreso animada */}
    <div
      style={{
        width: "140px",
        height: "4px",
        backgroundColor: "rgba(249, 115, 22, 0.15)",
        borderRadius: "10px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        className="srv-progress-line"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#f97316",
          boxShadow: "0 0 10px #f97316",
          borderRadius: "10px",
        }}
      />
    </div>

    {/* Texto secundario */}
    <span
      style={{
        marginTop: "0.8rem",
        color: "#9ca3af",
        fontSize: "0.85rem",
        fontWeight: "500",
        letterSpacing: "0.5px",
      }}
    >
      Cargando contenido...
    </span>
  </div>
);

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Inicialización no bloqueante al montar la app
    const timer = setTimeout(() => {
      Promise.resolve()
        .then(() => initMetaPixels())
        .catch((e) => console.warn("Meta Pixel bloqueado por el navegador:", e));
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Tracking diferido con limpieza de temporizador al cambiar de ruta
    const timer = setTimeout(() => {
      Promise.resolve()
        .then(() => trackPageView())
        .catch((e) => console.warn("Tracking bloqueado:", e));
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscripcion" element={<ContactoCursoDB />} />
          <Route path="/redes/inscripcion" element={<ContactoCursoRedes />} />
          <Route
            path="/backend/inscripcion"
            element={<ContactoCursoProgramacion />}
          />
          <Route path="/certificates/:id" element={<Certificates />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function Layout({ children }) {
  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Aprende desarrollo web Gratis con JavaScript, Python y otras tecnologías backend avanzadas."
        />
        <meta
          name="keywords"
          content="desarrollo web, backend, JavaScript, Python, desarrollo de software, programación backend"
        />
        <meta name="author" content="wearesrv" />
        <meta
          property="og:title"
          content="Cursos de Desarrollo Web - Aprende Gratis Backend y Más"
        />
        <meta
          property="og:description"
          content="Cursos completos sobre desarrollo backend con JavaScript y Python."
        />
        <meta property="og:url" content="https://wearesrv.com" />
      </Helmet>

      <Header />
      <main style={{ minHeight: "80vh" }}>{children}</main>
      <Footer />
    </>
  );
}