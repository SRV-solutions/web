import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { LuCheck, LuCloud, LuGauge, LuSmartphone, LuWifi, LuWifiOff } from "react-icons/lu";
import a from "./animaciones.module.css";
import { Toque } from "./PortalSocio";
import { useCiclo } from "./util";

// El lecturista sin señal: carga la lectura, queda guardada en el teléfono y, cuando vuelve la señal, se envía sola.
const DURACIONES = [3000, 2400, 2400, 2600];
const LECTURA = "12.483";
// Lecturas guardadas en el teléfono en cada paso
const PENDIENTES = [2, 3, 3, 0];

function Estado({ paso }) {
  if (paso === 0) {
    return (
      <>
        <span className={a.estadoIcono}>
          <LuSmartphone aria-hidden="true" />
        </span>
        <span>
          <b>Sin señal desde hace 12 min</b>
          <small>Las lecturas se guardan en el teléfono</small>
        </span>
      </>
    );
  }
  if (paso === 1) {
    return (
      <>
        <m.span
          className={`${a.estadoIcono} ${a.estadoIconoNaranja}`}
          initial={{ scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
        >
          <LuCheck aria-hidden="true" />
        </m.span>
        <span>
          <b>Guardada en el teléfono</b>
          <small>Se envía sola cuando vuelva la señal</small>
        </span>
      </>
    );
  }
  const listo = paso === 3;
  return (
    <>
      <span className={a.nube}>
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle cx="24" cy="24" r="20" className={a.nubeFondo} />
          <m.circle
            cx="24"
            cy="24"
            r="20"
            className={a.nubeProgreso}
            initial={{ pathLength: listo ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: listo ? 0 : 1.9, ease: "easeInOut" }}
          />
        </svg>
        {listo ? (
          <m.span className={a.nubeCentro} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 420, damping: 14 }}>
            <LuCheck aria-hidden="true" />
          </m.span>
        ) : (
          <span className={a.nubeCentro}>
            <LuCloud aria-hidden="true" />
          </span>
        )}
      </span>
      <span>
        <b>{listo ? "3 lecturas enviadas" : "Volvió la señal"}</b>
        <small>{listo ? "Ya están en la oficina" : "Enviando 3 lecturas…"}</small>
      </span>
    </>
  );
}

export default function Lecturista() {
  const { ref, paso, activo } = useCiclo(DURACIONES, { final: 1 });
  const conSenal = paso >= 2;

  return (
    <div
      ref={ref}
      className={a.pantallaSuelta}
      role="img"
      aria-label="Animación del lecturista: sin señal carga la lectura de un medidor, queda guardada en el teléfono y, cuando vuelve la señal, se envía sola."
    >
      <div className={a.sueltaBarra}>
        <span>
          <LuGauge aria-hidden="true" /> Ruta 3 · Barrio Norte
        </span>
        <span className={conSenal ? a.pildoraVerde : a.pildoraNaranja}>
          {conSenal ? <LuWifi aria-hidden="true" /> : <LuWifiOff aria-hidden="true" />}
          {conSenal ? "Con señal" : "Sin señal"}
        </span>
      </div>

      <div className={a.medidor}>
        <div className={a.medidorCabeza}>
          <b>Medidor 0457</b>
          <small>Juan Pereyra · Los Álamos 1240</small>
        </div>
        <div className={a.fila}>
          <span>Lectura anterior</span>
          <span>12.238 kWh</span>
        </div>
        <div className={`${a.fila} ${a.filaLectura}`}>
          <span>Lectura actual</span>
          <span className={a.lecturaValor}>
            {activo &&
              (paso === 0 ? (
                [...LECTURA].map((c, i) => (
                  <m.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.16, duration: 0.01 }}>
                    {c}
                  </m.span>
                ))
              ) : (
                LECTURA
              ))}{" "}
            kWh
          </span>
        </div>
        <div className={a.fila}>
          <span>Consumo</span>
          {activo &&
            (paso === 0 ? (
              <m.span key="calculando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}>
                245 kWh
              </m.span>
            ) : (
              <span>245 kWh</span>
            ))}
        </div>
        <span className={a.botonApp}>
          Guardar lectura
          {activo && paso === 0 && <Toque demora={2.3} />}
        </span>
      </div>

      <div className={a.estado} aria-hidden="true">
        {activo && (
          <AnimatePresence mode="wait">
            <m.div
              key={paso < 2 ? `p${paso}` : "nube"}
              className={a.estadoFila}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Estado paso={paso} />
            </m.div>
          </AnimatePresence>
        )}
      </div>

      <div className={a.sueltaPie}>
        <span>Para enviar</span>
        <m.b key={PENDIENTES[paso]} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className={PENDIENTES[paso] ? a.contadorNaranja : a.contadorVerde}>
          {PENDIENTES[paso]}
        </m.b>
      </div>
    </div>
  );
}
