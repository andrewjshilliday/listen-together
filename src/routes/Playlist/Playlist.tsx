import React, { useState, useEffect, createRef } from 'react';
import { MKPlaylist } from '../../services/MusicKitApi';
import { FormatArtwork } from '../../services/MusicKit';
import { TrackList } from '../../components/common';
import CircularProgress from '@material-ui/core/CircularProgress';
import './Playlist.scss';

const Playlist: React.FC = (props: any) => {
  const [playlist, setPlaylist] = useState({} as any);
  const [loading, setLoading] = useState(true);
  const id = props.match.params.id;
  const notesRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const getPlaylist = async () => {
      setLoading(true);
      setPlaylist(await MKPlaylist(id));
      setLoading(false);
    };
    getPlaylist();
  }, [id]);

  useEffect(() => {
    setEditorialNotesStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notesRef]);

  window.onresize = () => {
    setEditorialNotesStyle();
  };
  
  const setEditorialNotesStyle = () => {
    if (!playlist.attributes || !playlist.attributes.editorialNotes) {
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
    <div className="playlist view">
      <div className="sidebar sticky">
        <img src={FormatArtwork(playlist.attributes.artwork, 500)} className="img-fluid rounded" alt={playlist.attributes.name} />
        {
          playlist.attributes.editorialNotes &&
          <>
            <hr />
            <div ref={notesRef} className="editorial-notes">
            {
              playlist.attributes.editorialNotes.standard ?
              <span dangerouslySetInnerHTML={{ __html: `${playlist.attributes.editorialNotes.standard}` }}></span> :
              <span dangerouslySetInnerHTML={{ __html: `${playlist.attributes.editorialNotes.short}`}}></span>
            }
            </div>
          </>
        }
      </div>
      <div className="track-list-container">
        <div className="track-list-header">
          <h1 className="text-truncate">{playlist.attributes.name}</h1>
          <h2 className="text-truncate">{playlist.attributes.artistName} {playlist.attributes.curatorName} | {playlist.attributes.lastModified}</h2>
        </div>
        <TrackList tracks={playlist.relationships.tracks.data} displayArtwork={false}></TrackList>
      </div>
    </div>
  );
}

export default Playlist;
