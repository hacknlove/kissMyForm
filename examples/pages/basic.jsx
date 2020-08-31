import { ExamplePage, getStaticPropsFactory } from 'components/Example';
import Example from 'examples/Basic';

export default function Required({ code }) {
  return <ExamplePage title="Basic Example" Example={Example} code={code} />;
}

export const getStaticProps = getStaticPropsFactory('Basic');
