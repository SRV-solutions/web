// Datos visuales de los cursos grabados con pago por Mercado Pago.
// El precio que se cobra realmente se define en netlify/lib/cursos.js
// (acá solo se muestra en pantalla y se usa para Meta Pixel; mantenerlos iguales).

export const CURSOS_GRABADOS = {
  python: {
    key: "python",
    ruta: "python",
    contentName: "Infoproducto Python Completo",
    tituloInicio: "Master en",
    tituloDestacado: "Python",
    tituloFin: "Desde Cero",
    descripcion:
      "Infoproducto completo de 98 clases grabadas. Aprende lógica de programación, POO, consumo de APIs y desarrollo de aplicaciones con interfaz gráfica (GUI).",
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
      "Infoproducto completo de 90 clases grabadas. Aprendé los fundamentos del backend con JavaScript y Node.js: lógica, estructuras de datos, POO, promesas, consumo de APIs, bots y testing.",
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
      "Infoproducto completo de 73 clases grabadas. La continuación de Backend Fundamentos: creá tus propios servidores y APIs REST con Node.js y Express, middlewares, sockets en tiempo real, rate limit, testing y Docker.",
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
