import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Room from './Room';

jest.mock('../../components/providers/RoomProvider', () => require('../../__mocks__/providers/RoomProvider.mock').default);
jest.mock('../../components/providers/ChatProvider', () => require('../../__mocks__/providers/ChatProvider.mock').default);

jest.useFakeTimers();

beforeAll(() => {
  jest.resetModules();
})

it('renders correctly', async () => {
  const tree = renderer.create(
    <MemoryRouter initialEntries={[ '/room/TEST1' ]}>
      <Route path="/room/:id" component={Room} />
    </MemoryRouter>);

  jest.runTimersToTime(1);

  await act(async () => {
    await Promise.resolve();
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
