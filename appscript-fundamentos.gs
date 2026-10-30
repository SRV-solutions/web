/**
 * ============================================================
 *  FUNDAMENTOS IA (gratis) -> REGISTRO + ACCESO AL DRIVE
 * ============================================================
 *
 *  Recibe cada registro del formulario de wearesrv.com/fundamentos-ia (que postea a
 *  Netlify Forms) a través de un webhook saliente de Netlify, y hace todo solo:
 *    1. Guarda nombre, email y celular en la hoja "Fundamentos IA".
 *    2. Comparte la carpeta de Drive del material (solo lectura) con ese email.
 *    3. Le manda el mail de bienvenida con el botón a la carpeta.
 *    4. Te avisa a vos por mail de cada registro nuevo.
 *
 *  Si la carpeta todavía no está configurada (FOLDER_ID = "SIN FOLDER"), el registro
 *  queda guardado como REGISTRADO y el mail de bienvenida avisa que el acceso llega
 *  apenas esté el primer material. Cuando la carpeta esté lista: completás FOLDER_ID,
 *  pegás la versión nueva y ejecutás darAccesoPendientes() una vez desde el editor:
 *  comparte la carpeta y manda el mail de acceso a todos los que estaban esperando.
 *
 *  E-STELLARIUM: cuando la plataforma esté disponible y tenga forma de dar altas
 *  (API o planilla), el acceso se suma acá, en darAcceso_(). Mientras tanto el mail
 *  ya avisa que el acceso a E-stellarium se habilita con este mismo correo.
 *
 *  CONFIGURACIÓN INICIAL (una sola vez; es un proyecto SEPARADO del de pagos,
 *  porque cada proyecto de Apps Script tiene un solo doPost):
 *
 *  1. Crear una Google Sheet nueva ("Registros Fundamentos IA") -> Extensiones ->
 *     Apps Script -> pegar este archivo.
 *  2. Configuración del proyecto (ícono ⚙️) -> "Propiedades de la secuencia de comandos":
 *       FORM_SECRET = una clave inventada por vos, larga y aleatoria (40+ caracteres).
 *     ⚠️ NUNCA pegues la clave directamente en el código.
 *  3. Completar FOLDER_ID (abajo en CONFIG) con el ID de la carpeta de Drive del
 *     material. Si todavía no existe, dejá "SIN FOLDER": los registros quedan en
 *     espera y después corrés darAccesoPendientes().
 *  4. Ejecutar una vez probarConfiguracion() para autorizar permisos (Drive, Gmail,
 *     Sheets) y verificar que todo esté OK.
 *  5. Implementar -> Nueva implementación -> Aplicación web
 *       Ejecutar como: Yo   |   Quién tiene acceso: Cualquier usuario
 *     Copiar la URL (termina en /exec).
 *  6. En Netlify: Project configuration -> Notifications -> Form submission
 *     notifications -> Add notification -> "Outgoing webhook":
 *       Event: New form submission   |   Form: fundamentos-ia
 *       URL: la del paso 5 + "?key=" + tu FORM_SECRET
 *     (ejemplo: https://script.google.com/macros/s/XXXX/exec?key=TU_CLAVE)
 *
 *  ⚠️ Después de pegar una versión nueva: Implementar -> Gestionar implementaciones ->
 *  editar (lápiz) -> Versión: "Nueva versión" -> Implementar. Así la URL /exec no cambia.
 * ============================================================
 */

var CONFIG = {
  EMAIL_ADMIN: "marcos.schmite@gmail.com",
  NOMBRE_REMITENTE: "WEARESRV",
  LOGO_URL: "https://wearesrv.com/SRV-LOGO.png",
  SHEET_NAME: "Fundamentos IA",
  // ID de la carpeta de Drive con los videos y las guías de Fundamentos IA.
  // Mientras diga "SIN FOLDER" los registros quedan en espera (estado REGISTRADO).
  FOLDER_ID: "SIN FOLDER"
};

var FOLDER_PENDIENTE = "SIN FOLDER";

// Estados de la hoja
var ESTADO_REGISTRADO = "REGISTRADO"; // guardado, esperando que exista la carpeta
var ESTADO_ACCESO = "ACCESO";         // carpeta compartida y mail de acceso enviado

// Columnas de la hoja (1 = A)
var COL_FECHA = 1;
var COL_NOMBRE = 2;
var COL_EMAIL = 3;
var COL_CELULAR = 4;
var COL_ESTADO = 5;
var COL_DETALLE = 6;
var TOTAL_COLS = 6;

// ============================================================
//  ENTRADA DEL WEBHOOK (Netlify -> acá)
// ============================================================
function doPost(e) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty("FORM_SECRET");
    if (!secret) {
      registrar_({ estado: "ERROR_CONFIG", detalle: "Falta FORM_SECRET en Propiedades del script" });
      return responder_("config_error");
    }

    var params = (e && e.parameter) || {};
    // La clave viaja en la URL del webhook (?key=...): descarta llamadas ajenas
    if (!compararSeguro_(String(params.key || ""), secret)) {
      return responder_("unauthorized");
    }

    // Netlify manda un JSON con los campos del formulario dentro de "data".
    // También se aceptan los campos directo en el body (por si algún día el
    // formulario de la web postea acá sin pasar por Netlify).
    var body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (parseErr) { body = {}; }
    }
    var campos = body.data || body || {};

    var nombre = String(campos.nombre || params.nombre || "").trim() || "Estudiante";
    var email = String(campos.email || params.email || "").trim().toLowerCase();
    var celular = String(campos.celular || params.celular || "").trim();

    if (!emailValido_(email)) {
      registrar_({ nombre: nombre, celular: celular, estado: "EMAIL_INVALIDO", detalle: "Email recibido: " + email });
      return responder_("invalid_email");
    }

    // Lock: evita duplicados si llegan dos registros al mismo tiempo
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(30000)) {
      registrar_({ nombre: nombre, email: email, celular: celular, estado: "LOCK_TIMEOUT", detalle: "Reintentar a mano con darAccesoPendientes()" });
      return responder_("busy");
    }

    try {
      return procesarRegistro_(nombre, email, celular);
    } finally {
      lock.releaseLock();
    }

  } catch (error) {
    registrar_({ estado: "CRITICAL_ERROR", detalle: String(error && error.stack ? error.stack : error) });
    return responder_("error");
  }
}

function doGet() {
  return responder_("ok");
}

// ============================================================
//  LÓGICA PRINCIPAL
// ============================================================
function procesarRegistro_(nombre, email, celular) {
  // ANTIDUPLICADOS: si el mail ya está en la hoja no se agrega otra fila.
  // Si estaba esperando (REGISTRADO) y la carpeta ya existe, se le da el acceso ahora.
  var filaExistente = buscarEmail_(email);
  if (filaExistente) {
    var estado = String(getSheet_().getRange(filaExistente, COL_ESTADO).getValue());
    if (estado === ESTADO_ACCESO) return responder_("already_registered");
    if (estado === ESTADO_REGISTRADO && carpetaConfigurada_()) {
      entregarAcceso_(filaExistente, nombre, email);
      return responder_("access_granted");
    }
    return responder_("already_registered");
  }

  var numFila;
  if (carpetaConfigurada_()) {
    numFila = registrar_({ nombre: nombre, email: email, celular: celular, estado: ESTADO_REGISTRADO });
    entregarAcceso_(numFila, nombre, email);
  } else {
    numFila = registrar_({ nombre: nombre, email: email, celular: celular, estado: ESTADO_REGISTRADO, detalle: "En espera: falta FOLDER_ID" });
    // Mail de bienvenida sin link: avisa que el acceso llega con el primer material
    try {
      GmailApp.sendEmail(email, "¡Ya estás en Fundamentos IA! - WEARESRV", "", {
        name: CONFIG.NOMBRE_REMITENTE,
        replyTo: CONFIG.EMAIL_ADMIN,
        htmlBody: construirEmailHtml_(nombre, null)
      });
    } catch (mailErr) {
      getSheet_().getRange(numFila, COL_DETALLE).setValue(sanitizarCelda_("Mail bienvenida: " + mailErr));
    }
  }

  avisarAdmin_(nombre, email, celular);
  return responder_("success");
}

// Comparte la carpeta con el email, manda el mail de acceso y marca la fila como ACCESO.
// E-STELLARIUM (TODO): cuando la plataforma tenga API o planilla de altas, el alta va acá.
function entregarAcceso_(numFila, nombre, email) {
  var sheet = getSheet_();
  var linkDrive = "https://drive.google.com/drive/folders/" + CONFIG.FOLDER_ID;
  try {
    var folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
    folder.addViewer(email);
    linkDrive = folder.getUrl();
  } catch (driveErr) {
    sheet.getRange(numFila, COL_ESTADO).setValue("ERROR_DRIVE");
    sheet.getRange(numFila, COL_DETALLE).setValue(sanitizarCelda_(String(driveErr)));
    MailApp.sendEmail({
      to: CONFIG.EMAIL_ADMIN,
      subject: "⚠️ Fundamentos IA: no se pudo compartir la carpeta",
      body:
        "Email: " + email + "\nNombre: " + nombre + "\n\nError: " + driveErr +
        "\n\nCompartí la carpeta a mano (puede ser un email que no es cuenta de Google)."
    });
    return;
  }

  try {
    GmailApp.sendEmail(email, "Tu acceso a Fundamentos IA - WEARESRV", "", {
      name: CONFIG.NOMBRE_REMITENTE,
      replyTo: CONFIG.EMAIL_ADMIN,
      htmlBody: construirEmailHtml_(nombre, linkDrive)
    });
  } catch (mailErr) {
    sheet.getRange(numFila, COL_DETALLE).setValue(sanitizarCelda_("Carpeta compartida, pero falló el mail: " + mailErr));
  }

  sheet.getRange(numFila, COL_ESTADO).setValue(ESTADO_ACCESO);
}

function avisarAdmin_(nombre, email, celular) {
  try {
    var total = Math.max(getSheet_().getLastRow() - 1, 0);
    MailApp.sendEmail({
      to: CONFIG.EMAIL_ADMIN,
      subject: "📩 Nuevo registro en Fundamentos IA (" + total + " en total)",
      body:
        "¡Hola Marcos! Alguien se anotó en Fundamentos IA.\n\n" +
        "Nombre: " + nombre + "\n" +
        "Email: " + email + "\n" +
        "Celular: " + (celular || "-") + "\n\n" +
        (carpetaConfigurada_()
          ? "Ya se le compartió la carpeta de Drive y le llegó el mail de acceso."
          : "Quedó en espera (falta FOLDER_ID): cuando la carpeta esté, corré darAccesoPendientes().")
    });
  } catch (err) {
    Logger.log("No se pudo avisar al admin: " + err);
  }
}

// ============================================================
//  EJECUCIONES MANUALES (desde el editor)
// ============================================================

// Después de completar FOLDER_ID: comparte la carpeta y manda el mail de acceso
// a todos los que quedaron esperando (estado REGISTRADO o ERROR_DRIVE).
function darAccesoPendientes() {
  if (!carpetaConfigurada_()) throw new Error("Primero completá CONFIG.FOLDER_ID con el ID de la carpeta de Drive");
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) { Logger.log("No hay registros"); return; }
  var datos = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
  var entregados = 0;
  for (var i = 0; i < datos.length; i++) {
    var estado = String(datos[i][COL_ESTADO - 1]);
    var email = String(datos[i][COL_EMAIL - 1]).trim().toLowerCase();
    if ((estado !== ESTADO_REGISTRADO && estado !== "ERROR_DRIVE") || !emailValido_(email)) continue;
    entregarAcceso_(i + 2, String(datos[i][COL_NOMBRE - 1]) || "Estudiante", email);
    entregados++;
  }
  Logger.log("Accesos entregados: " + entregados);
}

// Verifica la configuración y autoriza los permisos. Ejecutala una vez al principio
// y después de cada cambio de configuración.
function probarConfiguracion() {
  var mensajes = [];

  var secret = PropertiesService.getScriptProperties().getProperty("FORM_SECRET");
  mensajes.push(secret && secret.length >= 20 ? "✅ FORM_SECRET configurado" : "❌ Falta FORM_SECRET (o es muy corto) en Propiedades del script");

  if (carpetaConfigurada_()) {
    try {
      var folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
      mensajes.push("✅ Carpeta de Drive OK: " + folder.getName());
    } catch (err) {
      mensajes.push("❌ No se pudo abrir la carpeta FOLDER_ID: " + err);
    }
  } else {
    mensajes.push("⚠️ FOLDER_ID sin completar: los registros quedan en espera (después corré darAccesoPendientes())");
  }

  var sheet = getSheet_();
  var total = Math.max(sheet.getLastRow() - 1, 0);
  mensajes.push("✅ Hoja \"" + CONFIG.SHEET_NAME + "\" OK: " + total + " registro(s)");

  var resumen = mensajes.join("\n");
  Logger.log(resumen);
  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "Prueba de configuración: Fundamentos IA",
    body: resumen + "\n\nSi todo está ✅, implementá como Aplicación web y pegá la URL (+ ?key=...) en el webhook de Netlify Forms."
  });
}

// ============================================================
//  HELPERS
// ============================================================
function carpetaConfigurada_() {
  return !!CONFIG.FOLDER_ID && CONFIG.FOLDER_ID !== FOLDER_PENDIENTE;
}

function emailValido_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Devuelve el número de fila donde ya está ese email, o 0 si no está
function buscarEmail_(email) {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;
  var celda = sheet.getRange(2, COL_EMAIL, lastRow - 1, 1)
    .createTextFinder(email)
    .matchEntireCell(true)
    .findNext();
  return celda ? celda.getRow() : 0;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
    sheet.appendRow(["Fecha", "Nombre", "Email", "Celular", "Estado", "Detalle"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, TOTAL_COLS).createFilter();
  }
  return sheet;
}

// Registra una fila y devuelve su número
function registrar_(datos) {
  var sheet = getSheet_();
  sheet.appendRow([
    new Date(),
    sanitizarCelda_(datos.nombre || ""),
    sanitizarCelda_(datos.email || ""),
    sanitizarCelda_(datos.celular || ""),
    datos.estado || "",
    sanitizarCelda_(datos.detalle || "")
  ]);
  return sheet.getLastRow();
}

// Evita inyección de fórmulas en la planilla (=, +, -, @ al inicio)
function sanitizarCelda_(valor) {
  var s = String(valor);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// Evita inyección de HTML en el email (nombre del registrado, etc.)
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

// ============================================================
//  EMAIL HTML DE BIENVENIDA
//  linkDrive = null: la carpeta todavía no está; el texto avisa que el acceso llega
//  con el primer material. Con link: botón directo a la carpeta.
// ============================================================
function construirEmailHtml_(nombre, linkDrive) {
  var nombreSeguro = escaparHtml_(nombre);
  var etiquetaBadge = linkDrive ? "REGISTRO CONFIRMADO • ACCESO HABILITADO" : "REGISTRO CONFIRMADO";

  var texto = linkDrive
    ? "¡Bienvenido a <strong>Fundamentos IA</strong>! Ya tenés acceso a la carpeta de Google Drive con los videos y las guías (asociado a este correo). Cada material nuevo aparece ahí y además te lo avisamos por mail."
    : "¡Bienvenido a <strong>Fundamentos IA</strong>! Quedaste en la lista: apenas el primer material esté listo, te llega a este mismo correo el acceso a la carpeta de Google Drive con todos los videos y las guías.";

  var boton = linkDrive
    ? `
            <tr>
              <td align="center" style="padding: 5px 30px 12px 30px;">
                <a href="${escaparHtml_(linkDrive)}" target="_blank" style="background-color:#0b78fb; border-radius:8px; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; padding:14px 28px; display:inline-block; box-shadow:0 4px 10px rgba(11, 120, 251, 0.4);">
                  Acceder a la Carpeta de Google Drive
                </a>
              </td>
            </tr>`
    : "";

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Fundamentos IA</title>
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
                FUNDAMENTOS DE <span style="color:#f6950a;">IA</span> · 100% GRATIS
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 30px; font-size:15px; line-height:1.6; color:#ffffff;">
                ¡Hola <strong style="color:#f6950a;">${nombreSeguro}</strong>!<br><br>
                ${texto}<br><br>
                Muy pronto también vas a poder entrar con este mismo correo a <strong>E-stellarium</strong>, nuestra plataforma educativa: cuando esté disponible te avisamos por acá.
              </td>
            </tr>
            ${boton}
            <tr>
              <td style="padding: 8px 30px 20px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#000000; border:1px solid #30a05a; border-radius:8px; padding:15px;">
                  <tr>
                    <td style="color:#30a05a; font-size:12px; font-weight:bold; text-transform:uppercase; padding-bottom:5px;">
                      Sumate a la comunidad
                    </td>
                  </tr>
                  <tr>
                    <td style="color:#cccccc; font-size:13px; line-height:1.6;">
                      Cada video y guía nueva se anuncia primero en
                      <a href="https://www.youtube.com/@weareSRV" style="color:#0b78fb;">YouTube</a> y en nuestro
                      <a href="https://discord.com/invite/QuAmDxrNMu" style="color:#0b78fb;">Discord</a>.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 30px 25px 30px; font-size:14px; line-height:1.6; color:#ffffff; border-top:1px dashed #333333;">
                Si no te anotaste vos, o querés darte de baja, respondé este mail y listo.<br><br>
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
