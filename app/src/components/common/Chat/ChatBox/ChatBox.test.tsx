import React from 'react';
import renderer from 'react-test-renderer';
import ChatBox from './ChatBox';

jest.mock('../../../providers/ChatProvider', () => ({
  useChat: () => ({
    messages: []
  })
}));

jest.mock('../../../providers/RoomProvider', () => ({
  useRoom: () => ({
    users: []
  })
}));

it('renders correctly', () => {
  const tree = renderer.create(<ChatBox />).toJSON();
  expect(tree).toMatchSnapshot();
});
