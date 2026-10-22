// Mensajes de éxito/fracaso según lo que acaba de pasar (reemplazan al "Deploy exitoso" de siempre)
import { pick } from "./helpers";

const MG_WIN = {
  css: ["Centraste un div al primer intento. Hay seniors que se jubilaron sin lograrlo.", "Flexbox domado. El diseñador lloró de emoción."],
  pipes: ["Query optimizada: el DBA te mandó un corazón por primera vez en la historia.", "Los datos fluyen como el Paraná en crecida."],
  servers: ["Ni un servidor caído. El on-call de esta noche duerme tranquilo.", "Uptime 99,99%. El 0,01% fue el gato desenchufando la zapatilla."],
  hack: ["Ataque bloqueado. El hacker se fue a intentar con el WiFi de tu vecino.", "Firewall de acero. Ni la AFIP entra."],
  data: ["Datos limpios. El modelo dejó de predecir que el dólar baja.", "Limpiaste más basura que la Ceamse un lunes."],
  prioritizer: ["Backlog ordenado. Por primera vez el sprint tiene sentido.", "Dijiste que no a tres pedidos y nadie se enojó. Magia."],
  capa8: ["Capa 8 resuelta: el problema estaba entre la silla y el teclado. Como siempre.", "'¿Probaste apagarlo y prenderlo?' Funcionó. Funciona siempre."],
  bugbash: ["Bugs exterminados. Ni la Fumigadora del barrio es tan efectiva.", "Cazaste todos los bugs. El QA te ofrece su puesto."],
  terminal: ["Tipeaste como hacker de película. Solo te faltó la capucha.", "La terminal te respeta. Vim todavía no."],
  memotest: ["Memoria de elefante. Te acordás de todo menos de dónde dejaste el mate.", "Memotest completo. Tu abuela estaría orgullosa (y ella sí juega bien)."],
  gitflow: ["Git flow perfecto. Ni un push --force, ni un llanto.", "PR mergeado sin conflictos. Ver para creer."],
  htmlcssjs: ["Cada cosa en su capa: HTML, CSS y JS en paz, como un asado bien organizado.", "Separaste responsabilidades mejor que en tu casa."],
  statuscodes: ["Status codes impecables: 200 para lo bueno, 418 para el café.", "Tu API habla HTTP mejor que vos inglés en la entrevista."],
  comandos: ["Linux te obedece. sudo hacé-mi-vida-más-fácil.", "Comandos perfectos. Ni un rm -rf de más."],
  phishing: ["Ni un clic en el mail del 'príncipe nigeriano'. Ciberseguridad nivel abuela desconfiada.", "Detectaste todos los phishing. El de 'ganaste un iPhone' casi te gana."],
  graficos: ["Gráficos perfectos. Ni una torta de 3D con 15 porciones.", "El directorio entendió todo. Milagro estadístico."],
  moscow: ["MoSCoW impecable: Must, Should, Could y 'ni en pedo'.", "Priorizaste como un PM de verdad (no como uno de LinkedIn)."],
  triage: ["Triage perfecto: lo urgente primero y el mouse del pasante, después.", "Cola de tickets en cero antes del mate de las 10."],
  bugofeature: ["Bug o feature: acertaste todas. 'Es un feature' no coló esta vez.", "Distinguiste bugs de features mejor que el Product Owner."],
  merge: ["Conflictos resueltos sin romper nada. Diplomacia nivel ONU.", "Merge limpio. El git blame no va a decir tu nombre."],
  findbug: ["Encontraste el bug en 3 segundos. El autor era vos hace 6 meses.", "Bug encontrado. Era un punto y coma. Siempre es un punto y coma."],
  algo: ["Algoritmos aprobados. Big O ya no te da miedo (solo un poco).", "Aprobaste el final. Tu vieja ya lo está contando en el grupo de WhatsApp."],
  techq: ["Respondiste todo. El entrevistador anotó 'strong hire' y un emoji de fuego.", "Entrevista técnica superada. Tu síndrome del impostor está confundido."],
  design: ["System design sólido. Escala más que el precio del dólar.", "Arquitectura aprobada: aguanta un Black Friday y un Hot Sale juntos."],
  behavioral: ["Respuestas behavioral impecables. Ni mencionaste que odiás las dailies.", "Contaste tus fracasos como si fueran épicos. Te compraron."],
  pixelperfect: ["Pixel perfect de verdad: el diseñador midió con regla y no encontró nada.", "Igualita al Figma. Hasta el border-radius, que nadie respeta nunca."],
  endpoints: ["API REST de manual: 201 para crear, 204 para borrar y cero 200 con un 'error' adentro.", "El front no tuvo que adivinar nada. Primera vez en la historia de la empresa."],
  deploywindow: ["Deploys en la ventana justa. Ni un rollback, ni un viernes a las 18:59.", "Timing de arquero en los penales: atajaste todos los deploys."],
  parches: ["Todo parcheado. El hacker volvió a probar suerte con el WiFi del bar de enfrente.", "Rotaste secretos, pusiste rate limit y cifraste todo. El auditor lloró de emoción."],
  outliers: ["Cazaste todos los outliers. El modelo dejó de creer que un alfajor sale un millón.", "Ojo de analista: viste el dato raro antes que el gerente."],
  sprintplanner: ["Sprint perfecto: máximo valor, cero sobrecarga y el CEO contento (por ahora).", "Planificaste como un PM de verdad: dijiste que no a tres cosas y nadie lloró."],
  simonhelpdesk: ["Procedimiento perfecto. El usuario jura que fue magia.", "Memoria de help desk: te acordás de cada paso, menos de almorzar."],
  spotdiff: ["Encontraste cada diferencia. El bug no llegó ni a staging.", "Ojo de QA: un === por == a 40 metros de distancia."],
};

const MG_WIN_GENERIC = [
  "Build passing. Merge aprobado. Que no se entere nadie que fue al primer intento.",
  "¡Sale con fritas! Deploy exitoso y sin rollback.",
  "Todo verde en el pipeline. Hasta los tests que nadie entiende.",
];

const MG_LOSE = [
  "Build failed. El pipeline se puso rojo como camiseta de Independiente.",
  "Exit code 1. Mañana es otro día (y otro deploy).",
  "Falló. Pero tranqui: 'en mi máquina andaba'.",
  "Se rompió todo. Hora de revisar Stack Overflow con fe.",
];

export const mensajeMinijuego = (gameId, win) =>
  win ? pick(MG_WIN[gameId] || MG_WIN_GENERIC) : pick(MG_LOSE);

const COMPRA_KIOSCO = [
  (it) => `${it.emoji} Compraste ${it.name}. El chino te dio el vuelto en caramelos, como corresponde.`,
  (it) => `${it.emoji} ${it.name} adquirido. Revisaste la fecha de vencimiento dos veces. Estás aprendiendo.`,
  (it) => `${it.emoji} ¡${it.name} en la bolsa! El chino te saludó por tu nombre. Ya sos cliente VIP.`,
  (it) => `${it.emoji} Te llevaste ${it.name}. Lo pagaste en efectivo antes de que aumente (aumentó igual).`,
];

export const mensajeCompra = (item) => pick(COMPRA_KIOSCO)(item);
