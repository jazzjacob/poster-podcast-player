import Link from "next/link";
import styles from './Navbar.module.css';

const Navbar = () => {

  return (
    <nav className={styles.container}>
      <Link className={styles.title} href="/">Poster Podcast Player</Link  >
      <Link className={styles.link} href='/about'>About</Link>
      {/* Add your navigation links here */}
    </nav >
  );
};

export default Navbar;
