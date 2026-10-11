import React, { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { trackEvent } from "../../data/metaPixel";

export default function GraciasPython() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("collection_status");
  const paymentId = searchParams.get("payment_id");

  useEffect(() => {
    if (status === "approved") {
      // Disparar Purchase en Meta Pixel al volver con éxito
      if (typeof trackEvent === "function") {
        trackEvent("Purchase", {
          content_name: "Infoproducto Python Completo",
          currency: "ARS",
          value: 80000.0,
        }, paymentId);
      }
    }
  }, [status, paymentId]);

  return (
    <div style={{ padding: "4rem 2rem", textAlign: "center", color: "#fff", backgroundColor: "#000", minHeight: "70vh" }}>
      <div style={{ fontSize: "3rem", color: "#00bf63" }}>✓</div>
      <h1 style={{ fontSize: "2rem", marginTop: "1rem" }}>¡Pago Confirmado con Éxito!</h1>
      <p style={{ fontSize: "1.1rem", color: "#ccc", maxWidth: "600px", margin: "1rem auto" }}>
        Hemos recibido tu pago correctamente. En los próximos minutos recibirás el acceso al material en tu <strong>Email</strong> y <strong>WhatsApp</strong>.
      </p>
      <div style={{ background: "#0d0d0d", border: "1px solid #0b78fb", padding: "1.5rem", borderRadius: "8px", display: "inline-block", marginTop: "1.5rem" }}>
        <p style={{ margin: 0, color: "#f6950a", fontWeight: "bold" }}>N° de Transacción: {paymentId || "Procesando..."}</p>
        <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.9rem", color: "#aaa" }}>
          Revisa también tu bandeja de Spam o Promociones.
        </p>
      </div>
      <div style={{ marginTop: "2rem" }}>
        <Link to="/" style={{ color: "#0b78fb", textDecoration: "underline" }}>Volver al inicio</Link>
      </div>
    </div>
  );
}