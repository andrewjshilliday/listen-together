import React from 'react';
import renderer from 'react-test-renderer';
import OnlineUsers from './OnlineUsers';

jest.mock('../../../providers/RoomProvider', () => require('../../../../__mocks__/providers/RoomProvider.mock').default);

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
