import { ExamplePage, getStaticPropsFactory } from 'components/Example';
import Example from 'examples/Mutation';

export default function Required({ code }) {
  return <ExamplePage title="Mutation" Example={Example} code={code} />
}

export const getStaticProps = getStaticPropsFactory('Mutation');
