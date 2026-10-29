import React from "react";
import { Link } from "react-router-dom";
import Seo from "../Seo";
import styles from "./style.module.css";
import { DatosVendedor } from "./Dato";
import { LEGAL, PROMOCIONES, PRECIOS_ESPECIALES } from "../../data/legal";

// Términos y condiciones de venta. El link del pie se llama "Contratos de adhesión – Ley 24.240"
// porque así lo pide la Res. 271/2020. Las promociones y sus fechas salen de src/data/legal.js.
export default function Terminos() {
  return (
    <section className={styles.page}>
      <Seo
        title="Términos y condiciones | WEARESRV"
        description="Condiciones de venta de los cursos de WEARESRV: precios, pagos, promociones con sus fechas, acceso, arrepentimiento y certificados."
        path="/terminos"
      />
      <div className={styles.inner}>
        {import.meta.env.DEV && (
          <p className={styles.devNote}>
            Borrador para revisar con un abogado antes de publicar. Este aviso solo se ve en local.
          </p>
        )}
        <p className={styles.kicker}>Contratos de adhesión – Ley 24.240 de Defensa del Consumidor</p>
        <h1 className={styles.title}>
          Términos y <span className={styles.orange}>condiciones</span>
        </h1>
        <p className={styles.lead}>
          Estas son las condiciones para comprar y usar los cursos de {LEGAL.marca}. Si algo no te queda claro,
          escribinos antes de pagar.
        </p>

        <h2 className={styles.h2}>1. Quién vende</h2>
        <DatosVendedor />

        <h2 className={styles.h2}>2. Qué ofrecemos</h2>
        <ul>
          <li>
            <strong>Cursos grabados:</strong> clases en video con guías de estudio. Se entregan como una carpeta de
            Google Drive compartida con el correo de la compra. El acceso no vence: la carpeta queda compartida con tu
            correo («acceso de por vida»).
          </li>
          <li>
            <strong>Cursadas en vivo:</strong> clases por videollamada en los días y horarios publicados en la página de
            cada cursada, con grabación de cada clase. Los cupos son limitados.
          </li>
          <li>
            <strong>Comunidad en Discord:</strong> gratuita y sujeta a sus normas de convivencia.
          </li>
        </ul>

        <h2 className={styles.h2}>3. Precios y formas de pago</h2>
        <ul>
          <li>Los precios son finales, en pesos argentinos y con impuestos incluidos.</li>
          <li>
            Se paga por Mercado Pago: tarjeta de crédito o débito, dinero en cuenta y los demás medios que ofrezca. Las
            cuotas disponibles y su costo financiero total los muestra Mercado Pago antes de confirmar el pago.
          </li>
          <li>Por cada compra emitimos la factura electrónica correspondiente.</li>
        </ul>

        <h2 className={styles.h2}>4. Promociones vigentes</h2>
        <p>
          Cada promoción indica cuándo empieza, cuándo termina y sus condiciones. Fuera de esas fechas rige el precio
          publicado en la página de cada curso.
        </p>
        <div className={styles.tablaWrap}>
          <table className={styles.tabla}>
            <thead>
              <tr>
                <th>Promoción</th>
                <th>Condiciones</th>
                <th>Desde</th>
                <th>Hasta</th>
              </tr>
            </thead>
            <tbody>
              {PROMOCIONES.map((p) => (
                <tr key={p.nombre}>
                  <td>{p.nombre}</td>
                  <td>{p.detalle}</td>
                  <td>{p.desde}</td>
                  <td>{p.hasta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Precios especiales sin fecha de fin:</p>
        <ul>
          {PRECIOS_ESPECIALES.map((p) => (
            <li key={p.nombre}>
              <strong>{p.nombre}:</strong> {p.detalle}
            </li>
          ))}
        </ul>

        <h2 className={styles.h2}>5. Acceso y uso de los cursos</h2>
        <ul>
          <li>
            El acceso es personal e intransferible. Necesitás una cuenta de Google con el mismo correo con el que
            pagaste.
          </li>
          <li>No está permitido compartir la carpeta, redistribuir las clases ni publicarlas.</li>
          <li>Si detectamos que un acceso se comparte, podemos quitarlo, con aviso previo.</li>
        </ul>

        <h2 className={styles.h2}>6. Derecho de arrepentimiento</h2>
        <p>
          Tenés 10 días corridos desde la compra para arrepentirte, sin dar explicaciones y sin costo (art. 34 de la Ley
          24.240 y art. 1110 del Código Civil y Comercial). Lo pedís desde el{" "}
          <Link to="/arrepentimiento">botón de arrepentimiento</Link>, sin registrarte. Te confirmamos el pedido con un
          código de trámite dentro de las 24 horas y te devolvemos el dinero por el mismo medio de pago.
        </p>
        <p>
          En los cursos grabados, el derecho puede no aplicar si ya descargaste o usaste el contenido (art. 1116 del
          Código Civil y Comercial y art. 3 de la Disposición 954/2025). En las cursadas en vivo podés arrepentirte
          dentro de los 10 días de la compra aunque la cursada no haya empezado.
        </p>

        <h2 className={styles.h2}>7. Cambios en las cursadas</h2>
        <p>
          Si una cursada en vivo cambia de fecha u horario, te avisamos por mail y WhatsApp. Si la nueva fecha no te
          sirve, te devolvemos lo que pagaste.
        </p>

        <h2 className={styles.h2}>8. Certificados</h2>
        <p>
          Los certificados los emite {LEGAL.marca} y se pueden verificar en wearesrv.com/certificates. No son títulos
          oficiales.
        </p>

        <h2 className={styles.h2}>9. Propiedad intelectual</h2>
        <p>
          Las clases, guías y materiales son de {LEGAL.marca}. La compra te da una licencia de uso personal: no la de
          copiarlos, venderlos ni publicarlos.
        </p>

        <h2 className={styles.h2}>10. Datos personales</h2>
        <p>
          Cómo usamos y cuidamos tus datos está en la <Link to="/privacidad">política de privacidad</Link>.
        </p>

        <h2 className={styles.h2}>11. Consultas, reclamos y ley aplicable</h2>
        <p>
          Ante cualquier consulta o reclamo escribinos por los medios de contacto del punto 1. Si no quedás conforme,
          podés presentar un reclamo ante la autoridad de defensa del consumidor de tu jurisdicción. Rige la ley
          argentina, y son competentes los tribunales de tu domicilio.
        </p>

        <p className={styles.actualizacion}>Última actualización: {LEGAL.actualizacion}.</p>
      </div>
    </section>
  );
}
