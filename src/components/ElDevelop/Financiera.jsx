import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import { fmtArs, fmtUsd } from "./helpers";
import {
  ensureFin,
  NIVELES,
  nivelActual,
  JUEGOS,
  ABUELA,
  LEYES,
  cotizacion,
  cupoDisponible,
  patrimonioUsd,
  apuestasRestantes,
  montoApuesta,
  costoMiami,
  comprarUsd,
  comprarUnoAUno,
  venderUsd,
  dolarizar,
  apostar,
  apostarAbuela,
  devolverAbuela,
  escapadaMiami,
} from "./finanzas";
import { Icon, TAB_ICON, JUEGO_ICON, NIVEL_ICON, LEY_ICON } from "./icons";

const TABS = [
  { id: "cueva", label: "La Cueva" },
  { id: "casino", label: "Casino" },
  { id: "abuela", label: "La Abuela" },
  { id: "congreso", label: "Congreso" },
];

const FORT = [
  "Yo no manejo el rating, yo manejo un Rolls-Royce.",
  "CUT CUUUUUT.",
  "¡MAIAMEEE!",
  "Comandante, el champán está frío.",
];

// Ícono + texto en una línea (para botones y chips)
const IL = ({ icon, size = 16, children, color }) => (
  <span className={styles.inlineIcon}>
    <Icon name={icon} size={size} color={color} />
    {children}
  </span>
);

// Pequeño "suspenso" antes de resolver una apuesta, para que se sienta la timba
function useSpin() {
  const [spinning, setSpinning] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const spin = (id, fn) => {
    if (spinning) return;
    setSpinning(id);
    timer.current = setTimeout(() => {
      setSpinning(null);
      fn();
    }, 900);
  };
  return [spinning, spin];
}

export default function Financiera({ game, act }) {
  const [tab, setTab] = useState("cueva");
  const fin = game.fin || ensureFin(structuredClone(game));
  const nv = nivelActual(game);
  const nivel = NIVELES[nv];
  const cot = cotizacion({ ...game, fin });

  return (
    <div className={`${styles.card} ${styles.fin}`}>
      <div className={styles.finHead}>
        <div>
          <p className={styles.kicker}>Calle Florida · Atendemos de 10 a 15 (o cuando haya tiro)</p>
          <h3 className={styles.subtitle}>
            <IL icon="vault" size={20}>
              La Financiera
            </IL>
          </h3>
        </div>
        <div className={styles.finQuote}>
          <span>
            Compra <b>{fmtArs(cot.compra)}</b>
          </span>
          <span>
            Venta <b className={styles.orange}>{fmtArs(cot.venta)}</b>
          </span>
        </div>
      </div>

      {nv >= 3 ? (
        <VipCard game={game} fin={fin} act={act} />
      ) : (
        <div className={styles.finLevel}>
          <span className={styles.finLevelEmoji}>
            <Icon name={NIVEL_ICON[nv]} size={28} className={styles.green} />
          </span>
          <div>
            <strong>{nivel.name}</strong>
            <span className={styles.muted}>
              Patrimonio: {fmtUsd(patrimonioUsd(game))} · Próximo nivel: {NIVELES[nv + 1].name} ({fmtUsd(NIVELES[nv + 1].min)})
            </span>
          </div>
        </div>
      )}

      <div className={styles.finTabs} role="tablist">
        {TABS.map((t) => (
          <button
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            key={t.id}
            className={`${styles.finTab} ${tab === t.id ? styles.finTabOn : ""}`}
            onClick={() => setTab(t.id)}
          >
            <IL icon={TAB_ICON[t.id]}>{t.label}</IL>
            {t.id === "abuela" && fin.deudaAbuela > 0 && <span className={styles.finDot} />}
          </button>
        ))}
      </div>

      {tab === "cueva" && <Cueva game={game} fin={fin} cot={cot} act={act} />}
      {tab === "casino" && <Casino game={game} fin={fin} act={act} />}
      {tab === "abuela" && <Abuela game={game} fin={fin} act={act} />}
      {tab === "congreso" && <Congreso game={game} fin={fin} />}
    </div>
  );
}

function VipCard({ game, fin, act }) {
  const [quote] = useState(() => FORT[Math.floor(Math.random() * FORT.length)]);
  const nv = nivelActual(game);
  const nivel = NIVELES[nv];
  const costo = costoMiami(game);
  return (
    <div className={styles.vipCard}>
      <div className={styles.vipTop}>
        <span className={styles.vipChip} />
        <span className={styles.vipBrand}>{nv >= 4 ? "BLACK · E-COMMERCE" : "COMANDANTE · MIAMI"}</span>
      </div>
      <strong className={styles.vipLevel}>
        <IL icon={NIVEL_ICON[nv]} size={20}>
          {nivel.name}
        </IL>
      </strong>
      <span className={styles.vipQuote}>"{quote}"</span>
      <div className={styles.vipBottom}>
        <span>
          {game.name.toUpperCase()} · {fmtUsd(patrimonioUsd(game))}
        </span>
        <button
          type="button"
          className={styles.vipBtn}
          disabled={fin.miamiMes || game.ars < costo}
          onClick={() => act(escapadaMiami)}
          title="+20 Salud mental · +10 Energía · +4 Contactos. Una por mes."
        >
          <IL icon="treePalm" size={15}>
            {fin.miamiMes ? "Ya fuiste este mes" : `Escapada a Miami (${fmtArs(costo)})`}
          </IL>
        </button>
      </div>
    </div>
  );
}

function Cueva({ game, fin, cot, act }) {
  const cupo = cupoDisponible(game);
  const puede = (usd) => usd <= cupo && game.ars >= usd * cot.venta;
  return (
    <div className={styles.finPanel}>
      <div className={styles.finRules}>
        <span>
          <IL icon="receipt" size={14}>
            Recargo al dólar: {Math.round(fin.ley.impuesto * 100)}%
          </IL>
        </span>
        <span>
          <IL icon={fin.ley.cupo == null ? "lockOpen" : "lock"} size={14}>
            {fin.ley.cupo == null ? "Sin cepo" : `Cepo: te quedan ${fmtUsd(cupo)} este mes`}
          </IL>
        </span>
      </div>

      {fin.convertibilidad > 0 && fin.cupoMenem > 0 && (
        <div className={styles.menem}>
          <div>
            <strong>
              <IL icon="cassette" size={16}>
                CONVERTIBILIDAD 2.0 · UNO A UNO
              </IL>
            </strong>
            <span>
              Quedan {fin.convertibilidad} semana(s) y {fmtUsd(fin.cupoMenem)} a $1. Pizza con champán incluida.
            </span>
          </div>
          <button type="button" className={styles.menemBtn} disabled={game.ars < 1} onClick={() => act(comprarUnoAUno)}>
            <IL icon="pizza" size={16}>
              Comprar a $1
            </IL>
          </button>
        </div>
      )}

      <p className={styles.finLabel}>Comprar dólares</p>
      <div className={styles.finBtns}>
        {[100, 500, 1000].map((usd) => (
          <button type="button" key={usd} className={styles.btn} disabled={!puede(usd)} onClick={() => act(comprarUsd, usd)}>
            <IL icon="banknote">US${usd}</IL>
            <small>{fmtArs(usd * cot.venta)}</small>
          </button>
        ))}
      </div>

      <p className={styles.finLabel}>Vender dólares</p>
      <div className={styles.finBtns}>
        {[100, 500].map((usd) => (
          <button type="button" key={usd} className={styles.btn} disabled={game.usd < usd} onClick={() => act(venderUsd, usd)}>
            <IL icon="swap">US${usd}</IL>
            <small>{fmtArs(usd * cot.compra)}</small>
          </button>
        ))}
        <button type="button" className={`${styles.btn} ${styles.sawBtn}`} disabled={game.usd < 1} onClick={() => act(venderUsd, "all")}>
          <IL icon="axe" color="var(--red)">
            Liquidar todo
          </IL>
          <small>{fmtArs(game.usd * cot.compra)}</small>
        </button>
      </div>

      <button
        type="button"
        className={styles.lionBtn}
        disabled={!fin.ley.dolarizacion || game.ars < cot.venta}
        onClick={() => act(dolarizar)}
      >
        <IL icon="crown" size={18}>
          {fin.ley.dolarizacion ? "DOLARIZAR TODO · ¡VIVA LA LIBERTAD, CARAJO!" : "Dolarizar todo · necesita que el Congreso apruebe la Ley de Dolarización"}
        </IL>
      </button>
    </div>
  );
}

const FRACCIONES = [
  { f: 0.1, label: "10%" },
  { f: 0.25, label: "25%" },
  { f: 0.5, label: "50%" },
  { f: 1, label: "ALL-IN" },
];
const REELS = ["cherry", "banknote", "crown", "treePalm", "cassette", "ball", "cupSoda"];
const REEL_COLORS = ["#ef4444", "#22c55e", "#fcd34d", "#18c5c5", "#f0abfc", "#ffffff", "#f6950a"];

function Casino({ game, fin, act }) {
  const [fraccion, setFraccion] = useState(0.1);
  const [spinning, spin] = useSpin();
  const monto = montoApuesta(game, fraccion);
  const quedan = apuestasRestantes(game);
  return (
    <div className={styles.finPanel}>
      <div className={styles.finRules}>
        <span>
          <IL icon="ticket" size={14}>
            Fichas esta semana: {quedan}/3
          </IL>
        </span>
        <span>
          <IL icon="landmark" size={14}>
            Impuesto a la timba: {Math.round(fin.ley.comision * 100)}% de los premios
          </IL>
        </span>
      </div>

      <p className={styles.finLabel}>¿Cuánto de tus pesos ponés?</p>
      <div className={styles.finChips}>
        {FRACCIONES.map((x) => (
          <button
            type="button"
            key={x.f}
            className={`${styles.finChip} ${fraccion === x.f ? styles.finChipOn : ""} ${x.f === 1 ? styles.finAllIn : ""}`}
            onClick={() => setFraccion(x.f)}
          >
            {x.label}
          </button>
        ))}
        <strong className={styles.finMonto}>{fmtArs(monto)}</strong>
      </div>

      <div className={styles.casinoGrid}>
        {Object.entries(JUEGOS).map(([id, j]) => (
          <div key={id} className={`${styles.casinoCard} ${spinning === id ? styles.casinoSpin : ""}`}>
            <span className={styles.casinoEmoji}>{spinning === id ? <Reels /> : <Icon name={JUEGO_ICON[id]} size={34} className={styles.orange} />}</span>
            <strong>{j.name}</strong>
            <span className={styles.muted}>{j.desc}</span>
            <span className={styles.casinoOdds}>
              Paga x{j.mult} · {Math.round(j.p * 100)}% de chance
            </span>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnPrimary}`}
              disabled={!!spinning || quedan <= 0 || monto < 1000}
              onClick={() => spin(id, () => act(apostar, id, fraccion))}
            >
              {spinning === id ? "Girando…" : `Apostar ${fmtArs(monto)}`}
            </button>
          </div>
        ))}
      </div>
      <p className={styles.muted}>
        <IL icon="party" size={14}>
          Si perdés, hay un 5% de chance de que aparezca la Mano de Dios y te devuelva todo.
        </IL>{" "}
        Récord: {fin.ganadas} ganadas · {fin.perdidas} perdidas. La casa siempre gana: es plata del juego, en la vida real la timba
        no es un plan de retiro.
      </p>
    </div>
  );
}

// Rodillos de tragamonedas con íconos SVG
function Reels() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => x + 1), 90);
    return () => clearInterval(t);
  }, []);
  return (
    <span className={styles.reels}>
      {[0, 3, 5].map((o) => {
        const k = (i + o) % REELS.length;
        return <Icon key={o} name={REELS[k]} size={30} color={REEL_COLORS[k]} />;
      })}
    </span>
  );
}

function Abuela({ game, fin, act }) {
  const [seguro, setSeguro] = useState(false);
  const [spinning, spin] = useSpin();
  const quedan = apuestasRestantes(game);
  const puede = fin.abuela >= 1000 && fin.deudaAbuela === 0 && quedan > 0;
  return (
    <div className={styles.finPanel}>
      <div className={styles.abuela}>
        <span className={styles.abuelaEmoji}>
          <Icon name={fin.deudaAbuela > 0 ? "angry" : "coffee"} size={40} color={fin.deudaAbuela > 0 ? "var(--red)" : "#fcd34d"} />
        </span>
        <div>
          <strong>Los ahorros de la jubilación de la abuela</strong>
          <span className={styles.abuelaPot}>{fmtArs(fin.abuela)}</span>
          <span className={styles.muted}>
            Los guarda en una lata de galletitas. Todos los meses suma un poquito de lo que cobra.
          </span>
        </div>
      </div>

      {fin.deudaAbuela > 0 ? (
        <div className={styles.abuelaDebt}>
          <p>
            Le debés <b>{fmtArs(fin.deudaAbuela)}</b>. Mientras no se los devuelvas, te pregunta todas las semanas en el grupo
            de la familia (-2 Salud mental por semana).
          </p>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} disabled={game.ars <= 0} onClick={() => act(devolverAbuela)}>
            <IL icon="flower">Devolverle {fmtArs(Math.min(fin.deudaAbuela, Math.max(0, game.ars)))}</IL>
          </button>
        </div>
      ) : (
        <>
          <p className={styles.text}>
            Alto riesgo: paga x{ABUELA.mult} con {Math.round(ABUELA.p * 100)}% de chance. Si sale mal, te quedás debiéndole todo
            y con el peor castigo: la mirada de decepción del domingo.
          </p>
          <button
            type="button"
            className={`${styles.abuelaBtn} ${seguro ? styles.abuelaBtnArmed : ""} ${spinning ? styles.casinoSpin : ""}`}
            disabled={!puede || !!spinning}
            onClick={() => {
              if (!seguro) return setSeguro(true);
              setSeguro(false);
              spin("abuela", () => act(apostarAbuela));
            }}
          >
            <IL icon={seguro && !spinning ? "alert" : "dices"} size={18}>
              {spinning
                ? "Girando con la plata de la abuela…"
                : seguro
                ? `¿SEGURO? Es la jubilación de la abuela. Tocá de nuevo para apostar ${fmtArs(fin.abuela)}`
                : `Apostar la jubilación de la abuela (${fmtArs(fin.abuela)})`}
            </IL>
          </button>
          {quedan <= 0 && <p className={styles.muted}>Sin fichas esta semana. La abuela respira aliviada.</p>}
        </>
      )}
    </div>
  );
}

function Congreso({ game, fin }) {
  const proxima = 1 + 8 * (Math.floor((game.week - 1) / 8) + 1);
  const pendientes = Object.entries(LEYES).filter(([, l]) => l.posible(fin));
  return (
    <div className={styles.finPanel}>
      <div className={styles.boletin}>
        <p className={styles.boletinHead}>BOLETÍN OFICIAL · Reglas vigentes del juego</p>
        <ul>
          <li>Recargo a la compra de dólares: {Math.round(fin.ley.impuesto * 100)}%</li>
          <li>Cepo: {fin.ley.cupo == null ? "levantado" : `US$${fin.ley.cupo} por mes`}</li>
          <li>Impuesto a la timba: {Math.round(fin.ley.comision * 100)}%</li>
          <li>Dolarización: {fin.ley.dolarizacion ? "aprobada" : "no aprobada"}</li>
          <li>Convertibilidad: {fin.convertibilidad > 0 ? `vigente (${fin.convertibilidad} semanas)` : "no vigente"}</li>
        </ul>
      </div>
      <p className={styles.text}>
        <IL icon="landmark" size={16}>
          Próxima sesión de la Ley Ómnibus:
        </IL>{" "}
        <b>semana {proxima}</b> (en {proxima - game.week}). Te van a invitar a votar uno de estos proyectos; tus Contactos sirven
        para hacer lobby.
      </p>
      <div className={styles.proyectos}>
        {pendientes.map(([id, l]) => (
          <span key={id} className={`${styles.proyecto} ${l.buena ? styles.proyBueno : styles.proyMalo}`}>
            <IL icon={LEY_ICON[id] || (l.buena ? "thumbsUp" : "thumbsDown")} size={13}>
              {l.name}
            </IL>
          </span>
        ))}
      </div>
      {fin.leyesAprobadas.length > 0 && (
        <p className={styles.muted}>Últimas leyes aprobadas: {fin.leyesAprobadas.join(" · ")}</p>
      )}
    </div>
  );
}
