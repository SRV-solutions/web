import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import styles from "./style.module.css";
import Seo from "../Seo";
import Icono from "../Icono";
import { LEGAL, whatsappLink } from "../../data/legal";
import { trackConversion, trackEvent } from "../../data/metaPixel";
import { BLOQUES, FAQ, PASOS, PUESTOS, SEGURIDAD, SERVICIOS } from "./contenido";
import PortalSocio from "./animaciones/PortalSocio";
import Reclamo from "./animaciones/Reclamo";
import Lecturista from "./animaciones/Lecturista";
import Factura from "./animaciones/Factura";
import Caja from "./animaciones/Caja";
import Tablero from "./animaciones/Tablero";
import Mapa from "./animaciones/Mapa";

// Página de producto de GestiónCoop. Las animaciones están en ./animaciones (framer-motion con LazyMotion para que
// pese poco) y muestran datos inventados de «Cooperativa Arroyo del Monte». El pedido de demo llega por mail
// (netlify/functions/gestioncoop.js, con Resend); si no sale, la página ofrece mandarlo por WhatsApp.
const WHATSAPP_DEMO = whatsappLink("Hola, quiero una demo de GestiónCoop para mi cooperativa");
const SALTO = String.fromCharCode(10);

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GestiónCoop",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://wearesrv.com/gestioncoop",
    description:
      "Plataforma para cooperativas de servicios: portal del socio para ver y pagar la boleta desde el celular, lecturas de medidores con o sin señal, facturación electrónica integrada con ARCA, caja, reclamos, tablero, informes y mapa de conexiones.",
    publisher: { "@id": "https://wearesrv.com/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  },
];

// Clic en un botón de WhatsApp: evento de Meta (trackEvent solo manda desde wearesrv.com) y de Tag Manager
const medirContacto = () => {
  trackEvent("Contact", { content_name: "GestiónCoop" });
  window.dataLayer?.push({ event: "gestioncoop_whatsapp_click" });
};

// Entrada suave de textos y tarjetas la primera vez que se ven
const aparecer = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.55, ease: "easeOut" },
};
const aparecerEn = (i) => ({ ...aparecer, transition: { ...aparecer.transition, delay: i * 0.07 } });

const BotonWhatsapp = ({ texto = "Escribinos por WhatsApp" }) => (
  <a href={WHATSAPP_DEMO} target="_blank" rel="noopener noreferrer" className={styles.btnSecondary} onClick={medirContacto}>
    {texto}
  </a>
);

function Bloque({ id, datos, invertido, children }) {
  return (
    <section id={id} className={`${styles.bloque} ${invertido ? styles.bloqueInvertido : ""}`}>
      <m.div className={styles.bloqueTexto} {...aparecer}>
        <span className={styles.etiqueta}>{datos.etiqueta}</span>
        <h2>{datos.titulo}</h2>
        <ul className={styles.features}>
          {datos.puntos.map((punto) => (
            <li key={punto}>{punto}</li>
          ))}
        </ul>
      </m.div>
      <div className={styles.bloqueVisual}>{children}</div>
    </section>
  );
}

const PEDIDOS = [
  { id: "demo", texto: "Una demo", frase: "una demo" },
  { id: "cotizacion", texto: "Una cotización", frase: "una cotización" },
  { id: "las-dos", texto: "Las dos", frase: "una demo y una cotización" },
];

const enLista = (items) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;

// «Energía eléctrica» pasa a «energía eléctrica», pero «TV» queda igual
const enMinuscula = (s) => (s === s.toUpperCase() ? s : s.charAt(0).toLowerCase() + s.slice(1));

const MENSAJE_CAMPO = {
  nombre: "Revisá tu nombre.",
  cooperativa: "Revisá el nombre de la cooperativa.",
  celular: "Revisá el celular: con característica, por ejemplo 11 2345-6789.",
  email: "Revisá el email.",
};

function FormularioDemo() {
  const [nombre, setNombre] = useState("");
  const [cooperativa, setCooperativa] = useState("");
  const [celular, setCelular] = useState("");
  const [email, setEmail] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [servicios, setServicios] = useState([]);
  const [pedido, setPedido] = useState("demo");
  const [empresa, setEmpresa] = useState("");
  // null | "enviando" | "listo" | { error, whatsapp }
  const [estado, setEstado] = useState(null);

  const alternarServicio = (servicio) =>
    setServicios((actuales) =>
      actuales.includes(servicio) ? actuales.filter((s) => s !== servicio) : [...actuales, servicio]
    );

  // Los servicios van en el orden de la lista, no en el que se tildaron
  const elegidos = () => SERVICIOS.map((s) => s.nombre).filter((s) => servicios.includes(s));

  // Si el mail no sale, el mismo pedido queda listo para mandarlo por WhatsApp
  const linkWhatsapp = () => {
    const frase = PEDIDOS.find((p) => p.id === pedido).frase;
    const lista = elegidos();
    const lineas = [
      `Hola, soy ${nombre.trim()}, de ${cooperativa.trim()}${localidad.trim() ? ` (${localidad.trim()})` : ""}.`,
      `Quiero ${frase} de GestiónCoop.`,
      lista.length ? `Servicios que presta la cooperativa: ${enLista(lista.map(enMinuscula))}.` : "",
    ].filter(Boolean);
    return whatsappLink(lineas.join(SALTO));
  };

  const enviar = async (e) => {
    e.preventDefault();
    if (estado === "enviando") return;
    setEstado("enviando");
    try {
      const res = await fetch("/api/gestioncoop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, cooperativa, celular, email, localidad, servicios: elegidos(), pedido, empresa }),
      });
      if (res.ok) {
        // Conversión para Meta, sin datos personales (en local y en los deploy previews no manda nada)
        trackConversion("Lead", { content_name: "GestiónCoop" });
        window.dataLayer?.push({ event: "gestioncoop_demo_submit" });
        setEstado("listo");
        return;
      }
      const datos = await res.json().catch(() => ({}));
      setEstado({ error: MENSAJE_CAMPO[datos.campo] ?? null, whatsapp: linkWhatsapp() });
    } catch {
      setEstado({ error: null, whatsapp: linkWhatsapp() });
    }
  };

  if (estado === "listo") {
    return (
      <div className={styles.formulario}>
        <p className={styles.formListo} role="status">
          ¡Listo, {nombre.trim().split(" ")[0]}! Recibimos tu pedido: te escribimos en menos de un día hábil. ¿Preferís hablar
          ya?{" "}
          <a href={linkWhatsapp()} target="_blank" rel="noopener noreferrer" onClick={medirContacto}>
            Escribinos por WhatsApp
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form className={styles.formulario} onSubmit={enviar}>
      {/* Trampa para bots: una persona no ve ni completa este campo */}
      <label className={styles.trampa} aria-hidden="true">
        Empresa
        <input type="text" tabIndex={-1} autoComplete="off" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
      </label>
      <div className={styles.campos}>
        <label className={styles.campo}>
          <span>Tu nombre</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="name"
            maxLength={80}
            required
          />
        </label>
        <label className={styles.campo}>
          <span>Cooperativa</span>
          <input
            type="text"
            value={cooperativa}
            onChange={(e) => setCooperativa(e.target.value)}
            autoComplete="organization"
            maxLength={120}
            required
          />
        </label>
        <label className={styles.campo}>
          <span>Celular o WhatsApp</span>
          <input
            type="tel"
            value={celular}
            onChange={(e) => setCelular(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
            maxLength={25}
            required
          />
        </label>
        <label className={styles.campo}>
          <span>
            Email <small>(opcional)</small>
          </span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" maxLength={120} />
        </label>
        <label className={`${styles.campo} ${styles.campoAncho}`}>
          <span>
            Localidad y provincia <small>(opcional)</small>
          </span>
          <input type="text" value={localidad} onChange={(e) => setLocalidad(e.target.value)} maxLength={120} />
        </label>
      </div>

      <fieldset className={styles.grupo}>
        <legend>
          Servicios que presta <small>(opcional)</small>
        </legend>
        <div className={styles.chips}>
          {SERVICIOS.map(({ icono, nombre: servicio }) => (
            <label key={servicio} className={styles.chip}>
              <input
                type="checkbox"
                checked={servicios.includes(servicio)}
                onChange={() => alternarServicio(servicio)}
              />
              <span>
                <Icono de={icono} /> {servicio}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend>¿Qué querés?</legend>
        <div className={styles.chips}>
          {PEDIDOS.map((p) => (
            <label key={p.id} className={styles.chip}>
              <input type="radio" name="pedido" value={p.id} checked={pedido === p.id} onChange={() => setPedido(p.id)} />
              <span>{p.texto}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <button type="submit" className={styles.btnPrimary} disabled={estado === "enviando"}>
        {estado === "enviando" ? "Enviando…" : "Enviar pedido →"}
      </button>
      <p className={styles.formNota}>
        Te escribimos en menos de un día hábil. Usamos tus datos solo para responderte.
      </p>
      {estado?.whatsapp && (
        <p className={styles.formError} role="alert">
          {estado.error ?? "No pudimos enviar el pedido."}{" "}
          {!estado.error && (
            <>
              Mandalo por{" "}
              <a href={estado.whatsapp} target="_blank" rel="noopener noreferrer" onClick={medirContacto}>
                WhatsApp
              </a>{" "}
              y te respondemos por ahí.
            </>
          )}
        </p>
      )}
    </form>
  );
}

export default function GestionCoop() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div className={styles.page}>
          <Seo pagina="/gestioncoop" jsonLd={JSON_LD} />

          {/* Hero: el fondo ocupa todo el ancho y el contenido queda centrado */}
          <div className={styles.heroFondo}>
            <section className={styles.hero}>
              <m.div
                className={styles.heroTexto}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <div className={styles.marca}>
                  <img src="/gestioncoop-icon.svg" width="44" height="44" alt="" />
                  <span>GestiónCoop</span>
                </div>
                <div className={styles.badge}>Para cooperativas de servicios</div>
                <h1 className={styles.heroTitle}>
                  Que cada socio entienda su boleta. <span className={styles.blue}>Y la pague desde el celular</span>
                  <span className={styles.orange}>.</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  GestiónCoop es la plataforma de SRV para cooperativas de energía eléctrica, agua potable, internet, TV y
                  sepelio. Lecturas, facturación electrónica integrada con ARCA, caja, reclamos y el portal del socio, en
                  un solo sistema.
                </p>
                <div className={styles.acciones}>
                  <a href="#demo" className={styles.btnPrimary}>
                    Pedí una demo
                  </a>
                  <BotonWhatsapp />
                </div>
                <ul className={styles.servicios} aria-label="Servicios">
                  {SERVICIOS.map(({ icono, nombre }) => (
                    <li key={nombre}>
                      <Icono de={icono} /> {nombre}
                    </li>
                  ))}
                </ul>
              </m.div>
              <m.div
                className={styles.heroVisual}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              >
                <PortalSocio />
                <p className={styles.pieVisual}>Pantallas de ejemplo: la cooperativa, los socios y los montos son inventados.</p>
              </m.div>
            </section>
          </div>

          {/* El problema y el resumen por puesto */}
          <section className={styles.seccion}>
            <m.div className={styles.problema} {...aparecer}>
              <h2 className={styles.titulo}>
                Las boletas subieron. <span className={styles.orange}>Las dudas, también.</span>
              </h2>
              <p className={styles.bajada}>
                Con la quita de subsidios, las boletas aumentaron y muchos socios no entienden qué están pagando. Lo que
                no se entiende se deja para después, y la morosidad crece.
              </p>
              <p className={styles.bajada}>
                GestiónCoop ataca el problema desde los dos lados: al socio le muestra en qué se va cada peso y le deja
                pagar en el momento. A la cooperativa le ordena todo el circuito, del medidor a la caja, en un solo
                sistema.
              </p>
            </m.div>
            <ul className={styles.puestos}>
              {PUESTOS.map((p, i) => (
                <m.li key={p.titulo} {...aparecerEn(i)}>
                  <a href={`#${p.id}`} className={styles.puesto}>
                    <span className={styles.puestoIcono}>
                      <Icono de={p.icono} />
                    </span>
                    <span>
                      <strong>{p.titulo}</strong>
                      <small>{p.texto}</small>
                    </span>
                  </a>
                </m.li>
              ))}
            </ul>
          </section>

          {/* Un bloque por puesto, con su animación */}
          <div className={styles.bloques}>
            <Bloque id="socio" datos={BLOQUES.socio}>
              <Reclamo />
            </Bloque>
            <Bloque id="lecturista" datos={BLOQUES.lecturista} invertido>
              <Lecturista />
            </Bloque>
            <Bloque id="oficina" datos={BLOQUES.oficina}>
              <Factura />
            </Bloque>
            <Bloque id="caja" datos={BLOQUES.caja} invertido>
              <Caja />
            </Bloque>
            <Bloque id="gerencia" datos={BLOQUES.gerencia}>
              <Tablero />
            </Bloque>
          </div>

          {/* Mapa */}
          <section className={styles.seccion} id="mapa">
            <m.div {...aparecer}>
              <span className={styles.etiqueta}>Gerencia y Consejo</span>
              <h2 className={styles.titulo}>
                Cada conexión, en el mapa. <span className={styles.blue}>De día y de noche.</span>
              </h2>
              <p className={styles.bajada}>
                Cada punto es una conexión: al día, con deuda, en mora o cortada. Las lecturas llegan en vivo, se marcan
                las zonas de los cortes programados y se puede mirar de día o de noche. Probá los botones.
              </p>
            </m.div>
            <Mapa />
          </section>

          {/* Seguridad */}
          <section className={styles.seccion}>
            <m.h2 className={styles.titulo} {...aparecer}>
              Los datos de la cooperativa, cuidados.
            </m.h2>
            <div className={styles.tarjetas}>
              {SEGURIDAD.map((s, i) => (
                <m.div key={s.titulo} className={styles.tarjeta} {...aparecerEn(i)}>
                  <span className={styles.tarjetaIcono}>
                    <Icono de={s.icono} />
                  </span>
                  <h3>{s.titulo}</h3>
                  <p>{s.texto}</p>
                </m.div>
              ))}
            </div>
          </section>

          {/* Cómo se implementa */}
          <section className={styles.seccion}>
            <m.div {...aparecer}>
              <h2 className={styles.titulo}>Cómo empezamos, sin cortar nada.</h2>
              <p className={styles.bajada}>
                Pasar a un sistema nuevo no tiene que frenar la cooperativa. Por eso el cambio se hace con los dos
                sistemas funcionando a la vez.
              </p>
            </m.div>
            <div className={styles.pasosMarco}>
              <m.span
                className={styles.pasosLinea}
                aria-hidden="true"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
              />
              <ol className={styles.pasos}>
                {PASOS.map((p, i) => (
                  <m.li key={p.titulo} {...aparecerEn(i * 2)}>
                    <span className={styles.pasoIcono}>
                      <Icono de={p.icono} />
                    </span>
                    <span className={styles.pasoNumero}>Paso {i + 1}</span>
                    <strong>{p.titulo}</strong>
                    <p>{p.texto}</p>
                  </m.li>
                ))}
              </ol>
            </div>
          </section>

          {/* Preguntas frecuentes: las mismas del JSON-LD FAQPage */}
          <section className={styles.seccion}>
            <h2 className={styles.titulo}>Preguntas frecuentes</h2>
            <div className={styles.faq}>
              {FAQ.map((f) => (
                <details key={f.q} className={styles.faqItem}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Pedido de demo o cotización */}
          <section className={styles.seccion} id="demo">
            <div className={styles.demo}>
              <m.div className={styles.demoTexto} {...aparecer}>
                <h2 className={styles.titulo}>
                  Pedí una demo <span className={styles.orange}>o una cotización.</span>
                </h2>
                <p className={styles.bajada}>
                  Contanos de tu cooperativa y te mostramos GestiónCoop funcionando. Te respondemos en menos de un día hábil.
                </p>
                <p className={styles.contacto}>
                  WhatsApp {LEGAL.whatsapp} · <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a>
                </p>
              </m.div>
              <FormularioDemo />
            </div>
          </section>

          <section className={styles.backSection}>
            <Link to="/" className={styles.backLink}>
              ← Volver al inicio
            </Link>
          </section>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
