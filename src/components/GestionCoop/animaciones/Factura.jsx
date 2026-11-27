import React from "react";
import { m } from "framer-motion";
import { LuCheck } from "react-icons/lu";
import a from "./animaciones.module.css";
import { azar, COOPE, pesos, useCiclo } from "./util";

// La facturación del mes en cuatro pasos. La factura se arma renglón por renglón y termina con el sello
// «CAE autorizado» y el QR. Es la factura de Rosa, la socia del celular (PortalSocio.jsx): mismos montos.
// El QR es decorativo (no se puede escanear) y el CAE es inventado.
const DURACIONES = [1500, 2900, 2000, 3800];
const PASOS = ["Cerrar lectura", "Pre-facturar", "Revisar", "Emitir"];
const RENGLONES = [
  ["Energía eléctrica · 245 kWh", 29874.6],
  ["Cargo fijo", 6720],
  ["Agua potable · 18 m³", 5296.4],
  ["Impuestos y tasas", 6250.8],
];
const TOTAL = RENGLONES.reduce((t, [, monto]) => t + monto, 0);

// Módulos de un QR de 25 × 25 con sus tres cuadros de esquina
const QR = (() => {
  const n = 25;
  const r = azar(1187);
  const esquina = (x, y, ox, oy) => {
    const dx = x - ox;
    const dy = y - oy;
    if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return null;
    const borde = dx === 0 || dy === 0 || dx === 6 || dy === 6;
    const centro = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
    return borde || centro;
  };
  let d = "";
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const e = esquina(x, y, 0, 0) ?? esquina(x, y, n - 7, 0) ?? esquina(x, y, 0, n - 7);
      const separador = (x <= 7 && y <= 7) || (x >= n - 8 && y <= 7) || (x <= 7 && y >= n - 8);
      const lleno = e !== null ? e : separador ? false : r() > 0.52;
      if (lleno) d += `M${x} ${y}h1v1h-1z`;
    }
  }
  return d;
})();

export default function Factura() {
  const { ref, paso, activo } = useCiclo(DURACIONES);
  const verRenglones = activo && paso >= 1;
  const emitida = activo && paso === 3;

  return (
    <div
      ref={ref}
      className={a.facturacion}
      role="img"
      aria-label="Animación de la facturación del mes: cerrar lectura, pre-facturar, revisar las fuera de lo común y emitir. La factura se arma renglón por renglón y sale con el CAE autorizado y su código QR."
    >
      <ol className={a.pasos}>
        {PASOS.map((p, i) => {
          const estado = !activo || paso < i ? "" : paso === i ? a.pasoActivo : a.pasoHecho;
          return (
            <li key={p} className={estado}>
              <span className={a.pasoNumero}>{activo && paso > i ? <LuCheck aria-hidden="true" /> : i + 1}</span>
              {p}
            </li>
          );
        })}
      </ol>

      <div className={a.revision}>
        <m.span
          animate={{ opacity: activo && paso >= 2 ? 1 : 0, y: activo && paso >= 2 ? 0 : 6 }}
          transition={{ duration: 0.3 }}
        >
          {paso === 2 ? "Revisando 7 fuera de lo común…" : "7 fuera de lo común · revisadas"}
          {paso === 3 && <LuCheck aria-hidden="true" />}
        </m.span>
      </div>

      <div className={a.papel}>
        <div className={a.papelCabeza}>
          <div className={a.papelEmisor}>
            <span className={a.papelLogo}>AM</span>
            <span>
              <b>{COOPE}</b>
              <small>Servicios de energía y agua</small>
            </span>
          </div>
          <span className={a.papelLetra}>
            B<small>Cód. 006</small>
          </span>
          <div className={a.papelNumero}>
            <b>Factura</b>
            <small>N.º 0003-00012874</small>
            <small>27/11/2026</small>
          </div>
        </div>

        <div className={a.papelSocio}>
          Socio 4521 · Rosa Benítez · Conexión 1187 · Noviembre 2026
        </div>

        <ul className={a.papelRenglones}>
          {RENGLONES.map(([concepto, monto], i) => (
            <m.li
              key={concepto}
              initial={false}
              animate={{ opacity: verRenglones ? 1 : 0, x: verRenglones ? 0 : -10 }}
              transition={{ delay: verRenglones && paso === 1 ? 0.25 + i * 0.45 : 0, duration: 0.3 }}
            >
              <span>{concepto}</span>
              <span>{pesos(monto)}</span>
            </m.li>
          ))}
        </ul>

        <m.div
          className={a.papelTotal}
          initial={false}
          animate={{ opacity: verRenglones ? 1 : 0 }}
          transition={{ delay: verRenglones && paso === 1 ? 2.1 : 0, duration: 0.3 }}
        >
          <span>Total</span>
          <span>{pesos(TOTAL)}</span>
        </m.div>

        <div className={a.papelPie}>
          <m.svg
            viewBox="-1 -1 27 27"
            className={a.qr}
            aria-hidden="true"
            initial={false}
            animate={{ clipPath: emitida ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" }}
            transition={{ delay: emitida ? 0.6 : 0, duration: emitida ? 0.7 : 0.2 }}
          >
            <rect x="-1" y="-1" width="27" height="27" fill="#fff" />
            <path d={QR} fill="#111" />
          </m.svg>
          <m.div
            className={a.cae}
            initial={false}
            animate={{ opacity: emitida ? 1 : 0 }}
            transition={{ delay: emitida ? 0.9 : 0, duration: 0.3 }}
          >
            <small>CAE</small>
            <b>76482019375521</b>
            <small>Vence el 07/12/2026</small>
          </m.div>
          <m.span
            className={a.sello}
            initial={false}
            animate={emitida ? { opacity: 1, scale: 1, rotate: -9 } : { opacity: 0, scale: 1.8, rotate: -9 }}
            transition={emitida ? { delay: 0.25, type: "spring", stiffness: 520, damping: 22 } : { duration: 0.2 }}
          >
            <span className={a.selloArriba}>
              <LuCheck aria-hidden="true" /> CAE
            </span>
            <span>autorizado</span>
          </m.span>
        </div>
      </div>
    </div>
  );
}
