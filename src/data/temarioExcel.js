// Temario del Master en Excel y Sheets con IA: 6 niveles, 18 módulos y 120 clases animadas y cortas.
// Versión simple del 7/11/2026: todo se produce con IA (animación y voz), sin grabaciones de Marcos.
// "clases" de cada módulo es lo que se promete en la página: si se agrega o se saca una clase, el total
// se recalcula solo (CLASES_EXCEL), pero también hay que actualizar queEncontrara en appscript-cursos.gs y
// los textos con la cantidad en src/data/legal.js, public/llms.txt y ProximosCursos.
export const NIVELES_EXCEL = [
  {
    titulo: "Nivel 1 · Básico",
    resumen: "De abrir una planilla por primera vez a ordenar datos, controlarlos y armar tus primeros gráficos.",
    modulos: [
      {
        titulo: "Primeros pasos",
        clases: 5,
        temas: [
          "Para qué sirve una planilla y qué versión tenés: Excel de escritorio, Excel web o Sheets",
          "La cinta, la barra de fórmulas, libros, hojas, celdas y rangos",
          "Moverte rápido: atajos, copiar y pegado especial",
          "Tipos de dato, coma decimal y punto y coma en las fórmulas",
          "Formato de celdas, impresión y PDF",
        ],
      },
      {
        titulo: "Primeras fórmulas",
        clases: 7,
        temas: [
          "Operadores, SUMA, PROMEDIO, MIN, MAX y CONTAR",
          "Referencias relativas, absolutas y mixtas",
          "Fórmulas entre hojas y rangos con nombre",
          "Porcentajes, IVA, descuentos, márgenes y redondeo",
          "Cómo leer y corregir los errores más comunes",
        ],
      },
      {
        titulo: "Organizar datos",
        clases: 6,
        temas: [
          "Cómo armar bien una base de datos",
          "Ordenar, filtrar e inmovilizar paneles",
          "Tablas y referencias estructuradas",
          "Quitar duplicados y subtotales",
          "Proyecto: lista de precios",
        ],
      },
      {
        titulo: "Control de datos y gráficos",
        clases: 6,
        temas: [
          "Formato condicional con reglas y fórmulas",
          "Validación, listas desplegables y listas dependientes",
          "Proteger celdas y hojas",
          "Elegir el gráfico correcto: columnas, líneas, circular y combinados",
          "Proyecto: control de stock con alertas",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 2 · Intermedio",
    resumen: "Lo que piden en el trabajo: condicionales, búsquedas, limpieza de datos y tablas dinámicas.",
    modulos: [
      {
        titulo: "Lógica y condicionales",
        clases: 6,
        temas: [
          "SI, SI anidado, Y y O",
          "SI.CONJUNTO y SI.ERROR",
          "CONTAR.SI, SUMAR.SI y sus versiones .CONJUNTO",
          "SUMAPRODUCTO y SUBTOTALES",
        ],
      },
      {
        titulo: "Búsquedas",
        clases: 6,
        temas: [
          "BUSCARV exacta y aproximada",
          "INDICE con COINCIDIR",
          "BUSCARX",
          "Proyecto: conciliar dos bases y encontrar las diferencias",
        ],
      },
      {
        titulo: "Textos y fechas",
        clases: 7,
        temas: [
          "EXTRAE, ESPACIOS, SUSTITUIR y UNIRCADENAS",
          "Texto en columnas y relleno rápido",
          "HOY, SIFECHA y FIN.MES: antigüedad y vencimientos",
          "DIAS.LAB con feriados argentinos",
          "Horas trabajadas, aguinaldo y vacaciones",
        ],
      },
      {
        titulo: "Tablas dinámicas",
        clases: 9,
        temas: [
          "Crear una tabla dinámica y elegir su diseño",
          "Mostrar valores como porcentaje y agrupar por fecha",
          "Campos calculados",
          "Segmentación y escala de tiempo",
          "Gráficos dinámicos",
          "Proyecto: informe mensual de ventas",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 3 · Avanzado",
    resumen: "Fórmulas modernas, datos que se actualizan con un clic y tableros para tomar decisiones.",
    modulos: [
      {
        titulo: "Fórmulas modernas y finanzas",
        clases: 8,
        temas: [
          "FILTRAR, ORDENAR y UNICOS",
          "LET: fórmulas más claras",
          "Cómo resolverlo en versiones anteriores de Excel",
          "PAGO y cuadro de amortización",
          "Actualizar precios por inflación y por dólar",
          "Buscar objetivo y escenarios",
        ],
      },
      {
        titulo: "Power Query",
        clases: 8,
        temas: [
          "Importar desde CSV y desde otros archivos de Excel",
          "Limpiar, dividir y crear columnas",
          "Anexar y combinar consultas",
          "Combinar todos los archivos de una carpeta",
          "Caso: comprobantes de ARCA, extractos bancarios y Mercado Pago",
        ],
      },
      {
        titulo: "Tableros",
        clases: 6,
        temas: [
          "Qué preguntas responde un tablero e indicadores clave",
          "Separar datos, cálculos y presentación",
          "Segmentación y diseño",
          "Proyecto: tablero para la dirección de una pyme",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 4 · Google Sheets",
    resumen: "Lo que cambia respecto de Excel y las funciones que solo tiene Sheets.",
    modulos: [
      {
        titulo: "Lo que cambia en Sheets",
        clases: 4,
        temas: [
          "Drive y compatibilidad con archivos de Excel",
          "Compartir, permisos e historial de versiones",
          "Tablas, vistas con filtros y desplegables",
        ],
      },
      {
        titulo: "Funciones de Sheets",
        clases: 8,
        temas: [
          "ARRAYFORMULA",
          "QUERY paso a paso",
          "IMPORTRANGE: conectar planillas",
          "GOOGLEFINANCE y SPARKLINE",
          "De Google Forms a tu planilla",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 5 · Automatización e IA",
    resumen: "Dejá de repetir tareas con macros y scripts, sin experiencia previa, y usá IA para trabajar más rápido.",
    modulos: [
      {
        titulo: "Macros y VBA",
        clases: 6,
        temas: [
          "Grabar macros y asignarlas a un botón",
          "Leer y editar VBA básico",
          "Variables, If y bucles, con la lógica justa",
          "Proyecto: un reporte que se arma con un botón",
        ],
      },
      {
        titulo: "Google Apps Script",
        clases: 8,
        temas: [
          "Tu primer script y la lógica justa",
          "Leer y escribir celdas",
          "Funciones personalizadas y menús",
          "Activadores: al abrir, al editar y por horario",
          "Mandar mails y avisar vencimientos desde la planilla",
          "Proyecto: sistema de cobranzas",
        ],
      },
      {
        titulo: "IA en planillas",
        clases: 6,
        temas: [
          "Qué puede hacer y qué no, y qué datos no subir",
          "Pedir fórmulas, explicar fórmulas ajenas y verificar resultados",
          "Analizar un CSV con un chat gratis",
          "Generar VBA y Apps Script con IA",
          "Qué agrega Copilot en Excel (requiere plan pago)",
          "Qué agrega Gemini en Sheets (requiere plan pago)",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 6 · Casos reales y cierre",
    resumen: "Todo junto en casos de trabajo reales y tu proyecto final.",
    modulos: [
      {
        titulo: "Casos por área",
        clases: 8,
        temas: [
          "Administración: caja y cuentas corrientes",
          "Contable: libro de IVA con comprobantes de ARCA",
          "Recursos humanos: sueldos, aguinaldo y vacaciones",
          "Ventas y stock: comisiones y reposición",
          "Finanzas: flujo de caja y presupuesto",
        ],
      },
      {
        titulo: "Proyecto final y siguiente paso",
        clases: 6,
        temas: [
          "Proyecto final: de una base sucia a un tablero automatizado",
          "Un test de Excel como el de una entrevista",
          "Cómo mostrarlo en tu CV y en LinkedIn",
          "Hacia dónde seguir: Curso de Scripting con IA",
        ],
      },
    ],
  },
];

export const MODULOS_EXCEL = NIVELES_EXCEL.flatMap((nivel) => nivel.modulos);
export const CLASES_EXCEL = MODULOS_EXCEL.reduce((total, modulo) => total + modulo.clases, 0);
