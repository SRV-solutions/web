import React from "react";
import { Link } from "react-router-dom";
import styles from "./style.module.css";
import Seo from "../Seo";

const EVENTBOX_URL = "https://eventbox.wearesrv.com";

const PLANES = [
  {
    nombre: "Básico",
    precio: "USD 520",
    cupo: "30 usuarios · 10 accesos temporales",
    tagline: "Para ordenar el depósito y las órdenes de cada evento.",
    beneficios: [
      "Stock, categorías y contenedores",
      "Órdenes de servicio con PDF",
      "Eventos y lugares",
      "Importación de stock por CSV",
    ],
  },
  {
    nombre: "Profesional",
    precio: "USD 1.200",
    cupo: "100 usuarios · 40 accesos temporales",
    tagline: "Para el equipo completo: personal, sueldos, planos y responsables por etapa.",
    destacado: true,
    beneficios: [
      "Todo del plan Básico",
      "Duplicar eventos y pasar material entre eventos",
      "Responsables por etapa (logística, recepción)",
      "Planos compartidos con el equipo",
      "Personal y recibos de sueldo con firma",
    ],
  },
  {
    nombre: "Empresa",
    precio: "USD 1.400",
    cupo: "250 usuarios · 100 accesos temporales",
    tagline: "Por USD 200 más: 150 usuarios extra y la operación en el evento.",
    beneficios: [
      "Todo del plan Profesional",
      "Check-in / check-out de material en el evento",
      "Reportes y varios depósitos",
      "API e integraciones",
      "Soporte prioritario por WhatsApp",
    ],
  },
];

export default function EventBox() {
  return (
    <div className={styles.container}>
      <Seo
        title="Event Box - Stock y órdenes de servicio para empresas de eventos | WEARESRV"
        description="Event Box ordena el stock, los contenedores y las órdenes de servicio de tu empresa de eventos. Cada orden con su recorrido, su responsable por etapa y su PDF. Por SRV."
        path="/eventbox"
      />

      <section className={styles.hero}>
        <div className={styles.logo}>
          <img src="/eventbox-icon.svg" alt="Event Box" />
        </div>
        <div className={styles.badge}>Stock y órdenes para empresas de eventos</div>
        <h1 className={styles.heroTitle}>
          Event Box: <span className={styles.blue}>Ordená</span> tu stock,{" "}
          <span className={styles.green}>armá</span> cada evento{" "}
          <span className={styles.orange}>sin sorpresas</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Stock, contenedores, lugares y órdenes de servicio de tu empresa de eventos en un solo lugar.
          Cada orden con su recorrido, su responsable por etapa y su PDF.
        </p>
        <a href={EVENTBOX_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
          Ingresar a Event Box →
        </a>
      </section>

      <section className={styles.description}>
        <div className={styles.contentWrapper}>
          <h2>¿Cómo funciona Event Box?</h2>

          <div className={styles.textContent}>
            <p>
              Event Box es la plataforma de stock y órdenes de servicio para empresas de eventos: sonido,
              iluminación, mobiliario, estructuras, catering. Cada empresa tiene su propio espacio, con su
              stock, sus contenedores, sus lugares, sus órdenes y su equipo, separados del resto. Funciona
              desde el celular o la computadora, y se instala como una app.
            </p>

            <p>
              Cada evento es una orden de servicio con un recorrido claro: se crea, se revisa, se aprueba,
              se arma en el depósito, se despacha, va al evento, vuelve y se desarma. Cada etapa tiene un
              responsable y es quien la avanza, así que siempre sabés en qué estado está cada orden y quién
              la tiene. Los contenedores (baúles, racks, cajas) pueden tener contenido fijo que viaja
              siempre con ellos, y todo lo que está adentro queda ocupado mientras el contenedor está en
              una orden.
            </p>

            <p>
              El equipo también está adentro: roles y permisos propios de cada empresa, accesos temporales
              para un evento o un reemplazo, importación de stock desde planillas CSV, órdenes en PDF,
              planos compartidos y recibos de sueldo con firma digital. Se paga un abono mensual en
              dólares, cobrado en pesos al dólar blue, y los módulos que tu plan no incluye aparecen con
              candado para sumarlos cuando el equipo crezca.
            </p>
          </div>

          <div className={styles.plans}>
            <h3>Planes disponibles</h3>
            <p className={styles.plansSubtitle}>
              Abono mensual por empresa en dólares, cobrado en pesos al dólar blue del día de pago
            </p>
            <div className={styles.plansGrid}>
              {PLANES.map((plan) => (
                <div key={plan.nombre} className={styles.planCard}>
                  {plan.destacado && <span className={styles.planTag}>El más elegido</span>}
                  <h4>Plan {plan.nombre}</h4>
                  <p className={styles.price}>{plan.precio}/mes</p>
                  <p className={styles.storage}>{plan.cupo}</p>
                  <p className={styles.tagline}>{plan.tagline}</p>
                  <ul className={styles.features}>
                    {plan.beneficios.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.cta}>
            <p>¿Tu empresa de eventos quiere usar Event Box?</p>
            <a href={EVENTBOX_URL} target="_blank" rel="noopener noreferrer" className={styles.btnPrimary}>
              Ingresar a la plataforma →
            </a>
          </div>
        </div>
      </section>

      <section className={styles.backSection}>
        <Link to="/" className={styles.backLink}>
          ← Volver al inicio
        </Link>
      </section>
    </div>
  );
}
