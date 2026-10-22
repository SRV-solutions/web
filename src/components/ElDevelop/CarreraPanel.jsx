// Pestaña "Carrera": mercado laboral, reputación, tu laburo, el historial y tu propia startup.
// Lee el estado sin mutarlo; las acciones van por act(fn, ...args), igual que La Financiera.
import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import cr from "./carrera.module.css";
import { Icon, IconText } from "./icons";
import { fmtArs, fmtUsd, entryLevel } from "./helpers";
import { LEVELS, BIG_TECH_REQ } from "./data";
import { livingCost } from "./engine";
import {
  defaultCarrera,
  migrarCarrera,
  TIPOS_EMPRESA,
  MERCADOS,
  mercadoMult,
  tipoJob,
  antiguedad,
  puedeEntrevistar,
  entrevistarAEscondidas,
  renunciar,
  nivelBigTechListo,
  requisitosFundar,
  fundarEmpresa,
  IDEAS,
  ideaAleatoria,
  ETAPAS,
  kpisEmpresa,
  focusOptionsEmpresa,
  puedeContratar,
  sueldoEmpleado,
  contratar,
  despedir,
  cerrarEmpresa,
  UMBRAL_COMPRA,
  ETAPA_COMPRA,
  retornoCierre,
} from "./carrera";

const SALTO = 24; // semanas: si te vas antes, cuenta como salto
const REP_BIG_TECH = 40; // lo que pide nivelBigTechListo

const TIPO_COLOR = {
  factory: "#9ca3af",
  consultora: "var(--blue)",
  fintech: "var(--green)",
  startup: "var(--orange)",
  corpo: "#38bdf8",
  remota: "#14b8a6",
  estado: "#eab308",
  unicornio: "var(--purple)",
  fundador: "#ec4899",
};
const TONO_MERCADO = { good: "var(--green)", muted: "var(--blue)", bad: "var(--red)" };
const MOTIVO_TONO = {
  despido: "bad",
  quiebra: "bad",
  exit: "good",
  renuncia: "warn",
  "retiro voluntario": "warn",
  "fundó su empresa": "purple",
};
const TAG = { blue: cr.tBlue, good: cr.tGood, bad: cr.tBad, warn: cr.tWarn, purple: cr.tPurple };
const KPI_TONO = { bad: cr.kBad, warn: cr.kWarn, good: cr.kGood };
const TIERS = [
  { mult: 1, label: "Lo justo", icon: "piggyBank" },
  { mult: 2, label: "Con aire", icon: "wallet" },
  { mult: 4, label: "Con colchón", icon: "vault" },
];

// ---------- Formato (es-AR) ----------
const num = (v) => Math.round(Number(v) || 0).toLocaleString("es-AR");
const pct = (v) => `${Math.round((Number(v) || 0) * 100)}%`;
const por = (v) => `×${(Number(v) || 0).toLocaleString("es-AR", { maximumFractionDigits: 2 })}`;
const cap = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const semanas = (v) => `${num(v)} ${v === 1 ? "semana" : "semanas"}`;
const meses = (v) => `${(Number(v) || 0).toLocaleString("es-AR", { maximumFractionDigits: 1 })} ${v === 1 ? "mes" : "meses"}`;
const al100 = (v) => Math.max(0, Math.min(100, Math.round(Number(v) || 0)));

function sueldoTxt(job) {
  const partes = [];
  if (job.salaryArs > 0) partes.push(fmtArs(job.salaryArs));
  if (job.salaryUsd > 0) partes.push(fmtUsd(job.salaryUsd));
  return partes.length ? partes.join(" + ") : fmtArs(0);
}

// ---------- Estado de solo lectura ----------
// Partida vieja o historial desfasado (un evento cambió el laburo y todavía no pasó la semana):
// se migra una copia, nunca el estado original.
function vista(game) {
  const c = game.carrera;
  const hist = c && Array.isArray(c.historial) ? c.historial : null;
  const abierta = (fundador) => (hist ? hist.find((h) => h && h.hasta === null && (h.tipo === "fundador") === fundador) : null);
  const h = abierta(false);
  const e = game.empresa;
  const desfasado =
    !hist ||
    e === undefined ||
    (!!e && (!Array.isArray(e.rondas) || !Array.isArray(e.hitos))) ||
    (game.job ? !game.job.tipo || !h || h.company !== game.job.company : !!h) ||
    !!e !== !!abierta(true);
  if (!desfasado) return game;
  try {
    return migrarCarrera(structuredClone(game));
  } catch {
    return { ...game, carrera: defaultCarrera(), empresa: e || null };
  }
}

// KPIs de una empresa recién fundada con ese capital (para elegir cuánto poner)
function proyeccion(view, capital) {
  try {
    return kpisEmpresa({
      ...view,
      empresa: {
        capital,
        empleados: 0,
        mrr: 0,
        usuarios: 0,
        pagos: 0,
        producto: 10,
        traccion: 0,
        equity: 100,
        rondas: [],
        hitos: [],
        valuacionUsd: 0,
      },
    });
  } catch {
    return null;
  }
}

// Si la propuesta de compra quedó esperando en la cola, la trae a la pantalla para decidir ahora
function responderPropuesta(state) {
  const e = state.empresa;
  if (!e || !e.ofertaCompra || state.pending || state.result || state.gameOver || state.victory) return state;
  const s = structuredClone(state);
  s.toast = null;
  s.queue = (s.queue || []).filter((id) => id !== "oferta_compra");
  s.pending = { kind: "event", id: "oferta_compra" };
  return s;
}

// Doble toque para lo que no tiene vuelta atrás; se desarma solo a los 5 segundos
function useConfirm(ms = 5000) {
  const [armado, setArmado] = useState(false);
  useEffect(() => {
    if (!armado) return undefined;
    const t = setTimeout(() => setArmado(false), ms);
    return () => clearTimeout(t);
  }, [armado, ms]);
  const confirmar = (fn) => {
    if (!armado) {
      setArmado(true);
      return;
    }
    setArmado(false);
    fn();
  };
  return [armado, confirmar];
}

// ---------- Piezas ----------
function Meter({ value, color = "var(--blue)", marks = [], label, small = false }) {
  const v = al100(value);
  return (
    <div
      className={`${cr.meter} ${small ? cr.meterSm : ""}`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
    >
      <span className={cr.meterFill} style={{ width: `${v}%`, background: color }} />
      {marks.map((m) => (
        <span key={m} className={cr.mark} style={{ left: `${m}%` }} />
      ))}
    </div>
  );
}

function Kpi({ icon, label, value, sub, bar, barColor, tone }) {
  return (
    <div className={`${cr.kpi} ${KPI_TONO[tone] || ""}`}>
      <span className={cr.kpiLabel}>
        <Icon name={icon} size={13} />
        {label}
      </span>
      <strong className={cr.kpiValue}>{value}</strong>
      {bar != null && <Meter value={bar} color={barColor} label={label} small />}
      {sub && <span className={cr.kpiSub}>{sub}</span>}
    </div>
  );
}

function TipoBadge({ tipo }) {
  return (
    <span className={cr.badge} style={{ "--c": TIPO_COLOR[tipo.id] || "var(--blue)" }}>
      <Icon name={tipo.icon} size={15} />
      {tipo.nombre}
    </span>
  );
}

function Prestigio({ n }) {
  return (
    <span className={cr.stars} role="img" aria-label={`${n} de 3`}>
      {[0, 1, 2].map((i) => (
        <Icon key={i} name="star" size={12} color={i < n ? "var(--orange)" : "#4b5563"} />
      ))}
    </span>
  );
}

// Cómo te trata ese tipo de empresa en una semana de Laburo
function Ritmo({ tipo }) {
  const items = [
    { id: "xp", label: "XP", v: tipo.xpMult, bueno: tipo.xpMult > 1, icon: "sparkles" },
    { id: "mental", label: "Estrés", v: tipo.mentalMult, bueno: tipo.mentalMult < 1, icon: "heartPulse" },
    { id: "energy", label: "Cansancio", v: tipo.energyMult, bueno: tipo.energyMult < 1, icon: "zap" },
  ];
  return (
    <div className={cr.badges}>
      {items.map((i) => (
        <span
          key={i.id}
          className={cr.badge}
          style={{ "--c": i.v === 1 ? "#9ca3af" : i.bueno ? "var(--green)" : "var(--red)" }}
        >
          <Icon name={i.icon} size={14} />
          {i.label} {por(i.v)}
        </span>
      ))}
      <span className={cr.badge} style={{ "--c": "var(--orange)" }}>
        Prestigio
        <Prestigio n={tipo.prestigio} />
      </span>
    </div>
  );
}

function Bloqueado() {
  return <p className={cr.small}>Resolvé lo que tenés en pantalla y volvé.</p>;
}

// ---------- (1) Encabezado: mercado, reputación, saltos ----------
function Encabezado({ view, c }) {
  const m = MERCADOS[c.mercado] || MERCADOS.normal;
  const tono = TONO_MERCADO[m.tone] || "var(--blue)";
  const rep = al100(c.reputacion);
  const uni = TIPOS_EMPRESA.unicornio;
  const efectos = view.empresa
    ? [
        ["Inversión", mercadoMult(view, "inversion")],
        ["Ventas", mercadoMult(view, "ventas")],
      ]
    : [
        ["Ofertas", mercadoMult(view, "ofertas")],
        ["Despidos", mercadoMult(view, "despidos")],
        ["Sueldos", mercadoMult(view, "sueldo")],
      ];
  const saltos = Math.max(0, Math.round(c.saltos || 0));
  const ofertas = Math.max(0, Math.round(c.ofertasRecibidas || 0));
  const quiebras = Math.max(0, Math.round(c.quiebras || 0));
  const semMercado = Math.max(0, Math.round(c.mercadoSemanas || 0));
  return (
    <section className={`${cr.card} ${cr.strip}`} style={{ "--accent": tono }}>
      <p className={styles.kicker}>Tu LinkedIn, pero sin filtro</p>
      <h3 className={cr.h}>
        <Icon name="milestone" size={20} className={styles.orange} />
        Carrera
      </h3>

      <div className={cr.cols}>
        <div>
          <span className={cr.badge} style={{ "--c": tono }}>
            <Icon name={m.icon} size={16} />
            {m.nombre}
          </span>
          <p className={cr.note}>
            {m.desc}
            {semMercado > 0 ? ` Lleva ${semanas(semMercado)}.` : ""}
          </p>
          <p className={`${cr.small} ${cr.mono}`}>{efectos.map(([k, v]) => `${k} ${por(v)}`).join(" · ")}</p>
        </div>

        <div>
          <div className={cr.repHead}>
            <span className={cr.il}>
              <Icon name="star" size={16} className={styles.orange} />
              Reputación
            </span>
            <b>{rep}/100</b>
          </div>
          <Meter value={rep} color="var(--orange)" marks={[uni.repMin, REP_BIG_TECH]} label="Reputación" />
          <p className={cr.small}>
            {uni.repMin}+ abre Unicornios ({LEVELS[uni.nivelMin]}) · {REP_BIG_TECH}+ pide Big Tech. Sube con ascensos,
            antigüedad y logros; baja con saltos y quiebras.
          </p>
          <div className={cr.badges}>
            <span className={cr.badge} style={{ "--c": saltos >= 3 ? "var(--red)" : "#9ca3af" }}>
              <Icon name="swap" size={14} />
              {saltos} {saltos === 1 ? "salto" : "saltos"}
            </span>
            <span className={cr.badge} style={{ "--c": "var(--blue)" }}>
              <Icon name="mailOpen" size={14} />
              {num(ofertas)} {ofertas === 1 ? "oferta recibida" : "ofertas recibidas"}
            </span>
            {c.exFundador && (
              <span className={cr.badge} style={{ "--c": TIPO_COLOR.fundador }}>
                <Icon name="rocket" size={14} />
                Ex fundador{quiebras > 0 ? ` · ${quiebras} ${quiebras === 1 ? "quiebra" : "quiebras"}` : ""}
              </span>
            )}
          </div>
          {saltos > 0 && (
            <p className={`${cr.small} ${saltos >= 3 ? cr.badText : cr.warnText}`}>
              {saltos >= 3
                ? "Con 3 saltos o más, los recruiters sospechan: te escriben la mitad y las entrevistas salen peor."
                : `Irte antes de las ${SALTO} semanas suma un salto. Con 3, los recruiters empiezan a sospechar.`}
            </p>
          )}
        </div>
      </div>

      <BigTech view={view} />
    </section>
  );
}

function BigTech({ view }) {
  const bt = nivelBigTechListo(view);
  if (view.interview || view.phase === 4) {
    return (
      <p className={`${cr.small} ${cr.bigtech}`}>
        <b>Big Tech:</b> estás en pleno proceso. Que no se te corte el wifi en la entrevista.
      </p>
    );
  }
  const n = bt.faltan.length;
  return (
    <details className={cr.bigtech}>
      <summary className={cr.summary}>
        <Icon name="target" size={15} className={styles.blue} />
        <b>Camino a Big Tech</b>
        <span className={bt.ok ? cr.okText : cr.warnText}>
          {bt.ok ? "tu carrera ya le cierra" : `${n} ${n === 1 ? "cosa pendiente" : "cosas pendientes"}`}
        </span>
      </summary>
      {bt.ok ? (
        <p className={cr.small}>
          Tu carrera ya le cierra. El resto es técnico: ser {LEVELS[4]} con Lógica {BIG_TECH_REQ.logic}, Contactos{" "}
          {BIG_TECH_REQ.network} y XP {BIG_TECH_REQ.xp}.
        </p>
      ) : (
        <ul className={cr.checks}>
          {bt.faltan.map((f) => (
            <li key={f} className={cr.checkNo}>
              <Icon name="x" size={14} color="var(--red)" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}

// ---------- (2) Tu laburo ----------
function JobCard({ view, bloqueado, act }) {
  const [armado, confirmar] = useConfirm();
  const job = view.job;
  const t = tipoJob(view) || TIPOS_EMPRESA.consultora;
  const ant = antiguedad(view);
  const corto = ant < SALTO;
  const ent = puedeEntrevistar(view);
  const perks = Array.isArray(job.perks) ? job.perks.filter(Boolean) : [];
  return (
    <section className={cr.card}>
      <div className={cr.head}>
        <div className={cr.headText}>
          <p className={styles.kicker}>Laburo actual</p>
          <h3 className={cr.h}>
            <Icon name="briefcase" size={18} className={styles.blue} />
            <IconText text={job.company || "Empresa sin nombre"} />
          </h3>
        </div>
        <TipoBadge tipo={t} />
      </div>
      <p className={cr.note}>{t.desc}</p>

      <div className={cr.grid}>
        <Kpi icon="award" label="Puesto" value={LEVELS[view.level] || LEVELS[0]} sub={job.remote ? "100% remoto" : null} />
        <Kpi icon="banknote" label="Sueldo" value={sueldoTxt(job)} sub="por mes" />
        <Kpi
          icon="calendarClock"
          label="Antigüedad"
          value={semanas(ant)}
          sub={corto ? `Si te vas antes de las ${SALTO}, es salto (faltan ${semanas(SALTO - ant)})` : "Ya no cuenta como salto"}
          tone={corto ? "warn" : null}
        />
        <Kpi
          icon="shieldCheck"
          label="Estabilidad"
          value={pct(t.estabilidad)}
          bar={t.estabilidad * 100}
          barColor="var(--green)"
          sub="Más alta, menos chance de recorte"
        />
      </div>
      <Ritmo tipo={t} />

      {perks.length > 0 && (
        <>
          <p className={cr.label}>Perks</p>
          <div className={cr.badges}>
            {perks.map((p, i) => (
              <span key={`${i}-${p}`} className={cr.badge} style={{ "--c": "var(--purple)" }}>
                <Icon name="gift" size={14} />
                <IconText text={p} />
              </span>
            ))}
          </div>
        </>
      )}

      {bloqueado ? (
        <Bloqueado />
      ) : (
        <div className={cr.actions}>
          <div className={cr.cell}>
            <button
              type="button"
              className={`${styles.btn} ${cr.act}`}
              disabled={!ent.ok}
              onClick={() => act(entrevistarAEscondidas)}
            >
              <span className={cr.il}>
                <Icon name="eyeOff" size={16} />
                Entrevistar a escondidas
              </span>
              <small>-10 Energía · -3 Salud mental</small>
            </button>
            <p className={cr.small}>
              {ent.ok ? "Una vez por semana. La chance sube con Contactos y Lógica (y en crisis, ni lo intentes)." : ent.motivo}
            </p>
          </div>
          <div className={cr.cell}>
            <button
              type="button"
              className={`${styles.btn} ${cr.act} ${cr.actDanger} ${armado ? cr.armed : ""}`}
              onClick={() => confirmar(() => act(renunciar))}
            >
              <span className={cr.il}>
                <Icon name={armado ? "alert" : "doorOpen"} size={16} />
                {armado ? "¿Seguro? Tocá de nuevo" : "Renunciar"}
              </span>
              <small>{corto ? "Cuenta como salto: -2 reputación" : "+5 Salud mental y bonus para buscar"}</small>
            </button>
            <p className={cr.small}>
              {armado
                ? "Si no tocás de nuevo, en 5 segundos se te pasa."
                : "Te quedás sin sueldo hasta la próxima oferta. Tu vieja va a preguntar."}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

// ---------- (2b) Sin laburo ----------
function efectoOfertas(view) {
  const o = mercadoMult(view, "ofertas");
  const su = mercadoMult(view, "sueldo");
  const partes = [];
  if (o !== 1) partes.push(`las ofertas salen un ${Math.round(Math.abs(o - 1) * 100)}% ${o > 1 ? "más" : "menos"} seguido`);
  if (su !== 1) partes.push(`los sueldos vienen un ${Math.round(Math.abs(su - 1) * 100)}% más ${su > 1 ? "altos" : "bajos"}`);
  return partes.length ? `${cap(partes.join(" y "))}.` : "Ofertas y sueldos al ritmo de siempre.";
}

function OpenToWork({ view, c }) {
  const m = MERCADOS[c.mercado] || MERCADOS.normal;
  const nivel = entryLevel(view);
  const rep = Number(c.reputacion) || 0;
  const bonus = Math.max(0, Math.round(view.searchBonus || 0));
  const tipos = Object.values(TIPOS_EMPRESA).map((t) => ({ t, ok: t.nivelMin <= nivel && t.repMin <= rep }));
  const cerrados = tipos.filter((x) => !x.ok);
  return (
    <section className={cr.card}>
      <div className={cr.head}>
        <div className={cr.headText}>
          <p className={styles.kicker}>Sin laburo (por ahora)</p>
          <h3 className={cr.h}>
            <Icon name="search" size={18} className={styles.green} />
            Open to Work
          </h3>
        </div>
        {bonus > 0 && (
          <span className={cr.badge} style={{ "--c": "var(--green)" }}>
            <Icon name="trendingUp" size={14} />
            Bonus de búsqueda +{bonus}%
          </span>
        )}
      </div>
      {view.studyDone ? (
        <p className={cr.note}>
          Las ofertas llegan por dos lados: <b>Buscar laburo</b> (en Semana: mandás CVs y la chance sube con Contactos, Lógica y
          cada búsqueda que no sale) y <b>Networking</b> (en una meetup alguien te puede referir).
        </p>
      ) : (
        <p className={cr.note}>
          Primero terminá de estudiar: mientras tanto, changas. Cuando tengas el título (o el certificado), en Semana aparece{" "}
          <b>Buscar laburo</b> y el <b>Networking</b> empieza a traer ofertas.
        </p>
      )}
      <p className={cr.note}>
        <span className={cr.il}>
          <Icon name={m.icon} size={15} />
          <b>{m.nombre}:</b>
        </span>{" "}
        {efectoOfertas(view)}
      </p>
      {bonus > 0 && (
        <p className={cr.small}>El bonus suma chance y mejora el sueldo de la próxima oferta. Se gasta cuando te llega una.</p>
      )}

      <p className={cr.label}>Quién te puede llamar · ofertas de {LEVELS[nivel]}</p>
      <div className={cr.badges}>
        {tipos.map(({ t, ok }) => (
          <span
            key={t.id}
            className={`${cr.badge} ${ok ? "" : cr.locked}`}
            style={{ "--c": ok ? TIPO_COLOR[t.id] : "#6b7280" }}
            title={t.desc}
          >
            <Icon name={ok ? t.icon : "lock"} size={14} />
            {t.nombre}
          </span>
        ))}
      </div>
      {cerrados.length > 0 && (
        <p className={cr.small}>
          Con candado:{" "}
          {cerrados
            .map(({ t }) => `${t.nombre} (desde ${LEVELS[t.nivelMin]}${t.repMin ? ` y ${t.repMin} de reputación` : ""})`)
            .join(" · ")}
          .
        </p>
      )}
    </section>
  );
}

// ---------- (3) Historial ----------
function HistItem({ h, week }) {
  const fundador = h.tipo === "fundador";
  const t = TIPOS_EMPRESA[h.tipo];
  const abierta = h.hasta == null;
  const desde = Number(h.desde) || 0;
  const hasta = abierta ? week : Number(h.hasta) || desde;
  const dur = Math.max(0, hasta - desde);
  const tipoTxt = fundador ? "Tu empresa" : t ? t.nombre : "Laburo";
  const nivelTxt = fundador ? "Fundador" : LEVELS[h.nivel] || LEVELS[0];
  const motivo = h.motivo || "se fue";
  const tono = abierta ? "blue" : MOTIVO_TONO[motivo];
  return (
    <li className={`${cr.histItem} ${abierta ? cr.histNow : ""}`}>
      <span className={cr.histIcon} style={{ "--c": TIPO_COLOR[fundador ? "fundador" : h.tipo] || "var(--blue)" }}>
        <Icon name={fundador ? "rocket" : t ? t.icon : "briefcase"} size={16} />
      </span>
      <div className={cr.histBody}>
        <strong>
          <IconText text={h.company || "Empresa sin nombre"} />
        </strong>
        <span>
          {tipoTxt} · {nivelTxt} · {semanas(dur)} · S{desde}–{abierta ? "hoy" : `S${hasta}`}
        </span>
      </div>
      <span className={`${cr.tag} ${TAG[tono] || ""}`}>{abierta ? "Actual" : cap(motivo)}</span>
    </li>
  );
}

function Historial({ view, c }) {
  const hist = Array.isArray(c.historial) ? c.historial : [];
  const items = hist
    .map((h, i) => ({ h, i }))
    .filter(({ h }) => h && typeof h === "object")
    .reverse();
  const visibles = items.slice(0, 6);
  const resto = items.length - visibles.length;
  return (
    <section className={cr.card}>
      <div className={cr.head}>
        <div className={cr.headText}>
          <p className={styles.kicker}>Experiencia (la versión honesta)</p>
          <h3 className={cr.h}>
            <Icon name="calendarRange" size={18} className={styles.blue} />
            Historial
          </h3>
        </div>
        {items.length > 0 && (
          <span className={cr.count}>
            {items.length} {items.length === 1 ? "entrada" : "entradas"}
          </span>
        )}
      </div>
      {visibles.length === 0 ? (
        <p className={cr.note}>Todavía no laburaste en ningún lado. Tu LinkedIn dice “Estudiante en búsqueda de nuevos desafíos”.</p>
      ) : (
        <ul className={cr.hist}>
          {visibles.map(({ h, i }) => (
            <HistItem key={`h${i}`} h={h} week={view.week} />
          ))}
        </ul>
      )}
      {resto > 0 && <p className={cr.small}>Y {resto} más en el baúl de los recuerdos.</p>}
    </section>
  );
}

// ---------- (4) Fundar ----------
function FundarCard({ view, bloqueado, act }) {
  const [nombre, setNombre] = useState("");
  const [idea, setIdea] = useState(ideaAleatoria);
  const [sel, setSel] = useState(0);
  const [armado, confirmar] = useConfirm();
  const req = requisitosFundar(view);
  const tiers = TIERS.map((t) => ({ ...t, monto: req.capitalMin * t.mult }));
  const ultimo = tiers.reduce((acc, t, i) => (t.monto <= view.ars ? i : acc), -1);
  const idx = ultimo < 0 ? 0 : Math.min(sel, ultimo);
  const capital = tiers[idx].monto;
  const alcanza = capital <= view.ars;
  const puede = req.ok && alcanza;
  const checks = [
    { id: "nivel", ok: view.level >= 2, txt: `Ser ${LEVELS[2]} o más`, det: `hoy: ${LEVELS[view.level] || LEVELS[0]}` },
    { id: "plata", ok: view.ars >= req.capitalMin, txt: `Tener ${fmtArs(req.capitalMin)} de capital inicial`, det: `tenés ${fmtArs(view.ars)}` },
    { id: "red", ok: view.stats.network >= 20, txt: "20+ de Contactos: alguien te tiene que comprar", det: `tenés ${num(view.stats.network)}` },
  ];
  if (view.interview || view.phase === 4) checks.push({ id: "bigtech", ok: false, txt: "Terminar el proceso con Big Tech" });
  if (view.offer) checks.push({ id: "oferta", ok: false, txt: "Resolver la oferta de laburo que tenés en la mesa" });
  // Si carrera.js suma requisitos nuevos, se muestran tal cual
  const extra = !req.ok && checks.every((ch) => ch.ok) ? req.faltan : [];
  const proy = proyeccion(view, capital);
  const gastos = livingCost(view);
  const bolsillo = view.ars - capital;
  const mesesBolsillo = gastos > 0 ? Math.max(0, Math.floor(bolsillo / gastos)) : 0;
  const otraIdea = () =>
    setIdea((actual) => {
      const resto = IDEAS.filter((i) => i !== actual);
      return resto.length ? resto[Math.floor(Math.random() * resto.length)] : actual;
    });

  return (
    <section className={cr.card}>
      <div className={cr.head}>
        <div className={cr.headText}>
          <p className={styles.kicker}>Emprender en Argentina: deporte extremo</p>
          <h3 className={cr.h}>
            <Icon name="rocket" size={18} className={styles.orange} />
            Fundá tu propia empresa
          </h3>
        </div>
      </div>
      <p className={cr.note}>
        Ponés plata tuya, dejás el laburo y tu semana pasa a ser Vender, Producto, Inversores o Descansar. Si alguien te la
        compra, ganás la partida.
      </p>
      <ul className={cr.checks}>
        {checks.map((ch) => (
          <li key={ch.id} className={ch.ok ? cr.checkOk : cr.checkNo}>
            <Icon name={ch.ok ? "circleCheck" : "circleX"} size={16} color={ch.ok ? "var(--green)" : "var(--red)"} />
            <span>
              {ch.txt}
              {ch.det && <small> · {ch.det}</small>}
            </span>
          </li>
        ))}
        {extra.map((f) => (
          <li key={f} className={cr.checkNo}>
            <Icon name="circleX" size={16} color="var(--red)" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className={cr.form}>
        <label className={cr.field}>
          <span className={cr.fieldHead}>
            Nombre
            <span>{nombre.length}/24</span>
          </span>
          <input
            className={cr.input}
            type="text"
            maxLength={24}
            value={nombre}
            placeholder="Ej: MateOps"
            autoComplete="off"
            aria-label="Nombre de tu startup"
            onChange={(ev) => setNombre(ev.target.value)}
          />
        </label>
        <div className={cr.field}>
          <span className={cr.fieldHead}>La idea</span>
          <div className={cr.ideaRow}>
            <textarea
              className={cr.input}
              rows={2}
              maxLength={140}
              value={idea}
              aria-label="Idea de tu startup"
              onChange={(ev) => setIdea(ev.target.value)}
            />
            <button type="button" className={styles.btn} onClick={otraIdea}>
              <Icon name="dices" size={16} />
              Otra idea
            </button>
          </div>
        </div>
        <div className={cr.field}>
          <span className={cr.fieldHead}>Capital inicial</span>
          <div className={cr.tiers} role="group" aria-label="Capital inicial">
            {tiers.map((t, i) => {
              const ok = t.monto <= view.ars;
              const on = ok && i === idx;
              return (
                <button
                  key={t.mult}
                  type="button"
                  className={`${cr.tier} ${on ? cr.tierOn : ""}`}
                  aria-pressed={on}
                  disabled={!ok}
                  onClick={() => setSel(i)}
                >
                  <strong className={cr.il}>
                    <Icon name={t.icon} size={14} />
                    {t.label}
                  </strong>
                  <b>{fmtArs(t.monto)}</b>
                  <span>{ok ? `Te quedan ${fmtArs(view.ars - t.monto)}` : "No te alcanza"}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {alcanza && proy && (
        <p className={cr.small}>
          {Number.isFinite(proy.runwayMeses)
            ? `Con ${fmtArs(capital)}, la caja aguanta ≈ ${meses(proy.runwayMeses)} sin facturar`
            : `Con ${fmtArs(capital)}, la caja aguanta tranquila`}
          {capital >= 2 * sueldoEmpleado(view)
            ? " y te alcanza para contratar a alguien. "
            : " (para contratar necesitás dos sueldos en caja). "}
          {proy.sueldoFundador > 0
            ? `Con esa espalda te pagás ${fmtArs(proy.sueldoFundador)}/mes.`
            : "Vos no cobrás sueldo hasta la primera ronda (o hasta facturar en serio)."}
        </p>
      )}
      {alcanza && (
        <p className={`${cr.small} ${mesesBolsillo < 3 ? cr.warnText : ""}`}>
          Tu bolsillo queda en {fmtArs(bolsillo)} con gastos de ≈ {fmtArs(gastos)}/mes (
          {mesesBolsillo >= 1 ? `alcanza para ${meses(mesesBolsillo)}` : "no llega ni a un mes"}). Si quedás muy en rojo, te
          embargan hasta el mate.
        </p>
      )}
      {view.job && (
        <p className={cr.small}>
          Al fundar renunciás a <IconText text={view.job.company || "tu laburo"} /> (y a su sueldo). No cuenta como salto.
        </p>
      )}

      {bloqueado ? (
        <Bloqueado />
      ) : (
        <div className={cr.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnPrimary} ${cr.act} ${armado ? cr.armedGo : ""}`}
            disabled={!puede}
            onClick={() => confirmar(() => act(fundarEmpresa, { nombre, idea, capital }))}
          >
            <span className={cr.il}>
              <Icon name={armado ? "alert" : "rocket"} size={16} />
              {armado ? "¿Seguro? Tocá de nuevo para fundar" : "Fundar la empresa"}
            </span>
            <small>
              {!req.ok
                ? "Primero cumplí los requisitos"
                : armado
                ? `Ponés ${fmtArs(capital)}${view.job ? " y dejás tu laburo" : ""}`
                : `Capital: ${fmtArs(capital)}`}
            </small>
          </button>
        </div>
      )}
    </section>
  );
}

// ---------- (5) Tu startup ----------
function hypeTxt(hype) {
  const h = Number(hype) || 1;
  if (h > 1.05) return `Hype ${por(Math.round(h * 100) / 100)}: el rumor infla todo`;
  if (h < 0.95) return `Hype ${por(Math.round(h * 100) / 100)}: los fondos están fríos`;
  return "Según facturación, producto y usuarios";
}

function EmpresaCard({ view, bloqueado, act }) {
  const [armado, confirmar] = useConfirm();
  const e = view.empresa;
  const k = kpisEmpresa(view);
  if (!k) return null;
  const cont = puedeContratar(view);
  const inv = focusOptionsEmpresa(view).find((o) => o.id === "inversores");
  const gastos = livingCost(view);
  const vuelve = retornoCierre(view);
  const oferta = e.ofertaCompra;
  const payout = oferta ? Math.round(((oferta.montoUsd || 0) * (e.equity || 0)) / 100) : 0;
  const runwayOk = Number.isFinite(k.runwayMeses);
  const rondas = Array.isArray(e.rondas) ? e.rondas : [];
  const hitos = Array.isArray(e.hitos) ? e.hitos : [];
  const proxima = ETAPAS[k.etapaIdx + 1];
  const empleados = Math.max(0, Math.round(e.empleados || 0));
  const bugs = Math.max(0, Math.round(e.bugs || 0));
  const sinSueldo = !(k.sueldoFundador > 0);
  let runwayTono = null;
  if (!runwayOk) runwayTono = "good";
  else if (k.runwayMeses < 3) runwayTono = "bad";
  else if (k.runwayMeses < 6) runwayTono = "warn";

  return (
    <section className={`${cr.card} ${cr.startup}`}>
      <div className={cr.head}>
        <div className={cr.headText}>
          <p className={styles.kicker}>Tu startup · fundada en la semana {e.semana}</p>
          <h3 className={cr.h}>
            <Icon name="rocket" size={18} color={TIPO_COLOR.fundador} />
            <IconText text={e.nombre || "Startup sin nombre"} />
          </h3>
        </div>
        <span className={cr.badge} style={{ "--c": "var(--orange)" }}>
          <Icon name="trendingUp" size={14} />
          {k.etapa}
        </span>
      </div>
      {e.idea && (
        <p className={cr.idea}>
          “<IconText text={e.idea} />”
        </p>
      )}
      <div
        className={cr.stages}
        style={{ gridTemplateColumns: `repeat(${ETAPAS.length}, minmax(0, 1fr))` }}
        role="img"
        aria-label={`Etapa ${k.etapaIdx + 1} de ${ETAPAS.length}: ${k.etapa}`}
      >
        {ETAPAS.map((et, i) => (
          <span
            key={et}
            title={et}
            className={`${cr.stage} ${i < k.etapaIdx ? cr.stageDone : ""} ${i === k.etapaIdx ? cr.stageNow : ""}`}
          />
        ))}
      </div>
      <p className={cr.small}>
        Etapa {k.etapaIdx + 1} de {ETAPAS.length}
        {proxima ? `: la próxima es ${proxima}.` : ": más arriba no hay nada."}
        {k.compradores
          ? " Ya estás en el radar: cualquier mes puede llegar una oferta de compra."
          : ` Los compradores aparecen desde ${ETAPAS[ETAPA_COMPRA]} y con una valuación de ${fmtUsd(UMBRAL_COMPRA)}.`}
      </p>

      {oferta && (
        <div className={cr.exit} role="status">
          <Icon name="trophy" size={24} />
          <div>
            <strong>
              <IconText text={`${cap(oferta.comprador || "Alguien")} quiere comprar ${e.nombre}`} />
            </strong>
            <span>
              Ofrece {fmtUsd(oferta.montoUsd || 0)}: con tu {num(e.equity)}% te llevás {fmtUsd(payout)}. Si vendés, ganás la
              partida.
            </span>
          </div>
          {!bloqueado && (
            <button type="button" className={cr.exitBtn} onClick={() => act(responderPropuesta)}>
              <Icon name="handshake" size={16} />
              Responder
            </button>
          )}
        </div>
      )}

      <div className={cr.grid3}>
        <Kpi
          icon="vault"
          label="Caja"
          value={fmtArs(e.capital || 0)}
          sub={`Quemás ${fmtArs(k.burnMensual)}/mes`}
          tone={e.capital < 0 ? "bad" : null}
        />
        <Kpi
          icon="coins"
          label="MRR"
          value={fmtArs(k.ingresoMensual)}
          sub={`≈ ${fmtUsd(k.mrrUsd)} por mes`}
          tone={k.ingresoMensual > 0 ? "good" : null}
        />
        <Kpi
          icon="hourglass"
          label="Runway"
          value={runwayOk ? meses(k.runwayMeses) : "Rentable"}
          sub={
            !runwayOk
              ? "Entra más de lo que sale"
              : k.runwayMeses < 3
              ? "Se acaba la caja: vendé o levantá plata"
              : "Hasta quedarte sin caja"
          }
          tone={runwayTono}
        />
        <Kpi icon="users" label="Usuarios" value={num(e.usuarios)} sub={`${num(e.pagos)} pagan`} />
        <Kpi
          icon="package"
          label="Producto"
          value={`${al100(e.producto)}%`}
          bar={e.producto}
          barColor="var(--purple)"
          sub={bugs > 5 ? `${bugs} bugs: se te va gente` : `${bugs} ${bugs === 1 ? "bug" : "bugs"}`}
          tone={bugs > 5 ? "warn" : null}
        />
        <Kpi
          icon="trendingUp"
          label="Tracción"
          value={`${al100(e.traccion)}%`}
          bar={e.traccion}
          barColor="var(--blue)"
          sub="Crecimiento mes a mes"
        />
        <Kpi
          icon="hardHat"
          label="Equipo"
          value={empleados > 0 ? `${empleados} ${empleados === 1 ? "persona" : "personas"}` : "Solo vos"}
          bar={e.moral}
          barColor="var(--green)"
          sub={`Moral ${al100(e.moral)}/100`}
          tone={empleados > 0 && e.moral < 30 ? "warn" : null}
        />
        <Kpi
          icon="chartPie"
          label="Tu equity"
          value={`${num(k.equityPct)}%`}
          bar={k.equityPct}
          barColor="var(--orange)"
          sub="Lo que todavía es tuyo"
        />
        <Kpi icon="dollar" label="Valuación" value={fmtUsd(k.valuacionUsd)} sub={hypeTxt(e.hype)} />
      </div>

      <p className={`${cr.small} ${sinSueldo && view.ars < gastos * 2 ? cr.badText : ""}`}>
        {sinSueldo
          ? `No te pagás sueldo: vivís de tus ahorros (${fmtArs(view.ars)}) y gastás ≈ ${fmtArs(gastos)}/mes. Si quedás muy en rojo, te embargan.`
          : `Te pagás ${fmtArs(k.sueldoFundador)}/mes de la caja (cuando alcanza).`}
      </p>

      <p className={cr.label}>Rondas de inversión</p>
      {rondas.length > 0 ? (
        <ul className={cr.rondas}>
          {rondas.map((r, i) => (
            <li key={`${i}-${r.semana}`}>
              <Icon name="handCoins" size={16} />
              <div>
                <b>
                  {cap(r.nombre || "ronda")} · {fmtUsd(r.montoUsd || 0)} por el {num(r.equityCedida)}%
                </b>
                <span>
                  <IconText
                    text={`${cap(r.inversor || "un inversor")} · valuación ${fmtUsd(r.valuacionUsd || 0)} · semana ${r.semana}`}
                  />
                </span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className={cr.small}>Ninguna todavía. Los fondos te miran de reojo y te piden “más tracción”.</p>
      )}
      {inv && (
        <p className={cr.small}>
          <b>Inversores:</b> {inv.desc}
        </p>
      )}

      {hitos.length > 0 && (
        <>
          <p className={cr.label}>Hitos</p>
          <div className={cr.badges}>
            {hitos.map((h) => (
              <span key={h} className={cr.badge} style={{ "--c": "var(--orange)" }}>
                <Icon name="trophy" size={14} />
                <IconText text={h} />
              </span>
            ))}
          </div>
        </>
      )}

      <p className={cr.hint}>
        <Icon name="calendar" size={16} />
        Tu semana ahora es: Vender, Producto, Inversores o Descansar.
      </p>
      {bloqueado ? (
        <Bloqueado />
      ) : (
        <div className={cr.actions}>
          <div className={cr.cell}>
            <button type="button" className={`${styles.btn} ${cr.act}`} disabled={!cont.ok} onClick={() => act(contratar)}>
              <span className={cr.il}>
                <Icon name="handshake" size={16} />
                Contratar
              </span>
              <small>{fmtArs(cont.costo)}/mes</small>
            </button>
            {!cont.ok && cont.motivo && <p className={cr.small}>{cont.motivo}</p>}
          </div>
          <div className={cr.cell}>
            <button type="button" className={`${styles.btn} ${cr.act}`} disabled={empleados <= 0} onClick={() => act(despedir)}>
              <span className={cr.il}>
                <Icon name="axe" size={16} />
                Despedir
              </span>
              <small>Indemnización {fmtArs(k.sueldoEmpleado)}</small>
            </button>
            {empleados <= 0 && <p className={cr.small}>No hay a quién: el equipo sos vos.</p>}
          </div>
          <div className={cr.cell}>
            <button
              type="button"
              className={`${styles.btn} ${cr.act} ${cr.actDanger} ${armado ? cr.armed : ""}`}
              onClick={() => confirmar(() => act(cerrarEmpresa))}
            >
              <span className={cr.il}>
                <Icon name={armado ? "alert" : "lock"} size={16} />
                {armado ? "¿Seguro? Tocá de nuevo" : "Cerrar la empresa"}
              </span>
              <small>
                {(e.capital || 0) < 0
                  ? "Caja en rojo: cerrar ahora es quebrar"
                  : vuelve > 0
                  ? `Te llevás ${fmtArs(vuelve)}`
                  : (e.rondas || []).length
                  ? "La caja es de los inversores"
                  : "La caja está vacía"}
              </small>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ---------- Panel ----------
export default function CarreraPanel({ game, act }) {
  if (!game) return null;
  const view = vista(game);
  const c = { ...defaultCarrera(), ...(view.carrera || {}) };
  const bloqueado = !!(game.pending || game.result || game.gameOver || game.victory);
  return (
    <div className={cr.wrap}>
      <Encabezado view={view} c={c} />
      {view.empresa && <EmpresaCard view={view} bloqueado={bloqueado} act={act} />}
      {view.job && <JobCard view={view} bloqueado={bloqueado} act={act} />}
      {!view.job && !view.empresa && <OpenToWork view={view} c={c} />}
      <Historial view={view} c={c} />
      {!view.empresa && <FundarCard view={view} bloqueado={bloqueado} act={act} />}
    </div>
  );
}
