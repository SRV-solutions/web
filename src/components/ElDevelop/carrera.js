// "Carrera": tipos de empresa, saltos de laburo, mercado laboral, reputación y tu propia startup.
// Todas las acciones reciben el estado y devuelven uno nuevo (misma receta que finanzas.js).
// Las funciones de abajo nunca se llaman a nivel de módulo (evita problemas de imports circulares).
import { fx, price, chance, pick, rand, randInt, shuffle, clamp, fmtArs, fmtUsd, updatePhase, roleMinigame } from "./helpers";
import { LEVELS, SALARY_ARS, SALARY_USD, PROMOTIONS } from "./data";
import { ensureFin } from "./finanzas";

// ---------- Estado ----------
export function defaultCarrera() {
  return {
    mercado: "normal", // "boom" | "normal" | "crisis"
    mercadoSemanas: 0, // semanas que lleva el mercado en ese estado
    historial: [], // [{ company, tipo, desde, hasta, nivel, motivo }] (tipo "fundador" para tus empresas)
    saltos: 0, // laburos que dejaste con menos de 24 semanas de antigüedad
    reputacion: 10, // 0-100
    entrevistaSemana: 0, // semana en la que usaste "entrevistar a escondidas" por última vez
    ofertasRecibidas: 0,
    exFundador: false,
    quiebras: 0,
    vistos: {}, // { eventoId: semana } para que los eventos de carrera no se repitan enseguida
  };
}

export const ensureCarrera = (s) => s.carrera || (s.carrera = defaultCarrera());

// ---------- Tipos de empresa ----------
// salaryMult: sobre SALARY_ARS · usd: cobra SALARY_USD · xpMult/mentalMult/energyMult: multiplican la semana de Laburo
// estabilidad: chance de NO entrar en un recorte · prestigio (0-3): ayuda para la Big Tech
// nivelMin/repMin: para que te ofrezcan ese tipo · peso: probabilidad relativa según el mercado
export const TIPOS_EMPRESA = {
  factory: {
    id: "factory",
    nombre: "Software factory",
    desc: "Proyectos en PHP de 2009 y frutita los lunes. Nadie te apura porque nadie te mira.",
    icon: "cog",
    salaryMult: 0.9,
    usd: false,
    xpMult: 0.8,
    mentalMult: 0.9,
    energyMult: 1,
    estabilidad: 0.6,
    prestigio: 0,
    nivelMin: 1,
    repMin: 0,
    peso: { normal: 3, boom: 2, crisis: 5 },
    perks: ["Frutita los lunes", "Horario flexible (de 9 a 18, flexible)", "Buen clima laboral (dicen)", "Capacitación en un Excel de 2014"],
    empresas: [
      "Software Factory 'Código Pampa'",
      "Fábrica de Software 'Bits del Sur'",
      "Factory 'Nerdería SRL'",
      "Software Factory 'Pampa Dev'",
      "CodeFactory 'Litoral Systems'",
      "Fábrica 'El Galpón de los Devs'",
      "Software Factory 'Sistemas Integrales Hnos. Pérez'",
    ],
    pitches: [
      "Somos como una familia (una familia que cobra el 10).",
      "Tenemos proyectos muy desafiantes: migrar un sistema de 2003 a otro de 2009.",
      "Buscamos gente con ganas de crecer (el sueldo, no).",
    ],
  },
  consultora: {
    id: "consultora",
    nombre: "Consultora",
    desc: "Clientes rotativos, bench y crédito de taxi. Cada tres meses, un sistema nuevo para odiar.",
    icon: "briefcase",
    salaryMult: 1,
    usd: false,
    xpMult: 1,
    mentalMult: 1,
    energyMult: 1.05,
    estabilidad: 0.55,
    prestigio: 1,
    nivelMin: 1,
    repMin: 0,
    peso: { normal: 3, boom: 2, crisis: 4 },
    perks: ["Clientes rotativos: nunca te aburrís (ni descansás)", "Bench: a veces te pagan por existir", "Crédito de taxi (si hay)", "Notebook con sticker de la consultora"],
    empresas: [
      "Consultora Sinergia Soluciones",
      "Consultora Tango Systems",
      "Agencia 'Pixel & Asado'",
      "Consultora 'Alianza Digital'",
      "Consultora 'Cuatro Vientos IT'",
      "Consultora 'Globalizando S.A.'",
      "Agencia 'Click & Choripán'",
    ],
    pitches: [
      "Vas a rotar por tres clientes en un año. Dos son bancos, el otro es peor.",
      "Tenemos un cliente en Chile, otro en Uruguay y uno que no paga.",
      "La consultora crece y vos crecés con ella (en reuniones).",
    ],
  },
  fintech: {
    id: "fintech",
    nombre: "Fintech",
    desc: "Pagan bien y lo sabés porque te lo recuerdan cada vez que se cae el sistema de pagos.",
    icon: "wallet",
    salaryMult: 1.25,
    usd: false,
    xpMult: 1.15,
    mentalMult: 1.3,
    energyMult: 1.1,
    estabilidad: 0.5,
    prestigio: 2,
    nivelMin: 2,
    repMin: 0,
    peso: { normal: 2, boom: 3, crisis: 1 },
    perks: ["Sueldo arriba del mercado", "Bono trimestral (si no se cae nada)", "On-call: el dinero no duerme", "Tarjeta de la empresa con cashback"],
    empresas: [
      "Fintech 'Billetera Gaucha'",
      "Fintech 'Pagá Mañana'",
      "Fintech 'Dólar Seguro'",
      "Fintech 'PesoCero'",
      "Fintech 'CuevaPay'",
      "Fintech 'Cripto Ñandú'",
      "Fintech 'Tarjeta Doña Rosa'",
    ],
    pitches: [
      "Movemos 3 millones de transacciones por día. Las 3 millones te van a despertar a las 3 AM.",
      "Somos el banco que no es banco (hasta que el BCRA diga lo contrario).",
      "Cobrás bien, dormís mal. Es el trato.",
    ],
  },
  startup: {
    id: "startup",
    nombre: "Startup",
    desc: "Poco sueldo, mucho equity, cero procesos. Hoy sos dev, mañana sos CFO y el jueves, mudanza.",
    icon: "rocket",
    salaryMult: 0.8,
    usd: false,
    xpMult: 1.4,
    mentalMult: 1.2,
    energyMult: 1.2,
    estabilidad: 0.3,
    prestigio: 1,
    nivelMin: 1,
    repMin: 0,
    peso: { normal: 2, boom: 4, crisis: 0.5 },
    perks: ["Equity (un PDF que vale lo mismo que una SUBE sin saldo)", "Pizza y cerveza los jueves", "Hoy dev, mañana CFO", "Oficina con pufs y un perro"],
    empresas: [
      "Startup 'MateOps'",
      "Startup 'Delivery del Barrio'",
      "Startup 'Flechazo' (Tinder para asados)",
      "Startup 'Chamuyo.ai'",
      "Startup 'Fernet Express'",
      "Startup 'Bondi Pass'",
      "Startup 'Siesta Cloud'",
    ],
    pitches: [
      "Somos pre-seed, pre-revenue y pre-sueldo. Pero la visión está clarísima.",
      "Queremos ser el Uber de los mates. Vos serías el empleado número 4 (y el 3 se fue).",
      "El equity va a valer millones. El sueldo, por ahora, no.",
    ],
  },
  corpo: {
    id: "corpo",
    nombre: "Corpo",
    desc: "Banco o telco: buen sueldo, obra social premium y tres formularios para pedir un mouse.",
    icon: "landmark",
    salaryMult: 1.15,
    usd: false,
    xpMult: 0.85,
    mentalMult: 1.35,
    energyMult: 1,
    estabilidad: 0.85,
    prestigio: 1,
    nivelMin: 1,
    repMin: 0,
    peso: { normal: 2, boom: 1.5, crisis: 3 },
    perks: ["Obra social premium", "Comedor con menú ejecutivo", "Tres formularios para pedir un mouse", "Día del bancario (aunque seas dev)"],
    empresas: [
      "Banco del Riachuelo Digital",
      "Telco 'Movilínea'",
      "Banco 'Provincia del Interior'",
      "Seguros 'La Precavida'",
      "Prepaga 'Turno en 2027'",
      "Telco 'FibraYa'",
      "Banco 'Plazo Fijo del Conurbano'",
    ],
    pitches: [
      "Tenemos 140 años de historia y un sistema core en COBOL de la misma edad.",
      "Entrás a las 9, salís a las 18 y en el medio hay 7 reuniones.",
      "Estabilidad total: acá nadie se va, ni los que deberían.",
    ],
  },
  remota: {
    id: "remota",
    nombre: "Remota",
    desc: "Cobrás en dólares desde el living. Tu equipo está en tres husos horarios y ninguno es el tuyo.",
    icon: "globe",
    salaryMult: 1,
    usd: true,
    xpMult: 1.1,
    mentalMult: 1,
    energyMult: 1.25,
    estabilidad: 0.5,
    prestigio: 2,
    nivelMin: 2,
    repMin: 0,
    peso: { normal: 1.5, boom: 3, crisis: 1 },
    perks: ["Cobrás en dólares", "Daily a las 6 AM por el huso horario", "Nadie sabe que trabajás en jogging", "Un contador que 'sabe cómo cobrar del exterior'"],
    empresas: [
      "Remote 'Austin Devs LLC'",
      "Agencia gringa 'Byte & Co.'",
      "Startup yanqui 'StackFlow Inc.'",
      "Consultora española 'Tecnología Ibérica'",
      "Scale-up alemana 'Deutsch Code GmbH'",
      "Remote 'Miami Tech Partners'",
      "Agencia canadiense 'Maple Dev'",
    ],
    pitches: [
      "Fully remote, async-first (o sea: te escriben a las 4 AM y esperan respuesta).",
      "Pagamos en dólares a una cuenta que vos sabrás cómo abrir.",
      "Team distribuido en 11 países. El mate lo ponés vos.",
    ],
  },
  estado: {
    id: "estado",
    nombre: "Estado",
    desc: "Sueldo bajo, mate legalizado y a las 16 se corta. Ni un meteorito te echa.",
    icon: "scale",
    salaryMult: 0.65,
    usd: false,
    xpMult: 0.6,
    mentalMult: 0.6,
    energyMult: 0.7,
    estabilidad: 1,
    prestigio: 0,
    nivelMin: 1,
    repMin: 0,
    peso: { normal: 1.5, boom: 0.5, crisis: 4 },
    perks: ["A las 16 se corta", "Inamovible: ni un meteorito te echa", "Paros con adhesión del 100%", "Mate en el escritorio, legalizado por resolución"],
    empresas: [
      "Ministerio de Modernización Digital",
      "Ente Recaudador · Área de Sistemas",
      "Municipalidad · Departamento de Cómputos",
      "Secretaría de Innovación Bonaerense",
      "Agencia Estatal de Datos",
      "Registro Civil Digital",
      "Empresa estatal de software 'ArSoft'",
    ],
    pitches: [
      "Planta permanente, licencia por examen y un sistema que se cae los días de pago.",
      "Vas a modernizar el Estado con una PC de 2011 y Windows 7.",
      "Nadie te va a apurar. Nadie te va a ascender tampoco.",
    ],
  },
  unicornio: {
    id: "unicornio",
    nombre: "Unicornio",
    desc: "Oficina con tobogán, barista y stock options de verdad. Entrar es más difícil que un turno en el PAMI.",
    icon: "sparkles",
    salaryMult: 1.4,
    usd: false,
    xpMult: 1.3,
    mentalMult: 1.25,
    energyMult: 1.15,
    estabilidad: 0.65,
    prestigio: 3,
    nivelMin: 3,
    repMin: 30,
    peso: { normal: 1, boom: 2, crisis: 0.3 },
    perks: ["Stock options (de verdad, esta vez)", "Oficina con tobogán y barista", "Los recruiters de Big Tech te tienen en la mira", "Viajes a la oficina de São Paulo"],
    empresas: [
      "Unicornio 'Patagonia Data'",
      "Unicornio 'Ñandú Pay'",
      "Unicornio 'Galpón Cloud'",
      "Unicornio 'AsadoLabs'",
      "Unicornio 'Pampa AI'",
      "Unicornio 'Rosario Rockets'",
      "Scale-up 'Cuyo Cloud'",
    ],
    pitches: [
      "Valuación de US$1.000 millones y un tobogán en la oficina. Los dos son reales.",
      "Entrevista de 6 rondas. La sexta es con el perro del CTO.",
      "Si entrás acá, el próximo mail es de una Big Tech.",
    ],
  },
};

// ---------- Mercado laboral ----------
export const MERCADOS = {
  boom: { id: "boom", nombre: "Boom IT", desc: "Hasta el kiosquero busca devs. Llueven ofertas y suben los sueldos.", icon: "trendingUp", tone: "good" },
  normal: { id: "normal", nombre: "Mercado normal", desc: "Ni boom ni crisis: LinkedIn con el ruido de siempre.", icon: "chartBar", tone: "muted" },
  crisis: { id: "crisis", nombre: "Crisis", desc: "Congelaron las contrataciones. Los recruiters están 'open to work'.", icon: "trendingDown", tone: "bad" },
};

// Multiplicadores por mercado: ofertas (chance), despidos (peso), sueldo, inversion (rondas y compras), ventas (usuarios)
const MERCADO_MULT = {
  boom: { ofertas: 1.6, despidos: 0.6, sueldo: 1.1, inversion: 1.5, ventas: 1.3 },
  normal: { ofertas: 1, despidos: 1, sueldo: 1, inversion: 1, ventas: 1 },
  crisis: { ofertas: 0.45, despidos: 3, sueldo: 0.9, inversion: 0.4, ventas: 0.7 },
};

export function mercadoMult(s, kind) {
  const m = MERCADO_MULT[s.carrera ? s.carrera.mercado : "normal"] || MERCADO_MULT.normal;
  return m[kind] == null ? 1 : m[kind];
}

const MERCADO_LINES = {
  boom: "📈 Boom IT: hasta el kiosquero busca devs. Llueven ofertas y los sueldos suben.",
  crisis: "📉 Crisis: congelaron las contrataciones. Los recruiters están 'open to work'.",
  normalDesdeBoom: "📊 Se terminó el boom: el mercado volvió a la normalidad. LinkedIn vuelve a ser ruido.",
  normalDesdeCrisis: "🔓 Pasó la crisis: se descongelaron las contrataciones. Vuelven los 'Hi! We loved your profile'.",
};

export function cambiarMercado(s, mercado, lines) {
  const c = ensureCarrera(s);
  if (!MERCADOS[mercado] || mercado === c.mercado) return;
  const anterior = c.mercado;
  c.mercado = mercado;
  c.mercadoSemanas = 0;
  if (lines) {
    if (mercado === "normal") lines.push(anterior === "boom" ? MERCADO_LINES.normalDesdeBoom : MERCADO_LINES.normalDesdeCrisis);
    else lines.push(MERCADO_LINES[mercado]);
  }
}

// ---------- Reputación ----------
export function sumarReputacion(s, n, lines, motivo) {
  const c = ensureCarrera(s);
  const before = c.reputacion;
  c.reputacion = clamp(Math.round(before + n), 0, 100);
  const d = c.reputacion - before;
  if (d && lines) lines.push(`${d > 0 ? "⭐" : "💢"} Reputación ${d > 0 ? "+" : ""}${d}${motivo ? ` (${motivo})` : ""}.`);
  return d;
}

// ---------- Historial laboral ----------
const abierta = (c, fundador = false) => c.historial.find((h) => h.hasta === null && (h.tipo === "fundador") === fundador);

function abrirHistorial(s) {
  const c = ensureCarrera(s);
  if (!s.job || abierta(c)) return;
  c.historial.push({
    company: s.job.company,
    tipo: s.job.tipo || "consultora",
    desde: s.job.desde != null ? s.job.desde : s.week,
    hasta: null,
    nivel: s.level,
    motivo: null,
  });
}

function abrirHistorialFundador(s) {
  const c = ensureCarrera(s);
  if (!s.empresa || abierta(c, true)) return;
  c.historial.push({ company: s.empresa.nombre, tipo: "fundador", desde: s.empresa.semana, hasta: null, nivel: s.level, motivo: null });
}

// Cierra la entrada abierta del historial (la del laburo, o la de tu empresa si fundador = true)
export function cerrarHistorial(s, motivo = "se fue", fundador = false) {
  const c = ensureCarrera(s);
  const h = abierta(c, fundador);
  if (!h) return null;
  h.hasta = s.week;
  h.motivo = motivo;
  h.nivel = Math.max(h.nivel || 0, s.level);
  return h;
}

// Si el laburo cambió por fuera de este módulo (despidos, eventos viejos), el historial se acomoda solo
function sincronizarHistorial(s) {
  const c = ensureCarrera(s);
  const h = abierta(c);
  if (h && (!s.job || h.company !== s.job.company)) cerrarHistorial(s, s.job ? "cambio de laburo" : "se fue");
  if (s.job) abrirHistorial(s);
  if (!s.empresa && abierta(c, true)) cerrarHistorial(s, "cerró", true);
  if (s.empresa) abrirHistorialFundador(s);
}

// Semanas en el laburo actual
export const antiguedad = (s) => (s.job ? Math.max(0, s.week - (s.job.desde != null ? s.job.desde : s.week)) : 0);

// Tipo de empresa del laburo actual (null si no tenés laburo)
export const tipoJob = (s) => (s.job ? TIPOS_EMPRESA[s.job.tipo] || TIPOS_EMPRESA.consultora : null);

// Multiplicador del laburo actual para la semana de Laburo: "xp" | "mental" | "energy"
export function jobMult(s, kind) {
  const t = tipoJob(s);
  if (!t) return 1;
  const m = { xp: t.xpMult, mental: t.mentalMult, energy: t.energyMult }[kind];
  return m == null ? 1 : m;
}

// ---------- Receta de las acciones instantáneas ----------
function start(state) {
  const s = structuredClone(state);
  s.delta = {};
  s.toast = null;
  ensureCarrera(s);
  if (s.empresa === undefined) s.empresa = null;
  return s;
}

function toast(s, text, tone = "good") {
  s.toast = { text, delta: s.delta, tone, id: Date.now() };
  s.delta = {};
  return s;
}

const cap = (t) => (t ? t[0].toUpperCase() + t.slice(1) : t);
const num = (n) => Math.round(n).toLocaleString("es-AR");
const semanasTxt = (n) => `${n} semana${n === 1 ? "" : "s"}`;
const sueldoTxt = (job) => (job.salaryUsd ? `${fmtUsd(job.salaryUsd)}/mes` : `${fmtArs(job.salaryArs || 0)}/mes`);

// ---------- Ofertas de laburo ----------
const nivelOferta = (level) => clamp(Math.round(Number(level) || 1), 1, 4);
const habilitado = (t, level, rep) => t.nivelMin <= level && t.repMin <= rep;

function elegirTipo(s, level, opts) {
  const c = ensureCarrera(s);
  const forzado = TIPOS_EMPRESA[opts.tipo];
  if (forzado && habilitado(forzado, level, c.reputacion)) return forzado;
  let pool = Object.values(TIPOS_EMPRESA).filter((t) => habilitado(t, level, c.reputacion));
  if (opts.externa && s.job) {
    const otros = pool.filter((t) => t.id !== s.job.tipo);
    if (otros.length) pool = otros;
  }
  const peso = (t) => t.peso[c.mercado] ?? t.peso.normal ?? 1;
  let roll = Math.random() * pool.reduce((acc, t) => acc + peso(t), 0);
  for (const t of pool) {
    roll -= peso(t);
    if (roll <= 0) return t;
  }
  return pool[pool.length - 1] || TIPOS_EMPRESA.consultora;
}

function elegirEmpresa(s, t) {
  const otras = t.empresas.filter((n) => !s.job || n !== s.job.company);
  return pick(otras.length ? otras : t.empresas);
}

// Reemplaza a helpers.makeOffer (mismos 3 primeros parámetros). opts: { tipo, externa }
export function makeOffer(s, level, mult = 1, opts = {}) {
  const c = ensureCarrera(s);
  const o = opts || {};
  const nivel = nivelOferta(level);
  const m = Number.isFinite(mult) && mult > 0 ? mult : 1;
  const t = elegirTipo(s, nivel, o);
  const remoto = !!t.usd && nivel >= 2;
  const salaryArs = remoto
    ? 0
    : Math.max(1000, Math.round((SALARY_ARS[nivel] * s.priceIndex * t.salaryMult * m * mercadoMult(s, "sueldo") * rand(0.85, 1.15)) / 1000) * 1000);
  const salaryUsd = remoto ? Math.max(10, Math.round((SALARY_USD[nivel] * m * rand(0.9, 1.15)) / 10) * 10) : 0;
  s.offer = {
    company: elegirEmpresa(s, t),
    tipo: t.id,
    level: nivel,
    salaryArs,
    salaryUsd,
    remote: remoto,
    perks: shuffle(t.perks).slice(0, 2),
    pitch: pick(t.pitches),
  };
  c.ofertasRecibidas += 1;
  return s.offer;
}

// "Fintech · Fintech 'Billetera Gaucha' · Semi-Senior · $2.300.000/mes"
export function describirOferta(o) {
  if (!o) return "";
  const t = TIPOS_EMPRESA[o.tipo];
  const partes = [];
  if (t) partes.push(t.nombre);
  partes.push(o.company);
  if (LEVELS[o.level]) partes.push(LEVELS[o.level]);
  partes.push(o.salaryUsd ? `${fmtUsd(o.salaryUsd)}/mes` : `${fmtArs(o.salaryArs || 0)}/mes`);
  if (o.remote) partes.push("remoto");
  return partes.join(" · ");
}

// Reemplaza a helpers.acceptOffer: mismos efectos + historial, saltos y reputación
export function acceptOffer(s, lines) {
  const o = s.offer;
  if (!o) {
    lines.push("🤷 Fuiste a firmar y la oferta ya no estaba. El recruiter te dejó en visto.");
    return;
  }
  const c = ensureCarrera(s);
  if (s.job && !s.job.tipo) migrarJob(s);
  if (s.job) {
    const semanas = antiguedad(s);
    cerrarHistorial(s, "cambio de laburo");
    if (semanas < 24) {
      c.saltos += 1;
      fx(s, { network: -2 });
      lines.push("🔁 Tu LinkedIn ya tiene más empresas que un CUIT… Los recruiters empiezan a sospechar.");
      sumarReputacion(s, -4, lines, "salto");
    } else {
      sumarReputacion(s, 2, lines, "te fuiste por la puerta grande");
    }
  } else {
    cerrarHistorial(s); // por si quedó abierta una entrada vieja
  }
  const tipo = TIPOS_EMPRESA[o.tipo] ? o.tipo : o.remote ? "remota" : "consultora";
  s.job = {
    company: o.company,
    salaryArs: o.salaryArs || 0,
    salaryUsd: o.salaryUsd || 0,
    weeksSinceRaise: 0,
    remote: !!o.remote,
    tipo,
    desde: s.week,
    perks: o.perks || [],
  };
  s.level = Math.max(s.level, o.level);
  s.studyDone = true;
  s.searchBonus = 0;
  s.offer = null;
  updatePhase(s);
  lines.push(`✍️ Firmaste con ${o.company} como ${LEVELS[s.level]}. Ya tenés mail corporativo y 47 accesos pendientes.`);
  if (o.perks && o.perks.length) lines.push(`🎁 Perks: ${o.perks.join(" · ")}.`);
  if (!s.housing) s.queue.push("mudanza");
  s.queue.push("onboarding");
  abrirHistorial(s);
}

// ---------- Saltar de laburo ----------
const ENTREVISTA_OK = [
  (o) => `📩 ¡Pegaste onda! ${o.company} te mandó una oferta. Mientras tanto, en la Daily, cara de póker.`,
  (o) => `🎉 Entrevistaste desde el auto en el estacionamiento y salió redonda: oferta de ${o.company}.`,
  (o) => `📩 ${o.company} quiere sumarte. Tu jefe todavía cree que fuiste al dentista.`,
];

const ENTREVISTA_FAIL = [
  "🙅 Te dijeron que buscaban alguien con 8 años de experiencia en una tecnología de 2023.",
  "📞 Te pidieron invertir un árbol binario en una pizarra imaginaria. Ganó el árbol.",
  "📧 'Seguimos con candidatos que se ajustan más al perfil'. El perfil eras vos con otro apellido.",
  "😩 Ocho rondas de entrevistas para que al final te digan que la búsqueda 'se congeló'.",
  "🤷 Te preguntaron dónde te ves en 5 años. Dijiste 'en Ezeiza' y se cortó la llamada.",
  "🙈 Dijiste tu pretensión salarial en dólares y el recruiter te dejó en visto para siempre.",
  "🧠 Te mandaron un challenge técnico de 72 horas 'para hacer tranqui el finde'. No llegaste.",
  "🙈 Te conectaste a la entrevista desde la compu del laburo. Tu jefe vio la notificación.",
];

const RENUNCIA = [
  (c) => `🚪 Renunciaste a ${c}. Mandaste el mail un viernes a las 17:59 y apagaste la notebook.`,
  (c) => `🚪 Chau ${c}: devolviste la notebook, el buzo no. Ahora sos "open to work" con orgullo.`,
  (c) => `🚪 Le dijiste a tu líder en ${c} "no sos vos, soy yo". Era él.`,
];

export function puedeEntrevistar(s) {
  const c = s.carrera || {};
  if (s.gameOver || s.victory) return { ok: false, motivo: "La partida ya terminó." };
  if (!s.job) return { ok: false, motivo: "Necesitás un laburo para entrevistar a escondidas (si no, es entrevistar a secas)." };
  if (s.empresa) return { ok: false, motivo: "Sos fundador: ahora los que entrevistan son los otros." };
  if (s.interview) return { ok: false, motivo: "Estás en pleno proceso con Big Tech: no mezcles." };
  if (s.offer) return { ok: false, motivo: "Ya tenés una oferta en la mesa: resolvela primero." };
  if (c.entrevistaSemana === s.week) return { ok: false, motivo: "Ya te escapaste esta semana. Otro 'turno con el dentista' y te descubren." };
  if (s.stats.energy < 15) return { ok: false, motivo: "Estás sin nafta: necesitás 15 de Energía." };
  return { ok: true, motivo: null };
}

// Saltar de empresa puede darte un título más, pero la entrevista técnica no se chamuya:
// el puesto de arriba solo te lo ofrecen si tenés la Lógica que pide ese ascenso
function nivelSalto(s, p) {
  const req = PROMOTIONS[s.level];
  const sube = s.level < 4 && !!req && s.stats.logic >= req.logic && chance(p);
  return clamp(s.level + (sube ? 1 : 0), 1, 4);
}

export function entrevistarAEscondidas(state) {
  if (!puedeEntrevistar(state).ok) return state;
  const s = start(state);
  const c = s.carrera;
  c.entrevistaSemana = s.week;
  fx(s, { energy: -10, mental: -3 });
  const p = Math.min(
    0.85,
    (0.18 + s.stats.network / 300 + s.stats.logic / 500) * mercadoMult(s, "ofertas") * (c.saltos >= 3 ? 0.6 : 1)
  );
  if (chance(p)) {
    const o = makeOffer(s, nivelSalto(s, 0.35), 1.15, { externa: true });
    if (!s.pending) s.pending = { kind: "event", id: "oferta_externa" };
    else s.queue.push("oferta_externa");
    return toast(s, pick(ENTREVISTA_OK)(o), "vip");
  }
  return toast(s, pick(ENTREVISTA_FAIL), "bad");
}

// Muta el estado: se va del laburo actual (lo usan renunciar y algunos eventos)
function irseDelLaburo(s) {
  const c = ensureCarrera(s);
  if (!s.job.tipo) migrarJob(s);
  const semanas = antiguedad(s);
  const company = s.job.company;
  cerrarHistorial(s, "renuncia");
  s.job = null;
  s.secondJob = false;
  s.searchBonus = 20;
  fx(s, { mental: 5, network: semanas < 24 ? -3 : 2 });
  if (semanas < 24) {
    c.saltos += 1;
    sumarReputacion(s, -2);
  }
  updatePhase(s);
  return { company, semanas };
}

export function renunciar(state) {
  if (!state.job || state.gameOver || state.victory) return state;
  const s = start(state);
  const { company, semanas } = irseDelLaburo(s);
  const corto = semanas < 24;
  const txt = pick(RENUNCIA)(company) + (corto ? ` Duraste ${semanasTxt(semanas)}: cuenta como salto.` : "");
  return toast(s, txt, corto ? "bad" : "good");
}

function negociarConJefe(s, lines) {
  const o = s.offer;
  s.offer = null;
  if (!s.job) {
    lines.push("🤷 Ibas a negociar, pero ya no tenés jefe. La oferta se enfrió mientras pensabas.");
    return;
  }
  if ((s.job.weeksSinceRaise ?? 99) < 12) {
    fx(s, { mental: -2 });
    lines.push(`🙄 Tu jefe te recordó que el aumento te lo dieron hace ${s.job.weeksSinceRaise} semanas. "Volvé a hablar en unos meses". La oferta se enfrió.`);
    return;
  }
  if (chance(0.35 + s.stats.network / 200)) {
    const pct = randInt(10, 20);
    if (s.job.salaryUsd) s.job.salaryUsd = Math.round(s.job.salaryUsd * (1 + pct / 100));
    else s.job.salaryArs = Math.round((s.job.salaryArs * (1 + pct / 100)) / 1000) * 1000;
    s.job.weeksSinceRaise = 0;
    fx(s, { mental: 4 });
    lines.push(
      `🤝 Le mostraste a tu jefe la oferta de ${o ? o.company : "la competencia"} y se asustó: +${pct}% y te quedás. Ahora sos "una pieza clave del equipo".`
    );
  } else {
    fx(s, { mental: -5 });
    lines.push("👀 Tu jefe te dijo 'lo vamos a evaluar'. Desde ese día te miran raro en la Daily: te marcaron.");
  }
}

// ---------- Tu startup ----------
export const IDEAS = [
  "Uber para paseadores de perros en monoambientes",
  "Tinder para encontrar compañero de asado",
  "Una app que te avisa cuando el chino del barrio repone fernet",
  "Blockchain para la libreta de fiado del almacén",
  "Una IA que te dice si te conviene el plazo fijo o el colchón",
  "SaaS para consorcios con chat de vecinos enojados incluido",
  "Marketplace de turnos para la verificación técnica",
  "Una app que traduce 'lo vemos la semana que viene' al plazo real",
  "Mate con Bluetooth que te avisa cuando está lavado",
  "Netflix de clases de apoyo para el CBC",
  "Rappi de facturas para la oficina a las 10 AM",
  "Red social solo para gente que dice 'arranco el lunes'",
  "Una IA que redacta mails de 'según lo hablado' para tu jefe",
  "Seguro contra cortes de luz en pleno deploy",
  "Alquiler de parrillas por hora para los que viven en departamento",
  "Cuotas sin interés para pagar las cuotas sin interés",
  "Tracker en tiempo real de la inflación del changuito",
  "Marketplace de figuritas del Mundial con escrow",
  "LinkedIn para jubilados que quieren seguir opinando",
  "Cripto respaldada en vacío y chorizo",
  "App para decidir a quién le toca poner el auto en el viaje a la costa",
  "Reservas de canchas de fútbol 5 con VAR casero",
  "Delivery de hielo para las previas de enero",
  "App para dividir gastos y escrachar al amigo que nunca paga",
  "Una IA que te arma el prode del Mundial",
  "Turnos para el mecánico que 'te lo tiene para el jueves'",
  "Nube argentina: tus archivos en un servidor en el garaje de mi primo",
  "Bot que hace la fila del banco por vos",
];

export const ideaAleatoria = () => pick(IDEAS);

const INVERSORES = [
  "un fondo de Miami",
  "tu tío que vendió el campo",
  "una aceleradora de Palermo",
  "un ángel inversor que conociste en un asado",
  "un family office de Nordelta",
  "un ex founder arrepentido",
  "un fondo español que cree que Argentina es un país estable",
  "un gringo que vino de vacaciones y se enamoró del Malbec",
  "la aceleradora de una telco",
  "un cripto bro con chaleco de plumas",
];

const COMPRADORES = ["Mercado Libre", "Globant", "Nubank", "un fondo de Miami", "unos pibes de Rosario con plata", "una telco que no entiende nada"];

export const ETAPAS = ["Idea", "MVP", "Tracción", "Escalando", "Unicornio chiquito"];

// Una ronda por etapa: monto en US$
const RONDAS = [
  { nombre: "friends & family", min: 50000, max: 60000 },
  { nombre: "pre-seed", min: 60000, max: 150000 },
  { nombre: "seed", min: 200000, max: 600000 },
  { nombre: "Serie A", min: 700000, max: 1500000 },
  { nombre: "Serie B", min: 1500000, max: 2000000 },
];

// Tunables de la startup
const MAX_EMPLEADOS = 25;
const ESPERA_RONDA = 8; // semanas entre rondas
const BOCA_EN_BOCA = 0.012; // usuarios nuevos por semana sobre el total, con producto 100 y pocos bugs
const CHURN_MES = [0.02, 0.04]; // fracción de usuarios que se va cada mes
export const UMBRAL_COMPRA = 3000000; // US$ de valuación para que aparezcan compradores
export const ETAPA_COMPRA = 3; // y escala de verdad: nadie compra un PowerPoint (ni un MVP con 2.000 usuarios)
const CHANCE_COMPRA = 0.05; // por mes, una vez que cumplís lo de arriba
const DESGASTE_RONDA = 0.97; // la valuación de la última ronda pierde 3% por mes si no crecés
const MULTIPLO = { boom: 14, normal: 8, crisis: 4 }; // valuación = ARR × múltiplo + producto + usuarios

const EMPRESA_DEFAULT = {
  nombre: "Startup sin nombre",
  idea: "",
  semana: 1,
  capital: 0,
  mrr: 0,
  usuarios: 0,
  pagos: 0, // usuarios que pagan
  producto: 10,
  traccion: 0,
  empleados: 0,
  equity: 100,
  rondas: [],
  valuacionUsd: 0,
  moral: 70,
  bugs: 0,
  hitos: [],
  ofertaCompra: null,
  usuariosMesAnterior: 0,
  hype: 1, // multiplica la valuación; vuelve solo hacia 1
  exclusividadHasta: 0, // semana hasta la que un cliente te tiene en exclusiva
  mesesEnRojo: 0, // cierres de mes seguidos con la caja en rojo (al segundo, quiebra)
};

function completarEmpresa(e) {
  for (const [k, v] of Object.entries(EMPRESA_DEFAULT)) {
    if (e[k] === undefined) e[k] = Array.isArray(v) ? [] : v;
  }
  return e;
}

// Los empleados de una startup que escala son Semi-Senior (y cobran como tales)
export const sueldoEmpleado = (s) => Math.round(SALARY_ARS[3] * s.priceIndex);
const ticket = (s) => price(s, 9000); // lo que paga cada usuario por mes

// Con ronda, buena facturación o espalda (6 meses de caja) te pagás un sueldo (modesto) desde la caja
export function sueldoFundador(s) {
  const e = s.empresa;
  if (!e) return 0;
  const sueldo = price(s, 900000);
  const espalda = e.capital >= 6 * (burnEmpresa(s, false) + sueldo);
  return (e.rondas && e.rondas.length > 0) || e.mrr >= price(s, 2500000) || espalda ? sueldo : 0;
}

function burnEmpresa(s, conFundador = true) {
  const e = s.empresa;
  if (!e) return 0;
  // Infra: base + servidores que crecen con los usuarios
  return e.empleados * sueldoEmpleado(s) + price(s, 350000) + Math.round(e.usuarios * price(s, 40)) + (conFundador ? sueldoFundador(s) : 0);
}

function etapaIdx(s) {
  const e = s.empresa;
  if (!e) return 0;
  const mrrUsd = e.mrr / s.dolar;
  if (e.usuarios >= 60000 && mrrUsd >= 30000) return 4;
  if (e.usuarios >= 12000 && mrrUsd >= 5000) return 3;
  if (e.usuarios >= 2000 && mrrUsd >= 600) return 2;
  if (e.usuarios >= 300 && e.pagos >= 10) return 1;
  return 0;
}

export const etapaEmpresa = (s) => ETAPAS[etapaIdx(s)];

function valuar(s) {
  const e = s.empresa;
  // La valuación de la última ronda sostiene el precio un tiempo, pero se desgasta si no crecés
  const r = e.rondas.length ? e.rondas[e.rondas.length - 1] : null;
  const ultima = r ? (r.valuacionUsd || 0) * Math.pow(DESGASTE_RONDA, Math.max(0, s.week - r.semana) / 4) : 0;
  const mercado = s.carrera ? s.carrera.mercado : "normal";
  const formula = ((e.mrr * 12) / s.dolar) * (MULTIPLO[mercado] || 8) + e.producto * 1500 + e.usuarios * 20;
  return Math.max(0, Math.round(Math.max(ultima, formula) * (e.hype || 1)));
}

function actualizarMrr(s) {
  const e = s.empresa;
  e.mrr = Math.round(e.pagos * ticket(s));
}

// Suma usuarios nuevos; una parte (producto / 1000) se convierte en usuarios que pagan
function sumarUsuarios(s, n) {
  const e = s.empresa;
  const nuevos = Math.max(0, Math.round(n));
  if (!nuevos) return 0;
  e.usuarios += nuevos;
  const esperado = nuevos * (e.producto / 1000) * rand(0.7, 1.3);
  const pagos = Math.floor(esperado) + (chance(esperado % 1) ? 1 : 0);
  e.pagos += pagos;
  actualizarMrr(s);
  return pagos;
}

// Pierde una fracción de usuarios (y de los que pagan)
function perderUsuarios(s, frac) {
  const e = s.empresa;
  const f = clamp(frac, 0, 1);
  const perdidos = Math.round(e.usuarios * f);
  e.usuarios -= perdidos;
  e.pagos = Math.max(0, e.pagos - Math.round(e.pagos * f));
  actualizarMrr(s);
  return perdidos;
}

function sumarPagos(s, n) {
  const e = s.empresa;
  const p = Math.max(0, Math.round(n));
  e.pagos += p;
  e.usuarios += p;
  actualizarMrr(s);
  return p;
}

const subirHype = (e, f) => {
  e.hype = clamp((e.hype || 1) * f, 0.3, 3);
};

const ultimaRonda = (e) => (e && e.rondas.length ? e.rondas[e.rondas.length - 1] : null);

const esperaRonda = (s) => {
  const r = ultimaRonda(s.empresa);
  return r ? Math.max(0, r.semana + ESPERA_RONDA - s.week) : 0;
};

// Los fondos ponen plata una vez por etapa: para la próxima ronda tenés que crecer
const rondaDisponible = (s) => {
  const r = ultimaRonda(s.empresa);
  return !r || etapaIdx(s) > (r.etapa ?? 0);
};

export function chanceRonda(s) {
  const e = s.empresa;
  if (!e || esperaRonda(s) > 0 || !rondaDisponible(s)) return 0;
  return Math.min(0.5, (0.05 + e.traccion / 300 + e.producto / 500) * mercadoMult(s, "inversion"));
}

const HITOS = [
  {
    id: "Primer cliente que paga",
    cumple: (e) => e.mrr > 0,
    rep: 1,
    linea: "🎉 Hito: primer cliente que paga. Le sacaste captura a la transferencia y la subiste a LinkedIn.",
  },
  { id: "1.000 usuarios", cumple: (e) => e.usuarios >= 1000, rep: 3, linea: "🎉 Hito: 1.000 usuarios. Ya no son todos parientes." },
  {
    id: "Break even",
    cumple: (e, s) => e.mrr > 0 && e.mrr >= burnEmpresa(s, false),
    rep: 2,
    linea: "🎉 Hito: break even. Por primera vez entra más plata de la que sale. Tu contador lloró.",
  },
  {
    id: "10.000 usuarios",
    cumple: (e) => e.usuarios >= 10000,
    rep: 4,
    linea: "🎉 Hito: 10.000 usuarios. Te reconocieron en una meetup (te confundieron con otro, pero bueno).",
  },
  { id: "100.000 usuarios", cumple: (e) => e.usuarios >= 100000, rep: 5, linea: "🎉 Hito: 100.000 usuarios. Ya te escriben de Mercado Libre." },
];

function checkHitos(s, lines) {
  const e = s.empresa;
  if (!e) return;
  for (const h of HITOS) {
    if (e.hitos.includes(h.id) || !h.cumple(e, s)) continue;
    e.hitos.push(h.id);
    lines.push(h.linea);
    sumarReputacion(s, h.rep, lines, h.id);
  }
}

export function requisitosFundar(s) {
  const capitalMin = price(s, 1500000);
  const faltan = [];
  if (s.gameOver || s.victory) faltan.push("La partida ya terminó.");
  if (s.empresa) faltan.push("Ya tenés una empresa: de a una, campeón.");
  if (s.level < 2) faltan.push("Ser Junior o más: primero aprendé cómo se rompe una empresa ajena.");
  if (s.ars < capitalMin) faltan.push(`Tener ${fmtArs(capitalMin)} para el capital inicial.`);
  if (s.stats.network < 20) faltan.push("20+ de Contactos: alguien te tiene que comprar.");
  if (s.interview || s.phase === 4) faltan.push("Terminar el proceso con Big Tech.");
  if (s.offer) faltan.push("Resolver la oferta de laburo que tenés en la mesa.");
  return { ok: faltan.length === 0, faltan, capitalMin };
}

export function fundarEmpresa(state, datos = {}) {
  const req = requisitosFundar(state);
  if (!req.ok) return state;
  const { nombre, idea, capital } = datos || {};
  const monto = Math.round(Number(capital));
  if (!Number.isFinite(monto) || monto < req.capitalMin || monto > state.ars) return state;
  const s = start(state);
  const nom = String(nombre ?? "").trim().replace(/\s+/g, " ").slice(0, 24).trim() || "Startup sin nombre";
  const laIdea = String(idea ?? "").trim().slice(0, 140) || ideaAleatoria();
  if (s.job) cerrarHistorial(s, "fundó su empresa");
  s.job = null;
  s.secondJob = false;
  fx(s, { ars: -monto });
  s.empresa = completarEmpresa({ nombre: nom, idea: laIdea, semana: s.week, capital: monto });
  s.empresa.valuacionUsd = valuar(s);
  abrirHistorialFundador(s);
  updatePhase(s);
  return toast(s, `🚀 Fundaste ${nom}. Ya tenés 3 seguidores en LinkedIn: tu vieja, tu tía y un bot.`, "vip");
}

// Etiquetas para el FOCUS del motor
export const FOCUS_EMPRESA = { vender: "Vender", producto: "Producto", inversores: "Inversores" };

export function focusOptionsEmpresa(s) {
  const e = s && s.empresa;
  const espera = e ? esperaRonda(s) : 0;
  const p = e ? Math.round(chanceRonda(s) * 100) : 0;
  const proxima = e ? ETAPAS[etapaIdx(s) + 1] : null;
  let descInversores = `Pitch, Zoom y planillas · ${p}% de chance de ronda`;
  if (e && !rondaDisponible(s)) {
    descInversores = proxima ? `Pitch y Zoom · Ya levantaste en esta etapa: llegá a ${proxima}` : "Pitch y Zoom · Ya levantaste todo lo que se podía";
  } else if (espera > 0) descInversores = `Pitch y Zoom · Los fondos te piden ${semanasTxt(espera)} más`;
  return [
    { id: "vender", accent: "blue", label: "Vender", desc: "Demos, LinkedIn y cafés · +Usuarios · +Contactos" },
    { id: "producto", accent: "purple", label: "Producto", desc: "Programar y matar bugs · +Producto · +Lógica" },
    { id: "salud", accent: "green", label: "Descansar", desc: "Mate, siesta y fulbito · +Energía · +Salud mental" },
    { id: "inversores", accent: "orange", label: "Inversores", desc: descInversores },
  ];
}

const VENDER = [
  (c) => `📢 Saliste a vender por LinkedIn como si no hubiera mañana: +${num(c.n)} usuarios, ${num(c.p)} pagan.`,
  (c) => `🤝 Hiciste 30 demos y tomaste 30 cafés: +${num(c.n)} usuarios (${num(c.p)} con tarjeta).`,
  (c) => `🧉 Vendiste con el mate en la mano hasta en el grupo de padres del colegio: +${num(c.n)} usuarios, ${num(c.p)} pagan.`,
  (c) => `🛒 Campaña en Instagram con tu primo de modelo: +${num(c.n)} usuarios. Pagan ${num(c.p)}; el resto vino por el primo.`,
];

const PRODUCTO = [
  (c) => `🛠️ Semana de producto: refactor, tests y un botón que por fin hace algo. Producto ${c.prod}/100.`,
  (c) => `💻 Programaste 14 horas por día. El producto mejoró (+${c.m}) y vos empeoraste. Producto ${c.prod}/100.`,
  (c) => `🐞 Cerraste bugs viejos y abriste algunos nuevos (menos). Producto ${c.prod}/100.`,
  (c) => `🧩 Hiciste la feature que pedían todos los clientes. Ahora piden otra. Producto ${c.prod}/100.`,
];

const RECHAZOS = [
  "🙅 'Nos encanta, pero es muy temprano para nosotros'. Te lo dijeron en inglés y dolió igual.",
  "📧 El fondo te contestó con un mail automático: 'We'll keep in touch'. Spoiler: no.",
  "🤷 Te preguntaron tu CAC, tu LTV y tu TAM. Respondiste 'mate' las tres veces.",
  "🙈 Arrancaste el pitch con el PowerPoint equivocado: el del cumple de 15 de tu prima.",
  "😩 'Volvé cuando tengas más tracción'. Tracción tiene la 4x4 de tu tío, no vos.",
  "📉 'El mercado está complicado', te dijo un fondo con más plata que el Banco Central.",
];

function vender(s, lines) {
  const e = s.empresa;
  let n = (20 + s.stats.network * 1.5 + e.producto * 2 + e.empleados * 15) * mercadoMult(s, "ventas") * rand(0.6, 1.4);
  const atado = e.exclusividadHasta > s.week;
  if (atado) n *= 0.5;
  const nuevos = Math.max(0, Math.round(n));
  const pagos = sumarUsuarios(s, nuevos);
  fx(s, { network: 2, energy: -10, mental: -4, xp: 2 });
  lines.push(pick(VENDER)({ n: nuevos, p: pagos }));
  if (atado) lines.push("📜 La exclusividad te ata las manos: vendiste la mitad.");
  checkHitos(s, lines);
}

function mejorarProducto(s, lines) {
  const e = s.empresa;
  const antes = e.producto;
  e.producto = Math.min(100, e.producto + Math.round(s.stats.logic / 8 + 3 + e.empleados * 2));
  e.bugs = Math.max(0, e.bugs - randInt(2, 4) - Math.ceil(e.empleados / 2));
  fx(s, { logic: 2, energy: -12, mental: -5, xp: 3 });
  lines.push(
    antes >= 100
      ? "🛠️ El producto ya está pulido (100/100): fue una semana de deuda técnica y bugs."
      : pick(PRODUCTO)({ m: e.producto - antes, prod: e.producto })
  );
}

function cerrarRonda(s, lines, datos = {}) {
  const e = s.empresa;
  const etapa = RONDAS[etapaIdx(s)];
  const monto = datos.montoUsd ?? Math.round(rand(etapa.min, etapa.max) / 5000) * 5000;
  const cedida = datos.cedida ?? randInt(10, 25);
  const inversor = datos.inversor ?? pick(INVERSORES);
  const valuacionUsd = Math.round((monto * 100) / cedida);
  e.capital += Math.round(monto * s.dolar);
  e.equity = Math.round(e.equity * (1 - cedida / 100));
  e.rondas.push({ semana: s.week, etapa: etapaIdx(s), nombre: datos.nombre || etapa.nombre, montoUsd: monto, equityCedida: cedida, inversor, valuacionUsd });
  e.valuacionUsd = valuar(s);
  lines.push(
    `💸 ¡Ronda ${datos.nombre || etapa.nombre} cerrada! ${cap(inversor)} puso ${fmtUsd(monto)} por el ${cedida}% de ${e.nombre}. Valuación: ${fmtUsd(valuacionUsd)}.`
  );
  if (!e.hitos.includes("Primera ronda")) {
    e.hitos.push("Primera ronda");
    sumarReputacion(s, 2, lines, "primera ronda");
  }
}

function buscarInversores(s, lines) {
  fx(s, { energy: -8, mental: -6, xp: 1 });
  if (!rondaDisponible(s)) {
    fx(s, { network: 2 });
    lines.push("📅 'Volvé cuando pases de etapa', te dijeron todos: ya levantaste plata en esta. Al menos sumaste contactos.");
    return;
  }
  if (esperaRonda(s) > 0) {
    fx(s, { network: 2 });
    lines.push("📅 Los fondos te dijeron 'hablemos en un par de meses': ya pusieron plata hace poco. Al menos sumaste contactos.");
    return;
  }
  if (chance(chanceRonda(s))) cerrarRonda(s, lines);
  else lines.push(pick(RECHAZOS));
}

// El motor la llama antes de su propio foco: true si la manejó (vender / producto / inversores)
export function applyFocusEmpresa(s, focus, lines) {
  if (!s.empresa || !FOCUS_EMPRESA[focus]) return false;
  completarEmpresa(s.empresa);
  if (focus === "vender") vender(s, lines);
  else if (focus === "producto") mejorarProducto(s, lines);
  else buscarInversores(s, lines);
  return true;
}

const CONTRATAR = [
  (e) => `🤝 Sumaste a alguien al equipo de ${e.nombre}. Ya son ${e.empleados} (y una cafetera).`,
  (e) => `🤝 Contrataste a un dev que dijo "sé de todo". Equipo: ${e.empleados}.`,
  (e) => `🤝 Nueva incorporación: viene de un banco y todavía pide permiso para ir al baño. Equipo: ${e.empleados}.`,
];

const DESPEDIR = [
  "💢 Tuviste que despedir a alguien. Te dijo 'no sos vos, es la empresa'. Eras vos.",
  "💢 Despediste a un dev por Zoom. Se le congeló la cara justo en la peor parte.",
  "💢 Achicaste el equipo. La moral bajó y ahora sobra una silla gamer.",
];

export function puedeContratar(s) {
  const e = s && s.empresa;
  if (!e) return { ok: false, motivo: "No tenés empresa.", costo: 0 };
  const costo = sueldoEmpleado(s);
  if (e.empleados >= MAX_EMPLEADOS) return { ok: false, motivo: "No entra nadie más: ya hay gente laburando en la cocina.", costo };
  if (e.capital < costo * 2) return { ok: false, motivo: `Necesitás ${fmtArs(costo * 2)} en caja (dos sueldos).`, costo };
  return { ok: true, motivo: null, costo };
}

export function contratar(state) {
  if (!puedeContratar(state).ok) return state;
  const s = start(state);
  const e = completarEmpresa(s.empresa);
  e.empleados += 1;
  e.moral = clamp(e.moral + 3);
  return toast(s, `${pick(CONTRATAR)(e)} Sueldo: ${fmtArs(sueldoEmpleado(s))}/mes.`, "good");
}

export function despedir(state) {
  if (!state.empresa || !(state.empresa.empleados > 0)) return state;
  const s = start(state);
  const e = completarEmpresa(s.empresa);
  const indemnizacion = sueldoEmpleado(s);
  e.empleados -= 1;
  e.capital -= indemnizacion;
  e.moral = clamp(e.moral - 10);
  fx(s, { mental: -3 });
  return toast(s, `${pick(DESPEDIR)} Indemnización: ${fmtArs(indemnizacion)}.`, "bad");
}

// Saca de la cola los eventos que solo tienen sentido con empresa
function limpiarColaEmpresa(s) {
  s.queue = (s.queue || []).filter((id) => !EVENTOS_DE_EMPRESA.includes(id));
}

// Lo que te llevás si cerrás: los inversores cobran primero (preferencia 1x) y a vos te toca tu parte de lo que sobre
export function retornoCierre(s) {
  const e = s && s.empresa;
  if (!e) return 0;
  const invertido = (e.rondas || []).reduce((acc, r) => acc + (r.montoUsd || 0), 0) * s.dolar;
  return Math.max(0, Math.round((Math.max(0, e.capital || 0) - invertido) * ((e.equity ?? 100) / 100)));
}

// Con menos de esto, cerrar no cuenta como experiencia de fundador (ni da contactos)
const SEMANAS_FUNDADOR = 12;

export function cerrarEmpresa(state) {
  if (!state.empresa) return state;
  const s = start(state);
  const e = s.empresa;
  // Cerrar con la caja en rojo es quebrar: no hay atajo para esquivar la quiebra
  if ((e.capital || 0) < 0) {
    quebrar(s, [], e);
    return toast(s, `🥀 Cerraste ${e.nombre} con la caja en rojo: eso es una quiebra, con reputación y salud mental incluidas.`, "bad");
  }
  const vuelve = retornoCierre(s);
  if (vuelve) fx(s, { ars: vuelve });
  const semanas = Math.max(0, s.week - (e.semana || s.week));
  const cuenta = semanas >= SEMANAS_FUNDADOR;
  const conInversores = (e.rondas || []).length > 0;
  cerrarHistorial(s, "cerró", true);
  s.empresa = null;
  if (cuenta) {
    s.carrera.exFundador = true;
    s.searchBonus = 25;
    fx(s, { network: 5 });
  }
  limpiarColaEmpresa(s);
  const base = vuelve
    ? `🚪 Cerraste ${e.nombre}. Recuperaste ${fmtArs(vuelve)}${conInversores ? " (los inversores cobraron primero)" : ""} y la frase "aprendí un montón" para LinkedIn.`
    : `🚪 Cerraste ${e.nombre} sin un peso para vos${conInversores ? ": la caja se la llevaron los inversores" : ""}. Te quedó el buzo con el logo y muchas anécdotas.`;
  const extra = cuenta ? "" : ` Duró ${semanas} semanas: todavía no cuenta como experiencia de fundador.`;
  return toast(s, base + extra, vuelve ? "good" : "bad");
}

export function kpisEmpresa(s) {
  const e = s && s.empresa;
  if (!e) return null;
  const burnMensual = burnEmpresa(s);
  const ingresoMensual = e.mrr || 0;
  const runwayMeses =
    ingresoMensual >= burnMensual ? Infinity : Math.floor((Math.max(0, e.capital) / (burnMensual - ingresoMensual)) * 10) / 10;
  const idx = etapaIdx(s);
  return {
    burnMensual,
    ingresoMensual,
    runwayMeses,
    valuacionUsd: e.valuacionUsd || 0,
    equityPct: e.equity,
    etapa: ETAPAS[idx],
    etapaIdx: idx,
    mrrUsd: Math.round(ingresoMensual / s.dolar),
    chanceRonda: chanceRonda(s),
    esperaRonda: esperaRonda(s),
    rondaDisponible: rondaDisponible(s),
    compradores: idx >= ETAPA_COMPRA && (e.valuacionUsd || 0) >= UMBRAL_COMPRA,
    sueldoFundador: sueldoFundador(s),
    sueldoEmpleado: sueldoEmpleado(s),
  };
}

// ---------- Ganchos del motor ----------
function startupWeekly(s, focus, lines) {
  const e = completarEmpresa(s.empresa);
  // Si sacaste la caja del rojo (rescate, ronda, ventas), el contador de quiebra vuelve a cero
  if (e.capital >= 0) e.mesesEnRojo = 0;
  e.moral = clamp(Math.round(e.moral + (60 - e.moral) * 0.1));
  if (e.empleados > 0 && chance(0.35)) e.bugs += 1;
  if (focus !== "producto" && e.usuarios >= 1000 && chance(0.2)) e.bugs += 1;
  if (e.usuarios > 0 && e.bugs <= 5) {
    // Boca en boca: si el producto es bueno, la gente lo recomienda sola
    sumarUsuarios(s, e.usuarios * (e.producto / 100) * BOCA_EN_BOCA * mercadoMult(s, "ventas") * rand(0.5, 1.5));
  }
  if (e.bugs > 5 && e.usuarios > 0) {
    const perdidos = perderUsuarios(s, rand(0.01, 0.03));
    if (perdidos > 0 && chance(0.5)) lines.push(`🐞 Los bugs espantan gente: se fueron ${num(perdidos)} usuarios de ${e.nombre}.`);
  }
  if (e.moral < 30 && e.empleados > 0 && chance(0.2)) {
    e.empleados -= 1;
    lines.push("🚪 Con la moral por el piso, alguien del equipo renunció por mail. Asunto: 'nuevos desafíos'.");
  }
}

export function carreraWeekly(s, focus, lines) {
  const c = ensureCarrera(s);
  if (s.empresa === undefined) s.empresa = null;
  // Mercado: cadena de Markov (normal <-> boom / crisis)
  c.mercadoSemanas += 1;
  if (c.mercadoSemanas >= 6 && chance(0.06)) {
    cambiarMercado(s, c.mercado === "normal" ? (chance(0.5) ? "boom" : "crisis") : "normal", lines);
  }
  if (s.job && !s.job.tipo) migrarJob(s);
  sincronizarHistorial(s);
  // Oferta externa pasiva: los recruiters te encuentran solos
  if (s.job && !s.empresa && !s.queue.length && !s.pending && !s.offer && s.phase !== 4 && !s.interview) {
    const p = (0.03 + s.stats.network / 700) * mercadoMult(s, "ofertas") * (c.saltos >= 3 ? 0.5 : 1);
    if (chance(p)) {
      makeOffer(s, nivelSalto(s, 0.25), 1.1, { externa: true });
      s.queue.push("oferta_externa");
      lines.push("📩 Un recruiter te escribió por privado: 'tengo una propuesta que te puede interesar'.");
    }
  }
  if (s.empresa) startupWeekly(s, focus, lines);
}

function startupMonthly(s, lines) {
  const e = completarEmpresa(s.empresa);
  actualizarMrr(s); // el ticket sigue a la inflación
  const ingreso = e.mrr;
  const base = burnEmpresa(s, false);
  const sueldoF = sueldoFundador(s);
  const pagaFundador = sueldoF > 0 && e.capital + ingreso - base >= sueldoF;
  const burn = base + (pagaFundador ? sueldoF : 0);
  e.capital = Math.round(e.capital + ingreso - burn);
  if (pagaFundador) fx(s, { ars: sueldoF });
  lines.push(
    `💼 ${e.nombre}: entraron ${fmtArs(ingreso)} y salieron ${fmtArs(burn)}${pagaFundador ? " (con tu sueldo de fundador)" : ""}. Caja: ${fmtArs(e.capital)}.`
  );
  if (sueldoF > 0 && !pagaFundador) lines.push("💸 Este mes no te pagaste sueldo: la caja no da.");
  // Churn: siempre hay alguien que se va (si no vendés, te achicás)
  const perdidos = e.usuarios > 0 ? perderUsuarios(s, rand(CHURN_MES[0], CHURN_MES[1])) : 0;
  if (perdidos >= 50) lines.push(`📉 Churn del mes: se fueron ${num(perdidos)} usuarios. Alguno volvió al Excel.`);
  // Tracción: crecimiento de usuarios mes a mes (suavizado)
  const prev = e.usuariosMesAnterior || 0;
  const crec = (e.usuarios - prev) / Math.max(prev, 500);
  e.traccion = clamp(Math.round(e.traccion * 0.5 + Math.min(100, Math.max(0, crec * 100)) * 0.5));
  e.usuariosMesAnterior = e.usuarios;
  e.hype = 1 + ((e.hype || 1) - 1) * 0.85;
  e.valuacionUsd = valuar(s);
  checkHitos(s, lines);
  const enCola = (id) => s.queue.includes(id) || (!!s.pending && (s.pending.id === id || s.pending.eventId === id));
  if (e.capital < 0) {
    // Primer mes en rojo: aviso con rescates. Segundo mes seguido: los acreedores piden la quiebra (nada de empresas zombie)
    e.mesesEnRojo = (e.mesesEnRojo || 0) + 1;
    if (e.mesesEnRojo >= 2) {
      lines.push(`⚖️ Segundo mes seguido en rojo: los acreedores pidieron la quiebra de ${e.nombre}.`);
      quebrar(s, lines, e);
      return;
    }
    if (!enCola("quiebra_empresa")) {
      s.queue.push("quiebra_empresa");
      lines.push(`🚨 La caja de ${e.nombre} está en rojo. Si el mes que viene sigue así, quebrás.`);
    }
    return;
  }
  e.mesesEnRojo = 0;
  if (
    etapaIdx(s) >= ETAPA_COMPRA &&
    e.valuacionUsd >= UMBRAL_COMPRA &&
    !e.ofertaCompra &&
    !enCola("oferta_compra") &&
    chance(Math.min(0.5, CHANCE_COMPRA * mercadoMult(s, "inversion")))
  ) {
    e.ofertaCompra = { comprador: pick(COMPRADORES), montoUsd: Math.round(e.valuacionUsd * rand(0.8, 1.3)), semana: s.week };
    s.queue.push("oferta_compra");
    lines.push(`📩 Llegó un mail con asunto "Propuesta confidencial" para ${e.nombre}. Abrilo sentado.`);
  }
}

export function carreraMonthly(s, lines) {
  ensureCarrera(s);
  if (s.job) sumarReputacion(s, 1);
  if (s.empresa) startupMonthly(s, lines);
}

// Requisitos extra de carrera para que te busque la Big Tech
export function nivelBigTechListo(s) {
  const c = s.carrera || defaultCarrera();
  const t = tipoJob(s);
  const faltan = [];
  if (c.reputacion < 40) faltan.push(`Reputación 40+ (tenés ${c.reputacion}).`);
  if (c.mercado === "crisis") faltan.push("Que pase la crisis: Big Tech congeló las contrataciones.");
  if (s.empresa) {
    faltan.push("Vender o cerrar tu startup: Big Tech no contrata a alguien con una empresa propia en marcha.");
  } else if (!((t && t.prestigio >= 1) || c.exFundador)) {
    faltan.push("Laburar en una empresa con prestigio (no Factory ni Estado) o haber fundado una empresa.");
  }
  return { ok: faltan.length === 0, faltan };
}

// ---------- Eventos ----------
const sinEmpresa = (lines) => lines.push("🤷 Para cuando lo ibas a resolver, ya no tenías empresa. Problema de otro.");
const sinLaburo = (lines) => lines.push("🤷 Para cuando lo ibas a resolver, ya no laburabas ahí. Problema de otro.");

// Tareas de "meterse en el sistema": los roles técnicos usan la terminal; PM y Soporte, un minijuego de su rol
const ROLES_TECNICOS = ["frontend", "backend", "devops", "security", "data", "qa"];
const minijuegoTecnico = (s) => (ROLES_TECNICOS.includes(s.role) ? "terminal" : roleMinigame(s));

// Envuelve un handler para que corra solo si hay empresa
const conEmpresa = (fn) => (s, lines) => (s.empresa ? fn(s, lines, completarEmpresa(s.empresa)) : sinEmpresa(lines));
const conLaburo = (fn) => (s, lines) => (s.job ? fn(s, lines, s.job) : sinLaburo(lines));

function venderEmpresa(s, lines) {
  const e = s.empresa;
  const o = e && e.ofertaCompra;
  if (!o) {
    lines.push("🤷 Cuando fuiste a firmar, el comprador ya se había ido con otra startup. Clásico.");
    return;
  }
  const c = ensureCarrera(s);
  const payout = Math.round((o.montoUsd * e.equity) / 100);
  fx(s, { usd: payout, mental: 20 });
  lines.push(`🏆 ¡EXIT! Vendiste ${e.nombre} a ${o.comprador} por ${fmtUsd(o.montoUsd)}. Con tu ${e.equity}% te llevás ${fmtUsd(payout)}.`);
  sumarReputacion(s, 12, lines, "exit");
  c.exFundador = true;
  cerrarHistorial(s, "exit", true);
  s.victory = { tipo: "exit", company: e.nombre, comprador: o.comprador, montoUsd: payout, week: s.week, score: 0 };
  s.empresa = null;
  limpiarColaEmpresa(s);
}

function seguirCreciendo(s, lines, e) {
  e.ofertaCompra = null;
  if (chance(0.5)) {
    subirHype(e, 1.5);
    e.valuacionUsd = valuar(s);
    fx(s, { mental: 4 });
    lines.push(`📈 Apostaste y salió: el rumor de la compra subió todo. ${e.nombre} ahora vale ${fmtUsd(e.valuacionUsd)}.`);
  } else {
    subirHype(e, 0.6);
    e.valuacionUsd = valuar(s);
    fx(s, { mental: -6 });
    lines.push(`📉 Se enfrió: el comprador se fue y los fondos se asustaron. ${e.nombre} ahora vale ${fmtUsd(e.valuacionUsd)}.`);
  }
}

function quebrar(s, lines, e) {
  const c = ensureCarrera(s);
  c.quiebras += 1;
  c.exFundador = true;
  cerrarHistorial(s, "quiebra", true);
  s.empresa = null;
  s.searchBonus = 25;
  limpiarColaEmpresa(s);
  fx(s, { mental: -15 });
  lines.push(`🥀 Bajaste la persiana de ${e.nombre}. Vendiste las sillas gamer y te quedó un post de LinkedIn sobre "el fracaso como aprendizaje".`);
  sumarReputacion(s, -8, lines, "quiebra");
}

const multaArca = (s) => price(s, 350000) + Math.round((s.empresa ? s.empresa.mrr : 0) * 0.4);
const montoJuicio = (s) => sueldoEmpleado(s) * 3;
const costoNube = (s) => {
  const e = s.empresa;
  return e ? Math.round(s.dolar * (150 + e.usuarios * 0.03 + e.empleados * 40)) : 0;
};
const montoExclusividad = (s) => Math.round(((s.empresa ? s.empresa.mrr : 0) * 0.3 + price(s, 300000)) / 1000) * 1000;
const pagosClienteGrande = (e) => Math.round(15 + e.producto * 0.35);

// El inversor del 80%: el monto sale del estado para que el texto y la opción coincidan
function oferta80(s) {
  const e = s.empresa;
  const base = Math.max(60000, (e ? e.valuacionUsd : 0) * 0.3);
  return { montoUsd: Math.round(base / 5000) * 5000, inversor: INVERSORES[(s.week + (e ? e.semana : 0)) % INVERSORES.length] };
}

const BASE_EVENTS = {
  oferta_externa: {
    title: "📩 Oferta por lo bajo",
    text: (s) => {
      const o = s.offer;
      if (!o) return "La oferta se esfumó: el recruiter cambió de laburo antes que vos.";
      let t = `${describirOferta(o)}.`;
      if (o.pitch) t += ` El recruiter jura: "${o.pitch}"`;
      if (o.perks && o.perks.length) t += ` Perks: ${o.perks.join(" · ")}.`;
      if (s.job) {
        const ant = antiguedad(s);
        t += ` Hoy estás en ${s.job.company} cobrando ${sueldoTxt(s.job)} hace ${semanasTxt(ant)}.`;
        if (ant < 24) t += " Ojo: si te vas antes de las 24 semanas, cuenta como salto.";
      }
      return t;
    },
    options: [
      {
        label: "✍️ Aceptar y renunciar",
        desc: "Cambiás de laburo. Con menos de 24 semanas de antigüedad, cuenta como salto.",
        run: (s, lines) => acceptOffer(s, lines),
      },
      {
        label: "🤝 Usarla para negociar",
        desc: "Chance de un aumento del 10-20% para quedarte (solo si tu último aumento fue hace 12 semanas o más). Si sale mal, te marcan.",
        run: (s, lines) => negociarConJefe(s, lines),
      },
      {
        label: "🙅 Rechazar",
        desc: "Te quedás donde estás. +Salud mental.",
        run: (s, lines) => {
          s.offer = null;
          fx(s, { mental: 2 });
          lines.push("🙅 Rechazaste la oferta con un 'gracias, por ahora estoy bien'. El recruiter te va a escribir igual en seis meses.");
        },
      },
    ],
  },

  oferta_compra: {
    title: "💰 Te quieren comprar la empresa",
    text: (s) => {
      const e = s.empresa;
      const o = e && e.ofertaCompra;
      if (!o) return "La oferta de compra se cayó: el comprador encontró otra startup con un logo más lindo.";
      const payout = Math.round((o.montoUsd * e.equity) / 100);
      return `${cap(o.comprador)} ofrece ${fmtUsd(o.montoUsd)} por ${e.nombre}. Con tu ${e.equity}% te llevás ${fmtUsd(payout)}. ¿Vendés y te vas a vivir a la costa, o seguís creciendo?`;
    },
    options: [
      { label: "🏆 Vender: ¡EXIT!", desc: "Ganás la partida: dólares en la cuenta y foto en LinkedIn.", run: venderEmpresa },
      {
        label: "🚀 Seguir creciendo",
        desc: "50%: la valuación sube. 50%: el mercado se enfría.",
        run: conEmpresa((s, lines, e) => seguirCreciendo(s, lines, e)),
      },
    ],
  },

  quiebra_empresa: {
    title: "🚨 Tu empresa está en rojo",
    text: (s) => {
      const e = s.empresa;
      if (!e) return "Había una empresa en rojo, pero ya no es tuya.";
      const abuela = s.fin && s.fin.abuela > 0 ? `La abuela tiene ${fmtArs(s.fin.abuela)} ahorrados.` : "La abuela no tiene un peso (ya sabés por qué).";
      const colchon = s.usd > 0 ? `En el colchón hay ${fmtUsd(s.usd)}.` : "El colchón está vacío.";
      return `La caja de ${e.nombre} está en ${fmtArs(e.capital)}. Los proveedores llaman, el equipo pregunta por el sueldo y el contador no atiende. Si el próximo cierre de mes sigue en rojo, los acreedores piden la quiebra. ${abuela} ${colchon}`;
    },
    options: [
      {
        label: "👵 Pedirle a la abuela",
        desc: "Toda su jubilación a la caja. Le quedás debiendo (y ella no se olvida).",
        run: conEmpresa((s, lines, e) => {
          const fin = ensureFin(s);
          const monto = Math.max(0, Math.round(fin.abuela || 0));
          if (monto <= 0) {
            fx(s, { mental: -3 });
            lines.push("👵 La abuela abrió la lata de galletitas: había botones. No queda nada para prestarte.");
            return;
          }
          e.capital += monto;
          fin.deudaAbuela += monto;
          fin.abuela = 0;
          lines.push(`👵 La abuela te dio ${fmtArs(monto)} "para el emprendimiento". En el grupo de la familia ya lo saben todos.`);
          if (e.capital < 0) lines.push(`🚨 Igual la caja sigue en ${fmtArs(e.capital)}. Si el mes que viene sigue en rojo, quebrás.`);
        }),
      },
      {
        label: "💵 Vender los dólares del colchón",
        desc: "Todos tus verdes a la caja de la empresa.",
        run: conEmpresa((s, lines, e) => {
          const usd = Math.max(0, Math.floor(s.usd));
          if (usd <= 0) {
            fx(s, { mental: -3 });
            lines.push("💵 Levantaste el colchón: había una media sola y un caramelo. No hay dólares.");
            return;
          }
          const ars = Math.round(usd * s.dolar);
          fx(s, { usd: -usd });
          e.capital += ars;
          lines.push(`💵 Vendiste ${fmtUsd(usd)} y metiste ${fmtArs(ars)} en la empresa. Tu abuelo, desde el cielo, no lo puede creer.`);
          if (e.capital < 0) lines.push(`🚨 Igual la caja sigue en ${fmtArs(e.capital)}. Si el mes que viene sigue en rojo, quebrás.`);
        }),
      },
      {
        label: "🥀 Bajar la persiana",
        desc: "Perdés la empresa, reputación y salud mental. Ganás experiencia.",
        run: conEmpresa((s, lines, e) => quebrar(s, lines, e)),
      },
    ],
  },
};

// Eventos aleatorios de fundador (todos chequean que la empresa siga existiendo)
const FUNDADOR_EVENTS = {
  emp_lanzamiento: {
    title: "🔥 Se cayó el server en pleno lanzamiento",
    text: (s) =>
      s.empresa
        ? `Hoy lanzabas la versión nueva de ${s.empresa.nombre} y el server dijo basta. Hay ${num(s.empresa.usuarios)} usuarios mirando una pantalla blanca y un tweet que dice "¿y esto?".`
        : "Se cayó un server, pero ya no es tu problema.",
    options: [
      {
        label: "🛠️ Levantarlo vos desde la consola",
        desc: "Si sale, el lanzamiento explota (para bien).",
        minigame: (s) => roleMinigame(s),
        onWin: conEmpresa((s, lines, e) => {
          sumarUsuarios(s, 100 + e.producto * 3 + e.usuarios * 0.06);
          subirHype(e, 1.1);
          fx(s, { xp: 3, network: 3 });
          lines.push(`🚀 Lo levantaste en 12 minutos y lo contaste en un hilo épico. ${e.nombre} ya tiene ${num(e.usuarios)} usuarios.`);
          sumarReputacion(s, 1);
        }),
        onLose: conEmpresa((s, lines, e) => {
          const perdidos = perderUsuarios(s, 0.1);
          e.bugs += 3;
          fx(s, { mental: -8 });
          lines.push(`🔥 Estuvo caído toda la tarde. Se fueron ${num(perdidos)} usuarios y el post-mortem lo escribiste vos.`);
        }),
      },
      {
        label: "🙏 Rezarle a la nube y esperar",
        desc: "A veces vuelve solo. A veces no.",
        run: conEmpresa((s, lines, e) => {
          if (chance(0.4)) {
            sumarUsuarios(s, 60 + e.producto);
            lines.push("🙏 Volvió solo a los 20 minutos. Nadie sabe por qué, y es mejor no preguntar.");
          } else {
            const perdidos = perderUsuarios(s, 0.15);
            fx(s, { mental: -5 });
            lines.push(`🙏 La nube no escuchó tus plegarias: se fueron ${num(perdidos)} usuarios.`);
          }
        }),
      },
    ],
  },

  emp_inversor_80: {
    title: "💸 Un inversor quiere el 80% de tu empresa",
    text: (s) => {
      if (!s.empresa) return "Un inversor quería tu empresa, pero llegó tarde.";
      const o = oferta80(s);
      return `${cap(o.inversor)} te ofrece ${fmtUsd(o.montoUsd)} por el 80% de ${s.empresa.nombre}. Dice que es "smart money". Lo de smart está por verse.`;
    },
    options: [
      {
        label: "✍️ Firmar: plata ya",
        desc: "Mucha caja, poco equity. Volvés a tener jefe.",
        run: conEmpresa((s, lines) => {
          const o = oferta80(s);
          cerrarRonda(s, lines, { montoUsd: o.montoUsd, cedida: 80, inversor: o.inversor, nombre: "salvavidas" });
          fx(s, { mental: -6 });
          lines.push("💢 Firmaste. En la primera reunión de directorio te preguntaron por qué tu sueldo es tan alto.");
        }),
      },
      {
        label: "🤝 Contraofertar: 20% y ni un punto más",
        desc: "Con contactos y tracción, capaz acepta.",
        run: conEmpresa((s, lines, e) => {
          const o = oferta80(s);
          if (chance(0.25 + s.stats.network / 250 + e.traccion / 300)) {
            const monto = Math.max(20000, Math.round((o.montoUsd * 0.3) / 5000) * 5000);
            cerrarRonda(s, lines, { montoUsd: monto, cedida: 20, inversor: o.inversor });
            fx(s, { network: 3 });
          } else {
            fx(s, { network: 1 });
            lines.push("🤝 Se levantó de la mesa diciendo 'ustedes los founders son todos iguales'. Pagaste los cafés.");
          }
        }),
      },
      {
        label: "🙅 Mandarlo a freír churros",
        desc: "Tu empresa, tus reglas. +Salud mental.",
        run: conEmpresa((s, lines) => {
          fx(s, { mental: 4 });
          lines.push("🙅 Le dijiste que no con una sonrisa. Por dentro, gritaste.");
        }),
      },
    ],
  },

  emp_meli_feature: {
    title: "📦 Mercado Libre lanzó tu misma feature",
    text: (s) =>
      s.empresa
        ? `Te levantaste y Mercado Libre había lanzado exactamente lo que hace ${s.empresa.nombre}, pero con envío gratis y cuotas. Tus ${num(s.empresa.usuarios)} usuarios ya están comparando.`
        : "Mercado Libre lanzó algo, pero ya no te afecta.",
    options: [
      {
        label: "🔄 Pivotear",
        desc: "Cambiás de idea: perdés algo de producto y usuarios, pero los inversores aman un pivot.",
        run: conEmpresa((s, lines, e) => {
          e.idea = pick(IDEAS.filter((i) => i !== e.idea));
          e.producto = Math.max(10, Math.round(e.producto * 0.6));
          perderUsuarios(s, 0.3);
          subirHype(e, 1.2);
          fx(s, { mental: -4, xp: 2 });
          lines.push(`🔄 Pivotearon: ahora ${e.nombre} es "${e.idea}". En LinkedIn lo llamaste "evolución estratégica".`);
        }),
      },
      {
        label: "💪 Competir con mejor producto",
        desc: "Si tu producto es bueno, ganás. Si no, te pasan por arriba.",
        run: conEmpresa((s, lines, e) => {
          if (chance(0.1 + e.producto / 120)) {
            sumarUsuarios(s, e.usuarios * 0.1 + 100);
            subirHype(e, 1.1);
            lines.push("💪 Los usuarios dijeron que lo tuyo anda mejor. Un gigante te copió y perdió. Captura y a enmarcarla.");
            sumarReputacion(s, 2, lines, "le ganaste a un gigante");
          } else {
            const perdidos = perderUsuarios(s, 0.25);
            fx(s, { mental: -6 });
            lines.push(`📦 Envío gratis le ganó a tu producto: se fueron ${num(perdidos)} usuarios.`);
          }
        }),
      },
      {
        label: "🤝 Ofrecerte como proveedor",
        desc: "Si los convencés, te vuelven cliente.",
        run: conEmpresa((s, lines) => {
          if (chance(0.2 + s.stats.network / 200)) {
            const p = sumarPagos(s, randInt(15, 40));
            lines.push(`🤝 Te contrataron como proveedor: equivale a ${num(p)} clientes que pagan. Pagan a 120 días, pero pagan.`);
          } else {
            fx(s, { mental: -2 });
            lines.push("📧 Te pidieron que cargues tu propuesta en un portal de proveedores. El portal da error 500.");
          }
        }),
      },
    ],
  },

  emp_arca: {
    title: "🧾 Inspección de ARCA en tu empresa",
    text: (s) =>
      s.empresa
        ? `Llegó una intimación de ARCA: ${s.empresa.nombre} debe ${fmtArs(multaArca(s))} por un formulario que no sabías que existía. El contador dice "tranqui" y deja de atender.`
        : "ARCA intimó a una empresa que ya no es tuya. Por una vez, no es tu problema.",
    options: [
      {
        label: "💳 Pagar y que no jodan más",
        desc: "Sale de la caja de la empresa.",
        run: conEmpresa((s, lines, e) => {
          const multa = multaArca(s);
          e.capital -= multa;
          fx(s, { mental: -2 });
          lines.push(`💳 Pagaste ${fmtArs(multa)}. Te llegó el comprobante y otra intimación por no haber pagado antes.`);
        }),
      },
      {
        label: "⌨️ Buscar las facturas en el sistema",
        desc: "Si las encontrás, no pagás nada. Si no, la multa sale doble.",
        minigame: minijuegoTecnico,
        onWin: conEmpresa((s, lines) => {
          fx(s, { xp: 2, mental: 3 });
          lines.push("⌨️ Encontraste las facturas en /home/contador/final_FINAL_v3. ARCA archivó el expediente.");
        }),
        onLose: conEmpresa((s, lines, e) => {
          const multa = multaArca(s) * 2;
          e.capital -= multa;
          fx(s, { mental: -6 });
          lines.push(`🧾 No las encontraste. Multa doble: ${fmtArs(multa)}. El contador sigue sin atender.`);
        }),
      },
      {
        label: "🙈 Hacerte el distraído",
        desc: "Capaz se olvidan. Capaz te triplican la multa.",
        run: conEmpresa((s, lines, e) => {
          if (chance(0.3)) {
            fx(s, { mental: 2 });
            lines.push("🙈 Cambió el gobierno y se perdió el expediente. A veces la burocracia juega para vos.");
          } else {
            const multa = multaArca(s) * 3;
            e.capital -= multa;
            fx(s, { mental: -8 });
            lines.push(`🧾 No se olvidaron: multa triple con intereses. ${fmtArs(multa)} menos en la caja.`);
          }
        }),
      },
    ],
  },

  emp_cliente_grande: {
    title: "🛒 Un cliente grande quiere tu producto",
    text: (s) =>
      s.empresa
        ? `Una cadena de supermercados quiere usar ${s.empresa.nombre} en 300 sucursales. Piden descuento, factura A y una demo mañana a las 8.`
        : "Un cliente grande te buscaba, pero ya no tenés empresa.",
    options: [
      {
        label: "🎯 Hacer la demo en vivo",
        desc: "Si sale bien, firman a precio full.",
        minigame: (s) => roleMinigame(s),
        onWin: conEmpresa((s, lines, e) => {
          const p = sumarPagos(s, pagosClienteGrande(e));
          sumarUsuarios(s, 250);
          lines.push(`🎯 La demo salió perfecta (hasta el wifi anduvo). Firmaron: equivale a ${num(p)} clientes que pagan.`);
          sumarReputacion(s, 2, lines, "cliente grande");
        }),
        onLose: conEmpresa((s, lines, e) => {
          subirHype(e, 0.95);
          fx(s, { mental: -6 });
          lines.push("🔥 La demo se colgó en el login. El gerente dijo 'cualquier cosa los llamamos'. No van a llamar.");
        }),
      },
      {
        label: "💸 Darles 50% de descuento",
        desc: "Firman seguro, pero cobrás la mitad.",
        run: conEmpresa((s, lines, e) => {
          const p = sumarPagos(s, pagosClienteGrande(e) * 0.5);
          lines.push(`💸 Firmaron con descuento: equivale a ${num(p)} clientes que pagan. Te pidieron soporte 24/7 'porque son grandes'.`);
        }),
      },
      {
        label: "🙅 'No hacemos factura A'",
        desc: "Te quedás como estás.",
        run: conEmpresa((s, lines) => {
          fx(s, { mental: 1 });
          lines.push("🙅 Les dijiste que sos monotributista. Se rieron, pero con cariño.");
        }),
      },
    ],
  },

  emp_tweet_viral: {
    title: "📢 Tu tweet sobre la empresa se hizo viral",
    text: (s) =>
      s.empresa
        ? `Publicaste "armé ${s.empresa.nombre} en un finde con mate y Stack Overflow" y explotó: dos millones de vistas. El server tiembla.`
        : "Tu tweet se hizo viral, pero hablaba de una empresa que ya no tenés.",
    options: [
      {
        label: "🖥️ Escalar los servers a tiempo",
        desc: "Si aguanta, llueven usuarios.",
        minigame: "servers",
        onWin: conEmpresa((s, lines, e) => {
          sumarUsuarios(s, 300 + s.stats.network * 5 + e.usuarios * 0.1);
          subirHype(e, 1.15);
          lines.push(`📢 Aguantó todo. ${e.nombre} ya tiene ${num(e.usuarios)} usuarios y tu vieja te pidió que le expliques qué es un tweet.`);
        }),
        onLose: conEmpresa((s, lines, e) => {
          sumarUsuarios(s, 150);
          e.bugs += 3;
          fx(s, { mental: -4 });
          lines.push("🔥 Se cayó todo. Ahora sos viral como 'la app que no anda'. Algo es algo.");
        }),
      },
      {
        label: "📢 Surfear la ola sin tocar nada",
        desc: "Puede salir bárbaro o romperse todo.",
        run: conEmpresa((s, lines, e) => {
          if (chance(0.5)) {
            sumarUsuarios(s, 200 + e.usuarios * 0.06);
            lines.push(`📢 La ola te llevó: ${e.nombre} ya tiene ${num(e.usuarios)} usuarios.`);
          } else {
            e.bugs += 4;
            fx(s, { mental: -5 });
            lines.push("🔥 El server no aguantó. Tenés capturas de error 502 en todos los grupos de WhatsApp.");
          }
        }),
      },
      {
        label: "🙈 Borrar el tweet por las dudas",
        desc: "Paz mental. Cero usuarios.",
        run: conEmpresa((s, lines) => {
          fx(s, { mental: 2 });
          lines.push("🙈 Lo borraste. Alguien ya le había sacado captura y ahora sos un meme igual.");
        }),
      },
    ],
  },

  emp_empleado_codigo: {
    title: "🚪 Un empleado se fue con el código",
    text: (s) =>
      s.empresa
        ? `Un dev de ${s.empresa.nombre} renunció, se llevó el repo en un pendrive y armó la competencia en Córdoba. Usa hasta tus mismos bugs.`
        : "Alguien se fue con un código que ya no es tuyo.",
    options: [
      {
        label: "⚖️ Mandarle carta documento",
        desc: "Abogado y correo. Puede que devuelva el pendrive.",
        run: conEmpresa((s, lines, e) => {
          e.empleados = Math.max(0, e.empleados - 1);
          const costo = price(s, 500000);
          e.capital -= costo;
          if (chance(0.5)) {
            lines.push(`⚖️ La carta documento (${fmtArs(costo)}) funcionó: devolvió el pendrive y borró el repo. Dice.`);
          } else {
            e.producto = Math.max(10, e.producto - 8);
            perderUsuarios(s, 0.05);
            fx(s, { mental: -5 });
            lines.push(`⚖️ Gastaste ${fmtArs(costo)} en abogados y la competencia sigue online. Te sacó clientes.`);
          }
        }),
      },
      {
        label: "🛠️ Reescribir todo (mejor)",
        desc: "Mucho esfuerzo, mejor producto.",
        run: conEmpresa((s, lines, e) => {
          e.empleados = Math.max(0, e.empleados - 1);
          e.producto = Math.min(100, e.producto + 5);
          e.bugs = Math.max(0, e.bugs - 2);
          fx(s, { energy: -10, mental: -4, logic: 2 });
          lines.push("🛠️ Lo reescribiste de cero. Quedó mejor y con tests. El de Córdoba sigue con tus bugs viejos.");
        }),
      },
      {
        label: "🤷 Dejarlo ir y desearle suerte",
        desc: "Paz mental, pero se perdió conocimiento.",
        run: conEmpresa((s, lines, e) => {
          e.empleados = Math.max(0, e.empleados - 1);
          e.producto = Math.max(10, e.producto - 10);
          e.moral = clamp(e.moral - 8);
          fx(s, { mental: 2 });
          lines.push("🤷 Le deseaste suerte por LinkedIn. El equipo quedó medio golpeado y nadie sabe cómo andaba el módulo de pagos.");
        }),
      },
    ],
  },

  emp_juicio_laboral: {
    title: "⚖️ Te llegó un juicio laboral",
    text: (s) =>
      s.empresa
        ? `Un ex empleado de ${s.empresa.nombre} dice que le debés horas extra por las Dailies que duraban dos horas. Su abogado ya imprimió la planilla: piden ${fmtArs(montoJuicio(s))}.`
        : "Te llegó un juicio de una empresa que ya cerraste. Lo atiende el contador.",
    options: [
      {
        label: "🤝 Arreglar antes del juicio",
        desc: "Pagás y se termina.",
        run: conEmpresa((s, lines, e) => {
          const monto = montoJuicio(s);
          e.capital -= monto;
          fx(s, { mental: -3 });
          lines.push(`🤝 Arreglaron por ${fmtArs(monto)}. El abogado te dio su tarjeta "por si alguna vez lo necesitás".`);
        }),
      },
      {
        label: "⚖️ Ir a juicio",
        desc: "Si ganás, no pagás. Si perdés, pagás el doble.",
        run: conEmpresa((s, lines, e) => {
          if (chance(0.35)) {
            fx(s, { mental: 5 });
            lines.push("⚖️ ¡Ganaste! Resulta que las Dailies estaban en el contrato. Nadie lee los contratos.");
            sumarReputacion(s, 1);
          } else {
            const monto = montoJuicio(s) * 2;
            e.capital -= monto;
            fx(s, { mental: -10 });
            lines.push(`⚖️ Perdiste. Pagás ${fmtArs(monto)} con intereses. La jueza también odia las Dailies largas.`);
            sumarReputacion(s, -2, lines, "juicio perdido");
          }
        }),
      },
      {
        label: "🙏 Ofrecerle volver",
        desc: "Sin juicio, pero el equipo no lo quiere ni ver.",
        run: conEmpresa((s, lines, e) => {
          e.empleados += 1;
          e.moral = clamp(e.moral - 12);
          e.bugs += 2;
          fx(s, { mental: -4 });
          lines.push("🙏 Volvió con aumento y oficina con ventana. El resto del equipo armó un grupo de WhatsApp sin vos.");
        }),
      },
    ],
  },

  emp_dolar_presupuesto: {
    title: "📈 El dólar te comió el presupuesto",
    text: (s) =>
      s.empresa
        ? `La factura de la nube viene en dólares y el dólar está a ${fmtArs(s.dolar)}. Este mes los servers de ${s.empresa.nombre} te cuestan ${fmtArs(costoNube(s))}.`
        : "El dólar subió (sorpresa). Al menos ya no tenés que pagar servers.",
    options: [
      {
        label: "💳 Pagar la nube en dólares",
        desc: "Sale de la caja de la empresa.",
        run: conEmpresa((s, lines, e) => {
          const costo = costoNube(s);
          e.capital -= costo;
          lines.push(`💳 Pagaste ${fmtArs(costo)}. Con el recargo de la tarjeta, un poco más. Siempre un poco más.`);
        }),
      },
      {
        label: "🔧 Migrar a un VPS barato",
        desc: "Si sale bien, ahorrás un montón. Si no, aparecen bugs.",
        minigame: "servers",
        onWin: conEmpresa((s, lines, e) => {
          const costo = Math.round(costoNube(s) * 0.2);
          e.capital -= costo;
          e.bugs = Math.max(0, e.bugs - 1);
          fx(s, { xp: 2 });
          lines.push(`🔧 Migraste todo a un VPS de cinco dólares. Pagaste ${fmtArs(costo)} y anda más rápido que antes.`);
        }),
        onLose: conEmpresa((s, lines, e) => {
          const costo = Math.round(costoNube(s) * 0.5);
          e.capital -= costo;
          e.bugs += 4;
          perderUsuarios(s, 0.03);
          fx(s, { mental: -5 });
          lines.push(`🔧 La migración salió a medias: pagaste ${fmtArs(costo)} y la base de datos quedó en dos lugares a la vez.`);
        }),
      },
      {
        label: "🙈 Apagar staging y rezar",
        desc: "Pagás la mitad. Testeás en producción.",
        run: conEmpresa((s, lines, e) => {
          const costo = Math.round(costoNube(s) * 0.5);
          e.capital -= costo;
          e.bugs += 2;
          lines.push(`🙈 Apagaste staging y pagaste ${fmtArs(costo)}. Ahora se testea en producción, como los valientes.`);
        }),
      },
    ],
  },

  emp_medio_tech: {
    title: "🏆 Te nombró un medio tech",
    text: (s) =>
      s.empresa
        ? `Un medio tech puso a ${s.empresa.nombre} en la lista "10 startups argentinas para mirar". Sos la número 10, pero sos.`
        : "Un medio tech habló de tu ex empresa. Llegó tarde, como siempre.",
    options: [
      {
        label: "🗣️ Dar la entrevista",
        desc: "+Hype, +Contactos y algo de reputación.",
        run: conEmpresa((s, lines, e) => {
          subirHype(e, 1.15);
          sumarUsuarios(s, 200 + e.usuarios * 0.05);
          fx(s, { network: 4, energy: -4 });
          lines.push("🗣️ Diste la entrevista con la remera de la empresa. La foto salió con el mate en primer plano.");
          sumarReputacion(s, 2, lines, "salió en los medios");
        }),
      },
      {
        label: "📢 Compartirlo 47 veces en LinkedIn",
        desc: "Tus contactos lo ven. Todos. Muchas veces.",
        run: conEmpresa((s, lines) => {
          sumarUsuarios(s, 100);
          fx(s, { network: 2, mental: 3 });
          lines.push("📢 Tu tía comentó '¡qué orgullo!' en las 47 publicaciones. Una tiene más likes que la nota.");
        }),
      },
      {
        label: "🙈 Pasar: perfil bajo",
        desc: "+Salud mental.",
        run: conEmpresa((s, lines) => {
          fx(s, { mental: 2 });
          lines.push("🙈 Preferiste el perfil bajo. Nadie se enteró, que era justamente el plan.");
        }),
      },
    ],
  },

  emp_hackathon: {
    title: "🧩 Hackathon interno en tu startup",
    text: (s) =>
      s.empresa
        ? `Organizaste un hackathon de 24 horas en ${s.empresa.nombre}. Hay pizza fría, ${s.empresa.empleados} dev${s.empresa.empleados === 1 ? "" : "s"} con ojeras y una idea que puede cambiarlo todo (o romper prod).`
        : "Había un hackathon, pero ya no tenés empresa.",
    options: [
      {
        label: "💻 Codear vos también",
        desc: "Si sale, el producto pega un salto.",
        minigame: (s) => roleMinigame(s),
        onWin: conEmpresa((s, lines, e) => {
          e.producto = Math.min(100, e.producto + 8);
          e.moral = clamp(e.moral + 10);
          e.bugs = Math.max(0, e.bugs - 2);
          fx(s, { xp: 3 });
          lines.push(`🧩 Salió una feature nueva a las 5 AM y anda. Producto ${e.producto}/100 y el equipo te ama (por hoy).`);
        }),
        onLose: conEmpresa((s, lines, e) => {
          e.bugs += 3;
          e.moral = clamp(e.moral - 5);
          fx(s, { mental: -4 });
          lines.push("🔥 El hackathon terminó con un merge a main a las 6 AM. Ahora hay tres bugs nuevos y nadie se hace cargo.");
        }),
      },
      {
        label: "🍕 Pizza y birra para todos",
        desc: "Cuesta plata, pero la moral vuela.",
        run: conEmpresa((s, lines, e) => {
          const costo = price(s, 25000) * (e.empleados + 1);
          e.capital -= costo;
          e.moral = clamp(e.moral + 15);
          lines.push(`🍕 Invertiste ${fmtArs(costo)} en pizza y birra. No salió ninguna feature, pero salió una amistad.`);
        }),
      },
      {
        label: "📋 Pedir que documenten",
        desc: "Nadie quiere, pero algo queda.",
        run: conEmpresa((s, lines, e) => {
          e.moral = clamp(e.moral - 8);
          e.producto = Math.min(100, e.producto + 2);
          e.bugs = Math.max(0, e.bugs - 1);
          lines.push("📋 Les pediste que documenten. Hubo un PDF de 2 páginas y un silencio de 24 horas.");
        }),
      },
    ],
  },

  emp_exclusividad: {
    title: "📜 Un cliente pide exclusividad",
    text: (s) =>
      s.empresa
        ? `Una empresa grande quiere ${s.empresa.nombre} solo para ella: paga ${fmtArs(montoExclusividad(s))} por mes, pero por 12 semanas no le podés vender a la competencia (o sea, a casi nadie).`
        : "Te pedían exclusividad, pero ya no tenés nada para dar.",
    options: [
      {
        label: "✍️ Firmar la exclusividad",
        desc: "Plata segura todos los meses. Durante 12 semanas vendés la mitad.",
        run: conEmpresa((s, lines, e) => {
          const p = sumarPagos(s, montoExclusividad(s) / ticket(s));
          e.exclusividadHasta = s.week + 12;
          lines.push(`✍️ Firmaste: equivale a ${num(p)} clientes que pagan. Por 12 semanas, el que manda es el cliente.`);
        }),
      },
      {
        label: "🤝 Negociar algo intermedio",
        desc: "Menos plata, sin exclusividad. Si se ofenden, nada.",
        run: conEmpresa((s, lines) => {
          if (chance(0.3 + s.stats.network / 200)) {
            const p = sumarPagos(s, (montoExclusividad(s) * 0.5) / ticket(s));
            lines.push(`🤝 Aceptaron sin exclusividad: equivale a ${num(p)} clientes que pagan. Negociaste como en la feria.`);
          } else {
            fx(s, { mental: -2 });
            lines.push("🤝 Se ofendieron y se fueron con la competencia. La competencia era un Excel.");
          }
        }),
      },
      {
        label: "🙅 Rechazar: somos para todos",
        desc: "Tu libertad vale más. +Hype.",
        run: conEmpresa((s, lines, e) => {
          subirHype(e, 1.05);
          fx(s, { mental: 2 });
          lines.push("🙅 Rechazaste. Lo contaste en LinkedIn como un acto de valentía. 300 likes.");
        }),
      },
    ],
  },
};

// Eventos según el tipo de empresa donde laburás
const TIPO_EVENTS = {
  startup_sin_sueldo: {
    title: "💸 La startup no tiene para pagar sueldos",
    text: (s) =>
      s.job
        ? `Los founders de ${s.job.company} juntaron a todos en el living-oficina: "este mes cobramos en equity, la ronda sale la semana que viene, lo juro".`
        : "Una startup no tiene para pagar sueldos. Por suerte, ya no es la tuya.",
    options: [
      {
        label: "🤝 Bancarla y cobrar en equity",
        desc: "Perdés medio sueldo. Si la ronda sale, te lo devuelven con creces.",
        run: conLaburo((s, lines, job) => {
          const medio = Math.round((job.salaryArs || job.salaryUsd * s.dolar) * 0.5);
          fx(s, { ars: -medio, network: 3, xp: 3 });
          if (chance(0.25)) {
            fx(s, { ars: medio * 3 });
            lines.push(`🚀 ¡La ronda salió de verdad! Te devolvieron todo y un bono: +${fmtArs(medio * 3)}. Los founders lloraron en la Daily.`);
            sumarReputacion(s, 2, lines, "bancaste la parada");
          } else {
            lines.push(`🤝 Bancaste la parada: ${fmtArs(medio)} menos este mes y un PDF que dice que sos dueño del 0,01%.`);
            sumarReputacion(s, 1);
          }
        }),
      },
      {
        label: "🚪 Renunciar antes de que cierre",
        desc: "Te vas ya. Si llevás poco, cuenta como salto.",
        run: conLaburo((s, lines) => {
          const { company, semanas } = irseDelLaburo(s);
          lines.push(`🚪 Te fuiste de ${company} antes de que apaguen la luz.${semanas < 24 ? " Duraste poco: cuenta como salto." : ""}`);
        }),
      },
      {
        label: "😤 Reclamar en el canal #general",
        desc: "Puede funcionar. O te mutean.",
        run: conLaburo((s, lines) => {
          if (chance(0.5)) {
            fx(s, { mental: 3 });
            lines.push("😤 Reclamaste y te pagaron con tres días de atraso. Victoria del proletariado digital.");
          } else {
            fx(s, { mental: -5 });
            lines.push("😤 Te mutearon del canal. Ahora el #general es 'solo para anuncios'.");
          }
        }),
      },
    ],
  },

  corpo_burocracia: {
    title: "📋 Tres formularios para pedir un mouse",
    text: "Se te rompió el mouse. Para pedir uno nuevo necesitás el formulario F-347, la firma de tu gerente, la del gerente de tu gerente y un sello que nadie sabe dónde está.",
    options: [
      {
        label: "📝 Llenar los formularios",
        desc: "Paciencia corporativa.",
        run: conLaburo((s, lines) => {
          fx(s, { energy: -6, mental: -4, xp: 1 });
          lines.push("📝 El mouse llegó a las siete semanas. Es de bolita y tiene un sticker de inventario.");
        }),
      },
      {
        label: "🛒 Comprarlo vos en Mercado Libre",
        desc: "Plata tuya, problema resuelto.",
        run: conLaburo((s, lines) => {
          fx(s, { ars: -price(s, 30000), mental: 3 });
          lines.push("🛒 Lo compraste vos y llegó al otro día. Compliance te mandó un mail por usar 'hardware no homologado'.");
        }),
      },
      {
        label: "⌨️ Automatizar los formularios",
        desc: "Un script para domar a la burocracia.",
        minigame: minijuegoTecnico,
        onWin: conLaburo((s, lines) => {
          fx(s, { xp: 4, logic: 2 });
          lines.push("⌨️ Tu script llena los formularios solo. Media empresa te pide que se los pases.");
          sumarReputacion(s, 2, lines, "automatizaste la burocracia");
        }),
        onLose: conLaburo((s, lines) => {
          fx(s, { mental: -5 });
          lines.push("🔒 Seguridad Informática te bloqueó el usuario por 'actividad sospechosa'. Ahora necesitás otro formulario.");
        }),
      },
    ],
  },

  remota_horario_gringo: {
    title: "🌙 Daily a las 3 AM por el huso horario",
    text: (s) =>
      s.job
        ? `${s.job.company} sumó un equipo en Sydney y la Daily quedó a las 3 AM de Buenos Aires. El de Singapur también se queja, pero desayunando.`
        : "Una Daily a las 3 AM que ya no es tu problema. Dormí.",
    options: [
      {
        label: "☕ Bancarla con café",
        desc: "-Energía, +XP.",
        run: conLaburo((s, lines) => {
          fx(s, { energy: -10, mental: -3, xp: 3 });
          lines.push("☕ Te conectaste con la cámara apagada y un café doble. Dijiste 'no blockers' dormido.");
        }),
      },
      {
        label: "🗣️ Proponer una daily async",
        desc: "Con buenos contactos, te dan bola.",
        run: conLaburo((s, lines) => {
          if (chance(0.3 + s.stats.network / 200)) {
            fx(s, { mental: 6 });
            lines.push("🗣️ ¡Aprobado! Ahora la Daily es un hilo de Slack. Dormís ocho horas como una persona.");
            sumarReputacion(s, 1);
          } else {
            fx(s, { mental: -2 });
            lines.push("🗣️ Te dijeron 'great idea!' y no cambió nada. Bienvenido al trabajo remoto.");
          }
        }),
      },
      {
        label: "😴 Dormir y mandar un video grabado",
        desc: "+Energía. Puede que lo noten.",
        run: conLaburo((s, lines) => {
          fx(s, { energy: 5, mental: 3 });
          if (chance(0.3)) {
            lines.push("😴 Mandaste el video del martes pasado. Lo notaron.");
            sumarReputacion(s, -2, lines, "video reciclado");
          } else {
            lines.push("😴 Mandaste un video grabado a la tarde. Nadie lo vio, que era el plan.");
          }
        }),
      },
    ],
  },

  estado_paro: {
    title: "✊ Paro general en el organismo",
    text: "El gremio anunció paro por 48 horas. El sistema de turnos lo mantenés vos: si no vas, no funciona; si vas, sos carnero.",
    options: [
      {
        label: "✊ Adherir al paro",
        desc: "+Energía y +Salud mental.",
        run: conLaburo((s, lines) => {
          fx(s, { energy: 12, mental: 6, xp: -1 });
          lines.push("✊ Adheriste. Dos días de siesta y el sistema se cayó igual, pero esta vez no fue tu culpa.");
        }),
      },
      {
        label: "💻 Ir igual a mantener el sistema",
        desc: "+XP, pero tus compañeros no te lo perdonan.",
        run: conLaburo((s, lines) => {
          fx(s, { xp: 3, network: -3 });
          lines.push("💻 Eras la única persona en el edificio. El ascensor tampoco funcionaba.");
          sumarReputacion(s, 1);
        }),
      },
      {
        label: "🧉 Ir a la marcha con el termo",
        desc: "+Contactos, -Energía.",
        run: conLaburo((s, lines) => {
          fx(s, { network: 5, energy: -5, mental: 3 });
          lines.push("🧉 Repartiste mate en la marcha y volviste con 12 contactos nuevos y una bandera.");
        }),
      },
    ],
  },
};

// Anota en carrera.vistos cuándo salió cada evento aleatorio (para el enfriamiento)
const COOLDOWN_EVENTO = 10;
const enfriado = (s, id) => {
  const v = s.carrera && s.carrera.vistos ? s.carrera.vistos[id] : null;
  return v == null || s.week - v >= COOLDOWN_EVENTO;
};

function marcar(s, id) {
  const c = ensureCarrera(s);
  if (!c.vistos) c.vistos = {};
  c.vistos[id] = s.week;
}

function conMarca(id, ev) {
  const envolver = (fn) => (s, lines) => {
    marcar(s, id);
    return fn(s, lines);
  };
  return {
    ...ev,
    options: ev.options.map((o) => {
      const o2 = { ...o };
      for (const k of ["run", "onWin", "onLose"]) if (o[k]) o2[k] = envolver(o[k]);
      return o2;
    }),
  };
}

const marcados = (evs) => Object.fromEntries(Object.entries(evs).map(([id, ev]) => [id, conMarca(id, ev)]));

export const EMPRESA_EVENTS = { ...BASE_EVENTS, ...marcados(FUNDADOR_EVENTS), ...marcados(TIPO_EVENTS) };

const EVENTOS_DE_EMPRESA = ["oferta_compra", "quiebra_empresa", ...Object.keys(FUNDADOR_EVENTS)];

const fundador = (id, weight, extra) => ({
  id,
  weight,
  when: (s) => !!s.empresa && enfriado(s, id) && (!extra || extra(s.empresa, s)),
});

const deTipo = (id, tipo, weight = 3) => ({
  id,
  weight,
  when: (s) => !!s.job && !s.empresa && s.job.tipo === tipo && enfriado(s, id),
});

export const EMPRESA_RANDOM = [
  fundador("emp_lanzamiento", 2, (e) => e.usuarios >= 50),
  fundador("emp_inversor_80", 2, (e, s) => e.equity > 30 && s.week - e.semana >= 4),
  fundador("emp_meli_feature", 2, (e) => e.usuarios >= 200),
  fundador("emp_arca", 3),
  fundador("emp_cliente_grande", 2, (e) => e.producto >= 30),
  fundador("emp_tweet_viral", 2),
  fundador("emp_empleado_codigo", 2, (e) => e.empleados > 0),
  fundador("emp_juicio_laboral", 2, (e) => e.empleados > 0),
  fundador("emp_dolar_presupuesto", 3),
  fundador("emp_medio_tech", 2, (e) => e.usuarios >= 300),
  fundador("emp_hackathon", 2, (e) => e.empleados > 0),
  fundador("emp_exclusividad", 2, (e) => e.pagos >= 20),
  deTipo("startup_sin_sueldo", "startup"),
  deTipo("corpo_burocracia", "corpo"),
  deTipo("remota_horario_gringo", "remota"),
  deTipo("estado_paro", "estado"),
];

// ---------- Migración de partidas viejas ----------
function migrarJob(s) {
  s.job.tipo = s.job.remote || (s.job.salaryUsd && !s.job.salaryArs) ? "remota" : "consultora";
  if (s.job.desde == null) s.job.desde = Math.max(1, s.week - (s.job.weeksSinceRaise || 0));
  if (!Array.isArray(s.job.perks)) s.job.perks = [];
}

// Muta en el lugar y es idempotente
export function migrarCarrera(s) {
  if (!s) return s;
  const c = ensureCarrera(s);
  const def = defaultCarrera();
  for (const k of Object.keys(def)) if (c[k] === undefined) c[k] = def[k];
  if (s.empresa === undefined) s.empresa = null;
  if (s.empresa) completarEmpresa(s.empresa);
  if (s.job && !s.job.tipo) migrarJob(s);
  sincronizarHistorial(s);
  return s;
}
