import React, { useEffect, useState } from "react";
import Seo from "../Seo";
import styles from "./style.module.css";
import {
  ROLES,
  ITEMS,
  LEVELS,
  PHASES,
  STAT_INFO,
  MINIGAMES,
  ALGO_QUESTIONS,
  BEHAVIORAL_QUESTIONS,
  MERGE_CONFLICTS,
  FIND_BUG,
} from "./data";
import { EVENTS } from "./events";
import {
  newGame,
  playWeek,
  chooseOption,
  finishMinigame,
  continueResult,
  buyItem,
  sellUsd,
  quitSecondJob,
  nextGoal,
  livingCost,
  SAVE_VERSION,
} from "./engine";
import { fmtArs, fmtUsd, price, role } from "./helpers";
import FlexboxDefender from "./minigames/FlexboxDefender";
import QueryMaster from "./minigames/QueryMaster";
import ServerJuggler from "./minigames/ServerJuggler";
import FallingClick from "./minigames/FallingClick";
import Quiz from "./minigames/Quiz";
import DesignPicker from "./minigames/DesignPicker";
import Capa8 from "./minigames/Capa8";
import BugBash from "./minigames/BugBash";
import Terminal from "./minigames/Terminal";
import Memotest from "./minigames/Memotest";
import GitFlow from "./minigames/GitFlow";
import {
  SharePanel,
  ShareModal,
  MinigameCourseTip,
  CoursesBlock,
  CafecitoButton,
  DonationPanel,
  DonationReturnBanner,
} from "./PromoPanels";

const SAVE_KEY = "el-develop-save";

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.version === SAVE_VERSION ? s : null;
  } catch {
    return null;
  }
}

function saveGame(s) {
  try {
    if (s) localStorage.setItem(SAVE_KEY, JSON.stringify(s));
    else localStorage.removeItem(SAVE_KEY);
  } catch {
    // Sin storage (modo privado): se juega igual, sin guardado
  }
}

export default function ElDevelop() {
  const [game, setGame] = useState(loadGame);
  const [sharing, setSharing] = useState(false);

  useEffect(() => saveGame(game), [game]);

  const act = (fn, ...args) => setGame((g) => fn(g, ...args));

  const restart = () => {
    if (window.confirm("¿Seguro? Se pierde la partida actual (no hay git revert para esto).")) setGame(null);
  };

  let screen;
  if (!game) screen = <Setup onStart={(name, roleId) => setGame(newGame(name, roleId))} />;
  else if (game.result) screen = <ResultView result={game.result} onContinue={() => act(continueResult)} />;
  else if (game.gameOver || game.victory) screen = <EndView game={game} onRestart={() => setGame(null)} />;
  else if (game.pending?.kind === "event") screen = <EventView game={game} onChoose={(i) => act(chooseOption, i)} />;
  else if (game.pending?.kind === "minigame")
    screen = <MinigameView key={`${game.week}-${game.pending.eventId}`} game={game} onDone={(win) => act(finishMinigame, win)} />;
  else screen = <Hub game={game} act={act} />;

  return (
    <section className={styles.page}>
      <Seo
        title="El Develop: juego gratis de carrera IT | WEARESRV"
        description="Juego gratis de carrera IT bien argentino: sobreviví a la inflación, los paros y los errores de Capa 8 hasta llegar a una Big Tech."
        path="/el-develop"
      />

      <header className={styles.hud}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>{"</>"}</span>
          <div>
            <h1 className={styles.logo}>
              EL <span className={styles.orange}>DEVELOP</span>
            </h1>
            <span className={styles.brandSub}>De Hola Mundo a la Big Tech, sobreviviendo a la Argentina</span>
          </div>
        </div>
        {game && (
          <div className={styles.hudRight}>
            <span className={styles.hudChip}>📅 Semana {game.week}</span>
            <span className={styles.hudChip}>
              💵 Dólar ${game.dolar.toLocaleString("es-AR")} <b className={styles.up}>▲</b>
            </span>
            <span className={styles.hudChip}>📈 Inflación acum. {Math.round((game.priceIndex - 1) * 100)}%</span>
            <button type="button" className={styles.btnGhost} onClick={restart}>
              ↺ Reiniciar
            </button>
          </div>
        )}
      </header>

      <div className={game ? styles.layout : styles.layoutSingle}>
        {game && <Sidebar game={game} onShare={() => setSharing(true)} />}
        <div className={styles.main}>
          <DonationReturnBanner />
          {screen}
        </div>
      </div>

      {sharing && game && <ShareModal game={game} onClose={() => setSharing(false)} />}
    </section>
  );
}

// ---------- Setup ----------
function Setup({ onStart }) {
  const [name, setName] = useState("");
  const [roleId, setRoleId] = useState("backend");

  return (
    <div className={`${styles.card} ${styles.hero}`}>
      <p className={styles.kicker}>Simulador de carrera IT · Edición argentina</p>
      <h2 className={styles.heroTitle}>
        De tu primer <span className={styles.blue}>console.log("Hola Mundo")</span> a{" "}
        <span className={styles.orange}>Staff Engineer</span> en una Big Tech
      </h2>
      <p className={styles.text}>
        Balanceá Lógica, Salud Mental, Contactos, Energía y Plata semana a semana. Sobreviví a la inflación, al dólar
        que siempre sube, a los paros, al chino que te vende cosas vencidas, a los errores de Capa 8 y a los deploys de
        los viernes. Sin burnout, si se puede.
      </p>

      <div className={styles.setupRow}>
        <div>
          <label className={styles.label} htmlFor="develop-name">
            Tu nombre de usuario
          </label>
          <input
            id="develop-name"
            className={styles.input}
            value={name}
            maxLength={20}
            placeholder="Ej: El Pibe del Backend"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <p className={styles.label}>Elegí tu rol</p>
      <div className={styles.roleGrid}>
        {Object.values(ROLES).map((r) => (
          <button
            type="button"
            key={r.id}
            className={`${styles.roleCard} ${roleId === r.id ? styles.roleOn : ""}`}
            onClick={() => setRoleId(r.id)}
          >
            <span className={styles.roleEmoji}>{r.emoji}</span>
            <strong>{r.name}</strong>
            <span className={styles.muted}>"{r.tagline}"</span>
            <span className={styles.roleSkill}>
              ★ {r.skill}: {r.skillDesc}
            </span>
            <span className={styles.roleGame}>
              🎮 {MINIGAMES[r.minigame].icon} {MINIGAMES[r.minigame].name}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`}
        onClick={() => onStart(name.trim() || "El Pibe", roleId)}
      >
        $ npm start ▶
      </button>
    </div>
  );
}

// ---------- Sidebar ----------
function StatBar({ statKey, value }) {
  const info = STAT_INFO[statKey];
  return (
    <div className={styles.stat}>
      <div className={styles.statHead}>
        <span>
          {info.icon} {info.label}
        </span>
        <strong className={value < 25 ? styles.danger : ""}>{value}</strong>
      </div>
      <div className={styles.statTrack}>
        <div
          className={`${styles.statFill} ${value < 25 ? styles.statLow : ""}`}
          style={{ width: `${value}%`, background: info.color, boxShadow: `0 0 10px ${info.color}66` }}
        />
      </div>
    </div>
  );
}

function Sidebar({ game, onShare }) {
  const r = role(game);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.player}>
        <span className={styles.playerEmoji}>{r.emoji}</span>
        <div>
          <strong className={styles.playerName}>{game.name}</strong>
          <div className={styles.levelBadge}>{LEVELS[game.level]}</div>
          <div className={styles.muted}>{r.name}</div>
        </div>
      </div>
      <div className={styles.phase}>
        Fase {game.phase}/4 · {PHASES[game.phase]}
      </div>

      {Object.keys(STAT_INFO).map((k) => (
        <StatBar key={k} statKey={k} value={game.stats[k]} />
      ))}

      <div className={styles.money}>
        <div>
          <span className={styles.muted}>Pesos</span>
          <strong className={game.ars < 0 ? styles.danger : ""}>{fmtArs(game.ars)}</strong>
        </div>
        <div>
          <span className={styles.muted}>Dólares (colchón)</span>
          <strong className={styles.green}>{fmtUsd(game.usd)}</strong>
        </div>
        <div>
          <span className={styles.muted}>XP</span>
          <strong>{game.xp}</strong>
        </div>
        <div>
          <span className={styles.muted}>Gastos/mes</span>
          <strong>{fmtArs(livingCost(game))}</strong>
        </div>
      </div>

      <div className={styles.jobBox}>
        {game.job ? (
          <>
            <strong>💼 {game.job.company}</strong>
            <span className={styles.muted}>
              Sueldo: {game.job.salaryUsd ? `${fmtUsd(game.job.salaryUsd)}/mes` : `${fmtArs(game.job.salaryArs)}/mes`}
              {game.secondJob && " + 2º laburo en USD"}
            </span>
          </>
        ) : (
          <span className={styles.muted}>{game.studyDone ? "🔎 Buscando laburo (Open to Work)" : "🎒 Estudiando"}</span>
        )}
        <span className={styles.muted}>🏠 {game.housing === "solo" ? "Alquilando solo" : "En lo de tus viejos"}</span>
        {game.burnouts > 0 && <span className={styles.danger}>🟥 Burnouts: {game.burnouts}/3</span>}
      </div>

      <div className={styles.goal}>
        <span className={styles.kicker}>// TODO: próximo objetivo</span>
        <p>{nextGoal(game)}</p>
      </div>

      <button type="button" className={`${styles.btn} ${styles.shareBtn}`} onClick={onShare}>
        📸 Compartir mi progreso
      </button>
    </aside>
  );
}

// ---------- Hub semanal ----------
function focusOptions(game) {
  let laburo;
  if (game.job) {
    laburo =
      game.kidLeave > 0
        ? { emoji: "🍼", label: "Licencia", desc: "Estás de licencia: +Salud mental" }
        : { emoji: "💼", label: "Laburar", desc: "+XP para ascender · -Energía · -Salud mental · puede saltar un bug en prod" };
  } else if (game.studyDone) {
    laburo = { emoji: "🔎", label: "Buscar laburo", desc: "Mandar CVs. Chance de oferta según Contactos y Lógica" };
  } else {
    laburo = { emoji: "🛠️", label: "Changas", desc: "Formatear PCs del barrio · +Pesos · -Energía" };
  }
  return [
    { id: "laburo", accent: styles.accentBlue, ...laburo },
    { id: "estudio", accent: styles.accentPurple, emoji: "📚", label: "Estudiar", desc: "Tutoriales y LeetCode · +Lógica · -Energía" },
    { id: "salud", accent: styles.accentGreen, emoji: "🧉", label: "Descansar", desc: "Mate, siesta y fulbito · +Energía · +Salud mental" },
    { id: "networking", accent: styles.accentOrange, emoji: "🍻", label: "Networking", desc: "Meetups y birras · +Contactos · -Pesos" },
  ];
}

function Hub({ game, act }) {
  return (
    <div className={styles.hubWrap}>
      {game.toast && (
        <div className={styles.toast}>
          {game.toast.text} <DeltaChips delta={game.toast.delta} />
        </div>
      )}

      <div className={styles.card}>
        <p className={styles.kicker}>Inicio de semana {game.week}</p>
        <h2 className={styles.title}>¿En qué te enfocás esta semana?</h2>
        <div className={styles.focusGrid}>
          {focusOptions(game).map((f) => (
            <button type="button" key={f.id} className={`${styles.focusBtn} ${f.accent}`} onClick={() => act(playWeek, f.id)}>
              <span className={styles.focusEmoji}>{f.emoji}</span>
              <strong className={styles.focusLabel}>{f.label}</strong>
              <span className={styles.muted}>{f.desc}</span>
            </button>
          ))}
        </div>
        {game.buffs.coffee > 0 && <p className={styles.muted}>☕ Café de especialidad activo: {game.buffs.coffee} semana(s) más.</p>}
        {game.secondJob && (
          <button type="button" className={styles.btnGhost} onClick={() => act(quitSecondJob)}>
            Renunciar al segundo laburo (+10 Salud mental)
          </button>
        )}
      </div>

      <div className={styles.twoCols}>
        <div className={styles.card}>
          <p className={styles.kicker}>Revisá la fecha de vencimiento</p>
          <h3 className={styles.subtitle}>🛒 El kiosco del chino</h3>
          <div className={styles.shop}>
            {ITEMS.map((item) => {
              const cost = price(game, item.base);
              const owned = item.permanent && game.inv[item.id];
              return (
                <button
                  type="button"
                  key={item.id}
                  className={styles.shopItem}
                  disabled={owned || game.ars < cost}
                  onClick={() => act(buyItem, item.id)}
                >
                  <span className={styles.shopEmoji}>{item.emoji}</span>
                  <strong>{item.name}</strong>
                  <span className={styles.muted}>{item.desc}</span>
                  <span className={styles.priceTag}>{owned ? "✔ Comprado" : fmtArs(cost)}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.row}>
            <button type="button" className={styles.btn} disabled={game.usd < 100} onClick={() => act(sellUsd, 100)}>
              🔁 Vender US$100 en la cueva (${(game.dolar * 100).toLocaleString("es-AR")})
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.subtitle}>📜 git log --oneline</h3>
          {game.log.length > 0 ? (
            <ul className={styles.log}>
              {game.log.slice(0, 12).map((l, i) => (
                <li key={i}>
                  <span className={styles.hash}>{(0x1a2b3c + i * 7919 + game.week * 104729).toString(16).slice(-7)}</span> {l}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.muted}>Todavía no hay commits. Elegí tu primera semana.</p>
          )}
        </div>
      </div>

      <div className={styles.card}>
        <CoursesBlock game={game} title="¿Querés que tu carrera real avance más rápido que en el juego?" source="hub" />
        <CafecitoButton />
      </div>
    </div>
  );
}

// ---------- Eventos ----------
function EventView({ game, onChoose }) {
  const ev = EVENTS[game.pending.id];
  const text = typeof ev.text === "function" ? ev.text(game) : ev.text;
  return (
    <div className={`${styles.card} ${styles.eventCard}`}>
      <p className={styles.kicker}>⚠️ Notificación nueva</p>
      <h2 className={styles.title}>{ev.title}</h2>
      <p className={styles.text}>{text}</p>
      <div className={styles.options}>
        {ev.options.map((o, i) => (
          <button type="button" key={o.label} className={styles.option} onClick={() => onChoose(i)}>
            <strong>{o.label}</strong>
            {o.desc && <span className={styles.muted}>{o.desc}</span>}
            {o.minigame && <span className={styles.badge}>🎮 Minijuego</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ---------- Minijuegos ----------
function MinigameView({ game, onDone }) {
  const [phase, setPhase] = useState("brief");
  const [win, setWin] = useState(null);
  const id = game.pending.game;
  const info = MINIGAMES[id];
  const r = role(game);
  const timeMult = (game.inv.keyboard ? 1.1 : 1) * (game.inv.monitor ? 1.1 : 1) * (r.minigame === id ? 1.3 : 1);
  const quizTime = Math.max(12, 16 + (game.stats.logic - 50) / 8) * timeMult;

  const finish = (w) => {
    setWin(w);
    setPhase("done");
  };

  let body = null;
  if (phase === "play") {
    const common = { timeMult, onFinish: finish };
    switch (id) {
      case "css":
        body = <FlexboxDefender {...common} />;
        break;
      case "pipes":
        body = <QueryMaster {...common} />;
        break;
      case "servers":
        body = <ServerJuggler {...common} />;
        break;
      case "hack":
      case "data":
      case "prioritizer":
        body = <FallingClick variant={id} {...common} />;
        break;
      case "capa8":
        body = <Capa8 {...common} />;
        break;
      case "bugbash":
        body = <BugBash {...common} />;
        break;
      case "terminal":
        body = <Terminal {...common} />;
        break;
      case "memotest":
        body = <Memotest {...common} />;
        break;
      case "gitflow":
        body = <GitFlow {...common} />;
        break;
      case "merge":
        body = <Quiz pool={MERGE_CONFLICTS} count={3} required={2} timePerQ={15 * timeMult} mono onFinish={finish} />;
        break;
      case "findbug":
        body = <Quiz pool={FIND_BUG} count={3} required={2} timePerQ={20 * timeMult} mono onFinish={finish} />;
        break;
      case "algo":
        body = <Quiz pool={ALGO_QUESTIONS} count={4} required={2} timePerQ={quizTime} onFinish={finish} />;
        break;
      case "design":
        body = <DesignPicker {...common} />;
        break;
      case "behavioral":
        body = <Quiz pool={BEHAVIORAL_QUESTIONS} count={3} required={2} timePerQ={quizTime + 6} onFinish={finish} />;
        break;
      default:
        body = null;
    }
  }

  return (
    <div className={`${styles.card} ${styles.mgCard}`}>
      <div className={styles.mgHead}>
        <span className={styles.mgIcon}>{info.icon}</span>
        <div>
          <p className={styles.kicker}>Minijuego</p>
          <h2 className={styles.title}>{info.name}</h2>
        </div>
      </div>

      {phase === "brief" && (
        <>
          <p className={styles.text}>{info.howTo}</p>
          {timeMult > 1 && (
            <p className={styles.muted}>
              ⏱️ Bonus de tiempo x{timeMult.toFixed(2)}
              {r.minigame === id ? ` (${r.skill})` : ""}
              {game.inv.keyboard ? " (Teclado RGB)" : ""}
              {game.inv.monitor ? " (Segundo monitor)" : ""}
            </p>
          )}
          <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`} onClick={() => setPhase("play")}>
            ▶ Ejecutar
          </button>
        </>
      )}

      {phase === "play" && body}

      {phase === "done" && (
        <div className={styles.mgDone}>
          <p className={styles.bigEmoji}>{win ? "✅" : "💥"}</p>
          <h3 className={styles.subtitle}>{win ? "Build passing · Deploy exitoso" : "Build failed · exit code 1"}</h3>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onDone(win)}>
            Continuar
          </button>
          {!win && <MinigameCourseTip gameId={id} />}
        </div>
      )}
    </div>
  );
}

// ---------- Resultado ----------
const DELTA_LABELS = {
  logic: "Lógica",
  mental: "Salud mental",
  network: "Contactos",
  energy: "Energía",
  xp: "XP",
  ars: "ARS",
  usd: "USD",
};

function DeltaChips({ delta }) {
  if (!delta) return null;
  const entries = Object.entries(delta).filter(([, v]) => v);
  if (!entries.length) return null;
  return (
    <div className={styles.chips}>
      {entries.map(([k, v]) => {
        const val = k === "ars" ? fmtArs(Math.abs(v)) : k === "usd" ? fmtUsd(Math.abs(v)) : Math.abs(v);
        return (
          <span key={k} className={`${styles.chip} ${v > 0 ? styles.chipGood : styles.chipBad}`}>
            {v > 0 ? "+" : "-"}
            {val} {k === "ars" || k === "usd" ? "" : DELTA_LABELS[k]}
          </span>
        );
      })}
    </div>
  );
}

function ResultView({ result, onContinue }) {
  return (
    <div className={`${styles.card} ${styles.resultCard}`}>
      <p className={styles.kicker}>Resultado</p>
      <h2 className={styles.title}>{result.title}</h2>
      <ul className={styles.resultLines}>
        {result.lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <DeltaChips delta={result.delta} />
      <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`} onClick={onContinue}>
        Continuar ▶
      </button>
    </div>
  );
}

// ---------- Final ----------
function EndView({ game, onRestart }) {
  const won = !!game.victory;
  return (
    <div className={`${styles.card} ${styles.endCard} ${won ? styles.endWin : styles.endLose}`}>
      <p className={styles.bigEmoji}>{won ? "🏆" : "🥀"}</p>
      <h2 className={styles.heroTitle}>{won ? "¡LLEGASTE A LA BIG TECH!" : game.gameOver.title}</h2>
      <p className={styles.text}>
        {won
          ? `${game.name} entró a ${game.victory.company} como Staff Engineer en la semana ${game.victory.week}. Del "Hola Mundo" en una netbook del gobierno a la Big Tech. Campeón del mundo IT. Ahora sí: a cobrar en dólares y a guardarlos abajo del colchón.`
          : game.gameOver.text}
      </p>
      <div className={styles.money}>
        <div>
          <span className={styles.muted}>Semanas jugadas</span>
          <strong>{game.week}</strong>
        </div>
        <div>
          <span className={styles.muted}>Nivel</span>
          <strong>{LEVELS[game.level]}</strong>
        </div>
        <div>
          <span className={styles.muted}>Lógica</span>
          <strong>{game.stats.logic}</strong>
        </div>
        <div>
          <span className={styles.muted}>Burnouts</span>
          <strong>{game.burnouts}</strong>
        </div>
      </div>
      <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`} onClick={onRestart}>
        $ git checkout -b nueva-partida
      </button>

      <div className={styles.endExtras}>
        <SharePanel game={game} />
        <CoursesBlock
          game={game}
          title={won ? "Ganaste en el juego. Ahora ganá en la vida real." : "En la vida real no hay game over: se aprende y se vuelve."}
          source={won ? "victory" : "gameover"}
        />
        <DonationPanel source={won ? "victory" : "gameover"} />
      </div>
    </div>
  );
}
