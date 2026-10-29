/**
 * ============================================================
 *  WEBHOOK MERCADO PAGO -> TODOS LOS CURSOS (una sola planilla)
 * ============================================================
 *
 *  Un solo script atiende los pagos de todos los cursos. Cada pago se identifica
 *  por el external_reference ("curso:uuid") que arma netlify/lib/cursos.js,
 *  y queda registrado en la hoja "Pagos" con su columna "Curso" para filtrar.
 *
 *  COMBOS: un curso con la clave "incluye" (ej. "ruta-backend") no tiene carpeta propia:
 *  comparte las carpetas de los cursos que incluye y manda un solo mail con todos los links.
 *
 *  PREVENTA (ej. Scratch): hasta la fecha "hasta" se acepta el precio de preventa. El comprador
 *  recibe AL INSTANTE el acceso a la carpeta (vacía hasta el lanzamiento) con un mail que se lo
 *  aclara. El día del lanzamiento subís las clases a esa carpeta y listo: todos las ven. Si querés
 *  avisarles, ese día ejecutás avisarAperturaScratch() desde el editor.
 *
 *  Las donaciones del juego El Develop ("donacion:uuid") NO dan acceso a nada:
 *  solo se registran y te avisan por mail.
 *
 *  CONFIGURACIÓN INICIAL (una sola vez):
 *
 *  1. Crear una Google Sheet nueva -> Extensiones -> Apps Script -> pegar este archivo.
 *  2. Configuración del proyecto (ícono ⚙️) -> "Propiedades de la secuencia de comandos":
 *       MP_ACCESS_TOKEN   = tu Access Token de producción de Mercado Pago (APP_USR-...)
 *       WEBHOOK_SECRET    = el mismo valor que pongas en Netlify como MP_WEBHOOK_SECRET
 *                           (una clave inventada por vos, larga y aleatoria, 40+ caracteres)
 *       META_PIXEL_ID     = 1616499123394079                        (opcional, para el Purchase por CAPI)
       META_ACCESS_TOKEN = el mismo token de la API de Conversiones que está en Netlify (opcional)
     ⚠️ NUNCA pegues el token directamente en el código.
 *  3. Completar el FOLDER_ID de cada curso en CURSOS (ID de la carpeta de Drive).
 *  4. Ejecutar una vez la función "probarConfiguracion" para autorizar permisos
 *     (Drive, Gmail, Sheets, UrlFetch) y verificar que todo esté OK.
 *  5. Implementar -> Nueva implementación -> Aplicación web
 *       Ejecutar como: Yo   |   Quién tiene acceso: Cualquier usuario
 *     Copiar la URL (termina en /exec) y guardarla en Netlify como MP_WEBHOOK_URL
 *
 *  PARA AGREGAR UN CURSO NUEVO: sumarlo acá en CURSOS y en netlify/lib/cursos.js
 *  con la misma clave e itemId. Si cambiás un precio, actualizá precioMinimo acá.
 *  PARA AGREGAR UN COMBO: igual, pero con "incluye: [claves]" en lugar de folderId.
 *  Los combos "Sumá a tu compra" (scripting-python, scratch-scripting, etc.) funcionan igual:
 *  la web los ofrece dentro de la página de cada curso y se pagan como un solo producto.
 *
 *  ⚠️ Después de pegar una versión nueva: Implementar -> Gestionar implementaciones ->
 *  editar (lápiz) -> Versión: "Nueva versión" -> Implementar. Así la URL /exec no cambia.
 * ============================================================
 */

var CONFIG = {
  MONEDA: "ARS",
  EMAIL_ADMIN: "marcos.schmite@gmail.com",
  NOMBRE_REMITENTE: "WEARESRV Cursos",
  LOGO_URL: "https://wearesrv.com/SRV-LOGO.png",
  SHEET_NAME: "Pagos"
};

// Valor de relleno para cursos cuya carpeta todavía no se cargó
var FOLDER_PENDIENTE = "SIN FOLDER";

// CYBER SRV: del 2 al 4 de noviembre de 2026 todo al 50% de su precio de lista. Durante la promo
// el mínimo aceptado es la mitad del precioMinimo (o el de preventa, si es menor). Mismas fechas
// que netlify/lib/cursos.js (precio que se cobra) y src/data/cursosGrabados.js (precio que se muestra).
// Se decide con la fecha real del pago, así un webhook que llega tarde no rechaza una compra del Cyber.
var CYBER = {
  desde: new Date("2026-11-02T00:00:00-03:00"),
  hasta: new Date("2026-11-05T00:00:00-03:00") // termina el 4/11 a las 23:59
};

// La clave (python, fundamentos-backend...) y el itemId deben coincidir con netlify/lib/cursos.js
var CURSOS = {
  // PREVENTA: hasta "hasta" el mínimo aceptado es preventa.precioMinimo (después, precioMinimo).
  // La carpeta se comparte al instante aunque esté vacía; el mail del alumno avisa que las clases
  // aparecen ahí el día del lanzamiento. Ese día: subís las clases y corrés avisarAperturaScratch().
  "scratch": {
    itemId: "curso-scratch-chicos",
    nombre: "Scratch para Chicos",
    tituloHtml: 'SCRATCH PARA <span style="color:#f6950a;">CHICOS</span> DESDE CERO',
    precioMinimo: 18000,
    preventa: {
      hasta: new Date("2026-11-18T00:00:00-03:00"), // misma fecha que netlify/lib/cursos.js
      precioMinimo: 10000,
      fechaTexto: "18 de noviembre",
      queEncontrara: "las 14 clases del curso"
    },
    folderId: "1mkuq7zJoGcrr6-nuHYjJTcGQ-QRNxpSE"
  },
  "scripting": {
    itemId: "curso-scripting",
    nombre: "Curso de Scripting",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> DESDE CERO',
    precioMinimo: 15000,
    folderId: "1J8obsPj9OZZod4ZbIqNy-OKg8fuTb-cZ"
  },
  "python": {
    itemId: "curso-python-infoproducto",
    nombre: "Master en Python",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">PYTHON</span> DESDE CERO',
    precioMinimo: 80000,
    folderId: "10D1SoZwPVZEekeKhTWgHkJyx6Ia7bwBH"
  },
  // Ex "Backend Fundamentos". La clave y el itemId NO cambian (identifican los pagos ya emitidos);
  // solo cambió el nombre comercial. En la web vive en /javascript/inscripcion.
  "fundamentos-backend": {
    itemId: "curso-fundamentos-backend",
    nombre: "Master en JavaScript",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">JAVASCRIPT</span> DESDE CERO',
    precioMinimo: 84900,
    folderId: "1F3sNy_CLXR_XNW62rFhV86Lp2Ht8E-1N"
  },
  "backend-avanzado": {
    itemId: "curso-backend-avanzado",
    nombre: "Backend Avanzado",
    tituloHtml: 'BACKEND <span style="color:#f6950a;">AVANZADO</span>',
    precioMinimo: 99900,
    folderId: "14ML2UZ5BAkBB7-Uw1nLyPyO3mbqBCinP"
  },
  // Curso Fullstack con C# (.NET + PostgreSQL + React). Los alumnos de SRV pagan menos con un código:
  // el servidor de la web lo valida y marca el pago con metadata.cupon = "alumnos", y acá se acepta
  // cuponAlumnos.precioMinimo en lugar de precioMinimo. Nadie puede ponerse ese metadata desde el navegador.
  "fullstack-csharp": {
    itemId: "curso-fullstack-csharp",
    nombre: "Curso Fullstack con C#",
    tituloHtml: 'CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C# Y REACT',
    precioMinimo: 87900,
    cuponAlumnos: { precioMinimo: 20000 },
    folderId: "1eQPWcinDKEjpV7pYo6qfveT2Vbe7Q8xf"
  },
  // COMBO: Master en JavaScript + Backend Avanzado en un solo pago. Sin carpeta propia:
  // comparte las carpetas de los cursos listados en "incluye" (mismo orden en el mail).
  "ruta-backend": {
    itemId: "curso-ruta-backend",
    nombre: "Ruta Backend Completa",
    tituloHtml: 'RUTA <span style="color:#f6950a;">BACKEND</span> COMPLETA',
    precioMinimo: 149900,
    incluye: ["fundamentos-backend", "backend-avanzado"]
  },

  // SUMÁ A TU COMPRA: combos de dos o tres cursos que la web ofrece dentro de la página de cada curso
  // (misma clave, itemId y precio que netlify/lib/cursos.js y src/data/cursosGrabados.js).
  // "incluye" puede nombrar otro combo (ruta-backend): se abre en sus cursos para compartir las carpetas.
  "scripting-python": {
    itemId: "combo-scripting-python",
    nombre: "Combo Scripting + Python",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> + MASTER EN <span style="color:#f6950a;">PYTHON</span>',
    precioMinimo: 69900,
    incluye: ["scripting", "python"]
  },
  "scratch-scripting": {
    itemId: "combo-scratch-scripting",
    nombre: "Combo Scratch + Scripting",
    tituloHtml: 'SCRATCH PARA <span style="color:#f6950a;">CHICOS</span> + CURSO DE <span style="color:#f6950a;">SCRIPTING</span>',
    precioMinimo: 24900,
    // Mientras dura la preventa de Scratch, el combo también tiene precio de preventa
    preventa: {
      hasta: new Date("2026-11-18T00:00:00-03:00"), // misma fecha que netlify/lib/cursos.js
      precioMinimo: 17900,
      fechaTexto: "18 de noviembre",
      queEncontrara: "en la carpeta de Scratch para Chicos las 14 clases del curso (las de Scripting ya están en la suya)"
    },
    incluye: ["scratch", "scripting"]
  },
  "scripting-javascript": {
    itemId: "combo-scripting-javascript",
    nombre: "Combo Scripting + Master en JavaScript",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> + MASTER EN <span style="color:#f6950a;">JAVASCRIPT</span>',
    precioMinimo: 89900,
    incluye: ["scripting", "fundamentos-backend"]
  },
  "scripting-ruta-backend": {
    itemId: "combo-scripting-ruta-backend",
    nombre: "Combo Scripting + Ruta Backend Completa",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> + RUTA <span style="color:#f6950a;">BACKEND</span> COMPLETA',
    precioMinimo: 154900,
    incluye: ["scripting", "ruta-backend"]
  },
  "python-javascript": {
    itemId: "combo-python-javascript",
    nombre: "Combo Python + Master en JavaScript",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">PYTHON</span> + MASTER EN <span style="color:#f6950a;">JAVASCRIPT</span>',
    precioMinimo: 139900,
    incluye: ["python", "fundamentos-backend"]
  },
  "python-ruta-backend": {
    itemId: "combo-python-ruta-backend",
    nombre: "Combo Python + Ruta Backend Completa",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">PYTHON</span> + RUTA <span style="color:#f6950a;">BACKEND</span> COMPLETA',
    precioMinimo: 199900,
    incluye: ["python", "ruta-backend"]
  },
  // PACK COMPLETO: Scripting + Python + Ruta Backend (4 carpetas) en un solo pago
  "pack-completo": {
    itemId: "combo-pack-completo",
    nombre: "Pack Completo",
    tituloHtml: 'PACK <span style="color:#f6950a;">COMPLETO</span>: SCRIPTING + PYTHON + RUTA BACKEND',
    precioMinimo: 199900,
    incluye: ["scripting", "python", "ruta-backend"]
  },
  // COMBOS CON FULLSTACK C# (mismas claves y precios que netlify/lib/cursos.js)
  "scripting-csharp": {
    itemId: "combo-scripting-csharp",
    nombre: "Combo Scripting + Fullstack C#",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> + CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C#',
    precioMinimo: 92900,
    incluye: ["scripting", "fullstack-csharp"]
  },
  "python-csharp": {
    itemId: "combo-python-csharp",
    nombre: "Combo Python + Fullstack C#",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">PYTHON</span> + CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C#',
    precioMinimo: 139900,
    incluye: ["python", "fullstack-csharp"]
  },
  "javascript-csharp": {
    itemId: "combo-javascript-csharp",
    nombre: "Combo Master en JavaScript + Fullstack C#",
    tituloHtml: 'MASTER EN <span style="color:#f6950a;">JAVASCRIPT</span> + CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C#',
    precioMinimo: 144900,
    incluye: ["fundamentos-backend", "fullstack-csharp"]
  },
  "backend-avanzado-csharp": {
    itemId: "combo-backend-avanzado-csharp",
    nombre: "Combo Backend Avanzado + Fullstack C#",
    tituloHtml: 'BACKEND <span style="color:#f6950a;">AVANZADO</span> + CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C#',
    precioMinimo: 159900,
    incluye: ["backend-avanzado", "fullstack-csharp"]
  },
  "ruta-backend-csharp": {
    itemId: "combo-ruta-backend-csharp",
    nombre: "Combo Ruta Backend + Fullstack C#",
    tituloHtml: 'RUTA <span style="color:#f6950a;">BACKEND</span> COMPLETA + CURSO <span style="color:#f6950a;">FULLSTACK</span> CON C#',
    precioMinimo: 199900,
    incluye: ["ruta-backend", "fullstack-csharp"]
  }
};

// ============================================================
//  PACKS "SUMÁ A TU COMPRA": varios cursos en un solo pago, armados por el visitante en la web.
//  La MISMA regla que netlify/lib/cursos.js y src/data/packs.js:
//    precio = suma de precios − AHORRO_POR_CURSO × (cursos − 1), nunca menos que el curso más caro,
//    redondeado a un número terminado en 900.
//  Clave del pago: "pack-" + nombres cortos ordenados (ej. "pack-csharp-python"). Acá se generan
//  todas las combinaciones válidas como entradas de CURSOS, con "incluye" para compartir carpetas.
//  Unidades: cada curso grabado y la Ruta Backend como una sola; Scratch solo con Scripting y Python.
// ============================================================
var AHORRO_POR_CURSO = 30000;
var UNIDADES_PACK = [
  { key: "scratch", corto: "scratch" },
  { key: "scripting", corto: "scripting" },
  { key: "python", corto: "python" },
  { key: "fundamentos-backend", corto: "javascript" },
  { key: "backend-avanzado", corto: "backend" },
  { key: "ruta-backend", corto: "ruta" },
  { key: "fullstack-csharp", corto: "csharp" }
];
var SOLO_CON_SCRATCH = ["scripting", "python"];

function setPackValido_(keys) {
  if (keys.length < 2) return false;
  var tieneRuta = keys.indexOf("ruta-backend") !== -1;
  if (tieneRuta && (keys.indexOf("fundamentos-backend") !== -1 || keys.indexOf("backend-avanzado") !== -1)) return false;
  if (keys.indexOf("fundamentos-backend") !== -1 && keys.indexOf("backend-avanzado") !== -1) return false; // juntos son la ruta
  if (keys.indexOf("scratch") !== -1) {
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] !== "scratch" && SOLO_CON_SCRATCH.indexOf(keys[i]) === -1) return false;
    }
  }
  return true;
}

function redondear900_(n) {
  return Math.floor((n - 900) / 1000) * 1000 + 900;
}

// Mínimo aceptado para un pack: aplica la regla sobre el mínimo de cada unidad a la fecha del pago
// (así la preventa de Scratch también vale dentro de un pack)
function precioPack_(keys, fechaPago) {
  var suma = 0, maximo = 0;
  for (var i = 0; i < keys.length; i++) {
    var precio = precioMinimoUnidad_(CURSOS[keys[i]], fechaPago);
    suma += precio;
    if (precio > maximo) maximo = precio;
  }
  var conDescuento = suma - AHORRO_POR_CURSO * (keys.length - 1);
  if (conDescuento <= maximo) return maximo;
  return Math.max(maximo, redondear900_(conDescuento));
}

// Genera una entrada de CURSOS por cada combinación válida (2 a 7 unidades)
function generarPacks_() {
  var n = UNIDADES_PACK.length;
  for (var mascara = 1; mascara < (1 << n); mascara++) {
    var unidades = [];
    for (var i = 0; i < n; i++) if (mascara & (1 << i)) unidades.push(UNIDADES_PACK[i]);
    var keys = unidades.map(function (u) { return u.key; });
    if (!setPackValido_(keys)) continue;
    var clave = "pack-" + unidades.map(function (u) { return u.corto; }).sort().join("-");
    var nombres = keys.map(function (k) { return CURSOS[k].nombre; });
    CURSOS[clave] = {
      itemId: clave,
      nombre: "Pack: " + nombres.join(" + "),
      tituloHtml: 'PACK <span style="color:#f6950a;">' + escaparHtml_(nombres.join(" + ")).toUpperCase() + '</span>',
      pack: true,
      incluye: keys
    };
  }
}
generarPacks_();

// Prefijo del external_reference de las donaciones (netlify/functions/crear-donacion.js)
var PREFIJO_DONACION = "donacion:";

// Estados registrados en la hoja. Solo los "finales" bloquean un reprocesamiento.
var ESTADO_APROBADO = "APROBADO";
var ESTADO_RECHAZADO = "RECHAZADO_VALIDACION";
var ESTADO_DONACION = "DONACION";
var ESTADOS_FINALES = [ESTADO_APROBADO, ESTADO_RECHAZADO, ESTADO_DONACION];

// Columnas de la hoja (1 = A)
var COL_PAYMENT_ID = 2;
var COL_DETALLE = 3;
var COL_ESTADO = 4;

// ============================================================
//  ENTRADA DEL WEBHOOK
// ============================================================
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty("WEBHOOK_SECRET");
    var accessToken = props.getProperty("MP_ACCESS_TOKEN");

    if (!secret || !accessToken) {
      registrar_({ estado: "ERROR_CONFIG", detalle: "Faltan MP_ACCESS_TOKEN o WEBHOOK_SECRET en Propiedades del script" });
      return responder_("config_error");
    }

    var params = (e && e.parameter) || {};

    // 1. Validar clave secreta: descarta llamadas que no vienen de nuestras preferencias
    if (!compararSeguro_(String(params.key || ""), secret)) {
      return responder_("unauthorized");
    }

    // 2. Leer notificación (body JSON + query params)
    var body = {};
    if (e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        body = {};
      }
    }

    // Solo nos interesan notificaciones de tipo "payment" (MP también envía merchant_order)
    var tipo = String(body.type || body.topic || params.type || params.topic || "");
    if (tipo && tipo !== "payment") {
      return responder_("ignored_type");
    }

    var paymentId = String(
      (body.data && body.data.id) || params["data.id"] || params.id || ""
    );

    // El ID debe ser numérico: evita inyectar rutas en la URL de la API
    if (!/^\d{1,20}$/.test(paymentId)) {
      return responder_("invalid_id");
    }

    // 3. Lock: evita que dos notificaciones simultáneas del mismo pago den acceso dos veces
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) {
      registrar_({ estado: "LOCK_TIMEOUT", paymentId: paymentId, detalle: "Reprocesar con reprocesarPagoManual si no llega otra notificación" });
      return responder_("busy");
    }

    try {
      return procesarPago_(paymentId, accessToken, false);
    } finally {
      lock.releaseLock();
    }

  } catch (error) {
    registrar_({ estado: "CRITICAL_ERROR", detalle: String(error && error.stack ? error.stack : error) });
    // No devolvemos detalles del error hacia afuera
    return responder_("error");
  }
}

// Responder algo si alguien abre la URL en el navegador
function doGet() {
  return responder_("ok");
}

// ============================================================
//  LÓGICA PRINCIPAL
// ============================================================
// forzar = true solo desde reprocesarPagoManual: ignora el antiduplicados
// (por ejemplo, para un pago que se rechazó porque faltaba la carpeta de Drive).
function procesarPago_(paymentId, accessToken, forzar) {
  // ANTIDUPLICADOS: solo si ya quedó en un estado final (un "pending" previo NO bloquea)
  if (!forzar && yaProcesado_(paymentId)) {
    return responder_("already_processed");
  }

  // Consultar el pago real a la API de Mercado Pago (fuente de verdad)
  var response = UrlFetchApp.fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
    method: "get",
    headers: { Authorization: "Bearer " + accessToken },
    muteHttpExceptions: true
  });

  if (response.getResponseCode() !== 200) {
    registrar_({ estado: "ERROR_API_MP", paymentId: paymentId, detalle: "HTTP " + response.getResponseCode() });
    return responder_("mp_api_error");
  }

  var payment = JSON.parse(response.getContentText());

  var status = String(payment.status || "desconocido");
  var monto = Number(payment.transaction_amount) || 0;
  var moneda = String(payment.currency_id || "");
  var payer = payment.payer || {};
  var email = String(payer.email || "").trim().toLowerCase();
  var nombre = String(((payer.first_name || "") + " " + (payer.last_name || "")).trim() || "Estudiante");
  var telefono = "";
  if (payer.phone && payer.phone.number) {
    telefono = String(payer.phone.area_code || "") + String(payer.phone.number);
  }
  var fila = { paymentId: paymentId, nombre: nombre, email: email, telefono: telefono, monto: monto, neto: netoRecibido_(payment) };
  // Fecha real del pago: decide si corresponde el precio de preventa, aunque la notificación llegue después
  var fechaPago = new Date(payment.date_approved || payment.date_created || Date.now());

  // DONACIONES (El Develop): se registran y se avisa, nunca dan acceso a un curso
  if (String(payment.external_reference || "").indexOf(PREFIJO_DONACION) === 0) {
    return procesarDonacion_(fila, status, moneda);
  }

  // ¿De qué curso es este pago?
  var cursoKey = identificarCurso_(payment);
  if (!cursoKey) {
    // Pago de la cuenta que no salió de nuestros checkouts (ej. otro producto): se registra y se ignora
    fila.estado = "SIN_CURSO";
    fila.detalle = "external_reference: " + String(payment.external_reference || "-");
    registrar_(fila);
    return responder_("unknown_course");
  }
  var curso = CURSOS[cursoKey];
  fila.curso = curso.nombre;

  // Pagos no aprobados (pending, in_process, rejected...): se registran pero no bloquean
  if (status !== "approved") {
    fila.estado = "Estado: " + status;
    registrar_(fila);
    return responder_("not_approved");
  }

  // Carpetas que hay que compartir: una para un curso, varias para un combo
  var carpetas = carpetasDeCurso_(curso);
  var preventa = enPreventa_(curso, fechaPago);
  var conCupon = esCuponAlumnos_(curso, payment);
  var minimo = precioMinimo_(curso, fechaPago, payment);

  // VALIDACIONES ANTES DE DAR ACCESO
  var problemas = [];
  if (moneda !== CONFIG.MONEDA) problemas.push("Moneda inválida: " + moneda);
  if (monto < minimo) problemas.push("Monto bajo: $" + monto + " (mínimo $" + minimo + (preventa ? " en preventa" : "") + (conCupon ? " con código de alumnos" : "") + ")");
  if (!emailValido_(email)) problemas.push("Email inválido: " + email);
  for (var v = 0; v < carpetas.length; v++) {
    if (!carpetaConfigurada_(carpetas[v].folderId)) {
      problemas.push("Falta configurar el folderId de " + carpetas[v].nombre + " en CURSOS (después usá reprocesarPagoManual)");
    }
  }

  if (problemas.length > 0) {
    fila.estado = ESTADO_RECHAZADO;
    fila.detalle = problemas.join(" | ");
    registrar_(fila);
    MailApp.sendEmail({
      to: CONFIG.EMAIL_ADMIN,
      subject: "⚠️ ALERTA " + curso.nombre + ": pago aprobado sin acceso automático",
      body:
        "Pago ID: " + paymentId + "\n" +
        "Comprador: " + nombre + " <" + email + ">\n" +
        "Monto: $" + monto + " " + moneda + "\n\n" +
        "Motivo: " + problemas.join(" | ") + "\n\n" +
        "No se otorgó acceso automático. Revisalo en Mercado Pago.\n" +
        (emailValido_(email) ? "Al comprador se le avisó por mail que el acceso se habilita a mano." : "El comprador NO recibió ningún mail (email inválido).")
    });
    // Que el comprador no quede sin noticias mientras se resuelve a mano
    if (emailValido_(email)) {
      try {
        GmailApp.sendEmail(email, "Recibimos tu pago - " + curso.nombre, "", {
          name: CONFIG.NOMBRE_REMITENTE,
          replyTo: CONFIG.EMAIL_ADMIN,
          htmlBody: construirEmailPendienteHtml_(curso, nombre, monto)
        });
      } catch (mailErr) {
        Logger.log("No se pudo avisar al comprador " + email + ": " + mailErr);
      }
    }
    return responder_("validation_failed");
  }

  // Registrar ANTES de dar acceso: si algo falla después, un reintento de MP no duplica el envío
  fila.estado = ESTADO_APROBADO;
  if (preventa) fila.detalle = "Preventa: clases el " + curso.preventa.fechaTexto;
  if (conCupon) fila.detalle = (fila.detalle ? fila.detalle + " | " : "") + "Código de alumnos";
  var numFila = registrar_(fila);

  // Purchase por CAPI aunque el comprador no vuelva a la página de gracias.
  // Usa el mismo event_id que confirmar-compra, así Meta lo cuenta una sola vez.
  enviarPurchaseMeta_(payment, curso, monto, moneda);

  // SEGURIDAD DE DRIVE: acceso solo de lectura y solo para el email del comprador.
  // Se comparte cada carpeta por separado: si una falla, las demás igual se entregan.
  var accesos = [];
  var notas = [];
  for (var c = 0; c < carpetas.length; c++) {
    var carpeta = carpetas[c];
    var linkDrive = "https://drive.google.com/drive/folders/" + carpeta.folderId;
    var compartida = true;
    try {
      var folder = DriveApp.getFolderById(carpeta.folderId);
      folder.addViewer(email);
      linkDrive = folder.getUrl();
    } catch (driveErr) {
      compartida = false;
      notas.push("Drive (" + carpeta.nombre + "): " + driveErr);
      MailApp.sendEmail({
        to: CONFIG.EMAIL_ADMIN,
        subject: "⚠️ " + curso.nombre + ": no se pudo compartir la carpeta de " + carpeta.nombre,
        body:
          "Pago ID: " + paymentId + "\nEmail: " + email + "\n\nError: " + driveErr +
          "\n\nCompartí la carpeta manualmente (puede ser un email que no es cuenta de Google)."
      });
    }
    accesos.push({ nombre: carpeta.nombre, link: linkDrive, compartida: compartida });
  }

  var asunto = preventa
    ? "¡Lugar reservado! - " + curso.nombre + " (las clases se habilitan el " + curso.preventa.fechaTexto + ")"
    : "¡Pago Aprobado! - Acceso a " + curso.nombre;

  try {
    GmailApp.sendEmail(email, asunto, "", {
      name: CONFIG.NOMBRE_REMITENTE,
      replyTo: CONFIG.EMAIL_ADMIN,
      htmlBody: construirEmailHtml_(curso, nombre, email, monto, accesos, preventa)
    });
  } catch (mailErr) {
    notas.push("Mail alumno: " + mailErr);
  }

  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "🚨 Nuevo inscripto en " + curso.nombre.toUpperCase(),
    body:
      "¡Hola Marcos! Hay una nueva compra de " + curso.nombre + ".\n\n" +
      "Pago ID: " + paymentId + "\n" +
      "Comprador: " + nombre + " <" + email + ">\n" +
      "Teléfono: " + (telefono || "-") + "\n" +
      "Monto: $" + monto + " " + moneda + "\n" +
      "Carpetas compartidas: " + accesos.map(function (a) { return a.nombre; }).join(", ") +
      (preventa ? "\nPreventa: sí (las clases se habilitan el " + curso.preventa.fechaTexto + ")" : "") +
      (conCupon ? "\nCódigo de alumnos: sí (precio especial)" : "") +
      (notas.length ? "\n\n⚠️ Avisos: " + notas.join(" | ") : "")
  });

  if (notas.length) {
    var detalle = (fila.detalle ? fila.detalle + " | " : "") + notas.join(" | ");
    getSheet_().getRange(numFila, COL_DETALLE).setValue(sanitizarCelda_(detalle));
  }

  return responder_("success");
}

// Donación del juego El Develop: solo se registra y se avisa al admin
function procesarDonacion_(fila, status, moneda) {
  fila.curso = "Donación El Develop";

  if (status !== "approved") {
    fila.estado = "Donación: " + status;
    registrar_(fila);
    return responder_("donation_not_approved");
  }

  fila.estado = ESTADO_DONACION;
  registrar_(fila);
  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "☕ Nueva donación de $" + formatearMonto_(fila.monto) + " en El Develop",
    body:
      "¡Alguien te invitó un cafecito!\n\n" +
      "Pago ID: " + fila.paymentId + "\n" +
      "De: " + fila.nombre + " <" + fila.email + ">\n" +
      "Monto: $" + fila.monto + " " + moneda
  });
  return responder_("donation");
}

// ============================================================
//  HELPERS
// ============================================================

// Devuelve la clave del curso según el external_reference ("curso:uuid") o el ID del ítem
function identificarCurso_(payment) {
  var ref = String(payment.external_reference || "");
  var prefijo = ref.split(":")[0];
  if (ref.indexOf(":") > 0 && Object.prototype.hasOwnProperty.call(CURSOS, prefijo)) {
    return prefijo;
  }

  // Respaldo: pagos viejos sin external_reference (ej. Python antes de este cambio)
  var items = (payment.additional_info && payment.additional_info.items) || [];
  for (var key in CURSOS) {
    if (!Object.prototype.hasOwnProperty.call(CURSOS, key)) continue;
    for (var i = 0; i < items.length; i++) {
      if (String(items[i].id) === CURSOS[key].itemId) return key;
    }
  }
  return null;
}

// Carpetas de Drive que entrega un curso: la propia, o las de los cursos que incluye si es un combo.
// Un combo puede incluir otro combo (ej. "scripting-ruta-backend" incluye "ruta-backend"): se abre
// hasta llegar a los cursos con carpeta.
function carpetasDeCurso_(curso) {
  if (curso.incluye && curso.incluye.length) {
    var carpetas = [];
    curso.incluye.forEach(function (key) {
      carpetas = carpetas.concat(carpetasDeCurso_(CURSOS[key]));
    });
    return carpetas;
  }
  return [{ nombre: curso.nombre, folderId: curso.folderId }];
}

// Nombres (columna "Curso" de la hoja) de todo lo que entrega un curso: él mismo y los combos que lo incluyen
function nombresQueEntregan_(cursoKey) {
  var nombres = [CURSOS[cursoKey].nombre];
  for (var key in CURSOS) {
    if (!Object.prototype.hasOwnProperty.call(CURSOS, key) || key === cursoKey) continue;
    var entrega = carpetasDeCurso_(CURSOS[key]).some(function (c) { return c.nombre === CURSOS[cursoKey].nombre; });
    if (entrega) nombres.push(CURSOS[key].nombre);
  }
  return nombres;
}

function emailValido_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function carpetaConfigurada_(folderId) {
  return !!folderId && folderId !== FOLDER_PENDIENTE;
}

// ¿El pago (hecho en fechaPago) entra en la preventa del curso?
function enPreventa_(curso, fechaPago) {
  if (!curso.preventa || !curso.preventa.hasta) return false;
  var fecha = fechaPago instanceof Date && !isNaN(fechaPago.getTime()) ? fechaPago : new Date();
  return fecha.getTime() < curso.preventa.hasta.getTime();
}

// ¿El pago (hecho en fechaPago) entra en el Cyber SRV?
function enCyber_(fechaPago) {
  var fecha = fechaPago instanceof Date && !isNaN(fechaPago.getTime()) ? fechaPago : new Date();
  return fecha.getTime() >= CYBER.desde.getTime() && fecha.getTime() < CYBER.hasta.getTime();
}

// ¿El pago se hizo con el código de alumnos? Lo marca crear-preferencia (servidor de la web) en el
// metadata de la preferencia de Mercado Pago después de validar el código; el navegador no puede ponerlo.
function esCuponAlumnos_(curso, payment) {
  var meta = (payment && payment.metadata) || {};
  return !!(curso && curso.cuponAlumnos && meta.cupon === "alumnos");
}

// Mínimo de una unidad (curso o combo fijo) a la fecha del pago: preventa si corresponde, si no el
// regular; durante el Cyber, la mitad del precio de lista (o la preventa, si es menor)
function precioMinimoUnidad_(curso, fechaPago) {
  var minimo = enPreventa_(curso, fechaPago) ? curso.preventa.precioMinimo : curso.precioMinimo;
  if (enCyber_(fechaPago)) minimo = Math.min(minimo, Math.round(curso.precioMinimo / 2));
  return minimo;
}

// Precio mínimo aceptado para un pago: el de alumnos si vino con código, el de la regla de packs si es
// un pack armado en la web, el de preventa si corresponde, si no el regular
function precioMinimo_(curso, fechaPago, payment) {
  if (esCuponAlumnos_(curso, payment)) return curso.cuponAlumnos.precioMinimo;
  if (curso.pack) return precioPack_(curso.incluye, fechaPago);
  return precioMinimoUnidad_(curso, fechaPago);
}

function yaProcesado_(paymentId) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;

  var celdas = sheet.getRange(2, COL_PAYMENT_ID, lastRow - 1, 1)
    .createTextFinder(paymentId)
    .matchEntireCell(true)
    .findAll();

  for (var i = 0; i < celdas.length; i++) {
    var estado = String(sheet.getRange(celdas[i].getRow(), COL_ESTADO).getValue());
    if (ESTADOS_FINALES.indexOf(estado) !== -1) return true;
  }
  return false;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(["Fecha", "Payment ID", "Detalle", "Estado", "Curso", "Nombre", "Email", "Teléfono", "Monto", "Neto recibido"]);
    sheet.setFrozenRows(1);
    // Columna Payment ID como texto plano para que no se convierta a número
    sheet.getRange("B:B").setNumberFormat("@");
    // Filtro listo para usar por curso, estado, etc.
    sheet.getRange(1, 1, 1, 10).createFilter();
  }
  return sheet;
}

// Registra una fila y devuelve su número
function registrar_(datos) {
  var sheet = getSheet_();
  sheet.appendRow([
    new Date(),
    sanitizarCelda_(datos.paymentId || ""),
    sanitizarCelda_(datos.detalle || ""),
    datos.estado || "",
    datos.curso || "",
    sanitizarCelda_(datos.nombre || ""),
    sanitizarCelda_(datos.email || ""),
    sanitizarCelda_(datos.telefono || ""),
    Number(datos.monto) || 0,
    (datos.neto === "" || datos.neto == null) ? "" : Number(datos.neto)
  ]);
  return sheet.getLastRow();
}

// Neto que te llega a Mercado Pago (monto - comisiones - impuestos). Solo para pagos aprobados.
function netoRecibido_(payment) {
  var td = (payment && payment.transaction_details) || {};
  var neto = Number(td.net_received_amount);
  if (String(payment && payment.status) === "approved" && neto > 0) return neto;
  return "";
}

// Completa la columna "Neto recibido" (J) de los pagos aprobados y donaciones que la tengan vacía,
// consultando cada pago a la API de Mercado Pago. Ejecutala a mano desde el editor cuando quieras
// ponerte al día (ej. con las filas de antes de agregar la columna).
function completarNetos() {
  var accessToken = PropertiesService.getScriptProperties().getProperty("MP_ACCESS_TOKEN");
  if (!accessToken) throw new Error("Falta MP_ACCESS_TOKEN en Propiedades del script");
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  // Hojas creadas antes de la columna J: se agrega el encabezado y se extiende el filtro
  if (sheet.getRange(1, 10).getValue() === "") sheet.getRange(1, 10).setValue("Neto recibido");
  var filtro = sheet.getFilter();
  if (filtro && filtro.getRange().getLastColumn() < 10) {
    filtro.remove();
    sheet.getRange(1, 1, 1, 10).createFilter();
  }
  var datos = sheet.getRange(2, 1, lastRow - 1, 10).getValues();
  var completados = 0;
  for (var i = 0; i < datos.length; i++) {
    var estado = String(datos[i][COL_ESTADO - 1]);
    var paymentId = String(datos[i][COL_PAYMENT_ID - 1]).trim();
    var neto = datos[i][9];
    if (!paymentId || neto !== "" || (estado !== ESTADO_APROBADO && estado !== ESTADO_DONACION)) continue;
    var resp = UrlFetchApp.fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
      method: "get",
      headers: { Authorization: "Bearer " + accessToken },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() !== 200) continue;
    var valor = netoRecibido_(JSON.parse(resp.getContentText()));
    if (valor !== "") {
      sheet.getRange(i + 2, 10).setValue(valor);
      completados++;
    }
  }
  Logger.log("Netos completados: " + completados);
}

// Evita inyección de fórmulas en la planilla (=, +, -, @ al inicio)
function sanitizarCelda_(valor) {
  var s = String(valor);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Evita inyección de HTML en el email (nombre del comprador, etc.)
function escaparHtml_(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Comparación en tiempo constante (evita ataques de timing sobre la clave)
function compararSeguro_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

// ============================================================
//  META: PURCHASE POR LA API DE CONVERSIONES
// ============================================================
function sha256_(valor) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, valor, Utilities.Charset.UTF_8);
  return bytes.map(function (b) { return ("0" + (b & 0xff).toString(16)).slice(-2); }).join("");
}

function enviarPurchaseMeta_(payment, curso, monto, moneda) {
  try {
    var props = PropertiesService.getScriptProperties();
    var pixelId = props.getProperty("META_PIXEL_ID");
    var token = props.getProperty("META_ACCESS_TOKEN");
    if (!pixelId || !token) return;

    var payer = payment.payer || {};
    // fbp, fbc, IP y navegador los guarda crear-preferencia en el metadata del pago
    var meta = payment.metadata || {};
    var userData = {};
    var email = String(payer.email || "").trim().toLowerCase();
    if (email) userData.em = [sha256_(email)];
    if (payer.phone && payer.phone.number) {
      userData.ph = [sha256_(String(payer.phone.area_code || "") + String(payer.phone.number).replace(/\D/g, ""))];
    }
    if (payer.first_name) userData.fn = [sha256_(String(payer.first_name).trim().split(/\s+/)[0].toLowerCase())];
    if (meta.fbp) userData.fbp = String(meta.fbp);
    if (meta.fbc) userData.fbc = String(meta.fbc);
    if (meta.client_ip) userData.client_ip_address = String(meta.client_ip);
    if (meta.user_agent) userData.client_user_agent = String(meta.user_agent);

    var fecha = new Date(payment.date_approved || payment.date_created || Date.now());
    var payload = {
      data: [{
        event_name: "Purchase",
        event_time: Math.floor(fecha.getTime() / 1000),
        event_id: "purchase_" + payment.id,
        event_source_url: "https://wearesrv.com/",
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: moneda,
          value: monto,
          content_name: curso.nombre,
          content_ids: [curso.itemId],
          content_type: "product",
          order_id: String(payment.id)
        }
      }]
    };

    var res = UrlFetchApp.fetch("https://graph.facebook.com/v23.0/" + pixelId + "/events?access_token=" + token, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    if (res.getResponseCode() !== 200) {
      Logger.log("CAPI error: " + res.getResponseCode() + " " + res.getContentText());
    }
  } catch (err) {
    // Meta nunca debe frenar la entrega del curso
    Logger.log("CAPI error: " + err);
  }
}

function responder_(status) {
  return ContentService.createTextOutput(JSON.stringify({ status: status }))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatearMonto_(monto) {
  return Number(monto).toLocaleString("es-AR");
}

// ============================================================
//  EMAIL HTML DEL ALUMNO
//  accesos = [{ nombre, link }]: un botón por carpeta (uno para un curso, varios para un combo)
//  preventa = true: la carpeta todavía está vacía; el texto avisa cuándo aparecen las clases
// ============================================================
function construirEmailHtml_(curso, nombre, email, monto, accesos, preventa) {
  var nombreSeguro = escaparHtml_(nombre);
  var emailSeguro = escaparHtml_(email);
  var esCombo = accesos.length > 1;
  var etiquetaBadge = preventa ? "PAGO APROBADO • LUGAR RESERVADO" : "PAGO APROBADO • ACCESO VITALICIO";

  var botones = accesos.map(function (a) {
    var etiqueta = esCombo
      ? "Acceder a " + escaparHtml_(a.nombre)
      : preventa ? "Ir a mi carpeta de Google Drive" : "Acceder a la Carpeta de Google Drive";
    return `
            <tr>
              <td align="center" style="padding: 5px 30px 12px 30px;">
                <a href="${escaparHtml_(a.link)}" target="_blank" style="background-color:#0b78fb; border-radius:8px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 28px; display:inline-block; box-shadow:0 4px 10px rgba(11, 120, 251, 0.4);">
                  ${etiqueta}
                </a>
              </td>
            </tr>`;
  }).join("");

  var textoAcceso;
  if (preventa && esCombo) {
    textoAcceso =
      "Tu lugar quedó reservado al <strong>precio de preventa</strong>. Ya tenés acceso a tus <strong>" + accesos.length + " carpetas</strong> privadas de Google Drive (asociadas a este correo): " +
      "<strong style=\"color:#f6950a;\">el " + escaparHtml_(curso.preventa.fechaTexto) + " vas a encontrar " + escaparHtml_(curso.preventa.queEncontrara || "las clases") + "</strong>. " +
      "El resto del material ya está disponible. Guardá este mail con los links: no tenés que hacer nada más.";
  } else if (preventa) {
    textoAcceso =
      "Tu lugar quedó reservado al <strong>precio de preventa</strong>. Ya tenés acceso a tu carpeta privada de Google Drive (asociada a este correo): " +
      "<strong style=\"color:#f6950a;\">el " + escaparHtml_(curso.preventa.fechaTexto) + " vas a encontrar ahí " + escaparHtml_(curso.preventa.queEncontrara || "las clases") + "</strong>. " +
      "Hasta ese día la carpeta va a estar vacía, es normal. Guardá este mail con el link: no tenés que hacer nada más.";
  } else if (esCombo) {
    textoAcceso =
      "Ya se encuentra habilitado tu acceso exclusivo y privado a las <strong>" + accesos.length + " carpetas</strong> del material de estudio en Google Drive (asociado a este correo). " +
      "Te recomendamos seguir el orden: primero " + escaparHtml_(accesos[0].nombre) + " y después " + escaparHtml_(accesos[accesos.length - 1].nombre) + ".";
  } else {
    textoAcceso = "Ya se encuentra habilitado tu acceso exclusivo y privado al material de estudio en Google Drive (asociado a este correo).";
  }

  // Drive no pudo compartir alguna carpeta (casi siempre: el mail no es una cuenta de Google)
  if (accesos.some(function (a) { return a.compartida === false; })) {
    textoAcceso +=
      "<br><br><strong style=\"color:#f6950a;\">⚠️ No pudimos habilitar automáticamente el acceso a este correo.</strong> " +
      "Respondé este mail indicando una cuenta de Gmail (o de Google) y te habilitamos el acceso a mano a la brevedad.";
  }

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso a ${curso.nombre}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#000000; font-family:'Roboto', Arial, sans-serif; color:#ffffff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; padding: 20px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0d0d0d; border:1px solid #0b78fb; border-radius:12px; width:100%; max-width:600px;">
            <tr>
              <td style="padding: 25px 30px 10px 30px;" align="center">
                <img src="${CONFIG.LOGO_URL}" alt="SRV Logo" style="max-width:140px; height:auto; display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 10px 30px;" align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border:1px solid #0b78fb; border-radius:50px; padding: 4px 12px; color:#0b78fb; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                      ${etiquetaBadge}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 0px 30px; font-size:24px; font-weight:900; text-transform:uppercase; color:#ffffff; line-height:1.2;">
                ${curso.tituloHtml}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; font-size:15px; line-height:1.6; color:#ffffff;">
                ¡Hola <strong style="color:#f6950a;">${nombreSeguro}</strong>!<br><br>
                Tu pago de <strong>$${formatearMonto_(monto)} ARS</strong> se acreditó con éxito. ${textoAcceso}
              </td>
            </tr>
            ${botones}
            <tr>
              <td style="padding: 8px 30px 20px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; border:1px solid #f6950a; border-radius:8px; padding:15px;">
                  <tr>
                    <td style="color:#f6950a; font-size:12px; font-weight:bold; text-transform:uppercase; padding-bottom:5px;">
                      Nota de Seguridad Importante
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#cccccc; font-size:13px; line-height:1.6;">
                      El acceso está vinculado exclusivamente a tu cuenta de correo (${emailSeguro}). Los enlaces externos no funcionarán si se comparten con cuentas no autorizadas.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 25px 30px; font-size:14px; line-height:1.6; color:#ffffff; border-top:1px dashed #333333;">
                Ante cualquier duda, contactanos respondiendo a este mail o escribinos a soporte.<br><br>
                ¡Bienvenido a la comunidad!<br>
                <strong>Marcos Costa Schmite</strong><br>
                <span style="color:#0b78fb; font-size:12px;">SRV | Somos Revolución</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// Mail al comprador cuando el pago está aprobado pero el acceso no se pudo dar automáticamente
// (falta la carpeta, monto distinto, etc.): sabe que el pago llegó y que el acceso se habilita a mano.
function construirEmailPendienteHtml_(curso, nombre, monto) {
  return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="margin:0; padding:0; background-color:#000000; font-family:'Roboto', Arial, sans-serif; color:#ffffff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; padding: 20px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0d0d0d; border:1px solid #0b78fb; border-radius:12px; width:100%; max-width:600px;">
            <tr>
              <td style="padding: 25px 30px 10px 30px;" align="center">
                <img src="${CONFIG.LOGO_URL}" alt="SRV Logo" style="max-width:140px; height:auto; display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 0px 30px; font-size:24px; font-weight:900; text-transform:uppercase; color:#ffffff; line-height:1.2;">
                ${curso.tituloHtml}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; font-size:15px; line-height:1.6; color:#ffffff;">
                ¡Hola <strong style="color:#f6950a;">${escaparHtml_(nombre)}</strong>!<br><br>
                Recibimos tu pago de <strong>$${formatearMonto_(monto)} ARS</strong>. Estamos habilitando tu acceso a
                <strong>${curso.nombre}</strong> y te llega en otro mail en las próximas horas.<br><br>
                Si querés que usemos otra cuenta de Gmail para el acceso, respondé este mail y decinos cuál.
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 25px 30px; font-size:14px; line-height:1.6; color:#ffffff; border-top:1px dashed #333333;">
                ¡Gracias por tu compra!<br>
                <strong>Marcos Costa Schmite</strong><br>
                <span style="color:#0b78fb; font-size:12px;">SRV | Somos Revolución</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// ============================================================
//  REPROCESAR UN PAGO A MANO (ej. si falló la API de MP, el lock o faltaba la carpeta)
//  Cambiar el ID y ejecutar desde el editor. Pasa por las mismas validaciones,
//  pero ignora el antiduplicados para poder dar el acceso que quedó pendiente.
//  ⚠️ Usalo solo con pagos que todavía NO recibieron acceso (revisá la hoja antes).
// ============================================================
function reprocesarPagoManual() {
  var paymentId = "PEGAR_ID_DEL_PAGO";
  var accessToken = PropertiesService.getScriptProperties().getProperty("MP_ACCESS_TOKEN");
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    Logger.log(procesarPago_(paymentId, accessToken, true).getContent());
  } finally {
    lock.releaseLock();
  }
}

// ============================================================
//  AVISO DE APERTURA DE UNA PREVENTA (ejecutar a mano el día del lanzamiento)
//  Primero subí las clases a la carpeta. Después corré esto: le manda un mail a cada comprador
//  APROBADO del curso que figura en la hoja, avisando que las clases ya están. Marca cada fila con
//  "AVISO_APERTURA_ENVIADO" en Detalle, así se puede volver a correr sin mandar dos veces.
// ============================================================
var MARCA_AVISO_APERTURA = "AVISO_APERTURA_ENVIADO";

function avisarAperturaScratch() {
  avisarApertura_("scratch");
}

function avisarApertura_(cursoKey) {
  var curso = CURSOS[cursoKey];
  if (!curso) throw new Error("No existe el curso " + cursoKey + " en CURSOS");
  if (!carpetaConfigurada_(curso.folderId)) throw new Error("Falta el folderId de " + curso.nombre + " en CURSOS");

  var link = DriveApp.getFolderById(curso.folderId).getUrl();
  // También se avisa a quienes lo compraron dentro de un combo (ej. "Combo Scratch + Scripting")
  var nombresValidos = nombresQueEntregan_(cursoKey);
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    Logger.log("La hoja está vacía: no hay a quién avisar.");
    return;
  }

  // Columnas: A Fecha, B Payment ID, C Detalle, D Estado, E Curso, F Nombre, G Email
  var filas = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var avisados = {};
  var enviados = 0;

  for (var i = 0; i < filas.length; i++) {
    var detalle = String(filas[i][2] || "");
    var estado = String(filas[i][3] || "");
    var nombreCurso = String(filas[i][4] || "");
    var nombre = String(filas[i][5] || "Estudiante");
    var email = String(filas[i][6] || "").trim().toLowerCase();

    if (estado !== ESTADO_APROBADO || nombresValidos.indexOf(nombreCurso) === -1) continue;
    if (detalle.indexOf(MARCA_AVISO_APERTURA) !== -1 || avisados[email] || !email) continue;

    try {
      GmailApp.sendEmail(email, "¡Ya están las clases de " + curso.nombre + "!", "", {
        name: CONFIG.NOMBRE_REMITENTE,
        replyTo: CONFIG.EMAIL_ADMIN,
        htmlBody: construirEmailAperturaHtml_(curso, nombre, email, link)
      });
      avisados[email] = true;
      enviados++;
      var nuevoDetalle = (detalle ? detalle + " | " : "") + MARCA_AVISO_APERTURA;
      sheet.getRange(i + 2, COL_DETALLE).setValue(sanitizarCelda_(nuevoDetalle));
    } catch (err) {
      Logger.log("No se pudo avisar a " + email + ": " + err);
    }
  }

  Logger.log("Avisos de apertura de " + curso.nombre + " enviados: " + enviados);
  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "📣 Apertura de " + curso.nombre + ": " + enviados + " avisos enviados",
    body: "Se avisó a " + enviados + " compradores que las clases ya están en la carpeta.\n\nCarpeta: " + link
  });
}

function construirEmailAperturaHtml_(curso, nombre, email, link) {
  var nombreSeguro = escaparHtml_(nombre);
  var emailSeguro = escaparHtml_(email);
  var linkSeguro = escaparHtml_(link);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ya están las clases de ${curso.nombre}</title>
  </head>
  <body style="margin:0; padding:0; background-color:#000000; font-family:'Roboto', Arial, sans-serif; color:#ffffff;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; padding: 20px 0;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color:#0d0d0d; border:1px solid #0b78fb; border-radius:12px; width:100%; max-width:600px;">
            <tr>
              <td style="padding: 25px 30px 10px 30px;" align="center">
                <img src="${CONFIG.LOGO_URL}" alt="SRV Logo" style="max-width:140px; height:auto; display:block;" />
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 10px 30px;" align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border:1px solid #00bf63; border-radius:50px; padding: 4px 12px; color:#00bf63; font-size:11px; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                      ¡YA ESTÁN LAS CLASES!
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 0px 30px; font-size:24px; font-weight:900; text-transform:uppercase; color:#ffffff; line-height:1.2;">
                ${curso.tituloHtml}
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; font-size:15px; line-height:1.6; color:#ffffff;">
                ¡Hola <strong style="color:#f6950a;">${nombreSeguro}</strong>!<br><br>
                Llegó el día: las clases de <strong>${curso.nombre}</strong> ya están en tu carpeta de Google Drive. Entrá con la cuenta <strong>${emailSeguro}</strong>, que es la que tiene el acceso, y arrancá por el Módulo 1.
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 5px 30px 25px 30px;">
                <a href="${linkSeguro}" target="_blank" style="background-color:#0b78fb; border-radius:8px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 28px; display:inline-block; box-shadow:0 4px 10px rgba(11, 120, 251, 0.4);">
                  Ver las clases en Google Drive
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 25px 30px; font-size:14px; line-height:1.6; color:#ffffff; border-top:1px dashed #333333;">
                Ante cualquier duda, respondé este mail.<br><br>
                ¡Que lo disfruten!<br>
                <strong>Marcos Costa Schmite</strong><br>
                <span style="color:#0b78fb; font-size:12px;">SRV | Somos Revolución</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

// ============================================================
//  PRUEBA MANUAL (ejecutar desde el editor de Apps Script)
// ============================================================
function probarConfiguracion() {
  var props = PropertiesService.getScriptProperties();
  var token = props.getProperty("MP_ACCESS_TOKEN");
  var secret = props.getProperty("WEBHOOK_SECRET");

  Logger.log("MP_ACCESS_TOKEN: " + (token ? "OK" : "FALTA"));
  Logger.log("WEBHOOK_SECRET: " + (secret ? (secret.length >= 32 ? "OK" : "MUY CORTO (usá 32+ caracteres)") : "FALTA"));
  Logger.log("Cyber SRV: " + (enCyber_(new Date()) ? "ACTIVO (mínimos al 50%)" : "inactivo (rige del 2 al 4/11/2026)"));

  for (var key in CURSOS) {
    if (!Object.prototype.hasOwnProperty.call(CURSOS, key)) continue;
    var curso = CURSOS[key];

    if (curso.pack) continue; // los packs se generan solos a partir de los cursos de abajo

    // Un combo no tiene carpeta propia: se verifica que sus cursos existan (sus carpetas se revisan abajo)
    if (curso.incluye) {
      var faltan = curso.incluye.filter(function (k) { return !CURSOS[k]; });
      Logger.log("Combo " + curso.nombre + ": incluye " + curso.incluye.join(" + ") +
        (faltan.length ? " -> ❌ no existen en CURSOS: " + faltan.join(", ") : " -> OK"));
      continue;
    }

    if (curso.preventa) {
      Logger.log("Preventa " + curso.nombre + ": " + (enPreventa_(curso, new Date())
        ? "ACTIVA hasta el " + curso.preventa.fechaTexto + " (mínimo $" + curso.preventa.precioMinimo + ")"
        : "terminada (mínimo $" + curso.precioMinimo + ")"));
    }

    if (!carpetaConfigurada_(curso.folderId)) {
      Logger.log("Carpeta " + curso.nombre + ": ❌ falta cargar el folderId en CURSOS");
      continue;
    }
    try {
      var folder = DriveApp.getFolderById(curso.folderId);
      Logger.log("Carpeta " + curso.nombre + ": " + folder.getName() + " -> OK");
    } catch (err) {
      Logger.log("Carpeta " + curso.nombre + ": ❌ revisá el folderId (" + err + ")");
    }
  }

  getSheet_();
  Logger.log("Hoja '" + CONFIG.SHEET_NAME + "' lista.");

  if (token) {
    var r = UrlFetchApp.fetch("https://api.mercadopago.com/users/me", {
      headers: { Authorization: "Bearer " + token },
      muteHttpExceptions: true
    });
    Logger.log("Mercado Pago: HTTP " + r.getResponseCode() + (r.getResponseCode() === 200 ? " (token válido)" : " (revisá el token)"));
  }
}
