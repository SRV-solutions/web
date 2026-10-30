import React from "react";
import Seo from "../Seo";
import styles from "./style.module.css";
import { DatosVendedor } from "./Dato";
import { LEGAL } from "../../data/legal";

// Política de privacidad (Ley 25.326). Nombra a cada servicio que recibe datos (Mercado Pago, Google,
// Meta, Netlify, Discord) y lleva la leyenda de la Disp. 10/2008 con el órgano de control actual (AAIP).
export default function Privacidad() {
  return (
    <section className={styles.page}>
      <Seo
        title="Política de privacidad | WEARESRV"
        description="Qué datos personales junta WEARESRV, para qué los usa, con quién los comparte y cómo ejercer tus derechos."
        path="/privacidad"
      />
      <div className={styles.inner}>
        {import.meta.env.DEV && (
          <p className={styles.devNote}>
            Borrador para revisar con un abogado antes de publicar. Este aviso solo se ve en local.
          </p>
        )}
        <p className={styles.kicker}>Ley 25.326 de Protección de Datos Personales</p>
        <h1 className={styles.title}>
          Política de <span className={styles.orange}>privacidad</span>
        </h1>
        <p className={styles.lead}>
          Usamos tus datos para darte acceso a los cursos, avisarte lo importante y mejorar la web. Acá está qué
          juntamos, para qué y con quién lo compartimos.
        </p>

        <h2 className={styles.h2}>1. Responsable de los datos</h2>
        <DatosVendedor />

        <h2 className={styles.h2}>2. Qué datos juntamos</h2>
        <ul>
          <li>
            <strong>Los que nos das:</strong> nombre, apellido, mail y celular o WhatsApp en los formularios de
            inscripción, de consulta, del registro a Fundamentos IA, de la lista de espera de los próximos cursos y del
            botón de arrepentimiento.
          </li>
          <li>
            <strong>Los de la compra:</strong> Mercado Pago procesa el pago y nos informa el estado, el monto y el mail
            del comprador. No vemos ni guardamos los datos de tu tarjeta.
          </li>
          <li>
            <strong>Los de navegación:</strong> cookies y herramientas de medición (Google Tag Manager y el píxel de
            Meta) registran qué páginas visitás y desde qué anuncio llegaste.
          </li>
        </ul>

        <h2 className={styles.h2}>3. Para qué los usamos</h2>
        <ul>
          <li>Darte acceso a los cursos y a las cursadas en vivo.</li>
          <li>Darte acceso al material gratuito de Fundamentos IA y avisarte cuando sumamos material nuevo.</li>
          <li>Avisarte cuando abre la inscripción de un curso en cuya lista de espera te anotaste.</li>
          <li>Mandarte comprobantes, avisos de la cursada y certificados.</li>
          <li>Responder consultas y pedidos de arrepentimiento o de baja.</li>
          <li>Medir y mejorar nuestros anuncios y la web.</li>
          <li>Mandarte novedades y promociones. Podés pedir que dejemos de hacerlo cuando quieras.</li>
        </ul>

        <h2 className={styles.h2}>4. Con quién los compartimos</h2>
        <ul>
          <li>
            <strong>Mercado Pago:</strong> procesa los pagos.
          </li>
          <li>
            <strong>Google (Drive, Gmail y Sheets):</strong> entrega de los cursos y registro de compras e inscripciones.
          </li>
          <li>
            <strong>Meta (Facebook e Instagram):</strong> medición de anuncios. El mail y el teléfono viajan cifrados.
          </li>
          <li>
            <strong>Netlify:</strong> aloja la web.
          </li>
          <li>
            <strong>Discord:</strong> si te sumás a la comunidad.
          </li>
        </ul>
        <p>
          Algunos de estos servicios guardan datos fuera de Argentina, por ejemplo en Estados Unidos. No vendemos tus
          datos a nadie.
        </p>

        <h2 className={styles.h2}>5. Tus derechos</h2>
        <p>
          Podés pedir acceso, rectificación, actualización o supresión de tus datos escribiendo a los medios de contacto
          del punto 1. Respondemos los pedidos de acceso dentro de los 10 días corridos y los de rectificación o
          supresión dentro de los 5 días hábiles (arts. 14 y 16 de la Ley 25.326).
        </p>
        <p>
          El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma
          gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme
          lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326. La Agencia de Acceso a la Información Pública,
          en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y
          reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en
          materia de protección de datos personales.
        </p>

        <h2 className={styles.h2}>6. Mensajes y promociones</h2>
        <p>
          Cada mail o mensaje de promoción explica cómo dejar de recibirlos, y podés pedirlo en cualquier momento (art. 27
          de la Ley 25.326).
        </p>

        <h2 className={styles.h2}>7. Cookies</h2>
        <p>
          Podés bloquear o borrar las cookies desde la configuración de tu navegador. Algunas partes de la web pueden
          dejar de funcionar bien.
        </p>

        <h2 className={styles.h2}>8. Cuánto tiempo guardamos los datos</h2>
        <p>
          Mientras seas alumno y durante el tiempo que exijan las obligaciones fiscales y de defensa del consumidor.
          Los datos de Fundamentos IA y de las listas de espera, hasta que pidas la baja.
        </p>

        <h2 className={styles.h2}>9. Cambios en esta política</h2>
        <p>Si la cambiamos, publicamos acá la versión nueva con su fecha.</p>

        <p className={styles.actualizacion}>Última actualización: {LEGAL.actualizacion}.</p>
      </div>
    </section>
  );
}
