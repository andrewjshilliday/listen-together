import React from 'react';
import { StaticRouter } from 'react-router'
import renderer from 'react-test-renderer';
import MediaItemCard from './MediaItemCard';

jest.mock('../../../services/MusicKit');

it('renders correctly', () => {
  const tree = renderer.create(
    <StaticRouter location=".">
      <MediaItemCard item={require('../../../__mocks__/objects/Album.mock').default} />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});
