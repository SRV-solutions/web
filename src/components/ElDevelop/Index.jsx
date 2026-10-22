import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import Seo from "../Seo";
import styles from "./style.module.css";
import {
  ROLES,
  ITEMS,
  LEVELS,
  PHASES,
  STAT_INFO,
  MINIGAMES,
  MODIFICADORES,
  ALGO_QUESTIONS,
  BEHAVIORAL_QUESTIONS,
  MERGE_CONFLICTS,
  FIND_BUG,
  ROLE_TECH_QUESTIONS,
  ROLE_DESIGN,
  SORTER_SETS,
} from "./data";
import { EVENTS } from "./events";
import {
  newGame,
  playWeek,
  chooseOption,
  finishMinigame,
  continueResult,
  buyItem,
  quitSecondJob,
  nextGoal,
  livingCost,
  SAVE_VERSION,
} from "./engine";
import { fmtArs, fmtUsd, price, role, difficulty } from "./helpers";
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
import Sorter from "./minigames/Sorter";
import { EXTRA_GAMES } from "./minigames/extra";
import Financiera from "./Financiera";
import CarreraPanel from "./CarreraPanel";
import { defaultFin, NIVELES, nivelActual } from "./finanzas";
import { migrarCarrera, focusOptionsEmpresa, MERCADOS } from "./carrera";
import { mensajeMinijuego } from "./mensajes";
import { Icon, IconText, ROLE_ICON, STAT_ICON, MINIGAME_ICON, ITEM_ICON, FOCUS_ICON, TAB_ICON, MISC_ICON } from "./icons";
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
const TAB_KEY = "el-develop-tab";

// Partidas guardadas antes de La Financiera / la Carrera: se completan al cargar
function migrate(s) {
  if (!s.fin) s.fin = defaultFin(s);
  if (!s.flags) s.flags = {};
  if (s.clima === undefined) s.clima = null;
  migrarCarrera(s);
  return s;
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (!s || s.version !== SAVE_VERSION) return null;
    return migrate(s);
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

const TABS = [
  { id: "semana", label: "Semana" },
  { id: "carrera", label: "Carrera" },
  { id: "financiera", label: "Financiera" },
  { id: "kiosco", label: "Kiosco" },
  { id: "log", label: "Log" },
  { id: "cursos", label: "Cursos" },
];

function loadTab() {
  try {
    const t = localStorage.getItem(TAB_KEY);
    return TABS.some((x) => x.id === t) ? t : "semana";
  } catch {
    return "semana";
  }
}

export default function ElDevelop() {
  const [game, setGame] = useState(loadGame);
  const [sharing, setSharing] = useState(false);
  const [tab, setTabState] = useState(loadTab);
  const mobile = useMediaQuery({ maxWidth: 900 });

  useEffect(() => saveGame(game), [game]);

  const setTab = (t) => {
    setTabState(t);
    try {
      localStorage.setItem(TAB_KEY, t);
    } catch {
      // sin storage
    }
  };

  const act = (fn, ...args) => setGame((g) => fn(g, ...args));

  const restart = () => {
    if (window.confirm("¿Seguro? Se pierde la partida actual (no hay git revert para esto).")) setGame(null);
  };

  let screen;
  if (!game) screen = <Setup onStart={(name, roleId) => setGame(newGame(name, roleId))} />;
  else if (game.result) screen = <ResultView result={game.result} onContinue={() => act(continueResult)} />;
  else if (game.gameOver || game.victory) screen = <EndView game={game} onRestart={() => setGame(null)} />;
  else if (game.pending?.kind === "event")
    screen = (
      <>
        {mobile && <MobileStats game={game} />}
        <Toast toast={game.toast} />
        <EventView game={game} onChoose={(i) => act(chooseOption, i)} />
      </>
    );
  else if (game.pending?.kind === "minigame")
    screen = <MinigameView key={`${game.week}-${game.pending.eventId}`} game={game} onDone={(win, msg) => act(finishMinigame, win, msg)} />;
  else screen = <Hub game={game} act={act} tab={tab} setTab={setTab} mobile={mobile} />;

  const inApp = !!game;

  return (
    <section className={`${styles.page} ${inApp ? styles.pageApp : ""}`}>
      <Seo
        title="El Develop: juego gratis de carrera IT | WEARESRV"
        description="Juego gratis de carrera IT bien argentino: sobreviví a la inflación, los paros y los errores de Capa 8 hasta llegar a una Big Tech o vender tu propia startup."
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
            <div className={styles.hudChips}>
              <span className={styles.hudChip}>
                <Icon name={MISC_ICON.week} size={14} /> Semana {game.week}
              </span>
              <span className={styles.hudChip}>
                <Icon name={MISC_ICON.dollar} size={14} /> Dólar ${game.dolar.toLocaleString("es-AR")}{" "}
                <Icon name="trendingUp" size={13} className={styles.up} />
              </span>
              <span className={styles.hudChip}>
                <Icon name={MISC_ICON.inflation} size={14} /> Inflación {Math.round((game.priceIndex - 1) * 100)}%
              </span>
              {game.carrera && (
                <span className={styles.hudChip} title={MERCADOS[game.carrera.mercado]?.desc}>
                  <Icon name={MISC_ICON.market} size={14} /> {MERCADOS[game.carrera.mercado]?.nombre || "Mercado"}
                </span>
              )}
            </div>
            <button type="button" className={`${styles.btnGhost} ${styles.btnIcon}`} onClick={restart}>
              <Icon name={MISC_ICON.restart} size={14} /> {mobile ? "" : "Reiniciar"}
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
        <span className={styles.orange}>Staff Engineer</span> en una Big Tech (o a vender tu propia startup)
      </h2>
      <p className={styles.text}>
        Balanceá Lógica, Salud Mental, Contactos, Energía y Plata semana a semana. Sobreviví a la inflación, al dólar
        que siempre sube, a los paros, al chino que te vende cosas vencidas, a los errores de Capa 8 y a los deploys de
        los viernes. Saltá de empresa, fundá la tuya o timbeá la jubilación de la abuela. Sin burnout, si se puede.
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
            <span className={styles.roleIcon}>
              <Icon name={ROLE_ICON[r.id]} size={24} />
            </span>
            <strong>{r.name}</strong>
            <span className={styles.muted}>"{r.tagline}"</span>
            <span className={styles.roleSkill}>
              <Icon name="star" size={13} /> {r.skill}: {r.skillDesc}
            </span>
            <span className={styles.roleGame}>
              {[r.minigame, r.minigame2, r.minigame3].filter(Boolean).map((m) => (
                <span key={m} className={styles.inlineIcon} style={{ marginRight: "0.6rem" }}>
                  <Icon name={MINIGAME_ICON[m]} size={14} /> {MINIGAMES[m].name}
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`}
        onClick={() => onStart(name.trim() || "El Pibe", roleId)}
      >
        $ npm start <Icon name="play" size={16} />
      </button>
    </div>
  );
}

// ---------- Sidebar ----------
function StatBar({ statKey, value, compact }) {
  const info = STAT_INFO[statKey];
  if (compact) {
    return (
      <div className={styles.mobileBar} title={info.label}>
        <Icon name={STAT_ICON[statKey]} size={16} style={{ color: info.color }} />
        <div className={styles.statTrack}>
          <div className={`${styles.statFill} ${value < 25 ? styles.statLow : ""}`} style={{ width: `${value}%`, background: info.color }} />
        </div>
        <b className={value < 25 ? styles.danger : ""}>{value}</b>
      </div>
    );
  }
  return (
    <div className={styles.stat}>
      <div className={styles.statHead}>
        <span>
          <Icon name={STAT_ICON[statKey]} size={15} style={{ color: info.color }} /> {info.label}
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
  const nv = nivelActual(game);
  return (
    <aside className={styles.sidebar}>
      <div className={styles.player}>
        <span className={styles.playerEmoji}>
          <Icon name={ROLE_ICON[r.id]} size={26} />
        </span>
        <div>
          <strong className={styles.playerName}>{game.name}</strong>
          <div className={styles.levelBadge}>{LEVELS[game.level]}</div>
          <div className={styles.muted}>{game.empresa ? `Founder de ${game.empresa.nombre}` : r.name}</div>
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
          <span className={styles.muted}>
            <Icon name={MISC_ICON.money} size={12} /> Pesos
          </span>
          <strong className={game.ars < 0 ? styles.danger : ""}>{fmtArs(game.ars)}</strong>
        </div>
        <div>
          <span className={styles.muted}>
            <Icon name={MISC_ICON.usd} size={12} /> Dólares
          </span>
          <strong className={styles.green}>{fmtUsd(game.usd)}</strong>
        </div>
        <div>
          <span className={styles.muted}>
            <Icon name={MISC_ICON.xp} size={12} /> XP
          </span>
          <strong>{game.xp}</strong>
        </div>
        <div>
          <span className={styles.muted}>
            <Icon name={MISC_ICON.expenses} size={12} /> Gastos/mes
          </span>
          <strong>{fmtArs(livingCost(game))}</strong>
        </div>
      </div>
      {game.fin && (
        <div className={`${styles.finSideBadge} ${nv >= 3 ? styles.finSideVip : ""}`}>
          <Icon name={MISC_ICON.level} size={13} /> {NIVELES[nv].name}
        </div>
      )}

      <div className={styles.jobBox}>
        {game.empresa ? (
          <>
            <strong>
              <Icon name={MISC_ICON.startup} size={14} /> {game.empresa.nombre}
            </strong>
            <span className={styles.muted}>{game.empresa.idea}</span>
          </>
        ) : game.job ? (
          <>
            <strong>
              <Icon name={MISC_ICON.job} size={14} /> {game.job.company}
            </strong>
            <span className={styles.muted}>
              Sueldo: {game.job.salaryUsd ? `${fmtUsd(game.job.salaryUsd)}/mes` : `${fmtArs(game.job.salaryArs)}/mes`}
              {game.secondJob && " + 2º laburo en USD"}
            </span>
          </>
        ) : (
          <span className={styles.muted}>{game.studyDone ? "Buscando laburo (Open to Work)" : "Estudiando"}</span>
        )}
        <span className={styles.muted}>
          <Icon name={MISC_ICON.home} size={13} /> {game.housing === "solo" ? "Alquilando solo" : "En lo de tus viejos"}
        </span>
        {game.burnouts > 0 && (
          <span className={styles.danger}>
            <Icon name={MISC_ICON.burnout} size={13} /> Burnouts: {game.burnouts}/3
          </span>
        )}
      </div>

      <div className={styles.goal}>
        <span className={styles.kicker}>// TODO: próximo objetivo</span>
        <p>{nextGoal(game)}</p>
      </div>

      <button type="button" className={`${styles.btn} ${styles.shareBtn}`} onClick={onShare}>
        <Icon name={MISC_ICON.share} size={16} /> Compartir mi progreso
      </button>
    </aside>
  );
}

// Tira de stats para celular: reemplaza a la barra lateral
function MobileStats({ game }) {
  const r = role(game);
  return (
    <div className={styles.mobileStats}>
      <div className={styles.mobileTop}>
        <span className={styles.playerEmoji} style={{ width: 42, height: 42 }}>
          <Icon name={ROLE_ICON[r.id]} size={22} />
        </span>
        <div>
          <span className={styles.mobileName}>{game.name}</span>
          <span className={styles.levelBadge}>{LEVELS[game.level]}</span>
        </div>
        <div className={styles.mobileMoney}>
          <span className={game.ars < 0 ? styles.danger : ""}>{fmtArs(game.ars)}</span>
          <b>{fmtUsd(game.usd)}</b>
        </div>
      </div>
      <div className={styles.mobileBars}>
        {Object.keys(STAT_INFO).map((k) => (
          <StatBar key={k} statKey={k} value={game.stats[k]} compact />
        ))}
      </div>
    </div>
  );
}

// ---------- Hub semanal ----------
const ACCENTS = { blue: styles.accentBlue, purple: styles.accentPurple, green: styles.accentGreen, orange: styles.accentOrange };

function focusOptions(game) {
  if (game.empresa) {
    return focusOptionsEmpresa(game).map((f) => ({ ...f, accent: ACCENTS[f.accent] || styles.accentBlue, icon: FOCUS_ICON[f.id] || MISC_ICON.startup }));
  }
  let laburo;
  if (game.job) {
    laburo =
      game.kidLeave > 0
        ? { icon: FOCUS_ICON.licencia, label: "Licencia", desc: "Estás de licencia: +Salud mental" }
        : { icon: FOCUS_ICON.laburo, label: "Laburar", desc: "+XP para ascender · -Energía · -Salud mental · puede saltar un bug en prod" };
  } else if (game.studyDone) {
    laburo = { icon: FOCUS_ICON.buscar, label: "Buscar laburo", desc: "Mandar CVs. Chance de oferta según Contactos, Lógica y el mercado" };
  } else {
    laburo = { icon: FOCUS_ICON.changas, label: "Changas", desc: "Formatear PCs del barrio · +Pesos · -Energía" };
  }
  return [
    { id: "laburo", accent: styles.accentBlue, ...laburo },
    { id: "estudio", accent: styles.accentPurple, icon: FOCUS_ICON.estudio, label: "Estudiar", desc: "Tutoriales y LeetCode · +Lógica · -Energía" },
    { id: "salud", accent: styles.accentGreen, icon: FOCUS_ICON.salud, label: "Descansar", desc: "Mate, siesta y fulbito · +Energía · +Salud mental" },
    { id: "networking", accent: styles.accentOrange, icon: FOCUS_ICON.networking, label: "Networking", desc: "Meetups y birras · +Contactos · -Pesos" },
  ];
}

function tabBadges(game) {
  const b = {};
  if (game.empresa?.ofertaCompra) b.carrera = true;
  if (game.fin?.deudaAbuela > 0 || (game.fin?.convertibilidad > 0 && game.fin?.cupoMenem > 0)) b.financiera = true;
  if (game.stats.energy < 30 && game.ars >= price(game, 4000)) b.kiosco = true;
  return b;
}

function Tabs({ tab, setTab, badges }) {
  return (
    <nav className={styles.tabs} role="tablist" aria-label="Secciones del juego">
      {TABS.map((t) => (
        <button
          type="button"
          role="tab"
          aria-selected={tab === t.id}
          key={t.id}
          className={`${styles.tab} ${tab === t.id ? styles.tabOn : ""}`}
          onClick={() => setTab(t.id)}
        >
          <Icon name={TAB_ICON[t.id]} size={18} />
          <span>{t.label}</span>
          {badges[t.id] && <span className={styles.tabDot} />}
        </button>
      ))}
    </nav>
  );
}

function Hub({ game, act, tab, setTab, mobile }) {
  const clima = MODIFICADORES.find((m) => m.id === game.clima);
  return (
    <div className={styles.hubWrap}>
      {mobile && <MobileStats game={game} />}
      <Tabs tab={tab} setTab={setTab} badges={tabBadges(game)} />

      <div className={styles.panel}>
        {tab === "semana" && (
          <div className={styles.tabPanel}>
            <Toast toast={game.toast} />
            <div className={styles.card}>
              <p className={styles.kicker}>Inicio de semana {game.week}</p>
              <h2 className={styles.title}>{game.empresa ? "¿A qué le dedicás la semana en tu startup?" : "¿En qué te enfocás esta semana?"}</h2>
              {mobile && <p className={styles.goalMobile}>{nextGoal(game)}</p>}
              {clima && (
                <div className={styles.climaChip}>
                  <Icon name={MISC_ICON.event} size={16} />
                  <span>
                    <b>Clima de la semana: {clima.name}.</b> {clima.desc}.
                  </span>
                </div>
              )}
              <div className={styles.focusGrid}>
                {focusOptions(game).map((f) => (
                  <button type="button" key={f.id} className={`${styles.focusBtn} ${f.accent}`} onClick={() => act(playWeek, f.id)}>
                    <span className={styles.focusIcon}>
                      <Icon name={f.icon} size={22} />
                    </span>
                    <strong className={styles.focusLabel}>{f.label}</strong>
                    <span className={styles.muted}>{f.desc}</span>
                  </button>
                ))}
              </div>
              {game.buffs.coffee > 0 && <p className={styles.muted}>Café de especialidad activo: {game.buffs.coffee} semana(s) más.</p>}
              {game.secondJob && (
                <button type="button" className={styles.btnGhost} onClick={() => act(quitSecondJob)}>
                  Renunciar al segundo laburo (+10 Salud mental)
                </button>
              )}
            </div>
          </div>
        )}

        {tab === "carrera" && (
          <div className={styles.tabPanel}>
            <Toast toast={game.toast} />
            <CarreraPanel game={game} act={act} />
          </div>
        )}

        {tab === "financiera" && (
          <div className={styles.tabPanel}>
            <Toast toast={game.toast} />
            <Financiera game={game} act={act} />
          </div>
        )}

        {tab === "kiosco" && (
          <div className={styles.tabPanel}>
            <Toast toast={game.toast} />
            <div className={styles.card}>
              <p className={styles.kicker}>Revisá la fecha de vencimiento</p>
              <h3 className={styles.subtitle}>El kiosco del chino</h3>
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
                      <span className={styles.shopIcon}>
                        <Icon name={ITEM_ICON[item.id]} size={20} />
                      </span>
                      <strong>{item.name}</strong>
                      <span className={styles.muted}>{item.desc}</span>
                      <span className={styles.priceTag}>
                        {owned ? (
                          <span className={styles.inlineIcon}>
                            <Icon name={MISC_ICON.check} size={14} /> Comprado
                          </span>
                        ) : (
                          fmtArs(cost)
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "log" && (
          <div className={styles.tabPanel}>
            <div className={styles.card}>
              <h3 className={styles.subtitle}>git log --oneline</h3>
              {game.log.length > 0 ? (
                <ul className={styles.log}>
                  {game.log.map((l, i) => (
                    <li key={i}>
                      <span className={styles.hash}>{(0x1a2b3c + i * 7919 + game.week * 104729).toString(16).slice(-7)}</span>
                      <span className={styles.logLine}>
                        <IconText text={l} size={13} />
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={styles.muted}>Todavía no hay commits. Elegí tu primera semana.</p>
              )}
            </div>
          </div>
        )}

        {tab === "cursos" && (
          <div className={styles.tabPanel}>
            <div className={styles.card}>
              <CoursesBlock game={game} title="¿Querés que tu carrera real avance más rápido que en el juego?" source="hub" />
              <CafecitoButton />
            </div>
            <DonationPanel source="hub" />
          </div>
        )}
      </div>
    </div>
  );
}

// Notificación de la última acción: el texto cambia según lo que pasó
function Toast({ toast }) {
  const [closedId, setClosedId] = useState(null);
  if (!toast || (toast.id && toast.id === closedId)) return null;
  const tone = toast.tone === "bad" ? styles.toastBad : toast.tone === "vip" ? styles.toastVip : "";
  return (
    <div key={toast.id || toast.text} className={`${styles.toast} ${tone}`} role="status">
      <div className={styles.toastBody}>
        <span>
          <IconText text={toast.text} />
        </span>
        {toast.extra && (
          <span className={styles.toastExtra}>
            <IconText text={toast.extra} size={14} />
          </span>
        )}
        <DeltaChips delta={toast.delta} />
      </div>
      {toast.id && (
        <button type="button" className={styles.toastClose} aria-label="Cerrar" onClick={() => setClosedId(toast.id)}>
          ×
        </button>
      )}
    </div>
  );
}

// ---------- Eventos ----------
function EventView({ game, onChoose }) {
  const ev = EVENTS[game.pending.id];
  const text = typeof ev.text === "function" ? ev.text(game) : ev.text;
  return (
    <div className={`${styles.card} ${styles.eventCard}`}>
      <p className={`${styles.kicker} ${styles.inlineIcon}`}>
        <Icon name={MISC_ICON.warning} size={13} /> Notificación nueva
      </p>
      <h2 className={styles.title}>
        <IconText text={ev.title} size={26} iconClass={styles.orange} />
      </h2>
      <p className={styles.text}>
        <IconText text={text} />
      </p>
      <div className={styles.options}>
        {ev.options.map((o, i) => (
          <button type="button" key={o.label} className={styles.option} onClick={() => onChoose(i)}>
            <strong>
              <IconText text={o.label} iconClass={styles.orange} />
            </strong>
            {o.desc && (
              <span className={styles.muted}>
                <IconText text={o.desc} size={14} />
              </span>
            )}
            {o.minigame && (
              <span className={`${styles.badge} ${styles.inlineIcon}`}>
                <Icon name={MISC_ICON.minigame} size={12} /> Minijuego
              </span>
            )}
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
  const [msg, setMsg] = useState("");
  const id = game.pending.game;
  const info = MINIGAMES[id];
  const r = role(game);
  const esDelRol = r.minigame === id || r.minigame2 === id || r.minigame3 === id;
  const timeMult = (game.inv.keyboard ? 1.1 : 1) * (game.inv.monitor ? 1.1 : 1) * (esDelRol ? 1.3 : 1);
  // En el final de la facu (nivel 0) la dificultad es 1; en la entrevista de Big Tech, 4
  const diff = difficulty(game);
  const quizTime = Math.max(9, 16 + (game.stats.logic - 50) / 8 - (diff - 1) * 2) * timeMult;
  // Preguntas de código según el rol: un frontend no revisa SQL, un data no revisa Docker
  const delRol = (pool) => {
    const filtrado = pool.filter((q) => !q.roles || q.roles.includes(r.id));
    return filtrado.length >= 3 ? filtrado : pool;
  };

  const finish = (w) => {
    setWin(w);
    setMsg(mensajeMinijuego(id, w));
    setPhase("done");
  };

  let body = null;
  if (phase === "play") {
    const common = { timeMult, diff, onFinish: finish };
    const quizCount = [3, 3, 4, 5][diff - 1];
    const Extra = EXTRA_GAMES[id];
    if (Extra) {
      body = <Extra {...common} />;
    } else {
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
        case "htmlcssjs":
        case "statuscodes":
        case "comandos":
        case "phishing":
        case "graficos":
        case "moscow":
        case "triage":
        case "bugofeature":
          body = <Sorter set={SORTER_SETS[id]} {...common} />;
          break;
        case "merge":
          body = (
            <Quiz pool={delRol(MERGE_CONFLICTS)} count={quizCount} required={quizCount - 1} timePerQ={[15, 13, 11, 10][diff - 1] * timeMult} mono onFinish={finish} />
          );
          break;
        case "findbug":
          body = (
            <Quiz pool={delRol(FIND_BUG)} count={quizCount} required={quizCount - 1} timePerQ={[20, 17, 15, 13][diff - 1] * timeMult} mono onFinish={finish} />
          );
          break;
        case "algo":
          body = <Quiz pool={ALGO_QUESTIONS} count={4} required={2} timePerQ={quizTime} onFinish={finish} />;
          break;
        case "techq":
          body = <Quiz pool={ROLE_TECH_QUESTIONS[r.id]} count={5} required={[3, 3, 4, 4][diff - 1]} timePerQ={quizTime} onFinish={finish} />;
          break;
        case "design":
          body = <DesignPicker {...common} design={ROLE_DESIGN[r.id]} />;
          break;
        case "behavioral":
          body = <Quiz pool={BEHAVIORAL_QUESTIONS} count={3} required={2} timePerQ={quizTime + 6} onFinish={finish} />;
          break;
        default:
          body = null;
      }
    }
  }

  return (
    <div className={`${styles.card} ${styles.mgCard}`}>
      <div className={styles.mgHead}>
        <span className={styles.mgIcon}>
          <Icon name={MINIGAME_ICON[id]} size={28} />
        </span>
        <div>
          <p className={styles.kicker}>Minijuego</p>
          <h2 className={styles.title}>{info.name}</h2>
        </div>
      </div>

      {phase === "brief" && (
        <>
          <p className={styles.text}>{info.howTo}</p>
          <p className={`${styles.diffStars} ${styles.inlineIcon}`}>
            Dificultad:
            {[0, 1, 2, 3].map((i) => (
              <Icon key={i} name="star" size={16} style={{ fill: i < diff ? "currentColor" : "none", opacity: i < diff ? 1 : 0.4 }} />
            ))}
            {game.pending.diffBonus ? " · el cliente está mirando por encima del hombro (+1)" : ""}
          </p>
          {timeMult > 1 && (
            <p className={styles.muted}>
              Bonus de tiempo x{timeMult.toFixed(2)}
              {esDelRol ? ` (${r.skill})` : ""}
              {game.inv.keyboard ? " (Teclado RGB)" : ""}
              {game.inv.monitor ? " (Segundo monitor)" : ""}
            </p>
          )}
          <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`} onClick={() => setPhase("play")}>
            <Icon name="play" size={16} /> Ejecutar
          </button>
        </>
      )}

      {phase === "play" && body}

      {phase === "done" && (
        <div className={styles.mgDone}>
          <p className={styles.bigEmoji}>
            <Icon name={win ? MISC_ICON.success : MISC_ICON.fail} size={56} className={win ? styles.green : styles.danger} />
          </p>
          <h3 className={styles.subtitle}>{msg}</h3>
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onDone(win, msg)}>
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
      <h2 className={styles.title}>
        <IconText text={result.title} size={24} iconClass={styles.orange} />
      </h2>
      <ul className={styles.resultLines}>
        {result.lines.map((l, i) => (
          <li key={i}>
            <IconText text={l} size={18} iconClass={styles.lineIcon} />
          </li>
        ))}
      </ul>
      <DeltaChips delta={result.delta} />
      <button type="button" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnBig}`} onClick={onContinue}>
        Continuar <Icon name="arrowRight" size={16} />
      </button>
    </div>
  );
}

// ---------- Final ----------
function EndView({ game, onRestart }) {
  const won = !!game.victory;
  const exit = game.victory?.tipo === "exit";
  let titulo = game.gameOver?.title;
  let texto = game.gameOver?.text;
  if (exit) {
    titulo = "¡VENDISTE TU STARTUP!";
    texto = `${game.name} fundó ${game.victory.company} y la vendió a ${game.victory.comprador} por ${fmtUsd(game.victory.montoUsd)} en la semana ${game.victory.week}. De una idea anotada en una servilleta a un exit en dólares. Ahora el que manda el Rolls-Royce sos vos.`;
  } else if (won) {
    titulo = "¡LLEGASTE A LA BIG TECH!";
    texto = `${game.name} entró a ${game.victory.company} como Staff Engineer en la semana ${game.victory.week}. Del "Hola Mundo" en una netbook del gobierno a la Big Tech. Campeón del mundo IT. Ahora sí: a cobrar en dólares y a guardarlos abajo del colchón.`;
  }
  return (
    <div className={`${styles.card} ${styles.endCard} ${won ? styles.endWin : styles.endLose}`}>
      <p className={styles.bigEmoji}>
        <Icon name={won ? (exit ? MISC_ICON.startup : MISC_ICON.level) : MISC_ICON.burnout} size={64} className={won ? styles.orange : styles.danger} />
      </p>
      <h2 className={styles.heroTitle}>{titulo}</h2>
      <p className={styles.text}>{texto}</p>
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
          <span className={styles.muted}>{exit ? "Exit" : "Lógica"}</span>
          <strong>{exit ? fmtUsd(game.victory.montoUsd) : game.stats.logic}</strong>
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
