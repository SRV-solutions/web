import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { LuCheck, LuScanBarcode } from "react-icons/lu";
import a from "./animaciones.module.css";
import { Toque } from "./PortalSocio";
import { azar, pesos, useCiclo } from "./util";

// La caja cobra tres facturas con el lector de código de barras y cierra el turno con el arqueo.
// El último paso deja la caja vacía un momento para que la vuelta siguiente arranque de cero
const DURACIONES = [1700, 1700, 1700, 3400, 700];
const COBROS = [
  { socio: "Héctor Ríos", factura: "0003-00012311", monto: 31442.1 },
  { socio: "Carmen Duarte", factura: "0003-00012598", monto: 57380 },
  { socio: "Luis Ferreyra", factura: "0003-00012702", monto: 22915.6 },
];
const TOTAL = COBROS.reduce((t, c) => t + c.monto, 0);

// Barras del código: anchos con semilla, siempre iguales
const BARRAS = (() => {
  const r = azar(4521);
  const barras = [];
  let x = 0;
  while (x < 190) {
    const ancho = 1 + Math.floor(r() * 3.2);
    barras.push([x, ancho]);
    x += ancho + 1 + Math.floor(r() * 2.4);
  }
  return barras;
})();

export default function Caja() {
  const { ref, paso, activo } = useCiclo(DURACIONES, { final: 3 });
  const cobrados = !activo || paso === 4 ? 0 : Math.min(paso + 1, COBROS.length);
  const cerrando = activo && paso === 3;
  const total = COBROS.slice(0, cobrados).reduce((t, c) => t + c.monto, 0);

  return (
    <div
      ref={ref}
      className={a.pantallaSuelta}
      role="img"
      aria-label="Animación de la caja: cobra tres facturas con el lector de código de barras y cierra el turno con el arqueo, que da diferencia cero."
    >
      <div className={a.sueltaBarra}>
        <span>
          <LuScanBarcode aria-hidden="true" /> Caja 1 · Turno mañana
        </span>
        <span className={a.pildoraVerde}>Lector listo</span>
      </div>

      <div className={a.lector}>
        <svg viewBox="0 0 190 44" className={a.barras} aria-hidden="true">
          {BARRAS.map(([x, ancho]) => (
            <rect key={x} x={x} y="0" width={ancho} height="44" />
          ))}
        </svg>
        {activo && paso < 3 && (
          <m.span
            key={paso}
            className={a.laser}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [0, 52, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeInOut" }}
          />
        )}
      </div>

      <ul className={a.cobros}>
        <AnimatePresence initial={false}>
          {COBROS.slice(0, cobrados).map((c) => (
            <m.li
              key={c.factura}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.25 } }}
              transition={{ duration: 0.3, delay: 0.9 }}
            >
              <span className={a.cobroCheck}>
                <LuCheck aria-hidden="true" />
              </span>
              <span className={a.cobroSocio}>
                <b>{c.socio}</b>
                <small>Factura {c.factura}</small>
              </span>
              <span className={a.cobroMonto}>{pesos(c.monto)}</span>
            </m.li>
          ))}
        </AnimatePresence>
      </ul>

      <div className={a.cajaPie}>
        <AnimatePresence mode="wait" initial={false}>
          {cerrando ? (
            <m.div
              key="arqueo"
              className={a.arqueo}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <span>
                Cobrado en el turno <b>{pesos(TOTAL)}</b>
              </span>
              <span>
                Contado en caja <b>{pesos(TOTAL)}</b>
              </span>
              <span className={a.arqueoOk}>
                <LuCheck aria-hidden="true" /> Diferencia {pesos(0)}: el turno cierra
              </span>
            </m.div>
          ) : (
            <m.div key="turno" className={a.turno} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <span>
                Total del turno <b>{pesos(total)}</b>
              </span>
              <span className={a.botonApp}>
                Cerrar turno
                {activo && paso === 2 && <Toque demora={1.35} />}
              </span>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
