import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

function Breadcrumbs({ list }: { list: {name: string, url: string}[] }) {
  return (
    <nav>
      <ul className={styles.listContainer}>
        {list.map((listItem, index) => (
          <>
            {index !== list.length - 1 ? (
              <li key={`${listItem}-${index}`} className={styles.listItem}>
                <Link className={styles.link} href={listItem.url}>{listItem.name}</Link>
                <span className={styles.listSeparator}>/</span>
              </li>
            ) : (
              <li
                className={[styles.listItem, styles.currentPage].join(' ')}
                key={`${listItem}-${index}`}
                style={{ color: list.length > 1 ? 'black' : undefined }}
              >{listItem.name}</li>
            )}
          </>
        ))}
      </ul >
    </nav>
  );
}

export default Breadcrumbs;
