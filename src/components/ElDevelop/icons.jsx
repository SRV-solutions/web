// Íconos SVG del juego: Lucide (react-icons/lu) en vez de emojis, que en Windows se ven como cuadraditos.
// Cada ícono se importa por nombre, así el bundle solo lleva los que se usan.
import React from "react";
import {
  LuAlarmClock,
  LuAngry,
  LuAnnoyed,
  LuArmchair,
  LuArrowDown,
  LuArrowLeftRight,
  LuArrowRight,
  LuArrowUp,
  LuAtom,
  LuAward,
  LuAxe,
  LuBaby,
  LuBackpack,
  LuBan,
  LuBandage,
  LuBanknote,
  LuBatteryLow,
  LuBed,
  LuBeef,
  LuBeer,
  LuBell,
  LuBellOff,
  LuBellRing,
  LuBicepsFlexed,
  LuBike,
  LuBlocks,
  LuBomb,
  LuBookOpen,
  LuBot,
  LuBrain,
  LuBrainCircuit,
  LuBrickWall,
  LuBriefcase,
  LuBug,
  LuBugOff,
  LuBus,
  LuCalculator,
  LuCalendar,
  LuCalendarClock,
  LuCalendarDays,
  LuCalendarRange,
  LuCamera,
  LuCandy,
  LuCassetteTape,
  LuCat,
  LuChartBar,
  LuChartGantt,
  LuChartPie,
  LuChartScatter,
  LuCheck,
  LuCherry,
  LuCircleCheck,
  LuCircleDollarSign,
  LuCircleHelp,
  LuCircleX,
  LuClipboardList,
  LuClock,
  LuCloud,
  LuClover,
  LuCode,
  LuCoffee,
  LuCog,
  LuCoins,
  LuContainer,
  LuCookie,
  LuCreditCard,
  LuCroissant,
  LuCrown,
  LuCupSoda,
  LuDatabase,
  LuDice5,
  LuDices,
  LuDollarSign,
  LuDoorOpen,
  LuDot,
  LuDownload,
  LuEarth,
  LuEgg,
  LuEraser,
  LuEye,
  LuEyeOff,
  LuFileCode,
  LuFileDiff,
  LuFileText,
  LuFish,
  LuFlag,
  LuFlame,
  LuFlower,
  LuFolderKanban,
  LuFootprints,
  LuFrown,
  LuGamepad2,
  LuGavel,
  LuGift,
  LuGitBranch,
  LuGitCompare,
  LuGitMerge,
  LuGlassWater,
  LuGlobe,
  LuGraduationCap,
  LuHammer,
  LuHand,
  LuHandCoins,
  LuHandHeart,
  LuHandshake,
  LuHardDrive,
  LuHardHat,
  LuHeadphones,
  LuHeadset,
  LuHeart,
  LuHeartHandshake,
  LuHeartPulse,
  LuHourglass,
  LuHouse,
  LuInfo,
  LuKeyRound,
  LuKeyboard,
  LuLandmark,
  LuLaptop,
  LuLeaf,
  LuLightbulb,
  LuLink,
  LuLock,
  LuLockOpen,
  LuMail,
  LuMailOpen,
  LuMegaphone,
  LuMessageCircle,
  LuMessageSquare,
  LuMilestone,
  LuMilk,
  LuMonitor,
  LuMoon,
  LuNetwork,
  LuNotebookPen,
  LuOctagonAlert,
  LuPackage,
  LuPalette,
  LuPartyPopper,
  LuPenLine,
  LuPhone,
  LuPhoneOff,
  LuPiggyBank,
  LuPizza,
  LuPlay,
  LuPlug,
  LuPresentation,
  LuPrinter,
  LuPuzzle,
  LuRadioTower,
  LuReceipt,
  LuRefreshCw,
  LuRocket,
  LuRotateCcw,
  LuRoute,
  LuRuler,
  LuScale,
  LuScrollText,
  LuSearch,
  LuSearchCode,
  LuSend,
  LuServer,
  LuShare2,
  LuShield,
  LuShieldCheck,
  LuShieldPlus,
  LuShirt,
  LuShoppingBag,
  LuShoppingCart,
  LuShowerHead,
  LuSiren,
  LuSkull,
  LuSmartphone,
  LuSmile,
  LuSofa,
  LuSparkles,
  LuSpeech,
  LuSquare,
  LuSquareCheck,
  LuSquareTerminal,
  LuStar,
  LuStethoscope,
  LuStore,
  LuSun,
  LuTarget,
  LuTerminal,
  LuThermometer,
  LuThumbsDown,
  LuThumbsUp,
  LuTicket,
  LuTimer,
  LuTreeDeciduous,
  LuTreePalm,
  LuTrendingDown,
  LuTrendingUp,
  LuTriangleAlert,
  LuTrophy,
  LuTurtle,
  LuTv,
  LuUserRound,
  LuUsers,
  LuVault,
  LuVolleyball,
  LuVote,
  LuWallet,
  LuWandSparkles,
  LuWind,
  LuWine,
  LuWrench,
  LuX,
  LuZap,
  LuZapOff,
} from "react-icons/lu";
import {
  SiCss3,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMongodb,
  SiNodedotjs,
  SiOpenjdk,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRust,
  SiTypescript,
} from "react-icons/si";
import styles from "./icons.module.css";

// ---------- Nombre corto -> componente Lucide ----------
export const ICONS = {
  // genéricos / estado
  dot: LuDot,
  sparkles: LuSparkles,
  check: LuCheck,
  circleCheck: LuCircleCheck,
  x: LuX,
  circleX: LuCircleX,
  squareCheck: LuSquareCheck,
  square: LuSquare,
  alert: LuTriangleAlert,
  danger: LuOctagonAlert,
  info: LuInfo,
  help: LuCircleHelp,
  ban: LuBan,
  play: LuPlay,
  arrowRight: LuArrowRight,
  arrowUp: LuArrowUp,
  arrowDown: LuArrowDown,
  swap: LuArrowLeftRight,
  refresh: LuRefreshCw,
  rotateCcw: LuRotateCcw,
  share: LuShare2,
  download: LuDownload,
  link: LuLink,
  send: LuSend,
  star: LuStar,
  lock: LuLock,
  lockOpen: LuLockOpen,
  key: LuKeyRound,
  eye: LuEye,
  eyeOff: LuEyeOff,
  bell: LuBell,
  bellRing: LuBellRing,
  bellOff: LuBellOff,
  flag: LuFlag,
  target: LuTarget,
  lightbulb: LuLightbulb,
  // tiempo
  calendar: LuCalendar,
  calendarDays: LuCalendarDays,
  calendarClock: LuCalendarClock,
  calendarRange: LuCalendarRange,
  clock: LuClock,
  timer: LuTimer,
  alarmClock: LuAlarmClock,
  hourglass: LuHourglass,
  // roles y stats
  palette: LuPalette,
  brickWall: LuBrickWall,
  cloud: LuCloud,
  shield: LuShield,
  shieldCheck: LuShieldCheck,
  shieldPlus: LuShieldPlus,
  brainCircuit: LuBrainCircuit,
  brain: LuBrain,
  clipboard: LuClipboardList,
  headset: LuHeadset,
  headphones: LuHeadphones,
  bug: LuBug,
  bugOff: LuBugOff,
  heartPulse: LuHeartPulse,
  handshake: LuHandshake,
  zap: LuZap,
  zapOff: LuZapOff,
  batteryLow: LuBatteryLow,
  // fierros y código
  server: LuServer,
  monitor: LuMonitor,
  laptop: LuLaptop,
  smartphone: LuSmartphone,
  phone: LuPhone,
  phoneOff: LuPhoneOff,
  printer: LuPrinter,
  tv: LuTv,
  keyboard: LuKeyboard,
  terminal: LuTerminal,
  squareTerminal: LuSquareTerminal,
  code: LuCode,
  fileCode: LuFileCode,
  fileDiff: LuFileDiff,
  file: LuFileText,
  database: LuDatabase,
  hardDrive: LuHardDrive,
  plug: LuPlug,
  container: LuContainer,
  bot: LuBot,
  atom: LuAtom,
  cog: LuCog,
  network: LuNetwork,
  blocks: LuBlocks,
  puzzle: LuPuzzle,
  gitBranch: LuGitBranch,
  gitMerge: LuGitMerge,
  gitCompare: LuGitCompare,
  search: LuSearch,
  searchCode: LuSearchCode,
  radioTower: LuRadioTower,
  globe: LuGlobe,
  earth: LuEarth,
  mail: LuMail,
  mailOpen: LuMailOpen,
  messageCircle: LuMessageCircle,
  messageSquare: LuMessageSquare,
  speech: LuSpeech,
  megaphone: LuMegaphone,
  siren: LuSiren,
  eraser: LuEraser,
  fish: LuFish,
  kanban: LuFolderKanban,
  chartBar: LuChartBar,
  chartPie: LuChartPie,
  chartScatter: LuChartScatter,
  chartGantt: LuChartGantt,
  trendingUp: LuTrendingUp,
  trendingDown: LuTrendingDown,
  ruler: LuRuler,
  route: LuRoute,
  scale: LuScale,
  // plata y timba
  banknote: LuBanknote,
  dollar: LuDollarSign,
  coin: LuCircleDollarSign,
  coins: LuCoins,
  handCoins: LuHandCoins,
  wallet: LuWallet,
  piggyBank: LuPiggyBank,
  creditCard: LuCreditCard,
  receipt: LuReceipt,
  calculator: LuCalculator,
  vault: LuVault,
  landmark: LuLandmark,
  gavel: LuGavel,
  vote: LuVote,
  store: LuStore,
  shoppingCart: LuShoppingCart,
  shoppingBag: LuShoppingBag,
  package: LuPackage,
  ticket: LuTicket,
  dice: LuDice5,
  dices: LuDices,
  cherry: LuCherry,
  crown: LuCrown,
  axe: LuAxe,
  cassette: LuCassetteTape,
  // laburo y carrera
  briefcase: LuBriefcase,
  trophy: LuTrophy,
  award: LuAward,
  rocket: LuRocket,
  graduationCap: LuGraduationCap,
  bookOpen: LuBookOpen,
  notebookPen: LuNotebookPen,
  penLine: LuPenLine,
  presentation: LuPresentation,
  backpack: LuBackpack,
  scroll: LuScrollText,
  milestone: LuMilestone,
  gamepad: LuGamepad2,
  camera: LuCamera,
  // casa y vida
  house: LuHouse,
  doorOpen: LuDoorOpen,
  armchair: LuArmchair,
  sofa: LuSofa,
  bed: LuBed,
  showerHead: LuShowerHead,
  wrench: LuWrench,
  hammer: LuHammer,
  hardHat: LuHardHat,
  gift: LuGift,
  flower: LuFlower,
  bus: LuBus,
  bike: LuBike,
  footprints: LuFootprints,
  cat: LuCat,
  turtle: LuTurtle,
  egg: LuEgg,
  tree: LuTreeDeciduous,
  treePalm: LuTreePalm,
  leaf: LuLeaf,
  sun: LuSun,
  moon: LuMoon,
  wind: LuWind,
  flame: LuFlame,
  bomb: LuBomb,
  skull: LuSkull,
  clover: LuClover,
  wand: LuWandSparkles,
  // gente y caras
  user: LuUserRound,
  users: LuUsers,
  hand: LuHand,
  handHeart: LuHandHeart,
  heartHandshake: LuHeartHandshake,
  party: LuPartyPopper,
  thumbsUp: LuThumbsUp,
  thumbsDown: LuThumbsDown,
  biceps: LuBicepsFlexed,
  baby: LuBaby,
  milk: LuMilk,
  shirt: LuShirt,
  smile: LuSmile,
  annoyed: LuAnnoyed,
  angry: LuAngry,
  frown: LuFrown,
  heart: LuHeart,
  // salud
  bandage: LuBandage,
  thermometer: LuThermometer,
  stethoscope: LuStethoscope,
  // morfi
  coffee: LuCoffee,
  cupSoda: LuCupSoda,
  glassWater: LuGlassWater,
  beer: LuBeer,
  wine: LuWine,
  pizza: LuPizza,
  beef: LuBeef,
  croissant: LuCroissant,
  candy: LuCandy,
  cookie: LuCookie,
  ball: LuVolleyball,
};

// Color por defecto de los íconos "de estado" (IconText / IconLabel lo usan si no les pasás color)
export const ICON_TONE = {
  check: "var(--green)",
  circleCheck: "var(--green)",
  squareCheck: "var(--green)",
  shieldCheck: "var(--green)",
  thumbsUp: "var(--green)",
  party: "var(--green)",
  x: "var(--red)",
  circleX: "var(--red)",
  danger: "var(--red)",
  bomb: "var(--red)",
  skull: "var(--red)",
  siren: "var(--red)",
  thumbsDown: "var(--red)",
  heart: "var(--red)",
  alert: "var(--orange)",
  alarmClock: "var(--orange)",
  flame: "var(--orange)",
  lightbulb: "var(--orange)",
  star: "var(--orange)",
  trophy: "var(--orange)",
};

// ---------- Mapas por id del juego (valores = claves de ICONS) ----------
export const ROLE_ICON = {
  frontend: "palette",
  backend: "brickWall",
  devops: "cloud",
  security: "shield",
  data: "brainCircuit",
  pm: "clipboard",
  soporte: "headset",
  qa: "bug",
};

export const STAT_ICON = {
  logic: "brain",
  mental: "heartPulse",
  network: "handshake",
  energy: "zap",
};

export const MINIGAME_ICON = {
  css: "palette",
  pipes: "plug",
  servers: "server",
  hack: "shield",
  data: "eraser",
  prioritizer: "clipboard",
  capa8: "hand",
  bugbash: "bug",
  merge: "gitMerge",
  findbug: "searchCode",
  terminal: "terminal",
  memotest: "brain",
  gitflow: "gitBranch",
  htmlcssjs: "puzzle",
  statuscodes: "radioTower",
  comandos: "squareTerminal",
  phishing: "fish",
  graficos: "chartBar",
  moscow: "kanban",
  triage: "siren",
  bugofeature: "search",
  techq: "help",
  algo: "laptop",
  design: "blocks",
  behavioral: "speech",
  // minijuegos nuevos
  pixelperfect: "ruler",
  endpoints: "route",
  deploywindow: "calendarClock",
  parches: "shieldPlus",
  outliers: "chartScatter",
  sprintplanner: "chartGantt",
  simonhelpdesk: "headset",
  spotdiff: "fileDiff",
};

export const ITEM_ICON = {
  mate: "cupSoda",
  alfajor: "candy",
  facturas: "croissant",
  fernet: "glassWater",
  cafe: "coffee",
  keyboard: "keyboard",
  monitor: "monitor",
  headphones: "headphones",
  chair: "armchair",
};

export const FOCUS_ICON = {
  laburo: "briefcase",
  buscar: "search",
  changas: "wrench",
  licencia: "baby",
  estudio: "bookOpen",
  salud: "cupSoda",
  networking: "beer",
  vender: "swap",
  producto: "package",
  inversores: "handCoins",
};

export const TAB_ICON = {
  semana: "calendar",
  carrera: "milestone",
  financiera: "vault",
  kiosco: "store",
  log: "scroll",
  cursos: "graduationCap",
  cueva: "banknote",
  casino: "dices",
  abuela: "user",
  congreso: "landmark",
};

export const MISC_ICON = {
  week: "calendar",
  dollar: "dollar",
  inflation: "trendingUp",
  restart: "rotateCcw",
  share: "share",
  cafecito: "coffee",
  course: "graduationCap",
  donate: "handHeart",
  xp: "sparkles",
  money: "banknote",
  usd: "dollar",
  expenses: "receipt",
  job: "briefcase",
  home: "house",
  goal: "target",
  burnout: "batteryLow",
  level: "award",
  offer: "mailOpen",
  startup: "rocket",
  market: "store",
  reputation: "star",
  warning: "alert",
  success: "circleCheck",
  fail: "circleX",
  info: "info",
  event: "bell",
  minigame: "gamepad",
  continue: "arrowRight",
  play: "play",
  close: "x",
  up: "arrowUp",
  down: "arrowDown",
  lock: "lock",
  unlock: "lockOpen",
  check: "check",
  cross: "x",
};

// La Financiera (finanzas.js)
export const JUEGO_ICON = { doble: "coins", timba: "dice", vuelo: "rocket" };
export const NIVEL_ICON = ["egg", "tree", "doorOpen", "treePalm", "package"];
export const LEY_ICON = {
  motosierra: "axe",
  cepo: "lockOpen",
  dolarizacion: "crown",
  convertibilidad: "cassette",
  bono_jubilados: "user",
  impuestazo: "receipt",
  ludopatia: "dices",
  cepo_duro: "lock",
  feriado: "sun",
};

// ---------- Tecnologías (Simple Icons) ----------
export const TECH_ICON = {
  React: SiReact,
  Python: SiPython,
  Docker: SiDocker,
  Linux: SiLinux,
  Java: SiOpenjdk,
  Postgres: SiPostgresql,
  PostgreSQL: SiPostgresql,
  Rust: SiRust,
  MongoDB: SiMongodb,
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Node: SiNodedotjs,
  Git: SiGit,
  HTML: SiHtml5,
  CSS: SiCss3,
};

// Colores de marca, aclarados para fondo negro
export const TECH_COLOR = {
  React: "#61dafb",
  Python: "#4b8bbe",
  Docker: "#2496ed",
  Linux: "#fcc624",
  Java: "#f89820",
  Postgres: "#6ea0ff",
  PostgreSQL: "#6ea0ff",
  Rust: "#dea584",
  MongoDB: "#47a248",
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Node: "#5fa04e",
  Git: "#f05032",
  HTML: "#e34f26",
  CSS: "#1572b6",
};

// ---------- Emoji -> nombre de ícono ----------
// Escritos como aparecen en el código; abajo se generan las variantes con y sin U+FE0F.
const EMOJI_SRC = {
  "✅": "circleCheck",
  "❌": "circleX",
  "✔": "check",
  "✕": "x",
  "☑": "squareCheck",
  "☐": "square",
  "■": "square",
  "□": "square",
  "▶": "play",
  "→": "arrowRight",
  "★": "star",
  "☆": "star",
  "⭐": "star",
  "⚠️": "alert",
  "🟥": "danger",
  "🟨": "code",
  "⏰": "alarmClock",
  "⏳": "hourglass",
  "⏱️": "timer",
  "📅": "calendar",
  "📆": "calendarDays",
  "🎯": "target",
  "💡": "lightbulb",
  "🔒": "lock",
  "🔓": "lockOpen",
  "🔑": "key",
  "👀": "eye",
  "🙈": "eyeOff",
  "🔕": "bellOff",
  "📲": "bellRing",
  "🚫": "ban",
  "🙅": "ban",
  "🇦🇷": "flag",
  "⬇️": "download",
  "🔗": "link",
  "📤": "send",
  "🔁": "swap",
  "🔄": "refresh",
  // roles, stats y minijuegos
  "🎨": "palette",
  "🧱": "brickWall",
  "☁️": "cloud",
  "🛡️": "shield",
  "🔮": "brainCircuit",
  "📋": "clipboard",
  "🎧": "headphones",
  "🐞": "bug",
  "🐛": "bug",
  "🧠": "brain",
  "🧘": "heartPulse",
  "🤝": "handshake",
  "⚡": "zap",
  "🔌": "plug",
  "🖥️": "monitor",
  "🧹": "eraser",
  "🙋": "hand",
  "🔀": "gitMerge",
  "🔍": "search",
  "🔎": "search",
  "⌨️": "keyboard",
  "🌿": "gitBranch",
  "🧩": "puzzle",
  "📡": "radioTower",
  "🐧": "terminal",
  "🎣": "fish",
  "📊": "chartBar",
  "🗂️": "kanban",
  "🚨": "siren",
  "💻": "laptop",
  "🏗️": "blocks",
  "🗣️": "speech",
  "🧑‍💻": "code",
  "🧑‍🏫": "presentation",
  // fierros
  "📱": "smartphone",
  "📵": "phoneOff",
  "📞": "phone",
  "🖨️": "printer",
  "📺": "tv",
  "💽": "hardDrive",
  "🗄️": "database",
  "🤖": "bot",
  "📄": "file",
  "📧": "mail",
  "📩": "mailOpen",
  "💬": "messageCircle",
  "📢": "megaphone",
  "📡 ": "radioTower",
  "🌐": "globe",
  "🌍": "earth",
  "📷": "camera",
  "📸": "camera",
  "🎮": "gamepad",
  "⚛️": "atom",
  "🐍": "code",
  "🐳": "container",
  "🐘": "database",
  "🦀": "cog",
  "🍃": "leaf",
  "🐢": "turtle",
  // plata
  "💵": "banknote",
  "💰": "coins",
  "🪙": "coin",
  "💸": "handCoins",
  "💳": "creditCard",
  "🧾": "receipt",
  "📈": "trendingUp",
  "📉": "trendingDown",
  "🏦": "vault",
  "🏛️": "landmark",
  "🗳️": "vote",
  "🛒": "shoppingCart",
  "🛍️": "shoppingBag",
  "📦": "package",
  "🎟️": "ticket",
  "🎰": "dices",
  "🎲": "dice",
  "🍒": "cherry",
  "🦁": "crown",
  "🪚": "axe",
  "📼": "cassette",
  "🧦": "piggyBank",
  "🌳": "tree",
  "🌴": "treePalm",
  "🏖️": "sun",
  "🐣": "egg",
  "🕳️": "doorOpen",
  "👔": "calculator",
  // laburo y carrera
  "💼": "briefcase",
  "🏆": "trophy",
  "🚀": "rocket",
  "🎓": "graduationCap",
  "📚": "bookOpen",
  "📖": "bookOpen",
  "📝": "notebookPen",
  "✍️": "penLine",
  "🎒": "backpack",
  "📜": "scroll",
  "🎁": "gift",
  "⚖️": "scale",
  "🤷": "help",
  "🧙": "wand",
  "🥧": "chartPie",
  "🤞": "clover",
  // casa y vida
  "🏠": "house",
  "🚪": "doorOpen",
  "🪑": "armchair",
  "🛋️": "sofa",
  "🛌": "bed",
  "😴": "bed",
  "🚿": "showerHead",
  "🔧": "wrench",
  "🛠️": "wrench",
  "🧰": "wrench",
  "🔨": "hammer",
  "👷": "hardHat",
  "💐": "flower",
  "🥀": "skull",
  "🚌": "bus",
  "🚲": "bike",
  "🚶": "footprints",
  "🐱": "cat",
  "🌙": "moon",
  "💨": "wind",
  "😮‍💨": "wind",
  "🔥": "flame",
  "🌶️": "flame",
  "🕯️": "zapOff",
  "💥": "bomb",
  "💣": "bomb",
  // gente y caras
  "👵": "user",
  "✊": "hand",
  "🙌": "party",
  "🎉": "party",
  "👏": "party",
  "🙏": "handHeart",
  "👍": "thumbsUp",
  "👎": "thumbsDown",
  "💪": "biceps",
  "👶": "baby",
  "🤱": "baby",
  "🍼": "milk",
  "🙂": "smile",
  "🙃": "smile",
  "😠": "angry",
  "😤": "angry",
  "🤬": "angry",
  "💢": "angry",
  "😩": "frown",
  "😭": "frown",
  "🤢": "frown",
  "🤯": "brain",
  "❤️": "heart",
  // salud
  "🤕": "bandage",
  "🩹": "bandage",
  "🤒": "thermometer",
  "🩺": "stethoscope",
  // morfi
  "☕": "coffee",
  "🧉": "cupSoda",
  "🥤": "glassWater",
  "🍻": "beer",
  "🥂": "wine",
  "🍷": "wine",
  "🍕": "pizza",
  "🥩": "beef",
  "🥐": "croissant",
  "🍫": "candy",
  "⚽": "ball",
  // combos que aparecen pegados en el código
  "🍕🥂": "pizza",
  "💼💼": "briefcase",
  "🚀🔥": "rocket",
  "👵💰": "coins",
  "👵💥": "bomb",
  "👵💢": "angry",
  "👵☕": "user",
  "📐": "ruler",
  "🌤️": "sun",
};

export const EMOJI_ICON = {};
for (const [emoji, icon] of Object.entries(EMOJI_SRC)) {
  const bare = emoji.replace(/️/g, "").trim();
  EMOJI_ICON[emoji.trim()] = icon;
  EMOJI_ICON[bare] = icon;
  if ([...bare].length === 1) EMOJI_ICON[`${bare}️`] = icon;
}

// ---------- Detección de emojis al inicio de un texto ----------
const PICTO =
  "(?:\\p{Extended_Pictographic}|[\\u2190-\\u21FF\\u25A0-\\u25FF\\u2600-\\u27BF\\u2B00-\\u2BFF])(?:\\uFE0F|\\p{Emoji_Modifier})?";
const SEQ = `(?:\\p{Regional_Indicator}{2}|[#*0-9]\\uFE0F?\\u20E3|${PICTO}(?:\\u200D${PICTO})*)`;
const LEADING_RE = new RegExp(`^\\s*(${SEQ}+)\\s*`, "u");
const FIRST_RE = new RegExp(`^${SEQ}`, "u");
const ALL_RE = new RegExp(`${SEQ}+`, "gu");
const MODS_RE = /[️\u{1F3FB}-\u{1F3FF}]/gu;

// Saca el bloque de emojis con que arranca un texto (y el espacio que sigue)
export function sinEmoji(text) {
  if (typeof text !== "string") return text;
  return text.replace(LEADING_RE, "");
}

// { icon, emoji, text }: icon es "dot" si hay emoji pero no está mapeado; null si no hay emoji
export function splitEmoji(text) {
  if (typeof text !== "string") return { icon: null, emoji: null, text };
  const m = LEADING_RE.exec(text);
  if (!m) return { icon: null, emoji: null, text };
  const emoji = m[1];
  const first = (FIRST_RE.exec(emoji) || [emoji])[0];
  const icon =
    EMOJI_ICON[emoji] ||
    EMOJI_ICON[emoji.replace(MODS_RE, "")] ||
    EMOJI_ICON[first] ||
    EMOJI_ICON[first.replace(MODS_RE, "")] ||
    "dot";
  return { icon, emoji, text: text.slice(m[0].length) };
}

// ---------- Componentes ----------
const BASE_STYLE = { verticalAlign: "-0.15em", flexShrink: 0 };

export function Icon({ name, size = 18, className, title, style, color, ...rest }) {
  const Cmp = ICONS[name] || ICONS.dot;
  return (
    <Cmp
      size={size}
      color={color}
      className={className}
      title={title}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ ...BASE_STYLE, ...style }}
      {...rest}
    />
  );
}

// Ícono de tecnología (Simple Icons) con su color de marca; si no hay logo, cae a un ícono de código
export function TechIcon({ name, size = 18, color, className, title, style }) {
  const Cmp = TECH_ICON[name];
  if (!Cmp) return <Icon name="code" size={size} color={color} className={className} title={title} style={style} />;
  return (
    <Cmp
      size={size}
      color={color ?? TECH_COLOR[name]}
      className={className}
      title={title}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      style={{ ...BASE_STYLE, ...style }}
    />
  );
}

// Tinte translúcido de un color (hex o var(--x)) para el fondo de IconBox
function tint(color, alpha) {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color || "");
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.replace(/./g, (c) => c + c);
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

// Cuadradito redondeado con el ícono coloreado y fondo tintado (36px; large = 56px)
export function IconBox({ name, color = "var(--blue)", size, large = false, className, style, title }) {
  return (
    <span
      className={`${styles.icoBox} ${large ? styles.icoBoxLg : ""} ${className || ""}`}
      style={{ color, background: tint(color, 0.15), borderColor: tint(color, 0.45), ...style }}
    >
      <Icon name={name} size={size || (large ? 30 : 20)} title={title} />
    </span>
  );
}

// Ícono + texto, sin pasar por emojis: <IconLabel icon="circleCheck">¡Bien!</IconLabel>
export function IconLabel({ icon, color, size, className, iconClass, children }) {
  return (
    <span className={className}>
      <Icon name={icon} size={size} className={iconClass} color={color ?? ICON_TONE[icon]} style={{ marginRight: "0.35em" }} />
      {children}
    </span>
  );
}

// Ícono de un emoji suelto (null si no está mapeado)
const iconoDe = (e) => EMOJI_ICON[e] || EMOJI_ICON[e.replace(MODS_RE, "")] || EMOJI_ICON[(FIRST_RE.exec(e) || [e])[0]] || null;

// Emojis en el medio del texto -> íconos chiquitos en línea (si no hay ícono, queda el texto original)
function iconosEnLinea(text) {
  if (!text) return text;
  const parts = [];
  let last = 0;
  for (const m of text.matchAll(ALL_RE)) {
    const name = iconoDe(m[0]);
    if (!name) continue;
    parts.push(text.slice(last, m.index));
    parts.push(<Icon key={m.index} name={name} size="1em" color={ICON_TONE[name]} />);
    last = m.index + m[0].length;
  }
  if (!parts.length) return text;
  parts.push(text.slice(last));
  return parts;
}

// Texto que puede traer emojis: el del comienzo se vuelve un ícono destacado y los del medio, íconos en línea.
// Números, null, etc. se devuelven tal cual.
export function IconText({ text, size = "1.15em", className, iconClass, iconColor }) {
  if (typeof text !== "string") return text ?? null;
  const { icon, text: rest } = splitEmoji(text);
  const body = iconosEnLinea(rest);
  if (!icon && body === rest) return text;
  return (
    <span className={className}>
      {icon && (
        <Icon name={icon} size={size} className={iconClass} color={iconColor ?? ICON_TONE[icon]} style={rest ? { marginRight: "0.35em" } : undefined} />
      )}
      {body}
    </span>
  );
}
