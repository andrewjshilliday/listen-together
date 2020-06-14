import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Album from './Album';

jest.mock('../../services/MusicKit');
jest.mock('../../services/MusicKitApi', () => ({
  MusicKitApiService: require('../../__mocks__/services/MusicKitApi/MusicKitApi.mock').default
}));
jest.mock('../../services/ListenTogetherApi', () => ({
  ListenTogetherApiService: require('../../__mocks__/services/ListenTogetherApi/ListenTogetherApi.mock').default
}));

jest.useFakeTimers();

it('renders correctly', async () => {  
  const tree = renderer.create(
    <MemoryRouter initialEntries={[ '/album/1447538299' ]}>
      <Route path="/album/:id" component={Album} />
    </MemoryRouter>);

  jest.runTimersToTime(1);

  await act(async () => {
    await Promise.resolve();
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
