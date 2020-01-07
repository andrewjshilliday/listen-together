import React, { useState, useEffect } from 'react';
import { MKSearch } from '../../services/MusicKitApi';
import { MediaItemCardCarousel } from '../../components/common';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Search.scss';

const Search: React.FC = (props: any) => {
  const [searchResults, setSearchResults] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const searchQuery = props.match.params.query;

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      setSearchResults(await MKSearch(searchQuery, undefined, 10));
      setLoading(false);
    };
    getSearchResults();
  }, [searchQuery]);

  if (loading) return (<div className="loading"><CircularProgress /></div>);

  return (
    <div className="search view">
      <h1>Search - {searchQuery}</h1>
      {searchResults.playlists && <>
        <h2>Artists</h2>
        <MediaItemCardCarousel items={searchResults.artists.data}></MediaItemCardCarousel>
      </>}
      {searchResults.albums && <>
        <h2>Albums</h2>
        <MediaItemCardCarousel items={searchResults.albums.data}></MediaItemCardCarousel>
      </>}
      {searchResults.playlists && <>
        <h2>Playlists</h2>
        <MediaItemCardCarousel items={searchResults.playlists.data}></MediaItemCardCarousel>
      </>}
    </div>
  );
}

export default Search;
