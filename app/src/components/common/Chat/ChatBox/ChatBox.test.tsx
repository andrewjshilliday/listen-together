import React from 'react';
import renderer from 'react-test-renderer';
import ChatBox from './ChatBox';

jest.mock('../../../providers/ChatProvider', () => require('../../../../__mocks__/providers/ChatProvider.mock').default);
jest.mock('../../../providers/RoomProvider', () => require('../../../../__mocks__/providers/RoomProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(<ChatBox />).toJSON();
  expect(tree).toMatchSnapshot();
});
