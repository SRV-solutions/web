// Genera la imagen para compartir (formato historia 1080x1920) con el branding de la web
import React from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { LEVELS, STAT_INFO } from "./data";
import { ROLES } from "./data";
import { GAME_PATH, INSTAGRAM_HANDLE } from "./promo";
import { Icon, ROLE_ICON, STAT_ICON } from "./icons";

const W = 1080;
const H = 1920;
const BLUE = "#0b78fb";
const ORANGE = "#f6950a";
const FONT = "Roboto, Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

export const gameUrl = () => `${window.location.origin}${GAME_PATH}`;
const prettyUrl = () => `${window.location.host.replace(/^www\./, "")}${GAME_PATH}`;

export function shareHeadline(game) {
  if (game.victory?.tipo === "exit")
    return { title: "¡VENDÍ MI STARTUP!", sub: `${game.victory.company} → ${game.victory.comprador} por US$${Math.round(game.victory.montoUsd).toLocaleString("es-AR")}` };
  if (game.victory) return { title: "¡LLEGUÉ A LA BIG TECH!", sub: `Staff Engineer en ${game.victory.company}` };
  if (game.gameOver) return { title: game.gameOver.share || game.gameOver.title.toUpperCase(), sub: "Game over… pero vuelvo más fuerte" };
  return { title: "MI CARRERA IT VA ASÍ", sub: `${LEVELS[game.level]} en la semana ${game.week}` };
}

function funnyLine(game) {
  if (game.victory?.tipo === "exit") return "Empecé con una idea en un bar y terminé firmando un exit. Ahora sí: a Miami.";
  if (game.victory && game.burnouts === 0) return "Sin burnouts, sin deudas y con los dólares abajo del colchón.";
  if (game.victory) {
    const b = game.burnouts === 1 ? "Un burnout" : `${game.burnouts} burnouts`;
    return `${b} después, lo logré. Del Hola Mundo a la Big Tech.`;
  }
  if (game.gameOver) return "El dólar, los paros y el chino del yogur vencido me ganaron esta vez.";
  if (game.kid) return "Programando con un bebé en brazos y el mate frío al lado.";
  if (game.housing === "solo") return "Pagando el alquiler ajustado por inflación como un campeón.";
  return "Sobreviviendo al dólar, a los paros y a los errores de Capa 8.";
}

export function shareText(game) {
  const { title, sub } = shareHeadline(game);
  return `${title} ${sub} en El Develop 💻🧉 ¿Vos hasta dónde llegás? Jugá gratis: ${gameUrl()}`;
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// Renderiza un ícono SVG del juego fuera de pantalla y lo devuelve como imagen para el canvas
function iconImage(name, size, color) {
  return new Promise((resolve) => {
    try {
      const div = document.createElement("div");
      const root = createRoot(div);
      flushSync(() => root.render(React.createElement(Icon, { name, size, color })));
      let svg = div.innerHTML;
      root.unmount();
      if (!svg.includes("xmlns=")) svg = svg.replace("<svg", "<svg xmlns=\"http://www.w3.org/2000/svg\"");
      loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`).then(resolve);
    } catch {
      resolve(null);
    }
  });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function panel(ctx, x, y, w, h, border = "#1f2430") {
  roundRect(ctx, x, y, w, h, 28);
  ctx.fillStyle = "rgba(14, 16, 22, 0.92)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = border;
  ctx.stroke();
}

// Escribe texto ajustando el ancho y devuelve la Y final
function wrapText(ctx, text, x, y, maxWidth, lineHeight, align = "left") {
  const words = text.split(" ");
  let line = "";
  ctx.textAlign = align;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, y);
  return y + lineHeight;
}

// Achica la fuente hasta que el texto entre en el ancho
function fitFont(ctx, text, maxWidth, size, weight = 900, family = FONT) {
  let s = size;
  do {
    ctx.font = `${weight} ${s}px ${family}`;
    s -= 4;
  } while (ctx.measureText(text).width > maxWidth && s > 30);
}

export async function createShareImage(game) {
  if (document.fonts?.ready) await document.fonts.ready;
  const logo = await loadImage("/SRV-LOGO.png");

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  const role = ROLES[game.role];
  const won = !!game.victory;
  const accent = game.gameOver ? "#ef4444" : won ? ORANGE : BLUE;
  const heroName = game.victory?.tipo === "exit" ? "rocket" : won ? "trophy" : game.gameOver ? "skull" : "laptop";
  const [hero, roleImg, ...statImgs] = await Promise.all([
    iconImage(heroName, 150, accent),
    iconImage(ROLE_ICON[game.role], 110, accent),
    ...Object.entries(STAT_INFO).map(([k, info]) => iconImage(STAT_ICON[k], 34, info.color)),
  ]);
  const metricImgs = await Promise.all(["calendar", "sparkles", "banknote", "batteryLow"].map((n) => iconImage(n, 28, "#9ca3af")));

  // Fondo: negro + grilla + brillos azul/naranja
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 2;
  for (let x = 0; x <= W; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y <= H; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const g1 = ctx.createRadialGradient(80, 120, 0, 80, 120, 900);
  g1.addColorStop(0, "rgba(11,120,251,0.35)");
  g1.addColorStop(1, "rgba(11,120,251,0)");
  ctx.fillStyle = g1;
  ctx.fillRect(0, 0, W, H);
  const g2 = ctx.createRadialGradient(W, H - 200, 0, W, H - 200, 900);
  g2.addColorStop(0, "rgba(246,149,10,0.28)");
  g2.addColorStop(1, "rgba(246,149,10,0)");
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, W, H);

  // Header: logo SRV + marca del juego
  if (logo) ctx.drawImage(logo, 70, 80, 110, 110);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.font = `900 44px ${FONT}`;
  ctx.fillText("WEARE", logo ? 200 : 70, 120);
  const weW = ctx.measureText("WEARE").width;
  ctx.fillStyle = ORANGE;
  ctx.fillText("SRV", (logo ? 200 : 70) + weW, 120);
  ctx.fillStyle = "#9ca3af";
  ctx.font = `500 28px ${FONT}`;
  ctx.fillText("presenta", logo ? 200 : 70, 166);

  roundRect(ctx, W - 410, 92, 340, 86, 20);
  ctx.fillStyle = BLUE;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = `900 40px ${MONO}`;
  ctx.fillText("</> EL DEVELOP", W - 240, 136);

  // Titular
  const { title, sub } = shareHeadline(game);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  if (hero) ctx.drawImage(hero, W / 2 - 75, 250, 150, 150);
  fitFont(ctx, title, W - 140, 92);
  ctx.fillStyle = "#fff";
  ctx.shadowColor = accent;
  ctx.shadowBlur = 30;
  ctx.fillText(title, W / 2, 520);
  ctx.shadowBlur = 0;
  ctx.fillStyle = accent;
  fitFont(ctx, sub, W - 160, 46, 700);
  ctx.fillText(sub, W / 2, 590);

  // Tarjeta del jugador
  panel(ctx, 70, 650, W - 140, 220, accent);
  ctx.textAlign = "left";
  if (roleImg) ctx.drawImage(roleImg, 115, 705, 110, 110);
  ctx.fillStyle = "#fff";
  fitFont(ctx, game.name, 640, 60);
  ctx.fillText(game.name, 270, 735);
  ctx.font = `500 34px ${FONT}`;
  ctx.fillStyle = "#9ca3af";
  ctx.fillText(role.name, 270, 790);
  const levelText = LEVELS[game.level].toUpperCase();
  ctx.font = `800 30px ${FONT}`;
  const lw = ctx.measureText(levelText).width + 44;
  roundRect(ctx, 270, 815, lw, 48, 24);
  ctx.fillStyle = "rgba(246,149,10,0.18)";
  ctx.fill();
  ctx.strokeStyle = ORANGE;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = ORANGE;
  ctx.fillText(levelText, 292, 850);

  // Barras de stats
  panel(ctx, 70, 910, W - 140, 400);
  let y = 985;
  for (const [i, [key, info]] of Object.entries(STAT_INFO).entries()) {
    const v = game.stats[key];
    ctx.textAlign = "left";
    ctx.fillStyle = "#e5e7eb";
    ctx.font = `600 34px ${FONT}`;
    if (statImgs[i]) ctx.drawImage(statImgs[i], 115, y - 28, 34, 34);
    ctx.fillText(info.label, 163, y);
    ctx.textAlign = "right";
    ctx.font = `900 36px ${FONT}`;
    ctx.fillText(String(v), W - 115, y);
    roundRect(ctx, 115, y + 20, W - 230, 22, 11);
    ctx.fillStyle = "#1a1f2a";
    ctx.fill();
    if (v > 0) {
      roundRect(ctx, 115, y + 20, Math.max(22, ((W - 230) * v) / 100), 22, 11);
      ctx.fillStyle = info.color;
      ctx.shadowColor = info.color;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    y += 92;
  }

  // Métricas
  const metrics = [
    ["Semanas", String(game.week)],
    ["XP", String(game.xp)],
    ["Dólar llegó a", `${game.dolar.toLocaleString("es-AR")}`],
    ["Burnouts", String(game.burnouts)],
  ];
  const mw = (W - 140 - 30) / 2;
  metrics.forEach(([label, value], i) => {
    const mx = 70 + (i % 2) * (mw + 30);
    const my = 1350 + Math.floor(i / 2) * 150;
    panel(ctx, mx, my, mw, 125);
    ctx.textAlign = "left";
    ctx.fillStyle = "#9ca3af";
    ctx.font = `500 28px ${FONT}`;
    if (metricImgs[i]) ctx.drawImage(metricImgs[i], mx + 30, my + 24, 28, 28);
    ctx.fillText(label, mx + 68, my + 48);
    ctx.fillStyle = "#fff";
    fitFont(ctx, value, mw - 60, 46);
    ctx.fillText(value, mx + 30, my + 100);
  });

  // Frase
  ctx.fillStyle = "#d1d5db";
  ctx.font = `italic 500 34px ${FONT}`;
  wrapText(ctx, `"${funnyLine(game)}"`, W / 2, 1690, W - 180, 44, "center");

  // CTA
  roundRect(ctx, 70, 1760, W - 140, 110, 26);
  const cta = ctx.createLinearGradient(70, 0, W - 70, 0);
  cta.addColorStop(0, BLUE);
  cta.addColorStop(1, ORANGE);
  ctx.fillStyle = cta;
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.font = `600 28px ${FONT}`;
  ctx.fillText(`¿Llegás más lejos? Jugá gratis · ${INSTAGRAM_HANDLE}`, W / 2, 1800);
  fitFont(ctx, prettyUrl(), W - 200, 44);
  ctx.fillText(prettyUrl(), W / 2, 1850);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
