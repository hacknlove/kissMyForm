/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import useKMF from 'kissmyform';
import styles from '../styles/Home.module.css';

export default function Basic() {
  const { inputControl, handleSubmit } = useKMF();
  const [submited, setSubmiter] = useState();

  return (
    <div className={styles.container}>
      <main className={styles.main}>

        <div className={styles.card}>
          <h3>Form:</h3>
          <form onSubmit={handleSubmit(setSubmiter)}>
            <input {...inputControl('username')} />
            <input {...inputControl('password')} type="password" />
            <button> Login </button>
          </form>
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
      </main>
    </div>
  );
}
