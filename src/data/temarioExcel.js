// Temario del Master en Excel y Sheets con IA: 9 niveles, 32 módulos y 255 clases.
// "clases" de cada módulo es lo que se promete en la página: si se agrega o se saca una clase, el total
// se recalcula solo (CLASES_EXCEL), pero también hay que actualizar queEncontrara en appscript-cursos.gs y
// los textos con la cantidad en src/data/legal.js y public/llms.txt.
// Revisado contra las novedades de Microsoft y Google de noviembre de 2026.
export const NIVELES_EXCEL = [
  {
    titulo: "Nivel 1 · Básico",
    resumen: "De abrir Excel por primera vez a ordenar datos, proteger una planilla y armar tus primeros gráficos.",
    modulos: [
      {
        titulo: "Primeros pasos",
        clases: 8,
        temas: [
          "Para qué se usa una planilla y qué Excel tenés: 365, 2021, 2024, web, Mac o celular",
          "La cinta, la barra de fórmulas, libros, hojas, celdas y rangos",
          "Moverte rápido: atajos, seleccionar, copiar y pegado especial",
          "Formatos de archivo, autoguardado y versiones anteriores",
        ],
      },
      {
        titulo: "Datos y formato",
        clases: 8,
        temas: [
          "Tipos de dato, coma decimal, punto y coma en las fórmulas y números guardados como texto",
          "Autorrelleno, series y listas personalizadas",
          "Formato de celdas, formatos personalizados, estilos y temas",
          "Buscar y reemplazar, notas e impresión a PDF",
        ],
      },
      {
        titulo: "Primeras fórmulas",
        clases: 10,
        temas: [
          "Operadores, SUMA, PROMEDIO, MIN, MAX y CONTAR",
          "Referencias relativas, absolutas y mixtas, entre hojas, entre libros y 3D",
          "Rangos con nombre",
          "Porcentajes, IVA, descuentos, márgenes y redondeo",
          "Cómo leer y corregir los errores más comunes",
        ],
      },
      {
        titulo: "Organizar datos",
        clases: 9,
        temas: [
          "Cómo armar bien una base de datos",
          "Ordenar y filtrar, con filtros avanzados",
          "Inmovilizar paneles, dividir la vista y trabajar con varias ventanas",
          "Tablas de Excel y referencias estructuradas",
          "Quitar duplicados, subtotales y esquemas",
          "Proyecto: lista de precios",
        ],
      },
      {
        titulo: "Control de datos",
        clases: 8,
        temas: [
          "Formato condicional: reglas, barras, escalas, íconos y fórmulas",
          "Validación de datos y mensajes de error",
          "Listas desplegables y listas dependientes",
          "Proteger celdas, hojas y libros",
          "Proyecto: control de stock con alertas",
        ],
      },
      {
        titulo: "Gráficos básicos",
        clases: 7,
        temas: [
          "Elegir el gráfico correcto para cada dato",
          "Columnas, barras, líneas, circular, área y dispersión",
          "Títulos, ejes, etiquetas, eje secundario y gráficos combinados",
          "Minigráficos, formas, imágenes y SmartArt",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 2 · Intermedio",
    resumen: "Lo que piden en el trabajo: condicionales, búsquedas, limpieza de datos, tablas dinámicas e informes.",
    modulos: [
      {
        titulo: "Lógica y condicionales",
        clases: 8,
        temas: [
          "SI, SI anidado, Y, O, NO, SI.CONJUNTO y CAMBIAR",
          "SI.ERROR, SI.ND y las funciones ES",
          "CONTAR.SI, SUMAR.SI y PROMEDIO.SI, con sus versiones .CONJUNTO",
          "SUBTOTALES, AGREGAR y SUMAPRODUCTO",
        ],
      },
      {
        titulo: "Búsqueda y referencia",
        clases: 9,
        temas: [
          "BUSCARV exacta y aproximada, y BUSCARH",
          "INDICE con COINCIDIR, también con dos criterios",
          "BUSCARX básica y avanzada",
          "DESREF, INDIRECTO, ELEGIR e hipervínculos",
          "Proyecto: conciliar dos bases y encontrar las diferencias",
        ],
      },
      {
        titulo: "Funciones de texto",
        clases: 7,
        temas: [
          "IZQUIERDA, DERECHA, EXTRAE, LARGO, ENCONTRAR y HALLAR",
          "ESPACIOS, LIMPIAR, SUSTITUIR y mayúsculas",
          "CONCAT, UNIRCADENAS y TEXTO",
          "Texto en columnas, relleno rápido y DIVIDIRTEXTO",
          "Funciones REGEX: buscar patrones como un CUIT o un mail",
        ],
      },
      {
        titulo: "Fechas y horas",
        clases: 7,
        temas: [
          "Cómo guarda Excel las fechas, HOY, FECHA y DIASEM",
          "SIFECHA y FIN.MES: antigüedad, edad y vencimientos",
          "DIAS.LAB con feriados argentinos",
          "Horas trabajadas, horas extra y planilla de asistencia",
          "Cálculo de aguinaldo y vacaciones",
        ],
      },
      {
        titulo: "Tablas dinámicas",
        clases: 11,
        temas: [
          "Crear una tabla dinámica y elegir su diseño",
          "Mostrar valores como porcentaje, agrupar por fecha y por rango",
          "Campos y elementos calculados",
          "Segmentación, escala de tiempo y cambio de origen",
          "IMPORTARDATOSDINAMICOS y gráficos dinámicos",
          "Proyecto: informe mensual de ventas",
        ],
      },
      {
        titulo: "Gráficos avanzados",
        clases: 5,
        temas: [
          "Cascada, embudo, Pareto, histograma y caja",
          "Mapas, rectángulos y proyección solar",
          "Velocímetro y diagrama de Gantt",
          "Gráficos con controles y líneas de tendencia",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 3 · Avanzado",
    resumen: "Fórmulas modernas, finanzas, estadística, simulaciones y planillas profesionales que otros pueden usar.",
    modulos: [
      {
        titulo: "Matrices dinámicas",
        clases: 10,
        temas: [
          "Qué es el desbordamiento y cómo se usa",
          "FILTRAR, ORDENAR, ORDENARPOR, UNICOS y SECUENCIA",
          "APILARV, TOMAR, ELEGIRCOLS y dividir matrices",
          "LET, LAMBDA, MAP y REDUCE: tus propias funciones",
          "AGRUPARPOR y PIVOTARPOR",
          "Matrices clásicas para versiones anteriores de Excel",
        ],
      },
      {
        titulo: "Finanzas, estadística y bases",
        clases: 8,
        temas: [
          "PAGO, VF, VA, TASA, VNA, TIR y cuadro de amortización",
          "Actualizar precios por inflación y por dólar",
          "Mediana, moda, desvío, percentiles y ranking",
          "Correlación, pronóstico y complemento Análisis de datos",
          "BDSUMA y sus funciones hermanas, y consolidar hojas",
        ],
      },
      {
        titulo: "Análisis de hipótesis",
        clases: 5,
        temas: ["Buscar objetivo y administrador de escenarios", "Tablas de datos de una y dos variables", "Solver", "Hoja de previsión"],
      },
      {
        titulo: "Planillas profesionales",
        clases: 8,
        temas: [
          "Auditar fórmulas y revisar una planilla ajena",
          "Cálculo manual y referencias circulares",
          "Trabajo en equipo en OneDrive y comentarios",
          "Seguridad, datos sensibles y plantillas",
          "Personalizar la cinta y la barra de acceso rápido",
          "Vincular con Word, PowerPoint y PDF, y arreglar archivos lentos",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 4 · Datos profesionales",
    resumen: "Importar, limpiar y modelar datos reales para que el informe se actualice con un clic.",
    modulos: [
      {
        titulo: "Power Query",
        clases: 12,
        temas: [
          "Importar desde CSV, Excel, la web y PDF",
          "El editor, los pasos aplicados y los tipos de dato",
          "Limpiar, dividir, extraer y crear columnas personalizadas y condicionales",
          "Anexar, combinar, dinamizar, anular dinamización y agrupar",
          "Combinar todos los archivos de una carpeta",
          "Parámetros y primeros pasos en lenguaje M",
          "Caso: comprobantes de ARCA, extractos bancarios y Mercado Pago",
        ],
      },
      {
        titulo: "Power Pivot y DAX",
        clases: 8,
        temas: [
          "Modelo de datos y relaciones entre tablas",
          "Tabla calendario",
          "Columnas calculadas y medidas",
          "SUM, DIVIDE, DISTINCTCOUNT, CALCULATE y FILTER",
          "Comparar contra el mes anterior y contra el año anterior",
        ],
      },
      {
        titulo: "Tableros",
        clases: 8,
        temas: [
          "Qué preguntas responde un tablero e indicadores clave",
          "Separar datos, cálculos y presentación",
          "Segmentación entre tablas y controles de formulario",
          "Diseño: orden visual, color e íconos",
          "Proyecto: tablero para la dirección de una pyme",
        ],
      },
      {
        titulo: "De Excel a Power BI",
        clases: 4,
        temas: ["Cargar tus datos en Power BI Desktop", "Tus primeros informes", "Reutilizar lo que sabés de Power Query y DAX", "Publicar y compartir"],
      },
    ],
  },
  {
    titulo: "Nivel 5 · Automatización en Excel",
    resumen: "Macros, VBA y las herramientas nuevas de Microsoft para dejar de repetir tareas.",
    modulos: [
      {
        titulo: "Macros",
        clases: 6,
        temas: [
          "Pestaña Programador, seguridad y archivos .xlsm",
          "Grabar macros con referencias absolutas y relativas",
          "Botones, atajos y controles de formulario",
          "Libro personal de macros",
        ],
      },
      {
        titulo: "VBA",
        clases: 14,
        temas: [
          "El editor y los objetos Range, Cells y Worksheets",
          "Variables, If, Select Case y bucles",
          "Funciones propias, subrutinas y depuración de errores",
          "Trabajar con hojas y libros, y eventos",
          "Formularios de carga",
          "Generar PDF, mandar mails y recorrer carpetas",
          "Proyecto: sistema de facturación",
        ],
      },
      {
        titulo: "Office Scripts y Python en Excel",
        clases: 4,
        temas: [
          "Qué son y qué plan de Microsoft necesitan",
          "Automatizar con Office Scripts y Power Automate (demostración)",
          "Analizar datos con Python dentro de Excel (demostración)",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 6 · Google Sheets",
    resumen: "Lo que cambia respecto de Excel, sus funciones propias y las herramientas gratis de Google.",
    modulos: [
      {
        titulo: "Lo que cambia en Sheets",
        clases: 8,
        temas: [
          "Drive, compatibilidad con archivos de Excel y uso sin conexión",
          "Compartir, permisos, historial de versiones y protección de rangos",
          "Comentarios y trabajo en equipo en tiempo real",
          "Tablas, vistas con filtros, desplegables, casillas y chips",
          "Tablas dinámicas y gráficos en Sheets",
        ],
      },
      {
        titulo: "Funciones de Sheets",
        clases: 10,
        temas: [
          "ARRAYFORMULA",
          "QUERY en profundidad, con IMPORTRANGE",
          "FILTER, SORT y UNIQUE",
          "IMPORTXML, IMPORTHTML e IMPORTDATA",
          "GOOGLEFINANCE, GOOGLETRANSLATE y SPARKLINE",
          "LET, LAMBDA y funciones con nombre",
        ],
      },
      {
        titulo: "Forms, Looker Studio y AppSheet",
        clases: 7,
        temas: [
          "De Google Forms a tu planilla",
          "Tableros en Looker Studio",
          "Una app sin código con AppSheet",
          "Macros de Sheets y complementos",
          "Proyecto: sistema de pedidos",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 7 · Google Apps Script",
    resumen: "Programá tus planillas sin experiencia previa: mails, PDF, avisos y conexiones que funcionan solos.",
    modulos: [
      {
        titulo: "Fundamentos de Apps Script",
        clases: 8,
        temas: [
          "Tu primer script en el editor",
          "La lógica justa: variables, condicionales, bucles y listas",
          "Leer y escribir celdas con SpreadsheetApp",
          "Funciones personalizadas para usar en la planilla",
          "Menús, botones y ventanas",
        ],
      },
      {
        titulo: "Automatizar planillas",
        clases: 11,
        temas: [
          "Activadores: al abrir, al editar y por horario",
          "Mandar mails desde la planilla y avisar vencimientos",
          "Generar presupuestos en PDF desde Google Docs",
          "Drive, Calendar y respuestas automáticas de Forms",
          "Traer la cotización del dólar desde una API",
          "Llamar a una IA desde Apps Script, cuotas y errores",
          "Proyecto: sistema de cobranzas",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 8 · IA en planillas",
    resumen: "Usá IA para trabajar más rápido, con un chat gratis, y aprendé a controlar lo que responde.",
    modulos: [
      {
        titulo: "IA en Excel y Sheets",
        clases: 10,
        temas: [
          "Qué puede hacer y qué no, y qué datos no subir",
          "Pedir fórmulas, explicar fórmulas ajenas y verificar resultados",
          "Analizar un CSV con un chat gratis",
          "Copilot en Excel: chat y Agent Mode (requiere plan pago)",
          "Habilidades de Copilot: limpiar datos y crear las tuyas (requiere plan pago)",
          "Gemini en Sheets: armar una planilla entera y corregir fórmulas (requiere plan pago)",
          "Completar columnas con la función =AI() y sus fuentes (requiere plan pago)",
          "Generar VBA, M, DAX y Apps Script con IA",
        ],
      },
    ],
  },
  {
    titulo: "Nivel 9 · Casos reales y cierre",
    resumen: "Todo junto en casos de trabajo reales, práctica para certificarte y tu proyecto final.",
    modulos: [
      {
        titulo: "Casos por área",
        clases: 8,
        temas: [
          "Administración: caja y cuentas corrientes",
          "Contable: libro de IVA con comprobantes de ARCA",
          "Recursos humanos: sueldos, aguinaldo y vacaciones",
          "Ventas y stock: comisiones y reposición",
          "Finanzas: flujo de caja, presupuesto y control de gestión",
        ],
      },
      {
        titulo: "Certificación y entrevista",
        clases: 5,
        temas: [
          "Un test de Excel como el de una entrevista",
          "Cómo mostrarlo en tu CV y en LinkedIn",
          "Cómo rendir Microsoft MO-210 (el examen se paga aparte)",
          "Dos simulacros orientados a ese examen",
        ],
      },
      {
        titulo: "Proyecto final y siguiente paso",
        clases: 4,
        temas: [
          "De una base sucia a un tablero automatizado, paso a paso",
          "Revisión final de tu proyecto",
          "Hacia dónde seguir: Curso de Scripting con IA",
        ],
      },
    ],
  },
];

export const MODULOS_EXCEL = NIVELES_EXCEL.flatMap((nivel) => nivel.modulos);
export const CLASES_EXCEL = MODULOS_EXCEL.reduce((total, modulo) => total + modulo.clases, 0);
