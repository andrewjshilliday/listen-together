import React from 'react';
import renderer from 'react-test-renderer';
import ChatInput from './ChatInput';

jest.mock('../../../providers/ChatProvider', () => ({
  useChat: () => ({
    messages: [],
    actions: {
      sendMessage: jest.fn()
    }
  })
}));

it('renders correctly', () => {
  const tree = renderer.create(<ChatInput />).toJSON();
  expect(tree).toMatchSnapshot();
});
