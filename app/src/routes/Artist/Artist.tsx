import React, { useState, useEffect } from 'react';
import { MusicKitApiService } from '../../services';
import { Loading, MediaItemCardCarousel } from '../../components/common';
import styled from 'styled-components';

const Artist: React.FC = (props: any) => {
  const id = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [artist, setArtist] = useState({} as MusicKit.MediaItem);
  const [albums, setAlbums] = useState([] as MusicKit.MediaItem[]);
  const [playlists, setPlaylists] = useState([] as MusicKit.MediaItem[]);

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      setArtist(await MusicKitApiService.Artist(id, 'albums,playlists'));
      setLoading(false);
    };
    getSearchResults();
  }, [id]);

  useEffect(() => {
    const getAlbumRelationships = async () => {
      if (artist.relationships && artist.relationships.albums) {
        setAlbums(artist.relationships.albums.data);
        /* setAlbums(await MusicKitApiService.Albums(artist.relationships.albums.data.map((i: MusicKit.MediauItem) => i.id))); */
      }
    };
    const getPlaylistRelationships = async () => {
      if (artist.relationships && artist.relationships.playlists) {
        setPlaylists(artist.relationships.playlists.data);
        /* setPlaylists(await MusicKitApiService.Playlists(artist.relationships.playlists.data.map((i: MusicKit.MediaItem) => i.id))); */
      }
    };
    getAlbumRelationships();
    getPlaylistRelationships();
  }, [artist]);

  if (loading) return (<Loading />);
  return (
    <ArtistContainer>
      <h1 className="text-truncate">{artist.attributes.name}</h1>
      {
        albums.length > 0 &&
        <>
          <h2>Albums</h2>
          <MediaItemCardCarousel items={albums}></MediaItemCardCarousel>
        </>
      }
      {
        playlists.length > 0 &&
        <>
          <h2>Playlists</h2>
          <MediaItemCardCarousel items={playlists}></MediaItemCardCarousel>
        </>
      }
    </ArtistContainer>
  );
}

export default Artist;


const ArtistContainer = styled.div``;
