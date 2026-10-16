import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import styles from "./CursoGrabado.module.css";
import { trackConversion } from "../../data/metaPixel";
import { CURSOS_GRABADOS, formatearPrecio } from "../../data/cursosGrabados";

export default function CursoGrabado({ cursoKey }) {
  const curso = CURSOS_GRABADOS[cursoKey];
  const [loading, setLoading] = useState(false);
  const descuento = Math.round((1 - curso.precio / curso.precioRegular) * 100);
  const tituloCompleto = [curso.tituloInicio, curso.tituloDestacado, curso.tituloFin]
    .filter(Boolean)
    .join(" ");

  const pixelData = {
    content_name: curso.contentName,
    currency: "ARS",
    value: curso.precio,
  };

  // ViewContent: alguien entró a ver el curso
  useEffect(() => {
    trackConversion("ViewContent", pixelData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursoKey]);

  const handleMercadoPagoCheckout = async () => {
    if (loading) return;
    setLoading(true);

    trackConversion("InitiateCheckout", pixelData);

    try {
      // Solo enviamos la clave del curso: el precio lo define el servidor
      const response = await fetch("/.netlify/functions/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curso: curso.key }),
      });

      const data = await response.json();

      if (response.ok && data.init_point) {
        window.location.href = data.init_point; // Redirige al checkout oficial de MP
      } else {
        throw new Error("No se pudo obtener el link de pago.");
      }
    } catch (error) {
      console.error("Error al conectar con Mercado Pago:", error);
      alert("Hubo un error al procesar el pago. Inténtalo nuevamente.");
      setLoading(false);
    }
  };

  return (
    <section id={`curso-${curso.key}`} className={styles.section}>
      <Helmet>
        <title>{`${tituloCompleto} | WEARESRV`}</title>
        <meta name="description" content={curso.descripcion} />
      </Helmet>

      <div className={styles.fullLayout}>
        {/* Columna Izquierda: Tarjeta de Compra */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={styles.badge}>
                ⚡ Acceso Inmediato e Ilimitado
              </div>
              <h2 className={styles.title}>
                {curso.tituloInicio}{" "}
                <span className={styles.orange}>{curso.tituloDestacado}</span>
                {curso.tituloFin && ` ${curso.tituloFin}`}
              </h2>
              <p className={styles.description}>{curso.descripcion}</p>

              {/* Oferta Limitada */}
              <div className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  <span className={styles.promoBadge}>
                    🔥 {descuento}% OFF - OFERTA LIMITADA
                  </span>
                  <span className={styles.timerTag}>
                    ⏳ Cupos abiertos 24/7
                  </span>
                </div>

                <div className={styles.priceContainer}>
                  <div className={styles.oldPriceBox}>
                    <span className={styles.oldPriceLabel}>Precio Regular</span>
                    <span className={styles.oldPrice}>
                      {formatearPrecio(curso.precioRegular)}
                    </span>
                  </div>
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>Inversión Única</span>
                    <div className={styles.mainPrice}>
                      {formatearPrecio(curso.precio)}{" "}
                      <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>

                <div className={styles.benefitsList}>
                  {curso.beneficios.map((beneficio) => (
                    <div key={beneficio} className={styles.benefitItem}>
                      ✓ {beneficio}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón Estilo Mercado Pago */}
            <div className={styles.actionContainer}>
              <button
                type="button"
                onClick={handleMercadoPagoCheckout}
                disabled={loading}
                className={styles.btnMercadoPago}
              >
                <svg
                  className={styles.mpLogo}
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                {loading ? "Conectando con MP..." : "Pagar con Mercado Pago"}
              </button>
              <p className={styles.secureText}>
                🔒 Transacción cifrada y protegida por Mercado Pago.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Plan de Estudios */}
        <div className={styles.contentColumn}>
          <div className={styles.modulesSummary}>
            <h3 className={styles.subTitle}>
              Plan de Estudios ({curso.clases} Clases / {curso.modulos.length} Módulos)
            </h3>
            <p className={styles.subTitleDesc}>{curso.subTituloDesc}</p>

            <div className={styles.modulesGrid}>
              {curso.modulos.map((mod, index) => (
                <div key={mod.titulo} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNum}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={styles.moduleTag}>Módulo {index + 1}</span>
                  </div>
                  <h4>{mod.titulo}</h4>
                  <ul className={styles.taskList}>
                    {mod.temas.map((tema) => (
                      <li key={tema}>{tema}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
