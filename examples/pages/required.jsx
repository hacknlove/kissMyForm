import { ExamplePage, getStaticPropsFactory } from 'components/Example';
import Example from 'examples/Required';

export default function Required({ code }) {
  return <ExamplePage title="Validation: required" Example={Example} code={code} />
}

export const getStaticProps = getStaticPropsFactory('Required');
