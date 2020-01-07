import React from 'react';
import { useRoom } from '../../providers';
import { FormatArtwork } from '../../../services/MusicKit';
import './TrackList.scss';

interface TrackListProps {
  tracks: any,
  displayArtwork: boolean
}

const TrackList: React.FC<TrackListProps> = ({ tracks, displayArtwork }) => {
  const roomProvider = useRoom();

  const addToPlaylist = (track: any) => {
    roomProvider.addToPlaylist(track);
  };

  return (
    <div className="track-list">
      {tracks.map((track: any) => (
        <div key={track.id} className="track">
          <div className="track-option" onClick={() => addToPlaylist(track)}><i className="fas fa-plus"></i></div>
          {displayArtwork && <img src={FormatArtwork(track.attributes.artwork, 44)} className="img-fluid rounded" alt={track.attributes.name} />}
          <p>{track.attributes.name}</p>
        </div>
      ))}
    </div>
  );
}

export default TrackList;
