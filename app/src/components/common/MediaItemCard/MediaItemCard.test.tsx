import React from 'react';
import { StaticRouter } from 'react-router'
import renderer from 'react-test-renderer';
import MediaItemCard from './MediaItemCard';

jest.mock('../../../services/MusicKit');

it('renders correctly', () => {  
  const tree = renderer.create(
    <StaticRouter location=".">
      <MediaItemCard item={MediaItem} />
    </StaticRouter>).toJSON();
  expect(tree).toMatchSnapshot();
});

const MediaItem = {
  "id": "1447538299",
  "type": "albums",
  "attributes": {
    "artwork": {
      "url": "https://is3-ssl.mzstatic.com/image/thumb/Music124/v4/49/b1/57/49b15771-38c4-e54f-0971-3719826b9417/093624902263.jpg/{w}x{h}bb.jpeg",
    },
    "artistName": "Gary Clark Jr.",
    "name": "This Land",
  },
  "relationships": {
    "artists": {
      "data": [{ "id": "266463936", }]
    }
  }
} as MusicKit.MediaItem
