import AlbumsResponse from './responses/AlbumsResponse';
import ArtistResponse from './responses/ArtistResponse';
import ArtistsResponse from './responses/ArtistsResponse';
import PlaylistResponse from './responses/PlaylistResponse';
import SongsResponse from './responses/SongsResponse';
import SearchResponse from './responses/SearchResponse';
import { AlbumRelationshipResponse, PlaylistRelationshipResponse } from './responses/RelationshipResponses';

const MusicKitApiService = {
  Album: jest.fn(() => Promise.resolve(AlbumsResponse[0])),
  Albums: jest.fn(() => Promise.resolve(AlbumsResponse)),
  Artist: jest.fn(() => Promise.resolve(ArtistResponse)),
  Artists: jest.fn(() => Promise.resolve(ArtistsResponse)),
  Playlist: jest.fn(() => Promise.resolve(PlaylistResponse)),
  Songs: jest.fn(() => Promise.resolve(SongsResponse)),
  Search: jest.fn(() => Promise.resolve(SearchResponse)),
  GetRelationships: jest.fn((_, type: string) => {
    switch (type) {
      case 'albums': return Promise.resolve(AlbumRelationshipResponse);
      case 'playlists': return Promise.resolve(PlaylistRelationshipResponse);
      case 'songs': return Promise.resolve(null);
    }
  })
}

export default MusicKitApiService;
