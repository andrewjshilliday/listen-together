import React from 'react';
import renderer from 'react-test-renderer';
import OnlineUsers from './OnlineUsers';
import { useRoom } from '../../../providers'

jest.mock('../../../providers/RoomProvider', () => ({
  useRoom: () => ({
    users: ['user1', 'user2'].map((user, index) => ({ name: user, id: index.toString(), color: '#cfcfcf' }))
  })
}));

it('renders correctly', () => {
  const tree = renderer.create(<OnlineUsers />).toJSON();
  expect(tree).toMatchSnapshot();
});



/* import React from 'react';
import renderer from 'react-test-renderer';
import OnlineUsers from './OnlineUsers';

const spyReturns = (returnValue: any) => jest.fn(() => returnValue);

describe('scenario', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  const setup = (users: string[] = [], mockOverrides?: any) => {
    const mockedRoomProvider = {
      useRoom: () => ({
        users: users.map((user, index) => ({ name: user, id: index, color: '#cfcfcf' })),
        // b: spyReturns(true),
        ...mockOverrides
      })
    }
    return {
      mockedModule: jest.doMock('../../../providers/RoomProvider', () => mockedRoomProvider)
    }
  }

  it('renders correctly', () => {
    const { mockedModule } = setup();
    const tree = renderer.create(<OnlineUsers />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with multiple users', () => {
    const { mockedModule } = setup(['user1', 'user2']);
    const tree = renderer.create(<OnlineUsers />).toJSON();
    expect(tree).toMatchSnapshot();
  });
}); */
