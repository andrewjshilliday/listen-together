import React from 'react';
import renderer from 'react-test-renderer';
import ChatInput from './ChatInput';

jest.mock('../../../providers/ChatProvider', () => require('../../../../__mocks__/providers/ChatProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(<ChatInput />).toJSON();
  expect(tree).toMatchSnapshot();
});
