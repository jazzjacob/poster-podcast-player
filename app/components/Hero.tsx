import { fetchHeroImage } from '../firebase/firestoreOperations';
import styles from './Hero.module.css';

async function Hero() {
  const heroImage = await fetchHeroImage();

  return (
    <section className={styles.container}>
      <img className={styles.photo} alt="" src={heroImage || ""} />
      <h1 className={styles.mainHeading}>Podcasts with images</h1 >
      <p className={styles.subHeading}>Simple as that.</p >
    </section >
  );
}

export default Hero;
