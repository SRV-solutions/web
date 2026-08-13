import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Checkbox, Button, Grid, Card, CardContent, Typography } from "@mui/material";
import styles from './style.module.css'; // Suponiendo que tienes el archivo CSS

const PY = "py"; // Python
const BE1 = "be1"; // Fundamentos de Backend
const BE2 = "be2"; // Backend Avanzado

const UpSell = () => {
    const location = useLocation();
    const [selectedUpsells, setSelectedUpsells] = useState([]);

    const products = useMemo(() => [
        { id: PY, name: "Python desde cero", basePrice: 497, image: "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOPYTHON.png", copy: "DA EL PRIMER PASO EN EL MUNDO DE LA PROGRAMACIÓN CON PYTHON DESDE CERO!!!", copyhover: "SI NUNCA HAS PROGRAMADO ANTES O QUIERES REFORZAR TUS BASES. ESTE CURSO ES PERFECTO PARA VOS. CON LECCIONES CLARAS Y PRÁCTICAS, APRENDERÁS DESDE LOS FUNDAMENTOS HASTA CREAR TUS PRIMERAS APLICACIONES. ¡EL FUTURO DE LA PROGRAMACIÓN ESTÁ EN TUS MANOS! NO DEJES PASAR ESTA OPORTUNIDAD DE COMENZAR TU VIAJE EN EL DESARROLLO DE SOFTWARE." },
        { id: BE1, name: "Fundamentos de Backend", basePrice: 947, image: "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOFUNDAMENTOSBACKEND.png", copy: "INTRODUCITE EN EL MUNDO DEL DESARROLLO BACKEND", copyhover: "" },
        { id: BE2, name: "Backend Avanzado", basePrice: 1147, image: "https://imagenes-landing.s3.us-east-1.amazonaws.com/nuevaweb/LOGOBACKENDAVANZADO.png", copy: "¿YA MANEJAS LO BÁSICO DEL BACKEND? ¡AHORA LLEVA TUS HABILIDADES A OTRO NIVEL CON BACKEND AVANZADO!", copyhover: "" },
    ], []);

    const paymentLinks = useMemo(() => ({
        soloPY: "https://pay.hotmart.com/V91996078A",
        soloBE1: "https://pay.hotmart.com/R95431277I",
        soloBE2: "https://pay.hotmart.com/P96937823Q",
        combo1: "https://pay.hotmart.com/A97434643E",
        combo2: "https://pay.hotmart.com/F97453530Q",
        combo3: "https://pay.hotmart.com/M97453557F",
        combo4: "https://pay.hotmart.com/R97435036F",
        combo5: "https://pay.hotmart.com/X97434865R",
        combo6: "https://pay.hotmart.com/V97453572D",
        comboTodos: "https://pay.hotmart.com/D97435090D",
    }), []);

    const comboLinks = useMemo(() => ({
        [PY]: { [BE1]: paymentLinks.combo1, [BE2]: paymentLinks.combo2 },
        [BE1]: { [PY]: paymentLinks.combo3, [BE2]: paymentLinks.combo4 },
        [BE2]: { [PY]: paymentLinks.combo5, [BE1]: paymentLinks.combo6 },
    }), [paymentLinks]);

    const productId = new URLSearchParams(location.search).get("productId");
    const mainProduct = useMemo(() => products.find((product) => product.id === productId), [productId, products]);

    const { totalPrice, paymentLink } = useMemo(() => {
        if (!mainProduct) return { totalPrice: 0, paymentLink: "" };

        let calculatedTotalPrice = mainProduct.basePrice;
        let calculatedLink = paymentLinks[`solo${mainProduct.id.toUpperCase()}`];
        const discounts = { [PY]: 1, [BE1]: 1, [BE2]: 1 };

        if (selectedUpsells.length === 1) {
            discounts[mainProduct.id] = 0.75;
            discounts[selectedUpsells[0]] = 0.5;

            calculatedTotalPrice = products.reduce((acc, product) => {
                if ([mainProduct.id, selectedUpsells[0]].includes(product.id)) {
                    return acc + product.basePrice * discounts[product.id];
                }
                return acc;
            }, 0);

            calculatedLink = comboLinks[mainProduct.id][selectedUpsells[0]];
        } else if (selectedUpsells.length === 2) {
            discounts[PY] = discounts[BE1] = discounts[BE2] = 0.5;

            calculatedTotalPrice = products.reduce((sum, product) => sum + product.basePrice * discounts[product.id], 0);

            calculatedLink = paymentLinks.comboTodos;
        }

        return { totalPrice: calculatedTotalPrice, paymentLink: calculatedLink };
    }, [mainProduct, selectedUpsells, products, paymentLinks, comboLinks]);

    const handleCheckboxChange = (selectedId) => {
        setSelectedUpsells((prevSelected) => {
            const updatedSelection = prevSelected.includes(selectedId)
                ? prevSelected.filter((id) => id !== selectedId)
                : [...prevSelected, selectedId];
            return updatedSelection;
        });
    };

    const getDiscountedPrice = (product) => {
        if (selectedUpsells.includes(product.id)) {
            return (product.basePrice * 0.5).toFixed(2);
        }
        return product.basePrice.toFixed(2);
    };

    const totalBasePrice = useMemo(() => products.reduce((acc, product) => acc + product.basePrice, 0), [products]);
    const totalDiscountBasePrice = useMemo(() => products.reduce((acc, product) => acc + product.basePrice * 0.5, 0), [products]);

    if (!mainProduct) {
        return (
            <div className={styles.container}>
                <Typography color="error">Producto no encontrado. Por favor, revisa el enlace.</Typography>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Typography variant="h4" align="center" color="white" gutterBottom sx={{
                fontSize: "2rem",
                textShadow: "2px 2px 0px #48e, -2px -2px 0px #48e, 2px -2px 0px #48e, -2px 2px 0px #48e",
                fontFamily: "Retro"
            }}>
                ¡Excelente decisión! Estás un paso más cerca de concretar tus metas.
            </Typography>
            <Typography className={styles.description} variant="h5" align="center" color="white" paragraph sx={{ fontFamily: "Retro" }}>
                Pero no queremos que te detengas aquí. ¡Tenemos algo especial para vos!
            </Typography>
            <Typography variant="body1" align="center" color="white" className={styles.productContainer}>
                <b style={{ fontSize: "1.5rem" }}>Producto principal:</b> <strong className={styles.productName}>{mainProduct.name}</strong> <span style={{ color: "#00ff5e", fontSize: "2rem", fontFamily: "Retro" }}>U$D{mainProduct.basePrice}</span>
                <img src={mainProduct.image} className={styles.smallImage} alt={mainProduct.name} />
            </Typography>

            <Typography className={styles.description_aditional} variant="body2" align="center" color="white" paragraph>
                Aquí te ofrecemos cursos adicionales con descuentos increíbles. ¡Agregalos ahora!
            </Typography>

            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: "100%" }} style={{ backgroundColor: '#00a3ff', color: 'white', borderRadius: "100px", border: "4px solid #ff9b33", paddingRight: "10px", paddingLeft: "10px" }}>
                        <CardContent>
                            <Typography align="center" variant="h3">Oferta de Cursos</Typography>
                            <Typography variant="body1">
                                Si llevas{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', display: 'inline' }}>
                                    1
                                </Typography>{' '}
                                adicional tienes,{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', display: 'inline' }}>
                                    25%
                                </Typography>{' '}
                                de descuento en tu producto{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', display: 'inline' }}>
                                    + 50%
                                </Typography>{' '}en un producto seleccionado.
                            </Typography>
                            <Typography variant="body1">
                                Si llevas{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', display: 'inline' }}>
                                    2
                                </Typography>{' '}
                                adicionales tienes,{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontWeight: 'bold', display: 'inline' }}>
                                    50%
                                </Typography>{' '}de descuento en todos los productos.
                            </Typography>

                            <Typography>
                                Esto significa que pasas de pagar{' '}
                                <Typography variant="h6" sx={{ color: 'red', fontSize: '1.2rem', display: 'inline' }}>
                                    U$D{totalBasePrice}
                                </Typography>{' '}
                                a solo{' '}
                                <Typography variant="h6" sx={{ color: 'green', fontSize: '1.2rem', display: 'inline' }}>
                                    U$D{totalDiscountBasePrice}
                                </Typography>
                                . ¡Ahorra más de U$D1200!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={5}>
                    <Card sx={{ height: "100%" }} style={{ backgroundColor: '#00a3ff', color: 'white', borderRadius: "100px", border: "4px solid #ff9b33", padding: "5px" }}>
                        <CardContent>
                            <Typography align="center" variant="h3">Productos Adicionales</Typography>
                            {products
                                .filter((product) => product.id !== mainProduct.id)
                                .map((product) => (
                                    <div key={product.id}>
                                        <Checkbox
                                            checked={selectedUpsells.includes(product.id)}
                                            onChange={() => handleCheckboxChange(product.id)}
                                            color="success"
                                            style={{ color: 'white' }}
                                        />
                                        <span>{product.name}
                                            <span style={{ textDecoration: selectedUpsells.includes(product.id) ? "line-through" : "none", marginLeft: '1rem', color: selectedUpsells.includes(product.id) ? "red" : '', fontFamily: "sans-serif", fontSize: "1.3rem" }}>
                                                U$D{product.basePrice}
                                            </span>
                                        </span>
                                        {selectedUpsells.includes(product.id) && (
                                            <span style={{ color: "green", marginLeft: '1rem', fontFamily: "sans-serif", fontSize: "1.3rem" }}>
                                                U$D{getDiscountedPrice(product)}
                                            </span>
                                        )}
                                        <p className={styles.copy}>
                                            {product.copy}
                                            <span className={styles.tooltip}>{product.copyhover}</span> {/* Descripción genérica */}
                                        </p>
                                    </div>
                                ))}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Typography variant="h5" color="#00ff5e" gutterBottom fontFamily={"sans-serif"} marginTop={"20px"} fontWeight={"bold"}>
                Precio Total: U$D{totalPrice.toFixed(2)}
            </Typography>

            {paymentLink && (
                <Button
                    variant="contained"
                    color={selectedUpsells.length ? "success" : "primary"}
                    href={paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                        backgroundColor: "#00a3ff",
                        color: "white",
                        border: "4px solid #ff9b33",
                        fontFamily: "Retro",
                        fontSize: "1.5rem",
                        borderRadius: "20px",
                        transition: "all .5s",
                        "&:hover": {
                            backgroundColor: "#087fc2",
                            borderColor: "#e08526"
                        }
                    }}
                >
                    Ir a Pagar
                </Button>
            )}
        </div>
    );
};

export default UpSell;
