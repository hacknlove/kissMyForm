/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import Head from 'next/head';
import SyntaxHighlighter from 'react-syntax-highlighter';
import copy from 'copy-text-to-clipboard';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

export function ExamplePage({ code, Example, title }) {
  const [submited, setSubmiter] = useState();

  code = code.replace("import useKMF from '../kissMyForm';", "import useKMF from 'kissmyform';");

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <main className={styles.main}>

        <h1 className={styles.title}>
          {title} <Link href="/"><a>&larr;</a></Link>
        </h1>

        <div className={styles.card}>
          <h3>Form:</h3>
          <Example onSubmit={setSubmiter} />
        </div>
        {
          submited && (
          <div className={styles.card}>
            <h3>Submited:</h3>
            <code>
              <pre>{
                JSON.stringify(submited, null, 4)
              }</pre>
            </code>
          </div>
          )
        }
        <SyntaxHighlighter className={styles.code} language="javascript">{code}</SyntaxHighlighter>
        <button onClick={() => copy(code)}>Copy</button>
      </main>

    </div>
  );
}

export function getStaticPropsFactory(url) {
  return async function getStaticProps() {
    const request = await fetch(`https://raw.githubusercontent.com/hacknlove/kissMyForm/master/examples/examples/${url}.jsx`);
    const data = await request.text();
    return {
      props: { code: data },
    };
  };
}
