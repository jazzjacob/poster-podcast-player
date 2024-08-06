import styles from './Hero.module.css';

function Hero() {
  return (
    <section className={styles.container}>
      <img className={styles.photo} alt="" src='images/hero-2.jpg' />
      <h1 className={styles.mainHeading}>Podcasts with images</h1 >
      <p className={styles.subHeading}>Simple as that.</p >
    </section >
  );
}

export default Hero;
