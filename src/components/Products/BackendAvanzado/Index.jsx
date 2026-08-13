import { useNavigate } from 'react-router-dom';

import Header from "./Header/Index";
import Beneficios from "./Beneficios/Index";
import Contenido from "./Contenido/Index";
import Testimonios from "./Testimonios/Index";
import Footer from "./Footer/Index";

export default function BackendAvanzado() {
    const navigate = useNavigate();
    const redirectToUrl = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        navigate('/products/pay?productId=be2&header=false');
    };
    return (
        <>
            <Header />
            <Beneficios redirectToUrl={redirectToUrl} />
            <Contenido redirectToUrl={redirectToUrl} />
            <Testimonios redirectToUrl={redirectToUrl} />
            <Footer redirectToUrl={redirectToUrl} />
        </>
    );
}
