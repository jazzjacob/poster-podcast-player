import React from 'react';
import Link from 'next/link';
import styles from './Breadcrumbs.module.css';

function Breadcrumbs({ list }: { list: {name: string, url: string}[] }) {
  return (
    <nav>
      <ul className={styles.listContainer}>
        {list.map((listItem, index) => (
          <React.Fragment key={`${listItem.url}-${index}`}>
            {index !== list.length - 1 ? (
              <li className={styles.listItem}>
                <Link className={styles.link} href={listItem.url}>{listItem.name}</Link>
                <span className={styles.listSeparator}>/</span>
              </li>
            ) : (
              <li
                className={[styles.listItem, styles.currentPage].join(' ')}
                style={{ color: list.length > 1 ? 'black' : undefined }}
              >{listItem.name}</li>
            )}
          </React.Fragment>
        ))}
      </ul >
    </nav>
  );
}

export default Breadcrumbs;
