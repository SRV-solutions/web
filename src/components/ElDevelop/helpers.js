import { ROLES, LEVELS, SALARY_ARS, COMPANIES } from "./data";

export const rand = (a, b) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const chance = (prob) => Math.random() < prob;
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const STAT_KEYS = ["logic", "mental", "network", "energy"];

export const fmtArs = (n) => `${n < 0 ? "-" : ""}$${Math.abs(Math.round(n)).toLocaleString("es-AR")}`;
export const fmtUsd = (n) => `US$${Math.round(n).toLocaleString("es-AR")}`;

// Precio base ajustado por la inflación acumulada
export const price = (s, base) => Math.round((base * s.priceIndex) / 100) * 100;

export const role = (s) => ROLES[s.role];

function record(s, key, d) {
  if (!d) return;
  s.delta = s.delta || {};
  s.delta[key] = (s.delta[key] || 0) + d;
}

// Aplica cambios a stats / plata / xp y registra el delta para mostrarlo
export function fx(s, changes) {
  for (const [key, raw] of Object.entries(changes)) {
    const v = Math.round(raw);
    if (!v) continue;
    if (STAT_KEYS.includes(key)) {
      const before = s.stats[key];
      s.stats[key] = clamp(before + v);
      record(s, key, s.stats[key] - before);
    } else if (key === "xp") {
      const before = s.xp;
      s.xp = Math.max(0, s.xp + v);
      record(s, "xp", s.xp - before);
    } else {
      s[key] += v;
      record(s, key, v);
    }
  }
}

export function logicGain(s, base) {
  let m = 1;
  if (s.buffs.coffee > 0) m *= 1.5;
  if (s.housing === "solo") m *= 1.5; // +50% autonomía / concentración
  if (role(s).passive === "logicBoost") m *= 1.15;
  return base * m;
}

export const workMentalCost = (s, base) =>
  role(s).passive === "mentalShield" ? base * 0.7 : base;

export const workEnergyCost = (s, base) =>
  role(s).passive === "energyShield" ? base * 0.7 : base;

export function updatePhase(s) {
  if (s.phase === 4) return;
  s.phase = s.level >= 4 ? 3 : s.job || s.studyDone ? 2 : 1;
}

// Nivel al que podés aspirar si estás sin laburo
export const entryLevel = (s) =>
  s.level >= 1 ? Math.min(s.level, 4) : s.study === "uni" ? 2 : 1;

export function makeOffer(s, level, mult = 1) {
  const salary = Math.round((SALARY_ARS[level] * s.priceIndex * mult) / 1000) * 1000;
  s.offer = { company: pick(COMPANIES[level]), level, salaryArs: salary };
}

export function acceptOffer(s, lines) {
  const o = s.offer;
  s.job = {
    company: o.company,
    salaryArs: o.salaryArs,
    salaryUsd: 0,
    weeksSinceRaise: 0,
    remote: false,
  };
  s.level = Math.max(s.level, o.level);
  s.studyDone = true;
  s.searchBonus = 0;
  s.offer = null;
  updatePhase(s);
  lines.push(`Firmaste con ${o.company} como ${LEVELS[s.level]}. Ya tenés mail corporativo y 47 accesos pendientes.`);
  if (!s.housing) s.queue.push("mudanza");
  s.queue.push("onboarding");
}

export function incidentWin(s, lines) {
  const xp = role(s).passive === "incidentXp" ? 8 : 4;
  fx(s, { xp, network: 3, mental: 2 });
  lines.push("Apagaste el incendio. Te aplauden con emojis en el canal #general.");
}

export function incidentLose(s, lines) {
  const mental = role(s).passive === "incidentShield" ? -5 : -10;
  fx(s, { mental, xp: -1 });
  lines.push("Se cayó prod. Post-mortem con tu nombre en el título.");
}

// Dificultad de los minijuegos (1 a 4): sube con tu carrera. La entrevista de Big Tech es la más difícil.
export function difficulty(s) {
  if (s.phase === 4) return 4;
  return [1, 1, 2, 2, 3, 3][Math.min(s.level, 5)];
}

// Los dos minijuegos de tu rol: los incidentes y hackathons eligen uno al azar
export const roleMinigames = (s) => [role(s).minigame, role(s).minigame2];
export const roleMinigame = (s) => pick(roleMinigames(s));
