/* eslint-disable react/prop-types */
import useKMF from '../kissMyForm';

export default function BasicExample({ onSubmit }) {
  const { inputControl, handleSubmit } = useKMF();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...inputControl('username')} />
      <input {...inputControl('password')} type="password" />
      <button> Login </button>
    </form>
  );
}
