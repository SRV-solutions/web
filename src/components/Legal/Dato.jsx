import React from "react";
import styles from "./style.module.css";
import { LEGAL } from "../../data/legal";

// Muestra un dato de src/data/legal.js. Si falta, en desarrollo avisa con "⚠ completar ..."
// y en producción no muestra nada: mejor vacío que un texto de relleno en la web publicada.
export default function Dato({ valor, nombre }) {
  if (valor) return <>{valor}</>;
  if (import.meta.env.DEV) return <span className={styles.faltante}>⚠ completar {nombre}</span>;
  return null;
}

export const hayDato = (valor) => Boolean(valor) || import.meta.env.DEV;

// Quién vende y cómo contactarlo (lo usan /terminos y /privacidad)
export function DatosVendedor() {
  const filas = [
    { etiqueta: "Razón social", valor: LEGAL.razonSocial, nombre: "razón social" },
    { etiqueta: "CUIT", valor: LEGAL.cuit, nombre: "CUIT" },
    { etiqueta: "Domicilio", valor: LEGAL.domicilio, nombre: "domicilio" },
    { etiqueta: "Mail", valor: LEGAL.email, nombre: "mail de atención" },
    { etiqueta: "WhatsApp", valor: LEGAL.whatsapp, nombre: "WhatsApp" },
    { etiqueta: "Horario de atención", valor: LEGAL.horario, nombre: "horario de atención" },
  ].filter((f) => hayDato(f.valor));

  return (
    <dl className={styles.datos}>
      {filas.map((f) => (
        <div key={f.etiqueta} className={styles.datoFila}>
          <dt>{f.etiqueta}</dt>
          <dd>
            <Dato valor={f.valor} nombre={f.nombre} />
          </dd>
        </div>
      ))}
    </dl>
  );
}
