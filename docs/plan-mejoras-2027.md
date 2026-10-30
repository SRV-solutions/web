# Plan de mejoras de la web (2027)

Sale del análisis de mercado del 29/10/2026:
[WEARESRV — Mercado, competencia y plan de crecimiento](https://claude.ai/artifact/P6Y2MuJ7ucnJoYq4weWwyU).
Las notas de investigación, con cada dato y su fuente, están en
`C:\Users\Marcos\Videos\REDES\research_notes\Mercado y crecimiento WEARESRV\`.

Se trabaja en la rama `mejoras-plan-2027`. `master` es lo publicado: Netlify publica desde GitHub,
así que nada se sube ni se mergea sin el OK de Marcos.

## Tanda 1: base legal y precios honestos (antes del CyberMonday, 2 al 4/11)

- [x] Datos legales en un solo lugar: `src/data/legal.js`.
- [ ] Completar en `src/data/legal.js`: razón social y CUIT ya cargados (Marcos Roberto Costa Schmite,
      23-94799356-9). Faltan domicilio, mail de atención, horario y el QR de Data Fiscal, que se genera en
      ARCA con clave fiscal (servicio «Formulario 960/NM – Data Fiscal»). Los campos en null se ven como
      «⚠ completar» en local y en producción no se muestran.
- [x] Páginas `/terminos` (Contratos de adhesión – Ley 24.240), `/privacidad`, `/arrepentimiento` y `/baja`.
- [x] Pie de página con los links legales, el botón de arrepentimiento destacado y los datos del vendedor.
- [x] Aviso legal junto a los botones de pago (cursos grabados e intensivo).
- [x] Sin precios tachados permanentes. Quedan solo los reales: la preventa de Scratch con fecha, y la Ruta Backend
      y los packs contra la suma de las partes. Se muestra el precio por clase.
- [x] Nombres unificados: el menú decía «Python Engineer» y la página «Master en Python».
- [x] AdSense fuera de la web (mostraba anuncios de terceros en las páginas de venta).
- [ ] Validar los textos legales con un abogado y un contador antes de publicar.
- [ ] Botón de arrepentimiento con registro automático: una Netlify Function que guarde el pedido en el Apps Script
      y mande el código por mail. Hoy la página genera el código y el pedido sale por WhatsApp o mail.

## Tanda 2: mensaje, empresas y próximos cursos

- [x] Inicio: pasar de «de cero a tu primer laburo» a «aprendé a programar con IA y automatizá tu trabajo»,
      con las fortalezas: profe en vivo, precio por hora frente a la competencia y certificado verificable.
- [x] Página «Empresas e instituciones» (`/empresas`): talleres de IA, automatización y AWS para equipos; crédito
      fiscal (texto en neutro: ⚠ confirmar el estado del alta como Unidad Capacitadora en DNA2 antes de prometer);
      paquete para colegios con IA para docentes, Scratch y Sentryx.
- [x] «Próximos cursos» con lista de espera (`/proximos-cursos`): IA para el trabajo, SQL desde cero (pago, con
      guías de apoyo gratis; las clases ya están grabadas y editadas con Remotion), IA para docentes, Redes, Linux
      y AWS. La lista de espera sale por WhatsApp con texto prellenado; cuando esté el Apps Script de listas se
      cambia por un formulario con Netlify Function.
- [x] Certificación con examen final en vivo (sin la palabra «oficial», que sugiere reconocimiento estatal):
      beneficio y pregunta frecuente en las páginas de cursos (excepto Scratch). Gratis para quien compró el curso;
      por ahora se coordina por WhatsApp y después se pide desde E-stellarium.
- [x] Beneficio «Acceso gratis a E-stellarium (desde el 20 de noviembre)» en todos los cursos, anuncio en el
      inicio (después del hero) y pregunta frecuente: E-stellarium abre el 20/11/2026, con acceso inmediato y
      gratis para quien ya compró un curso. Cuando esté en uso: cambiar el anuncio por el link para entrar,
      sumar el botón de pedir examen y el acceso en el mail de compra (`appscript-cursos.gs`, después del Cyber).
- [x] Página gratuita «Fundamentos de IA» (`/fundamentos-ia`): 4 temas con lugar para video y guía (completar
      `url`/`guia` en el componente a medida que Marcos los sube), CTA a YouTube y Discord, y camino a los pagos.
- [x] Registro en Fundamentos IA (nombre, mail y celular): el formulario postea a la Netlify Function
      `registro-fundamentos`, que se lo pasa al Apps Script `appscript-fundamentos.gs` (proyecto separado del de
      pagos). El script guarda el registro en su planilla, comparte la carpeta de Drive y manda el mail de acceso;
      mientras la carpeta esté vacía los registros esperan y cada hora se entregan solos. A Marcos le llega un
      resumen diario (no un mail por registro: la cuota de ~100 mails por día es de la cuenta y la comparte con
      el script de pagos; este script deja siempre 40 libres para las compras). Se dejó Netlify Forms porque la
      detección de formularios del sitio está apagada y el plan gratis tiene tope de envíos.
- [ ] Activar el registro de Fundamentos IA: instalar el Apps Script (prompt para el Claude del navegador) y cargar
      en Netlify `FUNDAMENTOS_WEBHOOK_URL` y `FUNDAMENTOS_WEBHOOK_SECRET` (los manda por mail
      `probarConfiguracion()`), y redeployar. Hasta entonces el formulario muestra el error con salida a WhatsApp.
      El alta en E-stellarium se suma al script cuando la plataforma esté disponible.
- [x] Certificado de Scratch para los chicos: evaluación con preguntas y un jueguito desde E-stellarium
      («muy pronto» en la página hasta que la plataforma lo tenga).
- [x] Lista de espera con formulario (curso, nombre, apellido, mail y celular): Netlify Function `lista-espera`
      → pestaña «Lista de espera» del mismo Apps Script de Fundamentos IA, con mail de confirmación al anotado y
      los anotados en el resumen diario. Reemplaza al botón de WhatsApp (que queda como salida si falla).
      Publicar recién después de pegar la versión nueva de `appscript-fundamentos.gs` («Nueva versión»):
      con la versión anterior el formulario muestra el error.
- [ ] Precios de lanzamiento en las tarjetas de la lista de espera: faltan los números (publicarlos obliga,
      Ley 24.240; van como «precio de lanzamiento · primera cohorte», con fechas cuando abra cada curso).
      Recomendación del 30/10: SQL $49.900 (lanzamiento $34.900), IA para el trabajo $44.900 ($29.900),
      IA para docentes $34.900 ($24.900), Redes/Linux/AWS $89.900 ($62.900). Los cuatro son grabados (no hay
      otro curso en vivo hasta terminar el Intensivo actual).
- [x] `/redes/inscripcion` (el link «Formate como DevOps en AWS» de Linktree) redirige a
      `/proximos-cursos?curso=redes` con esa tarjeta destacada.
- [x] Módulos de IA anunciados como «Próximamente · gratis con tu acceso» en Scripting («Automatizá con IA») y
      Python («Automatizaciones con IA»), con temario borrador en `cursosGrabados.js` (`proximosModulos`).
      Cuando las clases estén grabadas y subidas a Drive: mover el módulo a `modulos` y actualizar `clases`.
- [x] Promo «Cyber SRV» del 2 al 4/11 con fecha de inicio y fin publicadas: todos los cursos grabados al 50%
      (el Intensivo Full Stack en vivo no participa). Código listo en la rama: precio mostrado, precio cobrado
      (`netlify/lib/cursos.js`), mínimo del webhook (`appscript-cursos.gs`, que además suma la columna «Neto
      recibido») y `PROMOCIONES` en `src/data/legal.js`. Pendiente a mano: pegar el Apps Script e implementar
      «Nueva versión», y mergear a `master` antes del 2/11 con el OK de Marcos.

## Tanda 3: producto

- [ ] Área de alumnos: va con **Estellarium**, la plataforma propia (MVP y demo gratuita previstos para
      principios de noviembre de 2026). Cuando esté en uso: integrarla a la web (login, avance, foro por clase,
      certificados) y migrar la entrega de cursos de Drive a la plataforma.
- [ ] Cuotas: 3 sin interés desde $80.000 y 6 en el Pack, mostrando el costo financiero total (Res. 4/2025).
- [ ] Tres niveles por curso (grabado, con encuentro mensual en vivo, cohorte) y membresía anual.
- [ ] Consentimiento antes de mandar mail y teléfono cifrados a Meta (píxel y API de Conversiones).
- [ ] Subir los precios en vivo desde la próxima edición (Pack $300.000 a $350.000).
