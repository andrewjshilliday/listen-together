import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import renderer, { act } from 'react-test-renderer';
import Search from './Search';

jest.mock('../../services/MusicKit');
jest.mock('../../services/MusicKitApi', () => ({
  MusicKitApiService: require('../../__mocks__/services/MusicKitApi/MusicKitApi.mock').default
}));

jest.useFakeTimers();

it('renders correctly', async () => {  
  const tree = renderer.create(
    <MemoryRouter initialEntries={[ '/search/gary%20clark%20jr' ]}>
      <Route path="/search/:query" component={Search} />
    </MemoryRouter>);

  jest.runTimersToTime(1);

  await act(async () => {
    await Promise.resolve();
  });

  expect(tree.toJSON()).toMatchSnapshot();
});
