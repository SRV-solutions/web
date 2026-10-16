import { LEVELS, SALARY_USD } from "./data";
import {
  fx,
  price,
  chance,
  logicGain,
  makeOffer,
  acceptOffer,
  role,
  updatePhase,
  incidentWin,
  incidentLose,
  fmtArs,
} from "./helpers";

function finishInterview(s, lines) {
  const { company, score } = s.interview;
  if (score >= 2) {
    s.level = 5;
    s.victory = { company, week: s.week, score };
    lines.push(`🏆 ¡${company} te hizo una oferta! Ganaste ${score} de 3 rondas.`);
  } else {
    s.phase = 3;
    s.interviewCooldown = 10;
    s.interview = null;
    fx(s, { logic: 4, network: 3, mental: -10 });
    lines.push(
      `Ganaste ${score} de 3 rondas. "Vamos a mantener tu CV en nuestra base" (traducción: no). Podés volver a intentarlo en 10 semanas.`
    );
  }
}

const interviewRound = (game, next) => ({
  label: "🎯 Arrancar la ronda",
  minigame: game,
  onWin: (s, lines) => {
    s.interview.score += 1;
    lines.push("Ronda ganada. Los entrevistadores asienten en silencio.");
    next ? s.queue.push(next) : finishInterview(s, lines);
  },
  onLose: (s, lines) => {
    lines.push("Ronda perdida. Uno de los entrevistadores bostezó.");
    next ? s.queue.push(next) : finishInterview(s, lines);
  },
});

export const EVENTS = {
  // ---------- FASE 1: EL HOLA MUNDO ----------
  eleccion_estudio: {
    title: "🎒 Arranca la aventura: ¿dónde estudiás?",
    text: "Tenés una netbook del Conectar Igualdad con Huayra Linux, un monitor con un píxel muerto y ganas de escribir tu primer 'Hola Mundo'. Primera decisión de tu carrera:",
    options: [
      {
        label: "🏛️ Universidad pública (UBA / UTN / UNLP)",
        desc: "+30 Lógica y +15 Contactos. Gratis y con prestigio, pero larga y con paros y tomas.",
        run: (s, lines) => {
          s.study = "uni";
          fx(s, { logic: 30, network: 15 });
          lines.push("Te anotaste en la facu. Primer día: aula llena, proyector roto y un profe que dice que 'la mitad no llega a segundo'.");
        },
      },
      {
        label: "🚀 Bootcamp intensivo (3 meses)",
        desc: "Entrás rápido al mercado, pero pagás el 15% de tu sueldo por 12 meses. Menos base teórica.",
        run: (s, lines) => {
          s.study = "bootcamp";
          s.isaPayments = 12;
          fx(s, { logic: 12, network: 5 });
          lines.push("Firmaste el Acuerdo de Ingresos Compartidos sin leer la letra chica. 'Aprendé a programar en 3 meses', decía el aviso de Instagram.");
        },
      },
    ],
  },

  toma_facultad: {
    title: "✊ Toman la facultad por un mes",
    text: "Asamblea, bombos y la sede cerrada. El centro de estudiantes votó la toma a mano alzada. Tenés un mes libre. ¿Qué hacés?",
    options: [
      {
        label: "📚 Estudiar por tu cuenta con cursos online",
        desc: "Subís Lógica, pero gastás ahorros.",
        run: (s, lines) => {
          fx(s, { logic: logicGain(s, 12), ars: -price(s, 150000), energy: -8 });
          lines.push("Aprendiste más en un mes con YouTube que en todo el cuatrimestre. No se lo digas a nadie.");
        },
      },
      {
        label: "🖥️ Soporte técnico en un ciber del barrio",
        desc: "Ganás pesos, perdés energía.",
        run: (s, lines) => {
          fx(s, { ars: price(s, 180000), energy: -20, network: 3 });
          lines.push("Desinstalaste 47 barras de herramientas y sacaste un virus de un pendrive que decía 'FOTOS CUMPLE TÍA'.");
        },
      },
    ],
  },

  final_algoritmos: {
    title: "📝 Final de Algoritmos con el profesor filtro",
    text: "El profe que desaprueba al 80% te espera. Dicen que una vez hizo llorar a un ayudante y que todavía corrige en papel con birome roja.",
    options: [
      {
        label: "🤖 Machetearte con una IA",
        desc: "Riesgo de que te agarren… o aprobás con todo.",
        run: (s, lines) => {
          if (chance(0.55)) {
            s.flags.finalPassed = true;
            fx(s, { logic: 10, mental: 10 });
            lines.push("La IA respondió todo bien y el profe no se dio cuenta. ¡Aprobaste con 9!");
          } else {
            s.studyWeeks = Math.max(0, s.studyWeeks - 6);
            fx(s, { network: -10, mental: -15 });
            lines.push("La IA inventó una función que no existe y le puso emojis. El profe te vio. Perdés 6 semanas de cursada.");
          }
        },
      },
      {
        label: "🧉 Tres noches seguidas a puro mate",
        desc: "Aprobás seguro, pero tu salud mental baja a 20.",
        run: (s, lines) => {
          s.flags.finalPassed = true;
          fx(s, { mental: Math.min(0, 20 - s.stats.mental), energy: -20, logic: logicGain(s, 10) });
          lines.push("Aprobaste con 4 (cuatro). Tus ojeras ya tienen ojeras. La yerba se terminó el segundo día.");
        },
      },
      {
        label: "🧠 Rendirlo de verdad",
        desc: "Respondé preguntas fáciles de programación. Si ganás, aprobás con gloria.",
        minigame: "algo",
        onWin: (s, lines) => {
          s.flags.finalPassed = true;
          fx(s, { logic: logicGain(s, 12), network: 5 });
          lines.push("¡10 (diez)! El profe filtro te pidió que seas ayudante ad honorem (sin cobrar, obvio).");
        },
        onLose: (s, lines) => {
          s.studyWeeks = Math.max(0, s.studyWeeks - 3);
          fx(s, { mental: -10 });
          lines.push("Te vas a marzo. Perdés 3 semanas de cursada.");
        },
      },
    ],
  },

  graduacion: {
    title: "🎓 ¡Te recibiste!",
    text: "Huevos, harina, yerba y tinta en la vereda de la facu. Tu abuela ya le contó a todo el barrio que 'arreglás computadoras'.",
    options: [
      {
        label: "🤝 Activar los contactos de la facu",
        desc: "Con buenos contactos, te llueve una oferta de Junior.",
        run: (s, lines) => {
          s.studyDone = true;
          updatePhase(s);
          if (s.stats.network >= 25) {
            makeOffer(s, 2, 1.1);
            s.queue.push("oferta");
            lines.push("Un ex compañero de cursada te refirió. ¡Hay oferta!");
          } else {
            lines.push("Nadie se acuerda de vos. Vas a tener que buscar laburo.");
          }
        },
      },
      {
        label: "🎉 Tomarte un mes de festejo",
        desc: "+20 Salud mental, +20 Energía. Después buscás laburo.",
        run: (s, lines) => {
          s.studyDone = true;
          updatePhase(s);
          fx(s, { mental: 20, energy: 20 });
          lines.push("Asado, fernet y una semana en la costa con 8 amigos en un monoambiente.");
        },
      },
    ],
  },

  promesa_trabajo: {
    title: "🎁 'Trabajo garantizado' del bootcamp",
    text: "Terminaste el bootcamp. Te ofrecen entrar ya mismo a una Software Factory que 'es como una familia'.",
    options: [
      {
        label: "✅ Aceptar la Software Factory",
        desc: "Sueldo bajo en pesos, pero mucha experiencia para el CV.",
        run: (s, lines) => {
          makeOffer(s, 1, 0.85);
          acceptOffer(s, lines);
          fx(s, { xp: 5 });
        },
      },
      {
        label: "🔎 Rechazar y buscar por LinkedIn",
        desc: "Mayor riesgo de quedar un tiempo sin laburo.",
        run: (s, lines) => {
          s.studyDone = true;
          updatePhase(s);
          lines.push("Pusiste 'Full Stack Developer | Apasionado por la tecnología 🚀' en LinkedIn. Que sea lo que Dios quiera.");
        },
      },
    ],
  },

  // ---------- FASE 2: PRIMER LABURO ----------
  oferta: {
    title: "📩 Oferta de laburo",
    text: (s) => {
      const o = s.offer;
      let t = `${o.company} te ofrece un puesto de ${LEVELS[o.level]} por ${fmtArs(o.salaryArs)} por mes. Beneficios: frutita los lunes y "buen clima laboral".`;
      if (s.job) {
        t += ` Hoy cobrás ${s.job.salaryUsd ? `US$${s.job.salaryUsd}` : fmtArs(s.job.salaryArs)} en ${s.job.company}.`;
      }
      return t;
    },
    options: [
      { label: "✍️ Firmar", run: (s, lines) => acceptOffer(s, lines) },
      {
        label: "🙅 Rechazar",
        run: (s, lines) => {
          s.offer = null;
          lines.push("Rechazaste la oferta. Te van a seguir mandando mails igual.");
        },
      },
    ],
  },

  onboarding: {
    title: "🌿 Onboarding: tu primer Pull Request",
    text: "Primer día. Te dieron una notebook, un buzo de la empresa y te pidieron subir un cambio 'para que vayas conociendo el flujo'.",
    options: [
      {
        label: "🌿 Hacer el flujo de Git",
        minigame: "gitflow",
        onWin: (s, lines) => {
          fx(s, { xp: 3, network: 3 });
          lines.push("PR aprobado en el primer día. El Tech Lead te puso un 🚀 en Slack.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -5 });
          lines.push("Pusheaste directo a main en tu primer día. Clásico. Te pusieron un meme en el canal.");
        },
      },
      {
        label: "🙈 Pedirle al compañero que lo haga por vos",
        run: (s, lines) => {
          fx(s, { network: -2, mental: 2 });
          lines.push("Lo hizo él mientras suspiraba fuerte.");
        },
      },
    ],
  },

  mudanza: {
    title: "🏠 ¿Irte a vivir solo o seguir en lo de tus viejos?",
    text: "Ya cobrás sueldo. Tu vieja pregunta cuándo te vas. Tu billetera pregunta si estás loco.",
    options: [
      {
        label: "👵 Quedarte en lo de tus viejos",
        desc: "Ahorrás mucha plata, pero los gritos en la Daily te bajan la salud mental.",
        run: (s, lines) => {
          s.housing = "viejos";
          lines.push("Te quedás. Milanesas gratis y wifi compartido con 4 celulares viendo TikTok.");
        },
      },
      {
        label: "🔑 Alquilar en CABA / GBA",
        desc: "+50% de concentración al estudiar, pero el alquiler (ajustado por inflación) se come gran parte del sueldo.",
        run: (s, lines) => {
          s.housing = "solo";
          fx(s, { ars: -price(s, 400000), mental: 8 });
          lines.push("Pagaste depósito, mes adelantado y comisión. El monoambiente es 'luminoso' (no tiene cortinas) y 'a estrenar' (en 1978).");
        },
      },
    ],
  },

  pedir_aumento: {
    title: "💸 Pedir un aumento",
    text: (s) => `Hace ${s.job.weeksSinceRaise} semanas que cobrás ${fmtArs(s.job.salaryArs)} y la inflación se lo está comiendo. Con tu sueldo ya no te alcanza ni para el alquiler de un placard. ¿Cómo encarás?`,
    options: [
      {
        label: "📊 La vía diplomática: Excel con tus aportes",
        desc: "Chance según tu Lógica y Contactos.",
        run: (s, lines) => {
          s.job.weeksSinceRaise = 0;
          if (chance(0.35 + s.stats.logic / 300 + s.stats.network / 300)) {
            s.job.salaryArs = Math.round(s.job.salaryArs * 1.35);
            fx(s, { mental: 8 });
            lines.push("El Team Lead quedó impresionado con tus gráficos de torta. +35% de aumento.");
          } else {
            s.job.salaryArs = Math.round(s.job.salaryArs * 1.05);
            fx(s, { mental: -5 });
            lines.push("'No hay presupuesto este trimestre'. Te dieron un 5% y una palmadita en la espalda.");
          }
        },
      },
      {
        label: "🌶️ La jugada picante: contraoferta falsa",
        desc: "50/50: aumentazo o quedás escrachado.",
        run: (s, lines) => {
          s.job.weeksSinceRaise = 0;
          if (chance(0.5)) {
            s.job.salaryArs = Math.round(s.job.salaryArs * 1.6);
            lines.push("Se la creyeron. +60% y te regalaron un termo con el logo de la empresa.");
          } else {
            fx(s, { network: -15, mental: -15 });
            lines.push("El Team Lead conocía al CTO de la 'otra empresa'. Silencio incómodo en la próxima Daily.");
          }
        },
      },
      {
        label: "🚪 'Open to Work' y renuncia un viernes",
        desc: "Te quedás sin laburo, pero la próxima oferta va a pagar mucho más.",
        run: (s, lines) => {
          s.job = null;
          s.secondJob = false;
          s.searchBonus = 30;
          fx(s, { network: 10, mental: 10 });
          lines.push("Renunciaste un viernes a las 17:59. Tu LinkedIn tiene 80 notificaciones de recruiters.");
        },
      },
    ],
  },

  // ---------- FASE 3: SENIOR CON MATE ----------
  bebe: {
    title: "👶 ¡Vas a ser papá / mamá!",
    text: "La familia crece. Los pañales están dolarizados. Decisión importante:",
    options: [
      {
        label: "🍼 Licencia extendida",
        desc: "8 semanas sin sumar XP, pero sube mucho la felicidad.",
        run: (s, lines) => {
          s.kid = true;
          s.kidLeave = 8;
          fx(s, { mental: 25 });
          lines.push("Te tomaste la licencia. Pusiste el Slack en 'No molestar' por primera vez en tu vida.");
        },
      },
      {
        label: "💼💼 Overemployment: dos laburos para afuera",
        desc: "Cobrás un segundo sueldo en dólares, pero riesgo altísimo de Burnout.",
        run: (s, lines) => {
          s.kid = true;
          s.secondJob = true;
          fx(s, { mental: -10 });
          lines.push("Dos notebooks, dos Slacks, dos Dailies a la misma hora. ¿Qué podría salir mal?");
        },
      },
      {
        label: "🌙 Pedir un puesto 100% asincrónico",
        desc: "Startup internacional que paga en USD. Necesitás 35+ de Contactos.",
        run: (s, lines) => {
          s.kid = true;
          if (s.stats.network >= 35) {
            s.job = { company: "Startup internacional 'Async Labs'", salaryArs: 0, salaryUsd: SALARY_USD[s.level], weeksSinceRaise: 0, remote: true };
            fx(s, { mental: 10 });
            lines.push(`Conseguiste un puesto remoto por US$${SALARY_USD[s.level]}/mes. Programás de noche mientras el bebé duerme.`);
          } else {
            fx(s, { mental: -5 });
            lines.push("Ningún recruiter te contestó. Necesitás más red de contactos.");
          }
        },
      },
    ],
  },

  // ---------- FASE 4: LA FINAL ----------
  recruiter_bigtech: {
    title: "🌍 ¡Te escribió un recruiter de una Big Tech!",
    text: (s) =>
      `"Hi! We loved your profile 🚀". ${s.interview.company} quiere entrevistarte. Son 3 rondas: Live Coding, System Design y Behavioral. Necesitás ganar 2 de 3.`,
    options: [
      {
        label: "🚀 Aceptar: ¡vamos con todo!",
        run: (s, lines) => {
          s.phase = 4;
          s.queue.push("entrevista_r1");
          lines.push("Te compraste una camisa para la videollamada (abajo seguís en joggin y ojotas).");
        },
      },
      {
        label: "⏳ Todavía no, quiero practicar más",
        run: (s, lines) => {
          s.interview = null;
          s.interviewCooldown = 6;
          lines.push("Le dijiste que te escriba en un par de meses.");
        },
      },
    ],
  },
  entrevista_r1: {
    title: "💻 Ronda 1: Live Coding",
    text: "Tres entrevistadores senior te miran en vivo. Uno tiene la cámara apagada (sospechoso).",
    options: [interviewRound("algo", "entrevista_r2")],
  },
  entrevista_r2: {
    title: "🏗️ Ronda 2: System Design",
    text: "Diseñá la arquitectura de una app de mensajería para 100 millones de usuarios. Pista: no alcanza con un servidor abajo del escritorio.",
    options: [interviewRound("design", "entrevista_r3")],
  },
  entrevista_r3: {
    title: "🗣️ Ronda 3: Behavioral",
    text: "Llegó el momento del Chamuyo Senior. Situaciones de conflicto laboral.",
    options: [interviewRound("behavioral", null)],
  },

  // ---------- INCIDENTES IT ----------
  incidente: {
    title: "🔥 Bug crítico en producción",
    text: (s) => `Son las 3 AM y suena el PagerDuty. Como ${role(s).name}, te toca apagar el incendio. Nadie sabe quién deployó. Todos sospechan del pasante.`,
    options: [
      { label: "🧑‍💻 ¡A apagar el incendio!", minigame: (s) => role(s).minigame, onWin: incidentWin, onLose: incidentLose },
    ],
  },

  caida_aws: {
    title: "☁️ Se cayó AWS (us-east-1, obvio)",
    text: "Medio internet está caído y tu servicio también. Los picos de tráfico están derritiendo los servers.",
    options: [
      { label: "🖥️ Balancear los servers", minigame: "servers", onWin: incidentWin, onLose: incidentLose },
      {
        label: "🙈 Tuitear 'no es nuestra culpa' y esperar",
        run: (s, lines) => {
          fx(s, { xp: -1, network: -3 });
          lines.push("Volvió solo a las 4 horas. Tu jefe vio el tuit.");
        },
      },
    ],
  },

  ticket_capa8: {
    title: "🙋 Llegaron tickets de soporte",
    text: "Sistemas está de vacaciones y te tocó atender la mesa de ayuda. Algunos tickets son bugs reales… otros son errores de Capa 8 (el problema está entre la silla y el teclado).",
    options: [
      {
        label: "🎧 Atender los tickets",
        minigame: "capa8",
        onWin: (s, lines) => {
          fx(s, { xp: 3, network: 4 });
          lines.push("Resolviste todo. La mitad era 'apagar y prender'. Te ganaste el respeto de Contaduría.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -6 });
          lines.push("Escalaste a desarrollo un ticket que era el monitor apagado. Te van a cargar por meses.");
        },
      },
      {
        label: "📧 Responder a todos '¿Probaste reiniciar?'",
        run: (s, lines) => {
          fx(s, { network: -2, mental: 3 });
          lines.push("Funcionó en el 70% de los casos. Es la ley de soporte.");
        },
      },
    ],
  },

  bug_bash: {
    title: "🐛 Bug Bash antes del release",
    text: "Mañana sale la versión 2.0 y QA encontró 'algunos detallitos'. Hay bugs saliendo de todos los archivos.",
    options: [
      {
        label: "🔨 A aplastar bugs",
        minigame: "bugbash",
        onWin: (s, lines) => {
          fx(s, { xp: 4, logic: 2 });
          lines.push("Release limpio. Bueno, 'limpio'. Nada que un hotfix no arregle.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -6, xp: -1 });
          lines.push("Salió con bugs. Lo llamaron 'features no documentados'.");
        },
      },
    ],
  },

  merge_conflict: {
    title: "🔀 Merge conflict un viernes a las 17:50",
    text: "Tres personas tocaron el mismo archivo y Git te mira esperando que decidas. El fin de semana está en juego.",
    options: [
      {
        label: "🔀 Resolver los conflictos",
        minigame: "merge",
        onWin: (s, lines) => {
          fx(s, { xp: 3, mental: 4 });
          lines.push("Mergeado. Llegaste al after office a tiempo.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -6, energy: -5 });
          lines.push("Rompiste el build. El fin de semana lo pasaste haciendo git revert.");
        },
      },
      {
        label: "💣 git push --force",
        run: (s, lines) => {
          fx(s, { network: -6, mental: 2 });
          lines.push("Borraste el trabajo de dos compañeros. Ya no te saludan en la cocina.");
        },
      },
    ],
  },

  code_review: {
    title: "🔍 Code Review del Junior",
    text: "Un Junior te pidió review de su PR. Dice 'es un cambio chiquito'. Tiene 2.400 líneas y el título es 'cambios'.",
    options: [
      {
        label: "🔍 Revisar con lupa",
        minigame: "findbug",
        onWin: (s, lines) => {
          fx(s, { xp: 3, network: 3, logic: 2 });
          lines.push("Encontraste el bug antes de que llegue a prod. El Junior te dice 'maestro'.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -5 });
          lines.push("Aprobaste con 'LGTM 👍' sin leer. El bug llegó a prod.");
        },
      },
      {
        label: "👍 Poner 'LGTM' sin leer",
        run: (s, lines) => {
          if (chance(0.5)) {
            fx(s, { mental: 3 });
            lines.push("Zafaste. Esta vez.");
          } else {
            fx(s, { mental: -8, network: -3 });
            lines.push("Tenía una API key en el código. El repo era público. Ahora es trending en Twitter.");
          }
        },
      },
    ],
  },

  en_mi_maquina_anda: {
    title: "🤷 'En mi máquina anda'",
    text: "QA dice que el sistema no funciona. En tu máquina anda perfecto. El clásico de los clásicos.",
    options: [
      {
        label: "📦 'Entonces mandamos tu máquina a producción'",
        run: (s, lines) => {
          fx(s, { network: -3, mental: 4 });
          lines.push("Así nació Docker. QA no se rió.");
        },
      },
      {
        label: "🔍 Buscar el bug en serio",
        minigame: "findbug",
        onWin: (s, lines) => {
          fx(s, { xp: 3, logic: 2 });
          lines.push("Era una variable de entorno que solo existía en tu compu. Te pidieron perdón (QA no).");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -5 });
          lines.push("No lo encontraste. Ahora tampoco anda en tu máquina.");
        },
      },
    ],
  },

  dns_caido: {
    title: "🌐 Se cayó todo. ¿Es DNS?",
    text: "No es DNS. No puede ser DNS. … Siempre es DNS. Hay que entrar al server por la terminal.",
    options: [
      {
        label: "⌨️ Abrir la terminal",
        minigame: "terminal",
        onWin: (s, lines) => {
          fx(s, { xp: 3, logic: 2 });
          lines.push("Era DNS. Siempre es DNS. Te sentiste hacker de película.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -5 });
          lines.push("Tipeaste 'sl' en vez de 'ls' y pasó un trencito por la pantalla. El server sigue caído.");
        },
      },
    ],
  },

  meetup_trivia: {
    title: "🍕 Meetup tech con trivia",
    text: "Pizza, cerveza artesanal y un sorteo de stickers. Hay un memotest de tecnologías y el premio es una remera talle S que no le va a nadie.",
    options: [
      {
        label: "🧠 Jugar el memotest",
        minigame: "memotest",
        onWin: (s, lines) => {
          fx(s, { network: 8, mental: 5 });
          lines.push("¡Ganaste! La remera no te entra, pero conociste a un recruiter.");
        },
        onLose: (s, lines) => {
          fx(s, { network: 3 });
          lines.push("No ganaste, pero te llevaste 14 stickers para la notebook.");
        },
      },
      {
        label: "🍕 Ir solo por la pizza",
        run: (s, lines) => {
          fx(s, { energy: 6, network: 2 });
          lines.push("Comiste 6 porciones. Misión cumplida.");
        },
      },
    ],
  },

  hackathon: {
    title: "🏆 Hackathon de fin de semana",
    text: "48 horas, pizza fría, Red Bull y un premio en efectivo. ¿Te anotás?",
    options: [
      {
        label: "🚀 Participar",
        minigame: (s) => role(s).minigame,
        onWin: (s, lines) => {
          fx(s, { network: 10, ars: price(s, 300000), energy: -10 });
          lines.push("¡Ganaste el hackathon! Premio en efectivo y foto con un cheque gigante.");
        },
        onLose: (s, lines) => {
          fx(s, { network: 4, energy: -15 });
          lines.push("No ganaste, pero hiciste contactos y comiste pizza gratis.");
        },
      },
      {
        label: "😴 Dormir todo el finde",
        run: (s, lines) => {
          fx(s, { energy: 15, mental: 5 });
          lines.push("Dormiste 14 horas seguidas. Ganaste igual.");
        },
      },
    ],
  },

  deploy_viernes: {
    title: "📅 'Deployemos el viernes a las 18, ¿qué puede salir mal?'",
    text: "El PM quiere el deploy antes del fin de semana. 'Es un cambio chiquito', dice.",
    options: [
      {
        label: "🚀 Deployar igual",
        run: (s, lines) => {
          if (chance(0.5)) {
            fx(s, { xp: 2, mental: 3 });
            lines.push("No pasó nada. Milagro. Prendé una vela.");
          } else {
            s.queue.push("incidente");
            lines.push("Sábado 2 AM: el celular explota de notificaciones…");
          }
        },
      },
      {
        label: "🙅 'Los viernes no se deploya'",
        run: (s, lines) => {
          fx(s, { network: -2, mental: 5 });
          lines.push("El PM resopló, pero tu fin de semana está a salvo.");
        },
      },
    ],
  },

  estimacion: {
    title: "⏱️ '¿Cuánto tardás en hacer esto?'",
    text: "El PM te muestra un dibujo en una servilleta: 'es como Mercado Libre pero más simple'.",
    options: [
      {
        label: "🤞 'Dos horitas'",
        run: (s, lines) => {
          fx(s, { mental: -8, xp: 2 });
          lines.push("Tardaste 3 semanas. Las dos horitas más largas de la historia.");
        },
      },
      {
        label: "🧙 'Depende'",
        run: (s, lines) => {
          fx(s, { network: 3, mental: 2 });
          lines.push("Respuesta Senior por excelencia. El PM se fue confundido pero conforme.");
        },
      },
      {
        label: "🥧 Estimar y multiplicar por π",
        run: (s, lines) => {
          fx(s, { logic: 1, mental: 4 });
          lines.push("Te sobró un día. Te dicen 'el que siempre cumple'.");
        },
      },
    ],
  },

  reunion_mail: {
    title: "📆 Reunión que podría haber sido un mail",
    text: "1 hora, 14 personas, 3 'me escuchan?', 2 'se me congeló' y un 'te fuiste en mute'.",
    options: [
      {
        label: "📷 Apagar la cámara y seguir codeando",
        run: (s, lines) => {
          if (chance(0.7)) {
            fx(s, { xp: 1, mental: 2 });
            lines.push("Nadie se dio cuenta. Cerraste un ticket.");
          } else {
            fx(s, { network: -4, mental: -4 });
            lines.push("'¿Vos qué opinás?' Silencio. Se escuchaba tu teclado mecánico.");
          }
        },
      },
      {
        label: "🙂 Prestar atención",
        run: (s, lines) => {
          fx(s, { energy: -6, network: 2 });
          lines.push("Decidieron hacer otra reunión para hablar de esta reunión.");
        },
      },
    ],
  },

  stackoverflow_caido: {
    title: "📉 Se cayó Stack Overflow",
    text: "Pánico mundial. Los programadores miran la pantalla sin saber qué hacer.",
    options: [
      {
        label: "📖 Leer la documentación oficial",
        run: (s, lines) => {
          fx(s, { logic: logicGain(s, 4), mental: -3 });
          lines.push("Por primera vez en tu vida leíste la documentación. Era útil. ¿Quién lo diría?");
        },
      },
      {
        label: "🤖 Preguntarle a la IA",
        run: (s, lines) => {
          fx(s, { logic: 1 });
          lines.push("Te respondió con total seguridad algo que no existe. Pero quedó lindo.");
        },
      },
    ],
  },

  // ---------- SITUACIONES ARGENTINAS ----------
  paro_colectivos: {
    title: "🚌 Paro de colectivos",
    text: "No hay bondis. La oficina queda a 15 km y Uber cobra como pasaje a Miami.",
    options: [
      {
        label: "🚲 Ir en bici",
        run: (s, lines) => {
          fx(s, { energy: -12, mental: 4 });
          lines.push("Llegaste transpirado pero con endorfinas. Casi te pisa un 60.");
        },
      },
      {
        label: "🏠 Laburar desde casa",
        run: (s, lines) => {
          fx(s, { mental: -3 });
          lines.push("Te conectaste en joggin. Nadie notó la diferencia.");
        },
      },
    ],
  },

  paro_general: {
    title: "📢 Paro general",
    text: "No hay trenes, ni bondis, ni bancos. Lo único abierto es la parrilla de la esquina.",
    options: [
      {
        label: "🥩 Asado improvisado con los vecinos",
        run: (s, lines) => {
          fx(s, { mental: 12, network: 3, ars: -price(s, 15000) });
          lines.push("Asado en la vereda. El vecino del 3ºB resultó ser CTO de una startup.");
        },
      },
      {
        label: "💻 Aprovechar para estudiar",
        run: (s, lines) => {
          fx(s, { logic: logicGain(s, 4), energy: -4 });
          lines.push("Silencio total en el barrio. El día más productivo del año.");
        },
      },
    ],
  },

  dolar_dispara: {
    title: "💵 Subió el dólar (como siempre)",
    text: "El blue sube. Nadie se sorprende. Tu tío ya está en la cueva de la peatonal y el kiosquero remarcó los alfajores mientras los comprabas.",
    options: [
      {
        label: "📺 Mirar la cotización cada 5 minutos",
        run: (s, lines) => {
          s.dolar = Math.round(s.dolar * 1.15);
          fx(s, s.usd > 0 ? { mental: 5 } : { mental: -5 });
          lines.push(`Dólar a $${s.dolar.toLocaleString("es-AR")}. ${s.usd > 0 ? "Tus ahorros en dólares valen más. Sonreís en silencio." : "Ojalá hubieras ahorrado en verdes."}`);
        },
      },
    ],
  },

  inflacion_record: {
    title: "📈 Inflación récord",
    text: "Salió el dato del INDEC y el súper ya remarcó todo. El repositor anda con la etiquetadora como si fuera un arma.",
    options: [
      {
        label: "😩 Aguantar",
        run: (s, lines) => {
          s.priceIndex *= 1.08;
          fx(s, { mental: -4 });
          lines.push("Todo subió un 8% extra. El paquete de yerba ya es un activo financiero.");
        },
      },
    ],
  },

  chino_vencido: {
    title: "🛒 El chino te vendió algo vencido",
    text: "Compraste un yogur en el súper chino. Vencía en 2019. Te diste cuenta después de la segunda cucharada.",
    options: [
      {
        label: "🤢 'Ya fue, no pasa nada'",
        run: (s, lines) => {
          fx(s, { energy: -18, mental: -4 });
          lines.push("Pasó. Pasaste el día entero en el baño. Hiciste la Daily desde ahí.");
        },
      },
      {
        label: "🗣️ Ir a reclamar",
        run: (s, lines) => {
          fx(s, { mental: 3 });
          lines.push("Te lo cambió sin decir nada. De vuelto te dio caramelos, como siempre.");
        },
      },
    ],
  },

  gato_mousepad: {
    title: "🐱 El gato te meó el mousepad",
    text: "Michi decidió que tu escritorio era su arenero. El mousepad gamer XXL está perdido. El teclado… está en duda.",
    options: [
      {
        label: "🛍️ Comprar todo nuevo",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 60000), mental: -2 });
          lines.push("Mousepad nuevo. El gato ya lo está mirando.");
        },
      },
      {
        label: "💨 Lavarlo y secarlo con el secador de pelo",
        run: (s, lines) => {
          fx(s, { mental: -6, energy: -4 });
          if (s.inv.keyboard && chance(0.4)) {
            s.inv.keyboard = false;
            lines.push("El olor no se fue y el teclado RGB tampoco sobrevivió. Ahora solo prende el LED rojo.");
          } else {
            lines.push("Quedó 'más o menos'. Cada vez que hace calor, te acordás.");
          }
        },
      },
    ],
  },

  sube_sin_saldo: {
    title: "💳 Te quedaste sin saldo en la SUBE",
    text: "El colectivo frena, apoyás la tarjeta y suena el pitido de la vergüenza: 'SALDO INSUFICIENTE'.",
    options: [
      {
        label: "🙏 Pedirle a alguien que te pase la suya",
        run: (s, lines) => {
          fx(s, { network: 2, mental: 2 });
          lines.push("Una señora te pasó la SUBE y te contó toda su vida. Ahora sabés de los nietos.");
        },
      },
      {
        label: "🚶 Caminar 30 cuadras",
        run: (s, lines) => {
          fx(s, { energy: -10, mental: -2 });
          lines.push("Llegaste tarde a la Daily. Dijiste que fue 'un tema de conexión'.");
        },
      },
    ],
  },

  feriado_puente: {
    title: "🏖️ Fin de semana largo",
    text: "Feriado puente. Cuatro días. La ruta 2 ya está colapsada.",
    options: [
      {
        label: "🏖️ Escapada a la costa",
        run: (s, lines) => {
          fx(s, { mental: 16, energy: 10, ars: -price(s, 120000) });
          lines.push("6 horas en la ruta, 2 de playa con viento y arena en el choripán. Volviste renovado.");
        },
      },
      {
        label: "📚 Quedarte estudiando",
        run: (s, lines) => {
          fx(s, { logic: logicGain(s, 5), mental: -3 });
          lines.push("Ciudad vacía, silencio total. Aprendiste un framework nuevo (ya salió otro).");
        },
      },
    ],
  },

  vecino_taladro: {
    title: "🔨 El vecino con el taladro",
    text: "Domingo, 8 AM. El vecino decidió colgar 40 cuadros. Justo hoy que querías dormir.",
    options: [
      {
        label: "😤 Aguantar",
        run: (s, lines) => {
          if (s.inv.headphones) {
            fx(s, { mental: 2 });
            lines.push("Auriculares con noise cancelling: ni te enteraste. La mejor inversión de tu vida.");
          } else {
            fx(s, { energy: -8, mental: -5 });
            lines.push("Taladró 3 horas. Después empezó con la amoladora.");
          }
        },
      },
    ],
  },

  arca_monotributo: {
    title: "🧾 Te llegó una intimación de ARCA",
    text: "Algo del monotributo, una categoría, una recategorización y una palabra que no entendiste. Plazo: 48 horas.",
    options: [
      {
        label: "👔 Pagarle a un contador",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 70000), mental: 4 });
          lines.push("El contador lo resolvió en 5 minutos y te cobró como si fueran 5 días.");
        },
      },
      {
        label: "🤯 Resolverlo vos con la clave fiscal",
        run: (s, lines) => {
          fx(s, { mental: -8, energy: -6, logic: 1 });
          lines.push("La página se cayó 4 veces. Al final era un formulario que no existía más.");
        },
      },
    ],
  },

  tecnico_internet: {
    title: "📡 Se te cortó internet",
    text: "La empresa de internet dice que el técnico va 'entre las 8 y las 20'. Tenés una demo importante.",
    options: [
      {
        label: "📱 Compartir datos del celular",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 10000), mental: -2 });
          lines.push("La demo se vio en 144p. 'Se te congeló' fue lo único que se escuchó.");
        },
      },
      {
        label: "☕ Ir a laburar a un café",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 12000), mental: 2 });
          lines.push("Un cortado y una medialuna te costaron lo mismo que un mes de streaming. El técnico vino a las 19:58.");
        },
      },
    ],
  },

  corte_luz: {
    title: "⚡ Corte de luz en todo el barrio",
    text: "Hace 38°C, se cortó la luz y la empresa dice que vuelve 'en el transcurso del día'.",
    options: [
      {
        label: "☕ Ir a laburar a un café con enchufes",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 12000), mental: 2 });
          lines.push("Encontraste el último enchufe libre. Lo defendiste como un león.");
        },
      },
      {
        label: "🕯️ Esperar con velas",
        run: (s, lines) => {
          fx(s, { xp: -1, logic: -1, mental: -3 });
          lines.push("Volvió a las 23:40. Perdiste el día entero y la comida de la heladera.");
        },
      },
    ],
  },

  tia_compu: {
    title: "👵 'Vos que sabés de computadoras…'",
    text: "Tu tía te pide que le arregles la impresora. No importa que seas programador: para la familia, 'sabés de computadoras'.",
    options: [
      {
        label: "🎧 Diagnosticar como un profesional",
        minigame: "capa8",
        onWin: (s, lines) => {
          fx(s, { mental: 6, energy: 5 });
          lines.push("Error de Capa 8: el cable estaba desenchufado. Te pagó con empanadas de carne cortada a cuchillo.");
        },
        onLose: (s, lines) => {
          fx(s, { mental: -4 });
          lines.push("No la arreglaste. Ahora toda la familia dice que 'no sabés nada de computadoras'.");
        },
      },
      {
        label: "🙅 'No sé de impresoras'",
        run: (s, lines) => {
          fx(s, { network: -2 });
          lines.push("Nadie sabe de impresoras. Ni los que las fabrican.");
        },
      },
    ],
  },

  grupo_familia: {
    title: "📱 El grupo de WhatsApp de la familia",
    text: "Tu tío reenvió una cadena: 'A partir de mañana WhatsApp será pago. Reenviá este mensaje a 10 contactos'. Te etiquetaron: '¿es verdad, vos que sabés?'",
    options: [
      {
        label: "🧑‍🏫 Explicar que es falso",
        run: (s, lines) => {
          fx(s, { mental: -3, network: 1 });
          lines.push("Tu tío respondió 'por las dudas lo reenvío'.");
        },
      },
      {
        label: "🔕 Silenciar el grupo por 1 año",
        run: (s, lines) => {
          fx(s, { mental: 4 });
          lines.push("Paz. Tranquilidad. 847 mensajes sin leer.");
        },
      },
    ],
  },

  curso_cripto: {
    title: "🪙 'Hacete rico con cripto'",
    text: "Un compañero de la secundaria te escribe después de 10 años: 'tengo una oportunidad de negocio para vos'.",
    options: [
      {
        label: "💸 Invertir 'un poquito'",
        run: (s, lines) => {
          if (chance(0.25)) {
            fx(s, { ars: price(s, 250000), mental: 5 });
            lines.push("¡Ganaste! Saliste justo antes de que el creador desapareciera con la plata.");
          } else {
            fx(s, { ars: -price(s, 150000), mental: -6 });
            lines.push("La moneda se llamaba 'MateCoin'. Ya no existe. Tu compañero tampoco te contesta.");
          }
        },
      },
      {
        label: "🚫 Clavarle el visto",
        run: (s, lines) => lines.push("Sabia decisión. Lo silenciaste y archivaste."),
      },
    ],
  },

  partido_seleccion: {
    title: "🇦🇷 Juega la Selección en horario laboral",
    text: "Octavos de final, 13 hs. Justo hay planning.",
    options: [
      {
        label: "📺 Ver el partido",
        run: (s, lines) => {
          fx(s, { mental: 15, xp: -1 });
          lines.push("¡Ganamos! Gritaste el gol con el micrófono abierto en una call con clientes de Suecia.");
        },
      },
      {
        label: "🧑‍💻 Quedarte en la planning",
        run: (s, lines) => {
          fx(s, { mental: -8, xp: 1 });
          lines.push("Seguiste el partido por los gritos del vecino. Te enteraste del gol 30 segundos tarde por el streaming.");
        },
      },
    ],
  },

  recruiter_linkedin: {
    title: "💼 Recruiter de LinkedIn",
    text: "'¡Hola! Vi tu perfil y creo que serías ideal para una posición con salario competitivo y excelente clima laboral 🚀🔥'",
    options: [
      {
        label: "🤝 Ir a la entrevista",
        desc: "Chance de oferta con +25% de sueldo.",
        run: (s, lines) => {
          fx(s, { energy: -5 });
          if (chance(0.45 + s.stats.network / 300)) {
            makeOffer(s, Math.min(s.level, 4), 1.25);
            s.queue.push("oferta");
            lines.push("Les encantaste. Te mandan una oferta.");
          } else {
            lines.push("'Buscamos un perfil más senior'. El puesto era Trainee.");
          }
        },
      },
      { label: "👀 Dejar en visto", run: (s, lines) => lines.push("Clásico.") },
    ],
  },

  asado_equipo: {
    title: "🥩 Asado del equipo",
    text: "El Tech Lead hace asado en su casa. Hay debate: ¿el chori va antes o después de la provoleta?",
    options: [
      {
        label: "🍷 Ir y llevar el vino",
        run: (s, lines) => {
          fx(s, { network: 6, mental: 6, ars: -price(s, 20000) });
          lines.push("Te ganaste al equipo con un Malbec. El asador te dio el primer chori: es un honor.");
        },
      },
      {
        label: "🛋️ Quedarte en casa",
        run: (s, lines) => {
          fx(s, { energy: 6, network: -2 });
          lines.push("El lunes hablaban de 'lo que pasó en el asado' y no entendiste nada.");
        },
      },
    ],
  },

  lumbalgia: {
    title: "🤕 Lumbalgia por mala postura",
    text: "Tu silla de cocina finalmente pasó factura. Te saca 2 días de productividad.",
    options: [
      {
        label: "🩺 Ir al kinesiólogo",
        run: (s, lines) => {
          fx(s, { energy: -15, xp: -1, ars: -price(s, 35000) });
          lines.push("'Tenés la columna de un señor de 80 años'. Comprate una silla decente.");
        },
      },
    ],
  },

  bebe_llorando: {
    title: "😭 Bebé llorando a las 4 AM",
    text: "Tenés una demo a las 9. El bebé tiene otros planes.",
    options: [
      {
        label: "🤱 Hacerlo upa y caminar por el living",
        run: (s, lines) => {
          fx(s, { energy: -15, mental: -3 });
          lines.push("Se durmió a las 6:40. Tu demo salió en piloto automático.");
        },
      },
    ],
  },

  cano_roto: {
    title: "🚿 Se rompió el caño del baño (semana de entrega)",
    text: "Es el sprint final y el baño es una pileta olímpica. El encargado del edificio 'pasa mañana'.",
    options: [
      {
        label: "🧰 Arreglarlo vos con alambre y YouTube",
        desc: "Perdés tiempo de estudio.",
        run: (s, lines) => {
          fx(s, { logic: -3, energy: -12 });
          lines.push("Quedó atado con alambre. Funciona. No lo toques. Es como el código legacy.");
        },
      },
      {
        label: "👷 Pagar un plomero matriculado",
        desc: "Tu balance queda en rojo.",
        run: (s, lines) => {
          fx(s, { ars: -price(s, 300000) });
          lines.push("'Esto lo hizo alguien con alambre, ¿no?'. Te cobró extra.");
        },
      },
    ],
  },
};

export const RANDOM_EVENTS = [
  // Argentinas
  { id: "paro_colectivos", weight: 2, when: () => true },
  { id: "paro_general", weight: 2, when: () => true },
  { id: "dolar_dispara", weight: 3, when: () => true },
  { id: "inflacion_record", weight: 2, when: () => true },
  { id: "chino_vencido", weight: 2, when: () => true },
  { id: "gato_mousepad", weight: 2, when: () => true },
  { id: "sube_sin_saldo", weight: 2, when: () => true },
  { id: "feriado_puente", weight: 2, when: () => true },
  { id: "vecino_taladro", weight: 2, when: () => true },
  { id: "corte_luz", weight: 2, when: () => true },
  { id: "tia_compu", weight: 2, when: () => true },
  { id: "grupo_familia", weight: 2, when: () => true },
  { id: "curso_cripto", weight: 1, when: () => true },
  { id: "partido_seleccion", weight: 1, when: () => true },
  { id: "arca_monotributo", weight: 2, when: (s) => !!s.job },
  { id: "tecnico_internet", weight: 2, when: (s) => !!s.job },
  { id: "lumbalgia", weight: 2, when: (s) => !s.inv.chair },
  { id: "cano_roto", weight: 2, when: (s) => s.housing === "solo" },
  { id: "bebe_llorando", weight: 3, when: (s) => s.kid },
  // IT
  { id: "meetup_trivia", weight: 2, when: () => true },
  { id: "stackoverflow_caido", weight: 1, when: () => true },
  { id: "hackathon", weight: 2, when: (s) => s.stats.logic >= 25 },
  { id: "caida_aws", weight: 2, when: (s) => !!s.job },
  { id: "ticket_capa8", weight: 2, when: (s) => !!s.job },
  { id: "bug_bash", weight: 2, when: (s) => !!s.job },
  { id: "merge_conflict", weight: 2, when: (s) => !!s.job },
  { id: "code_review", weight: 2, when: (s) => !!s.job && s.level >= 2 },
  { id: "en_mi_maquina_anda", weight: 2, when: (s) => !!s.job },
  { id: "dns_caido", weight: 2, when: (s) => !!s.job },
  { id: "deploy_viernes", weight: 2, when: (s) => !!s.job },
  { id: "estimacion", weight: 2, when: (s) => !!s.job },
  { id: "reunion_mail", weight: 2, when: (s) => !!s.job },
  { id: "asado_equipo", weight: 2, when: (s) => !!s.job },
  { id: "recruiter_linkedin", weight: 2, when: (s) => !!s.job && s.level >= 2 },
];
