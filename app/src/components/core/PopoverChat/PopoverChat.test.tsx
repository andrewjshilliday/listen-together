import React from 'react';
import renderer from 'react-test-renderer';
import PopoverChat from './PopoverChat';

jest.mock('../../providers/ChatProvider', () => require('../../../__mocks__/providers/ChatProvider.mock').default);
jest.mock('../../providers/RoomProvider', () => require('../../../__mocks__/providers/RoomProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(<PopoverChat />).toJSON();
  expect(tree).toMatchSnapshot();
});
