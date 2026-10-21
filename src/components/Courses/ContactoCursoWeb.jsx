import React, { useState, useMemo, useEffect, useCallback } from "react";
import styles from "./ContactoCursoWeb.module.css";
import { trackConversion } from "../../data/metaPixel";
import Seo from "../Seo";

// Inscripción + pago: la función crea el link de Mercado Pago del alumno y carga la fila
// en el Sheet "Curso FullStack" (ver netlify/functions/inscripcion-intensivo.js).
// Los precios que se cobran se definen en netlify/lib/intensivos.js: mantenerlos iguales a getOferta().
const INSCRIPCION_URL = "/.netlify/functions/inscripcion-intensivo";

// Fin de la preventa: 20/12/2026 a las 23:59:59 (hora Argentina)
const EARLY_BIRD_HASTA = new Date("2026-12-20T23:59:59-03:00").getTime();
const ANIO_CURSADA = 2027;
const HORARIO = "18:00 a 20:30";

const CURSOS = [
  {
    id: "frontend",
    num: "01",
    nombre: "Frontend Web + Lógica",
    corto: "Frontend",
    dias: "Lunes y Miércoles",
    semanas: 9,
    clases: 18,
    horasCatedra: 67.5,
    stack:
      "HTML, CSS, Flexbox/Grid, JavaScript desde cero, DOM, clases, async/await, React + Vite, Hooks, React Router y deploy.",
    cronograma: [
      { clase: 1, fecha: "18/01", bloque: "HTML", titulo: "Cómo funciona la web, VS Code, estructura del documento HTML, texto, enlaces, imágenes, listas, HTML semántico y formularios. Práctica: CV personal." },
      { clase: 2, fecha: "20/01", bloque: "HTML, CSS", titulo: "Fundamentos de CSS, selectores, cascada, especificidad, herencia, unidades, colores, tipografía, modelo de caja, fondos, bordes y degradados." },
      { clase: 3, fecha: "25/01", bloque: "HTML, CSS", titulo: "Display, posicionamiento y Flexbox." },
      { clase: 4, fecha: "27/01", bloque: "HTML, CSS", titulo: "Grid, responsive design (media queries, mobile first), transiciones y variables CSS." },
      { clase: 5, fecha: "01/02", bloque: "HTML, CSS, JS", titulo: "Introducción a JavaScript, variables, tipos de datos, operadores y strings." },
      { clase: 6, fecha: "03/02", bloque: "HTML, CSS, JS", titulo: "Condicionales, bucles y funciones (scope y callbacks)." },
      { clase: 7, fecha: "08/02", bloque: "HTML, CSS, JS", titulo: "Arrays y sus métodos, objetos, desestructuración y spread." },
      { clase: 8, fecha: "10/02", bloque: "HTML, CSS, JS", titulo: "DOM, eventos y manipulación de HTML." },
      { clase: 9, fecha: "15/02", bloque: "HTML, CSS, JS", titulo: "Formularios y validación, JSON y localStorage." },
      { clase: 10, fecha: "17/02", bloque: "HTML, CSS, JS", titulo: "Clases (constructor, métodos), módulos y organización del código." },
      { clase: 11, fecha: "22/02", bloque: "HTML, CSS, JS", titulo: "Asincronía, promesas, async/await y Fetch API." },
      { clase: 12, fecha: "24/02", bloque: "React", titulo: "Introducción a Node, npm y React, Vite, JSX, componentes, props y estilos con CSS Modules." },
      { clase: 13, fecha: "01/03", bloque: "React", titulo: "Renderizado de listas, renderizado condicional y useState." },
      { clase: 14, fecha: "03/03", bloque: "React", titulo: "Eventos, formularios controlados y comunicación entre componentes." },
      { clase: 15, fecha: "08/03", bloque: "React", titulo: "useEffect, fetch en React, estado de carga." },
      { clase: 16, fecha: "10/03", bloque: "React", titulo: "Manejo de errores en peticiones HTTP, depuración y Custom Hooks." },
      { clase: 17, fecha: "15/03", bloque: "React", titulo: "React Router: rutas, parámetros, navegación, layouts y página 404." },
      { clase: 18, fecha: "17/03", bloque: "React", titulo: "Deploy web en Vercel y cierre del curso." },
    ],
  },
  {
    id: "backend",
    num: "02",
    nombre: "Backend Profundo + DB",
    corto: "Backend",
    dias: "Martes y Jueves",
    semanas: 10,
    clases: 20,
    horasCatedra: 75,
    stack:
      "Node.js, Express, MVC, SQL, PostgreSQL, Sequelize ORM, bcrypt, JWT, roles y cloud deploy.",
    cronograma: [
      { clase: 1, fecha: "19/01", bloque: "Node & Express", titulo: "Entorno Node.js y Módulos Core" },
      { clase: 2, fecha: "21/01", bloque: "Node & Express", titulo: "Servidores HTTP con Express.js" },
      { clase: 3, fecha: "26/01", bloque: "Node & Express", titulo: "Anatomía de Requests (params, query, body) y Postman" },
      { clase: 4, fecha: "28/01", bloque: "Node & Express", titulo: "Middlewares y Manejo Centralizado de Errores" },
      { clase: 5, fecha: "02/02", bloque: "Node & Express", titulo: "Arquitectura Limpia (MVC)" },
      { clase: 6, fecha: "04/02", bloque: "SQL", titulo: "Bases de Datos Relacionales desde Cero (PostgreSQL/MySQL)" },
      { clase: 7, fecha: "09/02", bloque: "SQL", titulo: "Lenguaje SQL Nativo (CRUD Básico)" },
      { clase: 8, fecha: "11/02", bloque: "SQL", titulo: "Relaciones SQL (JOINs) y Agregaciones" },
      { clase: 9, fecha: "16/02", bloque: "Sequelize ORM", titulo: "Introducción a Sequelize ORM" },
      { clase: 10, fecha: "18/02", bloque: "Sequelize ORM", titulo: "Modelos y Operaciones CRUD con ORM" },
      { clase: 11, fecha: "23/02", bloque: "Sequelize ORM", titulo: "Relaciones Complejas en Sequelize (Eager Loading)" },
      { clase: 12, fecha: "25/02", bloque: "Sequelize ORM", titulo: "Migraciones y Seeders de Producción" },
      { clase: 13, fecha: "02/03", bloque: "Seguridad", titulo: "Hasheo de Passwords con bcrypt" },
      { clase: 14, fecha: "04/03", bloque: "Seguridad", titulo: "Autenticación con JWT (JSON Web Tokens)" },
      { clase: 15, fecha: "09/03", bloque: "Seguridad", titulo: "Autorización, Roles (Admin/User) y Rutas Protegidas" },
      { clase: 16, fecha: "11/03", bloque: "Seguridad", titulo: "Validación Avanzada de Datos con Zod" },
      { clase: 17, fecha: "16/03", bloque: "Producción", titulo: "Subida de Archivos con Multer y Cloudinary" },
      { clase: 18, fecha: "18/03", bloque: "Producción", titulo: "Variables de Entorno (dotenv), CORS y Helmet" },
      { clase: 19, fecha: "23/03", bloque: "Producción", titulo: "Documentación de API con Swagger / OpenAPI" },
      { clase: 20, fecha: "25/03", bloque: "Producción", titulo: "Deploy a Producción (Render/Railway/Supabase) y Cierre" },
    ],
  },
];

const PLANES = [
  { id: "frontend", corto: "Frontend" },
  { id: "backend", corto: "Backend" },
  { id: "fullstack", corto: "Fullstack" },
];

const PRECIO_SEPARADO = 300000;

// Devuelve todo lo que cambia según el plan elegido y si la preventa sigue activa
function getOferta(planId, preventa) {
  switch (planId) {
    case "frontend":
      return {
        itemId: "intensivo-verano-2027-frontend", // mismo itemId que netlify/lib/intensivos.js
        nombre: "Frontend Web + Lógica",
        precio: 140000,
        cuotas: "2 cuotas sin interés de $70.000",
        resumen: "18 clases · 67,5 hs cátedra · Lunes y Miércoles",
      };
    case "backend":
      return {
        itemId: "intensivo-verano-2027-backend",
        nombre: "Backend Profundo + DB",
        precio: 160000,
        cuotas: "2 cuotas sin interés de $80.000",
        resumen: "20 clases · 75 hs cátedra · Martes y Jueves",
      };
    default:
      return preventa
        ? {
            itemId: "intensivo-verano-2027-fullstack-earlybird",
            nombre: "Pack Fullstack (Early Bird)",
            precio: 200000,
            cuotas: "1 pago contado",
            resumen: "Desde el 21/12 pasa a $220.000 en 3 cuotas sin interés de $73.333.",
          }
        : {
            itemId: "intensivo-verano-2027-fullstack",
            nombre: "Pack Fullstack",
            precio: 220000,
            cuotas: "3 cuotas sin interés de $73.333",
            resumen: "Ambos cursos: 38 clases y 142,5 hs cátedra. Ahorrás $80.000.",
          };
  }
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const diaDeSemana = (fecha) => {
  const [d, m] = fecha.split("/").map(Number);
  return DIAS[new Date(ANIO_CURSADA, m - 1, d).getDay()];
};

const fmt = (n) => "$" + n.toLocaleString("es-AR");
const fmtHoras = (n) => n.toLocaleString("es-AR");
const pad = (n) => String(n).padStart(2, "0");

/* ---------- Validación del formulario ---------- */

const limpiarEspacios = (s) => s.replace(/\s+/g, " ").trim();

// Errores de tipeo frecuentes en dominios de mail
const DOMINIOS_TYPO = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.om": "gmail.com",
  "gamil.com": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "yahoo.con": "yahoo.com",
  "yaho.com": "yahoo.com",
};

/**
 * Normaliza teléfonos al formato que usa WhatsApp: +549 + área + número.
 * Acepta: 11 2345-6789 · 011 15 2345-6789 · +54 9 11 2345 6789 · 5491123456789.
 * Números extranjeros (con + y otro código de país) se aceptan con 8 a 15 dígitos.
 * Devuelve el número normalizado, o null si no es válido.
 */
function normalizarTelefono(valor) {
  const crudo = valor.trim();
  let d = crudo.replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);

  const esExtranjero = crudo.startsWith("+") && !d.startsWith("54");
  if (esExtranjero) {
    return d.length >= 8 && d.length <= 15 ? `+${d}` : null;
  }

  if (d.startsWith("54")) {
    d = d.slice(2);
    if (d.startsWith("9")) d = d.slice(1);
  }
  if (d.startsWith("0")) d = d.slice(1); // 011 -> 11

  // Quitar el "15" que va después del código de área (2, 3 o 4 dígitos)
  if (d.length === 12) {
    for (const largoArea of [2, 3, 4]) {
      if (d.slice(largoArea, largoArea + 2) === "15") {
        d = d.slice(0, largoArea) + d.slice(largoArea + 2);
        break;
      }
    }
  }

  return d.length === 10 ? `+549${d}` : null;
}

function validarFormulario({ nombre, email, telefono, srvHp }) {
  const errores = {};

  const n = limpiarEspacios(nombre);
  if (!n) {
    errores.nombre = "Ingresá tu nombre y apellido.";
  } else if (!/^[\p{L}' .-]+$/u.test(n)) {
    errores.nombre = "Usá solo letras (sin números ni símbolos).";
  } else if (n.split(" ").filter((p) => p.replace(/[.'-]/g, "").length >= 2).length < 2) {
    errores.nombre = "Ingresá nombre y apellido.";
  } else if (n.length > 80) {
    errores.nombre = "El nombre es demasiado largo.";
  }

  const m = email.trim().toLowerCase();
  if (!m) {
    errores.email = "Ingresá tu correo electrónico.";
  } else if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(m)) {
    errores.email = "El correo no parece válido (ej: nombre@gmail.com).";
  } else {
    const dominio = m.split("@")[1];
    if (DOMINIOS_TYPO[dominio]) {
      errores.email = `¿Quisiste decir ${m.split("@")[0]}@${DOMINIOS_TYPO[dominio]}?`;
    }
  }

  if (!telefono.trim()) {
    errores.telefono = "Ingresá tu número de WhatsApp.";
  } else if (/[^\d\s()+.-]/.test(telefono)) {
    errores.telefono = "Usá solo números (podés incluir +, espacios y guiones).";
  } else if (!normalizarTelefono(telefono)) {
    errores.telefono = "Ingresá código de área + número (ej: 11 2345-6789).";
  }

  // Campo trampa: los humanos no lo ven, los bots lo completan
  if (srvHp && srvHp.trim()) errores.bot = true;

  return errores;
}

/* ---------- Contador regresivo (se re-renderiza solo él cada segundo) ---------- */
function Countdown({ hasta, onExpire }) {
  const [restante, setRestante] = useState(() => hasta - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      const r = hasta - Date.now();
      setRestante(r);
      if (r <= 0) {
        clearInterval(id);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [hasta, onExpire]);

  const t = Math.max(0, restante);
  const partes = [
    { valor: Math.floor(t / 86400000), label: "Días" },
    { valor: Math.floor(t / 3600000) % 24, label: "Hs" },
    { valor: Math.floor(t / 60000) % 60, label: "Min" },
    { valor: Math.floor(t / 1000) % 60, label: "Seg" },
  ];

  return (
    <div className={styles.countdown}>
      <span className={styles.countdownTitle}>La preventa termina en</span>
      <div className={styles.countdownGrid} role="timer" aria-live="off">
        {partes.map((p) => (
          <div key={p.label} className={styles.countdownBox}>
            <span className={styles.countdownValue}>{pad(p.valor)}</span>
            <span className={styles.countdownLabel}>{p.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactoCursoWeb() {
  const [preventaActiva, setPreventaActiva] = useState(
    () => Date.now() <= EARLY_BIRD_HASTA,
  );
  const [plan, setPlan] = useState("fullstack");
  const [cursoActivo, setCursoActivo] = useState("frontend");
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    srvHp: "", // honeypot (nombre poco común para que el autocompletado no lo llene)
  });
  const [tocados, setTocados] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");
  // Si vuelve de Mercado Pago sin completar el pago (back_url de "failure")
  const [pagoNoCompletado] = useState(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return ["rejected", "null", "failure"].includes(params.get("collection_status") || params.get("status"));
  });

  const terminarPreventa = useCallback(() => setPreventaActiva(false), []);

  // ViewContent: alguien entró a ver el intensivo
  useEffect(() => {
    trackConversion("ViewContent", {
      content_name: `Intensivo Verano 2027 - ${oferta.nombre}`,
      content_ids: [oferta.itemId],
      content_type: "product",
      currency: "ARS",
      value: oferta.precio,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Respaldo: si el contador no está en pantalla, igual cerramos la preventa a tiempo
  useEffect(() => {
    if (!preventaActiva) return undefined;
    const id = setInterval(() => {
      if (Date.now() > EARLY_BIRD_HASTA) terminarPreventa();
    }, 30000);
    return () => clearInterval(id);
  }, [preventaActiva, terminarPreventa]);

  const oferta = getOferta(plan, preventaActiva);
  const curso = CURSOS.find((c) => c.id === cursoActivo);

  const elegirPlan = (id) => {
    setPlan(id);
    if (id !== "fullstack") setCursoActivo(id);
  };

  const errores = validarFormulario(formData);
  // Solo mostramos el error de un campo después de que el usuario salió de él (o intentó enviar)
  const errorDe = (campo) => (tocados[campo] ? errores[campo] : undefined);

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;
    if (name === "telefono") value = value.replace(/[^\d\s()+.-]/g, "");
    setFormData({ ...formData, [name]: value });
  };

  const formularioListo =
    formData.nombre.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.telefono.trim() !== "" &&
    !errores.nombre &&
    !errores.email &&
    !errores.telefono;

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTocados((t) => ({ ...t, [name]: true }));
    // Prolijamos el texto al salir del campo
    if (name === "nombre") setFormData((f) => ({ ...f, nombre: limpiarEspacios(value) }));
    if (name === "email") setFormData((f) => ({ ...f, email: value.trim().toLowerCase() }));
  };

  const aceptarSugerenciaEmail = () => {
    const [usuario, dominio] = formData.email.trim().toLowerCase().split("@");
    if (DOMINIOS_TYPO[dominio]) {
      setFormData((f) => ({ ...f, email: `${usuario}@${DOMINIOS_TYPO[dominio]}` }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Bot detectado: simulamos éxito sin enviar nada
    if (errores.bot) {
      console.warn("[Formulario] Envío bloqueado por el campo anti-bots (srvHp):", formData.srvHp);
      setSubmitted(true);
      return;
    }

    const camposConError = ["nombre", "email", "telefono"].filter((c) => errores[c]);
    if (camposConError.length > 0) {
      setTocados({ nombre: true, email: true, telefono: true });
      document.getElementById(camposConError[0])?.focus();
      return;
    }

    setLoading(true);
    setErrorEnvio("");

    const datos = {
      nombre: limpiarEspacios(formData.nombre),
      email: formData.email.trim().toLowerCase(),
      telefono: normalizarTelefono(formData.telefono),
    };

    const contentName = `Intensivo Verano 2027 - ${oferta.nombre}`;

    try {
      const res = await fetch(INSCRIPCION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, plan }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.init_point) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      // Lead: dejó sus datos. InitiateCheckout: va a pagar.
      // El Purchase se envía recién en /full-stack/gracias, con el pago verificado en Mercado Pago.
      // Pixel + CAPI con el mismo event_id; los datos personales viajan hasheados.
      const evento = {
        content_name: contentName,
        content_ids: [oferta.itemId],
        content_type: "product",
        currency: "ARS",
        value: oferta.precio,
      };
      trackConversion("Lead", evento, datos);
      trackConversion("InitiateCheckout", evento, datos);

      // Al checkout de Mercado Pago (el link también le llega por mail)
      window.location.href = data.init_point;
    } catch (err) {
      console.error("Error al generar la inscripción:", err);
      setErrorEnvio(
        "No pudimos generar tu link de pago. Probá de nuevo en unos segundos o escribinos por WhatsApp.",
      );
      setLoading(false);
    }
  };

  const renderedRows = useMemo(
    () =>
      curso.cronograma.map((item) => (
        <tr key={item.clase} className={styles.tableRow}>
          <td className={styles.classCol}>#{item.clase}</td>
          <td className={styles.dateCol}>
            <span className={styles.dayName}>{diaDeSemana(item.fecha)}</span> {item.fecha}
          </td>
          <td className={styles.tagCol}>
            <span className={styles.moduleTag}>{item.bloque}</span>
          </td>
          <td className={styles.titleCol}>{item.titulo}</td>
        </tr>
      )),
    [curso],
  );

  const esFull = plan === "fullstack";

  return (
    <section id="cursos-verano" className={styles.section}>
      <Seo
        title="Intensivo Full Stack 2027 en vivo: Frontend, Backend o Full Stack | WEARESRV"
        description="Cursada intensiva en vivo de enero a marzo: Frontend con React y Backend con Node.js y bases de datos, con código real y mentoría. Reservá tu lugar."
        path="/full-stack/inscripcion"
      />
      <div className={styles.fullLayout}>
        {/* ===== Columna izquierda: oferta + formulario ===== */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={styles.badge}>Inicio: 18 de Enero</div>
              <h1 className={styles.title}>
                Intensivos de <span className={styles.orange}>Verano 2027</span>
              </h1>
              <p className={styles.description}>
                Aprovechá enero y febrero para aprender a programar de verdad:
                Frontend con React y Backend con Node.js y bases de datos, con
                código real y mentoría en vivo.
              </p>

              {/* Selector de plan */}
              <div className={styles.planGroup} role="radiogroup" aria-label="Elegí tu plan">
                {PLANES.map((p) => {
                  const o = getOferta(p.id, preventaActiva);
                  const activo = plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      role="radio"
                      aria-checked={activo}
                      onClick={() => elegirPlan(p.id)}
                      className={`${styles.planOption} ${activo ? styles.planActive : ""}`}
                    >
                      {p.id === "fullstack" && preventaActiva && (
                        <span className={styles.planFlag}>Preventa</span>
                      )}
                      <span className={styles.planLabel}>{p.corto}</span>
                      <span className={styles.planPrice}>{fmt(o.precio)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tarjeta de precio según el plan */}
              <div className={styles.promoCard} aria-live="polite">
                <div className={styles.promoBadge}>
                  {esFull
                    ? preventaActiva
                      ? "🔥 Preventa Early Bird · hasta el 20/12"
                      : "🔥 Pack Fullstack · Ahorrás $80.000"
                    : oferta.nombre}
                </div>

                <div className={styles.priceContainer}>
                  {esFull ? (
                    <div className={styles.oldPriceBox}>
                      <span className={styles.oldPriceLabel}>Por separado</span>
                      <span className={styles.oldPrice}>{fmt(PRECIO_SEPARADO)}</span>
                    </div>
                  ) : (
                    <div className={styles.oldPriceBox}>
                      <span className={styles.oldPriceLabel}>Financiación</span>
                      <span className={styles.altPrice}>{oferta.cuotas}</span>
                    </div>
                  )}
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>
                      {esFull ? oferta.cuotas : "Precio total"}
                    </span>
                    <div className={styles.mainPrice}>
                      {fmt(oferta.precio)} <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>

                {esFull && preventaActiva && (
                  <Countdown hasta={EARLY_BIRD_HASTA} onExpire={terminarPreventa} />
                )}

                <div className={styles.monthlyPerk}>💡 {oferta.resumen}</div>

                {!esFull && (
                  <button
                    type="button"
                    className={styles.upsell}
                    onClick={() => elegirPlan("fullstack")}
                  >
                    ¿Querés los dos? Pack Fullstack a{" "}
                    <strong>{fmt(preventaActiva ? 200000 : 220000)}</strong>
                    {preventaActiva ? " hasta el 20/12" : ""} →
                  </button>
                )}
              </div>

              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Inicio</span>
                  <span className={styles.detailValue}>18 de Enero</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Modalidad</span>
                  <span className={styles.detailValue}>100% Virtual</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Horario</span>
                  <span className={styles.detailValue}>Noche · {HORARIO}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Cupos</span>
                  <span className={styles.detailValue}>Limitados</span>
                </div>
              </div>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <h3 className={styles.formTitle}>Reservar mi Lugar</h3>

                {pagoNoCompletado && !errorEnvio && (
                  <span className={styles.errorMsg} role="status">
                    El pago no se completó. Podés intentarlo de nuevo acá o con el link que te
                    enviamos por mail.
                  </span>
                )}

                {/* Honeypot anti-bots: invisible para personas */}
                <div className={styles.honeypot} aria-hidden="true">
                  <label htmlFor="srv-hp">Dejar vacío</label>
                  <input
                    type="text"
                    id="srv-hp"
                    name="srvHp"
                    value={formData.srvHp}
                    onChange={handleChange}
                    tabIndex={-1}
                    autoComplete="new-password"
                    data-lpignore="true"
                    data-1p-ignore="true"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="nombre" className={styles.label}>
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength={80}
                    autoComplete="name"
                    placeholder="Ej: Carlos Gómez"
                    aria-invalid={!!errorDe("nombre")}
                    aria-describedby={errorDe("nombre") ? "nombre-error" : undefined}
                    className={`${styles.input} ${errorDe("nombre") ? styles.inputError : ""}`}
                  />
                  {errorDe("nombre") && (
                    <span id="nombre-error" className={styles.errorMsg} role="alert">
                      {errorDe("nombre")}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="email" className={styles.label}>
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength={120}
                    autoComplete="email"
                    inputMode="email"
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder="ejemplo@correo.com"
                    aria-invalid={!!errorDe("email")}
                    aria-describedby={errorDe("email") ? "email-error" : undefined}
                    className={`${styles.input} ${errorDe("email") ? styles.inputError : ""}`}
                  />
                  {errorDe("email") && (
                    <span id="email-error" className={styles.errorMsg} role="alert">
                      {errorDe("email")}
                      {errorDe("email").startsWith("¿Quisiste") && (
                        <button
                          type="button"
                          className={styles.suggestBtn}
                          onClick={aceptarSugerenciaEmail}
                        >
                          Corregir
                        </button>
                      )}
                    </span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="telefono" className={styles.label}>
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    maxLength={25}
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="Ej: 11 2345-6789"
                    aria-invalid={!!errorDe("telefono")}
                    aria-describedby={errorDe("telefono") ? "telefono-error" : "telefono-ayuda"}
                    className={`${styles.input} ${errorDe("telefono") ? styles.inputError : ""}`}
                  />
                  {errorDe("telefono") ? (
                    <span id="telefono-error" className={styles.errorMsg} role="alert">
                      {errorDe("telefono")}
                    </span>
                  ) : (
                    <span id="telefono-ayuda" className={styles.helpMsg}>
                      Código de área + número. Si estás fuera de Argentina, empezá con +.
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !formularioListo}
                  aria-describedby={!formularioListo ? "form-ayuda" : undefined}
                  className={styles.btnSubmit}
                >
                  {loading
                    ? "Generando tu link de pago..."
                    : `Inscribirme y pagar ${PLANES.find((p) => p.id === plan).corto} · ${fmt(oferta.precio)}`}
                </button>
                {errorEnvio && (
                  <span className={styles.errorMsg} role="alert">
                    {errorEnvio}
                  </span>
                )}
                {!formularioListo && !loading && (
                  <span id="form-ayuda" className={styles.formHint}>
                    Completá tus datos correctamente para reservar tu lugar.
                  </span>
                )}
                {formularioListo && !errorEnvio && (
                  <span className={styles.formHint}>
                    🔒 Pagás en Mercado Pago (tarjeta, débito o dinero en cuenta). Si preferís
                    transferencia, te enviamos los datos por mail.
                  </span>
                )}
              </form>
            ) : (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>¡Inscripción recibida!</h3>
                <p>
                  Te enviamos un mail con el link para pagar{" "}
                  <strong>{oferta.nombre}</strong> por <strong>{fmt(oferta.precio)}</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ===== Columna derecha: cursos + cronograma ===== */}
        <div className={styles.contentColumn}>
          <div>
            <h3 className={styles.subTitle}>Elegí tu Camino</h3>
            <div className={styles.modulesGrid}>
              {CURSOS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={plan === c.id}
                  onClick={() => elegirPlan(c.id)}
                  className={`${styles.moduleCard} ${
                    plan === c.id ? styles.moduleCardActive : ""
                  }`}
                >
                  <span className={styles.moduleNum}>{c.num}</span>
                  <h4>{c.nombre}</h4>
                  <p>{c.stack}</p>
                  <span className={styles.moduleMeta}>
                    {c.dias} · {c.semanas} semanas · {fmtHoras(c.horasCatedra)} hs cát.
                  </span>
                </button>
              ))}
              <button
                type="button"
                aria-pressed={esFull}
                onClick={() => elegirPlan("fullstack")}
                className={`${styles.moduleCard} ${styles.moduleCardCombo} ${
                  esFull ? styles.moduleCardActive : ""
                }`}
              >
                <span className={styles.moduleNum}>01 + 02</span>
                <h4>Pack Fullstack</h4>
                <p>
                  Ambos cursos en paralelo: 38 clases y 142,5 hs cátedra en 10
                  semanas.
                </p>
                <span className={styles.moduleMeta}>
                  {preventaActiva
                    ? "$200.000 hasta el 20/12 · 1 pago"
                    : "$220.000 en 3 cuotas sin interés de $73.333"}
                </span>
              </button>
            </div>
          </div>

          <div className={styles.calendarWrapper}>
            <div className={styles.calendarHeader}>
              <h3 className={styles.subTitle}>Calendario de Clases</h3>
              <div className={styles.tabs} role="tablist" aria-label="Elegir curso">
                {CURSOS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    id={`tab-${c.id}`}
                    aria-selected={c.id === cursoActivo}
                    aria-controls="panel-cronograma"
                    onClick={() => setCursoActivo(c.id)}
                    className={`${styles.tab} ${
                      c.id === cursoActivo ? styles.tabActive : ""
                    }`}
                  >
                    {c.corto}
                  </button>
                ))}
              </div>
            </div>

            <div id="panel-cronograma" role="tabpanel" aria-labelledby={`tab-${cursoActivo}`}>
              <div className={styles.courseMeta}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Días</span>
                  <span className={styles.detailValue}>{curso.dias}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Horario</span>
                  <span className={styles.detailValue}>{HORARIO}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Duración</span>
                  <span className={styles.detailValue}>
                    {curso.semanas} semanas · {curso.clases} clases
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Carga</span>
                  <span className={styles.detailValue}>{fmtHoras(curso.horasCatedra)} hs cátedra</span>
                </div>
              </div>

              <div className={styles.tableResponsive}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Clase</th>
                      <th>Fecha</th>
                      <th>Bloque</th>
                      <th>Temario</th>
                    </tr>
                  </thead>
                  <tbody>{renderedRows}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const ContactoCursoWebMemo = React.memo(ContactoCursoWeb);

// Sirve tanto `import ContactoCursoWeb from ...` como `import { ContactoCursoWeb } from ...`
export { ContactoCursoWebMemo as ContactoCursoWeb };
export default ContactoCursoWebMemo;
