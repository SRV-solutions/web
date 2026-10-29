import React, { useState } from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import Dato from "./Dato";
import { LEGAL, whatsappLink } from "../../data/legal";
import { CURSOS_GRABADOS } from "../../data/cursosGrabados";

// Botón de arrepentimiento y botón de baja de servicio (Disp. 954/2025): se usan sin registrarse,
// la página genera el código de trámite y el pedido sale por WhatsApp o por mail con todos los datos.
// Pendiente (docs/plan-mejoras-2027.md): guardarlo con una Netlify Function + Apps Script y mandar el código por mail.

const CURSOS = Object.values(CURSOS_GRABADOS).map((c) =>
  [c.tituloInicio, c.tituloDestacado, c.tituloFin].filter(Boolean).join(" ")
);

const MODOS = {
  arrepentimiento: {
    path: "/arrepentimiento",
    prefijo: "ARR",
    titulo: "arrepentimiento",
    seoTitulo: "Botón de arrepentimiento | WEARESRV",
    seoDescripcion: "Arrepentite de tu compra dentro de los 10 días corridos, sin registrarte y sin costo.",
    intro:
      "Si compraste un curso o una cursada hace 10 días corridos o menos, podés arrepentirte sin dar explicaciones y sin costo (art. 34 de la Ley 24.240 y art. 1110 del Código Civil y Comercial). No necesitás registrarte.",
    etiquetaProducto: "Curso o cursada que compraste",
    productos: [...CURSOS, "Intensivo Full Stack de verano (en vivo)", "Otro"],
    pide: "arrepentirme de mi compra (Ley 24.240, art. 34)",
    asunto: "Arrepentimiento de compra",
    conCompra: true,
  },
  baja: {
    path: "/baja",
    prefijo: "BAJ",
    titulo: "baja de servicio",
    seoTitulo: "Botón de baja de servicio | WEARESRV",
    seoDescripcion: "Dá de baja un servicio de WEARESRV sin registrarte.",
    intro:
      "Si contrataste un servicio con pago periódico (por ejemplo Sentryx o Event Box), podés darlo de baja desde acá, sin registrarte.",
    etiquetaProducto: "Servicio que querés dar de baja",
    productos: ["Sentryx", "Event Box", "Club SRV", "Otro servicio"],
    pide: "dar de baja el servicio",
    asunto: "Baja de servicio",
    conCompra: false,
  },
};

const VACIO = { nombre: "", email: "", telefono: "", producto: "", fecha: "", operacion: "", comentario: "" };
const EMAIL_OK = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function generarCodigo(prefijo) {
  const hoy = new Date();
  const fecha = `${hoy.getFullYear()}${String(hoy.getMonth() + 1).padStart(2, "0")}${String(hoy.getDate()).padStart(2, "0")}`;
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sin 0/O ni 1/I para que se pueda dictar
  const azar = Array.from(crypto.getRandomValues(new Uint32Array(4)), (n) => letras[n % letras.length]).join("");
  return `${prefijo}-${fecha}-${azar}`;
}

function validar(f, conCompra) {
  const errores = {};
  if (f.nombre.trim().length < 3) errores.nombre = "Ingresá tu nombre y apellido.";
  if (!EMAIL_OK.test(f.email.trim())) errores.email = "Ingresá el mail con el que compraste.";
  if (!f.producto) errores.producto = "Elegí una opción.";
  if (conCompra && !f.fecha) errores.fecha = "Ingresá la fecha de compra.";
  return errores;
}

export default function Arrepentimiento({ modo = "arrepentimiento" }) {
  const m = MODOS[modo];
  const [form, setForm] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [codigo, setCodigo] = useState(null);
  const hoy = new Date().toISOString().slice(0, 10);

  const cambiar = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const enviar = (e) => {
    e.preventDefault();
    const encontrados = validar(form, m.conCompra);
    setErrores(encontrados);
    if (Object.keys(encontrados).length === 0) setCodigo(generarCodigo(m.prefijo));
  };

  const mensaje = codigo
    ? [
        `Hola, quiero ${m.pide}.`,
        `Código de trámite: ${codigo}`,
        `Nombre: ${form.nombre.trim()}`,
        `Mail: ${form.email.trim()}`,
        form.telefono.trim() && `WhatsApp: ${form.telefono.trim()}`,
        `${m.conCompra ? "Compra" : "Servicio"}: ${form.producto}`,
        form.fecha && `Fecha de compra: ${form.fecha.split("-").reverse().join("/")}`,
        form.operacion.trim() && `Operación de Mercado Pago: ${form.operacion.trim()}`,
        form.comentario.trim() && `Comentario: ${form.comentario.trim()}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  return (
    <section className={styles.page}>
      <Seo title={m.seoTitulo} description={m.seoDescripcion} path={m.path} />
      <div className={styles.inner}>
        <p className={styles.kicker}>Disposición 954/2025 · Defensa del Consumidor</p>
        <h1 className={styles.title}>
          Botón de <span className={styles.orange}>{m.titulo}</span>
        </h1>
        <p className={styles.lead}>{m.intro}</p>

        {!codigo ? (
          <form className={styles.form} onSubmit={enviar} noValidate>
            <div className={styles.campo}>
              <label htmlFor="arr-nombre">Nombre y apellido</label>
              <input id="arr-nombre" name="nombre" value={form.nombre} onChange={cambiar} autoComplete="name" />
              {errores.nombre && <span className={styles.error}>{errores.nombre}</span>}
            </div>
            <div className={styles.campo}>
              <label htmlFor="arr-email">Mail con el que {m.conCompra ? "compraste" : "contrataste"}</label>
              <input id="arr-email" name="email" type="email" value={form.email} onChange={cambiar} autoComplete="email" />
              {errores.email && <span className={styles.error}>{errores.email}</span>}
            </div>
            <div className={styles.campo}>
              <label htmlFor="arr-telefono">WhatsApp (opcional)</label>
              <input id="arr-telefono" name="telefono" type="tel" value={form.telefono} onChange={cambiar} autoComplete="tel" />
            </div>
            <div className={styles.campo}>
              <label htmlFor="arr-producto">{m.etiquetaProducto}</label>
              <select id="arr-producto" name="producto" value={form.producto} onChange={cambiar}>
                <option value="">Elegí una opción</option>
                {m.productos.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errores.producto && <span className={styles.error}>{errores.producto}</span>}
            </div>
            {m.conCompra && (
              <>
                <div className={styles.campo}>
                  <label htmlFor="arr-fecha">Fecha de compra</label>
                  <input id="arr-fecha" name="fecha" type="date" max={hoy} value={form.fecha} onChange={cambiar} />
                  {errores.fecha && <span className={styles.error}>{errores.fecha}</span>}
                </div>
                <div className={styles.campo}>
                  <label htmlFor="arr-operacion">Número de operación de Mercado Pago (opcional)</label>
                  <input id="arr-operacion" name="operacion" value={form.operacion} onChange={cambiar} inputMode="numeric" />
                  <small>Está en el mail de Mercado Pago o en tu actividad de la app.</small>
                </div>
              </>
            )}
            <div className={styles.campo}>
              <label htmlFor="arr-comentario">Comentario (opcional)</label>
              <textarea id="arr-comentario" name="comentario" rows="3" value={form.comentario} onChange={cambiar} />
            </div>
            <div>
              <button type="submit" className={styles.btnPrimary}>
                Generar mi código de trámite
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.resultado} aria-live="polite">
            <p>Tu código de trámite es:</p>
            <strong className={styles.codigo}>{codigo}</strong>
            <p>
              Guardalo y mandanos el pedido con un clic: ya va con todos tus datos. Te confirmamos la recepción dentro de
              las 24 horas{m.conCompra ? " y te devolvemos el dinero por el mismo medio de pago" : ""}.
            </p>
            <div className={styles.acciones}>
              <a className={styles.btnWhatsapp} href={whatsappLink(mensaje)} target="_blank" rel="noopener noreferrer">
                Enviar por WhatsApp
              </a>
              {LEGAL.email ? (
                <a
                  className={styles.btnMail}
                  href={`mailto:${LEGAL.email}?subject=${encodeURIComponent(`${m.asunto} ${codigo}`)}&body=${encodeURIComponent(mensaje)}`}
                >
                  Enviar por mail
                </a>
              ) : (
                <Dato valor={null} nombre="mail de atención para el botón «Enviar por mail»" />
              )}
            </div>
          </div>
        )}

        <p className={styles.actualizacion}>
          Más información en los <Link to="/terminos">términos y condiciones</Link>.
        </p>
      </div>
    </section>
  );
}
