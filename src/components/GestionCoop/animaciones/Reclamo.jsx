import React from "react";
import { AnimatePresence, m } from "framer-motion";
import { LuCamera, LuCheck, LuDroplet, LuPowerOff } from "react-icons/lu";
import a from "./animaciones.module.css";
import { Toque } from "./PortalSocio";
import { COOPE, useCiclo } from "./util";

// En el celular del socio: le llega el aviso de un corte programado y hace un reclamo con foto.
const DURACIONES = [1900, 1800, 1900, 3200];

// La «foto» del reclamo: una pérdida de agua en la vereda, dibujada
function Foto() {
  return (
    <svg viewBox="0 0 120 80" preserveAspectRatio="xMidYMid slice" className={a.foto} aria-hidden="true">
      <rect width="120" height="80" fill="#7a8592" />
      <rect y="46" width="120" height="34" fill="#9aa3ad" />
      <path d="M0 46h120" stroke="#5f6873" strokeWidth="2" />
      <path d="M30 46v34M60 46v34M90 46v34" stroke="#87909b" strokeWidth="1.5" />
      <ellipse cx="62" cy="62" rx="34" ry="9" fill="#5aa6ff" opacity="0.75" />
      <ellipse cx="56" cy="60" rx="12" ry="3" fill="#cfe6ff" opacity="0.8" />
      <rect x="54" y="20" width="10" height="27" rx="2" fill="#3b4450" />
      <path d="M59 47c-3 5-3 8 0 9 3-1 3-4 0-9z" fill="#5aa6ff" />
    </svg>
  );
}

export default function Reclamo() {
  const { ref, paso, activo } = useCiclo(DURACIONES);

  return (
    <div
      ref={ref}
      className={a.pantallaSuelta}
      role="img"
      aria-label="Animación en el celular del socio: le llega el aviso de un corte programado y hace un reclamo por una pérdida de agua, con una foto. El reclamo queda enviado."
    >
      <div className={a.sueltaBarra}>
        <span>{COOPE}</span>
      </div>

      <div className={a.avisoHueco}>
        {activo && (
          <m.div
            key="aviso"
            className={a.aviso}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.45, ease: "easeOut" }}
          >
            <span className={a.avisoIcono}>
              <LuPowerOff aria-hidden="true" />
            </span>
            <span>
              <b>Corte programado de energía</b>
              <small>Viernes 4/12, de 8 a 12 h, en Las Lomas. Mantenimiento de la red.</small>
            </span>
          </m.div>
        )}
      </div>

      <div className={a.reclamo}>
        <b className={a.reclamoTitulo}>Nuevo reclamo</b>
        <span className={a.reclamoTipo}>
          <LuDroplet aria-hidden="true" /> Pérdida de agua en la vereda
        </span>
        <div className={a.fotoHueco}>
          {activo && paso >= 2 ? (
            <m.div
              key="foto"
              className={a.fotoMarco}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
            >
              <Foto />
              {paso === 2 && (
                <m.span
                  className={a.flash}
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </m.div>
          ) : (
            <span className={a.fotoVacia}>
              <LuCamera aria-hidden="true" /> Sacar una foto
              {activo && paso === 1 && <Toque demora={1.3} />}
            </span>
          )}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {activo && paso === 3 ? (
            <m.span
              key="enviado"
              className={a.enviado}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LuCheck aria-hidden="true" /> Reclamo N.º 0318 enviado. La cooperativa ya lo recibió.
            </m.span>
          ) : (
            <m.span key="enviar" className={a.botonApp} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              Enviar reclamo
              {activo && paso === 2 && <Toque demora={1.4} />}
            </m.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
