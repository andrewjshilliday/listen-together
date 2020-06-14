import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Playlist from './Playlist';

jest.mock('../../services/MusicKit');
jest.mock('../../services/MusicKitApi', () => ({
  MusicKitApiService: require('../../__mocks__/services/MusicKitApi/MusicKitApi.mock').default
}));

jest.useFakeTimers();

it('renders correctly', async () => {  
  const tree = renderer.create(
    <MemoryRouter initialEntries={[ '/playlist/pl.a5ef67f3dde74a568e583ac9f0406d50' ]}>
      <Route path="/playlist/:id" component={Playlist} />
    </MemoryRouter>);

  jest.runTimersToTime(1);

  await act(async () => {
    await Promise.resolve();
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
