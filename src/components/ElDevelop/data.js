// Datos estáticos de "El Develop"

export const ROLES = {
  frontend: {
    id: "frontend",
    name: "Frontend Developer",
    tagline: "Centra divs (a veces)",
    emoji: "🎨",
    skill: "CSS Magic",
    skillDesc: "Los incidentes que perdés te cuestan la mitad de salud mental: se ve lindo aunque el back esté prendido fuego.",
    passive: "incidentShield",
    minigame: "css",
    bonus: { network: 5, mental: 5 },
  },
  backend: {
    id: "backend",
    name: "Backend Developer",
    tagline: "Vive en la terminal",
    emoji: "🧱",
    skill: "Optimización de SQL",
    skillDesc: "+15% de Lógica cada vez que estudiás.",
    passive: "logicBoost",
    minigame: "pipes",
    bonus: { logic: 5 },
  },
  devops: {
    id: "devops",
    name: "DevOps / Cloud",
    tagline: "Atiende el pager a las 3 AM",
    emoji: "☁️",
    skill: "Atajadas en Prod",
    skillDesc: "Los incidentes que resolvés te dan el doble de XP.",
    passive: "incidentXp",
    minigame: "servers",
    bonus: { energy: 10 },
  },
  security: {
    id: "security",
    name: "Ciberseguridad",
    tagline: "Desconfía hasta del mate",
    emoji: "🛡️",
    skill: "Parche Defensivo",
    skillDesc: "Las semanas de laburo te desgastan 30% menos la cabeza.",
    passive: "mentalShield",
    minigame: "hack",
    bonus: { logic: 3, mental: 5 },
  },
  data: {
    id: "data",
    name: "Data / IA Engineer",
    tagline: "Habla en Jupyter Notebooks",
    emoji: "🔮",
    skill: "Predicción de Tendencias",
    skillDesc: "+25% de XP en cada semana de laburo.",
    passive: "xpBoost",
    minigame: "data",
    bonus: { logic: 5 },
  },
  pm: {
    id: "pm",
    name: "Product Manager / PO",
    tagline: "Lo quiere todo para ayer",
    emoji: "📋",
    skill: "Filtro de Requerimientos",
    skillDesc: "+50% de Contactos cuando hacés networking.",
    passive: "networkBoost",
    minigame: "prioritizer",
    bonus: { network: 10 },
  },
  soporte: {
    id: "soporte",
    name: "Soporte IT / Help Desk",
    tagline: "¿Probaste apagarla y prenderla?",
    emoji: "🎧",
    skill: "Detector de Capa 8",
    skillDesc: "Las semanas de laburo te gastan 30% menos energía.",
    passive: "energyShield",
    minigame: "capa8",
    bonus: { energy: 5, network: 5 },
  },
  qa: {
    id: "qa",
    name: "QA Tester",
    tagline: "Rompe todo lo que toca",
    emoji: "🐞",
    skill: "Cazador de Bugs",
    skillDesc: "Cada minijuego que ganás te da +2 de Lógica extra.",
    passive: "bugHunter",
    minigame: "bugbash",
    bonus: { logic: 3, mental: 3 },
  },
};

export const MINIGAMES = {
  css: { name: "Flexbox Defender", icon: "🎨", howTo: "Tocá las reglas CSS correctas para ubicar el botón donde pide el cliente. Necesitás 3 reglas." },
  pipes: { name: "Query Master", icon: "🔌", howTo: "Tocá las tuberías para rotarlas y conectá la API con la base de datos antes del Memory Leak." },
  servers: { name: "Server Juggler", icon: "🖥️", howTo: "Tocá un server para desplegarle un pod y bajarle la carga. Usá el Load Balancer cuando esté listo. Que ninguno llegue a 100%." },
  hack: { name: "Hack the Hacker", icon: "🛡️", howTo: "Tocá el código malicioso (XSS, SQL Injection...) antes de que llegue a la base. El código sano dejalo pasar." },
  data: { name: "Data Cleaning", icon: "🧹", howTo: "Tocá los datos sucios (null, NaN, N/A...) antes de que entren al modelo. Los datos sanos dejalos pasar." },
  prioritizer: { name: "Prioritizer", icon: "📋", howTo: "Rechazá (tocá) los features de último momento. Lo importante dejalo pasar al sprint." },
  capa8: { name: "Error de Capa 8", icon: "🙋", howTo: "Leé cada ticket y decidí: ¿es un bug de verdad o el problema está entre la silla y el teclado?" },
  bugbash: { name: "Bug Bash", icon: "🐛", howTo: "Aparecen bugs en los archivos del proyecto. ¡Aplastalos tocándolos antes de que se escondan!" },
  merge: { name: "Merge Conflict", icon: "🔀", howTo: "Git no sabe qué versión dejar. Elegí la línea correcta en cada conflicto." },
  findbug: { name: "Code Review", icon: "🔍", howTo: "Encontrá la línea con el bug antes de aprobar el Pull Request." },
  terminal: { name: "Hacker de Película", icon: "⌨️", howTo: "Tipeá los comandos en la terminal y apretá Enter. Sin apuro, ¡son cortitos!" },
  memotest: { name: "Memotest del Stack", icon: "🧠", howTo: "Encontrá los pares de tecnologías dando vuelta las cartas." },
  gitflow: { name: "Git Flow", icon: "🌿", howTo: "Tocá los pasos en el orden correcto para subir tu primer feature." },
  algo: { name: "Live Coding", icon: "💻", howTo: "Respondé las preguntas de algoritmos. Con 2 de 4 bien, pasás." },
  design: { name: "System Design", icon: "🏗️", howTo: "Elegí los componentes para escalar una app de mensajería a 100 millones de usuarios." },
  behavioral: { name: "Behavioral", icon: "🗣️", howTo: "Respondé con Chamuyo Senior. Que se note la madurez." },
};

export const LEVELS = ["Estudiante", "Trainee", "Junior", "Semi-Senior", "Senior", "Staff Engineer"];

// Sueldos de mercado base (se ajustan por inflación con priceIndex)
export const SALARY_ARS = [0, 700000, 1200000, 2000000, 3200000];
export const SALARY_USD = [0, 600, 1200, 2200, 3800];

// Requisitos para ascender DESDE el nivel indicado
export const PROMOTIONS = {
  1: { xp: 10, logic: 20 },
  2: { xp: 28, logic: 40 },
  3: { xp: 55, logic: 58, network: 25 },
};

export const BIG_TECH_REQ = { logic: 75, network: 50 };

export const PHASES = {
  1: "El Hola Mundo",
  2: "Primer Laburo",
  3: "Senior con Mate",
  4: "La Final: Big Tech",
};

export const STAT_INFO = {
  logic: { label: "Lógica & Sintaxis", short: "Lógica", icon: "🧠", color: "#0b78fb" },
  mental: { label: "Salud Mental", short: "Salud mental", icon: "🧘", color: "#a855f7" },
  network: { label: "Contactos / Chamuyo", short: "Contactos", icon: "🤝", color: "#f6950a" },
  energy: { label: "Energía", short: "Energía", icon: "⚡", color: "#22c55e" },
};

// food: puede venir vencido del chino
export const ITEMS = [
  { id: "mate", name: "Yerba + mate amargo", emoji: "🧉", base: 4000, desc: "+15 Energía, +5 Salud mental", effect: { energy: 15, mental: 5 }, food: true },
  { id: "alfajor", name: "Alfajor triple del kiosco", emoji: "🍫", base: 2500, desc: "+8 Energía, +4 Salud mental", effect: { energy: 8, mental: 4 }, food: true },
  { id: "facturas", name: "Docena de facturas", emoji: "🥐", base: 9000, desc: "+30 Salud mental, -10 Energía", effect: { mental: 30, energy: -10 }, food: true },
  { id: "fernet", name: "Fernet con coca", emoji: "🥤", base: 14000, desc: "+20 Salud mental, -12 Energía", effect: { mental: 20, energy: -12 }, food: true },
  { id: "cafe", name: "Café de especialidad", emoji: "☕", base: 45000, desc: "+50% de Lógica al estudiar por 2 semanas", buff: "coffee" },
  { id: "keyboard", name: "Teclado mecánico RGB", emoji: "⌨️", base: 140000, desc: "+10% de tiempo en los minijuegos", permanent: true },
  { id: "monitor", name: "Segundo monitor", emoji: "🖥️", base: 260000, desc: "+10% de tiempo en los minijuegos (se suma)", permanent: true },
  { id: "headphones", name: "Auriculares noise cancelling", emoji: "🎧", base: 200000, desc: "Chau gritos en la Daily y taladro del vecino", permanent: true },
  { id: "chair", name: "Silla ergonómica", emoji: "🪑", base: 380000, desc: "Evita la lumbalgia por mala postura", permanent: true },
];

export const COMPANIES = {
  1: ["Software Factory 'Código Pampa'", "Consultora Sinergia Soluciones", "Agencia 'Pixel & Asado'"],
  2: ["Fintech 'Billetera Gaucha'", "Startup 'MateOps'", "Consultora Tango Systems", "E-commerce 'ComprAhora'"],
  3: ["Scale-up 'Cuyo Cloud'", "Fintech 'Pago Fácil 2.0'", "Startup 'Delivery del Barrio'"],
  4: ["Unicornio 'Patagonia Data'", "Fintech 'Dólar Seguro'", "Healthtech 'TurnoYa'"],
};

export const BIG_TECH = ["Google", "Amazon", "Meta", "Mercado Libre", "Nubank", "Globant"];

export const WORK_LINES = [
  "Cerraste 3 tickets y abriste 5 bugs nuevos. Balance positivo, según tu Team Lead.",
  "La Daily de 15 minutos duró 45. Igual sumaste experiencia.",
  "Refactorizaste un archivo de 3.000 líneas llamado utils_final_v2_ahora_si.js.",
  "Comentaste '// no tocar, no sé por qué anda' en una función. Sabiduría pura.",
  "Hiciste un commit que dice 'fix'. Otro que dice 'fix 2'. Y otro que dice 'ahora sí'.",
  "Pasaste 4 horas debuggeando. Era un punto y coma.",
  "Le explicaste al PM que 'es un cambio chiquito' no existe.",
  "Googleaste el error, entraste a Stack Overflow y la respuesta era tuya de hace 2 años.",
  "Tuviste una reunión que podría haber sido un mail. Y otra que podría haber sido nada.",
  "Funcionó en tu máquina. Es lo que importa.",
];

export const SEARCH_FAIL = [
  "Mandaste 40 CVs. Te respondió un bot ofreciéndote un curso.",
  "Una entrevista de 6 etapas y te ghostearon en la quinta.",
  "Te pidieron 5 años de experiencia en un framework que salió hace 2.",
  "La oferta era 'Junior' y pedían saber React, Angular, Vue, Kubernetes y cocinar.",
  "Te ofrecieron 'pagar en exposición'. Les contestaste que el alquiler se paga en pesos.",
];

// Minijuegos tipo "lluvia de código"
export const FALLING_SETS = {
  hack: {
    bad: ["' OR 1=1 --", "<script>alert('xss')</script>", "; DROP TABLE users;", "../../etc/passwd", "<img onerror=robar()>", "admin'--", "UNION SELECT password"],
    good: ["SELECT * FROM users WHERE id = ?", "const total = precio * qty;", "res.json({ ok: true })", "bcrypt.hash(pass, 10)", "git commit -m 'fix'"],
    floor: "🗄️ BASE DE DATOS",
    badHit: "¡Un ataque llegó a la base!",
    goodHit: "Bloqueaste código legítimo.",
  },
  data: {
    bad: ["null", "NaN", "undefined", '""', "N/A", "-999", "edad: 300", "asdf@@", "#REF!"],
    good: ['"Rosario"', "42", "3.14", "2026-10-15", '"Messi"', "true", '"CABA"'],
    floor: "🤖 MODELO DE IA",
    badHit: "Un dato sucio contaminó el modelo.",
    goodHit: "Borraste un dato sano.",
  },
  prioritizer: {
    bad: ["Agregar blockchain", "Modo oscuro para ayer", "Uber pero para perros", "Rediseño total viernes 18hs", "Que la IA haga todo", "Integrar con el fax", "Logo más grande", "Que sea como Mercado Libre"],
    good: ["Fix del login", "Bug en pagos", "Accesibilidad", "Backup de la DB", "Parche de seguridad"],
    floor: "📋 BACKLOG DEL SPRINT",
    badHit: "Se coló un feature de último momento.",
    goodHit: "Rechazaste algo importante.",
  },
};

// Preguntas: la opción "answer" (por defecto 0) es la correcta
export const ALGO_QUESTIONS = [
  { q: "¿Complejidad de una búsqueda binaria en un array ordenado?", options: ["O(log n)", "O(n)", "O(n²)", "O(1)"] },
  { q: "¿Qué estructura usás para detectar duplicados rápido?", options: ["Un Set / HashMap", "Un array ordenado a mano", "Recursión infinita", "Un PDF"] },
  { q: "¿Qué devuelve [1, 2, 3].map(x => x * 2)?", options: ["[2, 4, 6]", "6", "[1, 2, 3, 1, 2, 3]", "undefined"] },
  { q: "¿Qué estructura es LIFO (el último que entra sale primero)?", options: ["Pila (stack)", "Cola (queue)", "Un asado", "Un grafo"] },
  { q: "¿Qué hace git pull?", options: ["Trae los cambios del remoto", "Borra el repo", "Sube tus cambios", "Llama a tu jefe"] },
  { q: "Un string es palíndromo si…", options: ["Se lee igual al derecho y al revés", "Tiene más de 10 letras", "Está todo en mayúsculas", "Lo dijo Bielsa"] },
  { q: "¿Qué es una función pura?", options: ["Mismo input, mismo output, sin efectos secundarios", "Una que no tiene comentarios", "Una función async", "Una escrita sin café"] },
  { q: "¿Qué código HTTP significa 'No encontrado'?", options: ["404", "200", "500", "418"] },
];

export const BEHAVIORAL_QUESTIONS = [
  {
    q: "Un compañero mergeó a main un viernes a las 18hs y rompió prod. ¿Qué hacés?",
    options: ["Propongo un post-mortem sin culpables y sumamos checks al pipeline", "'Fue él, yo ni estaba'", "'En mi otra empresa esto no pasaba'", "Me desconecto y apago el celu"],
  },
  {
    q: "Contame de un conflicto con un PM.",
    options: ["Alineamos expectativas con datos, recorté alcance y entregamos un MVP a tiempo", "Le dije que su idea era malísima delante de todos", "Hice lo que quise y no le avisé", "Nunca tuve conflictos, soy un sol"],
  },
  {
    q: "¿Cuál es tu mayor defecto?",
    options: ["Me costaba delegar, así que empecé a documentar y hacer pairing", "Soy demasiado perfeccionista", "Ninguno", "Llego tarde a todas las Dailies"],
  },
  {
    q: "Te asignan un proyecto legacy que nadie quiere tocar.",
    options: ["Agrego tests, mido el impacto y lo mejoro de a poco", "Lo reescribo entero en el framework de moda", "Pido el pase a otro equipo", "Lo ignoro hasta que explote"],
  },
];

export const MERGE_CONFLICTS = [
  { q: "Conflicto en carrito.js (abajo se usa: total = precio * 2)", options: ["const precio = 100;", 'const precio = "cien";'] },
  { q: "Conflicto en login.js", options: ["if (user === null) {", "if (user = null) {"] },
  { q: "Conflicto en lista.js", options: ["for (let i = 0; i < arr.length; i++)", "for (let i = 0; i <= arr.length; i++)"] },
  { q: "Conflicto en App.jsx", options: ['import React from "react";', 'import React from "reac";'] },
  { q: "Conflicto en config.js", options: ["DB_PASS = process.env.DB_PASS", 'DB_PASS = "boca1234"'] },
  { q: "Conflicto en api.js", options: ["const data = await fetch(url);", "const data = fetch(url); // ojalá ande"] },
];

export const FIND_BUG = [
  {
    q: "¿Qué línea tiene el bug? (debería sumar los precios)",
    options: ["function total(items) {", "  let suma = 0;", "  for (const i of items) suma =+ i.precio;", "  return suma;"],
    answer: 2,
    keepOrder: true,
  },
  {
    q: "¿Qué línea tiene el bug? (solo deberían pasar los mayores)",
    options: ["const edad = Number(input);", "if (edad = 18) {", "  console.log('Pasá');", "}"],
    answer: 1,
    keepOrder: true,
  },
  {
    q: "¿Qué línea es una invitación a un SQL Injection?",
    options: ["const id = req.query.id;", "const sql = `SELECT * FROM users WHERE id = ${id}`;", "const rows = await db.query(sql);", "res.json(rows);"],
    answer: 1,
    keepOrder: true,
  },
  {
    q: "¿Qué línea tiene el bug? (quiero el último elemento)",
    options: ["const lista = [1, 2, 3];", "const ultimo = lista[lista.length];", "console.log(ultimo);"],
    answer: 1,
    keepOrder: true,
  },
  {
    q: "¿Qué línea va a terminar en escándalo en Twitter?",
    options: ["const API_KEY = 'sk-live-123456';", "const cliente = crearCliente(API_KEY);", "export default cliente;"],
    answer: 0,
    keepOrder: true,
  },
];

export const CAPA8_TICKETS = [
  { text: "'No anda la compu'. (La compu estaba desenchufada)", capa8: true },
  { text: "'Borré la carpeta System32 para liberar espacio'", capa8: true },
  { text: "'No anda internet'. (Tenía el wifi apagado)", capa8: true },
  { text: "'La pantalla está negra'. (El monitor estaba apagado)", capa8: true },
  { text: "'Mi contraseña no entra'. (Tenía el Bloq Mayús activado)", capa8: true },
  { text: "'Instalé el antivirus que me mandó un príncipe nigeriano por mail'", capa8: true },
  { text: "'El mouse no anda'. (Lo tenía al revés)", capa8: true },
  { text: "'¿Dónde está la tecla ANY?' (Presione cualquier tecla para continuar)", capa8: true },
  { text: "El checkout cobra dos veces si apretás F5", capa8: false },
  { text: "La API devuelve error 500 cuando el nombre tiene ñ", capa8: false },
  { text: "Todas las fechas salen como 01/01/1970", capa8: false },
  { text: "El carrito suma como texto: 100 + 50 = 10050", capa8: false },
  { text: "El servidor consume 1% más de RAM cada hora hasta colgarse", capa8: false },
];

export const TERMINAL_COMMANDS = ["git push", "npm install", "ls -la", "git status", "docker ps", "cd ..", "npm run dev", "git pull", "sudo reboot", "ping google.com"];

export const MEMO_PAIRS = [
  { icon: "⚛️", name: "React" },
  { icon: "🐍", name: "Python" },
  { icon: "🐳", name: "Docker" },
  { icon: "🐧", name: "Linux" },
  { icon: "☕", name: "Java" },
  { icon: "🐘", name: "Postgres" },
];

export const GIT_FLOW = ["git clone", "git checkout -b feature/mate", "git add .", 'git commit -m "feat"', "git push", "Abrir el Pull Request"];

export const BUG_FILES = ["index.js", "app.py", "styles.css", "main.go", "api.php", "utils.ts", "Dockerfile", ".env", "README.md"];

export const DESIGN_PIECES = [
  { label: "Load Balancer", good: true },
  { label: "Cache (Redis)", good: true },
  { label: "Cola de mensajes (Kafka)", good: true },
  { label: "Base de datos shardeada", good: true },
  { label: "CDN para fotos y audios", good: true },
  { label: "WebSockets para tiempo real", good: true },
  { label: "Una sola SQLite en una notebook", good: false },
  { label: "Monolito en un pendrive", good: false },
  { label: "Planilla de Excel compartida", good: false },
  { label: "El servidor abajo del escritorio", good: false },
];
