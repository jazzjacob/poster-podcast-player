import Link from "next/link";
import styles from './Footer.module.css';

const Footer = () => {

  return (
    <footer className={styles.container}>
      <p className={styles.text}>Poster Podcast Player - Made by Jacob&nbsp;Reinikainen&nbsp;Lindström</p>
      <Link className={[styles.text, styles.link].join(' ')} href='/admin'>Admin</Link >
      {/* Add your footer content here */}
    </footer >
  );
};

export default Footer;
