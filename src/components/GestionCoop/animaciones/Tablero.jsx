import React, { useRef } from "react";
import { m, useInView } from "framer-motion";
import { LuFileSpreadsheet } from "react-icons/lu";
import a from "./animaciones.module.css";
import { COOPE, pesos, useContador } from "./util";

// Tablero del mes de la cooperativa de ejemplo: los números suben y las barras crecen la primera vez que se ven.
// Cobrado va en un naranja un poco más oscuro que el de la marca: con el de la marca, sobre fondo oscuro, la
// barra naranja pesaba más que la azul (validado con el script de la skill de gráficos).
const FACTURADO = 58420300;
const COBRADO = 46153000;
const MESES = [
  ["jun", 49.8, 47.9],
  ["jul", 51.2, 48.8],
  ["ago", 54.6, 51.7],
  ["sep", 55.1, 51.0],
  ["oct", 56.9, 50.3],
  ["nov", 58.4, 46.2],
];
const TOPE = 60;
const AZUL = "#0b78fb";
const NARANJA = "#e07f0a";
const millones = (n) => `$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 1 })} M`;

export default function Tablero() {
  const ref = useRef(null);
  const visto = useInView(ref, { once: true, amount: 0.35 });
  const facturado = useContador(FACTURADO, visto);
  const cobrado = useContador(COBRADO, visto);
  const cobrabilidad = useContador(Math.round((COBRADO / FACTURADO) * 100), visto);
  const reclamos = useContador(6, visto, 900);

  return (
    <div ref={ref} className={a.tablero}>
      <div className={a.tableroCabeza}>
        <span>
          <b>Tablero</b>
          <small>{COOPE} · Noviembre de 2026</small>
        </span>
        <span className={a.excel}>
          <LuFileSpreadsheet aria-hidden="true" /> Excel
        </span>
      </div>

      <div className={a.kpis}>
        <div className={a.kpi}>
          <small>Facturado en noviembre</small>
          <b>{pesos(Math.round(facturado), 0)}</b>
          <span>1.187 facturas</span>
        </div>
        <div className={a.kpi}>
          <small>Cobrado de esas facturas</small>
          <b>{pesos(Math.round(cobrado), 0)}</b>
          <span>Falta cobrar {pesos(FACTURADO - COBRADO, 0)}</span>
        </div>
        <div className={a.kpi}>
          <small>Cobrabilidad</small>
          <b>{Math.round(cobrabilidad)}&nbsp;%</b>
          <span className={a.kpiBarra}>
            <m.span
              style={{ width: `${Math.round((COBRADO / FACTURADO) * 100)}%` }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: visto ? 1 : 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </span>
        </div>
        <div className={a.kpi}>
          <small>Reclamos abiertos</small>
          <b>{Math.round(reclamos)}</b>
          <span>2 urgentes</span>
        </div>
      </div>

      <div className={a.grafico}>
        <div className={a.graficoCabeza}>
          <b>Facturado y cobrado, mes a mes</b>
          <span className={a.leyenda}>
            <span>
              <i style={{ background: AZUL }} /> Facturado
            </span>
            <span>
              <i style={{ background: NARANJA }} /> Cobrado
            </span>
          </span>
        </div>
        <div className={a.barrasMeses} role="img" aria-label="Gráfico de barras de junio a noviembre: lo facturado sube de 49,8 a 58,4 millones y lo cobrado de esas facturas queda más abajo en los meses más nuevos.">
          {MESES.map(([mes, fac, cob], i) => (
            <div key={mes} className={a.mes} title={`${mes}: facturado ${millones(fac)} · cobrado ${millones(cob)}`}>
              <div className={a.mesBarras}>
                <m.span
                  style={{ height: `${(fac / TOPE) * 100}%`, background: AZUL }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: visto ? 1 : 0 }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                />
                <m.span
                  style={{ height: `${(cob / TOPE) * 100}%`, background: NARANJA }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: visto ? 1 : 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: "easeOut" }}
                />
              </div>
              <small className={i === MESES.length - 1 ? a.mesActual : undefined}>{mes}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
