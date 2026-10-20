import React, { useEffect, useRef, useState } from "react";
import styles from "./CursoGrabado.module.css";
import Seo, { SITE_URL } from "../Seo";
import { trackConversion } from "../../data/metaPixel";
import { CURSOS_GRABADOS, formatearPrecio, estaEnPreventa } from "../../data/cursosGrabados";

const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";
const WHATSAPP_URL = "https://wa.me/5491123869799?text=" + encodeURIComponent("Hola, tengo una consulta sobre los cursos");

function pasosCompra(curso, preventa) {
  return [
    { titulo: "Pagás con Mercado Pago", texto: "Tarjeta, débito o dinero en cuenta. El pago es seguro y lo procesa Mercado Pago." },
    preventa
      ? {
          titulo: `El ${curso.preventa.fechaTexto} te llega el acceso al mail`,
          texto: "Tu pago reserva el lugar al precio de preventa. Ese día recibís un correo con el link a la carpeta del curso en Google Drive.",
        }
      : { titulo: "Te llega el acceso al mail", texto: "Apenas se aprueba el pago, recibís un correo con el link a la carpeta del curso en Google Drive." },
    { titulo: "Estudiás a tu ritmo", texto: "Las clases están grabadas: las ves cuando quieras, las veces que quieras, desde la compu o el celular." },
  ];
}

function preguntasFrecuentes(curso, preventa) {
  return [
    ...(preventa
      ? [
          {
            q: "¿Qué es la preventa y cuándo empieza el curso?",
            a: `El curso se habilita el ${curso.preventa.fechaTexto}. Si lo comprás antes, lo pagás ${formatearPrecio(curso.precio)} en lugar de ${formatearPrecio(curso.precioRegular)} y ese día te llega el acceso al mail, junto con el resto de los que reservaron.`,
          },
        ]
      : []),
    {
      q: "¿Necesito saber programar antes de empezar?",
      a: curso.nivel.startsWith("Desde cero")
        ? "No. El curso arranca desde cero: instalás las herramientas y escribís tu primera línea de código en la primera clase."
        : "Conviene tener las bases de JavaScript. Si todavía no las tenés, te recomendamos empezar por Backend Fundamentos.",
    },
    {
      q: "¿Cómo y cuándo recibo el curso?",
      a: preventa
        ? `El ${curso.preventa.fechaTexto} te llega un correo con el acceso a la carpeta del curso en Google Drive, al mail con el que pagaste. Hasta esa fecha tu lugar queda reservado.`
        : "Apenas Mercado Pago aprueba el pago, te llega un correo con el acceso a la carpeta del curso en Google Drive. Es automático, las 24 horas.",
    },
    {
      q: "¿Qué mail tengo que usar para pagar?",
      a: "Usá un mail de Gmail o una cuenta de Google: el material se comparte por Google Drive y el acceso queda vinculado a ese correo.",
    },
    {
      q: "¿Por cuánto tiempo tengo acceso?",
      a: "De por vida. Pagás una sola vez y el material queda disponible para que lo repases cuando lo necesites.",
    },
    {
      q: "¿Qué medios de pago puedo usar?",
      a: "Todos los que ofrece Mercado Pago: tarjeta de crédito o débito y dinero en cuenta, entre otros. Las opciones de cuotas las muestra Mercado Pago al momento de pagar.",
    },
    {
      q: "¿Y si me trabo con algún tema?",
      a: "Podés sumarte a la comunidad de WEARESRV en Discord para compartir dudas, o escribirnos por WhatsApp.",
    },
  ];
}

export default function CursoGrabado({ cursoKey }) {
  const curso = CURSOS_GRABADOS[cursoKey];
  const [loading, setLoading] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const buyRef = useRef(null);
  const descuento = Math.round((1 - curso.precio / curso.precioRegular) * 100);
  const tituloCompleto = [curso.tituloInicio, curso.tituloDestacado, curso.tituloFin].filter(Boolean).join(" ");
  const preventa = estaEnPreventa(curso);
  const fechaAcceso = preventa ? curso.preventa.fechaTexto : null;
  const faq = preguntasFrecuentes(curso, preventa);
  const pasos = pasosCompra(curso, preventa);
  const path = `/${curso.ruta}/inscripcion`;

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

  // Barra de compra fija en celular: aparece cuando el botón principal sale de pantalla
  useEffect(() => {
    if (!buyRef.current || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting), { threshold: 0 });
    observer.observe(buyRef.current);
    return () => observer.disconnect();
  }, []);

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

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: tituloCompleto,
      description: curso.metaDescripcion,
      url: `${SITE_URL}${path}`,
      inLanguage: "es",
      provider: { "@type": "Organization", name: "WEARESRV", sameAs: SITE_URL },
      offers: {
        "@type": "Offer",
        category: "Paid",
        price: curso.precio,
        priceCurrency: "ARS",
        availability: preventa ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
        ...(preventa && {
          availabilityStarts: curso.preventa.hasta.toISOString(),
          priceValidUntil: curso.preventa.hasta.toISOString().slice(0, 10),
        }),
        url: `${SITE_URL}${path}`,
      },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Online",
        courseWorkload: `${curso.clases} clases grabadas`,
      },
      syllabusSections: curso.modulos.map((m) => ({ "@type": "Syllabus", name: m.titulo, description: m.temas.join(". ") })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: tituloCompleto, item: `${SITE_URL}${path}` },
      ],
    },
  ];

  const botonPago = (extraClass = "") => (
    <button
      type="button"
      onClick={handleMercadoPagoCheckout}
      disabled={loading}
      className={`${styles.btnMercadoPago} ${extraClass}`}
    >
      <svg className={styles.mpLogo} viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M18 8h-1V6a5 5 0 0 0-10 0v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2zm-6 9a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm3.1-9H8.9V6a3.1 3.1 0 0 1 6.2 0v2z" />
      </svg>
      {loading
        ? "Conectando con Mercado Pago..."
        : `${preventa ? "Reservar mi acceso" : "Quiero mi acceso"} · ${formatearPrecio(curso.precio)}`}
    </button>
  );

  return (
    <section id={`curso-${curso.key}`} className={styles.section}>
      <Seo
        title={
          preventa
            ? `${tituloCompleto}: preventa, acceso el ${fechaAcceso} | WEARESRV`
            : `${tituloCompleto}: curso online con acceso de por vida | WEARESRV`
        }
        description={curso.metaDescripcion}
        path={path}
        type="product"
        jsonLd={jsonLd}
      />

      <div className={styles.fullLayout}>
        {/* Columna Izquierda: Tarjeta de Compra */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={styles.badge}>
                {preventa ? `🚀 Preventa · el acceso llega el ${fechaAcceso}` : "⚡ Acceso inmediato y de por vida"}
              </div>
              <h1 className={styles.title}>
                {curso.tituloInicio} <span className={styles.orange}>{curso.tituloDestacado}</span>
                {curso.tituloFin && ` ${curso.tituloFin}`}
              </h1>
              <p className={styles.hook}>{curso.gancho}</p>
              <p className={styles.description}>{curso.descripcion}</p>
              <p className={styles.level}>🎯 {curso.nivel}</p>

              <div className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  {descuento > 0 && (
                    <span className={styles.promoBadge}>
                      {preventa ? `🔥 Precio de preventa · ${descuento}% OFF` : `🔥 ${descuento}% OFF · Precio promocional`}
                    </span>
                  )}
                  <span className={styles.timerTag}>{preventa ? `Solo hasta el ${fechaAcceso}` : "Pago único, sin suscripción"}</span>
                </div>

                <div className={styles.priceContainer}>
                  {descuento > 0 && (
                    <div className={styles.oldPriceBox}>
                      <span className={styles.oldPriceLabel}>{preventa ? `Desde el ${fechaAcceso}` : "Precio regular"}</span>
                      <span className={styles.oldPrice}>{formatearPrecio(curso.precioRegular)}</span>
                    </div>
                  )}
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>{preventa ? "Reservás hoy por" : "Pagás hoy"}</span>
                    <div className={styles.mainPrice}>
                      {formatearPrecio(curso.precio)} <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>

                <ul className={styles.benefitsList}>
                  {curso.beneficios.map((beneficio) => (
                    <li key={beneficio} className={styles.benefitItem}>
                      ✓ {beneficio}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.actionContainer} ref={buyRef}>
              {botonPago()}
              <p className={styles.secureText}>
                🔒 Pago 100% seguro procesado por Mercado Pago.{" "}
                {preventa ? `El acceso te llega al mail el ${fechaAcceso}.` : "El acceso te llega al mail al instante."}
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Plan de Estudios y argumentos de venta */}
        <div className={styles.contentColumn}>
          <div className={styles.twoCols}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Ideal para vos si…</h2>
              <ul className={styles.checkList}>
                {curso.paraQuien.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Al terminar vas a poder…</h2>
              <ul className={styles.checkList}>
                {curso.resultados.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.modulesSummary}>
            <h2 className={styles.subTitle}>
              Plan de estudios ({curso.clases} clases · {curso.modulos.length} módulos)
            </h2>
            <p className={styles.subTitleDesc}>{curso.subTituloDesc}</p>

            <div className={styles.modulesGrid}>
              {curso.modulos.map((mod, index) => (
                <div key={mod.titulo} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNum}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.moduleTag}>Módulo {index + 1}</span>
                  </div>
                  <h3>{mod.titulo}</h3>
                  <ul className={styles.taskList}>
                    {mod.temas.map((tema) => (
                      <li key={tema}>{tema}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={styles.subTitle}>Cómo funciona</h2>
            <ol className={styles.steps}>
              {pasos.map((paso, i) => (
                <li key={paso.titulo} className={styles.step}>
                  <span className={styles.stepNum}>{i + 1}</span>
                  <div>
                    <h3>{paso.titulo}</h3>
                    <p>{paso.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h2 className={styles.subTitle}>Preguntas frecuentes</h2>
            <div className={styles.faq}>
              {faq.map((f) => (
                <details key={f.q} className={styles.faqItem}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
            <p className={styles.helpText}>
              ¿Otra duda? <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Escribinos por WhatsApp</a> o sumate a la{" "}
              <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer">comunidad en Discord</a>.
            </p>
          </div>

          <div className={styles.finalCta}>
            <h2>{preventa ? "Reservá tu lugar al precio de preventa." : "Hoy puede ser tu primera clase."}</h2>
            <p>
              {preventa
                ? `${curso.clases} clases, acceso de por vida y un pago único de ${formatearPrecio(curso.precio)}. Desde el ${fechaAcceso} pasa a ${formatearPrecio(curso.precioRegular)}, y ese mismo día te llega el acceso.`
                : `${curso.clases} clases, acceso de por vida y un pago único de ${formatearPrecio(curso.precio)}. Empezá esta misma noche.`}
            </p>
            {botonPago(styles.btnFinal)}
          </div>
        </div>
      </div>

      {/* Barra fija de compra en celular */}
      <div className={`${styles.mobileBar} ${showBar ? styles.mobileBarVisible : ""}`} aria-hidden={!showBar}>
        <div className={styles.mobileBarPrice}>
          <span>{tituloCompleto}</span>
          <strong>{formatearPrecio(curso.precio)}</strong>
        </div>
        <button type="button" onClick={handleMercadoPagoCheckout} disabled={loading} tabIndex={showBar ? 0 : -1}>
          {loading ? "Conectando..." : preventa ? "Reservar" : "Comprar"}
        </button>
      </div>
    </section>
  );
}
