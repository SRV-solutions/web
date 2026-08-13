import styles from "./style.module.css";

const CopyPrincipal = () => {
  const textoCompleto = `
    Bienvenido a SRV, donde la educación trasciende límites, etiquetas y métodos obsoletos. Somos más que una plataforma, más que cursos o programas: somos una revolución. Una revolución que entiende que aprender no es solo acumular conocimientos, sino transformarte desde adentro hacia afuera, conquistando tanto el mundo profesional como el personal.
    SRV nació con una misión clara: cambiar la forma en que el mundo ve la educación. Sabemos que cada persona que llega aquí tiene una chispa única, un potencial increíble que, cuando se despierta, no solo transforma vidas, sino también comunidades y hasta el mundo entero. Por eso combinamos habilidades técnicas, que te dan las herramientas para construir y conquistar, con habilidades blandas, que te ayudan a liderar, conectar y vivir con propósito.
    Acá creemos que la educación no es un destino, es un camino. Y ese camino comienza en vos: con los pensamientos más pequeños, con las acciones que parecían insignificantes, pero que, como el efecto compuesto, crean resultados extraordinarios a largo plazo.
    En SRV no venimos a enseñarte qué pensar, sino a que descubras cómo crear. Queremos que te mires al espejo y digas: ‘Acá estoy, listo para tomar el control de mi futuro.’
    Entonces, ¿qué hacemos en SRV? Creamos oportunidades. Derribamos barreras. Empoderamos. Y te acompañamos en el viaje de convertirte en quien estás destinado a ser.
    Elegí tu camino: habilidades técnicas para dominar las herramientas del mundo moderno, o habilidades blandas para liderar desde el corazón. Ambas rutas conducen a un mismo destino: una vida diseñada por vos, no por las circunstancias.
    Es momento de tomar acción. Unite a SRV y sé parte de la revolución educativa que está transformando el mundo. Porque acá, no solo aprendés… ¡acá creás la mejor versión de vos mismo!
  `;

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p>{textoCompleto}</p>
      </div>
    </div>
  );
};

export default CopyPrincipal;
