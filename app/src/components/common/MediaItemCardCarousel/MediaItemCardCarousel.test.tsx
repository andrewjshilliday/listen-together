import React from 'react';
import { StaticRouter } from 'react-router'
import renderer from 'react-test-renderer';
import MediaItemCardCarousel from './MediaItemCardCarousel';

jest.mock('../../../services/MusicKit');

it('renders correctly', () => {
  const tree = renderer.create(
    <StaticRouter location=".">
      <MediaItemCardCarousel items={require('../../../__mocks__/objects/Albums.mock').default} />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});
