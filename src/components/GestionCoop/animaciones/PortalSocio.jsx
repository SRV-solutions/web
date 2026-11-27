import React from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { LuChartColumn, LuCheck, LuHouse, LuMessageSquareWarning, LuReceiptText } from "react-icons/lu";
import a from "./animaciones.module.css";
import { COOPE, pesos, useCiclo } from "./util";

// El celular del socio: entra con tres datos de su factura, ve cuánto debe y en qué se va cada peso, toca «Pagar»
// y queda al día. Los montos son los mismos de la factura de ejemplo (Factura.jsx).
const DURACIONES = [3900, 3700, 1300, 3300];
const DEUDA = 48141.8;
const DATOS = [
  ["Código de socio", "4521"],
  ["N.º de conexión", "1187"],
  ["Documento", "28.456.913"],
];
export const DESGLOSE = [
  { nombre: "Energía", pct: 62, color: "#0b78fb" },
  { nombre: "Cargo fijo", pct: 14, color: "#8b95a5" },
  { nombre: "Agua", pct: 11, color: "#30a05a" },
  { nombre: "Impuestos", pct: 13, color: "#f6950a" },
];
const CONSUMO = [
  ["jun", 212],
  ["jul", 268],
  ["ago", 251],
  ["sep", 230],
  ["oct", 238],
  ["nov", 245],
];
const MAX_CONSUMO = 280;

function Tipeo({ texto, demora }) {
  return [...texto].map((c, i) => (
    <m.span
      key={i}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: demora + i * 0.08, duration: 0.01 }}
    >
      {c}
    </m.span>
  ));
}

// Un dedo que toca un botón (no aparece si se pidió menos movimiento)
export function Toque({ demora }) {
  const reducido = useReducedMotion();
  if (reducido) return null;
  return (
    <m.span
      className={a.toque}
      aria-hidden="true"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0.2, 1, 1.7], opacity: [0, 0.55, 0] }}
      transition={{ delay: demora, duration: 0.7, times: [0, 0.3, 1] }}
    />
  );
}

export default function PortalSocio() {
  const { ref, paso, activo } = useCiclo(DURACIONES, { final: 1, amount: 0.3 });
  const adentro = paso > 0;

  return (
    <div
      ref={ref}
      className={a.telefono}
      role="img"
      aria-label="Animación del portal del socio: entra con su código de socio, su número de conexión y su documento, ve cuánto debe y en qué se va cada peso, toca Pagar y queda al día."
    >
      <div className={a.telefonoPantalla}>
        <span className={a.telefonoCamara} />
        <div className={a.appBarra}>
          <span className={a.appLogo}>AM</span>
          <span className={a.appBarraTexto}>
            <small>{COOPE}</small>
            <b>{adentro ? "Hola, Rosa" : "Portal del socio"}</b>
          </span>
        </div>

        <div className={a.appCuerpo}>
          {activo && (
            <AnimatePresence mode="wait">
              {!adentro ? (
                <m.div
                  key="ingreso"
                  className={a.appVista}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <p className={a.appTitulo}>Entrá con tu factura</p>
                  <p className={a.appSub}>Sin usuario ni contraseña</p>
                  {DATOS.map(([rotulo, valor], i) => (
                    <div key={rotulo} className={a.campo}>
                      <span>{rotulo}</span>
                      <strong>
                        <Tipeo texto={valor} demora={0.45 + i * 0.9} />
                      </strong>
                    </div>
                  ))}
                  <div className={a.botonApp}>
                    Ingresar
                    <Toque demora={3.25} />
                  </div>
                </m.div>
              ) : (
                <m.div
                  key="inicio"
                  className={a.appVista}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <AnimatePresence mode="wait">
                    {paso < 3 ? (
                      <m.div
                        key="debe"
                        className={a.tarjetaDeuda}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.25 }}
                      >
                        <span className={a.rotulo}>Debés</span>
                        <strong className={a.monto}>{pesos(DEUDA)}</strong>
                        <span className={a.vence}>Factura de noviembre · vence el 10/12</span>
                        <span className={a.desgloseTitulo}>En qué se va cada peso</span>
                        <span className={a.barraDesglose}>
                          {DESGLOSE.map((d, i) => (
                            <m.span
                              key={d.nombre}
                              style={{ width: `${d.pct}%`, background: d.color }}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: 0.35 + i * 0.22, duration: 0.45 }}
                            />
                          ))}
                        </span>
                        <span className={a.leyendaDesglose}>
                          {DESGLOSE.map((d) => (
                            <span key={d.nombre}>
                              <i style={{ background: d.color }} /> {d.nombre} <b>{d.pct}&nbsp;%</b>
                            </span>
                          ))}
                        </span>
                        <span className={`${a.botonApp} ${paso === 2 ? a.botonProcesando : ""}`}>
                          {paso === 2 ? (
                            <>
                              <span className={a.spinner} /> Procesando el pago…
                            </>
                          ) : (
                            <>Pagar {pesos(DEUDA)}</>
                          )}
                          {paso === 1 && <Toque demora={3.05} />}
                        </span>
                      </m.div>
                    ) : (
                      <m.div
                        key="pagado"
                        className={a.tarjetaPagado}
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <m.span
                          className={a.checkGrande}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 380, damping: 15, delay: 0.15 }}
                        >
                          <LuCheck aria-hidden="true" />
                        </m.span>
                        <strong>Pagado</strong>
                        <span>{pesos(DEUDA)}</span>
                        <span className={a.alDia}>Ya estás al día</span>
                      </m.div>
                    )}
                  </AnimatePresence>

                  <div className={a.consumoMini}>
                    <span className={a.desgloseTitulo}>Tu consumo · kWh</span>
                    <span className={a.consumoBarras}>
                      {CONSUMO.map(([mes, kwh], i) => (
                        <span key={mes} className={a.consumoMes}>
                          <m.span
                            className={i === CONSUMO.length - 1 ? a.consumoBarraActual : a.consumoBarra}
                            style={{ height: `${Math.round((kwh / MAX_CONSUMO) * 46)}px` }}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                          />
                          <small>{mes}</small>
                        </span>
                      ))}
                    </span>
                  </div>
                </m.div>
              )}
            </AnimatePresence>
          )}
        </div>

        <div className={a.appNav} aria-hidden="true">
          <span className={a.appNavActivo}>
            <LuHouse />
            Inicio
          </span>
          <span>
            <LuReceiptText />
            Facturas
          </span>
          <span>
            <LuChartColumn />
            Consumo
          </span>
          <span>
            <LuMessageSquareWarning />
            Reclamos
          </span>
        </div>
      </div>
    </div>
  );
}
