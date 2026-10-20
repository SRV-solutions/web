// Datos visuales de los cursos grabados con pago por Mercado Pago.
// El precio que se cobra realmente se define en netlify/lib/cursos.js
// (acá solo se muestra en pantalla y se usa para Meta Pixel; mantenerlos iguales).

// Preventa de Scratch: hasta esta fecha se vende a precio de preventa y ese día se envía el acceso.
// La misma fecha vive en netlify/lib/cursos.js.
const SCRATCH_ACCESO = new Date("2026-11-18T00:00:00-03:00");

export const estaEnPreventa = (curso) => Boolean(curso?.preventa) && Date.now() < curso.preventa.hasta.getTime();

export const CURSOS_GRABADOS = {
  scratch: {
    key: "scratch",
    ruta: "scratch",
    contentName: "Infoproducto Scratch",
    tituloInicio: "Scratch para",
    tituloDestacado: "Chicos",
    tituloFin: "Desde Cero",
    descripcion:
      "14 clases grabadas para que chicos de 8 a 13 años aprendan a programar jugando con Scratch: en el primer módulo arman una historia animada y en el segundo, su primer videojuego con puntaje, vidas y niveles. Sin instalar nada.",
    precio: Date.now() < SCRATCH_ACCESO.getTime() ? 10000 : 18000,
    precioRegular: 18000,
    preventa: { hasta: SCRATCH_ACCESO, fechaTexto: "18 de noviembre" },
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
    ruta: "scripting",
    contentName: "Infoproducto Scripting",
    tituloInicio: "Curso de",
    tituloDestacado: "Scripting",
    tituloFin: "Desde Cero",
    descripcion:
      "Aprendé a programar desde cero con JavaScript, Python y Google Apps Script: 32 clases grabadas y más de 59 horas para automatizar planillas, mails, documentos y tareas repetitivas, consumir APIs y armar tus propios bots.",
    precio: 15000,
    precioRegular: 60000,
    clases: 32,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Guía de estudio en PDF con 66 preguntas y sus respuestas",
      "Más de 59 horas de clases grabadas",
      "JavaScript, Python y Google Apps Script en un solo curso",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Ideal para arrancar de cero: aprendés la lógica de programación y la aplicás a automatizaciones reales.",
    gancho: "Dejá de hacer a mano lo que una computadora hace sola.",
    metaDescripcion: "Aprendé a programar desde cero con JavaScript, Python y Google Apps Script. 32 clases, más de 59 horas y acceso de por vida por $15.000.",
    nivel: "Desde cero · No necesitás saber nada de programación",
    paraQuien: ["Nunca programaste y querés arrancar sin pagar una fortuna", "Trabajás con planillas, mails o documentos y querés automatizar tareas repetitivas", "Querés probar si la programación es para vos antes de invertir en una carrera", "Necesitás una base sólida de lógica para después ir a Python o Backend"],
    resultados: ["Escribir programas en JavaScript y Python con variables, condicionales, bucles y funciones", "Automatizar Google Sheets, Docs, Gmail y Calendar con Apps Script", "Pedir datos a APIs reales, como la cotización del dólar", "Armar tu propio bot de Discord y tus primeros scripts útiles para el día a día"],
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
    ],
  },

  python: {
    key: "python",
    ruta: "python",
    contentName: "Infoproducto Python Completo",
    tituloInicio: "Master en",
    tituloDestacado: "Python",
    tituloFin: "Desde Cero",
    descripcion:
      "98 clases grabadas para aprender Python desde cero: lógica de programación, programación orientada a objetos, archivos, consumo de APIs, asincronismo y aplicaciones con interfaz gráfica (GUI).",
    precio: 80000,
    precioRegular: 450000,
    clases: 98,
    beneficios: [
      "Acceso vitalicio al material en Google Drive",
      "Estudiá a tu propio ritmo (100% grabado)",
      "Envío automático de accesos al abonar",
    ],
    subTituloDesc:
      "Estructura práctica diseñada para llevarte desde las bases hasta proyectos profesionales.",
    gancho: "El lenguaje más pedido del mundo, explicado desde la primera línea.",
    metaDescripcion: "Master en Python desde cero: 98 clases grabadas de lógica, POO, APIs, asincronismo y apps con interfaz gráfica. Acceso de por vida.",
    nivel: "Desde cero · Ideal como primer lenguaje",
    paraQuien: ["Querés aprender el lenguaje más usado en automatización, datos e inteligencia artificial", "Empezás desde cero y buscás un curso completo, no videos sueltos", "Querés armar proyectos reales para tu portfolio", "Te interesa automatizar tareas o trabajar con datos"],
    resultados: ["Programar en Python con buenas prácticas, de la lógica a la POO", "Leer y escribir archivos, manejar errores y usar expresiones regulares", "Consumir APIs con requests y armar tu propio bot", "Crear apps de escritorio con interfaz gráfica: To Do List, generador de contraseñas y más"],
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
    ],
  },

  "fundamentos-backend": {
    key: "fundamentos-backend",
    ruta: "fundamentos-backend",
    contentName: "Infoproducto Backend Fundamentos",
    tituloInicio: "Backend",
    tituloDestacado: "Fundamentos",
    tituloFin: "",
    descripcion:
      "90 clases grabadas para aprender los fundamentos del backend con JavaScript y Node.js: lógica, estructuras de datos, POO, promesas, consumo de APIs, bots y testing.",
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
      "De tu primer 'Hola mundo' a consumir APIs reales: la base sólida para cualquier desarrollador backend.",
    gancho: "La base que te piden en cualquier entrevista de backend.",
    metaDescripcion: "Backend Fundamentos: 90 clases grabadas de JavaScript y Node.js. Lógica, POO, promesas, APIs, bots y testing, con guía de estudio.",
    nivel: "Desde cero · Primer paso de la ruta backend",
    paraQuien: ["Querés trabajar como desarrollador backend y no sabés por dónde empezar", "Sabés algo de programación pero te faltan bases sólidas", "Querés aprender JavaScript de verdad, más allá de copiar código", "Te estás preparando para tus primeras entrevistas técnicas"],
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
    ruta: "backend-avanzado",
    contentName: "Infoproducto Backend Avanzado",
    tituloInicio: "Backend",
    tituloDestacado: "Avanzado",
    tituloFin: "",
    descripcion:
      "73 clases grabadas, la continuación de Backend Fundamentos: creá tus propios servidores y APIs REST con Node.js y Express, middlewares, sockets en tiempo real, rate limit, testing y Docker.",
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
    nivel: "Nivel intermedio · Recomendado después de Backend Fundamentos",
    paraQuien: ["Ya sabés JavaScript y querés dar el salto a crear servidores", "Terminaste Backend Fundamentos y querés seguir la ruta", "Querés entender cómo funcionan las APIs que consumís todos los días", "Buscás proyectos de backend para tu portfolio"],
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
};

export const formatearPrecio = (valor) => `$${valor.toLocaleString("es-AR")}`;
