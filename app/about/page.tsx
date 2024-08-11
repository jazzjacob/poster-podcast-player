import Link from "next/link";
import AboutPageHero from "../components/AboutPageHero";
import Breadcrumbs from "../components/Breadcrumbs";
import styles from './page.module.css';

export default function Page() {

  return (
    <>
      <AboutPageHero />
      <div className={styles.aboutContainer}>
        <Breadcrumbs list={[{ name: 'Home', url: '/' }, { name: 'About', url: '' } ]} />
        <section>
          <h1 className={styles.pageHeading}>Poster Podcast Player</h1>
          <p>
            Poster Podcast Player is an online podcast player that also displays images in sync with the audio.
            This is the first version of the website.
            Hopefully more functionality, more podcasts and episodes will be added in the future.
          </p>
          <h2 className={styles.h2}>Credits</h2>
          <div className={styles.creditsContainer}>
            <p>This is a project by <Link className={styles.inlineLink} href='https://read.cv/jacoblindstrom'>Jacob Reinikainen Lindström</Link>.</p>
            <p>Take a look at the source code on <Link className={styles.inlineLink} href='https://github.com/jazzjacob/poster-podcast-player'>Github</Link>.</p>
            <p>Typeface: <Link className={styles.inlineLink} href='https://www.fontshare.com/fonts/satoshi'>Satoshi</Link> by Indian Type Foundry.</p>
            <p>Home page photograph by <Link className={styles.inlineLink} href='https://unsplash.com/@diogo_ferrer'>Expanlog</Link>.</p>
            <p>About page photograph by <Link className={styles.inlineLink} href='https://unsplash.com/@marynanick'>Maryna Nikolaieva</Link>.</p>
            <p className={styles.madeInSwedenText}>Made in Stockholm, Sweden</p>
          </div >
          <p className={styles.updated}>Updated: 2024-08-11</p>
        </section>
      </div>
    </>
  );
};
