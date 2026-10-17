// Motor de "El Develop": todas las funciones reciben el estado y devuelven uno nuevo
import {
  ROLES,
  ITEMS,
  LEVELS,
  MINIGAMES,
  PROMOTIONS,
  BIG_TECH,
  BIG_TECH_REQ,
  SALARY_ARS,
  SALARY_USD,
  WORK_LINES,
  SEARCH_FAIL,
} from "./data";
import { EVENTS, RANDOM_EVENTS } from "./events";
import {
  fx,
  price,
  rand,
  chance,
  pick,
  role,
  logicGain,
  workMentalCost,
  workEnergyCost,
  makeOffer,
  entryLevel,
  updatePhase,
  fmtArs,
} from "./helpers";
import { defaultFin, finWeekly, finMonthly } from "./finanzas";
import { mensajeMinijuego, mensajeCompra } from "./mensajes";

export const SAVE_VERSION = 2;

export const FOCUS = {
  laburo: "Laburo",
  estudio: "Estudio",
  salud: "Salud",
  networking: "Networking",
};

export function newGame(name, roleId) {
  const s = {
    version: SAVE_VERSION,
    name,
    role: roleId,
    week: 1,
    phase: 1,
    level: 0,
    xp: 0,
    stats: { logic: 10, mental: 70, network: 10, energy: 80 },
    ars: 250000,
    usd: 0,
    priceIndex: 1,
    dolar: 1500,
    study: null,
    studyWeeks: 0,
    studyDone: false,
    job: null,
    secondJob: false,
    offer: null,
    housing: null,
    isaPayments: 0,
    searchBonus: 0,
    inv: { keyboard: false, chair: false },
    buffs: { coffee: 0 },
    kid: false,
    kidLeave: 0,
    burnouts: 0,
    interview: null,
    interviewCooldown: 0,
    flags: {},
    queue: [],
    pending: { kind: "event", id: "eleccion_estudio" },
    result: null,
    toast: null,
    log: [],
    victory: null,
    gameOver: null,
    delta: {},
  };
  fx(s, ROLES[roleId].bonus);
  s.fin = defaultFin(s);
  s.delta = {};
  return s;
}

const begin = (state) => {
  const s = structuredClone(state);
  s.delta = {};
  s.toast = null;
  return s;
};

function finish(s, title, lines) {
  s.result = { title, lines, delta: s.delta };
  s.delta = {};
  s.log.unshift(`S${s.week}: ${title}`);
  s.log = s.log.slice(0, 25);
}

// ---------- Semana ----------
export function playWeek(state, focus) {
  const s = begin(state);
  const lines = [];
  const playedWeek = s.week;

  applyFocus(s, focus, lines);
  weeklyUpkeep(s, focus, lines);

  if (s.study && !s.studyDone) s.studyWeeks += 1;
  s.week += 1;
  if ((s.week - 1) % 4 === 0) monthEnd(s, lines);

  if (!s.gameOver) scheduleEvent(s, focus);
  healthCheck(s, lines);

  s.result = null;
  finish(s, `Semana ${playedWeek} · ${FOCUS[focus]}`, lines);
  return s;
}

function applyFocus(s, focus, lines) {
  const r = role(s);
  switch (focus) {
    case "laburo":
      if (s.job) {
        if (s.kidLeave > 0) {
          fx(s, { mental: 3 });
          lines.push("Estás de licencia: el laburo puede esperar, el bebé no.");
          break;
        }
        const xp = r.passive === "xpBoost" ? 5 : 4;
        fx(s, { xp, energy: -workEnergyCost(s, 12), mental: -workMentalCost(s, 6), network: 1 });
        lines.push(pick(WORK_LINES));
      } else if (s.studyDone) {
        fx(s, { energy: -8, mental: -4 });
        const p = 0.12 + s.stats.network / 220 + s.stats.logic / 400 + s.searchBonus / 100;
        if (chance(p)) {
          makeOffer(s, entryLevel(s), 1 + s.searchBonus / 100);
          s.searchBonus = 0;
          s.queue.push("oferta");
          lines.push("¡Te contestaron de una búsqueda! Tenés una oferta en la mesa.");
        } else {
          s.searchBonus += 3;
          lines.push(pick(SEARCH_FAIL));
        }
      } else {
        fx(s, { ars: price(s, 90000), energy: -12, mental: -2 });
        lines.push("Hiciste changas: formateaste 3 PCs y le instalaste el WhatsApp a tu tía.");
      }
      break;
    case "estudio":
      fx(s, { logic: logicGain(s, 6), energy: -10, mental: -4 });
      lines.push(
        s.buffs.coffee > 0
          ? "Estudiaste con un flat white de $9.000 al lado. Rinde el doble (casi)."
          : "Te clavaste tutoriales y LeetCode hasta las 2 AM."
      );
      break;
    case "salud":
      fx(s, { energy: 25, mental: 14 });
      lines.push("Fútbol 5 con amigos, dormiste 9 horas y comiste verdura. Irreconocible.");
      break;
    case "networking": {
      const net = r.passive === "networkBoost" ? 7.5 : 5;
      fx(s, { network: net, ars: -price(s, 25000), energy: -6, mental: 3 });
      lines.push("Meetup tech + birras. Repartiste 12 'conectemos en LinkedIn'.");
      if (!s.job && s.studyDone && !s.queue.includes("oferta") && chance(s.stats.network / 250)) {
        makeOffer(s, entryLevel(s), 1 + s.searchBonus / 100);
        s.searchBonus = 0;
        s.queue.push("oferta");
        lines.push("¡Alguien del meetup te refirió para un puesto!");
      }
      break;
    }
    default:
      break;
  }
}

function weeklyUpkeep(s, focus, lines) {
  if (s.secondJob) {
    fx(s, { mental: -5, energy: -4 });
    lines.push("Dos laburos en paralelo: dos dailies a la misma hora.");
  }
  if (s.kid && s.kidLeave === 0 && chance(0.3)) {
    fx(s, { energy: -5 });
    lines.push("El bebé no durmió. Vos tampoco.");
  }
  if (s.housing === "viejos" && s.job && focus === "laburo" && !s.inv.headphones && chance(0.5)) {
    fx(s, { mental: -4 });
    lines.push("Tu vieja gritó '¿QUERÉS MILANESAS?' en plena Daily con el micrófono abierto.");
  }
  if (s.kidLeave > 0) s.kidLeave -= 1;
  if (s.buffs.coffee > 0) s.buffs.coffee -= 1;
  if (s.interviewCooldown > 0) s.interviewCooldown -= 1;
  if (s.job) s.job.weeksSinceRaise += 1;
  finWeekly(s, lines);
}

export function livingCost(s) {
  const base = s.housing === "solo" ? 800000 : 120000;
  return price(s, base + (s.kid ? 250000 : 0));
}

function monthEnd(s, lines) {
  const inf = rand(0.02, 0.07);
  s.priceIndex *= 1 + inf;
  // El dólar siempre sube
  s.dolar = Math.round(s.dolar * (1 + rand(0.01, 0.05)));
  lines.push(`📈 Fin de mes. Inflación: ${(inf * 100).toFixed(1)}% · Dólar: $${s.dolar.toLocaleString("es-AR")} (subió, obvio)`);

  if (s.job) {
    if (s.job.salaryArs) fx(s, { ars: s.job.salaryArs });
    if (s.job.salaryUsd) fx(s, { usd: s.job.salaryUsd });
    lines.push(`💰 Cobraste el sueldo de ${s.job.company}.`);
    const month = (s.week - 1) / 4;
    if (month % 6 === 0) {
      fx(s, { ars: Math.round(s.job.salaryArs / 2), usd: Math.round(s.job.salaryUsd / 2) });
      lines.push("🎁 ¡Cobraste el aguinaldo! Duró lo mismo que un helado en enero.");
    }
    if (s.isaPayments > 0) {
      const total = s.job.salaryArs + s.job.salaryUsd * s.dolar;
      fx(s, { ars: -Math.round(total * 0.15) });
      s.isaPayments -= 1;
      lines.push(`🧾 Cuota del bootcamp (15% del sueldo). Quedan ${s.isaPayments}.`);
    }
  }
  if (s.secondJob) {
    fx(s, { usd: Math.round(SALARY_USD[Math.max(2, Math.min(4, s.level))] * 0.8) });
    lines.push("💵 Cobraste el segundo laburo en dólares.");
  }

  const cost = livingCost(s);
  fx(s, { ars: -cost });
  lines.push(
    s.housing === "solo"
      ? `🏠 Alquiler, expensas y súper: ${fmtArs(cost)}.`
      : `🏠 Aporte en lo de tus viejos y gastos: ${fmtArs(cost)}.`
  );

  coverDebt(s, lines);
  checkPromotion(s, lines);
  if (!s.gameOver) finMonthly(s, lines);
}

function coverDebt(s, lines) {
  if (s.ars < 0 && s.usd > 0) {
    const sell = Math.min(s.usd, Math.ceil(-s.ars / s.dolar));
    fx(s, { usd: -sell, ars: sell * s.dolar });
    lines.push(`🔁 Vendiste US$${sell} para cubrir los gastos.`);
  }
  if (s.ars < 0) {
    fx(s, { mental: -8 });
    lines.push("🟥 Estás en rojo. Las deudas no te dejan dormir.");
    if (s.ars < -price(s, 2500000)) {
      s.gameOver = {
        title: "Te embargaron hasta el mate",
        share: "ME EMBARGARON HASTA EL MATE",
        text: "Las deudas se volvieron impagables. Vendiste la compu para pagar la tarjeta. Fin de la carrera… por ahora.",
      };
    }
  }
}

function checkPromotion(s, lines) {
  if (!s.job || s.level >= 4) return;
  const req = PROMOTIONS[s.level];
  if (!req) return;
  if (s.xp >= req.xp && s.stats.logic >= req.logic && s.stats.network >= (req.network || 0)) {
    s.level += 1;
    if (s.job.remote) {
      s.job.salaryUsd = Math.max(s.job.salaryUsd, SALARY_USD[s.level]);
    } else {
      s.job.salaryArs = Math.max(
        Math.round(s.job.salaryArs * 1.15),
        Math.round(SALARY_ARS[s.level] * s.priceIndex)
      );
    }
    s.job.weeksSinceRaise = 0;
    updatePhase(s);
    lines.push(`🏆 ¡ASCENSO! Ahora sos ${LEVELS[s.level]}.`);
  }
}

function scriptedEvent(s) {
  const f = s.flags;
  if (s.study === "uni" && !s.studyDone) {
    if (!f.toma && s.studyWeeks >= 3 && (chance(0.3) || s.studyWeeks >= 7)) {
      f.toma = true;
      return "toma_facultad";
    }
    if (!f.finalPassed && s.studyWeeks >= 8) return "final_algoritmos";
    if (f.finalPassed && s.studyWeeks >= 12) return "graduacion";
  }
  if (s.study === "bootcamp" && !s.studyDone && s.studyWeeks >= 5) return "promesa_trabajo";
  if (s.job && s.job.salaryArs > 0 && s.job.weeksSinceRaise >= 16) return "pedir_aumento";
  if (s.job && s.level >= 3 && !s.kid && !f.kidAsked && chance(0.12)) {
    f.kidAsked = true;
    return "bebe";
  }
  if (
    s.level >= 4 &&
    s.stats.logic >= BIG_TECH_REQ.logic &&
    s.stats.network >= BIG_TECH_REQ.network &&
    s.interviewCooldown === 0
  ) {
    s.interview = { company: pick(BIG_TECH), score: 0 };
    return "recruiter_bigtech";
  }
  return null;
}

function scheduleEvent(s, focus) {
  if (s.queue.length) return;
  const scripted = scriptedEvent(s);
  if (scripted) {
    s.queue.push(scripted);
    return;
  }
  if (s.job && focus === "laburo" && s.kidLeave === 0 && chance(0.28)) {
    s.queue.push("incidente");
    return;
  }
  if (chance(0.45)) {
    const pool = RANDOM_EVENTS.filter((e) => (!e.roles || e.roles.includes(s.role)) && e.when(s));
    const total = pool.reduce((acc, e) => acc + e.weight, 0);
    let roll = Math.random() * total;
    for (const e of pool) {
      roll -= e.weight;
      if (roll <= 0) {
        s.queue.push(e.id);
        return;
      }
    }
  }
}

function healthCheck(s, lines) {
  if (s.gameOver || s.victory) return;
  if (s.stats.mental <= 0) {
    s.burnouts += 1;
    if (s.burnouts >= 3) {
      s.gameOver = {
        title: "Burnout final: rumbo a las sierras",
        share: "BURNOUT: ME FUI A LAS SIERRAS",
        text: "Tercer burnout. Te fuiste a vivir a las sierras de Córdoba a hacer cerámica. Honestamente, no está tan mal.",
      };
      return;
    }
    s.week += 6;
    s.stats.mental = 50;
    s.stats.energy = 55;
    fx(s, { logic: -8, xp: -5, ars: -price(s, 400000) });
    lines.push(
      `🟥 BURNOUT (${s.burnouts}/3). Quedaste 6 semanas offline: psicólogo, kinesiólogo y mucho mate.`
    );
    if (s.secondJob) {
      s.secondJob = false;
      lines.push("Perdiste el segundo laburo.");
    }
  }
  if (s.stats.energy <= 0) {
    s.stats.energy = 30;
    fx(s, { mental: -10, xp: -2 });
    lines.push("🤕 Te quedaste sin nafta y te dormiste arriba del teclado. Perdiste unos días.");
  }
}

// ---------- Eventos ----------
export function chooseOption(state, idx) {
  const s = begin(state);
  const eventId = s.pending.id;
  const opt = EVENTS[eventId].options[idx];
  if (opt.minigame) {
    const game = typeof opt.minigame === "function" ? opt.minigame(s) : opt.minigame;
    s.pending = { kind: "minigame", game, eventId, optIdx: idx };
    return s;
  }
  const lines = [];
  opt.run(s, lines);
  s.pending = null;
  healthCheck(s, lines);
  finish(s, opt.label, lines);
  return s;
}

export function finishMinigame(state, win, mensaje) {
  const s = begin(state);
  const { eventId, optIdx, game } = s.pending;
  const opt = EVENTS[eventId].options[optIdx];
  const lines = [mensaje || mensajeMinijuego(game, win)];
  (win ? opt.onWin : opt.onLose)(s, lines);
  if (win && role(s).passive === "bugHunter") {
    fx(s, { logic: 2 });
    lines.push("🐞 Cazador de Bugs: +2 de Lógica extra.");
  }
  s.pending = null;
  healthCheck(s, lines);
  finish(s, `${MINIGAMES[game].name}: ${win ? "pasaste ✅" : "no salió ❌"}`, lines);
  return s;
}

export function continueResult(state) {
  const s = structuredClone(state);
  s.result = null;
  if (!s.pending && s.queue.length) s.pending = { kind: "event", id: s.queue.shift() };
  return s;
}

// ---------- Tienda ----------
export function buyItem(state, itemId) {
  const item = ITEMS.find((i) => i.id === itemId);
  const cost = price(state, item.base);
  if (state.ars < cost || (item.permanent && state.inv[itemId])) return state;
  const s = begin(state);
  fx(s, { ars: -cost });
  if (item.permanent) s.inv[itemId] = true;
  if (item.buff) s.buffs[item.buff] = 2;
  if (item.food && chance(0.12)) {
    fx(s, { energy: -10, mental: -5 });
    s.toast = { text: `🤢 ${item.name}: el chino te lo vendió vencido. De vuelto te dio caramelos.`, delta: s.delta, tone: "bad", id: Date.now() };
    s.delta = {};
    return s;
  }
  if (item.effect) fx(s, item.effect);
  s.toast = { text: mensajeCompra(item), delta: s.delta, id: Date.now() };
  s.delta = {};
  return s;
}

export function sellUsd(state, amount) {
  if (state.usd < amount) return state;
  const s = begin(state);
  fx(s, { usd: -amount, ars: amount * s.dolar });
  s.toast = { text: `🔁 Vendiste US$${amount} a $${s.dolar}`, delta: s.delta };
  s.delta = {};
  return s;
}

export function quitSecondJob(state) {
  const s = begin(state);
  s.secondJob = false;
  fx(s, { mental: 10 });
  s.toast = { text: "Renunciaste al segundo laburo. Respirás.", delta: s.delta };
  s.delta = {};
  return s;
}

// ---------- Info para la UI ----------
export function nextGoal(s) {
  if (s.victory) return "¡Llegaste a la Big Tech!";
  if (!s.study) return "Elegir dónde estudiar";
  if (!s.studyDone) {
    const total = s.study === "uni" ? 12 : 5;
    return `Terminar ${s.study === "uni" ? "la facu" : "el bootcamp"} (${Math.min(s.studyWeeks, total)}/${total} semanas)`;
  }
  if (!s.job) return "Conseguir laburo: Laburo (buscar) o Networking";
  if (s.level < 4) {
    const r = PROMOTIONS[s.level];
    const parts = [`XP ${s.xp}/${r.xp}`, `Lógica ${s.stats.logic}/${r.logic}`];
    if (r.network) parts.push(`Contactos ${s.stats.network}/${r.network}`);
    return `Ascenso a ${LEVELS[s.level + 1]}: ${parts.join(" · ")}`;
  }
  if (s.interviewCooldown > 0) return `Volver a entrevistar en ${s.interviewCooldown} semanas`;
  return `Llamado de Big Tech: Lógica ${s.stats.logic}/${BIG_TECH_REQ.logic} · Contactos ${s.stats.network}/${BIG_TECH_REQ.network}`;
}
