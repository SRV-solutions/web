import { NIVELES_EXCEL, MODULOS_EXCEL, CLASES_EXCEL } from "./temarioExcel.js";

// Datos visuales de los cursos grabados con pago por Mercado Pago.
// El precio que se cobra realmente se define en netlify/lib/cursos.js
// (acá solo se muestra en pantalla y se usa para Meta Pixel; mantenerlos iguales).
// precioRegular es el precio que se muestra tachado. En las preventas es el de después de la fecha y en los
// combos, la suma de las partes. En los demás cursos es un precio de referencia que nunca se cobró: se sacó
// el 29/10/2026 por riesgo de publicidad engañosa (DNU 274/2019, arts. 10 y 11; Código Civil y Comercial,
// art. 1101) y Marcos decidió volver a mostrarlo el 31/10/2026, sabiendo ese riesgo. Durante el Cyber se
// reemplaza por el precio de lista real (ver más abajo).

// Preventa de Scratch: hasta esta fecha se vende a precio de preventa. El acceso a la carpeta de Drive
// llega al instante (vacía) y ese día se suben las clases.
// La misma fecha vive en netlify/lib/cursos.js.
const SCRATCH_ACCESO = new Date("2026-11-18T00:00:00-03:00");

// Preventa de Redes, Linux y AWS: igual que Scratch. Abrió el 30/10/2026; el 27/01/2027 se habilitan las 32
// clases y el 3/02/2027 los dos simulacros. Durante el Cyber vale la mitad de su precio de lista, como los demás.
// La misma fecha vive en netlify/lib/cursos.js y en appscript-cursos.gs.
const REDES_ACCESO = new Date("2027-01-27T00:00:00-03:00");

// Preventa del Master en Excel y Sheets con IA: igual que Redes. Hasta esta fecha se vende a precio de preventa,
// solo o en combo con Scripting, y ese día se habilitan las 255 clases. Decidido por Marcos el 6/11/2026.
// La misma fecha vive en netlify/lib/cursos.js y en appscript-cursos.gs, y su texto en src/data/legal.js.
const EXCEL_ACCESO = new Date("2027-01-01T00:00:00-03:00");
const EXCEL_FECHA_TEXTO = "1 de enero de 2027";
const EXCEL_EN_PREVENTA = Date.now() < EXCEL_ACCESO.getTime();

// Clases grabadas del Curso Fullstack con C# (12 módulos)
const CLASES_FULLSTACK = 30;

// CYBER SRV: del 2 al 4 de noviembre de 2026, todos los cursos grabados al 50% de su precio de lista
// (el Intensivo Full Stack en vivo no participa). Mismas fechas en netlify/lib/cursos.js (precio que
// se cobra), en appscript-cursos.gs (mínimo que acepta el webhook) y en PROMOCIONES de src/data/legal.js.
const CYBER_DESDE = Date.parse("2026-11-02T00:00:00-03:00");
const CYBER_HASTA = Date.parse("2026-11-05T00:00:00-03:00"); // termina el 4/11 a las 23:59
export const CYBER_FECHAS = "del 2 al 4 de noviembre";
export const enCyber = () => {
  const ahora = Date.now();
  return ahora >= CYBER_DESDE && ahora < CYBER_HASTA;
};

export const estaEnPreventa = (curso) => Boolean(curso?.preventa) && Date.now() < curso.preventa.hasta.getTime();

// Precio de una preventa en una línea (banners y tarjetas). Durante el Cyber el precio del Cyber vale solo
// esos días: no se puede decir que dura hasta el fin de la preventa.
export const textoPreventa = (curso) =>
  enCyber()
    ? `Cyber SRV: ${formatearPrecio(curso.precio)} solo ${CYBER_FECHAS}`
    : `En preventa a ${formatearPrecio(curso.precio)} hasta el ${curso.preventa.fechaTexto}`;

export const CURSOS_GRABADOS = {
  scratch: {
    key: "scratch",
    itemId: "curso-scratch-chicos", // mismo itemId que netlify/lib/cursos.js (content_ids de Meta)
    ruta: "scratch",
    contentName: "Infoproducto Scratch",
    tituloInicio: "Scratch para",
    tituloDestacado: "Chicos",
    tituloFin: "Desde Cero",
    descripcion:
      "14 clases grabadas para que chicos de 8 a 13 años aprendan a programar jugando con Scratch: en el primer módulo arman una historia animada y en el segundo, su primer videojuego con puntaje, vidas y niveles. Sin instalar nada.",
    precio: Date.now() < SCRATCH_ACCESO.getTime() ? 10000 : 18000,
    precioRegular: 18000,
    preventa: { hasta: SCRATCH_ACCESO, fechaTexto: "18 de noviembre", precio: 10000 },
    clases: 14,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Pensado para chicos de 8 a 13 años, sin experiencia previa",
      "Dos proyectos para mostrar: una historia animada y un videojuego",
      "Sin instalar nada: Scratch funciona gratis en el navegador",
      "Ideal para hacer en familia, a su ritmo",
    ],
    subTituloDesc:
      "Dos módulos cortos y prácticos: cada clase termina con algo que se ve y se puede jugar.",
    gancho: "Que deje de ser solo jugador: que cree sus propios juegos.",
    metaDescripcion: "Curso de Scratch para chicos de 8 a 13 años: 14 clases grabadas para crear una historia animada y su primer videojuego. Preventa a $10.000 hasta el 18 de noviembre.",
    nivel: "Desde cero · Para chicos de 8 a 13 años, sin experiencia previa",
    paraQuien: [
      "Tu hijo o hija pasa horas con videojuegos y querés que también aprenda a crearlos",
      "Tiene entre 8 y 13 años y nunca programó",
      "Buscás una actividad creativa para hacer en casa, sin pantallas pasivas",
      "Querés darle una base de lógica antes de pasar a un lenguaje de texto como Python",
    ],
    resultados: [
      "Crear historias animadas con personajes, diálogos, disfraces y sonidos",
      "Programar su primer videojuego con puntaje, vidas, enemigos y niveles",
      "Entender eventos, bucles, condicionales y variables jugando",
      "Compartir sus proyectos con la familia y la comunidad de Scratch",
    ],
    modulos: [
      {
        titulo: "Mis Primeros Proyectos: Historias Animadas",
        temas: [
          "Qué es Scratch, cómo crear la cuenta y recorrer el editor",
          "Escenario, personajes (sprites), disfraces y fondos",
          "Los primeros bloques: mover, girar, decir y pensar",
          "Eventos: bandera verde, teclas y clics sobre un personaje",
          "Repetir y por siempre: animaciones que no paran",
          "Sonidos, música y efectos visuales",
          "Proyecto: una historia animada con dos personajes que conversan",
        ],
      },
      {
        titulo: "Mi Primer Videojuego",
        temas: [
          "Condicionales y sensores: ¿está tocando el borde, un color, otro personaje?",
          "Variables: puntaje, vidas y temporizador",
          "Clones: enemigos y monedas que aparecen solos",
          "Mensajes entre personajes: enviar y recibir",
          "Pantallas de inicio, niveles y game over",
          "Proyecto final: tu propio juego de esquivar y atrapar",
          "Compartir el juego y jugar los de otros chicos",
        ],
      },
    ],
  },

  scripting: {
    key: "scripting",
    itemId: "curso-scripting",
    ruta: "scripting",
    contentName: "Infoproducto Scripting",
    // "con IA" va en el destacado para que figure en todos los nombres (home, listas, packs y Mercado Pago).
    // El Apps Script sigue con su nombre propio ("Curso de Scripting") en los mails: no se toca.
    tituloInicio: "Curso de",
    tituloDestacado: "Scripting con IA",
    tituloFin: "Desde Cero",
    descripcion:
      "Aprendé a programar desde cero con JavaScript, Python y Google Apps Script, y poné a la IA a trabajar en tus automatizaciones: 40 clases grabadas y más de 59 horas para automatizar planillas, mails, documentos y tareas repetitivas, consumir APIs y armar tus propios bots.",
    precio: 15000,
    precioRegular: 60000,
    clases: 40,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Módulo «Automatizá con IA»: 8 clases con guía de estudio, guía práctica y archivos para practicar",
      "Guía de estudio en PDF con 66 preguntas y sus respuestas",
      "Más de 59 horas de clases grabadas",
      "JavaScript, Python y Google Apps Script en un solo curso",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Ideal para arrancar de cero: aprendés la lógica de programación y la aplicás a automatizaciones reales, con IA incluida.",
    gancho: "Dejá de hacer a mano lo que el código y la IA hacen solos.",
    metaDescripcion: "Curso de Scripting con IA desde cero: programá con JavaScript, Python y Google Apps Script y automatizá con IA. 40 clases, más de 59 horas y acceso de por vida por $15.000.",
    nivel: "Desde cero · No necesitás saber nada de programación",
    paraQuien: ["Nunca programaste y querés arrancar sin pagar una fortuna", "Trabajás con planillas, mails o documentos y querés automatizar tareas repetitivas", "Querés probar si la programación es para vos antes de invertir en una carrera", "Necesitás una base sólida de lógica para después ir a Python o JavaScript"],
    resultados: ["Escribir programas en JavaScript y Python con variables, condicionales, bucles y funciones", "Automatizar Google Sheets, Docs, Gmail y Calendar con Apps Script", "Pedir datos a APIs reales, como la cotización del dólar", "Armar tu propio bot de Discord y tus primeros scripts útiles para el día a día", "Sumarle IA a tus automatizaciones: clasificar datos, responder mails y armar el resumen del día con n8n"],
    modulos: [
      {
        titulo: "Introducción, Entorno & Terminal",
        temas: [
          "Qué es programar y cómo piensa un programador",
          "Instalación de VS Code y Node.js",
          "Comandos básicos de la terminal y primeros pasos con Git",
        ],
      },
      {
        titulo: "JavaScript: Variables & Condicionales",
        temas: [
          "Variables, constantes y tipos de datos",
          "Template literals, typeof y conversión de tipos",
          "If, else if, operadores lógicos, tablas de verdad y ternario",
        ],
      },
      {
        titulo: "Arrays, Objetos & Bucles",
        temas: [
          "Arrays y sus métodos: push, shift, split, sort, forEach y filter",
          "Objetos, objetos anidados y arrays de objetos",
          "Bucles for, for...of y while, con break y continue",
        ],
      },
      {
        titulo: "Funciones & Programación Orientada a Objetos",
        temas: [
          "Funciones declaradas, arrow functions, parámetros y retorno",
          "Objetos nativos Date y Math",
          "Clases, herencia, JSON y módulos con require",
        ],
      },
      {
        titulo: "Asincronismo, APIs & Web",
        temas: [
          "Promesas, async / await y manejo de errores con try / catch",
          "Consumo de APIs con fetch y axios (cotización del dólar)",
          "Introducción a Express, HTML, CSS y eventos en el navegador",
        ],
      },
      {
        titulo: "Python desde Cero",
        temas: [
          "De JavaScript a Python: sintaxis, variables y condicionales",
          "Listas, tuplas, diccionarios y bucles",
          "Métodos de strings, f-strings y la librería datetime",
        ],
      },
      {
        titulo: "Python: Errores, Archivos & Bots",
        temas: [
          "Try / except y excepciones propias",
          "Lectura y escritura de archivos TXT y CSV, módulo os",
          "Juego 'Adivinar el número' y bot de Discord con Python",
        ],
      },
      {
        titulo: "Google Apps Script: Docs & Sheets",
        temas: [
          "Automatizar Google Docs: párrafos, formatos y menús personalizados",
          "Google Sheets: rangos, filas, columnas y funciones personalizadas",
          "Modularizar el código para reutilizarlo",
        ],
      },
      {
        titulo: "Google Apps Script: Gmail & Calendar",
        temas: [
          "Leer y filtrar la bandeja de entrada de Gmail",
          "Enviar mails automáticos desde un script",
          "Crear eventos en Google Calendar",
        ],
      },
      {
        // Módulo 15 de la carpeta (clases 33 a 40), sumado el 30/10/2026
        titulo: "Automatizá con IA",
        temas: [
          "Programar con IA y tu primera llamada a una API de IA",
          "Clasificar datos con IA y llevar la IA a Google Sheets",
          "IA en Gmail, herramientas y agentes",
          "Automatizar con n8n y proyecto: el resumen del día",
        ],
      },
    ],
  },

  python: {
    key: "python",
    itemId: "curso-python-infoproducto",
    ruta: "python",
    contentName: "Infoproducto Python Completo",
    tituloInicio: "Master en",
    tituloDestacado: "Python con IA",
    tituloFin: "Desde Cero",
    descripcion:
      "106 clases grabadas para aprender Python desde cero y usarlo con IA: lógica de programación, programación orientada a objetos, archivos, consumo de APIs, asincronismo, aplicaciones con interfaz gráfica (GUI) y automatizaciones con IA, de las salidas estructuradas a los agentes y el RAG.",
    precio: 80000,
    precioRegular: 450000,
    clases: 106,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Módulo «Automatizaciones con IA»: 8 clases con guía de estudio, guía práctica y archivos para practicar",
      "Estudiá a tu propio ritmo (100% grabado)",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Estructura práctica diseñada para llevarte desde las bases hasta proyectos profesionales con IA.",
    gancho: "El lenguaje de la IA y el más pedido del mundo, explicado desde la primera línea.",
    metaDescripcion: "Master en Python con IA desde cero: 106 clases grabadas de lógica, POO, APIs, asincronismo, apps con interfaz gráfica y automatizaciones con IA. Acceso de por vida.",
    nivel: "Desde cero · Ideal como primer lenguaje",
    paraQuien: ["Querés aprender el lenguaje más usado en automatización, datos e inteligencia artificial", "Empezás desde cero y buscás un curso completo, no videos sueltos", "Querés armar proyectos reales para tu portfolio", "Te interesa automatizar tareas o trabajar con datos"],
    resultados: ["Programar en Python con buenas prácticas, de la lógica a la POO", "Leer y escribir archivos, manejar errores y usar expresiones regulares", "Consumir APIs con requests y armar tu propio bot", "Crear apps de escritorio con interfaz gráfica: To Do List, generador de contraseñas y más", "Automatizar con IA desde Python: clasificar un CSV, resumir PDFs y armar un bot que responde sobre tus documentos"],
    modulos: [
      {
        titulo: "Introducción & Entorno de Trabajo",
        temas: [
          "Introducción a la programación y al curso",
          "Instalación y configuración de VS Code",
          "Nuestro primer 'Hola Mundo'",
        ],
      },
      {
        titulo: "Variables & Tipos de Datos",
        temas: [
          "Concepto y nomenclaturas de variables",
          "Tipos de datos primitivos y operadores aritméticos",
          "Manejo de TypeError y ejercicios prácticos",
        ],
      },
      {
        titulo: "Controladores de Flujo",
        temas: [
          "Operadores de comparación y lógicos",
          "Estructuras condicionales: IF, ELSE, IF-ELSE",
          "Resolución de ejercicios integradores",
        ],
      },
      {
        titulo: "Estructuras de Datos & Módulos Nativos",
        temas: [
          "Listas, matrices y tipos compuestos",
          "Métodos simples y manipulación de datos",
          "Módulos nativos: Date, Math, Random",
        ],
      },
      {
        titulo: "Estructuras Repetitivas & Funciones",
        temas: [
          "Bucles While y For + métodos avanzados de listas",
          "Funciones: Parámetros, retornos y Scope",
          "Algoritmos de ordenamiento (BubbleSort, Insertion, Selection)",
        ],
      },
      {
        titulo: "POO, Archivos & Expresiones Regulares",
        temas: [
          "Programación Orientada a Objetos (Clases, Encapsulación, Herencia, Polimorfismo)",
          "Manejo de errores con Try - Except",
          "Lectura, escritura de archivos y Regex",
        ],
      },
      {
        titulo: "APIs, Requests & Asincronismo",
        temas: [
          "Promesas y peticiones HTTP",
          "¿Qué es una API y cómo consumirla?",
          "Librería Requests y proyecto Bot",
        ],
      },
      {
        titulo: "Apps con Interfaz Gráfica (GUI) & Extra",
        temas: [
          "Introducción a Tkinter para Interfaces",
          "Desarrollo de App 'Adivinar el Número'",
          "Desarrollo de 'To Do List' y 'Password App'",
          "Modularización y cierre del curso",
        ],
      },
      {
        // Módulo 09 de la carpeta (clases 99 a 106), sumado el 30/10/2026
        titulo: "Automatizaciones con IA",
        temas: [
          "Python + IA: trabajar con un asistente y tu propio cliente de IA con requests",
          "Salidas estructuradas para clasificar un CSV y resumir PDFs",
          "El informe que se escribe solo, asincronismo y agentes",
          "RAG: preguntas sobre tus documentos, y proyecto: el bot de tus documentos",
        ],
      },
    ],
  },

  // Ex "Backend Fundamentos". La clave y el itemId NO se cambian: el Apps Script que entrega los accesos
  // identifica el curso por el external_reference "fundamentos-backend:..." de cada pago.
  "fundamentos-backend": {
    key: "fundamentos-backend",
    itemId: "curso-fundamentos-backend",
    ruta: "ruta-backend", // se vende en la página única de la ruta backend (selector)
    contentName: "Infoproducto Master en JavaScript",
    tituloInicio: "Master en",
    tituloDestacado: "JavaScript",
    tituloFin: "Desde Cero",
    descripcion:
      "90 clases grabadas para dominar JavaScript desde cero con Node.js: lógica, estructuras de datos, POO, promesas, consumo de APIs reales, bots y testing. El lenguaje de la web, aprendido de verdad.",
    precio: 84900,
    precioRegular: 350000,
    clases: 90,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Guía de estudio en PDF con 109 preguntas y sus respuestas",
      "Estudiá a tu propio ritmo (100% grabado)",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "De tu primer 'Hola mundo' a tu primer bot y APIs reales: el JavaScript que te piden en cualquier entrevista.",
    gancho: "JavaScript de verdad: de 'Hola mundo' a bots y APIs reales.",
    metaDescripcion: "Master en JavaScript Desde Cero: 90 clases grabadas de JavaScript y Node.js. Lógica, POO, promesas, APIs, bots y testing, con guía de estudio de 109 preguntas.",
    nivel: "Desde cero · La base para backend, frontend o automatización",
    paraQuien: ["Querés aprender JavaScript de verdad, más allá de copiar código", "Nunca programaste y querés arrancar con el lenguaje que mueve la web", "Sabés algo de programación pero te faltan bases sólidas", "Te estás preparando para tus primeras entrevistas técnicas"],
    resultados: ["Dominar JavaScript: variables, funciones, arrays, objetos y clases", "Resolver ejercicios de lógica y algoritmos de ordenamiento", "Trabajar con promesas, async/await y APIs reales", "Escribir tests con Jest y armar bots con Node.js"],
    modulos: [
      {
        titulo: "Primeros Pasos",
        temas: [
          "VS Code, Git Bash y Node.js",
          "La terminal: moverte y crear carpetas",
          "Tu primer programa con Node.js",
        ],
      },
      {
        titulo: "Variables & Tipos de Datos",
        temas: [
          "var, let, const y scope",
          "Tipos primitivos y operadores aritméticos",
          "Template literals y convenciones de nombres",
        ],
      },
      {
        titulo: "Controladores de Flujo",
        temas: [
          "Comparación estricta (== vs ===)",
          "Operadores lógicos &&, || y !",
          "if, else if, else y operador ternario",
        ],
      },
      {
        titulo: "Estructuras de Datos",
        temas: [
          "Objetos y arrays",
          "Métodos de strings y arrays",
          "Object.keys, values y entries",
        ],
      },
      {
        titulo: "Módulos",
        temas: [
          "require/module.exports vs import/export",
          "Archivos con fs y rutas con path",
          "El objeto Math",
        ],
      },
      {
        titulo: "Estructuras Repetitivas",
        temas: [
          "while, do while y for",
          "forEach, map, filter y reduce",
          "Recorrer objetos con for...in",
        ],
      },
      {
        titulo: "Funciones",
        temas: [
          "Parámetros, argumentos y return",
          "Funciones flecha y retorno implícito",
          "Devolver vs mostrar por consola",
        ],
      },
      {
        titulo: "Algoritmos de Ordenamiento",
        temas: [
          "Bubble sort",
          "Insertion sort y selection sort",
          "El método sort() con números y textos",
        ],
      },
      {
        titulo: "Programación Orientada a Objetos",
        temas: [
          "Clases, constructor, this y métodos",
          "Herencia con extends y super",
          "Encapsulamiento (#privado) y static",
        ],
      },
      {
        titulo: "Manejo de Errores",
        temas: [
          "Tipos de errores de JavaScript",
          "try, catch y finally",
          "throw y errores personalizados",
        ],
      },
      {
        titulo: "Expresiones Regulares",
        temas: [
          "Qué es una regex y cómo probarla",
          "Símbolos y patrones más comunes",
          "Validar un email",
        ],
      },
      {
        titulo: "Promesas",
        temas: [
          "Código asincrónico y estados de una promesa",
          "then/catch y async/await",
          "Promise.all",
        ],
      },
      {
        titulo: "Bots, Librerías & Testing",
        temas: [
          "npm, package.json y librerías confiables",
          "Bot de WhatsApp y bot de trading",
          "Testing con Jest",
        ],
      },
      {
        titulo: "Ejercicios de Lógica",
        temas: [
          "Recrear push, pop, unshift y shift",
          "Fibonacci, números primos y palíndromos",
          "Pensar un problema paso a paso",
        ],
      },
      {
        titulo: "Modularización & APIs",
        temas: [
          "Modularizar con clases y métodos estáticos",
          "Peticiones con Axios y fetch",
          "APIs de Rick and Morty y de GitHub",
        ],
      },
    ],
  },

  "backend-avanzado": {
    key: "backend-avanzado",
    itemId: "curso-backend-avanzado",
    ruta: "ruta-backend", // se vende en la página única de la ruta backend (selector)
    contentName: "Infoproducto Backend Avanzado",
    tituloInicio: "Backend",
    tituloDestacado: "Avanzado",
    tituloFin: "",
    descripcion:
      "73 clases grabadas, la continuación del Master en JavaScript: creá tus propios servidores y APIs REST con Node.js y Express, middlewares, sockets en tiempo real, rate limit, testing y Docker.",
    precio: 99900,
    precioRegular: 420000,
    clases: 73,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Guía de estudio en PDF con 62 preguntas y sus respuestas",
      "5 proyectos prácticos de servidores",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Todo lo que necesitás para construir servicios web profesionales y llevarlos a producción.",
    gancho: "Creá tus propios servidores y APIs como en una empresa real.",
    metaDescripcion: "Backend Avanzado: 73 clases grabadas de Node.js y Express. APIs REST, middlewares, sockets, rate limit, testing y Docker, con guía de estudio.",
    nivel: "Nivel intermedio · Recomendado después del Master en JavaScript",
    paraQuien: ["Ya sabés JavaScript y querés dar el salto a crear servidores", "Terminaste el Master en JavaScript y querés seguir la ruta", "Querés entender cómo funcionan las APIs que consumís todos los días", "Buscás proyectos de backend para tu portfolio"],
    resultados: ["Crear APIs REST completas con Node.js y Express", "Proteger rutas con middlewares, tokens y rate limit", "Armar un chat en tiempo real con Socket.IO", "Probar tu servidor y empaquetarlo con Docker"],
    modulos: [
      {
        titulo: "Node.js, npm & npx",
        temas: [
          "Comandos de Linux para la terminal",
          "npm, package.json y scripts propios",
          "Qué es npx y para qué sirve",
        ],
      },
      {
        titulo: "Servidores con Express",
        temas: [
          "Web services y APIs REST",
          "Métodos HTTP y CRUD",
          "Tu primer servidor y Postman",
        ],
      },
      {
        titulo: "Servidores II",
        temas: [
          "app.use, next y callbacks",
          "Request y response",
          "Status codes",
        ],
      },
      {
        titulo: "Request & Response",
        temas: [
          "req.params, req.query y req.body",
          "Parseo de datos",
          "res.send, res.json y res.sendStatus",
        ],
      },
      {
        titulo: "Middlewares",
        temas: [
          "Rutas y controladores",
          "Middlewares isAdmin e isAuth con tokens",
          "Webhooks",
        ],
      },
      {
        titulo: "Protocolos & Redes",
        temas: [
          "HTTP/HTTPS, TCP y UDP",
          "Modelos OSI y TCP/IP",
          "Dirección IP y DNS",
        ],
      },
      {
        titulo: "Sockets",
        temas: [
          "Comunicación en tiempo real",
          "Un chat con Socket.IO",
          "WebSocket vs Socket.IO",
        ],
      },
      {
        titulo: "Ejercicios de Servidores",
        temas: [
          "API de tareas (CRUD completo)",
          "Registro y login con JWT y bcrypt",
          "Gestor de archivos, chat con imágenes y comentarios anidados",
        ],
      },
      {
        titulo: "Módulo Extra",
        temas: [
          "Archivos con Multer y rate limit",
          "Pilas, colas y un encolador de tareas",
          "Tests de estrés, coverage y Docker",
        ],
      },
    ],
  },

  // Curso Fullstack con C#: API en .NET, base PostgreSQL y front en React con Vite (los 12 módulos de la guía).
  // Tiene un código para alumnos de SRV con precio especial: el código NO está en el código fuente,
  // el servidor valida su hash (netlify/lib/cupones.js) y es el servidor quien fija el precio.
  // Acá solo se marca que el curso acepta código (bloque "¿Sos alumno de SRV?" en la página).
  "fullstack-csharp": {
    key: "fullstack-csharp",
    itemId: "curso-fullstack-csharp",
    ruta: "fullstack-csharp",
    contentName: "Infoproducto Fullstack C#",
    tituloInicio: "Curso",
    tituloDestacado: "Fullstack",
    tituloFin: "con C# y React",
    descripcion:
      "30 clases grabadas para construir una aplicación completa de punta a punta: una API en .NET con C#, una base de datos PostgreSQL y un front en React con Vite. 12 módulos con teoría paso a paso, 21 ejercicios resueltos y un proyecto final tipo Instagram, más una guía de estudio con 80 preguntas para ponerte a prueba.",
    precio: 87900,
    precioRegular: 390000,
    clases: CLASES_FULLSTACK,
    cuponAlumnos: true,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Guía de estudio en PDF: 12 módulos, 21 ejercicios resueltos, 13 curiosidades y 80 preguntas con respuestas",
      "Proyecto final completo: app tipo Instagram con API .NET, PostgreSQL y React",
      "Un stack muy pedido por las empresas: C#, .NET, PostgreSQL y React",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Primero dominás C# y la POO, después construís la API y la base, y al final conectás todo con React.",
    gancho: "De tu primer 'Hola mundo' en C# a una app completa tipo Instagram.",
    metaDescripcion:
      "Curso Fullstack grabado: 30 clases de API en .NET con C#, PostgreSQL y React con Vite. 12 módulos, 21 ejercicios resueltos, proyecto final tipo Instagram y guía de estudio con 80 preguntas. Acceso de por vida.",
    nivel: "Desde cero en C# · Hasta tu primera app fullstack",
    paraQuien: [
      "Querés trabajar como desarrollador fullstack con un stack que piden las empresas: C#, .NET, PostgreSQL y React",
      "Ya hiciste Scripting, Python o JavaScript y querés dar el salto a una aplicación completa",
      "Preferís aprender construyendo: el curso termina con una app tipo Instagram funcionando",
      "Te estás preparando para entrevistas técnicas de .NET o fullstack",
    ],
    resultados: [
      "Programar en C# con programación orientada a objetos: clases, herencia, interfaces y manejo de errores",
      "Crear una API REST con .NET (Minimal API) con un CRUD completo y los códigos HTTP correctos",
      "Diseñar una base en PostgreSQL con claves foráneas, JOIN y consultas con parámetros seguras",
      "Armar el front en React con Vite: componentes, estado, efectos, rutas y Axios",
      "Conectar todo el stack (CORS incluido) y levantar tu propia app tipo Instagram",
    ],
    modulos: [
      { titulo: "Primeros pasos", temas: ["Qué hace el frontend, el backend y la base de datos", "Cómo viaja un pedido desde el navegador hasta la base", "Instalar .NET, Node.js, PostgreSQL y VS Code", "Terminal, puertos y estructura de un proyecto fullstack"] },
      { titulo: "C# desde cero", temas: ["Tu primer programa de consola", "Tipos de datos, arrays y listas", "Condicionales, ternario y bucles", "Funciones, LINQ y lambdas"] },
      { titulo: "Clases, objetos y encapsulamiento", temas: ["Clase, objeto y modificadores de acceso", "Propiedades con get y set que validan", "Constructores, sobrecarga y encadenamiento con this", "Constantes, métodos privados y objetos que se comunican"] },
      { titulo: "Herencia, abstracción y polimorfismo", temas: ["Heredar de una clase padre con base", "Clases y métodos abstractos con override", "La diferencia entre virtual y abstract", "Polimorfismo y los cuatro pilares de la POO"] },
      { titulo: "Interfaces", temas: ["Definir e implementar una interfaz", "Varias interfaces a la vez", "Interfaz vs clase abstracta", "Métodos por defecto, miembros estáticos y eventos"] },
      { titulo: "Manejo de errores", temas: ["Qué es una excepción y por qué corta el programa", "try, catch y finally en orden", "Lanzar errores con throw y excepciones personalizadas", "Filtros con when y errores HTTP en la API"] },
      { titulo: "Tu primera API con .NET", temas: ["Qué es una API REST y cómo se comunica", "Minimal API con dotnet y cómo cambiar el puerto", "Verbos HTTP y códigos de estado", "CRUD completo en memoria y pruebas con Thunder Client"] },
      { titulo: "PostgreSQL y SQL", temas: ["Entrar a psql y moverte con sus comandos", "Crear base y tablas con claves primarias y foráneas", "El CRUD en SQL: INSERT, SELECT, UPDATE y DELETE", "Combinar tablas con JOIN, contar y agrupar"] },
      { titulo: "API + PostgreSQL + CORS", temas: ["Instalar Npgsql e inyección de dependencias", "Los tres métodos para ejecutar SQL", "Consultas con parámetros: cómo evitar la inyección SQL", "El CRUD contra PostgreSQL y CORS en el orden correcto"] },
      { titulo: "React desde cero", temas: ["Crear y levantar un proyecto con Vite", "Componentes, JSX y props", "useState, formularios controlados y useEffect", "Listas con key, condicionales y React Router"] },
      { titulo: "Conectar front y back con Axios", temas: ["Instancia de Axios con la URL de la API", "GET dentro de useEffect con carga y errores", "POST, PUT y DELETE desde formularios y botones", "res.data, res.status, camelCase y el recorrido completo de un pedido"] },
      { titulo: "Proyecto final: app tipo Instagram", temas: ["Planificar pantallas y endpoints antes de programar", "La base con datos de prueba y los modelos de la API", "Las pantallas de React, ruta protegida y cómo se conectan", "Levantar todo en orden y extras: carrusel, likes y comentarios"] },
    ],
  },

  // Redes, Linux y AWS: curso grabado en preventa hasta el 27/01/2027 (ver REDES_ACCESO). Es la página de la
  // campaña: mientras dura la preventa, los cursos que se le suman tienen precio fijo (SUMA_CON_REDES en packs.js).
  // El objetivo del curso es que el alumno pueda rendir AWS Certified Cloud Practitioner (CLF-C02). El examen
  // lo toma y lo cobra AWS: la página lo aclara (preguntasExtra) para que nadie entienda que está incluido.
  // Temario: el cronograma de la cursada (REDES\guias-redes\contenido\cronograma.py), clases 1 a 32. El 27/01 se
  // habilitan esas 32 (27 en vivo con su video resumen y 5 TP asincrónicos) y el 3/02 los dos simulacros (clases
  // 33 y 34). El proyecto final y las presentaciones (35 y 36) son de la cursada en vivo y no se prometen acá.
  redes: {
    key: "redes",
    itemId: "curso-redes-linux-aws", // mismo itemId que netlify/lib/cursos.js (content_ids de Meta)
    ruta: "redes",
    contentName: "Infoproducto Redes Linux AWS",
    tituloInicio: "Redes, Linux y",
    tituloDestacado: "AWS",
    tituloFin: "",
    descripcion:
      "Preparate para rendir la certificación AWS Certified Cloud Practitioner (CLF-C02) con las bases que pide el trabajo en cloud y DevOps: redes desde cero con Cisco Packet Tracer, Linux con Ubuntu Server y AWS con práctica real. 32 clases, la guía de cada una en PDF y dos simulacros del examen.",
    precio: Date.now() < REDES_ACCESO.getTime() ? 62900 : 89900,
    precioRegular: 89900,
    preventa: { hasta: REDES_ACCESO, fechaTexto: "27 de enero de 2027", precio: 62900 },
    clases: 32,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Preparación para rendir AWS Certified Cloud Practitioner (CLF-C02), con los cuatro dominios del examen",
      "27 clases grabadas en vivo, cada una con su video resumen animado, y 5 trabajos prácticos guiados",
      "La guía de cada clase en PDF",
      "Dos simulacros del examen (65 preguntas en 90 minutos), que se suman el 3 de febrero de 2027",
      "Práctica real en AWS con la capa gratuita",
    ],
    subTituloDesc:
      "Primero entendés cómo funciona una red y la armás con equipos Cisco; después administrás un servidor Ubuntu, y al final llevás todo a AWS siguiendo los cuatro dominios del examen Cloud Practitioner.",
    gancho: "Tu primera certificación de AWS, con las bases de redes y Linux que la hacen fácil.",
    metaDescripcion:
      "Curso grabado para rendir AWS Certified Cloud Practitioner (CLF-C02): 32 clases de redes con Cisco, Linux con Ubuntu Server y AWS con práctica real, guías en PDF y dos simulacros del examen. Preventa a $62.900 hasta el 27 de enero de 2027, cuando se habilitan las clases.",
    nivel: "Desde cero en redes y Linux · Hasta rendir AWS Cloud Practitioner",
    requisitos:
      "No. Redes y Linux arrancan desde cero y no hace falta programar. Necesitás una computadora donde instalar programas gratuitos (Cisco Packet Tracer y VirtualBox). Para practicar en AWS vas a crear tu propia cuenta: trabajamos con la capa gratuita y en la primera clase de AWS configurás una alerta de presupuesto para evitar cargos.",
    paraQuien: [
      "Querés tu primera certificación de AWS para sumar a tu CV y a LinkedIn",
      "Trabajás en soporte o mesa de ayuda y querés dar el salto a cloud e infraestructura",
      "Ya programás y querés entender dónde y cómo corre tu código",
      "Querés orientarte a DevOps o cloud, uno de los perfiles que más crece",
    ],
    resultados: [
      "Llegar preparado al examen AWS Certified Cloud Practitioner (CLF-C02), sabiendo qué servicio elegir en cada caso",
      "Entender cómo viaja la información: modelos OSI y TCP/IP, direcciones IP, máscaras, DHCP y DNS",
      "Configurar switches y routers Cisco por consola, con VLANs",
      "Administrar un servidor Ubuntu: usuarios, permisos, servicios, Nginx y SSH con claves",
      "Publicar en AWS un sitio con dominio y HTTPS, una app en contenedores y un pipeline que despliega solo",
    ],
    // Aclaraciones propias de este curso: se suman a las preguntas frecuentes de la página
    preguntasExtra: [
      {
        q: "¿Qué incluye el curso y cuándo está cada cosa?",
        a: "El 27 de enero de 2027 se habilitan las 32 clases: 27 grabadas en vivo, cada una con su video resumen animado, y 5 trabajos prácticos guiados, todas con su guía en PDF. El 3 de febrero de 2027 se suman los dos simulacros del examen: 65 preguntas en 90 minutos, como el examen real, y cómo anotarte para rendirlo.",
      },
      {
        q: "¿El curso incluye el examen de AWS?",
        a: "No. El curso te prepara para rendir AWS Certified Cloud Practitioner (CLF-C02), pero el examen lo toma y lo cobra AWS, aparte del curso. Se rinde en español, online o en un centro de Pearson VUE, y te explicamos paso a paso cómo anotarte. WEARESRV no es un centro oficial de AWS. Además, al terminar el curso podés rendir nuestro examen final en vivo y obtener el certificado verificable de WEARESRV, sin costo extra.",
      },
    ],
    modulos: [
      {
        titulo: "Fundamentos: servidores y redes",
        temas: [
          "Servidores y entorno de trabajo: la terminal, Git Bash, permisos, Nano y tu primer script",
          "Fundamentos de redes: componentes, topologías, protocolos, modelos OSI y TCP/IP",
          "La dirección IP: binario, privada y pública, máscara, puerta de enlace y DNS",
          "Packet Tracer en acción: switch y PCs, DHCP, DNS y un servidor web",
        ],
      },
      {
        titulo: "Redes con Cisco",
        temas: [
          "La consola de Cisco: modos del IOS, comandos show, contraseñas y guardar la configuración",
          "Cómo aprende un switch: tabla MAC, broadcast y ARP",
          "Tu red desde cero y un switch protegido con IP de gestión",
          "El router por consola y VLANs con puertos de acceso y troncales 802.1Q",
        ],
      },
      {
        titulo: "Linux con Ubuntu Server",
        temas: [
          "Ubuntu Server en VirtualBox: red, usuarios, sudo, apt y SSH desde tu PC",
          "TP: usuarios, grupos, permisos, carpetas compartidas y paquetes",
          "TP: procesos, servicios y logs con ps, top, systemctl y journalctl",
          "Servicios: Nginx, SSH con claves y el firewall ufw",
        ],
      },
      {
        titulo: "AWS: la nube, IAM, VPC y EC2",
        temas: [
          "La nube y AWS: IaaS, PaaS y SaaS, regiones y zonas, capa gratuita y alertas de presupuesto",
          "IAM y la responsabilidad compartida: usuarios, grupos, políticas, roles y MFA",
          "VPC: subredes públicas y privadas, NAT Gateway, security groups y NACL",
          "EC2: tu Ubuntu en la nube y los modelos de precio; TP: tu servidor en AWS",
        ],
      },
      {
        titulo: "AWS: almacenamiento y formas de publicar",
        temas: [
          "S3, EBS y EFS: buckets, clases de almacenamiento y sitio estático",
          "Route 53, Certificate Manager y CloudFront: tu sitio con dominio y HTTPS",
          "Contenedores con ECS y Fargate, y serverless con Lambda, API Gateway, SQS y SNS",
          "Amplify, Elastic Beanstalk y Lightsail, y CI/CD con CodePipeline",
        ],
      },
      {
        titulo: "AWS: bases de datos, arquitectura y seguridad",
        temas: [
          "Bases de datos: RDS, Aurora, DynamoDB y ElastiCache",
          "TP: un pipeline que despliega solo y tu app con su base de datos",
          "Alta disponibilidad: Load Balancer, Auto Scaling, multi-AZ y Well-Architected",
          "Monitoreo y seguridad: CloudWatch, CloudTrail, CloudFormation, KMS, WAF, GuardDuty y más",
        ],
      },
      {
        titulo: "Costos, soporte y el examen",
        temas: [
          "Pricing Calculator, Cost Explorer, Budgets y planes de soporte",
          "Marketplace, migración y servicios de IA como Amazon Q",
          "Los cuatro dominios del CLF-C02 y en qué clase se ve cada uno",
          "Dos simulacros del examen y cómo anotarte: se suman el 3 de febrero de 2027",
        ],
      },
    ],
  },

  // Master en Excel y Sheets con IA: curso grabado en preventa hasta el 1/01/2027 (ver EXCEL_ACCESO). Es para
  // gente que no programa: por eso lleva requisitos propios y las secciones de BloquesCurso.jsx.
  // Lo que dice sobre versiones y planes se revisó en las páginas de Microsoft y Google en noviembre de 2026.
  excel: {
    key: "excel",
    itemId: "curso-excel-sheets", // mismo itemId que netlify/lib/cursos.js (content_ids de Meta)
    ruta: "excel",
    contentName: "Infoproducto Excel y Sheets con IA",
    tituloInicio: "Master en",
    tituloDestacado: "Excel y Sheets con IA",
    tituloFin: "Desde Cero",
    descripcion:
      `Todo Excel y Google Sheets en un solo curso: ${CLASES_EXCEL} clases y más de 80 horas de video para ir de tu primera fórmula a Power Query, tablas dinámicas, tableros, macros, VBA y Google Apps Script, con IA para trabajar más rápido y casos reales de Argentina.`,
    precio: EXCEL_EN_PREVENTA ? 59900 : 89900,
    precioRegular: 89900,
    preventa: { hasta: EXCEL_ACCESO, fechaTexto: EXCEL_FECHA_TEXTO, precio: 59900 },
    clases: CLASES_EXCEL,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      `${CLASES_EXCEL} clases y más de 80 horas de video, de cero a nivel experto`,
      "Excel, Google Sheets, Apps Script e IA en un solo curso",
      "Archivos de práctica y 9 proyectos para mostrar",
      "Casos argentinos: IVA con comprobantes de ARCA, sueldos, aguinaldo, bancos y Mercado Pago",
      "Dos simulacros orientados al examen Microsoft MO-210 (el examen se paga aparte)",
    ],
    subTituloDesc:
      "Nueve niveles en orden: cada uno se apoya en el anterior y podés saltear lo que ya sabés. Tocá un nivel para ver sus módulos.",
    gancho: "De tu primera fórmula a automatizar tus planillas con Apps Script e IA.",
    metaDescripcion:
      `Master en Excel y Google Sheets con IA desde cero: ${CLASES_EXCEL} clases, más de 80 horas, Power Query, VBA y Apps Script. Preventa a $59.900 hasta el ${EXCEL_FECHA_TEXTO}.`,
    nivel: "Desde cero · Hasta nivel experto",
    requisitos:
      "No. El curso arranca desde cero: ni siquiera hace falta haber abierto Excel. En VBA y Apps Script te enseñamos la lógica que necesitás. Para los primeros niveles alcanza con Excel para la web o Google Sheets, que son gratis; para Power Query, Power Pivot, macros y VBA necesitás Excel de escritorio. En esta página tenés el detalle por nivel.",
    paraQuien: [
      "Trabajás con planillas y perdés horas en tareas que deberían salir solas",
      "Arrancás de cero o sabés lo básico y querés llegar a nivel avanzado sin comprar un curso por nivel",
      "Buscás trabajo en administración, ventas, recursos humanos, finanzas o logística",
      "Tenés una pyme y querés controlar ventas, stock, caja y cobranzas",
      "Usás Google Sheets en tu trabajo y querés sacarle mucho más provecho",
    ],
    resultados: [
      "Armar planillas prolijas y confiables, con fórmulas, tablas y validaciones",
      "Cruzar bases con BUSCARX, resumir miles de filas con tablas dinámicas y presentar tableros",
      "Limpiar datos de ARCA, bancos y Mercado Pago con Power Query y actualizarlos con un clic",
      "Automatizar Excel con macros y VBA, y Google Sheets con Apps Script",
      "Usar IA para escribir fórmulas y analizar datos, sabiendo verificar lo que responde",
    ],
    // Secciones propias de este curso: las dibuja src/components/Courses/BloquesCurso.jsx
    cifras: [
      { valor: String(CLASES_EXCEL), rotulo: "clases" },
      { valor: "+80", rotulo: "horas de video" },
      { valor: String(MODULOS_EXCEL.length), rotulo: "módulos" },
      { valor: "9", rotulo: "proyectos" },
    ],
    dato: {
      texto:
        "Excel es la cuarta habilidad técnica más pedida en ZonaJobs: aparece en 3.565 de los 18.959 avisos relevados entre marzo y julio de 2026.",
      fuente: "Informe de la Cámara Argentina para la Formación Profesional, en Forbes Argentina",
      url: "https://www.forbesargentina.com/liderazgo/que-trabajos-buscan-hoy-empresas-argentinas-cuales-son-habilidades-mas-requeridas-n95419/amp",
    },
    pilares: [
      { titulo: "Excel", texto: "Fórmulas, tablas dinámicas, gráficos, Power Query, Power Pivot, tableros, macros y VBA." },
      { titulo: "Google Sheets", texto: "QUERY, IMPORTRANGE, trabajo en equipo, Looker Studio y una app sin código con AppSheet." },
      { titulo: "Apps Script", texto: "Mails, presupuestos en PDF, avisos de vencimientos y cotización del dólar, todo desde tu planilla." },
      { titulo: "IA", texto: "Pedir y explicar fórmulas con un chat gratis, y qué aportan Copilot y Gemini." },
    ],
    niveles: NIVELES_EXCEL,
    novedades: {
      titulo: "Actualizado a noviembre de 2026",
      intro: "El temario ya incluye lo último que sumaron Microsoft y Google:",
      items: [
        { titulo: "Copilot en Excel", texto: "Agent Mode, la habilidad que encuentra y corrige datos sucios, y cómo crear habilidades propias." },
        { titulo: "Gemini en Sheets", texto: "Armar o editar una planilla entera con un pedido en español, corregir fórmulas y completar columnas citando sus fuentes." },
        { titulo: "Funciones modernas", texto: "BUSCARX, FILTRAR, LET, LAMBDA, AGRUPARPOR, PIVOTARPOR y las funciones REGEX." },
        { titulo: "Apps Script", texto: "Conectar tus planillas con una IA desde el código, con las opciones que Google sumó en 2026." },
      ],
      nota:
        "Copilot y Gemini necesitan planes pagos de Microsoft o Google, y cambian seguido. No hace falta pagarlos para hacer el curso: esas clases sirven como demostración y el resto de la IA se trabaja con un chat gratis.",
    },
    requisitosPorNivel: [
      { nivel: "Niveles 1 y 2", necesitas: "Excel para la web, gratis con una cuenta de Microsoft, o Google Sheets: alcanzan para practicar casi todo." },
      { nivel: "Nivel 3", necesitas: "BUSCARX y FILTRAR piden Excel 2021, 2024 o Microsoft 365. LAMBDA, Excel 2024 o Microsoft 365. AGRUPARPOR y PIVOTARPOR, Microsoft 365. También vemos cómo resolverlo en versiones anteriores." },
      { nivel: "Nivel 4", necesitas: "Power Query viene en Excel para Windows desde 2016 y en Microsoft 365 para Mac, con menos orígenes de datos. Power Pivot y Power BI Desktop necesitan Windows." },
      { nivel: "Nivel 5", necesitas: "Las macros y VBA necesitan Excel de escritorio: no corren en el navegador. Office Scripts y Python en Excel dependen del plan de Microsoft y se ven como demostración." },
      { nivel: "Niveles 6 y 7", necesitas: "Una cuenta de Google gratis." },
      { nivel: "Nivel 8", necesitas: "Un chat de IA gratis. Copilot y Gemini dentro de la planilla necesitan un plan pago y se ven como demostración." },
    ],
    siguientePaso: {
      titulo: "Y cuando termines, seguí con Scripting",
      texto:
        "En este curso aprendés Apps Script con la lógica justa para automatizar tus planillas. Si después querés programar de verdad, el Curso de Scripting con IA sigue desde ahí: JavaScript, Python, APIs, bots y agentes con n8n.",
      curso: "scripting",
    },
    preguntasExtra: [
      {
        q: "¿Qué incluye el curso y cuándo está?",
        a: `El ${EXCEL_FECHA_TEXTO} se habilitan en tu carpeta de Google Drive las ${CLASES_EXCEL} clases, con más de 80 horas de video, los archivos de práctica y los 9 proyectos. Hasta ese día la carpeta está vacía, y es normal.`,
      },
      {
        q: "¿Por qué Excel y Google Sheets en el mismo curso?",
        a: "Porque los avisos piden Excel, pero en muchos trabajos se usa Sheets, y la mayoría de las funciones se usan igual. Aprendés cada tema en Excel, te mostramos las diferencias importantes con Sheets y hay un nivel entero con lo propio de Sheets.",
      },
      {
        q: "¿Tengo que pagar Copilot o Gemini?",
        a: "No. El curso se puede hacer completo sin esos planes: la IA se trabaja con un chat gratis, y las clases de Copilot y Gemini te muestran qué agregan para que decidas si te conviene pagarlos.",
      },
      {
        q: "¿Qué diferencia hay con el Curso de Scripting con IA?",
        a: "Este curso enseña planillas, y Apps Script aplicado a ellas. Scripting enseña a programar: JavaScript, Python, APIs, bots y agentes con n8n. Se complementan y podés llevarlos en combo.",
      },
      {
        q: "¿El curso incluye una certificación de Microsoft?",
        a: "No. Incluye dos simulacros orientados al examen Microsoft Office Specialist: Excel Associate (MO-210) y te explicamos cómo anotarte. El examen se paga aparte, su precio depende del país y se puede rendir en español. Microsoft recomienda llegar con unas 150 horas de formación y práctica. WEARESRV no es un centro oficial ni está afiliado a Microsoft ni a Google. Además, al terminar podés rendir nuestro examen final en vivo y obtener el certificado verificable de WEARESRV, sin costo extra.",
      },
    ],
    modulos: MODULOS_EXCEL,
  },
};

export const formatearPrecio = (valor) => `$${valor.toLocaleString("es-AR")}`;

// ---------- COMBO: Ruta Backend Completa (Master en JavaScript + Backend Avanzado) ----------
// Es LA página de la ruta backend (/ruta-backend/inscripcion): con un selector se compra el Master en
// JavaScript solo, Backend Avanzado solo, o los dos juntos (este combo). El Apps Script comparte las
// dos carpetas de Drive cuando el pago es del combo.
// El precio real vive en netlify/lib/cursos.js y el precioMinimo en el Apps Script: mantenerlos iguales.
const JS = CURSOS_GRABADOS["fundamentos-backend"];
const BACK = CURSOS_GRABADOS["backend-avanzado"];
const PRECIO_COMBO = 149900;
const PRECIO_SEPARADOS = JS.precio + BACK.precio;

CURSOS_GRABADOS["ruta-backend"] = {
  key: "ruta-backend",
  itemId: "curso-ruta-backend",
  ruta: "ruta-backend",
  contentName: "Infoproducto Ruta Backend Completa",
  tituloInicio: "Ruta",
  tituloDestacado: "Backend",
  tituloFin: "Completa",
  // Cursos que incluye: alimenta el bloque "Incluye" y el banner "llevalos juntos" de cada curso
  combo: ["fundamentos-backend", "backend-avanzado"],
  descripcion: `Los dos cursos de la ruta backend en un solo pago: Master en JavaScript (${JS.clases} clases) + Backend Avanzado (${BACK.clases} clases). De tu primer 'Hola mundo' a crear tus propios servidores y APIs REST con Node.js, Express, sockets, testing y Docker.`,
  precio: PRECIO_COMBO,
  precioRegular: PRECIO_SEPARADOS,
  clases: JS.clases + BACK.clases,
  beneficios: [
    `Ahorrás ${formatearPrecio(PRECIO_SEPARADOS - PRECIO_COMBO)} frente a comprarlos por separado`,
    "Acceso vitalicio a las dos carpetas en Google Drive",
    "Dos guías de estudio en PDF: 109 + 62 preguntas con respuestas",
    "5 proyectos prácticos de servidores para tu portfolio",
    "Envío automático de los dos accesos al abonar",
  ],
  subTituloDesc:
    "Dos cursos, una sola ruta: primero dominás el lenguaje y después construís servidores como en una empresa real.",
  gancho: "De cero a backend profesional, en un solo pago.",
  metaDescripcion: `Ruta Backend: Master en JavaScript (${JS.clases} clases) y Backend Avanzado con Node.js y Express (${BACK.clases} clases). Llevá uno, el otro o los dos juntos con descuento. Acceso de por vida.`,
  nivel: "Desde cero · Hasta nivel profesional",
  paraQuien: [
    "Querés trabajar como desarrollador backend y buscás un camino completo, sin saltos",
    "Nunca programaste (o sabés poco) y querés llegar a crear servidores y APIs reales",
    "Preferís pagar una vez y tener toda la ruta resuelta",
    "Te estás preparando para entrevistas técnicas de backend",
  ],
  resultados: [...JS.resultados.slice(0, 2), ...BACK.resultados],
  modulos: [
    { titulo: `Master en JavaScript · ${JS.clases} clases`, temas: JS.modulos.map((m) => m.titulo) },
    { titulo: `Backend Avanzado · ${BACK.clases} clases`, temas: BACK.modulos.map((m) => m.titulo) },
  ],
};

// ---------- COMBO: Master en Excel y Sheets con IA + Curso de Scripting con IA ----------
// Se elige con el selector de la página de Excel (/excel/inscripcion) y aparece también al sumar los dos cursos
// desde cualquier otra página (normalizarSet en src/data/packs.js): así nunca salen más baratos como pack.
// La página de Scripting no cambia: por eso selectorEn deja el selector solo en Excel.
// El precio real vive en netlify/lib/cursos.js y el mínimo en appscript-cursos.gs: mantenerlos iguales.
const EXCEL = CURSOS_GRABADOS.excel;
const SCRIPTING = CURSOS_GRABADOS.scripting;
const AHORRO_COMBO_EXCEL = 5000;

CURSOS_GRABADOS["excel-scripting"] = {
  key: "excel-scripting",
  itemId: "combo-excel-scripting",
  ruta: "excel",
  contentName: "Combo Excel + Scripting",
  tituloInicio: "Combo",
  tituloDestacado: "Excel + Scripting",
  tituloFin: "con IA",
  combo: ["excel", "scripting"],
  selectorEn: ["excel"],
  nombreSelector: "Combo · Excel + Scripting",
  bannerTitulo: "¿Querés automatizar de verdad? Llevá también Scripting.",
  descripcion: `Los dos cursos en un solo pago: Master en Excel y Sheets con IA (${EXCEL.clases} clases) + Curso de Scripting con IA (${SCRIPTING.clases} clases). Primero dominás las planillas y después aprendés a programar para automatizar todo lo demás.`,
  precio: EXCEL_EN_PREVENTA ? 69900 : 99900,
  // En preventa, lo que costará desde el 1/01/2027; después, la suma de los dos cursos
  precioRegular: EXCEL_EN_PREVENTA ? 99900 : EXCEL.precioRegular + SCRIPTING.precio,
  preventa: {
    hasta: EXCEL_ACCESO,
    fechaTexto: EXCEL_FECHA_TEXTO,
    precio: 69900,
    // Textos propios: Scripting ya está disponible, solo Excel espera hasta la fecha
    paso: {
      titulo: "Te llegan hoy los dos accesos",
      texto: `Apenas se aprueba el pago recibís un solo correo con los links a las dos carpetas. Scripting ya está completo: podés arrancar hoy. Las clases de Excel se habilitan el ${EXCEL_FECHA_TEXTO}.`,
    },
    faqPreventa: `Las clases de Excel se habilitan el ${EXCEL_FECHA_TEXTO}. Si comprás el combo antes, lo pagás $69.900 en lugar de $99.900. El Curso de Scripting con IA ya está completo y lo podés empezar hoy.`,
    faqRecibo: `Apenas Mercado Pago aprueba el pago, te llega un correo con el acceso a las dos carpetas de Google Drive, al mail con el que pagaste. La de Scripting ya tiene todas las clases y la de Excel se completa el ${EXCEL_FECHA_TEXTO}.`,
    textoFinal: `Desde el ${EXCEL_FECHA_TEXTO} el combo pasa a $99.900. Ese día se habilitan las clases de Excel; las de Scripting ya están.`,
  },
  faqCombo: [
    {
      q: "¿Cómo recibo los dos cursos?",
      a: "En un solo mail, apenas se aprueba el pago, con los links a las dos carpetas de Google Drive. Recomendamos hacer primero Excel y después Scripting, pero podés empezar Scripting mientras esperás las clases de Excel.",
    },
    {
      q: "¿Conviene el combo o comprarlos por separado?",
      a: `El combo te ahorra ${formatearPrecio(AHORRO_COMBO_EXCEL)} frente a comprarlos por separado. Si solo querés aprender planillas, Excel solo ya incluye lo necesario de Apps Script para automatizarlas.`,
    },
  ],
  clases: EXCEL.clases + SCRIPTING.clases,
  beneficios: [
    `Ahorrás ${formatearPrecio(AHORRO_COMBO_EXCEL)} frente a comprarlos por separado`,
    "Acceso vitalicio a las dos carpetas en Google Drive",
    `Excel: ${EXCEL.clases} clases y más de 80 horas de video, con archivos de práctica y 9 proyectos`,
    `Scripting: ${SCRIPTING.clases} clases y más de 59 horas, ya disponibles para arrancar hoy`,
    "Automatización con IA en los dos cursos",
    "Dos simulacros orientados al examen Microsoft MO-210 (el examen se paga aparte)",
  ],
  subTituloDesc: "Dos cursos, un solo camino: primero dominás las planillas y después aprendés a programar para automatizar todo lo demás.",
  gancho: "Dominá tus planillas y después aprendé a programar para automatizar todo lo demás.",
  metaDescripcion: EXCEL.metaDescripcion,
  nivel: "Desde cero · Hasta automatizar con programación",
  requisitos: EXCEL.requisitos,
  paraQuien: [
    ...EXCEL.paraQuien.slice(0, 3),
    "Querés dejar de hacer a mano tareas repetitivas y aprender a programarlas",
    "Te interesa probar programación sin invertir en una carrera",
  ],
  resultados: [...EXCEL.resultados.slice(0, 4), ...SCRIPTING.resultados.slice(0, 2)],
  cifras: [
    { valor: String(EXCEL.clases + SCRIPTING.clases), rotulo: "clases" },
    { valor: "2", rotulo: "cursos" },
    { valor: "+139", rotulo: "horas de video" },
    { valor: "1", rotulo: "solo pago" },
  ],
  dato: EXCEL.dato,
  pilares: EXCEL.pilares,
  novedades: EXCEL.novedades,
  requisitosPorNivel: EXCEL.requisitosPorNivel,
  preguntasExtra: EXCEL.preguntasExtra.filter((p) => !p.q.startsWith("¿Qué diferencia hay")),
  modulos: [
    { titulo: `${EXCEL.tituloInicio} ${EXCEL.tituloDestacado} · ${EXCEL.clases} clases`, temas: NIVELES_EXCEL.map((nivel) => nivel.titulo) },
    { titulo: `${SCRIPTING.tituloInicio} ${SCRIPTING.tituloDestacado} · ${SCRIPTING.clases} clases`, temas: SCRIPTING.modulos.map((m) => m.titulo) },
  ],
};

// CYBER SRV: durante la promo cada curso (y la Ruta Backend) vale la mitad de su precio de lista,
// y ese precio queda tachado como precioRegular (es un precio real: el de antes y después de la promo,
// publicada con fechas en src/data/legal.js). La preventa de Scratch no se suma: vale el menor de los dos.
if (enCyber()) {
  for (const curso of Object.values(CURSOS_GRABADOS)) {
    const lista = estaEnPreventa(curso) ? curso.precioRegular : curso.precio;
    const mitad = Math.round(lista / 2);
    if (mitad < curso.precio) {
      curso.precioRegular = lista;
      curso.precio = mitad;
    }
  }
  const ruta = CURSOS_GRABADOS["ruta-backend"];
  ruta.beneficios[0] = `Ahorrás ${formatearPrecio(JS.precio + BACK.precio - ruta.precio)} frente a comprarlos por separado`;
}

// Lo que cuestan por separado los cursos de un combo, a los precios vigentes (durante el Cyber, los del Cyber)
export const precioSeparado = (combo) => (combo.combo || []).reduce((t, k) => t + CURSOS_GRABADOS[k].precio, 0);

// Combo que incluye a un curso (habilita el selector "uno, el otro o los dos" en la página de la ruta)
// selectorEn limita en qué cursos aparece ese selector: Scripting no lo muestra aunque entre en el combo con Excel
export const comboQueIncluye = (key) =>
  Object.values(CURSOS_GRABADOS).find((c) => Array.isArray(c.combo) && (c.selectorEn || c.combo).includes(key)) || null;

// Link de compra de un curso: si se vende dentro de un combo, va a la página del combo con la opción preseleccionada
export const linkInscripcion = (curso) => {
  const combo = curso.combo ? null : comboQueIncluye(curso.key);
  return combo ? `/${combo.ruta}/inscripcion?elegir=${curso.key}` : `/${curso.ruta}/inscripcion`;
};

// Nombre corto de un curso para listas: "Curso de Scripting con IA", "Master en Python con IA", "Ruta Backend Completa"
export const nombreCurso = (curso) =>
  [curso.tituloInicio, curso.tituloDestacado, curso.combo ? curso.tituloFin : null].filter(Boolean).join(" ");

// Los packs "Sumá a tu compra" (varios cursos en un pago) están en src/data/packs.js.
