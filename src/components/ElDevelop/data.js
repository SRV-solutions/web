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
    minigame2: "htmlcssjs",
    minigame3: "pixelperfect",
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
    minigame2: "statuscodes",
    minigame3: "endpoints",
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
    minigame2: "comandos",
    minigame3: "deploywindow",
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
    minigame2: "phishing",
    minigame3: "parches",
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
    minigame2: "graficos",
    minigame3: "outliers",
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
    minigame2: "moscow",
    minigame3: "sprintplanner",
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
    minigame2: "triage",
    minigame3: "simonhelpdesk",
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
    minigame2: "bugofeature",
    minigame3: "spotdiff",
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
  htmlcssjs: { name: "¿HTML, CSS o JS?", icon: "🧩", howTo: "Cada tarea va en una capa de la web. Elegí si se resuelve con HTML, con CSS o con JavaScript." },
  statuscodes: { name: "Status Codes", icon: "📡", howTo: "Llegan peticiones a tu API. Elegí el código de estado HTTP correcto para cada respuesta." },
  comandos: { name: "¿Qué comando corro?", icon: "🐧", howTo: "El servidor tiene problemas. Elegí el comando correcto para cada situación." },
  phishing: { name: "Phishing Hunter", icon: "🎣", howTo: "Llegan mails a la empresa. Marcá cuáles son phishing y cuáles son legítimos." },
  graficos: { name: "Elegí el gráfico", icon: "📊", howTo: "El directorio quiere ver datos. Elegí el tipo de gráfico ideal para cada pedido." },
  moscow: { name: "MoSCoW", icon: "🗂️", howTo: "Priorizá el MVP: Must (sí o sí), Should (importante), Could (si sobra tiempo) o Won't (ahora no)." },
  triage: { name: "Triage de tickets", icon: "🚨", howTo: "La cola de soporte explota. Asigná la prioridad correcta a cada ticket." },
  bugofeature: { name: "¿Bug o feature?", icon: "🔎", howTo: "Revisá el release: ¿cada comportamiento es un bug, una mejora pendiente o funciona bien?" },
  techq: { name: "Entrevista técnica", icon: "🧠", howTo: "Preguntas técnicas de tu rol. Pensá rápido pero sin apuro." },
  algo: { name: "Live Coding", icon: "💻", howTo: "Respondé las preguntas de algoritmos. Con 2 de 4 bien, pasás." },
  design: { name: "System Design", icon: "🏗️", howTo: "Elegí los componentes para escalar una app de mensajería a 100 millones de usuarios." },
  behavioral: { name: "Behavioral", icon: "🗣️", howTo: "Respondé con Chamuyo Senior. Que se note la madurez." },
  // Tercer minijuego de cada rol
  pixelperfect: { name: "Pixel Perfect", icon: "📐", howTo: "El diseñador te pasó una caja. Ajustá tu copia con los botones − y + (tamaño, bordes, rotación...) hasta que quede igual. En difícil hay menos tolerancia y no ves los números." },
  endpoints: { name: "Endpoint Rush", icon: "📡", howTo: "El front te pide cosas. Armá cada respuesta tocando un método, una ruta y un status HTTP, y mandala. Ojo con el 401 vs 403 y el 201 vs 200." },
  deploywindow: { name: "Ventana de Deploy", icon: "🚀", howTo: "El marcador va y viene: tocá DEPLOY cuando esté adentro de la zona verde. Al tercer rollback te sacan el acceso a prod." },
  parches: { name: "Parche Express", icon: "🩹", howTo: "Tocá una amenaza y después el parche que la arregla. Hay parches que suenan bien pero no arreglan nada, y en difícil aparece un 0-day a mitad de partida." },
  outliers: { name: "Caza de Outliers", icon: "📈", howTo: "En el gráfico hay puntos que se escapan de la tendencia. Tocalos a todos; si tocás un dato normal, perdés tiempo." },
  sprintplanner: { name: "Sprint Planner", icon: "🗂️", howTo: "Elegí las historias del sprint sin pasarte de la capacidad del equipo y juntando casi todo el valor posible. Cuidado con las dependencias y con el pedido del CEO." },
  simonhelpdesk: { name: "Simon del Help Desk", icon: "🎧", howTo: "Mirá el procedimiento que se ilumina y repetilo en el mismo orden. Cada ticket suma un paso; un error y el cliente te corta." },
  spotdiff: { name: "Encontrá la diferencia", icon: "🔎", howTo: "Compará el código Esperado con el Actual y tocá las líneas que cambiaron. Tocar una línea sana te resta tiempo." },
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

export const BIG_TECH_REQ = { logic: 85, network: 60, xp: 90 };

// Clima de la semana: modificadores al azar que se anuncian antes de elegir el foco.
// fx se aplica siempre; foco[id] solo si elegiste ese foco; arsBase se ajusta por inflación.
export const MODIFICADORES = [
  { id: "ola_calor", name: "Ola de calor y cortes de luz", desc: "El ventilador no da abasto: −6 Energía", fx: { energy: -6 } },
  { id: "seleccion", name: "Juega la Selección en horario laboral", desc: "+6 Salud mental · −1 XP si laburás", fx: { mental: 6 }, foco: { laburo: { xp: -1 } } },
  { id: "diluvio", name: "Diluvio en el AMBA", desc: "Llegás empapado a todos lados: −Energía si salís", foco: { networking: { energy: -5 }, laburo: { energy: -2 } } },
  { id: "hot_sale", name: "Hot Sale", desc: "Compraste cosas que no necesitabas: −Pesos · +3 Salud mental", fx: { mental: 3 }, arsBase: -25000 },
  { id: "gripe_oficina", name: "Media oficina con gripe", desc: "Menos reuniones: +1 XP si laburás · −3 Energía", fx: { energy: -3 }, foco: { laburo: { xp: 1 } } },
  { id: "aumento_bondi", name: "Aumentó el bondi (otra vez)", desc: "−Pesos. La SUBE llora.", arsBase: -9000 },
  { id: "finde_xl", name: "Finde XL", desc: "+8 Energía · −1 XP si laburás", fx: { energy: 8 }, foco: { laburo: { xp: -1 } } },
  { id: "fin_sprint", name: "Fin de sprint", desc: "Si laburás: +2 XP · −4 Salud mental", foco: { laburo: { xp: 2, mental: -4 } } },
  { id: "tuit_viral", name: "Se viralizó un tuit tuyo sobre JavaScript", desc: "+4 Contactos", fx: { network: 4 } },
  { id: "mate_lavado", name: "Se te lavó el mate a las 10 AM", desc: "−2 Salud mental. Tragedia nacional.", fx: { mental: -2 } },
  { id: "parciales", name: "Semana de parciales", desc: "Si estudiás: +3 Lógica · −3 Salud mental", foco: { estudio: { logic: 3, mental: -3 } } },
  { id: "wifi_vecino", name: "El vecino cambió la clave del WiFi", desc: "−3 Energía si estudiás · −3 Salud mental si laburás", foco: { estudio: { energy: -3 }, laburo: { mental: -3 } } },
  { id: "dolar_planchado", name: "El dólar está planchado (raro)", desc: "+3 Salud mental: una semana sin mirar la cotización", fx: { mental: 3 } },
  { id: "lunes_feriado", name: "Feriado el lunes", desc: "+4 Energía", fx: { energy: 4 } },
];

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

// Preguntas de código etiquetadas por rol: cada rol ve solo lo que tiene sentido para su laburo.
// Sin "roles" = sirve para cualquier rol que programe.
export const MERGE_CONFLICTS = [
  { q: "Conflicto en carrito.js (abajo se usa: total = precio * 2)", options: ["const precio = 100;", 'const precio = "cien";'] },
  { q: "Conflicto en login.js", options: ["if (user === null) {", "if (user = null) {"] },
  { q: "Conflicto en lista.js", options: ["for (let i = 0; i < arr.length; i++)", "for (let i = 0; i <= arr.length; i++)"] },
  { q: "Conflicto en App.jsx", options: ['import React from "react";', 'import React from "reac";'], roles: ["frontend", "qa"] },
  { q: "Conflicto en Boton.jsx", options: ["<button onClick={comprar}>Comprar</button>", "<button onClick={comprar()}>Comprar</button>"], roles: ["frontend", "qa"] },
  { q: "Conflicto en styles.css", options: [".card { display: flex; gap: 1rem; }", ".card { display: flex; gap: 1rem }}"], roles: ["frontend", "qa"] },
  { q: "Conflicto en config.js", options: ["DB_PASS = process.env.DB_PASS", 'DB_PASS = "boca1234"'], roles: ["backend", "devops", "security"] },
  { q: "Conflicto en api.js", options: ["const data = await fetch(url);", "const data = fetch(url); // ojalá ande"], roles: ["backend", "frontend", "data"] },
  { q: "Conflicto en usuarios.sql", options: ["SELECT nombre FROM usuarios WHERE activo = 1;", "SELECT nombre FROM usuarios WHERE activo = 1"], roles: ["backend", "data"] },
  { q: "Conflicto en Dockerfile", options: ["FROM node:20-alpine", "FROM node:latest-latest-final"], roles: ["devops", "backend"] },
  { q: "Conflicto en limpieza.py", options: ["df = df.dropna()", "df.dropna"], roles: ["data"] },
  { q: "Conflicto en login.js (contraseñas)", options: ["const ok = await bcrypt.compare(pass, user.hash);", "const ok = pass === user.password;"], roles: ["security", "backend"] },
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
  {
    q: "¿Qué línea es una invitación a un SQL Injection?",
    options: ["const id = req.query.id;", "const sql = `SELECT * FROM users WHERE id = ${id}`;", "const rows = await db.query(sql);", "res.json(rows);"],
    answer: 1,
    keepOrder: true,
    roles: ["backend", "security"],
  },
  {
    q: "¿Qué línea hace que el endpoint nunca responda?",
    options: ["app.get('/users', async (req, res) => {", "  const users = await db.find();", "  if (!users) res.status(404);", "});"],
    answer: 2,
    keepOrder: true,
    roles: ["backend"],
  },
  {
    q: "¿Qué línea rompe el contador? (React)",
    options: ["const [n, setN] = useState(0);", "function sumar() {", "  n = n + 1;", "}"],
    answer: 2,
    keepOrder: true,
    roles: ["frontend", "qa"],
  },
  {
    q: "¿Qué línea hace que el botón no se centre?",
    options: [".contenedor {", "  display: block;", "  justify-content: center;", "  align-items: center;", "}"],
    answer: 1,
    keepOrder: true,
    roles: ["frontend"],
  },
  {
    q: "¿Qué línea muestra 'undefined' en la lista? (React)",
    options: ["{productos.map((p) => (", "  <li key={p.id}>{p.nombe}</li>", "))}"],
    answer: 1,
    keepOrder: true,
    roles: ["frontend", "qa"],
  },
  {
    q: "¿Qué línea arruina el promedio de ventas? (pandas)",
    options: ["df = pd.read_csv('ventas.csv')", "df['monto'] = df['monto'].fillna(999999)", "print(df['monto'].mean())"],
    answer: 1,
    keepOrder: true,
    roles: ["data"],
  },
  {
    q: "¿Qué línea cuenta mal los clientes? (pandas)",
    options: ["clientes = df['email']", "total = len(clientes)", "print(f'Clientes únicos: {total}')"],
    answer: 1,
    keepOrder: true,
    roles: ["data"],
  },
  {
    q: "¿Qué línea guarda la contraseña de forma insegura?",
    options: ["const user = { email };", "user.password = req.body.password;", "await db.save(user);"],
    answer: 1,
    keepOrder: true,
    roles: ["security", "backend"],
  },
  {
    q: "¿Qué línea del Dockerfile hace que la imagen pese 2 GB de más?",
    options: ["FROM node:20-alpine", "COPY . .", "RUN npm install", "CMD [\"npm\", \"start\"]"],
    answer: 1,
    keepOrder: true,
    roles: ["devops"],
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
  { text: "'La impresora no imprime'. (Estaba mandando a la impresora del 3er piso)", capa8: true },
  { text: "'Perdí el archivo'. (Lo guardó en la Papelera de reciclaje)", capa8: true },
  { text: "El checkout cobra dos veces si apretás F5", capa8: false },
  { text: "La API devuelve error 500 cuando el nombre tiene ñ", capa8: false },
  { text: "Todas las fechas salen como 01/01/1970", capa8: false },
  { text: "El carrito suma como texto: 100 + 50 = 10050", capa8: false },
  { text: "El servidor consume 1% más de RAM cada hora hasta colgarse", capa8: false },
  { text: "El sistema de turnos muestra los del día anterior", capa8: false },
];

// Terminal: la dificultad suma comandos más largos
export const TERMINAL_COMMANDS = ["git push", "npm install", "ls -la", "git status", "docker ps", "cd ..", "npm run dev", "git pull", "sudo reboot", "ping google.com"];
export const TERMINAL_COMMANDS_PRO = [
  'git commit -m "fix login"',
  "docker compose up -d",
  "npm install express --save",
  "ssh root@192.168.0.10",
  "git checkout -b feature/pagos",
  "tail -f /var/log/app.log",
  "kubectl get pods -n prod",
];

export const MEMO_PAIRS = [
  { icon: "⚛️", name: "React" },
  { icon: "🐍", name: "Python" },
  { icon: "🐳", name: "Docker" },
  { icon: "🐧", name: "Linux" },
  { icon: "☕", name: "Java" },
  { icon: "🐘", name: "Postgres" },
  { icon: "🦀", name: "Rust" },
  { icon: "🍃", name: "MongoDB" },
];

export const GIT_FLOW = ["git clone", "git checkout -b feature/mate", "git add .", 'git commit -m "feat"', "git push", "Abrir el Pull Request"];
export const GIT_FLOW_PRO = ["git clone", "git checkout -b feature/mate", "npm install", "npm test", "git add .", 'git commit -m "feat"', "git pull --rebase", "git push", "Abrir el Pull Request"];

export const BUG_FILES = ["index.js", "app.py", "styles.css", "main.go", "api.php", "utils.ts", "Dockerfile", ".env", "README.md"];

// ---------- Entrevista técnica: preguntas según el rol (la primera opción es la correcta) ----------
export const ROLE_TECH_QUESTIONS = {
  frontend: [
    { q: "¿Con qué propiedades centrás un elemento en un contenedor flex?", options: ["justify-content y align-items en center", "float: center", "text-align en el body", "z-index: 999"] },
    { q: "¿Qué etiqueta HTML es la semántica para el menú de navegación?", options: ["<nav>", "<div class='menu'>", "<menu-top>", "<b>"] },
    { q: "¿Qué hace event.preventDefault() en el submit de un formulario?", options: ["Evita que la página se recargue", "Borra el formulario", "Envía el formulario dos veces", "Bloquea el teclado"] },
    { q: "¿Qué es el DOM?", options: ["La página convertida en objetos que JavaScript puede modificar", "Un framework de CSS", "Un servidor web", "Un tipo de imagen"] },
    { q: "¿Para qué sirve una media query?", options: ["Aplicar estilos según el tamaño de pantalla", "Consultar una base de datos", "Reproducir videos", "Medir la velocidad del sitio"] },
    { q: "En React, ¿qué hook guarda un estado del componente?", options: ["useState", "useFetch", "useCSS", "useServer"] },
    { q: "¿Qué mejora más la velocidad de carga de las imágenes?", options: ["Formatos como WebP y lazy loading", "Subirlas en BMP", "Ponerlas todas en el header", "Usar GIFs animados"] },
  ],
  backend: [
    { q: "¿Qué método HTTP se usa para crear un recurso nuevo?", options: ["POST", "GET", "DELETE", "HEAD"] },
    { q: "¿Qué código devolvés si el recurso pedido no existe?", options: ["404", "200", "201", "500"] },
    { q: "¿Qué hace un middleware en Express?", options: ["Se ejecuta entre la petición y la respuesta", "Dibuja la interfaz", "Compila el código", "Reemplaza a la base de datos"] },
    { q: "¿Dónde guardás una API key o la contraseña de la base?", options: ["En variables de entorno", "En el código, comentada", "En el README", "En el nombre del archivo"] },
    { q: "¿Para qué sirve un índice en una base de datos?", options: ["Acelerar las búsquedas", "Ordenar los archivos del proyecto", "Encriptar datos", "Hacer backups"] },
    { q: "¿Qué consulta trae los usuarios mayores de 18?", options: ["SELECT * FROM users WHERE edad > 18", "GET users > 18", "FIND users(18)", "SELECT 18 FROM users"] },
    { q: "¿Qué es una API REST?", options: ["Una API donde cada recurso tiene una URL y se usan los métodos HTTP", "Una base de datos", "Un lenguaje de programación", "Un servidor de mails"] },
  ],
  devops: [
    { q: "¿Qué es un contenedor de Docker?", options: ["Tu app empaquetada con todo lo que necesita para correr", "Una máquina virtual con Windows", "Un disco externo", "Un tipo de base de datos"] },
    { q: "¿Qué hace un load balancer?", options: ["Reparte el tráfico entre varios servidores", "Encripta contraseñas", "Comprime imágenes", "Hace backups"] },
    { q: "¿Qué es CI/CD?", options: ["Automatizar tests y deploys en cada cambio", "Un lenguaje de scripting", "Un tipo de servidor", "Un antivirus"] },
    { q: "¿Qué comando lista los contenedores que están corriendo?", options: ["docker ps", "docker run", "ls -containers", "npm start"] },
    { q: "Un server está al 100% de CPU. ¿Qué hacés primero?", options: ["Ver qué proceso consume y escalar si hace falta", "Borrar los logs", "Apagar el monitoreo", "Reiniciar sin mirar nada"] },
    { q: "¿Qué es la infraestructura como código?", options: ["Definir servidores en archivos versionados, como con Terraform", "Programar en el servidor por SSH", "Usar Excel para la infra", "Escribir código sin servidores"] },
    { q: "¿Para qué sirven las alertas de monitoreo?", options: ["Avisar de un problema antes de que lo note el usuario", "Mandar publicidad", "Hacer deploys", "Bajar costos de la nube"] },
  ],
  security: [
    { q: "¿Qué es un SQL Injection?", options: ["Meter SQL malicioso en un input para manipular la base", "Una forma de optimizar consultas", "Un tipo de backup", "Un antivirus"] },
    { q: "¿Cómo se guardan las contraseñas de forma segura?", options: ["Con un hash como bcrypt", "En texto plano", "En base64", "En un Excel con contraseña"] },
    { q: "¿Qué es el phishing?", options: ["Engañar con mensajes falsos para robar datos", "Un tipo de firewall", "Una técnica de compresión", "Un lenguaje de programación"] },
    { q: "¿Qué agrega la autenticación en 2 pasos (2FA)?", options: ["Un segundo factor además de la contraseña", "Una segunda contraseña igual", "Más velocidad al login", "Nada, es marketing"] },
    { q: "¿Qué es un ataque XSS?", options: ["Inyectar scripts en una página que ven otros usuarios", "Saturar un servidor con tráfico", "Robar una notebook", "Adivinar contraseñas"] },
    { q: "¿Qué indica el candado de HTTPS?", options: ["Que la conexión viaja cifrada", "Que el sitio no tiene virus", "Que el sitio es del gobierno", "Que la página es gratis"] },
    { q: "¿Qué protege un rate limit?", options: ["De fuerza bruta y abuso de la API", "Del phishing", "De los errores de sintaxis", "De la falta de backups"] },
  ],
  data: [
    { q: "¿Qué hacés con los valores nulos de un dataset?", options: ["Limpiarlos o imputarlos antes de analizar", "Dejarlos: no afectan", "Reemplazarlos por 999999", "Borrar el dataset"] },
    { q: "¿Qué librería de Python se usa para trabajar con tablas de datos?", options: ["pandas", "flask", "tkinter", "discord.py"] },
    { q: "¿Qué es el overfitting?", options: ["El modelo memoriza el entrenamiento y falla con datos nuevos", "El modelo es muy liviano", "Tener demasiados gráficos", "Un error de sintaxis"] },
    { q: "¿Qué gráfico usás para mostrar una evolución en el tiempo?", options: ["Líneas", "Torta", "Mapa de calor", "Tabla"] },
    { q: "¿Qué consulta SQL cuenta las filas de una tabla?", options: ["SELECT COUNT(*) FROM ventas", "COUNT ventas", "SELECT ventas.length", "SUM(ventas)"] },
    { q: "Para comparar dos grupos, ¿qué conviene mirar además del promedio?", options: ["La dispersión de los datos, como el desvío", "Solo el promedio alcanza", "El color del gráfico", "La cantidad de columnas"] },
    { q: "¿Qué es un dataset de entrenamiento?", options: ["Los datos con los que aprende el modelo", "Los datos que ve el usuario", "Un backup de la base", "Un tipo de gráfico"] },
  ],
  pm: [
    { q: "¿Qué es un MVP?", options: ["La versión mínima que aporta valor para validar la idea", "El producto terminado con todo", "El jugador más valioso del equipo", "Un tipo de contrato"] },
    { q: "¿Cuánto suele durar un sprint en Scrum?", options: ["Entre 1 y 4 semanas", "Un día", "Un año", "Lo que tarde el cliente en responder"] },
    { q: "¿Qué es el backlog?", options: ["La lista priorizada de trabajo pendiente", "El historial de errores", "El organigrama", "Un backup del código"] },
    { q: "¿Qué es un KPI?", options: ["Un indicador clave para medir un objetivo", "Un lenguaje de programación", "Un tipo de reunión", "Un permiso de administrador"] },
    { q: "¿Qué es una user story?", options: ["Un requisito escrito desde la necesidad del usuario", "La biografía del cliente", "Un posteo en Instagram", "Un bug crítico"] },
    { q: "El cliente pide un feature a último momento. ¿Qué hacés?", options: ["Lo evaluás, lo priorizás y negociás alcance o fecha", "Lo agregás sin avisar al equipo", "Lo rechazás siempre", "Movés la entrega sin decir nada"] },
    { q: "¿Para qué sirve una retrospectiva?", options: ["Revisar qué salió bien, qué mal y qué mejorar", "Asignar culpables", "Planificar vacaciones", "Presentar al cliente"] },
  ],
  soporte: [
    { q: "Un usuario dice 'no anda internet'. ¿Primer paso?", options: ["Verificar cable o wifi y reiniciar el equipo", "Formatear la compu", "Llamar al proveedor de inmediato", "Cerrar el ticket"] },
    { q: "¿Qué es un ticket de soporte?", options: ["El registro de un pedido o incidente", "Una entrada al cine", "Un mail de spam", "Un tipo de virus"] },
    { q: "¿Qué comando muestra la IP de una compu con Windows?", options: ["ipconfig", "showip", "ls -ip", "netflix"] },
    { q: "¿Qué es un SLA?", options: ["El tiempo de respuesta y resolución acordado", "Un tipo de cable", "Un antivirus", "Una impresora"] },
    { q: "No podés resolver un ticket. ¿Qué hacés?", options: ["Lo escalás al nivel siguiente con toda la información", "Lo cerrás como resuelto", "Lo dejás en espera para siempre", "Le decís al usuario que reinicie otra vez"] },
    { q: "¿Qué significa un 'error de Capa 8'?", options: ["Que el problema lo causa el usuario", "Una falla del cableado", "Un error del servidor", "Un virus nuevo"] },
    { q: "¿Para qué sirve una base de conocimiento?", options: ["Documentar soluciones para resolver más rápido", "Guardar fotos del equipo", "Reemplazar los tickets", "Llevar la agenda de cumpleaños"] },
  ],
  qa: [
    { q: "¿Qué es un caso de prueba?", options: ["Pasos, datos y resultado esperado para verificar algo", "Una caja para guardar el código", "Un bug muy grave", "Una reunión con el cliente"] },
    { q: "¿Qué es una regresión?", options: ["Algo que andaba y dejó de andar tras un cambio", "Volver a una versión vieja a propósito", "Un tipo de gráfico", "Un error de tipeo"] },
    { q: "¿Qué no puede faltar en un reporte de bug?", options: ["Pasos para reproducirlo, resultado esperado y obtenido", "El nombre de quien lo programó", "Un meme", "Solo una captura sin texto"] },
    { q: "¿Qué es un test automatizado?", options: ["Código que prueba el sistema sin intervención manual", "Un test que se hace a ojo", "Un test que siempre pasa", "Un antivirus"] },
    { q: "¿Qué es un caso de borde?", options: ["Probar valores límite como 0, vacío o el máximo", "Probar solo el caso feliz", "Probar al final del día", "Probar en el borde de la pantalla"] },
    { q: "¿Qué herramientas se usan para tests end-to-end en web?", options: ["Cypress o Playwright", "Photoshop", "Excel", "Discord"] },
    { q: "¿Dónde conviene probar antes de producción?", options: ["En un ambiente de staging", "Directo en producción", "En la compu del cliente", "En ningún lado"] },
  ],
};

// ---------- System design: un desafío distinto para cada rol ----------
export const ROLE_DESIGN = {
  frontend: {
    prompt: "Diseñá la landing del Hot Sale para 1 millón de visitas, que cargue rápido en el celular.",
    pieces: [
      { label: "Imágenes en WebP con lazy loading", good: true },
      { label: "Diseño mobile first", good: true },
      { label: "CDN para los archivos estáticos", good: true },
      { label: "Code splitting del JavaScript", good: true },
      { label: "Botón de compra visible sin hacer scroll", good: true },
      { label: "Textos con buen contraste y accesibles", good: true },
      { label: "Video de fondo de 50 MB", good: false },
      { label: "12 tipografías distintas", good: false },
      { label: "Carrusel automático de 30 fotos", good: false },
      { label: "Popup de suscripción apenas entrás", good: false },
    ],
  },
  backend: {
    prompt: "Diseñá la arquitectura de una app de mensajería para 100 millones de usuarios.",
    pieces: [
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
    ],
  },
  devops: {
    prompt: "Diseñá la infraestructura para que la app no se caiga en Black Friday.",
    pieces: [
      { label: "Autoescalado de servidores", good: true },
      { label: "Load balancer", good: true },
      { label: "Monitoreo y alertas", good: true },
      { label: "Backups automáticos", good: true },
      { label: "Pipeline de CI/CD", good: true },
      { label: "Infraestructura como código (Terraform)", good: true },
      { label: "Un solo servidor en la oficina", good: false },
      { label: "Deploy manual por FTP", good: false },
      { label: "Contraseñas en un post-it", good: false },
      { label: "Apagar los logs para ahorrar", good: false },
    ],
  },
  security: {
    prompt: "Diseñá el login de un home banking que no se pueda vulnerar fácil.",
    pieces: [
      { label: "Contraseñas con hash (bcrypt)", good: true },
      { label: "Autenticación en 2 pasos", good: true },
      { label: "HTTPS en todo el sitio", good: true },
      { label: "Rate limit contra fuerza bruta", good: true },
      { label: "Bloqueo tras varios intentos fallidos", good: true },
      { label: "Tokens que expiran", good: true },
      { label: "Contraseñas en texto plano", good: false },
      { label: "Mandar la clave por mail", good: false },
      { label: "Token que nunca expira", good: false },
      { label: "Login por HTTP", good: false },
    ],
  },
  data: {
    prompt: "Diseñá el dashboard de ventas que mira el directorio todos los lunes.",
    pieces: [
      { label: "Limpieza de nulos y duplicados", good: true },
      { label: "Gráfico de líneas para la evolución mensual", good: true },
      { label: "KPIs arriba: ventas y ticket promedio", good: true },
      { label: "Filtros por fecha y sucursal", good: true },
      { label: "Actualización automática diaria", good: true },
      { label: "Fuente de los datos documentada", good: true },
      { label: "Tabla de 50.000 filas sin filtro", good: false },
      { label: "15 gráficos de torta", good: false },
      { label: "Datos copiados a mano", good: false },
      { label: "Colores al azar en cada gráfico", good: false },
    ],
  },
  pm: {
    prompt: "Armá el plan de lanzamiento de una app de delivery.",
    pieces: [
      { label: "Definir el MVP", good: true },
      { label: "Entrevistar usuarios reales", good: true },
      { label: "Métricas de éxito (KPIs)", good: true },
      { label: "Roadmap por etapas", good: true },
      { label: "Backlog priorizado", good: true },
      { label: "Feedback continuo del equipo", good: true },
      { label: "Lanzar con 80 features juntas", good: false },
      { label: "Prometer fecha sin consultar al equipo", good: false },
      { label: "Ignorar el feedback de los usuarios", good: false },
      { label: "Cambiar el alcance todos los días", good: false },
    ],
  },
  soporte: {
    prompt: "Armá la mesa de ayuda para una empresa de 500 empleados.",
    pieces: [
      { label: "Sistema de tickets", good: true },
      { label: "Base de conocimiento con soluciones", good: true },
      { label: "Prioridades y SLAs", good: true },
      { label: "Escalamiento a nivel 2", good: true },
      { label: "Encuesta de satisfacción", good: true },
      { label: "Inventario de equipos", good: true },
      { label: "Atender todo por tu WhatsApp personal", good: false },
      { label: "No registrar los problemas", good: false },
      { label: "Atender primero al que grita más", good: false },
      { label: "Reiniciar el servidor ante cualquier duda", good: false },
    ],
  },
  qa: {
    prompt: "Armá el plan de pruebas del checkout de un e-commerce.",
    pieces: [
      { label: "Casos de prueba con datos de borde", good: true },
      { label: "Tests automatizados de regresión", good: true },
      { label: "Pruebas en varios navegadores y celulares", good: true },
      { label: "Ambiente de staging", good: true },
      { label: "Bugs reportados con pasos para reproducir", good: true },
      { label: "Pruebas con medios de pago de prueba", good: true },
      { label: "Probar solo en tu compu", good: false },
      { label: "Testear en producción con tarjetas reales", good: false },
      { label: "Aprobar sin probar porque 'es un cambio chiquito'", good: false },
      { label: "Reportar bugs por audio de WhatsApp", good: false },
    ],
  },
};

// Compatibilidad: el System Design por defecto (backend)
export const DESIGN_PIECES = ROLE_DESIGN.backend.pieces;

// ---------- Minijuegos de clasificación: uno por rol ----------
export const SORTER_SETS = {
  htmlcssjs: {
    bins: ["HTML", "CSS", "JavaScript"],
    items: [
      { text: "Agregar un formulario de contacto", answer: "HTML" },
      { text: "Que el botón cambie de color al pasar el mouse", answer: "CSS" },
      { text: "Validar que el mail tenga @ antes de enviar", answer: "JavaScript" },
      { text: "Centrar el logo en la pantalla", answer: "CSS" },
      { text: "Mostrar un mensaje al hacer clic", answer: "JavaScript" },
      { text: "Poner el título principal de la página", answer: "HTML" },
      { text: "Animación de entrada de las tarjetas", answer: "CSS" },
      { text: "Traer los productos de una API", answer: "JavaScript" },
      { text: "Insertar una imagen con su texto alternativo", answer: "HTML" },
      { text: "Modo oscuro según el sistema", answer: "CSS" },
      { text: "Guardar el carrito en localStorage", answer: "JavaScript" },
      { text: "Armar la tabla de precios", answer: "HTML" },
    ],
  },
  statuscodes: {
    bins: ["200 OK", "201 Created", "400 Bad Request", "401 Unauthorized", "404 Not Found", "500 Error"],
    items: [
      { text: "Te devuelvo la lista de productos", answer: "200 OK" },
      { text: "Se creó el usuario nuevo", answer: "201 Created" },
      { text: "Falta el campo email en el body", answer: "400 Bad Request" },
      { text: "No mandaste el token de acceso", answer: "401 Unauthorized" },
      { text: "El producto 9999 no existe", answer: "404 Not Found" },
      { text: "Se cayó la conexión con la base de datos", answer: "500 Error" },
      { text: "Se registró el pedido correctamente", answer: "201 Created" },
      { text: "La edad llegó como 'veinte'", answer: "400 Bad Request" },
      { text: "La sesión expiró", answer: "401 Unauthorized" },
      { text: "La ruta /usuarioss no existe", answer: "404 Not Found" },
      { text: "Te muestro el perfil pedido", answer: "200 OK" },
      { text: "El código tiró una excepción no controlada", answer: "500 Error" },
    ],
  },
  comandos: {
    bins: ["docker ps", "docker logs", "df -h", "top", "ssh", "kubectl get pods"],
    items: [
      { text: "Ver qué contenedores están corriendo", answer: "docker ps" },
      { text: "Ver por qué se cayó el contenedor de la API", answer: "docker logs" },
      { text: "Ver si el disco está lleno", answer: "df -h" },
      { text: "Ver qué proceso se come la CPU", answer: "top" },
      { text: "Entrar al servidor remoto", answer: "ssh" },
      { text: "Ver los pods del cluster", answer: "kubectl get pods" },
      { text: "La app no escribe logs: ¿queda espacio?", answer: "df -h" },
      { text: "El server está lento: ¿quién consume memoria?", answer: "top" },
      { text: "Leer el error que tiró el contenedor de pagos", answer: "docker logs" },
      { text: "Conectarte a la máquina de producción", answer: "ssh" },
    ],
  },
  phishing: {
    bins: ["🎣 Phishing", "✅ Legítimo"],
    items: [
      { text: "'Tu cuenta será suspendida en 2 horas. Ingresá tu clave acá: bit.ly/banco-urgente'", answer: "🎣 Phishing" },
      { text: "'El gerente general necesita que compres 10 tarjetas de regalo YA y le mandes los códigos'", answer: "🎣 Phishing" },
      { text: "'Recordatorio: mañana es la reunión de equipo a las 10' (desde el mail interno)", answer: "✅ Legítimo" },
      { text: "'Ganaste un iPhone. Pagá $5.000 de envío con tu tarjeta'", answer: "🎣 Phishing" },
      { text: "'Tu recibo de sueldo de octubre ya está disponible en el portal interno'", answer: "✅ Legítimo" },
      { text: "'Soporte de Micr0soft: tu licencia venció, descargá el adjunto factura.exe'", answer: "🎣 Phishing" },
      { text: "'Mercado Libre: tu compra fue despachada' (desde el dominio oficial, sin pedir datos)", answer: "✅ Legítimo" },
      { text: "'Cambio de CBU del proveedor: transferí a esta cuenta nueva' (dominio parecido al real)", answer: "🎣 Phishing" },
      { text: "'Actualizá tus datos de AFlP para no perder el beneficio'", answer: "🎣 Phishing" },
      { text: "'Invitación de calendario: Planning del sprint' (de tu Team Lead)", answer: "✅ Legítimo" },
    ],
  },
  graficos: {
    bins: ["Líneas", "Barras", "Torta", "Dispersión"],
    items: [
      { text: "Ventas por mes del último año", answer: "Líneas" },
      { text: "Participación de mercado de 4 marcas", answer: "Torta" },
      { text: "Comparar ventas entre 6 sucursales", answer: "Barras" },
      { text: "Relación entre horas de estudio y nota", answer: "Dispersión" },
      { text: "Evolución del dólar blue en 2026", answer: "Líneas" },
      { text: "Cantidad de alumnos por curso", answer: "Barras" },
      { text: "Porcentaje de usuarios por sistema operativo", answer: "Torta" },
      { text: "Precio vs. metros cuadrados de departamentos", answer: "Dispersión" },
      { text: "Visitas diarias a la web durante el Hot Sale", answer: "Líneas" },
      { text: "Ranking de productos más vendidos", answer: "Barras" },
    ],
  },
  moscow: {
    bins: ["Must", "Should", "Could", "Won't"],
    items: [
      { text: "Poder pagar la compra", answer: "Must" },
      { text: "Registrarse e iniciar sesión", answer: "Must" },
      { text: "Mail de confirmación del pedido", answer: "Should" },
      { text: "Filtros de búsqueda por precio", answer: "Should" },
      { text: "Lista de deseos", answer: "Could" },
      { text: "Modo oscuro", answer: "Could" },
      { text: "Integración con el fax", answer: "Won't" },
      { text: "Checkout en el metaverso", answer: "Won't" },
      { text: "Ver el carrito antes de pagar", answer: "Must" },
      { text: "Seguimiento del envío", answer: "Should" },
    ],
  },
  triage: {
    bins: ["P1 · Urgente", "P2 · Alta", "P3 · Normal"],
    items: [
      { text: "No funciona el sistema de cobro en ninguna sucursal", answer: "P1 · Urgente" },
      { text: "Se cayó el mail de toda la empresa", answer: "P1 · Urgente" },
      { text: "Un usuario no puede imprimir", answer: "P3 · Normal" },
      { text: "El gerente olvidó la clave 10 minutos antes de reunirse con un cliente", answer: "P2 · Alta" },
      { text: "Pedido de un mouse nuevo", answer: "P3 · Normal" },
      { text: "La VPN no conecta para todo el equipo remoto", answer: "P1 · Urgente" },
      { text: "Una compu anda lenta", answer: "P3 · Normal" },
      { text: "El sistema de turnos falla a la mitad de los usuarios", answer: "P2 · Alta" },
      { text: "Instalar el Zoom en la compu de un pasante", answer: "P3 · Normal" },
      { text: "Contabilidad no puede emitir facturas el día de cierre", answer: "P2 · Alta" },
    ],
  },
  bugofeature: {
    bins: ["🐛 Bug", "💡 Mejora", "✅ Funciona bien"],
    items: [
      { text: "El botón Comprar no hace nada en Safari", answer: "🐛 Bug" },
      { text: "El total del carrito no suma el envío", answer: "🐛 Bug" },
      { text: "Estaría bueno filtrar por precio", answer: "💡 Mejora" },
      { text: "La contraseña se oculta con asteriscos", answer: "✅ Funciona bien" },
      { text: "El formulario acepta emails sin @", answer: "🐛 Bug" },
      { text: "Al cerrar sesión te manda al inicio", answer: "✅ Funciona bien" },
      { text: "Agregar modo oscuro", answer: "💡 Mejora" },
      { text: "Las fechas salen como 01/01/1970", answer: "🐛 Bug" },
      { text: "Pedir confirmación antes de borrar un producto", answer: "💡 Mejora" },
      { text: "El buscador ignora mayúsculas: 'MATE' encuentra 'mate'", answer: "✅ Funciona bien" },
    ],
  },
};
