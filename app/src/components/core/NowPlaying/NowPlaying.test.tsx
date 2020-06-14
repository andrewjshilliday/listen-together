import React from 'react';
import { StaticRouter } from 'react-router-dom';
import renderer from 'react-test-renderer';
import NowPlaying from './NowPlaying';

jest.mock('../../../services/MusicKit');
jest.mock('../../providers/MusicKitProvider', () => require('../../../__mocks__/providers/MusicKitProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(
    <StaticRouter location=".">
      <NowPlaying />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});