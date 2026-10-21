import React, { useEffect, useState } from "react";
import styles from "./style.module.css";
import {
  COURSES,
  INSTAGRAM_HANDLE,
  MINIGAME_COURSE,
  DONATION_MIN,
  DONATION_MAX,
  DONATION_OPTIONS,
  recommendCourse,
  track,
} from "./promo";
import { createShareImage, shareText, gameUrl } from "./share";


// ---------- Compartir ----------
export function SharePanel({ game }) {
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    let url = null;
    let alive = true;
    createShareImage(game).then((blob) => {
      if (!alive || !blob) return;
      url = URL.createObjectURL(blob);
      setImg({ blob, url });
    });
    return () => {
      alive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [game]);

  const text = shareText(game);
  const file = img ? new File([img.blob], "el-develop.png", { type: "image/png" }) : null;
  const canShareFile = !!file && typeof navigator !== "undefined" && navigator.canShare?.({ files: [file] });

  const shareNative = async () => {
    try {
      await navigator.share({ files: [file], text, title: "El Develop" });
      track("GameShare", { method: "native" });
    } catch {
      // El usuario canceló
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("✔ Texto y link copiados");
    } catch {
      setStatus(gameUrl());
    }
    track("GameShare", { method: "copy" });
  };

  return (
    <div className={styles.share}>
      <div className={styles.sharePreview}>
        {img ? <img src={img.url} alt="Tarjeta para compartir tu partida de El Develop" /> : <span className={styles.muted}>Generando imagen…</span>}
      </div>
      <div className={styles.shareActions}>
        <h3 className={styles.subtitle}>📸 Compartí tu partida</h3>
        <p className={styles.muted}>
          La imagen está en formato historia: ideal para estados de WhatsApp, historias de Instagram y TikTok. ¡Etiquetanos{" "}
          {INSTAGRAM_HANDLE}!
        </p>
        {canShareFile && (
          <button type="button" className={`${styles.btn} ${styles.btnPrimary}`} onClick={shareNative}>
            📲 Compartir (WhatsApp, Instagram, TikTok…)
          </button>
        )}
        <a
          className={`${styles.btn} ${canShareFile ? "" : styles.btnPrimary} ${!img ? styles.btnDisabled : ""}`}
          href={img?.url}
          download="el-develop.png"
          onClick={() => track("GameShare", { method: "download" })}
        >
          ⬇️ Descargar imagen
        </a>
        <a
          className={`${styles.btn} ${styles.btnWhatsapp}`}
          href={`https://wa.me/?text=${encodeURIComponent(text)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("GameShare", { method: "whatsapp" })}
        >
          💬 Mandar por WhatsApp
        </a>
        <button type="button" className={styles.btn} onClick={copyLink}>
          🔗 Copiar link
        </button>
        {status && <p className={styles.muted}>{status}</p>}
        <p className={styles.muted}>
          Para Instagram o TikTok desde la compu: descargá la imagen, pasala al celu y subila a tu historia.
        </p>
      </div>
    </div>
  );
}

export function ShareModal({ game, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Compartir partida">
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <SharePanel game={game} />
      </div>
    </div>
  );
}

// ---------- Cursos ----------
function CourseLink({ courseKey, highlight, source }) {
  const c = COURSES[courseKey];
  return (
    <a
      href={c.to}
      target="_blank"
      rel="noopener"
      className={`${styles.course} ${highlight ? styles.courseHighlight : ""}`}
      onClick={() => track("GameCourseClick", { course: courseKey, source })}
    >
      <span className={styles.courseIcon}>{c.icon}</span>
      <span>
        <strong>{c.name}</strong>
        <span className={styles.muted}>{c.pitch}</span>
      </span>
      <span className={styles.courseArrow}>→</span>
    </a>
  );
}

// Tip corto después de perder un minijuego
export function MinigameCourseTip({ gameId }) {
  const key = MINIGAME_COURSE[gameId];
  if (!key) return null;
  return (
    <div className={styles.courseTip}>
      <p className={styles.kicker}>💡 Tip de la vida real</p>
      <p className={styles.muted}>Esto en el laburo de verdad se aprende practicando. Lo vemos paso a paso en:</p>
      <CourseLink courseKey={key} highlight source={`minigame-${gameId}`} />
    </div>
  );
}

// Bloque con todos los cursos (hub y final)
export function CoursesBlock({ game, title, source }) {
  const rec = recommendCourse(game);
  const keys = [rec, ...Object.keys(COURSES).filter((k) => k !== rec)];
  return (
    <div className={styles.courses}>
      <p className={styles.kicker}>Subí tus stats en la vida real</p>
      <h3 className={styles.subtitle}>{title}</h3>
      <div className={styles.courseGrid}>
        {keys.map((k) => (
          <CourseLink key={k} courseKey={k} highlight={k === rec} source={source} />
        ))}
      </div>
    </div>
  );
}

// ---------- Donaciones (Mercado Pago) ----------
const fmtMonto = (n) => `$${n.toLocaleString("es-AR")}`;

export function DonationPanel({ source }) {
  const [selected, setSelected] = useState(DONATION_OPTIONS[1].amount);
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isCustom = selected === "otro";
  const value = isCustom ? Number(custom) : selected;
  const valid = Number.isInteger(value) && value >= DONATION_MIN && value <= DONATION_MAX;

  const donate = async () => {
    if (!valid || loading) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/.netlify/functions/crear-donacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monto: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.init_point) throw new Error(data.error || "No se pudo crear el pago");
      track("GameDonateClick", { value, currency: "ARS", source });
      window.location.href = data.init_point;
    } catch (e) {
      setError(e.message || "No se pudo conectar con Mercado Pago. Probá de nuevo en un ratito.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.donation}>
      <p className={styles.kicker}>Apoyá el proyecto</p>
      <h3 className={styles.subtitle}>☕ ¿Te gustó El Develop? Invitanos un cafecito</h3>
      <p className={styles.muted}>
        El juego es gratis. Con tu aporte sumamos más eventos, minijuegos y chistes de Capa 8. Pagás seguro con
        Mercado Pago.
      </p>

      <div className={styles.donationGrid}>
        {DONATION_OPTIONS.map((o) => (
          <button
            type="button"
            key={o.amount}
            className={`${styles.donationOpt} ${selected === o.amount ? styles.donationOn : ""}`}
            onClick={() => setSelected(o.amount)}
          >
            <span className={styles.donationIcon}>{o.icon}</span>
            <strong>{fmtMonto(o.amount)}</strong>
            <span className={styles.muted}>{o.label}</span>
          </button>
        ))}
        <button
          type="button"
          className={`${styles.donationOpt} ${isCustom ? styles.donationOn : ""}`}
          onClick={() => setSelected("otro")}
        >
          <span className={styles.donationIcon}>✍️</span>
          <strong>Otro monto</strong>
          <span className={styles.muted}>Lo que quieras</span>
        </button>
      </div>

      {isCustom && (
        <label className={styles.donationCustom}>
          <span>$</span>
          <input
            inputMode="numeric"
            placeholder={`Entre ${fmtMonto(DONATION_MIN)} y ${fmtMonto(DONATION_MAX)}`}
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/\D/g, "").slice(0, 7))}
            aria-label="Monto a donar"
            autoFocus
          />
        </label>
      )}
      {isCustom && custom && !valid && (
        <p className={styles.danger}>
          El monto tiene que ser entre {fmtMonto(DONATION_MIN)} y {fmtMonto(DONATION_MAX)}.
        </p>
      )}

      <button type="button" className={`${styles.btn} ${styles.btnMp}`} onClick={donate} disabled={!valid || loading}>
        {loading ? "Abriendo Mercado Pago…" : `Donar ${valid ? fmtMonto(value) : ""} con Mercado Pago`}
      </button>
      {error && <p className={styles.danger}>{error}</p>}
    </div>
  );
}

// Botón compacto que abre el panel de donaciones en un modal
export function CafecitoButton() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button type="button" className={`${styles.cafecito} ${styles.cafecitoCompact}`} onClick={() => setOpen(true)}>
        <span className={styles.cafecitoIcon}>☕</span>
        <span>
          <strong>¿Te gustó El Develop? Invitanos un cafecito</strong>
          <span className={styles.muted}>Desde $1.000 con Mercado Pago</span>
        </span>
      </button>
      {open && (
        <div className={styles.modalBackdrop} onClick={() => setOpen(false)} role="presentation">
          <div className={`${styles.modal} ${styles.modalSmall}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Donar">
            <button type="button" className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Cerrar">
              ✕
            </button>
            <DonationPanel source="hub" />
          </div>
        </div>
      )}
    </>
  );
}

// Mensaje al volver de Mercado Pago (?donacion=gracias | pendiente | error)
const DONATION_MESSAGES = {
  gracias: { cls: "donationThanks", text: "☕ ¡Gracias por el cafecito! Con esto seguimos programando (y tomando mate). Sos crack." },
  pendiente: { cls: "donationPending", text: "⏳ Tu donación quedó pendiente. Cuando Mercado Pago la acredite, nos llega. ¡Gracias!" },
  error: { cls: "donationError", text: "No se pudo completar el pago y no se te cobró nada. Si querés, probá de nuevo." },
};

export function DonationReturnBanner() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("donacion");
    if (!s || !DONATION_MESSAGES[s]) return;
    setStatus(s);
    track("GameDonationReturn", { status: s });
    // Limpiamos los parámetros que agrega Mercado Pago a la URL
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  if (!status) return null;
  const m = DONATION_MESSAGES[status];
  return (
    <div className={`${styles.donationBanner} ${styles[m.cls]}`} role="status">
      <span>{m.text}</span>
      <button type="button" className={styles.btnGhost} onClick={() => setStatus(null)} aria-label="Cerrar">
        ✕
      </button>
    </div>
  );
}
