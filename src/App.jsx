import React, { useEffect, lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { initMetaPixel, trackPageView, generateEventId } from "./data/metaPixel.js";

// Layout estático
import Header from "./components/Header/Index";
import Footer from "./components/Footer/Index";

// Code Splitting de páginas
const Home = lazy(() => import("./components/Home/Index"));
const ContactoCursoWeb = lazy(
  () => import("./components/Courses/ContactoCursoWeb.jsx")
);
// Cursos grabados con pago por Mercado Pago (Scripting, Scratch, Python, Master en JavaScript y Backend Avanzado)
const CursoGrabado = lazy(
  () => import("./components/Courses/CursoGrabado.jsx")
);
const GraciasCurso = lazy(
  () => import("./components/Courses/GraciasCurso.jsx")
);
const Certificates = lazy(() => import("./components/Certificates/Index.jsx"));
const Empresas = lazy(() => import("./components/Empresas/Index.jsx"));
const ProximosCursos = lazy(() => import("./components/ProximosCursos/Index.jsx"));
const FundamentosIA = lazy(() => import("./components/FundamentosIA/Index.jsx"));
const ElDevelop = lazy(() => import("./components/ElDevelop/Index.jsx"));
const Sentryx = lazy(() => import("./components/Sentryx/Index.jsx"));
const EventBox = lazy(() => import("./components/EventBox/Index.jsx"));
// Páginas legales para vender online (Ley 24.240, Disp. 954/2025 y Ley 25.326)
const Terminos = lazy(() => import("./components/Legal/Terminos.jsx"));
const Privacidad = lazy(() => import("./components/Legal/Privacidad.jsx"));
const Arrepentimiento = lazy(() => import("./components/Legal/Arrepentimiento.jsx"));
const NotFound = lazy(() => import("./components/NotFound/Index.jsx"));

// Redirige una URL vieja conservando el query string (Mercado Pago vuelve con ?payment_id=... a la URL
// de "gracias" que tenía la preferencia cuando se creó, así que los pagos previos al cambio de ruta llegan acá).
function RedirectConQuery({ to }) {
  const { search, hash } = useLocation();
  return <Navigate to={`${to}${search}${hash}`} replace />;
}

// PageLoader con animación
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

    <div className="srv-logo-anim" style={{ marginBottom: "1.5rem" }}>
      <img
        src="/srv-logo-96.webp"
        alt="WEARESRV"
        width="55"
        height="55"
        style={{ objectFit: "contain" }}
        onError={(e) => {
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

  // Inicializa el Pixel al cargar la app
  useEffect(() => {
    try {
      initMetaPixel();
    } catch (e) {
      console.warn("Meta Pixel no pudo inicializarse:", e);
    }
  }, []);

  // Envía el PageView con un event_id único en cada cambio de ruta
  useEffect(() => {
    try {
      trackPageView(generateEventId("pageview"));
    } catch (e) {
      console.warn("Tracking de página bloqueado:", e);
    }
  }, [location.pathname]);

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scripting/inscripcion" element={<CursoGrabado cursoKey="scripting" />} />
          <Route path="/scripting/gracias" element={<GraciasCurso cursoKey="scripting" />} />
          <Route path="/scratch/inscripcion" element={<CursoGrabado cursoKey="scratch" />} />
          <Route path="/scratch/gracias" element={<GraciasCurso cursoKey="scratch" />} />
          <Route path="/python/inscripcion" element={<CursoGrabado cursoKey="python" />} />
          <Route path="/python/gracias" element={<GraciasCurso cursoKey="python" />} />
          <Route path="/fullstack-csharp/inscripcion" element={<CursoGrabado cursoKey="fullstack-csharp" />} />
          <Route path="/fullstack-csharp/gracias" element={<GraciasCurso cursoKey="fullstack-csharp" />} />
          {/* Ruta backend: UNA sola página vende Master en JavaScript (clave interna "fundamentos-backend"),
              Backend Avanzado o los dos juntos. Las URLs viejas de cada curso redirigen con la opción preseleccionada.
              Las páginas de gracias siguen siendo una por producto porque Mercado Pago vuelve a cada una. */}
          <Route path="/ruta-backend/inscripcion" element={<CursoGrabado cursoKey="ruta-backend" />} />
          <Route path="/ruta-backend/gracias" element={<GraciasCurso cursoKey="ruta-backend" />} />
          <Route path="/javascript/inscripcion" element={<Navigate to="/ruta-backend/inscripcion?elegir=fundamentos-backend" replace />} />
          <Route path="/javascript/gracias" element={<GraciasCurso cursoKey="fundamentos-backend" />} />
          <Route path="/fundamentos-backend/inscripcion" element={<Navigate to="/ruta-backend/inscripcion?elegir=fundamentos-backend" replace />} />
          <Route path="/fundamentos-backend/gracias" element={<RedirectConQuery to="/javascript/gracias" />} />
          <Route path="/backend-avanzado/inscripcion" element={<Navigate to="/ruta-backend/inscripcion?elegir=backend-avanzado" replace />} />
          <Route path="/backend-avanzado/gracias" element={<GraciasCurso cursoKey="backend-avanzado" />} />
          <Route path="/full-stack/inscripcion" element={<ContactoCursoWeb />} />
          <Route path="/full-stack/gracias" element={<GraciasCurso cursoKey="intensivo" />} />
          <Route path="/certificates/:id" element={<Certificates />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/proximos-cursos" element={<ProximosCursos />} />
          <Route path="/fundamentos-ia" element={<FundamentosIA />} />
          {/* Redes, Linux y AWS en preventa. /redes/inscripcion es también el link "Formate como DevOps en AWS" del Linktree */}
          <Route path="/redes/inscripcion" element={<CursoGrabado cursoKey="redes" />} />
          <Route path="/redes/gracias" element={<GraciasCurso cursoKey="redes" />} />
          <Route path="/el-develop" element={<ElDevelop />} />
          <Route path="/sentryx" element={<Sentryx />} />
          <Route path="/eventbox" element={<EventBox />} />
          <Route path="/potrero-it" element={<Navigate to="/el-develop" replace />} />
          <Route path="/terminos" element={<Terminos />} />
          <Route path="/privacidad" element={<Privacidad />} />
          {/* Mismo componente con distinta key: al pasar de una a otra no se arrastra el formulario */}
          <Route path="/arrepentimiento" element={<Arrepentimiento key="arrepentimiento" modo="arrepentimiento" />} />
          <Route path="/baja" element={<Arrepentimiento key="baja" modo="baja" />} />
          {/* Cualquier link viejo o inexistente (ej. cursos que ya cerraron) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
