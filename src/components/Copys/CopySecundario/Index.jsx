import styles from './style.module.css';

const CopyPrincipal = () => {
  const textoCompleto = `Imaginá un mundo donde las fronteras no existen, donde tus habilidades son la llave que abre puertas a oportunidades globales, y donde tu único límite es tu determinación. Eso es lo que sucede cuando dominás el backend: transformás no solo tu vida profesional, sino también tu vida personal y financiera.
  El backend no es solo código, es la base que impulsa las aplicaciones que usamos todos los días. Desde redes sociales hasta plataformas de streaming y sistemas de e-commerce, todo está conectado por las habilidades que podés dominar hoy. ¿El resultado? Podés trabajar desde cualquier lugar del mundo y para cualquier lugar del mundo. Con un dispositivo y conexión a internet, tus posibilidades se vuelven infinitas.
  En SRV, creemos que aprender backend no es solo adquirir una habilidad técnica, es ganar libertad. Libertad para construir tu futuro, para diseñar tu vida en tus propios términos, y para generar ingresos desde cualquier rincón del planeta. Estas habilidades no solo te dan herramientas para trabajar, te permiten elegir cómo y dónde hacerlo.
  ¿Cómo se aplica esto en la vida real? Podés trabajar con empresas globales sin salir de tu casa, ofrecer tus servicios freelance mientras viajás, o incluso crear tus propios proyectos que impacten a miles. Las posibilidades son reales, las oportunidades están ahí, y vos tenés el potencial para tomarlas.
  Nuestro curso de Backend está diseñado para que puedas aprender a tu ritmo, desde cualquier lugar, con acceso permanente a contenidos que te guían paso a paso, incluso si nunca antes programaste. Esto no es solo un curso, es una inversión en vos, en tu futuro, y en todo lo que querés construir.
  ¿Estás listo para dar el salto? Hoy puede ser el día en que todo cambie. Empezá a aprender Backend y uní tus habilidades con tus sueños. Porque en SRV, no solo aprendés, ¡te convertís en el creador de tu futuro!
  Comenzá ahora y liberá tu potencial. Hacé clic aquí y descubrí todo lo que podés lograr.
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
