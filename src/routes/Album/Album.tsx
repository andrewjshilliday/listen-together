import React, { useState, useEffect, createRef } from 'react';
import { MKAlbum } from '../../services/MusicKitApi';
import { FormatArtwork } from '../../services/MusicKit';
import { TrackList } from '../../components/common';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Album.scss';

const Album: React.FC = (props: any) => {
  const [album, setAlbum] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const id = props.match.params.id;
  const notesRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const getAlbum = async () => {
      setLoading(true);
      setAlbum(await MKAlbum(id));
      setLoading(false);
    };
    getAlbum();
  }, [id]);

  useEffect(() => {
    setEditorialNotesStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesRef]);

  window.onresize = () => {
    setEditorialNotesStyle();
  };
  
  const setEditorialNotesStyle = () => {
    if (!album.attributes || !album.attributes.editorialNotes) {
      return;
    }

    if (notesRef.current) {
      const height = window.innerHeight;
      const notesOffsetTop = notesRef.current.getBoundingClientRect().top;
      notesRef.current.style.maxHeight = `${height - notesOffsetTop - 110}px`;
    }
  };

  if (loading) return (<div className="loading"><CircularProgress /></div>);
  
  return (
    <div className="album view">
      <div className="sidebar sticky">
        <img src={FormatArtwork(album.attributes.artwork, 500)} className="img-fluid rounded" alt={album.attributes.name} />
        {
          album.attributes.editorialNotes &&
          <>
            <hr />
            <div ref={notesRef} className="editorial-notes">
            {
              album.attributes.editorialNotes.standard ?
              <span dangerouslySetInnerHTML={{ __html: `${album.attributes.editorialNotes.standard}` }}></span> :
              <span dangerouslySetInnerHTML={{ __html: `${album.attributes.editorialNotes.short}`}}></span>
            }
            </div>
          </>
        }
      </div>
      <div className="track-list-container">
        <div className="track-list-header">
          <h1 className="text-truncate">{album.attributes.name}</h1>
          <h2 className="text-truncate">{album.attributes.artistName} {album.attributes.genreNames && (<>| {album.attributes.genreNames[0]}</>)}</h2>
        </div>
        <TrackList tracks={album.relationships.tracks.data} displayArtwork={false}></TrackList>
      </div>
    </div>
  );
}

export default Album;
