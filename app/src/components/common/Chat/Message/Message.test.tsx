import React from 'react';
import renderer from 'react-test-renderer';
import Message from './Message';

it('renders correctly', () => {
  const tree = renderer.create(<Message message='test' name='test' />).toJSON();
  expect(tree).toMatchSnapshot();
});
