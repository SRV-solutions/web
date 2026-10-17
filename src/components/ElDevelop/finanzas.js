// "La Financiera": cueva de dólares, timba, la jubilación de la abuela y el Congreso.
// Todo es plata del juego. La casa siempre gana (como en la vida real).
import { fx, price, chance, pick, fmtArs, fmtUsd, randInt } from "./helpers";

// ---------- Estado ----------
export function defaultFin(s) {
  return {
    abuela: price(s, 600000), // ahorros de la jubilación de la abuela
    deudaAbuela: 0,
    ley: { impuesto: 0.3, cupo: 200, comision: 0.05, dolarizacion: false },
    compradoMes: 0, // US$ comprados este mes (para el cepo)
    convertibilidad: 0, // semanas que quedan de "uno a uno"
    cupoMenem: 0, // US$ que quedan a $1
    apuestasSemana: 0,
    nivel: 0,
    ganadas: 0,
    perdidas: 0,
    miamiMes: false,
    proyecto: null,
    leyesAprobadas: [],
  };
}

export const ensureFin = (s) => {
  if (!s.fin) s.fin = defaultFin(s);
  return s.fin;
};

const MAX_APUESTAS = 3;
export const apuestasRestantes = (s) => MAX_APUESTAS - (s.fin?.apuestasSemana || 0);

// ---------- Niveles (guiño a Galperin y a Fort) ----------
export const NIVELES = [
  { min: 0, emoji: "🐣", name: "Ahorrista de plazo fijo", perk: "Spread de cueva estándar." },
  { min: 2000, emoji: "🌳", name: "Arbolito de Florida", perk: "El arbolito te hace precio: -0,5% en la cueva." },
  { min: 10000, emoji: "🕳️", name: "Cuevero VIP", perk: "Te abren la puerta de atrás: -1% en la cueva." },
  { min: 30000, emoji: "🌴", name: "Comandante Miami", perk: "Tarjeta dorada y escapadas a Miami. CUT CUUUUUT." },
  { min: 80000, emoji: "📦", name: "Nivel Galperin · Señor del e-commerce", perk: "Envío gratis de todo, incluso de tus problemas." },
];

export const patrimonioUsd = (s) => Math.round(s.usd + s.ars / s.dolar);
export const nivelDe = (s) => NIVELES.reduce((acc, n, i) => (patrimonioUsd(s) >= n.min ? i : acc), 0);
// Nivel que se muestra: el guardado o el que ya alcanzaste con tu patrimonio
export const nivelActual = (s) => Math.max(s.fin?.nivel || 0, nivelDe(s));

// Sube de nivel (nunca baja: el estatus en Miami es para siempre)
function checkNivel(s) {
  const fin = ensureFin(s);
  const n = nivelDe(s);
  if (n > fin.nivel) {
    fin.nivel = n;
    const nv = NIVELES[n];
    return `📲 Notificación: ¡subiste a ${nv.emoji} ${nv.name}! ${nv.perk}`;
  }
  return null;
}

// ---------- Cotización ----------
export function cotizacion(s) {
  const fin = ensureFin(s);
  const spread = 0.03 - 0.005 * Math.min(nivelActual(s), 2);
  return {
    compra: Math.round(s.dolar * (1 - spread)), // lo que te pagan por tu dólar
    venta: Math.round(s.dolar * (1 + spread) * (1 + fin.ley.impuesto)), // lo que pagás vos
  };
}
export const cupoDisponible = (s) => {
  const fin = ensureFin(s);
  return fin.ley.cupo == null ? Infinity : Math.max(0, fin.ley.cupo - fin.compradoMes);
};

// ---------- Mensajes dinámicos ----------
const MSG = {
  compra: [
    (c) => `💵 Compraste ${c.usd} verdes. Directo al colchón, al lado de los de tu abuelo.`,
    (c) => `🌳 El arbolito te guiñó el ojo: ${fmtUsd(c.usd)} a ${fmtArs(c.precio)}. Mañana valen más, siempre valen más.`,
    (c) => `🧦 ${fmtUsd(c.usd)} adentro de la media. El banco nunca se va a enterar.`,
    (c) => `📈 Compraste a ${fmtArs(c.precio)}. Dentro de un mes vas a decir "qué barato estaba".`,
  ],
  venta: [
    (c) => `🔁 Vendiste ${fmtUsd(c.usd)} y te dieron un fajo de ${fmtArs(c.ars)}. Contalo dos veces.`,
    (c) => `🥩 ${fmtUsd(c.usd)} → ${fmtArs(c.ars)}. Alcanza para un asado (sin vacío).`,
    (c) => `🧾 Venta ejecutada: ${fmtArs(c.ars)}. Gastalo rápido antes de que la inflación se lo coma.`,
  ],
  liquidar: [
    (c) => `🪚 ¡AFUERA! Motosierra a toda la cartera: ${fmtUsd(c.usd)} liquidados por ${fmtArs(c.ars)}.`,
    (c) => `🪚 Liquidación total. ${fmtArs(c.ars)} en mano y el colchón quedó flaco.`,
  ],
  dolarizar: [
    (c) => `🦁 ¡VIVA LA LIBERTAD, CARAJO! Dolarizaste todo: ${fmtUsd(c.usd)}. El peso ya no te pertenece.`,
    (c) => `🦁 Dolarización completa: ${fmtUsd(c.usd)}. El BCRA de tu casa queda formalmente cerrado.`,
  ],
  menem: [
    (c) => `🍕🥂 ¡Uno a uno! Compraste ${fmtUsd(c.usd)} a $1 cada uno. Pizza con champán y vuelo a Miami.`,
    (c) => `📼 ${fmtUsd(c.usd)} a $1. Por un momento fue 1991 y todos tenían un VHS nuevo.`,
  ],
  ganada: [
    (c) => `🎰 ¡${c.juego} pagó x${c.mult}! Ganaste ${fmtArs(c.premio)}. Barrilete cósmico, ¿de qué planeta viniste?`,
    (c) => `🎰 ¡Pegaste! +${fmtArs(c.premio)}. Yo no manejo el rating, yo manejo un Rolls-Royce.`,
    (c) => `🎰 x${c.mult} y ${fmtArs(c.premio)} a la cuenta. Hoy invitás vos el asado.`,
  ],
  vuelo: [
    (c) => `🚀 ¡Vuelo a la estratósfera exitoso! Llegaste a Japón en una hora y media y con ${fmtArs(c.premio)} más.`,
  ],
  perdida: [
    (c) => `💥 Perdiste ${fmtArs(c.monto)}. La casa siempre gana; la casa ya se compró otra casa.`,
    (c) => `💥 -${fmtArs(c.monto)}. Tranqui, "la próxima la recuperás" (dijeron todos los que no la recuperaron).`,
    (c) => `💥 Se fueron ${fmtArs(c.monto)}. El crupier te mira con lástima.`,
  ],
  manoDeDios: [
    (c) => `🙌 ¡LA MANO DE DIOS! Perdías ${fmtArs(c.monto)} pero el árbitro no lo vio. Te devolvieron todo.`,
  ],
  abuelaGana: [
    (c) => `👵💰 ¡Le multiplicaste la jubilación a la abuela! Te quedás ${fmtArs(c.premio)} y ella te teje un pulóver.`,
  ],
  abuelaPierde: [
    (c) => `👵💥 Perdiste ${fmtArs(c.monto)} de la jubilación de la abuela. Te dejó en visto en el grupo de la familia.`,
  ],
  devolver: [
    (c) => `👵 Le devolviste ${fmtArs(c.monto)} a la abuela. ${c.saldada ? "Te perdonó y te hizo ñoquis." : "Todavía te mira raro."}`,
  ],
  miami: [
    () => `🌴 ¡MAIAMEEE! Fiesta en la mansión, champán y un Rolls-Royce de alquiler. CUT CUUUUUT.`,
    () => `🌴 Volviste de Miami bronceado y con un perfume que dice "Comandante". Valió cada dólar.`,
  ],
};

export const msg = (tipo, ctx = {}) => pick(MSG[tipo])(ctx);

// ---------- Acciones (reciben el estado y devuelven uno nuevo) ----------
function start(state) {
  const s = structuredClone(state);
  s.delta = {};
  s.toast = null;
  ensureFin(s);
  return s;
}

function toast(s, text, tone = "good") {
  const notif = checkNivel(s);
  s.toast = { text, delta: s.delta, tone, extra: notif, id: Date.now() };
  s.delta = {};
  return s;
}

export function comprarUsd(state, usd) {
  const { venta } = cotizacion(state);
  const costo = usd * venta;
  if (usd <= 0 || state.ars < costo || usd > cupoDisponible(state)) return state;
  const s = start(state);
  fx(s, { ars: -costo, usd });
  s.fin.compradoMes += usd;
  return toast(s, msg("compra", { usd, precio: venta }));
}

export function comprarUnoAUno(state) {
  const s = start(state);
  const usd = Math.min(s.fin.cupoMenem, Math.max(0, Math.floor(s.ars)));
  if (s.fin.convertibilidad <= 0 || usd <= 0) return state;
  fx(s, { ars: -usd, usd });
  s.fin.cupoMenem -= usd;
  return toast(s, msg("menem", { usd }), "vip");
}

export function venderUsd(state, usd) {
  const cant = usd === "all" ? state.usd : usd;
  if (cant <= 0 || state.usd < cant) return state;
  const s = start(state);
  const { compra } = cotizacion(s);
  const ars = cant * compra;
  fx(s, { usd: -cant, ars });
  return toast(s, msg(usd === "all" ? "liquidar" : "venta", { usd: cant, ars }));
}

export function dolarizar(state) {
  if (!state.fin?.ley.dolarizacion) return state;
  const { venta } = cotizacion(state);
  const usd = Math.floor(state.ars / venta);
  if (usd <= 0) return state;
  const s = start(state);
  fx(s, { ars: -usd * venta, usd });
  return toast(s, msg("dolarizar", { usd }), "vip");
}

export const JUEGOS = {
  doble: { emoji: "💰", name: "Doble o nada", mult: 2, p: 0.45, desc: "Una moneda, dos caras, cero garantías." },
  timba: { emoji: "🎲", name: "La Timba del Diez", mult: 3, p: 0.29, desc: "Tres dados y fe en la Mano de Dios." },
  vuelo: { emoji: "🚀", name: "Vuelo a la estratósfera", mult: 10, p: 0.08, desc: "Llegás a Japón en una hora y media. O no llegás." },
};
const MANO_DE_DIOS = 0.05;

export const montoApuesta = (s, fraccion) => Math.floor((Math.max(0, s.ars) * fraccion) / 1000) * 1000;

export function apostar(state, juegoId, fraccion) {
  const j = JUEGOS[juegoId];
  const monto = montoApuesta(state, fraccion);
  if (!j || monto < 1000 || apuestasRestantes(state) <= 0) return state;
  const s = start(state);
  s.fin.apuestasSemana += 1;
  if (chance(j.p)) {
    const bruto = monto * (j.mult - 1);
    const premio = Math.round(bruto * (1 - s.fin.ley.comision));
    fx(s, { ars: premio, mental: 3 });
    s.fin.ganadas += 1;
    return toast(s, msg(juegoId === "vuelo" ? "vuelo" : "ganada", { juego: j.name, mult: j.mult, premio }), "vip");
  }
  if (chance(MANO_DE_DIOS)) return toast(s, msg("manoDeDios", { monto }), "vip");
  fx(s, { ars: -monto, mental: fraccion >= 1 ? -8 : -3 });
  s.fin.perdidas += 1;
  return toast(s, msg("perdida", { monto }), "bad");
}

export const ABUELA = { mult: 5, p: 0.17 };

export function apostarAbuela(state) {
  const f = state.fin;
  if (!f || f.abuela < 1000 || f.deudaAbuela > 0 || apuestasRestantes(state) <= 0) return state;
  const s = start(state);
  const monto = s.fin.abuela;
  s.fin.apuestasSemana += 1;
  if (chance(ABUELA.p)) {
    const premio = Math.round(monto * (ABUELA.mult - 1) * (1 - s.fin.ley.comision));
    fx(s, { ars: premio, mental: 5 });
    s.fin.ganadas += 1;
    return toast(s, msg("abuelaGana", { premio }), "vip");
  }
  s.fin.abuela = 0;
  s.fin.deudaAbuela = monto;
  s.fin.perdidas += 1;
  fx(s, { mental: -15, network: -3 });
  return toast(s, msg("abuelaPierde", { monto }), "bad");
}

export function devolverAbuela(state) {
  const f = state.fin;
  if (!f || f.deudaAbuela <= 0 || state.ars <= 0) return state;
  const s = start(state);
  const monto = Math.min(s.fin.deudaAbuela, Math.floor(s.ars));
  fx(s, { ars: -monto });
  s.fin.deudaAbuela -= monto;
  s.fin.abuela += monto;
  const saldada = s.fin.deudaAbuela === 0;
  if (saldada) fx(s, { mental: 10, network: 2 });
  return toast(s, msg("devolver", { monto, saldada }));
}

export const costoMiami = (s) => price(s, 1500000);

export function escapadaMiami(state) {
  const f = state.fin;
  if (!f || nivelActual(state) < 3 || f.miamiMes || state.ars < costoMiami(state)) return state;
  const s = start(state);
  fx(s, { ars: -costoMiami(s), mental: 20, energy: 10, network: 4 });
  s.fin.miamiMes = true;
  return toast(s, msg("miami"), "vip");
}

// ---------- Ganchos del motor ----------
export function finWeekly(s, lines) {
  const fin = ensureFin(s);
  fin.apuestasSemana = 0;
  const notif = checkNivel(s);
  if (notif) lines.push(notif);
  if (fin.convertibilidad > 0) {
    fin.convertibilidad -= 1;
    if (fin.convertibilidad === 0 && fin.cupoMenem > 0) {
      fin.cupoMenem = 0;
      lines.push("📼 Se terminó la Convertibilidad 2.0. Fue lindo mientras duró (como en los 90).");
    }
  }
  if (fin.deudaAbuela > 0) {
    fx(s, { mental: -2 });
    lines.push(`👵 La abuela pregunta por su jubilación en el grupo de la familia. Le debés ${fmtArs(fin.deudaAbuela)}.`);
  }
}

export function finMonthly(s, lines) {
  const fin = ensureFin(s);
  fin.compradoMes = 0;
  fin.miamiMes = false;
  fin.abuela += price(s, 120000);
  const notif = checkNivel(s);
  if (notif) lines.push(notif);
  // Cada dos meses sesiona el Congreso
  const mes = (s.week - 1) / 4;
  if (mes % 2 === 0) {
    const posibles = Object.entries(LEYES).filter(([, l]) => l.posible(fin));
    if (posibles.length) {
      fin.proyecto = pick(posibles)[0];
      s.queue.push("congreso");
    }
  }
}

// ---------- El Congreso ----------
// buena: si al jugador le conviene que salga (lo dice la descripción del proyecto)
export const LEYES = {
  motosierra: {
    name: "Motosierra al recargo del dólar",
    desc: "Elimina el impuesto del 30% (o el que haya) a la compra de dólares.",
    buena: true,
    p: 0.5,
    posible: (f) => f.ley.impuesto > 0,
    aplicar: (s, f) => {
      f.ley.impuesto = 0;
      return "🪚 ¡AFUERA! El recargo al dólar pasó a la historia. Comprar verdes sale más barato.";
    },
  },
  cepo: {
    name: "Levantamiento del cepo",
    desc: "Se termina el límite mensual para comprar dólares.",
    buena: true,
    p: 0.45,
    posible: (f) => f.ley.cupo != null,
    aplicar: (s, f) => {
      f.ley.cupo = null;
      return "🔓 Chau cepo: podés comprar todos los dólares que quieras (y que puedas pagar).";
    },
  },
  dolarizacion: {
    name: "Ley de Dolarización",
    desc: "Habilita el botón para pasar todos tus pesos a dólares de una.",
    buena: true,
    p: 0.35,
    posible: (f) => !f.ley.dolarizacion,
    aplicar: (s, f) => {
      f.ley.dolarizacion = true;
      return "🦁 ¡Dolarización aprobada! Ya podés dolarizar todo desde La Financiera. VIVA LA LIBERTAD, CARAJO.";
    },
  },
  convertibilidad: {
    name: "Convertibilidad 2.0 (uno a uno)",
    desc: "Durante 4 semanas, podés comprar hasta US$100 a $1 cada uno.",
    buena: true,
    p: 0.4,
    posible: (f) => f.convertibilidad === 0,
    aplicar: (s, f) => {
      f.convertibilidad = 4;
      f.cupoMenem = 100;
      return "📼 ¡Volvió el uno a uno! Por 4 semanas tenés US$100 a $1. Pizza con champán para todos.";
    },
  },
  bono_jubilados: {
    name: "Bono extraordinario para jubilados",
    desc: "La abuela cobra un bono. Más ahorros (y más para apostar, si te animás).",
    buena: true,
    p: 0.55,
    posible: () => true,
    aplicar: (s, f) => {
      const bono = price(s, 300000);
      f.abuela += bono;
      return `👵 La abuela cobró un bono de ${fmtArs(bono)}. Ya está buscando dónde esconderlo.`;
    },
  },
  impuestazo: {
    name: "Impuesto PAÍS recargado",
    desc: "Suma 15 puntos al recargo de la compra de dólares.",
    buena: false,
    p: 0.5,
    posible: (f) => f.ley.impuesto < 0.6,
    aplicar: (s, f) => {
      f.ley.impuesto = Math.round((f.ley.impuesto + 0.15) * 100) / 100;
      return `🧾 Salió el impuestazo: el recargo al dólar ahora es ${Math.round(f.ley.impuesto * 100)}%.`;
    },
  },
  ludopatia: {
    name: "Impuesto a la Timba",
    desc: "El Estado se queda con el 15% de lo que ganes en el casino.",
    buena: false,
    p: 0.5,
    posible: (f) => f.ley.comision < 0.15,
    aplicar: (s, f) => {
      f.ley.comision = 0.15;
      return "🎰 Impuesto a la Timba aprobado: el 15% de tus premios va a las arcas del Estado.";
    },
  },
  cepo_duro: {
    name: "Cepo recargado",
    desc: "Baja el cupo mensual de dólares a US$100 (o lo vuelve a poner).",
    buena: false,
    p: 0.45,
    posible: (f) => f.ley.cupo == null || f.ley.cupo > 100,
    aplicar: (s, f) => {
      f.ley.cupo = 100;
      return "🔒 Cepo recargado: solo podés comprar US$100 por mes. Los arbolitos festejan.";
    },
  },
  feriado: {
    name: "Feriado puente nacional obligatorio",
    desc: "Un fin de semana largo por decreto. Más energía para todos.",
    buena: true,
    p: 0.65,
    posible: () => true,
    aplicar: (s) => {
      fx(s, { energy: 12, mental: 6 });
      return "🏖️ ¡Fin de semana XXL! Te fuiste a la costa y volviste con arena hasta en la notebook.";
    },
  },
};

const ANECDOTAS = [
  "Un diputado se quedó dormido en su banca y votó con el codo.",
  "Se cortó el streaming oficial justo en la votación.",
  "Hubo un cuarto intermedio de 6 horas para 'buscar consensos' (pedir pizzas).",
  "Un legislador dio un discurso de 40 minutos sobre otro tema.",
  "Afuera, los vendedores de choripán facturaron más que el Estado.",
  "Alguien gritó '¡Quórum!' y nadie supo si era un pedido o una amenaza.",
];

function tablero(aprobada) {
  const presentes = randInt(225, 257);
  const abst = randInt(2, 20);
  const resto = presentes - abst;
  const mayoria = Math.floor(resto / 2) + randInt(2, 22);
  const af = aprobada ? mayoria : resto - mayoria;
  return `🗳️ Afirmativos ${af} · Negativos ${resto - af} · Abstenciones ${abst}`;
}

function votar(voto) {
  return (s, lines) => {
    const fin = ensureFin(s);
    const ley = LEYES[fin.proyecto];
    if (!ley) return;
    // Tu voto (y tus contactos para hacer lobby) mueven la aguja
    const peso = 0.2 + s.stats.network / 400;
    const p = ley.p + (voto === "si" ? peso : voto === "no" ? -peso : 0);
    const aprobada = chance(Math.max(0.05, Math.min(0.95, p)));
    lines.push(pick(ANECDOTAS));
    lines.push(tablero(aprobada));
    if (aprobada) {
      lines.push(`✅ APROBADA: ${ley.name}.`);
      lines.push(ley.aplicar(s, fin));
      fin.leyesAprobadas = [ley.name, ...fin.leyesAprobadas].slice(0, 6);
    } else {
      lines.push(`❌ RECHAZADA: ${ley.name}. Vuelve a comisión (o sea, al cajón).`);
    }
    if (voto === "si" || voto === "no") {
      const acerto = (voto === "si") === ley.buena;
      fx(s, acerto ? { network: 2 } : { mental: -2 });
    } else {
      fx(s, { energy: 4, mental: 2 });
      lines.push("🥐 Vos te fuiste a buscar facturas. Volviste con media docena de medialunas.");
    }
    fin.proyecto = null;
  };
}

export const FIN_EVENTS = {
  congreso: {
    title: "🏛️ Sesión especial en el Congreso: Ley Ómnibus",
    text: (s) => {
      const ley = LEYES[s.fin?.proyecto];
      if (!ley) return "Hoy no hubo quórum. Todos a casa.";
      return `Se trata el proyecto "${ley.name}": ${ley.desc} Te invitaron a la comisión como "especialista en tecnología" y tu voto (y tus contactos) pueden inclinar la balanza.`;
    },
    options: [
      { label: "✅ Votar a favor", desc: "Tus contactos hacen lobby para que salga.", run: votar("si") },
      { label: "❌ Votar en contra", desc: "Tus contactos hacen lobby para frenarlo.", run: votar("no") },
      { label: "🥐 Ir a buscar facturas", desc: "Que decidan ellos. +Energía y +Salud mental.", run: votar("ausente") },
    ],
  },
};
