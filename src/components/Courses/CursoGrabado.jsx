import React, { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import styles from "./CursoGrabado.module.css";
import Seo, { SITE_URL } from "../Seo";
import { trackConversion, getMetaCookies } from "../../data/metaPixel";
import { CURSOS_GRABADOS, formatearPrecio, estaEnPreventa, comboQueIncluye, nombreCurso, enCyber, precioSeparado, CYBER_FECHAS } from "../../data/cursosGrabados";
import { AHORRO_POR_CURSO, agregablesPara, infoPack, normalizarSet, setValido, pitchUnidad, unidadesDeParametro, enCampaniaRedes } from "../../data/packs";

const DISCORD_URL = "https://discord.com/invite/QuAmDxrNMu";
const WHATSAPP_URL = "https://wa.me/5491123869799?text=" + encodeURIComponent("Hola, tengo una consulta sobre los cursos");

function pasosCompra(curso, preventa) {
  return [
    { titulo: "Pagás con Mercado Pago", texto: "Tarjeta, débito o dinero en cuenta. El pago es seguro y lo procesa Mercado Pago." },
    preventa
      ? {
          titulo: "Te llega hoy el link a tu carpeta",
          texto: `Apenas se aprueba el pago recibís el correo con el acceso a la carpeta del curso en Google Drive. Las clases se habilitan ahí el ${curso.preventa.fechaTexto}: no tenés que hacer nada más.`,
        }
      : {
          titulo: curso.combo ? "Te llegan los dos accesos al mail" : "Te llega el acceso al mail",
          texto: curso.combo
            ? "Apenas se aprueba el pago, recibís un solo correo con los links a las carpetas de los dos cursos en Google Drive."
            : "Apenas se aprueba el pago, recibís un correo con el link a la carpeta del curso en Google Drive.",
        },
    { titulo: "Estudiás a tu ritmo", texto: "Las clases están grabadas: las ves cuando quieras, las veces que quieras, desde la compu o el celular." },
  ];
}

function preguntasFrecuentes(curso, preventa) {
  return [
    ...(curso.combo
      ? [
          {
            q: "¿Cómo recibo los dos cursos?",
            a: "En un solo mail, apenas se aprueba el pago, con los links a las dos carpetas de Google Drive. Podés arrancar por el que quieras, aunque recomendamos seguir el orden: primero el Master en JavaScript y después Backend Avanzado.",
          },
          {
            q: "¿Conviene el combo o comprarlos por separado?",
            a: `Si ya sabés que vas por backend, el combo: pagás ${formatearPrecio(curso.precio)} en lugar de ${formatearPrecio(precioSeparado(curso))} y te ahorrás ${formatearPrecio(precioSeparado(curso) - curso.precio)}. Si solo querés aprender JavaScript, comprá ese curso solo y, si después seguís, sumás el Avanzado.`,
          },
        ]
      : []),
    ...(preventa
      ? [
          {
            q: "¿Qué es la preventa y cuándo empieza el curso?",
            a: `Las clases se habilitan el ${curso.preventa.fechaTexto}. Si lo comprás antes, lo pagás ${formatearPrecio(curso.precio)} en lugar de ${formatearPrecio(curso.precioRegular)}. El acceso a tu carpeta de Google Drive te llega al mail apenas pagás, y ese día aparecen ahí las clases.`,
          },
        ]
      : []),
    ...(curso.preguntasExtra || []),
    {
      q: "¿Necesito saber programar antes de empezar?",
      // "requisitos" es para los cursos que no son de programación (Redes, Linux y AWS)
      a: curso.requisitos
        ? curso.requisitos
        : curso.nivel.startsWith("Desde cero")
          ? "No. El curso arranca desde cero: instalás las herramientas y escribís tu primera línea de código en la primera clase."
          : "Conviene tener las bases de JavaScript. Si todavía no las tenés, te recomendamos empezar por el Master en JavaScript.",
    },
    {
      q: "¿Cómo y cuándo recibo el curso?",
      a: preventa
        ? `Apenas Mercado Pago aprueba el pago, te llega un correo con el acceso a tu carpeta del curso en Google Drive, al mail con el que pagaste. La carpeta se completa con las clases el ${curso.preventa.fechaTexto}.`
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
    // En Scratch el examen no es en vivo: es una evaluación para chicos desde la plataforma
    ...(curso.key !== "scratch"
      ? [
          {
            q: "¿El curso tiene certificado?",
            a: "Sí. Cuando terminás el curso podés rendir un examen final en vivo con un docente, sin costo extra por haber comprado el curso, y obtenés un certificado verificable online para sumar a tu CV o LinkedIn. Por ahora el examen se coordina por WhatsApp; muy pronto se va a pedir directamente desde E-stellarium, nuestra plataforma educativa.",
          },
        ]
      : [
          {
            q: "¿Mi hijo o hija recibe un certificado?",
            a: "Sí. Muy pronto va a poder hacer una evaluación pensada para chicos desde E-stellarium, nuestra plataforma educativa: unas preguntas y un jueguito, y se lleva su propio certificado verificable para mostrar con orgullo.",
          },
        ]),
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
  // "curso" es la página (URL, SEO). Si es un combo, la misma página vende cada curso por separado
  // o los dos juntos con un selector; "producto" es lo que está elegido y lo que se muestra y se cobra.
  const curso = CURSOS_GRABADOS[cursoKey];
  const combo = curso.combo ? curso : comboQueIncluye(curso.key);
  const opciones = combo ? [...combo.combo.map((k) => CURSOS_GRABADOS[k]), combo] : [];
  const [searchParams] = useSearchParams();
  // ?elegir=clave preselecciona una opción (links de la home, menú y redirecciones de las URLs viejas)
  const elegirInicial = (() => {
    const pedido = searchParams.get("elegir");
    return opciones.some((op) => op.key === pedido) ? pedido : curso.key;
  })();
  const [loading, setLoading] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const [seleccion, setSeleccion] = useState(elegirInicial);
  // "Sumá a tu compra": cursos que el visitante agregó al curso elegido (claves de unidades).
  // ?sumar=python,csharp los deja preseleccionados (banners de la home); los que no aplican se ignoran.
  const sumarInicial = unidadesDeParametro(searchParams.get("sumar"));
  const [extras, setExtras] = useState(sumarInicial);
  // Código de alumnos de SRV: lo valida el servidor comparando su hash, y es el servidor quien fija
  // el precio especial. Acá solo se guarda el código aceptado para mandarlo al crear el pago.
  const [cuponTexto, setCuponTexto] = useState("");
  const [cupon, setCupon] = useState(null); // { curso, codigo, precio }
  const [cuponEstado, setCuponEstado] = useState({ cargando: false, error: "" });
  const producto = CURSOS_GRABADOS[seleccion] || curso;
  const tituloProducto = [producto.tituloInicio, producto.tituloDestacado, producto.tituloFin].filter(Boolean).join(" ");
  const buyRef = useRef(null);
  // Solo hay descuento si precioRegular es un precio real (preventa con fecha o combo): ver cursosGrabados.js
  const descuento = producto.precioRegular > producto.precio ? Math.round((1 - producto.precio / producto.precioRegular) * 100) : 0;
  const tituloCompleto = [curso.tituloInicio, curso.tituloDestacado, curso.tituloFin].filter(Boolean).join(" ");
  const preventa = estaEnPreventa(producto);
  const cyber = enCyber();
  const fechaAcceso = preventa ? producto.preventa.fechaTexto : null;
  const faq = preguntasFrecuentes(producto, preventa);
  const pasos = pasosCompra(producto, preventa);
  const path = `/${curso.ruta}/inscripcion`;
  const incluye = producto.combo ? producto.combo.map((k) => CURSOS_GRABADOS[k]) : null;
  const nombreCorto = (c) => `${c.tituloInicio} ${c.tituloDestacado}`;

  // Código de alumnos aplicado a ESTE producto (si cambia el producto, deja de aplicar solo)
  const cuponAplicado = producto.cuponAlumnos && cupon && cupon.curso === producto.key ? cupon : null;

  // Cursos que se pueden sumar al producto elegido (con código de alumnos no se ofrecen packs).
  // Un conjunto es combinable si forma un pack válido o si se convierte en un combo existente
  // (Master en JavaScript + Backend Avanzado = Ruta Backend).
  const agregables = cuponAplicado ? [] : agregablesPara(producto.key);
  // Página de Redes durante su preventa: los cursos que se suman tienen precio de campaña (src/data/packs.js)
  const campaniaRedes = producto.key === "redes" && enCampaniaRedes();
  const combinable = (keys) => {
    const set = normalizarSet(keys);
    return set.length === 1 ? set[0] !== producto.key : setValido(set);
  };
  // Si cambia el producto (selector de la ruta) o se eligió algo incompatible, se descarta solo
  const extrasValidos = extras.reduce(
    (lista, k) => (agregables.includes(k) && !lista.includes(k) && combinable([producto.key, ...lista, k]) ? [...lista, k] : lista),
    [],
  );
  const puedeSumar = (k) => extrasValidos.includes(k) || combinable([producto.key, ...extrasValidos, k]);
  const toggleExtra = (k) => setExtras((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));
  // Qué se cobra por un conjunto: un pack, o el combo en que se convierte (Ruta Backend)
  const infoDeSet = (keys) => {
    const set = normalizarSet(keys);
    if (set.length > 1) return infoPack(set);
    const c = CURSOS_GRABADOS[set[0]];
    const cursos = c.combo ? c.combo.map((k) => CURSOS_GRABADOS[k]) : [c];
    const precioSeparado = cursos.reduce((t, x) => t + x.precio, 0);
    return {
      key: c.key,
      itemId: c.itemId,
      contentName: c.contentName,
      precio: c.precio,
      nombre: nombreCurso(c),
      cursos,
      cantidadCursos: cursos.length,
      clases: cursos.reduce((t, x) => t + x.clases, 0),
      precioSeparado,
      ahorro: precioSeparado - c.precio,
    };
  };
  const pack = extrasValidos.length > 0 ? infoDeSet([producto.key, ...extrasValidos]) : null;
  // Lo que se paga "de más" por sumar un curso al resto de lo elegido
  const costoDeSumar = (k) => {
    const resto = extrasValidos.filter((x) => x !== k);
    const sin = resto.length > 0 ? infoDeSet([producto.key, ...resto]).precio : producto.precio;
    return infoDeSet([producto.key, ...resto, k]).precio - sin;
  };
  // Lo que se cobra y se muestra en el precio, el botón y la barra: el curso o el pack armado
  const compra = pack
    ? {
        key: pack.key,
        itemId: pack.itemId,
        contentName: pack.contentName,
        precio: pack.precio,
        nombre: pack.nombre,
        clases: pack.clases,
        cantidadCursos: pack.cantidadCursos,
      }
    : {
        key: producto.key,
        itemId: producto.itemId,
        contentName: producto.contentName,
        precio: cuponAplicado ? cuponAplicado.precio : producto.precio,
        cupon: cuponAplicado ? cuponAplicado.codigo : undefined,
        nombre: tituloProducto,
        clases: producto.clases,
        cantidadCursos: producto.combo ? producto.combo.length : 1,
      };

  const pixelData = {
    content_name: curso.contentName,
    content_ids: [curso.itemId],
    content_type: "product",
    currency: "ARS",
    value: curso.precio,
  };

  // ViewContent: alguien entró a ver el curso. Al cambiar de página, el selector vuelve a su valor inicial.
  useEffect(() => {
    setSeleccion(elegirInicial);
    setExtras(sumarInicial);
    setCupon(null);
    setCuponTexto("");
    setCuponEstado({ cargando: false, error: "" });
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

  // Valida el código de alumnos contra el servidor (nunca se compara en el navegador)
  const aplicarCupon = async (e) => {
    e.preventDefault();
    const codigo = cuponTexto.trim();
    if (!codigo || cuponEstado.cargando) return;
    setCuponEstado({ cargando: true, error: "" });
    try {
      const res = await fetch("/.netlify/functions/validar-cupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curso: producto.key, cupon: codigo }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.valido && Number.isFinite(data.precio)) {
        setCupon({ curso: producto.key, codigo, precio: data.precio });
        setExtras([]);
        setCuponEstado({ cargando: false, error: "" });
      } else if (res.ok) {
        setCuponEstado({ cargando: false, error: "Ese código no es válido para este curso. Revisalo o escribinos por WhatsApp." });
      } else {
        setCuponEstado({ cargando: false, error: "No pudimos verificar el código. Probá de nuevo en unos segundos." });
      }
    } catch {
      setCuponEstado({ cargando: false, error: "No pudimos verificar el código. Probá de nuevo en unos segundos." });
    }
  };

  const quitarCupon = () => {
    setCupon(null);
    setCuponTexto("");
    setCuponEstado({ cargando: false, error: "" });
  };

  const handleMercadoPagoCheckout = async () => {
    if (loading) return;
    setLoading(true);

    trackConversion("InitiateCheckout", {
      content_name: compra.contentName,
      content_ids: [compra.itemId],
      content_type: "product",
      currency: "ARS",
      value: compra.precio,
    });

    try {
      // Solo enviamos la clave de lo que se compra (curso o combo sumado): el precio lo define el servidor.
      // "desde" es el curso de esta página: define a qué página de gracias vuelve el comprador.
      // Las cookies del Pixel quedan guardadas en el pago para el Purchase por CAPI.
      const response = await fetch("/.netlify/functions/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ curso: compra.key, desde: producto.key, cupon: compra.cupon, ...getMetaCookies() }),
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
        : `${
            preventa
              ? "Reservar mi acceso"
              : pack
                ? `Quiero los ${pack.cantidadCursos} cursos`
                : producto.combo
                  ? "Quiero los dos cursos"
                  : "Quiero mi acceso"
          } · ${formatearPrecio(compra.precio)}`}
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
                {preventa ? `🚀 Preventa · las clases se habilitan el ${fechaAcceso}` : "⚡ Acceso inmediato y de por vida"}
              </div>
              <h1 className={styles.title}>
                {producto.tituloInicio} <span className={styles.orange}>{producto.tituloDestacado}</span>
                {producto.tituloFin && ` ${producto.tituloFin}`}
              </h1>
              <p className={styles.hook}>{producto.gancho}</p>
              <p className={styles.description}>{producto.descripcion}</p>
              {incluye && (
                <ul className={styles.incluyeList}>
                  {incluye.map((c) => (
                    <li key={c.key}>
                      ✓{" "}
                      <button type="button" className={styles.linkBtn} onClick={() => setSeleccion(c.key)}>
                        {nombreCorto(c)}
                      </button>{" "}
                      · {c.clases} clases · por separado {formatearPrecio(c.precio)}
                    </li>
                  ))}
                </ul>
              )}
              <p className={styles.level}>🎯 {producto.nivel}</p>

              <div className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  {cuponAplicado ? (
                    <span className={styles.promoBadge}>🎓 Precio para alumnos de SRV</span>
                  ) : pack ? (
                    <span className={styles.promoBadge}>🎁 {pack.cantidadCursos} cursos · ahorrás {formatearPrecio(pack.ahorro)}</span>
                  ) : (
                    descuento > 0 && (
                      <span className={styles.promoBadge}>
                        {cyber
                          ? `🔥 Cyber SRV · ${descuento}% OFF`
                          : preventa
                            ? `🔥 Precio de preventa · ${descuento}% OFF`
                            : producto.combo
                              ? `🎁 Combo · ahorrás ${formatearPrecio(producto.precioRegular - producto.precio)}`
                              : `🔥 ${descuento}% OFF · Precio promocional`}
                      </span>
                    )
                  )}
                  <span className={styles.timerTag}>
                    {cyber ? `Solo ${CYBER_FECHAS}` : preventa ? `Solo hasta el ${fechaAcceso}` : "Pago único, sin suscripción"}
                  </span>
                </div>

                {opciones.length > 0 && (
                  <fieldset className={styles.selector}>
                    <legend className={styles.selectorTitle}>¿Qué querés llevar?</legend>
                    {opciones.map((op) => {
                      const activa = op.key === producto.key;
                      return (
                        <label
                          key={op.key}
                          className={`${styles.opcion} ${activa ? styles.opcionActiva : ""} ${op.combo ? styles.opcionCombo : ""}`}
                        >
                          <input type="radio" name="producto" value={op.key} checked={activa} onChange={() => setSeleccion(op.key)} />
                          <span className={styles.opcionNombre}>
                            {op.combo ? "Los dos · Ruta Backend Completa" : nombreCorto(op)}
                            <small>
                              {op.combo
                                ? `${op.clases} clases · ahorrás ${formatearPrecio(precioSeparado(op) - op.precio)}`
                                : `${op.clases} clases`}
                            </small>
                          </span>
                          <span className={styles.opcionPrecio}>{formatearPrecio(op.precio)}</span>
                        </label>
                      );
                    })}
                  </fieldset>
                )}

                <div className={styles.priceContainer}>
                  {(cuponAplicado || pack || descuento > 0) && (
                    <div className={styles.oldPriceBox}>
                      <span className={styles.oldPriceLabel}>
                        {cuponAplicado
                          ? "Precio promocional"
                          : pack
                            ? "Por separado"
                            : cyber
                              ? "Precio regular"
                              : preventa
                                ? `Desde el ${fechaAcceso}`
                                : producto.combo
                                  ? "Por separado"
                                  : "Precio regular"}
                      </span>
                      <span className={styles.oldPrice}>
                        {formatearPrecio(cuponAplicado ? producto.precio : pack ? pack.precioSeparado : producto.precioRegular)}
                      </span>
                    </div>
                  )}
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>
                      {cuponAplicado
                        ? "Pagás hoy como alumno"
                        : pack
                          ? `Pagás hoy por los ${pack.cantidadCursos} cursos`
                          : preventa
                            ? "Reservás hoy por"
                            : "Pagás hoy"}
                    </span>
                    <div className={styles.mainPrice}>
                      {formatearPrecio(compra.precio)} <span className={styles.currency}>ARS</span>
                    </div>
                    {/* Ancla honesta en lugar del precio tachado: cuánto sale cada clase */}
                    <span className={styles.porClase}>
                      {compra.clases} clases · {formatearPrecio(Math.round(compra.precio / compra.clases))} por clase
                    </span>
                  </div>
                </div>

                <ul className={styles.benefitsList}>
                  {producto.beneficios.map((beneficio) => (
                    <li key={beneficio} className={styles.benefitItem}>
                      ✓ {beneficio}
                    </li>
                  ))}
                  {producto.key !== "scratch" ? (
                    <li className={styles.benefitItem}>
                      ✓ Certificado verificable con examen final en vivo, sin costo extra
                    </li>
                  ) : (
                    <li className={styles.benefitItem}>
                      ✓ Su propio certificado: evaluación para chicos con preguntas y un jueguito (muy pronto)
                    </li>
                  )}
                  <li className={styles.benefitItem}>
                    ✓ Acceso gratis a E-stellarium, nuestra plataforma educativa (desde el 20 de noviembre)
                  </li>
                </ul>

                {/* Código de alumnos de SRV: el servidor valida el código y define el precio especial */}
                {producto.cuponAlumnos && (
                  <form className={styles.cuponBox} onSubmit={aplicarCupon}>
                    <label htmlFor="cupon-alumnos" className={styles.cuponTitle}>
                      🎓 ¿Sos alumno de SRV? Ingresá tu código
                    </label>
                    {cuponAplicado ? (
                      <p className={styles.cuponOk}>
                        Código aplicado: pagás {formatearPrecio(cuponAplicado.precio)} en lugar de {formatearPrecio(producto.precio)}.
                        <button type="button" className={styles.cuponQuitar} onClick={quitarCupon}>
                          Quitar
                        </button>
                      </p>
                    ) : (
                      <div className={styles.cuponRow}>
                        <input
                          id="cupon-alumnos"
                          value={cuponTexto}
                          onChange={(e) => setCuponTexto(e.target.value)}
                          placeholder="Código de alumno"
                          autoComplete="off"
                          spellCheck={false}
                          maxLength={40}
                        />
                        <button type="submit" disabled={cuponEstado.cargando || !cuponTexto.trim()}>
                          {cuponEstado.cargando ? "Verificando..." : "Aplicar"}
                        </button>
                      </div>
                    )}
                    {cuponEstado.error && <p className={styles.cuponError}>{cuponEstado.error}</p>}
                    {!cuponAplicado && (
                      <small className={styles.cuponNota}>
                        El código es para quienes ya cursaron con nosotros. Al aplicarlo, el precio se actualiza antes de pagar.
                      </small>
                    )}
                  </form>
                )}

                {/* Sumá a tu compra: el visitante arma su pack; la regla de precio vive en src/data/packs.js */}
                {agregables.length > 0 && (
                  <fieldset className={styles.sumas}>
                    {campaniaRedes ? (
                      <>
                        <legend className={styles.sumasTitle}>🎁 Sumá cursos a precio de campaña</legend>
                        <p className={styles.sumasIntro}>
                          Solo durante la preventa: cada curso que sumás a Redes, Linux y AWS tiene un precio especial. Tildá
                          todos los que quieras y van en el mismo pago. Los demás cursos te llegan al instante.
                        </p>
                      </>
                    ) : (
                      <>
                        <legend className={styles.sumasTitle}>🎁 Sumá cursos y ahorrá {formatearPrecio(AHORRO_POR_CURSO)} por cada uno</legend>
                        <p className={styles.sumasIntro}>
                          Tildá todos los que quieras: van en el mismo pago y cada curso que sumás descuenta{" "}
                          {formatearPrecio(AHORRO_POR_CURSO)} del total. Si vale menos, va de regalo.
                        </p>
                      </>
                    )}
                    {agregables.map((k) => {
                      const unidad = CURSOS_GRABADOS[k];
                      const activa = extrasValidos.includes(k);
                      // Master en JavaScript o Backend Avanzado con la Ruta Backend ya tildada: vienen dentro de la ruta
                      const combo = activa ? null : extrasValidos.map((x) => CURSOS_GRABADOS[x]).find((c) => c.combo?.includes(k));
                      const disponible = !combo && puedeSumar(k);
                      const extra = disponible ? costoDeSumar(k) : null;
                      return (
                        <label
                          key={k}
                          className={`${styles.sumaCard} ${activa ? styles.sumaCardActiva : ""} ${disponible ? "" : styles.sumaCardNo}`}
                        >
                          <input
                            type="checkbox"
                            checked={activa}
                            disabled={!disponible}
                            onChange={() => toggleExtra(k)}
                            aria-label={`Sumar ${nombreCurso(unidad)}`}
                          />
                          <span className={styles.sumaBody}>
                            <span className={styles.sumaTop}>
                              <span className={styles.sumaEtiqueta}>{extra !== null && extra <= 0 ? "De regalo" : `${unidad.clases} clases`}</span>
                              {disponible && <span className={styles.sumaAhorro}>Ahorrás {formatearPrecio(unidad.precio - extra)}</span>}
                            </span>
                            <span className={styles.sumaNombre}>+ {nombreCurso(unidad)}</span>
                            <span className={styles.sumaPitch}>{pitchUnidad(k)}</span>
                            <span className={styles.sumaPrecios}>
                              {disponible ? (
                                <strong>
                                  {extra > 0 ? `Por solo ${formatearPrecio(extra)} más` : "¡Sin costo extra!"} <s>{formatearPrecio(unidad.precio)}</s>
                                </strong>
                              ) : combo ? (
                                <span>Ya viene incluido en la {nombreCurso(combo)}.</span>
                              ) : (
                                <span>No se combina con los cursos que elegiste.</span>
                              )}
                            </span>
                          </span>
                        </label>
                      );
                    })}
                    {pack && (
                      <p className={styles.sumasTotal}>
                        Tu pack: <strong>{pack.cantidadCursos} cursos</strong> por <strong>{formatearPrecio(pack.precio)}</strong> · por separado{" "}
                        {formatearPrecio(pack.precioSeparado)} · ahorrás <strong>{formatearPrecio(pack.ahorro)}</strong>
                      </p>
                    )}
                  </fieldset>
                )}
              </div>
            </div>

            <div className={styles.actionContainer} ref={buyRef}>
              {pack && (
                <p className={styles.compraResumen}>
                  Tu compra: <strong>{compra.nombre}</strong> · {compra.clases} clases · un solo pago
                </p>
              )}
              {botonPago()}
              <p className={styles.secureText}>
                🔒 Pago 100% seguro procesado por Mercado Pago.{" "}
                {preventa
                  ? pack
                    ? `Las carpetas te llegan al mail al instante. Las clases de ${nombreCurso(producto)} se habilitan el ${fechaAcceso}; las de los demás cursos ya están.`
                    : `Tu carpeta te llega al mail al instante. Las clases se habilitan el ${fechaAcceso}.`
                  : "El acceso te llega al mail al instante."}
              </p>
              <p className={styles.legalText}>
                Al pagar aceptás los <Link to="/terminos">términos y condiciones</Link> y la{" "}
                <Link to="/privacidad">política de privacidad</Link>. Tenés 10 días para arrepentirte desde el{" "}
                <Link to="/arrepentimiento">botón de arrepentimiento</Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Plan de Estudios y argumentos de venta */}
        <div className={styles.contentColumn}>
          {combo && producto.key !== combo.key && (
            <button
              type="button"
              className={styles.comboBanner}
              onClick={() => {
                setSeleccion(combo.key);
                buyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            >
              <span className={styles.comboIcon}>🎁</span>
              <span className={styles.comboText}>
                <strong>¿Vas por backend? Llevá los dos cursos juntos.</strong>
                <span>
                  {combo.combo.map((k) => nombreCorto(CURSOS_GRABADOS[k])).join(" + ")} por {formatearPrecio(combo.precio)}:
                  ahorrás {formatearPrecio(precioSeparado(combo) - combo.precio)} frente a comprarlos por separado.
                </span>
              </span>
              <span className={styles.comboCta}>Elegir los dos →</span>
            </button>
          )}
          <div className={styles.twoCols}>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Ideal para vos si…</h2>
              <ul className={styles.checkList}>
                {producto.paraQuien.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className={styles.infoCard}>
              <h2 className={styles.infoTitle}>Al terminar vas a poder…</h2>
              <ul className={styles.checkList}>
                {producto.resultados.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.modulesSummary}>
            <h2 className={styles.subTitle}>
              Plan de estudios ({producto.clases} clases · {producto.modulos.length} {producto.combo ? "cursos" : "módulos"})
            </h2>
            <p className={styles.subTitleDesc}>{producto.subTituloDesc}</p>

            <div className={styles.modulesGrid}>
              {producto.modulos.map((mod, index) => (
                <div key={mod.titulo} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNum}>{String(index + 1).padStart(2, "0")}</span>
                    <span className={styles.moduleTag}>{producto.combo ? "Parte" : "Módulo"} {index + 1}</span>
                  </div>
                  <h3>{mod.titulo}</h3>
                  <ul className={styles.taskList}>
                    {mod.temas.map((tema) => (
                      <li key={tema}>{tema}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Módulos en grabación: se anuncian aparte para no venderlos como ya disponibles */}
              {(producto.proximosModulos || []).map((mod) => (
                <div key={mod.titulo} className={`${styles.moduleCard} ${styles.moduleCardProximo}`}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNum}>🤖</span>
                    <span className={styles.moduleTagProximo}>Próximamente · gratis con tu acceso</span>
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
            {producto.proximosModulos && (
              <p className={styles.proximosNota}>
                El módulo marcado como «Próximamente» está en grabación y todavía no está en la carpeta. Cuando se
                publique, aparece en tu misma carpeta de Google Drive sin costo: las actualizaciones del curso están
                incluidas en tu acceso de por vida.
              </p>
            )}
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
              {pack
                ? `${compra.clases} clases en ${pack.cantidadCursos} cursos, acceso de por vida y un solo pago de ${formatearPrecio(compra.precio)}. Por separado pagarías ${formatearPrecio(pack.precioSeparado)}.`
                : preventa
                  ? `${producto.clases} clases, acceso de por vida y un pago único de ${formatearPrecio(producto.precio)}. Desde el ${fechaAcceso} pasa a ${formatearPrecio(producto.precioRegular)}, y ese mismo día se habilitan las clases en tu carpeta.`
                  : `${producto.clases} clases, acceso de por vida y un pago único de ${formatearPrecio(compra.precio)}${cuponAplicado ? " con tu código de alumno" : ""}. Empezá esta misma noche.`}
            </p>
            {botonPago(styles.btnFinal)}
          </div>
        </div>
      </div>

      {/* Barra fija de compra en celular */}
      <div className={`${styles.mobileBar} ${showBar ? styles.mobileBarVisible : ""}`} aria-hidden={!showBar}>
        <div className={styles.mobileBarPrice}>
          <span>{compra.nombre}</span>
          <strong>{formatearPrecio(compra.precio)}</strong>
        </div>
        <button type="button" onClick={handleMercadoPagoCheckout} disabled={loading} tabIndex={showBar ? 0 : -1}>
          {loading ? "Conectando..." : preventa ? "Reservar" : "Comprar"}
        </button>
      </div>
    </section>
  );
}
