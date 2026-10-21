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
 *     ⚠️ NUNCA pegues el token directamente en el código.
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
var FOLDER_PENDIENTE = "1J8obsPj9OZZod4ZbIqNy-OKg8fuTb-cZ";

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
    folderId: FOLDER_PENDIENTE // ⚠️ Reemplazar por el ID de la carpeta de Drive del curso
  },
  "scripting": {
    itemId: "curso-scripting",
    nombre: "Curso de Scripting",
    tituloHtml: 'CURSO DE <span style="color:#f6950a;">SCRIPTING</span> DESDE CERO',
    precioMinimo: 15000,
    folderId: FOLDER_PENDIENTE // ⚠️ Reemplazar por el ID de la carpeta de Drive del curso
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
  // COMBO: Master en JavaScript + Backend Avanzado en un solo pago. Sin carpeta propia:
  // comparte las carpetas de los cursos listados en "incluye" (mismo orden en el mail).
  "ruta-backend": {
    itemId: "curso-ruta-backend",
    nombre: "Ruta Backend Completa",
    tituloHtml: 'RUTA <span style="color:#f6950a;">BACKEND</span> COMPLETA',
    precioMinimo: 149900,
    incluye: ["fundamentos-backend", "backend-avanzado"]
  }
};

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
  var fila = { paymentId: paymentId, nombre: nombre, email: email, telefono: telefono, monto: monto };
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
  var minimo = precioMinimo_(curso, fechaPago);

  // VALIDACIONES ANTES DE DAR ACCESO
  var problemas = [];
  if (moneda !== CONFIG.MONEDA) problemas.push("Moneda inválida: " + moneda);
  if (monto < minimo) problemas.push("Monto bajo: $" + monto + " (mínimo $" + minimo + (preventa ? " en preventa" : "") + ")");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problemas.push("Email inválido: " + email);
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
        "No se otorgó acceso automático. Revisalo en Mercado Pago."
    });
    return responder_("validation_failed");
  }

  // Registrar ANTES de dar acceso: si algo falla después, un reintento de MP no duplica el envío
  fila.estado = ESTADO_APROBADO;
  if (preventa) fila.detalle = "Preventa: clases el " + curso.preventa.fechaTexto;
  var numFila = registrar_(fila);

  // SEGURIDAD DE DRIVE: acceso solo de lectura y solo para el email del comprador.
  // Se comparte cada carpeta por separado: si una falla, las demás igual se entregan.
  var accesos = [];
  var notas = [];
  for (var c = 0; c < carpetas.length; c++) {
    var carpeta = carpetas[c];
    var linkDrive = "https://drive.google.com/drive/folders/" + carpeta.folderId;
    try {
      var folder = DriveApp.getFolderById(carpeta.folderId);
      folder.addViewer(email);
      linkDrive = folder.getUrl();
    } catch (driveErr) {
      notas.push("Drive (" + carpeta.nombre + "): " + driveErr);
      MailApp.sendEmail({
        to: CONFIG.EMAIL_ADMIN,
        subject: "⚠️ " + curso.nombre + ": no se pudo compartir la carpeta de " + carpeta.nombre,
        body:
          "Pago ID: " + paymentId + "\nEmail: " + email + "\n\nError: " + driveErr +
          "\n\nCompartí la carpeta manualmente (puede ser un email que no es cuenta de Google)."
      });
    }
    accesos.push({ nombre: carpeta.nombre, link: linkDrive });
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

// Carpetas de Drive que entrega un curso: la propia, o las de los cursos que incluye si es un combo
function carpetasDeCurso_(curso) {
  if (curso.incluye && curso.incluye.length) {
    return curso.incluye.map(function (key) {
      var c = CURSOS[key];
      return { nombre: c.nombre, folderId: c.folderId };
    });
  }
  return [{ nombre: curso.nombre, folderId: curso.folderId }];
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

// Precio mínimo aceptado para un pago: el de preventa si corresponde, si no el regular
function precioMinimo_(curso, fechaPago) {
  return enPreventa_(curso, fechaPago) ? curso.preventa.precioMinimo : curso.precioMinimo;
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
    sheet.appendRow(["Fecha", "Payment ID", "Detalle", "Estado", "Curso", "Nombre", "Email", "Teléfono", "Monto"]);
    sheet.setFrozenRows(1);
    // Columna Payment ID como texto plano para que no se convierta a número
    sheet.getRange("B:B").setNumberFormat("@");
    // Filtro listo para usar por curso, estado, etc.
    sheet.getRange(1, 1, 1, 9).createFilter();
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
    Number(datos.monto) || 0
  ]);
  return sheet.getLastRow();
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
  if (preventa) {
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

    if (estado !== ESTADO_APROBADO || nombreCurso !== curso.nombre) continue;
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

  for (var key in CURSOS) {
    if (!Object.prototype.hasOwnProperty.call(CURSOS, key)) continue;
    var curso = CURSOS[key];

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
