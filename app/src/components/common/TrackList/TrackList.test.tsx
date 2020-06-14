import React from 'react';
import renderer from 'react-test-renderer';
import TrackList from './TrackList';

jest.mock('../../../services/MusicKit');
jest.mock('../../providers/RoomProvider', () => require('../../../__mocks__/providers/RoomProvider.mock').default);

it('renders correctly', () => {
  const tree = renderer.create(<TrackList tracks={require('../../../__mocks__/objects/Tracks.mock').default} />).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders correctly with artwork, artist and album', () => {
  const tree = renderer.create(<TrackList tracks={require('../../../__mocks__/objects/Tracks.mock').default} showArtwork={true} showArtist={true} showAlbum={true} />).toJSON();
  expect(tree).toMatchSnapshot();
});
