import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { initMetaPixels, trackPageView } from './data/metaPixel.js';

// Importación diferida (Code Splitting) de las páginas
const Header = lazy(() => import('./components/Header/Index'));
const Footer = lazy(() => import('./components/Footer/Index'));
const Home = lazy(() => import('./components/Home/Index'));
const ContactoCursoDB = lazy(() => import('./components/Courses/ContactoCursoDB.jsx'));
const ContactoCursoRedes = lazy(() => import('./components/Courses/ContactoCursoRedes.jsx'));
const ContactoCursoProgramacion = lazy(() => import('./components/Courses/ContactoCursoProgramacion.jsx'));
const Certificates = lazy(() => import('./components/Certificates/Index.jsx'));

// Spinner / Loader liviano mientras descarga el componente solicitado
const PageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
    <span>Cargando...</span>
  </div>
);

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    initMetaPixels();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [location.pathname]);

  return (
    <Layout>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inscripcion" element={<ContactoCursoDB />} />
          <Route path="/redes/inscripcion" element={<ContactoCursoRedes />} />
          <Route path="/backend/inscripcion" element={<ContactoCursoProgramacion />} />
          <Route path="/certificates/:id" element={<Certificates />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

function Layout({ children }) {
  const [searchParams] = useSearchParams();
  const showHeader = searchParams.get("header") !== "false";

  return (
    <>
      <Helmet>
        <meta name="description" content="Aprende desarrollo web Gratis con JavaScript, Python y otras tecnologías backend avanzadas." />
        <meta name="keywords" content="desarrollo web, backend, JavaScript, Python, desarrollo de software, programación backend" />
        <meta name="author" content="wearesrv" />
        <meta property="og:title" content="Cursos de Desarrollo Web - Aprende Gratis Backend y Más" />
        <meta property="og:description" content="Cursos completos sobre desarrollo backend con JavaScript y Python." />
        <meta property="og:url" content="https://wearesrv.com" />
      </Helmet>

      <Suspense fallback={null}>
        {showHeader && <Header />}
        <main>{children}</main>
        <Footer />
      </Suspense>
    </>
  );
}

export default App;