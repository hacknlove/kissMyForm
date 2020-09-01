import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>kissmyform examples and tests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <a href="https://github.com/hacknlove/kissMyForm">KissMyForm</a>
          {' '}
          examples and tests
        </h1>

        <div className={styles.grid}>
          <Link href="/basic">
            <a className={styles.card}>
              <h3>Basic example &darr;</h3>
              <p>Just update the form state, and call the submit handler</p>
            </a>
          </Link>

          <Link href="/required">
            <a className={styles.card}>
              <h3>Required example &darr;</h3>
              <p>Fields are required</p>
            </a>
          </Link>

          <Link href="/mutation">
            <a className={styles.card}>
              <h3>Mutation example &darr;</h3>
              <p>Values are mutated</p>
            </a>
          </Link>

          <a href="https://github.com/hacknlove/kissMyForm/issues" className={styles.card}>
            <h3>More comming soon &rarr;</h3>
            <p>
              Ask any example you would love to have, in github issues
            </p>
          </a>
        </div>
      </main>
    </div>
  );
}
