import useKMF from 'kissmyform';
import styles from '../styles/Home.module.css';

function phoneFormating(number) {
  number = number.replace(/[^0-9]/g, '');

  const part = number.match(/(.{0,3})(.{0,3})(.{0,4})/);

  if (part[3]) {
    return `(${part[1]})-${part[2]}-${part[3]}`;
  }

  if (part[2]) {
    return `(${part[1]})-${part[2]}`;
  }

  if (part[1]) {
    return `(${part[1]}`;
  }

  return '';
}

function beforeChange({
  name, value, values,
}) {
  switch (name) {
    case 'email':
      values.email = value.toLowerCase().replace(/[^a-z0-9.@]/g, '');
      break;
    case 'phone':
      values.phone = phoneFormating(value);
      break;
  }
}

export default function RequiredExample({ onSubmit }) {
  const { inputControl, handleSubmit } = useKMF({ beforeChange });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.field}>
        <label>Email:</label><br />
        <input placeholder="Email" {...inputControl('email')} />
      </div>
      <div className={styles.field}>
        <label>Phone:</label><br />
        <input placeholder="Phone" {...inputControl('phone')} />
      </div>
      <button> submit </button>
    </form>
  );
}
