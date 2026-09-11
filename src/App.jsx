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

const PageLoader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "40vh",
      color: "#f97316",
      fontWeight: "600",
    }}
  >
    <span>Cargando...</span>
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