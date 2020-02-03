import React, { useState, useEffect } from 'react';
import { MusicKitApiService } from '../../services';
import { Loading, MediaItemCardCarousel } from '../../components/common';
import styled from 'styled-components';

const Search: React.FC = (props: any) => {
  const searchQuery = props.match.params.query;
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState({} as MusicKit.Resource);
  const [artists, setArtists] = useState([] as MusicKit.MediaItem[]);
  const [albums, setAlbums] = useState([] as MusicKit.MediaItem[]);
  const [playlists, setPlaylists] = useState([] as MusicKit.MediaItem[]);

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      setSearchResults(await MusicKitApiService.Search(searchQuery, undefined, 10));
      setLoading(false);
    };
    getSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    console.log(searchResults);
    const getArtistRelationships = () => {
      if (!searchResults.artists) { return }
      setArtists(searchResults.artists.data);
    }
    const getAlbumRelationships = async () => {
      if (!searchResults.albums) { return }
      setAlbums(searchResults.albums.data);
      setAlbums(await MusicKitApiService.GetRelationships(searchResults.albums.data, 'albums'));
    }
    const getPlaylistRelationships = async () => {
      if (!searchResults.playlists) { return; }
      setPlaylists(searchResults.playlists.data);
      setPlaylists(await MusicKitApiService.GetRelationships(searchResults.playlists.data, 'playlists'));
    }
    getArtistRelationships();
    getAlbumRelationships();
    getPlaylistRelationships();
  }, [searchResults]);

  if (loading) return (<Loading />);

  return (
    <SearchContainer>
      <h1>Search - {searchQuery}</h1>
      {artists.length !== 0 && <MediaItemCardCarousel items={artists} title='Artists'></MediaItemCardCarousel>}
      {albums.length !== 0 && <MediaItemCardCarousel items={albums} title='Albums'></MediaItemCardCarousel>}
      {playlists.length !== 0 && <MediaItemCardCarousel items={playlists} title='Playlists'></MediaItemCardCarousel>}
    </SearchContainer>
  );
}

export default Search;


const SearchContainer = styled.div``;
