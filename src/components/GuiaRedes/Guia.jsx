import React from "react";
import styles from "./style.module.css";

// Contenido de la guía «Redes y nube desde cero», el mismo del PDF (REDES\guias-redes\pdf). Si cambia el PDF,
// cambiar también este archivo. La sección 1 es abierta; el vocabulario y las secciones 2 a 10 se desbloquean
// con el mail (ver Index.jsx).

const C = ({ children }) => <code className={styles.code}>{children}</code>;

const Tabla = ({ cabeza, filas }) => (
  <div className={styles.tablaWrap}>
    <table className={styles.tabla}>
      <thead>
        <tr>
          {cabeza.map((h) => (
            <th key={h}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {filas.map((fila, i) => (
          <tr key={i}>
            {fila.map((celda, j) => (
              <td key={j}>{celda}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// Recuadros «Para pensarlo fácil» (azul), datos (verde) y avisos (naranja)
const Nota = ({ color = "azul", titulo, children }) => (
  <div className={`${styles.nota} ${styles[`nota_${color}`]}`}>
    <p className={styles.notaTitulo}>{titulo}</p>
    <p>{children}</p>
  </div>
);

const Pasos = ({ items }) => (
  <ol className={styles.pasos}>
    {items.map((paso, i) => (
      <li key={i}>{paso}</li>
    ))}
  </ol>
);

const Tarjetas = ({ items }) => (
  <div className={styles.tarjetas}>
    {items.map((t) => (
      <div key={t.titulo} className={`${styles.tarjeta} ${styles[`borde_${t.color}`]}`}>
        {t.rotulo && <p className={`${styles.rotulo} ${styles[`texto_${t.color}`]}`}>{t.rotulo}</p>}
        <h4>{t.titulo}</h4>
        <p>{t.texto}</p>
      </div>
    ))}
  </div>
);

const Subtitulo = ({ children }) => <h3 className={styles.guiaSubtitulo}>{children}</h3>;

// Norma T568B: [nombre, color, rayado con blanco]
const HILOS_T568B = [
  ["Blanco-naranja", "#f6950a", true],
  ["Naranja", "#f6950a", false],
  ["Blanco-verde", "#30a05a", true],
  ["Azul", "#0b78fb", false],
  ["Blanco-azul", "#0b78fb", true],
  ["Verde", "#30a05a", false],
  ["Blanco-marrón", "#8b5a2b", true],
  ["Marrón", "#8b5a2b", false],
];

export const INTRO = (
  <>
    <p>
      Esta guía junta, en palabras de todos los días, lo que contamos en los clips de WEARESRV. No hace falta saber
      nada de antes: leé un tema, probalo en tu compu y seguí con el próximo.
    </p>
    <Subtitulo>Qué es una red, en una línea</Subtitulo>
    <p>
      Una <strong>red</strong> es un grupo de equipos (compus, celulares, servidores, impresoras) conectados para
      compartir información. <strong>Internet</strong> es la red de redes: millones de redes unidas entre sí. Aprender
      redes es aprender cómo hablan entre sí todos esos equipos.
    </p>
    <Subtitulo>Tu plan para empezar, en 4 pasos</Subtitulo>
    <Pasos
      items={[
        <>
          <strong>Mirá tu propia red (15 minutos).</strong> Abrí <C>cmd</C> y probá <C>ipconfig</C>,{" "}
          <C>ping 8.8.8.8</C> y <C>tracert google.com</C> (están en la sección 7). Ya estás haciendo redes.
        </>,
        <>
          <strong>Aprendé el idioma.</strong> Leé las secciones 3 a 7: cómo viaja un mensaje, el cable, las 7 capas, el
          switch y las IPs. No hace falta memorizar: volvé a esta guía cada vez que la necesites.
        </>,
        <>
          <strong>Armá tu primera red virtual.</strong> Instalá <strong>Cisco Packet Tracer</strong> (gratis, con una
          cuenta de Cisco Networking Academy) y hacé el reto de la sección 9.
        </>,
        <>
          <strong>Subí a la nube.</strong> Creá una cuenta de AWS y, antes de crear nada, activá MFA en el root y poné
          una alerta de presupuesto (sección 2).
        </>,
      ]}
    />
  </>
);

export const VOCABULARIO = (
  <Tabla
    cabeza={["Palabra", "Qué es"]}
    filas={[
      ["Cliente y servidor", "El cliente pide (tu celu, tu navegador) y el servidor responde."],
      ["IP", "La dirección de un equipo en la red, como la dirección de una casa."],
      ["MAC", "El número de serie de la placa de red: identifica al equipo dentro de su red local."],
      ["Router", "Une redes distintas y elige el camino. El de tu casa te conecta con internet."],
      ["Switch", "Une los equipos de una misma red local y manda cada dato al equipo correcto."],
      ["DHCP", "El servicio que le reparte una IP a cada equipo cuando se conecta."],
      ["DNS", "La agenda de internet: traduce nombres como google.com a direcciones IP."],
      ["Puerto", "La puerta de entrada de un servicio dentro de un equipo. La web segura (HTTPS) usa la 443."],
    ]}
  />
);

// palabra: la que se comenta en cada clip (tabla «Encontrá tu tema» del PDF). La 10 no tiene: no va en el índice.
export const SECCIONES = [
  {
    num: 1,
    palabra: "NUBE",
    titulo: "La nube es la computadora de otro",
    resumen: "Servidores, data centers, regiones y zonas de disponibilidad, y cuál es la región de AWS más cercana.",
    contenido: (
      <>
        <p>
          Un servidor no tiene nada de mágico: es <strong>una computadora</strong>, con procesador, memoria RAM y disco,
          que está prendida todo el tiempo y a la que otras computadoras le piden cosas. Lo que llamamos{" "}
          <strong>la nube</strong> son edificios enormes llenos de esas computadoras, los <strong>data centers</strong>,
          repartidos por el mundo. Cuando guardás una foto o mirás un video, estás usando la computadora de otro.
        </p>
        <Tarjetas
          items={[
            {
              color: "azul",
              rotulo: "Región",
              titulo: "Un lugar del mundo",
              texto: "Una zona del mundo con varios data centers. Por ejemplo, N. Virginia o São Paulo.",
            },
            {
              color: "naranja",
              rotulo: "Zona de disponibilidad",
              titulo: "Uno o más data centers",
              texto: "Con energía y red propias. Si una falla, las otras de la región siguen funcionando.",
            },
            {
              color: "verde",
              rotulo: "Data center",
              titulo: "El edificio",
              texto: "Servidores, refrigeración, energía de respaldo y mucha seguridad. Vos nunca lo ves: lo usás por internet.",
            },
          ]}
        />
        <Nota titulo="Para pensarlo fácil">
          Usar la nube es como alquilar un departamento en vez de comprar el edificio: usás lo que necesitás, pagás
          mientras lo usás y el mantenimiento es de otro.
        </Nota>
        <Nota color="verde" titulo="¿Y en Argentina?">
          AWS no tiene una región completa en el país. La más cercana es <strong>São Paulo</strong>. En nuestro curso
          trabajamos en <strong>N. Virginia</strong>, que en AWS se llama <C>us-east-1</C> y suele ser la más barata.
        </Nota>
      </>
    ),
  },
  {
    num: 2,
    palabra: "AWS",
    titulo: "El usuario root: la llave maestra",
    resumen: "Por qué no se usa para trabajar y los cinco hábitos que te cuidan la cuenta: MFA, IAM y alerta de presupuesto.",
    contenido: (
      <>
        <p>
          Cuando creás una cuenta de AWS, el primer usuario que existe es el <strong>root</strong>: el dueño de todo.
          Puede hacer absolutamente cualquier cosa: crear y borrar recursos, ver la facturación y hasta cerrar la
          cuenta. Por eso <strong>no se usa para el trabajo de todos los días y nunca se le da a otra persona</strong>,
          ni siquiera al junior del equipo.
        </p>
        <Subtitulo>Cinco hábitos que te cuidan la cuenta</Subtitulo>
        <ul className={styles.checklist}>
          <li>
            Activá <strong>MFA</strong> (verificación en dos pasos) en el usuario root.
          </li>
          <li>
            Creá un <strong>usuario IAM</strong> para vos y usalo para trabajar. El root queda guardado.
          </li>
          <li>
            A cada persona dale <strong>solo los permisos que necesita</strong> (mínimo privilegio).
          </li>
          <li>
            Poné una <strong>alerta de presupuesto</strong> en AWS Budgets para que no te llegue una sorpresa a fin de
            mes.
          </li>
          <li>
            Nunca subas tus <strong>claves de acceso</strong> a GitHub ni las pegues en un chat.
          </li>
        </ul>
        <Nota titulo="Para pensarlo fácil">
          El root es la llave maestra del edificio: abre todas las puertas. A cada persona le das una llave que abre
          solamente la puerta que necesita.
        </Nota>
      </>
    ),
  },
  {
    num: 3,
    palabra: "RED",
    titulo: "El viaje de tu mensaje",
    resumen: "Paquetes, nodos, Las Toninas y los cables submarinos, y por qué internet no se apaga con un botón.",
    contenido: (
      <>
        <p>
          Cuando mandás un WhatsApp, el mensaje no viaja de un salto: se corta en <strong>paquetes</strong> (pedacitos
          con una etiqueta que dice de dónde vienen, a dónde van y qué número de parte son) que pasan por muchos nodos
          hasta llegar y volver a armarse. Todo en una fracción de segundo.
        </p>
        <ol className={styles.viaje}>
          {[
            ["Tu equipo", "Por Wi-Fi o por cable llega al router de tu casa."],
            ["El nodo de tu cuadra", "El proveedor junta ahí los cables de los vecinos."],
            ["El proveedor", "Sus centrales llevan el tráfico de toda la zona."],
            ["Las Toninas", "Donde llegan a la Argentina los cables submarinos."],
            ["El destino", "El servidor, en otro país, recibe y responde."],
          ].map(([titulo, texto]) => (
            <li key={titulo}>
              <strong>{titulo}</strong>
              <span>{texto}</span>
            </li>
          ))}
        </ol>
        <p>
          Los continentes se unen con <strong>cables submarinos</strong> de fibra óptica. Internet es una gran red en{" "}
          <strong>malla</strong>: no todos los puntos están conectados con todos, pero casi siempre hay más de un
          camino. Los routers buscan la mejor ruta para cada paquete, y si se corta el cable de Brasil a Miami, el
          paquete puede dar la vuelta por otro lado, por ejemplo por Venezuela.
        </p>
        <Nota color="verde" titulo="¿Se puede apagar internet con un botón?">
          No. No hay un súper router que mande sobre todo: cada nodo funciona por su cuenta y se comunica con sus
          vecinos. Si uno se apaga, el tráfico busca otro camino.
        </Nota>
      </>
    ),
  },
  {
    num: 4,
    palabra: "CABLE",
    titulo: "El cable de red y sus colores",
    resumen: "Los 8 colores de la norma T568B, cómo se arma un cable paso a paso y cuándo va directo o cruzado.",
    contenido: (
      <>
        <p>
          El cable de las redes de casas y oficinas se llama <strong>par trenzado</strong> (UTP): tiene 8 cables
          finitos que vienen de a pares enroscados entre sí, y el trenzado reduce las interferencias. Se conecta con
          una ficha <strong>RJ-45</strong> (la del teléfono fijo, más chica, es la RJ-11). Llega hasta{" "}
          <strong>100 metros</strong> por tramo.
        </p>
        <figure className={styles.cable}>
          <ol className={styles.hilos}>
            {HILOS_T568B.map(([nombre, color, rayado], i) => (
              <li key={nombre}>
                <span
                  className={styles.hilo}
                  style={{
                    background: rayado ? `repeating-linear-gradient(135deg, ${color} 0 5px, #fff 5px 10px)` : color,
                  }}
                />
                <span className={styles.hiloNum}>{i + 1}</span>
                <span className={styles.hiloNombre}>{nombre}</span>
              </li>
            ))}
          </ol>
          <figcaption>
            Norma <strong>T568B</strong>, mirando la ficha con la traba hacia abajo. En la <strong>T568A</strong> se
            intercambian los pares naranja y verde.
          </figcaption>
        </figure>
        <Subtitulo>Cómo se arma un cable, paso a paso</Subtitulo>
        <Pasos
          items={[
            <>
              <strong>Pelá</strong> unos 3 cm de la cubierta, sin cortar los cables de adentro.
            </>,
            <>
              <strong>Destrenzá</strong> los cuatro pares y ordenalos con los colores de la norma <strong>T568B</strong>.
            </>,
            <>
              <strong>Estirá</strong> los cables, cortalos parejos y dejá unos 1,2 cm sin cubierta.
            </>,
            <>
              <strong>Metelos</strong> en la ficha, con la traba hacia abajo, hasta el fondo: se tienen que ver los 8
              cables tocando el frente.
            </>,
            <>
              <strong>Apretá</strong> con la crimpeadora: los dientes dorados se hunden y enganchan cada cable. Ahí
              suena el <strong>clic</strong>.
            </>,
            <>
              <strong>Probalo</strong> con un tester: las 8 luces tienen que prenderse en orden.
            </>,
          ]}
        />
        <Tabla
          cabeza={["Cable", "Las dos puntas", "Cuándo se usa"]}
          filas={[
            [
              "Directo",
              "Iguales: T568B y T568B.",
              <>
                Entre equipos <strong>distintos</strong>: PC a switch, switch a router.
              </>,
            ],
            [
              "Cruzado",
              "Distintas: T568A y T568B.",
              <>
                Entre equipos <strong>iguales</strong>: PC a PC, switch a switch.
              </>,
            ],
          ]}
        />
        <Nota color="verde" titulo="Hoy casi siempre alcanza con uno directo">
          La mayoría de los switches y placas de red actuales tienen <strong>Auto-MDIX</strong>: detectan el tipo de
          cable y se adaptan solos.
        </Nota>
      </>
    ),
  },
  {
    num: 5,
    palabra: "OSI",
    titulo: "Las 7 capas del modelo OSI",
    resumen: "Qué hace cada capa, con ejemplos, y la capa 8: el chiste que todo técnico conoce.",
    contenido: (
      <>
        <p>
          El modelo OSI divide todo lo que pasa en una red en <strong>7 capas</strong>, cada una con un trabajo. Sirve
          para ubicar un problema: ¿falla el cable, la dirección o la aplicación? Se leen de abajo hacia arriba:{" "}
          <strong>Física, Enlace, Red, Transporte, Sesión, Presentación, Aplicación</strong>.
        </p>
        <Tabla
          cabeza={["#", "Capa", "Qué hace", "Ejemplos"]}
          filas={[
            ["7", "Aplicación", "Es lo que usás: el navegador, el mail, la web.", "HTTP, HTTPS, DNS, DHCP, SSH"],
            ["6", "Presentación", "Traduce, comprime y cifra los datos.", "Formatos de imagen, cifrado"],
            ["5", "Sesión", "Abre, mantiene y cierra la conversación.", "Inicio y cierre de sesión"],
            ["4", "Transporte", "Parte los datos y controla que lleguen. Usa puertos.", "TCP, UDP"],
            ["3", "Red", "Elige el camino usando direcciones IP.", "IP, routers"],
            ["2", "Enlace de datos", "Lleva la trama de un equipo al siguiente con direcciones MAC.", "Ethernet, Wi-Fi, switches"],
            ["1", "Física", "Mueve los bits como señales eléctricas, de luz o de radio.", "Cable UTP, fibra, hubs"],
          ]}
        />
        <Nota color="naranja" titulo="La capa 8">
          Los técnicos bromean con que existe una capa 8: <strong>el usuario</strong>. No está en el modelo oficial, pero
          cuando todo parece bien y aun así no anda, el problema puede estar entre el teclado y la silla (en inglés,{" "}
          <strong>PEBKAC</strong>). No es para burlarse de nadie: es para acordarte de revisar lo básico antes de
          culpar a la red.
        </Nota>
      </>
    ),
  },
  {
    num: 6,
    palabra: "SWITCH",
    titulo: "Hub, switch y cómo aprende",
    resumen: "Half y full duplex, la tabla MAC y el switch explicado como un portero nuevo.",
    contenido: (
      <>
        <Tarjetas
          items={[
            {
              color: "naranja",
              rotulo: "Hub",
              titulo: "Half duplex",
              texto:
                "Copia todo a todos los puertos y habla uno por vez: como el Nextel o un handy, mientras uno habla el otro escucha.",
            },
            {
              color: "azul",
              rotulo: "Switch",
              titulo: "Full duplex",
              texto:
                "Manda cada trama solo al puerto que corresponde y envía y recibe a la vez, como una llamada de teléfono.",
            },
          ]}
        />
        <p>
          Para saber por qué puerto mandar cada trama, el switch arma una <strong>tabla MAC</strong>: una lista de qué
          dirección MAC está en cada puerto. Nadie se la carga: <strong>la aprende sola</strong> mirando el tráfico.
        </p>
        <Tabla
          cabeza={["El switch…", "Qué hace"]}
          filas={[
            [
              "Aprende",
              <>
                Mira la MAC de <strong>origen</strong> de cada trama y anota en qué puerto está.
              </>,
            ],
            ["Reenvía", "Si ya conoce la MAC de destino, manda la trama solo por ese puerto."],
            ["Inunda", "Si no la conoce, la copia por todos los puertos menos por el que entró."],
            ["Olvida", "Borra una entrada si pasan unos 5 minutos sin tráfico de esa MAC."],
          ]}
        />
        <Nota titulo="Para pensarlo fácil: el portero nuevo">
          Un portero que recién empieza no sabe quién vive en cada departamento. Cada vez que un vecino sale, lo anota
          en su libreta. Si llega un paquete para alguien que todavía no anotó, lo deja en todos los pisos. Cuando ya lo
          conoce, lo entrega directo. Así funciona el switch.
        </Nota>
      </>
    ),
  },
  {
    num: 7,
    palabra: "IP",
    titulo: "Direcciones IP: ¿por qué 254 y no 256?",
    resumen: "Qué quiere decir /24, la dirección de red, el broadcast y los comandos para mirar tu red desde Windows.",
    contenido: (
      <>
        <p>
          Una dirección IPv4 son <strong>4 números</strong> entre 0 y 255 separados por puntos, como{" "}
          <C>192.168.1.10</C>. En una red <C>192.168.1.0/24</C>, el <C>/24</C> quiere decir que los primeros 24 bits
          identifican la red y quedan <strong>8 bits</strong> para los equipos: 2<sup>8</sup> = <strong>256</strong>{" "}
          direcciones. Pero hay <strong>dos que no se le pueden dar a ningún equipo</strong>, así que quedan 256 − 2 ={" "}
          <strong>254</strong>.
        </p>
        <Tabla
          cabeza={["Red 192.168.1.0/24", "Dirección", "Para qué"]}
          filas={[
            ["Dirección de red", <C>192.168.1.0</C>, "Es el nombre del barrio. No se asigna."],
            ["Primera asignable", <C>192.168.1.1</C>, "Casi siempre, el router (la puerta de salida)."],
            ["Última asignable", <C>192.168.1.254</C>, "El último equipo posible."],
            ["Broadcast", <C>192.168.1.255</C>, "Un mensaje a esta dirección les llega a todos. No se asigna."],
          ]}
        />
        <Subtitulo>Mirá tu red desde Windows</Subtitulo>
        <p>
          Abrí el símbolo del sistema (<kbd className={styles.kbd}>Windows</kbd>, escribí <C>cmd</C> y{" "}
          <kbd className={styles.kbd}>Enter</kbd>) y probá:
        </p>
        <Tabla
          cabeza={["Comando", "Qué te dice"]}
          filas={[
            [<C>ipconfig</C>, "Tu IP, tu máscara y tu puerta de enlace (el router)."],
            [<C>ping 8.8.8.8</C>, "Si tenés salida a internet y cuánto tarda en responder."],
            [<C>tracert google.com</C>, "Por qué nodos pasa tu mensaje hasta llegar."],
            [<C>nslookup google.com</C>, "Qué IP tiene ese nombre (consulta al DNS)."],
          ]}
        />
      </>
    ),
  },
  {
    num: 8,
    palabra: "CISCO",
    titulo: "Comandos de Cisco: la chuleta",
    resumen: "Los modos de la consola, la configuración básica, cómo guardarla y qué hacer si se queda pensando.",
    contenido: (
      <>
        <p>
          Los switches y routers Cisco se configuran por consola, escribiendo comandos. Lo primero que tenés que mirar
          es el <strong>prompt</strong>, porque te dice en qué modo estás:
        </p>
        <Tabla
          cabeza={["Prompt", "Modo", "Cómo se entra"]}
          filas={[
            [<C>Switch&gt;</C>, "Usuario: casi no se puede hacer nada.", "Es donde arrancás."],
            [<C>Switch#</C>, "Privilegiado: se puede mirar todo.", <C>enable</C>],
            [<C>Switch(config)#</C>, "Configuración: acá se cambian cosas.", <C>configure terminal</C>],
          ]}
        />
        <pre className={styles.consola}>
          {[
            ["Switch> ", "enable", ""],
            ["Switch# ", "configure terminal", ""],
            ["Switch(config)# ", "hostname SW-OFICINA", "# le pone nombre al equipo"],
            ["SW-OFICINA(config)# ", "no ip domain-lookup", "# evita que se congele"],
            ["SW-OFICINA(config)# ", "enable secret TuClaveAca", "# clave para el modo privilegiado"],
            ["SW-OFICINA(config)# ", "end", ""],
            ["SW-OFICINA# ", "show running-config", "# mirar lo que quedó"],
            ["SW-OFICINA# ", "copy running-config startup-config", "# guardar"],
          ].map(([prompt, comando, comentario]) => (
            <span key={prompt + comando} className={styles.consolaLinea}>
              <span className={styles.consolaPrompt}>{prompt}</span>
              {comando}
              {comentario && <span className={styles.consolaComentario}>{"   " + comentario}</span>}
              {"\n"}
            </span>
          ))}
        </pre>
        <Nota color="naranja" titulo="Cuidado: la consola que se queda pensando">
          Si escribís mal un comando, el equipo cree que es el nombre de otro equipo y lo intenta buscar: aparece{" "}
          <C>Translating...</C> y la consola se congela unos segundos. Se corta con{" "}
          <kbd className={styles.kbd}>Ctrl</kbd> + <kbd className={styles.kbd}>Shift</kbd> +{" "}
          <kbd className={styles.kbd}>6</kbd> y se evita para siempre con <C>no ip domain-lookup</C>.
        </Nota>
        <Tarjetas
          items={[
            {
              color: "azul",
              rotulo: "running-config",
              titulo: "En la RAM",
              texto: "Lo que el equipo está usando ahora. Cada comando que escribís la cambia al instante.",
            },
            {
              color: "naranja",
              rotulo: "startup-config",
              titulo: "En la NVRAM",
              texto: "Lo que se carga al encender. Solo cambia cuando guardás.",
            },
            {
              color: "verde",
              rotulo: "Para guardar",
              titulo: "copy run start",
              texto: (
                <>
                  <C>copy running-config startup-config</C>, o el atajo <C>write memory</C>.
                </>
              ),
            },
          ]}
        />
        <Nota titulo="Para pensarlo fácil">
          La running-config es un documento de Word abierto; la startup-config es el archivo guardado. Si se corta la
          luz sin guardar, perdés todos los cambios. <strong>Guardá siempre.</strong>
        </Nota>
        <Tabla
          cabeza={["Comando", "Qué muestra"]}
          filas={[
            [<C>show running-config</C>, "La configuración que está funcionando ahora."],
            [<C>show ip interface brief</C>, "Cada interfaz con su IP y su estado, en una línea."],
            [<C>show mac address-table</C>, "La tabla MAC del switch."],
          ]}
        />
      </>
    ),
  },
  {
    num: 9,
    palabra: "PRÁCTICA",
    titulo: "Tu primer reto: una red en Packet Tracer",
    resumen: "Una red con un switch y 3 PCs en 10 minutos, y una autoevaluación de 8 preguntas para cerrar.",
    contenido: (
      <>
        <p>Con todo lo anterior ya podés armar una red de verdad, sin comprar nada. Son 10 minutos:</p>
        <Pasos
          items={[
            <>
              Abrí <strong>Packet Tracer</strong> y agregá un <strong>switch 2960</strong> y <strong>3 PCs</strong>.
            </>,
            <>
              Conectá cada PC a un puerto del switch con un cable <strong>directo</strong> (
              <em>Copper Straight-Through</em>).
            </>,
            <>
              En cada PC, <strong>Desktop &gt; IP Configuration</strong>: poné <C>192.168.1.10</C>,{" "}
              <C>192.168.1.11</C> y <C>192.168.1.12</C>, con máscara <C>255.255.255.0</C>.
            </>,
            <>
              Desde la PC0 abrí el <strong>Command Prompt</strong> y escribí <C>ping 192.168.1.11</C>. Si responde, tu
              red funciona.
            </>,
            <>
              Clic en el switch, pestaña <strong>CLI</strong>, y escribí <C>enable</C> y <C>show mac address-table</C>:
              vas a ver que el switch <strong>aprendió</strong> las MAC de tus PCs.
            </>,
            <>
              Guardá con <C>copy running-config startup-config</C>. Así no perdés nada si cerrás el programa.
            </>,
          ]}
        />
        <Nota color="verde" titulo="Si el primer ping pierde un paquete">
          Es normal: antes del primer ping, la PC tiene que averiguar la MAC del destino (con ARP) y el primer intento
          puede vencer. Del segundo en adelante responde bien.
        </Nota>
      </>
    ),
  },
  {
    num: 10,
    titulo: "Autoevaluación",
    contenido: (
      <>
        <p>Tocá cada pregunta para ver la respuesta.</p>
        <div className={styles.preguntas}>
          {[
            ["¿Qué es un data center?", "Un edificio con muchísimos servidores conectados."],
            [
              "¿Por qué no se le da el usuario root a otra persona?",
              "Porque puede hacer todo, hasta cerrar la cuenta: se trabaja con usuarios IAM de permisos mínimos.",
            ],
            ["¿Qué pasa con tu mensaje si se corta un cable submarino?", "Los routers buscan otro camino."],
            ["¿Qué norma de colores se usa para armar el cable?", "La T568B."],
            ["¿Qué es la capa 8?", "El usuario. Es una broma: no existe en el modelo."],
            [
              "¿Qué diferencia hay entre un hub y un switch?",
              "El hub copia a todos y es half duplex; el switch manda al puerto correcto y es full duplex.",
            ],
            [
              "¿Por qué una red /24 tiene 254 equipos y no 256?",
              "Porque dos direcciones están reservadas: la de red y el broadcast.",
            ],
            [
              "¿Qué pasa si no guardás la configuración y se corta la luz?",
              "Perdés todo, porque la running-config vive en la RAM.",
            ],
          ].map(([pregunta, respuesta], i) => (
            <details key={pregunta} className={styles.pregunta}>
              <summary>
                {i + 1}. {pregunta}
              </summary>
              <p>{respuesta}</p>
            </details>
          ))}
        </div>
      </>
    ),
  },
];
