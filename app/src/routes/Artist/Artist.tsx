import React, { useState, useEffect } from 'react';
import { MKArtist } from '../../services/MusicKitApi';
/* import { MediaItemCardCarousel } from '../../components/common'; */
import CircularProgress from '@material-ui/core/CircularProgress';
import './Artist.scss';

const Artist: React.FC = (props: any) => {
  const [artist, setArtist] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const id = props.match.params.id;

  useEffect(() => {
    const getSearchResults = async () => {
      setLoading(true);
      setArtist(await MKArtist(id, 'relationships'));
      setLoading(false);
      const asd = await MKArtist(id);
      console.log(asd);
    };
    getSearchResults();
  }, [id]);

  if (loading) return (<div className="loading"><CircularProgress /></div>);
  
  return (
    <div className="artist view">
      <h1 className="text-truncate">{artist.attributes.name}</h1>
      {/* {
        artist.relationships && artist.relationships.albums &&
        <>
          <h2>Albums</h2>
          <MediaItemCardCarousel items={artist.relationships.albums.data}></MediaItemCardCarousel>
        </>
      } */}
    </div>
  );
}

export default Artist;
