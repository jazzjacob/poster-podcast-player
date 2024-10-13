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
            Poster Podcast Player is an online podcast player that can display images in sync with the audio.
            It is still early in development and is a project made just for fun.
          </p>
          <p style={{ paddingTop: '0.4rem' }}>
            Check out the <Link className={styles.inlineLink} href='/podcasts/952408535/episodes/2fada1d3-65be-4332-a49b-1966a954921f'><b>first episode with synced images</b></Link>!
          </p>

          <h2 className={styles.h2}>Latest Release – October 13, 2024</h2>
          <article>
            {/*<p style={{color: 'gray', fontSize: '0.8rem', marginTop: '0.3rem'}}><i>2024-10-13</i></p>*/}
            <p>
            You can now search for and play any podcast available on Apple Podcasts using the Poster Podcast Player.
            It is still far from a perfect podcast player, but this is a good step forward!
            Next, I plan to focus on developing a feature to easily add and sync images with <i>any</i> episode.
            </p>
          </article>

          <h2 className={styles.h2}>Credits</h2>
          <div className={styles.creditsContainer}>
            <p>This is a project by <Link className={styles.inlineLink} href='https://read.cv/jacoblindstrom'>Jacob Reinikainen Lindström</Link>.</p>
            <p>Take a look at the source code on <Link className={styles.inlineLink} href='https://github.com/jazzjacob/poster-podcast-player'>Github</Link>.</p>
            <p>Typeface: <Link className={styles.inlineLink} href='https://www.fontshare.com/fonts/satoshi'>Satoshi</Link> by Indian Type Foundry.</p>
            <p>Home page photograph by <Link className={styles.inlineLink} href='https://unsplash.com/@diogo_ferrer'>Expanlog</Link>.</p>
            <p>About page photograph by <Link className={styles.inlineLink} href='https://unsplash.com/@marynanick'>Maryna Nikolaieva</Link>.</p>
            <p className={styles.madeInSwedenText}>Made in Stockholm, Sweden</p>
          </div >
          <p className={styles.updated}>Updated: 2024-10-13</p>
        </section>
      </div>
    </>
  );
};
