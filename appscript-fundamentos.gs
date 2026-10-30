/**
 * ============================================================
 *  FUNDAMENTOS IA (gratis) -> REGISTRO + ACCESO AL DRIVE
 * ============================================================
 *
 *  Recibe cada registro del formulario de wearesrv.com/fundamentos-ia (lo manda la Netlify
 *  Function registro-fundamentos) y hace todo solo:
 *    1. Guarda nombre, email y celular en la hoja "Fundamentos IA".
 *    2. Si la carpeta de Drive ya tiene material, la comparte (solo lectura) con ese email
 *       y le manda el mail de acceso. Si la carpeta está vacía, el registro queda EN_ESPERA.
 *    3. Cada hora entrega a los que esperan: apenas subís el material a la carpeta, a todos
 *       les llega el acceso solo, sin ejecutar nada a mano.
 *    4. Una vez por día te manda un resumen con los registros nuevos.
 *
 *  CUOTA DE MAILS: una cuenta de Gmail manda unos 100 mails por día desde Apps Script, y esa
 *  cuota es de la CUENTA: la comparte con el script de pagos. Este script nunca usa los
 *  últimos CONFIG.RESERVA_MAILS, que quedan para los mails de las compras. Si se llega a ese
 *  límite, los registros esperan y salen solos en la próxima hora con cuota disponible.
 *
 *  E-STELLARIUM: cuando la plataforma tenga forma de dar altas, se suma en entregarAcceso_().
 *
 *  CONFIGURACIÓN (una sola vez; es un proyecto SEPARADO del de pagos):
 *  1. Crear una Google Sheet nueva ("Registros Fundamentos IA") en la misma cuenta de Google
 *     que la planilla de pagos -> Extensiones -> Apps Script -> pegar este archivo -> Guardar.
 *  2. Ejecutar probarConfiguracion() y aceptar los permisos. La primera vez crea sola la
 *     carpeta "Fundamentos IA · WEARESRV" en tu Drive, la clave secreta y los activadores.
 *  3. Implementar -> Nueva implementación -> Aplicación web
 *       Ejecutar como: Yo   |   Quién tiene acceso: Cualquier usuario
 *  4. Volver a ejecutar probarConfiguracion(): te llega un mail con los dos valores para Netlify.
 *  5. En Netlify -> Project configuration -> Environment variables, agregar:
 *       FUNDAMENTOS_WEBHOOK_URL    = la URL /exec de la implementación
 *       FUNDAMENTOS_WEBHOOK_SECRET = la clave del mail
 *     y después Deploys -> Trigger deploy -> Deploy project (las variables toman efecto ahí).
 *  6. Subir los videos y las guías a la carpeta "Fundamentos IA · WEARESRV".
 *
 *  Para usar otra carpeta: Configuración del proyecto -> Propiedades -> cambiar FOLDER_ID.
 *  ⚠️ Después de pegar una versión nueva: Implementar -> Gestionar implementaciones ->
 *  editar (lápiz) -> Versión: "Nueva versión" -> Implementar. Así la URL /exec no cambia.
 * ============================================================
 */

var CONFIG = {
  EMAIL_ADMIN: "marcos.schmite@gmail.com",
  NOMBRE_REMITENTE: "WEARESRV",
  LOGO_URL: "https://wearesrv.com/SRV-LOGO.png",
  SHEET_NAME: "Fundamentos IA",
  NOMBRE_CARPETA: "Fundamentos IA · WEARESRV",
  RESERVA_MAILS: 40,  // mails por día que este script deja libres para el script de pagos
  HORA_RESUMEN: 9     // hora del resumen diario (zona horaria del proyecto)
};

// Estados de la hoja
var ESTADO_EN_ESPERA = "EN_ESPERA";   // guardado; recibe el acceso cuando haya material y cuota
var ESTADO_ACCESO = "ACCESO";         // carpeta compartida y mail de acceso enviado
var ESTADO_SIN_GOOGLE = "SIN_GOOGLE"; // el mail no es cuenta de Google: se le pidió que responda con un Gmail

// Columnas de la hoja (1 = A)
var COL_FECHA = 1;
var COL_NOMBRE = 2;
var COL_EMAIL = 3;
var COL_CELULAR = 4;
var COL_ESTADO = 5;
var COL_DETALLE = 6;
var TOTAL_COLS = 6;

// ============================================================
//  ENTRADA DEL WEBHOOK (Netlify Function -> acá)
// ============================================================
function doPost(e) {
  try {
    var secret = PropertiesService.getScriptProperties().getProperty("WEBHOOK_SECRET");
    if (!secret) {
      registrar_({ estado: "ERROR_CONFIG", detalle: "Falta WEBHOOK_SECRET: ejecutá probarConfiguracion()" });
      return responder_("config_error");
    }

    var params = (e && e.parameter) || {};
    if (!compararSeguro_(String(params.key || ""), secret)) {
      return responder_("unauthorized");
    }

    var body = {};
    if (e.postData && e.postData.contents) {
      try { body = JSON.parse(e.postData.contents); } catch (parseErr) { body = {}; }
    }

    var nombre = String(body.nombre || "").trim().slice(0, 80) || "Estudiante";
    var email = String(body.email || "").trim().toLowerCase().slice(0, 120);
    // Sin el "+" inicial: en la planilla, un valor que empieza con + puede tomarse como fórmula
    var celular = String(body.celular || "").replace(/^[\s=+\-@]+/, "").trim().slice(0, 25);

    if (!emailValido_(email)) {
      return responder_("invalid_email");
    }

    // Lock: evita duplicados si llegan dos registros juntos. Si no se consigue (por ejemplo,
    // mientras corre la entrega de cada hora), el registro igual se guarda y sale en la próxima.
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(20000)) {
      registrar_({ nombre: nombre, email: email, celular: celular, estado: ESTADO_EN_ESPERA, detalle: "Guardado sin lock" });
      return responder_("success");
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
  // ANTIDUPLICADOS: si el mail ya está en la hoja no se agrega otra fila
  if (buscarEmail_(email)) return responder_("already_registered");

  var numFila = registrar_({ nombre: nombre, email: email, celular: celular, estado: ESTADO_EN_ESPERA });
  var folder = carpetaConMaterial_();
  if (folder && hayCuota_()) entregarAcceso_(numFila, nombre, email, folder);
  return responder_("success");
}

// Comparte la carpeta con el email, manda el mail de acceso y actualiza el estado de la fila.
// Si el mail falla, la fila queda EN_ESPERA y la entrega de cada hora lo vuelve a intentar.
// E-STELLARIUM (TODO): cuando la plataforma tenga API o planilla de altas, el alta va acá.
function entregarAcceso_(numFila, nombre, email, folder) {
  var sheet = getSheet_();
  var compartida = true;
  try {
    folder.addViewer(email);
  } catch (driveErr) {
    compartida = false; // casi siempre: el mail no es una cuenta de Google
  }

  try {
    GmailApp.sendEmail(
      email,
      compartida ? "Tu acceso a Fundamentos IA - WEARESRV" : "Fundamentos IA: te falta un paso para el acceso",
      "",
      {
        name: CONFIG.NOMBRE_REMITENTE,
        replyTo: CONFIG.EMAIL_ADMIN,
        htmlBody: construirEmailHtml_(nombre, folder.getUrl(), compartida)
      }
    );
  } catch (mailErr) {
    sheet.getRange(numFila, COL_DETALLE).setValue(sanitizarCelda_("Mail: " + mailErr));
    return;
  }

  sheet.getRange(numFila, COL_ESTADO).setValue(compartida ? ESTADO_ACCESO : ESTADO_SIN_GOOGLE);
  sheet.getRange(numFila, COL_DETALLE).setValue(
    compartida ? "" : "No es cuenta de Google: si responde con un Gmail, compartile la carpeta a mano"
  );
}

// ============================================================
//  ACTIVADORES (los instala probarConfiguracion)
// ============================================================

// Cada hora: entrega el acceso a los que esperan, si la carpeta ya tiene material y hay cuota.
// También se puede ejecutar a mano desde el editor.
function entregarPendientes() {
  var folder = carpetaConMaterial_();
  if (!folder) { Logger.log("La carpeta todavía no tiene material"); return; }

  var lock = LockService.getScriptLock();
  if (!lock.tryLock(30000)) return;
  try {
    var sheet = getSheet_();
    var lastRow = sheet.getLastRow();
    if (lastRow < 2) return;
    var datos = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
    var inicio = Date.now();
    var entregados = 0;
    for (var i = 0; i < datos.length; i++) {
      if (String(datos[i][COL_ESTADO - 1]) !== ESTADO_EN_ESPERA) continue;
      // Corta antes del límite de 6 minutos de Apps Script y antes de tocar la reserva de mails
      if (Date.now() - inicio > 4 * 60 * 1000 || !hayCuota_()) break;
      var email = String(datos[i][COL_EMAIL - 1]).trim().toLowerCase();
      if (!emailValido_(email)) continue;
      entregarAcceso_(i + 2, String(datos[i][COL_NOMBRE - 1]) || "Estudiante", email, folder);
      entregados++;
    }
    Logger.log("Accesos entregados: " + entregados);
  } finally {
    lock.releaseLock();
  }
}

// Una vez por día: resumen de los registros de las últimas 24 horas (un solo mail, cuida la cuota)
function resumenDiario() {
  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  var datos = sheet.getRange(2, 1, lastRow - 1, TOTAL_COLS).getValues();
  var desde = Date.now() - 24 * 60 * 60 * 1000;
  var nuevos = [];
  var enEspera = 0;
  var sinGoogle = 0;
  for (var i = 0; i < datos.length; i++) {
    var fecha = datos[i][COL_FECHA - 1];
    var estado = String(datos[i][COL_ESTADO - 1]);
    if (estado === ESTADO_EN_ESPERA) enEspera++;
    if (estado === ESTADO_SIN_GOOGLE) sinGoogle++;
    if (fecha instanceof Date && fecha.getTime() >= desde && datos[i][COL_EMAIL - 1]) {
      nuevos.push("• " + datos[i][COL_NOMBRE - 1] + " <" + datos[i][COL_EMAIL - 1] + "> · " + (datos[i][COL_CELULAR - 1] || "-"));
    }
  }
  if (!nuevos.length) return;

  var listado = nuevos.slice(0, 50).join("\n") + (nuevos.length > 50 ? "\n... y " + (nuevos.length - 50) + " más" : "");
  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "📩 Fundamentos IA: " + nuevos.length + " registro(s) nuevo(s) en las últimas 24 h",
    body:
      "¡Hola Marcos! Estos son los registros nuevos de Fundamentos IA:\n\n" + listado + "\n\n" +
      "Total de registros: " + datos.length + "\n" +
      "Esperando el acceso: " + enEspera +
      (enEspera && !carpetaConMaterial_() ? " (la carpeta todavía no tiene material: subí los videos y las guías y les llega solo)" : "") + "\n" +
      "Sin cuenta de Google (fijate si respondieron con un Gmail): " + sinGoogle + "\n\n" +
      "Planilla: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  });
}

// ============================================================
//  CONFIGURACIÓN Y PRUEBA (ejecutar desde el editor)
// ============================================================
// La primera vez crea la clave secreta, la carpeta de Drive y los activadores. Las siguientes
// solo verifica. Te manda un mail con el estado y los valores para Netlify.
function probarConfiguracion() {
  var props = PropertiesService.getScriptProperties();
  var mensajes = [];

  var secret = props.getProperty("WEBHOOK_SECRET");
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, "") + Utilities.getUuid().replace(/-/g, "");
    props.setProperty("WEBHOOK_SECRET", secret);
    mensajes.push("✅ Clave secreta creada");
  } else {
    mensajes.push("✅ Clave secreta OK");
  }

  var folder = carpeta_();
  if (!folder && props.getProperty("FOLDER_ID")) {
    mensajes.push("❌ No se pudo abrir la carpeta de FOLDER_ID: revisá el ID en Propiedades del script");
  } else {
    if (!folder) {
      folder = DriveApp.createFolder(CONFIG.NOMBRE_CARPETA);
      props.setProperty("FOLDER_ID", folder.getId());
      mensajes.push("✅ Carpeta creada en tu Drive: " + folder.getName());
    } else {
      mensajes.push("✅ Carpeta OK: " + folder.getName());
    }
    mensajes.push("   " + folder.getUrl());
    mensajes.push(carpetaConMaterial_()
      ? "✅ La carpeta tiene material: cada registro recibe el acceso al instante"
      : "⚠️ La carpeta está vacía: los registros quedan en espera y reciben el acceso solos cuando subas el material");
  }

  var sheet = getSheet_();
  mensajes.push("✅ Hoja \"" + CONFIG.SHEET_NAME + "\" OK: " + Math.max(sheet.getLastRow() - 1, 0) + " registro(s)");

  instalarActivadores_();
  mensajes.push("✅ Activadores: entrega cada hora y resumen diario a las " + CONFIG.HORA_RESUMEN + " h");

  mensajes.push("✉️ Mails disponibles hoy en la cuenta: " + MailApp.getRemainingDailyQuota() +
    " (este script deja siempre " + CONFIG.RESERVA_MAILS + " para las compras)");

  var url = ScriptApp.getService().getUrl();
  var urlLista = url && /\/exec$/.test(url);
  mensajes.push("");
  mensajes.push("VALORES PARA NETLIFY (Project configuration -> Environment variables):");
  mensajes.push("FUNDAMENTOS_WEBHOOK_URL = " + (urlLista
    ? url
    : "la URL de la implementación (Implementar -> Gestionar implementaciones; termina en /exec). Si todavía no implementaste, hacelo y volvé a ejecutar probarConfiguracion()"));
  mensajes.push("FUNDAMENTOS_WEBHOOK_SECRET = " + secret);
  mensajes.push("Después: Deploys -> Trigger deploy -> Deploy project.");

  var resumen = mensajes.join("\n");
  Logger.log(resumen);
  MailApp.sendEmail({
    to: CONFIG.EMAIL_ADMIN,
    subject: "Configuración de Fundamentos IA",
    body: resumen
  });
}

function instalarActivadores_() {
  var existentes = ScriptApp.getProjectTriggers().map(function (t) { return t.getHandlerFunction(); });
  if (existentes.indexOf("entregarPendientes") === -1) {
    ScriptApp.newTrigger("entregarPendientes").timeBased().everyHours(1).create();
  }
  if (existentes.indexOf("resumenDiario") === -1) {
    ScriptApp.newTrigger("resumenDiario").timeBased().everyDays(1).atHour(CONFIG.HORA_RESUMEN).create();
  }
}

// ============================================================
//  HELPERS
// ============================================================
function carpeta_() {
  var id = PropertiesService.getScriptProperties().getProperty("FOLDER_ID");
  if (!id) return null;
  try {
    return DriveApp.getFolderById(id);
  } catch (err) {
    return null;
  }
}

// La carpeta, solo si ya tiene algún archivo o subcarpeta (si no, null: nadie recibe una carpeta vacía)
function carpetaConMaterial_() {
  var folder = carpeta_();
  if (!folder) return null;
  return folder.getFiles().hasNext() || folder.getFolders().hasNext() ? folder : null;
}

function hayCuota_() {
  return MailApp.getRemainingDailyQuota() > CONFIG.RESERVA_MAILS;
}

function emailValido_(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Número de fila donde ya está ese email, o 0 si no está
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
    // Celular como texto plano para que no se convierta a número
    sheet.getRange("D:D").setNumberFormat("@");
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
//  EMAIL HTML DE ACCESO
//  compartida = false: el mail no es cuenta de Google; se le pide que responda con un Gmail.
// ============================================================
function construirEmailHtml_(nombre, linkDrive, compartida) {
  var nombreSeguro = escaparHtml_(nombre);
  var etiquetaBadge = compartida ? "REGISTRO CONFIRMADO • ACCESO HABILITADO" : "REGISTRO CONFIRMADO";

  var texto = compartida
    ? "¡Bienvenido a <strong>Fundamentos IA</strong>! Ya tenés acceso a la carpeta de Google Drive con los videos y las guías (asociada a este correo). Cada material nuevo se suma ahí."
    : "¡Bienvenido a <strong>Fundamentos IA</strong>! El material está en una carpeta de Google Drive, pero <strong style=\"color:#f6950a;\">este correo no es una cuenta de Google</strong> y no pudimos darte el acceso. Respondé este mail con una cuenta de Gmail (o de Google) y te lo habilitamos a la brevedad.";

  var boton = compartida
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
