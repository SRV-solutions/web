
import styles from './style.module.css'

const FeatureBadge = ({ text, color }) => {
  return (
    <div className={styles.feature_badge}>
      <p className={styles.badge_description} style={{textShadow: `${color} 1px 0 10px`}}>{text}</p>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <div className={styles.features_container}>
      <FeatureBadge color={"red"} text="IDEAL PARA PRINCIPIANTES" />
      <FeatureBadge color={"blue"} text="PROYECTOS PRÁCTICOS INCLUIDOS" />
      <FeatureBadge color={"green"} text="CERTIFICADO AL FINALIZAR" />
    </div>
  );
};

export default FeaturesSection;