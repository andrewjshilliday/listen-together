import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Home from './Home';

jest.mock('../../components/providers/AuthorizationProvider', () => require('../../__mocks__/providers/AuthorizationProvider.mock').default);
jest.mock('../../components/providers/RoomProvider', () => require('../../__mocks__/providers/RoomProvider.mock').notLoggedIn);

jest.useFakeTimers();

beforeAll(() => {
  jest.resetModules();
})

it('renders correctly', async () => {
  const tree = renderer.create(
    <MemoryRouter initialEntries={[ '/home' ]}>
      <Route path="/home" component={Home} />
    </MemoryRouter>);

  jest.runTimersToTime(1);

  await act(async () => {
    await Promise.resolve();
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
