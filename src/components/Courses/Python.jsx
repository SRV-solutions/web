import React, { useState } from "react";
import styles from "./Python.module.css";
import { trackEvent } from "../../data/metaPixel";

const MODULOS_PYTHON = [
  {
    modulo: "Módulo I",
    titulo: "Introducción & Entorno de Trabajo",
    temas: [
      "Introducción a la programación y al curso",
      "Instalación y configuración de VS Code",
      "Nuestro primer 'Hola Mundo'",
    ],
  },
  {
    modulo: "Módulo II",
    titulo: "Variables & Tipos de Datos",
    temas: [
      "Concepto y nomenclaturas de variables",
      "Tipos de datos primitivos y operadores aritméticos",
      "Manejo de TypeError y ejercicios prácticos",
    ],
  },
  {
    modulo: "Módulo III",
    titulo: "Controladores de Flujo",
    temas: [
      "Operadores de comparación y lógicos",
      "Estructuras condicionales: IF, ELSE, IF-ELSE",
      "Resolución de ejercicios integradores",
    ],
  },
  {
    modulo: "Módulo IV",
    titulo: "Estructuras de Datos & Módulos Nativos",
    temas: [
      "Listas, matrices y tipos compuestos",
      "Métodos simples y manipulación de datos",
      "Módulos nativos: Date, Math, Random",
    ],
  },
  {
    modulo: "Módulo V",
    titulo: "Estructuras Repetitivas & Funciones",
    temas: [
      "Bucles While y For + métodos avanzados de listas",
      "Funciones: Parámetros, retornos y Scope",
      "Algoritmos de ordenamiento (BubbleSort, Insertion, Selection)",
    ],
  },
  {
    modulo: "Módulo VI",
    titulo: "POO, Archivos & Expresiones Regulares",
    temas: [
      "Programación Orientada a Objetos (Clases, Encapsulación, Herencia, Polimorfismo)",
      "Manejo de errores con Try - Except",
      "Lectura, escritura de archivos y Regex",
    ],
  },
  {
    modulo: "Módulo VII",
    titulo: "APIs, Requests & Asincronismo",
    temas: [
      "Promesas y peticiones HTTP",
      "¿Qué es una API y cómo consumirla?",
      "Librería Requests y proyecto Bot",
    ],
  },
  {
    modulo: "Módulo VIII",
    titulo: "Apps con Interfaz Gráfica (GUI) & Extra",
    temas: [
      "Introducción a Tkinter para Interfaces",
      "Desarrollo de App 'Adivinar el Número'",
      "Desarrollo de 'To Do List' y 'Password App'",
      "Modularización y cierre del curso",
    ],
  },
];

export default function Python() {
  const [loading, setLoading] = useState(false);

  const handleMercadoPagoCheckout = async () => {
    setLoading(true);

    // Tracking en Meta Pixel
    if (typeof trackEvent === "function") {
      trackEvent("InitiateCheckout", {
        content_name: "Infoproducto Python Completo",
        currency: "ARS",
        value: 80000.0,
      });
    }

    try {
      // Apuntamos a la Netlify Function que acabamos de crear
      const response = await fetch("/.netlify/functions/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: "Master en Python Desde Cero - WEARESRV",
          precio: 80000,
        }),
      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point; // Redirige al checkout oficial de MP
      } else {
        throw new Error("No se pudo obtener el link de pago.");
      }
    } catch (error) {
      console.error("Error al conectar con Mercado Pago:", error);
      alert("Hubo un error al procesar el pago. Inténtalo nuevamente.");
      setLoading(false);
    }
  };
  
  return (
    <section id="curso-python" className={styles.section}>
      <div className={styles.fullLayout}>
        {/* Columna Izquierda: Tarjeta de Compra */}
        <div className={styles.stickyColumn}>
          <div className={styles.cardContainer}>
            <div className={styles.header}>
              <div className={styles.badge}>
                ⚡ Acceso Inmediato e Ilimitado
              </div>
              <h2 className={styles.title}>
                Master en <span className={styles.orange}>Python</span> Desde
                Cero
              </h2>
              <p className={styles.description}>
                Infoproducto completo de 98 clases grabadas. Aprende lógica de
                programación, POO, consumo de APIs y desarrollo de aplicaciones
                con interfaz gráfica (GUI).
              </p>

              {/* Oferta Limitada */}
              <div className={styles.promoCard}>
                <div className={styles.promoHeader}>
                  <span className={styles.promoBadge}>
                    🔥 82% OFF - OFERTA LIMITADA
                  </span>
                  <span className={styles.timerTag}>
                    ⏳ Cupos abiertos 24/7
                  </span>
                </div>

                <div className={styles.priceContainer}>
                  <div className={styles.oldPriceBox}>
                    <span className={styles.oldPriceLabel}>Precio Regular</span>
                    <span className={styles.oldPrice}>$450.000</span>
                  </div>
                  <div className={styles.currentPriceBox}>
                    <span className={styles.priceTag}>Inversión Única</span>
                    <div className={styles.mainPrice}>
                      $80.000 <span className={styles.currency}>ARS</span>
                    </div>
                  </div>
                </div>

                <div className={styles.benefitsList}>
                  <div className={styles.benefitItem}>
                    ✓ Acceso vitalicio al material en Google Drive
                  </div>
                  <div className={styles.benefitItem}>
                    ✓ Estudiá a tu propio ritmo (100% grabado)
                  </div>
                  <div className={styles.benefitItem}>
                    ✓ Envío automático de accesos al abonar
                  </div>
                </div>
              </div>
            </div>

            {/* Botón Estilo Mercado Pago */}
            <div className={styles.actionContainer}>
              <button
                type="button"
                onClick={handleMercadoPagoCheckout}
                disabled={loading}
                className={styles.btnMercadoPago}
              >
                <svg
                  className={styles.mpLogo}
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
                {loading ? "Conectando con MP..." : "Pagar con Mercado Pago"}
              </button>
              <p className={styles.secureText}>
                🔒 Transacción cifrada y protegida por Mercado Pago.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Plan de Estudios */}
        <div className={styles.contentColumn}>
          <div className={styles.modulesSummary}>
            <h3 className={styles.subTitle}>
              Plan de Estudios (98 Clases / 8 Módulos)
            </h3>
            <p className={styles.subTitleDesc}>
              Estructura práctica diseñada para llevarte desde las bases hasta
              proyectos profesionales.
            </p>

            <div className={styles.modulesGrid}>
              {MODULOS_PYTHON.map((mod, index) => (
                <div key={index} className={styles.moduleCard}>
                  <div className={styles.moduleCardHeader}>
                    <span className={styles.moduleNum}>0{index + 1}</span>
                    <span className={styles.moduleTag}>{mod.modulo}</span>
                  </div>
                  <h4>{mod.titulo}</h4>
                  <ul className={styles.taskList}>
                    {mod.temas.map((tema, i) => (
                      <li key={i}>{tema}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
