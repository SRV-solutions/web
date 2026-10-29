# Plan de mejoras de la web (2027)

Sale del análisis de mercado del 29/10/2026:
[WEARESRV — Mercado, competencia y plan de crecimiento](https://claude.ai/artifact/P6Y2MuJ7ucnJoYq4weWwyU).
Las notas de investigación, con cada dato y su fuente, están en
`C:\Users\Marcos\Videos\REDES\research_notes\Mercado y crecimiento WEARESRV\`.

Se trabaja en la rama `mejoras-plan-2027`. `master` es lo publicado: Netlify publica desde GitHub,
así que nada se sube ni se mergea sin el OK de Marcos.

## Tanda 1: base legal y precios honestos (antes del CyberMonday, 2 al 4/11)

- [x] Datos legales en un solo lugar: `src/data/legal.js`.
- [ ] Completar en `src/data/legal.js`: razón social, CUIT, domicilio, mail de atención, horario y QR de Data Fiscal
      (en local se ven como «⚠ completar»; en producción no se muestran).
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
- [x] «Próximos cursos» con lista de espera (`/proximos-cursos`): IA para el trabajo, SQL gratis con certificado,
      IA para docentes, Redes, Linux y AWS. La lista de espera sale por WhatsApp con texto prellenado; cuando esté
      el Apps Script de listas se cambia por un formulario con Netlify Function.
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
