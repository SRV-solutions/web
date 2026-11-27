import { azar } from "./util";

// GEOMETRÍA DEL MAPA EN 3D (la usa Mapa.jsx). Sin WebGL ni librerías: el pueblo, el relieve, las casas y los árboles
// se proyectan con una cámara fija y se dibujan en SVG UNA sola vez, al cargar el módulo. Lo único que cambia
// mientras se mira es el color de los techos (el estado de cada conexión) y las capas de la noche, que pasan con
// opacidad (el navegador lo hace sin volver a dibujar el mapa).
//
// El mundo usa las coordenadas del mapa plano de antes: x de 0 a 960 (oeste a este), y de 0 a 480 (norte a sur) y z,
// la altura. La cámara mira desde el sur, un poco girada y desde arriba, sin perspectiva (como los mapas 3D de las
// apps de mapas): lo de atrás se dibuja primero y lo de adelante lo tapa.

const GIRO = -0.26; // radianes: el este queda un poco más lejos, así el cerro aparece atrás a la derecha
const INCLINACION = (54 * Math.PI) / 180; // 0 sería mirar desde arriba
const CG = Math.cos(GIRO);
const SG = Math.sin(GIRO);
const CT = Math.cos(INCLINACION);
const ST = Math.sin(INCLINACION);
const CENTRO = [480, 270];

const r1 = (v) => Math.round(v * 10) / 10;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const suave = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

// Del mundo al marco de la cámara (xr a la derecha, yr hacia quien mira) y de vuelta
const girar = (x, y) => {
  const dx = x - CENTRO[0];
  const dy = y - CENTRO[1];
  return [dx * CG - dy * SG, dx * SG + dy * CG];
};
const desgirar = (xr, yr) => [CENTRO[0] + xr * CG + yr * SG, CENTRO[1] - xr * SG + yr * CG];

// Curva suave que pasa por los puntos (Catmull-Rom), muestreada en tramos
function curva(puntos, porTramo = 8) {
  const out = [];
  for (let i = 0; i < puntos.length - 1; i++) {
    const p0 = puntos[Math.max(i - 1, 0)];
    const p1 = puntos[i];
    const p2 = puntos[i + 1];
    const p3 = puntos[Math.min(i + 2, puntos.length - 1)];
    for (let k = 0; k < porTramo; k++) {
      const t = k / porTramo;
      const t2 = t * t;
      const t3 = t2 * t;
      const c = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
      out.push([c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  out.push(puntos[puntos.length - 1]);
  return out;
}

// Un segmento recto, partido cada `paso` (para que siga el relieve)
function tramo(x0, y0, x1, y1, paso = 8) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / paso));
  return Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n]);
}

// ---------- El relieve ----------
const RIO = curva([
  [-260, 428], [0, 420], [170, 415], [340, 410], [507, 385], [660, 420], [810, 445], [960, 402], [1200, 388],
]);

function distanciaAlRio(x, y) {
  let min = Infinity;
  for (let i = 0; i < RIO.length - 1; i++) {
    const [ax, ay] = RIO[i];
    const [bx, by] = RIO[i + 1];
    const vx = bx - ax;
    const vy = by - ay;
    const t = clamp(((x - ax) * vx + (y - ay) * vy) / (vx * vx + vy * vy), 0, 1);
    min = Math.min(min, Math.hypot(x - ax - vx * t, y - ay - vy * t));
  }
  return min;
}

const PROFUNDIDAD_RIO = 16;
const valle = (x, y) => {
  // El arroyo corre entre y = 385 y 445: lejos de ahí el valle no se nota y se ahorra medir la distancia
  if (y < 290 || y > 540) return 0;
  const d = distanciaAlRio(x, y);
  return PROFUNDIDAD_RIO * Math.exp(-(d * d) / (2 * 30 * 30));
};

const lomo = (x, y, cx, cy, sx, sy, alto) => alto * Math.exp(-(((x - cx) ** 2) / (2 * sx * sx) + ((y - cy) ** 2) / (2 * sy * sy)));

export function altura(x, y) {
  return (
    (300 - y) * 0.035 + // el terreno sube despacio hacia el norte
    lomo(x, y, 868, 160, 76, 88, 112) + // el cerro, al este
    lomo(x, y, 1060, 10, 140, 120, 80) + // sierras del fondo
    lomo(x, y, -90, 40, 150, 120, 62) +
    lomo(x, y, 470, -170, 260, 90, 48) +
    lomo(x, y, 120, 210, 75, 60, 24) - // la loma del parque
    valle(x, y)
  );
}

// Calles y puentes: sobre el arroyo van derechas, sin bajar al valle
const alturaCamino = (x, y) => altura(x, y) + valle(x, y) * 0.9 + 0.6;

export function proyectar(x, y, z = altura(x, y)) {
  const [xr, yr] = girar(x, y);
  return [xr, yr * CT - z * ST];
}
const punto = ([u, v]) => `${r1(u)} ${r1(v)}`;
const linea = (puntos, alturaDe = altura) =>
  "M" + puntos.map(([x, y]) => punto(proyectar(x, y, alturaDe(x, y)))).join("L");

// ---------- Lo que entra en el cuadro ----------
const [U0, V0] = proyectar(520, 220);
export const ANCHO = 900;
export const ALTO = 450;
export const VISTA = `${r1(U0 - ANCHO / 2)} ${r1(V0 - ALTO / 2)} ${ANCHO} ${ALTO}`;

// ---------- El terreno: una malla sombreada según la pendiente, de atrás hacia adelante ----------
const PASO = 20;
const LUZ = (() => {
  // La luz viene del noroeste y de arriba; pasada al marco de la cámara
  const [lx, ly, lz] = [-0.5, -0.55, 0.67];
  const largo = Math.hypot(lx, ly, lz);
  return [(lx * CG - ly * SG) / largo, (lx * SG + ly * CG) / largo, lz / largo];
})();
const LUZ_PLANO = LUZ[2];

const SUELO = [221, 228, 210];
const PASTO = [178, 208, 156];
const PASTO_ALTO = [204, 223, 182];
const NIEBLA = [226, 234, 240];
const mezcla = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const NIVELES = [14, 26, 38, 50, 62, 74, 86, 98];

function calcularMalla() {
  const vTop = V0 - ALTO / 2;
  const vBottom = V0 + ALTO / 2;
  const xr0 = -ANCHO / 2 - 70;
  const xr1 = ANCHO / 2 + 70;
  const yr0 = (vTop - 50) / CT;
  const yr1 = (vBottom + 60) / CT;
  const cols = Math.ceil((xr1 - xr0) / PASO);
  const filas = Math.ceil((yr1 - yr0) / PASO);

  // Alturas en los vértices de la malla (en el marco de la cámara, para dibujar por filas)
  const H = [];
  for (let i = 0; i <= filas; i++) {
    H.push([]);
    for (let j = 0; j <= cols; j++) {
      const [x, y] = desgirar(xr0 + j * PASO, yr0 + i * PASO);
      H[i].push(altura(x, y));
    }
  }
  const P = (i, j, z = H[i][j]) => [xr0 + j * PASO, (yr0 + i * PASO) * CT - z * ST];
  // Pocos escalones de sombra, de verde y de niebla: así muchas celdas vecinas comparten color y van juntas
  const escalon = (v, paso) => Math.round(v / paso) * paso;
  // En lo plano, los puntos de una tira quedan alineados: se sacan los que no cambian la forma
  const simplificar = (cadena) => {
    const out = [cadena[0]];
    for (let q = 1; q < cadena.length - 1; q++) {
      const [ax, ay] = out[out.length - 1];
      const [bx, by] = cadena[q];
      const [cx, cy] = cadena[q + 1];
      const desvio = Math.abs((bx - ax) * (cy - ay) - (by - ay) * (cx - ax)) / Math.hypot(cx - ax, cy - ay);
      if (desvio > 0.18) out.push(cadena[q]);
    }
    out.push(cadena[cadena.length - 1]);
    return out;
  };

  const capas = [];
  for (let i = 0; i < filas; i++) {
    // Color de cada celda: pasto en lo alto, sombra según la pendiente y algo de niebla en lo lejano
    const colores = [];
    for (let j = 0; j < cols; j++) {
      const h00 = H[i][j];
      const h01 = H[i][j + 1];
      const h10 = H[i + 1][j];
      const h11 = H[i + 1][j + 1];
      const hx = (h01 + h11 - h00 - h10) / (2 * PASO);
      const hy = (h10 + h11 - h00 - h01) / (2 * PASO);
      const luz = (-hx * LUZ[0] - hy * LUZ[1] + LUZ[2]) / Math.hypot(hx, hy, 1);
      // Escalones gruesos a propósito: Mapa.jsx desenfoca el terreno y los escalones no se ven
      const sombra = escalon(clamp(1 + 1.2 * (luz - LUZ_PLANO), 0.66, 1.06), 0.05);
      const hc = (h00 + h01 + h10 + h11) / 4;
      const verde = escalon(suave(12, 30, hc), 0.34);
      const alto = escalon(suave(40, 100, hc), 0.5);
      let c = mezcla(SUELO, mezcla(PASTO, PASTO_ALTO, alto), verde).map((v) => v * sombra);
      const yr = yr0 + (i + 0.5) * PASO;
      c = mezcla(c, NIEBLA, escalon(clamp((-yr - 120) / 520, 0, 0.42), 0.1));
      colores.push(c.map((v) => clamp(Math.round(v), 0, 255)).join(","));
    }

    // Celdas vecinas del mismo color: una sola tira
    const porColor = new Map();
    let j = 0;
    while (j < cols) {
      let k = j;
      while (k + 1 < cols && colores[k + 1] === colores[j]) k++;
      const arriba = [];
      const abajo = [];
      for (let q = j; q <= k + 1; q++) {
        arriba.push(P(i, q));
        abajo.unshift(P(i + 1, q));
      }
      const d = `M${simplificar(arriba).map(punto).join("L")}L${simplificar(abajo).map(punto).join("L")}Z`;
      porColor.set(colores[j], (porColor.get(colores[j]) || "") + d);
      j = k + 1;
    }
    porColor.forEach((d, c) => capas.push({ d, color: `rgb(${c})` }));
  }

  // Curvas de nivel (cuadrados que marchan), para que el relieve se lea. Van arriba del terreno desenfocado, así
  // que se recorre de adelante hacia atrás y solo quedan los tramos que no tapa el relieve que está más adelante:
  // `horizonte` guarda, por columna, el punto más alto en pantalla de lo que ya se recorrió.
  const horizonte = new Array(cols + 1).fill(Infinity);
  const tapado = (xr, v) => {
    const jf = clamp((xr - xr0) / PASO, 0, cols);
    const j0 = Math.floor(jf);
    const j1 = Math.min(j0 + 1, cols);
    const hz = horizonte[j0] + (horizonte[j1] - horizonte[j0]) * (jf - j0);
    return v > hz + 0.5;
  };
  let curvas = "";
  for (let i = filas - 1; i >= 0; i--) {
    for (let jj = 0; jj < cols; jj++) {
      const esquinas = [
        [i, jj],
        [i, jj + 1],
        [i + 1, jj + 1],
        [i + 1, jj],
      ];
      const hs = esquinas.map(([a, b]) => H[a][b]);
      for (const nivel of NIVELES) {
        if (Math.max(...hs) < nivel || Math.min(...hs) >= nivel) continue;
        const cortes = [];
        for (let e = 0; e < 4; e++) {
          const ha = hs[e];
          const hb = hs[(e + 1) % 4];
          if (ha < nivel === hb < nivel) continue;
          const t = (nivel - ha) / (hb - ha);
          const [ia, ja] = esquinas[e];
          const [ib, jb] = esquinas[(e + 1) % 4];
          const xr = xr0 + (ja + (jb - ja) * t) * PASO;
          const yr = yr0 + (ia + (ib - ia) * t) * PASO;
          cortes.push([xr, yr * CT - nivel * ST]);
        }
        for (let c = 0; c + 1 < cortes.length; c += 2) {
          const [p, q] = [cortes[c], cortes[c + 1]];
          if (!tapado(...p) && !tapado(...q)) curvas += `M${punto(p)}L${punto(q)}`;
        }
      }
    }
    // Esta fila de vértices ya puede tapar a las de atrás
    for (let j = 0; j <= cols; j++) horizonte[j] = Math.min(horizonte[j], P(i + 1, j)[1]);
  }
  return { capas, curvas };
}

// ¿Lo tapa el relieve que tiene adelante? Se recorre el rayo hacia la cámara (para los árboles, que son pocos)
function seVe(x, y, z) {
  const [xr, yr] = girar(x, y);
  const v = yr * CT - z * ST;
  for (let d = 8; d < 320; d += 8) {
    const [x2, y2] = desgirar(xr, yr + d);
    if ((yr + d) * CT - altura(x2, y2) * ST < v - 0.5) return false;
  }
  return true;
}

// ---------- Lo que va sobre el terreno ----------
const COLUMNAS = [255, 345, 435, 525, 615, 705];
const FILAS = [80, 160, 240, 320];

const CALLES = [
  ...FILAS.map((y) => tramo(230, y, 730, y)),
  ...COLUMNAS.map((x) => tramo(x, 60, x, 345)),
  tramo(435, 345, 435, 480),
  tramo(615, 345, 615, 480),
];

const rectanguloRedondeado = (x, y, w, h, r) =>
  curva(
    [
      [x + r, y], [x + w - r, y], [x + w, y + r], [x + w, y + h - r], [x + w - r, y + h], [x + r, y + h], [x, y + h - r],
      [x, y + r], [x + r, y],
    ],
    6
  );

const calcularSuperficie = () => ({
  rio: linea(RIO, (x, y) => altura(x, y) + 0.4),
  calles: CALLES.map((c) => linea(c, alturaCamino)).join(""),
  ruta: linea(curva([[-200, 24], [0, 34], [115, 45], [230, 80]], 10), alturaCamino),
  parque: linea(rectanguloRedondeado(40, 150, 160, 120, 34), (x, y) => altura(x, y) + 0.3) + "Z",
  corte: linea(rectanguloRedondeado(517, 150, 196, 100, 10), (x, y) => altura(x, y) + 0.8) + "Z",
});

// ---------- Las casas (las mismas del mapa plano) ----------
const ESTADOS_AL_AZAR = (n) => (n < 0.74 ? "alDia" : n < 0.86 ? "deuda" : n < 0.95 ? "mora" : "cortado");

const CASAS_BASE = (() => {
  const r = azar(2026);
  const casas = [];
  const sumar = (x, y) => casas.push({ x: x + (r() - 0.5) * 3, y: y + (r() - 0.5) * 3, estado: ESTADOS_AL_AZAR(r()) });
  for (let f = 0; f < FILAS.length - 1; f++) {
    for (let c = 0; c < COLUMNAS.length - 1; c++) {
      const x0 = COLUMNAS[c] + 14;
      const x1 = COLUMNAS[c + 1] - 14;
      for (const y of [FILAS[f] + 13, FILAS[f + 1] - 13]) {
        for (let x = x0; x <= x1 + 0.1; x += 15.5) {
          if (r() < 0.16) continue;
          sumar(x, y);
        }
      }
    }
  }
  // Casas sueltas sobre la ruta y del otro lado del arroyo
  for (let i = 0; i < 8; i++) sumar(30 + i * 26, 44 + i * 4.6 + (i % 2 ? 13 : -13));
  for (let x = 300; x <= 690; x += 34) if (r() > 0.3) sumar(x, 462);
  return casas;
})();

// Las conexiones con su estado inicial: es barato y Mapa.jsx lo necesita desde el principio
export const CONEXIONES = CASAS_BASE.map(({ estado }) => ({ estado }));

const MEDIO_LADO = 4.2;
const caja = (x, y, z0, z1) => {
  const s = MEDIO_LADO;
  const esq = { no: [x - s, y - s], ne: [x + s, y - s], se: [x + s, y + s], so: [x - s, y + s] };
  const P = ([px, py], z) => punto(proyectar(px, py, z));
  return {
    // Con este giro se ven la cara sur (de frente) y la oeste (de costado)
    sur: [P(esq.so, z0), P(esq.se, z0), P(esq.se, z1), P(esq.so, z1)].join(" "),
    oeste: [P(esq.no, z0), P(esq.so, z0), P(esq.so, z1), P(esq.no, z1)].join(" "),
    techo: [P(esq.no, z1), P(esq.ne, z1), P(esq.se, z1), P(esq.so, z1)].join(" "),
  };
};

function calcularCasas() {
  const r = azar(41);
  return CASAS_BASE.map((c) => {
    const z0 = altura(c.x, c.y);
    const z1 = z0 + 6 + r() * 4;
    const [u, v] = proyectar(c.x, c.y, z1);
    const [ul, vl] = proyectar(c.x, c.y, (z0 + z1) / 2);
    return { ...caja(c.x, c.y, z0, z1), centro: [r1(u), r1(v)], luz: [r1(ul), r1(vl)], yr: girar(c.x, c.y)[1] };
  });
}

// ---------- Árboles: en el cerro, en el parque y a la orilla del arroyo ----------
function calcularArboles() {
  const r = azar(77);
  const lista = [];
  const libre = (x, y) => lista.every(([ax, ay]) => Math.hypot(ax - x, ay - y) > 16);
  // Solo en las laderas que miran hacia la cámara: los de atrás del cerro quedarían flotando
  const deFrente = (x, y) => {
    const [xr, yr] = girar(x, y);
    const [x2, y2] = desgirar(xr, yr + 3);
    return altura(x2, y2) - altura(x, y) < 1.2;
  };
  const probar = (x, y, ok) => {
    if (ok && libre(x, y) && deFrente(x, y) && seVe(x, y, altura(x, y) + 4)) lista.push([x, y]);
  };
  for (let k = 0; k < 1600 && lista.length < 85; k++) {
    const x = 720 + r() * 420;
    const y = -60 + r() * 400;
    const h = altura(x, y);
    probar(x, y, h > 16 && h < 92 && (x > 748 || y < 50));
  }
  for (let k = 0; k < 200; k++) {
    const x = 50 + r() * 140;
    const y = 160 + r() * 100;
    probar(x, y, r() < 0.35);
  }
  for (let k = 0; k < 400; k++) {
    const x = -120 + r() * 1200;
    const y = 330 + r() * 160;
    const d = distanciaAlRio(x, y);
    const fueraDelPueblo = x < 215 || x > 745;
    probar(x, y, fueraDelPueblo && d > 16 && d < 34 && r() < 0.5);
  }
  return lista.map(([x, y], i) => {
    const z = altura(x, y);
    const [ub, vb] = proyectar(x, y, z);
    const [uc, vc] = proyectar(x, y, z + 9);
    return { yr: girar(x, y)[1], base: [r1(ub), r1(vb)], copa: [r1(uc), r1(vc)], tono: i % 3, r: 4.6 + ((i * 7) % 5) * 0.35 };
  });
}

// ---------- Textos ----------
const etiqueta = (x, y, alto = 3) => {
  const [u, v] = proyectar(x, y, altura(x, y) + alto);
  return [r1(u), r1(v)];
};

// ---------- Todo junto ----------
// Son unos 50 ms en una PC (más en un celular): Mapa.jsx lo pide recién cuando el mapa está por verse y el
// navegador está libre, y queda guardado para la próxima vez que se monte.
let geometriaCalculada = null;
export function geometria() {
  if (geometriaCalculada) return geometriaCalculada;
  const malla = calcularMalla();
  const casas = calcularCasas();
  geometriaCalculada = {
    terreno: malla.capas,
    curvas: malla.curvas,
    superficie: calcularSuperficie(),
    casas,
    // Árboles y paredes de las casas, de atrás hacia adelante (los techos van en otra capa, arriba de la noche)
    objetos: [
      ...calcularArboles().map((a) => ({ tipo: "arbol", ...a })),
      ...casas.map((c, i) => ({ tipo: "casa", i, yr: c.yr, sur: c.sur, oeste: c.oeste })),
    ].sort((a, b) => a.yr - b.yr),
    etiquetas: {
      norte: etiqueta(610, 46),
      centro: etiqueta(480, 203),
      corte: etiqueta(615, 200),
      rio: etiqueta(560, 448),
      cerro: etiqueta(868, 160, 14),
    },
  };
  return geometriaCalculada;
}
