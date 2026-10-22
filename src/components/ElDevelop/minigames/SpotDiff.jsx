import React, { useEffect, useMemo, useRef, useState } from "react";
import { LuCheck, LuX, LuFileCode, LuBug, LuGitCompare } from "react-icons/lu";
import styles from "../style.module.css";
import ex from "./juegosB.module.css";
import { pick, shuffle, clamp } from "../helpers";
import { useCountdown, useFinishOnce, TimerBar } from "./common";

// Encontrá la diferencia: el código "Esperado" vs el "Actual". Tocá las líneas que cambiaron.
// Cada línea es un string (igual en los dos) o { a, b, t, s }: a = esperado, b = con el bug,
// t = tipo de diff, s = sutileza (1 evidente, 2 media, 3 fina).
const m = (a, b, t, s) => ({ a, b, t, s });

const SNIPPETS = [
  // ---- Tier 1: 8 líneas ----
  {
    tier: 1,
    lang: "JavaScript",
    lines: [
      "function precioFinal(precioAlfajor, cuotas) {",
      m("  const interes = cuotas > 3 ? 0.35 : 0;", "  const interes = cuotas >= 3 ? 0.35 : 0;", "> vs >=", 3),
      m("  let total = precioAlfajor * (1 + interes);", "  let total = precioAlfajor * (1 - interes);", "+ vs -", 2),
      m("  if (cuotas === 1) {", "  if (cuotas == 1) {", "== vs ===", 3),
      m("    total = total * 0.9;", "    total = total * 0.09;", "0.9 vs 0.09", 2),
      "  }",
      m("  return Math.round(total);", "  Math.round(total);", "falta el return", 1),
      "}",
    ],
  },
  {
    tier: 1,
    lang: "Python",
    lines: [
      "def alfajores_por_persona(cajas, invitados):",
      m("    total = cajas * 12", "    total = cajas + 12", "* vs +", 2),
      m("    if invitados == 0:", "    if invitados == 1:", "0 vs 1", 2),
      "        return 0",
      m("    por_persona = total // invitados", "    por_persona = total % invitados", "// vs %", 3),
      m("    sobran = total % invitados", "    sobran = total // invitados", "% vs //", 3),
      '    print(f"Sobran {sobran} alfajores")',
      m("    return (por_persona, sobran)", "    return (sobran, por_persona)", "valores al revés", 2),
    ],
  },
  {
    tier: 1,
    lang: "JavaScript",
    lines: [
      "function hayStock(listaDeAsado, kgPorPersona, personas) {",
      m("  const necesario = kgPorPersona * personas;", "  const necesario = kgPorPersona + personas;", "* vs +", 2),
      m("  const disponible = listaDeAsado.reduce((acc, c) => acc + c.kg, 0);", "  const disponible = listaDeAsado.reduce((acc, c) => acc + c.precio, 0);", "variable equivocada", 2),
      m("  if (disponible >= necesario) return true;", "  if (disponible > necesario) return true;", ">= vs >", 3),
      m("  const faltan = necesario - disponible;", "  const faltan = disponible - necesario;", "resta al revés", 2),
      '  avisar("Falta carne: comprá " + faltan + " kg");',
      m("  return false;", "  return true;", "return equivocado", 1),
      "}",
    ],
  },
  // ---- Tier 2: 10 líneas ----
  {
    tier: 2,
    lang: "Python",
    lines: [
      m("def calcular_sueldo(bruto, cuotas_sin_interes=0):", "def calcular_sueldo(bruto, cuotas_sin_interes=1):", "default equivocado", 3),
      m("    aportes = bruto * 0.17", "    aportes = bruto * 0.71", "0.17 vs 0.71", 2),
      m("    neto = bruto - aportes", "    neto = bruto + aportes", "- vs +", 2),
      m("    if neto <= 0:", "    if neto < 0:", "<= vs <", 3),
      "        return 0",
      m("    for cuota in range(cuotas_sin_interes):", "    for cuota in range(cuotas_sin_interes + 1):", "off-by-one", 3),
      m("        neto -= 1500", "        neto += 1500", "-= vs +=", 2),
      "    if neto > 500000:",
      "        neto = neto - neto * 0.05",
      m("    return round(neto, 2)", "    return round(2, neto)", "argumentos al revés", 2),
    ],
  },
  {
    tier: 2,
    lang: "JavaScript",
    lines: [
      "function filtrarTickets(tickets, prioridadMin) {",
      m("  const abiertos = tickets.filter((t) => !t.cerrado);", "  const abiertos = tickets.filter((t) => t.cerrado);", "se perdió el !", 2),
      m("  const urgentes = abiertos.filter((t) => t.prioridad >= prioridadMin);", "  const urgentes = abiertos.filter((t) => t.prioridad > prioridadMin);", ">= vs >", 3),
      m("  urgentes.sort((a, b) => b.prioridad - a.prioridad);", "  urgentes.sort((a, b) => a.prioridad - b.prioridad);", "orden al revés", 2),
      m('  const capa8 = urgentes.filter((t) => t.titulo.includes("no anda"));', '  const capa8 = urgentes.filter((t) => t.titulo.includes("anda"));', "texto equivocado", 2),
      m("  if (capa8.length > 0 && urgentes.length > 5) {", "  if (capa8.length > 0 || urgentes.length > 5) {", "&& vs ||", 2),
      m('    notificar(capa8, "soporte");', '    notificar("soporte", capa8);', "argumentos al revés", 2),
      "  }",
      m("  return urgentes.slice(0, 10);", "  return urgentes.slice(1, 10);", "off-by-one", 3),
      "}",
    ],
  },
  {
    tier: 2,
    lang: "SQL",
    lines: [
      "-- Deudores del Hot Sale",
      "SELECT c.nombre, SUM(p.monto) AS deuda",
      "FROM clientes c",
      m("JOIN pedidos p ON p.cliente_id = c.id", "JOIN pedidos p ON p.cliente_id = c.pedido_id", "join equivocado", 2),
      m("WHERE p.estado = 'pendiente'", "WHERE p.estado = 'pagado'", "estado equivocado", 1),
      m("  AND p.fecha >= '2024-11-01'", "  AND p.fecha > '2024-11-01'", ">= vs >", 3),
      m("  AND p.monto > 0", "  AND p.monto < 0", "> vs <", 2),
      "GROUP BY c.nombre",
      m("HAVING SUM(p.monto) > 50000", "HAVING SUM(p.monto) > 5000", "50000 vs 5000", 2),
      m("ORDER BY deuda DESC;", "ORDER BY deuda ASC;", "DESC vs ASC", 2),
    ],
  },
  // ---- Tier 3: 12-13 líneas ----
  {
    tier: 3,
    lang: "Python",
    lines: [
      "async def enviar_recordatorios(usuarios, db):",
      "    enviados = 0",
      "    for usuario in usuarios:",
      m("        deuda = await db.deuda_de(usuario.id)", "        deuda = db.deuda_de(usuario.id)", "falta el await", 2),
      m("        if deuda <= 0:", "        if deuda < 0:", "<= vs <", 3),
      "            continue",
      m("        cuotas = min(12, deuda // 50000)", "        cuotas = min(12, deuda // 5000)", "50000 vs 5000", 3),
      m('        mensaje = f"Debés ${deuda} en {cuotas} cuotas"', '        mensaje = f"Debés ${cuotas} en {deuda} cuotas"', "variables al revés", 2),
      m("        ok = await whatsapp.enviar(usuario.telefono, mensaje)", "        ok = await whatsapp.enviar(mensaje, usuario.telefono)", "argumentos al revés", 2),
      "        if ok:",
      m("            enviados += 1", "            enviados -= 1", "+= vs -=", 2),
      m("    return enviados", "    return usuarios", "variable equivocada", 2),
    ],
  },
  {
    tier: 3,
    lang: "JavaScript",
    lines: [
      "async function cargarAsado(listaDeAsado, invitados) {",
      m('  const res = await fetch("/api/asado?personas=" + invitados);', '  const res = fetch("/api/asado?personas=" + invitados);', "falta el await", 2),
      m("  const data = await res.json();", "  const data = res.json();", "falta el await", 2),
      m("  if (!data.ok) {", "  if (data.ok) {", "se perdió el !", 2),
      '    throw new Error("Se cayó la parrilla: " + data.error);',
      "  }",
      m("  const kgPorPersona = invitados > 10 ? 0.45 : 0.5;", "  const kgPorPersona = invitados >= 10 ? 0.45 : 0.5;", "> vs >=", 3),
      "  for (const corte of data.cortes) {",
      m("    listaDeAsado.push({ ...corte, kg: corte.kg * kgPorPersona });", "    listaDeAsado.push({ ...corte, kg: corte.kg * invitados });", "variable equivocada", 2),
      "  }",
      m("  const total = listaDeAsado.reduce((acc, c) => acc + c.kg, 0);", "  const total = listaDeAsado.reduce((acc, c) => acc + c.precio, 0);", "variable equivocada", 2),
      m("  return { listaDeAsado, total: Math.ceil(total) };", "  return { listaDeAsado, total: Math.floor(total) };", "ceil vs floor", 3),
      "}",
    ],
  },
  {
    tier: 3,
    lang: "SQL",
    lines: [
      "-- Ranking de vendedores por cuotas sin interés",
      "SELECT v.nombre, COUNT(*) AS ventas, AVG(p.cuotas) AS cuotas_prom",
      "FROM ventas p",
      m("JOIN vendedores v ON v.id = p.vendedor_id", "JOIN vendedores v ON v.id = p.id", "join equivocado", 2),
      m("WHERE p.cuotas_sin_interes = TRUE", "WHERE p.cuotas_sin_interes = FALSE", "TRUE vs FALSE", 1),
      m("  AND p.fecha BETWEEN '2024-01-01' AND '2024-12-31'", "  AND p.fecha BETWEEN '2024-01-01' AND '2024-12-30'", "off-by-one", 3),
      m("  AND (p.canal = 'web' OR p.canal = 'app')", "  AND (p.canal = 'web' AND p.canal = 'app')", "OR vs AND", 2),
      m("  AND p.monto >= 10000", "  AND p.monto > 10000", ">= vs >", 3),
      "GROUP BY v.nombre",
      m("HAVING COUNT(*) >= 5", "HAVING COUNT(*) >= 50", "5 vs 50", 2),
      m("ORDER BY ventas DESC, cuotas_prom ASC", "ORDER BY ventas ASC, cuotas_prom ASC", "DESC vs ASC", 2),
      m("LIMIT 20;", "LIMIT 2;", "20 vs 2", 2),
    ],
  },
  // ---- Tier 4: 16 líneas ----
  {
    tier: 4,
    lang: "JavaScript",
    lines: [
      "async function cobrar(carrito, cuotasSinInteres) {",
      m("  const precioTotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);", "  const precioTotal = carrito.reduce((acc, i) => acc + i.precio + i.cantidad, 0);", "* vs +", 2),
      m("  const descuento = carrito.length >= 12 ? 0.15 : 0;", "  const descuento = carrito.length > 12 ? 0.15 : 0;", ">= vs >", 3),
      m("  let neto = precioTotal * (1 - descuento);", "  let neto = precioTotal * (1 + descuento);", "- vs +", 2),
      m("  if (cuotasSinInteres > 6) {", "  if (cuotasSinInteres >= 6) {", "> vs >=", 3),
      m("    neto = neto * 1.1;", "    neto = neto * 1.01;", "1.1 vs 1.01", 3),
      "  }",
      m("  const pago = await mercadoPago.crear({ monto: neto, cuotas: cuotasSinInteres });", "  const pago = mercadoPago.crear({ monto: neto, cuotas: cuotasSinInteres });", "falta el await", 2),
      m('  if (pago.estado !== "aprobado" && pago.estado !== "pendiente") {', '  if (pago.estado !== "aprobado" || pago.estado !== "pendiente") {', "&& vs ||", 2),
      '    throw new Error("Rechazado: " + pago.motivo);',
      "  }",
      m("  for (let i = 0; i < carrito.length; i++) {", "  for (let i = 0; i <= carrito.length; i++) {", "off-by-one", 3),
      m("    await stock.descontar(carrito[i].id, carrito[i].cantidad);", "    await stock.descontar(carrito[i].cantidad, carrito[i].id);", "argumentos al revés", 2),
      "  }",
      m("  return { ok: true, id: pago.id, total: neto };", "  return { ok: true, id: pago.id, total: precioTotal };", "variable equivocada", 2),
      "}",
    ],
  },
  {
    tier: 4,
    lang: "JavaScript",
    lines: [
      "function liquidarSueldos(empleados, dolarBlue) {",
      "  const liquidaciones = [];",
      m("  for (let i = 0; i < empleados.length; i++) {", "  for (let i = 0; i <= empleados.length; i++) {", "off-by-one", 3),
      "    const e = empleados[i];",
      m("    const bruto = e.remoto ? e.sueldoUsd * dolarBlue : e.sueldoArs;", "    const bruto = e.remoto ? e.sueldoArs : e.sueldoUsd * dolarBlue;", "ternario al revés", 2),
      m("    const aportes = bruto * 0.17;", "    const aportes = bruto * 0.71;", "0.17 vs 0.71", 2),
      m("    let neto = bruto - aportes;", "    let neto = bruto + aportes;", "- vs +", 2),
      m("    if (e.antiguedad >= 5) {", "    if (e.antiguedad > 5) {", ">= vs >", 3),
      m("      neto += bruto * 0.01 * e.antiguedad;", "      neto -= bruto * 0.01 * e.antiguedad;", "+= vs -=", 2),
      "    }",
      m("    if (Number.isNaN(neto) || neto < 0) continue;", "    if (Number.isNaN(neto) && neto < 0) continue;", "|| vs &&", 2),
      m("    liquidaciones.push({ nombre: e.nombre, neto: Math.round(neto) });", "    liquidaciones.push({ nombre: e.nombre, neto: Math.round(bruto) });", "variable equivocada", 2),
      "  }",
      m("  const total = liquidaciones.reduce((acc, l) => acc + l.neto, 0);", "  const total = liquidaciones.reduce((acc, l) => acc + l.neto, 1);", "valor inicial equivocado", 3),
      m("  return { liquidaciones, total };", "  { liquidaciones, total };", "falta el return", 1),
      "}",
    ],
  },
  {
    tier: 4,
    lang: "Python",
    lines: [
      "# Vaquita del asado: todos ponen, nadie trae el carbón",
      m("def armar_vaquita(invitados, precio_kg, kg_por_persona=0.5):", "def armar_vaquita(invitados, precio_kg, kg_por_persona=5):", "default equivocado", 3),
      m("    total_kg = len(invitados) * kg_por_persona", "    total_kg = len(invitados) + kg_por_persona", "* vs +", 2),
      "    costo = total_kg * precio_kg",
      m("    pagan = [i for i in invitados if not i.es_cumpleaniero]", "    pagan = [i for i in invitados if i.es_cumpleaniero]", "se perdió el not", 2),
      m("    if len(pagan) == 0:", "    if len(pagan) == 1:", "0 vs 1", 2),
      '        raise ValueError("Nadie paga el asado")',
      m("    cuota = costo / len(pagan)", "    cuota = len(pagan) / costo", "división al revés", 2),
      "    deudores = []",
      "    for persona in pagan:",
      m("        if persona.transferido < cuota:", "        if persona.transferido <= cuota:", "< vs <=", 3),
      "            deudores.append(persona.nombre)",
      m("    if len(deudores) > 0:", "    if len(deudores) >= 0:", "> vs >=", 3),
      m("        avisar_grupo(deudores, cuota)", "        avisar_grupo(cuota, deudores)", "argumentos al revés", 2),
      m("    vuelto = sum(p.transferido for p in pagan) - costo", "    vuelto = sum(p.transferido for p in pagan) + costo", "- vs +", 2),
      m('    return {"cuota": round(cuota), "vuelto": max(vuelto, 0)}', '    return {"cuota": round(cuota), "vuelto": min(vuelto, 0)}', "max vs min", 2),
    ],
  },
];

const CFG = [
  { k: 1, time: 25, multa: 3, sut: (s) => s <= 2 },
  { k: 2, time: 30, multa: 4, sut: () => true },
  { k: 3, time: 38, multa: 5, sut: (s) => s >= 2 },
  { k: 4, time: 45, multa: 6, sut: (s) => s >= 2 },
];

export const configSpotDiff = (diff) => CFG[clamp(diff, 1, 4) - 1];

export function generarDiff(diff) {
  const d = clamp(diff, 1, 4);
  const cfg = CFG[d - 1];
  const snip = pick(SNIPPETS.filter((s) => s.tier === d));
  const mutables = snip.lines.map((l, i) => (typeof l === "string" ? -1 : i)).filter((i) => i >= 0);
  let cand = mutables.filter((i) => cfg.sut(snip.lines[i].s));
  if (cand.length < cfg.k) cand = mutables;
  const diffs = shuffle(cand).slice(0, cfg.k).sort((a, b) => a - b);
  const exp = snip.lines.map((l) => (typeof l === "string" ? l : l.a));
  const act = snip.lines.map((l, i) => (typeof l === "string" ? l : diffs.includes(i) ? l.b : l.a));
  const tipos = {};
  for (const i of diffs) tipos[i] = snip.lines[i].t;
  return { lang: snip.lang, exp, act, diffs, tipos, k: diffs.length };
}

export default function SpotDiff({ timeMult = 1, diff = 1, onFinish }) {
  const cfg = configSpotDiff(diff);
  const finishOnce = useFinishOnce(onFinish);
  const total = cfg.time * timeMult;
  const puzzle = useMemo(() => generarDiff(diff), [diff]);
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [penalty, setPenalty] = useState(0);
  const [view, setView] = useState("act");
  const [msg, setMsg] = useState({ ok: null, text: "Compará los dos bloques. El bug está en Actual." });
  const [done, setDone] = useState(false);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const rawLeft = useCountdown(total, !done, () => {});
  const left = Math.max(0, rawLeft - penalty);
  const timedOut = left <= 0 && !done;
  useEffect(() => {
    if (timedOut) finishOnce(false);
  }, [timedOut, finishOnce]);

  const tocar = (i) => {
    if (done || found.includes(i)) return;
    if (puzzle.diffs.includes(i)) {
      const next = [...found, i];
      setFound(next);
      if (next.length >= puzzle.k) {
        setDone(true);
        setMsg({ ok: true, text: `Diff encontrado (${puzzle.tipos[i]}). PR rechazado con cariño.` });
        later(() => finishOnce(true), 500);
      } else {
        setMsg({ ok: true, text: `Diff encontrado (${puzzle.tipos[i]}). Faltan ${puzzle.k - next.length}.` });
      }
    } else {
      setPenalty((p) => p + cfg.multa);
      setWrong({ i, id: Date.now() });
      setMsg({ ok: false, text: `La línea ${i + 1} está igual que en Esperado. -${cfg.multa}s` });
    }
  };

  const tabs = [
    { id: "exp", label: "Esperado", Icon: LuFileCode },
    { id: "act", label: "Actual", Icon: LuBug },
  ];

  return (
    <div>
      <TimerBar left={left} total={total} label={`Diffs: ${found.length}/${puzzle.k} · línea sana: -${cfg.multa}s`} />
      <p className={`${styles.mgGoal} ${ex.goal}`}>
        <LuGitCompare className={ex.ico} />
        <span>
          Tocá en Actual {puzzle.k === 1 ? "la línea que cambió" : `las ${puzzle.k} líneas que cambiaron`} respecto de Esperado.
        </span>
      </p>
      <div className={ex.sdTabs} role="tablist">
        {tabs.map(({ id, label, Icon }) => (
          <button
            type="button"
            role="tab"
            key={id}
            aria-selected={view === id}
            className={`${ex.sdTab} ${view === id ? ex.sdTabOn : ""}`}
            onClick={() => setView(id)}
          >
            <Icon /> {label}
          </button>
        ))}
      </div>
      <div className={ex.sdWrap}>
        <section className={`${ex.sdPane} ${view !== "exp" ? ex.sdPaneOff : ""}`}>
          <div className={ex.sdHead}>
            <LuFileCode /> Esperado · {puzzle.lang}
          </div>
          {puzzle.exp.map((t, i) => (
            <div key={i} className={ex.sdLine}>
              <span className={ex.sdNum}>{i + 1}</span>
              <code className={ex.sdCode}>{t}</code>
            </div>
          ))}
        </section>
        <section className={`${ex.sdPane} ${view !== "act" ? ex.sdPaneOff : ""}`}>
          <div className={`${ex.sdHead} ${ex.sdHeadAct}`}>
            <LuBug /> Actual · tocá la línea rota
          </div>
          {puzzle.act.map((t, i) => {
            const ok = found.includes(i);
            const bad = wrong && wrong.i === i;
            return (
              <button
                type="button"
                key={bad ? `${i}-${wrong.id}` : i}
                className={`${ex.sdLine} ${ex.sdBtn} ${ok ? ex.sdFound : ""} ${bad ? ex.sdWrong : ""}`}
                onClick={() => tocar(i)}
                disabled={done || ok}
              >
                <span className={ex.sdNum}>{i + 1}</span>
                <code className={ex.sdCode}>{t}</code>
                {ok && <LuCheck className={`${ex.sdMark} ${styles.green}`} />}
                {bad && <LuX className={`${ex.sdMark} ${styles.danger}`} />}
              </button>
            );
          })}
        </section>
      </div>
      <p className={`${ex.msg} ${msg.ok === true ? ex.msgGood : msg.ok === false ? ex.msgBad : ""}`}>
        {msg.ok === true && <LuCheck className={ex.ico} />}
        {msg.ok === false && <LuX className={ex.ico} />}
        <span>{msg.text}</span>
      </p>
    </div>
  );
}
