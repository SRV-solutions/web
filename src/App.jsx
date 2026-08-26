import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Header from './components/Header/Index';
import Footer from './components/Footer/Index';
import Home from './components/Home/Index';
import { trackPageView } from './data/metaPixel.js';
import ContactoCursoDB from './ContactoCursoDB.jsx';
import Certificates from './components/Certificates/Index.jsx';

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
    trackPageView();
  }, [location.pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inscripcion" element={<ContactoCursoDB />} />
        <Route path="/certificates/:id" element={<Certificates />} />
      </Routes>
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

      {showHeader && <Header />}
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default App;