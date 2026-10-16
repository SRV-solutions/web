import React, { useEffect, useState } from "react";
import Seo from "../Seo";
import { useSearchParams, Link } from "react-router-dom";
import { trackEvent, getMetaCookies } from "../../data/metaPixel";
import { CURSOS_GRABADOS } from "../../data/cursosGrabados";

const MENSAJES = {
  approved: {
    icono: "✓",
    color: "#00bf63",
    titulo: "¡Pago Confirmado con Éxito!",
    texto: "Hemos recibido tu pago correctamente. En los próximos minutos recibirás el acceso al material en tu Email.",
  },
  pending: {
    icono: "⏳",
    color: "#f6950a",
    titulo: "Tu pago está pendiente",
    texto: "Apenas Mercado Pago lo acredite, te enviamos el acceso al material por Email automáticamente.",
  },
  rejected: {
    icono: "✕",
    color: "#ff4d4f",
    titulo: "El pago no se pudo completar",
    texto: "Mercado Pago rechazó la operación. Podés intentarlo de nuevo con otro medio de pago.",
  },
};

// Textos para los Intensivos de Verano (cursoKey="intensivo"): el acceso es a Discord y WhatsApp
const INTENSIVO = { ruta: "full-stack" };
const TEXTOS_INTENSIVO = {
  approved: "Tu lugar en los Intensivos de Verano 2027 está confirmado. En los próximos minutos te llega un mail con los accesos al Discord y a los grupos de WhatsApp.",
  pending: "Apenas Mercado Pago lo acredite, te enviamos por Email los accesos al Discord y a los grupos de WhatsApp automáticamente.",
  unknown: "Si ya pagaste, en los próximos minutos recibirás en tu Email los accesos al Discord y a los grupos de WhatsApp.",
};

export default function GraciasCurso({ cursoKey }) {
  const esIntensivo = cursoKey === "intensivo";
  const curso = esIntensivo ? INTENSIVO : CURSOS_GRABADOS[cursoKey];
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  const [estado, setEstado] = useState(paymentId ? "loading" : "unknown");

  useEffect(() => {
    if (!paymentId) return;
    let cancelado = false;

    // El servidor verifica el pago con Mercado Pago y envía el Purchase por CAPI.
    // El Pixel se dispara recién cuando el servidor confirma, con el mismo event_id.
    fetch("/.netlify/functions/confirmar-compra", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_id: paymentId, curso: cursoKey, ...getMetaCookies() }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelado) return;

        if (data.status === "approved") {
          // Evita repetir el Purchase si el usuario recarga la página
          const storageKey = `srv_purchase_${paymentId}`;
          if (!localStorage.getItem(storageKey)) {
            trackEvent("Purchase", {
              content_name: data.content_name,
              content_ids: [data.content_id],
              content_type: "product",
              currency: data.currency,
              value: data.value,
            }, data.event_id);
            localStorage.setItem(storageKey, "1");
          }
          setEstado("approved");
        } else if (data.status === "pending" || data.status === "in_process") {
          setEstado("pending");
        } else if (data.status === "rejected" || data.status === "cancelled") {
          setEstado("rejected");
        } else {
          setEstado("unknown");
        }
      })
      .catch(() => !cancelado && setEstado("unknown"));

    return () => {
      cancelado = true;
    };
  }, [paymentId, cursoKey]);

  let mensaje = MENSAJES[estado] || {
    icono: estado === "loading" ? "…" : "ℹ",
    color: "#0b78fb",
    titulo: estado === "loading" ? "Verificando tu pago..." : "Estamos procesando tu compra",
    texto: estado === "loading"
      ? "Esto tarda unos segundos."
      : "Si ya pagaste, en los próximos minutos recibirás el acceso al material en tu Email.",
  };
  if (esIntensivo && TEXTOS_INTENSIVO[estado]) {
    mensaje = { ...mensaje, texto: TEXTOS_INTENSIVO[estado] };
  }

  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#fff", backgroundColor: "#000", minHeight: "70vh" }}>
      <Seo title="¡Gracias por tu compra! | WEARESRV" description="Confirmación de compra en WEARESRV." path={`/${curso.ruta}/gracias`} noindex />
      <div style={{ fontSize: "3rem", color: mensaje.color }}>{mensaje.icono}</div>
      <h1 style={{ fontSize: "2rem", marginTop: "1rem" }}>{mensaje.titulo}</h1>
      <p style={{ fontSize: "1.1rem", color: "#ccc", maxWidth: "600px", margin: "1rem auto" }}>
        {mensaje.texto}
      </p>
      <div style={{ background: "#0d0d0d", border: "1px solid #0b78fb", padding: "1.5rem", borderRadius: "8px", display: "inline-block", marginTop: "1.5rem" }}>
        <p style={{ margin: 0, color: "#f6950a", fontWeight: "bold" }}>N° de Transacción: {paymentId || "Procesando..."}</p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#aaa" }}>
          Revisa también tu bandeja de Spam o Promociones.
        </p>
      </div>
      <div style={{ marginTop: "2rem" }}>
        {estado === "rejected" ? (
          <Link to={`/${curso.ruta}/inscripcion`} style={{ color: "#0b78fb", textDecoration: "underline" }}>Volver a intentar el pago</Link>
        ) : (
          <Link to="/" style={{ color: "#0b78fb", textDecoration: "underline" }}>Volver al inicio</Link>
        )}
      </div>
    </div>
  );
}
