import Header from "./Header/Index";
import BeneficiosSection from "./BeneficiosSection/Index";
import Testimonios from "./Testimonios/Index";
import { redirect, useNavigate } from 'react-router-dom';
import AboutUs from "./AboutUs/Index";
import FooterSection from "./FooterSection/Index";

export default function PythonEngineer(){
    const navigate = useNavigate();
    const redirectToUrl = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
        navigate('/products/pay?productId=py&header=false');
    }
    return (
        <div style={{cursor: "default"}}>
            <Header redirectToUrl={redirectToUrl} />
            <AboutUs redirectToUrl={redirectToUrl}/>
            <BeneficiosSection redirectToUrl={redirectToUrl} />
            <Testimonios/>
            <FooterSection redirectToUrl={redirectToUrl} />
        </div>
    )
}