/**
 * ============================================================
 *  INTEGRACIÓN CON E-STELLARIUM (archivo nuevo del proyecto de Apps Script)
 * ============================================================
 *
 *  Se agrega como un archivo aparte (+ → Script → "estellarium"). Comparte el alcance global con el script de
 *  pagos, así que usa CURSOS, registrar_, getSheet_, identificarCurso_, etc. sin importarlos.
 *
 *  ESTÁ APAGADO POR DEFECTO. Mientras ESTELLARIUM_ENABLED no valga "true", no llama a la API: solo escribe en el
 *  registro de ejecuciones lo que habría hecho. Los pagos siguen funcionando exactamente igual que hoy, y una
 *  falla de E-Stellarium nunca corta una compra (todo va en try/catch y se avisa por mail).
 *
 *  PASOS:
 *  1. Propiedades de la secuencia de comandos (⚙️):
 *       ESTELLARIUM_URL     = https://e-stellarium-api.up.railway.app
 *       ESTELLARIUM_KEY     = el INTERNAL_API_KEY de producción (Railway). Nunca en el código.
 *       ESTELLARIUM_ENABLED = (no la crees todavía; el día del lanzamiento: true)
 *  2. Tres cambios chicos en el script de pagos (ver "CAMBIOS EN EL SCRIPT DE PAGOS" abajo).
 *  3. Ejecutá probarEstellarium(): chequea la URL y la clave sin tocar nada (funciona aunque esté apagado).
 *  4. Implementar → Gestionar implementaciones → lápiz → "Nueva versión".
 *  5. Día del lanzamiento: ESTELLARIUM_ENABLED = true, y corré sincronizarCompradoresAnteriores() para dar de
 *     alta a quienes ya habían comprado (de a tandas: cada alta manda un mail de bienvenida, y Resend gratis
 *     deja 100 mails por día).
 *
 *  CAMBIOS EN EL SCRIPT DE PAGOS (en procesarPago_):
 *
 *  A) Al principio, donde dice "ANTIDUPLICADOS". Un pago devuelto llega como una notificación más del mismo
 *     pago, que hoy se descarta ahí por "ya procesado"; hay que mirar si fue un reembolso antes de salir:
 *
 *       if (!forzar && yaProcesado_(paymentId)) {
 *         revisarReembolsoEstellarium_(paymentId, accessToken);   // <-- NUEVO
 *         return responder_("already_processed");
 *       }
 *
 *  B) Justo antes de "var asunto = preventa ?", después del ciclo que comparte las carpetas de Drive:
 *
 *       var altaEs = altaEstellarium_(payment, cursoKey, nombre, email);   // <-- NUEVO
 *       if (altaEs.nota) notas.push(altaEs.nota);                          // <-- NUEVO
 *
 *     Si la API falla, la nota llega en el mail de avisos y queda en "Detalle". Para repetir el alta de un pago:
 *     reintentarAltaEstellarium().
 *
 *  C) Cupones de E-Stellarium en el checkout (en procesarPago_): cuponEstellariumDelPago_ al calcular el mínimo y
 *     canjearCuponDelPago_ después del alta. Ver "CUPONES de E-Stellarium" abajo.
 * ============================================================
 */

// Claves de los cursos que existen en E-Stellarium (su tabla products). Los demás (redes, excel) todavía no
// tienen constelación: se ignoran, y un pago que traiga solo de esos no llama a la API.
var ESTELLARIUM_CURSOS = ["scratch", "scripting", "python", "fundamentos-backend", "backend-avanzado", "fullstack-csharp"];

var MARCA_ESTELLARIUM_OK = "ESTELLARIUM_OK";

// ------------------------------------------------------------
//  Base
// ------------------------------------------------------------
function estellariumConfig_() {
  var props = PropertiesService.getScriptProperties();
  return {
    url: String(props.getProperty("ESTELLARIUM_URL") || "").replace(/\/+$/, ""),
        key: String(props.getProperty("ESTELLARIUM_KEY") || "").trim(),
    activo: props.getProperty("ESTELLARIUM_ENABLED") === "true"
  };
}

// POST a la API con la clave interna. Reintenta una vez si hubo un error del servidor o de red.
function llamarEstellarium_(ruta, cuerpo) {
  var cfg = estellariumConfig_();
  if (!cfg.url || !cfg.key) throw new Error("Faltan ESTELLARIUM_URL o ESTELLARIUM_KEY en Propiedades del script");
  var ultimo;
  for (var intento = 0; intento < 2; intento++) {
    try {
      var resp = UrlFetchApp.fetch(cfg.url + ruta, {
        method: "post",
        contentType: "application/json",
        headers: { "x-api-key": cfg.key },
        payload: JSON.stringify(cuerpo),
        muteHttpExceptions: true
      });
      var texto = resp.getContentText();
      var json = null;
      try { json = JSON.parse(texto); } catch (e) { json = null; }
      ultimo = { codigo: resp.getResponseCode(), json: json, texto: texto };
      if (ultimo.codigo < 500) return ultimo;
    } catch (err) {
      ultimo = { codigo: 0, json: null, texto: String(err) };
    }
    Utilities.sleep(1500);
  }
  return ultimo;
}

// Los cursos de E-Stellarium que da un curso o combo (abre los combos hasta los cursos con carpeta)
function clavesEstellarium_(cursoKey) {
  var base = [];
  (function abrir(k) {
    var c = CURSOS[k];
    if (c.incluye && c.incluye.length) c.incluye.forEach(abrir);
    else base.push(k);
  })(cursoKey);
  var vistos = {};
  return base.filter(function (k) {
    if (vistos[k] || ESTELLARIUM_CURSOS.indexOf(k) === -1) return false;
    vistos[k] = true;
    return true;
  });
}

// ------------------------------------------------------------
//  ALTA: un pago aprobado da los cursos en E-Stellarium (idempotente por paymentId)
//  Devuelve { nota }: un texto si hay algo que avisarle a Marcos, o null si salió bien.
// ------------------------------------------------------------
function altaEstellarium_(payment, cursoKey, nombre, email) {
  try {
    var claves = clavesEstellarium_(cursoKey);
    var paymentId = String(payment.id);
    if (!claves.length) {
      Logger.log("[E-Stellarium] " + paymentId + ": " + CURSOS[cursoKey].nombre + " no tiene cursos en E-Stellarium.");
      return { nota: null };
    }
    var cuerpo = { email: email, name: nombre, paymentId: paymentId, courses: claves };

    if (!estellariumConfig_().activo) {
      Logger.log("[E-Stellarium APAGADO] habría dado de alta: " + JSON.stringify(cuerpo));
      return { nota: null };
    }

    var r = llamarEstellarium_("/provision", cuerpo);
    var estado = r.json && r.json.status;
    if (r.codigo >= 200 && r.codigo < 300 && (estado === "provisioned" || estado === "already_processed")) {
      return { nota: null };
    }
    if (r.codigo >= 200 && r.codigo < 300 && estado === "deleted_user") {
      return { nota: "E-Stellarium: " + email + " está dado de baja. Recibió el curso pero no puede entrar: un super admin decide si lo restaura." };
    }
    return {
      nota: "E-Stellarium NO dio el alta (HTTP " + r.codigo + "): " + String(r.texto).substring(0, 200) +
        ". Corré reintentarAltaEstellarium() con este pago: " + paymentId
    };
  } catch (err) {
    return { nota: "E-Stellarium NO dio el alta (error): " + err + ". Corré reintentarAltaEstellarium() con este pago." };
  }
}

// Repite el alta de un pago (por ejemplo, si la API estaba caída). Cambiar el ID y ejecutar desde el editor.
function reintentarAltaEstellarium() {
  var paymentId = "PEGAR_ID_DEL_PAGO";
  var accessToken = PropertiesService.getScriptProperties().getProperty("MP_ACCESS_TOKEN");
  var resp = UrlFetchApp.fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
    headers: { Authorization: "Bearer " + accessToken },
    muteHttpExceptions: true
  });
  if (resp.getResponseCode() !== 200) throw new Error("Mercado Pago respondió HTTP " + resp.getResponseCode());
  var payment = JSON.parse(resp.getContentText());
  if (payment.status !== "approved") throw new Error("El pago no está aprobado: " + payment.status);
  var cursoKey = identificarCurso_(payment);
  if (!cursoKey) throw new Error("No se pudo identificar el curso de este pago");
  var payer = payment.payer || {};
  var nombre = String(((payer.first_name || "") + " " + (payer.last_name || "")).trim() || "Estudiante");
  var email = String(payer.email || "").trim().toLowerCase();
  Logger.log(JSON.stringify(altaEstellarium_(payment, cursoKey, nombre, email)));
}

// ------------------------------------------------------------
//  REEMBOLSO: un pago devuelto revoca los cursos que dio (E-Stellarium no borra el progreso)
//  Solo actúa con reembolso TOTAL (status refunded) o contracargo. Es idempotente.
// ------------------------------------------------------------
function revisarReembolsoEstellarium_(paymentId, accessToken) {
  try {
    var resp = UrlFetchApp.fetch("https://api.mercadopago.com/v1/payments/" + paymentId, {
      headers: { Authorization: "Bearer " + accessToken },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() !== 200) return;
    var payment = JSON.parse(resp.getContentText());
    var status = String(payment.status || "");
    if (status !== "refunded" && status !== "charged_back") return;

    if (!estellariumConfig_().activo) {
      Logger.log("[E-Stellarium APAGADO] habría revocado los cursos del pago " + paymentId + " (" + status + ")");
      return;
    }

    var r = llamarEstellarium_("/provision/refund", { paymentId: String(paymentId) });
    var estado = r.json && r.json.status;
    if (estado === "refunded") {
      // La primera vez: queda en la hoja y se le avisa a Marcos. Las siguientes notificaciones dan already_refunded.
      registrar_({
        estado: "REEMBOLSADO",
        paymentId: String(paymentId),
        detalle: "E-Stellarium: cursos revocados (" + (r.json.courses || []).join(", ") + ") por " + status,
        email: String((payment.payer && payment.payer.email) || "").toLowerCase(),
        monto: Number(payment.transaction_amount) || 0
      });
      MailApp.sendEmail({
        to: CONFIG.EMAIL_ADMIN,
        subject: "↩️ Pago devuelto: se revocaron los cursos en E-Stellarium",
        body: "Pago ID: " + paymentId + "\nMotivo: " + status + "\nCursos revocados en E-Stellarium: " + (r.json.courses || []).join(", ") +
          "\n\nEl acceso a las carpetas de Google Drive NO se saca solo: hay que quitarlo a mano."
      });
    } else if (r.codigo === 404) {
      Logger.log("[E-Stellarium] pago " + paymentId + " devuelto, pero no tiene alta en E-Stellarium (es anterior a la integración).");
    } else if (r.codigo >= 300) {
      MailApp.sendEmail({
        to: CONFIG.EMAIL_ADMIN,
        subject: "⚠️ E-Stellarium: no se pudo revocar un pago devuelto",
        body: "Pago ID: " + paymentId + "\nHTTP " + r.codigo + ": " + String(r.texto).substring(0, 300)
      });
    }
  } catch (err) {
    Logger.log("[E-Stellarium] error al revisar el reembolso de " + paymentId + ": " + err);
  }
}

// ------------------------------------------------------------
//  COMPRADORES ANTERIORES: da de alta en E-Stellarium a los pagos APROBADOS que ya están en la hoja
//  Ejecutar a mano. Con ENSAYO = true solo lista lo que haría. Cada alta manda un mail de bienvenida
//  (con el link para crear la contraseña): MAXIMO limita cuántos se hacen por corrida.
// ------------------------------------------------------------
function sincronizarCompradoresAnteriores() {
  var ENSAYO = true;   // cambiar a false para hacerlo de verdad (con ESTELLARIUM_ENABLED = true)
  var MAXIMO = 20;     // tandas chicas: el plan gratis de Resend manda hasta 100 mails por día

  var nombrePorClave = {};
  Object.keys(CURSOS).forEach(function (k) { nombrePorClave[CURSOS[k].nombre] = k; });

  var sheet = getSheet_();
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return Logger.log("La hoja está vacía.");
  // Columnas: A Fecha, B Payment ID, C Detalle, D Estado, E Curso, F Nombre, G Email
  var filas = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var hechos = 0;

  for (var i = 0; i < filas.length && hechos < MAXIMO; i++) {
    var paymentId = String(filas[i][1]).trim();
    var detalle = String(filas[i][2] || "");
    var cursoKey = nombrePorClave[String(filas[i][4])];
    if (String(filas[i][3]) !== ESTADO_APROBADO || !cursoKey || !/^\d{1,20}$/.test(paymentId)) continue;
    if (detalle.indexOf(MARCA_ESTELLARIUM_OK) !== -1) continue;
    var claves = clavesEstellarium_(cursoKey);
    if (!claves.length) continue;

    var cuerpo = {
      email: String(filas[i][6]).trim().toLowerCase(),
      name: String(filas[i][5] || "Estudiante"),
      paymentId: paymentId,
      courses: claves
    };
    hechos++;
    if (ENSAYO) {
      Logger.log("[ENSAYO] " + JSON.stringify(cuerpo));
      continue;
    }
    var r = llamarEstellarium_("/provision", cuerpo);
    var estado = r.json && r.json.status;
    if (r.codigo >= 200 && r.codigo < 300 && (estado === "provisioned" || estado === "already_processed" || estado === "deleted_user")) {
      sheet.getRange(i + 2, COL_DETALLE).setValue(sanitizarCelda_((detalle ? detalle + " | " : "") + MARCA_ESTELLARIUM_OK));
    } else {
      Logger.log("FALLÓ " + paymentId + " (HTTP " + r.codigo + "): " + r.texto);
    }
  }
  Logger.log((ENSAYO ? "Ensayo: " : "Altas hechas: ") + hechos);
}

// ------------------------------------------------------------
//  CUPONES de E-Stellarium (los de constelación, tienda, regalo y demo)
//  La web (netlify/lib/cupones.js) valida el código, controla las reglas de la compra (solo cursos sueltos y a
//  precio de lista: ni combos, ni packs, ni preventa, ni Cyber, ni promo) y marca el pago con
//  metadata.cupon = "estellarium", cupon_codigo y cupon_porcentaje. Acá:
//    - precioMinimo_ acepta el precio con ese porcentaje (sin volver a consultar la API: el cupón pudo vencer
//      entre el pago y la notificación, y el comprador ya pagó)
//    - con el pago aprobado y registrado, canjearCuponDelPago_ lo consume. Si falla (409: lo usaron en otra
//      compra en el medio), el curso se entrega igual y se le avisa a Marcos.
//  El canje NO depende de ESTELLARIUM_ENABLED: si la web aceptó el cupón, hay que consumirlo aunque el alta de
//  alumnos siga apagada. Solo necesita ESTELLARIUM_URL y ESTELLARIUM_KEY.
// ------------------------------------------------------------

// El tope de los cupones en E-stellarium (no se toca). La web tiene el mismo número.
var CUPON_ESTELLARIUM_MAXIMO = 60;

// { codigo, porcentaje } si el pago viene con un cupón de E-stellarium bien formado para este curso, o null.
// Lo marca crear-preferencia, que es el servidor: el navegador no puede poner el metadata.
function cuponEstellariumDelPago_(curso, payment) {
  var meta = (payment && payment.metadata) || {};
  if (!curso || curso.incluye || curso.pack || meta.cupon !== "estellarium") return null;
  var codigo = String(meta.cupon_codigo || "");
  var porcentaje = Number(meta.cupon_porcentaje);
  if (!/^ESTL-[A-Z0-9]{2}-[A-Z0-9]{6}$/.test(codigo)) return null;
  if (!porcentaje || porcentaje < 1 || porcentaje > CUPON_ESTELLARIUM_MAXIMO || Math.floor(porcentaje) !== porcentaje) return null;
  return { codigo: codigo, porcentaje: porcentaje };
}

// Consume el cupón de un pago aprobado. Devuelve { nota }: un texto para el mail de avisos, o null si salió bien.
function canjearCuponDelPago_(cuponEs, paymentId) {
  try {
    var canje = canjearCuponEstellarium_(cuponEs.codigo);
    if (canje.canjeado) return { nota: null };
    var motivo = (canje.respuesta && canje.respuesta.reason) || "sin respuesta";
    return {
      nota: "Cupón de E-stellarium " + cuponEs.codigo + " NO se pudo consumir (" + motivo + "). El curso se entregó igual; " +
        (motivo === "used" ? "ya lo habían usado en otra compra." : "revisalo a mano. Pago " + paymentId + ".")
    };
  } catch (err) {
    return { nota: "Cupón de E-stellarium " + cuponEs.codigo + " NO se pudo consumir (error: " + err + "). Pago " + paymentId + "." };
  }
}

function validarCuponEstellarium_(codigo) {
  var r = llamarEstellarium_("/coupons/validate", { code: codigo });
  return r.json || { valid: false, reason: "error" };
}

// Lo consume. Llamar SOLO cuando el pago ya está aprobado y validado. 409 = ya no vale.
function canjearCuponEstellarium_(codigo) {
  var r = llamarEstellarium_("/coupons/redeem", { code: codigo });
  return { canjeado: r.codigo === 200 && r.json && r.json.valid === true, respuesta: r.json };
}

// ------------------------------------------------------------
//  PRUEBA (sin tocar nada): ¿la URL y la clave andan? Funciona aunque ESTELLARIUM_ENABLED esté apagado.
// ------------------------------------------------------------
function probarEstellarium() {
  var cfg = estellariumConfig_();
  Logger.log("ESTELLARIUM_URL: " + (cfg.url ? cfg.url : "FALTA"));
  Logger.log("ESTELLARIUM_KEY: " + (cfg.key ? "cargada, " + cfg.key.length + " caracteres, empieza con " + cfg.key.substring(0, 2) + " y termina con " + cfg.key.substring(cfg.key.length - 2) : "FALTA"));
  Logger.log("ESTELLARIUM_ENABLED: " + (cfg.activo ? "ACTIVO" : "apagado (nada se manda)"));
  if (!cfg.url || !cfg.key) return;
  var r = llamarEstellarium_("/coupons/validate", { code: "NO-EXISTE" });
  var ok = r.codigo === 200 && r.json && r.json.reason === "not_found";
  Logger.log("Conexión: HTTP " + r.codigo + (ok ? " -> OK (la clave es válida)" : " -> revisá la URL y la clave: " + r.texto));

  // Qué cursos de E-Stellarium daría cada curso o combo (sin llamar a nada)
  Object.keys(CURSOS).forEach(function (k) {
    if (CURSOS[k].pack) return;
    Logger.log(CURSOS[k].nombre + " -> " + (clavesEstellarium_(k).join(", ") || "(ninguno)"));
  });
}

// Prueba sin riesgo: simula un pago y muestra qué se mandaría (con ESTELLARIUM_ENABLED apagado no llama a la API)
function probarAltaEstellarium() {
  var pagoFalso = { id: 999999999901 };
  Logger.log(JSON.stringify(altaEstellarium_(pagoFalso, "python", "Prueba Uno", "wearesrv+prueba1@gmail.com")));
  Logger.log(JSON.stringify(altaEstellarium_(pagoFalso, "ruta-backend", "Prueba Uno", "wearesrv+prueba1@gmail.com")));
  Logger.log(JSON.stringify(altaEstellarium_(pagoFalso, "redes", "Prueba Uno", "wearesrv+prueba1@gmail.com")));
}
